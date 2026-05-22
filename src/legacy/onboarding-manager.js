/* eslint-disable */
// Central onboarding coordinator.
//
// The app has several onboarding overlays (the guided tour, the auto-fired
// TchinTutor, the post-creation tutorial, ...). Some live in the app shell and
// some inside individual screens, so before this they could stack on top of each
// other (e.g. creating the first confraria/event showed the post-creation
// tutorial AND the TchinTutor at once).
//
// This module enforces "one overlay at a time": each overlay `claim()`s a slot
// while visible. A lower-priority overlay won't show while a higher-or-equal
// priority one is active (`isBlocked`). It lives on `window` so screen-level
// overlays and the app shell can coordinate across module boundaries.

const TC_ONBOARDING_PRIORITY = {
  'post-criacao': 100, // tutorial pós-criação de confraria/evento (mais completo)
  'confraria-welcome': 90,
  'tour': 80, // tour guiado com tooltips
  'tutor': 10, // TchinTutor disparado automaticamente por tela
};

const TchinOnboarding = {
  _claims: new Set(),
  claim(id) {
    this._claims.add(id);
  },
  release(id) {
    this._claims.delete(id);
  },
  // Is some OTHER onboarding of equal-or-higher priority active, blocking `id`?
  isBlocked(id) {
    const p = TC_ONBOARDING_PRIORITY[id] != null ? TC_ONBOARDING_PRIORITY[id] : 0;
    for (const c of this._claims) {
      if (c === id) continue;
      const pc = TC_ONBOARDING_PRIORITY[c] != null ? TC_ONBOARDING_PRIORITY[c] : 0;
      if (pc >= p) return true;
    }
    return false;
  },
  isBusy() {
    return this._claims.size > 0;
  },
};

if (typeof window !== 'undefined') window.TchinOnboarding = TchinOnboarding;

export { TchinOnboarding, TC_ONBOARDING_PRIORITY };
