import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext } from '@/context/SessionContext'
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
      <Header subtitle={`Code de session : ${code}`} />
      {confirmed ? (
        <div className={styles.waiting}>
          <Spinner />
          <p>
            En attente des autres participants… ({readyCount}/{groupSize} prêts)
          </p>
        </div>
      ) : (
        <>
          <p className={styles.instructions}>Sélectionnez vos plateformes de streaming :</p>
          <PlatformPicker selected={selected} onChange={setSelected} />
          <p className={styles.instructions}>Genres (optionnel — utile si vous êtes d&apos;accord) :</p>
          <GenrePicker genres={genreOptions} selected={selectedGenres} onChange={setSelectedGenres} />
          <div className={styles.actions}>
            <Button fullWidth disabled={selected.length === 0} onClick={handleConfirm}>
              Continuer
            </Button>
          </div>
        </>
      )}
    </PageContainer>
  )
}
