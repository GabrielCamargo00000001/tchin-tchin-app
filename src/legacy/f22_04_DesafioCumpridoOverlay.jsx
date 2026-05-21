/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 22.04 · DesafioCumpridoOverlay — celebração imediata
//
// US-13-3-03 · aparece full-screen logo após cumprir o desafio
//
//   <DesafioCumpridoOverlay
//     isOpen
//     challenge={{ title: 'Desafio espanhol', weekNumber: 21 }}
//     pointsAwarded={50}
//     badge={{ name: 'Semana 21', emoji: '🏅' }}
//     onDismiss={() => goToast('Veja em Meu Progresso')}
//     autoDismissMs={4000}
//   />
//
// 4s, auto-dismiss. Tap dispensa antes. Confetti DOM (sem libs).
// ─────────────────────────────────────────────────────────────

if (typeof document !== 'undefined' && !document.getElementById('tc-desafio-overlay-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-desafio-overlay-kf';
  s.textContent = `
    @keyframes tcDesafioBackdropIn  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes tcDesafioBackdropOut { from { opacity: 1 } to { opacity: 0 } }
    @keyframes tcDesafioTrophyPop {
      0%   { transform: scale(0.4) rotate(-10deg); opacity: 0; }
      60%  { transform: scale(1.18) rotate(4deg); opacity: 1; }
      80%  { transform: scale(0.96) rotate(-2deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes tcDesafioTrophyRing {
      0%   { transform: scale(0.7); opacity: 0.65; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    @keyframes tcDesafioFadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes tcDesafioConfetti {
      0%   { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translate3d(var(--cx, 0px), var(--cy, 320px), 0) rotate(var(--cr, 720deg)); opacity: 0; }
    }
    @keyframes tcDesafioPulseDot { 0%,100% { opacity: 0.45 } 50% { opacity: 1 } }
  `;
  document.head.appendChild(s);
}

function DesafioCumpridoOverlay({
  isOpen,
  challenge = {},
  pointsAwarded = 50,
  badge,
  onDismiss = () => {},
  autoDismissMs = 4000,
  staticDemo = false,
}) {
  const [leaving, setLeaving] = React.useState(false);
  const [mounted, setMounted] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) { setMounted(true); setLeaving(false); }
    else if (mounted) {
      setLeaving(true);
      const t = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(t);
    }
  }, [isOpen]); // eslint-disable-line

  React.useEffect(() => {
    if (!isOpen || staticDemo) return;
    const id = setTimeout(() => handleDismiss(), autoDismissMs);
    return () => clearTimeout(id);
  }, [isOpen, autoDismissMs, staticDemo]); // eslint-disable-line

  const handleDismiss = React.useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(), 220);
  }, [onDismiss]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Desafio cumprido"
      onClick={handleDismiss}
      style={{
        position: 'absolute', inset: 0, zIndex: 9999,
        background: 'linear-gradient(135deg, rgba(184,137,74,0.92) 0%, rgba(122,82,38,0.95) 100%)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        animation: leaving
          ? 'tcDesafioBackdropOut 220ms ease forwards'
          : 'tcDesafioBackdropIn 240ms ease forwards',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        color: T.c.n0,
        fontFamily: T.font,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Confetti */}
      {!staticDemo && <OverlayConfetti durationMs={2000} count={56}/>}

      {/* Big trophy */}
      <TrophyMedal/>

      {/* Headline */}
      <h1 style={{
        margin: '32px 0 0',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 40, fontWeight: 500,
        letterSpacing: '-0.025em', lineHeight: 1.0,
        color: T.c.n0, textWrap: 'balance', textAlign: 'center',
        textShadow: '0 2px 6px rgba(0,0,0,0.20)',
        animation: 'tcDesafioFadeUp 480ms ease 320ms both',
      }}>Desafio cumprido!</h1>

      <p style={{
        margin: '12px 0 0', maxWidth: 320, textAlign: 'center',
        fontSize: 17, fontWeight: 500, lineHeight: 1.4,
        color: 'rgba(255,255,255,0.92)',
        letterSpacing: '-0.005em',
        textShadow: '0 1px 3px rgba(0,0,0,0.15)',
        animation: 'tcDesafioFadeUp 480ms ease 420ms both',
      }}>{challenge.title || 'Você cumpriu o desafio da semana'}</p>

      {/* Stats row */}
      <div style={{
        marginTop: 28,
        display: 'flex', gap: 12,
        animation: 'tcDesafioFadeUp 480ms ease 540ms both',
      }}>
        <StatTile
          big={`+${pointsAwarded}`}
          label="pontos"
          icon="stars"
        />
        <StatTile
          big={badge && badge.emoji ? badge.emoji : '🏅'}
          isEmoji
          label={badge && badge.name ? `Badge "${badge.name}"` : 'Badge da semana'}
        />
      </div>

      {/* Tap to continue */}
      <div style={{
        position: 'absolute', bottom: 32, left: 0, right: 0,
        textAlign: 'center',
        fontSize: 12, fontWeight: 500,
        color: 'rgba(255,255,255,0.70)',
        letterSpacing: 0.4,
        textShadow: '0 1px 3px rgba(0,0,0,0.20)',
        display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 6,
        animation: 'tcDesafioFadeUp 480ms ease 720ms both',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'rgba(255,255,255,0.70)',
          animation: 'tcDesafioPulseDot 1500ms ease-in-out infinite',
          display: 'inline-block',
        }}/>
        <span style={{ flex: 'none', marginLeft: 0 }}>Toque pra continuar</span>
      </div>
    </div>
  );
}

// ─── Trophy medallion ────────────────────────────────────────
function TrophyMedal() {
  return (
    <div style={{
      position: 'relative',
      width: 120, height: 120,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Expanding ring */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.85)',
        animation: 'tcDesafioTrophyRing 1100ms ease-out 300ms 1',
      }}/>
      {/* Glow */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: -16, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.32) 0%, transparent 70%)',
      }}/>
      {/* Filled medallion */}
      <span style={{
        position: 'relative',
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${T.c.a500} 0%, ${T.c.a700} 60%, #6E4F1F 100%)`,
        border: '3px solid rgba(255,255,255,0.92)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 28px rgba(74,31,36,0.45), inset 0 -4px 10px rgba(0,0,0,0.20)',
        animation: 'tcDesafioTrophyPop 620ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      }}>
        <Icon name="emoji_events" size={72} color={T.c.n0} fill={1} weight={500}/>
      </span>
    </div>
  );
}

// ─── Stat tile ───────────────────────────────────────────────
function StatTile({ big, label, icon, isEmoji }) {
  return (
    <div style={{
      minWidth: 120,
      padding: '14px 16px',
      background: 'rgba(255,255,255,0.18)',
      border: '1px solid rgba(255,255,255,0.30)',
      borderRadius: T.r.lg,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      textAlign: 'center',
      color: T.c.n0,
    }}>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: isEmoji ? 32 : 28, fontWeight: 600,
        letterSpacing: '-0.02em', lineHeight: 1.0,
        color: T.c.n0,
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        {icon && !isEmoji && (
          <Icon name={icon} size={22} color={T.c.n0} fill={1}/>
        )}
        {big}
      </div>
      <div style={{
        marginTop: 6,
        fontSize: 12, fontWeight: 500,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: 0.3,
        textWrap: 'balance',
      }}>{label}</div>
    </div>
  );
}

// ─── Confetti (DOM-based) ────────────────────────────────────
function OverlayConfetti({ durationMs = 2000, count = 56 }) {
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const id = setTimeout(() => setShow(false), durationMs + 200);
    return () => clearTimeout(id);
  }, [durationMs]);

  const COLORS = [T.c.n0, T.c.a500, '#FFE7B2', T.c.p700, T.c.s700];
  const SHAPES = ['rect', 'circle', 'rect'];

  const particles = React.useMemo(() => Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const dist = 130 + Math.random() * 220;
    const cx = Math.cos(angle) * dist + (Math.random() - 0.5) * 140;
    const cy = 240 + Math.random() * 300;
    const rot = (Math.random() * 1440 - 720) | 0;
    return {
      key: i,
      left: 50 + (Math.random() - 0.5) * 20,
      top: 12 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      cx: cx | 0, cy: cy | 0, cr: rot,
      delay: Math.random() * 220,
      dur: 1300 + Math.random() * 700,
    };
  }), [count]);

  if (!show) return null;

  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      zIndex: 1, overflow: 'hidden',
    }}>
      {particles.map(p => (
        <span
          key={p.key}
          style={{
            position: 'absolute',
            left: `${p.left}%`, top: `${p.top}%`,
            width: p.w, height: p.shape === 'circle' ? p.w : p.h,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 1,
            transform: 'translate3d(0,0,0)',
            animation: `tcDesafioConfetti ${p.dur}ms cubic-bezier(0.2, 0.7, 0.3, 1) ${p.delay}ms forwards`,
            ['--cx']: `${p.cx}px`,
            ['--cy']: `${p.cy}px`,
            ['--cr']: `${p.cr}deg`,
          }}
        />
      ))}
    </div>
  );
}

Object.assign(window, { DesafioCumpridoOverlay });


export { DesafioCumpridoOverlay, OverlayConfetti, StatTile, TrophyMedal };
