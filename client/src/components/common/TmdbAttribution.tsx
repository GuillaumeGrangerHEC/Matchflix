import tmdbLogo from '@/assets/tmdb-logo.svg'
import styles from './TmdbAttribution.module.css'

export function TmdbAttribution() {
  return (
    <a
      className={styles.attribution}
      href="https://www.themoviedb.org/"
      target="_blank"
      rel="noreferrer"
    >
      <img className={styles.logo} src={tmdbLogo} alt="TMDB" />
      <span>Ce produit utilise l&apos;API TMDB mais n&apos;est pas approuvé ou certifié par TMDB.</span>
    </a>
  )
}
