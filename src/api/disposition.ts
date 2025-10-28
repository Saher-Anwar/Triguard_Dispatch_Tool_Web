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

export async function createDisposition(code: string, description: string) {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/disposition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      description,
    }),
  })
  
  const responseData = await response.json()
  
  if (!response.ok) {
    console.error('API Error:', responseData)
    throw new Error(JSON.stringify(responseData))
  }
  
  return responseData
}

export async function deleteDisposition(dispositionCode: string) {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
  const response = await fetch(`${API_ENDPOINT}/disposition/${dispositionCode}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.error || 'Failed to delete disposition')
  }
  
  return response.json()
}