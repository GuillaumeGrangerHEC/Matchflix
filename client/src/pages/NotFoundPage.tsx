import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Header } from '@/components/layout/Header'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <PageContainer>
      <Header />
      <div className={styles.content}>
        <p>Page introuvable.</p>
        <Link to="/" className={styles.link}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </PageContainer>
  )
}
