# TASKS.md

> Status Phase 1–6C: DONE (fondasi, public, CMS, booking UX polish, Phase 6B Editorial Bento UI)
> Sekarang masuk Phase 7 (integration & QA).

## Phase 6A — CMS Advanced (Owner: Sultan)

- [x] Upload gambar service ke Supabase Storage
  - [x] Preview gambar di form
  - [x] Validasi tipe & ukuran file
  - [x] Simpan URL ke services.image_url
- [x] Site Settings CMS
  - [x] Tambah halaman /admin/settings
  - [x] Key: hero_title, hero_subtitle, about_text, contact, sosmed
  - [x] Server actions get/update site_settings dengan fallback default
- [x] Booking Management Upgrade
  - [x] Filter by status (pending / confirmed / cancelled / completed)
  - [x] Filter by category
  - [x] Search by nama/email/phone/layanan
  - [x] Sort by newest/oldest/date/price
  - [x] Detail booking modal/drawer lengkap dengan direct WhatsApp action
  - [x] Quick action confirm/cancel/complete di tabel & modal
- [x] Service Management Upgrade
  - [x] Filter category
  - [x] Search service
  - [x] Sort by newest/price/title
  - [x] Toggle active/inactive
  - [x] Custom delete confirmation dialog
  - [x] Empty state responsif
- [x] Validasi & error handling admin forms (Zod & server actions)
- [x] Sidebar admin (shadcn base sidebar)
  - [x] Install component sidebar
  - [x] Theming via CSS variables di globals.css
  - [x] Menu + active state + collapsible icon
  - [x] Footer user + logout
  - [x] Integrate ke /admin/layout.tsx + SidebarTrigger di topbar

## Phase 6B — Public Website Upgrade (Owner: Mayang)

- [x] Homepage dinamis dari site_settings
- [x] Hero section dengan gambar dari Supabase Storage & offline SVG asset
- [x] Halaman About
- [x] Halaman Contact dengan map
- [x] Testimoni section (data bisa dari Supabase)
- [x] FAQ section
- [x] SEO: meta tags, OG image, sitemap.xml
- [x] Favicon & branding konsisten
- [x] Mobile nav polish

## Phase 6C — Booking & UX Polish (Owner: Sahrul)

- [x] Form booking dengan validasi zod & Server Actions
- [x] Date picker yang proper (start_date, end_date) & durasi dinamis
- [x] Loading, success, error state pada form booking
- [x] Notifikasi booking (toast)
- [x] Konfirmasi booking via WhatsApp & ringkasan email (optional, Supabase Edge Function)
- [x] Konsistensi UI antar halaman & Editorial Bento
- [x] Empty state & skeleton loading
- [x] Accessibility (alt text, aria-label, keyboard nav)

## Phase 7 — Integration & QA (Owner: All)

- [x] Merge semua rute & komponen
- [x] End-to-end test: user booking → admin lihat → admin confirm
- [x] End-to-end test: admin upload gambar → tampil di homepage
- [x] End-to-end test: admin ubah site settings → homepage update
- [x] `bun run build` (zero error & 100% pass)

## Phase 8 — Admin UI Editorial Redesign & Full Dynamic CMS Engine (Owner: All)

- [x] Git branch baru `feature/admin-redesign-dynamic-cms`
- [x] Skema CMS dinamis tanpa hardcode (`siteSettingsSchema` & `DEFAULT_SITE_SETTINGS`)
  - [x] Hero section per-kategori quotes & descriptions dinamis
  - [x] About section (tagline, title, body, dynamic stats 1 & 2)
  - [x] Services section (dynamic title & subtitle)
  - [x] Testimonials manager dinamis (CRUD list via JSON parser di CMS)
  - [x] FAQ manager dinamis (CRUD list via JSON parser di CMS)
  - [x] CTA section (tagline, title, subtitle, button text dinamis)
  - [x] Footer & Operasional (brand description, operating hours title, time, note, sosmed tiktok)
- [x] Redesain UI Admin / CMS mengacu 100% ke `DESIGN.md`:
  - [x] Halaman login admin (`/admin/login`) — Flat editorial aesthetic, `bg-softyellow`, `border-2 border-brown`, `rounded-none`, `shadow-none`, monogram D.
  - [x] Layout dashboard & top header (`/admin/(dashboard)`) — Kanvas krem editorial, breadcrumbs tebal, border 2px solid
  - [x] Sidebar admin (`app-sidebar.tsx`) — `rounded-none`, `border-r-2 border-brown`, tab aktif `bg-brown text-softyellow border-l-4 border-softyellow`
  - [x] Overview dashboard (`/admin/(dashboard)/page.tsx`) — Flat KPI cards, border-2 border-brown, rounded-none, tabel booking terbaru
  - [x] Layanan wisata (`/admin/(dashboard)/services`) — Filter category, search, action buttons, dialog form, delete alert, dropzone rounded-none
  - [x] Manajemen reservasi (`/admin/(dashboard)/bookings`) — Filter tabs, detail modal, WhatsApp action, form dialog rounded-none
  - [x] Form CMS site settings (`/admin/(dashboard)/settings`) — Multi-tab CMS editor (Hero, About, Services/CTA, Testimoni, FAQ, Kontak, Sosmed)
- [x] Integrasi Website Publik ke CMS (Zero Hardcode):
  - [x] `HeroSection` terkoneksi penuh ke data dinamis
  - [x] `AboutSection` & halaman `/about` terkoneksi penuh ke data dinamis
  - [x] `ServicesSection` terkoneksi penuh ke data dinamis
  - [x] `TestimonialsSection` terkoneksi penuh ke data dinamis
  - [x] `FaqSection` terkoneksi penuh ke data dinamis
  - [x] `CtaSection` terkoneksi penuh ke data dinamis
  - [x] `PublicHeader` & `PublicFooter` serta halaman `/contact` terkoneksi penuh ke data dinamis
  - [x] Standardisasi seluruh border & radius publik ke `rounded-none` dan `border-2` (eliminasi sisa soft bubble/rounded relics)
- [x] Dokumentasi & QA:
  - [x] Update `DECISIONS.md` (DEC-011)
  - [x] Update `TASKS.md` & `ISSUES.md`
  - [x] Build verifikasi `bun run build` lolos 100% tanpa error

## Phase 9 — Dual Theme Architecture & Strict Neutral Admin Refactor (Owner: All)

- [x] Arsitektur Scoping Theme via CSS Variables:
  - [x] Token publik brand tetap di `:root` (`globals.css`)
  - [x] Block override `[data-theme="admin"]` di `globals.css` sesuai token `ADMIN_UI.md`
  - [x] Client component `src/components/admin/admin-theme.tsx` untuk set/remove `data-theme="admin"` di root `<html>`
  - [x] Scoping typography: font Futura dibatasi ke `html:not([data-theme="admin"])`, font admin memakai `Instrument Sans` & `JetBrains Mono`
- [x] Refactor Seluruh Halaman & Komponen Admin (Zero AI Slop & Anti-Brand Relics):
  - [x] `src/app/admin/login/page.tsx` — Clean neutral card, logo monogram D, input & button semantic
  - [x] `src/app/admin/(dashboard)/layout.tsx` — Inset `bg-background text-foreground`
  - [x] `src/components/admin/admin-header.tsx` — Topbar `bg-card border-b border-border h-14`
  - [x] `src/components/admin/app-sidebar.tsx` — Sidebar dark `bg-sidebar border-r border-sidebar-border`, logo D kotak, active state semantic
  - [x] `src/app/admin/(dashboard)/page.tsx` — KPI card `font-mono tabular-nums`, tabel pemesanan compact `h-11`, status dot
  - [x] `src/app/admin/(dashboard)/services/page.tsx` & `services-table.tsx` & `service-form-dialog.tsx` — Filter toolbar, compact table, status dot, dialog clean modal
  - [x] `src/app/admin/(dashboard)/bookings/page.tsx` & `bookings-table.tsx` & `booking-form-dialog.tsx` — Status segment filters, detail modal, dialog manual booking
  - [x] `src/app/admin/(dashboard)/settings/page.tsx` & `settings-form.tsx` — Tab navigation, cards, form inputs & status banners
- [x] Verifikasi & QA:
  - [x] `git diff src/components/ui` kosong (primitives tidak tersentuh)
  - [x] Tampilan website publik 100% utuh tanpa perubahan
  - [x] Navigasi public ↔ admin bebas kebocoran tema
  - [x] `bun run build` lulus 100% tanpa error (13 routes static/dynamic)
  - [x] Update dokumentasi `ADMIN_UI.md`, `TASKS.md`, `ISSUES.md`

## Phase 10 — Unified Service Assets & Fallback Synchronization (Owner: Sultan & Mayang)

- [x] Sinkronisasi Koleksi Aset Lokal (`public/assets`) dengan CMS & Web Publik:
  - [x] Mendefinisikan pemetaan fallback terpusat `SERVICE_FALLBACK_IMAGES` di `src/lib/constants.ts`:
    - `vehicle-rental` -> `/assets/service-vehicle.jpg`
    - `tattoo` -> `/assets/service-tattoo.jpg`
    - `villa` -> `/assets/service-villa.jpg`
    - `travel` -> `/assets/service-travel.jpg`
    - `surfing-lesson` -> `/assets/service-surfing.png`
  - [x] Menyiapkan koleksi preset resmi `SERVICE_PRESET_IMAGES` per kategori di `src/lib/constants.ts` (menggantikan link eksternal Unsplash).
  - [x] Membuat helper fungsi terpadu `getServiceFallbackImage(category)` dan `getServiceImageUrl(service)`.
- [x] Integrasi CMS Admin:
  - [x] `service-form-dialog.tsx`: Menampilkan banner informatif fallback foto bawaan ketika belum ada foto diunggah, tombol preset menggunakan aset resmi `public/assets` dengan active selection highlight, dan validasi URL lokal/eksternal.
  - [x] `services-table.tsx`: Thumbnail foto tabel langsung menampilkan `getServiceImageUrl(service)` dengan badge indikator `A` (Auto/Asset) jika menggunakan foto bawaan sehingga admin dapat memverifikasi visual secara akurat.
- [x] Integrasi Website Publik (Klien):
  - [x] `services-section.tsx`: Menggunakan `getServiceImageUrl(service)` dan `found.description` dari CMS sehingga setiap perubahan gambar atau deskripsi di CMS langsung tersinkronisasi, dengan fallback otomatis ke aset lokal jika foto belum diunggah.
  - [x] `services/[id]/page.tsx` & `category/[slug]/page.tsx`: Menggunakan `getServiceImageUrl(service)` agar header utama dan kartu katalog selalu memiliki tampilan visual berkualitas tinggi tanpa kotak kosong.
- [x] Verifikasi & Dokumentasi:
  - [x] `bun x tsc --noEmit` lolos 0 error.
  - [x] `bun run build` sukses 100% (13 routes).
  - [x] Dokumentasi `DECISIONS.md` (DEC-012), `TASKS.md`, `ISSUES.md`.

## Phase 11 — Multiline Input & Textarea UX Enhancement (Owner: Sultan & Mayang)

- [x] Perbaikan Pemotongan Teks pada Formulir Pengaturan CMS & Admin (`/admin/settings`):
  - [x] Seksi Hero:
    - `hero_title`: Ditingkatkan ke `rows={4}` dengan `min-h-[96px]`, `leading-relaxed`, dan `resize-y`.
    - `hero_subtitle`: Diubah dari single-line `<Input />` menjadi `<textarea rows={3} min-h-[75px] />` sehingga subjudul panjang terbaca tuntas tanpa terpotong horizontal.
    - 5 Kategori Layanan (`travel`, `villa`, `surfing`, `vehicle`, `tattoo`):
      - Kutipan foto (`hero_slide_*_quote`): Ditingkatkan dari `rows={2}` ke `rows={4}` dengan `min-h-[92px]` (kutipan 3-4 baris tampil utuh tanpa terpotong di tepi bawah).
      - Deskripsi banner (`hero_slide_*_desc`): Ditingkatkan dari `rows={2}` ke `rows={4}` dengan `min-h-[92px]`.
  - [x] Seksi Tentang Kami:
    - `about_title`: `rows={4}` `min-h-[96px]`.
    - `about_text`: `rows={6}` `min-h-[140px]`.
  - [x] Seksi Layanan & CTA:
    - `services_title`: `rows={3}` `min-h-[80px]`.
    - `services_subtitle`: `rows={4}` `min-h-[96px]`.
    - `cta_title`: `rows={3}` `min-h-[80px]`.
    - `cta_subtitle`: `rows={3}` `min-h-[80px]`.
  - [x] Seksi Testimoni & FAQ:
    - Komentar ulasan testimoni: `rows={3}` `min-h-[75px]`.
    - Judul & subjudul FAQ: `rows={3}` `min-h-[75px]`.
    - Jawaban lengkap FAQ: `rows={4}` `min-h-[96px]`.
  - [x] Seksi Kontak & Jam Operasional:
    - `contact_address`: Diubah dari single-line `<Input />` menjadi `<textarea rows={2} min-h-[64px] />` agar alamat lengkap terbaca jelas.
    - `footer_brand_desc`: `rows={4}` `min-h-[96px]`.
- [x] Perbaikan Dialog Admin & Publik:
  - [x] `service-form-dialog.tsx`: Deskripsi fasilitas layanan ditingkatkan ke `rows={4}` `min-h-[96px]` dengan `resize-y`.
  - [x] `booking-form-dialog.tsx`: Catatan booking ditingkatkan ke `rows={3}` `min-h-[80px]` dengan `resize-y`.
  - [x] `booking-form.tsx` (Publik): Catatan tambahan ditingkatkan ke `min-h-[90px]` dengan `resize-y`.
- [x] Verifikasi:
  - [x] `bun x tsc --noEmit`: 0 error.
  - [x] `bun run build`: Berhasil 100% (13 routes).
  - [x] Dokumentasi `DECISIONS.md` (DEC-013), `TASKS.md`, `ISSUES.md`.

## Phase 12 — shadcn/ui Chart Integration in Admin CMS Overview (Owner: Sultan & Mayang)

- [x] Instalasi Komponen Chart shadcn/ui:
  - [x] Menjalankan `bunx --bun shadcn@latest add chart` via shadcn CLI.
  - [x] Menginstal `src/components/ui/chart.tsx` resmi dan dependensi `recharts 3.8.0`.
  - [x] Mendaftarkan token `--color-chart-1` s.d. `--color-chart-5` di `@theme inline` dan definisi scoped `--chart-1` s.d. `--chart-5` di `globals.css` sesuai palet deep teal `ADMIN_UI.md`.
- [x] Implementasi Komponen Grafik Overview (`src/components/admin/overview-charts.tsx`):
  - [x] **Grafik 1 (AreaChart)**: Tren Aktivitas Reservasi 6 bulan terakhir dengan area gradient lembut, kurva mulus, grid horizontal putus-putus, tooltip monospaced, dan legend status (Semua Booking vs Terkonfirmasi).
  - [x] **Grafik 2 (BarChart)**: Katalog & Permintaan per Kategori, membandingkan ketersediaan katalog aktif vs volume reservasi pada 5 kategori (Travel, Villa, Surfing, Kendaraan, Tato).
- [x] Integrasi Halaman Overview (`src/app/admin/(dashboard)/page.tsx`):
  - [x] Menghubungkan data `bookings`, `services`, dan `categoryCounts` dari Server Component Supabase ke `OverviewCharts`.
  - [x] Memperbarui sidebar kanan dengan kartu status reservasi (Confirmed, Completed, Pending, Cancelled) dan menu akses cepat.
- [x] Verifikasi:
  - [x] `bun x tsc --noEmit`: 0 error.
  - [x] `bun run build`: Berhasil 100% (13 routes static/dynamic).
  - [x] Dokumentasi `DECISIONS.md` (DEC-014), `TASKS.md`, `walkthrough.md`.

## Phase 13 — Sidebar Smooth Transition & Chart Time-Range Select Filter (Owner: Sultan & Mayang)

- [x] Perbaikan Bug UI Animasi Buka/Tutup Sidebar:
  - [x] Mengeliminasi unmount/mount DOM seketika di `app-sidebar.tsx` dengan transisi opacity dan width (`transition-all duration-200`) sehingga header, navigasi, dan user card meluncur mulus.
  - [x] Membungkus seluruh nav items secara stabil dengan tooltip dan mengaktifkannya hanya saat sidebar collapsed tanpa merusak struktur DOM.
  - [x] Mengaktifkan `debounce={150}` pada `ResponsiveContainer` di `src/components/ui/chart.tsx` sehingga Recharts menunda kalkulasi SVG berulang saat transisi lebar sidebar berlangsung, menghasilkan animasi 60 FPS yang lancar tanpa stutter.
- [x] Penambahan Filter Waktu Dropdown shadcn/ui:
  - [x] Menginstal komponen primitif resmi `src/components/ui/select.tsx` via CLI `bunx --bun shadcn@latest add select`.
  - [x] Mengimplementasikan filter dropdown di header grafik Tren Aktivitas Reservasi dengan 3 opsi:
    - `7d`: Seminggu Terakhir (agregasi 7 hari kalender dengan nama hari dan tanggal)
    - `30d`: Sebulan Terakhir (agregasi 30 hari kalender dengan interval X-Axis terkalibrasi)
    - `6m`: 6 Bulan Terakhir (agregasi tren bulanan standar)
- [x] Verifikasi:
  - [x] `bun x tsc --noEmit`: 0 error.
  - [x] `bun run build`: Lulus 100% (13 routes).
  - [x] Dokumentasi `DECISIONS.md` (DEC-015), `TASKS.md`, `walkthrough.md`.

## Log Perubahan

- [2026-09-02] Phase 1–5 selesai, masuk Phase 6.
- [2026-09-02] Phase 6A (CMS Advanced) selesai: Upload gambar Supabase Storage, Site Settings CMS, Service & Booking Management upgrade (filter, search, sort, detail modal, quick actions, custom dialogs, Zod validation).
- [2026-09-02] Admin Operations UI Redesign (ADMIN_UI.md): Implementasi tema operations tool Linear/Stripe style (Instrument Sans + JetBrains Mono, sidebar dark #101010, background #FAFAF9, table compact row h-11, status dot+text, deep teal #0F766E, zero AI slop, zero gradients/glassmorphism).
- [2026-09-02] Sidebar Admin shadcn Base: Implementasi penuh komponen sidebar shadcn (SidebarProvider, Sidebar collapsible icon, SidebarHeader brand Doamandeh, SidebarContent menu, SidebarFooter user & logout, SidebarTrigger di topbar) dengan theming murni via CSS variables di globals.css.
- [2026-09-02] Phase 6B (Public Website Upgrade) selesai: Homepage dinamis dari site_settings, Hero section support hero_image_url & gambar layanan dari Supabase Storage, Halaman About (/about), Halaman Contact (/contact) dengan Google Maps iframe, Testimoni section, FAQ accordion section, SEO metadata & OpenGraph, dynamic sitemap.xml & robots.txt, serta polish mobile navigation drawer.
- [2026-09-02] Phase 6C selesai: Peningkatan validasi Zod booking form, date range picker interaktif (start_date & end_date) dengan kalkulasi durasi dan total harga otomatis, sistem notifikasi toast mengambang, konfirmasi via WhatsApp + email summary, skeleton loading untuk services detail & category, perbaikan aksesibilitas (a11y: label, aria attributes, keyboard navigation), dan verifikasi build berhasil (`bun run build`).
- [2026-09-03] Redesain UI Publik ke Sistem Editorial Bento (DESIGN.md): Penggunaan Instrument Serif untuk judul & UI elements, soft borderless pastel cards (Light Blue, Soft Peach, Pale Yellow, Soft Pink), background body putih murni #FFFFFF, token warna Tailwind (@theme inline: tissue, black, lightblue, peach, yellow, softpink), Kopperfield floating scenery hero section dengan foto offline Bali (`/assets/hero-bali.svg`), serta penyelesaian seluruh task Phase 6C & QA build 100% zero error.
- [2026-09-03] Landing Page Complete Overhaul & Redesign Polish: Implementasi menyeluruh font Futura, penghapusan efek grayscale foto di seluruh seksi, perancangan carousel testimoni 6 kartu (#504139), penyempurnaan seksi FAQ compact pas 1 layar (gambar 02 hidden di mobile), pertipisan garis border seksi (#131718/15), tombol CTA ganda, footer bg #FFFFFF & kartu jam operasional #504139. Dokumentasi DEC-010 di DECISIONS.md dan penambahan 4 To-Do items di ISSUES.md.
- [2026-09-04] Landing Page Palette (#FFF6C6), Typography (New York/Playfair Display), Framer Motion & Photo Borders: Penggantian 100% warna #FFFFFF menjadi Krem #FFF6C6, pengaplikasian font Apple New York & Playfair Display, sistem animasi scroll FadeIn/FadeInStagger via framer-motion, perbaikan layout foto FAQ (items-stretch & object-top), standardisasi border-2 border-[#fff6c6], serta git merge & push ke main branch.
- [2026-09-04] Photos & Layout Overhaul: Pembaruan layout FAQ mobile, perombakan CTA section ke 5 layanan Doamandeh dengan tumpukan kartu interaktif (dating-app side-peek layout), penggantian foto About section & Testimonials section menggunakan aset offline SVG asli di `/assets` (Rumah pohon, Uluwatu, Kayaking, Floating pool breakfast, Sewa motor, Sewa mobil, Tattoo studio, Surfing lesson), serta pembaharuan checklist proyek.
- [2026-09-04] Admin UI Editorial Redesign & Full Dynamic CMS Engine (Branch `feature/admin-redesign-dynamic-cms`): Standardisasi menyeluruh UI Admin/CMS (`/admin/login`, `/admin/(dashboard)`, sidebar, header, services, bookings, settings) sesuai pedoman `DESIGN.md` (Editorial Geometric Minimalist, sudut siku 0px `rounded-none`, flat 2px solid border, tanpa shadow artifisial, palet krem & cokelat tua). Penghapusan seluruh teks hardcode di website publik dengan arsitektur CMS dinamis untuk Hero quotes/descriptions, About stats/tagline, Services title/subtitle, Testimonials CRUD, FAQ CRUD, CTA content, Footer brand & jam operasional, serta verifikasi build lulus 100%.
- [2026-09-04] Dual Theme Architecture & Strict Neutral Admin Refactor: Pemisahan total theme publik (brand krem `:root`) dan admin (`[data-theme="admin"]`) via CSS variables scoping dan client component `AdminTheme` pada tag `<html>`. Refactor menyeluruh login, overview dashboard, layanan, booking, dan pengaturan CMS ke standar neutral operations tool (Linear/Stripe) sesuai `ADMIN_UI.md` tanpa forking/mengubah `src/components/ui/**`, eliminasi total class brand di admin, serta verifikasi build Next.js 16 lulus 100%.
- [2026-09-04] Perbaikan Bug UI Admin: Pendaftaran seluruh token warna shadcn ke Tailwind CSS v4 `@theme inline` di `globals.css` (memperbaiki background modal dan tooltip transparan), penambahan explicit background `bg-white dark:bg-zinc-950 bg-card` pada modal dialogs, penyelarasan dimensi `size-8` dan peniadaan padding horizontal saat sidebar collapsed sehingga icon tidak terpotong, serta pemulihan kontras solid native tooltip. Build Next.js 16 lulus 100% (13 routes).
- [2026-09-04] Sidebar Polish: Penghapusan logo kotak "D" pada sidebar (menggunakan tipografi brand bersih "Doamandeh Admin Operations" saat expanded), penghapusan link duplikat "Website Publik" di footer sidebar (tetap tersedia di topbar header), serta peningkatan offset tooltip (`sideOffset={22}`) agar memiliki jarak mengambang yang lega dan tidak menempel ke garis tepi sidebar. Build lulus 100%.
- [2026-09-04] Supabase Storage Upload Fix: Mengidentifikasi string raksasa di terminal sebagai Base64 Data URL akibat silent fallback saat upload gagal. Menyelaraskan target bucket ke `images` dengan folder `services/`, menambahkan dukungan `SUPABASE_SERVICE_ROLE_KEY` untuk bypass RLS pada server action, menambahkan dokumentasi RLS policy di `supabase/schema.sql`, serta menghapus silent Base64 fallback di form dialog agar error storage tertangkap dan tidak mengotori database PostgreSQL. Build lulus 100%.
- [2026-09-04] Form Layanan Image Action Fix: Memperbaiki tombol 'Ganti' dengan memindahkan hidden file input ke luar blok kondisional agar ref selalu ter-mount di DOM; memperbaiki tombol delete foto menjadi merah pekat (solid `bg-red-600` dengan shadow dan icon spinner saat loading); serta mengimplementasikan `deleteServiceImageAction` agar menghapus file fisik di Supabase Storage saat tombol hapus ditekan, foto diganti, atau layanan dihapus permanen. Build lulus 100%.
- [2026-09-04] Unified Service Assets & Fallback Synchronization: Sinkronisasi katalog foto layanan antara CMS Admin dan Website Publik menggunakan koleksi aset lokal di `public/assets`. Mengimplementasikan `getServiceImageUrl` dan `getServiceFallbackImage` terpadu di `constants.ts`, mengganti preset Unsplash dengan aset brand resmi, menambahkan banner fallback dan indikator badge `A` di tabel admin, serta memastikan website publik selalu menampilkan foto valid (hasil upload CMS atau fallback aset otomatis). Build lolos 100% (13 routes).
- [2026-09-04] Multiline Input & Textarea UX Enhancement: Memperbaiki masalah pemotongan teks pada seluruh formulir CMS `/admin/settings`, dialog layanan, dan dialog booking. Menyesuaikan jumlah baris (`rows={3}` hingga `rows={6}`), menambahkan `min-h` proporsional, mengubah single-line input pada subjudul dan alamat kantor menjadi textarea yang lega, mengaktifkan `resize-y` pada seluruh textarea, serta menambahkan `leading-relaxed` agar teks panjang terbaca utuh dan tidak terpotong tepi bawah. Build lolos 100% (13 routes).
- [2026-09-05] shadcn/ui Chart Integration in Admin CMS Overview: Menjalankan `bunx --bun shadcn@latest add chart` untuk menambahkan primitives Chart resmi shadcn dan dependensi `recharts 3.8.0`. Mengonfigurasi token `--color-chart-1` s.d. `--color-chart-5` di `globals.css` dengan palet deep teal neutral dashboard. Mengembangkan Client Component `OverviewCharts` dengan 2 grafik interaktif: Tren Aktivitas Reservasi 6 bulan terakhir (AreaChart) dan Katalog vs Permintaan per Kategori Layanan (BarChart). Memperbarui panel sidebar kanan dengan ringkasan status booking (Confirmed, Completed, Pending, Cancelled). Build Next.js 16 lulus 100% (13 routes).
- [2026-09-05] Sidebar Smooth Transition & Chart Time-Range Filter: Menyelesaikan bug UI sidebar patah-patah/stutter dengan stabilisasi DOM node di `app-sidebar.tsx` dan penambahan `debounce={150}` pada `ResponsiveContainer` Recharts. Menginstal primitif `select.tsx` dari shadcn CLI dan mengintegrasikan filter dropdown rentang waktu (Seminggu Terakhir, Sebulan Terakhir, 6 Bulan Terakhir) pada grafik Tren Aktivitas Reservasi. Build lulus 100% (13 routes).
- [2026-09-05] Admin Sidebar Layout & Visual Restoration: Mengembalikan layout bersih, rapi, dan proporsional pada `app-sidebar.tsx`. Menghilangkan ruang kosong tinggi `h-14` saat collapsed, memulihkan padding dan perataan icon di tengah (`size-8`), merapikan kartu profil dan tombol keluar, serta mengeliminasi warning React controlled state `openProp`. Build lulus 100% (13 routes).
- [2026-09-05] Admin CMS Drawer & Calendar Date Picker Refactor (Phase 14): Menginstal komponen resmi `drawer`, `calendar` (`react-day-picker 10` & `date-fns 4`), dan `popover` via shadcn CLI. Mengubah form katalog layanan (`service-form-dialog.tsx`) dan form reservasi manual (`booking-form-dialog.tsx`) menjadi modern Right Slide-out Drawer (`swipeDirection="right"`). Menggantikan input tanggal native HTML menjadi Popover Calendar interaktif pada form booking. Mengonversi modal detail booking pada `bookings-table.tsx` menjadi Drawer yang rapi. Build lulus 100% (13 routes).
- [2026-09-05] Public Website DESIGN.md v2 Overhaul (Phase 15):
  - [x] Update Theme Tokens: Palet warna v2 didaftarkan di `globals.css` (`paper: #FAF9F4`, `sun: #FFF3C4`, `ink: #26241F`, `ocean: #0F5D66`, `foam: #ECEFEB`, `line: #E2DFD4`) dan `--radius: 0rem` (sudut siku 0px mutlak). Tema scoped `[data-theme="admin"]` dipertahankan utuh 100%. Tipografi geometric `Jost` dengan fallback Futura dipasang di `layout.tsx`.
  - [x] Instalasi Komponen Base shadcn via CLI: `textarea`, `aspect-ratio`, `accordion`, `avatar`, `sheet` diinstal tanpa menyentuh atau memodifikasi file primitives di `src/components/ui/**`.
  - [x] Standardisasi Stroke Global: Semua stroke 2px diubah menjadi 1px (`border`, `border-line`, `border-ink`), seluruh bingkai foto diubah ke 1px, shadow dihapus (`shadow-none`), dan seluruh icon Lucide menggunakan `strokeWidth={1.5}`.
  - [x] Bangun `/services` Sesuai Spec: Header split dengan tag `// LAYANAN`, judul 7xl, counter jumlah paket, dan daftar layanan editorial index list full-width (`[01] [Nama Layanan] [deskripsi 1 baris] [FROM Rp X] [ArrowUpRight]`) dengan hover `bg-sun`, serta filter kategori horizontal ribbon.
  - [x] Bangun `/services/[id]` Detail Page: Breadcrumb shadcn, header split 12 kolom (col-8: tag category `// ...` + title + description; col-4: sticky Card "FROM Rp X / unit" + tombol primary & WhatsApp), visual gallery grid 12 (foto utama col-span-8, 2 foto stack col-span-4), 2-col content (deskripsi/fasilitas/durasi dengan separator & sticky booking form di kanan), dan related services horizontal rows (bukan card grid).
  - [x] Revisi `/about`: Sticky split (kiri sticky tag `// TENTANG` + title + button; kanan narasi font-light + foto berbingkai 1px), stats row 4 angka dalam 1 baris dipisahkan `border-l border-line`, dan prinsip kerja bernomor (`01` s/d `04`).
  - [x] Revisi `/contact`: Split 12 (col-5: "Let's Talk" + index list channel WhatsApp, Email, Instagram, Office dengan hover `bg-sun`; col-7: contact form di atas `bg-foam` dengan `Label`, `Input`, `Textarea`, `Button`), serta Google Maps iframe dalam container 16/9 berbingkai 1px.
  - [x] Konsolidasi Halaman & Seksi About ke Beranda: Seksi About di beranda (`src/components/public/about-section.tsx`) ditingkatkan mengadopsi layout editorial v2 (sticky split dengan kolom kanan sticky yang mengikuti scroll tanpa `overflow-hidden`, 4 stats row, dan 4 prinsip kerja). Rute `/about` dialihkan otomatis ke `/#about`.
  - [x] Penyelarasan Urutan Menu Navigasi (Beranda, Compact Navbar, Footer):
    - Menyeragamkan seluruh menu navigasi publik menjadi 6 item terurut:
      1. Beranda (`/`)
      2. Tentang Kami (`/#about`)
      3. Katalog Layanan (`/services`)
      4. Ulasan & Testimoni (`/#testimonials`)
      5. Tanya Jawab (FAQ) (`/#faq`)
      6. Hubungi Kami (`/contact`)
    - Diterapkan secara identik pada:
      - Drawer menu Hero Beranda ([`hero-section.tsx`](file:///e:/codingan/doamandeh/src/components/public/hero-section.tsx))
      - Floating Compact Navbar subpage ([`public-header.tsx`](file:///e:/codingan/doamandeh/src/components/public/public-header.tsx))
      - Footbar / Footer ([`public-footer.tsx`](file:///e:/codingan/doamandeh/src/components/public/public-footer.tsx))
  - [x] Pembersihan Navbar & Drawer Menjadi Murni List Navigasi:
    - Menghapus kotak aksen editorial dan tombol aksi ganda dari drawer Beranda ([`hero-section.tsx`](file:///e:/codingan/doamandeh/src/components/public/hero-section.tsx)) dan Compact Navbar ([`public-header.tsx`](file:///e:/codingan/doamandeh/src/components/public/public-header.tsx)).
    - Kontainer navbar dan drawer kini murni hanya memuat 6 tautan menu navigasi:
      1. Beranda
      2. Tentang Kami
      3. Katalog Layanan
      4. Ulasan & Testimoni
      5. Tanya Jawab (FAQ)
      6. Hubungi Kami
  - [x] Penghapusan Logo Kotak "D" di Navbar:
    - Menghapus kotak logo huruf "D" pada header drawer Beranda ([`hero-section.tsx`](file:///e:/codingan/doamandeh/src/components/public/hero-section.tsx)) dan Compact Navbar ([`public-header.tsx`](file:///e:/codingan/doamandeh/src/components/public/public-header.tsx)).
    - Hanya menyisakan tipografi teks nama brand "Doamandeh" yang bersih dan proporsional.














