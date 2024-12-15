// pages/index.tsx
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import {
  DocumentCheckIcon,
  BellAlertIcon,
  ChartBarIcon,
  BookOpenIcon,
  BoltIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
  BeakerIcon,
  ArrowRightIcon,
  ClockIcon,
  FolderIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/Footer'

// Animation variants for features
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

// Feature component for top-level features
const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) => (
  <motion.div 
    variants={itemVariants}
    className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl hover:scale-105 transition-transform duration-300 border border-gray-700"
  >
    <div className="flex flex-col items-center text-center">
      <div className="p-3 bg-blue-600/10 rounded-full mb-4">
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
)

// Supporting feature component
const SupportingFeature = ({ icon: Icon, title, description }: {
  icon: any,
  title: string,
  description: string
}) => (
  <motion.div 
    variants={itemVariants}
    className="flex items-start space-x-4 p-4 hover:bg-gray-800/50 rounded-lg transition-colors duration-300"
  >
    <div className="p-2 bg-blue-600/10 rounded-full shrink-0">
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
)

// New component for future integration features
const IntegrationFeature = ({ icon: Icon, description }: {
  icon: any,
  description: string
}) => (
  <motion.div
    variants={itemVariants}
    className="flex gap-4 items-start p-6 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
  >
    <div className="p-2 bg-blue-600/10 rounded-full shrink-0">
      <Icon className="w-6 h-6 text-[#00AEEF]" />
    </div>
    <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
  </motion.div>
)

// New component for key benefits
const BenefitCard = ({ icon: Icon, title, description }: {
  icon: any,
  title: string,
  description: string
}) => (
  <motion.div
    variants={itemVariants}
    className="flex items-start gap-4 p-6 bg-gray-900/30 rounded-xl hover:bg-gray-800/30 transition-all duration-300"
  >
    <div className="p-3 bg-[#00AEEF]/10 rounded-full shrink-0">
      <Icon className="w-6 h-6 text-[#00AEEF]" />
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
)

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1015] text-white">
      <Header />
      
      {/* Updated Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto text-center"
        >
          {/* Title and Description */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
          >
            The Fastest Way to Build Safe, Compliant Hydrogen Projects
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            H2Safety.ai is the ultimate tool for hydrogen professionals. Built on 150,000+ pages of 
            industry standards, it simplifies engineering codes, environmental compliance, permitting 
            processes, and safety regulations. Whether you're a seasoned engineer, environmental expert, 
            or safety professional, H2Safety.ai helps you navigate complex requirements in minutes—not weeks.
          </motion.p>

          {/* Benefits Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <BenefitCard
              icon={ClockIcon}
              title="Save Hundreds of Hours"
              description="Dramatically reduce time spent researching hydrogen safety, permitting, and compliance requirements."
            />
            <BenefitCard
              icon={DocumentCheckIcon}
              title="Accurate Guidance"
              description="Instantly access accurate and comprehensive guidance from industry standards."
            />
            <BenefitCard
              icon={FolderIcon}
              title="Example Documents"
              description="Start with example compliance documents tailored to hydrogen projects."
            />
            <BenefitCard
              icon={RocketLaunchIcon}
              title="Accelerate Timelines"
              description="Speed up project timelines and focus on building a cleaner future."
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <button 
              className="group relative px-8 py-4 bg-[#00AEEF] text-white rounded-full font-semibold text-lg
                shadow-lg hover:bg-[#0098d1] transform hover:scale-105 transition-all duration-300
                hover:shadow-[#00AEEF]/20 hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                Save Time, Build Faster—Join the Waitlist Today
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why H2Safety.ai?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-driven platform revolutionizes hydrogen safety management with cutting-edge features
            </p>
          </div>

          {/* Main Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            <FeatureCard
              icon={DocumentCheckIcon}
              title="Unified Compliance"
              description="Streamline compliance with automated tracking and verification across all relevant standards"
            />
            <FeatureCard
              icon={BellAlertIcon}
              title="Real-Time Alerts"
              description="Stay informed with instant notifications about safety updates and regulatory changes"
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Industry-Specific Insights"
              description="Get tailored recommendations based on your sector and use case"
            />
          </motion.div>

          {/* Supporting Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <SupportingFeature
              icon={BookOpenIcon}
              title="Consolidated Standards Library"
              description="Access global hydrogen safety standards, including ISO, NFPA, and local regulations, all in one place"
            />
            <SupportingFeature
              icon={BoltIcon}
              title="Smart Recommendations"
              description="Receive actionable safety recommendations and best practices specific to your industry needs"
            />
            <SupportingFeature
              icon={DocumentTextIcon}
              title="Dynamic Compliance Tracking"
              description="Monitor your compliance status in real-time and receive automated alerts for non-compliance risks"
            />
            <SupportingFeature
              icon={ShieldCheckIcon}
              title="Customizable Reports"
              description="Generate compliance reports tailored to your operational context, saving time and reducing manual work"
            />
          </motion.div>
        </div>
      </section>

      {/* Future Integrations Section - Updated Design */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-6">
              <span className="inline-block bg-[#141B22] px-4 py-2 rounded-full text-sm font-medium">
                v1.1 Features
              </span>
              <h2 className="text-4xl font-bold">
                Future Integrations: Taking the Frustration out of Hydrogen Analysis
              </h2>
            </div>

            {/* Main content card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-8 space-y-8">
              {/* Integration features grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <IntegrationFeature
                  icon={BeakerIcon}
                  description="Struggling with massive spreadsheets and complex analysis tools? We get it. That's why we're building intelligent integrations with the world's leading open-source hydrogen analysis tools."
                />
                <IntegrationFeature
                  icon={PresentationChartLineIcon}
                  description="Our platform will automate data entry, streamline complex calculations, and deliver clear, actionable insights—faster and more accurately than ever before."
                />
                <IntegrationFeature
                  icon={LightBulbIcon}
                  description="Imagine using GREET, H2FAST, or SERA without the headache. Let AI handle the complexity while you focus on making informed decisions."
                />
                <IntegrationFeature
                  icon={DocumentCheckIcon}
                  description="Comprehensive integration with industry-standard tools ensures your analysis is both thorough and compliant with current regulations."
                />
              </div>

              {/* CTA Section */}
              <div className="text-center pt-4">
                <Link 
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#00AEEF] hover:underline font-semibold group transition-all duration-300"
                >
                  <span>Explore Future Integrations</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
