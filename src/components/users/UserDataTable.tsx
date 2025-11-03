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
import { ChevronLeftIcon, ChevronRightIcon, Search, Mail, Shield } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { UserCard } from "./UserCard"
import { RoleDropdown } from "./RoleDropdown"
import { UserActionsCell } from "./UserActionsCell"
import type { Role, User } from "@/types"
import { columns } from "./UserColumns"
import { getRoles } from "@/api/roles"
import { getUserStatuses } from "@/api/status"
import { useQuery } from "@tanstack/react-query"

interface UserDataTableProps {
  users: User[]
}

export function UserDataTable({ users }: UserDataTableProps) {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  // Get roles and statuses from API
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000 // 5 mins
  })

  const { data: statuses = [] } = useQuery({
    queryKey: ['statuses'],
    queryFn: getUserStatuses,
    staleTime: 5 * 60 * 1000 // 5 mins
  })

  const table = useReactTable({
    data: users,
    columns,
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

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 py-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
            table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((role: Role) => (
              <SelectItem key={role.name} value={role.name}>
                {role.name}
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
                  className="cursor-pointer"
                  onClick={() => setSelectedUser(row.original)}
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
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
            const user = row.original
            return (
              <Card
                key={row.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedUser(user)}
              >
                <div className="space-y-3">
                  {/* User Name & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base line-clamp-1">
                      {user.name}
                    </h3>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {user.status}
                    </Badge>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{user.email}</span>
                  </div>

                  {/* Role */}
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div onClick={(e) => e.stopPropagation()}>
                      <RoleDropdown user={user} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-2" onClick={(e) => e.stopPropagation()}>
                    <UserActionsCell user={user} />
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No users found.</p>
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

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserCard user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </>
  )
}