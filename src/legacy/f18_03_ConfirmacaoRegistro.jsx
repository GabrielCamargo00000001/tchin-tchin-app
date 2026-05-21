/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { formatPoints } from './f15_01_PointsCounter.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 18.03 · ConfirmacaoRegistro — tela pós-submit
//
//   <ConfirmacaoRegistro
//     wine={{ name, producer, country, region, uva, year }}
//     pointsAwarded={10}
//     totalPoints={140}
//     fact={{                          // opcional · card educacional
//       title: 'Sabia disso?',
//       body: 'O Malbec, hoje símbolo da Argentina…',
//       imageGradient: ['#722F37','#4A1F24'],
//       category: 'Uva',
//     }}
//     challenge={{                     // opcional · card de desafio cumprido
//       title: '5 vinhos em 7 dias',
//       reward: '+50 pts + badge da semana',
//     }}
//     onContinue={() => ...}
//     onEdit={() => ...}
//     onShare={() => ...}
//     onSeeMoreLearn={() => ...}
//   />
//
// Progressão: confetti(2s) → hero pulse → cards (sempre +10, opcional
// educacional, opcional desafio) → CTAs fixos.
// ─────────────────────────────────────────────────────────────

// Keyframes (injected once)
if (typeof document !== 'undefined' && !document.getElementById('tc-confirm-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-confirm-kf';
  s.textContent = `
    @keyframes tcCheckPop {
      0%   { transform: scale(0.4); opacity: 0; }
      60%  { transform: scale(1.15); opacity: 1; }
      80%  { transform: scale(0.96); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes tcCheckRing {
      0%   { transform: scale(0.8); opacity: 0.7; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes tcFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes tcConfetti {
      0%   { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translate3d(var(--cx, 0px), var(--cy, 320px), 0) rotate(var(--cr, 720deg)); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

function ConfirmacaoRegistro({
  wine = { name: 'Catena Malbec 2021' },
  pointsAwarded = 10,
  totalPoints = 140,
  fact,
  challenge,
  onContinue = () => {},
  onEdit = () => {},
  onShare = () => {},
  onSeeMoreLearn = () => {},
  // Demo: skip confetti for static artboards
  staticDemo = false,
}) {
  const wineLabel = formatWineLabel(wine);

  return (
    <div
      data-screen-label="18.03 ConfirmacaoRegistro"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: T.c.n50,
        fontFamily: T.font,
        color: T.c.n950,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Confetti layer */}
      {!staticDemo && <Confetti durationMs={2000} count={64}/>}

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '32px 16px 160px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Hero ─────────────────────────────────── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          paddingTop: 8,
        }}>
          <CheckMedallion/>

          <h1 style={{
            margin: '24px 0 0',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 36, fontWeight: 500,
            letterSpacing: '-0.025em', lineHeight: 1.05,
            color: T.c.n950,
            animation: 'tcFadeUp 480ms ease 220ms both',
          }}>Registrado!</h1>

          <p style={{
            margin: '8px 0 0', maxWidth: 280,
            fontSize: 15, lineHeight: 1.5,
            color: T.c.n800, textWrap: 'balance',
            animation: 'tcFadeUp 480ms ease 320ms both',
          }}>
            <b style={{ fontWeight: 700, color: T.c.n950 }}>{wineLabel}</b>
            {' '}salvo no seu Diário.
          </p>
        </div>

        {/* +N pontos card ───────────────────────── */}
        <div style={{
          marginTop: 24,
          animation: 'tcFadeUp 480ms ease 420ms both',
        }}>
          <PointsAwardCard
            pointsAwarded={pointsAwarded}
            totalPoints={totalPoints}
          />
        </div>

        {/* Sabia disso? card ────────────────────── */}
        {fact && (
          <div style={{
            marginTop: 16,
            animation: 'tcFadeUp 480ms ease 520ms both',
          }}>
            <SabiaDissoCard
              fact={fact}
              onSeeMoreLearn={onSeeMoreLearn}
            />
          </div>
        )}

        {/* Desafio cumprido card ────────────────── */}
        {challenge && (
          <div style={{
            marginTop: 16,
            animation: 'tcFadeUp 480ms ease 620ms both',
          }}>
            <ChallengeCard challenge={challenge}/>
          </div>
        )}
      </div>

      {/* Fixed bottom CTAs ──────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: 'linear-gradient(180deg, rgba(250,250,248,0) 0%, rgba(250,250,248,0.92) 30%, #FAFAF8 100%)',
      }}>
        <button
          type="button"
          onClick={onContinue}
          style={{
            width: '100%', height: 52,
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 16, fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            letterSpacing: '-0.01em',
            transition: 'background 120ms, transform 80ms',
            boxShadow: '0 4px 12px rgba(74,31,36,0.20)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          Continuar
          <Icon name="arrow_forward" size={18} color={T.c.n0}/>
        </button>

        <div style={{
          marginTop: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 4,
        }}>
          <TextAction icon="edit" onClick={onEdit}>Editar registro</TextAction>
          <span aria-hidden="true" style={{
            width: 1, height: 14, background: T.c.n300,
          }}/>
          <TextAction icon="ios_share" onClick={onShare}>Compartilhar nos Stories</TextAction>
        </div>
      </div>
    </div>
  );
}

// ─── Check medallion (pulse + ring) ──────────────────────────
function CheckMedallion() {
  return (
    <div style={{
      position: 'relative', width: 96, height: 96,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Expanding ring */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: `2px solid ${T.c.s700}`,
        animation: 'tcCheckRing 900ms ease-out 200ms 1',
      }}/>
      {/* Soft glow */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.c.s100} 0%, transparent 70%)`,
      }}/>
      {/* Filled medallion */}
      <span style={{
        position: 'relative',
        width: 96, height: 96, borderRadius: '50%',
        background: T.c.s700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(46,125,50,0.30)',
        animation: 'tcCheckPop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      }}>
        <Icon name="check" size={56} color={T.c.n0} weight={700}/>
      </span>
    </div>
  );
}

// ─── Points award card (burgundy) ────────────────────────────
function PointsAwardCard({ pointsAwarded, totalPoints }) {
  // Animated total count-up
  const [displayed, setDisplayed] = React.useState(totalPoints - pointsAwarded);
  React.useEffect(() => {
    const start = performance.now();
    const from = Math.max(0, totalPoints - pointsAwarded);
    const to = totalPoints;
    const dur = 800;
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 2);
      setDisplayed(Math.round(from + (to - from) * ease));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    // Delay so it syncs after the hero
    const wait = setTimeout(() => { raf = requestAnimationFrame(step); }, 540);
    return () => { clearTimeout(wait); if (raf) cancelAnimationFrame(raf); };
  }, [totalPoints, pointsAwarded]);

  return (
    <div style={{
      position: 'relative',
      background: T.c.p700,
      borderRadius: T.r.lg,
      padding: 16,
      color: T.c.n0,
      display: 'flex', alignItems: 'center', gap: 14,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(74,31,36,0.15)',
    }}>
      {/* Background flourish */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -30, right: -20,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.c.a500}55 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: T.c.p900,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
      }}>
        <Icon name="stars" size={22} color={T.c.a500} fill={1}/>
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6,
        }}>
          <span style={{
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 24, fontWeight: 600,
            color: T.c.n0, letterSpacing: '-0.015em',
            lineHeight: 1.1,
          }}>+{pointsAwarded}</span>
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
          }}>pontos</span>
        </div>
        <div style={{
          marginTop: 2,
          fontSize: 12, color: 'rgba(255,255,255,0.72)',
        }}>
          Você agora tem <b style={{ color: T.c.a500, fontWeight: 700 }}>{formatPoints ? formatPoints(displayed) : displayed} pts</b>
        </div>
      </div>

      <Icon name="trending_up" size={20} color="rgba(255,255,255,0.55)"/>
    </div>
  );
}

// ─── Sabia disso? educational card ───────────────────────────
function SabiaDissoCard({ fact, onSeeMoreLearn }) {
  const [vote, setVote] = React.useState(null); // 'sim' | 'nao' | null
  const grad = fact.imageGradient || [T.c.p500, T.c.p900];

  return (
    <article style={{
      background: T.c.n0,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {/* Header image */}
      <div style={{
        position: 'relative',
        height: 112,
        background: `linear-gradient(160deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
        overflow: 'hidden',
      }}>
        {/* Subtle texture */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, opacity: 0.14,
          backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 14px)`,
        }}/>
        {/* Category pill */}
        {fact.category && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            ...T.t.overline, color: T.c.n0,
            background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)',
            padding: '4px 10px', borderRadius: T.r.full,
            letterSpacing: 1.2,
          }}>{fact.category}</div>
        )}
        {/* Big eyebrow */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, right: 14,
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 22, lineHeight: 1.1, fontWeight: 500,
          fontStyle: 'italic',
          color: T.c.n0, letterSpacing: '-0.015em',
        }}>{fact.title || 'Sabia disso?'}</div>
      </div>

      <div style={{ padding: 16 }}>
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.55,
          color: T.c.n800, textWrap: 'pretty',
        }}>{fact.body}</p>

        {/* Vote */}
        <div style={{
          marginTop: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            ...T.t.caption, color: T.c.n600,
            marginRight: 'auto', fontWeight: 500,
          }}>{vote ? 'Valeu pelo feedback!' : 'Sabia disso?'}</span>
          <VoteButton
            icon="thumb_up"
            label="Sim"
            active={vote === 'sim'}
            onClick={() => setVote(vote === 'sim' ? null : 'sim')}
          />
          <VoteButton
            icon="thumb_down"
            label="Não"
            active={vote === 'nao'}
            onClick={() => setVote(vote === 'nao' ? null : 'nao')}
          />
        </div>

        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: `1px solid ${T.c.n100}`,
        }}>
          <button
            type="button"
            onClick={onSeeMoreLearn}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, color: T.c.p700,
              fontFamily: T.font, fontSize: 13, fontWeight: 600,
            }}
          >
            <Icon name="auto_stories" size={16} color={T.c.p700}/>
            Ver mais na Seção Aprenda
            <Icon name="arrow_forward" size={14} color={T.c.p700}/>
          </button>
        </div>
      </div>
    </article>
  );
}

function VoteButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 30, padding: '0 12px',
        background: active ? T.c.p700 : T.c.n0,
        color: active ? T.c.n0 : T.c.n800,
        border: `1px solid ${active ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.full,
        cursor: 'pointer',
        fontFamily: T.font, fontSize: 12, fontWeight: 600,
        transition: 'background 120ms, color 120ms, border-color 120ms',
      }}
    >
      <Icon name={icon} size={14} color={active ? T.c.n0 : T.c.n800} fill={active ? 1 : 0}/>
      {label}
    </button>
  );
}

// ─── Challenge done card (amber gradient) ────────────────────
function ChallengeCard({ challenge }) {
  return (
    <article style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${T.c.a500} 0%, ${T.c.a700} 100%)`,
      borderRadius: T.r.lg,
      padding: 16,
      color: T.c.n0,
      display: 'flex', alignItems: 'center', gap: 14,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(184,137,74,0.30)',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: -40, right: -30,
        width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
      }}/>

      <div style={{
        width: 44, height: 44, borderRadius: T.r.md,
        background: 'rgba(0,0,0,0.20)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }} aria-hidden="true">🎯</div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div style={{
          ...T.t.overline, color: 'rgba(255,255,255,0.85)',
          letterSpacing: 1.2,
        }}>Desafio cumprido</div>
        <div style={{
          fontSize: 15, fontWeight: 700, color: T.c.n0,
          lineHeight: 1.3, marginTop: 2,
        }}>{challenge.title}</div>
        <div style={{
          marginTop: 4,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 12, fontWeight: 600,
          color: T.c.n0,
          padding: '3px 8px',
          background: 'rgba(0,0,0,0.20)',
          borderRadius: T.r.full,
        }}>
          <Icon name="emoji_events" size={14} color={T.c.n0} fill={1}/>
          {challenge.reward}
        </div>
      </div>
    </article>
  );
}

// ─── Confetti (DOM-based, ~60 particles, 2s) ─────────────────
function Confetti({ durationMs = 2000, count = 60 }) {
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const id = setTimeout(() => setShow(false), durationMs + 200);
    return () => clearTimeout(id);
  }, [durationMs]);

  const COLORS = [T.c.p700, T.c.p500, T.c.a500, T.c.a700, T.c.s700, T.c.n0];
  const SHAPES = ['rect', 'circle', 'rect'];

  // Generate particle props once — hook called unconditionally so React's
  // rule-of-hooks holds when `show` flips to false.
  const particles = React.useMemo(() => Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI - Math.PI / 2; // -90° to +90°
    const dist = 120 + Math.random() * 200;
    const cx = Math.cos(angle) * dist + (Math.random() - 0.5) * 120;
    const cy = 220 + Math.random() * 280;
    const rot = (Math.random() * 1440 - 720) | 0;
    return {
      key: i,
      left: 50 + (Math.random() - 0.5) * 18, // % near center
      top: 8 + Math.random() * 8,            // % from top
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      cx: cx | 0,
      cy: cy | 0,
      cr: rot,
      delay: Math.random() * 200,
      dur: 1200 + Math.random() * 700,
    };
  }), [count]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 5,
        overflow: 'hidden',
      }}
    >
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
            animation: `tcConfetti ${p.dur}ms cubic-bezier(0.2, 0.7, 0.3, 1) ${p.delay}ms forwards`,
            ['--cx']: `${p.cx}px`,
            ['--cy']: `${p.cy}px`,
            ['--cr']: `${p.cr}deg`,
            boxShadow: p.shape === 'rect' ? `0 0 0 0.5px rgba(0,0,0,0.05)` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── Text action (bottom row) ────────────────────────────────
function TextAction({ icon, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '8px 10px',
        color: T.c.n600, fontFamily: T.font,
        fontSize: 12, fontWeight: 600,
      }}
    >
      <Icon name={icon} size={14} color={T.c.n600}/>
      {children}
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function formatWineLabel(wine) {
  if (!wine) return 'Seu vinho';
  if (typeof wine === 'string') return wine;
  const parts = [wine.name];
  if (wine.year && !String(wine.name || '').match(/\d{4}/)) parts.push(wine.year);
  return parts.filter(Boolean).join(' ');
}

Object.assign(window, { ConfirmacaoRegistro });


export { ChallengeCard, CheckMedallion, Confetti, ConfirmacaoRegistro, PointsAwardCard, SabiaDissoCard, TextAction, VoteButton, formatWineLabel };
