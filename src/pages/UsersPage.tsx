import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserCard } from '@/components/users/UserCard'
import { getUsers } from '@/api/user'
import { useQuery } from '@tanstack/react-query'

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
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Roles
          </Button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}