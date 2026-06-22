export function generateSessionCode(): string {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0')
}

export function isValidSessionCode(code: string): boolean {
  return /^\d{4}$/.test(code)
}
