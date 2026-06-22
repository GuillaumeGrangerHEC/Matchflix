import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion'
import type { Movie } from '@/types'
import styles from './SwipeCard.module.css'

const SWIPE_THRESHOLD = 120
const FLY_OUT_DISTANCE = 500
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export type SwipeDirection = 'like' | 'pass'

interface SwipeCardProps {
  movie: Movie
  isTop: boolean
  trigger?: SwipeDirection | null
  onSwiped: (direction: SwipeDirection) => void
}

export function SwipeCard({ movie, isTop, trigger, onSwiped }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const passOpacity = useTransform(x, [-120, -20], [1, 0])
  const [showOverview, setShowOverview] = useState(false)

  function flyOut(direction: SwipeDirection) {
    animate(x, direction === 'like' ? FLY_OUT_DISTANCE : -FLY_OUT_DISTANCE, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      onComplete: () => onSwiped(direction),
    })
  }

  useEffect(() => {
    if (trigger) flyOut(trigger)
    // Only the trigger transition should fire this — flyOut/onSwiped intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      flyOut(info.offset.x > 0 ? 'like' : 'pass')
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 35 })
    }
  }

  return (
    <motion.div
      className={styles.card}
      style={{ x, rotate, y: isTop ? 0 : 14 }}
      drag={isTop ? 'x' : false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onTap={() => isTop && setShowOverview((v) => !v)}
    >
      {movie.posterPath ? (
        <img
          className={styles.poster}
          src={`${TMDB_IMAGE_BASE}${movie.posterPath}`}
          alt={movie.title}
          draggable={false}
        />
      ) : (
        <div className={styles.posterFallback}>{movie.title}</div>
      )}
      <div className={styles.gradient} />
      <div className={styles.info}>
        <h2 className={styles.title}>{movie.title}</h2>
        <p className={styles.hint}>{showOverview ? '' : 'Touchez pour le synopsis'}</p>
      </div>
      {showOverview && (
        <div className={styles.overviewScrim}>
          <p className={styles.overview}>{movie.overview || 'Pas de synopsis disponible.'}</p>
        </div>
      )}
      {isTop && (
        <>
          <motion.div className={styles.likeStamp} style={{ opacity: likeOpacity }}>
            J&apos;AIME
          </motion.div>
          <motion.div className={styles.passStamp} style={{ opacity: passOpacity }}>
            PASSE
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
