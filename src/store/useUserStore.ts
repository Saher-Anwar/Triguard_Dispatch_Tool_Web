import { create } from 'zustand'
import type { User } from '../types'

interface UserStore {
  users: User[]
  currentUser: User
  setUsers: (users: User[]) => void
  setCurrentUser: (user: User) => void
}

// Mock users matching your temp.html
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    role: 'Field Technician',
    permissions: ['View Appointments', 'Update Status', 'Access Maps']
  },
  {
    id: '2',
    name: 'David Brown',
    role: 'Field Technician',
    permissions: ['View Appointments', 'Update Status', 'Access Maps']
  },
  {
    id: '3',
    name: 'Sarah Martinez',
    role: 'Dispatcher',
    permissions: ['View All Appointments', 'Assign Appointments', 'Live Tracking', 'View Reports']
  }
]

const currentUser: User = {
  id: 'admin',
  name: 'Admin User',
  role: 'Master',
  permissions: ['All Permissions']
}

export const useUserStore = create<UserStore>((set) => ({
  users: mockUsers,
  currentUser: currentUser,
  
  setUsers: (users) => set({ users }),
  
  setCurrentUser: (user) => set({ currentUser: user })
}))