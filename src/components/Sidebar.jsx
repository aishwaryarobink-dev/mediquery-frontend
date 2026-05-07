import React, { useState } from 'react'
import styles from './Sidebar.module.scss'

const NAV_ITEMS = [
  { id: 'chat',     label: 'New Chat',    icon: ChatIcon },
  { id: 'history',  label: 'History',     icon: HistoryIcon },
  { id: 'topics',   label: 'Topics',      icon: TopicsIcon },
  { id: 'settings', label: 'Settings',    icon: SettingsIcon },
]

const TOPICS = [
  { emoji: '❤️', label: 'Cardiology' },
  { emoji: '🧠', label: 'Neurology' },
  { emoji: '🦴', label: 'Orthopedics' },
  { emoji: '🫁', label: 'Pulmonology' },
  { emoji: '🩺', label: 'General' },
  { emoji: '💊', label: 'Medications' },
  { emoji: '🧬', label: 'Genetics' },
  { emoji: '🥗', label: 'Nutrition' },
]

function ChatIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function HistoryIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function TopicsIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg> }
function SettingsIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> }
function CrossIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }

export default function Sidebar({ isOpen, onClose, messages, onClear, onSuggest }) {
  const [activeNav, setActiveNav] = useState('chat')

  const history = messages
    .filter(m => m.role === 'user')
    .slice(-8)
    .reverse()

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <PulseIcon />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>MediQuery</span>
            <span className={styles.logoTag}>AI Health Assistant</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <CrossIcon />
          </button>
        </div>

        {/* New chat button */}
        <div className={styles.newChatWrap}>
          <button className={styles.newChatBtn} onClick={() => { onClear(); setActiveNav('chat'); onClose(); }}>
            <span className={styles.newChatPlus}>+</span>
            New conversation
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeNav === item.id ? styles.active : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className={styles.navIcon}><item.icon /></span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.divider} />

        {/* Dynamic content based on active nav */}
        <div className={styles.content}>
          {activeNav === 'chat' && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Suggested questions</p>
              <div className={styles.suggestedList}>
                {[
                  "Symptoms of high blood pressure?",
                  "How to improve sleep quality?",
                  "Signs of vitamin D deficiency?",
                  "Cold vs flu — key differences?",
                ].map((q, i) => (
                  <button
                    key={i}
                    className={styles.suggestedItem}
                    onClick={() => { onSuggest(q); onClose(); }}
                  >
                    <span className={styles.suggestedArrow}>›</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeNav === 'history' && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Recent questions</p>
              {history.length === 0 ? (
                <p className={styles.emptyText}>No history yet. Start a conversation!</p>
              ) : (
                <div className={styles.historyList}>
                  {history.map(m => (
                    <button
                      key={m.id}
                      className={styles.historyItem}
                      onClick={() => { onSuggest(m.content); onClose(); }}
                    >
                      <HistoryIcon />
                      <span>{m.content}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeNav === 'topics' && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Browse by specialty</p>
              <div className={styles.topicsGrid}>
                {TOPICS.map((t, i) => (
                  <button
                    key={i}
                    className={styles.topicChip}
                    onClick={() => { onSuggest(`Tell me about common ${t.label.toLowerCase()} conditions`); onClose(); }}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeNav === 'settings' && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Preferences</p>
              <div className={styles.settingsItem}>
                <span>Response detail</span>
                <select className={styles.settingsSelect}>
                  <option>Detailed</option>
                  <option>Concise</option>
                  <option>Brief</option>
                </select>
              </div>
              <div className={styles.settingsItem}>
                <span>Language</span>
                <select className={styles.settingsSelect}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerBadge}>
            <ShieldIcon />
            <span>HIPAA-safe · Not medical advice</span>
          </div>
          <p className={styles.footerVersion}>MediQuery v1.0 · Built with Groq API</p>
        </div>
      </aside>
    </>
  )
}

function PulseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
