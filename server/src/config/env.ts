import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`)
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  // Liste séparée par des virgules, pour autoriser à la fois localhost (PC) et l'IP du réseau local (téléphone).
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
  tmdbApiKey: required('TMDB_API_KEY'),
  tmdbBaseUrl: process.env.TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
}
