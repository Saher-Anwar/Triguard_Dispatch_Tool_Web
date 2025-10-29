import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription, FieldGroup } from '@/components/ui/field'
import { useRegistrationStore } from '@/store/useRegistrationStore'
import { useUserStore } from '@/store/useUserStore'
import { createUser } from '@/api/user'
import { toast } from 'sonner'
import { AddressAutofill } from '@mapbox/search-js-react'

// Make sure to define/obtain this token securely (e.g., from env variables)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export function UserRegistrationPage() {
  const navigate = useNavigate()
  const { cognitoData, clearCognitoData } = useRegistrationStore()
  const { setCurrentUser } = useUserStore()

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
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

  // Handler when autofill result is retrieved
  const handleAddressRetrieve = (result: any) => {
    if (!result || !result.features || result.features.length === 0) return
    const feat = result.features[0]
    
    // Get coordinates [longitude, latitude]
    const longitude = feat.geometry.coordinates[0]
    const latitude = feat.geometry.coordinates[1]
    
    // Parse address components from properties
    const city = feat.properties.context?.place?.text ?? ''
    const state = feat.properties.context?.region?.text ?? ''
    const postalCode = feat.properties.context?.postcode?.text ?? ''
    
    setFormData(prev => ({
      ...prev,
      address: feat.properties.full_address || feat.properties.name || '',
      city,
      state,
      postalCode,
      latitude,
      longitude,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required address field
    if (!formData.address.trim()) {
      toast.error('Please enter your address')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Create user with profile information
      const userData = {
        name: cognitoData.name || cognitoData.email.split('@')[0],
        email: cognitoData.email,
        profile: {
          phone: formData.phone,
          avatar: cognitoData.picture,
        },
        location: {
          address: formData.address,
          city: formData.city,
          zip_code: formData.postalCode,
          latitude: formData.latitude,
          longitude: formData.longitude,
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
                Your contact phone number
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Address</FieldLabel>
              {/* Wrap the address inputs in Mapbox AddressAutofill */}
              <AddressAutofill
                accessToken={MAPBOX_TOKEN}
                // Optional: you can pass other props e.g., country="us", language, etc
                onRetrieve={handleAddressRetrieve}
              >
                <Input
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main St, City, State 12345"
                  required
                />
              </AddressAutofill>
              <FieldDescription>
                Your primary address
              </FieldDescription>
            </Field>

            {/* Optionally you can show city/state/postal fields if you want more granularity */}
            <Field>
              <FieldLabel>City</FieldLabel>
              <Input
                type="text"
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
            </Field>
            <Field>
              <FieldLabel>State</FieldLabel>
              <Input
                type="text"
                name="state"
                autoComplete="address-level1"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
              />
            </Field>
            <Field>
              <FieldLabel>Zip Code</FieldLabel>
              <Input
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="ZIP code"
              />
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
