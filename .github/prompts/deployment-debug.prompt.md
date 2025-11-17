---
mode: agent
---

# Deployment Debugging

Systematically diagnose and fix deployment issues for TruuInvoice on Vercel.

## 1. Check Vercel Deployment Status

**Primary: Use Vercel MCP tools (activate_vercel_tools first):**

- List recent deployments with `mcp_vercel_list_deployments`
- Get deployment details with `mcp_vercel_get_deployment`
- Check build logs with `mcp_vercel_get_deployment_build_logs`
- Review deployment errors and warnings

**Secondary: Local build check if needed:**

- Use `run_in_terminal` to run `npm run build` locally
- Use `get_errors` tool to check TypeScript compilation errors
- Verify `next.config.js` webpack aliases for @lib/\* paths
- Check `vercel.json` configuration is valid
- Verify Node.js version matches (20.x)

**Common build errors:**

- "Module not found: @lib/shared-types" → Fix webpack aliases
- Out of memory → Increase NODE_OPTIONS in vercel.json
- TypeScript errors → Run `npm run type-check`

## 2. Check Environment Variables

**Using Vercel MCP tools:**

- Verify environment variables are set in deployment details
- Check variable values match requirements (don't expose secrets)
- Ensure correct environment scope (Production/Preview/Development)

**Required variables:**

- Firebase: NEXT*PUBLIC_FIREBASE*\*, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
- Stripe: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- Session: COOKIE_DOMAIN
- Optional: NEXT*PUBLIC_GOOGLE_MAPS_API_KEY, YAPILY*\*

**Common issues:**

- FIREBASE_PRIVATE_KEY must have \n properly escaped
- Missing NEXT*PUBLIC* prefix for client-side variables
- Variables not set for correct environment

**Alternative: Use Vercel CLI:**

- `vercel env ls` to list all environment variables

## 3. Check Runtime Errors

Using Next.js DevTools MCP (activate_nextjs_devtools first):

- Use `mcp_next-devtools_nextjs_runtime` to query runtime diagnostics
- Check API routes functionality
- Verify session cookie creation and validation

**Check these files:**

- `lib/firebase-admin.ts` - Firebase Admin SDK initialization
- `lib/middleware/auth.ts` - Auth middleware
- `src/restApi/index.ts` - Axios withCredentials: true
- `pages/api/**` - API route implementations

**Common runtime errors:**

- 401 Unauthorized → Check session cookies and withCredentials
- Firebase Admin not initialized → Verify FIREBASE_PRIVATE_KEY
- CORS errors → Check headers in next.config.js

## 4. Check i18n Issues

- Verify `public/locales/` directory included in build
- Check `serverSideTranslationsConfig` usage in getServerSideProps
- Ensure localePath points to `./public/locales`
- Review `next-i18next.config.js` configuration

**Symptoms:**

- Translation keys showing (e.g., "invoices.title") → Use serverSideTranslationsConfig
- Missing translations → Check locale files exist
- Language switch not working → Verify i18n config

## 5. Check External Services

**Firebase:**

- Verify authorized domains include Vercel URL
- Check Firestore rules allow Vercel domain
- Verify Storage CORS configured
- Confirm Admin SDK permissions

**Stripe:**

- Webhook endpoint: /api/webhooks/stripe configured
- STRIPE_WEBHOOK_SECRET matches dashboard
- Redirect URLs include Vercel domain
- Test vs Live keys for correct environment

**Bank Sync:**

- YAPILY_REDIRECT_URI matches Vercel domain
- API credentials valid

## 6. Check Vercel Configuration

**Framework settings:**

- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 20.x

**Function limits (Hobby plan):**

- Execution time: 10s limit
- Memory usage: Check logs
- Cold start times: Monitor first request

## 7. Use Vercel Tools for Diagnosis

Activate Vercel tools and use available commands:

- `activate_vercel_tools()` - Enable Vercel MCP server
- `mcp_vercel_list_deployments()` - List recent deployments
- `mcp_vercel_get_deployment()` - Get deployment details
- `mcp_vercel_get_deployment_build_logs()` - Review build logs
- `mcp_vercel_search_vercel_documentation()` - Search Vercel docs

## 8. Run Diagnostic Commands

```bash
# Check local build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Check git status
git log --oneline -5

# Vercel CLI commands
vercel ls
vercel logs [url]
vercel env ls
vercel inspect [url]
```

## 9. Fix Identified Issues

For each error found:

- Analyze root cause
- Apply fix using `replace_string_in_file`
- Verify locally with `npm run build` and `npm run dev`
- Re-deploy and check Vercel logs
- Document fix in `docs/CHANGELOG.md`

## 10. Verify Resolution

- Re-run all checks after fixes
- Test deployment in Preview environment first
- Monitor production deployment logs
- Verify all functionality works:
  - Authentication flow
  - API routes
  - Translations
  - External integrations (Firebase, Stripe)
  - Image loading
  - Session management

## Common Error Patterns

**Module Resolution:**

```
Error: Module not found: @lib/shared-types
Fix: Check webpack aliases in next.config.js
```

**Authentication:**

```
Error: 401 Unauthorized on API calls
Fix: Verify withCredentials: true in axios and COOKIE_DOMAIN env var
```

**i18n:**

```
Error: Translation keys showing
Fix: Use serverSideTranslationsConfig in getServerSideProps
```

**Firebase:**

```
Error: Firebase Admin SDK not initialized
Fix: Escape FIREBASE_PRIVATE_KEY properly (\n as literal newlines)
```

**Stripe:**

```
Error: Webhook signature invalid
Fix: Match STRIPE_WEBHOOK_SECRET with Stripe dashboard
```

## Documentation

After fixing issues, update relevant documentation:

- `docs/CHANGELOG.md` - Document all changes
- `docs/DEPLOYMENT.md` - Update deployment procedures
- `docs/TROUBLESHOOTING.md` - Add new solutions
