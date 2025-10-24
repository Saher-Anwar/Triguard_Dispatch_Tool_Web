import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { AppointmentDataTable } from '@/components/appointments/AppointmentDataTable'
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog'
import { useQuery } from '@tanstack/react-query'
import { getAppointments, getUserAppointments } from '@/api/appointment'
import type { Appointment } from '@/types'
import { useState } from 'react'

export function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [appointmentFilter, setAppointmentFilter] = useState('all')

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments', appointmentFilter],
    queryFn: appointmentFilter === 'all' ? getAppointments : getUserAppointments,
  })

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Appointments</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filter Button Group */}
      <div className="flex items-center space-x-6">
        <ButtonGroup>
          <Button 
            variant={appointmentFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setAppointmentFilter('all')}
          >
            All Appointments
          </Button>
          <Button 
            variant={appointmentFilter === 'self' ? 'default' : 'outline'}
            onClick={() => setAppointmentFilter('self')}
          >
            My Appointments
          </Button>
        </ButtonGroup>
      </div>

      {/* Appointments Data Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load appointments</p>
        </div>
      ) : (
        <AppointmentDataTable 
          appointments={appointments} 
          onAppointmentClick={handleAppointmentClick}
          showStatusDropdown={appointmentFilter === 'self'}
        />
      )}

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={dialogOpen}
        // important: allow the dialog to control its own close state
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
