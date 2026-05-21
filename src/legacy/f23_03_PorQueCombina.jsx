/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MatchScoreBadge } from './f16_01_MatchScoreBadge.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.03 · PorQueCombina — detalhe do vinho da carta com explicação
//
// US-13-1-03 · sheet sobe ao tocar num item de 23.02
//
//   <PorQueCombina
//     item={{ wine, price }}                  // do 23.02
//     userProfile={{ acidez, tanino, ... }}
//     userExperience={{
//       evaluationCount: 12,
//       lastFavorite: { name, year, rating },
//     }}
//     pairings={['Carne vermelha', 'Queijos curados', 'Massas']}
//     onClose={() => ...}
//     onShare={() => ...}
//     onChoose={() => ...}            // → 18.01 com context='restaurante'
//     onBackToCarta={() => ...}
//   />
//
// Explicação textual gerada via templates (não LLM runtime).
// Se user < 5 avaliações: usa só quiz; se ≥ 5: pode citar favorito.
// ─────────────────────────────────────────────────────────────

if (typeof document !== 'undefined' && !document.getElementById('tc-pqc-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-pqc-kf';
  s.textContent = `
    @keyframes tcPqcSheetIn { from { transform: translateY(100%) } to { transform: translateY(0) } }
  `;
  document.head.appendChild(s);
}

function PorQueCombina({
  item = {},
  userProfile,
  userExperience = { evaluationCount: 0 },
  pairings,
  onClose = () => {},
  onShare = () => {},
  onChoose = () => {},
  onBackToCarta = () => {},
}) {
  const wine = item.wine || {};
  const price = item.price;
  const matchScore = wine.match || 0;

  const explanation = React.useMemo(
    () => generateExplanationText(wine, userProfile, userExperience),
    [wine, userProfile, userExperience]
  );

  const harmoniza = pairings || pairingSuggestions(wine);

  return (
    <div
      data-screen-label="23.03 PorQueCombina"
      style={{
        flex: 1, position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: T.c.n0,
        fontFamily: T.font, color: T.c.n950,
        overflow: 'hidden',
        animation: 'tcPqcSheetIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
      }}
    >
      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 8px 8px 4px',
        background: T.c.n0,
        flexShrink: 0,
      }}>
        <button
          type="button" onClick={onClose}
          aria-label="Fechar"
          style={{
            width: 44, height: 44, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="close" size={24} color={T.c.n950}/>
        </button>
        <button
          type="button" onClick={onShare}
          aria-label="Compartilhar"
          style={{
            width: 44, height: 44, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="ios_share" size={22} color={T.c.n800}/>
        </button>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 130,
      }}>
        {/* Hero */}
        <section style={{
          padding: '8px 20px 12px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <BottlePlaceholder width={140} height={200} showLabel={false}/>
          <h1 style={{
            margin: '12px 0 0',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 26, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: T.c.n950, textWrap: 'balance',
            maxWidth: 320,
          }}>{wine.name || 'Vinho'}</h1>
          <div style={{
            marginTop: 4,
            ...T.t.caption, color: T.c.n700,
            fontSize: 13,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <span>{wine.producer || '—'}</span>
            {wine.region && <><span style={{ color: T.c.n400 }}>·</span><span>{wine.region}</span></>}
            {typeof price === 'number' && <>
              <span style={{ color: T.c.n400 }}>·</span>
              <b style={{ color: T.c.p700, fontWeight: 700 }}>R$ {formatBRL2(price)}</b>
            </>}
          </div>
        </section>

        {/* Match score + label */}
        <section style={{
          padding: '16px 20px 4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {typeof MatchScoreBadge !== 'undefined' ? (
            <MatchScoreBadge score={matchScore} size="lg"/>
          ) : (
            <FallbackBadge23 score={matchScore}/>
          )}
          <h3 style={{
            margin: '14px 0 0',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 20, fontWeight: 600,
            letterSpacing: '-0.015em', lineHeight: 1.2,
            color: T.c.n950, textAlign: 'center',
          }}><span style={{ color: matchToneColor33(matchScore) }}>{matchScore}%</span> pro seu paladar</h3>
        </section>

        {/* Mini radar */}
        <section style={{
          padding: '12px 20px 8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <ProfileRadar200
            wineProfile={wine.perfil || wine.profile}
            userProfile={userProfile}
          />
          <div style={{
            display: 'inline-flex', gap: 18,
            marginTop: 6,
            ...T.t.caption, color: T.c.n600,
          }}>
            <LegendDot33 color={T.c.p700} label="Vinho"/>
            <LegendDot33 color={T.c.a700} label="Seu paladar"/>
          </div>
        </section>

        {/* Por que combina (CRÍTICO) */}
        <section style={{
          margin: '16px 20px 8px',
          padding: '16px 18px',
          background: T.c.p50,
          border: `1px solid ${T.c.p100}`,
          borderRadius: T.r.lg,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            ...T.t.overline, color: T.c.p700,
            letterSpacing: 1.4,
          }}>
            <span aria-hidden="true" style={{
              width: 16, height: 1, background: T.c.p700, opacity: 0.6,
            }}/>
            Por que combina
          </div>
          <p style={{
            margin: '8px 0 0',
            fontSize: 16, fontWeight: 500, lineHeight: 1.55,
            color: T.c.n950, letterSpacing: '-0.005em',
            textWrap: 'pretty',
          }}>{explanation.primary}</p>
          {explanation.secondary && (
            <p style={{
              margin: '10px 0 0',
              padding: '10px 12px',
              background: T.c.n0,
              border: `1px solid ${T.c.p100}`,
              borderRadius: T.r.sm,
              fontSize: 13, lineHeight: 1.5,
              color: T.c.n800,
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <Icon name="history" size={14} color={T.c.p700} style={{ flexShrink: 0, marginTop: 2 }}/>
              <span style={{ flex: 1 }}>{explanation.secondary}</span>
            </p>
          )}
        </section>

        {/* Harmonização */}
        <section style={{ padding: '16px 20px 8px' }}>
          <div style={{
            ...T.t.overline, color: T.c.n600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="restaurant" size={12} color={T.c.n600}/>
            Harmonização sugerida
          </div>
          <div style={{
            marginTop: 10,
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {harmoniza.map(p => (
              <PairingChip key={p} label={p}/>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom CTAs */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n200}`,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <button
          type="button" onClick={onChoose}
          style={{
            width: '100%', height: 52,
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 16, fontWeight: 700,
            letterSpacing: '-0.01em', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 16px rgba(74,31,36,0.22)',
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          Escolhi esse
          <span style={{ fontSize: 18 }} aria-hidden="true">🍷</span>
        </button>
        <button
          type="button" onClick={onBackToCarta}
          style={{
            width: '100%', height: 40,
            background: 'transparent', color: T.c.n800,
            border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <Icon name="arrow_back" size={14} color={T.c.n800}/>
          Voltar à carta
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function generateExplanationText(wine, userProfile, userExperience) {
  const profile = wine.perfil || wine.profile || {};
  const userP = userProfile || {};
  const inferred = inferUserTraits(userP);

  // Dimensions of wine (normalized to 1-5 for messaging)
  const wineNorm = {
    corpo:   normTo5(profile.corpo),
    tanino:  normTo5(profile.tanino),
    acidez:  normTo5(profile.acidez),
    frutado: normTo5(profile.frutado),
    docura:  normTo5(profile.docura),
  };

  // Pick 2 traits where wine matches user preference best
  const matchStrings = [];
  const order = ['corpo', 'tanino', 'frutado', 'acidez'];
  for (const k of order) {
    if (matchStrings.length >= 2) break;
    if (inferred[k] && wineNorm[k] >= 3) {
      matchStrings.push(`${TRAIT_LABELS[k]} ${wineNorm[k]}/5`);
    }
  }
  // Fallback: just the strongest wine dimensions
  if (matchStrings.length === 0) {
    const sorted = Object.entries(wineNorm).sort((a, b) => b[1] - a[1]).slice(0, 2);
    sorted.forEach(([k, v]) => matchStrings.push(`${TRAIT_LABELS[k]} ${v}/5`));
  }

  const userPref = traitsToSentence(inferred);
  const wineMetrics = matchStrings.join(' e ');

  const primary = userPref
    ? `Você tende a gostar de vinhos ${userPref}. Esse ${wine.type || 'vinho'} tem ${wineMetrics} — combina com seu perfil.`
    : `Esse ${wine.type || 'vinho'} tem ${wineMetrics} — perfil compatível com o que você costuma escolher.`;

  let secondary = null;
  if (userExperience && userExperience.evaluationCount >= 5 && userExperience.lastFavorite) {
    const fav = userExperience.lastFavorite;
    const stars = '⭐'.repeat(Math.max(1, Math.min(5, fav.rating || 5)));
    secondary = `Baseado em seu favorito anterior: ${fav.name}${fav.year ? ` ${fav.year}` : ''} (${stars})`;
  }

  return { primary, secondary };
}

const TRAIT_LABELS = {
  corpo: 'corpo',
  tanino: 'taninos',
  acidez: 'acidez',
  frutado: 'frutado',
  docura: 'doçura',
};

function inferUserTraits(userP) {
  const t = {};
  if ((userP.corpo || 0) >= 4)   t.corpo   = 'encorpados';
  if ((userP.tanino || 0) >= 4)  t.tanino  = 'tânicos';
  if ((userP.acidez || 0) >= 4)  t.acidez  = 'frescos';
  if ((userP.frutado || 0) >= 4) t.frutado = 'frutados';
  if ((userP.docura || 0) >= 4)  t.docura  = 'mais doces';
  return t;
}

function traitsToSentence(traits) {
  const adjectives = Object.values(traits);
  if (adjectives.length === 0) return null;
  if (adjectives.length === 1) return adjectives[0];
  if (adjectives.length === 2) return `${adjectives[0]} e ${adjectives[1]}`;
  return adjectives.slice(0, -1).join(', ') + ' e ' + adjectives[adjectives.length - 1];
}

function normTo5(v) {
  if (typeof v !== 'number') return 3;
  if (v > 5) return Math.max(1, Math.min(5, Math.round(v / 20)));
  return Math.max(1, Math.min(5, Math.round(v)));
}

function pairingSuggestions(wine) {
  const type = (wine.type || '').toLowerCase();
  if (type.includes('branco'))    return ['Peixes grelhados', 'Frutos do mar', 'Massas leves'];
  if (type.includes('rosé'))      return ['Saladas', 'Massas frias', 'Aperitivos'];
  if (type.includes('espumante')) return ['Frutos do mar', 'Sushi', 'Aperitivos'];
  if (type.includes('fortificado')) return ['Queijos azuis', 'Sobremesas', 'Chocolate amargo'];
  return ['Carne vermelha', 'Queijos curados', 'Massas ao sugo'];
}

function formatBRL2(v) {
  if (typeof v !== 'number') return '—';
  return v.toFixed(2).replace('.', ',');
}

function matchToneColor33(score) {
  if (typeof score !== 'number') return T.c.n400;
  if (score >= 75) return T.c.s700;
  if (score >= 50) return T.c.a700;
  return T.c.n600;
}

function FallbackBadge23({ score }) {
  return (
    <div style={{
      width: 120, height: 120, borderRadius: '50%',
      background: matchToneColor33(score), color: T.c.n0,
      border: '4px solid rgba(255,255,255,0.85)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif || "'Fraunces', Georgia, serif",
      fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em',
      boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
    }}>{score}%</div>
  );
}

function LegendDot33({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span aria-hidden="true" style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
      }}/>
      {label}
    </span>
  );
}

function PairingChip({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 32, padding: '0 12px',
      background: T.c.n0,
      border: `1px solid ${T.c.n300}`,
      borderRadius: T.r.full,
      fontSize: 13, fontWeight: 600, color: T.c.n800,
    }}>
      {label}
    </span>
  );
}

// ─── Mini radar (5 axes, 200px) ──────────────────────────────
function ProfileRadar200({ wineProfile, userProfile }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 28;
  const axes = [
    { key: 'acidez',  label: 'Acidez'  },
    { key: 'tanino',  label: 'Tanino'  },
    { key: 'corpo',   label: 'Corpo'   },
    { key: 'frutado', label: 'Frutado' },
    { key: 'docura',  label: 'Doçura'  },
  ];
  const angleFor = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / axes.length);

  const pointFor = (val, i) => {
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
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Perfil sensorial vs seu paladar"
      style={{ display: 'block' }}
    >
      {[0.33, 0.66, 1].map((ratio, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r * ratio}
          fill={i === 2 ? 'rgba(245,227,229,0.32)' : 'none'}
          stroke={T.c.n200}
          strokeWidth={1}
          strokeDasharray={i < 2 ? '3 4' : 'none'}
        />
      ))}
      {axes.map((_, i) => {
        const a = angleFor(i);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={T.c.n200} strokeWidth={1}/>
        );
      })}
      {userProfile && (
        <polygon
          points={polyPoints(userProfile)}
          fill="rgba(184,137,74,0.18)"
          stroke={T.c.a700}
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
      )}
      <polygon
        points={polyPoints(wineProfile)}
        fill="rgba(114,47,55,0.32)"
        stroke={T.c.p700}
        strokeWidth={2}
      />
      {axes.map((ax, i) => {
        const [x, y] = pointFor((wineProfile || {})[ax.key] || 0, i);
        return (
          <circle key={ax.key} cx={x} cy={y} r={2.6} fill={T.c.p700}/>
        );
      })}
      {axes.map((ax, i) => {
        const a = angleFor(i);
        const lx = cx + Math.cos(a) * (r + 16);
        const ly = cy + Math.sin(a) * (r + 16);
        return (
          <text
            key={ax.key}
            x={lx} y={ly}
            fontSize={11} fontFamily={T.font} fontWeight={600}
            fill={T.c.n600}
            textAnchor="middle" dominantBaseline="middle"
          >{ax.label}</text>
        );
      })}
    </svg>
  );
}

Object.assign(window, { PorQueCombina, generateExplanationText });


export { FallbackBadge23, LegendDot33, PairingChip, PorQueCombina, ProfileRadar200, TRAIT_LABELS, formatBRL2, generateExplanationText, inferUserTraits, matchToneColor33, normTo5, pairingSuggestions, traitsToSentence };
