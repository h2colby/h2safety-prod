// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Firebase Auth doesn't have a traditional server-side logout since it’s client-based tokens.
  return res.status(501).json({ error: 'Not implemented. Logout should happen client-side.' })
}
