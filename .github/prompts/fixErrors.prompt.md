---
mode: agent
---

# Error Detection and Fixing

Comprehensively check and fix all types of errors in the Next.js application:

## 1. Check Compilation/Type Errors

- Use `get_errors` tool to check TypeScript compilation errors
- Focus on recently modified files first
- Check all error types: syntax, type mismatches, missing imports

## 2. Check Runtime Errors

- Use `mcp_next-devtools_nextjs_runtime` tool with action='list_tools' to discover available diagnostics
- Call relevant runtime tools to check:
  - Build errors
  - Runtime exceptions
  - Console errors and warnings
  - React hydration errors
  - API route failures

## 3. Check Terminal Errors

- Use `get_terminal_output` to check for:
  - Build failures
  - TypeScript errors
  - Dependency issues
  - Configuration errors
  - Any error messages in terminal output

## 4. Fix Identified Issues

- For each error found:
  - Analyze the root cause
  - Apply appropriate fix using `replace_string_in_file`
  - Verify fix by re-checking errors

## 5. Verify Resolution

- Re-run error checks after fixes
- Confirm zero errors before completing
- Report summary of what was fixed
