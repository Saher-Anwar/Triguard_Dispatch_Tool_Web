import { useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
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
          <div className="h-full overflow-y-auto p-6 lg:p-10">
            {renderPage()}
          </div>
        </main>
        
        <TrackingModal />
      </div>
    </SidebarProvider>
  )
}