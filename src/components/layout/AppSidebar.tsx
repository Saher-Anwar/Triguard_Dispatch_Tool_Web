import { Calendar, BarChart3, Users, Clock, Settings, Moon, Sun, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/useThemeStore'
import { useUserStore } from '@/store/useUserStore'
import { usePermissions } from '@/hooks/usePermissions'

interface AppSidebarProps {
  activePage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  {
    id: 'appointments',
    title: 'Appointments',
    icon: Calendar,
    requiredPermissions: ['APPOINTMENTS.VIEW.ALL', 'APPOINTMENTS.VIEW.SELF'],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: BarChart3,
    requiredPermissions: [], // No specific permission requirement yet
  },
  {
    id: 'users',
    title: 'Users',
    icon: Users,
    requiredPermissions: ['USERS.VIEW'],
  },
  {
    id: 'timesheets',
    title: 'Timesheets',
    icon: Clock,
    requiredPermissions: [], // No specific permission requirement yet
  },
  {
    id: 'configurations',
    title: 'Configurations',
    icon: Settings,
    requiredPermissions: ['ROLES.CREATE', 'ROLES.UPDATE', 'ROLES.DELETE', 'DISPOSITIONS.CREATE', 'DISPOSITIONS.DELETE'],
  },
]

export function AppSidebar({ activePage, onPageChange }: AppSidebarProps) {
  const { theme, setTheme } = useThemeStore()
  const { currentUser, clearUser } = useUserStore()
  const { hasAnyPermission, hasPermission } = usePermissions()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    // Clear user from store
    clearUser()

    // Redirect to Cognito logout (optional - clears Cognito session)
    const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(window.location.origin)}`
    window.location.href = logoutUrl
  }

  // Filter navigation items based on permissions
  const visibleNavigationItems = navigationItems.filter(item => {
    // If no permissions required, show the item
    if (item.requiredPermissions.length === 0) {
      return true
    }

    // If multiple permissions, user needs at least one (OR logic)
    if (item.requiredPermissions.length > 1) {
      return hasAnyPermission(item.requiredPermissions)
    }

    // Single permission check
    return hasPermission(item.requiredPermissions[0])
  })

  return (
    <Sidebar variant="sidebar" className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-center">
          <img 
            src={theme === 'dark' ? "/logo_dark_mode.svg" : "/logo.svg"}
            alt="Triguard Logo" 
            className="h-32 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarMenu>
            {visibleNavigationItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onPageChange(item.id)}
                  isActive={activePage === item.id}
                  className="w-full justify-start gap-3 h-11 font-medium transition-all data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-500/15 data-[active=true]:to-cyan-500/15 data-[active=true]:text-primary data-[active=true]:border-l-2 data-[active=true]:border-primary"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-3 h-9 text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>

        {/* User Section */}
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{currentUser?.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 h-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}