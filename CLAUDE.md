# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build to dist/ (~110 modules, must pass clean)
node scripts/smoke-test.mjs  # headless smoke test via jsdom — must say SMOKE TEST PASSED
```

> After browser changes, do **Ctrl+Shift+R** (hard refresh) — HMR can serve stale cache.

`npm run convert` re-runs the legacy converter — **do not run it**, it overwrites manual edits in `src/legacy/`.

## Architecture

**Tchin Tchin** is a wine social app (pt-BR, Brasília/DF focus). It renders inside a 412×892 phone frame. The page itself does not scroll; only content inside the frame does.

### Entry & routing

- `index.html` — loads fonts (Inter, Fraunces, JetBrains Mono, Material Symbols) + global CSS (keyframes, reset).
- `src/main.tsx` — renders `<TchinApp initialScreen="onboarding" />`.
- `src/legacy/prototype.jsx` — **core of the app**: phone frame shell + stack navigator. Navigation is done via `go(screen, params)`. Contains the `switch` with ~100 route names.

### `src/legacy/` — all application code lives here

The app was ported from a single-file Claude Design prototype (Babel in the browser, everything in global scope). The converter (`scripts/convert-legacy.mjs`) transformed it into ESM modules; `Object.assign(window, {...})` calls were preserved because some code reads `window.MOCK_USER`, `window.ACTIVITY_META`, `window.__tc*` flags, etc.

Key files:

| File | Role |
|---|---|
| `tokens.jsx` | Design system: palette (`T.c.*`), typography (`T.t.*`), spacing, radii, shadows; helpers `Icon`, `TchinLogo`, `BottlePlaceholder`, skeletons |
| `components.jsx`, `cards.jsx` | Shared UI: Button, Avatar, BottomNav, AppHeader, FAB, WineCard, ConfrariaCard, EventCard… |
| `data.jsx` | Mock data: `MOCK_USER`, `MOCK_WINES`, `MOCK_CONFRARIAS`, `MOCK_EVENTS`, `QUIZ_QUESTIONS`… Also registered on `window`. |
| `onboarding-manager.js` | Central onboarding coordinator — enforces 1 overlay at a time with priority: `post-criacao > confraria-welcome > tour > tutor`. Exposed as `window.TchinOnboarding`. Each overlay calls `claim()`/`release()`. |
| `event-covers.jsx` | Event cover presets, `getEventCover`, `CoverPicker`, `suggestEventNames` |
| `screens-treino-paladar.jsx` | "Treine seu Paladar" feature (Duolingo for wine): localStorage store (`tc.treino.v1`), 7 seed lessons, streak/XP/levels/badges, 5-card lesson flow. Routes: `treino-paladar`, `treino-licao`. |
| `screens-*.jsx`, `f##_##_*.jsx` | Individual screens |

### Palette (do not change)

Defined in `tokens.jsx`. Wine `#722F37`/`#4A1F24`, gold `#D4A574`, background `#FAFAF8`, serif **Fraunces**. A brand manual exists with a different palette — it is reference only for tone/voice, **not** for UI colors.

## Brand voice

- **Vocabulary to use:** confraria, membro, experimentar, descobrir, compartilhar, degustação.
- **Vocabulary to avoid:** usuário, consumidor, premium, expert (as a label), "última chance", "para verdadeiros conhecedores".
- **Tone:** welcoming, curious, celebratory, accessible. Never elitist/intimidating.

## Known decisions

- **Event payment:** free or fixed price per person. No split/rateio. Payments via LACI fintech auto-confirmed; manual payments confirmed by admin.
- **Post-confraria creation tutorial:** implemented as a central modal carousel (not spotlight), because spotlight anchors are on different tabs → black screen freeze.
- **Onboarding layers:** keep all layers (slides, tour, TchinTutor, first-time screens, confraria-welcome, nudges); the coordinator prevents overlap.
