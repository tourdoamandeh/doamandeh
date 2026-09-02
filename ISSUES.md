# ISSUES.md

## ISSUE-001

Status: Done
Priority: High
Title: [Bug] Admin login redirect tidak stabil

Description:
Setelah login, kadang masih kembali redirect ke /admin/login karena cookie auth tidak tersalin saat pembuatan redirect response di middleware dan layout.

Steps:
1. Buka /admin/login
2. Login sebagai admin
3. Cek redirect ke /admin

Expected:
Pengguna langsung masuk ke dashboard /admin dengan sesi login yang valid dan persisten.

Actual:
Sebelumnya kadang kembali terpental ke /admin/login.

Error Log:
N/A (Redirect loop pada middleware / session cookie loss)

Suspected Files:
- src/lib/supabase/middleware.ts
- src/lib/actions/admin/auth.ts
- src/app/admin/login/page.tsx
- src/app/admin/(dashboard)/layout.tsx

Suggested Fix:
1. Salin seluruh cookies dari `supabaseResponse` ke `redirectResponse` saat rute admin dialihkan di `src/lib/supabase/middleware.ts`.
2. Pisahkan rute `/admin/login` dari protected layout route group `src/app/admin/(dashboard)/layout.tsx`.
3. Verifikasi role admin dari tabel `public.profiles` di server action `loginAdminAction`.

Blocker:
No

---

## Catatan / Todo Lanjutan

1. **Storage Bucket Foto Layanan (Selesai pada Phase 6A)**:
   - Integrasi upload gambar langsung via Supabase Storage bucket `services` dan input URL langsung telah selesai diimplementasikan di `ServiceFormDialog` dan `src/lib/actions/admin/storage.ts`.
2. **WhatsApp Webhook / Notification (Opsional)**:
   - Integrasi notifikasi otomatis ke nomor WhatsApp admin saat ada booking baru masuk.

