// pages/reports/index.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useUser } from '@/lib/context/UserContext'
import Header from '@/components/Header' // Shared header component

interface Report {
  id: string;
  title: string;
  content: string;
  type: string;
  projectId: string;
  createdAt?: any;
  userId?: string;
}

export default function ReportsPage() {
  const { user, loading } = useUser()
  const [reports, setReports] = useState<Report[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingReports, setLoadingReports] = useState(true)

  // State for editing a report (title only)
  const [editingReportId, setEditingReportId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) {
      setError('Please log in to view reports.')
      setLoadingReports(false)
      return
    }

    async function loadReports() {
      try {
        const snap = await getDocs(collection(db, 'reports'))
        const reportsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Report[]
        setReports(reportsData)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Error loading reports')
      } finally {
        setLoadingReports(false)
      }
    }

    loadReports()
  }, [user, loading])

  async function handleDelete(reportId: string) {
    if (!confirm('Are you sure you want to delete this report?')) return
    try {
      const res = await fetch('/api/reports/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error deleting report: ${text}`)
      }
      setReports((prev) => prev.filter((r) => r.id !== reportId))
      alert('Report deleted successfully!')
    } catch (err: any) {
      alert(err.message)
    }
  }

  function startEditing(report: Report) {
    setEditingReportId(report.id)
    setEditTitle(report.title)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingReportId) return

    try {
      const res = await fetch('/api/reports/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: editingReportId, title: editTitle })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error updating report: ${text}`)
      }

      setReports((prev) => prev.map((r) =>
        r.id === editingReportId ? { ...r, title: editTitle } : r
      ))
      setEditingReportId(null)
      setEditTitle('')
      alert('Report updated successfully!')
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function handleDownload(reportId: string, format: 'pdf' | 'docx') {
    // Call the download endpoint
    // The endpoint could be a GET request with ?reportId=... or a POST request
    // Assuming GET for simplicity:
    const res = await fetch(`/api/reports/download-${format}?reportId=${reportId}`)
    if (!res.ok) {
      const text = await res.text()
      alert(`Error downloading report: ${text}`)
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${reportId}.${format}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (loadingReports) return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="p-8">Loading reports...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="p-8">{error}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="p-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        {reports.length > 0 ? (
          <ul className="space-y-2">
            {reports.map((report) => {
              const firstLine = report.content.split('\n')[0] || ''
              const truncatedContent = firstLine.slice(0, 100) + (firstLine.length > 100 ? '...' : '')

              return (
                <li key={report.id} className="bg-gray-900 p-4 rounded hover:bg-gray-800 transition">
                  {editingReportId === report.id ? (
                    <form onSubmit={handleUpdate}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border border-gray-700 p-2 mb-2 w-full text-black"
                        placeholder="Title"
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                        Save
                      </button>
                      <button type="button" className="underline text-white" onClick={() => setEditingReportId(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <Link href={`/reports/${report.id}`}>
                        <span className="font-semibold hover:underline cursor-pointer">{report.title}</span>
                      </Link>
                      <p className="text-sm text-gray-400">Type: {report.type}</p>
                      <p className="text-sm text-gray-400">Project ID: {report.projectId}</p>
                      <p className="text-sm text-gray-400">Content: {truncatedContent}</p>
                      <div className="mt-2 flex gap-4 items-center">
                        <button
                          onClick={() => startEditing(report)}
                          className="underline text-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="underline text-red-400"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleDownload(report.id, 'pdf')}
                          className="underline text-green-400"
                        >
                          Download PDF
                        </button>
                        <button
                          onClick={() => handleDownload(report.id, 'docx')}
                          className="underline text-green-400"
                        >
                          Download DOCX
                        </button>
                      </div>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p>No reports found.</p>
        )}
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
}
