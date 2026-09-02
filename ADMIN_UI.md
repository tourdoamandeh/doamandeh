# UI_GUIDELINES.md

## Prinsip

Admin dashboard = operations tool. Dense, jelas, cepat.
Bukan landing page. Bukan template.

## Larangan keras (AI slop)

- Gradient ungu/biru di heading, button, atau card
- Glassmorphism / backdrop-blur di card
- rounded-2xl / rounded-3xl di semua elemen
- Emoji sebagai icon
- 4 stat card identik dengan icon di lingkaran berwarna
- Lorem ipsum / placeholder text
- Shadow berlebihan (pakai border tipis saja)
- Tailwind blue default sebagai primary

## Design tokens

- Font UI: "Instrument Sans"
- Font angka / ID / tanggal: "JetBrains Mono"
- Background: #FAFAF9 (warm off-white)
- Surface: #FFFFFF
- Ink: #171717
- Sidebar: #101010 (dark), text #A3A3A3
- Primary: #0F766E (deep teal)
- Warning: #D97706
- Danger: #DC2626
- Success: #16A34A
- Radius max: 8px (rounded-lg)
- Border: 1px #E7E5E4
- Shadow: minimal, prioritaskan border

## Komponen

- Table: compact (row h-11), header uppercase 11px tracking-wide muted
- Status: dot + text, bukan pill warna penuh
- Button primary: solid teal, hover darker
- Angka: tabular-nums + font mono
- Empty state: icon lucide + 1 kalimat + action button
- Loading: skeleton, bukan spinner menyebar

## Layout admin

- Sidebar kiri fixed, dark, 240px, logo Doamandeh
- Topbar: breadcrumb + search (⌘K) + avatar menu
- Content: max-w-7xl, padding 24–32px
- KPI row: angka besar mono, label kecil, delta kecil (tanpa icon lingkaran)
- Setiap tabel punya toolbar: search + filter + action
