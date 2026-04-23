import { useState } from 'react'
import './styles/App.scss'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Welcome from './components/Welcome'
import ChatInput from './components/ChatInput'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const res = await fetch('https://mediquery-backend-wb9o.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      const botMessage = {
        role: 'bot',
        text: data.reply || 'No response from server',
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ Failed to connect to server' },
      ])
    }

    setLoading(false)
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