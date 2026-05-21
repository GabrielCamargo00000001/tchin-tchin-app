/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { PostCard } from './cards.jsx';
import { SkipBanner } from './screens-skip-banner.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// Tchin Tchin — 06.E FeedFirstTime
// ────────────────────────────────────────────────────────────
// Comunidade landing for users who *skipped* intent declaration (05.02
// confirm "Seguir sem escolher"). Wraps the regular feed with a sticky
// "Primeiros passos" card that proposes the same 4 paths from 04.01.
//
// Sticky card dismisses when ANY of these is true:
//   1. User closes manually
//   2. User completes ≥2 of the 4 quick-actions
//   3. 3rd time the user views this screen (D+3 heuristic)

const FEED_FIRST_KEY = 'tc.feed.primeirosPassos';

function readFeedFirstState() {
  try { return JSON.parse(window.localStorage.getItem(FEED_FIRST_KEY) || 'null') || { views: 0, done: [], closed: false }; }
  catch (e) { return { views: 0, done: [], closed: false }; }
}
function writeFeedFirstState(s) {
  try { window.localStorage.setItem(FEED_FIRST_KEY, JSON.stringify(s)); }
  catch (e) {}
}

const QUICK_ACTIONS = [
  { id: 'paladar',    icon: 'psychology',  label: 'Descubra seu paladar (90s)' },
  { id: 'registrar',  icon: 'menu_book',   label: 'Registre seu primeiro vinho' },
  { id: 'confrarias', icon: 'groups',      label: 'Encontre uma confraria perto' },
  { id: 'descobrir',  icon: 'local_bar',   label: 'Veja vinhos populares no app' },
];

function FeedFirstTime({
  userLevel = 'iniciante',
  user,
  posts,
  onQuickAction,
  onPostTap,
  onPostLike,
  onPostComment,
  onCloseSticky,
  onNotifOpen,
  onProfileOpen,
  // 06.banner-skip integration
  skipBannerDay,
  onSkipBannerIntent,
}) {
  // Local state mirrors persisted state — bumps view counter on mount.
  const [state, setState] = React.useState(() => {
    const s = readFeedFirstState();
    const next = { ...s, views: s.views + 1 };
    writeFeedFirstState(next);
    return next;
  });

  // Sticky visible until one of the 3 dismissal conditions trip.
  const stickyVisible = !state.closed
                     && state.done.length < 2
                     && state.views < 3;

  const closeSticky = () => {
    const next = { ...state, closed: true };
    setState(next);
    writeFeedFirstState(next);
    if (typeof onCloseSticky === 'function') onCloseSticky();
  };

  const onAction = (id) => {
    if (!state.done.includes(id)) {
      const next = { ...state, done: [...state.done, id] };
      setState(next);
      writeFeedFirstState(next);
    }
    if (typeof onQuickAction === 'function') onQuickAction(id);
  };

  // Feed: lightweight bias toward "iniciante" posts for low-level users.
  // For higher levels we keep chronological order. (Subtle, not destructive.)
  const sortedPosts = React.useMemo(() => {
    if (!posts) return [];
    if (userLevel !== 'iniciante') return posts;
    // Promote posts tagged iniciante, keep order otherwise (stable bias).
    const isBeginner = p => /#?iniciante|comeca|começa|first|inici/i.test(p.content || '');
    return [...posts].sort((a, b) => (isBeginner(b) ? 1 : 0) - (isBeginner(a) ? 1 : 0));
  }, [posts, userLevel]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden', position: 'relative' }}>
      {/* ── White top bar — logo · bell · avatar (matches 06.A / 06.B) ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: T.c.n0,
        borderBottom: `1px solid ${T.c.n100}`,
        flexShrink: 0, zIndex: 5,
      }}>
        <TchinLogo size={28} withWordmark color={T.c.p700}/>
        <div style={{ flex: 1 }}/>
        <button
          onClick={onNotifOpen}
          aria-label="Notificações"
          style={{
            width: 40, height: 40, borderRadius: T.r.full,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            position: 'relative',
          }}>
          <Icon name="notifications" size={22} color={T.c.n800}/>
          <span style={{
            position: 'absolute', top: 6, right: 8,
            width: 8, height: 8, borderRadius: '50%',
            background: T.c.p700, border: `2px solid ${T.c.n0}`,
          }}/>
        </button>
        <button
          onClick={onProfileOpen}
          aria-label="Seu perfil"
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: T.c.n300, color: T.c.n800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: 700,
          }}>
          {user && user.initials ? user.initials : '·'}
        </button>
      </header>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>

        {/* 06.banner-skip — sticky at top for skip users within 7 days */}
        {typeof skipBannerDay === 'number' && skipBannerDay <= 7 && typeof SkipBanner === 'function' && (
          <SkipBanner
            daysSinceSkip={skipBannerDay}
            onIntentSelected={onSkipBannerIntent}
            onDismiss={() => {}}
          />
        )}

        <div style={{ padding: '16px 16px 24px' }}>

        {/* Sticky "Primeiros passos" card */}
        {stickyVisible && (
          <PrimeirosPassosCard
            done={state.done}
            onAction={onAction}
            onClose={closeSticky}
          />
        )}

        {stickyVisible && <div style={{ height: 16 }}/>}

        {/* Feed posts — uses the existing PostCard component */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sortedPosts.map(p => (
            <div key={p.id} onClick={() => onPostTap && onPostTap(p)} style={{ cursor: 'pointer' }}>
              <PostCard
                post={p}
                onLike={(e) => { if (e && e.stopPropagation) e.stopPropagation(); onPostLike && onPostLike(p.id); }}
                onComment={() => onPostComment && onPostComment(p)}
              />
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

// ─── PrimeirosPassosCard ──────────────────────────────────
function PrimeirosPassosCard({ done, onAction, onClose }) {
  return (
    <section
      aria-label="Primeiros passos"
      style={{
        background: T.c.p50,
        border: `1px solid ${T.c.p100}`,
        borderRadius: T.r.lg,
        padding: 16,
        fontFamily: T.font,
      }}>
      {/* Top row — title + close */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <h4 style={{
          margin: 0, flex: 1,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 18, lineHeight: 1.25, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Por onde quer começar?
        </h4>
        <button
          onClick={onClose}
          aria-label="Fechar primeiros passos"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '2px 4px',
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 12, lineHeight: 1.3, fontWeight: 600,
            color: T.c.p700,
          }}>
          Fechar
        </button>
      </div>

      <div style={{ height: 8 }}/>

      {/* Subtitle */}
      <p style={{
        margin: 0,
        fontFamily: '"Geist", "Inter", system-ui, sans-serif',
        fontSize: 14, lineHeight: 1.5, color: T.c.n800,
      }}>
        Algumas sugestões pra você descobrir o app:
      </p>

      <div style={{ height: 12 }}/>

      {/* 4 quick-action rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {QUICK_ACTIONS.map((a, i) => {
          const isDone = done.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => onAction(a.id)}
              data-action={a.id}
              data-done={isDone}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 4px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left',
                borderTop: i === 0 ? 'none' : `1px solid ${T.c.p100}`,
                fontFamily: T.font,
              }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                borderRadius: T.r.sm, background: isDone ? T.c.p100 : T.c.n0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${T.c.p100}`,
                position: 'relative',
              }}>
                <Icon
                  name={isDone ? 'check' : a.icon}
                  size={20}
                  color={T.c.p700}
                  weight={500}
                  fill={isDone ? 1 : 0}
                />
              </div>
              <div style={{
                flex: 1, minWidth: 0,
                fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                fontSize: 14, lineHeight: 1.4, fontWeight: 500,
                color: isDone ? T.c.n600 : T.c.n950,
                textDecoration: isDone ? 'line-through' : 'none',
                textDecorationColor: T.c.n400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {a.label}
              </div>
              {!isDone && <Icon name="chevron_right" size={20} color={T.c.p700} style={{ flexShrink: 0 }}/>}
            </button>
          );
        })}
      </div>

      {/* Progress hint — shows how many of 4 are done, encouraging completion */}
      {done.length > 0 && (
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: `1px solid ${T.c.p100}`,
          fontFamily: T.mono, fontSize: 11, fontWeight: 500,
          color: T.c.p700, letterSpacing: '0.3px',
          textAlign: 'center',
        }}>
          {done.length} de {QUICK_ACTIONS.length} concluído{done.length > 1 ? 's' : ''}
        </div>
      )}
    </section>
  );
}

Object.assign(window, { FeedFirstTime, PrimeirosPassosCard, QUICK_ACTIONS, FEED_FIRST_KEY, readFeedFirstState, writeFeedFirstState });


export { FEED_FIRST_KEY, FeedFirstTime, PrimeirosPassosCard, QUICK_ACTIONS, readFeedFirstState, writeFeedFirstState };
