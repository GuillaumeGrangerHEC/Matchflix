import { app } from './app'
import { env } from './config/env'
import { logger } from './utils/logger'

app.listen(env.port, () => {
  logger.info(`Matchflix API démarrée sur http://localhost:${env.port}`)
})
