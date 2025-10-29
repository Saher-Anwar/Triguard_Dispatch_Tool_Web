import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription, FieldGroup } from '@/components/ui/field'
import { useRegistrationStore } from '@/store/useRegistrationStore'
import { useUserStore } from '@/store/useUserStore'
import { createUser } from '@/api/user'
import { toast } from 'react-hot-toast'

export function UserRegistrationPage() {
  const navigate = useNavigate()
  const { cognitoData, clearCognitoData } = useRegistrationStore()
  const { setCurrentUser } = useUserStore()
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if no Cognito data (shouldn't happen in normal flow)
  if (!cognitoData) {
    navigate('/')
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create user with profile information
      const userData = {
        name: cognitoData.name || cognitoData.email.split('@')[0],
        email: cognitoData.email,
        avatar: cognitoData.picture,
        profile: {
          phone: formData.phone,
          address: formData.address,
        }
      }

      const newUser = await createUser(userData)
      
      // Set user in store
      setCurrentUser(newUser)
      
      // Clear registration data
      clearCognitoData()
      
      toast.success('Account created successfully!')
      
      // Navigate to main app
      navigate('/')
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Please provide some additional information to complete your account setup.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              <FieldDescription>
                Your contact phone number (optional)
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
              <FieldDescription>
                Your primary address (optional)
              </FieldDescription>
            </Field>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}