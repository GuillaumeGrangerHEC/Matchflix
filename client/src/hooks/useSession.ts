import { useEffect, useRef, useState } from 'react'
import { subscribeToSession, writeMatch } from '@/services/sessionService'
import type { Session } from '@/types'

export function useSession(code: string | null) {
  const [session, setSession] = useState<Session | null>(null)
  const matchWriteInFlight = useRef(false)

  useEffect(() => {
    if (!code) {
      setSession(null)
      return
    }
    return subscribeToSession(code, setSession)
  }, [code])

  useEffect(() => {
    if (!code || !session || session.match || matchWriteInFlight.current) return

    const userEntries = Object.entries(session.users ?? {})
    if (userEntries.length < 2) return

    const [, userA] = userEntries[0]
    const [, userB] = userEntries[1]
    const sharedMovieId = Object.keys(userA.likedMovieIds ?? {}).find(
      (movieId) => movieId in (userB.likedMovieIds ?? {})
    )
    if (!sharedMovieId) return

    const likedMovie = userA.likedMovieIds[sharedMovieId]
    matchWriteInFlight.current = true
    writeMatch(code, {
      movieId: Number(sharedMovieId),
      title: likedMovie.title,
      posterPath: likedMovie.posterPath,
      matchedAt: Date.now(),
    }).finally(() => {
      matchWriteInFlight.current = false
    })
  }, [code, session])

  return session
}
