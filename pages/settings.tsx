// pages/settings.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/context/UserContext'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Header from '@/components/Header'

export default function SettingsPage() {
  const { user, loading } = useUser()
  const [displayName, setDisplayName] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      setInitialLoading(false)
      return
    }

    async function loadUserData() {
      try {
        const userRef = doc(db, 'users', user.uid)
        const snap = await getDoc(userRef)
        if (snap.exists()) {
          const data = snap.data()
          setDisplayName(data.displayName || '')
          setProfilePictureUrl(data.profilePictureUrl || '')
        }
        setInitialLoading(false)
      } catch (err: any) {
        setError(err.message)
        setInitialLoading(false)
      }
    }

    loadUserData()
  }, [user, loading])

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to view your settings.</p>
      </div>
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('No user logged in.')
      return
    }

    if (displayName.trim() === '') {
      setError('Display name cannot be empty.')
      return
    }

    try {
      setError(null)
      setSuccess(false)
      setSaving(true)
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        profilePictureUrl: profilePictureUrl.trim()
      })
      setSaving(false)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="p-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        {initialLoading ? (
          <p>Loading user data...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Profile updated successfully!</p>}
            <div>
              <label className="block mb-1 font-semibold">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-2 text-black"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Profile Picture URL</label>
              <input
                type="text"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-2 text-black"
                placeholder="https://example.com/picture.jpg"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </main>
      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
}
