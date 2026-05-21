/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { T } from './tokens.jsx';

// Tchin Tchin — 05.Adega Tour (3 frames)
// ────────────────────────────────────────────────────────────
// Auto-fires on top of 04.C AdegaVazia for first-time users. The mask is
// drawn with SVG so a clean "hole" sits over each tour anchor with the rest
// of the screen darkened. A burgundy ring pulses around the spotlight.
//
// Anchors are read from the DOM by querying for:
//   [data-tour-anchor="add-button"]    → step 1, pill-shaped spotlight
//   [data-tour-anchor="matrix-empty"]  → step 2, rounded-rect spotlight
//   [data-tour-anchor="scan-button"]   → step 3, pill-shaped spotlight
//
// State is persisted to localStorage['tc.tours.seen.adega'] so the tour
// never replays after skip or completion.

const TOUR_ADEGA_KEY = 'tc.tours.seen.adega';

function isAdegaTourSeen() {
  try { return window.localStorage.getItem(TOUR_ADEGA_KEY) === 'true'; }
  catch (e) { return false; }
}
function markAdegaTourSeen() {
  try { window.localStorage.setItem(TOUR_ADEGA_KEY, 'true'); } catch (e) {}
}
function resetAdegaTour() {
  try { window.localStorage.removeItem(TOUR_ADEGA_KEY); } catch (e) {}
}

const TOUR_ADEGA_STEPS = [
  {
    anchor: 'add-button',
    place:  'above',         // tooltip placement
    radius: 9999,            // pill-shape — full rounding
    pad:    8,               // px padding around anchor for spotlight
    body:   'Toca aqui pra adicionar o primeiro vinho da sua adega. Pode ser algo que você tem em casa.',
    primary: 'Próximo',
  },
  {
    anchor: 'matrix-empty',
    place:  'below',
    radius: 14,              // rounded-rect
    pad:    6,
    body:   'Tua adega visual. Cada vinho ocupa um espaço — pode ter estoque, pode estar zerado.',
    primary: 'Próximo',
  },
  {
    anchor: 'scan-button',
    place:  'above',
    radius: 9999,
    pad:    8,
    body:   'Ou escaneia o rótulo da próxima garrafa que você abrir — a gente registra no teu Diário.',
    primary: 'Entendi — adicionar meu primeiro vinho',
  },
];

function track(event, params) {
  try {
    if (typeof window.tcAnalytics === 'function') window.tcAnalytics(event, params);
    else if (typeof window.gtag === 'function')   window.gtag('event', event, params);
  } catch (e) {}
}

function TourAdega({
  currentStep = 0,
  onStepComplete,
  onSkip,
  onTourComplete,
  onAddFirstWine,
}) {
  const overlayRef = React.useRef(null);
  const [rect, setRect] = React.useState(null);
  const [overlaySize, setOverlaySize] = React.useState({ w: 0, h: 0 });

  const cfg = TOUR_ADEGA_STEPS[currentStep] || TOUR_ADEGA_STEPS[0];
  const isLast = currentStep === TOUR_ADEGA_STEPS.length - 1;

  // Re-measure anchor + overlay every time the step changes
  React.useEffect(() => {
    let cancelled = false;
    const compute = () => {
      if (cancelled) return false;
      const overlay = overlayRef.current;
      if (!overlay) return false;
      const oRect = overlay.getBoundingClientRect();
      const anchor = document.querySelector(`[data-tour-anchor="${cfg.anchor}"]`);
      if (!anchor) {
        setOverlaySize({ w: oRect.width, h: oRect.height });
        return false;
      }
      const a = anchor.getBoundingClientRect();
      // Sometimes layout hasn't settled yet — retry until the anchor has size.
      if (a.width === 0 && a.height === 0) return false;
      // Account for any CSS transform scaling on the parent chain by dividing
      // the deltas by the overlay's own scale (clientWidth vs bounding width).
      const scaleX = oRect.width  ? (overlay.clientWidth  / oRect.width)  : 1;
      const scaleY = oRect.height ? (overlay.clientHeight / oRect.height) : 1;
      setOverlaySize({ w: overlay.clientWidth || oRect.width, h: overlay.clientHeight || oRect.height });
      setRect({
        x: (a.left - oRect.left) * scaleX - cfg.pad,
        y: (a.top  - oRect.top)  * scaleY - cfg.pad,
        w: a.width  * scaleX + cfg.pad * 2,
        h: a.height * scaleY + cfg.pad * 2,
      });
      return true;
    };
    // Retry across animation frames + a couple of timeouts to catch any
    // late layout (transforms, fonts, image loads, etc.)
    let attempts = 0;
    const tryCompute = () => {
      if (compute() || attempts > 12 || cancelled) return;
      attempts += 1;
      requestAnimationFrame(tryCompute);
    };
    tryCompute();
    const t1 = setTimeout(tryCompute, 200);
    const t2 = setTimeout(tryCompute, 600);
    // Recompute on resize — keeps spotlight aligned when the frame scales
    window.addEventListener('resize', compute);
    return () => {
      cancelled = true;
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener('resize', compute);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Fire analytics on mount + each step transition
  React.useEffect(() => {
    if (currentStep === 0) track('tour_started', { feature: 'adega' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    track('tour_step_completed', { feature: 'adega', step_index: currentStep });
    if (isLast) {
      track('tour_completed', { feature: 'adega' });
      markAdegaTourSeen();
      if (typeof onTourComplete === 'function') onTourComplete();
      if (typeof onAddFirstWine === 'function') onAddFirstWine();
      return;
    }
    if (typeof onStepComplete === 'function') onStepComplete(currentStep);
  };

  const handleSkip = () => {
    track('tour_skipped', { feature: 'adega', step_index: currentStep });
    markAdegaTourSeen();
    if (typeof onSkip === 'function') onSkip();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`tour-adega-${currentStep}`}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', inset: 0, zIndex: 65,
        pointerEvents: 'auto',
        // Reserve space above the bottom nav so the SVG mask never paints over it.
        // BottomNav (88) + NavBar (18) ≈ 106 — but the screen container above is
        // already laid out so overlay = AdegaVazia body. We just inset 0.
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
          <mask id={`tour-mask-${currentStep}`}>
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
          mask={`url(#tour-mask-${currentStep})`}
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

      {/* Tooltip card */}
      {rect ? (
        <TourTooltip
          rect={rect}
          frame={overlaySize}
          place={cfg.place}
          body={cfg.body}
          step={currentStep}
          total={TOUR_ADEGA_STEPS.length}
          primaryLabel={cfg.primary}
          onSkip={handleSkip}
          onNext={handleNext}
          titleId={`tour-adega-${currentStep}`}
        />
      ) : (
        // Fallback: anchor not found yet (or no measurable rect) — show a
        // centered card so the user is never stuck behind an opaque overlay.
        <div onClick={e => e.stopPropagation()} style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)', width: 280,
          background: T.c.n0, borderRadius: T.r.lg, padding: 18,
          boxShadow: T.el[4], fontFamily: T.font, zIndex: 2,
          animation: 'tcPopIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}>
          <div style={{ ...T.t.body, color: T.c.n950, lineHeight: 1.5, marginBottom: 14 }}>
            {cfg.body}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={handleSkip} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: T.c.n600, fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: '8px 12px',
            }}>Pular</button>
            <button onClick={handleNext} style={{
              background: T.c.p700, color: T.c.n0, border: 'none', cursor: 'pointer',
              fontFamily: T.font, fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: T.r.full,
            }}>{cfg.primary || (isLast ? 'Concluir' : 'Continuar')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TourTooltip — placed above/below the spotlight ────────
function TourTooltip({
  rect, frame, place,
  body, step, total, primaryLabel,
  onSkip, onNext, titleId,
}) {
  const TOOLTIP_W = 312;
  const MARGIN    = 16;
  const ARROW_GAP = 14;

  // Anchor x = horizontal center of the spotlight
  const anchorCenterX = rect.x + rect.w / 2;
  let tooltipLeft = anchorCenterX - TOOLTIP_W / 2;
  tooltipLeft = Math.max(MARGIN, Math.min(tooltipLeft, frame.w - TOOLTIP_W - MARGIN));
  const triangleLeftWithin = anchorCenterX - tooltipLeft;

  // Position above or below the spotlight
  const pointsUp = place === 'below';        // place 'below' means tooltip is below + arrow points up
  const positionStyle = pointsUp
    ? { top: rect.y + rect.h + ARROW_GAP }
    : { bottom: frame.h - rect.y + ARROW_GAP };

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: tooltipLeft,
        ...positionStyle,
        width: TOOLTIP_W,
        background: T.c.n0,
        borderRadius: T.r.lg,
        padding: 16,
        boxShadow: T.el[4],
        fontFamily: T.font,
        animation: 'tcPushIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
      <div id={titleId} style={{
        fontFamily: '"Geist", "Inter", system-ui, sans-serif',
        fontSize: 14, lineHeight: 1.5, color: T.c.n950,
        textWrap: 'pretty',
      }}>
        {body}
      </div>

      <div style={{ height: 16 }}/>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === step ? T.c.p700 : T.c.n300,
              transition: 'background 200ms',
            }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="ghost" size="sm" onClick={onSkip}>Pular</Button>
          <Button variant="primary" size="sm" onClick={onNext}>
            {primaryLabel}
          </Button>
        </div>
      </div>

      {/* Triangle arrow */}
      <div style={{
        position: 'absolute',
        left: triangleLeftWithin - 6,
        ...(pointsUp
          ? { top: -7, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: `8px solid ${T.c.n0}` }
          : { bottom: -7, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${T.c.n0}` }),
        width: 0, height: 0,
        filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.08))',
      }}/>
    </div>
  );
}

Object.assign(window, {
  TourAdega, TourTooltip,
  TOUR_ADEGA_KEY, TOUR_ADEGA_STEPS,
  isAdegaTourSeen, markAdegaTourSeen, resetAdegaTour,
});


export { TOUR_ADEGA_KEY, TOUR_ADEGA_STEPS, TourAdega, TourTooltip, isAdegaTourSeen, markAdegaTourSeen, resetAdegaTour, track };
