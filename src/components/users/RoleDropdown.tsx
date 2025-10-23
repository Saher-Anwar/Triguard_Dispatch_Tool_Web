import { useQuery } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRoles } from "@/api/roles"
import type { User, Role } from "@/types"

interface RoleDropdownProps {
  user: User
  onRoleChange?: (userId: string, roleId: string) => void
}

export function RoleDropdown({ user, onRoleChange }: RoleDropdownProps) {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  const handleRoleSelect = (role: Role) => {
    if (onRoleChange) onRoleChange(user.id, role.name)
  }

  if (isLoading) {
    return <span className="text-muted-foreground">Loading...</span>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 justify-start gap-1">
          <span>{user.role?.name || "No role assigned"}</span>
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleRoleSelect({ name: "", permissions: [] } as Role)}>
          No role assigned
        </DropdownMenuItem>
        {roles.map((role: Role) => (
          <DropdownMenuItem
            key={role.name}
            onClick={() => handleRoleSelect(role)}
          >
            {role.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
