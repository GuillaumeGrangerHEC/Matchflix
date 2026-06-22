import styles from './SwipeActions.module.css'

interface SwipeActionsProps {
  disabled?: boolean
  onPass: () => void
  onLike: () => void
}

export function SwipeActions({ disabled, onPass, onLike }: SwipeActionsProps) {
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.pass} onClick={onPass} disabled={disabled} aria-label="Passer">
        ✕
      </button>
      <button type="button" className={styles.like} onClick={onLike} disabled={disabled} aria-label="J'aime">
        ❤
      </button>
    </div>
  )
}
