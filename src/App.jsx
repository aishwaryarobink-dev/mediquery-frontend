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
  setMessages((prev) => [...prev, userMessage])

  // 👇 Add empty bot message (we'll fill it live)
  let botMessage = { role: 'bot', content: '' }
  setMessages((prev) => [...prev, botMessage])

  try {
    const response = await fetch('https://mediquery-backend-wb9o.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading

      const chunk = decoder.decode(value || new Uint8Array())
      const lines = chunk.split('\n')

      for (let line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '').trim()

          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)

            if (parsed.text) {
              botMessage.content += parsed.text

              // 👇 Update last message live
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { ...botMessage }
                return updated
              })
            }
          } catch (err) {
            console.error('Parse error:', err)
          }
        }
      }
    }
  } catch (err) {
    console.error(err)

    setMessages((prev) => [
      ...prev,
      { role: 'bot', content: '⚠️ Error connecting to server' },
    ])
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
                {msg.text}
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