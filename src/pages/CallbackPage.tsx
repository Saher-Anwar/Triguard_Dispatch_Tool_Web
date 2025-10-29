import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_COGNITO_CALLBACK_URL

export function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const errorParam = urlParams.get('error')

    if (errorParam) {
      setError(`Authentication error: ${errorParam}`)
      return
    }

    if (!code) {
      setError('No authorization code received')
      return
    }

    async function exchangeCode() {
      try {
        const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: code!,
            redirect_uri: REDIRECT_URI,
          }),
        })

        if (!res.ok) {
          throw new Error(`Token exchange failed: ${res.status}`)
        }

        const data = await res.json()
        
        if (data.error) {
          throw new Error(data.error_description || data.error)
        }

        // Store tokens
        localStorage.setItem('id_token', data.id_token)
        localStorage.setItem('access_token', data.access_token)
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }

        // Redirect to main app
        navigate('/')
      } catch (err) {
        console.error('Token exchange error:', err)
        setError(err instanceof Error ? err.message : 'Failed to complete authentication')
      }
    }

    exchangeCode()
  }, [navigate])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
