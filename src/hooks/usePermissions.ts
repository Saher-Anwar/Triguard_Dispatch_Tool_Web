import { useUserStore } from '@/store/useUserStore'

/**
 * Hook to check if the current user has specific permissions
 */
export function usePermissions() {
  const { currentUser } = useUserStore()

  /**
   * Check if user has a specific permission
   * @param permissionCode - The permission code to check (e.g., 'APPOINTMENTS.VIEW.ALL', 'USERS.CREATE')
   */
  const hasPermission = (permissionCode: string): boolean => {
    if (!currentUser || !currentUser.permissions) {
      return false
    }
    return currentUser.permissions.some(p => p.code === permissionCode)
  }

  /**
   * Check if user has ANY of the specified permissions
   * @param permissionCodes - Array of permission codes
   */
  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    return permissionCodes.some(code => hasPermission(code))
  }

  /**
   * Check if user has ALL of the specified permissions
   * @param permissionCodes - Array of permission codes
   */
  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    return permissionCodes.every(code => hasPermission(code))
  }

  /**
   * Check if user has a specific role
   * @param roleId - The role ID to check
   */
  const hasRole = (roleId: string): boolean => {
    if (!currentUser) {
      return false
    }
    return currentUser.role_id === roleId
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    permissions: currentUser?.permissions || [],
  }
}
