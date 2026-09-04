import { z } from 'zod';

export const publicBookingSchema = z
  .object({
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
      .regex(
        /^[0-9+\s\-()]+$/,
        'Nomor telepon hanya boleh berisi angka dan karakter +, -, ()'
      ),
    startDate: z
      .string()
      .min(1, 'Tanggal mulai / pemakaian wajib dipilih')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
      .optional()
      .or(z.literal('')),
    // For backward compatibility if bookingDate is sent directly
    bookingDate: z.string().optional(),
    durationDays: z.number().int().min(1).default(1).optional(),
    notes: z
      .string()
      .trim()
      .max(500, 'Catatan tambahan maksimal 500 karakter')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
      path: ['endDate'],
    }
  );

export type PublicBookingInput = z.infer<typeof publicBookingSchema>;
