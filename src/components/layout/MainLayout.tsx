import { useState } from 'react'
import { Calendar, BarChart3, Users, Settings, FlaskConical } from 'lucide-react'

const IS_MOCK = import.meta.env.VITE_MOCK === 'true'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppointmentsPage } from '@/pages/AppointmentsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { UsersPage } from '@/pages/UsersPage'
import { ConfigurationsPage } from '@/pages/ConfigurationsPage'
import { TimesheetPage } from '@/pages/TimesheetPage'
import { TrackingModal } from '@/components/appointments/TrackingModal'
import { usePermissions } from '@/hooks/usePermissions'

export function MainLayout() {
  const [activePage, setActivePage] = useState('appointments')
  const { hasAnyPermission, hasPermission } = usePermissions()

  const getPageTitle = () => {
    switch (activePage) {
      case 'appointments': return 'Appointments'
      case 'reports': return 'Reports'
      case 'users': return 'Users'
      case 'configurations': return 'Settings'
      default: return 'Appointments'
    }
  }

  const renderPage = () => {
    switch (activePage) {
      case 'appointments':
        return <AppointmentsPage />
      case 'reports':
        return <ReportsPage />
      case 'users':
        return <UsersPage />
      case 'timesheets':
        return <TimesheetPage />
      case 'configurations':
        return <ConfigurationsPage />
      default:
        return <AppointmentsPage />
    }
  }

  const navigationItems = [
    {
      id: 'appointments',
      title: 'Appointments',
      icon: Calendar,
      show: hasAnyPermission(['APPOINTMENTS.VIEW.ALL', 'APPOINTMENTS.VIEW.SELF']),
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: BarChart3,
      show: true,
    },
    {
      id: 'users',
      title: 'Users',
      icon: Users,
      show: hasPermission('USERS.VIEW'),
    },
    {
      id: 'configurations',
      title: 'Settings',
      icon: Settings,
      show: hasAnyPermission(['ROLES.CREATE', 'ROLES.UPDATE', 'ROLES.DELETE', 'DISPOSITIONS.CREATE', 'DISPOSITIONS.DELETE']),
    },
  ].filter(item => item.show)

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Mock mode banner */}
        {IS_MOCK && (
          <div
            className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-amber-500 text-amber-950 text-xs font-semibold py-1"
            role="status"
            aria-label="Mock mode active"
          >
            <FlaskConical className="h-3 w-3" aria-hidden="true" />
            MOCK MODE — No real backend connected. Data resets on page refresh.
          </div>
        )}
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className={`hidden md:block ${IS_MOCK ? 'mt-6' : ''}`}>
          <AppSidebar activePage={activePage} onPageChange={setActivePage} />
        </div>

        <main className={`flex-1 overflow-hidden flex flex-col ${IS_MOCK ? 'mt-6' : ''}`}>
          <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {/* Header with sidebar trigger */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
              <div className="flex h-14 items-center px-4 md:px-6 lg:px-10">
                <div className="hidden md:block">
                  <SidebarTrigger className="mr-2" />
                </div>
                {/* Mobile page title */}
                <h1 className="md:hidden text-lg font-semibold">{getPageTitle()}</h1>
              </div>
            </div>

            {/* Page content */}
            <div className="p-4 md:p-6 lg:p-10">
              {renderPage()}
            </div>
          </div>

          {/* Mobile Bottom Navigation - Hidden on desktop */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
            <nav className="flex justify-around items-center h-16">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                    activePage === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </main>

        <TrackingModal />
      </div>
    </SidebarProvider>
  )
}