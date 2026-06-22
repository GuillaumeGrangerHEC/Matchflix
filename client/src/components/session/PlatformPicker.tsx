import { PLATFORMS, TMDB_LOGO_BASE_URL } from '@/utils/constants'
import styles from './PlatformPicker.module.css'

interface PlatformPickerProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

export function PlatformPicker({ selected, onChange }: PlatformPickerProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className={styles.grid}>
      {PLATFORMS.map((platform) => {
        const isSelected = selected.includes(platform.id)
        return (
          <button
            key={platform.id}
            type="button"
            className={isSelected ? styles.chipActive : styles.chip}
            onClick={() => toggle(platform.id)}
          >
            {isSelected && <span className={styles.checkBadge}>✓</span>}
            <span className={styles.logoWrap}>
              <img
                className={styles.logo}
                src={`${TMDB_LOGO_BASE_URL}${platform.logoPath}`}
                alt={platform.name}
              />
            </span>
            <span className={styles.name}>{platform.name}</span>
          </button>
        )
      })}
    </div>
  )
}
