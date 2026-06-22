import { useEffect, useState, type MouseEvent } from 'react'
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { api } from '@/services/api'
import type { MediaType, Movie } from '@/types'
import { TMDB_LOGO_BASE_URL } from '@/utils/constants'
import { TrailerModal } from './TrailerModal'
import styles from './SwipeCard.module.css'

const SWIPE_THRESHOLD = 120
const FLY_OUT_DISTANCE = 500
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export type SwipeDirection = 'like' | 'pass'

interface SwipeCardProps {
  movie: Movie
  isTop: boolean
  mediaType: MediaType
  trigger?: SwipeDirection | null
  onSwiped: (direction: SwipeDirection) => void
}

export function SwipeCard({ movie, isTop, mediaType, trigger, onSwiped }: SwipeCardProps) {
  const { language, t } = useLanguage()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const passOpacity = useTransform(x, [-120, -20], [1, 0])
  const [showOverview, setShowOverview] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [trailerState, setTrailerState] = useState<'idle' | 'loading' | 'none'>('idle')

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

  async function handleTrailerClick(e: MouseEvent) {
    e.stopPropagation()
    if (trailerState === 'loading') return
    setTrailerState('loading')
    try {
      const { data } = await api.get<{ key: string | null }>(`/movies/${movie.id}/trailer`, {
        params: { mediaType, language },
      })
      if (data.key) {
        setTrailerKey(data.key)
        setTrailerState('idle')
      } else {
        setTrailerState('none')
      }
    } catch {
      setTrailerState('none')
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

      {movie.platform && (
        <div className={styles.platformBadge}>
          <img src={`${TMDB_LOGO_BASE_URL}${movie.platform.logoPath}`} alt={movie.platform.name} />
        </div>
      )}

      {isTop && (
        <button
          type="button"
          className={styles.trailerButton}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={handleTrailerClick}
        >
          ▶{' '}
          {trailerState === 'loading'
            ? t('card_trailerLoading')
            : trailerState === 'none'
              ? t('card_noTrailer')
              : t('card_trailer')}
        </button>
      )}

      {!showOverview && <div className={styles.synopsisHint}>{t('card_synopsis')}</div>}

      {showOverview && (
        <div className={styles.overviewScrim}>
          <p className={styles.overview}>{movie.overview || t('card_noOverview')}</p>
        </div>
      )}

      {isTop && (
        <>
          <motion.div className={styles.likeStamp} style={{ opacity: likeOpacity }}>
            {t('card_like')}
          </motion.div>
          <motion.div className={styles.passStamp} style={{ opacity: passOpacity }}>
            {t('card_pass')}
          </motion.div>
        </>
      )}

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />}
    </motion.div>
  )
}
