This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# H2Safety.ai MVP

## Overview
This is a Next.js + TypeScript + Tailwind CSS + Firebase MVP for H2Safety.ai. It provides:
- Landing page
- User authentication (Sign Up, Login)
- Protected dashboard
- Firebase Firestore integration
- Placeholder RAG endpoint

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` with your Firebase keys:
4. Run `npm run dev`
5. Access at `http://localhost:3000`

## Firebase Setup
- Create a Firebase project
- Enable Email/Password auth
- Setup Firestore in test mode
- Add the config keys to `.env.local`

## RAG Integration
- Start your Python-based embedding server locally.
- Update `pages/api/rag/query.ts` with the correct endpoint.
- When user asks a question in dashboard or threads page, call `/api/rag/query`.

## Future Steps
- Implement project and thread pages with Firestore reads/writes.
- Integrate real embeddings and GPT queries in `/api/rag`.
- Add report generation logic using PDF libraries.
- Add insights generation using RAG pipeline.

