import type { ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import logo from '@/assets/matchflix-logo.jpg'
import styles from './Header.module.css'

export function Header({ subtitle, compact }: { subtitle?: ReactNode; compact?: boolean }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={compact ? styles.headerCompact : styles.header}>
      <div className={compact ? styles.logoCardCompact : styles.logoCard}>
        <img className={compact ? styles.logoCompact : styles.logo} src={logo} alt="Matchflix" />
      </div>
      <div className={styles.subtitleRow}>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        <button
          type="button"
          className={styles.languageSwitch}
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          aria-label="Switch language"
        >
          {language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
    </div>
  )
}
