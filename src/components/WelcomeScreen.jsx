import React from 'react'
import styles from './WelcomeScreen.module.scss'

const FEATURES = [
  { icon: '🔬', title: 'Evidence-based info', desc: 'General health information from trusted medical knowledge' },
  { icon: '💬', title: 'Clear explanations', desc: 'Complex medical terms explained in plain language' },
  { icon: '🔒', title: 'HIPAA-safe design', desc: 'No personal data stored — your privacy protected' },
  { icon: '⚡', title: 'Real-time streaming', desc: 'Answers stream live as they are generated' },
]

const QUICK_QUESTIONS = [
  { emoji: '🩺', text: 'What are common cold vs flu symptoms?' },
  { emoji: '❤️', text: 'How can I naturally lower blood pressure?' },
  { emoji: '💊', text: 'What foods help reduce high cholesterol?' },
  { emoji: '😴', text: 'How many hours of sleep do adults need?' },
  { emoji: '☀️', text: 'Signs of vitamin D deficiency?' },
  { emoji: '🩸', text: 'Early symptoms of Type 2 diabetes?' },
]

export default function WelcomeScreen({ onSuggest }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <div className={styles.logoGlyph}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h1 className={styles.heroTitle}>
          How can I help you<br />understand your health?
        </h1>
        <p className={styles.heroSub}>
          Ask any general health question. I'll provide clear, evidence-based information.
        </p>
      </div>

      <div className={styles.quickGrid}>
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            className={styles.quickCard}
            onClick={() => onSuggest(q.text)}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <span className={styles.quickEmoji}>{q.emoji}</span>
            <span className={styles.quickText}>{q.text}</span>
          </button>
        ))}
      </div>

      <div className={styles.features}>
        {FEATURES.map((f, i) => (
          <div key={i} className={styles.featureItem}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <div>
              <p className={styles.featureTitle}>{f.title}</p>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.disclaimer}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>For educational purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.</span>
      </div>
    </div>
  )
}
