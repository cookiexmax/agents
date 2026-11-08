# Gemini × Cloudflare × GitHub smoke test

This directory tracks the COOKIEXMAX AI orchestration proof of concept.

## Verified
- Cloudflare Worker: `cookiexmax-gemini-sandbox`
- Secret binding name: `GEMINI_API_KEY` (secret value never committed)
- Gemini API response reported by the user: HTTP 200, model `gemini-3.8-flash`, text `COOKIEXMAX GEMINI CONNECTED`
- Automatic retry recovered from HTTP 503 to HTTP 200.

## Architecture
User approval → ChatGPT engineering coordination → GitHub source/version control → Cloudflare sandbox Worker → Gemini API → test response.

## Test endpoint
https://cookiexmax-gemini-sandbox.cookiexmax.workers.dev/verify-7c91e8b4a52d4f0e9b13c6a27d50f841

This is a temporary public test endpoint. It is **not** a secured production API. Do not commit credentials or tokens.

## Status
GitHub commit is a version-control smoke test. Automated GitHub-to-Cloudflare deployment has not yet been configured or verified.
