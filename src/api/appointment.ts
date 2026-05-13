import type { AppointmentStatus, Disposition, NewAppointmentData } from '@/types'
import {
  mockGetAppointments,
  mockGetUserAppointments,
  mockGetUsersByAppointmentDistance,
  mockCreateAppointment,
  mockAssignUserToAppointment,
  mockUpdateAppointmentStatus,
  mockCompleteAppointment,
} from '@/mock/mockData'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

export async function getAppointments() {
  if (IS_MOCK) return mockGetAppointments()

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointments`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch appointments from API')
  }

  return response.json()
}

export async function createAppointment(appointmentData: NewAppointmentData) {
  if (IS_MOCK) return mockCreateAppointment(appointmentData)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to create appointment')
  }

  return response.json()
}

export function getAppointmentStatuses(): AppointmentStatus[] {
  return ['unassigned', 'scheduled', 'in progress', 'complete', 'cancelled', 'rescheduled']
}

export async function getUserAppointments(userId: number) {
  if (IS_MOCK) return mockGetUserAppointments(userId)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/users/${userId}/appointments`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch user appointments from API')
  }

  return response.json()
}

export async function getUsersByAppointmentDistance(appointmentId: number) {
  if (IS_MOCK) return mockGetUsersByAppointmentDistance(appointmentId)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointment/${appointmentId}/users`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch users by distance from API')
  }

  return response.json()
}

export async function assignUserToAppointment(appointmentId: number, userId: number | null) {
  if (IS_MOCK) return mockAssignUserToAppointment(appointmentId, userId)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointment/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to assign user to appointment')
  }

  return response.json()
}

export async function updateAppointmentStatus(appointmentId: number, status: AppointmentStatus) {
  if (IS_MOCK) return mockUpdateAppointmentStatus(appointmentId, status)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointment/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to update appointment status')
  }

  return response.json()
}

export async function completeAppointment(
  appointmentId: number,
  disposition: Disposition,
  note: string,
) {
  if (IS_MOCK) return mockCompleteAppointment(appointmentId, disposition, note)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointment/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'complete',
      disposition_id: disposition.code,
      details: {
        completion_note: note,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to complete appointment')
  }

  return response.json()
}
