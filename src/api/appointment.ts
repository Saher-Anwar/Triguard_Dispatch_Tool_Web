import type { Appointment } from "@/types"

export async function getAppointments() {
  // Replace this with `fetch('/api/appointments').then(res => res.json())` later
  const response = await fetch('/mock/appointments.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}

export async function getAppointmentStatuses() {
  // Replace this with `fetch('/api/appointments').then(res => res.json())` later
  const response = await fetch('/mock/appointment_statuses.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}

export async function getUserAppointments() {
  // Replace this with `fetch('/api/appointments').then(res => res.json())` later
  const response = await fetch('/mock/appointments.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  const data = await response.json()

  return data.filter((appointment: Appointment) => 
    appointment.assignedUser?.name === "David Brown"
  )
}