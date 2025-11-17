# PhotoMeh - AI Coding Agent Instructions

## Project Overview

PhotoMeh is a Next.js 16 insurance damage estimator using Firebase for authentication and Backblaze B2 for storage. The app uses the App Router, TypeScript, DaisyUI, and a client-side-only authentication pattern.

## Architecture & Data Flow

### Authentication Pattern (Client-Side Only)

- No server-side auth; `middleware.ts` allows all requests.
- Auth state managed in `lib/auth-context.tsx` using Firebase redirect flow (`signInWithRedirect`, `getRedirectResult`).
- Protected routes use `useAuth()` and redirect to `/login` client-side.
- User profile is derived from Firebase User and stored in context.

### Data Storage Strategy

- **Backblaze B2 for persistence:** All damage report images and metadata are stored in Backblaze B2 (see `lib/backblaze.ts`).
- Upload flow: File → base64 preview → Backblaze B2 upload → damage estimation → Firestore write → custom `damageReportAdded` event.
- Dashboard listens for custom events to refresh when reports are added.

### Route Structure

```
app/
  (auth)/login/      # Auth route group
  dashboard/         # Protected, client-side redirect
  layout.tsx         # Wraps all with <AuthProvider>
```

## Key Patterns & Conventions

- Always use `'use client'` in components using Firebase auth/hooks.
- Backblaze B2 upload via `lib/backblaze.ts`.
- Ensure API keys and bucket info are set in `.env.local`.
- Route protection:
  ```tsx
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);
  ```
- Types: All core types in `lib/types.ts` (`UploadedImage`, `DamageEstimate`, `UserProfile`).
- Styling: Tailwind + DaisyUI (themes: light, dark, cupcake). Global styles in `app/globals.css`.

## Integration Points

- OpenAI Vision API (see `docs/OPENAI_INTEGRATION.md`)
- Firebase Auth (no Firestore)
- Backblaze B2 for storage (`lib/backblaze.ts`)
- Firestore for report metadata
- Future: multi-angle analysis

## Developer Workflows

- **Start dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Environment:** Set all required variables in `.env.local` (see below)

## Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc. (all Firebase config is client-side)
- `OPENAI_API_KEY` for damage analysis
- `B2_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET_ID`, `B2_BUCKET_NAME` for Backblaze B2

## Common Gotchas

- Backblaze B2: Ensure correct bucket and API credentials are configured in `.env.local`.
- Route protection is client-side only.

## TypeScript Types

All types in `lib/types.ts`:

- `UploadedImage` - stored in Backblaze B2 and Firestore
- `DamageEstimate` - returned by estimator
- `UserProfile` - derived from Firebase User

## Styling

- Tailwind + DaisyUI (themes: light, dark, cupcake)
- DaisyUI component classes: `btn`, `card`, `badge`, `dropdown`, `hero`, etc.
- Global styles in `app/globals.css`

## Future Integration Points

- Continue improving OpenAI Vision integration (multi-angle, streaming, confidence thresholds)
- Add more Backblaze B2 features (thumbnails, access control)
- Multi-angle analysis

---

**For questions or unclear patterns, review `README.md` and `docs/OPENAI_INTEGRATION.md`.**
