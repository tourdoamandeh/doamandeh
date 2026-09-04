'use server';

import { createClient } from '@/lib/supabase/server';
import {
  siteSettingsSchema,
  SiteSettingsInput,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/validations/admin';
import { revalidatePath } from 'next/cache';
import { ActionResult } from './auth';

export async function getSiteSettingsAction(): Promise<ActionResult<SiteSettingsInput>> {
  try {
    const supabase = await createClient();

    // Query site_settings table
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) {
      // If table doesn't exist yet in Supabase, return default values gracefully
      return {
        success: true,
        data: DEFAULT_SITE_SETTINGS,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: DEFAULT_SITE_SETTINGS,
      };
    }

    // Determine format: key-value pairs or single object row
    const merged: Record<string, string> = { ...DEFAULT_SITE_SETTINGS };

    if (data[0] && 'key' in data[0] && 'value' in data[0]) {
      // Key-value pattern: [ { key: 'hero_title', value: '...' } ]
      data.forEach((row: { key: string; value: string | null }) => {
        if (row.key && row.value !== null && row.value !== undefined) {
          merged[row.key] = row.value;
        }
      });
    } else if (data[0]) {
      // Column-based single row pattern: { hero_title: '...', hero_subtitle: '...' }
      const firstRow = data[0] as Record<string, unknown>;
      Object.keys(DEFAULT_SITE_SETTINGS).forEach((key) => {
        if (typeof firstRow[key] === 'string') {
          merged[key] = firstRow[key] as string;
        }
      });
    }

    const parsed = siteSettingsSchema.safeParse(merged);
    return {
      success: true,
      data: parsed.success ? parsed.data : DEFAULT_SITE_SETTINGS,
    };
  } catch (err) {
    return {
      success: true,
      data: DEFAULT_SITE_SETTINGS,
    };
  }
}

export async function updateSiteSettingsAction(
  input: SiteSettingsInput
): Promise<ActionResult<SiteSettingsInput>> {
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input pengaturan tidak valid',
    };
  }

  try {
    const supabase = await createClient();

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Sesi telah berakhir. Silakan login kembali.',
      };
    }

    // Try saving in key-value structure first (recommended standard)
    // We send { key, value } so it works whether the table has `updated_at` or not
    const entries = Object.entries(parsed.data).map(([key, value]) => ({
      key,
      value: value ?? '',
    }));

    let { error: kvError } = await supabase
      .from('site_settings')
      .upsert(entries, { onConflict: 'key' });

    // If an error occurs, check if it's because updated_at is NOT NULL without default
    if (kvError && kvError.message.includes('updated_at')) {
      const entriesWithTime = entries.map((e) => ({
        ...e,
        updated_at: new Date().toISOString(),
      }));
      const retryResult = await supabase
        .from('site_settings')
        .upsert(entriesWithTime, { onConflict: 'key' });
      kvError = retryResult.error;
    }

    if (kvError) {
      // Fallback: try column-based upsert if single-row table is used
      const rowData: Record<string, unknown> = {
        id: 'default',
        ...parsed.data,
      };

      let { error: rowError } = await supabase
        .from('site_settings')
        .upsert(rowData);

      if (rowError && rowError.message.includes('updated_at')) {
        const retryRow = await supabase
          .from('site_settings')
          .upsert({ ...rowData, updated_at: new Date().toISOString() });
        rowError = retryRow.error;
      }

      if (rowError) {
        return {
          success: false,
          error:
            `Gagal menyimpan pengaturan ke database: ${kvError.message}. Pastikan tabel site_settings sudah dibuat di Supabase.`,
        };
      }
    }

    revalidatePath('/admin/settings');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');

    return {
      success: true,
      data: parsed.data,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat menyimpan pengaturan.',
    };
  }
}
