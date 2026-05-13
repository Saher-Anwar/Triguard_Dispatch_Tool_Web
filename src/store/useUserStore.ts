import { create } from 'zustand'
import type { User } from '@/types'
import { persist } from 'zustand/middleware'

interface UserStore {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    { name: 'user-store' } // persists in localStorage
  )
)