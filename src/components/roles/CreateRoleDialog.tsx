import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { getPermissions } from "@/api/permission"
import { createRole } from "@/api/roles"
import type { Permission, Role } from "@/types"

interface PermissionsBySection {
  APPOINTMENTS: Permission[]
  USERS: Permission[]
  ROLES: Permission[]
  DISPOSITIONS: Permission[]
}

export function CreateRoleDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [roleName, setRoleName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data: allPermissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  })

  const createRoleMutation = useMutation({
    mutationFn: ({ name, permissions }: { name: string; permissions: string[] }) =>
      createRole(name, permissions),
    onMutate: async ({ name, permissions }) => {
      await queryClient.cancelQueries({ queryKey: ['roles'] })
      const previousRoles = queryClient.getQueryData<Role[]>(['roles'])
      
      // Optimistically add the new role
      const newRole: Role = {
        id: `temp-${Date.now()}`,
        name,
        permissions: allPermissions.filter((p: Permission) => permissions.includes(p.code)),
      }
      
      queryClient.setQueryData<Role[]>(['roles'], (old) =>
        old ? [...old, newRole] : [newRole]
      )
      
      return { previousRoles }
    },
    onSuccess: () => {
      toast.success("Role created successfully")
      setIsOpen(false)
      resetForm()
    },
    onError: (error, _variables, context) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(['roles'], context.previousRoles)
      }
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
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

  const resetForm = () => {
    setRoleName("")
    setSelectedPermissions([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!roleName.trim()) {
      toast.error("Role name is required")
      return
    }

    const payload = {
      name: roleName.trim(),
      permissions: selectedPermissions,
    }

    console.log('Role creation payload:', JSON.stringify(payload, null, 2))

    createRoleMutation.mutate(payload)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Enter a role name and select the permissions you want to assign to this role.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Role Name Input */}
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                type="text"
                placeholder="Enter role name..."
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
              />
            </div>

            {/* Permissions Section */}
            {isLoading ? (
              <div className="py-8 text-center">
                <span className="text-muted-foreground">Loading permissions...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Permissions</h3>
                  <div className="space-y-4">
                    {renderSection("Appointments", permissionsBySection.APPOINTMENTS)}
                    {renderSection("Users", permissionsBySection.USERS)}
                    {renderSection("Roles", permissionsBySection.ROLES)}
                    {renderSection("Dispositions", permissionsBySection.DISPOSITIONS)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isLoading || createRoleMutation.isPending}
            >
              {createRoleMutation.isPending ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}