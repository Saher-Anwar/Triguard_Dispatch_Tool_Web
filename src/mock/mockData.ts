/**
 * In-memory mock data store for mock mode.
 *
 * Data is loaded once from the JSON files in /public/mock/ and then mutated
 * in-memory so that write operations (create, update, delete) work correctly
 * within a session without needing a real backend.
 */

import type { Appointment, User, Role, Disposition, Timesheet, Permission } from '@/types'

// ─── Seed data (loaded lazily via fetch so we get the same JSON files) ────────

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load mock data from ${path}`)
  return res.json() as Promise<T>
}

// ─── Singleton in-memory stores ───────────────────────────────────────────────

let _appointments: Appointment[] | null = null
let _users: User[] | null = null
let _roles: Role[] | null = null
let _dispositions: Disposition[] | null = null
let _timesheets: Timesheet[] | null = null
let _permissions: Permission[] | null = null
let _statuses: string[] | null = null

let _nextAppointmentId = 100

// ─── Loaders ──────────────────────────────────────────────────────────────────

export async function getMockAppointments(): Promise<Appointment[]> {
  if (!_appointments) {
    _appointments = await loadJson<Appointment[]>('/mock/appointments.json')
    _nextAppointmentId = Math.max(..._appointments.map((a) => a.id), 0) + 1
  }
  return _appointments
}

export async function getMockUsers(): Promise<User[]> {
  if (!_users) {
    _users = await loadJson<User[]>('/mock/users.json')
  }
  return _users
}

export async function getMockRoles(): Promise<Role[]> {
  if (!_roles) {
    _roles = await loadJson<Role[]>('/mock/roles.json')
  }
  return _roles
}

export async function getMockDispositions(): Promise<Disposition[]> {
  if (!_dispositions) {
    _dispositions = await loadJson<Disposition[]>('/mock/dispositions.json')
  }
  return _dispositions
}

export async function getMockTimesheets(): Promise<Timesheet[]> {
  if (!_timesheets) {
    _timesheets = await loadJson<Timesheet[]>('/mock/timesheets.json')
  }
  return _timesheets
}

export async function getMockPermissions(): Promise<Permission[]> {
  if (!_permissions) {
    _permissions = await loadJson<Permission[]>('/mock/permissions.json')
  }
  return _permissions
}

export async function getMockStatuses(): Promise<string[]> {
  if (!_statuses) {
    _statuses = await loadJson<string[]>('/mock/status.json')
  }
  return _statuses
}

// ─── Simulated network delay ──────────────────────────────────────────────────

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

// ─── Mock implementations ─────────────────────────────────────────────────────

// Appointments

export async function mockGetAppointments(): Promise<Appointment[]> {
  await delay()
  return getMockAppointments()
}

export async function mockGetUserAppointments(userId: number): Promise<Appointment[]> {
  await delay()
  const all = await getMockAppointments()
  return all.filter((a) => a.user?.id === String(userId))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function mockGetUsersByAppointmentDistance(_appointmentId: number): Promise<User[]> {
  await delay()
  // Return all users as candidates (sorted by name for predictability)
  const users = await getMockUsers()
  return [...users].sort((a, b) => a.name.localeCompare(b.name))
}

export async function mockCreateAppointment(data: {
  booking_datetime: string
  appointment_type: string
  customer: {
    first_name: string
    last_name: string
    phone: string
    email: string
    location: {
      address: string
      city?: string
      state?: string
      zip_code?: string
      latitude: number
      longitude: number
    }
  }
  details?: Record<string, unknown>
}): Promise<Appointment> {
  await delay()
  const appointments = await getMockAppointments()
  const newAppointment: Appointment = {
    id: _nextAppointmentId++,
    booking_datetime: data.booking_datetime,
    status: 'unassigned',
    customer: {
      id: Math.floor(Math.random() * 900) + 200,
      name: `${data.customer.first_name} ${data.customer.last_name}`,
      email: data.customer.email,
      phone: data.customer.phone,
      location: {
        address: data.customer.location.address,
        city: data.customer.location.city,
        state: data.customer.location.state,
        zip_code: data.customer.location.zip_code,
        country: 'US',
        latitude: data.customer.location.latitude,
        longitude: data.customer.location.longitude,
      },
    },
    user: null,
    details: data.details as Record<string, string | number | boolean | null | undefined> | undefined,
  }
  appointments.push(newAppointment)
  return newAppointment
}

export async function mockAssignUserToAppointment(
  appointmentId: number,
  userId: number | null,
): Promise<Appointment> {
  await delay()
  const appointments = await getMockAppointments()
  const appointment = appointments.find((a) => a.id === appointmentId)
  if (!appointment) throw new Error(`Appointment ${appointmentId} not found`)

  if (userId === null) {
    appointment.user = null
    appointment.status = 'unassigned'
  } else {
    const users = await getMockUsers()
    const user = users.find((u) => u.id === String(userId))
    if (!user) throw new Error(`User ${userId} not found`)
    appointment.user = user
    if (appointment.status === 'unassigned') {
      appointment.status = 'scheduled'
    }
  }
  return appointment
}

export async function mockUpdateAppointmentStatus(
  appointmentId: number,
  status: Appointment['status'],
): Promise<Appointment> {
  await delay()
  const appointments = await getMockAppointments()
  const appointment = appointments.find((a) => a.id === appointmentId)
  if (!appointment) throw new Error(`Appointment ${appointmentId} not found`)
  appointment.status = status
  return appointment
}

export async function mockCompleteAppointment(
  appointmentId: number,
  disposition: Disposition,
  note: string,
): Promise<Appointment> {
  await delay()
  const appointments = await getMockAppointments()
  const appointment = appointments.find((a) => a.id === appointmentId)
  if (!appointment) throw new Error(`Appointment ${appointmentId} not found`)
  appointment.status = 'complete'
  appointment.disposition = { ...disposition }
  appointment.details = {
    ...(appointment.details ?? {}),
    completion_note: note,
  }
  return appointment
}

// Users

export async function mockGetUsers(): Promise<User[]> {
  await delay()
  return getMockUsers()
}

export async function mockGetUserByEmail(email: string): Promise<User | null> {
  await delay()
  const users = await getMockUsers()
  return users.find((u) => u.email === email) ?? null
}

export async function mockCreateUser(userData: {
  name: string
  email: string
  avatar?: string
}): Promise<User> {
  await delay()
  const users = await getMockUsers()
  const newUser: User = {
    id: String(users.length + 100),
    name: userData.name,
    email: userData.email,
    permissions: [],
    role: undefined,
    status: 'Active',
    profile: { avatar: userData.avatar },
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  }
  users.push(newUser)
  return newUser
}

export async function mockUpdateUserRole(userId: string, roleId: string): Promise<User> {
  await delay()
  const [users, roles] = await Promise.all([getMockUsers(), getMockRoles()])
  const user = users.find((u) => u.id === userId)
  if (!user) throw new Error(`User ${userId} not found`)
  const role = roles.find((r) => r.id === roleId)
  if (!role) throw new Error(`Role ${roleId} not found`)
  user.role = role
  return user
}

export async function mockUpdateUserPermissions(
  userId: string,
  permissionCodes: string[],
): Promise<User> {
  await delay()
  const [users, allPerms] = await Promise.all([getMockUsers(), getMockPermissions()])
  const user = users.find((u) => u.id === userId)
  if (!user) throw new Error(`User ${userId} not found`)
  user.permissions = allPerms.filter((p) => permissionCodes.includes(p.code))
  return user
}

export async function mockDeleteUser(userId: string): Promise<{ message: string }> {
  await delay()
  const users = await getMockUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) throw new Error(`User ${userId} not found`)
  users.splice(idx, 1)
  // Also unassign from appointments
  const appointments = await getMockAppointments()
  appointments.forEach((a) => {
    if (a.user?.id === userId) {
      a.user = null
      a.status = 'unassigned'
    }
  })
  return { message: 'User deleted successfully' }
}

// Roles

export async function mockGetRoles(): Promise<Role[]> {
  await delay()
  return getMockRoles()
}

export async function mockCreateRole(
  name: string,
  permissionCodes: string[],
): Promise<Role> {
  await delay()
  const [roles, allPerms] = await Promise.all([getMockRoles(), getMockPermissions()])
  const newRole: Role = {
    id: `role-${Date.now()}`,
    name,
    permissions: allPerms.filter((p) => permissionCodes.includes(p.code)),
  }
  roles.push(newRole)
  return newRole
}

export async function mockDeleteRole(roleId: string): Promise<{ message: string }> {
  await delay()
  const roles = await getMockRoles()
  const idx = roles.findIndex((r) => r.id === roleId)
  if (idx === -1) throw new Error(`Role ${roleId} not found`)
  roles.splice(idx, 1)
  return { message: 'Role deleted successfully' }
}

// Dispositions

export async function mockGetDispositions(): Promise<Disposition[]> {
  await delay()
  return getMockDispositions()
}

export async function mockCreateDisposition(
  code: string,
  description: string,
): Promise<Disposition> {
  await delay()
  const dispositions = await getMockDispositions()
  const existing = dispositions.find((d) => d.code === code)
  if (existing) {
    throw new Error(JSON.stringify({ error: `Disposition code "${code}" already exists` }))
  }
  const newDisposition: Disposition = { code, description }
  dispositions.push(newDisposition)
  return newDisposition
}

export async function mockDeleteDisposition(
  dispositionCode: string,
): Promise<{ message: string }> {
  await delay()
  const dispositions = await getMockDispositions()
  const idx = dispositions.findIndex((d) => d.code === dispositionCode)
  if (idx === -1) throw new Error(`Disposition ${dispositionCode} not found`)
  dispositions.splice(idx, 1)
  return { message: 'Disposition deleted successfully' }
}
