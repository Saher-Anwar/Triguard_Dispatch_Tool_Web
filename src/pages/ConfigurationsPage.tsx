import { useState } from 'react'
import { Edit, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoles, deleteRole } from '@/api/roles'
import { getDispositions, deleteDisposition } from '@/api/disposition'
import { CreateRoleDialog } from '@/components/roles/CreateRoleDialog'
import { CreateDispositionDialog } from '@/components/dispositions/CreateDispositionDialog'
import type { Role, Disposition } from '@/types'

export function ConfigurationsPage() {
  const queryClient = useQueryClient()
  const [rolesOpen, setRolesOpen] = useState(true)
  const [dispositionsOpen, setDispositionsOpen] = useState(true)

  const { data: roles = [], isLoading: rolesLoading, isError: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000 // 5 mins
  })

  const { data: dispositions = [], isLoading: dispositionsLoading, isError: dispositionsError } = useQuery({
    queryKey: ['dispositions'],
    queryFn: getDispositions,
    staleTime: 5 * 60 * 1000 // 5 mins
  })

  // Role delete mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onMutate: async (roleId) => {
      await queryClient.cancelQueries({ queryKey: ['roles'] })
      const previousRoles = queryClient.getQueryData<Role[]>(['roles'])
      
      queryClient.setQueryData<Role[]>(['roles'], (old) =>
        old?.filter((role) => role.id !== roleId)
      )
      
      return { previousRoles }
    },
    onError: (_err, _roleId, context) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(['roles'], context.previousRoles)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // Disposition delete mutation
  const deleteDispositionMutation = useMutation({
    mutationFn: deleteDisposition,
    onMutate: async (dispositionCode) => {
      await queryClient.cancelQueries({ queryKey: ['dispositions'] })
      const previousDispositions = queryClient.getQueryData<Disposition[]>(['dispositions'])
      
      queryClient.setQueryData<Disposition[]>(['dispositions'], (old) =>
        old?.filter((disposition) => disposition.code !== dispositionCode)
      )
      
      return { previousDispositions }
    },
    onError: (_err, _dispositionCode, context) => {
      if (context?.previousDispositions) {
        queryClient.setQueryData(['dispositions'], context.previousDispositions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositions'] })
    },
  })


  const handleEditRole = (role: Role) => {
    console.log('Edit role clicked:', role)
  }

  const handleDeleteRole = (role: Role) => {
    deleteRoleMutation.mutate(role.id)
  }


  const handleEditDisposition = (disposition: Disposition) => {
    console.log('Edit disposition clicked:', disposition)
  }

  const handleDeleteDisposition = (disposition: Disposition) => {
    deleteDispositionMutation.mutate(disposition.code)
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
      <Collapsible open={rolesOpen} onOpenChange={setRolesOpen}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">Roles</CardTitle>
                    <ChevronDown className={`h-5 w-5 transition-transform ${rolesOpen ? 'rotate-180' : ''}`} />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CreateRoleDialog />
            </div>
          </CardHeader>
          <CollapsibleContent>
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
                    <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <Badge key={`${role.id}-${permission.code}`} variant="secondary" className="text-xs">
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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Dispositions Section */}
      <Collapsible open={dispositionsOpen} onOpenChange={setDispositionsOpen}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">Dispositions</CardTitle>
                    <ChevronDown className={`h-5 w-5 transition-transform ${dispositionsOpen ? 'rotate-180' : ''}`} />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CreateDispositionDialog />
            </div>
          </CardHeader>
          <CollapsibleContent>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}