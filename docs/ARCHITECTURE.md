# ShowWork Architecture Specification

> **This is the canonical source of truth for all architectural decisions.**

---

## Core Principle

> The database does not care about pages.  
> Pages are just filtered projections of the same data.

---

## Layer 1: Data Layer (Source of Truth)

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User identity & public info |
| `projects` | Single source of truth for all projects |
| `skills` | Tech stack tags |
| `project_skills` | Many-to-many join |

### Future Interaction Tables (Designed, Not Implemented)

| Table | Purpose |
|-------|---------|
| `views` | Track project views for trending |
| `saves` | Bookmarked projects |
| `likes` | Project likes |

### Project Fields

```
id              UUID PRIMARY KEY
profile_id      UUID → profiles.id (owner)
title           TEXT
short_desc      TEXT
full_desc       TEXT
cover_image_url TEXT
github_url      TEXT
live_url        TEXT
visibility      ENUM ('PUBLIC', 'DRAFT', 'PRIVATE')
status          ENUM ('IN_PROGRESS', 'COMPLETED')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `profile_id` Clarification

- `profile_id` references the `profiles` table, NOT `auth.users` directly
- `profiles.user_id` → `auth.users.id`
- Queries must join through profiles when checking ownership

---

## Layer 2: Access Rules (Backend Enforced)

### Read Rules

| Visibility | Who Can Read |
|------------|--------------|
| `PUBLIC` | Anyone (including anonymous) |
| `DRAFT` | Owner only |
| `PRIVATE` | Owner only |

### Write Rules

| Action | Who Can Perform |
|--------|-----------------|
| Create | Authenticated users only |
| Edit | Owner only |
| Delete | Owner only |

### Supabase RLS Implementation

```sql
-- Public projects readable by anyone
CREATE POLICY "anon_view_public_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (visibility = 'PUBLIC');

-- Owners can view their own projects (any visibility)
CREATE POLICY "owner_view_own_projects"
ON projects FOR SELECT
TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Only owners can insert/update/delete
CREATE POLICY "owner_insert_projects" ON projects FOR INSERT TO authenticated
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "owner_update_projects" ON projects FOR UPDATE TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "owner_delete_projects" ON projects FOR DELETE TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
```

> **Frontend checks are UX. Backend rules are law.**

---

## Layer 3: Views (Routes)

### Public Routes (No Auth)

| Route | Filter | Returns |
|-------|--------|---------|
| `/` | None | Static marketing |
| `/explore` | `visibility = 'PUBLIC'` | All public projects |
| `/profile/[username]` | `visibility = 'PUBLIC' AND profile = username` | User's public projects |
| `/project/[id]` | `visibility = 'PUBLIC' OR owner` | Single project |

### Protected Routes (Auth Required)

| Route | Filter | Returns |
|-------|--------|---------|
| `/dashboard` | `profile_id = me` | All my projects (any visibility) |
| `/dashboard/projects` | `profile_id = me` | All my projects |
| `/upload` | N/A | Create form |

---

## How Discovery Works

```
User opens /explore
    ↓
Browser requests page
    ↓
Backend runs query: SELECT * FROM projects WHERE visibility = 'PUBLIC'
    ↓
DB returns rows (RLS applied)
    ↓
UI renders

No "push" mechanism. Pages PULL what they're allowed to see.
```

---

## Future-Proofing Notes

### Trending (Not Implemented)

Trending = derived data requiring:
- `views` count
- `saves` count
- `likes` count
- Time decay algorithm

**Do not conflate "trending" with a simple ORDER BY.**

### Analytics (Planned)

Will require:
- View tracking per project
- Referrer tracking
- Time-series data

---

## Common Mistakes to Avoid

❌ Creating separate "feed" tables  
❌ Expecting frontend to enforce authorization  
❌ Confusing `profile_id` with `user_id`  
❌ Skipping RLS policies  
❌ Treating visibility as optional  

---

## Verification Checklist

- [ ] Anonymous user can see `/explore` with public projects
- [ ] Anonymous user can view `/project/[id]` for public projects
- [ ] Anonymous user gets 404 for draft/private projects
- [ ] Owner can see all their projects in `/dashboard`
- [ ] Only owner can edit/delete their projects
- [ ] Published projects appear immediately (no cache staleness)

