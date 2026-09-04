<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## AI Skills

Project ini menggunakan AI skills di folder:

- `.agents/skills/shadcn`

Jika agent mendukung skills, agent harus menggunakan skill tersebut saat bekerja dengan shadcn/ui.

### shadcn/ui Rules

- Prioritaskan komponen shadcn/ui untuk semua UI.
- Jangan menulis ulang komponen yang sudah tersedia di shadcn registry.
- Jika komponen belum tersedia, install lewat CLI:

```bash
bunx --bun shadcn@latest add <component>
```

## Next.js Version Rules

Project ini menggunakan versi Next.js yang mungkin punya perubahan API atau convention baru.

Agent wajib memperhatikan block `nextjs-agent-rules` yang dibuat otomatis oleh Next.js.

Sebelum mengubah fitur terkait:

- routing
- server actions
- middleware
- cookies
- headers
- metadata
- app router
- caching / revalidation

Agent harus membaca dokumentasi lokal yang relevan di:

```txt
node_modules/next/dist/docs/
```

<!-- END:nextjs-agent-rules -->
