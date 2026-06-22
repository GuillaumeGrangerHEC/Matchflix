import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext } from '@/context/SessionContext'
import { useSession } from '@/hooks/useSession'
import { useMovieDeck } from '@/hooks/useMovieDeck'
import { PLATFORMS } from '@/utils/constants'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { SwipeDeck } from '@/components/swipe/SwipeDeck'
import { Spinner } from '@/components/common/Spinner'
import type { Movie } from '@/types'
import type { SwipeDirection } from '@/components/swipe/SwipeCard'

export function SwipePage() {
  const { code, likeMovie } = useSessionContext()
  const session = useSession(code)
  const navigate = useNavigate()

  useEffect(() => {
    if (!code) navigate('/', { replace: true })
  }, [code, navigate])

  useEffect(() => {
    if (session?.match) navigate('/match', { replace: true })
  }, [session?.match, navigate])

  const commonProviderIds = useMemo(() => {
    const users = session ? Object.values(session.users ?? {}) : []
    if (users.length < 2) return []
    const [platformsA, platformsB] = users.map((u) => u.platforms ?? [])
    const common = platformsA.filter((id) => platformsB.includes(id))
    return common
      .map((id) => PLATFORMS.find((p) => p.id === id)?.tmdbProviderId)
      .filter((id): id is number => typeof id === 'number')
  }, [session])

  // null = personne n'a de préférence de genre (pas de filtre). [] = les deux ont choisi des
  // genres mais sans aucun en commun (désaccord réel, donc rien à proposer).
  const effectiveGenreIds = useMemo<number[] | null>(() => {
    const users = session ? Object.values(session.users ?? {}) : []
    if (users.length < 2) return null
    const [genresA, genresB] = users.map((u) => u.genres ?? [])
    if (genresA.length === 0 && genresB.length === 0) return null
    if (genresA.length === 0) return genresB
    if (genresB.length === 0) return genresA
    return genresA.filter((g) => genresB.includes(g))
  }, [session])

  const hasGenreConflict = effectiveGenreIds !== null && effectiveGenreIds.length === 0

  const { deck, loading, error, hasMore, advance } = useMovieDeck(
    commonProviderIds,
    session?.country ?? null,
    session?.mediaType ?? 'movie',
    effectiveGenreIds ?? []
  )

  function handleSwipe(movie: Movie, direction: SwipeDirection) {
    if (direction === 'like') likeMovie(movie)
  }

  if (!code) return null

  const subtitle = session?.mediaType === 'tv' ? 'Swipez pour trouver votre série.' : 'Swipez pour trouver votre film.'

  if (!session) {
    return (
      <PageContainer>
        <Header subtitle={subtitle} />
        <Spinner />
      </PageContainer>
    )
  }

  if (commonProviderIds.length === 0) {
    return (
      <PageContainer>
        <Header subtitle={subtitle} />
        <p>Vous n&apos;avez aucune plateforme en commun pour l&apos;instant.</p>
      </PageContainer>
    )
  }

  if (hasGenreConflict) {
    return (
      <PageContainer>
        <Header subtitle={subtitle} />
        <p>Vous n&apos;avez choisi aucun genre en commun — essayez d&apos;en sélectionner un que vous partagez tous les deux.</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header subtitle={subtitle} />
      <SwipeDeck
        deck={deck}
        loading={loading}
        error={error}
        hasMore={hasMore}
        onSwipe={handleSwipe}
        onAdvance={advance}
      />
    </PageContainer>
  )
}
