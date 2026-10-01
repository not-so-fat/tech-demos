# Mastra Handoff Console (`mastra-handoff-console`)

## Problem
Builders want a visible, single-user proof of multi-agent handoffs with Mastra (TS). A console that shows research → draft → critique makes the agent pipeline tangible without enterprise scaffolding.

## MVP scope
### In scope
- One-page web console
- Three Mastra agents in a pipeline: Research → Draft → Critique
- User enters a short topic/prompt; runs the pipeline
- Visible handoff log (which agent ran, payload summary, next agent)
- Final critique + draft shown in the UI
- Bun + TypeScript; UI with shadcn/ui

### Out of scope
- Auth / multi-tenant
- Production deploy hardening
- Persistent DB / billing
- Streaming polish beyond a simple progress/handoff list
- Real external web search APIs (mock or LLM-only research is fine)

## Stack
- Bun
- Mastra (@mastra/core and docs-current APIs)
- React + Vite (or equivalent Bun-friendly SPA) + shadcn/ui
- LLM: use env OPENAI_API_KEY or ANTHROPIC_API_KEY if present; if neither is available, fall back to a deterministic mock agent runner that still exercises the handoff UI so the demo runs and can be screenshot/video'd

## Routes / screens
- `/` — topic input, Run button, handoff timeline, final outputs

## Data
- In-memory run state only; no DB

## Done when
- [x] `bun install` + `bun run dev` works from apps/mastra-handoff-console/
- [x] User can submit a topic and see 3 sequential handoffs in the UI
- [x] PLAN.md and README.md exist with run instructions
- [x] PR includes at least one screenshot AND one short video of the running flow

## Deploy (Cloudflare Pages)
- Note path apps/mastra-handoff-console for the shared Pages project; no new Pages project
