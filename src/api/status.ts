export async function getUserStatuses() {
  // Replace this with `fetch('/api/status').then(res => res.json())` later
  const response = await fetch('/mock/status.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}