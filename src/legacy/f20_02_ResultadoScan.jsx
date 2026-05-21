/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { MatchScoreBadge } from './f16_01_MatchScoreBadge.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 20.02 · ResultadoScan — 3 zonas, 1 ação primária
//
// US-12-2-02 · após scan bem-sucedido em 20.01
//
//   <ResultadoScan
//     wine={{                              // identificado pela ML
//       id, name, producer, year, region, country,
//       photoUrl, hasProfile,
//       profile: { acidez, tanino, corpo, frutado, docura },
//       price, type,
//     }}
//     userProfile={{ acidez:3, tanino:4, corpo:4, frutado:4, docura:2 }}
//     userHasPaladar={true}
//     matchScore={87}                       // calculado
//     explanation="Casa muito bem com…"     // gerada (US-13-1-03)
//     onClose={() => ...}
//     onRegister={() => ...}                // → 18.01
//     onBuy={() => ...}                     // → marketplace (pede GPS)
//     onAsk={() => ...}                     // → composer Q&A
//     onTakeQuiz={() => ...}                // variante sem paladar
//     onRateWine={() => ...}                // variante sem perfil
//     needsGpsPermission={true}             // primeira vez Marketplace
//   />
//
// Hierarquia visual: ZONA 1 (identifica) → ZONA 2 (match dominante) →
// ZONA 3 (ação primária + secundárias).
// ─────────────────────────────────────────────────────────────

function ResultadoScan({
  wine = {},
  userProfile,
  userHasPaladar = true,
  matchScore = null,
  explanation,
  onClose = () => {},
  onRegister = () => {},
  onBuy = () => {},
  onAsk = () => {},
  onTakeQuiz = () => {},
  onRateWine = () => {},
  needsGpsPermission = false,
}) {
  const wineHasProfile = !!(wine.profile && Object.keys(wine.profile).length);
  const grad = wine.photoGradient || ['#722F37', '#0F0F0F'];

  return (
    <div
      data-screen-label="20.02 ResultadoScan"
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: T.c.n50,
        fontFamily: T.font,
        color: T.c.n950,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 24,
      }}>
        {/* ZONA 1 — Identificação */}
        <Zone1Identificacao
          wine={wine}
          grad={grad}
          onClose={onClose}
        />

        {/* ZONA 2 — Match Score */}
        <Zone2MatchScore
          wine={wine}
          userProfile={userProfile}
          userHasPaladar={userHasPaladar}
          wineHasProfile={wineHasProfile}
          matchScore={matchScore}
          explanation={explanation}
          onTakeQuiz={onTakeQuiz}
          onRateWine={onRateWine}
        />

        {/* ZONA 3 — Ações */}
        <Zone3Acoes
          onRegister={onRegister}
          onBuy={onBuy}
          onAsk={onAsk}
          needsGpsPermission={needsGpsPermission}
        />
      </div>
    </div>
  );
}

// ─── ZONA 1 — Identificação ───────────────────────────────────
function Zone1Identificacao({ wine, grad, onClose }) {
  return (
    <section style={{ position: 'relative', marginBottom: 32 }}>
      {/* Hero label photo — blurred bg + sharp foreground */}
      <div style={{
        position: 'relative',
        width: '100%', height: 200,
        background: `linear-gradient(165deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
        overflow: 'hidden',
      }}>
        {/* Faux "captured photo" — blurred copy + sharp focal point */}
        {wine.photoUrl ? (
          <>
            <img
              src={wine.photoUrl}
              alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', filter: 'blur(20px) brightness(0.7)',
                transform: 'scale(1.1)',
              }}
            />
            <img
              src={wine.photoUrl}
              alt={`Rótulo do ${wine.name}`}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                maxHeight: '85%', maxWidth: '60%',
                objectFit: 'contain',
                boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
                borderRadius: 4,
              }}
            />
          </>
        ) : (
          <FauxLabel wine={wine}/>
        )}

        {/* Soft texture */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, opacity: 0.16,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 18px)',
          pointerEvents: 'none',
        }}/>

        {/* Top overlay — logo + close */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 14px 0',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)',
          paddingBottom: 24,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px 4px 6px',
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: T.r.full,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}>
            {typeof TchinLogo !== 'undefined'
              ? <TchinLogo size={18} color="#FFFFFF"/>
              : <Icon name="wine_bar" size={14} color={T.c.n0}/>
            }
            <span style={{
              fontFamily: T.serif || "'Fraunces', Georgia, serif",
              fontSize: 12, fontWeight: 600,
              color: T.c.n0, letterSpacing: '-0.005em',
            }}>Tchin Tchin</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(15,15,15,0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <Icon name="close" size={18} color={T.c.n0}/>
          </button>
        </div>
      </div>

      {/* Floating identification card (margin-top -40) */}
      <div style={{
        margin: '-40px 16px 0',
        position: 'relative',
        background: T.c.n0,
        borderRadius: T.r.lg,
        padding: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)',
        border: `1px solid ${T.c.n200}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Identificação confirmada pill */}
        <div style={{
          position: 'absolute', top: -12, left: 16,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px',
          background: T.c.s700, color: T.c.n0,
          borderRadius: T.r.full,
          fontSize: 11, fontWeight: 700,
          letterSpacing: 0.2,
          boxShadow: '0 2px 6px rgba(46,125,50,0.30)',
        }}>
          <Icon name="check_circle" size={12} color={T.c.n0} fill={1}/>
          Identificado
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0,
            ...T.t.bodyB, color: T.c.n950,
            fontSize: 16, fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            textWrap: 'balance',
          }}>{wine.name || 'Vinho identificado'}</h2>
          <div style={{
            ...T.t.caption, color: T.c.n800,
            marginTop: 4,
            display: 'flex', flexWrap: 'wrap', gap: 4,
            alignItems: 'center',
          }}>
            {wine.producer}
            {wine.year && <><Dot/>{wine.year}</>}
            {wine.region && <><Dot/>{wine.region}</>}
            {wine.country && <><Dot/>{wine.country}</>}
          </div>
        </div>

        {wine.type && (
          <div style={{
            ...T.t.caption, fontWeight: 700,
            color: T.c.p700,
            padding: '4px 10px',
            background: T.c.p50,
            border: `1px solid ${T.c.p100}`,
            borderRadius: T.r.full,
            flexShrink: 0,
          }}>{wine.type}</div>
        )}
      </div>
    </section>
  );
}

function Dot() {
  return <span aria-hidden="true" style={{ color: T.c.n400 }}>·</span>;
}

function FauxLabel({ wine }) {
  // For canvas previews where no real photo is available — renders a
  // schematic of a wine label so the zone reads correctly.
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 130, height: 170,
      background: 'rgba(245,233,212,0.96)',
      borderRadius: 4,
      boxShadow: '0 10px 28px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(74,31,36,0.12)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 12, textAlign: 'center',
      fontFamily: T.serif || "'Fraunces', Georgia, serif",
      color: '#4A1F24',
    }}>
      <div style={{ fontSize: 7, letterSpacing: 2, fontWeight: 700, opacity: 0.7 }}>
        {(wine.country || 'BR').toUpperCase()}
      </div>
      <div style={{ width: 24, height: 1, background: '#722F37', margin: '6px 0 8px', opacity: 0.5 }}/>
      <div style={{
        fontSize: 14, fontWeight: 600, lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}>{wine.producer || 'Casa Valduga'}</div>
      <div style={{
        fontSize: 9, fontWeight: 500, lineHeight: 1.25,
        marginTop: 4, fontStyle: 'italic',
        maxWidth: 100, textWrap: 'balance',
      }}>{(wine.name || '').replace(wine.producer || '', '').trim() || 'Terroir Cabernet'}</div>
      <div style={{ width: 16, height: 1, background: '#722F37', margin: '6px 0', opacity: 0.5 }}/>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em' }}>{wine.year || '2021'}</div>
    </div>
  );
}

// ─── ZONA 2 — Match Score ────────────────────────────────────
function Zone2MatchScore({
  wine, userProfile, userHasPaladar, wineHasProfile,
  matchScore, explanation, onTakeQuiz, onRateWine,
}) {
  // No paladar: pill + CTA inline
  if (!userHasPaladar) {
    return (
      <section style={{
        padding: '0 16px 28px', textAlign: 'center',
      }}>
        <NoMatchTile
          icon="psychology"
          title="Faça o quiz pra ver match"
          body="Em 2 minutos a gente descobre seu paladar e calcula o match com qualquer vinho."
          ctaLabel="Fazer quiz agora"
          ctaIcon="arrow_forward"
          onCta={onTakeQuiz}
        />
      </section>
    );
  }

  // Wine sem perfil
  if (!wineHasProfile) {
    return (
      <section style={{
        padding: '0 16px 28px', textAlign: 'center',
      }}>
        <NoMatchTile
          icon="science"
          title="Avalie pra descobrir o match"
          body="Esse vinho ainda não tem perfil sensorial. Registra ele com nota e a gente calcula seu match."
          ctaLabel="Avaliar agora"
          ctaIcon="star"
          onCta={onRateWine}
        />
      </section>
    );
  }

  // Default: match completo
  return (
    <section style={{
      padding: '0 16px 28px', textAlign: 'center',
    }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        {typeof MatchScoreBadge !== 'undefined' ? (
          <MatchScoreBadge score={matchScore} size="lg"/>
        ) : (
          <FallbackBigBadge score={matchScore}/>
        )}
      </div>

      <h3 style={{
        margin: '16px 0 0',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 24, fontWeight: 600,
        letterSpacing: '-0.02em', lineHeight: 1.15,
        color: T.c.n950,
        textWrap: 'balance',
      }}><span style={{ color: matchToneColor(matchScore) }}>{matchScore}%</span> pro seu paladar</h3>

      <div style={{
        marginTop: 14,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ProfileRadar
          size={160}
          wineProfile={wine.profile}
          userProfile={userProfile}
        />
      </div>

      <div style={{
        display: 'inline-flex', justifyContent: 'center', gap: 18,
        marginTop: 8,
        ...T.t.caption, color: T.c.n600,
      }}>
        <LegendDot color={T.c.p700} label="Vinho"/>
        <LegendDot color={T.c.a700} label="Seu paladar"/>
      </div>

      <p style={{
        margin: '16px auto 0',
        maxWidth: 320,
        fontSize: 14, lineHeight: 1.55,
        color: T.c.n800,
        textWrap: 'pretty',
      }}>
        <b style={{ color: T.c.n950, fontWeight: 700 }}>Por que combina:</b>{' '}
        {explanation || 'Esse vinho tem acidez e taninos parecidos com o que você normalmente prefere.'}
      </p>
    </section>
  );
}

function FallbackBigBadge({ score }) {
  const tone = matchToneColor(score);
  return (
    <div style={{
      width: 120, height: 120, borderRadius: '50%',
      background: tone, color: T.c.n0,
      border: `4px solid rgba(255,255,255,0.85)`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif || "'Fraunces', Georgia, serif",
      fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em',
      boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
    }}>{score}%</div>
  );
}

function matchToneColor(score) {
  if (typeof score !== 'number') return T.c.n400;
  if (score >= 75) return T.c.s700;
  if (score >= 50) return T.c.a700;
  return T.c.n600;
}

function NoMatchTile({ icon, title, body, ctaLabel, ctaIcon, onCta }) {
  return (
    <div style={{
      padding: '24px 20px',
      background: T.c.n0,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: T.c.p50, border: `1px solid ${T.c.p100}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={26} color={T.c.p700}/>
      </div>
      <div>
        <div style={{
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 20, fontWeight: 600,
          letterSpacing: '-0.015em', lineHeight: 1.2,
          color: T.c.n950, textWrap: 'balance',
        }}>{title}</div>
        <p style={{
          margin: '8px 0 0', maxWidth: 280,
          fontSize: 14, lineHeight: 1.5,
          color: T.c.n700, textWrap: 'pretty',
        }}>{body}</p>
      </div>
      <button
        type="button"
        onClick={onCta}
        style={{
          marginTop: 4,
          height: 40, padding: '0 18px',
          background: T.c.p700, color: T.c.n0,
          border: 'none', borderRadius: T.r.full,
          fontFamily: T.font, fontSize: 13, fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'background 120ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
      >
        {ctaLabel}
        <Icon name={ctaIcon} size={16} color={T.c.n0}/>
      </button>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span aria-hidden="true" style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
      }}/>
      {label}
    </span>
  );
}

// ─── Mini radar (wine vs user) ───────────────────────────────
function ProfileRadar({ size = 160, wineProfile, userProfile }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 22;
  const axes = [
    { key: 'acidez',  label: 'Acidez'  },
    { key: 'tanino',  label: 'Tanino'  },
    { key: 'corpo',   label: 'Corpo'   },
    { key: 'frutado', label: 'Frutado' },
    { key: 'docura',  label: 'Doçura'  },
  ];
  const angleFor = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / axes.length);

  const pointFor = (val, i) => {
    // Wine profiles are stored 0–100 in MOCK_WINES, sensorial sliders 1–5.
    // Detect scale: anything > 5 we treat as percent.
    const norm = (v) => {
      if (typeof v !== 'number' || isNaN(v)) return 0;
      if (v > 5) return Math.max(0, Math.min(1, v / 100));
      return Math.max(0, Math.min(1, (v - 1) / 4));
    };
    const ratio = norm(val);
    const a = angleFor(i);
    return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio];
  };

  const polyPoints = (profile = {}) => axes.map((ax, i) => {
    const [x, y] = pointFor(profile[ax.key] || 0, i);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Comparação do perfil do vinho com seu paladar"
      style={{ display: 'block' }}
    >
      {/* Rings */}
      {[0.33, 0.66, 1].map((ratio, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r * ratio}
          fill={i === 2 ? 'rgba(245,227,229,0.40)' : 'none'}
          stroke={T.c.n200}
          strokeWidth={1}
          strokeDasharray={i < 2 ? '3 4' : 'none'}
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
      {/* User polygon — amber, dashed outline */}
      {userProfile && (
        <polygon
          points={polyPoints(userProfile)}
          fill="rgba(184,137,74,0.18)"
          stroke={T.c.a700}
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
      )}
      {/* Wine polygon — burgundy, solid */}
      <polygon
        points={polyPoints(wineProfile)}
        fill="rgba(114,47,55,0.32)"
        stroke={T.c.p700}
        strokeWidth={2}
      />
      {/* Wine vertex dots */}
      {axes.map((ax, i) => {
        const [x, y] = pointFor((wineProfile || {})[ax.key] || 0, i);
        return (
          <circle
            key={ax.key}
            cx={x} cy={y}
            r={2.4}
            fill={T.c.p700}
          />
        );
      })}
      {/* Axis labels */}
      {axes.map((ax, i) => {
        const a = angleFor(i);
        const lx = cx + Math.cos(a) * (r + 14);
        const ly = cy + Math.sin(a) * (r + 14);
        return (
          <text
            key={ax.key}
            x={lx} y={ly}
            fontSize={10}
            fontFamily={T.font}
            fontWeight={600}
            fill={T.c.n600}
            textAnchor="middle"
            dominantBaseline="middle"
          >{ax.label}</text>
        );
      })}
    </svg>
  );
}

// ─── ZONA 3 — Ações ──────────────────────────────────────────
function Zone3Acoes({ onRegister, onBuy, onAsk, needsGpsPermission }) {
  return (
    <section style={{
      padding: '0 16px 8px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* Primary: Registrar */}
      <button
        type="button"
        onClick={onRegister}
        style={{
          width: '100%', height: 52,
          background: T.c.p700, color: T.c.n0,
          border: 'none', borderRadius: T.r.md,
          fontFamily: T.font, fontSize: 16, fontWeight: 700,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 6px 16px rgba(74,31,36,0.22)',
          transition: 'background 120ms, transform 80ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        onMouseDown={(e)  => { e.currentTarget.style.transform = 'scale(0.99)'; }}
        onMouseUp={(e)    => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <span style={{ fontSize: 18 }} aria-hidden="true">📒</span>
        Registrar no diário
      </button>

      {/* Secondary: Marketplace */}
      <button
        type="button"
        onClick={onBuy}
        style={{
          width: '100%', height: 46,
          background: T.c.n0, color: T.c.n950,
          border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
          fontFamily: T.font, fontSize: 14, fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'border-color 120ms, background 120ms',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = T.c.p300;
          e.currentTarget.style.background = T.c.p50;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = T.c.n300;
          e.currentTarget.style.background = T.c.n0;
        }}
      >
        <span style={{ fontSize: 16 }} aria-hidden="true">🛒</span>
        Encontrar onde comprar
        {needsGpsPermission && (
          <span style={{
            ...T.t.caption, fontWeight: 600,
            color: T.c.a700,
            background: T.c.a100,
            padding: '2px 8px',
            borderRadius: T.r.full,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginLeft: 4,
          }}>
            <Icon name="location_on" size={12} color={T.c.a700}/>
            Usa GPS
          </span>
        )}
      </button>

      {/* Ghost: Perguntar */}
      <button
        type="button"
        onClick={onAsk}
        style={{
          width: '100%', height: 40,
          background: 'transparent', color: T.c.n800,
          border: 'none',
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'color 120ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = T.c.p700; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = T.c.n800; }}
      >
        <span style={{ fontSize: 14 }} aria-hidden="true">❓</span>
        Perguntar à comunidade
      </button>
    </section>
  );
}

Object.assign(window, { ResultadoScan });


export { Dot, FallbackBigBadge, FauxLabel, LegendDot, NoMatchTile, ProfileRadar, ResultadoScan, Zone1Identificacao, Zone2MatchScore, Zone3Acoes, matchToneColor };
