import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/context/LanguageContext'
import { SessionProvider } from '@/context/SessionContext'
import { AppRouter } from './router'

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SessionProvider>
          <AppRouter />
        </SessionProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
