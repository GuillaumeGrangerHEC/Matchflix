import type { ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Header.module.css'

export function Header({ subtitle }: { subtitle?: ReactNode }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={styles.header}>
      <button
        type="button"
        className={styles.languageSwitch}
        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
        aria-label="Switch language"
      >
        {language === 'fr' ? 'EN' : 'FR'}
      </button>
      <div className={styles.logo}>
        <span aria-hidden="true">🎬</span>
        Matchflix
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  )
}
