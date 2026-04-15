# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**contextify** is a Bun-based TypeScript project with two workspaces:
- **Root** (`/`) — entry point `index.ts`, plain Bun project
- **Server** (`/server`) — Express 5 HTTP server, entry point `server/src/index.ts`

## Commands

### Root workspace
```bash
bun install          # install dependencies
bun run index.ts     # run the root entry point
```

### Server workspace
```bash
cd server
bun install          # install dependencies
bun run dev          # run with hot reload (bun --watch src/index.ts)
bun run build        # type-check via tsc (noEmit)
```

## Stack

- **Runtime**: Bun v1.3+
- **Language**: TypeScript (strict mode, ESNext target, bundler module resolution)
- **Server framework**: Express 5 (`express@^5`)
- **TypeScript**: v6 (`typescript@^6`)

## TypeScript Configuration

Both workspaces use `moduleResolution: "bundler"` with `verbatimModuleSyntax: true`. Import `.ts` extensions are allowed (`allowImportingTsExtensions: true`). `noEmit: true` means `tsc` is used only for type-checking — Bun handles transpilation and execution directly.
