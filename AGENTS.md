<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Available Skills

### Generic Skills (from global config)

| Skill | Description | URL |
|-------|-------------|-----|
| `typescript` | Const types, flat interfaces, utility types | [SKILL.md](skills/typescript/SKILL.md) |
| `react-19` | No useMemo/useCallback, React Compiler | [SKILL.md](skills/react-19/SKILL.md) |
| `nextjs-15` | App Router, Server Actions, streaming | [SKILL.md](skills/nextjs-15/SKILL.md) |
| `tailwind-4` | cn() utility, no var() in className | [SKILL.md](skills/tailwind-4/SKILL.md) |

### Project-Specific Skills

| Skill | Description | Location |
|-------|-------------|----------|
| `works-tracker` | Project overview, component structure, Supabase patterns | [SKILL.md](skills/works-tracker/SKILL.md) |

### Auto-invoke Skills

| Action | Skill |
|--------|-------|
| App Router / Server Actions | `nextjs-15` |
| Writing TypeScript | `typescript` |
| Working on this project | `works-tracker` |
| Working with Tailwind classes | `tailwind-4` |
| Writing React components | `react-19` |

## Tech Stack

- **Next.js** 16 with App Router + Turbopack
- **TypeScript** for type safety
- **Shadcn/ui v4** with `@base-ui/react` (NOT Radix)
- **Supabase** for database and storage
- **Leaflet** + OpenStreetMap for maps
- **Recharts** for dashboard charts

## Folder Structure

```
works-tracker/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard (home)
│   ├── layout.tsx           # Root layout with nav
│   └── works/               # Works CRUD
│       ├── page.tsx         # Works list
│       ├── new/             # Create work
│       └── [id]/            # Work detail + edit
├── components/
│   ├── ui/                  # Shadcn components
│   ├── dashboard/           # Dashboard components
│   └── works/               # Works-related components
├── lib/
│   ├── actions/             # Server Actions (CRUD)
│   └── supabase/           # Supabase clients
├── types/                   # TypeScript interfaces
├── supabase/                # SQL schemas
└── docs/                    # Documentation
```

## Important Conventions

### Shadcn/ui v4 Breaking Changes

- Uses `@base-ui/react` NOT Radix UI
- Components like `DialogTrigger`, `PopoverTrigger` don't support `asChild`
- Use `render` prop or native elements instead

### Supabase

- Server: `createClient()` from `@supabase/ssr`
- Client: `getSupabaseClient()` from `lib/supabase/client`
- RLS policies needed for both table and storage

### Server Actions

- Pass functions to Client Components? Parent must also be Client Component

## Code Style

- Components: English
- UI text: Spanish
- Use `cn()` from `lib/utils` for conditional classes
- Skeleton loaders for loading states

## Commands

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # Lint check
```