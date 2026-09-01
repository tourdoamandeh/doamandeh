'use server';

import { createClient } from '@/lib/supabase/server';
import { serviceSchema, ServiceInput } from '@/lib/validations/admin';
import { Service } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { ActionResult } from './auth';

export async function createServiceAction(input: ServiceInput): Promise<ActionResult<Service>> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input layanan tidak valid',
    };
  }

  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const { data, error } = await supabase
      .from('services')
      .insert({
        category: parsed.data.category,
        title: parsed.data.title,
        description: parsed.data.description || null,
        price: parsed.data.price,
        unit: parsed.data.unit,
        duration: parsed.data.duration || null,
        image_url: parsed.data.image_url || null,
        is_active: parsed.data.is_active ?? true,
      })
      .select('*')
      .single();

    if (error) {
      return { success: false, error: 'Gagal menambahkan layanan: ' + error.message };
    }

    revalidatePath('/admin/services');
    revalidatePath('/admin');
    revalidatePath('/');

    return {
      success: true,
      data: data as Service,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat membuat layanan.',
    };
  }
}

export async function updateServiceAction(id: string, input: ServiceInput): Promise<ActionResult<Service>> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input layanan tidak valid',
    };
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const { data, error } = await supabase
      .from('services')
      .update({
        category: parsed.data.category,
        title: parsed.data.title,
        description: parsed.data.description || null,
        price: parsed.data.price,
        unit: parsed.data.unit,
        duration: parsed.data.duration || null,
        image_url: parsed.data.image_url || null,
        is_active: parsed.data.is_active,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return { success: false, error: 'Gagal memperbarui layanan: ' + error.message };
    }

    revalidatePath('/admin/services');
    revalidatePath('/admin');
    revalidatePath('/');

    return {
      success: true,
      data: data as Service,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat memperbarui layanan.',
    };
  }
}

export async function toggleServiceActiveAction(id: string, currentStatus: boolean): Promise<ActionResult<{ is_active: boolean }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const newStatus = !currentStatus;
    const { error } = await supabase
      .from('services')
      .update({ is_active: newStatus })
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Gagal mengubah status layanan: ' + error.message };
    }

    revalidatePath('/admin/services');
    revalidatePath('/admin');
    revalidatePath('/');

    return {
      success: true,
      data: { is_active: newStatus },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem.',
    };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Gagal menghapus layanan: ' + error.message };
    }

    revalidatePath('/admin/services');
    revalidatePath('/admin');
    revalidatePath('/');

    return {
      success: true,
      data: { id },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat menghapus layanan.',
    };
  }
}
