import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { CreateSessionCard } from '@/components/session/CreateSessionCard'
import { JoinSessionForm } from '@/components/session/JoinSessionForm'
import { TmdbAttribution } from '@/components/common/TmdbAttribution'
import styles from './HomePage.module.css'

type Mode = 'create' | 'join'

export function HomePage() {
  const [mode, setMode] = useState<Mode>('create')
  const navigate = useNavigate()

  return (
    <PageContainer>
      <Header subtitle="Trouvez le film parfait à deux." />
      <div className={styles.tabs}>
        <button
          type="button"
          className={mode === 'create' ? styles.tabActive : styles.tab}
          onClick={() => setMode('create')}
        >
          Créer
        </button>
        <button
          type="button"
          className={mode === 'join' ? styles.tabActive : styles.tab}
          onClick={() => setMode('join')}
        >
          Rejoindre
        </button>
      </div>
      {mode === 'create' ? (
        <CreateSessionCard onCreated={() => navigate('/platforms')} />
      ) : (
        <JoinSessionForm onJoined={() => navigate('/platforms')} />
      )}
      <TmdbAttribution />
    </PageContainer>
  )
}
