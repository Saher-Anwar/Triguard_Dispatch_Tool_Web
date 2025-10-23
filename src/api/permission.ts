export async function getPermissions() {
  // Replace this with `fetch('/api/permissions').then(res => res.json())` later
  const response = await fetch('/mock/permissions.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}