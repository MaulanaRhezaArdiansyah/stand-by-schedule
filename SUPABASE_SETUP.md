# Supabase Setup Instructions

## Step 1: Create Supabase Project
1. Open https://supabase.com/ and create a new project.
2. Copy **Project URL** and **Anon Key** from **Project Settings → API**.

## Step 2: Create `standby_data` Table
Run this SQL in **SQL Editor**:

```sql
create table if not exists public.standby_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
```

## Step 3: Insert Initial Data
Use the JSON from `gist-data-template.json` as the `data` payload:

```sql
insert into public.standby_data (id, data)
values (
  'default',
  '{
    "developers": [],
    "schedules": [],
    "backup": { "backOffice": "", "frontOffice": "" },
    "monthNotes": []
  }'::jsonb
)
on conflict (id)
do update set data = excluded.data, updated_at = now();
```

> You can replace the JSON above with the full content of `gist-data-template.json`.

## Step 4: Configure Environment Variables
Update `.env` with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_DATA_ID=default

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DATA_ID=default
```

## Step 5: RLS (Row Level Security)
If RLS is enabled, add a policy to allow read for the anon key:

```sql
alter table public.standby_data enable row level security;

create policy "Allow read for standby data"
on public.standby_data
for select
using (true);
```

For updates from the server, the app uses the **service role key**.
