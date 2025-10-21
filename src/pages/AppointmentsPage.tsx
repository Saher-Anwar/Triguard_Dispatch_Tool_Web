import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppointmentCard } from '@/components/appointments/AppointmentCard'
import { AppointmentFilters } from '@/components/appointments/AppointmentFilters'
import { useAppointmentStore } from '@/store/useAppointmentStore'

export function AppointmentsPage() {
  const { getFilteredAppointments, openTrackingModal } = useAppointmentStore()
  const filteredAppointments = getFilteredAppointments()

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

      {/* Filters */}
      <AppointmentFilters />

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onClick={() => {
                if (appointment.status === 'in-progress') {
                  openTrackingModal(appointment)
                }
              }}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No appointments found</p>
            <p className="text-muted-foreground text-sm mt-2">
              Try adjusting your filters or create a new appointment
            </p>
          </div>
        )}
      </div>
    </div>
  )
}