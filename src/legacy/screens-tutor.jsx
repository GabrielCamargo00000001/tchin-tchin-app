/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — TchinTutor: sistema de tutorial conversacional
//
// Pensado pra grudar no usuário, não os tooltips chatos.
//
// Cada tutorial é um objeto:
//   { id, name, intro, steps: [
//      { body, anchor?, illustration?, primary?, tip?, action? },
//      ...
//   ]}
//
// O cartão entra deslizando do canto inferior, com avatar do Tchin (mascote),
// texto digitando (typing dots → reveal), "pista" pulsante no elemento alvo,
// indicador de tap fantasma, e confete ao concluir.
//
// Estado persistido em localStorage por tutorial.id (uma vez visto, não volta).
// O usuário pode minimizar (vira badge flutuante) e reabrir.
// ─────────────────────────────────────────────────────────────

const TUTORIAL_REGISTRY = {};

function registerTutorial(t) { TUTORIAL_REGISTRY[t.id] = t; }
function getTutorial(id)     { return TUTORIAL_REGISTRY[id]; }

// localStorage helpers
const TUTOR_DONE_KEY = 'tc.tutor.done';
function readTutorDone() {
  try { return JSON.parse(window.localStorage.getItem(TUTOR_DONE_KEY) || '{}'); }
  catch (e) { return {}; }
}
function markTutorDone(id) {
  try {
    const cur = readTutorDone();
    cur[id] = Date.now();
    window.localStorage.setItem(TUTOR_DONE_KEY, JSON.stringify(cur));
  } catch (e) {}
}
function resetAllTutorials() {
  try { window.localStorage.removeItem(TUTOR_DONE_KEY); } catch (e) {}
}
function isTutorDone(id) {
  const d = readTutorDone(); return !!d[id];
}

// ─── Mascote Tchin ───────────────────────────────────────
function TchinMascot({ size = 36, mood = 'happy' }) {
  // Estilizado como duas taças cliando, com um glow burgundy
  const mouth = mood === 'happy' ? 'M-3 1 Q0 4 3 1' : 'M-3 0 L3 0';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 12px rgba(74,31,36,0.45)`,
      position: 'relative', flexShrink: 0,
    }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="-12 -12 24 24" style={{ display: 'block' }}>
        {/* Two clinking glasses */}
        <path d="M-7 -8 L-7 -2 Q-7 1 -4 2 L-4 6 L-6 6 L-6 8 L-2 8 L-2 6 L-4 6" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M-7 -7.4 L-2 -7.4 Q-2.2 -3.6 -4.7 -3 Q-6 -3 -7 -5.4 Z" fill={T.c.a500}/>
        <path d="M7 -8 L7 -2 Q7 1 4 2 L4 6 L6 6 L6 8 L2 8 L2 6 L4 6" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M7 -7.4 L2 -7.4 Q2.2 -3.6 4.7 -3 Q6 -3 7 -5.4 Z" fill={T.c.a500}/>
        {/* tiny sparkles */}
        <circle cx="-9" cy="-9" r="0.8" fill="rgba(255,255,255,0.9)"/>
        <circle cx="9"  cy="-9" r="0.6" fill="rgba(255,255,255,0.7)"/>
        <circle cx="0"  cy="-10" r="1" fill="rgba(255,255,255,0.95)"/>
      </svg>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────
function TypingDots({ color = T.c.n600 }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          animation: `tcTypingDot 1.2s infinite ${i * 0.18}s`,
        }}/>
      ))}
    </div>
  );
}

// ─── Spotlight / pista (com pulse glow) ───────────────────
function TutorPista({ rect, kind = 'pulse' }) {
  if (!rect) return null;
  if (kind === 'pulse') {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute',
        left: rect.x - 6, top: rect.y - 6,
        width: rect.w + 12, height: rect.h + 12,
        borderRadius: Math.min(20, rect.h / 2 + 4),
        border: `3px solid ${T.c.p500}`,
        boxShadow: `0 0 0 0 rgba(160,74,85,0.6)`,
        animation: 'tcPistaPulse 1.6s ease-out infinite',
        pointerEvents: 'none', zIndex: 60,
      }}/>
    );
  }
  if (kind === 'glow') {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute',
        left: rect.x, top: rect.y, width: rect.w, height: rect.h,
        borderRadius: 12, pointerEvents: 'none', zIndex: 60,
        boxShadow: `0 0 0 6px rgba(160,74,85,0.18), 0 0 28px 6px rgba(160,74,85,0.42)`,
        animation: 'tcBreath 1.8s ease-in-out infinite',
      }}/>
    );
  }
  // ghost tap dot
  return (
    <div aria-hidden="true" style={{
      position: 'absolute',
      left: rect.x + rect.w / 2 - 18, top: rect.y + rect.h / 2 - 18,
      width: 36, height: 36, borderRadius: '50%',
      background: 'rgba(160,74,85,0.4)',
      pointerEvents: 'none', zIndex: 60,
      animation: 'tcGhostTap 1.8s ease-out infinite',
    }}/>
  );
}

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('tc-tutor-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-tutor-kf';
  s.textContent = `
    @keyframes tcPistaPulse {
      0%   { box-shadow: 0 0 0 0   rgba(160,74,85,0.55); }
      70%  { box-shadow: 0 0 0 18px rgba(160,74,85,0); }
      100% { box-shadow: 0 0 0 0   rgba(160,74,85,0); }
    }
    @keyframes tcGhostTap {
      0%   { transform: scale(0.6); opacity: 0; }
      30%  { transform: scale(1.0); opacity: 1; }
      70%  { transform: scale(1.4); opacity: 0.4; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes tcCardSlide {
      from { transform: translateY(120%); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    @keyframes tcCardMinimize {
      from { transform: translate(0, 0) scale(1); opacity: 1; }
      to   { transform: translate(60%, 40%) scale(0.2); opacity: 0; }
    }
    @keyframes tcMascotBob {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-3px); }
    }
    @keyframes tcTypingDot {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30%           { opacity: 1;   transform: translateY(-3px); }
    }
  `;
  document.head.appendChild(s);
}

// ─── TchinTutor — o componente principal ─────────────────
// Cada step pode definir uma `variant`:
//   'bubble'    (default)  bolha de chat no rodapé (modo conversacional)
//   'hero'                 card centralizado com ilustração grande + backdrop dim
//   'coachmark'            bolha apontando pro anchor (tipo pop-out)
//   'spotlight'            backdrop escuro com recorte; caption flutuante
//   'mascot'               mascote pequeno colado no anchor com fala curta
//
// Tutorial inteiro pode definir `accent` (cor) e `gradient` (BG hero).
function TchinTutor({ tutorial, onClose, onAction }) {
  const [step, setStep] = React.useState(-1); // -1 = intro hero
  const [collapsed, setCollapsed] = React.useState(false);
  const [typing, setTyping] = React.useState(true);
  const [rect, setRect] = React.useState(null);
  const overlayRef = React.useRef(null);

  const total = tutorial.steps.length;
  const current = step < 0 ? null : tutorial.steps[step];
  const accent = tutorial.accent || T.c.p700;
  const accentSoft = tutorial.accentSoft || T.c.p50;
  const isLast = step >= total - 1;

  // Determine variant — intro always uses 'hero'; step variant or default 'bubble'
  const variant = step < 0 ? 'hero' : (current.variant || 'bubble');

  // Typing only on first reveal (per step). For hero variant, no typing.
  React.useEffect(() => {
    if (variant === 'hero') { setTyping(false); return; }
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 500);
    return () => clearTimeout(t);
  }, [step, variant]);

  // Find anchor rect when on a step with anchor
  React.useEffect(() => {
    if (!current || !current.anchor) { setRect(null); return; }
    let cancelled = false;
    let attempts = 0;
    const compute = () => {
      if (cancelled) return true;
      const overlay = overlayRef.current;
      if (!overlay) return false;
      const oRect = overlay.getBoundingClientRect();
      const anchor = document.querySelector(`[data-tour-anchor="${current.anchor}"]`);
      if (!anchor) return false;
      const a = anchor.getBoundingClientRect();
      if (a.width === 0 && a.height === 0) return false;
      const scaleX = oRect.width  ? overlay.clientWidth  / oRect.width  : 1;
      const scaleY = oRect.height ? overlay.clientHeight / oRect.height : 1;
      // Auto-scroll into view if anchor is partly off-screen
      try {
        if (a.top < oRect.top + 40 || a.bottom > oRect.bottom - 220) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (e) {}
      setRect({
        x: (a.left - oRect.left) * scaleX,
        y: (a.top  - oRect.top)  * scaleY,
        w: a.width  * scaleX,
        h: a.height * scaleY,
      });
      return true;
    };
    const tryCompute = () => {
      if (compute() || attempts > 14 || cancelled) return;
      attempts += 1;
      requestAnimationFrame(tryCompute);
    };
    tryCompute();
    const t1 = setTimeout(tryCompute, 200);
    const t2 = setTimeout(tryCompute, 600);
    return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2); };
  }, [step, current]);

  const handleNext = () => {
    if (step < 0) { setStep(0); return; }
    if (isLast) {
      markTutorDone(tutorial.id);
      if (typeof onClose === 'function') onClose({ completed: true });
      return;
    }
    setStep(step + 1);
  };
  const handleBack = () => { if (step > 0) setStep(step - 1); else if (step === 0) setStep(-1); };
  const handleSkip = () => {
    markTutorDone(tutorial.id);
    if (typeof onClose === 'function') onClose({ completed: false });
  };

  // Collapsed = floating badge
  if (collapsed) {
    return (
      <button onClick={() => setCollapsed(false)} style={{
        position: 'absolute', bottom: 110, right: 16, zIndex: 70,
        width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: `linear-gradient(135deg, ${accent}, ${T.c.p900})`,
        boxShadow: `0 8px 24px ${accent}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'tcMascotBob 2s ease-in-out infinite',
      }} aria-label="Reabrir tutorial">
        <TchinMascot size={36}/>
        <div style={{
          position: 'absolute', top: -4, right: -4,
          minWidth: 20, height: 20, borderRadius: 10,
          background: T.c.a500, color: T.c.p900,
          fontFamily: T.font, fontSize: 10, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 5px',
        }}>{Math.max(0, total - Math.max(0, step))}</div>
      </button>
    );
  }

  // ─── Render por variante ─────────────────────────────
  const cfg = current || {};
  const stepDots = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 18 : 6, height: 6, borderRadius: 3,
          background: i <= step ? accent : T.c.n300,
          transition: 'width 220ms, background 220ms',
        }}/>
      ))}
    </div>
  );

  const closeBtns = (
    <>
      <button onClick={() => setCollapsed(true)} aria-label="Minimizar" style={tutorIconBtn}>
        <Icon name="south_east" size={18} color={T.c.n600}/>
      </button>
      <button onClick={handleSkip} aria-label="Fechar" style={tutorIconBtn}>
        <Icon name="close" size={20} color={T.c.n600}/>
      </button>
    </>
  );

  // ─── HERO (intro + special steps) ─────────────────
  if (variant === 'hero') {
    const heroCfg = step < 0
      ? { title: tutorial.name, body: tutorial.intro, illustration: tutorial.heroIllustration }
      : cfg;
    return (
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0, zIndex: 65,
        background: 'rgba(15,15,15,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, animation: 'tcFadeIn 220ms ease', pointerEvents: 'auto',
      }}>
        <div style={{
          background: T.c.n0, borderRadius: T.r.xl, width: '100%', maxWidth: 360,
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          animation: 'tcPopIn 360ms cubic-bezier(0.2, 0.9, 0.3, 1.15)',
          overflow: 'hidden',
        }}>
          {/* Top with accent gradient + mascote */}
          <div style={{
            position: 'relative', padding: '24px 24px 18px',
            background: tutorial.gradient || `linear-gradient(135deg, ${accent} 0%, ${T.c.p900} 100%)`,
            color: T.c.n0, overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginBottom: heroCfg.illustration ? 16 : 8 }}>
              <div style={{ animation: 'tcMascotBob 2.4s ease-in-out infinite' }}>
                <TchinMascot size={56}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.1 }}>TCHIN · {step < 0 ? 'Apresentação' : `Passo ${step + 1}/${total}`}</div>
                <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginTop: 2, textWrap: 'balance' }}>
                  {step < 0 ? tutorial.name : (cfg.title || tutorial.name)}
                </div>
              </div>
            </div>
            {heroCfg.illustration && (
              <div style={{ position: 'relative', marginTop: 4 }}>{heroCfg.illustration}</div>
            )}
            <button onClick={handleSkip} aria-label="Fechar" style={{
              position: 'absolute', top: 12, right: 12,
              width: 32, height: 32, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="close" size={18} color={T.c.n0}/>
            </button>
          </div>
          {/* Body */}
          <div style={{ padding: '18px 24px 8px' }}>
            <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.55 }}>{heroCfg.body}</div>
            {heroCfg.tip && (
              <div style={{
                marginTop: 12, padding: '10px 14px', background: accentSoft, color: T.c.n950,
                borderRadius: T.r.md, ...T.t.caption, lineHeight: 1.5,
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <Icon name="lightbulb" size={16} color={accent} fill={1} style={{ marginTop: 1 }}/>
                <span><strong>Dica:</strong> {heroCfg.tip}</span>
              </div>
            )}
          </div>
          {/* Footer */}
          <div style={{ padding: '16px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {stepDots}
            <div style={{ display: 'flex', gap: 6 }}>
              {step > -1 && (
                <button onClick={handleBack} style={tutorGhostBtn}>Voltar</button>
              )}
              <button onClick={handleNext} style={{
                background: accent, color: T.c.n0, border: 'none', cursor: 'pointer',
                fontFamily: T.font, fontSize: 14, fontWeight: 700,
                padding: '10px 18px', borderRadius: T.r.full,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                boxShadow: `0 4px 12px ${accent}66`,
              }}>
                {step < 0 ? (tutorial.primary || 'Vamos começar') : (isLast ? '🍷 Concluir' : 'Próximo')}
                {!isLast && step >= 0 && <Icon name="arrow_forward" size={14} color={T.c.n0}/>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── SPOTLIGHT — dim background + cutout ─────────
  if (variant === 'spotlight' && rect) {
    return (
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0, zIndex: 65, pointerEvents: 'auto',
        animation: 'tcFadeIn 220ms ease',
      }}>
        {/* Backdrop with cutout */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox={`0 0 ${overlayRef.current?.clientWidth || 1} ${overlayRef.current?.clientHeight || 1}`}>
          <defs>
            <mask id={`tutmask-${step}`}>
              <rect x="0" y="0" width="100%" height="100%" fill="white"/>
              <rect x={rect.x - 8} y={rect.y - 8} width={rect.w + 16} height={rect.h + 16} rx="12" fill="black"/>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(15,15,15,0.78)" mask={`url(#tutmask-${step})`}/>
        </svg>
        {/* Pulse ring */}
        <div style={{
          position: 'absolute', left: rect.x - 6, top: rect.y - 6, width: rect.w + 12, height: rect.h + 12,
          borderRadius: 14, border: `3px solid ${accent}`,
          boxShadow: `0 0 28px ${accent}99`,
          animation: 'tcBreath 1.8s ease-in-out infinite', pointerEvents: 'none',
        }}/>
        {/* Caption — positioned below or above the spotlight */}
        <SpotlightCaption rect={rect} frame={overlayRef.current} cfg={cfg} accent={accent} accentSoft={accentSoft} step={step} total={total} stepDots={stepDots}
          onNext={handleNext} onBack={handleBack} onSkip={handleSkip} isLast={isLast}/>
      </div>
    );
  }

  // ─── COACHMARK — bubble near anchor ──────────────
  if (variant === 'coachmark' && rect) {
    return (
      <div ref={overlayRef} style={{ position: 'absolute', inset: 0, zIndex: 65, pointerEvents: 'none' }}>
        {/* Glow on anchor */}
        <div style={{
          position: 'absolute', left: rect.x - 4, top: rect.y - 4, width: rect.w + 8, height: rect.h + 8,
          borderRadius: 12, boxShadow: `0 0 0 4px ${accent}33, 0 0 28px ${accent}66`,
          pointerEvents: 'none',
        }}/>
        <CoachmarkBubble rect={rect} frame={overlayRef.current} cfg={cfg} accent={accent} accentSoft={accentSoft} step={step} total={total} stepDots={stepDots}
          onNext={handleNext} onBack={handleBack} onSkip={handleSkip} isLast={isLast} tutorial={tutorial}/>
      </div>
    );
  }

  // ─── MASCOT — small mascot next to anchor with speech bubble ──
  if (variant === 'mascot' && rect) {
    return (
      <div ref={overlayRef} style={{ position: 'absolute', inset: 0, zIndex: 65, pointerEvents: 'none' }}>
        {rect && current.pista !== 'none' && <TutorPista rect={rect} kind={current.pista || 'pulse'}/>}
        <MascotBubble rect={rect} frame={overlayRef.current} cfg={cfg} accent={accent} step={step} total={total} stepDots={stepDots}
          onNext={handleNext} onBack={handleBack} onSkip={handleSkip} isLast={isLast}/>
      </div>
    );
  }

  // ─── BUBBLE (default) — bottom chat card ─────────
  return (
    <div ref={overlayRef} style={{ position: 'absolute', inset: 0, zIndex: 65, pointerEvents: 'none' }}>
      {current && current.anchor && rect && current.pista !== 'none' && <TutorPista rect={rect} kind={current.pista || 'pulse'}/>}
      {current && current.tapHint && rect && <TutorPista rect={rect} kind="ghost"/>}

      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 100, zIndex: 70,
        background: T.c.n0, borderRadius: T.r.lg,
        boxShadow: '0 12px 48px rgba(15,15,15,0.25), 0 4px 12px rgba(15,15,15,0.08)',
        animation: 'tcCardSlide 380ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        pointerEvents: 'auto', overflow: 'hidden',
        border: `1px solid ${T.c.n100}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px 8px' }}>
          <div style={{ animation: 'tcMascotBob 2.4s ease-in-out infinite' }}>
            <TchinMascot size={40}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Tchin · sommelier digital</div>
            <div style={{ ...T.t.caption, color: T.c.n600 }}>{tutorial.name}</div>
          </div>
          {closeBtns}
        </div>
        <div style={{ padding: '0 14px 8px', minHeight: 76 }}>
          {typing ? (
            <div style={{ padding: '8px 0' }}><TypingDots/></div>
          ) : (
            <div style={{ ...T.t.bodyLg, color: T.c.n950, lineHeight: 1.5, textWrap: 'pretty' }}>{cfg.body}</div>
          )}
          {!typing && cfg.tip && (
            <div style={{
              marginTop: 10, padding: '8px 12px', background: accentSoft, color: T.c.n950,
              borderRadius: T.r.sm, ...T.t.caption, lineHeight: 1.5,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <Icon name="lightbulb" size={16} color={accent} fill={1} style={{ marginTop: 1 }}/>
              <span><strong>Dica:</strong> {cfg.tip}</span>
            </div>
          )}
          {!typing && cfg.illustration && (
            <div style={{ marginTop: 10 }}>{cfg.illustration}</div>
          )}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px 14px', gap: 8, borderTop: `1px solid ${T.c.n100}`,
        }}>
          {stepDots}
          <div style={{ display: 'flex', gap: 6 }}>
            {step > 0 && (<button onClick={handleBack} style={tutorGhostBtn}>Voltar</button>)}
            {cfg.action && cfg.action.label && (
              <button onClick={() => { if (typeof onAction === 'function') onAction(cfg.action); }} style={{
                background: T.c.n0, color: accent, border: `1.5px solid ${accent}`,
                cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 700,
                padding: '8px 14px', borderRadius: T.r.full,
              }}>{cfg.action.label}</button>
            )}
            <button onClick={handleNext} style={{
              background: accent, color: T.c.n0, border: 'none', cursor: 'pointer',
              fontFamily: T.font, fontSize: 13, fontWeight: 700,
              padding: '8px 16px', borderRadius: T.r.full,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {isLast ? '🍷 Concluir' : 'Próximo'}
              {!isLast && <Icon name="arrow_forward" size={14} color={T.c.n0}/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tutorIconBtn = {
  width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
};
const tutorGhostBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: T.c.n600, fontFamily: T.font, fontSize: 13, fontWeight: 600,
  padding: '8px 12px', borderRadius: T.r.sm,
};

// ─── SpotlightCaption ────────────────────────────────────
function SpotlightCaption({ rect, frame, cfg, accent, accentSoft, step, total, stepDots, onNext, onBack, onSkip, isLast }) {
  const frameH = frame ? frame.clientHeight : 0;
  const placeBelow = rect.y + rect.h + 220 < frameH;
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16,
      [placeBelow ? 'top' : 'bottom']: placeBelow ? rect.y + rect.h + 18 : frameH - rect.y + 18,
      background: T.c.n0, borderRadius: T.r.lg, padding: 18,
      boxShadow: '0 16px 48px rgba(0,0,0,0.4)', pointerEvents: 'auto',
      animation: 'tcPopIn 320ms cubic-bezier(0.2, 0.9, 0.3, 1.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <TchinMascot size={32}/>
        <div style={{ flex: 1, ...T.t.bodyB, color: T.c.n950 }}>{cfg.title || 'Tchin'}</div>
        <button onClick={onSkip} style={tutorIconBtn}><Icon name="close" size={18} color={T.c.n600}/></button>
      </div>
      <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.5, marginBottom: 14 }}>{cfg.body}</div>
      {cfg.tip && (
        <div style={{ padding: 10, background: accentSoft, borderRadius: T.r.sm, ...T.t.caption, color: T.c.n800, lineHeight: 1.5, marginBottom: 14, display: 'flex', gap: 8 }}>
          <Icon name="lightbulb" size={16} color={accent} fill={1}/>
          <span><strong>Dica:</strong> {cfg.tip}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {stepDots}
        <div style={{ display: 'flex', gap: 6 }}>
          {step > 0 && (<button onClick={onBack} style={tutorGhostBtn}>Voltar</button>)}
          <button onClick={onNext} style={{
            background: accent, color: T.c.n0, border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: 700,
            padding: '8px 16px', borderRadius: T.r.full,
          }}>{isLast ? '🍷 Concluir' : 'Próximo →'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── CoachmarkBubble ─────────────────────────────────────
function CoachmarkBubble({ rect, frame, cfg, accent, accentSoft, step, total, stepDots, onNext, onBack, onSkip, isLast, tutorial }) {
  const frameH = frame ? frame.clientHeight : 0;
  const frameW = frame ? frame.clientWidth : 360;
  const placeBelow = rect.y + rect.h + 200 < frameH;
  const arrowX = Math.max(20, Math.min(frameW - 40, rect.x + rect.w / 2));
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16,
      [placeBelow ? 'top' : 'bottom']: placeBelow ? rect.y + rect.h + 18 : frameH - rect.y + 18,
      pointerEvents: 'auto',
      animation: 'tcPopIn 320ms cubic-bezier(0.2, 0.9, 0.3, 1.15)',
    }}>
      {/* Arrow */}
      <div style={{
        position: 'absolute',
        [placeBelow ? 'top' : 'bottom']: -7, left: arrowX - 16,
        width: 14, height: 14, background: T.c.n0,
        transform: placeBelow ? 'rotate(45deg)' : 'rotate(45deg)',
        borderTopLeftRadius: 2,
        boxShadow: placeBelow
          ? '-2px -2px 6px rgba(0,0,0,0.06)'
          : '2px 2px 6px rgba(0,0,0,0.06)',
      }}/>
      <div style={{
        background: T.c.n0, borderRadius: T.r.lg, padding: 16,
        boxShadow: '0 12px 36px rgba(0,0,0,0.16)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <div style={{ animation: 'tcMascotBob 2.4s ease-in-out infinite', flexShrink: 0 }}>
            <TchinMascot size={28}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.caption, color: accent, fontWeight: 700 }}>{tutorial.name} · {step + 1}/{total}</div>
            <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 2 }}>{cfg.title || 'Olha aqui'}</div>
          </div>
          <button onClick={onSkip} style={tutorIconBtn}><Icon name="close" size={16} color={T.c.n600}/></button>
        </div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 12 }}>{cfg.body}</div>
        {cfg.tip && (
          <div style={{ padding: 8, background: accentSoft, borderRadius: T.r.sm, ...T.t.caption, color: T.c.n800, lineHeight: 1.45, marginBottom: 12, display: 'flex', gap: 6 }}>
            <Icon name="lightbulb" size={14} color={accent} fill={1}/>
            <span>{cfg.tip}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {stepDots}
          <div style={{ display: 'flex', gap: 6 }}>
            {step > 0 && (<button onClick={onBack} style={tutorGhostBtn}>Voltar</button>)}
            <button onClick={onNext} style={{
              background: accent, color: T.c.n0, border: 'none', cursor: 'pointer',
              fontFamily: T.font, fontSize: 13, fontWeight: 700,
              padding: '8px 14px', borderRadius: T.r.full,
            }}>{isLast ? '🍷 Pronto' : 'Próximo'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MascotBubble (mini) ─────────────────────────────────
function MascotBubble({ rect, frame, cfg, accent, step, total, stepDots, onNext, onBack, onSkip, isLast }) {
  const frameW = frame ? frame.clientWidth : 360;
  const placeRight = rect.x + rect.w / 2 < frameW / 2;
  return (
    <div style={{
      position: 'absolute',
      [placeRight ? 'left' : 'right']: 16,
      top: Math.min(rect.y + rect.h + 12, (frame ? frame.clientHeight : 0) - 180),
      width: 280, maxWidth: '85%',
      pointerEvents: 'auto',
      animation: 'tcCardSlide 320ms cubic-bezier(0.2, 0.9, 0.3, 1.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, justifyContent: placeRight ? 'flex-start' : 'flex-end' }}>
        {placeRight && <div style={{ animation: 'tcMascotBob 1.8s ease-in-out infinite' }}><TchinMascot size={36}/></div>}
        <div style={{
          background: T.c.n0, borderRadius: T.r.lg,
          padding: '12px 14px',
          maxWidth: 220,
          [placeRight ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: 4,
          boxShadow: '0 8px 20px rgba(0,0,0,0.14)',
        }}>
          <div style={{ ...T.t.body, color: T.c.n950, lineHeight: 1.45 }}>{cfg.body}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
            {stepDots}
            <button onClick={onNext} style={{
              background: accent, color: T.c.n0, border: 'none', cursor: 'pointer',
              fontFamily: T.font, fontSize: 12, fontWeight: 700,
              padding: '6px 12px', borderRadius: T.r.full,
            }}>{isLast ? 'Pronto' : 'Próximo'}</button>
          </div>
        </div>
        {!placeRight && <div style={{ animation: 'tcMascotBob 1.8s ease-in-out infinite' }}><TchinMascot size={36}/></div>}
      </div>
      <button onClick={onSkip} style={{
        ...tutorIconBtn, position: 'absolute', top: -10, right: -10,
        background: T.c.n950, color: T.c.n0,
        width: 26, height: 26,
      }}>
        <Icon name="close" size={14} color={T.c.n0}/>
      </button>
    </div>
  );
}

// ─── Tutoriais cadastrados ───────────────────────────────

registerTutorial({
  id: 'harmoniza',
  name: 'Harmoniza Pra Mim',
  intro: 'Não sabe que vinho combina com seu prato? Eu pesquiso. Te mostro 3 escolhas em 30 segundos.',
  accent: '#A04A55', accentSoft: '#FAF1F2',
  gradient: 'linear-gradient(135deg, #A04A55 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationRadar/>,
  steps: [
    {
      variant: 'coachmark',
      title: 'Conta o que você vai comer',
      body: 'Pode ser uma palavra ("picanha") ou frase ("massa com molho branco").',
      anchor: 'harmoniza-input',
    },
    {
      variant: 'hero',
      title: 'A magia acontece aqui',
      body: 'Eu cruzo seu paladar 5D com a curadoria do app, e mostro a melhor harmonização + duas alternativas.',
      illustration: <TutorIllustrationRadar/>,
    },
    {
      variant: 'bubble',
      body: 'Toca em qualquer sugestão pra ver "Por que combina" — explico em palavras claras.',
      tip: 'Se você marca o vinho que escolheu, ele já entra no diário com a harmonização registrada.',
    },
  ],
});

registerTutorial({
  id: 'modo-restaurante',
  name: 'Modo Restaurante',
  intro: 'Tá num restaurante com uma carta enorme e não sabe o que pedir? Foto da carta, eu decifro.',
  accent: '#B8894A', accentSoft: '#F5E9D4',
  gradient: 'linear-gradient(135deg, #B8894A 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationCarta/>,
  steps: [
    {
      variant: 'spotlight',
      title: 'Bate a foto aqui',
      body: 'Fotografa a página da carta — pode ser inteira ou só uma seção (tinto, branco, etc).',
      anchor: 'restaurante-capture',
      tip: 'Iluminação ruim? Liga a lanterna do celular antes.',
    },
    {
      variant: 'hero',
      title: 'Eu leio cada linha',
      body: 'Identifico os vinhos no nosso banco e mostro o match com seu paladar pra cada um.',
      illustration: <TutorIllustrationCarta/>,
    },
    {
      variant: 'bubble',
      body: 'Pode bater mais de uma foto (carta dividida em páginas) — eu junto tudo num resultado só.',
    },
    {
      variant: 'bubble',
      body: 'O resultado mostra o melhor match em destaque e os outros ordenados. Toca pra ver detalhes.',
      tip: 'Os garçons adoram quando você sabe o nome certo. "Moço, qual a história desse Tannat 2018?"',
    },
  ],
});

registerTutorial({
  id: 'scanner',
  name: 'Scanner de rótulo',
  intro: 'Tá com uma garrafa na mão e não conhece? Aponta a câmera pro rótulo. Em 2 segundos te conto.',
  accent: '#A04A55', accentSoft: '#FAF1F2',
  gradient: 'linear-gradient(135deg, #722F37 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationBottle/>,
  steps: [
    {
      variant: 'spotlight',
      title: 'Centraliza o rótulo',
      body: 'Não precisa de foto perfeita — eu leio até com luz ruim.',
      anchor: 'scanner-frame',
      pista: 'glow',
    },
    {
      variant: 'hero',
      title: 'Recebe a ficha completa',
      body: 'Produtor, safra, uva, região, preço médio — e o match com seu paladar.',
      illustration: <TutorIllustrationBottle/>,
    },
    {
      variant: 'bubble',
      body: 'Se quiser, registra na hora no seu diário. +10 pontos.',
      tip: 'Não achou? Manda o rótulo manual no Cadastrar, e a gente sobe pra todo mundo.',
    },
  ],
});

registerTutorial({
  id: 'confraria-criar',
  name: 'Criar sua Confraria',
  intro: 'Confraria é seu grupo: amigos, família, colegas. Você cria em 2 minutos.',
  accent: '#722F37', accentSoft: '#F5E3E5',
  gradient: 'linear-gradient(135deg, #722F37 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationConfraria/>,
  steps: [
    {
      variant: 'coachmark',
      title: 'Nome que define o grupo',
      body: 'Pode mudar depois. Bons nomes: cidade + tema ("Brindar em Brasília") ou pessoa + tipo ("Tannat & Cia").',
      anchor: 'confraria-nome',
    },
    {
      variant: 'hero',
      title: 'Define quem entra',
      body: 'Aberta (todo mundo), por aprovação (você aceita), ou fechada (só convite seu).',
      illustration: <TutorIllustrationConfraria/>,
    },
    {
      variant: 'bubble',
      body: 'Sobe uma capa, escreve regras, convida os primeiros membros.',
      tip: 'Link de convite no WhatsApp é o jeito mais rápido — entra direto.',
    },
    {
      variant: 'bubble',
      body: 'Depois disso, vamos marcar o primeiro encontro. Confraria sem evento esquece.',
    },
  ],
});

registerTutorial({
  id: 'evento-criar',
  name: 'Marcar um Evento',
  intro: 'Evento é o momento de encontrar o pessoal e tomar junto. Tudo combinado em 4 toques.',
  accent: '#722F37', accentSoft: '#F5E3E5',
  gradient: 'linear-gradient(135deg, #722F37 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationEvento/>,
  steps: [
    {
      variant: 'coachmark',
      title: 'Título bem direto',
      body: '"Degustação às cegas" ou "Final da Copa". Sem mistério no nome.',
      anchor: 'evento-titulo',
    },
    {
      variant: 'hero',
      title: 'Data, hora, local',
      body: 'Presencial ou online (link). A gente envia push 1 dia antes pra ninguém esquecer.',
      illustration: <TutorIllustrationEvento/>,
    },
    {
      variant: 'bubble',
      body: 'Define o kit: quantas garrafas, quem traz o quê. Cada um confirma o que leva no chat.',
      tip: 'Pra cega: papel kraft envolvendo a garrafa. Mistério até a revelação.',
    },
    {
      variant: 'bubble',
      body: 'Depois do evento, abre "Pós-evento" — todos avaliam os vinhos juntos. Vira ata coletiva.',
    },
  ],
});

registerTutorial({
  id: 'adega',
  name: 'Sua Adega',
  intro: 'Aqui mora tudo que você toma. Mais que lista — é a sua biografia em vinho.',
  accent: '#A04A55', accentSoft: '#FAF1F2',
  gradient: 'linear-gradient(135deg, #A04A55 0%, #722F37 100%)',
  heroIllustration: <TutorIllustrationRadar/>,
  steps: [
    {
      variant: 'coachmark',
      title: 'Toda garrafa vira história',
      body: 'Toca aqui pra registrar. Foto, nota, contexto, com quem você tomou.',
      anchor: 'add-button',
      tapHint: true,
    },
    {
      variant: 'spotlight',
      title: 'Sua estante visual',
      body: 'É a tela principal da Adega: toque num espaço pra colocar um vinho. Vai enchendo conforme você bebe.',
      anchor: 'matrix-empty',
    },
    {
      variant: 'hero',
      title: 'O Paladar 5D evolui',
      body: 'A cada registro, eu entendo melhor seu gosto. Quanto mais você marca, mais certeiro fica o match no Marketplace.',
      illustration: <TutorIllustrationRadar/>,
      tip: 'Faz a calibração com 5 vinhos pra acelerar o aprendizado.',
    },
  ],
});

registerTutorial({
  id: 'confraria-usar',
  name: 'Sua Confraria',
  intro: 'Você entrou! Vou te mostrar onde tudo acontece dentro da confraria.',
  accent: '#722F37', accentSoft: '#F5E3E5',
  gradient: 'linear-gradient(135deg, #722F37 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationConfraria/>,
  steps: [
    {
      variant: 'spotlight',
      title: 'Mural é o coração',
      body: 'Posts, fotos e papo de vinho. Pode comentar, curtir, mandar pra trás. Tudo rolando aqui.',
      anchor: 'confraria-feed',
    },
    {
      variant: 'coachmark',
      title: 'Encontros marcados',
      body: 'Confirma presença com um toque — a galera vê na hora.',
      anchor: 'confraria-events',
    },
    {
      variant: 'coachmark',
      title: 'Tudo no menu (⋯)',
      body: 'Convidar, regras, chat, sair, transferir admin. Tudo escondido aqui.',
      anchor: 'confraria-menu',
      tip: 'Chat da confraria também tem botão dedicado no header — ícone de balão.',
    },
  ],
});

registerTutorial({
  id: 'evento-usar',
  name: 'No Evento',
  intro: 'Bora te orientar dentro do evento. Em 3 toques você está pronta.',
  accent: '#B8894A', accentSoft: '#F5E9D4',
  gradient: 'linear-gradient(135deg, #B8894A 0%, #722F37 100%)',
  heroIllustration: <TutorIllustrationEvento/>,
  steps: [
    {
      variant: 'spotlight',
      title: 'Você vai? Avisa aqui',
      body: '"Confirmar", "Talvez" ou "Não vou". Quem confirma vê o endereço completo 24h antes.',
      anchor: 'evento-rsvp',
    },
    {
      variant: 'coachmark',
      title: 'Quem mais vai',
      body: 'Toca em alguém pra ver perfil e mandar mensagem direta.',
      anchor: 'evento-quem-vai',
    },
    {
      variant: 'coachmark',
      title: 'Botão de ação principal',
      body: 'Antes do evento: abre o chat do grupo. Depois: vira "Avaliar vinhos".',
      anchor: 'evento-chat',
      tip: 'O grupo do evento é separado do grupo da confraria.',
    },
  ],
});

// ═══════════ Tutoriais novos ═══════════════════════════

registerTutorial({
  id: 'descobrir',
  name: 'Descobrir Home',
  intro: 'Esta é sua tela principal. Vinhos selecionados pelo seu paladar, todo dia.',
  accent: '#A04A55', accentSoft: '#FAF1F2',
  gradient: 'linear-gradient(135deg, #A04A55 0%, #4A1F24 100%)',
  heroIllustration: <TutorIllustrationBottle/>,
  steps: [
    {
      variant: 'hero',
      title: 'Match do dia',
      body: 'Cada manhã eu escolho 1 vinho que combina com seu paladar e te entrego direto aqui.',
      illustration: <TutorIllustrationBottle/>,
    },
    {
      variant: 'bubble',
      body: 'Toca em qualquer vinho pra ver detalhes, comprar, registrar no diário ou pedir pra Harmoniza.',
      tip: 'O scanner (canto inferior direito) lê rótulo direto da câmera.',
    },
    {
      variant: 'bubble',
      body: 'Quanto mais você usa o app, melhores ficam as sugestões. Pode confiar.',
    },
  ],
});

registerTutorial({
  id: 'comunidade',
  name: 'Comunidade',
  intro: 'O feed de quem segue você + quem você segue. Pessoas reais comentando vinhos reais.',
  accent: '#722F37', accentSoft: '#F5E3E5',
  gradient: 'linear-gradient(135deg, #722F37 0%, #2A2A2A 100%)',
  steps: [
    {
      variant: 'hero',
      title: 'Posts de quem você segue',
      body: 'Fotos de garrafa, histórias de encontros, dicas. Pode curtir, comentar, mandar pra alguém.',
    },
    {
      variant: 'bubble',
      body: 'Quer postar? Botão "+" no canto inferior direito (FAB). Texto + foto + vinho marcado.',
    },
    {
      variant: 'bubble',
      body: 'Toca no avatar/nome pra ver perfil. Pode seguir, mandar mensagem, comparar paladar.',
      tip: 'Cartas grandes com cor de fundo são posts em destaque (post pago/curadoria).',
    },
  ],
});

registerTutorial({
  id: 'marketplace',
  name: 'Marketplace',
  intro: 'Vinhos curados de parceiros confiáveis. Todo vinho mostra match com seu paladar.',
  accent: '#2E7D32', accentSoft: '#E8F5E9',
  gradient: 'linear-gradient(135deg, #2E7D32 0%, #1F5223 100%)',
  steps: [
    {
      variant: 'hero',
      title: 'Vinhos por match',
      body: 'A lista vem ordenada pelo seu paladar 5D. Quanto mais alto o match, mais alinhado com você.',
      illustration: <TutorIllustrationBottle/>,
    },
    {
      variant: 'bubble',
      body: 'Filtros avançados no botão de cima: preço, país, uva, safra, premiados, orgânicos.',
      tip: 'Pra comparar 2 vinhos lado-a-lado, salva na wishlist (coração) e abre a wishlist.',
    },
    {
      variant: 'bubble',
      body: 'Carrinho/checkout sempre acessível pelo ícone do header. Frete grátis acima de R$ 300.',
    },
  ],
});

registerTutorial({
  id: 'perfil-meu',
  name: 'Meu Perfil',
  intro: 'Seu hub pessoal. Tudo sobre você no Tchin Tchin numa tela.',
  accent: '#A04A55', accentSoft: '#FAF1F2',
  gradient: 'linear-gradient(135deg, #A04A55 0%, #722F37 100%)',
  steps: [
    {
      variant: 'hero',
      title: 'Seu hub pessoal',
      body: 'Aqui rola tudo sobre você: seguidores, conquistas, paladar, confrarias, vinhos provados.',
    },
    {
      variant: 'bubble',
      body: 'Toca em "Seguidores" / "Seguindo" / "Pontos" no topo pra abrir cada um.',
      tip: 'Quer mudar a foto, bio, ou privacidade? "Editar perfil" no header.',
    },
    {
      variant: 'bubble',
      body: 'A barra de Jornada mostra etapas de progresso e quanto falta pra cada conquista.',
    },
  ],
});

registerTutorial({
  id: 'jornada',
  name: 'Sua Jornada',
  intro: 'Lista do que falta pra você dominar o Tchin Tchin. Cada etapa solta pontos.',
  accent: '#B8894A', accentSoft: '#F5E9D4',
  gradient: 'linear-gradient(135deg, #B8894A 0%, #4A1F24 100%)',
  steps: [
    {
      variant: 'hero',
      title: 'Trajetória gamificada',
      body: 'Etapas estruturadas pra você desbloquear todos os recursos. Cada uma libera pontos e badges.',
    },
    {
      variant: 'bubble',
      body: 'A próxima etapa fica em destaque com um botão direto ("Vamos lá →"). Sem mistério.',
      tip: 'Pontos somam pro seu rank na confraria + valem desconto no marketplace.',
    },
  ],
});

registerTutorial({
  id: 'indicacao',
  name: 'Indicação',
  intro: 'Convide amigos, ganhe R$ 30 no marketplace. Funciona pra você e pra quem entra.',
  accent: '#B8894A', accentSoft: '#F5E9D4',
  gradient: 'linear-gradient(135deg, #B8894A 0%, #4A1F24 100%)',
  steps: [
    {
      variant: 'hero',
      title: 'Convida, vocês dois ganham',
      body: 'Cada amigo que entra com seu link, vocês dois ganham R$ 30 no marketplace na 1ª compra.',
    },
    {
      variant: 'bubble',
      body: 'Compartilhe seu link por WhatsApp, e-mail, Stories. Quanto mais amigos, mais desbloqueios.',
      tip: 'Aos 5 amigos: 1 mês de Plus grátis. Aos 10: kit Tchin (taça personalizada).',
    },
  ],
});

registerTutorial({
  id: 'badges',
  name: 'Conquistas',
  intro: 'Selos que mostram suas conquistas. Bronze, prata, ouro.',
  accent: '#B8894A', accentSoft: '#F5E9D4',
  gradient: 'linear-gradient(135deg, #B8894A 0%, #722F37 100%)',
  steps: [
    {
      variant: 'hero',
      title: 'Sua coleção de selos',
      body: 'Cada selo conta uma história: "10 Malbecs", "Streak 7 dias", "Sommelier verificado".',
    },
    {
      variant: 'bubble',
      body: 'Selos em progresso mostram quanto falta pra você desbloquear. Bloqueados ficam em cinza.',
      tip: 'Pode compartilhar conquistas no Stories direto da galeria.',
    },
  ],
});

// ─── Illustrações pequenas (SVG inline) ──────────────────
function TutorIllustrationRadar() {
  return (
    <div style={{ height: 100, background: T.c.n50, borderRadius: T.r.md, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100" height="80" viewBox="-50 -40 100 80">
        {[16, 26, 36].map(r => (
          <polygon key={r} points={`0,${-r} ${r * 0.95},${-r * 0.31} ${r * 0.59},${r * 0.81} ${-r * 0.59},${r * 0.81} ${-r * 0.95},${-r * 0.31}`} fill="none" stroke={T.c.n300} strokeWidth="1"/>
        ))}
        <polygon points="0,-34 26,-8 22,28 -16,28 -32,-8" fill="rgba(160,74,85,0.35)" stroke={T.c.p700} strokeWidth="2"/>
        {['0,-36', '38,-12', '24,30', '-18,30', '-36,-12'].map((p, i) => (
          <circle key={i} cx={p.split(',')[0]} cy={p.split(',')[1]} r="2.5" fill={T.c.p700}/>
        ))}
      </svg>
    </div>
  );
}
function TutorIllustrationCarta() {
  return (
    <div style={{ height: 100, background: T.c.n50, borderRadius: T.r.md, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <div style={{ width: 64, height: 80, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: 4, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[1,2,3,4,5].map(i => <div key={i} style={{ height: 4, background: T.c.n200, borderRadius: 2, width: `${60 + i * 6}%` }}/>)}
      </div>
      <Icon name="arrow_forward" size={20} color={T.c.n400}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[92, 78, 65].map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BottlePlaceholder width={20} height={28} label="" showLabel={false}/>
            <span style={{ ...T.t.caption, fontFamily: T.mono, color: m > 80 ? T.c.s700 : T.c.n800, fontWeight: 700 }}>{m}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function TutorIllustrationBottle() {
  return (
    <div style={{ height: 100, background: T.c.n50, borderRadius: T.r.md, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <BottlePlaceholder width={44} height={64} label="" showLabel={false}/>
      <div style={{ flex: 1, maxWidth: 140 }}>
        <div style={{ height: 8, background: T.c.n200, borderRadius: 4, marginBottom: 6, width: '85%' }}/>
        <div style={{ height: 6, background: T.c.n200, borderRadius: 3, marginBottom: 8, width: '60%' }}/>
        <div style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: T.r.full, background: T.c.s100, color: T.c.s700, fontSize: 11, fontWeight: 700, fontFamily: T.mono }}>87% match</div>
      </div>
    </div>
  );
}
function TutorIllustrationConfraria() {
  return (
    <div style={{ height: 100, background: T.c.n50, borderRadius: T.r.md, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: -6 }}>
      <div style={{ display: 'flex' }}>
        {['CM', 'DR', 'FM', 'HB'].map((n, i) => (
          <div key={n} style={{
            marginLeft: i === 0 ? 0 : -8,
            width: 40, height: 40, borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${i * 70}, 50%, 50%), hsl(${i * 70 + 40}, 60%, 30%))`,
            border: `2.5px solid ${T.c.n50}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.c.n0, fontFamily: T.font, fontSize: 12, fontWeight: 700,
          }}>{n}</div>
        ))}
        <div style={{ marginLeft: -8, width: 40, height: 40, borderRadius: '50%', background: T.c.n200, border: `2.5px solid ${T.c.n50}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.c.n800, fontFamily: T.font, fontSize: 11, fontWeight: 700 }}>+12</div>
      </div>
    </div>
  );
}
function TutorIllustrationEvento() {
  return (
    <div style={{ height: 100, background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, borderRadius: T.r.md, color: T.c.n0, padding: 14, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 12px)`, borderRadius: T.r.md }}/>
      <div style={{ position: 'relative' }}>
        <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.75)' }}>SÁB · 18 MAI · 19h30</div>
        <div style={{ ...T.t.h3, color: T.c.n0, marginTop: 4, fontFamily: '"Fraunces", Georgia, serif' }}>Degustação às cegas</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '3px 8px', borderRadius: T.r.full, background: 'rgba(255,255,255,0.16)', ...T.t.caption, color: T.c.n0, fontWeight: 600 }}>
          <Icon name="location_on" size={12} color={T.c.n0}/>Casa da Carla
        </div>
      </div>
    </div>
  );
}

// ─── Selector / hub ──────────────────────────────────────
// Tela "Minhas dicas" — lista todos tutoriais com status (concluído / não visto)
function TutoriaisHubScreen({ go, onLaunch }) {
  const tutoriais = Object.values(TUTORIAL_REGISTRY);
  const done = readTutorDone();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={() => go('back')} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Tutoriais do Tchin</div>
        <button onClick={() => { resetAllTutorials(); go('toast', { kind: 'success', message: 'Tutoriais resetados.' }); }} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: T.c.p700,
          fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: '8px 14px',
        }}>Resetar</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Hero */}
        <div style={{
          padding: '24px 20px',
          background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
          color: T.c.n0, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ animation: 'tcMascotBob 2.4s ease-in-out infinite' }}>
              <TchinMascot size={56}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>SEU SOMMELIER DIGITAL</div>
              <div style={{ ...T.t.h2, color: T.c.n0, fontFamily: '"Fraunces", Georgia, serif' }}>Oi! Sou o Tchin</div>
              <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>Te mostro como cada feature funciona.</div>
            </div>
          </div>
        </div>
        {/* List */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tutoriais.map(t => {
            const isDone = !!done[t.id];
            return (
              <button key={t.id} onClick={() => onLaunch && onLaunch(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: T.r.md,
                  background: isDone ? T.c.s100 : T.c.p50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={isDone ? 'check_circle' : 'auto_awesome'} size={22} color={isDone ? T.c.s700 : T.c.p700} fill={isDone ? 1 : 0}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{t.name}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{t.steps.length} passos · {Math.ceil(t.steps.length * 0.5)} min</div>
                </div>
                <Icon name="chevron_right" size={20} color={T.c.n400}/>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  TchinTutor, TchinMascot, TutorPista, TypingDots,
  TUTORIAL_REGISTRY, registerTutorial, getTutorial,
  readTutorDone, markTutorDone, resetAllTutorials, isTutorDone,
  TutoriaisHubScreen,
});


export { CoachmarkBubble, MascotBubble, SpotlightCaption, TUTORIAL_REGISTRY, TUTOR_DONE_KEY, TchinMascot, TchinTutor, TutorIllustrationBottle, TutorIllustrationCarta, TutorIllustrationConfraria, TutorIllustrationEvento, TutorIllustrationRadar, TutorPista, TutoriaisHubScreen, TypingDots, getTutorial, isTutorDone, markTutorDone, readTutorDone, registerTutorial, resetAllTutorials, tutorGhostBtn, tutorIconBtn };
