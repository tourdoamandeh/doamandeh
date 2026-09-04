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

## DEC-007: Site Settings Schema & Resilient Fallback Strategy
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: CMS Phase 6A mengimplementasikan konfigurasi dinamis website (`hero_title`, `hero_subtitle`, `about_text`, `contact_phone`, `contact_whatsapp`, `contact_email`, `contact_address`, `sosmed_instagram`, `sosmed_facebook`, `sosmed_tiktok`).
- **Decision**:
  - Mengimplementasikan `getSiteSettingsAction` dan `updateSiteSettingsAction` di `src/lib/actions/admin/settings.ts` yang mendukung skema tabel `site_settings` (key-value `key TEXT PRIMARY KEY, value TEXT` maupun row-based).
  - Menyediakan fallback aman (`DEFAULT_SITE_SETTINGS`) jika tabel belum dimigrasikan sehingga halaman `/admin/settings` tidak crash.

## DEC-008: Supabase Storage Bucket 'services' Configuration
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Admin CMS memerlukan fitur upload gambar langsung untuk foto katalog layanan wisata.
- **Decision**:
  - Menggunakan bucket publik Supabase Storage bernama `services`.
  - Mengimplementasikan validasi ukuran file (maksimal 5MB) dan MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) pada client dan server action `uploadServiceImageAction` (`src/lib/actions/admin/storage.ts`).
  - Menyediakan opsi fallback input URL langsung pada UI `ServiceFormDialog`.

## DEC-009: Multiple Customer Service Contact Fields in Site Settings
- **Date**: 2026-09-02
- **Status**: Accepted
- **Context**: Klien Doamandeh menyediakan dua nomor kontak Customer Service (CS 1 Utama & CS 2 Cadangan) untuk operasional dan pemesanan.
- **Decision**:
  - Menambahkan key `contact_whatsapp_2` (opsional) pada `siteSettingsSchema` dan `DEFAULT_SITE_SETTINGS` di `src/lib/validations/admin.ts`.
  - Mengupdate UI `SettingsForm` (`src/components/admin/settings-form.tsx`) dengan opsi penambahan / penghapusan nomor CS 2 secara dinamis.

## DEC-010: Public Landing Page Editorial Redesign, Cream #FFF6C6 Palette & Framer Motion System
- **Date**: 2026-09-03
- **Status**: Accepted
- **Context**: Tampilan landing page publik Doamandeh memerlukan pembaruan palet warna Krem, typography serif editorial, animasi motion ringan, dan standardisasi bingkai foto.
- **Decision**:
  - **Palet Warna Krem `#FFF6C6`**: Mengganti 100% warna `#FFFFFF` / `bg-white` pada teks, icon, indikator, badge logo `D.`, dan box jam operasional menjadi warna krem `#FFF6C6`.
  - **Tipografi Editorial (New York / Playfair Display)**: Menyiapkan font `--font-new-york` via Google Font `Playfair Display` dan Apple system font `New York` di `layout.tsx` dan `globals.css`.
  - **Sistem Animasi Scroll (Framer Motion)**: Memasang `framer-motion` dan membuat komponen `FadeIn` & `FadeInStagger` di `src/components/ui/fade-in.tsx` dengan durasi 0.6s dan *ease* editorial `[0.21, 0.47, 0.32, 0.98]`.
  - **Fix Motion & Layout FAQ**: Mengunci foto kanan FAQ dengan `items-stretch` dan `object-cover object-top` agar foto mengisi 100% tinggi tanpa bergeser/melompat saat accordion diklik.
  - **Standardisasi Border Foto**: Menyeragamkan bingkai foto pada seksi Hero Carousel, About, Testimonials, dan CTA menjadi `border-2 border-[#fff6c6]`.

## DEC-011: Admin UI Editorial Geometric Minimalist Standardization & Full Dynamic CMS Content Architecture
- **Date**: 2026-09-04
- **Status**: Accepted
- **Context**:
  - UI Admin/CMS sebelumnya masih menggunakan gaya rounded Linear/Stripe yang bertolak belakang dengan pedoman desain publik di `DESIGN.md` (Editorial Geometric Minimalist, flat aesthetic, border 2px solid, sudut siku 0px `rounded-none`, tanpa box shadow `shadow-none`, tipografi Futura / uppercase tracking-widest, palet `#FFF6C6`, `#504139`, `#E7E8DF`, `#2C2E31`).
  - Masih terdapat teks hardcode di komponen website klien (Hero quotes & descriptions per category, About statistics & mission, Services titles, Testimonials list, FAQ items, CTA copy, Footer brand description, dan Operating hours) yang tidak bisa dikonfigurasi melalui CMS.
- **Decision**:
  1. **Standardisasi Penuh UI Admin Mengacu ke `DESIGN.md`**:
     - Mengubah seluruh antarmuka Admin (`/admin/login`, `/admin/(dashboard)`, `/admin/services`, `/admin/bookings`, `/admin/settings`) menjadi 100% konsisten dengan `DESIGN.md`:
       - `rounded-none` absolut di seluruh kartu, tombol, badge, input text, select dropdown, modal dialog, avatar, dan table container.
       - Garis pemisah tegas `border-2 border-brown` atau `border-brown`.
       - Eliminasi seluruh bayangan artifisial (`shadow-none`).
       - Sidebar terintegrasi dengan palet brand (`bg-softyellow`, `border-r-2 border-brown`, logo `D.` dengan bingkai tegas, menu tab aktif `bg-brown text-softyellow border-l-4 border-softyellow`).
  2. **Arsitektur Konten CMS Dinamis (Zero Hardcode)**:
     - Memperluas skema pengaturan situs `siteSettingsSchema` dan `DEFAULT_SITE_SETTINGS` di `src/lib/validations/admin.ts` dengan field dinamis:
       - **Hero Section**: `hero_vehicle_desc`, `hero_vehicle_quote`, `hero_tattoo_desc`, `hero_tattoo_quote`, `hero_villa_desc`, `hero_villa_quote`, `hero_travel_desc`, `hero_travel_quote`, `hero_surfing_desc`, `hero_surfing_quote`.
       - **About Section**: `about_tagline`, `about_title`, `about_stat1_value`, `about_stat1_label`, `about_stat2_value`, `about_stat2_label`.
       - **Services Section**: `services_title`, `services_subtitle`.
       - **Testimonials**: `testimonials_title`, `testimonials_json` (array ulasan pelanggan dengan pengelola dinamis: tambah, ubah, hapus).
       - **FAQ Section**: `faq_title`, `faq_subtitle`, `faq_json` (array tanya jawab dengan pengelola dinamis: tambah, ubah, hapus).
       - **CTA Section**: `cta_tagline`, `cta_title`, `cta_subtitle`, `cta_button_text`.
       - **Footer & Operasional**: `footer_brand_desc`, `operating_hours_title`, `operating_hours_time`, `operating_hours_note`, `sosmed_tiktok`.
  3. **Penyelarasan Komponen Publik Klien**:
     - Menghubungkan seluruh props dinamis ke `HeroSection`, `AboutSection`, `ServicesSection`, `TestimonialsSection`, `FaqSection`, `CtaSection`, `PublicHeader`, `PublicFooter`, `/about`, dan `/contact`.
     - Menghapus sisa-sisa rounded corners dan bubble styles di halaman publik agar seluruh pengalaman visual Doamandeh (Klien & Admin) menyatu dalam satu bahasa visual yang harmonis dan editorial.


