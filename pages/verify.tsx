// pages/verify.tsx
import { useState } from 'react'
import { useUser } from '@/lib/context/UserContext'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function VerifyPage() {
  const { user, userData, loading } = useUser()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [verifying, setVerifying] = useState(false)

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in.</div>
  if (userData?.verified) {
    // Already verified, redirect to dashboard or home
    router.replace('/dashboard')
    return null
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setVerifying(true)

    // Replace this with a server-side check or an .env variable
    const SECRET_CODE = process.env.NEXT_PUBLIC_SECRET_CODE || 'MYSECRET123'

    if (code.trim() === SECRET_CODE) {
      try {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, { verified: true })
        router.replace('/dashboard') // or wherever
      } catch (err: any) {
        setError(err.message)
      }
    } else {
      setError('Incorrect code. Please try again.')
    }
    setVerifying(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Enter Verification Code</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border border-gray-700 rounded px-4 py-2 text-black"
          placeholder="Enter Secret Code"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={verifying}
        >
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  )
}
