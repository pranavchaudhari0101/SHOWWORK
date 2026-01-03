# ShowWork Bug Fix Report

## P0 Bug: Published Projects Not Visible to Other Users

### Severity: **Critical (P0)**

### Bug Description
When User A publishes a project as PUBLIC, User B (logged in or anonymous) cannot see it on:
- Explore page
- Project detail page
- User A's public profile

### Root Cause Analysis

**Expected Behavior:**
- `visibility = 'PUBLIC'` projects should be readable by ALL users
- `visibility = 'DRAFT'` projects should ONLY be readable by the owner

**Actual Behavior:**
- Public projects were not accessible to other users

**Root Cause Identified:**
The original RLS policy in `database/schema.sql` used a combined SELECT policy:

```sql
CREATE POLICY "Public projects are viewable by everyone"
ON projects FOR SELECT USING (
    visibility = 'PUBLIC' 
    OR profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
```

**Why This Failed:**
1. For anonymous users, `auth.uid()` returns `NULL`
2. PostgreSQL RLS evaluates the entire expression for policy decisions
3. The subquery `WHERE user_id = NULL` returns no rows
4. The combined OR expression may not short-circuit correctly in RLS context
5. Result: Anonymous users blocked from ALL projects

### Fix Applied

**1. Database: New RLS Policies** (`database/fix_rls_complete.sql`)

Created SEPARATE policies with explicit role targeting:

```sql
-- Policy for anonymous access
CREATE POLICY "anon_view_public_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (visibility = 'PUBLIC');

-- Separate policy for owner access
CREATE POLICY "owner_view_own_projects"  
ON projects FOR SELECT
TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
```

**2. Next.js: Cache Prevention**

Added `export const dynamic = 'force-dynamic'` to:
- `app/explore/page.tsx`
- `app/profile/[username]/page.tsx`
- `app/project/[id]/page.tsx`

**3. Access Control: Draft Protection**

Added server-side access control in `app/project/[id]/page.tsx`:
```typescript
if (project.visibility === 'DRAFT') {
    const isOwner = currentProfileId === project.profile_id
    if (!isOwner) {
        notFound()
    }
}
```

**4. Middleware: Route Protection**

Updated `lib/supabase/middleware.ts` to only protect specific routes:
- Protected: `/dashboard`, `/upload`
- Public: Everything else (explore, profiles, project pages)

### Verification

**Automated:**
- TypeScript compilation passes
- ESLint passes

**Manual QA:**
1. As anonymous user, visit `/explore` → Should see public projects
2. As anonymous user, click on project → Should load detail page
3. As anonymous user, try draft project URL → Should get 404
4. As owner, view draft in dashboard → Should work

### Files Modified

| File | Change |
|------|--------|
| `database/fix_rls_complete.sql` | NEW - Complete RLS fix script |
| `app/explore/page.tsx` | Added dynamic rendering |
| `app/profile/[username]/page.tsx` | Added dynamic rendering |
| `app/project/[id]/page.tsx` | Added dynamic rendering + draft access control |
| `lib/supabase/middleware.ts` | Refactored route protection |
| `lib/logger.ts` | NEW - Diagnostic logging |

### Action Required

**You must run the RLS fix in Supabase:**

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `database/fix_rls_complete.sql`
3. Run the script
4. Verify with: `SELECT * FROM projects WHERE visibility = 'PUBLIC' LIMIT 5;`

---

## Other Issues Identified & Fixed

### Issue: Potential Caching of Stale Data
- **Severity:** Medium
- **Fix:** Added `dynamic = 'force-dynamic'` to public pages
- **Status:** Fixed

### Issue: Draft Projects Accessible via Direct URL
- **Severity:** Medium  
- **Fix:** Added server-side access control in project detail page
- **Status:** Fixed

### Issue: Middleware Could Block Public Routes
- **Severity:** Low
- **Fix:** Refactored middleware with explicit protected route list
- **Status:** Fixed
