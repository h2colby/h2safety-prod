// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth' // This normally doesn't work server-side directly.
                                                          // For server-side auth, use Firebase Admin SDK.
                                                          // This example shows client approach - might not work as intended server-side.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' })

  // NOTE: signInWithEmailAndPassword is client-only. For server-side, use Admin SDK.
  // This example is not fully correct for server-side login.
  // Normally you'd just do client-side login.
  return res.status(501).json({ error: 'Not implemented for server-side.' })
}
