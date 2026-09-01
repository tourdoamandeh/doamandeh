'use server';

import { createClient } from '@/lib/supabase/server';
import { bookingSchema, bookingStatusEnum, BookingInput } from '@/lib/validations/admin';
import { Booking, BookingStatus } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { ActionResult } from './auth';

export async function updateBookingStatusAction(
  id: string,
  status: BookingStatus
): Promise<ActionResult<{ id: string; status: BookingStatus }>> {
  const parsedStatus = bookingStatusEnum.safeParse(status);
  if (!parsedStatus.success) {
    return { success: false, error: 'Status booking tidak valid.' };
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: parsedStatus.data })
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Gagal memperbarui status booking: ' + error.message };
    }

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');

    return {
      success: true,
      data: { id, status: parsedStatus.data },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat memperbarui status booking.',
    };
  }
}

export async function createBookingAction(input: BookingInput): Promise<ActionResult<Booking>> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input booking tidak valid',
    };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        service_id: parsed.data.service_id,
        customer_name: parsed.data.customer_name,
        customer_email: parsed.data.customer_email,
        customer_phone: parsed.data.customer_phone,
        booking_date: parsed.data.booking_date,
        notes: parsed.data.notes || null,
        status: parsed.data.status || 'pending',
        total_price: parsed.data.total_price || null,
      })
      .select('*, service:services(*)')
      .single();

    if (error) {
      return { success: false, error: 'Gagal membuat booking: ' + error.message };
    }

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');

    return {
      success: true,
      data: data as Booking,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat membuat booking.',
    };
  }
}

export async function deleteBookingAction(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Gagal menghapus booking: ' + error.message };
    }

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');

    return {
      success: true,
      data: { id },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat menghapus booking.',
    };
  }
}
