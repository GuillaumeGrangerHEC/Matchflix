export type CountryCode = 'CH' | 'FR' | 'BE'
export type MediaType = 'movie' | 'tv'

export interface Platform {
  id: string
  name: string
  tmdbProviderId: number
  logoPath: string
}

export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
}

export interface LikedMovie {
  title: string
  posterPath: string | null
}

export interface SessionUser {
  platforms: string[]
  genres: number[]
  likedMovieIds: Record<string, LikedMovie>
  joinedAt: number
}

export interface SessionMatch {
  movieId: number
  title: string
  posterPath: string | null
  matchedAt: number
}

export interface Session {
  country: CountryCode
  mediaType: MediaType
  createdAt: number
  users: Record<string, SessionUser>
  match?: SessionMatch
}
