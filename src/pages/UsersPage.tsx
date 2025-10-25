import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUsers } from '@/api/user'
import { useQuery } from '@tanstack/react-query'
import { UserDataTable } from '@/components/users/UserDataTable'

export function UsersPage() {
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  if (isLoading) return <p>Loading users...</p>
  if (isError) return <p>Failed to load users.</p>

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">User Management</h1>
      </div>

      {/* Users Table */}
      <UserDataTable users={users} />
    </div>
  )
}