import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAppointmentStatuses, updateAppointmentStatus } from "@/api/appointment"
import { AppointmentCompletionDialog } from "./AppointmentCompletionDialog"
import type { Appointment, AppointmentStatus } from "@/types"
import { toast } from 'sonner'

export function AppointmentStatusDropdown({ appointment }: { appointment: Appointment }) {
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  // --- Get appointment statuses from type ---
  const statuses = getAppointmentStatuses()

  // --- Handle status update ---
  const { mutate } = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: number; status: AppointmentStatus }) => 
      updateAppointmentStatus(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Status updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update status')
    },
  })

  // --- Handle dropdown selection ---
  const handleStatusSelect = (status: AppointmentStatus, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // If status is "complete", show completion dialog instead of directly updating
    if (status === 'complete') {
      setCompletionDialogOpen(true)
      return
    }
    
    mutate({ appointmentId: appointment.id, status })
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-2 justify-start gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{formatStatus(appointment.status)}</span>
            <ChevronDownIcon className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {statuses.map((status: AppointmentStatus) => (
            <DropdownMenuItem
              key={status}
              onClick={(e) => handleStatusSelect(status, e)}
            >
              {formatStatus(status)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Completion Dialog */}
      <AppointmentCompletionDialog
        appointment={appointment}
        open={completionDialogOpen}
        onOpenChange={setCompletionDialogOpen}
        onComplete={() => {
          // Refresh data after completion
          queryClient.invalidateQueries({ queryKey: ['appointments'] })
        }}
      />
    </>
  )
}