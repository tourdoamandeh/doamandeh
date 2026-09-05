# DESIGN.md — Public Website Doamandeh

Style: Editorial Geometric Minimalist v2
Kotak siku tajam (0px), stroke 1px, tanpa shadow, font geometris.
Berlaku HANYA untuk public website. Admin pakai ADMIN_UI.md.

## 1. Palet Warna (Revisi)

Alasan revisi: kombinasi brown + soft blue + cream sebelumnya muddy.
Palet baru: warm neutral + deep teal + signature yellow (komplementer, harmonis).

| Token | HEX     | Utility               | Penggunaan                                     |
| ----- | ------- | --------------------- | ---------------------------------------------- |
| paper | #FAF9F4 | bg-paper / text-paper | Background utama body                          |
| sun   | #FFF3C4 | bg-sun / text-sun     | Aksen signature: hero block, tag, hover state  |
| ink   | #26241F | bg-ink / text-ink     | Teks utama, tombol primary, footer             |
| ocean | #0F5D66 | bg-ocean / text-ocean | Link, interactive, active, section gelap kedua |
| foam  | #ECEFEB | bg-foam               | Card, input, section sekunder                  |
| line  | #E2DFD4 | border-line           | Semua border & divider (1px)                   |

Aturan:

- DILARANG raw hex di TSX. Wajib pakai utility token.
- Rasio pemakaian: 60% paper, 25% foam/ink, 10% ocean, 5% sun.
- `sun` hanya untuk aksen/hover/tag — bukan background full section.
- Section gelap pakai `ink`, bukan hitam pekat.

## 2. Stroke & Bentuk (Revisi)

- Border radius: 0px MUTLAK (`rounded-none`) semua elemen.
  Set `--radius: 0rem` di theme supaya komponen shadcn ikut siku.
- Stroke: 1px (`border`) untuk card, input, divider. (Sebelumnya 2px)
- Bingkai foto: 1px `border-line` atau `border-ink`. (Sebelumnya 2px)
- Shadow: TIDAK ADA (`shadow-none`). Flat aesthetic.
- Icon lucide: `strokeWidth={1.5}` (tipis, presisi).

## 3. Tipografi

- Font: "Jost" (geometric, Futura-like) → fallback Futura, sans-serif.
- Tag/label/nav/tombol: uppercase + tracking-widest + text-xs.
- Prefix tag editorial: `// LAYANAN`, `// TENTANG`, `// KONTAK`.
- Body: font-light / font-normal.
- Judul halaman: text-5xl s/d text-7xl, font-medium, tracking-tight.
- Angka besar (stats): font-medium, text-4xl+.

## 4. Komponen shadcn Wajib

Semua UI wajib compose dari shadcn (install via CLI jika belum ada):
Button, Card, Badge, Separator, Input, Textarea, Label, Select,
Breadcrumb, AspectRatio, Accordion, Sheet, Avatar.

- Jangan tulis ulang komponen yang ada di registry.
- Jangan edit src/components/ui/\*\*.
- Custom layout boleh, tapi base component dari shadcn.

## 5. Spesifikasi Halaman

### /services — index list, BUKAN grid card identik

1. Header split:
   - Kiri: tag `// LAYANAN` + judul "Services" text-6xl/7xl.
   - Kanan: deskripsi singkat + jumlah layanan (angka besar).
2. Daftar layanan = row editorial full-width, dipisah `Separator` / border-t border-line:
   [01] [Nama layanan besar] [deskripsi 1 baris] [from Rp X] [ArrowUpRight]
3. Hover row: bg-sun, arrow geser kanan.
4. Badge category kecil (rounded-none) di bawah nama.
5. DILARANG: grid 3-5 card identik dengan icon di tengah.

### /services/[slug] — detail

1. Breadcrumb (shadcn) di atas.
2. Header split 12 kolom:
   - col-8: tag category + judul besar + deskripsi.
   - col-4: Card sticky (border-line, rounded-none, shadow-none):
     "FROM Rp X / unit", Separator, Button primary (bg-ink text-paper),
     Button outline (WhatsApp).
3. Galeri: grid 12 → foto utama col-span-8, 2 foto col-span-4 stack.
   Semua foto border border-line, rounded-none, AspectRatio 4/3 & 1/1.
4. Konten 2 kolom:
   - Kiri: section "Deskripsi / Termasuk / Durasi / Meeting point",
     dipisah Separator, judul section uppercase text-xs.
   - Kanan: Card form booking sticky (Input, Select, Textarea, Button).
5. Related services: row horizontal kecil (foto + nama + harga),
   border-t/b border-line. BUKAN card grid.

### /about (revisi)

1. Split: kiri sticky (tag `// TENTANG` + judul besar),
   kanan: 2 paragraf font-light + foto border 1px.
2. Stats row: 4 angka besar dalam 1 baris,
   dipisah border-l border-line — BUKAN card, BUKAN icon lingkaran.
3. Nilai/cara kerja: index list bernomor (01/02/03) dengan Separator.

### /contact (revisi)

1. Split 12:
   - col-5: judul "Let's Talk" + index list channel:
     EMAIL / WHATSAPP / INSTAGRAM / OFFICE — tiap row border-t,
     label uppercase text-xs + value + ArrowUpRight, hover bg-sun.
   - col-7: form di atas bg-foam p-8 (Label, Input, Textarea, Button).
     Tanpa Card shadow, tanpa rounded.
2. Map (opsional): AspectRatio 16/9, iframe, border border-line.

## 6. Checklist Anti-AI Slop (Public)

- [ ] Tidak ada hero centered (judul+sub+CTA di tengah)
- [ ] Tidak ada grid card identik 3-6 kolom
- [ ] Tidak ada gradient text / gradient background
- [ ] Tidak ada emoji sebagai icon
- [ ] Tidak ada rounded-2xl / glassmorphism / shadow
- [ ] Tidak ada raw hex di TSX
- [ ] Semua foto: rounded-none + border 1px
- [ ] Semua stroke 1px (bukan 2px)
- [ ] Tag pakai prefix `//` + uppercase
- [ ] Semua komponen base dari shadcn

Referensi vibe: editorial studio sites, arsitek portfolio,
Linear-style clarity tapi warm. BUKAN template travel ThemeForest.
