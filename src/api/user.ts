import type { User } from '@/types'
import type { Permission } from '@/types'

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

export async function getPermissions(): Promise<Permission[]> {
  const mockPermissions: Permission[] = [
    { code: 'APPOINTMENTS.VIEW.ALL', description: 'View Appointments' },
    { code: 'APPOINTMENTS.VIEW.SELF', description: 'View Your Appointments' },
    { code: 'APPOINTMENTS.CREATE', description: 'Create Appointments' },
    { code: 'APPOINTMENTS.DELETE', description: 'Delete Appointments' },
    { code: 'APPOINTMENTS.UPDATE.ASSIGN_AGENT', description: 'Assign or Reassign Agents to Appointment' },
    { code: 'APPOINTMENTS.UPDATE.SELF_ASSIGN', description: 'Assign Yourself to Appointment' },
    { code: 'APPOINTMENTS.UPDATE.STATUS', description: 'Update Appointment Status' },

    { code: 'USERS.VIEW', description: 'View All Users' },
    { code: 'USERS.CREATE', description: 'Create Users' },
    { code: 'USERS.DELETE', description: 'Delete Users' },
    { code: 'USERS.UPDATE.PERMISSIONS', description: 'Update User Permissions' },

    { code: 'ROLES.CREATE', description: 'Create Roles' },
    { code: 'ROLES.DELETE', description: 'Delete Roles' },
    { code: 'ROLES.UPDATE', description: 'Add Permissions to Roles' },

    { code: 'DISPOSITIONS.CREATE', description: 'Create Dispositions' },
    { code: 'DISPOSITIONS.DELETE', description: 'Delete Dispositions' },
  ]

  await new Promise((r) => setTimeout(r, 300)) // simulate network delay
  return mockPermissions
}