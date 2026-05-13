import { mockGetRoles, mockCreateRole, mockDeleteRole } from '@/mock/mockData'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

export async function getRoles() {
  if (IS_MOCK) return mockGetRoles()

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

export async function createRole(name: string, permissionCodes: string[]) {
  if (IS_MOCK) return mockCreateRole(name, permissionCodes)

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, permissions: permissionCodes }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to create role')
  }

  return response.json()
}

export async function deleteRole(roleId: string) {
  if (IS_MOCK) return mockDeleteRole(roleId)

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
