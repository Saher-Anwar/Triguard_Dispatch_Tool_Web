/**
 * The mock user that is injected into the user store when running in mock mode.
 * This user has the Master role with all permissions so every feature is accessible.
 * Change the permissions array here to test different access levels.
 */

import type { User } from '@/types'

export const MOCK_USER: User = {
  id: '1',
  name: 'Mike Johnson (Mock)',
  email: 'mike.johnson@company.com',
  status: 'Active',
  role: {
    id: 'role-1',
    name: 'Master',
    permissions: [
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
    ],
  },
  permissions: [
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
  ],
  profile: {
    age: 35,
    phone: '+1 (555) 123-4567',
  },
  location: {
    address: '123 Main St, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    country: 'US',
    zip_code: '10001',
    latitude: 40.7128,
    longitude: -74.006,
  },
}
