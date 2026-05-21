/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 15.01 · PointsCounter — burgundy pill with points count
//
//   <PointsCounter points={120} onTap={() => goProgress()} />
//
//   Animates a pulse + "+N" floating label when `points` increases.
// ─────────────────────────────────────────────────────────────

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('tc-points-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-points-kf';
  s.textContent = `
    @keyframes tcPointsPulse {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
    @keyframes tcPointsFloat {
      0%   { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
      18%  { transform: translate(-50%, -6px) scale(1.05); opacity: 1; }
      80%  { transform: translate(-50%, -28px) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -42px) scale(0.95); opacity: 0; }
    }
    @keyframes tcPointsCountUp { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(s);
}

function PointsCounter({
  points = 0,
  onTap,
  size = 'md',                  // 'sm' | 'md' | 'lg'
  ariaLabel,
}) {
  const sizes = {
    sm: { h: 24, px: 10, fs: 11, icon: 12, gap: 4 },
    md: { h: 28, px: 12, fs: 13, icon: 14, gap: 4 },
    lg: { h: 36, px: 16, fs: 15, icon: 18, gap: 6 },
  };
  const sz = sizes[size] || sizes.md;

  // Track previous value to detect increments
  const [delta, setDelta] = React.useState(null);  // { value, key }
  const [pulse, setPulse] = React.useState(false);
  const prev = React.useRef(points);
  const seq = React.useRef(0);

  React.useEffect(() => {
    if (points > prev.current) {
      const diff = points - prev.current;
      seq.current += 1;
      setDelta({ value: diff, key: seq.current });
      setPulse(true);
      const t1 = setTimeout(() => setPulse(false), 420);
      const t2 = setTimeout(() => setDelta(null), 1500);
      prev.current = points;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prev.current = points;
  }, [points]);

  // Animated count-up effect (count tweens up over 400ms during pulse)
  const [displayed, setDisplayed] = React.useState(points);
  React.useEffect(() => {
    if (points === displayed) return;
    if (points < displayed) {                // sudden drop: set immediately
      setDisplayed(points);
      return;
    }
    const start = performance.now();
    const from = displayed;
    const to = points;
    const dur = Math.min(600, 200 + (to - from) * 8);
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 2);
      setDisplayed(Math.round(from + (to - from) * ease));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [points]); // eslint-disable-line

  const formatted = formatPoints(displayed);

  const Tag = onTap ? 'button' : 'div';
  return (
    <Tag
      type={onTap ? 'button' : undefined}
      onClick={onTap}
      aria-label={ariaLabel || `${points} pontos`}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: sz.gap,
        height: sz.h,
        padding: `0 ${sz.px}px`,
        background: T.c.p700,
        color: T.c.n0,
        border: 'none',
        borderRadius: 9999,
        cursor: onTap ? 'pointer' : 'default',
        fontFamily: T.font,
        fontSize: sz.fs, fontWeight: 700, letterSpacing: '0.1px',
        boxShadow: '0 1px 2px rgba(74, 31, 36, 0.18), 0 0 0 0 rgba(74, 31, 36, 0)',
        transition: 'box-shadow 200ms, background 120ms',
        animation: pulse ? 'tcPointsPulse 420ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        outline: 'none',
        userSelect: 'none',
      }}
    >
      <Icon name="stars" size={sz.icon} color={T.c.n0} fill={1}/>
      <span style={{ minWidth: 14, textAlign: 'left' }}>{formatted}</span>

      {/* Floating "+N" indicator */}
      {delta && (
        <span
          key={delta.key}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%', top: -2,
            transform: 'translate(-50%, 0)',
            color: T.c.a500 || '#D4A574',
            background: T.c.p900,
            padding: '2px 8px',
            borderRadius: 9999,
            fontSize: 11, fontWeight: 800,
            letterSpacing: '0.3px',
            pointerEvents: 'none',
            animation: 'tcPointsFloat 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            boxShadow: '0 4px 12px rgba(74, 31, 36, 0.35)',
            whiteSpace: 'nowrap',
          }}
        >+{delta.value}</span>
      )}
    </Tag>
  );
}

// ─── Helper: pretty number (1234 → "1.234", 12345 → "12.3k") ──
function formatPoints(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0';
  if (n < 1000) return String(n);
  if (n < 10000) return n.toLocaleString('pt-BR');
  if (n < 1000000) return (n / 1000).toFixed(n < 100000 ? 1 : 0).replace('.', ',') + 'k';
  return (n / 1000000).toFixed(1).replace('.', ',') + 'M';
}

Object.assign(window, { PointsCounter, formatPoints });


export { PointsCounter, formatPoints };
