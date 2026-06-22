import type { Request, Response, NextFunction } from 'express'
import { discoverMoviesByProviders, type MediaType } from '../services/tmdb.service'

function parseIdList(value: unknown): number[] {
  return String(value ?? '')
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
    const page = Number(req.query.page ?? 1)

    if (providers.length === 0 || !country) {
      res.status(400).json({ error: 'Paramètres "providers" et "country" requis.' })
      return
    }

    const { results, totalPages } = await discoverMoviesByProviders(providers, country, mediaType, genres, page)
    res.json({ results, totalPages })
  } catch (err) {
    next(err)
  }
}
