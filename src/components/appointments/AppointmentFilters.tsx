import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useUserStore } from '@/store/useUserStore'

export function AppointmentFilters() {
  const { 
    searchTerm, 
    statusFilter, 
    userFilter, 
    setSearchTerm, 
    setStatusFilter, 
    setUserFilter 
  } = useAppointmentStore()
  const { users } = useUserStore()

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card border-input"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-48 bg-card border-input">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="rescheduled">Rescheduled</SelectItem>
        </SelectContent>
      </Select>

      {/* User Filter */}
      <Select value={userFilter} onValueChange={setUserFilter}>
        <SelectTrigger className="w-full sm:w-48 bg-card border-input">
          <SelectValue placeholder="All Users" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.name}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}