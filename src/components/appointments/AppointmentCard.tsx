import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Appointment } from '@/types'
import { cn } from '@/lib/utils'

interface AppointmentCardProps {
  appointment: Appointment
  onClick?: () => void
}

const statusStyles = {
  'unassigned': 'status-unassigned',
  'scheduled': 'status-scheduled',
  'in-progress': 'status-in-progress',
  'complete': 'status-complete',
  'cancelled': 'status-cancelled',
  'rescheduled': 'status-rescheduled'
}

const statusLabels = {
  'unassigned': 'Unassigned',
  'scheduled': 'Scheduled',
  'in-progress': 'In Progress',
  'complete': 'Complete',
  'cancelled': 'Cancelled',
  'rescheduled': 'Rescheduled'
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-200 hover:border-border/50 hover:transform hover:translate-x-1",
        "grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-center"
      )}
      onClick={onClick}
    >
      {/* Customer Info */}
      <div className="md:col-span-2">
        <h3 className="font-semibold text-lg mb-1">{appointment.customerName}</h3>
        <p className="text-sm text-muted-foreground">{appointment.customerAddress}</p>
      </div>

      {/* Date/Time */}
      <div className="text-sm text-muted-foreground">
        {appointment.datetime}
      </div>

      {/* Status */}
      <div>
        <Badge 
          variant="secondary" 
          className={cn(
            "px-4 py-2 rounded-full font-semibold text-sm",
            statusStyles[appointment.status]
          )}
        >
          {statusLabels[appointment.status]}
        </Badge>
      </div>

      {/* Assigned User */}
      <div className="flex items-center gap-3">
        {appointment.assignedUser ? (
          <>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <span className="text-sm font-medium">{appointment.assignedUser.name}</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    </Card>
  )
}