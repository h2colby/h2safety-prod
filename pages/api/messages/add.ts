// pages/api/messages/add.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

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
  const { threadId, content, sender } = req.body;
  if (!threadId || !content || !sender) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const threadRef = adminDb.doc(`threads/${threadId}`);
  const messageId = uuidv4();
  const message = {
    id: messageId,
    content,
    sender,
    timestamp: Date.now(),
    conversationId: threadId,
  };

  try {
    await threadRef.update({
      messages: FieldValue.arrayUnion(message),
    });
  } catch (err) {
    await threadRef.set({ messages: [message] }, { merge: true });
  }

  await adminDb.collection('messages').doc(messageId).set(message);
  return res.status(200).json({ message: 'Message added', messageId });
}
