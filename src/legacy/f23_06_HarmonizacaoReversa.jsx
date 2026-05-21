/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.06 · HarmonizacaoReversa — vinho → pratos sugeridos
//
// US-13-4-02 · acessado de "Harmonização sugerida" no card do vinho
//
//   <HarmonizacaoReversa
//     wine={{ name, producer, year, country, type, photoGradient }}
//     pairings={[                              // 3 sugestões
//       {
//         dish: 'Carne vermelha grelhada',
//         reason: 'Taninos firmes acompanham a gordura da carne.',
//         tags: ['Clássico'],                   // 'Clássico' | 'Ousado' | 'Local'
//         imageGradient: ['#722F37', '#0F0F0F'],
//         icon: 'outdoor_grill',
//       }, ...
//     ]}
//     onClose={() => ...}
//     onTapPairing={(pairing) => ...}
//   />
// ─────────────────────────────────────────────────────────────

const PAIRING_TAG_TONES = {
  'Clássico': { bg: '#F5E3E5', fg: '#722F37', border: '#C97D87' },
  'Ousado':   { bg: '#F5E9D4', fg: '#B8894A', border: '#D4A574' },
  'Local':    { bg: '#E8F5E9', fg: '#2E7D32', border: '#A5D6A7' },
};

function HarmonizacaoReversa({
  wine = {},
  pairings = [],
  onClose = () => {},
  onTapPairing = () => {},
}) {
  const grad = wine.photoGradient || ['#722F37', '#1a0a0c'];

  return (
    <div
      data-screen-label="23.06 HarmonizacaoReversa"
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
          onClick={onClose}
          aria-label="Fechar"
          style={{
            width: 44, height: 44, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="close" size={24} color={T.c.n950}/>
        </button>
        <h4 style={{
          margin: 0, flex: 1, fontSize: 17, fontWeight: 600,
          color: T.c.n950, letterSpacing: '-0.01em',
        }}>Harmonização</h4>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '16px 16px 28px',
      }}>
        {/* Wine hero card */}
        <section style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
          color: T.c.n0,
          borderRadius: T.r.lg,
          padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
          overflow: 'hidden',
          boxShadow: '0 6px 16px rgba(74,31,36,0.18)',
        }}>
          {/* Decorative orb */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: -40, right: -30,
            width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,165,116,0.30) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>

          {/* Mini bottle silhouette */}
          <div style={{
            position: 'relative',
            width: 44, height: 64, flexShrink: 0,
            borderRadius: 4,
            background: 'linear-gradient(165deg, rgba(245,233,212,0.18) 0%, rgba(245,233,212,0.06) 100%)',
            border: '1px solid rgba(245,233,212,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="wine_bar" size={22} color="rgba(255,255,255,0.92)" fill={1}/>
          </div>

          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{
              ...T.t.overline,
              color: 'rgba(255,255,255,0.78)',
              letterSpacing: 0.8,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{wine.producer || '—'}</div>
            <div style={{
              fontFamily: T.serif || "'Fraunces', Georgia, serif",
              fontSize: 17, fontWeight: 600,
              letterSpacing: '-0.015em', lineHeight: 1.2,
              color: T.c.n0, marginTop: 2,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{wine.name || 'Vinho'}</div>
            <div style={{
              ...T.t.caption,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {[wine.year, wine.country, wine.type].filter(Boolean).join(' · ')}
            </div>
          </div>
        </section>

        {/* Section heading */}
        <h2 style={{
          margin: '24px 0 14px',
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 24, fontWeight: 600,
          letterSpacing: '-0.02em', lineHeight: 1.15,
          color: T.c.n950, textWrap: 'balance',
        }}>Esse vinho combina com:</h2>

        {/* 3 pairing cards */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {pairings.map((p, i) => (
            <PairingCard
              key={p.dish || i}
              pairing={p}
              onTap={() => onTapPairing(p)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div style={{
          marginTop: 18,
          padding: '12px 14px',
          background: T.c.n0,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.md,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <Icon name="info" size={16} color={T.c.n600} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{
            flex: 1, minWidth: 0,
            fontSize: 12, lineHeight: 1.5,
            color: T.c.n700,
          }}>
            <b style={{ color: T.c.p700, fontWeight: 700 }}>Clássico</b> é a aposta segura,
            {' '}<b style={{ color: T.c.a700, fontWeight: 700 }}>Ousado</b> surpreende e
            {' '}<b style={{ color: T.c.s700, fontWeight: 700 }}>Local</b> traz comida brasileira.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pairing card ────────────────────────────────────────────
function PairingCard({ pairing, onTap }) {
  const grad = pairing.imageGradient || ['#A04A55', '#4A1F24'];
  const icon = pairing.icon || 'restaurant';
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: T.font,
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 120ms, transform 100ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.c.p300;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.c.n200;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Food image area */}
      <div style={{
        position: 'relative',
        height: 140,
        background: `linear-gradient(160deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
        overflow: 'hidden',
      }}>
        {/* Subtle texture */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, opacity: 0.14,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 16px)',
        }}/>
        {/* Big icon centered */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon
            name={icon}
            size={56}
            color="rgba(255,255,255,0.92)"
            fill={1}
          />
        </div>
        {/* Bottom shadow */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.20) 100%)',
        }}/>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 16,
          letterSpacing: '-0.005em', lineHeight: 1.25,
        }}>{pairing.dish}</div>

        {pairing.reason && (
          <p style={{
            margin: '6px 0 0',
            fontSize: 13, lineHeight: 1.5,
            color: T.c.n700,
            textWrap: 'pretty',
          }}>
            <b style={{ color: T.c.n950, fontWeight: 700 }}>Por que:</b> {pairing.reason}
          </p>
        )}

        {pairing.tags && pairing.tags.length > 0 && (
          <div style={{
            marginTop: 10,
            display: 'flex', flexWrap: 'wrap', gap: 6,
          }}>
            {pairing.tags.map(t => (
              <TagChip key={t} tag={t}/>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function TagChip({ tag }) {
  const tone = PAIRING_TAG_TONES[tag] || PAIRING_TAG_TONES['Clássico'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px',
      background: tone.bg,
      color: tone.fg,
      border: `1px solid ${tone.border}`,
      borderRadius: T.r.full,
      fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
    }}>
      {tag}
    </span>
  );
}

Object.assign(window, { HarmonizacaoReversa, PAIRING_TAG_TONES });


export { HarmonizacaoReversa, PAIRING_TAG_TONES, PairingCard, TagChip };
