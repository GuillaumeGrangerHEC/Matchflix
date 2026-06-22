import { Router } from 'express'
import { getMovies, getTrailer } from '../controllers/movies.controller'

export const moviesRouter = Router()

moviesRouter.get('/', getMovies)
moviesRouter.get('/:id/trailer', getTrailer)
