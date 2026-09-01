import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerAdminSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;

export const serviceCategoryEnum = z.enum([
  'vehicle-rental',
  'tattoo',
  'villa',
  'travel',
  'surfing-lesson',
]);

export const serviceSchema = z.object({
  category: serviceCategoryEnum,
  title: z.string().min(3, 'Judul layanan minimal 3 karakter'),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  unit: z.string().min(1, 'Satuan harga wajib diisi (misal: per hari, per sesi)'),
  duration: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const bookingStatusEnum = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);

export const bookingSchema = z.object({
  service_id: z.string().uuid('ID layanan tidak valid'),
  customer_name: z.string().min(2, 'Nama customer minimal 2 karakter'),
  customer_email: z.string().email('Format email tidak valid'),
  customer_phone: z.string().min(6, 'Nomor telepon minimal 6 digit'),
  booking_date: z.string().min(1, 'Tanggal booking wajib diisi'),
  notes: z.string().nullable().optional(),
  status: bookingStatusEnum.default('pending'),
  total_price: z.coerce.number().min(0).nullable().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
