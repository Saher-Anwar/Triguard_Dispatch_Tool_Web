import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppointmentsPage } from '@/pages/AppointmentsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { UsersPage } from '@/pages/UsersPage'
import { TrackingModal } from '@/components/appointments/TrackingModal'

export function MainLayout() {
  const [activePage, setActivePage] = useState('appointments')

  const renderPage = () => {
    switch (activePage) {
      case 'appointments':
        return <AppointmentsPage />
      case 'reports':
        return <ReportsPage />
      case 'users':
        return <UsersPage />
      default:
        return <AppointmentsPage />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar activePage={activePage} onPageChange={setActivePage} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Header with sidebar trigger */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
              <div className="flex h-14 items-center px-6 lg:px-10">
                <SidebarTrigger className="mr-2" />
              </div>
            </div>
            
            {/* Page content */}
            <div className="p-6 lg:p-10">
              {renderPage()}
            </div>
          </div>
        </main>
        
        <TrackingModal />
      </div>
    </SidebarProvider>
  )
}