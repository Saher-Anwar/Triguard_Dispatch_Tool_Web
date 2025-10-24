import { Calendar, BarChart3, Users, Clock, Settings, Home, Moon, Sun } from 'lucide-react'
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

interface AppSidebarProps {
  activePage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  {
    id: 'appointments',
    title: 'Appointments',
    icon: Calendar,
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: BarChart3,
  },
  {
    id: 'users',
    title: 'Users',
    icon: Users,
  },
  {
    id: 'timesheets',
    title: 'Timesheets',
    icon: Clock,
  },
  {
    id: 'configurations',
    title: 'Configurations',
    icon: Settings,
  },
]

export function AppSidebar({ activePage, onPageChange }: AppSidebarProps) {
  const { theme, setTheme } = useThemeStore()
  const { currentUser } = useUserStore()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Sidebar variant="sidebar" className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            Triguard
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => (
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
              <div className="font-semibold text-sm">{currentUser.name}</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}