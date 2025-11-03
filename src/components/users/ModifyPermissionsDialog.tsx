import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { getPermissions } from "@/api/permission"
import { updateUserPermissions } from "@/api/user"
import type { User, Permission } from "@/types"

interface ModifyPermissionsDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PermissionsBySection {
  APPOINTMENTS: Permission[]
  USERS: Permission[]
  ROLES: Permission[]
  DISPOSITIONS: Permission[]
}

export function ModifyPermissionsDialog({ user, open, onOpenChange }: ModifyPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data: allPermissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  })

  // Initialize selected permissions when user changes
  useEffect(() => {
    if (user) {
      setSelectedPermissions(user.permissions?.map(p => p.code) || [])
    }
  }, [user])

  // Mutation for updating user permissions
  const updatePermissionsMutation = useMutation({
    mutationFn: async (permissionCodes: string[]) => {
      if (!user) throw new Error('No user selected')
      return updateUserPermissions(user.id, permissionCodes)
    },
    onSuccess: () => {
      // Invalidate users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['users'] })

      toast.success("Permissions updated", {
        description: `Successfully updated permissions for ${user?.name}`,
      })

      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error("Failed to update permissions", {
        description: error.message,
      })
    },
  })

  // Group permissions by section
  const permissionsBySection: PermissionsBySection = allPermissions.reduce(
    (acc: PermissionsBySection, permission: Permission) => {
      const section = permission.code.split('.')[0] as keyof PermissionsBySection
      if (acc[section]) {
        acc[section].push(permission)
      }
      return acc
    },
    { APPOINTMENTS: [], USERS: [], ROLES: [], DISPOSITIONS: [] }
  )

  const handlePermissionToggle = (permissionCode: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionCode])
    } else {
      setSelectedPermissions(prev => prev.filter(code => code !== permissionCode))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updatePermissionsMutation.mutate(selectedPermissions)
  }

  if (!user) return null

  const renderSection = (title: string, permissions: Permission[]) => (
    <div key={title} className="space-y-3">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="space-y-2">
        {permissions.map((permission) => (
          <div key={permission.code} className="flex items-center space-x-2">
            <Checkbox
              id={permission.code}
              checked={selectedPermissions.includes(permission.code)}
              onCheckedChange={(checked) => 
                handlePermissionToggle(permission.code, checked as boolean)
              }
            />
            <label
              htmlFor={permission.code}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {permission.description}
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Modify Permissions - {user.name}</DialogTitle>
            <DialogDescription>
              Select the permissions you want to assign to this user.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-8 text-center">
              <span className="text-muted-foreground">Loading permissions...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {renderSection("Appointments", permissionsBySection.APPOINTMENTS)}
              {renderSection("Users", permissionsBySection.USERS)}
              {renderSection("Roles", permissionsBySection.ROLES)}
              {renderSection("Dispositions", permissionsBySection.DISPOSITIONS)}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || updatePermissionsMutation.isPending}
            >
              {updatePermissionsMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
