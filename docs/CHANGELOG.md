# Changelog

## [Unreleased]

### Changed - 2025-11-17
- Refactored `app/api/analyze-damage/route.ts` to remove all Ollama-related code and use only OpenAI Vision API for damage analysis. Improved error handling and response validation.
- Updated `.github/copilot-instructions.md` to remove all references to Ollama and document OpenAI Vision as the sole backend for damage analysis.

### Removed - 2025-11-17
- Deleted deprecated documentation files: `docs/OLLAMA_SETUP.md` and `docs/OLLAMA_TROUBLESHOOTING.md`.

## [Previous Releases]

- Initial release.
