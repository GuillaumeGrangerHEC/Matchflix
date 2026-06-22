import { useState } from 'react'
import { SwipeCard, type SwipeDirection } from './SwipeCard'
import { SwipeActions } from './SwipeActions'
import { Spinner } from '@/components/common/Spinner'
import { useLanguage } from '@/context/LanguageContext'
import type { MediaType, Movie } from '@/types'
import styles from './SwipeDeck.module.css'

interface SwipeDeckProps {
  deck: Movie[]
  loading: boolean
  error: string | null
  hasMore: boolean
  mediaType: MediaType
  onSwipe: (movie: Movie, direction: SwipeDirection) => void
  onAdvance: () => void
}

export function SwipeDeck({ deck, loading, error, hasMore, mediaType, onSwipe, onAdvance }: SwipeDeckProps) {
  const { t } = useLanguage()
  const [trigger, setTrigger] = useState<SwipeDirection | null>(null)

  const topMovie = deck[0]
  const nextMovie = deck[1]

  function handleButtonSwipe(direction: SwipeDirection) {
    if (trigger || !topMovie) return
    setTrigger(direction)
  }

  function handleSwiped(direction: SwipeDirection) {
    if (topMovie) onSwipe(topMovie, direction)
    setTrigger(null)
    onAdvance()
  }

  if (error) {
    return (
      <div className={styles.empty}>
        <p>{t('error_loadFailed')}</p>
      </div>
    )
  }

  if (!topMovie) {
    return (
      <div className={styles.empty}>
        {loading || hasMore ? <Spinner /> : <p>{t('deck_empty')}</p>}
      </div>
    )
  }

  return (
    <div className={styles.deck}>
      <h2 className={styles.title}>{topMovie.title}</h2>
      <div className={styles.stack}>
        {nextMovie && (
          <SwipeCard
            key={nextMovie.id}
            movie={nextMovie}
            isTop={false}
            mediaType={mediaType}
            onSwiped={handleSwiped}
          />
        )}
        <SwipeCard
          key={topMovie.id}
          movie={topMovie}
          isTop
          mediaType={mediaType}
          trigger={trigger}
          onSwiped={handleSwiped}
        />
      </div>
      <SwipeActions
        disabled={!!trigger}
        onPass={() => handleButtonSwipe('pass')}
        onLike={() => handleButtonSwipe('like')}
      />
    </div>
  )
}
