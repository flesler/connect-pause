# Agent: migrate a dependent from connect-pause 0.x to 1.0.0

For Cursor agents opening upgrade PRs on downstream repos.

**Upstream references:**

- [backwards-compatibility.md](./backwards-compatibility.md)
- [README](../README.md)

**npm:** `connect-pause@^1.0.0` (types bundled; no `@types/connect-pause` on npm)

---

## Preconditions

- Fresh clone under `/tmp` only.
- Local `npm ci` / `npm install` in the dependent repo only. **No global installs.** Abort and report if global tooling is required.
- Skip repos with no commits in ~2+ years.

---

## Decision tree

```bash
cd /tmp/<repo>
rg -n "connect-pause" package.json package-lock.json yarn.lock pnpm-lock.yaml 2>/dev/null
rg -n "require\(['\"]connect-pause|from ['\"]connect-pause" --glob '!node_modules'
```

| Finding | Action |
|---------|--------|
| `const pause = require('connect-pause')` only | Bump `package.json` to `^1.0.0`, refresh lockfile |
| ESM `import pause from 'connect-pause'` | Same bump; API unchanged |
| Deep imports (`connect-pause/...`) | None known; fix to package root if found |

---

## Checklist

- [ ] Clone to `/tmp/<name>`
- [ ] Branch `chore/bump-connect-pause-1`
- [ ] Set `connect-pause` to `^1.0.0`
- [ ] Run install in repo to update lockfile if present
- [ ] No source edits for typical `require('connect-pause')` usage
- [ ] Run project test/lint gates; abort if blocked
- [ ] Fork + PR against upstream

---

## PR body template

```markdown
## Summary
Bump `connect-pause` from 0.x to `^1.0.0`.

Usage here is `require('connect-pause')` — no source changes. 1.0.0 is API-compatible and ships TypeScript types.

https://github.com/flesler/connect-pause/blob/main/docs/backwards-compatibility.md

## Test plan
- [ ] CI passes
```

---

## Good targets (verify `pushed_at` first)

| Repo | Pin | Notes |
|------|-----|-------|
| AngularBootCamp/abc | `0.1.0` | `require` in server modules |
| jaktestowac/gad-gui-api-demo | `^0.1.0` | json-server delay router |

Discover more:

```bash
.cursor/skills/gh-backlog/scripts/npm-dependents.sh connect-pause --limit 40 --enrich
```

Filter repos with `pin != null` and recent `pushed_at`.
