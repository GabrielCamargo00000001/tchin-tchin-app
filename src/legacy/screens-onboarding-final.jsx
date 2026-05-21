/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// Tchin Tchin — Onboarding final (07.01 — 07.06)
// ────────────────────────────────────────────────────────────
// 07.01  WelcomeFinalScreen      — congrats + tour entry
// 07.02–05 Tutorial overlays     — single shared component
// 07.06  CelebrationToast        — top toast, 3s auto-dismiss
//
// The tour overlay is rendered by TchinApp (prototype.jsx) on top of
// whichever tab the user landed on. The tour reads/writes its current step
// from localStorage so a refresh resumes mid-tour.

const TOUR_STORAGE_KEY = 'tc.tour';

const TOUR_STEPS = [
  {
    tab:   'comunidade',
    title: 'Comunidade',
    body:  'Seu feed de descobertas, dúvidas e conversas sobre vinho. Onde você acompanha as pessoas que segue e os experts.',
  },
  {
    tab:   'confrarias',
    title: 'Confrarias',
    body:  'Grupos locais que se encontram pra degustar e aprender juntos. Crie a sua ou entre numa que já existe.',
  },
  {
    tab:   'descobrir',
    title: 'Descobrir',
    body:  'Vinhos selecionados pro seu paladar, scanner de rótulos e harmonização com comida.',
  },
  {
    tab:   'adega',
    title: 'Adega',
    body:  'Sua coleção pessoal. Wishlist, vinhos já provados, estatísticas e diário de degustação.',
  },
];

// Map an intent route to its default tab destination.
const DESTINATION_BY_INTENT = {
  discover_home:               'descobrir',
  diary_empty:                 'adega',
  gps_primer_then_confrarias:  'confrarias',
  gps_primer_then_wizard:      'confrarias',
  skip_to_feed:                'comunidade',
};

function readTourState() {
  try {
    const raw = window.localStorage.getItem(TOUR_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function writeTourState(state) {
  try {
    if (state == null) window.localStorage.removeItem(TOUR_STORAGE_KEY);
    else window.localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// ─── 07.01 WelcomeFinalScreen ─────────────────────────────
function WelcomeFinalScreen({ go, ctx, setCtx, startTour }) {
  const name        = (ctx && ctx.user && ctx.user.name) ? ctx.user.name.split(' ')[0] : 'você';
  const intent      = (typeof window !== 'undefined' && window.__tcLastIntent) || 'skip_to_feed';
  const destination = DESTINATION_BY_INTENT[intent] || 'comunidade';

  // The discover_home intent means the user opted into the discover flow
  // without taking the Paladar quiz — strip paladar from ctx so the descobrir
  // tab renders DescobrirHomeFirstTime instead of the full DescobrirHome.
  // Likewise diary_empty clears the seeded diary so AdegaFirstTime fires.
  React.useEffect(() => {
    if (typeof setCtx !== 'function') return;
    if (intent === 'discover_home') {
      setCtx(c => (c.user && c.user.paladar ? { ...c, user: { ...c.user, paladar: null } } : c));
    }
    if (intent === 'diary_empty') {
      setCtx(c => (c.diary && c.diary.length ? { ...c, diary: [] } : c));
    }
  }, [intent, setCtx]);

  const onStartTour = () => {
    // Persist tour step 0, navigate to destination tab — TchinApp will render
    // the overlay once it sees an active tour in localStorage.
    writeTourState({ destination, step: 0 });
    if (typeof startTour === 'function') startTour({ destination, step: 0 });
    go(destination, { firstTime: true, fromTour: true });
  };

  const onSkipTour = () => {
    writeTourState(null);
    go(destination, { firstTime: true, fromTour: false });
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      // Subtle vertical wash — neutral/50 → burgundy/50 @ 8%
      background: `linear-gradient(180deg, ${T.c.n50} 0%, ${T.c.n50} 35%, rgba(250, 241, 242, 0.85) 100%)`,
      position: 'relative',
    }}>
      {/* Centered hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 32px', textAlign: 'center',
      }}>
        {/* Logo — 64×64 burgundy/700 */}
        <div style={{
          width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TchinLogo size={64} color={T.c.p700}/>
        </div>

        <div style={{ height: 32 }}/>

        {/* h1 Fraunces 32 */}
        <h1 style={{
          margin: 0, maxWidth: 312,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 32, lineHeight: 1.1, fontWeight: 600,
          letterSpacing: '-0.02em', color: T.c.n950,
          textWrap: 'balance',
        }}>
          Bem-vindo, <span style={{ color: T.c.p700 }}>{name}</span>!
        </h1>

        <div style={{ height: 12 }}/>

        {/* body — Geist 14, neutral/700 (closest token n800) */}
        <p style={{
          margin: 0, maxWidth: 296,
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
          textWrap: 'pretty',
        }}>
          Antes de te liberar, te mostro como o app funciona em 30 segundos.
        </p>

        <div style={{ height: 32 }}/>

        {/* 4 dot indicators — all neutral/300 (preview, not progress yet) */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} aria-label="Tour preview · 4 etapas">
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: T.c.n300,
            }}/>
          ))}
        </div>
      </div>

      {/* Fixed bottom CTAs */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <Button variant="primary" size="lg" fullWidth onClick={onStartTour}
          data-route="start_tour"
          trailing={<Icon name="arrow_forward" size={18}/>}>
          Começar tour
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onSkipTour}
          data-route="skip_tour">
          Pular tour, ir direto
        </Button>
      </div>
    </div>
  );
}

// ─── 07.02–05 Shared TutorialTooltip ──────────────────────
// Renders the full overlay (dim + tooltip + invisible nav passthrough zone)
// for a single tour step. The bottom nav itself is rendered by TchinApp;
// we just position the tooltip and triangle to anchor to its target tab.
function TutorialTooltip({
  step, total = 4,
  navHeightPx = 88,           // bottom-nav + system gesture bar (approx)
  frameWidthPx = 412,
  onSkip, onNext, onBack, onDone,
}) {
  const cfg = TOUR_STEPS[step] || TOUR_STEPS[0];

  // Each tab is flex:1 across the nav row. Tab N center x is:
  //   frameWidth * (N + 0.5) / 4
  const tabIndex = ['comunidade', 'confrarias', 'descobrir', 'adega'].indexOf(cfg.tab);
  const tabCenterX = (frameWidthPx * (tabIndex + 0.5)) / 4;

  // Tooltip is 312 wide. Center it on the tab but clamp to viewport ±16.
  const tooltipW = 312;
  const margin   = 16;
  let tooltipLeft = tabCenterX - tooltipW / 2;
  tooltipLeft = Math.max(margin, Math.min(tooltipLeft, frameWidthPx - tooltipW - margin));
  const triangleLeftWithin = tabCenterX - tooltipLeft; // x of triangle inside tooltip

  const isLast = step === total - 1;

  return (
    <div
      // Click-through outside → DO NOT dismiss. Click is absorbed.
      onClick={e => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`tour-title-${step}`}
      style={{
        position: 'absolute', inset: 0, zIndex: 65,
        pointerEvents: 'auto',
      }}>
      {/* Dark overlay — covers entire frame above the bottom nav */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        bottom: navHeightPx,
        background: 'rgba(15,15,15,0.60)',
        animation: 'tcFadeIn 220ms ease',
      }}/>

      {/* Tooltip card — anchored just above the bottom nav */}
      <div style={{
        position: 'absolute',
        left: tooltipLeft,
        bottom: navHeightPx + 14, // 14 = triangle gap
        width: tooltipW,
        background: T.c.n0,
        borderRadius: T.r.lg,
        padding: 16,
        boxShadow: T.el[4],
        fontFamily: T.font,
        animation: 'tcPushIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        {/* Title — body/bold neutral/950 */}
        <div id={`tour-title-${step}`} style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 16, lineHeight: 1.3, fontWeight: 700, color: T.c.n950,
        }}>
          {cfg.title}
        </div>

        <div style={{ height: 8 }}/>

        {/* Body — neutral/700 (n800 token) */}
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
          textWrap: 'pretty',
        }}>
          {cfg.body}
        </div>

        <div style={{ height: 16 }}/>

        {/* Footer row: dots ← → buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === step ? T.c.p500 : T.c.n300,
                transition: 'background 200ms',
              }}/>
            ))}
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isLast ? (
              <>
                <Button variant="ghost" size="sm" onClick={onBack}>Voltar</Button>
                <Button variant="primary" size="sm" onClick={onDone}>Começar a usar</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onSkip}>Pular tour</Button>
                <Button variant="primary" size="sm" onClick={onNext}>Próximo</Button>
              </>
            )}
          </div>
        </div>

        {/* Triangle arrow — 12×8, pointing down at the tab */}
        <div style={{
          position: 'absolute',
          left: triangleLeftWithin - 6,
          bottom: -7,
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `8px solid ${T.c.n0}`,
          filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.08))',
        }}/>
      </div>
    </div>
  );
}

// ─── 07.06 CelebrationToast ───────────────────────────────
function CelebrationToast({ onDismiss, duration = 3000 }) {
  const [exiting, setExiting] = React.useState(false);
  React.useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), duration - 240);
    const t2 = window.setTimeout(() => { if (typeof onDismiss === 'function') onDismiss(); }, duration);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [duration, onDismiss]);
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        top: 16, left: 16, right: 16,
        zIndex: 90,
        background: T.c.p700,
        color: T.c.n0,
        borderRadius: T.r.lg,
        padding: 16,
        boxShadow: T.el[4],
        display: 'flex', alignItems: 'center', gap: 12,
        animation: exiting
          ? 'tcSlideUpOut 240ms ease-in forwards'
          : 'tcSlideDownIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        fontFamily: T.font,
      }}>
      <Icon name="celebration" size={24} color={T.c.n0} fill={1}/>
      <div style={{
        flex: 1, fontSize: 14, lineHeight: 1.4, fontWeight: 500, color: T.c.n0,
      }}>
        Você está pronto! 🍷 &nbsp;Bem-vindo ao Tchin Tchin.
      </div>
    </div>
  );
}

Object.assign(window, {
  WelcomeFinalScreen,
  TutorialTooltip,
  CelebrationToast,
  TOUR_STEPS,
  TOUR_STORAGE_KEY,
  DESTINATION_BY_INTENT,
  readTourState,
  writeTourState,
});


export { CelebrationToast, DESTINATION_BY_INTENT, TOUR_STEPS, TOUR_STORAGE_KEY, TutorialTooltip, WelcomeFinalScreen, readTourState, writeTourState };
