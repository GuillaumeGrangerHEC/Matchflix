import { Router } from 'express'
import { moviesRouter } from './movies.routes'

export const apiRouter = Router()

apiRouter.use('/movies', moviesRouter)
