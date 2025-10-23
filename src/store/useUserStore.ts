import { create } from 'zustand'
import type { User } from '@/types'

interface UserStore {
  currentUser: User
  setCurrentUser: (user: User) => void
}

const currentUser: User = {
  id: 'admin',
  name: 'Admin User',
  permissions: [],
  role: null
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser,
  setCurrentUser: (user) => set({ currentUser: user }),
}))
