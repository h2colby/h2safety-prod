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

  try {
    // Update this URL to your new RAG service endpoint
    const response = await fetch('http://192.168.2.232:5002/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(500).json({ error: `Failed to query RAG pipeline: ${text}` })
    }

    const data = await response.json() // { answer: string }

    // Store the user’s query
    await addDoc(collection(db, 'messages'), {
      content: question,
      conversationId: threadId,
      role: 'user',
      sender: 'user',
      timestamp: serverTimestamp(),
      userId: userId || null,
    })

    // Store the AI’s answer
    await addDoc(collection(db, 'messages'), {
      content: data.answer,
      conversationId: threadId,
      role: 'assistant',
      sender: 'ai',
      timestamp: serverTimestamp()
    })

    return res.status(200).json({ answer: data.answer })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
