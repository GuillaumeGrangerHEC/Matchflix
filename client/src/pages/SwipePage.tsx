import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext } from '@/context/SessionContext'
import { useLanguage } from '@/context/LanguageContext'
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
  const { language, t } = useLanguage()
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
    const groupSize = session?.groupSize ?? 2
    if (users.length < groupSize) return []
    const platformLists = users.map((u) => u.platforms ?? [])
    const common = platformLists.reduce((acc, list) => acc.filter((id) => list.includes(id)))
    return common
      .map((id) => PLATFORMS.find((p) => p.id === id)?.tmdbProviderId)
      .filter((id): id is number => typeof id === 'number')
  }, [session])

  // null = personne n'a de préférence de genre (pas de filtre). [] = au moins deux participants ont
  // choisi des genres mais sans aucun en commun (désaccord réel, donc rien à proposer).
  const effectiveGenreIds = useMemo<number[] | null>(() => {
    const users = session ? Object.values(session.users ?? {}) : []
    const groupSize = session?.groupSize ?? 2
    if (users.length < groupSize) return null
    const genreLists = users.map((u) => u.genres ?? []).filter((list) => list.length > 0)
    if (genreLists.length === 0) return null
    return genreLists.reduce((acc, list) => acc.filter((g) => list.includes(g)))
  }, [session])

  const hasGenreConflict = effectiveGenreIds !== null && effectiveGenreIds.length === 0

  const { deck, loading, error, hasMore, advance } = useMovieDeck(
    commonProviderIds,
    session?.country ?? null,
    session?.mediaType ?? 'movie',
    effectiveGenreIds ?? [],
    language
  )

  function handleSwipe(movie: Movie, direction: SwipeDirection) {
    if (direction === 'like') likeMovie(movie)
  }

  if (!code) return null

  const subtitle = session?.mediaType === 'tv' ? t('swipe_subtitleTv') : t('swipe_subtitleMovie')

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
        <p>{t('swipe_noCommonPlatforms')}</p>
      </PageContainer>
    )
  }

  if (hasGenreConflict) {
    return (
      <PageContainer>
        <Header subtitle={subtitle} />
        <p>{t('swipe_genreConflict')}</p>
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
