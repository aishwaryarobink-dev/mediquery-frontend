import '../styles/App.scss'
import { useState } from 'react'

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    onSend(text)
    setText('')
  }

  return (
    <form className="inputWrapper" onSubmit={handleSubmit}>
      <div className="inputContainer">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a medical question..."
        />

        <button type="submit">
          ➤
        </button>
      </div>
    </form>
  )
}

export default ChatInput