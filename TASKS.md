# TASKS.md

> Status Phase 1–5: DONE (fondasi, public, CMS, booking, polish awal)
> Sekarang masuk Phase 6 (fitur lanjutan per role) dan Phase 7 (integration).

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

## Phase 6B — Public Website Upgrade (Owner: Mayang)

- [ ] Homepage dinamis dari site_settings
- [ ] Hero section dengan gambar dari Supabase Storage
- [ ] Halaman About
- [ ] Halaman Contact dengan map
- [ ] Testimoni section (data bisa dari Supabase)
- [ ] FAQ section
- [ ] SEO: meta tags, OG image, sitemap.xml
- [ ] Favicon & branding konsisten
- [ ] Mobile nav polish

## Phase 6C — Booking & UX Polish (Owner: Sahrul)

- [ ] Form booking dengan validasi zod
- [ ] Date picker yang proper (start_date, end_date)
- [ ] Loading, success, error state
- [ ] Notifikasi booking (toast)
- [ ] Konfirmasi booking via email (optional, pakai Supabase Edge Function)
- [ ] Konsistensi UI antar halaman
- [ ] Empty state & skeleton loading
- [ ] Accessibility (alt text, aria-label, keyboard nav)

## Phase 7 — Integration & QA (Owner: All)

- [ ] Merge semua branch ke main
- [ ] End-to-end test: user booking → admin lihat → admin confirm
- [ ] End-to-end test: admin upload gambar → tampil di homepage
- [ ] End-to-end test: admin ubah site settings → homepage update
- [ ] bun run build (zero error)
- [ ] Deploy ke Vercel
- [ ] Setup custom domain
- [ ] Setup monitoring (Sentry / Vercel Analytics)

## Log Perubahan

- [2026-09-02] Phase 1–5 selesai, masuk Phase 6.
- [2026-09-02] Phase 6A (CMS Advanced) selesai: Upload gambar Supabase Storage, Site Settings CMS, Service & Booking Management upgrade (filter, search, sort, detail modal, quick actions, custom dialogs, Zod validation).
