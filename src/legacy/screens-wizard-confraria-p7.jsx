/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, Skeleton, T } from './tokens.jsx';

// Tchin Tchin — 08.07 Tutorial Pós-Criação (Brotherhood)
// ────────────────────────────────────────────────────────────
// Overlay tour de 3 frames que aparece sobre a Tela da Confraria depois
// de:
//   • user tocou "Agora não" em 08.06, OU
//   • user terminou de criar o primeiro evento
//
// Não bloqueia o app — o user pode pular a qualquer momento. Persiste em
// localStorage['tc.tours.seen.brotherhood'] (espelha o que o backend
// guarda em users.tours_seen.brotherhood). Disponível em Ajuda do menu
// pra refazer (resetBrotherhoodTour()).
//
// Reusa o padrão de máscara SVG + ring pulsante do TourAdega; só muda
// o tooltip (este tem título + corpo, o do Adega tem só corpo).

const TOUR_BROTHERHOOD_KEY = 'tc.tours.seen.brotherhood';

function isBrotherhoodTourSeen() {
  try { return window.localStorage.getItem(TOUR_BROTHERHOOD_KEY) === 'true'; }
  catch (e) { return false; }
}
function markBrotherhoodTourSeen() {
  try { window.localStorage.setItem(TOUR_BROTHERHOOD_KEY, 'true'); } catch (e) {}
}
function resetBrotherhoodTour() {
  try { window.localStorage.removeItem(TOUR_BROTHERHOOD_KEY); } catch (e) {}
}

const TOUR_BROTHERHOOD_STEPS = [
  {
    anchor: 'confraria-feed',
    place:  'below',
    radius: 14,
    pad:    8,
    title:  'Feed da Confraria',
    body:   'Posts, fotos e discussões dos membros. Você é admin — pode fixar posts e moderar.',
    primary: 'Próximo',
  },
  {
    anchor: 'confraria-events',
    place:  'below',
    radius: 14,
    pad:    8,
    title:  'Eventos',
    body:   'Crie, gerencie e veja confirmações em um tap. Lembretes automáticos pra galera.',
    primary: 'Próximo',
  },
  {
    anchor: 'confraria-checklist',
    place:  'above',
    radius: 14,
    pad:    8,
    title:  'Checklist do organizador',
    body:   '5 passos pra confraria ganhar vida. Vai pegando badges no caminho.',
    primary: 'Entendi, vou começar',
  },
];

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    onComplete: () => void
//    onSkip: () => void
function TutorialPosCriacao({ onComplete, onSkip, initialStep = 0 }) {
  const overlayRef = React.useRef(null);
  const [step, setStep] = React.useState(initialStep);
  const [rect, setRect] = React.useState(null);
  const [overlaySize, setOverlaySize] = React.useState({ w: 0, h: 0 });

  const cfg = TOUR_BROTHERHOOD_STEPS[step] || TOUR_BROTHERHOOD_STEPS[0];
  const isLast = step === TOUR_BROTHERHOOD_STEPS.length - 1;

  // Fire start event once
  React.useEffect(() => {
    fbEvent('brotherhood_tutorial_started');
  }, []);

  // Measure anchor + overlay on each step
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
    // Try immediately + on next frame (anchor may layout after mount)
    compute();
    const raf = window.requestAnimationFrame(compute);
    window.addEventListener('resize', compute);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', compute);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleNext = () => {
    fbEvent('brotherhood_tutorial_step_completed', { step_index: step });
    if (isLast) {
      fbEvent('brotherhood_tutorial_completed');
      markBrotherhoodTourSeen();
      onComplete();
      return;
    }
    setStep(s => s + 1);
  };

  const handleSkip = () => {
    fbEvent('brotherhood_tutorial_skipped', { step_index: step });
    markBrotherhoodTourSeen();
    onSkip();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`brotherhood-tour-title-${step}`}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', inset: 0, zIndex: 65,
        pointerEvents: 'auto',
      }}>
      {/* SVG mask — darken everything except the spotlight */}
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
          <mask id={`brotherhood-tour-mask-${step}`}>
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
          mask={`url(#brotherhood-tour-mask-${step})`}
        />
      </svg>

      {/* Pulsing burgundy ring */}
      {rect && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: rect.x - 3, top: rect.y - 3,
            width: rect.w + 6, height: rect.h + 6,
            borderRadius: Math.min(cfg.radius, rect.h / 2 + 3),
            border: `3px solid ${T.c.p500}`,
            boxShadow: '0 0 24px rgba(160,74,85,0.55)',
            animation: 'tcTourPulse 1.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}/>
      )}

      {/* Tooltip card — sempre renderiza (centralizado quando não há âncora),
          pra nunca deixar a tela escura sem ação. */}
      <BrotherhoodTourTooltip
        rect={rect}
        frame={overlaySize}
        place={cfg.place}
        title={cfg.title}
        body={cfg.body}
        step={step}
        total={TOUR_BROTHERHOOD_STEPS.length}
        primaryLabel={cfg.primary}
        isLast={isLast}
        onSkip={handleSkip}
        onNext={handleNext}
        titleId={`brotherhood-tour-title-${step}`}
      />
      {/* Fecho de segurança — toque fora do card pula o tutorial */}
      <button
        onClick={handleSkip}
        aria-label="Fechar tutorial"
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <Icon name="close" size={20} color="#fff"/>
      </button>
    </div>
  );
}

// ─── BrotherhoodTourTooltip — title + body + dots + actions ─
// Variante do TourTooltip do Adega que aceita título em negrito.
function BrotherhoodTourTooltip({
  rect, frame, place,
  title, body, step, total, primaryLabel, isLast,
  onSkip, onNext, titleId,
}) {
  const TOOLTIP_W = 296;
  const MARGIN    = 16;
  const ARROW_GAP = 14;

  // Quando o passo não tem âncora visível na tela (ex.: o elemento está em
  // outra aba), centralizamos o card em vez de deixar a tela escura travada.
  const hasAnchor = !!rect;
  const frameW = frame.w || TOOLTIP_W + MARGIN * 2;
  const frameH = frame.h || 640;
  const anchorCenterX = hasAnchor ? rect.x + rect.w / 2 : frameW / 2;
  let tooltipLeft = anchorCenterX - TOOLTIP_W / 2;
  tooltipLeft = Math.max(MARGIN, Math.min(tooltipLeft, frameW - TOOLTIP_W - MARGIN));
  const triangleLeftWithin = anchorCenterX - tooltipLeft;

  const pointsUp = place === 'below'; // tooltip below spotlight → arrow points up
  const positionStyle = hasAnchor
    ? (pointsUp
        ? { top: rect.y + rect.h + ARROW_GAP }
        : { bottom: frameH - rect.y + ARROW_GAP })
    : { top: Math.max(80, (frameH - 220) / 2) }; // centralizado sem âncora

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
        fontFamily: T.font,
        fontSize: 15, lineHeight: 1.3, fontWeight: 700,
        color: T.c.n950,
        marginBottom: 6,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: T.font,
        fontSize: 14, lineHeight: 1.5, color: T.c.n800,
        textWrap: 'pretty',
      }}>
        {body}
      </div>

      <div style={{ height: 16 }}/>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} aria-label={`Passo ${step + 1} de ${total}`}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === step ? T.c.p700 : T.c.n300,
              transition: 'background 200ms',
            }}/>
          ))}
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {!isLast && (
            <Button variant="ghost" size="sm" onClick={onSkip}>Pular</Button>
          )}
          <Button variant="primary" size="sm" onClick={onNext}>
            {primaryLabel}
          </Button>
        </div>
      </div>

      {/* Triangle arrow — só quando há âncora pra apontar */}
      {hasAnchor && (
        <div style={{
          position: 'absolute',
          left: triangleLeftWithin - 6,
          ...(pointsUp
            ? { top: -7, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: `8px solid ${T.c.n0}` }
            : { bottom: -7, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${T.c.n0}` }),
          width: 0, height: 0,
          filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.08))',
        }}/>
      )}
    </div>
  );
}

// ─── Demo host — a mock brotherhood screen with the 3 anchors ──
// Não é a tela de confraria real (essa é ConfrariaDetalheScreen); é uma
// representação simplificada pra demonstrar onde os spotlights cairiam.
// Em produção o overlay é montado por cima da tela real, que já tem os
// `data-tour-anchor` espalhados.
function BrotherhoodTutorialHostDemo({ tourStep = 0 }) {
  // Tour control state — caso o consumidor da artboard queira "rolar" o tour
  const [step, setStep] = React.useState(tourStep);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { setStep(tourStep); setDone(false); }, [tourStep]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, position: 'relative', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px', background: T.c.n0,
        borderBottom: `1px solid ${T.c.n200}`,
        minHeight: 56, flexShrink: 0,
      }}>
        <Icon name="arrow_back" size={24} color={T.c.n950}/>
        <div style={{
          flex: 1,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 17, fontWeight: 600, color: T.c.n950,
        }}>
          Tchin do Cerrado
        </div>
        <Icon name="more_vert" size={22} color={T.c.n800}/>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 16px',
        background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0,
      }}>
        {['Sobre', 'Feed', 'Eventos', 'Membros', 'Adega'].map((t, i) => (
          <div key={t} style={{
            padding: '6px 10px', borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 12, fontWeight: 600,
            background: i === 1 ? T.c.p700 : 'transparent',
            color: i === 1 ? T.c.n0 : T.c.n600,
          }}>
            {t}
          </div>
        ))}
      </div>

      {/* Body — anchored sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Checklist do organizador — primeiro pra ficar visível */}
        <div data-tour-anchor="confraria-checklist" style={{
          background: T.c.p50, border: `1px solid ${T.c.p100}`, borderRadius: T.r.lg,
          padding: 14,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
          }}>
            <Icon name="checklist" size={18} color={T.c.p700} fill={1}/>
            <div style={{
              fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950,
            }}>
              Checklist do organizador
            </div>
            <div style={{ flex: 1 }}/>
            <span style={{
              fontFamily: T.mono, fontSize: 11, fontWeight: 600,
              color: T.c.p700,
            }}>
              1/5
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i === 0 ? T.c.p700 : T.c.p100,
              }}/>
            ))}
          </div>
          <div style={{
            marginTop: 8,
            fontFamily: T.font, fontSize: 12, color: T.c.n800,
          }}>
            Próximo: Marcar primeiro encontro
          </div>
        </div>

        {/* Feed da confraria */}
        <div data-tour-anchor="confraria-feed" style={{
          background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg,
          padding: 14,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <Icon name="forum" size={18} color={T.c.n600}/>
            <div style={{
              fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950,
            }}>
              Feed
            </div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.p700, color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>AB</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.c.n950 }}>Ana Beatriz · admin</div>
                <div style={{ fontFamily: T.font, fontSize: 13, color: T.c.n800, marginTop: 2 }}>Bem-vindos! Próximo encontro: 24/05.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', opacity: 0.55 }}>
              <Skeleton width={32} height={32} radius={16}/>
              <div style={{ flex: 1 }}>
                <Skeleton height={10} width="35%"/>
                <div style={{ height: 6 }}/>
                <Skeleton height={10} width="85%"/>
              </div>
            </div>
          </div>
        </div>

        {/* Eventos */}
        <div data-tour-anchor="confraria-events" style={{
          background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg,
          padding: 14,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <Icon name="event" size={18} color={T.c.n600}/>
            <div style={{
              fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950,
            }}>
              Próximos eventos
            </div>
            <div style={{ flex: 1 }}/>
            <Icon name="add" size={18} color={T.c.p700}/>
          </div>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            padding: '8px 0',
          }}>
            <div style={{
              width: 44, textAlign: 'center',
              background: T.c.p50, borderRadius: T.r.sm,
              padding: '6px 0',
            }}>
              <div style={{ fontFamily: T.font, fontSize: 10, fontWeight: 700, color: T.c.p700, textTransform: 'uppercase' }}>Sáb</div>
              <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 700, color: T.c.p700, lineHeight: 1 }}>24</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.c.n950 }}>Primeiro encontro</div>
              <div style={{ fontFamily: T.font, fontSize: 11, color: T.c.n600 }}>19h · 0 confirmados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial overlay */}
      {!done && (
        <TutorialPosCriacao
          key={step}
          initialStep={step}
          onComplete={() => setDone(true)}
          onSkip={() => setDone(true)}
        />
      )}

      {/* Hint pra reabrir o tour quando ele fecha (só na artboard) */}
      {done && (
        <button
          onClick={() => { resetBrotherhoodTour(); setDone(false); }}
          style={{
            position: 'absolute', right: 10, bottom: 10, zIndex: 5,
            padding: '6px 10px',
            background: T.c.n950, color: T.c.n0,
            border: 'none', borderRadius: T.r.full,
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            cursor: 'pointer', opacity: 0.85,
          }}>
          ↻ refazer tour
        </button>
      )}
    </div>
  );
}

Object.assign(window, {
  TutorialPosCriacao,
  BrotherhoodTutorialHostDemo,
  TOUR_BROTHERHOOD_KEY,
  TOUR_BROTHERHOOD_STEPS,
  isBrotherhoodTourSeen,
  markBrotherhoodTourSeen,
  resetBrotherhoodTour,
});


export { BrotherhoodTourTooltip, BrotherhoodTutorialHostDemo, TOUR_BROTHERHOOD_KEY, TOUR_BROTHERHOOD_STEPS, TutorialPosCriacao, isBrotherhoodTourSeen, markBrotherhoodTourSeen, resetBrotherhoodTour };
