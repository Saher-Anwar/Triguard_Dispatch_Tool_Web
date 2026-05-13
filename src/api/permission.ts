import { getMockPermissions } from '@/mock/mockData'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

export async function getPermissions() {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return getMockPermissions()
  }

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/permissions`)
  if (!response.ok) throw new Error('Failed to load permissions')
  return response.json()
}
