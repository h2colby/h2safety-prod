// components/Header.tsx
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/lib/context/UserContext'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Header() {
  const { user, loading } = useUser()
  const router = useRouter()

  async function handleLogout() {
    await signOut(auth)
    router.push('/auth/login')
      .then(() => {
        router.reload()
      })
  }

  return (
    <header className="w-full p-4 flex justify-between items-center border-b border-gray-800 bg-black text-white">
      <div>
        <Link href="/">
          <Image
            src="/h2safety-logo.svg"
            alt="H2Safety.ai Logo"
            width={177}
            height={64}
            priority
          />
        </Link>
      </div>
      <nav className="flex gap-4">
        {user ? (
          <>
            <Link href="/dashboard"><span className="hover:underline cursor-pointer">Dashboard</span></Link>
            <Link href="/projects"><span className="hover:underline cursor-pointer">Projects</span></Link>
            <Link href="/reports"><span className="hover:underline cursor-pointer">Reports</span></Link>
            <Link href="/settings"><span className="hover:underline cursor-pointer">Settings</span></Link>
            <span onClick={handleLogout} className="hover:underline cursor-pointer">Logout</span>
          </>
        ) : (
          <>
            <Link href="/"><span className="hover:underline cursor-pointer">Home</span></Link>
            <Link href="/about"><span className="hover:underline cursor-pointer">About</span></Link>
            <Link href="/demo"><span className="hover:underline cursor-pointer">Demo</span></Link>
            <Link href="/contact"><span className="hover:underline cursor-pointer">Contact</span></Link>
            <Link href="/auth/login"><span className="hover:underline cursor-pointer">Login</span></Link>
            <Link href="/auth/signup"><span className="hover:underline cursor-pointer">Sign Up</span></Link>
          </>
        )}
      </nav>
    </header>
  )
}
