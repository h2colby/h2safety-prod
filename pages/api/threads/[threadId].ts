// pages/api/threads/[threadId].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId } = req.query
  if (typeof threadId !== 'string') return res.status(400).json({ error: 'Invalid threadId' })

  const threadRef = doc(db, 'threads', threadId)

  if (req.method === 'GET') {
    const snap = await getDoc(threadRef)
    if (!snap.exists()) return res.status(404).json({ error: 'Thread not found' })
    return res.status(200).json(snap.data())
  }

  if (req.method === 'PUT') {
    const data = req.body
    await updateDoc(threadRef, data)
    return res.status(200).json({ message: 'Thread updated' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
