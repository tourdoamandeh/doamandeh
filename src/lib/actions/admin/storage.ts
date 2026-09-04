'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
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

    // 5. Prefer service_role client if key is configured in .env (bypasses storage RLS)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const storageClient = serviceRoleKey
      ? createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
      : supabase;

    // 6. Target bucket: primary 'images' (with 'services/' folder), fallback to 'services'
    const primaryBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'images';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let activeBucket = primaryBucket;
    let uploadResult = await storageClient.storage
      .from(activeBucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    // If bucket not found, try fallback bucket
    if (
      uploadResult.error &&
      (uploadResult.error.message?.includes('not found') ||
        (uploadResult.error as any).code === 'NoSuchBucket')
    ) {
      const fallbackBucket = activeBucket === 'images' ? 'services' : 'images';
      const fallbackUpload = await storageClient.storage
        .from(fallbackBucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!fallbackUpload.error) {
        uploadResult = fallbackUpload;
        activeBucket = fallbackBucket;
      }
    }

    if (uploadResult.error) {
      const errMsg = uploadResult.error.message || '';
      const isRlsError =
        errMsg.includes('row-level security') ||
        (uploadResult.error as any).code === 'AccessDenied' ||
        (uploadResult.error as any).statusCode === '403';

      if (isRlsError) {
        return {
          success: false,
          error:
            'Akses upload ditolak oleh Storage RLS Policy di Supabase. Silakan jalankan policy SQL storage di Supabase SQL Editor atau tambahkan SUPABASE_SERVICE_ROLE_KEY di .env.',
        };
      }

      if (
        errMsg.includes('Bucket not found') ||
        (uploadResult.error as any).code === 'NoSuchBucket'
      ) {
        return {
          success: false,
          error:
            'Bucket storage tidak ditemukan. Pastikan bucket "images" (dengan folder "services") atau bucket "services" sudah dibuat dan disetel Public di Supabase.',
        };
      }

      return {
        success: false,
        error: `Gagal mengunggah gambar ke storage: ${errMsg}`,
      };
    }

    // 7. Get Public URL
    const { data: urlData } = storageClient.storage
      .from(activeBucket)
      .getPublicUrl(uploadResult.data!.path);

    return {
      success: true,
      data: {
        publicUrl: urlData.publicUrl,
        path: uploadResult.data!.path,
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

export async function deleteServiceImageAction(
  imageUrl: string
): Promise<ActionResult<{ path: string }>> {
  try {
    if (!imageUrl) {
      return { success: true, data: { path: '' } };
    }

    // Check if it's a Supabase storage URL
    const storageUrlPattern = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;
    const match = imageUrl.match(storageUrlPattern);

    let bucket = '';
    let path = '';

    if (match) {
      bucket = match[1];
      path = decodeURIComponent(match[2]);
    } else if (imageUrl.startsWith('services/') || imageUrl.startsWith('images/')) {
      bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'images';
      path = imageUrl;
    } else {
      // Not a Supabase storage file (e.g. Unsplash, external URL, or data URL)
      return { success: true, data: { path: '' } };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const storageClient = serviceRoleKey
      ? createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
      : await createClient();

    const { error } = await storageClient.storage.from(bucket).remove([path]);

    if (error) {
      // Try fallback bucket if bucket not found
      const fallbackBucket = bucket === 'images' ? 'services' : 'images';
      await storageClient.storage.from(fallbackBucket).remove([path]);
    }

    return {
      success: true,
      data: { path },
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menghapus gambar dari storage.',
    };
  }
}

