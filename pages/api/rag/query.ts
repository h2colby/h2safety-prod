import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '@/lib/firebaseAdmin'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { question, userToken, threadId } = req.body

  if (!question || !threadId) {
    return res.status(400).json({ error: 'Missing question or threadId' })
  }

  // Verify user if userToken is provided
  let userId: string | null = null
  if (userToken) {
    try {
      const decoded = await adminAuth.verifyIdToken(userToken)
      userId = decoded.uid
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired user token' })
    }
  }

  // Update the RAG service URL to match our test environment
  const RAG_SERVICE_URL = process.env.NEXT_PUBLIC_RAG_SERVICE_URL || 'http://34.28.61.219:5002/ask'

  try {
    const response = await fetch(RAG_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(500).json({ error: `Failed to query RAG pipeline: ${text}` })
    }

    const data = await response.json()

    // Update to match the RAG service response format
    const answer = data.final_response || data.answer

    // Store the user's query
    await addDoc(collection(db, 'messages'), {
      content: question,
      conversationId: threadId,
      role: 'user',
      sender: 'user',
      timestamp: serverTimestamp(),
      userId: userId || null,
    })

    // Store the AI's answer
    await addDoc(collection(db, 'messages'), {
      content: answer,
      conversationId: threadId,
      role: 'assistant',
      sender: 'ai',
      timestamp: serverTimestamp()
    })

    return res.status(200).json({ answer })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
