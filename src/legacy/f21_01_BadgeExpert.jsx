/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 21.01 · BadgeExpert — checkmark verificado de sommelier
//
// US-12-13-02 · aparece inline ao lado do nome do user
//
//   <BadgeExpert size="sm"/>
//   <BadgeExpert
//     size="md"
//     expertData={{ formacao: 'ABS-SP, atua há 12 anos' }}
//   />
//
// Tap (ou hover no desktop) abre tooltip "Sommelier verificado — {formação}".
// Cor: blue/500 (i700 do design system, mais escuro que o azul do Twitter).
// ─────────────────────────────────────────────────────────────

const BADGE_EXPERT_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
};

// Keyframes (injected once)
if (typeof document !== 'undefined' && !document.getElementById('tc-badge-expert-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-badge-expert-kf';
  s.textContent = `
    @keyframes tcBadgeTipIn {
      from { opacity: 0; transform: translate(-50%, -2px); }
      to   { opacity: 1; transform: translate(-50%, 0); }
    }
  `;
  document.head.appendChild(s);
}

function BadgeExpert({
  size = 'sm',
  expertData,
  color,                     // override; defaults to i700
  inline = true,             // align-baseline vs free
  ariaLabel,
}) {
  const px = BADGE_EXPERT_SIZES[size] || BADGE_EXPERT_SIZES.sm;
  const tipColor = color || T.c.i700;

  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const closeTimer = React.useRef(null);

  // Close on outside tap / Esc
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  React.useEffect(() => () => clearTimeout(closeTimer.current), []);

  const tipText = expertData && expertData.formacao
    ? `Sommelier verificado — ${expertData.formacao}`
    : 'Sommelier verificado';

  const label = ariaLabel || tipText;

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(o => !o);
  };
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <span
      ref={wrapRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        verticalAlign: inline ? 'baseline' : 'middle',
        lineHeight: 0,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={label}
        aria-expanded={open}
        style={{
          background: 'none', border: 'none', padding: 0, margin: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          width: px, height: px,
          color: tipColor,
          lineHeight: 0,
          verticalAlign: inline ? 'middle' : 'baseline',
          // Slight optical lift so it sits well next to text baselines
          transform: inline ? 'translateY(-1px)' : undefined,
          outlineOffset: 2,
        }}
      >
        <Icon
          name="verified"
          size={px}
          color={tipColor}
          fill={1}
          weight={600}
        />
      </button>

      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            top: `calc(100% + 6px)`,
            left: '50%',
            transform: 'translate(-50%, 0)',
            zIndex: 50,
            padding: '6px 10px',
            background: T.c.n950,
            color: T.c.n0,
            borderRadius: T.r.sm,
            fontFamily: T.font,
            fontSize: 11,
            fontWeight: 500,
            lineHeight: 1.35,
            letterSpacing: 0.1,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
            animation: 'tcBadgeTipIn 140ms ease forwards',
            pointerEvents: 'none',
            maxWidth: 220,
            textWrap: 'pretty',
            whiteSpace: 'normal',
            textAlign: 'center',
            minWidth: 140,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: -4, left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 8, height: 8, background: T.c.n950,
              borderRadius: 1,
            }}
          />
          {expertData && expertData.formacao ? (
            <>
              <span style={{
                display: 'block', fontWeight: 700,
                color: T.c.n0,
              }}>Sommelier verificado</span>
              <span style={{
                display: 'block',
                color: 'rgba(255,255,255,0.78)',
                marginTop: 2,
                fontWeight: 500,
              }}>{expertData.formacao}</span>
            </>
          ) : (
            <span style={{ fontWeight: 700, color: T.c.n0 }}>
              Sommelier verificado
            </span>
          )}
        </span>
      )}
    </span>
  );
}

// ─── Helper: name + badge inline ─────────────────────────────
function NameWithBadge({ name, expert, expertData, size = 'sm', nameStyle = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 4,
      fontFamily: T.font,
      ...nameStyle,
    }}>
      <span>{name}</span>
      {expert && <BadgeExpert size={size} expertData={expertData}/>}
    </span>
  );
}

Object.assign(window, { BadgeExpert, NameWithBadge, BADGE_EXPERT_SIZES });


export { BADGE_EXPERT_SIZES, BadgeExpert, NameWithBadge };
