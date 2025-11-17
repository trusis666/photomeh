# Changelog

## [Unreleased]

### Added - 2025-11-17

- Added automated pre-commit formatting workflow using Husky, lint-staged, and Prettier. All staged files are now formatted before commit. (package.json, package-lock.json, .husky/pre-commit)

### Changed - 2025-11-17

- Refactored `app/api/analyze-damage/route.ts` to remove all Ollama-related code and use only OpenAI Vision API for damage analysis. Improved error handling and response validation.
- Updated `.github/copilot-instructions.md` to remove all references to Ollama and document OpenAI Vision as the sole backend for damage analysis.
- Migrated damage report storage from localStorage to Firebase Firestore. All dashboard and upload logic now uses Firestore for persistence. (app/dashboard/page.tsx, components/UploadForm.tsx)
- Integrated Backblaze B2 for image uploads. Images are now stored remotely and referenced by URL in reports. (lib/backblaze.ts, .env.local.example)
- Updated `UploadedImage` type to use image URLs and ISO string dates for Firestore compatibility. (lib/types.ts)
- Added Firestore rules and indexes for secure, efficient querying and user-based access. (firestore.rules, firestore.indexes.json)
- Added Backblaze B2 credentials to environment example. (.env.local.example)
- Installed `axios` for Backblaze B2 upload support. (package.json, package-lock.json)

### Removed - 2025-11-17

- Deleted deprecated documentation files: `docs/OLLAMA_SETUP.md` and `docs/OLLAMA_TROUBLESHOOTING.md`.
- Removed all localStorage and custom event logic for damage report persistence. (app/dashboard/page.tsx, components/UploadForm.tsx)
- Deleted deprecated `middleware.ts` in favor of Next.js 16 proxy convention.

## [Previous Releases]

- Initial release.
