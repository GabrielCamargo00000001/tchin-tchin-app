/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { formatPoints } from './f15_01_PointsCounter.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 19.01 · CardPontos — micro-card "+N pontos"
//
//   <CardPontos
//     pointsAwarded={10}
//     totalPoints={140}
//     onTap={() => goMeuProgresso()}
//   />
//
// Padrão: aparece em 18.03 ConfirmacaoRegistro, mas é reusável em
// qualquer fluxo que premie o user (resumo pós-evento, badge unlock,
// etc.). Tap navega pra Meu Progresso (15.02).
// ─────────────────────────────────────────────────────────────

function CardPontos({
  pointsAwarded = 10,
  totalPoints = 0,
  onTap,
  // Demo: skip the count-up tween in static artboards
  animateCountUp = true,
  style = {},
  ariaLabel,
}) {
  // Animated total count-up from (total - awarded) → total
  const [displayed, setDisplayed] = React.useState(
    animateCountUp ? Math.max(0, totalPoints - pointsAwarded) : totalPoints
  );

  React.useEffect(() => {
    if (!animateCountUp) { setDisplayed(totalPoints); return; }
    const from = Math.max(0, totalPoints - pointsAwarded);
    const to = totalPoints;
    if (from === to) { setDisplayed(to); return; }
    const start = performance.now();
    const dur = 800;
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 2);
      setDisplayed(Math.round(from + (to - from) * ease));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    const wait = setTimeout(() => { raf = requestAnimationFrame(step); }, 200);
    return () => { clearTimeout(wait); if (raf) cancelAnimationFrame(raf); };
  }, [totalPoints, pointsAwarded, animateCountUp]);

  const formatted = (typeof formatPoints === 'function')
    ? formatPoints(displayed)
    : displayed.toLocaleString('pt-BR');

  const interactive = !!onTap;
  const Tag = interactive ? 'button' : 'div';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onTap}
      aria-label={ariaLabel || `+${pointsAwarded} pontos. Total ${displayed} pontos.`}
      style={{
        position: 'relative',
        width: '100%',
        textAlign: 'left',
        background: T.c.p700,
        color: T.c.n0,
        border: 'none',
        borderRadius: T.r.lg,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: T.font,
        cursor: interactive ? 'pointer' : 'default',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(74,31,36,0.15)',
        transition: 'background 140ms, transform 80ms, box-shadow 140ms',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!interactive) return;
        e.currentTarget.style.background = T.c.p900;
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(74,31,36,0.22)';
      }}
      onMouseLeave={(e) => {
        if (!interactive) return;
        e.currentTarget.style.background = T.c.p700;
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(74,31,36,0.15)';
      }}
      onMouseDown={(e) => { if (interactive) e.currentTarget.style.transform = 'scale(0.995)'; }}
      onMouseUp={(e)   => { if (interactive) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Decorative amber flourish in upper-right */}
      <span aria-hidden="true" style={{
        position: 'absolute', top: -32, right: -24,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.c.a500}55 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      <Icon name="stars" size={24} color={T.c.n0} fill={1} style={{ position: 'relative', flexShrink: 0 }}/>

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div style={{
          fontSize: 16, fontWeight: 700,
          color: T.c.n0, lineHeight: 1.15,
          letterSpacing: '-0.005em',
        }}>+{pointsAwarded} pontos</div>
        <div style={{
          marginTop: 2,
          fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.80)',
          lineHeight: 1.3,
        }}>Você agora tem {formatted} pts</div>
      </div>

      {interactive && (
        <Icon
          name="chevron_right"
          size={16}
          color="rgba(255,255,255,0.70)"
          style={{ position: 'relative', flexShrink: 0 }}
        />
      )}
    </Tag>
  );
}

Object.assign(window, { CardPontos });


export { CardPontos };
