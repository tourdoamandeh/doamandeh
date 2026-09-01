<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md

## Project

Website travel agent: Doamandeh tours and travel.

## Stack Wajib

- Next.js App Router
- TypeScript
- Bun
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Database
- @supabase/ssr

## Jangan

- Jangan gunakan CMS eksternal dulu.
- Jangan install library baru kecuali benar-benar dibutuhkan.
- Jangan pakai mock data jika fitur seharusnya sudah connected ke Supabase.
- Jangan hardcode data layanan di halaman public.
- Jangan ubah struktur database tanpa konfirmasi.
- Jangan expose service role key ke client.
- Jangan melemahkan RLS Supabase.
- Jangan buat halaman berlebihan yang tidak diminta.
- Jangan refactor besar kalau tidak diminta.
- Jangan ubah file yang tidak berhubungan dengan task aktif.

## Aturan Coding

- Gunakan server component untuk read data.
- Gunakan server actions untuk mutation.
- Gunakan shadcn/ui untuk komponen admin.
- Validasi form pakai zod.
- Semua query Supabase harus error handling.
- Gunakan category slug:
  - vehicle-rental
  - tattoo
  - villa
  - travel
  - surfing-lesson

## Workflow Agent

1. Baca AGENTS.md, CLIENT_DATA.md, TASKS.md.
2. Kerjakan hanya task yang aktif.
3. Jika ada keputusan teknis penting, catat di DECISIONS.md.
4. Setelah selesai, update TASKS.md.
5. Jika ada bug atau todo lanjutan, tulis di ISSUES.md.

## Definition of Done

- Fitur bisa dijalankan lokal.
- Data tampil dari Supabase.
- Admin route terproteksi.
- Tidak ada error fatal saat build.
- TASKS.md sudah di-update.

## Team Ownership

### Shared / jangan diubah sembarangan

- src/lib/supabase/\*\*
- src/types/\*\*
- src/components/ui/\*\*
- schema database
- package.json
- bun.lockb

### CMS Owner

- src/app/admin/\*\*
- src/components/admin/\*\*
- src/lib/actions/admin/\*\*

### Public Website Owner

- src/app/(public)/\*\*
- src/components/public/\*\*
- src/components/layout/\*\*

### Rules

- Jangan edit file milik owner lain tanpa catatan di TASKS.md.
- Jika perlu ubah shared file, tulis alasan di DECISIONS.md.
- Setiap selesai fitur, wajib update TASKS.md.
- Bug dicatat di ISSUES.md.

## Error & Issue Reporting

Jika agent menemukan error, bug, build fail, lint error, UI rusak, atau acceptance criteria tidak terpenuhi:

1. Jangan abaikan error.
2. Jika GitHub CLI (`gh`) tersedia dan sudah login, buat GitHub Issue untuk setiap bug atau blocker:
   - Format Title: `[Bug] Ringkasan masalah`
   - Body berisi:
     - Description
     - Steps
     - Expected
     - Actual
     - Error Log
     - Suspected Files
     - Suggested Fix
     - Blocker: Yes/No
   - Label:
     - `bug`
     - `priority-high` (jika blocker)
     - `cms` (jika terkait admin)
     - `public-web` (jika terkait website public)
     - `setup` (jika terkait konfigurasi awal)
3. Catat dan sinkronkan issue di ISSUES.md (atau gunakan ISSUES.md sebagai fallback jika `gh` tidak tersedia).
4. Jika error blocker, hentikan pekerjaan dan laporkan.
5. Jika error kecil bisa langsung diperbaiki, tetap catat lalu update status issue menjadi Done / Closed.
6. Jangan menandai issue Done jika belum diverifikasi hasilnya.

<!-- END:nextjs-agent-rules -->
