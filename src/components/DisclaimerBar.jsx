import React, { useState } from 'react'
import styles from './DisclaimerBar.module.scss'

export default function DisclaimerBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className={styles.bar}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <span className={styles.text}>
        <strong>Medical disclaimer:</strong> Information provided is for educational purposes only.
        Always consult a qualified healthcare professional for diagnosis and treatment.
      </span>
      <button
        className={styles.dismiss}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss disclaimer"
      >
        ✕
      </button>
    </div>
  )
}
