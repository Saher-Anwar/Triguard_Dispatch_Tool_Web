
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { MainLayout } from './components/layout/MainLayout'
import { useThemeStore } from './store/useThemeStore'
import './App.css'

function App() {
  const { applyTheme } = useThemeStore()

  useEffect(() => {
    // Apply theme on app startup
    applyTheme()
  }, [applyTheme])

  return (
    <>
      <MainLayout />
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
