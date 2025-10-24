import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppointmentDataTable } from '@/components/appointments/AppointmentDataTable'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useQuery } from '@tanstack/react-query'
import { getAppointments } from '@/api/appointment'
import type { Appointment } from '@/types'

export function AppointmentsPage() {
  const { openTrackingModal } = useAppointmentStore()
  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  })

  const handleAppointmentClick = (appointment: Appointment) => {
    if (appointment.status === 'in-progress') {
      openTrackingModal(appointment)
    }
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
        />
      )}
    </div>
  )
}
