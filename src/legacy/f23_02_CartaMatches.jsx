/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MatchScoreBadge } from './f16_01_MatchScoreBadge.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.02 · CartaMatches — vinhos da carta de restaurante ranqueados
//
// US-13-1-02 · após OCR da carta em 23.01
//
//   <CartaMatches
//     identified={[                       // vinhos reconhecidos da base
//       { wine: {...}, price: 89, position: 'Tinto' },
//     ]}
//     unidentified={[                     // OCR pegou texto mas não bateu
//       { rawText: 'Tannat Reserva 2019 — R$ 124' },
//     ]}
//     onBack={() => ...}
//     onTapWine={(item) => go('23.03', item)}
//     onSearchManual={(rawText) => ...}
//     onNewPhoto={() => go('23.01')}
//     onOpenHistory={() => ...}
//   />
//
// Sort default: por match desc. Badges:
//   ⭐ Melhor match (top 1 do sort 'match')
//   💰 Melhor custo-benefício (maior match × preço inverso ponderado)
// ─────────────────────────────────────────────────────────────

const CARTA_SORTS = [
  { key: 'match', label: 'Por match',  icon: 'auto_awesome' },
  { key: 'price', label: 'Por preço',  icon: 'sell' },
  { key: 'type',  label: 'Por tipo',   icon: 'category' },
];

function CartaMatches({
  identified = [],
  unidentified = [],
  onBack = () => {},
  onTapWine = () => {},
  onSearchManual = () => {},
  onNewPhoto = () => {},
  onOpenHistory = () => {},
}) {
  const [sort, setSort] = React.useState('match');
  const [showUnidentified, setShowUnidentified] = React.useState(false);

  const items = React.useMemo(() => {
    const list = identified.slice();
    if (sort === 'match') list.sort((a, b) => (b.wine.match || 0) - (a.wine.match || 0));
    if (sort === 'price') list.sort((a, b) => (a.price || 9999) - (b.price || 9999));
    if (sort === 'type')  list.sort((a, b) => (a.wine.type || '').localeCompare(b.wine.type || ''));
    return list;
  }, [identified, sort]);

  // Best match (highest score) & best value (match-per-real)
  const bestMatchId = React.useMemo(() => {
    if (identified.length === 0) return null;
    const best = identified.reduce((a, b) => (a.wine.match || 0) > (b.wine.match || 0) ? a : b);
    return best.wine.id;
  }, [identified]);

  const bestValueId = React.useMemo(() => {
    const candidates = identified.filter(i => i.price > 0 && (i.wine.match || 0) > 0);
    if (candidates.length === 0) return null;
    const best = candidates.reduce((a, b) => ((a.wine.match || 0) / a.price) > ((b.wine.match || 0) / b.price) ? a : b);
    return best.wine.id;
  }, [identified]);

  const topMatch = identified.reduce((acc, x) => Math.max(acc, x.wine.match || 0), 0);
  const noGoodMatches = identified.length > 0 && topMatch < 70;

  return (
    <div
      data-screen-label="23.02 CartaMatches"
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: T.c.n50,
        fontFamily: T.font, color: T.c.n950,
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '8px 8px 8px 4px',
        background: T.c.n0,
        borderBottom: `1px solid ${T.c.n200}`,
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{
            margin: 0, fontSize: 17, fontWeight: 600,
            color: T.c.n950, letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}>Carta de vinhos</h4>
          <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 1 }}>
            {identified.length} identificados{unidentified.length ? ` · ${unidentified.length} não identificados` : ''}
          </div>
        </div>
      </header>

      {/* Sort chips */}
      <div style={{
        padding: '12px 16px 8px',
        background: T.c.n0,
        borderBottom: `1px solid ${T.c.n200}`,
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', gap: 8,
          overflowX: 'auto', overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {CARTA_SORTS.map(s => {
            const active = sort === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSort(s.key)}
                style={{
                  flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 32, padding: '0 14px',
                  background: active ? T.c.p700 : T.c.n0,
                  color: active ? T.c.n0 : T.c.n800,
                  border: `1px solid ${active ? T.c.p700 : T.c.n300}`,
                  borderRadius: T.r.full,
                  cursor: 'pointer',
                  fontFamily: T.font, fontSize: 13, fontWeight: 600,
                  transition: 'background 120ms, color 120ms, border-color 120ms',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={s.icon} size={14} color={active ? T.c.n0 : T.c.p700}/>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 100,
      }}>
        {/* "No good matches" sticky banner */}
        {noGoodMatches && (
          <div style={{
            margin: '12px 16px',
            padding: '12px 14px',
            background: T.c.a100,
            border: `1px solid ${T.c.a500}`,
            borderRadius: T.r.md,
            display: 'flex', gap: 10,
          }}>
            <Icon name="auto_awesome" size={18} color={T.c.a700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                ...T.t.bodyB, fontSize: 13, color: T.c.p900,
                lineHeight: 1.4,
              }}>Nada da carta combina muito com seu paladar.</div>
              <div style={{
                ...T.t.caption, color: T.c.n800,
                marginTop: 2,
              }}>Topa arriscar? Os 3 primeiros são os menos distantes.</div>
            </div>
          </div>
        )}

        {/* Identified wines list */}
        <div style={{
          background: T.c.n0,
          margin: noGoodMatches ? '0 16px' : '12px 16px',
          marginTop: noGoodMatches ? 0 : 12,
          marginBottom: 12,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.lg,
          overflow: 'hidden',
        }}>
          {items.map((item, i) => (
            <CartaItemRow
              key={item.wine.id || i}
              item={item}
              showDivider={i < items.length - 1}
              isBestMatch={item.wine.id === bestMatchId && sort === 'match'}
              isBestValue={item.wine.id === bestValueId && sort !== 'price'}
              greyMatch={noGoodMatches}
              onTap={() => onTapWine(item)}
            />
          ))}
        </div>

        {/* Unidentified section */}
        {unidentified.length > 0 && (
          <section style={{ padding: '8px 16px 16px' }}>
            <button
              type="button"
              onClick={() => setShowUnidentified(o => !o)}
              style={{
                width: '100%',
                background: T.c.n0,
                border: `1px solid ${T.c.n200}`,
                borderRadius: showUnidentified ? `${T.r.md}px ${T.r.md}px 0 0` : T.r.md,
                padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
                fontFamily: T.font,
                textAlign: 'left',
              }}
            >
              <Icon name="error" size={18} color={T.c.a700} fill={1}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.t.bodyB, fontSize: 13, color: T.c.n950 }}>
                  Não identificamos {unidentified.length} {unidentified.length === 1 ? 'vinho' : 'vinhos'}
                </div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
                  Vimos o nome na carta, mas não bateu com nossa base.
                </div>
              </div>
              <Icon
                name={showUnidentified ? 'expand_less' : 'expand_more'}
                size={20}
                color={T.c.n600}
              />
            </button>

            {showUnidentified && (
              <div style={{
                background: T.c.n0,
                border: `1px solid ${T.c.n200}`,
                borderTop: 'none',
                borderRadius: `0 0 ${T.r.md}px ${T.r.md}px`,
                overflow: 'hidden',
              }}>
                {unidentified.map((u, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    borderTop: i === 0 ? 'none' : `1px solid ${T.c.n100}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <Icon name="quiz" size={16} color={T.c.n400}/>
                    <div style={{
                      flex: 1, minWidth: 0,
                      fontSize: 13, color: T.c.n800,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      fontFamily: T.mono, fontStyle: 'italic',
                    }}>{u.rawText}</div>
                    <button
                      type="button"
                      onClick={() => onSearchManual(u.rawText)}
                      style={{
                        height: 28, padding: '0 10px',
                        background: T.c.p50, color: T.c.p700,
                        border: `1px solid ${T.c.p100}`,
                        borderRadius: T.r.full,
                        fontFamily: T.font, fontSize: 11, fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="search" size={12} color={T.c.p700}/>
                      Buscar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n200}`,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button
          type="button"
          onClick={onOpenHistory}
          style={{
            height: 40, padding: '0 12px',
            background: 'transparent', color: T.c.n800,
            border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <Icon name="history" size={16} color={T.c.n800}/>
          Histórico de cartas
        </button>
        <div style={{ flex: 1 }}/>
        <button
          type="button"
          onClick={onNewPhoto}
          style={{
            height: 40, padding: '0 16px',
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 13, fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 12px rgba(74,31,36,0.18)',
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          <Icon name="photo_camera" size={16} color={T.c.n0}/>
          Nova foto
        </button>
      </div>
    </div>
  );
}

// ─── Item row ────────────────────────────────────────────────
function CartaItemRow({ item, showDivider, isBestMatch, isBestValue, greyMatch, onTap }) {
  const { wine, price } = item;
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0,
        border: 'none',
        borderBottom: showDivider ? `1px solid ${T.c.n100}` : 'none',
        padding: '14px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        fontFamily: T.font,
        transition: 'background 120ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = T.c.n50; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = T.c.n0; }}
    >
      {/* MatchScoreBadge md */}
      {typeof MatchScoreBadge !== 'undefined' ? (
        <div style={{ flexShrink: 0, filter: greyMatch ? 'grayscale(0.5) opacity(0.85)' : 'none' }}>
          <MatchScoreBadge score={wine.match} size="md"/>
        </div>
      ) : (
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: matchToneColor23(wine.match),
          color: T.c.n0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 18, fontWeight: 700,
          flexShrink: 0,
        }}>{wine.match}%</div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 14,
          lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name}</div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{[wine.producer, wine.region, wine.country].filter(Boolean).join(' · ')}</div>

        <div style={{
          marginTop: 8,
          display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
        }}>
          <span style={{
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 16, fontWeight: 700,
            color: T.c.p700, letterSpacing: '-0.005em',
          }}>R$ {formatBRL(price)}</span>

          {isBestMatch && (
            <Badge color={T.c.a700} bg={T.c.a100} icon="auto_awesome">
              Melhor match
            </Badge>
          )}
          {isBestValue && (
            <Badge color={T.c.s700} bg={T.c.s100} icon="savings">
              Melhor custo-benefício
            </Badge>
          )}
        </div>
      </div>

      <Icon name="chevron_right" size={22} color={T.c.n400} style={{ flexShrink: 0 }}/>
    </button>
  );
}

function Badge({ color, bg, icon, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px',
      background: bg,
      color,
      border: `1px solid ${color}33`,
      borderRadius: T.r.full,
      fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
    }}>
      {icon && <Icon name={icon} size={10} color={color} fill={1}/>}
      {children}
    </span>
  );
}

function matchToneColor23(score) {
  if (typeof score !== 'number') return T.c.n400;
  if (score >= 75) return T.c.s700;
  if (score >= 50) return T.c.a700;
  return T.c.n600;
}

function formatBRL(v) {
  if (typeof v !== 'number') return '—';
  return v.toFixed(2).replace('.', ',');
}

Object.assign(window, { CartaMatches });


export { Badge, CARTA_SORTS, CartaItemRow, CartaMatches, formatBRL, matchToneColor23 };
