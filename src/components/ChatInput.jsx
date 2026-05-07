import React, { useRef, useEffect, useCallback } from 'react'
import styles from './ChatInput.module.scss'

const MAX_ROWS = 5

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
}

export default function ChatInput({ value, onChange, onSend, onStop, isStreaming, disabled }) {
  const textareaRef = useRef(null)

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const lineH = parseInt(getComputedStyle(ta).lineHeight)
    const maxH  = lineH * MAX_ROWS + 24
    ta.style.height = Math.min(ta.scrollHeight, maxH) + 'px'
  }, [])

  useEffect(() => { adjustHeight() }, [value, adjustHeight])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isStreaming) { onStop(); return }
      if (value.trim()) onSend(value)
    }
  }

  const charCount = value.length
  const nearLimit = charCount > 800

  return (
    <div className={styles.wrap}>
      <div className={styles.inputBox}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Ask a medical question… (Shift+Enter for new line)"
          value={value}
          onChange={e => { onChange(e.target.value); adjustHeight() }}
          onKeyDown={handleKey}
          rows={1}
          disabled={disabled}
          aria-label="Type your medical question"
          maxLength={1000}
        />

        <div className={styles.controls}>
          {nearLimit && (
            <span className={styles.charCount}>{charCount}/1000</span>
          )}

          <button
            className={styles.micBtn}
            type="button"
            title="Voice input (coming soon)"
            disabled
          >
            <MicIcon />
          </button>

          <button
            className={`${styles.sendBtn} ${isStreaming ? styles.stopBtn : ''} ${(!value.trim() && !isStreaming) ? styles.disabled : ''}`}
            type="button"
            onClick={() => isStreaming ? onStop() : value.trim() && onSend(value)}
            title={isStreaming ? 'Stop generation' : 'Send message'}
            aria-label={isStreaming ? 'Stop generation' : 'Send message'}
          >
            {isStreaming ? <StopIcon /> : <SendIcon />}
          </button>
        </div>
      </div>

      <div className={styles.hints}>
        <span className={styles.hint}>
          <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
        </span>
        <span className={styles.hintRight}>
          Powered by Groq API · Not medical advice
        </span>
      </div>
    </div>
  )
}
