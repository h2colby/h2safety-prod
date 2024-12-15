import Header from '@/components/Header'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { 
  FaDesktop, FaTag, FaRocket, FaHandshake, 
  FaCalendarAlt, FaHeadset, FaUsers, FaCogs, 
  FaLifeRing, FaPeopleArrows, FaShare, FaFileUpload,
  FaCommentDots, FaUserFriends, FaQuestionCircle,
  FaTools, FaDatabase, FaChevronDown
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

interface PricingFeature {
  text: string;
  icon: ReactNode;
  subtext?: string;
}

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: PricingFeature[];
  icon: ReactNode;
  footer?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: ReactNode;
  questions: FAQItem[];
}

const FAQAccordion = ({ sections }: { sections: FAQSection[] }) => {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {sections.map((section) => (
        <div key={section.title} className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-blue-500 text-xl">{section.icon}</span>
            <h3 className="text-2xl font-bold">{section.title}</h3>
          </div>
          <div className="space-y-4">
            {section.questions.map((item) => (
              <motion.div
                key={item.question}
                className="border border-gray-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => {
                    setOpenSection(section.title)
                    setOpenQuestion(openQuestion === item.question ? null : item.question)
                  }}
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-800 
                           transition-colors duration-200"
                >
                  <span className="font-medium pr-8">{item.question}</span>
                  <motion.span
                    animate={{ rotate: openQuestion === item.question ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-blue-500"
                  >
                    <FaChevronDown />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openQuestion === item.question && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-800"
                    >
                      <p className="p-4 text-gray-300">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Add Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Add BetaSignupModal component
const BetaSignupModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [betaFormData, setBetaFormData] = useState({
    name: '',
    email: '',
    company: '',
    betatest: 'yes'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add document to "signup" collection
      await addDoc(collection(db, 'signup'), betaFormData)
      alert('Thank you for signing up! We will contact you soon about beta access.')
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Join the Beta Program</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={betaFormData.name}
              onChange={(e) => setBetaFormData({...betaFormData, name: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={betaFormData.email}
              onChange={(e) => setBetaFormData({...betaFormData, email: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Company</label>
            <input
              type="text"
              value={betaFormData.company}
              onChange={(e) => setBetaFormData({...betaFormData, company: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Are you willing to provide feedback as a beta tester?</label>
            <select
              value={betaFormData.betatest}
              onChange={(e) => setBetaFormData({...betaFormData, betatest: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              required
            >
              <option value="yes">Yes, I want to help shape the platform</option>
              <option value="no">No, just keep me updated</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    build: ''
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Add document to "signup" collection
      await addDoc(collection(db, 'signup'), formData)
      // Reset form and show confirmation
      setFormData({ name: '', email: '', build: '' })
      alert('Thank you for your message! We will get back to you soon.')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your form. Please try again.')
    }
  }

  const faqSections: FAQSection[] = [
    {
      title: "General Questions",
      icon: <FaQuestionCircle />,
      questions: [
        {
          question: "What makes H2Safety.ai different from traditional safety management systems?",
          answer: "H2Safety.ai leverages advanced AI and natural language processing to provide real-time, context-aware safety guidance and automated compliance checking. It simplifies navigating hydrogen-specific standards and ensures accurate, actionable insights."
        },
        {
          question: "How often is the safety database updated?",
          answer: "Our system continuously monitors regulatory changes and updates, ensuring you always have access to the latest safety standards and requirements."
        },
        {
          question: "Does H2Safety.ai certify compliance?",
          answer: "Just like ChatGPT cannot act as your lawyer but can help draft better legal documents and save time, H2Safety.ai functions the same way. It is a tool to support compliance, not a certification authority."
        },
        {
          question: "What kind of support do you offer?",
          answer: "We provide 24/7 technical support, regular training sessions, and dedicated account managers for enterprise clients."
        }
      ]
    },
    {
      title: "Platform Features",
      icon: <FaCogs />,
      questions: [
        {
          question: "Does H2Safety.ai support secure on-site database deployment?",
          answer: "We plan to offer secure on-site database deployment for enterprise clients on a case-by-case basis. This feature is designed to ensure maximum security and compliance with your organization's IT infrastructure."
        },
        {
          question: "What type of reports can H2Safety.ai generate?",
          answer: "H2Safety.ai creates detailed compliance reports tailored to your specific project needs, including safety insights, permitting guidance, and adherence to applicable standards."
        },
        {
          question: "Does H2Safety.ai send real-time alerts for regulatory changes?",
          answer: "Yes, the platform notifies you of regulatory changes and updates in real time, ensuring you stay ahead of evolving compliance requirements."
        },
        {
          question: "Can I upload my own documents to the platform?",
          answer: "Yes, you can upload unique regulatory or compliance documents (e.g., state-specific permitting requirements) to personalize your workspace. These documents may also contribute to expanding the platform's knowledge base."
        }
      ]
    },
    {
      title: "Technical and Integration",
      icon: <FaDatabase />,
      questions: [
        {
          question: "Can I integrate H2Safety.ai with my existing tools?",
          answer: "Yes, H2Safety.ai offers integration capabilities with popular project management tools and supports exporting data in various formats, including CSV and Excel."
        },
        {
          question: "Is my data secure on H2Safety.ai?",
          answer: "We use industry-standard encryption and secure access protocols to protect your data. Our platform adheres to strict data security practices to ensure your information remains safe."
        },
        {
          question: "How does H2Safety.ai ensure accurate results?",
          answer: "H2Safety.ai uses retrieval-augmented generation (RAG) and advanced AI models trained on over 150,000 pages of verified hydrogen industry documents to deliver accurate, hallucination-free insights."
        }
      ]
    },
    {
      title: "User Experience and Feedback",
      icon: <FaCommentDots />,
      questions: [
        {
          question: "Can I provide feedback on the platform?",
          answer: "Absolutely. User feedback is critical to improving H2Safety.ai. Beta testers can submit suggestions directly through the platform, and our team actively reviews all feedback to enhance functionality."
        },
        {
          question: "Are there tutorials or training resources available?",
          answer: "Yes, we provide step-by-step tutorials, onboarding guides, and live training sessions to ensure users can fully leverage the platform."
        },
        {
          question: "What happens if I encounter an issue while using H2Safety.ai?",
          answer: "Our 24/7 support team is always available to assist you. You can reach out via live chat, email, or the support center for help."
        }
      ]
    }
  ]

  const pricingTiers: PricingTier[] = [
    {
      name: 'Early Beta',
      price: 100,
      description: 'Shape the future of hydrogen safety while securing lifetime benefits',
      features: [
        { text: 'Full platform access', icon: <FaDesktop className="h-5 w-5" /> },
        { text: 'Lifetime reduced pricing', icon: <FaTag className="h-5 w-5" /> },
        { text: 'Early feature access', icon: <FaRocket className="h-5 w-5" /> },
        { text: 'Personalized onboarding', icon: <FaHandshake className="h-5 w-5" /> },
        { text: 'Direct platform influence', icon: <FaCommentDots className="h-5 w-5" /> }
      ],
      icon: <FaRocket className="text-4xl text-blue-500" />,
      footer: "As a beta tester, your feedback is crucial. Your insights will directly shape the future of H2Safety.ai, making it an indispensable tool for hydrogen professionals."
    },
    {
      name: 'Late Beta',
      price: 200,
      description: 'Join the innovation journey with exclusive referral benefits',
      features: [
        { text: 'Full platform access', icon: <FaDesktop className="h-5 w-5" /> },
        { text: 'Reduced pricing for 1 year', icon: <FaCalendarAlt className="h-5 w-5" /> },
        { text: 'Priority support', icon: <FaHeadset className="h-5 w-5" /> },
        { text: 'Group onboarding', icon: <FaUsers className="h-5 w-5" /> },
        { 
          text: 'Earn credits through referrals', 
          subtext: 'Get rewards when companies you refer join H2Safety.ai',
          icon: <FaShare className="h-5 w-5" /> 
        },
        { 
          text: 'Source document credits', 
          subtext: 'Upload regulatory materials to earn platform credits',
          icon: <FaFileUpload className="h-5 w-5" /> 
        }
      ],
      icon: <FaUserFriends className="text-4xl text-blue-500" />
    },
    {
      name: 'Post Beta',
      price: 500,
      description: 'Access the complete platform with all beta-developed features',
      features: [
        { text: 'Advanced feature set', icon: <FaCogs className="h-5 w-5" /> },
        { text: 'Dedicated support', icon: <FaLifeRing className="h-5 w-5" /> },
        { text: 'Team collaboration tools', icon: <FaPeopleArrows className="h-5 w-5" /> },
        { 
          text: 'Premium referral program', 
          subtext: 'Enhanced rewards for growing the H2Safety.ai network',
          icon: <FaShare className="h-5 w-5" /> 
        },
        { 
          text: 'Premium document credits', 
          subtext: 'Exclusive rewards for expanding our regulatory database',
          icon: <FaFileUpload className="h-5 w-5" /> 
        }
      ],
      icon: <FaCogs className="text-4xl text-blue-500" />
    }
  ]

  const handleBetaSignup = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <section className="mb-16 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-8 shadow-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
          >
            Early Access Pricing & Rollout
          </motion.h2>
          
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold">Join Our Beta Program</h3>
              <p className="text-gray-300 leading-relaxed">
                Be part of the future of hydrogen safety and compliance! Beta testers will help shape 
                H2Safety.ai while receiving exclusive early access, discounted pricing, and personalized 
                onboarding.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBetaSignup}
                className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold 
                         shadow-lg transition-colors duration-200 mt-8"
              >
                Join the Beta Waitlist Now
              </motion.button>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.2) }}
                className="relative bg-gray-800 p-8 rounded-lg border border-gray-700 
                         shadow-xl hover:shadow-2xl transition-all duration-300 
                         min-h-[600px] flex flex-col"
              >
                {/* Divider line between cards */}
                {index < pricingTiers.length - 1 && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-2/3 
                                w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
                )}
                
                <div className="flex items-center space-x-4 mb-6">
                  {tier.icon}
                  <div>
                    <h4 className="text-xl font-semibold">{tier.name}</h4>
                    <p className="text-3xl font-bold text-blue-500">
                      ${tier.price}<span className="text-sm text-gray-400">/month</span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 mb-8">{tier.description}</p>
                <ul className="space-y-6 flex-grow">
                  {tier.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="group"
                    >
                      <div className="flex items-center text-gray-300">
                        <span className="text-blue-500 mr-3 flex-shrink-0 
                                      group-hover:scale-110 transition-transform duration-200">
                          {feature.icon}
                        </span>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                      {feature.subtext && (
                        <p className="text-sm text-gray-500 mt-1 ml-8">{feature.subtext}</p>
                      )}
                    </motion.li>
                  ))}
                </ul>
                {tier.footer && (
                  <p className="text-blue-400 italic text-sm mt-6 border-t border-gray-700 pt-6">
                    {tier.footer}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <FAQAccordion sections={faqSections} />
        </section>

        <div className="max-w-2xl mx-auto">
          <section>
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Message</label>
                <textarea
                  value={formData.build}
                  onChange={(e) => setFormData({...formData, build: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700 h-32"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>

        <BetaSignupModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
} 