import type { Timesheet } from "@/types"

export async function getTimesheets() {
  // Replace this with `fetch('/api/timesheets').then(res => res.json())` later
  const response = await fetch('/mock/timesheets.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  return response.json()
}

export async function getUserTimesheets() {
  // Replace this with `fetch('/api/timesheets').then(res => res.json())` later
  const response = await fetch('/mock/timesheets.json') // served from /public/mock/
  if (!response.ok) throw new Error('Failed to load mock data')
  await new Promise((r) => setTimeout(r, 300))
  const data = await response.json()

  return data.filter((timesheet: Timesheet) => 
    timesheet.user.name === "David Brown"
  )
}