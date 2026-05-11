# Skill Registry — TuEstudio Frontend

**Project**: TuEstudio (React 19 + TypeScript + Vite + Tailwind)
**Generated**: 2026-05-11

## User Skills

| Skill | Trigger |
|-------|---------|
| `sdd-init` | Initialize SDD context in project |
| `sdd-explore` | Explore/investigate an idea before committing |
| `sdd-propose` | Create a change proposal |
| `sdd-spec` | Write specifications with scenarios |
| `sdd-design` | Create technical design document |
| `sdd-tasks` | Break change into implementation tasks |
| `sdd-apply` | Implement tasks from the change |
| `sdd-verify` | Validate implementation against specs |
| `sdd-archive` | Archive a completed change |
| `branch-pr` | Create pull request (issue-first) |
| `work-unit-commits` | Atomic commit discipline |
| `chained-pr` | Split large changes into stacked PRs (>400 lines) |
| `comment-writer` | Warm, direct PR/issue comments |
| `cognitive-doc-design` | Reader-friendly documentation |
| `judgment-day` | Adversarial dual-agent code review |
| `simplify` | Review changed code for reuse, quality, efficiency |
| `tdd` | Red-green-refactor TDD loop (unavailable: no test runner) |

## Project Conventions

No `agents.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, or `.cursorrules` at project root. Only `README.md` and `DESIGN.md` (design doc).

## Compact Rules

### React/TypeScript conventions
- **Tailwind tokens**: `canvas`, `surface-card`, `surface-soft`, `hairline`, `primary`, `primary-active`, `muted`, `ink`, `on-dark`, `on-dark-soft`, `error`, `success`
- **Icons**: Material Symbols Outlined (`<span className="material-symbols-outlined">name</span>`)
- **Fonts**: `font-serif` (headings/editorial), `font-sans` (body/UI)
- **API layer**: `src/api/client.ts` → `apiFetch` wrapper; types in `src/api/types.ts`; base URL via `import.meta.env.VITE_API_URL ?? 'http://localhost:8080'`
- **Auth**: JWT stored in `localStorage['auth_session']` with `{ token, role, userId, name }`; role is `STUDENT` | `TEACHER`; OAuth callback at `/oauth2/callback?token=<jwt>`
- **Routes**: declared in `src/App.tsx`
- **No test runner installed** — do NOT generate test files unless user installs vitest first

### Workflow
- Conventional commits only, NO `Co-Authored-By` or AI attribution
- Never run `npm run build` after changes (per global rules)
- Use `bat`/`rg`/`fd`/`sd`/`eza` instead of `cat`/`grep`/`find`/`sed`/`ls` when in bash
