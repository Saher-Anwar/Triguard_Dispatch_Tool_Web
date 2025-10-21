import { create } from 'zustand'
import type { Appointment, AppointmentStatus } from '../types'

interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  searchTerm: string
  statusFilter: AppointmentStatus | 'all'
  userFilter: string
  isTrackingModalOpen: boolean
  
  setAppointments: (appointments: Appointment[]) => void
  setSelectedAppointment: (appointment: Appointment | null) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: AppointmentStatus | 'all') => void
  setUserFilter: (user: string) => void
  openTrackingModal: (appointment: Appointment) => void
  closeTrackingModal: () => void
  getFilteredAppointments: () => Appointment[]
}

// Mock data matching your temp.html
const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'John Smith',
    customerAddress: '123 Maple Street, Boston, MA',
    datetime: 'Oct 20, 2025 - 10:00 AM',
    status: 'in-progress',
    assignedUser: {
      id: '1',
      name: 'Mike Johnson',
      role: 'Field Technician',
      permissions: ['View Appointments', 'Update Status', 'Access Maps']
    }
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerAddress: '456 Oak Avenue, Cambridge, MA',
    datetime: 'Oct 20, 2025 - 2:00 PM',
    status: 'scheduled',
    assignedUser: {
      id: '2',
      name: 'David Brown',
      role: 'Field Technician',
      permissions: ['View Appointments', 'Update Status', 'Access Maps']
    }
  },
  {
    id: '3',
    customerName: 'Robert Davis',
    customerAddress: '789 Pine Road, Somerville, MA',
    datetime: 'Oct 19, 2025 - 9:00 AM',
    status: 'complete',
    assignedUser: {
      id: '1',
      name: 'Mike Johnson',
      role: 'Field Technician',
      permissions: ['View Appointments', 'Update Status', 'Access Maps']
    }
  },
  {
    id: '4',
    customerName: 'Emily Wilson',
    customerAddress: '321 Elm Street, Brookline, MA',
    datetime: 'Oct 21, 2025 - 11:00 AM',
    status: 'unassigned',
    assignedUser: null
  },
  {
    id: '5',
    customerName: 'Michael Chen',
    customerAddress: '654 Birch Lane, Newton, MA',
    datetime: 'Oct 21, 2025 - 3:00 PM',
    status: 'scheduled',
    assignedUser: {
      id: '3',
      name: 'Sarah Martinez',
      role: 'Dispatcher',
      permissions: ['View All Appointments', 'Assign Appointments', 'Live Tracking', 'View Reports']
    }
  }
]

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: mockAppointments,
  selectedAppointment: null,
  searchTerm: '',
  statusFilter: 'all',
  userFilter: 'all',
  isTrackingModalOpen: false,
  
  setAppointments: (appointments) => set({ appointments }),
  
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  setUserFilter: (user) => set({ userFilter: user }),
  
  openTrackingModal: (appointment) => set({ 
    selectedAppointment: appointment, 
    isTrackingModalOpen: true 
  }),
  
  closeTrackingModal: () => set({ 
    selectedAppointment: null, 
    isTrackingModalOpen: false 
  }),
  
  getFilteredAppointments: () => {
    const { appointments, searchTerm, statusFilter, userFilter } = get()
    
    return appointments.filter(appointment => {
      const matchesSearch = searchTerm === '' || 
        appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.customerAddress.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
      
      const matchesUser = userFilter === 'all' || 
        (appointment.assignedUser && appointment.assignedUser.name === userFilter)
      
      return matchesSearch && matchesStatus && matchesUser
    })
  }
}))