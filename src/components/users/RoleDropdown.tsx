import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRoles } from "@/api/roles"
import { updateUserRole } from "@/api/user"
import type { User, Role } from "@/types"

export function RoleDropdown({ user }: { user: User}) {
  const queryClient = useQueryClient()

  // --- Fetch all roles ---
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000 // 5 mins
  })

  // --- Handle role update (optimistic UI) ---
  const { mutate } = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      return updateUserRole(userId, roleId)
    },

    // Optimistic update
    onMutate: async ({ userId, roleId }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      if (previousUsers) {
        // Find the role by ID to get the full role object
        const selectedRole = roles.find((r: Role) => r.id === roleId)
        
        queryClient.setQueryData<User[]>(['users'], (old) =>
          old?.map((u) =>
            u.id === userId
              ? { 
                  ...u, 
                  role: selectedRole || undefined
                }
              : u
          )
        )
      }

      return { previousUsers }
    },

    // Roll back on error
    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },

    // Always refetch to sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // --- Handle dropdown selection ---
  const handleRoleSelect = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation()
    mutate({ userId: user.id, roleId: role.id })
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
          <span>{user.role?.name || "No role assigned"}</span>
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            mutate({ userId: user.id, roleId: "" })
          }}
        >
          No role assigned
        </DropdownMenuItem>
        {roles.map((role: Role) => (
          <DropdownMenuItem
            key={role.name}
            onClick={(e) => handleRoleSelect(role, e)}
          >
            {role.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
