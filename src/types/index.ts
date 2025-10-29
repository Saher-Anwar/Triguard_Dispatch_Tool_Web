export type AppointmentStatus = 
  | 'unassigned' 
  | 'scheduled' 
  | 'in progress' 
  | 'complete' 
  | 'cancelled' 
  | 'rescheduled';

export interface Appointment {
  id: number;
  booking_datetime: string; // iso 8601 format
  status: AppointmentStatus;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  user: User | null;
  disposition?: Disposition;
  details?: AppointmentDetails;
}

export interface AppointmentDetails{
  [key: string]: string | number | boolean | null | undefined;
}

export interface UserProfile {
  age?: number;
  address?: string;
  phone?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permissions?: Permission[];
  role?: Role;
  status?: string;
  profile?: UserProfile;
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
  id: string,
  name: string,
  permissions: Permission[];
}

export interface Disposition {
  code: string;
  description: string;
  notes?: string
}

export interface TimesheetData {
  id: string;
  date: string;       // ISO date string: "2025-10-24"
  start_time: string; // ISO datetime or time: "14:30:00"
  end_time: string;   // ISO datetime or time: "17:45:00"
}

export interface Timesheet {
  id: string;
  user: User;
  entries: TimesheetData[];
}