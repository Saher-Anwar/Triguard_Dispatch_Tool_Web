import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAppointmentStatuses } from "@/api/appointment"
import type { Appointment, AppointmentStatus } from "@/types"

export function AppointmentStatusDropdown({ appointment }: { appointment: Appointment }) {
  const queryClient = useQueryClient()

  // --- Fetch all appointment statuses ---
  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ['appointmentStatuses'],
    queryFn: getAppointmentStatuses,
  })

  // --- Handle status update (optimistic UI) ---
  const { mutate } = useMutation({
    mutationFn: async ({ appointmentId, status }: { appointmentId: string; status: AppointmentStatus }) => {
      // Simulate API call (you can await a real fetch here later)
      console.log(`Updating appointment ${appointmentId} status to ${status}`)
      await new Promise((r) => setTimeout(r, 300)) // simulate latency
      return { appointmentId, status }
    },

    // Optimistic update
    onMutate: async ({ appointmentId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['appointments'] })
      const previousAppointments = queryClient.getQueryData<Appointment[]>(['appointments', 'self'])

      if (previousAppointments) {
        queryClient.setQueryData<Appointment[]>(['appointments', 'self'], (old) =>
          old?.map((appt) =>
            appt.id === appointmentId
              ? { ...appt, status }
              : appt
          )
        )
      }

      return { previousAppointments }
    },

    // Roll back on error
    onError: (_err, _vars, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments', 'self'], context.previousAppointments)
      }
    },

    // Always refetch to sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })

  // --- Handle dropdown selection ---
  const handleStatusSelect = (status: AppointmentStatus, e: React.MouseEvent) => {
    e.stopPropagation()
    mutate({ appointmentId: appointment.id, status })
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  }

  if (isLoading) return <span className="text-muted-foreground">Loading...</span>

  return (
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
  )
}