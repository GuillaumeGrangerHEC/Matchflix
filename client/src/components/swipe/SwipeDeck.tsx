import { useState } from 'react'
import { SwipeCard, type SwipeDirection } from './SwipeCard'
import { SwipeActions } from './SwipeActions'
import { Spinner } from '@/components/common/Spinner'
import type { Movie } from '@/types'
import styles from './SwipeDeck.module.css'

interface SwipeDeckProps {
  deck: Movie[]
  loading: boolean
  error: string | null
  hasMore: boolean
  onSwipe: (movie: Movie, direction: SwipeDirection) => void
  onAdvance: () => void
}

export function SwipeDeck({ deck, loading, error, hasMore, onSwipe, onAdvance }: SwipeDeckProps) {
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
        <p>{error}</p>
      </div>
    )
  }

  if (!topMovie) {
    return (
      <div className={styles.empty}>
        {loading || hasMore ? (
          <Spinner />
        ) : (
          <p>Plus rien de disponible sur vos plateformes communes pour l&apos;instant.</p>
        )}
      </div>
    )
  }

  return (
    <div className={styles.deck}>
      <h2 className={styles.title}>{topMovie.title}</h2>
      <div className={styles.stack}>
        {nextMovie && (
          <SwipeCard key={nextMovie.id} movie={nextMovie} isTop={false} onSwiped={handleSwiped} />
        )}
        <SwipeCard key={topMovie.id} movie={topMovie} isTop trigger={trigger} onSwiped={handleSwiped} />
      </div>
      <SwipeActions
        disabled={!!trigger}
        onPass={() => handleButtonSwipe('pass')}
        onLike={() => handleButtonSwipe('like')}
      />
    </div>
  )
}
