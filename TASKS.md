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

