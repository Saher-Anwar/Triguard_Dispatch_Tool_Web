
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MainLayout } from './components/layout/MainLayout'
import { useThemeStore } from './store/useThemeStore'
import './App.css'
import { AuthGate } from './components/auth/AuthGate'
import { CallbackPage } from './pages/CallbackPage'

function App() {
  const { applyTheme } = useThemeStore()

  useEffect(() => {
    // Apply theme on app startup
    applyTheme()
  }, [applyTheme])

  return (
    <>
      <Routes>
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/*" element={
          <AuthGate>
            <MainLayout />
          </AuthGate>
        } />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-card text-card-foreground border border-border',
          duration: 4000,
        }}
      />
    </>
  )
}

export default App
