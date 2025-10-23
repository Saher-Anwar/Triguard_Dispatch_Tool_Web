export type AppointmentStatus = 
  | 'unassigned' 
  | 'scheduled' 
  | 'in-progress' 
  | 'complete' 
  | 'cancelled' 
  | 'rescheduled';

export interface Appointment {
  id: string;
  customerName: string;
  customerAddress: string;
  datetime: string;
  status: AppointmentStatus;
  assignedUser: User | null;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  permissions: Permission[];
  role: Role | null;
}

export interface StatData {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface TrackingData {
  appointmentId: string;
  eta: string;
  distance: string;
  technician: string;
}

export interface Permission {
  code: string;
  description: string;
}

export interface Role {
  name: string,
  permissions: Permission[];
}