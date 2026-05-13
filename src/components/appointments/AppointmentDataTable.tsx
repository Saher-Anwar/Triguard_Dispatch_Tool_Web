import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ChevronLeftIcon, ChevronRightIcon, Search, MapPin, Calendar as CalendarIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Appointment } from "@/types"
import { appointmentColumns } from "./AppointmentColumns"
import { getAppointmentStatuses } from "@/api/appointment"
import { AppointmentStatusDropdown } from "./AppointmentStatusDropdown"
import { UserAssignmentDropdown } from "./UserAssignmentDropdown"

interface AppointmentDataTableProps {
  appointments: Appointment[]
  onAppointmentClick?: (appointment: Appointment) => void
  showStatusDropdown?: boolean
  showUserDropdown?: boolean
}

export function AppointmentDataTable({ appointments, onAppointmentClick, showStatusDropdown = false, showUserDropdown = false }: AppointmentDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  // Get appointment statuses from type
  const statuses = getAppointmentStatuses()

  const table = useReactTable({
    data: appointments,
    columns: appointmentColumns(showStatusDropdown, showUserDropdown),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned': return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
      case 'scheduled': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
      case 'in progress': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      case 'complete': return 'bg-green-500/20 text-green-700 dark:text-green-300'
      case 'cancelled': return 'bg-red-500/20 text-red-700 dark:text-red-300'
      case 'rescheduled': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    }
  }

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 py-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name..."
            value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("customerName")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((status: string) => (
              <SelectItem key={status} value={status}>
                {(status).charAt(0).toUpperCase() + (status).slice(1).replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onAppointmentClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onAppointmentClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={appointmentColumns(showStatusDropdown, showUserDropdown).length}
                  className="h-24 text-center"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const appointment = row.original
            return (
              <Card
                key={row.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <div className="space-y-3">
                  {/* Customer Name & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base line-clamp-1">
                      {appointment.customer?.name || 'N/A'}
                    </h3>
                    {showStatusDropdown ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <AppointmentStatusDropdown appointment={appointment} />
                      </div>
                    ) : (
                      <Badge className={`${getStatusColor(appointment.status)} text-xs whitespace-nowrap`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{appointment.customer?.location?.address || 'No address'}</span>
                  </div>

                  {/* DateTime */}
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>{new Date(appointment.booking_datetime).toLocaleString()}</span>
                  </div>

                  {/* Assigned User */}
                  {showUserDropdown ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <UserAssignmentDropdown appointment={appointment} />
                    </div>
                  ) : appointment.user ? (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Assigned to: </span>
                      <span className="font-medium">{appointment.user.name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Unassigned</div>
                  )}
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No appointments found.</p>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 py-4">
        <div className="text-xs md:text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{" "}
          {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-9"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-9"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}