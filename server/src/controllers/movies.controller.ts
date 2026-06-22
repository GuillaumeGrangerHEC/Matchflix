import type { Request, Response, NextFunction } from 'express'
import { discoverMoviesByProviders, type ApiLanguage, type MediaType } from '../services/tmdb.service'

function parseIdList(value: unknown): number[] {
  const raw = String(value ?? '').trim()
  if (!raw) return []
  // Number('') === 0, not NaN — the early return above avoids that trap turning "no param" into [0].
  return raw
    .split(',')
    .map(Number)
    .filter((id) => !Number.isNaN(id))
}

export async function getMovies(req: Request, res: Response, next: NextFunction) {
  try {
    const providers = parseIdList(req.query.providers)
    const genres = parseIdList(req.query.genres)
    const country = String(req.query.country ?? '')
    const mediaType: MediaType = req.query.mediaType === 'tv' ? 'tv' : 'movie'
    const language: ApiLanguage = req.query.language === 'en' ? 'en' : 'fr'
    const page = Number(req.query.page ?? 1)

    if (providers.length === 0 || !country) {
      res.status(400).json({ error: 'Paramètres "providers" et "country" requis.' })
      return
    }

    const { results, totalPages } = await discoverMoviesByProviders(
      providers,
      country,
      mediaType,
      genres,
      page,
      language
    )
    res.json({ results, totalPages })
  } catch (err) {
    next(err)
  }
}
