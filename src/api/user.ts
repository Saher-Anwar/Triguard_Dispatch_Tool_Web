
// src/api/appointmentApi.ts
export async function getUsers() {
  // Replace this with `fetch('/api/users').then(res => res.json())` later
  const response = await fetch('/mock/users.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}


