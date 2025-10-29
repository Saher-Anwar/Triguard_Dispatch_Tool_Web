import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { getUserByEmail, createUser } from '@/api/user'
import { jwtDecode } from 'jwt-decode'

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_COGNITO_CALLBACK_URL
const RESPONSE_TYPE = 'code'
const SCOPE = 'openid email profile'

interface CognitoTokenPayload {
  sub: string
  email: string
  name?: string
  picture?: string
  exp: number
  iat: number
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, clearUser } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializeAuth() {
      try {
        const idToken = localStorage.getItem('id_token')

        if (!idToken) {
          // Not logged in, redirect to Cognito hosted login
          const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`
          window.location.href = loginUrl
          return
        }

        // Decode and validate token
        const decoded = jwtDecode<CognitoTokenPayload>(idToken)
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired, redirecting to login')
          localStorage.removeItem('id_token')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          clearUser()
          const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`
          window.location.href = loginUrl
          return
        }

        // Try to get user from backend
        let user = await getUserByEmail(decoded.email)
        
        if (!user) {
          // User doesn't exist in backend, create them
          console.log('User not found in database, creating new user')
          user = await createUser({
            name: decoded.name || decoded.email.split('@')[0],
            email: decoded.email,
            avatar: decoded.picture,
          })
        }

        setCurrentUser(user)
        setIsLoading(false)
      } catch (err) {
        console.error('Authentication error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setIsLoading(false)
        // Clear tokens and redirect to login
        localStorage.removeItem('id_token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        clearUser()
        setTimeout(() => {
          const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`
          window.location.href = loginUrl
        }, 3000)
      }
    }

    if (!currentUser) {
      initializeAuth()
    } else {
      setIsLoading(false)
    }
  }, [currentUser, setCurrentUser, clearUser])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
