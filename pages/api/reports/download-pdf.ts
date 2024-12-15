// Example: pages/api/reports/download-pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import PDFDocument from 'pdfkit' // or another PDF library

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 not set');
}

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(jsonString);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const adminDb = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { reportId } = req.query;
  if (typeof reportId !== 'string') {
    return res.status(400).send('Missing or invalid reportId');
  }

  const reportRef = adminDb.collection('reports').doc(reportId);
  const reportSnap = await reportRef.get();
  if (!reportSnap.exists) {
    return res.status(404).send('Report not found');
  }

  const report = reportSnap.data()!;

  // Generate PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-${reportId}.pdf`);

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text(`Report Title: ${report.title}`, { underline: true });
  doc.moveDown().fontSize(12).text(`Type: ${report.type}`);
  doc.text(`Project ID: ${report.projectId}`);
  doc.moveDown().text('Content:');
  doc.text(report.content);

  doc.end();
}
