# Tchin Tchin — App

Implementation of the **Tchin Tchin** wine social app (Brazilian, pt-BR) from the
Claude Design handoff bundle (`tchin-tchin-complete`). The original was a single
HTML file (`Tchin Tchin Refator.html`) that loaded ~100 `.jsx` files via
in-browser Babel, sharing one global scope and registering components on
`window`. This project turns that prototype into a real **Vite + React +
TypeScript** app with proper ES modules.

The product is a 412×892 phone-frame mobile app with stack navigation across
**~100 screens**: onboarding, paladar quiz, Descobrir (discover), Adega (cellar /
diary), Comunidade (feed), Confrarias (wine clubs), events, scanner, harmonizer,
marketplace, expert Q&A, badges, referrals, settings, and more.

## Run

```bash
npm install
npm run dev      # start the dev server (opens http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project layout

```
index.html              # fonts + global CSS/keyframes (ported from the prototype <head>)
src/main.tsx            # entry — renders <TchinApp/> into #root
src/legacy/             # the ~100 ported screen/component modules (auto-converted)
src/legacy/prototype.jsx# TchinApp: phone frame + stack router + all screen routes
src/legacy/tokens.jsx   # design system: colors, type scale, spacing, Icon, logo, skeletons
src/legacy/data.jsx     # mock data (wines, posts, confrarias, events, quiz)
scripts/convert-legacy.mjs  # the prototype -> ESM converter (re-runnable)
scripts/smoke-test.mjs      # headless jsdom mount test
```

## How the conversion works

`scripts/convert-legacy.mjs` reads the prototype files from the extracted bundle
and rewrites each into an ES module:

1. **Inclusion & order** come from the `<script src>` list in
   `Tchin Tchin Refator.html` (the design tool's canvas files —
   `canvas-app`, `design-canvas`, `design-system`, `tweaks-panel`,
   `android-frame` — are excluded; they are the editor, not the product).
2. Each file already ends with `Object.assign(window, { ... })`, which declares
   exactly what it **provides**. Babel scope analysis finds each file's **free
   variables** (what it **needs**). From these the converter emits
   `import { ... } from './provider.jsx'` and `export { ... }`.
3. When two files define the same top-level name, the one loaded **last** in the
   HTML wins — matching the prototype's shared-global runtime exactly.
4. `Object.assign(window, { ... })` calls are **kept** (some code reads data back
   via `window.MOCK_USER` / `window.ACTIVITY_META`) but **moved to the end** of
   each module. The prototype ran under Babel-standalone (`const`→`var`, hoisted),
   so a registration could legally precede the `const`s it referenced; in real
   ESM that is a temporal-dead-zone error, so registrations run after the
   declarations.

To regenerate `src/legacy/` from the bundle, edit `SRC_DIR` in the script if
needed and run `npm run convert`.

### Hand fixes (reproducible via `PATCHES` in the converter)

- **`screens-confraria.jsx`** — `EventosTab` called `go(...)` but never received
  it as a prop (a latent crash in the original when tapping an event card in the
  Eventos tab). `go` is now threaded through.
- Two duplicate object keys in the prototype source (`Itália` in `cards.jsx`,
  `paddingTop` in `screens-app.jsx`) are de-duplicated for a warning-free build.

## Notes on fidelity & next steps

- The ported `src/legacy` modules are JavaScript (`allowJs`, `// @ts-nocheck`):
  the visual output is recreated 1:1, but they are not yet typed. New code
  (entry, future refactors) is TypeScript. Incrementally typing screens and
  extracting `tokens.jsx` into typed theme modules is the natural follow-up.
- Styling is inline-style based (as in the prototype). The single JS chunk is
  ~1.2 MB; code-splitting per route is a sensible later optimization.
- Verified by `npm run build` (108 modules, clean) and `node scripts/smoke-test.mjs`
  (mounts `TchinApp` in jsdom; eagerly initializes every module — proves no
  load-time/import errors anywhere in the graph).
