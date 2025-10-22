import { create } from 'zustand'
import type { Appointment } from '@/types'

interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  isTrackingModalOpen: boolean
  searchTerm: string
  statusFilter: string
  userFilter: string
  setAppointments: (data: Appointment[]) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setUserFilter: (user: string) => void
  openTrackingModal: (appointment: Appointment) => void
  closeTrackingModal: () => void
  getFilteredAppointments: () => Appointment[]
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  selectedAppointment: null,
  isTrackingModalOpen: false,
  searchTerm: '',
  statusFilter: 'all',
  userFilter: 'all',

  setAppointments: (data) => set({ appointments: data }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setUserFilter: (user) => set({ userFilter: user }),
  openTrackingModal: (appointment) => set({ selectedAppointment: appointment, isTrackingModalOpen: true }),
  closeTrackingModal: () => set({ isTrackingModalOpen: false }),

  getFilteredAppointments: () => {
    const { appointments, searchTerm, statusFilter, userFilter } = get()
    return appointments.filter((a) => {
      const matchesSearch =
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.customerAddress.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter
      const matchesUser =
        userFilter === 'all' ||
        (a.assignedUser && a.assignedUser.name === userFilter)
      return matchesSearch && matchesStatus && matchesUser
    })
  },
}))
