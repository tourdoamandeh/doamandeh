'use server';

import { createClient } from '@/lib/supabase/server';
import { publicBookingSchema, PublicBookingInput } from '@/lib/validations/booking';
import { revalidatePath } from 'next/cache';

export interface BookingResponseData {
  id: string;
  serviceId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  totalPrice: number | null;
  notes?: string | null;
  status: string;
  createdAt: string;
}

export interface PublicBookingResult {
  success: boolean;
  data?: BookingResponseData;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createPublicBookingAction(
  input: PublicBookingInput
): Promise<PublicBookingResult> {
  // 1. Zod Validation
  const parsed = publicBookingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString();
      if (field) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input form booking tidak valid.',
      fieldErrors,
    };
  }

  const { serviceId, customerName, customerEmail, customerPhone, bookingDate, notes } =
    parsed.data;

  try {
    const supabase = await createClient();

    // 2. Fetch service details for total_price and title confirmation
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, title, price, is_active')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return {
        success: false,
        error: 'Layanan yang dipilih tidak ditemukan atau sedang tidak tersedia.',
      };
    }

    if (!service.is_active) {
      return {
        success: false,
        error: 'Layanan ini sedang tidak aktif / tidak menerima pemesanan saat ini.',
      };
    }

    // 3. Insert booking into database
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        service_id: serviceId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: bookingDate,
        notes: notes || null,
        status: 'pending',
        total_price: service.price,
      })
      .select('*')
      .single();

    if (insertError || !booking) {
      return {
        success: false,
        error:
          'Gagal memproses pemesanan: ' +
          (insertError?.message || 'Terjadi gangguan pada database.'),
      };
    }

    // 4. Revalidate pages
    revalidatePath(`/services/${serviceId}`);
    revalidatePath('/admin/bookings');
    revalidatePath('/admin');

    return {
      success: true,
      data: {
        id: booking.id,
        serviceId: service.id,
        serviceTitle: service.title,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        bookingDate: booking.booking_date,
        totalPrice: booking.total_price,
        notes: booking.notes,
        status: booking.status,
        createdAt: booking.created_at,
      },
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat membuat booking.',
    };
  }
}
