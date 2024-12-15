// pages/api/projects/[projectId].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query
  if (typeof projectId !== 'string') return res.status(400).json({ error: 'Invalid projectId' })

  const projectRef = doc(db, 'projects', projectId)
  
  if (req.method === 'GET') {
    const snap = await getDoc(projectRef)
    if (!snap.exists()) return res.status(404).json({ error: 'Project not found' })
    return res.status(200).json(snap.data())
  }

  if (req.method === 'PUT') {
    const data = req.body
    await updateDoc(projectRef, data)
    return res.status(200).json({ message: 'Project updated' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
