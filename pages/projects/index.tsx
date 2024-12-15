// pages/projects/index.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/context/UserContext'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore'
import Link from 'next/link'
import Header from '@/components/Header'
import { FaFolder, FaSort, FaFilter } from 'react-icons/fa'
import { Tooltip } from '../../components/Tooltip'

interface Project {
  id: string
  projectName: string
  facilityName: string
  status: string
  priority: string
  description: string
  owner: string
  tags: string[]
  updatedAt: any
}

interface SortOption {
  field: keyof Project
  direction: 'asc' | 'desc'
}

export default function ProjectsPage() {
  const { user, loading } = useUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'updatedAt', direction: 'desc' })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    if (loading) return
    if (!user) {
      setDataLoading(false)
      return
    }

    // Set up real-time listener
    const q = query(
      collection(db, 'projects'),
      where('ownerId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projData: Project[] = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          projectName: data.projectName,
          facilityName: data.facilityName,
          status: data.status,
          priority: data.priority,
          description: data.description,
          owner: data.owner,
          tags: data.tags || [],
          updatedAt: data.updatedAt
        }
      })
      setProjects(projData)
      setDataLoading(false)
    }, (err) => {
      setError(err.message)
      setDataLoading(false)
    })

    return () => unsubscribe()
  }, [user, loading])

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-500',
      'Completed': 'bg-blue-500',
      'On Hold': 'bg-yellow-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-green-500'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-500'
  }

  const filteredProjects = projects
    .filter(proj => statusFilter === 'all' || proj.status === statusFilter)
    .filter(proj => priorityFilter === 'all' || proj.priority === priorityFilter)
    .sort((a, b) => {
      if (sortOption.field === 'updatedAt') {
        return sortOption.direction === 'desc' 
          ? b.updatedAt.seconds - a.updatedAt.seconds
          : a.updatedAt.seconds - b.updatedAt.seconds
      }
      return 0
    })

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to view your projects.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="p-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <div className="flex gap-4">
            <select
              className="bg-gray-800 rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
            <select
              className="bg-gray-800 rounded px-3 py-2"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {dataLoading ? (
          <p>Loading projects...</p>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <Link href={`/projects/${proj.id}`} key={proj.id}>
                <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-200 
                              transform hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                  <Tooltip content={proj.description}>
                    <div className="flex items-center gap-3 mb-4">
                      <FaFolder className="text-blue-400" />
                      <h3 className="font-semibold text-lg">{proj.projectName}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Facility: {proj.facilityName}</p>
                      <div className="flex gap-2 mb-2">
                        <span className={`${getStatusColor(proj.status)} px-2 py-1 rounded-full text-xs`}>
                          {proj.status}
                        </span>
                        <span className={`${getPriorityColor(proj.priority)} px-2 py-1 rounded-full text-xs`}>
                          {proj.priority} Priority
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {proj.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-400">
                      <p>Owner: {proj.owner}</p>
                      <p>Updated: {proj.updatedAt.toDate().toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </Tooltip>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No projects found.</p>
        )}
      </main>
      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
}
