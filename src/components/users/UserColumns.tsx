import type { User } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { RoleDropdown } from "./RoleDropdown"
import { ModifyPermissionsDialog } from "./ModifyPermissionsDialog"

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
  {
    id: "permissions",
    cell: ({ row }) => {
      return <ModifyPermissionsDialog user={row.original} />
    }
  }
]