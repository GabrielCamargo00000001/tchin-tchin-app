/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { TourTooltip } from './screens-tour-adega.jsx';
import { T } from './tokens.jsx';

// Tchin Tchin — 05.Diário Tour (3 frames)
// ────────────────────────────────────────────────────────────
// Fires on first visit to the Diário tab (outside onboarding). Spotlight
// pattern + tooltip card mirror TourAdega — same TourTooltip component.
//
// Anchors read from the DOM:
//   [data-tour-anchor="diario-add-button"] → step 1 — FAB
//   [data-tour-anchor="diario-timeline"]   → step 2 — timeline
//   [data-tour-anchor="diario-stats"]      → step 3 — stats card
//
// State persisted to localStorage['tc.tours.seen.diario'].

const TOUR_DIARIO_KEY = 'tc.tours.seen.diario';

function isDiarioTourSeen() {
  try { return window.localStorage.getItem(TOUR_DIARIO_KEY) === 'true'; }
  catch (e) { return false; }
}
function markDiarioTourSeen() {
  try { window.localStorage.setItem(TOUR_DIARIO_KEY, 'true'); } catch (e) {}
}
function resetDiarioTour() {
  try { window.localStorage.removeItem(TOUR_DIARIO_KEY); } catch (e) {}
}

const TOUR_DIARIO_STEPS = [
  {
    anchor: 'diario-add-button',
    place:  'above',
    radius: 9999,
    pad:    8,
    body:   'Toca aqui pra registrar um vinho que acabou de provar.',
    primary: 'Próximo',
  },
  {
    anchor: 'diario-timeline',
    place:  'below',
    radius: 14,
    pad:    6,
    body:   'Seu histórico em ordem cronológica. Pode filtrar, buscar, revisitar.',
    primary: 'Próximo',
  },
  {
    anchor: 'diario-stats',
    place:  'below',
    radius: 14,
    pad:    6,
    body:   'Stats vivas da sua jornada — atualizam a cada registro.',
    primary: 'Entendi',
  },
];

function trackDiario(event, params) {
  try {
    if (typeof window.tcAnalytics === 'function') window.tcAnalytics(event, params);
    else if (typeof window.gtag === 'function')   window.gtag('event', event, params);
  } catch (e) {}
}

function TourDiario({
  currentStep = 0,
  onStepComplete,
  onSkip,
  onTourComplete,
  onAddFirstWine,
}) {
  const overlayRef = React.useRef(null);
  const [rect, setRect] = React.useState(null);
  const [overlaySize, setOverlaySize] = React.useState({ w: 0, h: 0 });

  const cfg = TOUR_DIARIO_STEPS[currentStep] || TOUR_DIARIO_STEPS[0];
  const isLast = currentStep === TOUR_DIARIO_STEPS.length - 1;

  React.useEffect(() => {
    const compute = () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const oRect = overlay.getBoundingClientRect();
      setOverlaySize({ w: oRect.width, h: oRect.height });
      const anchor = document.querySelector(`[data-tour-anchor="${cfg.anchor}"]`);
      if (!anchor) { setRect(null); return; }
      const a = anchor.getBoundingClientRect();
      setRect({
        x: a.left - oRect.left - cfg.pad,
        y: a.top  - oRect.top  - cfg.pad,
        w: a.width  + cfg.pad * 2,
        h: a.height + cfg.pad * 2,
      });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  React.useEffect(() => {
    if (currentStep === 0) trackDiario('tour_started', { feature: 'diario' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    trackDiario('tour_step_completed', { feature: 'diario', step_index: currentStep });
    if (isLast) {
      trackDiario('tour_completed', { feature: 'diario' });
      markDiarioTourSeen();
      if (typeof onTourComplete === 'function') onTourComplete();
      if (typeof onAddFirstWine === 'function') onAddFirstWine();
      return;
    }
    if (typeof onStepComplete === 'function') onStepComplete(currentStep);
  };

  const handleSkip = () => {
    trackDiario('tour_skipped', { feature: 'diario', step_index: currentStep });
    markDiarioTourSeen();
    if (typeof onSkip === 'function') onSkip();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`tour-diario-${currentStep}`}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', inset: 0, zIndex: 65,
        pointerEvents: 'auto',
      }}>
      {/* SVG mask — darkens everything except the spotlight rect */}
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${overlaySize.w || 1} ${overlaySize.h || 1}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          animation: 'tcFadeIn 220ms ease',
        }}
        aria-hidden="true">
        <defs>
          <mask id={`tour-diario-mask-${currentStep}`}>
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            {rect && (
              <rect
                x={rect.x} y={rect.y}
                width={rect.w} height={rect.h}
                rx={Math.min(cfg.radius, rect.h / 2)}
                ry={Math.min(cfg.radius, rect.h / 2)}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(15,15,15,0.70)"
          mask={`url(#tour-diario-mask-${currentStep})`}
        />
      </svg>

      {/* Pulsing burgundy ring around the spotlight */}
      {rect && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: rect.x - 3, top: rect.y - 3,
            width: rect.w + 6, height: rect.h + 6,
            borderRadius: Math.min(cfg.radius, rect.h / 2 + 3),
            border: `3px solid ${T.c.p500}`,
            boxShadow: `0 0 24px rgba(160,74,85,0.55)`,
            animation: 'tcTourPulse 1.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}/>
      )}

      {/* Tooltip card — reuses TourTooltip from TourAdega */}
      {rect && typeof TourTooltip === 'function' && (
        <TourTooltip
          rect={rect}
          frame={overlaySize}
          place={cfg.place}
          body={cfg.body}
          step={currentStep}
          total={TOUR_DIARIO_STEPS.length}
          primaryLabel={cfg.primary}
          onSkip={handleSkip}
          onNext={handleNext}
          titleId={`tour-diario-${currentStep}`}
        />
      )}
    </div>
  );
}

Object.assign(window, {
  TourDiario,
  TOUR_DIARIO_KEY, TOUR_DIARIO_STEPS,
  isDiarioTourSeen, markDiarioTourSeen, resetDiarioTour,
});


export { TOUR_DIARIO_KEY, TOUR_DIARIO_STEPS, TourDiario, isDiarioTourSeen, markDiarioTourSeen, resetDiarioTour, trackDiario };
