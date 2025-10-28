import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Appointment } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppointmentStatusDropdown } from "./AppointmentStatusDropdown"

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'unassigned':
      return 'secondary'
    case 'scheduled':
      return 'default'
    case 'in progress':
      return 'destructive'
    case 'complete':
      return 'default'
    case 'cancelled':
      return 'outline'
    case 'rescheduled':
      return 'secondary'
    default:
      return 'default'
  }
}

export const appointmentColumns = (showStatusDropdown: boolean = false): ColumnDef<Appointment>[] => [
  {
    accessorKey: "customerName",
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
          Customer Name
          {getSortIcon()}
        </Button>
      )
    },
  },
  {
    accessorKey: "customerAddress",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("customerAddress") as string
      return (
        <div className="max-w-[200px] truncate" title={address}>
          {address}
        </div>
      )
    },
  },
  {
    accessorKey: "booking_datetime",
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
          Date & Time
          {getSortIcon()}
        </Button>
      )
    },
    cell: ({ row }) => {
      const appointment = row.original
      const datetime = appointment.booking_datetime || appointment.datetime
      return datetime ? new Date(datetime).toLocaleString() : "N/A"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original
      const status = row.getValue("status") as string
      
      if (showStatusDropdown) {
        return <AppointmentStatusDropdown appointment={appointment} />
      }
      
      return (
        <Badge variant={getStatusVariant(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      const rowStatus = (row.getValue("status") as string).toLowerCase()
      const filterValue = value.toLowerCase()
      return rowStatus === filterValue
    },
  },
  {
    accessorKey: "user",
    header: "Assigned User",
    cell: ({ row }) => {
      const appointment = row.original
      const assignedUser = appointment.user || appointment.assignedUser
      
      if (!assignedUser) {
        return "Unassigned"
      }
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{assignedUser.name}</div>
          <div className="text-xs text-muted-foreground">
            {assignedUser.status || "on-site"}
          </div>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      const appointment = row.original
      const assignedUser = appointment.user || appointment.assignedUser
      const userName = assignedUser?.name || "Unassigned"
      return userName.includes(value)
    },
  },
]