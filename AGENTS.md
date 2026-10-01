# Agent rules — tech-demos

This repository is a **sticky monorepo**: one long-lived repo where each demo lives under `apps/<slug>/` and stays in place after it ships. Do not split demos into separate repos or spin up parallel monorepos for one-off experiments.

## Layout

- **`apps/<slug>/`** — Each demo is a **self-contained** Bun project (own `package.json`, dependencies, scripts, and `PLAN.md`). Slug is lowercase kebab-case (e.g. `apps/widget-playground/`).
- **`tracking/seen-bookmarks.json`** — Bookmark intake state (`proposed`, `skipped`, `built`). Update when proposing or finishing demos.
- **`skills/`** — Shared agent skills (e.g. project planning).

## Before building a demo

1. Read and follow **`skills/project-planning/SKILL.md`**.
2. Write or update **`apps/<slug>/PLAN.md`** with scope, stack, and acceptance criteria before substantial implementation.
3. Keep the demo isolated: prefer imports within `apps/<slug>/` unless a deliberate shared package is added later.

## Tooling

- **Bun** for install, run, test, and build in every app.
- Root **`bunfig.toml`** sets `[install] minimumReleaseAge = 259200` (3 days). Do not lower it without explicit approval.
- **Fable 5** is the default for interactive UI demos (React via Fable, consistent with team standards).
- **One Cloudflare Pages project** serves deployed demos (paths/projects configured per app; do not create extra Pages projects per demo without approval).

## Pull requests

Every PR that changes app behavior or UI must include:

- At least one **screenshot** showing the relevant UI or outcome.
- A short **video** walkthrough (screen recording) of the demo flow.

Use the walkthrough-artifacts workflow where available. Scaffold-only or docs-only PRs may omit media when there is nothing to demonstrate.

## What not to do

- Do not add throwaway demo apps outside `apps/<slug>/`.
- Do not skip `PLAN.md` for new apps.
- Do not bypass `minimumReleaseAge` with ad-hoc install flags.
