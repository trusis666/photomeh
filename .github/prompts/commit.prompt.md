---
mode: agent
---

# Commit Changes Workflow

Systematically document, commit, and push all changes to the repository.

## 1. Check Git Status

- Use `run_in_terminal` with `git status --short` to see modified/new files
- Use `run_in_terminal` with `git diff` to review changes
- Identify all files that need to be committed

## 2. Update Changelog

**CRITICAL**: Before committing, update `docs/CHANGELOG.md`:

- Read the current changelog to understand format
- Add new entries under `## [Unreleased]` section
- Use proper categories:
  - `### Added - YYYY-MM-DD` - New features, files, or functionality
  - `### Changed - YYYY-MM-DD` - Modifications to existing features
  - `### Fixed - YYYY-MM-DD` - Bug fixes
  - `### Removed - YYYY-MM-DD` - Removed features or files
- Include:
  - What changed and why
  - File paths affected
  - Technical implementation details
  - Breaking changes or migration notes
  - API changes or new endpoints

## 3. Stage Changes

- Use `run_in_terminal` with `git add <files>` to stage changes
- Or use `git add .` to stage all changes if appropriate
- Verify staged files with `git status`

## 4. Create Commit

- Use `run_in_terminal` with `git commit -m "message"`
- Commit message format:
  - Use conventional commit format: `type(scope): description`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Keep first line under 72 characters
  - Add detailed body if needed
- Example: `fix(config): remove deprecated serverRuntimeConfig from next.config.js`

## 5. Push to Remote

- Use `run_in_terminal` with `git push origin main` (or current branch)
- Verify push succeeded
- Check for any push errors or conflicts

## 6. Verify Completion

- Confirm commit hash with `git log --oneline -1`
- Verify remote updated with `git log origin/main --oneline -1`
- Report summary of what was committed and pushed

## Success Criteria

✅ Changelog updated with all changes and dates
✅ All changes staged for commit
✅ Commit created with descriptive message
✅ Changes pushed to remote repository
✅ No git errors or conflicts
