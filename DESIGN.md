# Frontend Design System - Travel Agency (Doamandeh)

Dokumen ini berisi panduan desain (*Design System*) resmi untuk pengembangan frontend website Doamandeh dengan gaya **Editorial Geometric Minimalist** (kotak siku tajam, sudut 0px, border foto 2px, tanpa shadow, font geometris bersih).

---

## 1. Palet Warna (Color Palette)

Gunakan kode HEX berikut untuk menjaga konsistensi tampilan di seluruh halaman website:

- **Soft Yellow (Background Utama & Aksen):** `#FFF6C6`
- **Soft Blue (Aksen Seksi & Card):** `#5F7A8E`
- **Brown (Warna Cokelat & Teks Primary):** `#504139`
- **Soft White (Krem / Off-White Card & Input):** `#E7E8DF`
- **Black (Charcoal Gelap / Text & Button):** `#2C2E31`

### Ringkasan Template Warna & Class Utility:
| Token Name | Kode HEX | Utility Class CSS / Tailwind | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Soft Yellow** | `#FFF6C6` | `bg-softyellow`, `text-softyellow`, `border-softyellow` | Background Utama Body, Section FAQ, Hero/CTA Details |
| **Soft Blue** | `#5F7A8E` | `bg-softblue`, `text-softblue`, `border-softblue` | Background Section About & Testimonials |
| **Brown** | `#504139` | `bg-brown`, `text-brown`, `border-brown` | Background Section FAQ & Services, Teks Title, Border Seksi |
| **Soft White** | `#E7E8DF` | `bg-softwhite`, `text-softwhite`, `border-softwhite` | Kartu Konten, Input Form, Pill Badges |
| **Black** | `#2C2E31` | `bg-black`, `text-black`, `border-black` | Teks Utama, Tombol Primary, Elemen Kontras Gelap |

> **DILARANG MENGGUNAKAN RAW HEX (`#xxxxxx`) DI DALAM COMPONENT TSX!**  
> Seluruh warna wajib dipanggil menggunakan nama template utility class di atas (misal: `bg-softyellow`, `text-brown`, `border-softblue`, dll).

---

## 2. Tipografi (Typography)

Sistem tipografi menggunakan **Futura** / **Geometric Sans-Serif**:

### Font Utama: Futura / Geometric Sans-Serif
- **Penggunaan:** Seluruh teks di website (Judul halaman, nama destinasi/layanan, menu navigasi, teks tombol, label, dan body text).
- **Karakteristik:** Bersih, geometris, modern, dan presisi.
- **Tips Casing & Weight:**
  - Gunakan ketebalan *Light* (`font-light`) atau *Regular* (`font-normal`) untuk paragraf dan deskripsi.
  - Gunakan ketebalan *Medium* (`font-medium`) atau *Bold* (`font-bold`) untuk judul dan tombol.
  - Gunakan huruf kapital (*uppercase*) pada tag/tagline (`// LAYANAN UNGGULAN`) dan menu navigasi.

---

## 3. Aturan Komponen UI (UI Components & Layout Rules)

### 1. Border Radius (Aturan Mutlak 0px)
- **TIDAK BOLEH ADA BORDER RADIUS SAMA SEKALI** (`border-radius: 0` / `rounded-none`).
- Seluruh elemen UI — termasuk card, bento box, tombol, input, dropdown, badge, modal, dan frame foto — wajib memiliki sudut siku-siku 90° yang tajam (`rounded-none`).

### 2. Bingkai Foto (Photo Borders)
- **Foto diberi border `2px`** (`border-2`).
- Setiap gambar dan foto (baik di About section, Testimonials, FAQ, maupun CTA section) wajib dibingkai dengan garis tepi tegas selebar `2px` (misalnya: `border-2 border-[#FFF6C6]` atau `border-2 border-[#504139]`).

### 3. Shadows & Flat Aesthetics
- **TIDAK ADA SHADOW SAMA SEKALI** (`box-shadow: none` / `shadow-none`).
- Desain murni bersifat datar (*flat aesthetic*), mengandalkan kontras warna yang tajam antara background `#FFF6C6`, `#5F7A8E`, `#504139`, `#E7E8DF`, dan `#2C2E31` serta garis tepi `border-2`.

### 4. Buttons (Tombol)
- **Primary Button:**
  - Background Color: `#504139` atau `#2C2E31`
  - Text Color: `#FFF6C6`
  - Font: **Futura**, Medium/Bold, Uppercase.
  - Border Radius: **Sudut Tajam `0px`** (`rounded-none`).
  - Shadow: None (`shadow-none`).
