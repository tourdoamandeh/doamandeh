import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

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

export const siteSettingsSchema = z.object({
  hero_title: z.string().min(3, 'Judul hero minimal 3 karakter').default('Nikmati Liburan Terbaik Bersama Doamandeh'),
  hero_subtitle: z.string().min(5, 'Subjudul hero minimal 5 karakter').default('Solusi lengkap kebutuhan aktivitas liburan Anda di Bali: Sewa Motor & Mobil, Tato Artistik, Villa Nyaman, Paket Wisata Tour, hingga Kelas Surfing.'),
  about_text: z.string().min(10, 'Teks tentang kami minimal 10 karakter').default('Doamandeh Tours & Travel adalah agen wisata dan lifestyle terpercaya di Bali, menyediakan berbagai layanan pilihan mulai dari rental kendaraan, studio tato higienis, penginapan villa, paket tour eksklusif, hingga sekolah selancar untuk segala level.'),
  contact_phone: z.string().default('+62 812-3456-7890'),
  contact_whatsapp: z.string().default('+62 812-3456-7890'),
  contact_email: z.string().email('Format email kontak tidak valid').or(z.literal('')).default('info@doamandeh.com'),
  contact_address: z.string().default('Jl. Raya Canggu No. 88, Badung, Bali - Indonesia'),
  sosmed_instagram: z.string().default('https://instagram.com/doamandeh'),
  sosmed_facebook: z.string().default('https://facebook.com/doamandeh'),
  sosmed_tiktok: z.string().default('https://tiktok.com/@doamandeh'),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const DEFAULT_SITE_SETTINGS: SiteSettingsInput = {
  hero_title: 'Nikmati Liburan Terbaik Bersama Doamandeh',
  hero_subtitle:
    'Solusi lengkap kebutuhan aktivitas liburan Anda di Bali: Sewa Motor & Mobil, Tato Artistik, Villa Nyaman, Paket Wisata Tour, hingga Kelas Surfing.',
  about_text:
    'Doamandeh Tours & Travel adalah agen wisata dan lifestyle terpercaya di Bali, menyediakan berbagai layanan pilihan mulai dari rental kendaraan, studio tato higienis, penginapan villa, paket tour eksklusif, hingga sekolah selancar untuk segala level.',
  contact_phone: '+62 812-3456-7890',
  contact_whatsapp: '+62 812-3456-7890',
  contact_email: 'info@doamandeh.com',
  contact_address: 'Jl. Raya Canggu No. 88, Badung, Bali - Indonesia',
  sosmed_instagram: 'https://instagram.com/doamandeh',
  sosmed_facebook: 'https://facebook.com/doamandeh',
  sosmed_tiktok: 'https://tiktok.com/@doamandeh',
};


