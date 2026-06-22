import tmdbLogo from '@/assets/tmdb-logo.svg'
import { useLanguage } from '@/context/LanguageContext'
import styles from './TmdbAttribution.module.css'

export function TmdbAttribution() {
  const { t } = useLanguage()
  return (
    <div className={styles.attribution}>
      <img className={styles.logo} src={tmdbLogo} alt="TMDB" />
      <span>{t('attribution_text')}</span>
    </div>
  )
}
