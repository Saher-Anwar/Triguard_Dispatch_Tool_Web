import { MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { cn } from '@/lib/utils'

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

export function TrackingModal() {
  const { selectedAppointment, isTrackingModalOpen, closeTrackingModal } = useAppointmentStore()

  if (!selectedAppointment) return null

  return (
    <Dialog open={isTrackingModalOpen} onOpenChange={closeTrackingModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Live Tracking - {selectedAppointment.customer?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Appointment Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </div>
                  <div className="text-lg font-medium">
                    {selectedAppointment.customer?.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </div>
                  <div>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "px-3 py-1 rounded-full font-semibold",
                        statusStyles[selectedAppointment.status]
                      )}
                    >
                      {statusLabels[selectedAppointment.status]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Address
                  </div>
                  <div className="text-lg font-medium">
                    {selectedAppointment.customer?.location.address}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Scheduled Time
                  </div>
                  <div className="text-lg font-medium">
                    {selectedAppointment.booking_datetime}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tracking Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  ETA
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  12 mins
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Distance
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  3.2 mi
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Technician
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  {selectedAppointment.user?.name || 'Unassigned'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center h-96 bg-secondary rounded-lg">
                <MapPin className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Map with Live Route Tracking
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Map integration will be added when mapping libraries are installed
                </p>
              </div>
            </CardContent>
          </Card>




        </div>
      </DialogContent>
    </Dialog>
  )
}