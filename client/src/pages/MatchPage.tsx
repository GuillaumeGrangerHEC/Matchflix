import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext } from '@/context/SessionContext'
import { useSession } from '@/hooks/useSession'
import { PageContainer } from '@/components/layout/PageContainer'
import { MatchScreen } from '@/components/match/MatchScreen'

export function MatchPage() {
  const { code, leaveSession } = useSessionContext()
  const session = useSession(code)
  const navigate = useNavigate()

  useEffect(() => {
    if (!code) navigate('/', { replace: true })
  }, [code, navigate])

  useEffect(() => {
    if (session && !session.match) navigate('/swipe', { replace: true })
  }, [session, navigate])

  function handleRestart() {
    leaveSession()
    navigate('/', { replace: true })
  }

  if (!code || !session?.match) return null

  return (
    <PageContainer>
      <MatchScreen match={session.match} onRestart={handleRestart} />
    </PageContainer>
  )
}
