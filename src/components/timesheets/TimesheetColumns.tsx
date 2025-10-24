import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Timesheet } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

export const timesheetColumns: ColumnDef<Timesheet>[] = [
  {
    accessorKey: "user.name",
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
          User Name
          {getSortIcon()}
        </Button>
      )
    },
    cell: ({ row }) => {
      const timesheet = row.original
      return timesheet.user.name
    },
    filterFn: (row, _id, value) => {
      const userName = row.original.user.name
      return userName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "user.profile.department",
    header: "Department",
    cell: ({ row }) => {
      const timesheet = row.original
      return timesheet.user.profile?.department || "N/A"
    },
  },
  {
    id: "latestEntry",
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
          Latest Date
          {getSortIcon()}
        </Button>
      )
    },
    cell: ({ row }) => {
      const timesheet = row.original
      if (timesheet.entries.length === 0) return "No entries"
      
      const latestEntry = timesheet.entries.reduce((latest, entry) => {
        return new Date(entry.date) > new Date(latest.date) ? entry : latest
      })
      
      return new Date(latestEntry.date).toLocaleDateString()
    },
    accessorFn: (row) => {
      if (row.entries.length === 0) return null
      const latestEntry = row.entries.reduce((latest, entry) => {
        return new Date(entry.date) > new Date(latest.date) ? entry : latest
      })
      return latestEntry.date
    },
  },
  {
    id: "latestStartTime", 
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
          Latest Start Time
          {getSortIcon()}
        </Button>
      )
    },
    cell: ({ row }) => {
      const timesheet = row.original
      if (timesheet.entries.length === 0) return "No entries"
      
      const latestEntry = timesheet.entries.reduce((latest, entry) => {
        return new Date(entry.date) > new Date(latest.date) ? entry : latest
      })
      
      return latestEntry.start_time
    },
    accessorFn: (row) => {
      if (row.entries.length === 0) return null
      const latestEntry = row.entries.reduce((latest, entry) => {
        return new Date(entry.date) > new Date(latest.date) ? entry : latest
      })
      return latestEntry.start_time
    },
  },
  {
    id: "latestEndTime",
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
          Latest End Time
          {getSortIcon()}
        </Button>
      )
    },
    cell: ({ row }) => {
      const timesheet = row.original
      if (timesheet.entries.length === 0) return "No entries"
      
      const latestEntry = timesheet.entries.reduce((latest, entry) => {
        return new Date(entry.date) > new Date(latest.date) ? entry : latest
      })
      
      return latestEntry.end_time
    },
    accessorFn: (row) => {
      if (row.entries.length === 0) return null
      const latestEntry = row.entries.reduce((latest, entry) => {
        return new Date(entry.date) > new Date(latest.date) ? entry : latest
      })
      return latestEntry.end_time
    },
  },
  {
    id: "totalEntries",
    header: "Total Entries",
    cell: ({ row }) => {
      const timesheet = row.original
      return timesheet.entries.length
    },
  },
]