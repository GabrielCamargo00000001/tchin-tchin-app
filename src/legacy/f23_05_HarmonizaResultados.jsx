/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MatchScoreBadge } from './f16_01_MatchScoreBadge.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.05 · HarmonizaResultados — sugestões de vinho pro prato
//
// US-13-4-01 · após HarmonizaPrato submeter o prato
//
//   <HarmonizaResultados
//     prato="picanha grelhada"
//     best={{                             // melhor opção
//       wine: { ...MOCK_WINES[0], match: 92 },
//       reason: 'Tannat combina com cordeiro — taninos firmes acompanham a gordura.',
//     }}
//     others={[                           // 3-5 outras opções
//       { wine, reason },
//     ]}
//     activeFilters={{ price: null, type: null, source: null }}
//     onBack={() => ...}
//     onTapWine={(item) => ...}
//     onBest={() => ...}                  // → 23.03 com best
//     onChangeFilter={(key, value) => ...}
//   />
// ─────────────────────────────────────────────────────────────

const HARMONIZA_PRICE_FILTERS = [
  { key: 'baixo',  label: 'até R$ 80' },
  { key: 'medio',  label: 'R$ 80–200' },
  { key: 'alto',   label: 'R$ 200+' },
];
const HARMONIZA_TYPE_FILTERS = ['Tinto', 'Branco', 'Rosé', 'Espumante'];
const HARMONIZA_SOURCE_FILTERS = [
  { key: 'qualquer', label: 'Qualquer lugar' },
  { key: 'perto',    label: 'Perto de mim' },
  { key: 'online',   label: 'Compro online' },
];

function HarmonizaResultados({
  prato = 'seu prato',
  best,
  others = [],
  activeFilters = {},
  onBack = () => {},
  onTapWine = () => {},
  onBest = () => {},
  onChangeFilter = () => {},
}) {
  const [filters, setFilters] = React.useState({
    price:  activeFilters.price  || null,
    type:   activeFilters.type   || null,
    source: activeFilters.source || null,
  });
  const [openFilter, setOpenFilter] = React.useState(null); // 'price'|'type'|'source'

  const setFilter = (key, value) => {
    const next = { ...filters, [key]: filters[key] === value ? null : value };
    setFilters(next);
    setOpenFilter(null);
    onChangeFilter(key, next[key]);
  };

  return (
    <div
      data-screen-label="23.05 HarmonizaResultados"
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
        <h4 style={{
          margin: 0, flex: 1, fontSize: 17, fontWeight: 600,
          color: T.c.n950, letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>Vinhos pra <i style={{ color: T.c.p700, fontWeight: 700, fontStyle: 'normal' }}>{prato}</i></h4>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Section heading */}
        <section style={{ padding: '24px 20px 0' }}>
          <h2 style={{
            margin: 0,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 26, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: T.c.n950, textWrap: 'balance',
          }}>Pra <em style={{ fontStyle: 'italic', color: T.c.p700 }}>{prato}</em>, sugerimos:</h2>
        </section>

        {/* Best option */}
        {best && (
          <section style={{ padding: '16px 16px 0' }}>
            <div style={{
              ...T.t.overline, color: T.c.p700,
              padding: '0 4px', marginBottom: 8,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="auto_awesome" size={11} color={T.c.p700} fill={1}/>
              Melhor opção
            </div>
            <BestOptionCard best={best} onTap={onBest}/>
          </section>
        )}

        {/* Other options */}
        {others.length > 0 && (
          <section style={{ padding: '20px 16px 0' }}>
            <div style={{
              ...T.t.overline, color: T.c.n600,
              padding: '0 4px', marginBottom: 10,
            }}>Outras opções</div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {others.map((item, i) => (
                <OtherOptionCard
                  key={(item.wine && item.wine.id) || i}
                  item={item}
                  onTap={() => onTapWine(item)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Adapt section */}
        <section style={{ padding: '24px 16px 32px' }}>
          <div style={{
            ...T.t.overline, color: T.c.n600,
            padding: '0 4px', marginBottom: 4,
          }}>Quer adaptar?</div>
          <h3 style={{
            margin: '2px 4px 14px',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 18, fontWeight: 600,
            letterSpacing: '-0.015em', lineHeight: 1.2,
            color: T.c.n950,
          }}>Ajuste por preço, tipo ou onde comprar.</h3>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            <FilterPill
              icon="sell"
              label="Preço"
              value={filters.price && (HARMONIZA_PRICE_FILTERS.find(f => f.key === filters.price) || {}).label}
              open={openFilter === 'price'}
              onToggle={() => setOpenFilter(o => o === 'price' ? null : 'price')}
              options={HARMONIZA_PRICE_FILTERS.map(f => ({ key: f.key, label: f.label }))}
              onPick={(v) => setFilter('price', v)}
              active={filters.price === 'baixo' ? 'baixo' : filters.price}
            />
            <FilterPill
              icon="local_bar"
              label="Tipo"
              value={filters.type}
              open={openFilter === 'type'}
              onToggle={() => setOpenFilter(o => o === 'type' ? null : 'type')}
              options={HARMONIZA_TYPE_FILTERS.map(t => ({ key: t, label: t }))}
              onPick={(v) => setFilter('type', v)}
              active={filters.type}
            />
            <FilterPill
              icon="place"
              label="Onde comprar"
              value={filters.source && (HARMONIZA_SOURCE_FILTERS.find(f => f.key === filters.source) || {}).label}
              open={openFilter === 'source'}
              onToggle={() => setOpenFilter(o => o === 'source' ? null : 'source')}
              options={HARMONIZA_SOURCE_FILTERS.map(f => ({ key: f.key, label: f.label }))}
              onPick={(v) => setFilter('source', v)}
              active={filters.source}
            />
          </div>

          <div style={{
            marginTop: 14,
            padding: '12px 14px',
            background: T.c.n0,
            border: `1px solid ${T.c.n200}`,
            borderRadius: T.r.md,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon name="info" size={16} color={T.c.n600}/>
            <div style={{
              flex: 1, minWidth: 0,
              fontSize: 12, lineHeight: 1.45,
              color: T.c.n700,
            }}>
              {hasAnyFilter(filters)
                ? <>Filtros aplicados — toque <b style={{ color: T.c.p700 }}>"Ver mais"</b> em qualquer vinho pra detalhes.</>
                : <>As sugestões consideram seu paladar e preferências habituais.</>
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function hasAnyFilter(f) {
  return !!(f && (f.price || f.type || f.source));
}

// ─── Best option card ────────────────────────────────────────
function BestOptionCard({ best, onTap }) {
  const wine = best.wine || {};
  return (
    <div style={{
      position: 'relative',
      background: T.c.n0,
      border: `2px solid ${T.c.p700}`,
      borderRadius: T.r.lg,
      padding: 16,
      boxShadow: '0 6px 16px rgba(74,31,36,0.12)',
      fontFamily: T.font,
    }}>
      {/* Top row: bottle + name + match */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <BottlePlaceholder width={72} height={110} showLabel={false}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            ...T.t.overline, color: T.c.n600, letterSpacing: 0.8,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{wine.producer || '—'}</div>
          <div style={{
            ...T.t.bodyB, color: T.c.n950, fontSize: 16,
            marginTop: 2, lineHeight: 1.25,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            letterSpacing: '-0.005em',
          }}>{wine.name}</div>
          <div style={{
            ...T.t.caption, color: T.c.n600, marginTop: 4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {[wine.year, wine.region, wine.country].filter(Boolean).join(' · ')}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: -2 }}>
          {typeof MatchScoreBadge !== 'undefined'
            ? <MatchScoreBadge score={wine.match} size="md"/>
            : <FallbackBadgeHR score={wine.match}/>
          }
        </div>
      </div>

      {/* Reason */}
      {best.reason && (
        <div style={{
          marginTop: 14, padding: '10px 12px',
          background: T.c.p50,
          border: `1px solid ${T.c.p100}`,
          borderRadius: T.r.sm,
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <Icon name="restaurant" size={14} color={T.c.p700} style={{ flexShrink: 0, marginTop: 2 }}/>
          <p style={{
            margin: 0, fontSize: 13, lineHeight: 1.5,
            color: T.c.n800,
          }}><b style={{ color: T.c.n950, fontWeight: 700 }}>Combina porque</b> {best.reason}</p>
        </div>
      )}

      {/* CTA + price */}
      <div style={{
        marginTop: 14,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {typeof wine.price === 'number' && (
          <div style={{
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 18, fontWeight: 700,
            color: T.c.p700, letterSpacing: '-0.005em',
            flex: 1, minWidth: 0,
          }}>R$ {formatBRLhr(wine.price)}</div>
        )}
        <button
          type="button"
          onClick={onTap}
          style={{
            marginLeft: 'auto',
            height: 36, padding: '0 16px',
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 13, fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          Ver mais
          <Icon name="arrow_forward" size={14} color={T.c.n0}/>
        </button>
      </div>
    </div>
  );
}

// ─── Other option card ───────────────────────────────────────
function OtherOptionCard({ item, onTap }) {
  const wine = item.wine || {};
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.md,
        padding: 12,
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        fontFamily: T.font,
        transition: 'border-color 120ms, transform 80ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.c.p300; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.c.n200; }}
    >
      {typeof MatchScoreBadge !== 'undefined'
        ? <div style={{ flexShrink: 0 }}><MatchScoreBadge score={wine.match} size="md"/></div>
        : <FallbackBadgeHR score={wine.match}/>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 14, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.name}</div>
        <div style={{
          ...T.t.caption, color: T.c.n600, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.producer}{wine.year ? ` · ${wine.year}` : ''}</div>
        {item.reason && (
          <div style={{
            marginTop: 6, fontSize: 12, lineHeight: 1.4,
            color: T.c.n700,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{item.reason}</div>
        )}
      </div>
      <Icon name="chevron_right" size={20} color={T.c.n400} style={{ flexShrink: 0 }}/>
    </button>
  );
}

// ─── Filter pill with dropdown ───────────────────────────────
function FilterPill({ icon, label, value, options, open, onToggle, onPick, active }) {
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!wrapRef.current || wrapRef.current.contains(e.target)) return;
      onToggle();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onToggle]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 34, padding: '0 12px',
          background: active ? T.c.p700 : T.c.n0,
          color: active ? T.c.n0 : T.c.n800,
          border: `1px solid ${active ? T.c.p700 : T.c.n300}`,
          borderRadius: T.r.full,
          cursor: 'pointer',
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
          transition: 'background 120ms, color 120ms, border-color 120ms',
        }}
      >
        <Icon name={icon} size={14} color={active ? T.c.n0 : T.c.p700}/>
        {value ? <><span>{label}: </span><b style={{ fontWeight: 700 }}>{value}</b></> : label}
        <Icon
          name={open ? 'expand_less' : 'expand_more'}
          size={16}
          color={active ? T.c.n0 : T.c.n600}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)',
          left: 0, zIndex: 10,
          minWidth: 180,
          background: T.c.n0,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.md,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          {options.map((o, i) => {
            const selected = active === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => onPick(o.key)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '10px 14px',
                  background: selected ? T.c.p50 : 'transparent',
                  color: selected ? T.c.p900 : T.c.n800,
                  border: 'none', cursor: 'pointer',
                  fontFamily: T.font, fontSize: 13, fontWeight: selected ? 700 : 500,
                  borderBottom: i < options.length - 1 ? `1px solid ${T.c.n100}` : 'none',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 80ms',
                }}
                onMouseEnter={(e) => {
                  if (selected) return;
                  e.currentTarget.style.background = T.c.n50;
                }}
                onMouseLeave={(e) => {
                  if (selected) return;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon
                  name={selected ? 'check_circle' : 'circle'}
                  size={14}
                  color={selected ? T.c.p700 : T.c.n300}
                  fill={selected ? 1 : 0}
                />
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FallbackBadgeHR({ score }) {
  const tone = (typeof score === 'number' && score >= 75)
    ? T.c.s700
    : (score >= 50 ? T.c.a700 : T.c.n600);
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: tone, color: T.c.n0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif || "'Fraunces', Georgia, serif",
      fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>{score || '—'}%</div>
  );
}

function formatBRLhr(v) {
  if (typeof v !== 'number') return '—';
  return v.toFixed(2).replace('.', ',');
}

Object.assign(window, { HarmonizaResultados });


export { BestOptionCard, FallbackBadgeHR, FilterPill, HARMONIZA_PRICE_FILTERS, HARMONIZA_SOURCE_FILTERS, HARMONIZA_TYPE_FILTERS, HarmonizaResultados, OtherOptionCard, formatBRLhr, hasAnyFilter };
