import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRoles, updateRole } from "@/api/roles"
import type { User, Role } from "@/types"

export function RoleDropdown({ user }: { user: User}) {
  const queryClient = useQueryClient()

  // --- Fetch all roles ---
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  // --- Handle role update (optimistic UI) ---
  const { mutate } = useMutation({
    mutationFn: async ({ userId, roleName }: { userId: string; roleName: string }) => {
      // Simulate API call (you can await a real fetch here later)
      updateRole(userId, roleName)
      await new Promise((r) => setTimeout(r, 300)) // simulate latency
      return { userId, roleName }
    },

    // Optimistic update
    onMutate: async ({ userId, roleName }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      if (previousUsers) {
        queryClient.setQueryData<User[]>(['users'], (old) =>
          old?.map((u) =>
            u.id === userId
              ? { ...u, role: { name: roleName, permissions: [] } }
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
    mutate({ userId: user.id, roleName: role.name })
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
          onClick={(e) =>
            handleRoleSelect({ name: "", permissions: [] } as Role, e)
          }
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
