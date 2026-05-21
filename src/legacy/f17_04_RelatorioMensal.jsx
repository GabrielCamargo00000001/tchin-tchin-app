/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 17.04 · RelatorioMensal — full-screen "wrapped style" monthly report
//
//   <RelatorioMensal
//     data={{
//       month: 'maio', year: 2026, monthIndex: 4,
//       stats: { wines: 7, countries: 4, grapes: 5 },
//       previous: { wines: 5, countries: 3, grapes: 3 },
//       favorite: { wine, rating, note },
//       countries: [{ name: 'Argentina', code: 'AR', lat: -34, lon: -64 }, ...],
//       grape: { name: 'Malbec', count: 3, prevCount: 1 },
//     }}
//     onClose={() => ...}
//     onShare={() => ...}
//   />
//
// Renders a scrollable wrapped-style monthly story:
//   - Sticky top bar (close + share)
//   - Hero (eyebrow MAIO 2026 + h1 Fraunces 40)
//   - 3 stat statement cards (vinhos / países / uvas)
//   - Favorito do mês (detailed dark card)
//   - Mapa do mundo (dotted globe, countries lit)
//   - Sua uva da vez (huge grape name + comparison)
//   - Comparativo (paired bars, mês atual vs anterior)
//   - Fixed bottom CTA "Compartilhar nas redes"
// ─────────────────────────────────────────────────────────────

// ─── Seasonal hero gradients (12 months) ──────────────────────
const RELATORIO_THEMES = [
  { hero: ['#4A1F24', '#A04A55'], accent: '#D4A574' }, // jan — verão maduro
  { hero: ['#722F37', '#C97D87'], accent: '#F5E9D4' }, // fev
  { hero: ['#8C4537', '#D4A574'], accent: '#F5E3E5' }, // mar
  { hero: ['#A04A55', '#D4A574'], accent: '#F5E9D4' }, // abr
  { hero: ['#4A1F24', '#722F37'], accent: '#D4A574' }, // mai — outono cedo
  { hero: ['#2A2A2A', '#722F37'], accent: '#D4A574' }, // jun
  { hero: ['#0F0F0F', '#4A1F24'], accent: '#B8894A' }, // jul
  { hero: ['#1A1A1A', '#4A1F24'], accent: '#D4A574' }, // ago
  { hero: ['#722F37', '#A04A55'], accent: '#F5E9D4' }, // set
  { hero: ['#A04A55', '#B8894A'], accent: '#F5E3E5' }, // out
  { hero: ['#722F37', '#D4A574'], accent: '#F5E9D4' }, // nov
  { hero: ['#4A1F24', '#A04A55'], accent: '#D4A574' }, // dez
];

const MONTHS_LONG = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];

function RelatorioMensal({
  data = {},
  onClose = () => {},
  onShare = () => {},
}) {
  const month = data.month || 'maio';
  const year = data.year || 2026;
  const monthIndex = typeof data.monthIndex === 'number'
    ? data.monthIndex
    : MONTHS_LONG.indexOf((month || '').toUpperCase());
  const idx = monthIndex >= 0 ? monthIndex : 4;
  const theme = RELATORIO_THEMES[idx] || RELATORIO_THEMES[4];

  const stats = data.stats || { wines: 7, countries: 4, grapes: 5 };
  const prev = data.previous || { wines: 5, countries: 3, grapes: 3 };
  const favorite = data.favorite || {
    wine: {
      name: 'Catena Malbec',
      producer: 'Bodega Catena Zapata',
      country: 'Argentina',
      region: 'Mendoza',
      year: '2021',
      type: 'Tinto',
    },
    rating: 5,
    note: 'Achei sedoso, com final muito longo de baunilha. Tomei num jantar de quinta com a Carla, perfeito com o cordeiro.',
  };
  const countries = data.countries || [
    { name: 'Argentina', code: 'AR', flag: '🇦🇷', lat: -34, lon: -64 },
    { name: 'Portugal',  code: 'PT', flag: '🇵🇹', lat: 39, lon: -8 },
    { name: 'França',    code: 'FR', flag: '🇫🇷', lat: 47, lon: 2 },
    { name: 'Brasil',    code: 'BR', flag: '🇧🇷', lat: -14, lon: -52 },
  ];
  const grape = data.grape || { name: 'Malbec', count: 3, prevCount: 1 };

  return (
    <div
      data-screen-label="17.04 RelatorioMensal"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: T.c.n950,
        fontFamily: T.font,
        position: 'relative',
        overflow: 'hidden',
        color: T.c.n0,
      }}
    >
      {/* Sticky top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 8px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)',
      }}>
        <IconBtn name="close" onClick={onClose} ariaLabel="Fechar"/>
        <IconBtn name="ios_share" onClick={onShare} ariaLabel="Compartilhar"/>
      </div>

      {/* Scrollable canvas */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 96, // room for fixed CTA
      }}>
        {/* ── Section 1 — Hero ─────────────────────────── */}
        <HeroSection theme={theme} monthLabel={MONTHS_LONG[idx]} year={year}/>

        {/* ── Section 2 — Three statement stats ────────── */}
        <StatementStat
          bg={T.c.n50}
          fg={T.c.n950}
          accent={T.c.p700}
          value={stats.wines}
          unit={stats.wines === 1 ? 'vinho' : 'vinhos'}
          headline="Você provou"
          tail={stats.wines === 1 ? 'esse mês.' : 'esse mês.'}
          delta={stats.wines - prev.wines}
          deltaWord="que mês passado"
          serialNo="01"
        />
        <StatementStat
          bg="#F5E9D4"
          fg={T.c.p900}
          accent={T.c.a700}
          value={stats.countries}
          unit={stats.countries === 1 ? 'país' : 'países'}
          headline="Cobriu"
          tail="no globo."
          delta={stats.countries - prev.countries}
          deltaWord="que mês passado"
          serialNo="02"
        >
          <FlagsRow countries={countries}/>
        </StatementStat>
        <StatementStat
          bg={T.c.p100}
          fg={T.c.p900}
          accent={T.c.p700}
          value={stats.grapes}
          unit={stats.grapes === 1 ? 'uva nova' : 'uvas novas'}
          headline="Conheceu"
          tail="pela primeira vez."
          delta={stats.grapes - prev.grapes}
          deltaWord="que mês passado"
          serialNo="03"
        />

        {/* ── Section 3 — Favorito do mês ──────────────── */}
        <FavoriteSection favorite={favorite} theme={theme}/>

        {/* ── Section 4 — Mapa do mundo ────────────────── */}
        <MapSection countries={countries} accent={theme.accent}/>

        {/* ── Section 5 — Sua uva da vez ───────────────── */}
        <GrapeSection grape={grape}/>

        {/* ── Section 6 — Comparativo ──────────────────── */}
        <ComparativoSection stats={stats} prev={prev} monthLabel={month}/>

        {/* Footer wordmark */}
        <div style={{
          padding: '40px 24px 32px',
          background: T.c.n950,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 28, fontWeight: 600, color: T.c.n0,
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>Tchin Tchin</div>
          <div style={{
            ...T.t.overline, color: T.c.a500, marginTop: 6,
          }}>Seu diário de vinhos</div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '12px 16px 20px',
        background: 'linear-gradient(180deg, rgba(15,15,15,0) 0%, rgba(15,15,15,0.85) 38%, rgba(15,15,15,0.98) 100%)',
      }}>
        <button
          type="button"
          onClick={onShare}
          style={{
            width: '100%', height: 52,
            background: T.c.n0, color: T.c.p900,
            border: 'none', borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 16, fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            letterSpacing: '-0.01em',
          }}
        >
          <Icon name="ios_share" size={20} color={T.c.p900}/>
          Compartilhar nas redes
        </button>
        <div style={{
          textAlign: 'center', marginTop: 8,
          fontSize: 11, color: 'rgba(255,255,255,0.55)',
          fontFamily: T.mono, letterSpacing: 0.3,
        }}>gera imagem 1080×1920 pra Stories</div>
      </div>
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────
function HeroSection({ theme, monthLabel, year }) {
  return (
    <section style={{
      position: 'relative',
      padding: '88px 24px 56px',
      background: `linear-gradient(165deg, ${theme.hero[0]} 0%, ${theme.hero[1]} 100%)`,
      color: T.c.n0,
      overflow: 'hidden',
    }}>
      {/* Decorative orbs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -80, right: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: -100, left: -40,
        width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      {/* Year + month metadata */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 16,
      }}>
        <span style={{
          width: 24, height: 1, background: theme.accent,
        }}/>
        <div style={{
          fontFamily: T.mono, fontSize: 11, fontWeight: 500,
          color: theme.accent, letterSpacing: 2,
        }}>{monthLabel} · {year}</div>
      </div>

      {/* Title */}
      <h1 style={{
        position: 'relative',
        margin: 0,
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 40, lineHeight: 1.0,
        fontWeight: 500, fontStyle: 'normal',
        letterSpacing: '-0.025em',
        color: T.c.n0,
        textWrap: 'balance',
      }}>
        Seu mês <em style={{
          fontStyle: 'italic', fontWeight: 400,
          color: theme.accent,
        }}>no vinho</em>
      </h1>

      <p style={{
        position: 'relative',
        margin: '20px 0 0', maxWidth: 280,
        fontSize: 14, lineHeight: 1.55,
        color: 'rgba(255,255,255,0.78)',
      }}>
        Um resumo do que rolou na sua taça. Role pra ver — e compartilhe se gostar.
      </p>

      {/* Scroll hint */}
      <div style={{
        position: 'relative', marginTop: 40,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: T.mono, fontSize: 10, fontWeight: 500,
        color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5,
      }}>
        <Icon name="arrow_downward" size={14} color="rgba(255,255,255,0.55)"/>
        ROLE PARA COMEÇAR
      </div>
    </section>
  );
}

// ─── Statement stat card ──────────────────────────────────────
function StatementStat({
  bg, fg, accent, value, unit, headline, tail, delta, deltaWord, serialNo, children,
}) {
  const positive = delta > 0;
  const negative = delta < 0;
  const arrow = positive ? 'arrow_upward' : (negative ? 'arrow_downward' : 'remove');
  const deltaStr = delta === 0 ? 'igual ao mês passado' : `${positive ? '+' : ''}${delta} ${deltaWord}`;
  const deltaColor = positive ? T.c.s700 : (negative ? T.c.e700 : T.c.n600);

  return (
    <section style={{
      position: 'relative',
      padding: '40px 24px 36px',
      background: bg,
      color: fg,
    }}>
      {/* Serial number */}
      <div style={{
        position: 'absolute', top: 16, right: 20,
        fontFamily: T.mono, fontSize: 11, fontWeight: 500,
        color: fg, opacity: 0.4, letterSpacing: 1,
      }}>{serialNo} / 03</div>

      <div style={{
        fontFamily: T.font, fontSize: 14, fontWeight: 500,
        color: fg, opacity: 0.72,
      }}>{headline}</div>

      {/* The huge number */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        marginTop: 4, marginBottom: 4,
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
      }}>
        <span style={{
          fontSize: 96, lineHeight: 0.95,
          fontWeight: 500, color: accent,
          letterSpacing: '-0.04em',
        }}>{value}</span>
        <span style={{
          fontSize: 22, lineHeight: 1.1,
          fontWeight: 500, fontStyle: 'italic',
          color: fg, letterSpacing: '-0.015em',
        }}>{unit}</span>
      </div>

      <div style={{
        fontFamily: T.font, fontSize: 14, fontWeight: 500,
        color: fg, opacity: 0.72,
      }}>{tail}</div>

      {/* Optional children (e.g. flags row) */}
      {children && <div style={{ marginTop: 16 }}>{children}</div>}

      {/* Delta pill */}
      <div style={{
        marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px',
        background: 'rgba(0,0,0,0.06)',
        borderRadius: T.r.full,
        fontSize: 12, fontWeight: 600,
        color: deltaColor,
      }}>
        <Icon name={arrow} size={14} color={deltaColor}/>
        {deltaStr}
      </div>
    </section>
  );
}

function FlagsRow({ countries }) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 8,
    }}>
      {countries.map((c) => (
        <div key={c.code || c.name} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 8px',
          background: 'rgba(255,255,255,0.55)',
          border: `1px solid rgba(74,31,36,0.08)`,
          borderRadius: T.r.full,
          fontSize: 13, fontWeight: 600,
          color: T.c.p900,
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden="true">{c.flag || '🌍'}</span>
          {c.name}
        </div>
      ))}
    </div>
  );
}

// ─── Favorite section ─────────────────────────────────────────
function FavoriteSection({ favorite, theme }) {
  const wine = favorite.wine || {};
  return (
    <section style={{
      position: 'relative',
      padding: '40px 24px 44px',
      background: T.c.p900,
      color: T.c.n0,
      overflow: 'hidden',
    }}>
      {/* Decorative */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -60, right: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      <SectionEyebrow color={theme.accent}>Favorito do mês</SectionEyebrow>

      <div style={{
        marginTop: 20,
        display: 'flex', gap: 18, alignItems: 'flex-start',
        position: 'relative',
      }}>
        {/* Big bottle visual */}
        <div style={{
          width: 96, height: 140, flexShrink: 0,
          borderRadius: 8,
          background: `linear-gradient(165deg, ${T.c.p500} 0%, ${T.c.p900} 55%, ${T.c.n950} 100%)`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, opacity: 0.12,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 16px)',
          }}/>
          <Icon name="wine_bar" size={42} color="rgba(255,255,255,0.92)" fill={1}/>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: theme.accent,
            textTransform: 'uppercase', letterSpacing: 0.6,
          }}>{wine.producer || '—'}</div>
          <div style={{
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 22, fontWeight: 600,
            color: T.c.n0,
            letterSpacing: '-0.015em', lineHeight: 1.15,
            marginTop: 4, textWrap: 'balance',
          }}>{wine.name || 'Vinho'}{wine.year ? ` ${wine.year}` : ''}</div>
          <div style={{
            marginTop: 6, fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
          }}>{[wine.country, wine.region].filter(Boolean).join(' · ')}</div>

          {/* Big stars */}
          <div style={{ marginTop: 12, display: 'inline-flex', gap: 2 }}>
            {[0,1,2,3,4].map(i => (
              <Icon
                key={i}
                name="star"
                size={20}
                color={i < (favorite.rating || 0) ? theme.accent : 'rgba(255,255,255,0.18)'}
                fill={i < (favorite.rating || 0) ? 1 : 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User note */}
      {favorite.note && (
        <div style={{
          marginTop: 24, position: 'relative',
          padding: '20px 20px 18px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: T.r.md,
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: -10, left: 16,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 56, lineHeight: 1, color: theme.accent,
            fontWeight: 600,
          }}>“</div>
          <p style={{
            margin: 0, fontSize: 15, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.92)',
            fontStyle: 'italic',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontWeight: 400,
          }}>{favorite.note}</p>
          <div style={{
            marginTop: 12,
            fontFamily: T.mono, fontSize: 10, fontWeight: 500,
            color: 'rgba(255,255,255,0.45)', letterSpacing: 1,
          }}>SUA NOTA · DIÁRIO PESSOAL</div>
        </div>
      )}
    </section>
  );
}

// ─── Map section ──────────────────────────────────────────────
function MapSection({ countries, accent }) {
  // Equirectangular dotted-grid world map. Each country we list is
  // mapped to its lat/lon, dropping a glowing accent dot at the right
  // grid intersection. Background dots remain subtle.
  const cols = 28;  // longitude bins
  const rows = 12;  // latitude bins
  const visibleSet = new Set(
    (countries || [])
      .filter(c => typeof c.lat === 'number' && typeof c.lon === 'number')
      .map(c => `${Math.round((c.lon + 180) / 360 * (cols - 1))}-${Math.round((90 - c.lat) / 180 * (rows - 1))}`)
  );

  return (
    <section style={{
      position: 'relative',
      padding: '40px 24px 44px',
      background: T.c.n950,
      color: T.c.n0,
      overflow: 'hidden',
    }}>
      <SectionEyebrow color={accent}>Mapa do mundo</SectionEyebrow>

      <h2 style={{
        margin: '6px 0 4px',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 28, fontWeight: 500,
        letterSpacing: '-0.02em', lineHeight: 1.1,
        color: T.c.n0, textWrap: 'balance',
      }}>{countries.length} pontos <em style={{ fontStyle: 'italic', color: accent, fontWeight: 400 }}>iluminados</em></h2>
      <p style={{
        margin: '8px 0 24px', fontSize: 14, lineHeight: 1.5,
        color: 'rgba(255,255,255,0.65)', maxWidth: 280,
      }}>Cada país que você provou esse mês acende um ponto.</p>

      {/* Dotted globe */}
      <div style={{
        position: 'relative',
        aspectRatio: `${cols} / ${rows}`,
        width: '100%',
        marginBottom: 20,
      }}>
        <svg
          viewBox={`0 0 ${cols} ${rows}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
          aria-label="Mapa do mundo com países visitados"
        >
          {Array.from({ length: cols }).map((_, x) => (
            Array.from({ length: rows }).map((__, y) => {
              const key = `${x}-${y}`;
              const isLit = visibleSet.has(key);
              // Only render dots that loosely sit on landmass — fake
              // it with a simple equator-weighted density. Cheap, but
              // visually conveys "world map" without hand-drawn paths.
              const onLand = pseudoLandmass(x, y, cols, rows);
              if (!onLand && !isLit) return null;
              return (
                <circle
                  key={key}
                  cx={x + 0.5}
                  cy={y + 0.5}
                  r={isLit ? 0.42 : 0.16}
                  fill={isLit ? accent : 'rgba(255,255,255,0.22)'}
                  style={isLit ? {
                    filter: `drop-shadow(0 0 1.2px ${accent})`,
                  } : undefined}
                />
              );
            })
          ))}
        </svg>
      </div>

      {/* Country list */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 1,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: T.r.md,
        overflow: 'hidden',
      }}>
        {countries.map((c, i) => (
          <div key={c.code || c.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">{c.flag || '🌍'}</span>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.c.n0 }}>{c.name}</div>
            <div style={{
              fontFamily: T.mono, fontSize: 11, fontWeight: 500,
              color: accent, letterSpacing: 1,
            }}>{String(i + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Cheap landmass approximation for the dot map. Returns true when
// a grid cell is roughly over land. Tuned for cols=28, rows=12.
function pseudoLandmass(x, y, cols, rows) {
  // Normalize to a 28×12 grid; bitmap below is hand-tuned to vaguely
  // resemble continents (1 = land, 0 = sea). 28 cols × 12 rows.
  const MAP = [
    '0000111111111110001111111100',
    '0011111111111111011111111111',
    '0011111111111111011111111110',
    '0001111111111110011111111100',
    '0000011111111000001111110000',
    '0000111111110000000011110000',
    '0000111111100000001111000000',
    '0000011111000000001111000000',
    '0000001111000000001111000000',
    '0000000110000000000110000000',
    '0000000100000000000100000000',
    '0000000000000000000000000000',
  ];
  if (y < 0 || y >= MAP.length) return false;
  const row = MAP[y];
  if (x < 0 || x >= row.length) return false;
  return row[x] === '1';
}

// ─── Grape section ────────────────────────────────────────────
function GrapeSection({ grape }) {
  const delta = (grape.count || 0) - (grape.prevCount || 0);
  const positive = delta > 0;
  return (
    <section style={{
      position: 'relative',
      padding: '48px 24px 48px',
      background: `linear-gradient(160deg, ${T.c.a700} 0%, ${T.c.p700} 100%)`,
      color: T.c.n0,
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: -80, right: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      <SectionEyebrow color="rgba(255,255,255,0.85)">Sua uva da vez</SectionEyebrow>

      <h2 style={{
        position: 'relative',
        margin: '12px 0 0',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 56, fontWeight: 500,
        letterSpacing: '-0.035em', lineHeight: 0.95,
        color: T.c.n0, textWrap: 'balance',
      }}>{grape.name}</h2>

      <div style={{
        position: 'relative',
        marginTop: 16,
        display: 'flex', alignItems: 'baseline', gap: 8,
      }}>
        <span style={{
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 32, fontWeight: 500,
          color: T.c.n0, letterSpacing: '-0.02em',
        }}>{grape.count}</span>
        <span style={{
          fontSize: 14, fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
        }}>{grape.count === 1 ? 'taça registrada' : 'taças registradas'}</span>
      </div>

      <div style={{
        position: 'relative', marginTop: 16,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 14px',
        background: 'rgba(0,0,0,0.20)',
        borderRadius: T.r.full,
        fontSize: 13, fontWeight: 600,
        color: T.c.n0,
      }}>
        <Icon name={positive ? 'trending_up' : (delta < 0 ? 'trending_down' : 'trending_flat')} size={16} color={T.c.n0}/>
        {delta === 0 ? 'Mesmo que mês passado' : `${positive ? '+' : ''}${delta} que mês passado`}
      </div>
    </section>
  );
}

// ─── Comparativo (paired bars) ────────────────────────────────
function ComparativoSection({ stats, prev, monthLabel }) {
  const rows = [
    { label: 'Vinhos',  curr: stats.wines,     prev: prev.wines,     icon: 'wine_bar' },
    { label: 'Países',  curr: stats.countries, prev: prev.countries, icon: 'public' },
    { label: 'Uvas',    curr: stats.grapes,    prev: prev.grapes,    icon: 'eco' },
  ];
  const max = Math.max(1, ...rows.flatMap(r => [r.curr, r.prev]));

  const prevLabel = previousMonthLabel(monthLabel);

  return (
    <section style={{
      padding: '40px 24px 44px',
      background: T.c.n50,
      color: T.c.n950,
    }}>
      <SectionEyebrow color={T.c.p700}>Comparativo</SectionEyebrow>

      <h2 style={{
        margin: '6px 0 4px',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 28, fontWeight: 500,
        letterSpacing: '-0.02em', lineHeight: 1.1,
        color: T.c.n950, textWrap: 'balance',
      }}>{capitalizeMonth(monthLabel)} <em style={{ fontStyle: 'italic', color: T.c.p700, fontWeight: 400 }}>vs.</em> {prevLabel}</h2>
      <p style={{
        margin: '8px 0 24px', fontSize: 14, lineHeight: 1.5,
        color: T.c.n600, maxWidth: 280,
      }}>Como esse mês se compara ao anterior, em três métricas.</p>

      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
        fontSize: 12, color: T.c.n600,
      }}>
        <LegendDot color={T.c.p700} label={capitalizeMonth(monthLabel)}/>
        <LegendDot color={T.c.n300} label={prevLabel}/>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {rows.map((r) => (
          <BarRow key={r.label} row={r} max={max}/>
        ))}
      </div>
    </section>
  );
}

function BarRow({ row, max }) {
  const currPct = (row.curr / max) * 100;
  const prevPct = (row.prev / max) * 100;
  const delta = row.curr - row.prev;
  const positive = delta > 0;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
      }}>
        <Icon name={row.icon} size={16} color={T.c.p700}/>
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.c.n950, flex: 1,
        }}>{row.label}</div>
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: delta === 0 ? T.c.n600 : (positive ? T.c.s700 : T.c.e700),
          fontFamily: T.mono, letterSpacing: 0.3,
        }}>{delta === 0 ? '±0' : `${positive ? '+' : ''}${delta}`}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <BarTrack pct={currPct} value={row.curr} color={T.c.p700} textColor={T.c.n0}/>
        <BarTrack pct={prevPct} value={row.prev} color={T.c.n300} textColor={T.c.n950}/>
      </div>
    </div>
  );
}

function BarTrack({ pct, value, color, textColor }) {
  const safe = Math.max(8, pct); // ensure label fits visually
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: 24,
      background: T.c.n100,
      borderRadius: T.r.xs,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${safe}%`, height: '100%',
        background: color,
        borderRadius: T.r.xs,
        transition: 'width 320ms ease-out',
      }}/>
      <div style={{
        position: 'absolute', top: 0, left: 8, right: 0, height: '100%',
        display: 'flex', alignItems: 'center',
        fontSize: 12, fontWeight: 700,
        color: pct > 18 ? textColor : T.c.n950,
        fontFamily: T.mono, letterSpacing: 0.3,
      }}>{value}</div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%', background: color,
      }}/>
      {label}
    </div>
  );
}

// ─── Shared bits ──────────────────────────────────────────────
function SectionEyebrow({ children, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: T.mono, fontSize: 10, fontWeight: 500,
      color, letterSpacing: 2, textTransform: 'uppercase',
    }}>
      <span style={{
        width: 18, height: 1, background: color, opacity: 0.6,
      }}/>
      {children}
    </div>
  );
}

function IconBtn({ name, onClick, ariaLabel }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: hover ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
        border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 160ms',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <Icon name={name} size={20} color={T.c.n0}/>
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function capitalizeMonth(name) {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function previousMonthLabel(month) {
  const list = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const idx = list.indexOf((month || '').toLowerCase());
  if (idx === -1) return 'Mês anterior';
  const prev = list[(idx - 1 + 12) % 12];
  return prev.charAt(0).toUpperCase() + prev.slice(1);
}

Object.assign(window, { RelatorioMensal, RELATORIO_THEMES });


export { BarRow, BarTrack, ComparativoSection, FavoriteSection, FlagsRow, GrapeSection, HeroSection, IconBtn, LegendDot, MONTHS_LONG, MapSection, RELATORIO_THEMES, RelatorioMensal, SectionEyebrow, StatementStat, capitalizeMonth, previousMonthLabel, pseudoLandmass };
