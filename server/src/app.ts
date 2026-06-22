import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { apiRouter } from './routes'
import { errorHandler } from './middleware/errorHandler'

export const app = express()

app.use(cors({ origin: env.clientOrigins }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiRouter)

app.use(errorHandler)
