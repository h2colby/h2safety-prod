// pages/threads/index.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/lib/context/UserContext'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import Header from '@/components/Header'

interface Thread {
  id: string
  title: string
  lastModified: any
  messageCount: number
  tags?: string[]
  ownerName?: string
}

interface FilterOptions {
  searchTerm: string
  dateRange: string
  minMessages: number
}

export default function ThreadsPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [threads, setThreads] = useState<Thread[]>([])
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    dateRange: 'all',
    minMessages: 0
  })

  useEffect(() => {
    if (loading) return
    if (!user) {
      setDataLoading(false)
      return
    }

    const q = query(
      collection(db, 'threads'),
      where('ownerId', '==', user.uid),
      orderBy('lastModified', 'desc')
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const threadData: Thread[] = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            lastModified: data.lastModified,
            messageCount: data.messageCount,
            tags: data.tags || [],
            ownerName: data.ownerName
          }
        })
        setThreads(threadData)
        setFilteredThreads(threadData)
        setDataLoading(false)
      },
      (err) => {
        setError(err.message)
        setDataLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, loading])

  useEffect(() => {
    let result = [...threads]
    
    if (filters.searchTerm) {
      result = result.filter(thread => 
        thread.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      switch (filters.dateRange) {
        case 'day':
          cutoff.setDate(now.getDate() - 1)
          break
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setMonth(now.getMonth() - 1)
          break
      }
      result = result.filter(thread => 
        thread.lastModified.toDate() >= cutoff
      )
    }

    if (filters.minMessages > 0) {
      result = result.filter(thread => 
        thread.messageCount >= filters.minMessages
      )
    }

    setFilteredThreads(result)
  }, [filters, threads])

  const handleThreadClick = (threadId: string) => {
    router.push(`/threads/${threadId}`)
  }

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to view your threads.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="p-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Threads</h1>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search threads..."
                  className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
              </div>
              
              <select
                className="px-4 py-2 bg-gray-800 rounded-lg"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="all">All Time</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {dataLoading ? (
            <p>Loading threads...</p>
          ) : filteredThreads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
                  className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-all duration-200 
                           cursor-pointer shadow-md hover:shadow-lg border border-gray-800"
                >
                  <h2 className="text-xl font-semibold mb-3">{thread.title}</h2>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {thread.lastModified?.toDate().toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>💬</span>
                      <span>{thread.messageCount} messages</span>
                    </div>

                    {thread.tags && thread.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>🏷️</span>
                        <div className="flex gap-2">
                          {thread.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No threads found.</p>
          )}
        </div>
      </main>
      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
}
