import React, { useEffect, useRef } from 'react'
import styles from './MessageBubble.module.scss'

function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// Simple markdown-like renderer (bold, bullet lists, newlines)
function renderContent(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${key++}`} className={styles.list}>{listItems}</ul>)
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    if (!line.trim()) {
      flushList()
      elements.push(<br key={`br-${i}`} />)
      return
    }

    // Bullet list line
    if (line.match(/^[•\-\*]\s/)) {
      const content = line.replace(/^[•\-\*]\s/, '')
      listItems.push(
        <li key={`li-${i}`} className={styles.listItem}>
          {parseBold(content)}
        </li>
      )
      return
    }

    flushList()

    // Bold headers (** **)
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={`hd-${i}`} className={styles.boldHeader}>
          {line.slice(2, -2)}
        </p>
      )
      return
    }

    elements.push(
      <p key={`p-${i}`} className={styles.paragraph}>
        {parseBold(line)}
      </p>
    )
  })

  flushList()
  return elements
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}

export default function MessageBubble({ message }) {
  const { role, content, ts, streaming } = message
  const isUser = role === 'user'
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.assistant} animate-fade-in`}>
      {!isUser && (
        <div className={styles.avatar}>
          <AiAvatar />
        </div>
      )}

      <div className={styles.bubbleGroup}>
        <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
          {isUser ? (
            <p className={styles.userText}>{content}</p>
          ) : (
            <div className={styles.aiContent}>
              {renderContent(content)}
              {streaming && <TypingCursor />}
            </div>
          )}
        </div>

        <div className={`${styles.meta} ${isUser ? styles.metaUser : styles.metaAssistant}`}>
          <span className={styles.time}>{formatTime(ts)}</span>
          {!isUser && !streaming && content && (
            <div className={styles.actions}>
              <button
                className={styles.actionBtn}
                onClick={handleCopy}
                title="Copy response"
              >
                <CopyIcon />
                {copied ? <span>Copied!</span> : <span>Copy</span>}
              </button>
              <button className={styles.actionBtn} title="Helpful">
                <ThumbUpIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className={styles.avatarUser}>
          <UserAvatar />
        </div>
      )}
    </div>
  )
}

function TypingCursor() {
  return <span className={styles.cursor} aria-hidden="true" />
}

function AiAvatar() {
  return (
    <div className={styles.aiAvatarInner}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    </div>
  )
}

function UserAvatar() {
  return (
    <div className={styles.userAvatarInner}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  )
}
