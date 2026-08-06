# Backwards compatibility

Audit of real-world `connect-pause` usage (GitHub code search, npm dependents).

## Import patterns

| Pattern | 0.1.0 | 1.0.0 | Notes |
|---|---|---|---|
| `const pause = require('connect-pause')` | ✅ | ✅ | CJS factory patch |
| `pause(1000)` / `pause(1000, err)` | ✅ | ✅ | Same API |
| `import pause from 'connect-pause'` | — | ✅ | ESM default export |
| `import { pause } from 'connect-pause'` | — | ✅ | Named export (source + dist) |
| `require('connect-pause').pause` | — | ✅ | Static alias on factory |

No deep imports, browser/IIFE consumers, or `@types/connect-pause` on npm.

## Audit commands

```bash
PKG=connect-pause

npm view "$PKG" version downloads repository
gh search code "require('$PKG')" --limit 50
gh search code "from '$PKG'" --limit 50
```

## Smoke tests (after `npm run build`)

```bash
node -e "const p=require('./dist/connect-pause.cjs'); console.assert(typeof p==='function'&&p===p.pause)"
node --input-type=module -e "import p from './dist/connect-pause.js'; console.assert(typeof p==='function'&&p===p.pause)"
```
