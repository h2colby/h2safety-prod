// pages/dashboard.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { useUser } from '@/lib/context/UserContext'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import { FiFolder, FiMessageSquare, FiFileText, FiActivity } from 'react-icons/fi'
import { FiX } from 'react-icons/fi'

interface ProjectData {
  projectName: string
  facilityName: string
  status: string
  updatedAt: any
  projectId?: string
  ownerId: string
}

interface Analytics {
  totalProjects: number
  totalThreads: number
  activeProjects: number
}

function CustomModal({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, userData, loading } = useUser()
  const router = useRouter()

  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentProjects, setRecentProjects] = useState<(ProjectData & { id: string })[]>([])
  const [projectName, setProjectName] = useState('')
  const [facilityName, setFacilityName] = useState('')
  const [creatingProject, setCreatingProject] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) return
    if (userData && userData.verified === false) {
      router.replace('/verify')
      return
    }

    async function loadData() {
      if (!user) return
      
      const projectsQuery = query(
        collection(db, 'projects'),
        where('ownerId', '==', user.uid)
      )
      const projectsSnap = await getDocs(projectsQuery)
      const totalProjects = projectsSnap.size
      const activeProjectsCount = projectsSnap.docs.filter(doc => doc.data().status === 'active').length

      const threadsQuery = query(
        collection(db, 'threads'),
        where('ownerId', '==', user.uid)
      )
      const threadsSnap = await getDocs(threadsQuery)
      const totalThreads = threadsSnap.size

      // Fetch only 5 recent projects
      const recentProjectsQuery = query(
        collection(db, 'projects'),
        where('ownerId', '==', user.uid),
        orderBy('updatedAt', 'desc'),
        limit(5)
      )
      const recentSnap = await getDocs(recentProjectsQuery)
      const recentProjectsData = recentSnap.docs.map(doc => {
        const data = doc.data() as ProjectData
        return { ...data, id: doc.id }
      })

      setAnalytics({
        totalProjects,
        totalThreads,
        activeProjects: activeProjectsCount,
      })

      setRecentProjects(recentProjectsData)
    }

    loadData()
  }, [user, userData, loading, router])

  // Function to create a new project
  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to create a project.')
      return
    }

    if (projectName.trim() === '' || facilityName.trim() === '') {
      setError('Please fill in all fields.')
      return
    }

    try {
      setCreatingProject(true)
      setError(null)
      const docRef = await addDoc(collection(db, 'projects'), {
        projectName,
        facilityName,
        ownerId: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      // Clear form and close modal
      setProjectName('')
      setFacilityName('')
      setCreatingProject(false)
      setModalIsOpen(false)

      // Navigate to the newly created project's page
      router.push(`/projects/${docRef.id}`)
    } catch (err: any) {
      setError(err.message)
      setCreatingProject(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 container mx-auto max-w-7xl">
        {/* Analytics Overview */}
        <h2 className="text-xl font-semibold mb-4 sm:mb-6">Analytics Overview</h2>
        {analytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg flex items-center">
              <FiFolder className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Total Projects</h3>
                <p className="text-xl sm:text-2xl font-bold">{analytics.totalProjects}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg flex items-center">
              <FiMessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Total Threads</h3>
                <p className="text-xl sm:text-2xl font-bold">{analytics.totalThreads}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg flex items-center">
              <FiActivity className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Active Projects</h3>
                <p className="text-xl sm:text-2xl font-bold">{analytics.activeProjects}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 sm:mb-12">Loading analytics...</div>
        )}

        {/* Recent Projects Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setModalIsOpen(true)}
                className="px-4 sm:px-6 py-2 bg-[#007BFF] rounded hover:bg-[#0056b3] transition-colors duration-300 whitespace-nowrap"
              >
                Start New Project
              </button>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded bg-gray-800 w-full sm:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="grid gap-4 mb-6">
            {recentProjects
              .filter(project => 
                project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.facilityName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((proj) => (
                <li 
                  key={proj.id} 
                  className="bg-[#1E1E2E] p-4 sm:p-6 rounded-lg transition-all duration-300 hover:bg-[#29293D] hover:shadow-lg group list-none"
                >
                  <Link href={`/projects/${proj.id}`} className="block">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="w-full sm:w-auto">
                        <span className="font-semibold text-base sm:text-lg group-hover:text-[#007BFF] transition-colors duration-300 block mb-2">
                          {proj.projectName}
                        </span>
                        <p className="text-gray-400 text-sm">
                          Facility: {proj.facilityName}
                        </p>
                      </div>
                      <span className="text-sm self-start">
                        {proj.status === 'active' ? 
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/30 text-green-400">
                            Active
                          </span> : 
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900/30 text-gray-400">
                            Inactive
                          </span>
                        }
                      </span>
                    </div>
                    {proj.updatedAt && (
                      <p className="text-sm text-gray-500 mt-3 group-hover:text-gray-400">
                        Last updated: {proj.updatedAt.toDate().toLocaleString()}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
          </div>

          {/* View Active Threads button */}
          <div className="flex justify-end">
            <Link 
              href="/threads"
              className="px-4 sm:px-6 py-2 bg-[#007BFF] rounded hover:bg-[#0056b3] transition-colors duration-300"
            >
              View Active Threads
            </Link>
          </div>
        </div>

        {/* Modal for Create New Project */}
        <CustomModal
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create a New Project</h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleCreateProject} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label className="block mb-1 font-semibold">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-2 bg-gray-800 text-white"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Facility Name</label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-2 bg-gray-800 text-white"
                placeholder="Enter facility name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#007BFF] hover:bg-[#0056b3] transition-colors duration-300"
                disabled={creatingProject}
              >
                {creatingProject ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </CustomModal>
        
        {/* Quick H2Safety.ai Chat removed */}
      </main>

      <footer className="p-4 sm:p-6 text-center text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
}
