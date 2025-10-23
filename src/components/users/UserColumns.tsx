import type { User } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { RoleDropdown } from "./RoleDropdown"

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