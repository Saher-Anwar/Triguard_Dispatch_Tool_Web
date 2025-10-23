export async function getAppointments() {
  // Replace this with `fetch('/api/appointments').then(res => res.json())` later
  const response = await fetch('/mock/appointments.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}
