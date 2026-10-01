---
name: project-planning
description: Plan a Bun + shadcn MVP demo under apps/<slug>/ before coding. Use when starting a new tech demo, scoping a bookmark idea, or when the user asks for a PLAN.md or MVP plan.
---

# Project planning (Bun + shadcn MVP)

Use this skill **before** implementing a new demo in `apps/<slug>/`.

## Outcomes

1. A clear **`apps/<slug>/PLAN.md`** agents and humans can follow.
2. A minimal vertical slice (MVP) that proves the idea—not a production platform.

## Workflow

### 1. Name and situate

- Choose **`slug`**: lowercase kebab-case, unique under `apps/`.
- Confirm the idea is not already in `tracking/seen-bookmarks.json` → `built` (or reconcile if revisiting).

### 2. Clarify the MVP (ask if unclear)

Capture in PLAN.md:

| Section | Content |
|--------|---------|
| **Problem** | One paragraph: who cares and why now? |
| **MVP scope** | In-scope behaviors (bulleted); explicit **out of scope** |
| **Stack** | Bun; UI with **shadcn/ui** (and Fable 5 if the demo is Fable-based per AGENTS.md) |
| **Routes / screens** | List main views or CLI entrypoints |
| **Data** | Static, local JSON, mock API, or real API—pick one |
| **Done when** | Testable acceptance criteria (checkboxes) |
| **Deploy** | Cloudflare Pages path/project notes (single shared Pages project) |

### 3. Scaffold checklist (after PLAN approval)

- `apps/<slug>/package.json` with Bun-compatible scripts (`dev`, `build`, `test` as needed).
- shadcn/ui initialized in that app only (do not assume a root design system unless one exists).
- `PLAN.md` at app root, linked from PR description.
- No dependency on unreleased npm packages; respect root `bunfig.toml` `minimumReleaseAge`.

### 4. Implementation order

1. Static shell + routing/layout.
2. One shadcn component proving theme/tooling works.
3. Core MVP interaction from PLAN “done when”.
4. README blurb in `apps/<slug>/README.md` (how to `bun install` / `bun run dev`).
5. Screenshot + video for the PR (see AGENTS.md).

### 5. Finish

- Move bookmark from `proposed` → `built` in `tracking/seen-bookmarks.json` when shipping.
- Keep the app **self-contained**; extract shared code only after a second demo needs it.

## PLAN.md template

Copy into `apps/<slug>/PLAN.md` and fill in:

```markdown
# <Human title> (`<slug>`)

## Problem

## MVP scope

### In scope

-

### Out of scope

-

## Stack

- Bun
- shadcn/ui
- (Fable 5 if applicable)

## Routes / screens

-

## Data

-

## Done when

- [ ]

## Deploy (Cloudflare Pages)

-
```

## Principles

- **Smallest proof**: Prefer one screen and one happy path over feature breadth.
- **Self-contained app**: All demo code under `apps/<slug>/`.
- **Plan first**: No large codegen before PLAN.md exists.
