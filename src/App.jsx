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
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let result = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split("\n")

    for (let line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "")

        if (data === "[DONE]") break

        try {
          const parsed = JSON.parse(data)
          result += parsed.text || ""
        } catch {}
      }
    }
  }

  return result
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