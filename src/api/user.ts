import type { User } from '@/types'

export async function getUsers(): Promise<User[]> {
  // Replace this with `fetch('/api/users').then(res => res.json())` later
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Mike Johnson',
      permissions: [],
      role: {name: "Master", permissions: []}
    },
    {
      id: '2',
      name: 'David Brown',
      permissions: [],
      role: {name: "Admin", permissions: []}
    },
    {
      id: '3',
      name: 'Sarah Martinez',
      permissions: [],
      role: {name: "Dispatcher", permissions: []}
    }
  ]

  await new Promise((r) => setTimeout(r, 300)) // simulate network delay
  return mockUsers
}

