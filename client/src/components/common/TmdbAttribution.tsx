import tmdbLogo from '@/assets/tmdb-logo.svg'
import { useLanguage } from '@/context/LanguageContext'
import styles from './TmdbAttribution.module.css'

export function TmdbAttribution() {
  const { t } = useLanguage()
  return (
    <a
      className={styles.attribution}
      href="https://www.themoviedb.org/"
      target="_blank"
      rel="noreferrer"
    >
      <img className={styles.logo} src={tmdbLogo} alt="TMDB" />
      <span>{t('attribution_text')}</span>
    </a>
  )
}
