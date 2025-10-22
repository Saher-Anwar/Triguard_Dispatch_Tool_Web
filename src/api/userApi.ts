import type { User } from '@/types'

export async function getUsers(): Promise<User[]> {
  // Replace this with `fetch('/api/users').then(res => res.json())` later
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
      permissions: [
        'View All Appointments',
        'Assign Appointments',
        'Live Tracking',
        'View Reports'
      ]
    }
  ]

  await new Promise((r) => setTimeout(r, 300)) // simulate network delay
  return mockUsers
}
