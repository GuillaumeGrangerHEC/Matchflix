import { motion } from 'framer-motion'
import type { SessionMatch } from '@/types'
import { Button } from '@/components/common/Button'
import styles from './MatchScreen.module.css'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export function MatchScreen({ match, onRestart }: { match: SessionMatch; onRestart: () => void }) {
  return (
    <div className={styles.screen}>
      <motion.div
        className={styles.heart}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        ❤
      </motion.div>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        C&apos;est un Match !
      </motion.h1>
      <motion.div
        className={styles.posterWrap}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 20 }}
      >
        {match.posterPath && (
          <img className={styles.poster} src={`${TMDB_IMAGE_BASE}${match.posterPath}`} alt={match.title} />
        )}
        <p className={styles.movieTitle}>{match.title}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button onClick={onRestart}>Nouvelle session</Button>
      </motion.div>
    </div>
  )
}
