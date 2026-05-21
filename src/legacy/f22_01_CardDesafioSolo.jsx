/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 22.01 · CardDesafioSolo — desafio da semana no feed
//
// US-13-3-01 · aparece no feed principal como card embedded
//
//   <CardDesafioSolo
//     challenge={{
//       id, title: 'Prove um vinho espanhol',
//       reward: '+50 pts + badge da semana',
//       endsAt: '2026-05-25T23:59:59',           // ISO
//       startedAt: '2026-05-19T00:00:00',
//       progress: 0,                              // 0-1 (opcional)
//     }}
//     state="default"                             // 'default' | 'done'
//     badge={{ name: 'Mundo na Taça', emoji: '🌍' }}  // só pra 'done'
//     onTapDetails={() => ...}
//   />
//
// Default: gradient amber, progress = % do tempo restante.
// Done: gradient emerald, mostra badge da semana conquistada.
// ─────────────────────────────────────────────────────────────

function CardDesafioSolo({
  challenge = {},
  state = 'default',                // 'default' | 'done'
  badge,
  onTapDetails = () => {},
  // Demo override: força um timeLeft fixo (canvas previews)
  staticTimeLeft,
  staticProgress,
}) {
  const isDone = state === 'done';

  // Compute time remaining + progress bar (fraction of time elapsed)
  const computed = useChallengeTime(challenge.startedAt, challenge.endsAt, {
    fixedLeft: staticTimeLeft,
    fixedProgress: staticProgress,
  });

  const grad = isDone
    ? ['#43A047', '#1B5E20']  // emerald 500 → 700
    : ['#D4A574', '#B8894A']; // amber  400 → 600

  return (
    <article style={{
      position: 'relative',
      width: '100%',
      background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
      borderRadius: T.r.lg,
      padding: 16,
      color: T.c.n0,
      fontFamily: T.font,
      boxShadow: isDone
        ? '0 6px 16px rgba(46,125,50,0.30)'
        : '0 6px 16px rgba(184,137,74,0.28)',
      overflow: 'hidden',
    }}>
      {/* Decorative orbs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -50, right: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: -60, left: -30,
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,0,0,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Eyebrow */}
      <div style={{
        ...T.t.overline,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: 1.4,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        position: 'relative',
      }}>
        <span aria-hidden="true" style={{ fontSize: 12 }}>{isDone ? '✅' : '🎯'}</span>
        {isDone ? 'Desafio cumprido' : 'Desafio da semana'}
      </div>

      {/* Title */}
      <h3 style={{
        margin: '4px 0 0',
        position: 'relative',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 22, fontWeight: 600,
        letterSpacing: '-0.02em', lineHeight: 1.15,
        color: T.c.n0, textWrap: 'balance',
        maxWidth: '90%',
      }}>{isDone ? 'Desafio cumprido!' : (challenge.title || 'Desafio da semana')}</h3>

      {/* Reward / status line */}
      <div style={{
        position: 'relative',
        marginTop: 8,
        fontSize: 13, lineHeight: 1.45,
        color: 'rgba(255,255,255,0.92)',
        display: 'flex', alignItems: 'center', gap: 6,
        flexWrap: 'wrap',
      }}>
        {isDone ? (
          <>
            <span style={{ fontWeight: 700 }}>+50 pts conquistados</span>
            {badge && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 9px',
                background: 'rgba(0,0,0,0.20)',
                borderRadius: T.r.full,
                fontSize: 11, fontWeight: 700,
                marginLeft: 2,
              }}>
                <span aria-hidden="true" style={{ fontSize: 12 }}>{badge.emoji || '🏅'}</span>
                {badge.name || 'Badge da semana'}
              </span>
            )}
          </>
        ) : (
          <>
            <Icon name="stars" size={14} color={T.c.n0} fill={1}/>
            <span><b style={{ fontWeight: 700 }}>+50 pts</b> + badge da semana se cumprir</span>
          </>
        )}
      </div>

      {/* Progress section */}
      <div style={{ position: 'relative', marginTop: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 6,
          fontSize: 12, color: 'rgba(255,255,255,0.85)',
        }}>
          <span>
            {isDone
              ? 'Encerrado'
              : <>Termina em <b style={{ color: T.c.n0, fontWeight: 700 }}>{computed.label}</b></>
            }
          </span>
          {!isDone && (
            <span style={{
              fontFamily: T.mono, fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: 0.3,
            }}>{Math.round(computed.fractionLeft * 100)}%</span>
          )}
        </div>
        <div style={{
          height: 4, width: '100%',
          background: 'rgba(255,255,255,0.22)',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(isDone ? 1 : computed.fractionLeft) * 100}%`,
            background: T.c.n0,
            borderRadius: 2,
            transition: 'width 320ms ease-out',
          }}/>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        position: 'relative',
        marginTop: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button
          type="button"
          onClick={onTapDetails}
          style={{
            height: 32, padding: '0 14px',
            background: 'rgba(255,255,255,0.18)',
            color: T.c.n0,
            border: '1px solid rgba(255,255,255,0.30)',
            borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 12, fontWeight: 700,
            letterSpacing: 0.2,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'background 120ms',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.30)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
        >
          {isDone ? 'Ver badge' : 'Ver detalhes'}
          <Icon name="arrow_forward" size={14} color={T.c.n0}/>
        </button>

        <div style={{
          flex: 1, minWidth: 0, textAlign: 'right',
          fontSize: 11, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: 0.2,
        }}>
          {isDone ? 'Próximo desafio em breve' : 'Acompanhe seu progresso'}
        </div>
      </div>
    </article>
  );
}

// ─── Time computation (memoized) ─────────────────────────────
function useChallengeTime(startedAt, endsAt, opts = {}) {
  return React.useMemo(() => {
    if (opts.fixedLeft) {
      return {
        label: opts.fixedLeft,
        fractionLeft: typeof opts.fixedProgress === 'number' ? opts.fixedProgress : 0.4,
      };
    }
    const now = Date.now();
    const end = endsAt ? new Date(endsAt).getTime() : now + 1000 * 60 * 60 * 24 * 3;
    const start = startedAt ? new Date(startedAt).getTime() : end - 1000 * 60 * 60 * 24 * 7;
    const total = Math.max(1, end - start);
    const left = Math.max(0, end - now);
    return {
      label: formatTimeLeft(left),
      fractionLeft: Math.max(0, Math.min(1, left / total)),
    };
  }, [startedAt, endsAt, opts.fixedLeft, opts.fixedProgress]);
}

function formatTimeLeft(ms) {
  if (ms <= 0) return 'encerrado';
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days >= 1) return `${days}d ${hours}h`;
  if (hours >= 1) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

Object.assign(window, { CardDesafioSolo });


export { CardDesafioSolo, formatTimeLeft, useChallengeTime };
