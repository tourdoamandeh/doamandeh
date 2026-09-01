export type ServiceCategory =
  | 'vehicle-rental'
  | 'tattoo'
  | 'villa'
  | 'travel'
  | 'surfing-lesson';

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string | null;
  price: number;
  unit: string | null;
  duration: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  notes: string | null;
  status: BookingStatus;
  total_price: number | null;
  created_at: string;
  service?: Service;
}
