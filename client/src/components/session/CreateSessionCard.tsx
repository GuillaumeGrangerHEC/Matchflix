import { useState } from 'react'
import { useSessionContext } from '@/context/SessionContext'
import { useLanguage } from '@/context/LanguageContext'
import { SUPPORTED_COUNTRIES, MEDIA_TYPES, MIN_GROUP_SIZE, MAX_GROUP_SIZE } from '@/utils/constants'
import type { CountryCode, MediaType } from '@/types'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import styles from './CreateSessionCard.module.css'

export function CreateSessionCard({ onCreated }: { onCreated: (code: string) => void }) {
  const { createNewSession } = useSessionContext()
  const { language, t, tError } = useLanguage()
  const [country, setCountry] = useState<CountryCode>('FR')
  const [mediaType, setMediaType] = useState<MediaType>('movie')
  const [groupSize, setGroupSize] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setLoading(true)
    setError(null)
    try {
      const code = await createNewSession(country, mediaType, groupSize)
      onCreated(code)
    } catch (err) {
      setError(tError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <p className={styles.label}>{t('create_country')}</p>
      <div className={styles.countries}>
        {SUPPORTED_COUNTRIES.map((c) => (
          <button
            key={c.code}
            type="button"
            className={c.code === country ? styles.countryActive : styles.country}
            onClick={() => setCountry(c.code)}
          >
            {language === 'en' ? c.labelEn : c.label}
          </button>
        ))}
      </div>
      <p className={styles.label}>{t('create_mediaType')}</p>
      <div className={styles.countries}>
        {MEDIA_TYPES.map((m) => (
          <button
            key={m.value}
            type="button"
            className={m.value === mediaType ? styles.countryActive : styles.country}
            onClick={() => setMediaType(m.value)}
          >
            {language === 'en' ? m.labelEn : m.label}
          </button>
        ))}
      </div>
      <p className={styles.label}>{t('create_groupSize')}</p>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepperButton}
          disabled={groupSize <= MIN_GROUP_SIZE}
          onClick={() => setGroupSize((n) => Math.max(MIN_GROUP_SIZE, n - 1))}
        >
          −
        </button>
        <span className={styles.stepperValue}>{groupSize}</span>
        <button
          type="button"
          className={styles.stepperButton}
          disabled={groupSize >= MAX_GROUP_SIZE}
          onClick={() => setGroupSize((n) => Math.min(MAX_GROUP_SIZE, n + 1))}
        >
          +
        </button>
      </div>
      {groupSize > 2 && (
        <p className={styles.hint}>
          {t('create_majorityHint', {
            threshold: Math.floor(groupSize / 2) + 1,
            groupSize,
            media: mediaType === 'tv' ? t('create_tvWord') : t('create_movieWord'),
          })}
        </p>
      )}
      <Button fullWidth onClick={handleCreate} disabled={loading}>
        {loading ? <Spinner /> : t('create_button')}
      </Button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
