// lib/firestore.ts
import { db } from './firebase'
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore'

export async function getProjectById(projectId: string) {
  const projectRef = doc(db, 'projects', projectId)
  const snap = await getDoc(projectRef)
  return snap.exists() ? snap.data() : null
}

export async function listProjects() {
  const q = query(collection(db, 'projects'))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
