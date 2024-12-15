// pages/api/projects/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const snap = await getDocs(collection(db, 'projects'))
    const projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return res.status(200).json(projects)
  }

  if (req.method === 'POST') {
    const { projectName, facilityName, ownerId } = req.body
    if (!projectName || !ownerId) return res.status(400).json({ error: 'Missing fields' })

    const newProject = {
      projectName,
      facilityName: facilityName || '',
      ownerId,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, 'projects'), newProject)
    return res.status(201).json({ id: docRef.id, ...newProject })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
