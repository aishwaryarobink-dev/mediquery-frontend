import { useState } from 'react'
import './styles/App.scss'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Welcome from './components/Welcome'
import ChatInput from './components/ChatInput'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'https://mediquery-backend-wb9o.onrender.com/api/chat'

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }

    setMessages((prev) => [...prev, userMessage, { role: 'bot', content: '' }])
    setLoading(true)

    console.log('Sending to:', API_URL)
    console.log('Messages:', [...messages, userMessage])

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let botText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (let line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim()

            if (data === '[DONE]') {
              setLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)

              if (parsed.text) {
                botText += parsed.text

                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'bot',
                    content: botText,
                  }
                  return updated
                })
              }
            } catch {}
          }
        }
      }
      setLoading(false)
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => {
        const updated = [...prev]
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            role: 'bot',
            content: `Error: ${err.message}. Check backend CORS settings and ensure /api/chat endpoint exists.`,
          }
        }
        return updated
      })
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Topbar />

        {/* MAIN CONTENT */}
        {messages.length === 0 ? (
          <Welcome onSelect={sendMessage} />
        ) : (
          <div className="chatArea">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}

            {loading && <div className="typing">Typing...</div>}
          </div>
        )}

        <ChatInput onSend={sendMessage} />
      </main>
    </div>
  )
}

export default App