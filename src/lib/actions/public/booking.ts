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
  startDate: string;
  endDate?: string | null;
  durationDays: number;
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
  // Normalize input if bookingDate was supplied instead of startDate
  const normalizedInput = {
    ...input,
    startDate: input.startDate || input.bookingDate || '',
  };

  // 1. Zod Validation
  const parsed = publicBookingSchema.safeParse(normalizedInput);
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

  const {
    serviceId,
    customerName,
    customerEmail,
    customerPhone,
    startDate,
    endDate,
    notes,
  } = parsed.data;

  try {
    const supabase = await createClient();

    // 2. Fetch service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, title, category, price, unit, is_active')
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

    // 3. Calculate duration and total price
    const isNightUnit = service.category === 'villa' || /malam|night/i.test(service.unit || '');
    let durationDays = 1;
    if (endDate && endDate !== startDate) {
      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      const diff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
      durationDays = isNightUnit ? Math.max(1, diff) : Math.max(1, diff + 1);
    }

    const totalPrice = Number(service.price) * durationDays;

    // Compose notes with date range info if multi-day
    let formattedNotes = notes?.trim() || '';
    if (endDate && endDate !== startDate) {
      const unitLabel = isNightUnit ? 'malam' : 'hari';
      const periodLabel = `[Periode: ${startDate} s/d ${endDate} (${durationDays} ${unitLabel})]`;
      formattedNotes = formattedNotes
        ? `${periodLabel}\n${formattedNotes}`
        : periodLabel;
    }

    // 4. Insert booking into database
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        service_id: serviceId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: startDate,
        notes: formattedNotes || null,
        status: 'pending',
        total_price: totalPrice,
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

    // 5. Optional email confirmation via Edge Function (graceful attempt)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.ENABLE_EMAIL_NOTIFICATION === 'true') {
        await supabase.functions.invoke('send-booking-email', {
          body: {
            bookingId: booking.id,
            serviceTitle: service.title,
            customerName,
            customerEmail,
            customerPhone,
            startDate,
            endDate: endDate || startDate,
            durationDays,
            totalPrice,
          },
        });
      }
    } catch {
      // Email delivery failure is non-blocking to preserve UX
    }

    // 6. Revalidate relevant paths
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
        startDate,
        endDate: endDate || null,
        durationDays,
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
