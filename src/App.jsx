import { useState, useEffect, useRef } from 'react'
import './styles/App.scss'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Welcome from './components/Welcome'
import ChatInput from './components/ChatInput'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'https://mediquery-backend-wb9o.onrender.com/api/chat'
  const messagesRef = useRef([])
const chatRef = useRef(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }

    // Get complete conversation history (only messages with content)
    const conversationHistory = messagesRef.current.filter(
      (m) => m.content && m.content.trim() !== ''
    )
    const messagesToSend = [...conversationHistory, userMessage]

    // Add user message and empty assistant placeholder to UI
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: 'assistant', content: '' },
    ])
    setLoading(true)

    await handleStreamResponse(messagesToSend)
  }
  const handleStreamResponse = async (conversationMessages) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationMessages,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let botText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Split complete SSE messages
        const parts = buffer.split('\n\n')

        // Keep last incomplete part in buffer
        buffer = parts.pop()

        for (let part of parts) {
          if (part.startsWith('data: ')) {
            const data = part.replace('data: ', '').trim()

            if (data === '[DONE]') {
              setLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)

              if (parsed.text) {
  for (let char of parsed.text) {
  botText += char

  await new Promise((res) => setTimeout(res, 15)) 

  setMessages((prev) => {
    const updated = [...prev]
    updated[updated.length - 1] = {
      role: 'assistant',
      content: botText,
    }
    return updated
  })
}
}
            } catch (e) {
              console.error('Parse error:', e, data)
            }
          }
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Chat error:', err)

      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Error: ${err.message}`,
        }
        return updated
      })

      setLoading(false)
    }
  }
  useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }
}, [messages])

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Topbar />

        {messages.length === 0 ? (
          <Welcome onSelect={sendMessage} />
        ) : (
          <div className="chatArea" ref={chatRef}>
            {messages.map((msg, index) => { 
              if(msg.role ===  'assistant' && !msg.content.trim()) return null; // Skip empty assistant messages
              return (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="bubble">
                    {msg.content}
                    {msg.role === 'assistant' &&
 msg.content &&
 loading &&
 index === messages.length - 1 && (
  <span className={`cursor ${loading ? '' : 'blink'}`}></span>
)}
                  </div>
              </div>
            )})} 

            {loading && messages[messages.length - 1]?.content === '' &&
              (
                <div className="message assistant">
                  <div className="bubble typing-text">
                    Thinking...
                  </div>
</div>
              )}
          </div>
        )}

        <ChatInput onSend={sendMessage} />
      </main>
    </div>
  )
}

export default App