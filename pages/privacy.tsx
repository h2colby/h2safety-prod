import Header from '@/components/Header'
import { motion } from 'framer-motion'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

// Updated PolicySection component with numbered sections
const PolicySection = ({ number, title, children }: { 
  number: number, 
  title: string, 
  children: React.ReactNode 
}) => (
  <motion.div variants={itemVariants} className="mb-12">
    <h2 className="text-2xl font-bold mb-4">
      {number}. {title}
    </h2>
    <div className="space-y-4 text-gray-300">
      {children}
    </div>
  </motion.div>
)

// Bullet list component for better organization
const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-6 space-y-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B1015] text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold mb-8 text-center"
          >
            Privacy Policy
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-gray-300 mb-12 text-center"
          >
            Effective Date: December 14th, 2024
          </motion.p>

          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-gray-300">
              H2Safety.ai is committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, and safeguard information when you visit or use our platform.
            </p>
          </motion.div>

          <PolicySection number={1} title="Information We Collect">
            <p>We may collect the following types of information:</p>
            <div className="space-y-6 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information You Provide:</h3>
                <BulletList items={[
                  'When you sign up, we collect information such as your name, email address, organization, and job title.',
                  'If you contact us, we may collect additional information related to your inquiry.'
                ]} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Information:</h3>
                <BulletList items={[
                  'Data automatically collected when you visit our platform, such as IP addresses, browser type, device information, and operating system.'
                ]} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Data:</h3>
                <BulletList items={[
                  'Information about your interactions with our platform, including pages visited, features used, and time spent on the platform.'
                ]} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Specific Data:</h3>
                <BulletList items={[
                  'Any documents or data you upload for compliance analysis.',
                  'Interactions with AI-based tools (e.g., queries, reports) for the purpose of improving the platform.'
                ]} />
              </div>
            </div>
          </PolicySection>

          <PolicySection number={2} title="How We Use Your Information">
            <BulletList items={[
              'To provide and improve our services, including personalized recommendations and insights.',
              'To process and respond to inquiries or support requests.',
              'To send updates, marketing communications, or other relevant information about our platform.',
              'To ensure platform security and prevent misuse or unauthorized access.',
              'To improve the accuracy and performance of our AI models using anonymized and aggregated data.'
            ]} />
          </PolicySection>

          <PolicySection number={3} title="Data Sharing">
            <p>We do not sell, rent, or trade your personal information. However, we may share your information with:</p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Service Providers:</h3>
                <p>Trusted third-party providers who assist us with hosting, analytics, customer support, or similar services.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Compliance with Legal Obligations:</h3>
                <p>If required by law or in response to valid legal requests.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Transfers:</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
              </div>
            </div>
          </PolicySection>

          <PolicySection number={4} title="Data Security">
            <p>
              We use industry-standard security measures to protect your data, including encryption, secure servers, and regular audits. 
              However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </PolicySection>

          <PolicySection number={5} title="Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Access and Correction:</h3>
                <p>Request access to or correction of your personal data.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Deletion:</h3>
                <p>Request the deletion of your personal data, subject to any legal obligations.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Portability:</h3>
                <p>Request a copy of your data in a portable format.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Opt-Out:</h3>
                <p>Opt-out of marketing communications by following the instructions in our emails or contacting us directly.</p>
              </div>
            </div>
            <p className="mt-4">To exercise your rights, please contact us at colby@tobe.energy.</p>
          </PolicySection>

          <PolicySection number={6} title="Cookies and Tracking">
            <p>
              We use cookies and similar technologies to enhance user experience, analyze website traffic, and customize content. 
              You can manage cookie preferences in your browser settings. For more details, refer to our Cookie Policy.
            </p>
          </PolicySection>

          <PolicySection number={7} title="Data Retention">
            <p>
              We retain your information only for as long as necessary to provide our services and fulfill the purposes outlined in this policy. 
              Data uploaded for compliance analysis is stored securely and deleted upon request.
            </p>
          </PolicySection>

          <PolicySection number={8} title="AI Ethics">
            <p>
              As an AI platform, we are committed to ethical use of AI technologies. Your data is not used to train or fine-tune AI models 
              without your explicit consent. We follow strict guidelines to ensure compliance, fairness, and transparency in all AI-related activities.
            </p>
          </PolicySection>

          <PolicySection number={9} title="Changes to this Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated effective date. 
              We encourage you to review this policy periodically.
            </p>
          </PolicySection>

          <PolicySection number={10} title="Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy or how we handle your information, please contact us:
            </p>
            <p className="mt-4">
              Email: <a href="mailto:colby@tobe.energy" className="text-[#00AEEF] hover:underline">colby@tobe.energy</a>
            </p>
          </PolicySection>
        </motion.div>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
} 