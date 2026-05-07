import React from 'react'
import styles from './Topbar.module.scss'

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  )
}

export default function Topbar({ onMenuOpen, onClear, hasMessages }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onMenuOpen}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </button>

        <div className={styles.titleGroup}>
          <span className={styles.title}>MediQuery</span>
          <div className={styles.badge}>
            <ShieldIcon />
            <span>HIPAA-safe</span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.statusDot}>
          <span className={styles.dot} />
          <span className={styles.statusText}>Groq API</span>
        </div>

        {hasMessages && (
          <button
            className={styles.clearBtn}
            onClick={onClear}
            title="Clear conversation"
          >
            <TrashIcon />
            <span>Clear</span>
          </button>
        )}
      </div>
    </header>
  )
}
