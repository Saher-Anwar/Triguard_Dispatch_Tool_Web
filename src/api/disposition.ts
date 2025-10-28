export async function getDispositions() {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/dispositions`)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to fetch dispositions from API')
  }
  
  return response.json()
}