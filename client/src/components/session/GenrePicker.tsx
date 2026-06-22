import type { Genre } from '@/types'
import styles from './GenrePicker.module.css'

interface GenrePickerProps {
  genres: Genre[]
  selected: number[]
  onChange: (ids: number[]) => void
}

export function GenrePicker({ genres, selected, onChange }: GenrePickerProps) {
  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className={styles.grid}>
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          className={selected.includes(genre.id) ? styles.chipActive : styles.chip}
          onClick={() => toggle(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}
