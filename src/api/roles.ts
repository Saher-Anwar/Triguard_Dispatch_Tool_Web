export async function getRoles() {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/roles`)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch roles from API')
  }
  
  return response.json()
}

export function updateRole(userId: string, roleName: string) {
  console.log(`Role selection: User ${userId} assigned role "${roleName}"`)
}

export async function deleteRole(roleId: string) {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/role/${roleId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to delete role')
  }
  
  return response.json()
}