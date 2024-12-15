// pages/api/reports/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { OpenAI } from 'openai';

// Validate required environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 || !process.env.OPENAI_API_KEY) {
  throw new Error('Required environment variables are not set.');
}

// Decode and initialize Firebase Admin SDK
const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const adminDb = getFirestore();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId, threadId, reportType, customPrompt } = req.body;

  // Validate required fields
  if (typeof projectId !== 'string' || typeof threadId !== 'string' || typeof reportType !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing or invalid projectId, threadId, or reportType' });
  }

  try {
    // ---------------------------------------------
    // Step 1: Fetch Project Data
    // ---------------------------------------------
    const projectRef = adminDb.doc(`projects/${projectId}`);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectData = projectSnap.data()!;
    const userId = projectData.ownerId || null;

    // ---------------------------------------------
    // Step 2: Fetch and Parse Thread Messages
    // ---------------------------------------------
    const threadRef = adminDb.doc(`threads/${threadId}`);
    const threadSnap = await threadRef.get();

    if (!threadSnap.exists) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const threadData = threadSnap.data()!;
    const messages = threadData.messages || [];

    // Convert messages into { role, content } format
    const allMessages: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map((m: any) => ({
      role: m.sender === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }));

    // Create a readable conversation text
    const conversationText = allMessages
      .map((m) => `${m.role === 'assistant' ? 'AI:' : 'User:'} ${m.content}`)
      .join('\n\n');

    // ---------------------------------------------
    // Step 3: Define Prompts Based on Report Type
    // ---------------------------------------------
    let prompt = '';
    let systemContent = '';

    switch (reportType) {
      case 'summary':
        systemContent = 'You are a professional technical report writer specializing in hydrogen engineering.';
        prompt = `
Write a **comprehensive summary report** for the following hydrogen project and its associated messages.

**Project Details**: ${JSON.stringify(projectData, null, 2)}  
**Thread Conversation**:  
${conversationText}

The summary must include:
1. Main topics discussed in the conversation.
2. Key technical findings or standards mentioned.
3. Important conclusions and actionable next steps.
4. A professional tone with structured sections.
`;
        break;

      case 'communication':
        systemContent = 'You are a professional communicator skilled at writing informal summaries for email sharing.';
        prompt = `
Write an **informal communication summary** of the project thread, highlighting:
1. Main research findings or discussion points.
2. Big questions or potential safety concerns.
3. Relevant standards or codes.
4. Recommended next steps.

**Project Details**: ${JSON.stringify(projectData, null, 2)}  
**Thread Conversation**:  
${conversationText}

Keep it professional but conversational, suitable for internal email communication.
`;
        break;

      case 'custom':
        if (typeof customPrompt !== 'string' || !customPrompt.trim()) {
          return res.status(400).json({ error: 'Custom prompt is required for custom reports.' });
        }
        systemContent = 'You are a versatile technical assistant skilled at generating customized reports.';
        prompt = `
Using the provided project details and conversation history, create a report tailored to the following custom request:
"${customPrompt}"

**Project Details**: ${JSON.stringify(projectData, null, 2)}  
**Thread Conversation**:  
${conversationText}

Ensure the report is professional, detailed, and tailored to the custom request.
`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid reportType. Use summary, communication, or custom.' });
    }

    // ---------------------------------------------
    // Step 4: Generate Report with OpenAI
    // ---------------------------------------------
    const reportResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 6000,
      frequency_penalty: 0.4,
      presence_penalty: 0.2,
    });

    const reportContent = reportResponse.choices[0]?.message?.content || 'No report content generated.';

    // ---------------------------------------------
    // Step 5: Save Report to Firestore
    // ---------------------------------------------
    const reportRef = adminDb.collection('reports').doc();
    await reportRef.set({
      projectId,
      userId,
      title: `Report - ${projectData.projectName || 'Project'} (${reportType})`,
      content: reportContent,
      type: reportType,
      createdAt: new Date(),
    });

    // ---------------------------------------------
    // Step 6: Return Report Content
    // ---------------------------------------------
    return res.status(200).json({
      message: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully.`,
      content: reportContent,
    });
  } catch (error: any) {
    console.error('Error generating report:', error.message);
    return res.status(500).json({ error: 'An internal error occurred while generating the report.' });
  }
}