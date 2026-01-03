# ShowWork System Health Checklist

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Manual QA Checklist

### 1. Authentication Flow
- [ ] Register with email/password works
- [ ] Login with email/password works
- [ ] GitHub OAuth login works
- [ ] Session persists on page refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when unauthenticated

### 2. Project Visibility (P0 - Critical)
- [ ] **Anonymous user can see public projects on /explore**
- [ ] **Anonymous user can view public project detail pages**
- [ ] **Anonymous user can see public projects on user profiles**
- [ ] Draft projects do NOT appear on /explore
- [ ] Draft projects return 404 for non-owners
- [ ] Owner can see their draft projects in dashboard

### 3. Publishing Flow
- [ ] Create new project works
- [ ] Upload cover image works
- [ ] Set visibility to PUBLIC works
- [ ] Published project appears immediately on /explore
- [ ] Published project appears on author's public profile

### 4. Editing Flow
- [ ] Edit project details works
- [ ] Change visibility from DRAFT to PUBLIC works
- [ ] Changes reflect immediately without cache issues

### 5. Profile Pages
- [ ] Public profile shows user info correctly
- [ ] Public profile shows only PUBLIC projects
- [ ] Social links work correctly

### 6. Storage/Images
- [ ] Cover images load for all users (including anonymous)
- [ ] Image upload creates correct public URLs
- [ ] No broken image links

### 7. Stats/Engagement
- [ ] Views count updates
- [ ] Likes require authentication
- [ ] Save functionality works

## Known Limitations

1. **Search**: Search on explore page is UI-only (not implemented yet)
2. **Profile Views**: Profile view tracking is planned but not implemented
3. **Ranking**: User ranking system is planned but not implemented

## Verification Commands

```bash
# Run development server
npm run dev

# Run production build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint
```

## Post-Deploy Verification

After deploying to Vercel:
1. Open incognito browser (anonymous user)
2. Visit /explore - should see public projects
3. Click on a project - should load successfully
4. Visit a user profile - should see their public projects
5. Try accessing a draft project URL - should get 404
