/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button, MatchBadge } from './components.jsx';
import { SkipBanner } from './screens-skip-banner.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// Tchin Tchin — 04.A DescobrirHomeFirstTime
// ────────────────────────────────────────────────────────────
// Destination for intent='discover' (or 'skipped'). Supports two states
// via `paladarComplete`:
//   - false → gray match badges, "Faça o quiz pra ver match", persistent
//             nudge banner (minimizable with D+1 re-appearance)
//   - true  → colored MatchBadge per wine.match, no banner, headline
//             "Pro seu paladar"
//
// Cards in the grape + region grids are filtered by `userInterests` (from
// 03.02), falling back to a curated default set if the user has none.

const LEVEL_HEADLINE = {
  iniciante:     'Mais populares pra quem tá começando',
  intermediario: 'Mais populares pra entusiastas',
  avancado:      'Mais populares pra experts',
};
const PALADAR_HEADLINE = 'Pro seu paladar';

const BANNER_DISMISS_KEY = 'tc.descobrir.bannerPaladar.dismissed_at';
const BANNER_TTL_MS = 24 * 60 * 60 * 1000; // D+1

function isBannerDismissedFresh() {
  try {
    const raw = window.localStorage.getItem(BANNER_DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (!ts) return false;
    return (Date.now() - ts) < BANNER_TTL_MS;
  } catch (e) { return false; }
}
function dismissBannerNow() {
  try { window.localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now())); } catch (e) {}
}

// Default sets when user picked no interests for a category
const DEFAULT_UVAS = [
  { id: 'cabernet_sauvignon', label: 'Cabernet Sauvignon', tint: '#4A1F24' },
  { id: 'malbec',             label: 'Malbec',             tint: '#3F1A1E' },
  { id: 'chardonnay',         label: 'Chardonnay',         tint: '#9A7E32' },
  { id: 'pinot_noir',         label: 'Pinot Noir',         tint: '#722F37' },
];
const DEFAULT_REGIOES = [
  { id: 'mendoza',       label: 'Mendoza',           accent: '#7C2F2F' },
  { id: 'bordeaux',      label: 'Bordeaux',          accent: '#4A1F24' },
  { id: 'vale_vinhedos', label: 'Vale dos Vinhedos', accent: '#5B2730' },
  { id: 'douro',         label: 'Douro',             accent: '#3A1518' },
];

// Lookup tables for the interests picked in 03.02
const UVAS_BY_ID = {
  cabernet_sauvignon: { label: 'Cabernet Sauvignon', tint: '#4A1F24' },
  merlot:             { label: 'Merlot',             tint: '#5C2A30' },
  chardonnay:         { label: 'Chardonnay',         tint: '#9A7E32' },
  pinot_noir:         { label: 'Pinot Noir',         tint: '#722F37' },
  malbec:             { label: 'Malbec',             tint: '#3F1A1E' },
  sauvignon_blanc:    { label: 'Sauvignon Blanc',    tint: '#7A8A4A' },
};
const REGIOES_BY_ID = {
  vale_vinhedos: { label: 'Vale dos Vinhedos', accent: '#2E5734' },
  bordeaux:      { label: 'Bordeaux',          accent: '#4A1F24' },
  toscana:       { label: 'Toscana',           accent: '#8A4A2A' },
  mendoza:       { label: 'Mendoza',           accent: '#6B3540' },
  douro:         { label: 'Douro',             accent: '#5B2730' },
  ribera_duero:  { label: 'Ribera del Duero',  accent: '#6E2B2F' },
};

function track(event, params) {
  try {
    if (typeof window.tcAnalytics === 'function') window.tcAnalytics(event, params);
    else if (typeof window.gtag === 'function')   window.gtag('event', event, params);
  } catch (e) {}
}

function DescobrirHomeFirstTime({
  userLevel = 'iniciante',
  userInterests = [],
  paladarComplete = false,
  user,
  wines,
  onPaladarQuizStart,
  onWineCardTap,
  onScannerOpen,
  onNotifOpen,
  onProfileOpen,
  // 06.banner-skip integration — set when user came via skip_to_feed intent
  skipBannerDay,            // number | null | undefined
  onSkipBannerIntent,       // (intent) => void
}) {
  const headline = paladarComplete ? PALADAR_HEADLINE : (LEVEL_HEADLINE[userLevel] || LEVEL_HEADLINE.iniciante);
  const featured = (wines || []).slice(0, 5);

  // Banner visible unless minimized within the D+1 window or paladar done
  const [bannerHidden, setBannerHidden] = React.useState(() => isBannerDismissedFresh() || paladarComplete);
  const showBanner = !bannerHidden && !paladarComplete;

  const onBannerTap = () => {
    track('quiz_paladar_start', { from_entry: 'banner_descobrir' });
    if (typeof onPaladarQuizStart === 'function') onPaladarQuizStart();
  };
  const onBannerClose = (e) => {
    e.stopPropagation();
    dismissBannerNow();
    setBannerHidden(true);
    track('banner_paladar_dismissed', { from: 'descobrir' });
  };
  const onGrayBadgeTap = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    track('quiz_paladar_start', { from_entry: 'card_score_gray' });
    if (typeof onPaladarQuizStart === 'function') onPaladarQuizStart();
  };

  // Filter grape + region grids by user interests, fall back to defaults
  const uvas = React.useMemo(() => {
    const picked = (userInterests || [])
      .filter(id => UVAS_BY_ID[id])
      .map(id => ({ id, ...UVAS_BY_ID[id] }));
    return (picked.length ? picked : DEFAULT_UVAS).slice(0, 4);
  }, [userInterests]);
  const regioes = React.useMemo(() => {
    const picked = (userInterests || [])
      .filter(id => REGIOES_BY_ID[id])
      .map(id => ({ id, ...REGIOES_BY_ID[id] }));
    return (picked.length ? picked : DEFAULT_REGIOES).slice(0, 4);
  }, [userInterests]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden', position: 'relative' }}>
      {/* ── White top bar — logo · bell · avatar ── */}
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
            background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative',
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
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>

        {/* 06.banner-skip — only renders for skip users within 7 days */}
        {typeof skipBannerDay === 'number' && skipBannerDay <= 7 && typeof SkipBanner === 'function' && (
          <SkipBanner
            daysSinceSkip={skipBannerDay}
            onIntentSelected={onSkipBannerIntent}
            onDismiss={() => {}}
          />
        )}

        {/* ── Sticky paladar nudge banner ── */}
        {showBanner && (
          <button
            type="button"
            onClick={onBannerTap}
            aria-label="Fazer o quiz de paladar"
            style={{
              position: 'sticky', top: 0, zIndex: 4,
              width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14, background: T.c.p50,
              border: 'none', borderBottom: `1px solid ${T.c.p100}`,
              cursor: 'pointer', fontFamily: T.font,
            }}>
            <div style={{
              width: 40, height: 40, flexShrink: 0,
              borderRadius: T.r.md, background: T.c.p100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="psychology" size={24} color={T.c.p700} weight={500}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                fontSize: 14, lineHeight: 1.3, fontWeight: 700, color: T.c.n950,
                marginBottom: 2,
              }}>
                Descubra seu DNA de paladar
              </div>
              <div style={{
                fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                fontSize: 12, lineHeight: 1.4, color: T.c.n800,
              }}>
                5 perguntas. 90 segundos. Match Score em todos os vinhos.
              </div>
            </div>
            <Icon name="chevron_right" size={16} color={T.c.p700} style={{ flexShrink: 0 }}/>
            {/* Discrete minimize X */}
            <span
              role="button"
              tabIndex={0}
              aria-label="Minimizar banner"
              onClick={onBannerClose}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onBannerClose(e); }}
              style={{
                position: 'absolute', top: 8, right: 10,
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.c.p700, opacity: 0.6, cursor: 'pointer',
                background: 'transparent',
              }}>
              <Icon name="close" size={14}/>
            </span>
          </button>
        )}

        <div style={{ height: 16 }}/>

        {/* ── "Mais populares" / "Pro seu paladar" carousel ── */}
        <section style={{ paddingLeft: 16, paddingRight: 0 }}>
          <h3 style={{
            margin: 0, marginBottom: 12, marginRight: 16,
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 20, lineHeight: 1.25, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            {headline}
          </h3>
          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto', overflowY: 'hidden',
            paddingBottom: 8, paddingRight: 16,
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
          }}>
            {featured.map(w => (
              <PrimerWineCard
                key={w.id} wine={w}
                paladarComplete={paladarComplete}
                onCardTap={() => onWineCardTap && onWineCardTap(w.id)}
                onGrayBadgeTap={onGrayBadgeTap}
              />
            ))}
          </div>
        </section>

        <div style={{ height: 24 }}/>

        {/* ── "Suas uvas favoritas" 2×2 grid ── */}
        <section style={{ padding: '0 16px' }}>
          <h3 style={{
            margin: 0, marginBottom: 12,
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 20, lineHeight: 1.25, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
          }}>
            Suas uvas favoritas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {uvas.map(u => (
              <GridTile
                key={u.id} label={u.label} tint={u.tint}
                onClick={() => onWineCardTap && onWineCardTap(`uva:${u.id}`)}
              />
            ))}
          </div>
        </section>

        <div style={{ height: 24 }}/>

        {/* ── "Por região" 2×2 grid ── */}
        <section style={{ padding: '0 16px' }}>
          <h3 style={{
            margin: 0, marginBottom: 12,
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 20, lineHeight: 1.25, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
          }}>
            Explorar por região
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {regioes.map(r => (
              <GridTile
                key={r.id} label={r.label} tint={r.accent}
                onClick={() => onWineCardTap && onWineCardTap(`region:${r.id}`)}
              />
            ))}
          </div>
        </section>

        <div style={{ height: 24 }}/>

        {/* ── Scanner CTA ── */}
        <section style={{ padding: '0 16px 24px' }}>
          <div style={{
            background: T.c.p700, color: T.c.n0,
            borderRadius: T.r.lg, padding: 20,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: T.el[2],
          }}>
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              borderRadius: T.r.md, background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="qr_code_scanner" size={32} color={T.c.n0}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                fontSize: 14, lineHeight: 1.4, fontWeight: 500, color: T.c.n0,
              }}>
                Scaneie um rótulo. Saiba se é seu estilo.
              </div>
            </div>
            <Button
              variant="secondary" size="sm"
              onClick={onScannerOpen}
              style={{ background: T.c.n0, color: T.c.p700, border: 'none', flexShrink: 0 }}>
              Abrir scanner
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── PrimerWineCard — 160×220 ─────────────────────────────
function PrimerWineCard({ wine, paladarComplete, onCardTap, onGrayBadgeTap }) {
  const year = (wine.name && wine.name.match(/(20\d{2})/) || [])[1] || '';
  const priceStr = wine.price != null
    ? `R$ ${wine.price.toFixed(0).replace('.', ',')}`
    : '';
  const subtitle = [wine.producer, year, priceStr].filter(Boolean).join(' · ');

  return (
    <div
      onClick={onCardTap}
      data-wine-id={wine.id}
      style={{
        width: 160, height: 220, flexShrink: 0,
        background: T.c.n0, border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', fontFamily: T.font, scrollSnapAlign: 'start',
      }}>
      {/* Bottle image placeholder — neutral/100 bg, 120 tall */}
      <div style={{
        width: '100%', height: 120, flexShrink: 0,
        background: T.c.n100,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 14px)`,
        }}/>
        <svg width="44" height="80" viewBox="0 0 44 80" fill="none" style={{ position: 'relative', opacity: 0.55 }}>
          <path d="M16 2 L28 2 L28 18 Q34 22 34 34 L34 70 Q34 76 28 76 L16 76 Q10 76 10 70 L10 34 Q10 22 16 18 Z"
                fill={T.c.n400}/>
        </svg>
        <span style={{
          position: 'absolute', bottom: 6, left: 8,
          fontFamily: T.mono, fontSize: 9, fontWeight: 500,
          color: T.c.n600, letterSpacing: '0.3px', textTransform: 'uppercase',
        }}>Wine Image</span>
      </div>
      {/* Content padding 12 */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 13, lineHeight: 1.3, fontWeight: 700, color: T.c.n950,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{wine.name}</div>
        <div style={{ height: 4 }}/>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 12, lineHeight: 1.3, color: T.c.n600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{subtitle}</div>
        <div style={{ height: 8 }}/>
        {paladarComplete && wine.match != null ? (
          <MatchBadge score={wine.match} size="sm" variant="pill"/>
        ) : (
          /* Gray match badge — copy oficial do US-12-1-03 */
          <button
            type="button"
            onClick={onGrayBadgeTap}
            data-route="quiz_paladar_from_score"
            style={{
              alignSelf: 'flex-start', maxWidth: '100%',
              background: T.c.n100, color: T.c.n600,
              padding: '6px 10px', borderRadius: T.r.full,
              border: 'none', cursor: 'pointer',
              fontFamily: '"Geist", "Inter", system-ui, sans-serif',
              fontSize: 11, lineHeight: 1.3, fontWeight: 500,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
            <Icon name="psychology" size={12} color={T.c.n600}/>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Faça o quiz pra ver match
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── GridTile — used by both grape and region grids ───────
function GridTile({ label, tint, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 100, padding: 0, border: 'none', cursor: 'pointer',
        borderRadius: T.r.md, overflow: 'hidden', position: 'relative',
        background: `linear-gradient(135deg, ${tint} 0%, ${T.c.p900} 100%)`,
        fontFamily: T.font, textAlign: 'center',
      }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4), transparent 40%),
                          radial-gradient(circle at 80% 70%, rgba(0,0,0,0.3), transparent 50%)`,
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)',
      }}/>
      <div style={{
        position: 'relative', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 12px',
      }}>
        <div style={{
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 17, lineHeight: 1.2, fontWeight: 600,
          color: T.c.n0, letterSpacing: '-0.01em',
          textShadow: '0 1px 3px rgba(0,0,0,0.35)',
        }}>{label}</div>
      </div>
    </button>
  );
}

Object.assign(window, { DescobrirHomeFirstTime, PrimerWineCard, GridTile, LEVEL_HEADLINE, PALADAR_HEADLINE });


export { BANNER_DISMISS_KEY, BANNER_TTL_MS, DEFAULT_REGIOES, DEFAULT_UVAS, DescobrirHomeFirstTime, GridTile, LEVEL_HEADLINE, PALADAR_HEADLINE, PrimerWineCard, REGIOES_BY_ID, UVAS_BY_ID, dismissBannerNow, isBannerDismissedFresh, track };
