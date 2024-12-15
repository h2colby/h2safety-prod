import Header from '@/components/Header'
import { motion } from 'framer-motion'
import { BiBrain } from 'react-icons/bi'
import { FiSearch } from 'react-icons/fi'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import Image from 'next/image'
import { useState } from 'react'
import WaitlistForm from '@/components/WaitlistForm'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function AboutPage() {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <motion.section 
          className="mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-4xl font-bold mb-8">About H2Safety.ai</h1>
          <p className="text-xl mb-8">
            H2Safety.ai is revolutionizing hydrogen safety management through artificial intelligence
            and advanced natural language processing.
          </p>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              className="bg-gray-900 p-8 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-300">
                To democratize hydrogen safety knowledge by making critical information accessible and actionable 
                for companies of all sizes. Through innovative AI solutions, we're breaking down barriers to 
                entry and accelerating the global adoption of hydrogen technologies.
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-900 p-8 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-300">
                To create a future where hydrogen safety compliance is seamless, intelligent, and accessible 
                to all. We envision a world where innovative AI tools bridge the knowledge gap between 
                established energy companies and emerging hydrogen ventures.
              </p>
            </motion.div>
          </div>

          {/* Why H2Safety.ai Section */}
          <motion.section 
            className="mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-8">Why H2Safety.ai?</h2>
            <div className="bg-gray-900 p-8 rounded-lg">
              <p className="text-gray-300 mb-4">
                The hydrogen industry faces a significant challenge: while established energy companies 
                have extensive resources for safety compliance, smaller and emerging hydrogen companies 
                often struggle to access and implement these crucial safety measures.
              </p>
              <p className="text-gray-300">
                H2Safety.ai bridges this gap by providing sophisticated AI-powered tools that make 
                safety compliance accessible and affordable for companies of all sizes. Our custom AI 
                models and innovative approach democratize safety knowledge, enabling the entire 
                hydrogen industry to move forward together.
              </p>
            </div>
          </motion.section>

          {/* Tobe Energy Section */}
          <motion.section 
            className="mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-8">Born at Tobe Energy</h2>
            <div className="bg-gray-900 p-8 rounded-lg">
              <p className="text-gray-300 mb-4">
                H2Safety.ai was developed in-house at Tobe Energy when we recognized a critical gap 
                in the hydrogen industry: the lack of modern, accessible tools for safety compliance 
                and knowledge management.
              </p>
              <p className="text-gray-300">
                Rather than keeping these tools internal, Tobe Energy is committed to sharing them 
                with the broader hydrogen community. We believe that by making these resources widely 
                available, we can accelerate the global adoption of hydrogen technologies and contribute 
                to a more sustainable future.
              </p>
            </div>
          </motion.section>

          {/* Key Features Section */}
          <motion.section className="mb-16" variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-gray-900 p-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-4">
                  <BiBrain className="text-4xl text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">AI-Powered Analysis</h3>
                <p className="text-gray-300 text-center">
                  Advanced natural language processing for comprehensive safety regulation interpretation.
                </p>
              </motion.div>
              <motion.div 
                className="bg-gray-900 p-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-4">
                  <FiSearch className="text-4xl text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Real-Time Updates</h3>
                <p className="text-gray-300 text-center">
                  Stay current with automatic updates to safety protocols and regulatory changes.
                </p>
              </motion.div>
              <motion.div 
                className="bg-gray-900 p-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-4">
                  <HiOutlineDocumentReport className="text-4xl text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Custom Reports</h3>
                <p className="text-gray-300 text-center">
                  Generate detailed safety reports tailored to your specific project needs.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Team Section */}
          <motion.section className="mb-16" variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-8">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image 
                    src="/colbyheadshot.jpeg"
                    alt="Colby DeWeese"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">Colby DeWeese</h3>
                <p className="text-gray-300">Founder</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image 
                    src="/calebheadshot.jpeg"
                    alt="Caleb Lareau"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">Caleb Lareau, PhD</h3>
                <p className="text-gray-300">Co-founder & Advisor</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image 
                    src="/louheadshot.jpeg"
                    alt="Louis Mounsey"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">Louis Mounsey, PMP</h3>
                <p className="text-gray-300">Co-founder</p>
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            className="text-center py-16"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">
              Simplify Hydrogen Compliance. Accelerate Your Projects. Empower Your Team.
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Discover how H2Safety.ai can transform your hydrogen initiatives, from compliance management to project execution.
            </p>
            <motion.button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWaitlistForm(true)}
            >
              Join the Waitlist
            </motion.button>
            
            {showWaitlistForm && (
              <WaitlistForm onClose={() => setShowWaitlistForm(false)} />
            )}
          </motion.section>
        </motion.section>
      </main>
      
      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
} 
