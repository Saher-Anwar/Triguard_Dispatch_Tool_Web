import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'
import { useRegistrationStore } from '@/store/useRegistrationStore'
import { getUserByEmail } from '@/api/user'
import { jwtDecode } from 'jwt-decode'
import { MOCK_USER } from '@/mock/mockUser'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

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
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, clearUser } = useUserStore()
  const { setCognitoData } = useRegistrationStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // ── Mock mode: skip Cognito entirely and inject a pre-built user ──────────
    if (IS_MOCK) {
      if (!currentUser) {
        setCurrentUser(MOCK_USER)
      }
      setIsLoading(false)
      return
    }

    // ── Normal auth flow ──────────────────────────────────────────────────────
    async function initializeAuth() {
      try {
        const idToken = localStorage.getItem('id_token')

        if (!idToken) {
          const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`
          window.location.href = loginUrl
          return
        }

        const decoded = jwtDecode<CognitoTokenPayload>(idToken)

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

        const user = await getUserByEmail(decoded.email)

        if (!user) {
          console.log('User not found in database, redirecting to registration')
          setCognitoData({
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
          })
          navigate('/register')
          return
        }

        setCurrentUser(user)
        setIsLoading(false)
      } catch (err) {
        console.error('Authentication error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setIsLoading(false)
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
  }, [currentUser, setCurrentUser, clearUser, setCognitoData, navigate])

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
          <p className="text-gray-600">
            {IS_MOCK ? 'Loading mock user...' : 'Loading user data...'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
