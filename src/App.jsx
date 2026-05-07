import React, { useState, useRef, useEffect, useCallback } from 'react'
import Sidebar         from './components/Sidebar.jsx'
import Topbar          from './components/Topbar.jsx'
import MessageBubble   from './components/MessageBubble.jsx'
import ChatInput       from './components/ChatInput.jsx'
import WelcomeScreen   from './components/WelcomeScreen.jsx'
import DisclaimerBar   from './components/DisclaimerBar.jsx'
import TypingIndicator from './components/TypingIndicator.jsx'
import { useChat }     from './hooks/useChat.js'
import styles          from './App.module.scss'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesAreaRef = useRef(null)

  const {
    messages, input, setInput,
    isStreaming, sendMessage, stopStreaming, clearMessages,
  } = useChat()

  // Auto-scroll to bottom on new content
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      block: 'end',
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback((text) => {
    sendMessage(text)
    setSidebarOpen(false)
  }, [sendMessage])

  const handleSuggest = useCallback((question) => {
    setInput(question)
    setSidebarOpen(false)
  }, [setInput])

  // Show typing indicator only when first AI message chunk hasn't arrived yet
  const lastMsg = messages[messages.length - 1]
  const showTyping = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === ''

  // Close sidebar on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className={styles.root}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        messages={messages}
        onClear={clearMessages}
        onSuggest={handleSuggest}
      />

      {/* ── Main area ────────────────────────────────────────── */}
      <main className={styles.main}>
        {/* Topbar */}
        <Topbar
          onMenuOpen={() => setSidebarOpen(true)}
          onClear={clearMessages}
          hasMessages={messages.length > 0}
        />

        {/* Disclaimer strip */}
        {messages.length > 0 && <DisclaimerBar />}

        {/* Messages or Welcome */}
        <div className={styles.messagesArea} ref={messagesAreaRef}>
          {messages.length === 0 ? (
            <WelcomeScreen onSuggest={handleSuggest} />
          ) : (
            <div className={styles.messagesList}>
              {messages.map((msg) => {
                if (msg.role === 'assistant' && msg.content === '' && msg.streaming) {
      return null;}
     return <MessageBubble key={msg.id} message={msg} />
})}
              {showTyping && <TypingIndicator />}
              <div ref={messagesEndRef} className={styles.anchor} />
            </div>
          )}
        </div>

        {/* Suggested quick chips when no messages */}
        {messages.length === 0 && (
          <div className={styles.quickBarWrap}>
            <div className={styles.quickBar}>
              {[
                'Type 2 diabetes symptoms?',
                'Lower blood pressure naturally?',
                'Cold vs flu differences?',
                'Vitamin D deficiency signs?',
              ].map((q, i) => (
                <button
                  key={i}
                  className={styles.quickChip}
                  onClick={() => handleSuggest(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className={styles.inputArea}>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={stopStreaming}
            isStreaming={isStreaming}
          />
        </div>
      </main>
    </div>
  )
}
