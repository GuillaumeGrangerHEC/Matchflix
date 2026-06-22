import { ref, get, set, update, onValue, type Unsubscribe } from 'firebase/database'
import { database } from './firebaseClient'
import { generateSessionCode, isValidSessionCode } from '@/utils/sessionCode'
import type { CountryCode, MediaType, Movie, Session, SessionMatch } from '@/types'

const MAX_CODE_ATTEMPTS = 10

function sessionPath(code: string) {
  return ref(database, `sessions/${code}`)
}

export async function createSession(
  country: CountryCode,
  mediaType: MediaType,
  groupSize: number,
  userId: string
): Promise<string> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = generateSessionCode()
    const snapshot = await get(sessionPath(code))
    if (snapshot.exists()) continue

    await set(sessionPath(code), {
      country,
      mediaType,
      groupSize,
      createdAt: Date.now(),
      users: {
        [userId]: {
          platforms: [],
          genres: [],
          likedMovieIds: {},
          joinedAt: Date.now(),
        },
      },
    })
    return code
  }
  throw new Error('code_generation_failed')
}

export async function joinSession(code: string, userId: string): Promise<void> {
  if (!isValidSessionCode(code)) {
    throw new Error('invalid_code')
  }
  const snapshot = await get(sessionPath(code))
  if (!snapshot.exists()) {
    throw new Error('session_not_found')
  }
  const session = snapshot.val() as Session
  const existingUserIds = Object.keys(session.users ?? {})
  if (existingUserIds.includes(userId)) return
  if (existingUserIds.length >= session.groupSize) {
    throw new Error('session_full')
  }
  await set(ref(database, `sessions/${code}/users/${userId}`), {
    platforms: [],
    genres: [],
    likedMovieIds: {},
    joinedAt: Date.now(),
  })
}

export async function setPlatforms(code: string, userId: string, platforms: string[]): Promise<void> {
  await update(ref(database, `sessions/${code}/users/${userId}`), { platforms })
}

export async function setGenres(code: string, userId: string, genres: number[]): Promise<void> {
  await update(ref(database, `sessions/${code}/users/${userId}`), { genres })
}

export async function likeMovie(code: string, userId: string, movie: Movie): Promise<void> {
  await update(ref(database, `sessions/${code}/users/${userId}/likedMovieIds`), {
    [movie.id]: { title: movie.title, posterPath: movie.posterPath },
  })
}

export async function writeMatch(code: string, match: SessionMatch): Promise<void> {
  await set(ref(database, `sessions/${code}/match`), match)
}

export function subscribeToSession(
  code: string,
  callback: (session: Session | null) => void
): Unsubscribe {
  return onValue(sessionPath(code), (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as Session) : null)
  })
}
