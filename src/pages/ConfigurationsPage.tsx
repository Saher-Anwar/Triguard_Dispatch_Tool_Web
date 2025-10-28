import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { getRoles } from '@/api/roles'
import { getDispositions } from '@/api/disposition'
import type { Role, Disposition } from '@/types'

export function ConfigurationsPage() {
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  const { data: dispositions = [], isLoading: dispositionsLoading, isError: dispositionsError } = useQuery({
    queryKey: ['dispositions'],
    queryFn: getDispositions,
  })

  const handleAddRole = () => {
    console.log('Add role clicked')
  }

  const handleEditRole = (role: Role) => {
    console.log('Edit role clicked:', role)
  }

  const handleDeleteRole = (role: Role) => {
    console.log('Delete role clicked:', role)
  }

  const handleAddDisposition = () => {
    console.log('Add disposition clicked')
  }

  const handleEditDisposition = (disposition: Disposition) => {
    console.log('Edit disposition clicked:', disposition)
  }

  const handleDeleteDisposition = (disposition: Disposition) => {
    console.log('Delete disposition clicked:', disposition)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold">Configurations</h1>
        <p className="text-muted-foreground mt-2">
          Manage roles and dispositions for your organization
        </p>
      </div>

      {/* Roles Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Roles</CardTitle>
            <Button onClick={handleAddRole} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rolesLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading roles...</p>
            </div>
          ) : rolesError ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load roles</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No roles found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {roles.map((role: Role) => (
                <div key={role.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{role.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={`${role.name}-${permission.code}`} variant="secondary" className="text-xs">
                          {permission.description}
                        </Badge>
                      ))}
                      {role.permissions.length === 0 && (
                        <span className="text-sm text-muted-foreground">No permissions assigned</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRole(role)}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispositions Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Dispositions</CardTitle>
            <Button onClick={handleAddDisposition} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Disposition
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dispositionsLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading dispositions...</p>
            </div>
          ) : dispositionsError ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load dispositions</p>
            </div>
          ) : dispositions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No dispositions found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {dispositions.map((disposition: Disposition) => (
                <div key={disposition.code} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold">{disposition.code}</h3>
                    <p className="text-sm text-muted-foreground">{disposition.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDisposition(disposition)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDisposition(disposition)}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}