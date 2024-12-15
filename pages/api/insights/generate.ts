// pages/api/insights/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { OpenAI } from 'openai';

// Validate environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 || !process.env.OPENAI_API_KEY) {
  throw new Error('Required environment variables are not set.');
}

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const adminDb = getFirestore();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Insight Prompt Templates
const insightTypePrompts: Record<string, string> = {
  "Code References": `
Analyze the conversation below and provide a detailed list of applicable codes, standards, or regulations.  
Include their relevance to the context and suggest additional applicable standards if any. Use bullet points for clarity.`,
  "Recommended Actions": `
Based on the conversation, provide a list of actionable recommendations.  
For each, include priority (High/Medium/Low) and a brief explanation. Use the format:  
- **Action Item**: Title  
  - **Priority**: High/Medium/Low  
  - **Details**: Explanation and reasoning.`,
  "General Insights": `
Summarize the conversation focusing on:  
1. Key themes and recurring topics.  
2. Critical challenges or risks.  
3. Technical takeaways.  
4. Outstanding questions or gaps for follow-up.  
Organize insights under clear headers.`,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  const { threadId, insightType } = req.body;

  if (!threadId || typeof threadId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing threadId.' });
  }

  if (!insightType || typeof insightType !== 'string' || !insightTypePrompts[insightType]) {
    return res.status(400).json({ error: 'Invalid or missing insightType.' });
  }

  try {
    // Fetch thread details
    const threadRef = adminDb.doc(`threads/${threadId}`);
    const threadSnap = await threadRef.get();
    if (!threadSnap.exists) {
      return res.status(404).json({ error: 'Thread not found.' });
    }

    const threadData = threadSnap.data();
    const messages = threadData?.messages || [];

    // Format messages for OpenAI
    const conversationText = messages
      .map((m: any) => `${m.sender === 'ai' ? 'AI' : 'User'}: ${m.content}`)
      .join('\n\n');

    // Create OpenAI prompt
    const prompt = `
You are an expert in hydrogen safety and compliance.  
Analyze the following conversation and generate insights based on the request type.

---

**Conversation History**:
${conversationText}

---

**Insight Request**:  
${insightTypePrompts[insightType]}

Respond concisely and clearly in the requested format.
`;

    let insightContent: string;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert assistant in hydrogen safety and compliance insights.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 3000,
      });

      insightContent = response.choices[0]?.message?.content || 'No insights generated.';
    } catch (openAiError: any) {
      console.error('OpenAI API Error:', openAiError);
      return res.status(500).json({ error: 'Failed to generate insights from OpenAI.' });
    }

    // Save insights to Firestore
    const insightRef = adminDb.collection('insights').doc();
    await insightRef.set({
      threadId,
      title: insightType,
      content: insightContent,
      createdAt: new Date(),
    });

    // Return insights
    return res.status(200).json({
      message: 'Insights generated successfully.',
      content: insightContent,
    });
  } catch (error: any) {
    console.error('Insights Generation Error:', error);
    return res.status(500).json({ error: 'An error occurred while generating insights.' });
  }
}