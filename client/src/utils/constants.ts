import type { CountryCode, Genre, MediaType, Platform } from '@/types'

// Base TMDB pour les images (logos, posters). Taille w92 = bien pour des icônes de plateforme.
export const TMDB_LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w92'

// IDs + logos vérifiés via GET /watch/providers/movie le 2026-06-22 (watch_region=CH/FR/BE).
// TMDB renomme/réassigne ces IDs de temps en temps (ex: HBO Max était 384, c'est 1899 désormais) -
// à revérifier périodiquement avec le même endpoint si des plateformes ne renvoient plus de films.
// Les noms de marque (Netflix, Disney+...) restent identiques en anglais, pas besoin de traduction.
export const PLATFORMS: Platform[] = [
  { id: 'netflix', name: 'Netflix', tmdbProviderId: 8, logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
  { id: 'prime', name: 'Amazon Prime Video', tmdbProviderId: 119, logoPath: '/pvske1MyAoymrs5bguRfVqYiM9a.jpg' },
  { id: 'disney', name: 'Disney+', tmdbProviderId: 337, logoPath: '/97yvRBw1GzX7fXprcF80er19ot.jpg' },
  { id: 'appletv', name: 'Apple TV+', tmdbProviderId: 350, logoPath: '/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg' },
  // Pas disponible en Suisse (CH) à ce jour - le swipe sera simplement vide pour les sessions CH.
  { id: 'hbo', name: 'HBO Max', tmdbProviderId: 1899, logoPath: '/jbe4gVSfRlbPTdESXhEKpornsfu.jpg' },
]

export const SUPPORTED_COUNTRIES: { code: CountryCode; label: string; labelEn: string }[] = [
  { code: 'CH', label: 'Suisse', labelEn: 'Switzerland' },
  { code: 'FR', label: 'France', labelEn: 'France' },
  { code: 'BE', label: 'Belgique', labelEn: 'Belgium' },
]

export const MEDIA_TYPES: { value: MediaType; label: string; labelEn: string }[] = [
  { value: 'movie', label: 'Films', labelEn: 'Movies' },
  { value: 'tv', label: 'Séries', labelEn: 'Shows' },
]

// Genres vérifiés via GET /genre/movie/list et /genre/tv/list (language=fr-FR puis en-US) le 2026-06-22.
// Les deux taxonomies ne sont pas identiques (ex: pas de "Guerre" côté séries, "Kids"/"Reality" n'existent que côté séries).
export const MOVIE_GENRES: Genre[] = [
  { id: 28, name: 'Action', nameEn: 'Action' },
  { id: 12, name: 'Aventure', nameEn: 'Adventure' },
  { id: 16, name: 'Animation', nameEn: 'Animation' },
  { id: 35, name: 'Comédie', nameEn: 'Comedy' },
  { id: 80, name: 'Crime', nameEn: 'Crime' },
  { id: 99, name: 'Documentaire', nameEn: 'Documentary' },
  { id: 18, name: 'Drame', nameEn: 'Drama' },
  { id: 10751, name: 'Familial', nameEn: 'Family' },
  { id: 14, name: 'Fantastique', nameEn: 'Fantasy' },
  { id: 36, name: 'Histoire', nameEn: 'History' },
  { id: 27, name: 'Horreur', nameEn: 'Horror' },
  { id: 10402, name: 'Musique', nameEn: 'Music' },
  { id: 9648, name: 'Mystère', nameEn: 'Mystery' },
  { id: 10749, name: 'Romance', nameEn: 'Romance' },
  { id: 878, name: 'Science-Fiction', nameEn: 'Science Fiction' },
  { id: 53, name: 'Thriller', nameEn: 'Thriller' },
  { id: 10752, name: 'Guerre', nameEn: 'War' },
  { id: 37, name: 'Western', nameEn: 'Western' },
]

export const TV_GENRES: Genre[] = [
  { id: 10759, name: 'Action & Aventure', nameEn: 'Action & Adventure' },
  { id: 16, name: 'Animation', nameEn: 'Animation' },
  { id: 35, name: 'Comédie', nameEn: 'Comedy' },
  { id: 80, name: 'Crime', nameEn: 'Crime' },
  { id: 99, name: 'Documentaire', nameEn: 'Documentary' },
  { id: 18, name: 'Drame', nameEn: 'Drama' },
  { id: 10751, name: 'Familial', nameEn: 'Family' },
  { id: 9648, name: 'Mystère', nameEn: 'Mystery' },
  { id: 10765, name: 'Science-Fiction & Fantastique', nameEn: 'Sci-Fi & Fantasy' },
  { id: 10768, name: 'Guerre & Politique', nameEn: 'War & Politics' },
  { id: 37, name: 'Western', nameEn: 'Western' },
]

export const MIN_GROUP_SIZE = 2
export const MAX_GROUP_SIZE = 8

export const SESSION_STORAGE_KEY = 'matchflix.session'
export const LANGUAGE_STORAGE_KEY = 'matchflix.language'
