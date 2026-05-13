import { getMockStatuses } from '@/mock/mockData'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

export async function getUserStatuses() {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return getMockStatuses()
  }

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/statuses`)
  if (!response.ok) throw new Error('Failed to load user statuses')
  return response.json()
}
