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
    const groupSize = session.groupSize ?? 2
    if (userEntries.length < groupSize) return

    // Tally likes across the whole group rather than just two users, so this scales to families/groups.
    const likeCounts = new Map<string, { count: number; title: string; posterPath: string | null }>()
    for (const [, user] of userEntries) {
      for (const [movieId, liked] of Object.entries(user.likedMovieIds ?? {})) {
        const existing = likeCounts.get(movieId)
        if (existing) {
          existing.count += 1
        } else {
          likeCounts.set(movieId, { count: 1, title: liked.title, posterPath: liked.posterPath })
        }
      }
    }

    // Majority = strictly more than half. For groupSize=2 this requires both (2), same as before.
    const majorityThreshold = Math.floor(groupSize / 2) + 1
    const matchEntry = [...likeCounts.entries()].find(([, info]) => info.count >= majorityThreshold)
    if (!matchEntry) return

    const [movieId, info] = matchEntry
    matchWriteInFlight.current = true
    writeMatch(code, {
      movieId: Number(movieId),
      title: info.title,
      posterPath: info.posterPath,
      matchedAt: Date.now(),
    }).finally(() => {
      matchWriteInFlight.current = false
    })
  }, [code, session])

  return session
}
