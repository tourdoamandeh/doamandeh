import { z } from 'zod';

export const publicBookingSchema = z.object({
  serviceId: z.string().uuid('ID layanan tidak valid'),
  customerName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  customerEmail: z
    .string()
    .trim()
    .email('Format email tidak valid (contoh: nama@email.com)'),
  customerPhone: z
    .string()
    .trim()
    .min(8, 'Nomor WhatsApp / telepon minimal 8 digit')
    .max(20, 'Nomor WhatsApp / telepon maksimal 20 digit')
    .regex(/^[0-9+\s\-()]+$/, 'Nomor telepon hanya boleh berisi angka dan karakter +, -, ()'),
  bookingDate: z
    .string()
    .min(1, 'Tanggal pemakaian / reservasi wajib dipilih'),
  notes: z
    .string()
    .trim()
    .max(500, 'Catatan tambahan maksimal 500 karakter')
    .optional()
    .nullable(),
});

export type PublicBookingInput = z.infer<typeof publicBookingSchema>;
