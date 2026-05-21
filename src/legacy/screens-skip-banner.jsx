/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 06.banner-skip (SkipBanner)
// ────────────────────────────────────────────────────────────
// Sticky banner shown to users with onboarding_intent='skipped' during the
// first 7 days. Asks them to declare intent retroactively. Tapping the
// banner opens a compact 5-option modal; tapping the X dismisses for 24h.
//
// Visibility rules (caller is responsible — usually parent screen):
//   showIf = intent === 'skipped' && daysSinceSkip <= 7 && !dismissedInLast24h
//
// Persistence:
//   localStorage['tc.skipBanner.dismissedAt'] — ms timestamp of last X tap

const SKIP_BANNER_KEY = 'tc.skipBanner.dismissedAt';
const SKIP_BANNER_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function isSkipBannerDismissedFresh() {
  try {
    const raw = window.localStorage.getItem(SKIP_BANNER_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (!ts) return false;
    return (Date.now() - ts) < SKIP_BANNER_TTL_MS;
  } catch (e) { return false; }
}
function dismissSkipBannerNow() {
  try { window.localStorage.setItem(SKIP_BANNER_KEY, String(Date.now())); } catch (e) {}
}
function resetSkipBanner() {
  try { window.localStorage.removeItem(SKIP_BANNER_KEY); } catch (e) {}
}

// 5 compact intent options — same IDs as Tela de Intenção
const COMPACT_INTENTS = [
  { id: 'discover_home',              icon: 'local_bar',     label: 'Descobrir vinhos pro meu paladar' },
  { id: 'diary_empty',                icon: 'menu_book',     label: 'Registrar um vinho que provei' },
  { id: 'learn',                      icon: 'school',        label: 'Aprender sobre vinho' },
  { id: 'gps_primer_then_confrarias', icon: 'groups',        label: 'Participar de uma confraria' },
  { id: 'gps_primer_then_wizard',     icon: 'construction',  label: 'Criar minha própria confraria' },
];

function trackSkipBanner(event, params) {
  try {
    if (typeof window.tcAnalytics === 'function') window.tcAnalytics(event, params);
    else if (typeof window.gtag === 'function')   window.gtag('event', event, params);
  } catch (e) {}
}

function SkipBanner({
  daysSinceSkip = 0,
  onIntentSelected,
  onDismiss,
}) {
  const [hidden, setHidden] = React.useState(() => isSkipBannerDismissedFresh());
  const [showModal, setShowModal] = React.useState(false);

  // Fire "shown" once on first mount of this banner.
  // Hooks MUST run unconditionally — gating happens AFTER all hooks.
  React.useEffect(() => {
    trackSkipBanner('skip_banner_shown', { day: daysSinceSkip });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide if past the 7-day window or already dismissed this 24h
  if (daysSinceSkip > 7 || hidden) return null;

  const onBannerTap = () => {
    trackSkipBanner('skip_banner_clicked', { day: daysSinceSkip });
    setShowModal(true);
  };

  const onCloseTap = (e) => {
    e.stopPropagation();
    trackSkipBanner('skip_banner_dismissed', { day: daysSinceSkip });
    dismissSkipBannerNow();
    setHidden(true);
    if (typeof onDismiss === 'function') onDismiss();
  };

  const onIntentTap = (intent) => {
    setShowModal(false);
    setHidden(true);
    if (typeof onIntentSelected === 'function') onIntentSelected(intent);
  };

  return (
    <>
      <button
        type="button"
        onClick={onBannerTap}
        aria-label="Declarar intenção"
        style={{
          // Amber tones — using warning palette (w100/w700) as closest
          // tokenized analog to spec's amber/50, amber/200, amber/700.
          position: 'sticky', top: 0, zIndex: 4,
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 12, background: T.c.w100,
          border: 'none', borderBottom: `1px solid rgba(237, 108, 2, 0.30)`,
          cursor: 'pointer', fontFamily: T.font,
        }}>
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          borderRadius: T.r.sm, background: 'rgba(237, 108, 2, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="lightbulb" size={20} color={T.c.w700} fill={1}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 13, lineHeight: 1.3, fontWeight: 700, color: T.c.n950,
            marginBottom: 2,
          }}>
            Ajuda a gente a te conhecer melhor
          </div>
          <div style={{
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 12, lineHeight: 1.4, color: T.c.n800,
          }}>
            O que você busca no Tchin?
          </div>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label="Fechar"
          onClick={onCloseTap}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCloseTap(e); }}
          style={{
            width: 24, height: 24, flexShrink: 0,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.c.n600, cursor: 'pointer', background: 'transparent',
          }}>
          <Icon name="close" size={16}/>
        </span>
      </button>

      {showModal && (
        <SkipIntentModal
          onPick={onIntentTap}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// ─── Compact intent picker modal ──────────────────────────
function SkipIntentModal({ onPick, onCancel }) {
  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'absolute', inset: 0, zIndex: 80,
        background: 'rgba(15,15,15,0.60)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'tcFadeIn 180ms ease',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skip-intent-title"
        style={{
          width: '100%',
          background: T.c.n0,
          borderTopLeftRadius: T.r.lg, borderTopRightRadius: T.r.lg,
          padding: '12px 16px 16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          animation: 'tcSlideUp 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontFamily: T.font,
        }}>
        <div style={{
          width: 32, height: 4, borderRadius: 2,
          background: T.c.n300, margin: '0 auto 12px',
        }}/>
        <h3 id="skip-intent-title" style={{
          margin: 0, marginBottom: 12,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 18, lineHeight: 1.25, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          O que você busca no Tchin?
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {COMPACT_INTENTS.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => onPick(opt.id)}
              data-intent={opt.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 4px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left',
                borderTop: i === 0 ? 'none' : `1px solid ${T.c.n100}`,
                fontFamily: T.font,
                WebkitTapHighlightColor: 'transparent',
              }}>
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                borderRadius: T.r.sm, background: T.c.p50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={opt.icon} size={18} color={T.c.p700} weight={500}/>
              </div>
              <div style={{
                flex: 1, minWidth: 0,
                fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                fontSize: 14, lineHeight: 1.35, fontWeight: 500, color: T.c.n950,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {opt.label}
              </div>
              <Icon name="chevron_right" size={18} color={T.c.n400} style={{ flexShrink: 0 }}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SkipBanner, SkipIntentModal,
  SKIP_BANNER_KEY, COMPACT_INTENTS,
  isSkipBannerDismissedFresh, dismissSkipBannerNow, resetSkipBanner,
});


export { COMPACT_INTENTS, SKIP_BANNER_KEY, SKIP_BANNER_TTL_MS, SkipBanner, SkipIntentModal, dismissSkipBannerNow, isSkipBannerDismissedFresh, resetSkipBanner, trackSkipBanner };
