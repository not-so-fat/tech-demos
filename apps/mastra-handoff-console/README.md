# Mastra Handoff Console

Single-page demo of a **Research → Draft → Critique** Mastra agent pipeline with a visible handoff timeline.

## Prerequisites

- [Bun](https://bun.sh)
- Optional: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` for live LLM runs. Without either key, the app uses a deterministic **mock** pipeline so the UI still works for screenshots and recordings.

## Run locally

From this directory:

```bash
bun install
bun run dev
```

Open [http://localhost:8787](http://localhost:8787) (API + Vite proxy) or [http://localhost:5173](http://localhost:5173) (Vite with `/api` proxy).

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Bun API (8787) + Vite (5173) |
| `bun run build` | Build client to `dist/client` |
| `bun run start` | Production server serving built client |

## Architecture

- **`src/mastra/`** — Three Mastra `Agent` definitions and a `createWorkflow` pipeline (`handoff-pipeline`) that chains research, draft, and critique steps.
- **`src/mastra/pipeline/mock-pipeline.ts`** — Deterministic fallback when no LLM API key is set.
- **`src/server/index.ts`** — Bun server: `POST /api/run`, `GET /api/health`.
- **`src/client/`** — React + Vite + shadcn-style UI components.

## Deploy (Cloudflare Pages)

Build from monorepo root or this app path; target the shared Pages project with path prefix **`apps/mastra-handoff-console`** (no separate Pages project).

See also [`PLAN.md`](./PLAN.md).
