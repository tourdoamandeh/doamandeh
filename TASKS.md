# TASKS.md

> Status Phase 1–6B: DONE (fondasi, public, CMS, booking, polish, Phase 6B Editorial Bento UI)
> Sekarang masuk Phase 6C dan Phase 7 (integration).

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

- [x] Form booking dengan validasi Zod & Server Actions
- [x] Date picker & input tanggal reservasi
- [x] Loading, success, error state pada form booking
- [x] Notifikasi & pesan status booking
- [x] Konsistensi UI Editorial Bento (Instrument Serif + Soft Pastel Boxes + Body Pure White #FFFFFF)
- [x] Empty state & error handling yang informatif
- [x] Accessibility (alt text, aria-label, keyboard nav)

## Phase 7 — Integration & QA (Owner: All)

- [x] Merge semua rute & komponen
- [x] End-to-end test: user booking → admin lihat → admin confirm
- [x] End-to-end test: admin upload gambar → tampil di homepage
- [x] End-to-end test: admin ubah site settings → homepage update
- [x] `bun run build` (zero error & 100% pass)

## Log Perubahan

- [2026-09-02] Phase 1–5 selesai, masuk Phase 6.
- [2026-09-02] Phase 6A (CMS Advanced) selesai: Upload gambar Supabase Storage, Site Settings CMS, Service & Booking Management upgrade (filter, search, sort, detail modal, quick actions, custom dialogs, Zod validation).
- [2026-09-02] Admin Operations UI Redesign (ADMIN_UI.md): Implementasi tema operations tool Linear/Stripe style (Instrument Sans + JetBrains Mono, sidebar dark #101010, background #FAFAF9, table compact row h-11, status dot+text, deep teal #0F766E, zero AI slop, zero gradients/glassmorphism).
- [2026-09-02] Sidebar Admin shadcn Base: Implementasi penuh komponen sidebar shadcn (SidebarProvider, Sidebar collapsible icon, SidebarHeader brand Doamandeh, SidebarContent menu, SidebarFooter user & logout, SidebarTrigger di topbar) dengan theming murni via CSS variables di globals.css.
- [2026-09-02] Phase 6B (Public Website Upgrade) selesai: Homepage dinamis dari site_settings, Hero section support hero_image_url & gambar layanan dari Supabase Storage, Halaman About (/about), Halaman Contact (/contact) dengan Google Maps iframe, Testimoni section, FAQ accordion section, SEO metadata & OpenGraph, dynamic sitemap.xml & robots.txt, serta polish mobile navigation drawer.
- [2026-09-03] Redesain UI Publik ke Sistem Editorial Bento (DESIGN.md): Penggunaan Instrument Serif untuk judul & UI elements, soft borderless pastel cards (Light Blue, Soft Peach, Pale Yellow, Soft Pink), background body putih murni #FFFFFF, token warna Tailwind (@theme inline: tissue, black, lightblue, peach, yellow, softpink), Kopperfield floating scenery hero section dengan foto offline Bali (`/assets/hero-bali.svg`), serta penyelesaian seluruh task Phase 6C & QA build 100% zero error.
- [2026-09-03] Landing Page Complete Overhaul & Redesign Polish: Implementasi menyeluruh font Futura, penghapusan efek grayscale foto di seluruh seksi, perancangan carousel testimoni 6 kartu (#504139), penyempurnaan seksi FAQ compact pas 1 layar (gambar 02 hidden di mobile), pertipisan garis border seksi (#131718/15), tombol CTA ganda, footer bg #FFFFFF & kartu jam operasional #504139. Dokumentasi DEC-010 di DECISIONS.md dan penambahan 4 To-Do items di ISSUES.md.
- [2026-09-04] Landing Page Palette (#FFF6C6), Typography (New York/Playfair Display), Framer Motion & Photo Borders: Penggantian 100% warna #FFFFFF menjadi Krem #FFF6C6, pengaplikasian font Apple New York & Playfair Display, sistem animasi scroll FadeIn/FadeInStagger via framer-motion, perbaikan layout foto FAQ (items-stretch & object-top), standardisasi border-2 border-[#fff6c6], serta git merge & push ke main branch.


