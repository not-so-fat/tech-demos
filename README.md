# tech-demos

Sticky monorepo for small technology demos: each experiment lives under **`apps/<slug>/`** as a self-contained [Bun](https://bun.sh) project and stays in the repo after it ships.

## Repository map

| Path | Purpose |
|------|---------|
| `AGENTS.md` | Rules for humans and coding agents (layout, PRs, tooling) |
| `apps/` | One folder per demo (`PLAN.md` + Bun app) |
| `skills/project-planning/` | How to plan an MVP before building |
| `tracking/seen-bookmarks.json` | Bookmark ideas: proposed, skipped, built |
| `bunfig.toml` | Shared Bun config (`minimumReleaseAge` = 3 days) |

## Adding a demo

1. Follow **`skills/project-planning/SKILL.md`** and add **`apps/<slug>/PLAN.md`**.
2. Scaffold and build inside **`apps/<slug>/`** only.
3. Open a PR with screenshot and video of the working demo (see `AGENTS.md`).

Interactive UI demos default to **Fable 5**; deployments target a **single Cloudflare Pages** project.
