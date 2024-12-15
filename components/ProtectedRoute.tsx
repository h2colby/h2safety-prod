// components/ProtectedRoute.tsx
import { useEffect } from 'react'
import { useUser } from '@/lib/context/UserContext'
import { useRouter } from 'next/router'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading || !user) return <div>Loading...</div>

  return <>{children}</>
}
