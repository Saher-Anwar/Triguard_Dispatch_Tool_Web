import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default to dark to match your design
      
      setTheme: (theme: Theme) => {
        set({ theme })
        get().applyTheme()
      },
      
      applyTheme: () => {
        const { theme } = get()
        const root = window.document.documentElement
        
        root.classList.remove('light', 'dark')
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          root.classList.add(systemTheme)
        } else {
          root.classList.add(theme)
        }
      },
    }),
    {
      name: 'triguard-theme',
    }
  )
)

// Initialize theme on first load
if (typeof window !== 'undefined') {
  useThemeStore.getState().applyTheme()
}