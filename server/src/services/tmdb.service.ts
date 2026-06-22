import axios from 'axios'
import { env } from '../config/env'

export type MediaType = 'movie' | 'tv'

interface TmdbDiscoverItem {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
}

interface TmdbDiscoverResponse {
  page: number
  results: TmdbDiscoverItem[]
  total_pages: number
}

export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
}

const tmdbClient = axios.create({
  baseURL: env.tmdbBaseUrl,
  params: {
    api_key: env.tmdbApiKey,
    language: 'fr-FR',
    include_adult: false,
  },
})

// TMDB renvoie `title`/`release_date` pour les films et `name`/`first_air_date` pour les séries.
function toMovie(raw: TmdbDiscoverItem): Movie {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? '',
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseDate: raw.release_date ?? raw.first_air_date ?? '',
    voteAverage: raw.vote_average,
  }
}

export async function discoverMoviesByProviders(
  providerIds: number[],
  watchRegion: string,
  mediaType: MediaType,
  genreIds: number[],
  page: number
): Promise<{ results: Movie[]; totalPages: number }> {
  const { data } = await tmdbClient.get<TmdbDiscoverResponse>(`/discover/${mediaType}`, {
    params: {
      watch_region: watchRegion,
      // '|' = au moins un de ces fournisseurs/genres (OR) ; ',' signifierait "tous" (AND) côté TMDB.
      with_watch_providers: providerIds.join('|'),
      with_genres: genreIds.length > 0 ? genreIds.join('|') : undefined,
      // Ne garder que les films/séries inclus dans l'abonnement (pas la location/achat à l'acte).
      with_watch_monetization_types: 'flatrate',
      sort_by: 'popularity.desc',
      page,
    },
  })
  return { results: data.results.map(toMovie), totalPages: data.total_pages }
}
