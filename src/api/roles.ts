export async function getRoles() {
  // Replace this with `fetch('/api/roles').then(res => res.json())` later
  const response = await fetch('/mock/roles.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}

export function updateRole(userId: string, roleName: string) {
  console.log(`Role selection: User ${userId} assigned role "${roleName}"`)
}