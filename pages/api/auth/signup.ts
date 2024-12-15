// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // For server-side signup, use Admin SDK to create user:
  // adminAuth.createUser({ email, password })...
  return res.status(501).json({ error: 'Not implemented. Handle client-side signup.' })
}
