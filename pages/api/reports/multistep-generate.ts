// pages/api/reports/multistep-generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { OpenAI } from 'openai';

// Validate environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set');
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

// Decode and parse the base64-encoded Firebase service account JSON
const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(jsonString);

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminDb = getFirestore();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId, threadId } = req.body;

  // Validate request body
  if (typeof projectId !== 'string' || typeof threadId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing or invalid projectId/threadId' });
  }

  try {
    // Fetch project data
    const projectRef = adminDb.doc(`projects/${projectId}`);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const projectData = projectSnap.data()!;
    const userId = projectData.ownerId || null;

    // Fetch thread data
    const threadRef = adminDb.doc(`threads/${threadId}`);
    const threadSnap = await threadRef.get();
    if (!threadSnap.exists) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const threadData = threadSnap.data()!;
    const messages = threadData.messages || [];

    // Convert messages to OpenAI-compatible conversation format
    const allMessages: Array<{ role: 'user' | 'assistant'; content: string }> =
      messages.map((m: any) => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));

    const conversationText = allMessages
      .map((m) => `${m.role === 'assistant' ? 'AI:' : 'User:'} ${m.content}`)
      .join('\n\n');

    // ---------------------------------------------
    // Step 1: Determine Relevant Sections
    // ---------------------------------------------
    const sectionPrompt = `
Based on the following project details and conversation, identify the most relevant sections to include in a detailed engineering report. For each section, provide a short description of its purpose and what content it should include. Exclude irrelevant sections.

**General Categories**:
1. Engineering Codes and Standards
2. Safety and Risk Assessment
3. Environmental Compliance and Permitting
4. Technical Process Analysis
5. Project Management Recommendations
6. References and Citations (all codes, standards, and regulations mentioned)
7. Other Relevant Topics (if applicable)

**Inputs**:
- Project Details: ${JSON.stringify(projectData, null, 2)}
- Thread Conversation:
${conversationText}

**Output Format**:
Provide a structured list of relevant sections with descriptions.
    `;

    const sectionResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional technical writer specializing in hydrogen engineering and safety.',
        },
        { role: 'user', content: sectionPrompt },
      ],
      temperature: 0.3,
      top_p: 0.85,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
      max_tokens: 2000,
    });

    const relevantSections = sectionResponse.choices[0]?.message?.content || '';
    console.log('Relevant Sections:', relevantSections);

    // ---------------------------------------------
    // Step 2: Draft a Detailed Report
    // ---------------------------------------------
    const draftReportPrompt = `
You are an expert technical report writer. Using the relevant sections identified below, draft a detailed, multipage report. Each section must be comprehensive, include all key information from the conversation and project details, and maintain a formal tone.

**Relevant Sections**:
${relevantSections}

**Project Details**:  
${JSON.stringify(projectData, null, 2)}

**Thread Conversation**:  
${conversationText}

### Report Requirements:
- Include all relevant sections identified.
- Provide in-depth analysis, citations, and actionable recommendations.
- Use structured formatting: sections, headers, bullet points, and tables where applicable.
- Focus on thoroughness and detail. Ensure no insights from the conversation are omitted.

Generate the detailed report.
    `;

    const draftResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional technical writer specializing in hydrogen engineering reports.',
        },
        { role: 'user', content: draftReportPrompt },
      ],
      temperature: 0.2,
      max_tokens: 6000,
    });

    const draftReport = draftResponse.choices[0]?.message?.content || '';
    console.log('Draft Report:', draftReport);

    // ---------------------------------------------
    // Step 3: Extract References
    // ---------------------------------------------
    const referencesPrompt = `
From the following draft report, extract and compile a comprehensive list of all mentioned codes, standards, rules, regulations, and other referenced bodies of work. Each item should include its full name and, if possible, a brief description of its relevance to the project.

**Draft Report**:
${draftReport}

Provide the extracted references in a structured list format.
    `;

    const referencesResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a technical documentation specialist.' },
        { role: 'user', content: referencesPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const referencesSection = referencesResponse.choices[0]?.message?.content || '';
    console.log('References Section:', referencesSection);

    // ---------------------------------------------
    // Step 4: Refine the Entire Report
    // ---------------------------------------------
    const refinePrompt = `
You are an expert editor. Refine the draft report below to ensure it is polished, thorough, and professional. Expand any underdeveloped sections, and integrate the references section as a formal part of the report.

**Draft Report**:
${draftReport}

**References Section**:
${referencesSection}

Refine and enhance the report, ensuring all insights and references are included.
    `;

    const refineResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional editor.' },
        { role: 'user', content: refinePrompt },
      ],
      temperature: 0.2,
      max_tokens: 6000,
    });

    const finalReportContent = refineResponse.choices[0]?.message?.content || '';

    // Save the final report to Firestore
    const reportRef = adminDb.collection('reports').doc();
    await reportRef.set({
      projectId,
      userId,
      title: `Engineering Report - ${projectData?.projectName || 'Project'}`,
      content: finalReportContent,
      type: 'project',
      createdAt: new Date(),
    });

    return res
      .status(200)
      .json({ message: 'Report generated', content: finalReportContent });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: error.message });
  }
}