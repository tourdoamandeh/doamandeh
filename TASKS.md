# TASKS.md

> Status Phase 1–5: DONE (fondasi, public, CMS, booking, polish awal)
> Sekarang masuk Phase 6 (fitur lanjutan per role) dan Phase 7 (integration).

## Phase 6A — CMS Advanced (Owner: Sultan)

- [ ] Upload gambar service ke Supabase Storage
  - [ ] Preview gambar di form
  - [ ] Validasi tipe & ukuran file
  - [ ] Simpan URL ke services.image_url
- [ ] Site Settings CMS
  - [ ] Tambah halaman /admin/settings
  - [ ] Key: hero_title, hero_subtitle, about_text, contact, sosmed
  - [ ] Homepage public baca dari site_settings
- [ ] Booking Management Upgrade
  - [ ] Filter by status (pending / confirmed / cancelled)
  - [ ] Filter by category
  - [ ] Search by nama/email/phone
  - [ ] Sort by newest
  - [ ] Detail booking modal/drawer
  - [ ] Quick action confirm/cancel
- [ ] Service Management Upgrade
  - [ ] Filter category
  - [ ] Search service
  - [ ] Toggle active/inactive
  - [ ] Delete confirmation dialog
  - [ ] Empty state
- [ ] Validasi & error handling admin forms

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

- [x] Form booking dengan validasi zod
- [x] Date picker yang proper (start_date, end_date)
- [x] Loading, success, error state
- [x] Notifikasi booking (toast)
- [x] Konfirmasi booking via email (optional, pakai Supabase Edge Function)
- [x] Konsistensi UI antar halaman
- [x] Empty state & skeleton loading
- [x] Accessibility (alt text, aria-label, keyboard nav)

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
- [2026-09-02] Phase 6C selesai: Peningkatan validasi Zod booking form, date range picker interaktif (start_date & end_date) dengan kalkulasi durasi dan total harga otomatis, sistem notifikasi toast mengambang, konfirmasi via WhatsApp + email summary, skeleton loading untuk services detail & category, perbaikan aksesibilitas (a11y: label, aria attributes, keyboard navigation), dan verifikasi build berhasil (`bun run build`).
