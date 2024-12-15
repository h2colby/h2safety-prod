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
  const { reportId } = req.body;
  if (typeof reportId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid reportId' });
  }

  try {
    const reportRef = adminDb.collection('reports').doc(reportId);
    await reportRef.delete();
    return res.status(200).json({ message: 'Report deleted' });
  } catch (error: any) {
    console.error('Error deleting report:', error);
    return res.status(500).json({ error: error.message });
  }
}
