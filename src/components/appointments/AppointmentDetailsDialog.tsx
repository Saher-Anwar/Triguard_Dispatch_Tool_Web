import { MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Appointment } from '@/types'

const statusStyles = {
  'unassigned': 'status-unassigned',
  'scheduled': 'status-scheduled',
  'in progress': 'status-in-progress',
  'complete': 'status-complete',
  'cancelled': 'status-cancelled',
  'rescheduled': 'status-rescheduled'
}

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentDetailsDialog({ 
  appointment, 
  open,
  onOpenChange
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  const showDisposition = appointment.status === 'complete'
  const showLiveTracking = appointment.status === 'in progress'

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Appointment Details - {appointment.customer?.name || 'Unknown Customer'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Accordion type="multiple" defaultValue={["details"]} className="w-full">
            {/* Appointment Details - Always shown */}
            <AccordionItem value="details">
              <AccordionTrigger>Appointment Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </div>
                    <div className="text-lg font-medium">
                      {appointment.customer?.name || 'Unknown Customer'}
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
                          statusStyles[appointment.status as keyof typeof statusStyles]
                        )}
                      >
                        {formatStatus(appointment.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Address
                    </div>
                    <div className="text-lg font-medium">
                      {appointment.customer?.address || 'No address provided'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Scheduled Time
                    </div>
                    <div className="text-lg font-medium">
                      {new Date(appointment.booking_datetime).toLocaleString()}
                    </div>
                  </div>

                  {appointment.user && (
                    <div className="space-y-1 md:col-span-2">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Assigned User
                      </div>
                      <div className="text-lg font-medium">
                        {appointment.user.name}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Disposition - Only shown when status is complete */}
            {showDisposition && (
              <AccordionItem value="disposition">
                <AccordionTrigger>Disposition</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-4">
                    {appointment.disposition ? (
                      <>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Disposition
                          </div>
                          <div className="text-lg font-medium">
                            {appointment.disposition.code}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Description
                          </div>
                          <div className="text-base">
                            {appointment.disposition.description}
                          </div>
                        </div>

                        {appointment.disposition.notes && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                              Notes
                            </div>
                            <div className="text-base bg-muted p-3 rounded-md">
                              {appointment.disposition.notes}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-muted-foreground italic">
                        No disposition information available
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Live Tracking - Only shown when status is in-progress */}
            {showLiveTracking && (
              <AccordionItem value="tracking">
                <AccordionTrigger>Live Tracking</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-6">
                    {/* Tracking Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            ETA
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                            12 mins
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            Distance
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                            3.2 mi
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            Technician
                          </div>
                          <div className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                            {appointment.user?.name || 'Unassigned'}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Map Placeholder */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center h-64 bg-secondary rounded-lg">
                          <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
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
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}