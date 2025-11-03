import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { User } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { RoleDropdown } from "./RoleDropdown"
import { UserActionsCell } from "./UserActionsCell"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const getSortIcon = () => {
        if (column.getIsSorted() === "asc") {
          return <ArrowUp className="ml-2 h-4 w-4" />
        }
        if (column.getIsSorted() === "desc") {
          return <ArrowDown className="ml-2 h-4 w-4" />
        }
        return <ArrowUpDown className="ml-2 h-4 w-4" />
      }

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-muted"
        >
          Name
          {getSortIcon()}
        </Button>
      )
    },
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
    filterFn: (row, _id, value) => {
      const roleName = row.original.role?.name || ""
      return roleName.includes(value)
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <UserActionsCell user={row.original} />
    }
  }
]