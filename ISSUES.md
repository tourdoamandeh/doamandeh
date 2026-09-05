# ISSUES & NEXT TO-DO LIST

> Daftar item tugas dan evaluasi untuk sesi berikutnya.

## Outstanding To-Do Items

- [ ] **1. Perbaiki foto relate**
  - Perbarui aset foto pada seluruh seksi publik (Hero, About, Services, Testimonials, FAQ, CTA) dengan gambar destinasi, aktivitas wisata, dan lifestyle Bali yang lebih kontekstual, menarik, dan berkualitas tinggi sesuai 5 kategori layanan (Sewa Kendaraan, Tato, Villa, Surfing, Travel Tour).

---

## Completed Items

- [x] **Redesain Menyeluruh Website Publik Mengacu ke DESIGN.md v2 (Editorial Geometric Minimalist)**
  - Mengganti palet lama (brown + soft blue + cream) dengan token komplementer baru: `paper` (`#FAF9F4`), `sun` (`#FFF3C4`), `ink` (`#26241F`), `ocean` (`#0F5D66`), `foam` (`#ECEFEB`), dan `line` (`#E2DFD4`) tanpa menyentuh tema admin `[data-theme="admin"]`.
  - Menerapkan `--radius: 0rem` (`rounded-none` mutlak), menghapus seluruh shadow (`shadow-none`), mengganti seluruh border 2px ke 1px (`border-line`), serta menyetel icon Lucide ke `strokeWidth={1.5}`.
  - Membangun halaman `/services` sebagai index list editorial full-width dengan hover `bg-sun` dan navigasi filter ribbon.
  - Membangun halaman detail `/services/[id]` dengan breadcrumb shadcn, header 12 kolom split, visual gallery (8+4 stack), 2 kolom content split dengan sticky booking form, dan related services horizontal rows bergaris tipis.
  - Merevisi `/about` menjadi sticky split dengan 4 stats dalam 1 baris dipisah `border-l border-line`, serta daftar nilai bernomor `01-04`.
  - Merevisi `/contact` menjadi split 12 kolom dengan index list channel dan formulir di atas `bg-foam`.
  - Menyelaraskan `/category/[slug]` dan seluruh seksi landing page (`hero`, `about`, `services`, `testimonials`, `faq`, `cta`) ke standar 1px flat geometric.

- [x] **Perbaikan Pemotongan Teks pada Formulir Pengaturan CMS & Admin (`/admin/settings`)**
  - Mengatasi teks yang terpotong vertikal dan horizontal pada formulir CMS dan modal dialog:
    - Seluruh kutipan foto (`hero_slide_*_quote`) dan deskripsi banner kategori pada seksi Hero ditingkatkan dari `rows={2}` ke `rows={4}` dengan `min-h-[92px]`, sehingga teks kutipan 3-4 baris (misal *"Biar kami yang merencanakan..."*) tampil utuh tanpa terpotong di tepi bawah.
    - Mengubah single-line input pada `hero_subtitle` dan `contact_address` menjadi `textarea` yang lega agar narasi panjang dan alamat lengkap tidak terpotong horizontal.
    - Menyesuaikan `rows={3}` hingga `rows={6}` pada `about_title`, `about_text`, `services_title`, `services_subtitle`, `cta_title`, `cta_subtitle`, komentar ulasan testimoni, pertanyaan & jawaban FAQ, serta deskripsi brand footer.
    - Mengganti `resize-none` dengan `resize-y` dan menambahkan `leading-relaxed` serta padding `py-2.5` di seluruh textarea CMS dan modal dialog (`service-form-dialog`, `booking-form-dialog`, `booking-form`), memungkinkan admin memperluas area ketik secara fleksibel.
  - Verifikasi build Next.js 16 (`bun run build`) sukses 100% tanpa error pada seluruh 13 rute.

- [x] **Sinkronisasi Katalog Foto Layanan (CMS & Web Publik) dengan Aset Lokal `public/assets`**
  - Mengintegrasikan seluruh aset resmi di `public/assets` (`service-vehicle.jpg`, `service-tattoo.jpg`, `service-villa.jpg`, `service-travel.jpg`, `service-surfing.png`, dan ilustrasi vektor) ke dalam CMS dan Website Publik.
  - Menghilangkan hardcoded foto pada seksi publik: `services-section.tsx`, `services/[id]/page.tsx`, dan `category/[slug]/page.tsx` kini memprioritaskan foto yang diunggah di CMS, dan jika belum ada foto khusus yang diunggah, otomatis fallback ke aset resmi di `public/assets`.
  - Mengganti preset Unsplash di `service-form-dialog.tsx` dengan koleksi aset resmi `SERVICE_PRESET_IMAGES` (`/assets/...`) serta menambahkan banner informatif fallback foto bawaan ketika belum ada foto diunggah.
  - Menampilkan thumbnail tabel admin `services-table.tsx` menggunakan `getServiceImageUrl(service)` dengan badge `A` (Auto/Asset) jika menggunakan foto bawaan sehingga admin dapat langsung memverifikasi visual tampilan layanan.
  - Menyiapkan helper terpadu `getServiceFallbackImage` dan `getServiceImageUrl` di `src/lib/constants.ts` sebagai single source of truth.
  - Verifikasi build Next.js 16 (`bun run build`) sukses 100% tanpa error pada seluruh 13 rute.

- [x] **Perbaikan Form Layanan: Tombol 'Ganti' & Tombol 'Delete' Foto Storage**
  - Memperbaiki tombol 'Ganti' foto: Memindahkan elemen hidden `<input type="file" ref={fileInputRef} />` agar selalu ter-mount di DOM (sebelumnya terbungkus kondisi `!activeDisplayImage` sehingga saat foto sudah ada, `fileInputRef.current` bernilai `null` dan tombol tidak bisa diklik).
  - Memperbaiki tampilan tombol Delete foto: Mengubah class dari `variant="destructive"` (yang transparan 10% opacity) menjadi solid opaque `bg-red-600 hover:bg-red-700 text-white shadow-md border-0` sehingga terlihat jelas dan pekat di atas foto.
  - Menambahkan integrasi penghapusan file Supabase Storage: Mengimplementasikan `deleteServiceImageAction` pada saat tombol trash ditekan (langsung menghapus file fisik di storage Supabase dan menyetel kolom `image_url: null` di database), saat foto diganti dengan foto baru, serta saat layanan dihapus permanen dari sistem.
- [x] **Penyempurnaan Sidebar: Jarak Tooltip & Pembersihan Elemen Redundan**
  - Meningkatkan offset tooltip sidebar dari `12px` ke `22px` (`sideOffset={22}`), memberikan ruang mengambang yang lega dan estetis sehingga tooltip tidak lagi menempel atau menyentuh garis batas sidebar.
  - Menghilangkan icon logo kotak "D" pada sidebar (menggunakan header tipografi bersih "Doamandeh Admin Operations" pada mode expanded, dan membiarkan nav items langsung mulai dari atas saat collapsed).
  - Menghilangkan link navigasi "Website Publik" dari sidebar footer (karena sudah tersedia dan lebih mudah diakses pada topbar header).
- [x] **Perbaikan Bug UI: Form Modal Transparan & Sidebar Collapsed Icon/Tooltip**
  - Mendaftarkan seluruh token warna shadcn (`--color-card`, `--color-popover`, `--color-primary`, `--color-border`, `--color-sidebar-*`, dsb.) ke dalam `@theme inline` di `globals.css` Tailwind CSS v4, sehingga utility class seperti `bg-card` dan `bg-popover` ter-compile sempurna ke warna solid hex (`#ffffff`).
  - Menambahkan explicit background `bg-white dark:bg-zinc-950 bg-card` dan elevasi `shadow-2xl` pada container modal formulir (`service-form-dialog`, `booking-form-dialog`, modal detail reservasi, dan modal konfirmasi hapus) agar 100% solid dan tidak tembus pandang ke tabel/halaman di belakangnya.
  - Memperbaiki perhitungan dimensi sidebar saat status `collapsed`: meniadakan padding horizontal `px-0` pada `SidebarContent` dan menyelaraskan `SidebarMenuButton` ke ukuran `size-8` (32px) dengan centering presisi sehingga tidak lagi terpotong/truncated di tepi kiri.
  - Menghapus class override `bg-card text-foreground` pada `TooltipContent` sidebar, mengembalikan rendering native shadcn `bg-foreground text-background` (warna dark `#171717` solid dengan teks putih kontras dan arrow serasi) sehingga tooltip 100% solid dan tidak transparan.
- [x] **Pemisahan Dual Theme Architecture (Public Brand vs Neutral Admin CMS)**
  - Menerapkan theme scoping via CSS variables `[data-theme="admin"]` di `globals.css` dan client component `AdminTheme` pada tag `<html>`.
  - Mengisolasi antarmuka admin `/admin` ke standar operations tool linear/shadcn (`ADMIN_UI.md`) tanpa merusak atau membocorkan desain brand website publik (`DESIGN.md`).
  - Menghapus seluruh class brand publik di admin dan mempertahankan integritas komponen primitives shadcn (`src/components/ui/**`).
  - Lolos uji TypeScript dan verifikasi build `bun run build` 100% bebas error.
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
