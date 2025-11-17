# Changelog

## [Unreleased]

### Added - 2025-11-17

- Added guest image upload field, mock damage report preview, and Stripe payment button to unlock full report on landing page. No API call for preview; Stripe payment is currently a placeholder. (app/page.tsx)
- Integrated Stripe payments: created API route for Stripe Checkout session and updated landing page to redirect users to Stripe for payment. (app/api/create-checkout-session/route.ts, app/page.tsx)

- Added automated pre-commit formatting workflow using Husky, lint-staged, and Prettier. All staged files are now formatted before commit. (package.json, package-lock.json, .husky/pre-commit)

- Added modular damage analysis backend for OpenAI Vision API:
  - Created `constants.ts` for system/user prompts and config
  - Added `openai-client.ts` for OpenAI API calls
  - Added `types.ts` for API response and error types
  - Added `utils.ts` for logging and helpers
  - Added `validators.ts` for input validation
  - Refactored `route.ts` to use new modular structure and improved error handling
    (app/api/analyze-damage/)

- Added MCP server configuration for Context7, Firebase, and Vercel to `.vscode/mcp.json`.
- Added deployment debugging prompt for Vercel (`.github/prompts/deployment-debug.prompt.md`).
- Added error detection and fixing prompt for Next.js (`.github/prompts/fixErrors.prompt.md`).
- Added `firebase-debug.log` for Firebase CLI and deployment diagnostics.

- Added `useDamageReport` hook to modularize damage report API logic. (lib/useDamageReport.ts)

### Changed - 2025-11-17

- Simplified header navigation: removed Dashboard, Privacy Policy, and Terms & Conditions links from the reusable Header component. Only Sign in button remains. (components/Header.tsx)
- Refactored layout for all main pages and login screen to use consistent reusable Header and Footer components. (app/page.tsx, app/dashboard/page.tsx, app/(auth)/login/page.tsx, components/Header.tsx, components/Footer.tsx)

- Refactored `app/api/analyze-damage/route.ts` to remove all Ollama-related code and use only OpenAI Vision API for damage analysis. Improved error handling and response validation.
- Updated `.github/copilot-instructions.md` to fully document Backblaze B2 as the storage backend, removing all references to localStorage and clarifying the new data flow, integration points, and developer workflows. (File: .github/copilot-instructions.md)
- Migrated damage report storage from localStorage to Firebase Firestore. All dashboard and upload logic now uses Firestore for persistence. (app/dashboard/page.tsx, components/UploadForm.tsx)
- Integrated Backblaze B2 for image uploads. Images are now stored remotely and referenced by URL in reports. (lib/backblaze.ts, .env.local.example)
- Updated `UploadedImage` type to use image URLs and ISO string dates for Firestore compatibility. (lib/types.ts)
- Added Firestore rules and indexes for secure, efficient querying and user-based access. (firestore.rules, firestore.indexes.json)
- Added Backblaze B2 credentials to environment example. (.env.local.example)
- Installed `axios` for Backblaze B2 upload support. (package.json, package-lock.json)

- Updated `.vscode/mcp.json` to support new MCP server integrations.
- Refactored damage report preview in upload form to match dashboard card style: uses DaisyUI card, horizontal stats, badges for damages and parts, improved spacing and colors. (components/UploadForm.tsx)

- Refactored landing page flow to generate real damage report after Stripe payment, using new hook. Improved loader and error handling. (app/page.tsx, components/StripePaymentWidget.tsx)

### Removed - 2025-11-17

- Deleted deprecated documentation files: `docs/OLLAMA_SETUP.md` and `docs/OLLAMA_TROUBLESHOOTING.md`.
- Removed all localStorage and custom event logic for damage report persistence. (app/dashboard/page.tsx, components/UploadForm.tsx)
- Deleted deprecated `middleware.ts` in favor of Next.js 16 proxy convention.

### Fixed - 2025-11-17

- Restored all core dependencies in `package.json` and `package-lock.json` (next, react, react-dom, firebase, axios, daisyui, openai) after accidental removal. Application now builds and runs successfully. (package.json, package-lock.json)
- Updated Stripe API version to `2025-10-29.clover` in both payment API routes to resolve build errors after Stripe type update. (app/api/create-checkout-session/route.ts, app/api/create-payment-intent/route.ts)
- Fixed dashboard Firestore mapping to ensure all required `UploadedImage` fields are present, resolving TypeScript build error. (app/dashboard/page.tsx)
- Fixed severity display in damage report preview to use highest severity from damages array. (components/UploadForm.tsx)

## [Previous Releases]

- Initial release.
