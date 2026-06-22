import { Router } from 'express'
import { getMovies } from '../controllers/movies.controller'

export const moviesRouter = Router()

moviesRouter.get('/', getMovies)
