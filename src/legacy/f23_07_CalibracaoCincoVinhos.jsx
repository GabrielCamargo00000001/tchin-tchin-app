/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.07 · CalibracaoCincoVinhos — 5 vinhos pra calibrar paladar
//
// US-13-2-03 · aparece após Quiz de Paladar (Z.01-Z.07)
//
//   <CalibracaoCincoVinhos
//     selections={[                         // 5 vinhos pré-curados
//       { wine, style: 'Tinto encorpado', styleKey: 'tinto-encorpado',
//         priceRange: 'R$ 150–200', status: 'pending' },   // pending|tasted
//     ]}
//     onBack={() => ...}
//     onTapWine={(sel) => ...}              // → detalhes
//     onMarkTasted={(sel) => go('18.01', sel)}  // → registrar
//   />
// ─────────────────────────────────────────────────────────────

const CALIB_STYLE_TONES = {
  'tinto-encorpado': { bg: '#F5E3E5', fg: '#722F37', border: '#C97D87' },
  'tinto-medio':     { bg: '#F5E9D4', fg: '#722F37', border: '#D4A574' },
  'branco-seco':     { bg: '#E3F2FD', fg: '#1565C0', border: '#90CAF9' },
  'branco-encorpado':{ bg: '#FFF4E5', fg: '#B8894A', border: '#D4A574' },
  'espumante':       { bg: '#F2F2F2', fg: '#2A2A2A', border: '#D6D6D6' },
};

function CalibracaoCincoVinhos({
  selections = [],
  onBack = () => {},
  onTapWine = () => {},
  onMarkTasted = () => {},
}) {
  const tastedCount = selections.filter(s => s.status === 'tasted').length;
  const total = selections.length;
  const progressPct = total === 0 ? 0 : Math.round((tastedCount / total) * 100);

  return (
    <div
      data-screen-label="23.07 CalibracaoCincoVinhos"
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
        }}>Calibração</h4>
        <div style={{
          ...T.t.caption, color: T.c.p700,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.p50,
          borderRadius: T.r.full, marginRight: 12,
          letterSpacing: 0.3,
        }}>{tastedCount}/{total}</div>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 28,
      }}>
        {/* Hero */}
        <section style={{ padding: '24px 20px 0' }}>
          <h1 style={{
            margin: 0,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 28, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: T.c.n950, textWrap: 'balance',
          }}>5 vinhos pra <em style={{ fontStyle: 'italic', color: T.c.p700 }}>calibrar</em> seu paladar</h1>
          <p style={{
            margin: '12px 0 0',
            fontSize: 14, lineHeight: 1.55,
            color: T.c.n700, textWrap: 'pretty',
          }}>Escolhemos 5 estilos diferentes. Vá provando e avaliando — seu perfil fica cada vez mais preciso.</p>
        </section>

        {/* Educational note */}
        <section style={{ padding: '20px 16px 0' }}>
          <div style={{
            padding: '12px 14px',
            background: T.c.p50,
            border: `1px solid ${T.c.p100}`,
            borderRadius: T.r.md,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: T.r.sm,
              background: T.c.p100,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name="psychology" size={18} color={T.c.p700} fill={1}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, lineHeight: 1.5,
                color: T.c.n800,
              }}>A cada vinho avaliado, seu <b style={{ color: T.c.n950, fontWeight: 700 }}>DNA de paladar</b> ganha precisão.</div>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <section style={{ padding: '24px 20px 0' }}>
          <div style={{
            ...T.t.overline, color: T.c.n600,
            marginBottom: 4,
          }}>5 vinhos selecionados</div>
          <h2 style={{
            margin: 0,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 20, fontWeight: 600,
            letterSpacing: '-0.015em', lineHeight: 1.2,
            color: T.c.n950,
          }}>Cobertura completa do espectro</h2>
        </section>

        {/* Wine cards */}
        <section style={{ padding: '14px 16px 0' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {selections.map((sel, i) => (
              <CalibrationCard
                key={(sel.wine && sel.wine.id) || sel.styleKey || i}
                selection={sel}
                index={i + 1}
                onTap={() => onTapWine(sel)}
                onMarkTasted={() => onMarkTasted(sel)}
              />
            ))}
          </div>
        </section>

        {/* Progress section */}
        <section style={{
          margin: '24px 16px 0',
          padding: 16,
          background: T.c.n0,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.lg,
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{
              ...T.t.bodyB, fontSize: 14, color: T.c.n950,
            }}>Progresso: <b style={{ color: T.c.p700, fontWeight: 700 }}>{tastedCount}/{total}</b> provados</div>
            <div style={{
              fontFamily: T.mono, fontSize: 12, fontWeight: 600,
              color: T.c.p700, letterSpacing: 0.3,
            }}>{progressPct}%</div>
          </div>
          <div style={{
            height: 8, background: T.c.n100,
            borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPct}%`, height: '100%',
              background: `linear-gradient(90deg, ${T.c.p500} 0%, ${T.c.p700} 100%)`,
              transition: 'width 320ms ease-out',
            }}/>
          </div>
          <p style={{
            margin: '12px 0 0',
            fontSize: 13, lineHeight: 1.5,
            color: T.c.n700,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Icon
              name={tastedCount === total ? 'check_circle' : 'auto_awesome'}
              size={16}
              color={tastedCount === total ? T.c.s700 : T.c.a700}
              fill={1}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span>
              {tastedCount === total ? (
                <>Parabéns! Seu paladar agora está <b style={{ color: T.c.s700, fontWeight: 700 }}>~30% mais preciso</b>.</>
              ) : tastedCount > 0 ? (
                <>Faltam <b style={{ color: T.c.n950, fontWeight: 700 }}>{total - tastedCount}</b> vinhos. Após provar todos, seu paladar fica ~30% mais preciso.</>
              ) : (
                <>Após provar e avaliar todos os 5, seu paladar fica <b style={{ color: T.c.n950, fontWeight: 700 }}>~30% mais preciso</b>.</>
              )}
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

// ─── Calibration card ────────────────────────────────────────
function CalibrationCard({ selection, index, onTap, onMarkTasted }) {
  const { wine = {}, style, styleKey, priceRange, status } = selection;
  const tone = CALIB_STYLE_TONES[styleKey] || CALIB_STYLE_TONES['tinto-encorpado'];
  const isTasted = status === 'tasted';

  return (
    <div style={{
      position: 'relative',
      background: T.c.n0,
      border: `1px solid ${isTasted ? T.c.s100 : T.c.n200}`,
      borderRadius: T.r.lg,
      padding: 12,
      display: 'flex', alignItems: 'stretch', gap: 12,
      fontFamily: T.font,
      transition: 'border-color 120ms',
      boxShadow: isTasted ? '0 1px 3px rgba(46,125,50,0.06)' : 'none',
    }}>
      {/* Index numeral + bottle */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 18, fontWeight: 700,
          color: isTasted ? T.c.s700 : T.c.n400,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>{String(index).padStart(2, '0')}</span>
        <BottlePlaceholder width={44} height={62} showLabel={false}/>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Style chip */}
        {style && (
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            padding: '2px 8px',
            background: tone.bg,
            color: tone.fg,
            border: `1px solid ${tone.border}`,
            borderRadius: T.r.xs,
            fontSize: 9, fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>{style}</div>
        )}

        <button
          type="button"
          onClick={onTap}
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: T.font,
          }}
        >
          <div style={{
            ...T.t.bodyB, color: T.c.n950, fontSize: 14,
            lineHeight: 1.3, letterSpacing: '-0.005em',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{wine.name || 'Vinho'}</div>
          <div style={{
            ...T.t.caption, color: T.c.n600, marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{wine.producer}{priceRange ? ` · ${priceRange}` : ''}</div>
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          {isTasted ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 9px',
              background: T.c.s700, color: T.c.n0,
              borderRadius: T.r.full,
              fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
            }}>
              <Icon name="check_circle" size={12} color={T.c.n0} fill={1}/>
              Provado e avaliado
            </div>
          ) : (
            <button
              type="button"
              onClick={onMarkTasted}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none',
                padding: '4px 0', cursor: 'pointer',
                color: T.c.p700, fontFamily: T.font,
                fontSize: 13, fontWeight: 600,
                transition: 'color 120ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.c.p900; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.c.p700; }}
            >
              Marcar como provado
              <Icon name="arrow_forward" size={14} color="currentColor"/>
            </button>
          )}
        </div>
      </div>

      {/* Right status indicator */}
      <div style={{
        display: 'flex', alignItems: 'center',
        flexShrink: 0,
      }}>
        {isTasted ? (
          <Icon name="check_circle" size={20} color={T.c.s700} fill={1}/>
        ) : (
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            border: `2px solid ${T.c.n300}`,
          }}/>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { CalibracaoCincoVinhos, CALIB_STYLE_TONES });


export { CALIB_STYLE_TONES, CalibracaoCincoVinhos, CalibrationCard };
