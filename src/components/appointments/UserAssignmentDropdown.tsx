import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getUsersByAppointmentDistance, assignUserToAppointment } from '@/api/appointment'
import type { Appointment, User } from '@/types'
import { toast } from 'sonner'

interface UserWithDistance extends User {
  distance_miles: number
}

interface UserAssignmentDropdownProps {
  appointment: Appointment
}

export function UserAssignmentDropdown({ appointment }: UserAssignmentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch users by distance when dropdown opens
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['appointmentUsers', appointment.id],
    queryFn: () => getUsersByAppointmentDistance(appointment.id),
    enabled: isOpen, // Only fetch when dropdown is open
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mutation for assigning user
  const { mutate: assignUser } = useMutation({
    mutationFn: ({ userId }: { userId: number }) => 
      assignUserToAppointment(appointment.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('User assigned successfully')
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to assign user')
    },
  })

  const handleUserSelect = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    assignUser({ userId })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-2 justify-start gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-left">
            {appointment.user?.name || 'Unassigned'}
          </span>
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {isLoading ? (
          <DropdownMenuItem disabled>
            Loading users...
          </DropdownMenuItem>
        ) : users.length === 0 ? (
          <DropdownMenuItem disabled>
            No users available
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={(e) => handleUserSelect(0, e)}
              className="text-muted-foreground"
            >
              Unassign user
            </DropdownMenuItem>
            {(users as UserWithDistance[]).map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={(e) => handleUserSelect(parseInt(user.id), e)}
                className="flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.status || 'Available'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {user.distance_miles} mi
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}