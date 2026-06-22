import type { ReactNode } from 'react'
import styles from './Header.module.css'

export function Header({ subtitle }: { subtitle?: ReactNode }) {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <span aria-hidden="true">🎬</span>
        Matchflix
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  )
}
