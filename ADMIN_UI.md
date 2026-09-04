# ADMIN_UI.md

> Dashboard admin = operations tool. Dense, jelas, cepat.
> BUKAN landing page. BUKAN template. BUKAN showcase.

## Anti-AI Slop Rules

### DILARANG KERAS

- Gradient ungu/biru/pink di mana pun (heading, button, card, background)
- Glassmorphism / backdrop-blur / blur-md
- `rounded-2xl`, `rounded-3xl`, `rounded-full` (kecuali avatar)
- Emoji sebagai icon
- 4 stat card identik dengan icon di lingkaran berwarna
- Lorem ipsum / "Sample text" / placeholder content
- Shadow `shadow-lg`, `shadow-xl`, `shadow-2xl` (pakai border tipis)
- Tailwind blue default (`bg-blue-500`, `text-blue-600`)
- Icon dalam lingkaran berwarna (`bg-blue-100 text-blue-600 rounded-full p-2`)
- Badge dengan gradient atau shadow
- Animasi bounce/pulse/spin yang nggak perlu
- Background pattern / texture

### WAJIB DILAKUKAN

- Gunakan semantic color dari token
- Icon inline tanpa wrapper lingkaran
- Border tipis (`border border-border`) daripada shadow
- Empty state yang informative, bukan cuma icon besar
- Skeleton loading yang presisi (width/height sesuai konten)
- Spacing konsisten pakai spacing scale

---

## Dual Theme Architecture

Project ini memisahkan 2 dunia UI menggunakan **CSS Variable Theme Scoping**:

### 1. Scope Pemisahan
- **Public Website (`/` dan rute publik)**: Menggunakan token brand client pada `:root` di `globals.css` (warna krem `#FFF6C6`, font display Futura, sudut siku editorial `rounded-none`).
- **Admin CMS (`/admin`)**: Menggunakan neutral shadcn dashboard scoped via attribute `[data-theme="admin"]` pada tag `<html>` (warna background warm off-white `#fafaf9`, surface `#ffffff`, primary teal `#0f766e`, font `Instrument Sans` & `JetBrains Mono`).

### 2. Route-Based Theme Sync (`admin-theme.tsx`)
- Komponen client `AdminTheme` dipasang di root `src/app/admin/layout.tsx`.
- Saat memasuki rute `/admin`, `AdminTheme` menyetel `document.documentElement.setAttribute("data-theme", "admin")`.
- Karena atribut terpasang pada elemen root `<html>`, seluruh portal React (Dialog, Sheet, Select, DropdownMenu, Tooltip) yang dirender ke `document.body` secara otomatis mewarisi token admin tanpa bocor.
- Saat navigasi berpindah dari admin kembali ke website publik, cleanup effect menghapus atribut `data-theme`, sehingga `:root` brand kembali aktif tanpa kebocoran style.

### 3. Aturan Scoping & Larangan Campur Class
- **src/components/ui/**: Primitives shadcn murni, TIDAK BOLEH diubah (`git diff` wajib kosong).
- **src/components/admin/**: Komponen dan wrapper khusus dashboard admin.
- **src/components/public/**: Komponen dan hero khusus brand publik.
- **Halaman Admin HANYA boleh menggunakan**:
  - Primitives dari `components/ui`
  - Wrapper/komponen dari `components/admin`
  - Semantic tokens: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, dsb.
- **DILARANG KERAS di Admin**:
  - Menggunakan utility class brand publik (`bg-softyellow`, `bg-brown`, `text-brown`, `border-brown`, `bg-softwhite`, dsb.)
  - Menggunakan border tebal `border-2 border-brown` atau `rounded-none` bawaan publik
  - Menduplikasi/forking komponen Button/Card versi "khusus admin"
  - Hardcode warna hex di JSX

---

## Design Tokens

### Font

```css
--font-sans: "Instrument Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

Aturan:

- Body text: `font-sans`
- Angka, ID, tanggal, timestamp: `font-mono` + `tabular-nums`
- Jangan pernah pakai `font-display` atau `font-serif`

### Color Palette

```css
/* Background & Surface */
--background: #fafaf9; /* warm off-white, page bg */
--foreground: #171717; /* primary text */
--surface: #ffffff; /* card, modal bg */
--muted: #f5f5f4; /* muted bg, hover state */
--muted-foreground: #737373; /* secondary text */

/* Accent */
--primary: #0f766e; /* deep teal, CTA */
--primary-foreground: #ffffff;
--primary-hover: #0d655f; /* darker teal */

/* Status */
--success: #16a34a;
--success-bg: #f0fdf4;
--warning: #d97706;
--warning-bg: #fffbeb;
--danger: #dc2626;
--danger-bg: #fef2f2;
--info: #2563eb;
--info-bg: #eff6ff;

/* Border & Structure */
--border: #e7e5e4; /* stone-200 */
--border-strong: #d6d3d1; /* stone-300, active/hover */
--ring: #0f766e; /* focus ring */

/* Sidebar (dark theme) */
--sidebar: #101010;
--sidebar-foreground: #a3a3a3;
--sidebar-accent: #1f1f1f;
--sidebar-accent-foreground: #ffffff;
--sidebar-border: #262626;
--sidebar-ring: #0f766e;
```

Aturan:

- JANGAN hardcode hex di komponen
- Pakai semantic token: `bg-primary`, `text-muted-foreground`
- Status: pakai combo `text-success bg-success-bg`, bukan cuma `text-green-600`

### Spacing Scale

```css
--radius-sm: 4px; /* small elements: badge, tag */
--radius: 8px; /* default: card, button, input */
--radius-lg: 12px; /* modal, large card */
```

Aturan:

- **DILARANG** `rounded-2xl` (16px), `rounded-3xl` (24px), `rounded-full`
- Button: `rounded` (8px)
- Card: `rounded-lg` (12px)
- Badge/Tag: `rounded-sm` (4px)
- Avatar: `rounded-full` (satu-satunya pengecualian)

### Typography Scale

```css
/* Body */
--text-xs: 12px;
--text-sm: 14px; /* default body */
--text-base: 16px;

/* Heading */
--text-lg: 18px; /* h3 */
--text-xl: 20px; /* h2 */
--text-2xl: 24px; /* h1, page title */
--text-3xl: 30px; /* hero (jangan dipakai di admin) */
```

Aturan:

- Page title: `text-2xl font-semibold`
- Section heading: `text-lg font-semibold`
- Body: `text-sm` (14px)
- Caption/label: `text-xs text-muted-foreground`
- Angka besar (KPI): `text-3xl font-mono tabular-nums`

---

## Komponen

### Button

```tsx
// Primary
<Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
  Simpan
</Button>

// Secondary
<Button variant="outline">
  Batal
</Button>

// Danger
<Button variant="destructive">
  Hapus
</Button>
```

Aturan:

- Primary CTA: solid teal, hover darker
- Secondary: outline, bukan ghost
- Danger: red solid untuk destructive action
- JANGAN pakai icon button tanpa tooltip
- JANGAN pakai gradient button

### Card

```tsx
<Card className="bg-surface border-border shadow-none">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Title</CardTitle>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

Aturan:

- `shadow-none`, pakai `border`
- Padding: `p-6` (default), `p-4` (compact)
- JANGAN pakai `backdrop-blur`, `bg-gradient`

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow className="bg-muted/50">
      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
        Name
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="h-11">
      <TableCell>Content</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Aturan:

- Row height: `h-11` (compact)
- Header: `text-xs uppercase tracking-wide text-muted-foreground`
- Header background: `bg-muted/50`
- JANGAN pakai zebra stripe, pakai hover state
- JANGAN pakai border antar row, pakai `divide-y divide-border`

### Status Badge

```tsx
// Correct: dot + text
<span className="flex items-center gap-2 text-sm">
  <span className="size-2 rounded-full bg-success" />
  <span className="text-success">Active</span>
</span>

// Wrong: full pill
<Badge className="bg-green-100 text-green-800">Active</Badge>
```

Aturan:

- Status pakai dot indicator, bukan full pill
- Dot: `size-2 rounded-full bg-{status}`
- Text: `text-{status}` (jangan `text-green-800`)
- JANGAN pakai gradient badge

### Empty State

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="size-12 rounded-lg bg-muted flex items-center justify-center mb-4">
    <Package className="size-6 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold mb-1">No services found</h3>
  <p className="text-sm text-muted-foreground mb-4">
    Get started by creating your first service.
  </p>
  <Button>
    <Plus className="size-4 mr-2" />
    Add Service
  </Button>
</div>
```

Aturan:

- Icon dalam kotak `bg-muted`, bukan circle berwarna
- 1 kalimat deskripsi yang actionable
- CTA button jelas
- JANGAN pakai ilustrasi SVG besar
- JANGAN pakai animasi bouncing

### KPI Card

```tsx
<Card className="p-6">
  <div className="flex items-baseline justify-between mb-2">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      Total Revenue
    </span>
    <span className="text-xs text-success">+12%</span>
  </div>
  <div className="text-3xl font-mono tabular-nums">Rp 45,231,890</div>
</Card>
```

Aturan:

- Label: `text-xs uppercase tracking-wide text-muted-foreground`
- Angka: `text-3xl font-mono tabular-nums`
- Delta: `text-xs text-success` (inline, bukan badge)
- JANGAN pakai icon dalam lingkaran
- JANGAN pakai gradient background

### Form Input

```tsx
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter service name" />
  <p className="text-xs text-muted-foreground">
    This will be displayed to customers.
  </p>
</div>
```

Aturan:

- Label: `font-medium text-sm`
- Spacing: `space-y-2` (8px)
- Helper text: `text-xs text-muted-foreground`
- Error: `text-xs text-destructive`
- JANGAN pakai label dengan icon

---

## Layout Admin

### Sidebar

Referensi: https://ui.shadcn.com/docs/components/base/sidebar

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <div className="flex items-center gap-2">
        <div className="size-8 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold">D</span>
        </div>
        <span className="font-semibold">Doamandeh</span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User className="size-4" />
                <span>{user.email}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>

  <SidebarInset>{/* content */}</SidebarInset>
</SidebarProvider>
```

Aturan:

- Sidebar dark (`bg-sidebar`)
- Logo: kotak `bg-primary` dengan inisial, bukan image
- Menu icon: `size-4`, inline tanpa wrapper
- Active state: `bg-sidebar-accent text-sidebar-accent-foreground`
- JANGAN pakai emoji sebagai menu icon
- JANGAN pakai badge di menu (kecuali urgent notification)

### Topbar

```tsx
<header className="sticky top-0 z-10 bg-surface border-b border-border">
  <div className="flex items-center gap-4 px-6 h-14">
    <SidebarTrigger />

    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Services</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div className="ml-auto flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9 w-64"
          onKeyDown={(e) => e.key === "k" && e.metaKey && focusSearch()}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-mono bg-muted rounded">
          ⌘K
        </kbd>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="size-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>
```

Aturan:

- Height: `h-14` (56px)
- Search: `w-64`, dengan `⌘K` shortcut indicator
- Avatar: `rounded-full` (satu-satunya pengecualian rounded-full)
- JANGAN pakai notification badge di avatar

### Content Area

```tsx
<main className="flex-1 overflow-y-auto">
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your services and pricing
        </p>
      </div>

      <Button>
        <Plus className="size-4 mr-2" />
        Add Service
      </Button>
    </div>

    {/* toolbar + content */}
  </div>
</main>
```

Aturan:

- Max width: `max-w-7xl` (1280px)
- Padding: `px-6 py-8`
- Page title: `text-2xl font-semibold`
- Subtitle: `text-sm text-muted-foreground`
- CTA button di kanan atas

### Toolbar

```tsx
<div className="flex items-center gap-4 mb-6">
  <div className="relative flex-1 max-w-sm">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input placeholder="Search services..." className="pl-9" />
  </div>

  <Select>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Categories</SelectItem>
      <SelectItem value="vehicle-rental">Vehicle Rental</SelectItem>
      <SelectItem value="tattoo">Tattoo</SelectItem>
    </SelectContent>
  </Select>

  <Button variant="outline" size="icon">
    <Filter className="size-4" />
  </Button>
</div>
```

Aturan:

- Search: `flex-1 max-w-sm`
- Filter: `w-40` untuk select
- Icon button: `size="icon"` tanpa label
- JANGAN pakai dropdown filter kompleks di toolbar

---

## Checklist Anti-AI Slop

Sebelum commit, cek:

- [ ] Tidak ada gradient di mana pun
- [ ] Tidak ada backdrop-blur / glassmorphism
- [ ] Tidak ada rounded-2xl / rounded-3xl (kecuali avatar)
- [ ] Tidak ada emoji sebagai icon
- [ ] Tidak ada stat card dengan icon di lingkaran berwarna
- [ ] Tidak ada Lorem ipsum / placeholder
- [ ] Tidak ada shadow-lg / shadow-xl
- [ ] Tidak ada Tailwind blue default
- [ ] Tidak ada icon dalam lingkaran berwarna
- [ ] Tidak ada badge dengan gradient
- [ ] Tidak ada animasi bounce/pulse/spin yang nggak perlu
- [ ] Tidak ada background pattern / texture
- [ ] Semua warna pakai semantic token
- [ ] Semua angka pakai font-mono + tabular-nums
- [ ] Semua status pakai dot indicator, bukan full pill
- [ ] Empty state informative, bukan cuma icon besar
- [ ] Skeleton loading presisi, bukan spinner menyebar
- [ ] Spacing konsisten pakai spacing scale
- [ ] Typography scale diikuti
- [ ] Border dipakai lebih dari shadow

Kalau ada yang nggak lolos checklist, refactor dulu sebelum commit.

---

## Do This, Not That

### ✅ DO

```tsx
// Status dengan dot
<span className="flex items-center gap-2 text-sm">
  <span className="size-2 rounded-full bg-success" />
  <span className="text-success">Active</span>
</span>

// KPI card clean
<Card className="p-6">
  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
    Revenue
  </p>
  <p className="text-3xl font-mono tabular-nums">Rp 45M</p>
</Card>

// Table compact
<TableRow className="h-11">
  <TableCell className="font-medium">Service Name</TableCell>
</TableRow>
```

### ❌ DON'T

```tsx
// Badge full pill
<Badge className="bg-green-100 text-green-800">Active</Badge>

// KPI dengan icon lingkaran
<Card className="p-6">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-blue-100 rounded-full">
      <DollarSign className="size-6 text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Revenue</p>
      <p className="text-2xl font-bold">Rp 45M</p>
    </div>
  </div>
</Card>

// Table dengan shadow
<Card className="shadow-lg">
  <Table>
    <TableRow className="h-16">
      <TableCell>Content</TableCell>
    </TableRow>
  </Table>
</Card>
```

---

## File Rules

### JANGAN DIUBAH

- `src/components/ui/**` = primitives shadcn, generated, jangan disentuh
- `src/components/ui/sidebar.tsx` = dari shadcn docs, jangan diubah

### BOLEH DIUBAH

- `src/components/admin/**` = wrapper/komponen khusus admin
- `src/app/admin/**` = halaman admin
- `src/lib/actions/admin/**` = server actions untuk admin

### WAJIB DIUPDATE

- `ADMIN_UI.md` = kalau ada perubahan design decision
- `TASKS.md` = setelah selesai task
- `ISSUES.md` = kalau ada bug/todo

---

## Referensi Visual

### Dashboard yang BENAR

- Linear.app → clean, dense, no-nonsense
- Stripe Dashboard → professional, consistent
- Vercel Dashboard → minimal, fast
- Supabase Dashboard → functional, clear

### Dashboard yang SALAH (AI slop)

- Template admin dari ThemeForest dengan gradient card
- Dashboard dengan 4 stat card identik icon lingkaran
- Landing page yang dibikin jadi admin panel
- Design yang terlalu "playful" untuk operations tool

---

## Final Rule

**Kalau ragu, cek Linear.app dashboard.**

Kalau desain lu nggak sebersih Linear, berarti masih ada yang salah.

Admin dashboard = alat kerja, bukan karya seni.
