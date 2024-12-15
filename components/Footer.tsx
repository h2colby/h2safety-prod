import Link from 'next/link'
import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

// Type for Quick Links
interface QuickLink {
  href: string
  text: string
  icon: any
}

const quickLinks: QuickLink[] = [
  { href: '/', text: 'Home', icon: HomeIcon },
  { href: '/about', text: 'About Us', icon: InformationCircleIcon },
  { href: '/contact', text: 'Contact', icon: EnvelopeIcon },
  { href: '/privacy', text: 'Privacy Policy', icon: ShieldCheckIcon }
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'signup'), {
        email,
        timestamp: serverTimestamp()
      })
      
      setEmail('')
      setStatus({
        type: 'success',
        message: 'Thank you for subscribing!'
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to subscribe. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">About H2Safety.ai</h3>
            <p className="text-gray-400 leading-relaxed">
              H2Safety.ai is revolutionizing hydrogen safety and compliance by simplifying complex 
              regulations and standards with AI-driven insights. Whether you're an engineer, 
              environmental expert, or safety professional, we empower you to navigate hydrogen's 
              evolving landscape with confidence and efficiency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="flex items-center text-gray-400 hover:text-[#00AEEF] transition-colors duration-300 group"
                >
                  <link.icon className="w-5 h-5 mr-2 group-hover:text-[#00AEEF]" />
                  <span>{link.text}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Stay Updated */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-[#00AEEF] focus:border-transparent"
                />
              </div>
              
              {status.message && (
                <p className={`text-sm ${
                  status.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00AEEF] hover:bg-[#0098d1] text-white font-semibold 
                  px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50
                  disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          © {new Date().getFullYear()} H2Safety.ai. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 