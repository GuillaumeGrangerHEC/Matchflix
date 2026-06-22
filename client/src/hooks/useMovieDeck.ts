import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/services/api'
import type { CountryCode, MediaType, Movie } from '@/types'

const PREFETCH_THRESHOLD = 3
const PEEK_SIZE = 2

export function useMovieDeck(
  providerIds: number[],
  country: CountryCode | null,
  mediaType: MediaType,
  genreIds: number[]
) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const page = useRef(1)
  const isFetching = useRef(false)
  const fetchedKey = useRef<string | null>(null)
  const providersKey = providerIds.slice().sort((a, b) => a - b).join(',')
  const genresKey = genreIds.slice().sort((a, b) => a - b).join(',')

  const fetchPage = useCallback(
    async (activeCountry: CountryCode, activeProvidersKey: string, activeMediaType: MediaType, activeGenresKey: string) => {
      if (isFetching.current) return
      isFetching.current = true
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<{ results: Movie[] }>('/movies', {
          params: {
            providers: activeProvidersKey,
            country: activeCountry,
            mediaType: activeMediaType,
            genres: activeGenresKey || undefined,
            page: page.current,
          },
        })
        setMovies((prev) => [...prev, ...data.results])
        page.current += 1
      } catch {
        setError('Impossible de charger les films pour le moment.')
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    },
    []
  )

  useEffect(() => {
    if (!country || !providersKey) return
    const key = `${country}-${mediaType}-${providersKey}-${genresKey}`
    if (fetchedKey.current === key) return
    fetchedKey.current = key
    setMovies([])
    setCurrentIndex(0)
    page.current = 1
    fetchPage(country, providersKey, mediaType, genresKey)
  }, [country, mediaType, providersKey, genresKey, fetchPage])

  useEffect(() => {
    if (!country || !providersKey) return
    if (movies.length - currentIndex <= PREFETCH_THRESHOLD && !isFetching.current) {
      fetchPage(country, providersKey, mediaType, genresKey)
    }
  }, [currentIndex, movies.length, country, mediaType, providersKey, genresKey, fetchPage])

  const advance = useCallback(() => setCurrentIndex((i) => i + 1), [])

  return {
    deck: movies.slice(currentIndex, currentIndex + PEEK_SIZE),
    hasMore: currentIndex < movies.length || loading,
    loading,
    error,
    advance,
  }
}
