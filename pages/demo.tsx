import Header from '@/components/Header'
import UseCase from '@/components/UseCase'
import { useState } from 'react'
import { FaTools, FaBalanceScale, FaSitemap, FaFileAlt } from 'react-icons/fa'
import { addSignup } from '@/utils/firebase'

export default function DemoPage() {
  const [showDemoForm, setShowDemoForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    availability: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const result = await addSignup({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        build: formData.availability // maps to 'build' field in Firebase
      })

      if (result.success) {
        setFormData({ name: '', email: '', company: '', availability: '' })
        setShowDemoForm(false)
        alert('Thank you! We will contact you shortly to schedule your demo.')
      } else {
        alert('There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const useCases = [
    {
      title: "Engineering RAGAGEP",
      subtitle: "Recognized and Generally Accepted Good Engineering Practices",
      description: "Staying compliant with engineering best practices is critical to hydrogen projects. H2Safety.ai distills RAGAGEP from industry-leading standards like NFPA, ASME, and API.",
      whyItMatters: "Small errors in engineering decisions can have catastrophic consequences. H2Safety.ai ensures your designs align with universally accepted safety benchmarks.",
      example: "Designing a hydrogen pipeline? Instantly retrieve best practices for material selection, pressure management, and leak detection systems.",
      Icon: FaTools
    },
    {
      title: "Regulatory Compliance",
      subtitle: "Trained on OSHA PSM, EPA RMP, and Your Local Rules",
      description: "Navigating hydrogen-specific regulatory frameworks can be overwhelming. H2Safety.ai has been trained on over 150,000 pages of documentation.",
      whyItMatters: "Regulatory oversights can shut projects down. H2Safety.ai tracks, interprets, and simplifies compliance requirements so you can focus on execution.",
      example: "Expanding operations in a new state? H2Safety.ai highlights the exact environmental permits and local regulations required.",
      Icon: FaBalanceScale
    },
    {
      title: "Navigating the Project Process",
      subtitle: "Built-in workflows to ensure complete compliance",
      description: "Hydrogen projects involve countless critical steps that must be executed on time. H2Safety.ai includes built-in workflows tailored to every phase of project development.",
      whyItMatters: "Missing key steps can cause months of delays or derail a project entirely. H2Safety.ai keeps your team on track with automated reminders and step-by-step workflows.",
      example: "Developing a new hydrogen facility? H2Safety.ai reminds you to submit water permits, ensures NFPA 2 compliance, and aligns every milestone.",
      Icon: FaSitemap
    },
    {
      title: "Compliance Document Creation",
      subtitle: "Trained on dozens of examples for each document type",
      description: "Compliance document creation is one of the most tedious and time-consuming tasks for hydrogen projects. H2Safety.ai generates customized draft documents using templates and examples.",
      whyItMatters: "Compliance documentation can take weeks of work. H2Safety.ai provides a head start, helping your team deliver accurate and professional documents faster.",
      example: "Need a Process Hazard Analysis (PHA)? H2Safety.ai generates drafts including hazards, risk metrics, and safeguards.",
      Icon: FaFileAlt
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8">Experience H2Safety.ai in Action</h1>
          <div className="aspect-video bg-gray-800 mb-8 rounded-lg flex items-center justify-center">
            {/* Replace with actual video embed */}
            <p className="text-xl">Demo Video Placeholder</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Key Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <UseCase key={index} {...useCase} />
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See More?</h2>
          <p className="text-xl mb-8">Schedule a personalized demo with our team</p>
          {!showDemoForm ? (
            <button
              onClick={() => setShowDemoForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
            >
              Request Demo
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                  required
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                  required
                />
                <textarea
                  placeholder="What days/times work best for your demo? (e.g., Weekdays 2-5pm EST)"
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700 min-h-[100px]"
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDemoForm(false)}
                    className="px-8 py-3 rounded font-semibold border border-gray-600 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
} 