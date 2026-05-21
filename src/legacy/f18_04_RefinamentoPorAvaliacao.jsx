/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 18.04 · RefinamentoPorAvaliacao — feedback "paladar mais preciso"
//
// US-T1-003 / US-13-2-01 · aparece após avaliação (5ª, 10ª, 20ª, ×25)
//
//   Toast (4s):
//     <RefinamentoPorAvaliacao
//       variant="toast"
//       precisionDelta={6}                  // +6%
//       onOpenPaladar={() => ...}
//       onDismiss={() => ...}
//     />
//
//   Mini-card transitório (10s):
//     <RefinamentoPorAvaliacao
//       variant="card"
//       precisionDelta={6}
//       changedAxis="tanino"                // 'acidez' | 'tanino' | 'corpo' | 'frutado' | 'docura'
//       direction="up"                      // 'up' | 'down'
//       before={{ acidez: 3, tanino: 3, corpo: 3, frutado: 3, docura: 2 }}
//       after={{ acidez: 3, tanino: 4, corpo: 3, frutado: 4, docura: 2 }}
//       onOpenPaladar={() => ...}
//       onDismiss={() => ...}
//     />
//
// Componente é puramente apresentacional — quem decide se aparece
// (5ª/10ª/20ª/×25) é o host.
// ─────────────────────────────────────────────────────────────

const REFINAMENTO_AXES = [
  { key: 'acidez',  label: 'Acidez'  },
  { key: 'tanino',  label: 'Tanino'  },
  { key: 'corpo',   label: 'Corpo'   },
  { key: 'frutado', label: 'Frutado' },
  { key: 'docura',  label: 'Doçura'  },
];

// Keyframes (injected once)
if (typeof document !== 'undefined' && !document.getElementById('tc-refine-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-refine-kf';
  s.textContent = `
    @keyframes tcRefineSlideIn  { from { transform: translate(-50%, -120%); opacity: 0 } to { transform: translate(-50%, 0); opacity: 1 } }
    @keyframes tcRefineSlideOut { from { transform: translate(-50%, 0); opacity: 1 } to { transform: translate(-50%, -120%); opacity: 0 } }
    @keyframes tcRefineCardIn   { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    @keyframes tcRefineCardOut  { from { transform: translateY(0); opacity: 1 } to { transform: translateY(-8px); opacity: 0 } }
    @keyframes tcRefineProgress { from { transform: scaleX(1) } to { transform: scaleX(0) } }
    @keyframes tcRefineRadarPulse {
      0%   { stroke-width: 2; opacity: 0.7 }
      50%  { stroke-width: 3; opacity: 1   }
      100% { stroke-width: 2; opacity: 0.85 }
    }
  `;
  document.head.appendChild(s);
}

const REFINE_GRAD = 'linear-gradient(135deg, #722F37 0%, #1565C0 100%)';

function RefinamentoPorAvaliacao({
  variant = 'toast',
  precisionDelta = 6,
  changedAxis = 'tanino',
  direction = 'up',
  before,
  after,
  durationMs,           // default 4000 (toast) | 10000 (card)
  onOpenPaladar = () => {},
  onDismiss = () => {},
  topOffset = 56,
  // Demo: never auto-dismiss in canvas previews
  staticDemo = false,
}) {
  const dur = typeof durationMs === 'number'
    ? durationMs
    : (variant === 'toast' ? 4000 : 10000);

  const [leaving, setLeaving] = React.useState(false);
  const [unmount, setUnmount] = React.useState(false);

  React.useEffect(() => {
    if (staticDemo) return;
    const t1 = setTimeout(() => setLeaving(true), dur);
    const t2 = setTimeout(() => { setUnmount(true); onDismiss(); }, dur + 240);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dur, onDismiss, staticDemo]);

  if (unmount) return null;

  if (variant === 'toast') {
    return (
      <RefinementToast
        precisionDelta={precisionDelta}
        leaving={leaving}
        topOffset={topOffset}
        onTap={onOpenPaladar}
        onClose={() => setLeaving(true)}
      />
    );
  }

  return (
    <RefinementCard
      precisionDelta={precisionDelta}
      changedAxis={changedAxis}
      direction={direction}
      before={before}
      after={after}
      leaving={leaving}
      dur={dur}
      onTap={onOpenPaladar}
      onClose={() => setLeaving(true)}
      staticDemo={staticDemo}
    />
  );
}

// ─── Toast variant ────────────────────────────────────────────
function RefinementToast({ precisionDelta, leaving, topOffset, onTap, onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      onClick={(e) => {
        if (e.target.closest('[data-refine-close]')) return;
        if (onTap) onTap();
      }}
      style={{
        position: 'absolute',
        top: topOffset, left: '50%',
        transform: 'translate(-50%, 0)',
        width: 'calc(100% - 32px)', maxWidth: 360,
        padding: '14px 14px 14px 16px',
        background: REFINE_GRAD,
        color: T.c.n0,
        borderRadius: T.r.lg,
        boxShadow: '0 10px 28px rgba(74,31,36,0.30), 0 2px 6px rgba(21,101,192,0.20)',
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: T.font,
        zIndex: 9999,
        animation: leaving
          ? 'tcRefineSlideOut 220ms ease forwards'
          : 'tcRefineSlideIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        cursor: onTap ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      {/* Trending up in a soft disc */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.16)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="trending_up" size={20} color={T.c.n0} weight={600}/>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: T.c.n0,
          letterSpacing: '0.1px', lineHeight: 1.3,
        }}>Seu paladar ficou +{precisionDelta}% mais preciso</div>
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.78)',
          marginTop: 2, lineHeight: 1.4,
        }}>Continue avaliando — fica cada vez melhor.</div>
      </div>

      <Icon
        name="chevron_right"
        size={20}
        color="rgba(255,255,255,0.65)"
        style={{ flexShrink: 0, marginRight: -4 }}
      />

      <button
        data-refine-close
        type="button"
        aria-label="Dispensar"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute', top: 6, right: 6,
          width: 22, height: 22, borderRadius: '50%',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.65)',
        }}
      >
        <Icon name="close" size={12} color="rgba(255,255,255,0.65)"/>
      </button>
    </div>
  );
}

// ─── Mini-card variant ───────────────────────────────────────
function RefinementCard({
  precisionDelta, changedAxis, direction,
  before, after, leaving, dur, onTap, onClose, staticDemo,
}) {
  // Defaults: synthesize before/after if not provided
  const beforeProfile = before || { acidez: 3, tanino: 3, corpo: 3, frutado: 3, docura: 3 };
  const afterProfile  = after  || { ...beforeProfile, [changedAxis]: Math.max(1, Math.min(5,
    (beforeProfile[changedAxis] || 3) + (direction === 'down' ? -1 : 1)
  )) };

  const axisLabel = (REFINAMENTO_AXES.find(a => a.key === changedAxis) || {}).label || changedAxis;
  const verb = direction === 'down' ? 'menos' : 'mais';
  const trendIcon = direction === 'down' ? 'trending_down' : 'trending_up';

  return (
    <article
      role="status"
      aria-live="polite"
      style={{
        position: 'relative',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        boxShadow: '0 8px 24px rgba(74,31,36,0.10), 0 2px 6px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        fontFamily: T.font,
        animation: leaving
          ? 'tcRefineCardOut 220ms ease forwards'
          : 'tcRefineCardIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
      }}
    >
      {/* Top gradient stripe */}
      <div aria-hidden="true" style={{
        height: 4, background: REFINE_GRAD,
      }}/>

      <div style={{
        padding: '14px 14px 12px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        {/* Mini radar */}
        <RadarPreview
          before={beforeProfile}
          after={afterProfile}
          highlightAxis={changedAxis}
          size={80}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 8px',
            background: T.c.p50,
            border: `1px solid ${T.c.p100}`,
            borderRadius: T.r.full,
            fontSize: 11, fontWeight: 700,
            color: T.c.p700, letterSpacing: 0.2,
          }}>
            <Icon name={trendIcon} size={12} color={T.c.p700}/>
            +{precisionDelta}% mais preciso
          </div>

          <p style={{
            margin: '8px 0 0',
            fontSize: 13, lineHeight: 1.45,
            color: T.c.n800,
          }}>
            Esse registro mudou levemente seu perfil — agora você gosta{' '}
            <b style={{ color: T.c.n950, fontWeight: 700 }}>{verb} de {axisLabel.toLowerCase()}</b>.
          </p>

          <button
            type="button"
            onClick={onTap}
            style={{
              marginTop: 8,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, color: T.c.p700,
              fontFamily: T.font, fontSize: 12, fontWeight: 600,
            }}
          >
            Ver Meu Paladar
            <Icon name="arrow_forward" size={14} color={T.c.p700}/>
          </button>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Dispensar"
          style={{
            marginTop: -4, marginRight: -4,
            width: 28, height: 28, borderRadius: '50%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: T.c.n600,
            flexShrink: 0,
          }}
        >
          <Icon name="close" size={16} color={T.c.n600}/>
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {!staticDemo && (
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: T.c.n100, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: '100%',
            background: REFINE_GRAD,
            transformOrigin: 'left center',
            animation: `tcRefineProgress ${dur}ms linear forwards`,
          }}/>
        </div>
      )}
    </article>
  );
}

// ─── Mini radar chart (5 axes, before + after) ───────────────
function RadarPreview({ before, after, highlightAxis, size = 80 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 8;
  const axes = REFINAMENTO_AXES;
  const angleFor = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / axes.length);

  const pointFor = (val, i) => {
    const ratio = Math.max(0, Math.min(1, (val - 1) / 4));
    const a = angleFor(i);
    return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio];
  };

  const polyPoints = (profile) => axes.map((ax, i) => {
    const [x, y] = pointFor(profile[ax.key] || 0, i);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  // Grid rings
  const rings = [0.33, 0.66, 1];

  // Highlighted spoke
  const hi = axes.findIndex(a => a.key === highlightAxis);
  const hiAngle = hi >= 0 ? angleFor(hi) : null;
  const hiEnd = hi >= 0 ? [cx + Math.cos(hiAngle) * r, cy + Math.sin(hiAngle) * r] : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Rings */}
      {rings.map((ratio, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r * ratio}
          fill="none"
          stroke={T.c.n200}
          strokeWidth={1}
          strokeDasharray={i < 2 ? '2 3' : 'none'}
        />
      ))}
      {/* Spokes */}
      {axes.map((_, i) => {
        const a = angleFor(i);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <line
            key={i}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={T.c.n200} strokeWidth={1}
          />
        );
      })}
      {/* Highlighted spoke */}
      {hiEnd && (
        <line
          x1={cx} y1={cy} x2={hiEnd[0]} y2={hiEnd[1]}
          stroke={T.c.a500} strokeWidth={1.5}
          strokeDasharray="2 2"
        />
      )}
      {/* Before polygon — dashed outline only */}
      <polygon
        points={polyPoints(before)}
        fill="rgba(160,74,85,0.10)"
        stroke={T.c.n400}
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      {/* After polygon — filled burgundy */}
      <polygon
        points={polyPoints(after)}
        fill="rgba(114,47,55,0.32)"
        stroke={T.c.p700}
        strokeWidth={2}
        style={{
          animation: 'tcRefineRadarPulse 1800ms ease-in-out 1',
        }}
      />
      {/* After vertex dots */}
      {axes.map((ax, i) => {
        const [x, y] = pointFor(after[ax.key] || 0, i);
        const isHi = ax.key === highlightAxis;
        return (
          <circle
            key={ax.key}
            cx={x} cy={y}
            r={isHi ? 3 : 1.8}
            fill={isHi ? T.c.a500 : T.c.p700}
            stroke={isHi ? T.c.n0 : 'none'}
            strokeWidth={isHi ? 1.2 : 0}
          />
        );
      })}
    </svg>
  );
}

Object.assign(window, { RefinamentoPorAvaliacao, REFINAMENTO_AXES, RadarPreview });


export { REFINAMENTO_AXES, REFINE_GRAD, RadarPreview, RefinamentoPorAvaliacao, RefinementCard, RefinementToast };
