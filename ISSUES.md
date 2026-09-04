# ISSUES & NEXT TO-DO LIST

> Daftar item tugas dan evaluasi untuk sesi berikutnya.

## Outstanding To-Do Items

- [ ] **1. Perbaiki foto relate**
  - Perbarui aset foto pada seluruh seksi publik (Hero, About, Services, Testimonials, FAQ, CTA) dengan gambar destinasi, aktivitas wisata, dan lifestyle Bali yang lebih kontekstual, menarik, dan berkualitas tinggi sesuai 5 kategori layanan (Sewa Kendaraan, Tato, Villa, Surfing, Travel Tour).

---

## Completed Items

- [x] **Standardisasi UI Admin / CMS mengacu ke DESIGN.md**
  - Mengubah antarmuka Admin (`/admin/login`, `/admin/(dashboard)`, sidebar, header, services, bookings, settings) menjadi 100% konsisten dengan pedoman `DESIGN.md` (Editorial Geometric Minimalist, sudut siku 0px `rounded-none`, flat 2px solid border, tanpa shadow artifisial, palet krem `#FFF6C6` & cokelat tua `#504139`).
- [x] **Eliminasi Hardcoded Text & Integrasi Full Dynamic CMS**
  - Menghilangkan seluruh teks statis/hardcode di Hero section, About section, Services section, Testimonials list, FAQ items, CTA copy, Footer brand & jam operasional, serta menyediakan editor dinamis di CMS `/admin/settings`.
- [x] **Audit & Standardisasi DESIGN.md pada Seluruh Rute**
  - Menyeragamkan seluruh rute publik (`/`, `/about`, `/contact`, `/category/[slug]`) dan dashboard admin ke standar border `2px` dan `rounded-none` absolut.
- [x] **Perbaiki warna krem `#FFF6C6` global**
  - Mengganti seluruh penggunaan `#FFFFFF` / `bg-white` pada teks, icon, badge logo `D.`, dan box jam operasional menjadi warna krem `#FFF6C6`.
- [x] **Add motion (Scroll animations & Stagger reveal)**
  - Memasang `framer-motion` dan menerapkan komponen `FadeIn` / `FadeInStagger` di seluruh seksi landing page.
- [x] **Perbaikan layout foto FAQ**
  - Memperbaiki layout foto kanan FAQ dengan `items-stretch` dan `object-cover object-top` agar foto mengisi 100% tinggi tanpa melompat atau meninggalkan celah kosong.
- [x] **Standardisasi border foto**
  - Menyeragamkan bingkai foto carousel hero, tentang kami, ulasan pelanggan, dan CTA section menjadi `border-2 border-[#fff6c6]`.
- [x] **Verifikasi Build Next.js 16**
  - `bun run build` sukses 100% tanpa error TypeScript maupun linting pada seluruh 13 rute.
