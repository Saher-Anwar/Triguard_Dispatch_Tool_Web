export async function getUsers() {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/users`)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch users from API')
  }
  
  return response.json()
}

export async function updateUserRole(userId: string, roleId: string) {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/user/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role_id: roleId,
    }),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to update user role')
  }
  
  return response.json()
}


