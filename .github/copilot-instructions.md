# PhotoMeh - AI Coding Agent Instructions

## Project Overview

Next.js 16 insurance damage estimator using Firebase for auth/storage and localStorage for data persistence. App Router with TypeScript, DaisyUI components, and client-side authentication pattern.

## Architecture & Data Flow

### Authentication Pattern (Client-Side Only)

- **No server-side auth**: `middleware.ts` allows all requests through - authentication happens entirely client-side
- Auth state managed by `lib/auth-context.tsx` using Firebase redirect flow (`signInWithRedirect` + `getRedirectResult`)
- Protected routes check auth client-side via `useAuth()` hook and redirect to `/login` in `useEffect`
- User profile stored in context, derived from Firebase User object

### Data Storage Strategy

- **localStorage for persistence**: All damage reports stored in browser's `localStorage` (key: `damage-reports`)
- **No Firestore writes**: Despite Firebase being configured, app only uses Auth and Storage - Firestore is unused
- Upload flow: File → base64 preview → mock estimation → localStorage → custom `damageReportAdded` event
- Dashboard listens to `storage` events and custom events to refresh when reports are added

### Route Structure

```
app/
  (auth)/login/      - Route group, no layout impact
  dashboard/         - Protected via client-side redirect
  layout.tsx         - Wraps all with <AuthProvider>
```

## Key Patterns

### Image Handling

- File validation: max 10MB, image types only
- Preview via FileReader base64 conversion
- No actual Firebase Storage upload - base64 stored in localStorage
- `next.config.ts` allows Firebase Storage and Google profile images via `remotePatterns`

### Mock Estimation System

`lib/estimator.ts` simulates AI damage detection:

- Random selection of 1-3 damage types from predefined pool
- 1.5s artificial delay to mimic API call
- Returns `DamageEstimate` with cost breakdown, labor hours, parts, confidence score
- Helper functions: `getSeverityColor()` maps severity to DaisyUI badge classes, `formatCost()` uses Intl.NumberFormat

### State Management

- React Context for auth (`AuthContext`)
- Component-level state for uploads, forms
- localStorage as "database"
- Custom events for cross-component communication

## Development Commands

```bash
npm run dev    # Start dev server (Next.js 16)
npm run build  # Production build
npm run lint   # ESLint check
```

## Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

All Firebase config uses `NEXT_PUBLIC_` prefix for client-side access.

## Common Gotchas

1. **Firebase redirect flow**: Use `signInWithRedirect`, not `signInWithPopup`. `getRedirectResult` must be checked on mount.
2. **Client components required**: Any component using Firebase auth/hooks needs `'use client'` directive
3. **localStorage limits**: Reports capped at 50 to avoid quota issues (see `UploadForm.tsx` line 77)
4. **Route protection**: Add auth check pattern to new protected pages:
   ```tsx
   useEffect(() => {
     if (!loading && !user) router.push('/login');
   }, [user, loading, router]);
   ```

## TypeScript Types

All types in `lib/types.ts`:

- `UploadedImage` - stored in localStorage
- `DamageEstimate` - returned by estimator
- `UserProfile` - derived from Firebase User

## Styling

- Tailwind + DaisyUI (themes: light, dark, cupcake)
- DaisyUI component classes: `btn`, `card`, `badge`, `dropdown`, `hero`, etc.
- Global styles in `app/globals.css`

## Future Integration Points

- Replace `estimateDamage()` mock with real AI API call
- Swap localStorage for Firestore writes (structure already matches Firestore schema in README)
- Add Firebase Storage upload flow (currently only creates base64 preview)
