import { useState } from 'react'
import './styles/App.scss'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Welcome from './components/Welcome'
import ChatInput from './components/ChatInput'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/chat'
const sendMessage = async (text) => {
  if (!text.trim()) return

  const userMessage = { role: 'user', content: text }

  setMessages((prev) => [...prev, userMessage, { role: 'bot', content: '' }])

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    })

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

          if (data === '[DONE]') return

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
  } catch (err) {
    console.error(err)
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