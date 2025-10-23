import { useQuery } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import type { User, Role } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRoles, updateRole } from "@/api/roles"

interface RoleDropdownProps {
  user: User
}

function RoleDropdown({ user }: RoleDropdownProps) {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  const handleRoleSelect = (role: Role) => {
    updateRole(user.id, role.name)
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return status || "Active"
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <RoleDropdown user={row.original} />
    },
  },
]