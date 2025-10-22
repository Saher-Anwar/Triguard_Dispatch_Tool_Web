import type { Appointment } from '@/types'

export async function getAppointments(): Promise<Appointment[]> {
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
        permissions: ['View Appointments', 'Update Status', 'Access Maps'],
      },
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
        permissions: ['View Appointments', 'Update Status', 'Access Maps'],
      },
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
        permissions: ['View Appointments', 'Update Status', 'Access Maps'],
      },
    },
    {
      id: '4',
      customerName: 'Emily Wilson',
      customerAddress: '321 Elm Street, Brookline, MA',
      datetime: 'Oct 21, 2025 - 11:00 AM',
      status: 'unassigned',
      assignedUser: null,
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
        permissions: [
          'View All Appointments',
          'Assign Appointments',
          'Live Tracking',
          'View Reports',
        ],
      },
    },
  ]

  await new Promise((r) => setTimeout(r, 300)) // simulate network latency
  return mockAppointments
}
