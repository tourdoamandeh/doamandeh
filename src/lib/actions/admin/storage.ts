'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult } from './auth';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/jpg',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadServiceImageAction(
  formData: FormData
): Promise<ActionResult<{ publicUrl: string; path: string }>> {
  try {
    const supabase = await createClient();

    // 1. Verify admin session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Sesi login telah berakhir. Silakan login kembali sebagai admin.',
      };
    }

    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'Tidak ada file gambar yang dipilih untuk diunggah.',
      };
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Tipe file tidak didukung. Harap unggah format JPG, PNG, WEBP, atau GIF.',
      };
    }

    // 3. Validate size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5MB.',
      };
    }

    // 4. Generate unique clean filename
    const ext = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${Date.now()}_${cleanName}.${ext}`;
    const filePath = `services/${fileName}`;

    // 5. Upload buffer to Supabase Storage bucket 'services'
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('services')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      // Check if bucket not found
      if (error.message?.includes('bucket not found') || error.message?.includes('Bucket not found')) {
        return {
          success: false,
          error:
            'Bucket storage "services" belum dibuat di Supabase. Silakan buat bucket publik bernama "services" di dashboard Supabase atau gunakan input URL langsung.',
        };
      }
      return {
        success: false,
        error: `Gagal mengunggah gambar ke storage: ${error.message}`,
      };
    }

    // 6. Get Public URL
    const { data: urlData } = supabase.storage
      .from('services')
      .getPublicUrl(data.path);

    return {
      success: true,
      data: {
        publicUrl: urlData.publicUrl,
        path: data.path,
      },
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan tidak terduga saat mengunggah gambar.',
    };
  }
}
