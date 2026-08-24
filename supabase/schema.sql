-- VoxPath "Let's Discuss" contact form submissions
create table if not exists discuss_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  organization text,
  interest text,
  message text not null
);

alter table discuss_submissions enable row level security;

-- Anonymous visitors may submit the contact form...
create policy "Allow anonymous inserts"
  on discuss_submissions
  for insert
  to anon
  with check (true);

-- ...but may never read back submissions (including their own or others').
-- No select/update/delete policies are defined for anon, so those actions are denied by default.
