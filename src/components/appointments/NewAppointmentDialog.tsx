import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddressAutofill } from '@mapbox/search-js-react'
import { toast } from 'sonner'
import { createAppointment } from '@/api/appointment'
import type { NewAppointmentData } from '@/types'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewAppointmentDialog({ open, onOpenChange }: NewAppointmentDialogProps) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    // Appointment details
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'physical' as 'physical' | 'virtual',

    // Customer information
    customerFirstName: '',
    customerLastName: '',
    customerPhone: '',
    customerEmail: '',

    // Address
    address: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,

    // Additional details
    roofAge: '',
    mainConcern: '',

    // Spouse information
    spouseFirstName: '',
    spouseLastName: '',
    spousePhone: '',
    spouseEmail: '',

    // Credit and notes
    creditScore: '',
    callCenterNotes: '',
  })

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment created successfully')
      handleClose()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create appointment')
    },
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressRetrieve = (result: any) => {
    if (!result || !result.features || result.features.length === 0) return
    const feat = result.features[0]

    const longitude = feat.geometry.coordinates[0]
    const latitude = feat.geometry.coordinates[1]

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

  const handleClose = () => {
    setFormData({
      appointmentDate: '',
      appointmentTime: '',
      appointmentType: 'physical',
      customerFirstName: '',
      customerLastName: '',
      customerPhone: '',
      customerEmail: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      latitude: 0,
      longitude: 0,
      roofAge: '',
      mainConcern: '',
      spouseFirstName: '',
      spouseLastName: '',
      spousePhone: '',
      spouseEmail: '',
      creditScore: '',
      callCenterNotes: '',
    })
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please select appointment date and time')
      return
    }
    if (!formData.customerFirstName || !formData.customerLastName) {
      toast.error('Please enter customer name')
      return
    }
    if (!formData.customerPhone) {
      toast.error('Please enter customer phone')
      return
    }
    if (!formData.customerEmail) {
      toast.error('Please enter customer email')
      return
    }
    if (!formData.address) {
      toast.error('Please enter customer address')
      return
    }

    // Combine date and time into datetime
    const bookingDatetime = `${formData.appointmentDate}T${formData.appointmentTime}`

    const appointmentData: NewAppointmentData = {
      booking_datetime: bookingDatetime,
      appointment_type: formData.appointmentType,
      customer: {
        first_name: formData.customerFirstName,
        last_name: formData.customerLastName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.postalCode,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
      },
      details: {
        roof_age: formData.roofAge ? parseInt(formData.roofAge) : undefined,
        main_concern: formData.mainConcern,
        spouse: {
          first_name: formData.spouseFirstName,
          last_name: formData.spouseLastName,
          phone: formData.spousePhone,
          email: formData.spouseEmail,
        },
        credit_score: formData.creditScore ? parseInt(formData.creditScore) : undefined,
        call_center_notes: formData.callCenterNotes,
      },
    }

    createAppointmentMutation.mutate(appointmentData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">Create New Appointment</DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the appointment details and customer information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Appointment Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Date *</FieldLabel>
                <Input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Time *</FieldLabel>
                <Input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                  required
                />
              </Field>
            </div>

            {/* Appointment Type */}
            <Field>
              <FieldLabel>Appointment Type *</FieldLabel>
              <Select
                value={formData.appointmentType}
                onValueChange={(value) => handleInputChange('appointmentType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Customer Information */}
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-semibold">Customer Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name *</FieldLabel>
                <Input
                  type="text"
                  value={formData.customerFirstName}
                  onChange={(e) => handleInputChange('customerFirstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Last Name *</FieldLabel>
                <Input
                  type="text"
                  value={formData.customerLastName}
                  onChange={(e) => handleInputChange('customerLastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Phone *</FieldLabel>
                <Input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Email *</FieldLabel>
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </Field>
            </div>

            {/* Address */}
            <Field>
              <FieldLabel>Address *</FieldLabel>
              <AddressAutofill
                accessToken={MAPBOX_TOKEN}
                onRetrieve={handleAddressRetrieve}
                options={{ appendTo: document.querySelector('[data-radix-dialog-content]') }}
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
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="12345"
                />
              </Field>
            </div>

            {/* Additional Details */}
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-semibold">Additional Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Roof Age (years)</FieldLabel>
                <Input
                  type="number"
                  value={formData.roofAge}
                  onChange={(e) => handleInputChange('roofAge', e.target.value)}
                  placeholder="10"
                  min="0"
                />
              </Field>

              <Field>
                <FieldLabel>Credit Score</FieldLabel>
                <Input
                  type="number"
                  value={formData.creditScore}
                  onChange={(e) => handleInputChange('creditScore', e.target.value)}
                  placeholder="700"
                  min="300"
                  max="850"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Main Concern</FieldLabel>
              <Textarea
                value={formData.mainConcern}
                onChange={(e) => handleInputChange('mainConcern', e.target.value)}
                placeholder="Describe the main concern..."
                rows={3}
              />
            </Field>

            {/* Spouse Information */}
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-semibold">Spouse Information (Optional)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  type="text"
                  value={formData.spouseFirstName}
                  onChange={(e) => handleInputChange('spouseFirstName', e.target.value)}
                  placeholder="Jane"
                />
              </Field>

              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  type="text"
                  value={formData.spouseLastName}
                  onChange={(e) => handleInputChange('spouseLastName', e.target.value)}
                  placeholder="Doe"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input
                  type="tel"
                  value={formData.spousePhone}
                  onChange={(e) => handleInputChange('spousePhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={formData.spouseEmail}
                  onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
                  placeholder="jane.doe@example.com"
                />
              </Field>
            </div>

            {/* Call Center Notes */}
            <Field>
              <FieldLabel>Call Center Notes</FieldLabel>
              <Textarea
                value={formData.callCenterNotes}
                onChange={(e) => handleInputChange('callCenterNotes', e.target.value)}
                placeholder="Additional notes from call center..."
                rows={4}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAppointmentMutation.isPending}
            >
              {createAppointmentMutation.isPending ? 'Creating...' : 'Create Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
