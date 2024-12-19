// pages/thread/[threadId].tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/lib/context/UserContext'
import { v4 as uuidv4 } from 'uuid'
import Header from '@/components/Header'
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase' // Client SDK Firestore instance
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

type ProjectData = {
  projectName: string;
  status: string;
  projectPriority: string;
  facilityName?: string;
  description?: string;
  complianceDeadline?: {
    toDate: () => Date;
  };
  createdAt?: {
    toDate: () => Date;
  };
  updatedAt?: {
    toDate: () => Date;
  };
}

const RAG_SERVICE_URL = process.env.NEXT_PUBLIC_RAG_SERVICE_URL || 'http://34.28.61.219:5002/ask';
const FETCH_TIMEOUT = 60000; // 60 seconds timeout

const fetchWithTimeout = async (resource: string, options: RequestInit & { timeout?: number } = {}) => {
  const { timeout = FETCH_TIMEOUT } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out after ' + (timeout / 1000) + ' seconds. The AI service might be busy.');
    }
    throw error;
  }
};

const markdownStyles = {
  message: `
    prose prose-invert
    [&>:first-child]:mt-0
    [&>:last-child]:mb-0
  `,
  heading: `
    text-blue-300 font-bold
    [&.h1]:text-xl [&.h2]:text-lg [&.h3]:text-base
    mb-2
  `,
  paragraph: `
    text-gray-100 mb-2
  `,
  list: `
    list-disc list-inside mb-2 space-y-1
  `,
  listItem: `
    text-gray-100
  `,
  link: `
    text-blue-400 hover:text-blue-300 underline
  `,
  code: `
    bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-200
  `,
  codeBlock: `
    bg-gray-800 p-3 rounded-lg font-mono text-sm text-gray-200 overflow-x-auto
  `,
  blockquote: `
    border-l-4 border-gray-700 pl-4 italic text-gray-300
  `,
  table: `
    w-full border-collapse mb-2
  `,
  tableCell: `
    border border-gray-700 px-3 py-1
  `,
  tableHeader: `
    bg-gray-800 font-bold
  `,
}

export default function ThreadPage() {
  const { user, userData, loading } = useUser()
  const router = useRouter()
  const { threadId } = router.query

  const [thread, setThread] = useState<any>(null)
  const [threadError, setThreadError] = useState<string | null>(null)
  const [threadLoading, setThreadLoading] = useState(true)

  const [project, setProject] = useState<ProjectData | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)

  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  const [insightsContent, setInsightsContent] = useState<string | null>(null)

  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const [addingInsight, setAddingInsight] = useState(false)
  const [addInsightSuccess, setAddInsightSuccess] = useState<string | null>(null)
  const [addInsightError, setAddInsightError] = useState<string | null>(null)

  useEffect(() => {
    console.log('RAG Service URL:', RAG_SERVICE_URL);
    
    // Test connection with 5 second timeout
    fetchWithTimeout(RAG_SERVICE_URL.replace('/ask', '/test'), { 
      method: 'GET',
      timeout: 5000 // 5 second timeout for test
    })
      .then(() => console.log('RAG service is accessible'))
      .catch(error => {
        if (error.message.includes('timed out')) {
          console.warn('RAG service test timed out - service might be slow to respond');
        } else {
          console.warn('RAG service check failed:', error);
        }
      });
  }, []);

  useEffect(() => {
    if (loading) return
    if (!user) {
      setThreadError('Please log in to view this thread.')
      setThreadLoading(false)
      return
    }

    if (typeof threadId !== 'string') {
      setThreadError('Invalid thread ID')
      setThreadLoading(false)
      return
    }

    const tid = threadId
    const threadRef = doc(db, 'threads', tid)
    const unsub = onSnapshot(threadRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setThread(data)
        setThreadError(null)
        setThreadLoading(false)
      } else {
        setThreadError('Thread not found')
        setThreadLoading(false)
      }
    }, (error) => {
      setThreadError(error.message)
      setThreadLoading(false)
    })

    return () => unsub()
  }, [user, loading, threadId])

  useEffect(() => {
    if (!thread || !user || !thread.projectId || typeof thread.projectId !== 'string') {
      setProjectLoading(false)
      return
    }

    const pid = thread.projectId
    const projectRef = doc(db, 'projects', pid)
    const unsubProject = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        const projectData: ProjectData = {
          projectName: data.projectName || '',
          status: data.status || '',
          projectPriority: data.projectPriority || '',
          facilityName: data.facilityName,
          description: data.description,
          complianceDeadline: data.complianceDeadline,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        }
        setProject(projectData)
      } else {
        console.warn('Project not found for this thread')
      }
      setProjectLoading(false)
    }, (error) => {
      console.error('Error loading project:', error.message)
      setProjectLoading(false)
    })

    return () => unsubProject()
  }, [thread, user])

  if (threadLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="p-8">Loading thread...</div>
      </div>
    )
  }

  if (threadError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="p-8">{threadError}</div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="p-8">Thread not found</div>
      </div>
    )
  }

  async function handleSendMessage(content: string, sender: 'user'|'ai') {
    if (typeof threadId !== 'string') return
    await fetch('/api/messages/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, content, sender })
    })
  }

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Input validation
    if (!chatInput.trim()) {
      setChatError('Please enter a message')
      return
    }

    if (typeof threadId !== 'string') {
      setChatError('Invalid thread ID')
      return
    }

    // Clear previous states
    setChatError(null)
    setChatLoading(true)
    const userMessage = chatInput.trim()
    setChatInput('')

    try {
      // Add user's message
      await handleSendMessage(userMessage, 'user')

      // Query the RAG service with timeout and better error handling
      const res = await fetchWithTimeout(RAG_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
        timeout: FETCH_TIMEOUT
      }).catch((error) => {
        console.error('Fetch error details:', error);
        
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network.');
        }
        
        // More specific error for CORS issues
        if (error.message.includes('CORS')) {
          throw new Error('Unable to connect due to CORS policy. Please check the RAG service configuration.');
        }
        
        // Handle connection refused errors
        if (error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
          throw new Error(
            `Unable to connect to RAG service at ${RAG_SERVICE_URL}. ` +
            'Please ensure the service is running and accessible.'
          );
        }
        
        throw new Error(`Connection error: ${error.message}`);
      });

      // Handle non-200 responses
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        console.error('RAG service error:', errorText);
        throw new Error(
          `Server error (${res.status}): ${
            res.status === 404 ? 'RAG service not found' :
            res.status === 502 ? 'RAG service is unavailable' :
            errorText || 'Unknown error'
          }`
        );
      }

      const data = await res.json().catch(() => {
        throw new Error('Invalid response from RAG service');
      });

      // Handle server-side errors
      if (data.error) {
        console.error('RAG service returned error:', data.error);
        throw new Error(data.error);
      }

      // Use final_response or fallback
      const aiMessage = data.final_response || 'I apologize, but I was unable to generate a response.';
      
      await handleSendMessage(aiMessage, 'ai');
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError(
        err.message === 'Failed to fetch' 
          ? 'Unable to connect to the AI service. Please check if the service is running.'
          : err.message || 'Failed to get response from AI service'
      );
      
      // Add the error message to the chat as a system message
      await handleSendMessage(
        'Sorry, I encountered an error while processing your request. Please try again later.',
        'ai'
      ).catch(console.error);
    } finally {
      setChatLoading(false);
    }
  }

  async function handleGenerateReport(type: 'summary' | 'communication' | 'comprehensive' | 'custom', customPrompt?: string) {
    setReportLoading(true);
    setReportError(null);
    setReportContent(null);

    if (!thread || typeof threadId !== 'string') {
      setReportError('Thread or threadId not ready yet.');
      setReportLoading(false);
      return;
    }

    if (!thread.projectId || typeof thread.projectId !== 'string') {
      setReportError('thread.projectId not ready yet.');
      setReportLoading(false);
      return;
    }

    try {
      const endpoint = type === 'comprehensive' 
        ? '/api/reports/multistep-generate'
        : '/api/reports/generate';

      const body = {
        projectId: thread.projectId,
        threadId,
        ...(type !== 'comprehensive' && { reportType: type }),
        ...(customPrompt && { customPrompt })
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error generating report: ${text}`);
      }

      const result = await res.json();
      setReportContent(result.content);
    } catch (err: any) {
      console.error('Error generating report:', err);
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  }

  async function handleCustomReport() {
    setIsModalOpen(true);
  }

  async function handleInsightClick(type: string) {
    if (typeof threadId !== 'string') {
      alert('Invalid thread ID for insights generation')
      return
    }

    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, insightType: type })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error generating insights: ${text}`)
      }
      const data = await res.json()
      setInsightsContent(data.content || `No insights returned for ${type}.`)
    } catch (err: any) {
      setInsightsContent(null)
      alert(err.message)
    }
  }

  async function addInsightToMessages() {
    if (!insightsContent || !threadId || typeof threadId !== 'string') {
      setAddInsightError('No insight available to add.')
      return
    }

    setAddingInsight(true)
    setAddInsightError(null)
    setAddInsightSuccess(null)

    try {
      const threadRef = doc(db, 'threads', threadId)
      const newMessage = {
        id: uuidv4(),
        sender: 'insight',
        content: insightsContent,
        timestamp: Date.now(),
      }

      await updateDoc(threadRef, {
        messages: arrayUnion(newMessage),
      })

      setAddInsightSuccess('Insight added to messages successfully!')
    } catch (err: any) {
      console.error('Error adding insight to messages:', err)
      setAddInsightError('Failed to add insight to messages: ' + err.message)
    } finally {
      setAddingInsight(false)
    }
  }

  const messages = thread.messages || []
  const isOwner = user && user.uid === thread.ownerId

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not Set';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'completed':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Insights Sidebar */}
      <aside className="w-64 bg-gray-900 p-4 border-r border-gray-800 sticky top-0 h-screen overflow-y-auto">
        <h2 className="font-semibold mb-4">Insights</h2>
        <div className="space-y-2 mb-4">
          <button
            className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
            onClick={() => handleInsightClick('Code References')}
          >
            Code References
          </button>
          <button
            className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
            onClick={() => handleInsightClick('Recommended Actions')}
          >
            Recommended Actions
          </button>
          <button
            className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
            onClick={() => handleInsightClick('General Insights')}
          >
            General Insights
          </button>
        </div>
        {insightsContent && (
          <div className="bg-gray-800 p-4 rounded mt-4">
            <button
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 
                        text-white px-4 py-2 rounded transition-colors duration-200
                        disabled:cursor-not-allowed flex items-center justify-center"
              onClick={addInsightToMessages}
              disabled={addingInsight}
            >
              {addingInsight ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Insight to Messages'
              )}
            </button>

            {addInsightSuccess && (
              <div className="mb-4 p-2 bg-green-900 bg-opacity-20 text-green-400 text-sm rounded">
                {addInsightSuccess}
              </div>
            )}
            
            {addInsightError && (
              <div className="mb-4 p-2 bg-red-900 bg-opacity-20 text-red-400 text-sm rounded">
                {addInsightError}
              </div>
            )}

            <h3 className="font-semibold mb-2">Generated Insights</h3>
            <div className="text-sm text-gray-200">
              <ReactMarkdown
                className={markdownStyles.message}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  h1: ({node, ...props}) => <h1 className={`${markdownStyles.heading} h1`} {...props} />,
                  h2: ({node, ...props}) => <h2 className={`${markdownStyles.heading} h2`} {...props} />,
                  h3: ({node, ...props}) => <h3 className={`${markdownStyles.heading} h3`} {...props} />,
                  p: ({node, ...props}) => <p className={markdownStyles.paragraph} {...props} />,
                  ul: ({node, ...props}) => <ul className={markdownStyles.list} {...props} />,
                  ol: ({node, ...props}) => <ol className={`${markdownStyles.list} list-decimal`} {...props} />,
                  li: ({node, ...props}) => <li className={markdownStyles.listItem} {...props} />,
                  a: ({node, ...props}) => <a className={markdownStyles.link} target="_blank" rel="noopener noreferrer" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className={markdownStyles.code} {...props} />
                    ) : (
                      <code className={markdownStyles.codeBlock} {...props} />
                    ),
                  blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                  table: ({node, ...props}) => <table className={markdownStyles.table} {...props} />,
                  td: ({node, ...props}) => <td className={markdownStyles.tableCell} {...props} />,
                  th: ({node, ...props}) => <th className={`${markdownStyles.tableCell} ${markdownStyles.tableHeader}`} {...props} />,
                }}
              >
                {insightsContent}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
          {project && (
            <div className="flex flex-wrap gap-6 items-center mb-6 bg-gray-900 p-4 rounded">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <span className={getStatusColor(project.status)}>
                  {project.status || 'Not Set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Priority:</span>
                <span className="font-medium">
                  {project.projectPriority || 'Not Set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Compliance Deadline:</span>
                <span>
                  {formatDate(project.complianceDeadline?.toDate())}
                </span>
              </div>
            </div>
          )}
          {thread.lastModified && thread.lastModified.toDate &&
            <p className="text-sm text-gray-400 mb-2">
              Last Modified: {new Date(thread.lastModified.toDate()).toLocaleString()}
            </p>
          }
          <p className="text-sm text-gray-400 mb-8">
            Messages: {thread.messageCount || messages.length || 0}
          </p>

          <hr className="my-8 border-gray-700" />

          {/* Generate Reports Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold 
                          py-2 px-6 rounded-lg shadow-md transition-all duration-200 
                          transform hover:scale-105 hover:shadow-lg hover:from-blue-600 
                          hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                          disabled:hover:scale-100 disabled:hover:shadow-md"
                onClick={() => handleGenerateReport('comprehensive')}
                disabled={reportLoading}
              >
                Comprehensive Report
              </button>

              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold 
                          py-2 px-6 rounded-lg shadow-md transition-all duration-200 
                          transform hover:scale-105 hover:shadow-lg hover:from-blue-600 
                          hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                          disabled:hover:scale-100 disabled:hover:shadow-md"
                onClick={() => handleGenerateReport('summary')}
                disabled={reportLoading}
              >
                Summary Report
              </button>

              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold 
                          py-2 px-6 rounded-lg shadow-md transition-all duration-200 
                          transform hover:scale-105 hover:shadow-lg hover:from-blue-600 
                          hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                          disabled:hover:scale-100 disabled:hover:shadow-md"
                onClick={() => handleGenerateReport('communication')}
                disabled={reportLoading}
              >
                Communication Summary
              </button>

              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold 
                          py-2 px-6 rounded-lg shadow-md transition-all duration-200 
                          transform hover:scale-105 hover:shadow-lg hover:from-blue-600 
                          hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                          disabled:hover:scale-100 disabled:hover:shadow-md"
                onClick={handleCustomReport}
                disabled={reportLoading}
              >
                Custom Report
              </button>
            </div>

            {reportLoading && (
              <div className="text-gray-400 mt-4 flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating report...
              </div>
            )}

            {reportError && (
              <div className="text-red-500 mt-4 p-3 bg-red-900 bg-opacity-20 rounded-lg">
                Error: {reportError}
              </div>
            )}

            {reportContent && (
              <div className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                <h4 className="text-lg font-medium mb-3 text-blue-400">Generated Report</h4>
                <ReactMarkdown
                  className={markdownStyles.message}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    h1: ({node, ...props}) => <h1 className={`${markdownStyles.heading} h1`} {...props} />,
                    h2: ({node, ...props}) => <h2 className={`${markdownStyles.heading} h2`} {...props} />,
                    h3: ({node, ...props}) => <h3 className={`${markdownStyles.heading} h3`} {...props} />,
                    p: ({node, ...props}) => <p className={markdownStyles.paragraph} {...props} />,
                    ul: ({node, ...props}) => <ul className={markdownStyles.list} {...props} />,
                    ol: ({node, ...props}) => <ol className={`${markdownStyles.list} list-decimal`} {...props} />,
                    li: ({node, ...props}) => <li className={markdownStyles.listItem} {...props} />,
                    a: ({node, ...props}) => <a className={markdownStyles.link} target="_blank" rel="noopener noreferrer" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code className={markdownStyles.code} {...props} />
                      ) : (
                        <code className={markdownStyles.codeBlock} {...props} />
                      ),
                    blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                    table: ({node, ...props}) => <table className={markdownStyles.table} {...props} />,
                    td: ({node, ...props}) => <td className={markdownStyles.tableCell} {...props} />,
                    th: ({node, ...props}) => <th className={`${markdownStyles.tableCell} ${markdownStyles.tableHeader}`} {...props} />,
                  }}
                >
                  {reportContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <hr className="my-8 border-gray-700" />

          {/* Messages and Chat Section */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-lg mb-8">
            {/* Messages Area */}
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg: any) => {
                    const isAI = msg.sender === 'ai';
                    const msgTime = msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : 'Unknown time';

                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[80%] ${
                            isAI 
                              ? 'bg-gray-800 rounded-tr-2xl' 
                              : 'bg-blue-600 rounded-tl-2xl'
                          } rounded-2xl p-4 shadow-md`}
                        >
                          {isAI ? (
                            <ReactMarkdown
                              className={markdownStyles.message}
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw, rehypeSanitize]}
                              components={{
                                h1: ({node, ...props}) => <h1 className={`${markdownStyles.heading} h1`} {...props} />,
                                h2: ({node, ...props}) => <h2 className={`${markdownStyles.heading} h2`} {...props} />,
                                h3: ({node, ...props}) => <h3 className={`${markdownStyles.heading} h3`} {...props} />,
                                p: ({node, ...props}) => <p className={markdownStyles.paragraph} {...props} />,
                                ul: ({node, ...props}) => <ul className={markdownStyles.list} {...props} />,
                                ol: ({node, ...props}) => <ol className={`${markdownStyles.list} list-decimal`} {...props} />,
                                li: ({node, ...props}) => <li className={markdownStyles.listItem} {...props} />,
                                a: ({node, ...props}) => <a className={markdownStyles.link} target="_blank" rel="noopener noreferrer" {...props} />,
                                code: ({node, inline, ...props}) => 
                                  inline ? (
                                    <code className={markdownStyles.code} {...props} />
                                  ) : (
                                    <code className={markdownStyles.codeBlock} {...props} />
                                  ),
                                blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                                table: ({node, ...props}) => <table className={markdownStyles.table} {...props} />,
                                td: ({node, ...props}) => <td className={markdownStyles.tableCell} {...props} />,
                                th: ({node, ...props}) => <th className={`${markdownStyles.tableCell} ${markdownStyles.tableHeader}`} {...props} />,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-white whitespace-pre-wrap">{msg.content}</p>
                          )}
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <span>{isAI ? 'AI Assistant' : 'You'}</span>
                            <span>{msgTime}</span>
                            {isOwner && !isAI && (
                              <button
                                className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                                onClick={() => {
                                  // handleDeleteMessage logic
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-4 border-t border-gray-700">
                {chatError && (
                  <div className="mt-2 text-sm text-red-500 bg-red-900 bg-opacity-20 p-2 rounded flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {chatError}
                  </div>
                )}
                <form 
                  onSubmit={handleChatSubmit} 
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className={`w-full bg-gray-800 text-white border ${
                        chatError ? 'border-red-500' : 'border-gray-700'
                      } rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 placeholder-gray-400 transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder={chatLoading ? "Processing..." : "Type your message..."}
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                                text-blue-400 hover:text-blue-300 disabled:text-gray-600 
                                disabled:cursor-not-allowed transition-colors duration-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                      title={chatLoading ? "Processing..." : "Send message"}
                    >
                      {chatLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 transform transition-transform duration-200 hover:scale-110" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} H2Safety.ai
        </footer>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">
              Enter Your Custom Report Requirements
            </h2>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type your requirements here..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500"
              rows={6}
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCustomInput('');
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 
                         text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleGenerateReport('custom', customInput);
                  setIsModalOpen(false);
                  setCustomInput('');
                }}
                disabled={reportLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
                         text-white rounded transition-colors 
                         disabled:bg-blue-800 disabled:cursor-not-allowed"
              >
                {reportLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}