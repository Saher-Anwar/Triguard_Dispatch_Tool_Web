import type { Timesheet } from '@/types'
import { getMockTimesheets } from '@/mock/mockData'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

// The name of the mock user whose timesheets are shown in the "My Timesheets" view.
// In a real app this would be resolved from the auth token.
const MOCK_SELF_USER_NAME = 'David Brown'

export async function getTimesheets() {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return getMockTimesheets()
  }

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/timesheets`)
  if (!response.ok) throw new Error('Failed to load timesheets')
  return response.json()
}

export async function getUserTimesheets() {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    const data = await getMockTimesheets()
    return data.filter((timesheet: Timesheet) => timesheet.user.name === MOCK_SELF_USER_NAME)
  }

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/timesheets/me`)
  if (!response.ok) throw new Error('Failed to load user timesheets')
  return response.json()
}
