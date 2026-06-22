import { useState, type FormEvent } from 'react'
import { useSessionContext } from '@/context/SessionContext'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import styles from './JoinSessionForm.module.css'

export function JoinSessionForm({ onJoined }: { onJoined: () => void }) {
  const { joinExistingSession } = useSessionContext()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await joinExistingSession(code)
      onJoined()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        placeholder="0000"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
        required
      />
      <Button type="submit" fullWidth disabled={loading || code.length !== 4}>
        {loading ? <Spinner /> : 'Rejoindre la session'}
      </Button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  )
}
