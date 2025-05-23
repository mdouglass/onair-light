# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Cloudflare Workers project built with TypeScript. The main entry point is `src/index.ts` which exports a `fetch` handler that processes incoming HTTP requests using a URL routing pattern.

Key architectural elements:
- **Cloudflare Workers Runtime**: Serverless functions that run on Cloudflare's edge network
- **Request/Response Pattern**: The main handler receives Request objects and returns Response objects
- **URL-based Routing**: Routes are handled via `url.pathname` switching in the main fetch handler
- **TypeScript Configuration**: Uses Cloudflare-specific types and Wrangler for deployment

## Development Commands

**Local Development:**
```bash
npm run dev          # Start local development server
npm start           # Alias for dev command
```

**Testing:**
```bash
npm test            # Run all tests with Vitest
```

**Code Quality:**
```bash
npm run format      # Format code with Prettier
```

**Deployment:**
```bash
npm run deploy      # Deploy to Cloudflare Workers
npm run cf-typegen  # Generate Cloudflare-specific TypeScript types
```

## Testing Setup

The project uses Vitest with `@cloudflare/vitest-pool-workers` for testing Workers in a simulated environment. Tests can be written in two styles:
- **Unit style**: Direct calls to the worker's fetch handler with mocked context
- **Integration style**: Using `SELF.fetch()` to test the worker as a deployed service

Test files are located in the `test/` directory with the pattern `*.spec.ts`.

## Configuration Files

- `wrangler.jsonc`: Cloudflare Workers configuration (deployment settings, bindings, environment variables)
- `vitest.config.mts`: Test configuration that integrates with Wrangler
- `worker-configuration.d.ts`: Auto-generated TypeScript definitions for Cloudflare Workers types

## Production Deployment

The production deployment URL is: https://onair.msed.workers.dev/