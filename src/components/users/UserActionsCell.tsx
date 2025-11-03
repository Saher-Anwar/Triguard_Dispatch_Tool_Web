import { useState } from "react"
import { MoreHorizontal, Trash, Settings } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePermissions } from "@/hooks/usePermissions"
import { deleteUser } from "@/api/user"
import { ModifyPermissionsDialog } from "./ModifyPermissionsDialog"
import type { User } from "@/types"

interface UserActionsCellProps {
  user: User
}

export function UserActionsCell({ user }: UserActionsCellProps) {
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  // Mutation for deleting user (must be called before any conditional returns)
  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      return deleteUser(user.id)
    },
    onSuccess: () => {
      // Invalidate users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['users'] })

      toast.success("User deleted", {
        description: `Successfully deleted ${user.name}`,
      })

      setDeleteDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error("Failed to delete user", {
        description: error.message,
      })
    },
  })

  // Check permissions
  const canModifyPermissions = hasPermission('USERS.UPDATE.PERMISSIONS')
  const canDeleteUser = hasPermission('USERS.DELETE')

  // If user has no permissions, don't show the dropdown
  if (!canModifyPermissions && !canDeleteUser) {
    return null
  }

  const handleDeleteConfirm = () => {
    deleteUserMutation.mutate()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {canModifyPermissions && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setPermissionsDialogOpen(true)
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Modify Permissions
            </DropdownMenuItem>
          )}
          {canDeleteUser && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setDeleteDialogOpen(true)
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canModifyPermissions && (
        <ModifyPermissionsDialog
          user={user}
          open={permissionsDialogOpen}
          onOpenChange={setPermissionsDialogOpen}
        />
      )}

      {canDeleteUser && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{user.name}</strong> ({user.email}).
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
