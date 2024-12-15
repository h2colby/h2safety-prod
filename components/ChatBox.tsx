// components/ChatBox.tsx
import { useState } from 'react'

interface Message {
  content: string
  role: 'user' | 'assistant'
  timestamp?: any
}

interface ChatBoxProps {
  threadId: string
  initialMessages: Message[]
  userToken?: string
}

export default function ChatBox({ threadId, initialMessages, userToken }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [question, setQuestion] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    // Show the user message immediately
    const userMsg: Message = { content: question, role: 'user' }
    setMessages(prev => [...prev, userMsg])

    const response = await fetch('/api/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userToken, threadId })
    })

    const data = await response.json()
    if (data.answer) {
      const aiMsg: Message = { content: data.answer, role: 'assistant' }
      setMessages(prev => [...prev, aiMsg])
    }

    setQuestion('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'assistant' ? 'text-blue-700' : 'text-black'}`}>
            <strong>{msg.role === 'assistant' ? 'AI' : 'You'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="text"
          placeholder="Ask a question..."
          className="flex-1 border p-2 mr-2"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  )
}
