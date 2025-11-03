import { getUsers } from '@/api/user'
import { useQuery } from '@tanstack/react-query'
import { UserDataTable } from '@/components/users/UserDataTable'

export function UsersPage() {
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000 // 5 mins
  })

  if (isLoading) return <div className="text-center py-12"><p className="text-muted-foreground">Loading users...</p></div>
  if (isError) return <div className="text-center py-12"><p className="text-red-500">Failed to load users.</p></div>

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Bar - Desktop only (title shown in mobile header) */}
      <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">User Management</h1>
      </div>

      {/* Users Table */}
      <UserDataTable users={users} />
    </div>
  )
}