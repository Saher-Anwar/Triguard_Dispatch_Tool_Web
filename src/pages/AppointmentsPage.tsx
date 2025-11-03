import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { AppointmentDataTable } from '@/components/appointments/AppointmentDataTable'
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog'
import { useQuery } from '@tanstack/react-query'
import { getAppointments, getUserAppointments } from '@/api/appointment'
import type { Appointment } from '@/types'
import { useState } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { usePermissions } from '@/hooks/usePermissions'

export function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [appointmentFilter, setAppointmentFilter] = useState('all')
  const { currentUser } = useUserStore()
  const { hasPermission } = usePermissions()

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments', appointmentFilter],
    queryFn: appointmentFilter === 'all' 
      ? getAppointments 
      : () => getUserAppointments(parseInt(currentUser?.id || '0')),
    staleTime: 5 * 60 * 1000, // 5 mins
    enabled: appointmentFilter === 'all' || !!currentUser
  })

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogOpen(true)
  }

  const handleNewAppointment = () => {
    window.open('https://appointment-form.thspros.com/', '_blank')
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Bar - Desktop only (title shown in mobile header) */}
      <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Appointments</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          {hasPermission('APPOINTMENTS.CREATE') && (
            <Button className="gap-2" onClick={handleNewAppointment}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Appointment</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        {hasPermission('APPOINTMENTS.CREATE') && (
          <Button size="sm" className="flex-1 gap-2" onClick={handleNewAppointment}>
            <Plus className="h-4 w-4" />
            New
          </Button>
        )}
      </div>

      {/* Filter Button Group */}
      <div className="flex items-center w-full">
        <ButtonGroup className="w-full md:w-auto">
          {hasPermission('APPOINTMENTS.VIEW.ALL') && (
            <Button
              variant={appointmentFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setAppointmentFilter('all')}
              className="flex-1 md:flex-none"
            >
              All
            </Button>
          )}
          {hasPermission('APPOINTMENTS.VIEW.SELF') && (
            <Button
              variant={appointmentFilter === 'self' ? 'default' : 'outline'}
              onClick={() => setAppointmentFilter('self')}
              className="flex-1 md:flex-none"
            >
              My Appointments
            </Button>
          )}
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
          showStatusDropdown={(appointmentFilter === 'all' || appointmentFilter === 'self') && hasPermission('APPOINTMENTS.UPDATE.STATUS')}
          showUserDropdown={appointmentFilter === 'all' && hasPermission('APPOINTMENTS.UPDATE.ASSIGN_AGENT')}
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
