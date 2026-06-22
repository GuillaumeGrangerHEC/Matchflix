import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { translations, type TranslationKey } from '@/i18n/translations'
import { LANGUAGE_STORAGE_KEY } from '@/utils/constants'
import type { Language } from '@/types'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  tError: (err: unknown) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectInitialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'fr' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage)

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
  }, [])

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text: string = translations[language][key]
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replace(`{${name}}`, String(value))
        }
      }
      return text
    },
    [language]
  )

  // sessionService throws Error(code) with a stable code (e.g. "session_full") instead of a
  // localized message, so the UI can pick the right language — this maps code -> error_<code>,
  // falling back to the generic message for anything unrecognized (network errors, etc.).
  const tError = useCallback(
    (err: unknown) => {
      const code = err instanceof Error ? err.message : ''
      const key = `error_${code}` as TranslationKey
      return key in translations[language] ? t(key) : t('error_generic')
    },
    [language, t]
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t, tError }),
    [language, setLanguage, t, tError]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
