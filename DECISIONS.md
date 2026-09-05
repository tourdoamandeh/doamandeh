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

## DEC-012: Unified Service Asset & Fallback Synchronization Architecture
- **Date**: 2026-09-04
- **Status**: Accepted
- **Context**:
  - Terdapat ketidaksinkronan antara katalog layanan di CMS Admin dan tampilan website publik (klien).
  - Tampilan layanan di seksi homepage publik sebelumnya mengabaikan foto yang diunggah di CMS karena hardcoded ke array statis.
  - Sebaliknya, di CMS Admin, jika suatu layanan belum memiliki foto custom yang diupload, tabel menampilkan kotak putus-putus kosong dan dialog form menggunakan link preset eksternal Unsplash yang tidak sesuai aset brand resmi.
  - Folder `public/assets` telah memiliki aset foto berkualitas tinggi (`service-vehicle.jpg`, `service-tattoo.jpg`, `service-villa.jpg`, `service-travel.jpg`, `service-surfing.png`) serta ilustrasi vektor pendukung.
- **Decision**:
  1. **Single Source of Truth (`src/lib/constants.ts`)**:
     - `SERVICE_FALLBACK_IMAGES`: Pemetaan terpusat 5 kategori layanan ke file foto resmi di `public/assets/`.
     - `SERVICE_PRESET_IMAGES`: Koleksi preset gambar resmi (`/assets/...`) per kategori yang dapat dipilih langsung oleh Admin di CMS.
     - `getServiceFallbackImage(category)`: Helper fungsi untuk memperoleh URL fallback sesuai kategori layanan.
     - `getServiceImageUrl(service)`: Helper fungsi terpadu; jika `image_url` terisi (misal hasil upload ke Supabase Storage), gunakan URL tersebut. Jika kosong/null, otomatis fallback ke aset `public/assets/`.
  2. **Sinkronisasi CMS Admin**:
     - `service-form-dialog.tsx`: Mengganti preset Unsplash dengan aset lokal resmi, menampilkan banner informatif fallback foto bawaan ketika belum ada foto diunggah, dan memberikan visual highlight pada pilihan preset.
     - `services-table.tsx`: Menampilkan thumbnail foto menggunakan `getServiceImageUrl(service)` disertai badge indikator `A` (Auto/Asset) jika menggunakan foto bawaan sehingga admin dapat langsung memverifikasi visual tampilan layanan.
  3. **Sinkronisasi Website Publik**:
     - `services-section.tsx`: Mengintegrasikan `getServiceImageUrl(service)` dan `found.description` dari CMS sehingga setiap perubahan foto atau deskripsi di CMS langsung tersinkronisasi ke homepage, dengan fallback mulus ke `/assets/`.
     - `services/[id]/page.tsx` & `category/[slug]/page.tsx`: Menggunakan `getServiceImageUrl(service)` sehingga banner utama dan kartu katalog selalu menampilkan visual berkualitas tinggi tanpa ada celah gambar kosong.

## DEC-013: Multiline Input & Textarea UX Enhancement across Settings & CMS Forms
- **Date**: 2026-09-04
- **Status**: Accepted
- **Context**:
  - Pada halaman pengaturan CMS (`/admin/settings`), dialog layanan, dan dialog pemesanan, banyak kolom teks panjang yang tampil terpotong (misal kutipan foto 3 baris di seksi Hero hanya memiliki `rows={2}`, narasi deskripsi terpotong di tepi bawah, dan subjudul serta alamat kantor menggunakan input 1 baris yang terpotong secara horizontal).
- **Decision**:
  1. **Ekspansi Dimensi Vertikal & Baris (Rows) Memadai**:
     - `hero_title` ditingkatkan ke `rows={4}` dengan `min-h-[96px]`.
     - `hero_subtitle` diubah dari single-line `<Input />` menjadi `<textarea rows={3} min-h-[75px] />` agar kalimat panjang terbaca utuh.
     - Seluruh kutipan (`hero_slide_*_quote`) dan deskripsi banner 5 kategori layanan ditingkatkan dari `rows={2}` ke `rows={4}` dengan `min-h-[92px]`.
     - `about_title` (`rows={4}` `min-h-[96px]`) & `about_text` (`rows={6}` `min-h-[140px]`).
     - `services_title` (`rows={3}`), `services_subtitle` (`rows={4}`), `cta_title` (`rows={3}`), `cta_subtitle` (`rows={3}`).
     - Ulasan testimoni (`rows={3}`), FAQ title/subtitle/answer (`rows={3}` & `rows={4}` `min-h-[96px]`).
     - `contact_address` diubah dari single-line `<Input />` menjadi `<textarea rows={2} min-h-[64px] />`.
     - `footer_brand_desc` ditingkatkan ke `rows={4}` `min-h-[96px]`.
     - Dialog layanan (`service-form-dialog.tsx`) deskripsi: ditingkatkan ke `rows={4}` `min-h-[96px]`.
     - Dialog booking (`booking-form-dialog.tsx`) catatan: ditingkatkan ke `rows={3}` `min-h-[80px]`.
  2. **Interaktivitas & Tipografi yang Lega**:
     - Menerapkan `leading-relaxed` dan padding yang proporsional (`px-3 py-2.5`).
     - Mengganti `resize-none` dengan `resize-y` pada seluruh textarea agar admin memiliki kebebasan memperlebar textarea vertikal sesuai kenyamanan kerja.

## DEC-014: Integration of shadcn/ui Chart into Admin CMS Overview Dashboard
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**:
  - Halaman ringkasan Admin (`/admin`) memerlukan visualisasi metrik operasional yang dense, cepat, dan jelas sesuai pedoman `ADMIN_UI.md`.
  - Komponen chart diinstal via shadcn registry CLI (`bunx --bun shadcn@latest add chart`).
- **Decision**:
  1. **Komponen Primitives & Token Warna**:
     - Memasang `src/components/ui/chart.tsx` resmi dari registry shadcn (menggunakan `recharts 3.8.0`).
     - Mendaftarkan `--color-chart-1` hingga `--color-chart-5` di `@theme inline` serta token scoped `--chart-1` s.d. `--chart-5` di `globals.css` (`[data-theme="admin"]` menggunakan deep teal `#0f766e`, sky `#0284c7`, amber `#f59e0b`, emerald `#10b981`, dan indigo `#6366f1`).
  2. **Arsitektur Komponen Client & Server**:
     - `src/app/admin/(dashboard)/page.tsx` tetap berperan sebagai Server Component untuk memuat data dari Supabase SSR client.
     - Membuat `src/components/admin/overview-charts.tsx` sebagai Client Component interaktif (`use client`).
  3. **Visualisasi Data Operasional**:
     - **Grafik 1 (AreaChart)**: Tren Aktivitas Reservasi 6 bulan terakhir, memvisualisasikan volume total booking vs status terkonfirmasi dengan tooltip monospaced tabular-nums dan legend status.
     - **Grafik 2 (BarChart)**: Katalog & Permintaan per Kategori, membandingkan jumlah katalog aktif vs volume reservasi pada 5 kategori layanan (Travel, Villa, Surfing, Kendaraan, Tato).
  4. **Penyelarasan Layout Main Content**:
     - Meletakkan seksi chart di bawah 4 kartu KPI utama.
     - Memperbarui sidebar kanan menjadi panel Status Reservasi (Confirmed, Completed, Pending, Cancelled dengan status badges) dan menu Akses Cepat.

## DEC-015: Sidebar Smooth Animation Architecture & Chart Time-Range Select Filter
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**:
  - Saat membuka/menutup sidebar admin (`/admin`), terjadi lag dan stuttering (patah-patah) karena:
    1. Unmounting/mounting instan elemen React DOM (header, group label, tooltips, dan user card) saat boolean `isCollapsed` berubah di frame 0, mendahului transisi CSS 200ms.
    2. Recharts `ResponsiveContainer` default `debounce=0` memicu event `ResizeObserver` puluhan kali per detik di setiap frame perubahan lebar sidebar, membebani JavaScript main thread dengan kalkulasi ulang SVG.
  - Pengguna juga menginginkan filter dropdown shadcn pada grafik Tren Aktivitas Reservasi untuk memilih rentang waktu: seminggu terakhir, sebulan terakhir, dan 6 bulan terakhir.
- **Decision**:
  1. **Eliminasi DOM Thrashing pada Sidebar (`app-sidebar.tsx`)**:
     - Mempertahankan struktur DOM yang stabil tanpa unmount/mount komponen secara instan.
     - Menggunakan transisi CSS (`transition-all duration-200`, `opacity-0 w-0 overflow-hidden`) untuk menyembunyikan teks label, sub-deskripsi, dan kartu profil secara halus tanpa merusak layout tree.
     - Membungkus seluruh menu item dengan `<Tooltip open={isCollapsed ? undefined : false}>` sehingga tooltip hanya aktif saat sidebar dalam posisi collapsed tanpa tearing DOM nodes.
  2. **Chart ResizeObserver Debounce**:
     - Menambahkan `debounce={150}` pada `ResponsiveContainer` di `src/components/ui/chart.tsx` sehingga Recharts menunda re-render kalkulasi SVG hingga transisi lebar sidebar selesai, mengembalikan performa animasi ke 60 FPS yang mulus.
  3. **Pemasangan Dropdown Filter Waktu (`select.tsx`)**:
     - Menginstal komponen primitif resmi `Select` shadcn via CLI (`bunx --bun shadcn@latest add select`).
     - Mengintegrasikan filter rentang waktu interaktif pada `OverviewCharts` (`7d` Seminggu Terakhir, `30d` Sebulan Terakhir, dan `6m` 6 Bulan Terakhir) dengan kalkulasi agregasi harian/bulanan dinamis dan penyesuaian interval X-Axis otomatis.

## DEC-016: Dual Theme Isolation & Scoped Dark Mode for Admin CMS
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**:
  - Pengguna meminta penambahan fitur dark mode eksklusif untuk Admin CMS (`/admin`), dibuat pada git branch terpisah `feat/admin-dark-mode`, menggunakan komponen resmi shadcn (DropdownMenu untuk opsi: Terang, Gelap, Sistem).
  - Terdapat persyaratan ketat isolasi tema: website publik (`/`, `/about`, `/contact`, `/services/*`, `/category/*`) tidak boleh terpengaruh oleh dark mode sama sekali dan harus 100% mempertahankan palet brand resmi Krem (`#FFF6C6`) dan Cokelat (`#504139`).
- **Decision**:
  1. **Scoped Dark Mode Tokens**:
     - Mendaftarkan CSS tokens dark mode di `src/app/globals.css` secara scoped hanya di bawah selector `[data-theme="admin"].dark`, `[data-theme="admin"][data-admin-mode="dark"]`, dan `html[data-theme="admin"].dark`.
     - Menggunakan palet obsidian & stone-950 (`#09090b` background, `#121215` card/popover, `#27272a` border, `#f4f4f5` foreground, `#14b8a6` primary teal, dan badge status berlatar belakang transparan).
  2. **AdminThemeProvider & Zero-Leakage Lifecycle (`admin-theme.tsx`)**:
     - Mengelola state tema (`light | dark | system`), mendeteksi preferensi sistem secara reaktif via `window.matchMedia('(prefers-color-scheme: dark)')`, dan menyimpan pilihan di `localStorage` (`admin-theme-preference`).
     - Menerapkan script pre-paint inline di `src/app/admin/layout.tsx` untuk mencegah Flash of Unstyled Content (FOUC).
     - Menjamin **Zero Theme Leakage**: saat berpindah dari halaman `/admin` ke website publik, cleanup function pada `AdminThemeProvider` seketika mencabut atribut `data-theme`, `data-admin-mode`, dan class `.dark` dari `document.documentElement`.
  3. **Komponen shadcn DropdownMenu (`admin-theme-toggle.tsx`)**:
     - Menginstal `@base-ui/react/menu` via `bunx --bun shadcn@latest add dropdown-menu`.
     - Membuat `AdminThemeToggle` dengan trigger tombol ikon Sun/Moon yang responsif, menyajikan opsi "Terang", "Gelap", dan "Sistem" dengan visual checkmark aktif.
     - Memasang toggle di header operasional admin (`AdminHeader`) dan pojok atas halaman login (`AdminLoginPage`).
