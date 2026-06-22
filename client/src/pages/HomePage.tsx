import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
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
  const { t } = useLanguage()

  return (
    <PageContainer>
      <Header subtitle={t('home_subtitle')} />
      <div className={styles.tabs}>
        <button
          type="button"
          className={mode === 'create' ? styles.tabActive : styles.tab}
          onClick={() => setMode('create')}
        >
          {t('home_createTab')}
        </button>
        <button
          type="button"
          className={mode === 'join' ? styles.tabActive : styles.tab}
          onClick={() => setMode('join')}
        >
          {t('home_joinTab')}
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
