/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.04 · HarmonizaPrato — user digita prato, recebe sugestões
//
// US-13-4-01 · ponto de entrada do fluxo "Harmoniza Pra Mim"
//
//   <HarmonizaPrato
//     onBack={() => ...}
//     onSubmit={(prato) => go('23.05', { prato })}
//     suggestions={DISH_AUTOCOMPLETE}   // opcional, default abaixo
//   />
//
// Comportamento: digita ou toca em chip pré-definido. CTA disabled
// se input vazio. Autocomplete filtra sugestões enquanto digita.
// ─────────────────────────────────────────────────────────────

const HARMONIZA_QUICK = [
  { label: 'Pizza',      icon: 'local_pizza' },
  { label: 'Sushi',      icon: 'set_meal' },
  { label: 'Churrasco',  icon: 'outdoor_grill' },
  { label: 'Massa',      icon: 'ramen_dining' },
  { label: 'Risoto',     icon: 'rice_bowl' },
  { label: 'Sobremesa',  icon: 'cake' },
];

const HARMONIZA_AUTOCOMPLETE = [
  'Picanha grelhada',
  'Picanha no sal grosso',
  'Pizza margherita',
  'Pizza calabresa',
  'Pizza de queijo',
  'Pizza quatro queijos',
  'Sushi de salmão',
  'Sashimi',
  'Sushi vegetariano',
  'Costela bovina',
  'Cordeiro assado',
  'Frango assado',
  'Frango ao curry',
  'Bacalhau à brás',
  'Bacalhau ao forno',
  'Camarão na moranga',
  'Lasanha à bolonhesa',
  'Spaghetti carbonara',
  'Massa ao sugo',
  'Massa ao pesto',
  'Risoto de funghi',
  'Risoto de camarão',
  'Risoto de queijos',
  'Feijoada',
  'Moqueca',
  'Estrogonofe',
  'Queijo brie',
  'Queijos curados',
  'Tábua de frios',
  'Chocolate amargo',
  'Sobremesa cremosa',
  'Brownie',
  'Sorvete',
  'Salada caesar',
  'Salada de folhas',
  'Hambúrguer artesanal',
  'Costela suína',
];

function HarmonizaPrato({
  onBack = () => {},
  onSubmit = () => {},
  suggestions = HARMONIZA_AUTOCOMPLETE,
  initialValue = '',
}) {
  const [value, setValue] = React.useState(initialValue);
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);

  const canSubmit = value.trim().length > 0;

  const filtered = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return suggestions
      .filter(s => s.toLowerCase().includes(q) && s.toLowerCase() !== q)
      .slice(0, 5);
  }, [value, suggestions]);

  const showAutocomplete = focused && filtered.length > 0;

  const handlePickChip = (label) => {
    setValue(label);
    if (inputRef.current) inputRef.current.focus();
  };

  const handlePickSuggestion = (s) => {
    setValue(s);
    setFocused(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(value.trim());
  };

  return (
    <div
      data-screen-label="23.04 HarmonizaPrato"
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
        }}>Harmoniza Pra Mim</h4>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 130,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Hero icon */}
        <div style={{
          paddingTop: 32,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: 96, height: 96, borderRadius: '50%',
            background: T.c.p50,
            border: `1px solid ${T.c.p100}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="restaurant" size={48} color={T.c.p700}/>
            <span aria-hidden="true" style={{
              position: 'absolute', inset: -12, borderRadius: '50%',
              background: `radial-gradient(circle, ${T.c.p100}66 0%, transparent 70%)`,
              zIndex: -1,
            }}/>
          </div>
        </div>

        {/* Title + body */}
        <div style={{
          padding: '24px 20px 0',
          textAlign: 'center',
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 28, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: T.c.n950, textWrap: 'balance',
          }}>O que vai comer?</h2>
          <p style={{
            margin: '12px auto 0', maxWidth: 320,
            fontSize: 14, lineHeight: 1.55,
            color: T.c.n700, textWrap: 'pretty',
          }}>Digite o prato e a gente sugere o vinho ideal pra acompanhar.</p>
        </div>

        {/* Input + autocomplete */}
        <div style={{ padding: '24px 16px 0', position: 'relative' }}>
          <div data-tour-anchor="harmoniza-input" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 14px',
            height: 52,
            background: T.c.n0,
            border: `1px solid ${focused ? T.c.p700 : T.c.n300}`,
            borderRadius: T.r.md,
            boxShadow: focused ? `0 0 0 3px ${T.c.p100}` : 'none',
            transition: 'border-color 120ms, box-shadow 120ms',
          }}>
            <Icon name="search" size={20} color={focused ? T.c.p700 : T.c.n600}/>
            <input
              ref={inputRef}
              type="text"
              value={value}
              placeholder="Ex: picanha grelhada"
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              style={{
                flex: 1, height: '100%', minWidth: 0,
                border: 'none', outline: 'none', background: 'transparent',
                fontFamily: T.font, fontSize: 16, color: T.c.n950,
                letterSpacing: '-0.005em',
              }}
            />
            {value && (
              <button
                type="button"
                onClick={() => { setValue(''); if (inputRef.current) inputRef.current.focus(); }}
                aria-label="Limpar"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 4, display: 'inline-flex',
                }}
              >
                <Icon name="close" size={18} color={T.c.n600}/>
              </button>
            )}
          </div>

          {showAutocomplete && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)',
              left: 16, right: 16, zIndex: 5,
              background: T.c.n0,
              border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.md,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}>
              {filtered.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handlePickSuggestion(s)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '12px 14px',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.c.n100}` : 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: T.font, fontSize: 14, color: T.c.n800,
                    transition: 'background 80ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = T.c.n50; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon name="north_west" size={14} color={T.c.n400}/>
                  <span dangerouslySetInnerHTML={{ __html: highlight(s, value) }}/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick chips grid */}
        <div style={{ padding: '24px 16px 0' }}>
          <div style={{
            ...T.t.overline, color: T.c.n600,
            marginBottom: 10,
          }}>Ou escolha rápido</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}>
            {HARMONIZA_QUICK.map(q => {
              const active = value.toLowerCase() === q.label.toLowerCase();
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handlePickChip(q.label)}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 6,
                    height: 80,
                    background: active ? T.c.p50 : T.c.n0,
                    border: `1px solid ${active ? T.c.p700 : T.c.n200}`,
                    borderRadius: T.r.md,
                    cursor: 'pointer',
                    boxShadow: active ? `0 0 0 3px ${T.c.p100}` : 'none',
                    fontFamily: T.font, fontSize: 13, fontWeight: 600,
                    color: active ? T.c.p900 : T.c.n950,
                    transition: 'border-color 120ms, background 120ms, box-shadow 120ms, transform 80ms',
                  }}
                  onMouseEnter={(e) => {
                    if (active) return;
                    e.currentTarget.style.borderColor = T.c.p300;
                  }}
                  onMouseLeave={(e) => {
                    if (active) return;
                    e.currentTarget.style.borderColor = T.c.n200;
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                  onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <Icon
                    name={q.icon}
                    size={26}
                    color={active ? T.c.p700 : T.c.p700}
                    fill={active ? 1 : 0}
                  />
                  {q.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n200}`,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.05)',
      }}>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{
            width: '100%', height: 52,
            background: canSubmit ? T.c.p700 : T.c.n200,
            color: canSubmit ? T.c.n0 : T.c.n400,
            border: 'none', borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 16, fontWeight: 700,
            letterSpacing: '-0.005em',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: canSubmit ? '0 4px 12px rgba(74,31,36,0.18)' : 'none',
            transition: 'background 120ms, transform 80ms',
          }}
          onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.background = T.c.p700; }}
          onMouseDown={(e)  => { if (canSubmit) e.currentTarget.style.transform = 'scale(0.99)'; }}
          onMouseUp={(e)    => { if (canSubmit) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Sugerir vinhos
          <Icon name="arrow_forward" size={18} color={canSubmit ? T.c.n0 : T.c.n400}/>
        </button>
      </div>
    </div>
  );
}

// ─── Highlight matched substring ─────────────────────────────
function highlight(text, q) {
  const safe = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const needle = q.trim().toLowerCase();
  if (!needle) return safe;
  const lower = safe.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx < 0) return safe;
  const before = safe.slice(0, idx);
  const match = safe.slice(idx, idx + needle.length);
  const after = safe.slice(idx + needle.length);
  return `${before}<b style="color: #4A1F24; font-weight: 700;">${match}</b>${after}`;
}

Object.assign(window, { HarmonizaPrato, HARMONIZA_QUICK, HARMONIZA_AUTOCOMPLETE });


export { HARMONIZA_AUTOCOMPLETE, HARMONIZA_QUICK, HarmonizaPrato, highlight };
