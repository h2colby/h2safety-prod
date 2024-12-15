// pages/api/reports/update.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 not set');
}

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(jsonString);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminDb = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Update request body:', req.body);
  const { reportId, title } = req.body;

  // Validate fields
  if (typeof reportId !== 'string' || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  try {
    const reportRef = adminDb.collection('reports').doc(reportId);
    await reportRef.update({ title });
    return res.status(200).json({ message: 'Report updated' });
  } catch (error: any) {
    console.error('Error updating report:', error);
    return res.status(500).json({ error: error.message });
  }
}
