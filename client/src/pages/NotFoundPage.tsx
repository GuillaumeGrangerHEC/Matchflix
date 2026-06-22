import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { PageContainer } from '@/components/layout/PageContainer'
import { Header } from '@/components/layout/Header'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <PageContainer>
      <Header />
      <div className={styles.content}>
        <p>{t('notFound_text')}</p>
        <Link to="/" className={styles.link}>
          {t('notFound_back')}
        </Link>
      </div>
    </PageContainer>
  )
}
