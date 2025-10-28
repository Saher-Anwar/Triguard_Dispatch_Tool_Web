import type { AppointmentStatus } from "@/types"

export async function getAppointments() {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/appointments`)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch appointments from API')
  }
  
  return response.json()
}

export function getAppointmentStatuses(): AppointmentStatus[] {
  return ['unassigned', 'scheduled', 'in progress', 'complete', 'cancelled', 'rescheduled']
}

export async function getUserAppointments(userId: number) {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/users/${userId}/appointments`)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch user appointments from API')
  }
  
  return response.json()
}