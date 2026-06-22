import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext } from '@/context/SessionContext'
import { useLanguage } from '@/context/LanguageContext'
import { useSession } from '@/hooks/useSession'
import { MOVIE_GENRES, TV_GENRES } from '@/utils/constants'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { PlatformPicker } from '@/components/session/PlatformPicker'
import { GenrePicker } from '@/components/session/GenrePicker'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import styles from './PlatformsPage.module.css'

export function PlatformsPage() {
  const { code, setPlatforms, setGenres } = useSessionContext()
  const { t } = useLanguage()
  const session = useSession(code)
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!code) navigate('/', { replace: true })
  }, [code, navigate])

  const users = session ? Object.entries(session.users ?? {}) : []
  const groupSize = session?.groupSize ?? 2
  const readyCount = users.filter(([, u]) => (u.platforms?.length ?? 0) > 0).length
  const groupReady = users.length === groupSize && readyCount === groupSize

  useEffect(() => {
    if (groupReady) navigate('/swipe', { replace: true })
  }, [groupReady, navigate])

  async function handleConfirm() {
    await Promise.all([setPlatforms(selected), setGenres(selectedGenres)])
    setConfirmed(true)
  }

  if (!code) return null

  const genreOptions = session?.mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES

  return (
    <PageContainer>
      <Header subtitle={t('platforms_codeLabel', { code })} />
      {confirmed ? (
        <div className={styles.waiting}>
          <p className={styles.bigCode}>{code}</p>
          <Spinner />
          <p>{t('platforms_waiting', { ready: readyCount, total: groupSize })}</p>
        </div>
      ) : (
        <>
          <p className={styles.instructions}>{t('platforms_instructions')}</p>
          <PlatformPicker selected={selected} onChange={setSelected} />
          <p className={styles.instructions}>{t('platforms_genresInstructions')}</p>
          <GenrePicker genres={genreOptions} selected={selectedGenres} onChange={setSelectedGenres} />
          <div className={styles.actions}>
            <Button fullWidth disabled={selected.length === 0} onClick={handleConfirm}>
              {t('platforms_continue')}
            </Button>
          </div>
        </>
      )}
    </PageContainer>
  )
}
