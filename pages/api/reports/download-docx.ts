// pages/api/reports/download-docx.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Document, Packer, Paragraph, TextRun } from 'docx'

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
  const { reportId } = req.query;
  if (typeof reportId !== 'string') {
    return res.status(400).send('Missing or invalid reportId');
  }

  // Fetch the report from Firestore
  const reportRef = adminDb.collection('reports').doc(reportId);
  const reportSnap = await reportRef.get();
  if (!reportSnap.exists) {
    return res.status(404).send('Report not found');
  }

  const report = reportSnap.data()!;
  // Create paragraphs from report content lines
  const contentLines = report.content.split('\n').map((line: string) =>
    new Paragraph({
      children: [new TextRun(line)],
      spacing: { after: 100 },
    })
  );

  // Create a new docx document with sections
  const doc = new Document({
    creator: "H2Safety.ai",
    title: report.title,
    description: "Hydrogen Safety Report",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Report Title: ${report.title}`,
                bold: true,
                size: 32, // 16pt (since size is in half-points)
                underline: {},
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [new TextRun(`Type: ${report.type}`)],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun(`Project ID: ${report.projectId}`)],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun("Content:")],
            spacing: { after: 200 },
          }),
          ...contentLines
        ],
      },
    ],
  });

  // Generate the DOCX file as a buffer
  const buffer = await Packer.toBuffer(doc);

  // Set headers to prompt download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=report-${reportId}.docx`);
  res.status(200).send(buffer);
}
