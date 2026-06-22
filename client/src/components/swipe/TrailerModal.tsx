import { motion } from 'framer-motion'
import styles from './TrailerModal.module.css'

export function TrailerModal({ videoKey, onClose }: { videoKey: string; onClose: () => void }) {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className={styles.player} onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="Trailer"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
    </motion.div>
  )
}
