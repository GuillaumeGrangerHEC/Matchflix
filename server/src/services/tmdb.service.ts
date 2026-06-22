import axios from 'axios'
import { env } from '../config/env'

export type MediaType = 'movie' | 'tv'
export type ApiLanguage = 'fr' | 'en'

const TMDB_LOCALE: Record<ApiLanguage, string> = {
  fr: 'fr-FR',
  en: 'en-US',
}

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

interface TmdbWatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface TmdbWatchProvidersResponse {
  id: number
  results: Record<string, { flatrate?: TmdbWatchProvider[] }>
}

export interface MoviePlatform {
  name: string
  logoPath: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
  platform: MoviePlatform | null
}

const tmdbClient = axios.create({
  baseURL: env.tmdbBaseUrl,
  params: {
    api_key: env.tmdbApiKey,
    include_adult: false,
  },
})

// TMDB renvoie `title`/`release_date` pour les films et `name`/`first_air_date` pour les séries.
function toMovie(raw: TmdbDiscoverItem): Omit<Movie, 'platform'> {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? '',
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseDate: raw.release_date ?? raw.first_air_date ?? '',
    voteAverage: raw.vote_average,
  }
}

// Le discover ne dit que "disponible sur au moins un de ces fournisseurs" — cet appel
// supplémentaire (un par film) détermine LEQUEL précisément, pour l'afficher sur la carte.
async function getMoviePlatform(
  id: number,
  mediaType: MediaType,
  watchRegion: string,
  allowedProviderIds: number[]
): Promise<MoviePlatform | null> {
  try {
    const { data } = await tmdbClient.get<TmdbWatchProvidersResponse>(`/${mediaType}/${id}/watch/providers`)
    const flatrate = data.results[watchRegion]?.flatrate ?? []
    const match = flatrate.find((p) => allowedProviderIds.includes(p.provider_id))
    return match ? { name: match.provider_name, logoPath: match.logo_path } : null
  } catch {
    return null
  }
}

export async function discoverMoviesByProviders(
  providerIds: number[],
  watchRegion: string,
  mediaType: MediaType,
  genreIds: number[],
  page: number,
  language: ApiLanguage
): Promise<{ results: Movie[]; totalPages: number }> {
  const { data } = await tmdbClient.get<TmdbDiscoverResponse>(`/discover/${mediaType}`, {
    params: {
      watch_region: watchRegion,
      language: TMDB_LOCALE[language],
      // '|' = au moins un de ces fournisseurs/genres (OR) ; ',' signifierait "tous" (AND) côté TMDB.
      with_watch_providers: providerIds.join('|'),
      with_genres: genreIds.length > 0 ? genreIds.join('|') : undefined,
      // Ne garder que les films/séries inclus dans l'abonnement (pas la location/achat à l'acte).
      with_watch_monetization_types: 'flatrate',
      sort_by: 'popularity.desc',
      page,
    },
  })
  const results = await Promise.all(
    data.results.map(async (raw) => ({
      ...toMovie(raw),
      platform: await getMoviePlatform(raw.id, mediaType, watchRegion, providerIds),
    }))
  )
  return { results, totalPages: data.total_pages }
}
