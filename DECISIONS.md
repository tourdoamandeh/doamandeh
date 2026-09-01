# Technical Decisions (DECISIONS.md)

## DEC-001: Supabase SSR Client Architecture
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Peraturan project mewajibkan penggunaan Next.js App Router, `@supabase/ssr`, dan `@supabase/supabase-js`.
- **Decision**:
  - `src/lib/supabase/client.ts`: Menggunakan `createBrowserClient` untuk client components.
  - `src/lib/supabase/server.ts`: Menggunakan `createServerClient` dengan `await cookies()` untuk Server Components & Server Actions.
  - `src/lib/supabase/middleware.ts`: Mengimplementasikan session refresh dan cookie forwarding dengan `supabase.auth.getUser()`.

## DEC-002: Category Slugs Standardization
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Data layanan harus terstruktur rapi sesuai domain bisnis Doamandeh Tours and Travel.
- **Decision**:
  - Menggunakan 5 slug baku yang di-enforce via TypeScript types dan DB check constraint:
    1. `vehicle-rental` (Sewa Kendaraan Motor & Mobil)
    2. `tattoo` (Tato Studio)
    3. `villa` (Villa & Stay)
    4. `travel` (Paket Tour)
    5. `surfing-lesson` (Surfing Lesson)

## DEC-003: Server Component Direct Read for Homepage
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Phase 1 & AGENTS.md mewajibkan pembacaan data langsung dari Supabase tanpa mock data dan tanpa hardcode, dengan error handling lengkap.
- **Decision**:
  - `src/app/page.tsx` diimplementasikan sebagai Server Component yang memanggil Supabase server client, menangani potensi error query, dan menampilkan layanan aktif secara dinamis.

## DEC-004: Admin Route Group & Layout Architecture
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Route `/admin/login` harus terpisah dari navigasi sidebar dan layout proteksi agar tidak terjadi infinite redirect loop.
- **Decision**:
  - Menggunakan route group `src/app/admin/(dashboard)/layout.tsx` untuk membungkus dashboard, services, dan bookings, memverifikasi role admin dari `public.profiles`.
  - Halaman `src/app/admin/login/page.tsx` berdiri sendiri dengan form auth dan inisialisasi admin.

## DEC-005: Penyelesaian ISSUE-001 (Cookie Preservation on Redirect)
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Pada Next.js SSR dengan Supabase, pembuatan `NextResponse.redirect()` baru dapat menghapus cookie session jika tidak di-copy dari response Supabase.
- **Decision**:
  - Pada `src/lib/supabase/middleware.ts`, setiap redirect menyalin seluruh cookies dari `supabaseResponse` ke `redirectResponse`.

## DEC-006: Migrasi middleware.ts ke proxy.ts (Next.js 16)
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Konvensi `middleware.ts` telah deprecated di Next.js 16 dan digantikan oleh `proxy.ts`.
- **Decision**:
  - Membuat `src/proxy.ts` dengan export fungsi `proxy` untuk pembaruan session Supabase dan menghapus `src/middleware.ts`.
