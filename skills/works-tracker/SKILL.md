---
name: works-tracker
description: >
  Works Tracker - Next.js construction/project management app.
  Trigger: When working on this project - CRUD, Supabase, maps.
license: MIT
metadata:
  author: panchocorderos
  version: "1.0"
---

## Project Overview

Works Tracker is a Next.js 16 application for managing construction/service works with:
- CRUD operations for works (projects) with dates
- Photo uploads for progress reporting
- Dashboard with statistics and charts
- Map integration with location markers

## Tech Stack

- Next.js 16 with App Router + Turbopack
- TypeScript
- Shadcn/ui v4 with `@base-ui/react`
- Supabase (PostgreSQL + Storage)
- Leaflet + OpenStreetMap for maps
- Recharts for charts

## Folder Structure

```
works-tracker/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard (home)
│   ├── layout.tsx           # Root layout with nav
│   └── works/               # Works CRUD
│       ├── page.tsx         # Works list
│       ├── new/page.tsx     # Create work
│       └── [id]/
│           ├── page.tsx     # Work detail
│           └── edit/page.tsx # Edit work
├── components/
│   ├── ui/                  # Shadcn components
│   ├── dashboard/           # Dashboard components
│   │   ├── dashboard-content.tsx
│   │   ├── stats-cards.tsx
│   │   └── works-chart.tsx
│   └── works/               # Works components
│       ├── works-form.tsx
│       ├── works-table.tsx
│       ├── photos-grid.tsx
│       ├── photo-upload.tsx
│       ├── work-map.tsx
│       └── map-inner.tsx
├── lib/
│   ├── actions/             # Server Actions
│   │   ├── works.ts         # Works CRUD
│   │   ├── dashboard.ts     # Dashboard queries
│   │   └── photos.ts        # Photo CRUD
│   └── supabase/           # Supabase clients
│       ├── client.ts        # Client-side (getSupabaseClient)
│       └── server.ts        # Server-side (createClient)
├── types/
│   └── index.ts            # TypeScript interfaces
├── supabase/               # SQL schemas
│   ├── schema.sql          # Works table
│   ├── photos-schema.sql   # Work photos table
│   └── location-schema.sql # Lat/long columns
└── docs/
    └── ubicacion-mapa.md   # Feature documentation
```

## Key Patterns

### Supabase Client (Client Components)

```typescript
import { getSupabaseClient } from "@/lib/supabase/client";

const supabase = getSupabaseClient();
```

### Supabase Client (Server Actions)

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
```

### Server Action

```typescript
// lib/actions/works.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createWork(input: CreateWorkInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("works").insert([input]);
  
  if (error) return { error: error.message };
  
  revalidatePath("/works");
  redirect("/works");
}
```

### Shadcn v4 - DialogTrigger (No asChild)

```typescript
// Wrong - Shadcn v4 doesn't support asChild
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>

// Correct - Use render prop
<DialogTrigger
  render={<Button>Open</Button>}
/>
```

### Leaflet Map (SSR-safe)

```typescript
// work-map.tsx - Use dynamic import
const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px]" />
});

// map-inner.tsx - Load Leaflet in useEffect
useEffect(() => {
  import("leaflet").then((L) => {
    L.Icon.Default.mergeOptions({...});
  });
}, []);
```

## Database Schema

### Works Table

```sql
CREATE TABLE works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT,
  description TEXT,
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  actual_end_date DATE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Work Photos Table

```sql
CREATE TABLE work_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Commands

```bash
npm run dev     # Start dev server (localhost:3000)
npm run build   # Production build
npm run lint    # Lint check
npx vercel --prod  # Deploy to Vercel
```