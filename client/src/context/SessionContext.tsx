import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  createSession,
  joinSession,
  setPlatforms as setPlatformsService,
  setGenres as setGenresService,
  likeMovie as likeMovieService,
} from '@/services/sessionService'
import { SESSION_STORAGE_KEY } from '@/utils/constants'
import type { CountryCode, MediaType, Movie } from '@/types'

interface StoredIdentity {
  code: string
  userId: string
}

interface SessionContextValue {
  code: string | null
  userId: string
  createNewSession: (country: CountryCode, mediaType: MediaType, groupSize: number) => Promise<string>
  joinExistingSession: (joinCode: string) => Promise<void>
  setPlatforms: (platforms: string[]) => Promise<void>
  setGenres: (genres: number[]) => Promise<void>
  likeMovie: (movie: Movie) => Promise<void>
  leaveSession: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

function createUserId(): string {
  return crypto.randomUUID()
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (stored) {
      const parsed: StoredIdentity = JSON.parse(stored)
      setCode(parsed.code)
      setUserId(parsed.userId)
    } else {
      setUserId(createUserId())
    }
  }, [])

  const persist = useCallback((nextCode: string, nextUserId: string) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ code: nextCode, userId: nextUserId }))
  }, [])

  const createNewSession = useCallback(
    async (country: CountryCode, mediaType: MediaType, groupSize: number) => {
      const id = userId || createUserId()
      const newCode = await createSession(country, mediaType, groupSize, id)
      setUserId(id)
      setCode(newCode)
      persist(newCode, id)
      return newCode
    },
    [userId, persist]
  )

  const joinExistingSession = useCallback(
    async (joinCode: string) => {
      const id = userId || createUserId()
      await joinSession(joinCode, id)
      setUserId(id)
      setCode(joinCode)
      persist(joinCode, id)
    },
    [userId, persist]
  )

  const setPlatforms = useCallback(
    async (platforms: string[]) => {
      if (!code || !userId) return
      await setPlatformsService(code, userId, platforms)
    },
    [code, userId]
  )

  const setGenres = useCallback(
    async (genres: number[]) => {
      if (!code || !userId) return
      await setGenresService(code, userId, genres)
    },
    [code, userId]
  )

  const likeMovie = useCallback(
    async (movie: Movie) => {
      if (!code || !userId) return
      await likeMovieService(code, userId, movie)
    },
    [code, userId]
  )

  const leaveSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setCode(null)
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({
      code,
      userId,
      createNewSession,
      joinExistingSession,
      setPlatforms,
      setGenres,
      likeMovie,
      leaveSession,
    }),
    [code, userId, createNewSession, joinExistingSession, setPlatforms, setGenres, likeMovie, leaveSession]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSessionContext() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessionContext must be used within a SessionProvider')
  return ctx
}
