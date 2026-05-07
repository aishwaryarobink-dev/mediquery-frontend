import React from 'react'
import styles from './TypingIndicator.module.scss'

export default function TypingIndicator() {
  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div className={styles.bubble}>
        <span className={styles.dot} style={{ animationDelay: '0ms' }} />
        <span className={styles.dot} style={{ animationDelay: '160ms' }} />
        <span className={styles.dot} style={{ animationDelay: '320ms' }} />
      </div>
      <span className={styles.label}>MediQuery is thinking…</span>
    </div>
  )
}
