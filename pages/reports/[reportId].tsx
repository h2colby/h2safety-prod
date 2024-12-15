import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUser } from '@/lib/context/UserContext'
import ReactMarkdown from 'react-markdown'

export default function ReportPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { reportId } = router.query

  const [report, setReport] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingReport, setLoadingReport] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      setError('Please log in to view this report.')
      setLoadingReport(false)
      return
    }

    // Ensure reportId is a single string
    if (!reportId || Array.isArray(reportId)) {
      setError('Invalid report ID')
      setLoadingReport(false)
      return
    }

    const rid = reportId

    async function loadReport() {
      try {
        const docRef = doc(db, 'reports', rid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setReport(snap.data())
          setError(null)
        } else {
          setError('Report not found')
        }
      } catch (err: any) {
        setError(err.message || 'Error loading report')
      } finally {
        setLoadingReport(false)
      }
    }

    loadReport()
  }, [user, loading, reportId])

  if (loadingReport) return <div className="p-8 text-white bg-black">Loading report...</div>
  if (error) return <div className="p-8 text-white bg-black">{error}</div>
  if (!report) return <div className="p-8 text-white bg-black">Report not found</div>

  async function handleDownload(format: 'docx' | 'pdf') {
    if (!reportId || Array.isArray(reportId)) return
    const rid = reportId

    const response = await fetch(`/api/reports/download-${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textContent: report.content })
    })

    if (!response.ok) {
      alert('Error downloading report')
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${rid}.${format}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{report.title}</h1>
        <div className="space-x-2">
          <button
            onClick={() => handleDownload('docx')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Download as DOCX
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Download as PDF
          </button>
        </div>
      </div>
      <p>Type: {report.type}</p>
      <p>Project ID: {report.projectId}</p>
      
      <div className="mt-4 prose prose-invert max-w-none">
        <ReactMarkdown>{report.content}</ReactMarkdown>
      </div>
    </div>
  )
}
