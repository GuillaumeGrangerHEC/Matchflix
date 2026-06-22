import type { CountryCode, Genre, MediaType, Platform } from '@/types'

// Base TMDB pour les images (logos, posters). Taille w92 = bien pour des icônes de plateforme.
export const TMDB_LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w92'

// IDs + logos vérifiés via GET /watch/providers/movie le 2026-06-22 (watch_region=CH/FR/BE).
// TMDB renomme/réassigne ces IDs de temps en temps (ex: HBO Max était 384, c'est 1899 désormais) -
// à revérifier périodiquement avec le même endpoint si des plateformes ne renvoient plus de films.
export const PLATFORMS: Platform[] = [
  { id: 'netflix', name: 'Netflix', tmdbProviderId: 8, logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
  { id: 'prime', name: 'Amazon Prime Video', tmdbProviderId: 119, logoPath: '/pvske1MyAoymrs5bguRfVqYiM9a.jpg' },
  { id: 'disney', name: 'Disney+', tmdbProviderId: 337, logoPath: '/97yvRBw1GzX7fXprcF80er19ot.jpg' },
  { id: 'appletv', name: 'Apple TV+', tmdbProviderId: 350, logoPath: '/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg' },
  // Pas disponible en Suisse (CH) à ce jour - le swipe sera simplement vide pour les sessions CH.
  { id: 'hbo', name: 'HBO Max', tmdbProviderId: 1899, logoPath: '/jbe4gVSfRlbPTdESXhEKpornsfu.jpg' },
]

export const SUPPORTED_COUNTRIES: { code: CountryCode; label: string }[] = [
  { code: 'CH', label: 'Suisse' },
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique' },
]

export const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: 'movie', label: 'Films' },
  { value: 'tv', label: 'Séries' },
]

// Genres vérifiés via GET /genre/movie/list et /genre/tv/list (language=fr-FR) le 2026-06-22.
// Les deux taxonomies ne sont pas identiques (ex: pas de "Guerre" côté séries, "Kids"/"Reality" n'existent que côté séries).
export const MOVIE_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Familial' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' },
]

export const TV_GENRES: Genre[] = [
  { id: 10759, name: 'Action & Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Familial' },
  { id: 9648, name: 'Mystère' },
  { id: 10765, name: 'Science-Fiction & Fantastique' },
  { id: 10768, name: 'Guerre & Politique' },
  { id: 37, name: 'Western' },
]

export const MIN_GROUP_SIZE = 2
export const MAX_GROUP_SIZE = 8

export const SESSION_STORAGE_KEY = 'matchflix.session'
