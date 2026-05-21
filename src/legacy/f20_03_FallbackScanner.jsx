/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 20.03 · FallbackScanner — scan que falhou, 3 caminhos pra seguir
//
// US-12-2-03 · aparece quando OCR/ML não bate o rótulo com a base
//
//   <FallbackScanner
//     capturedPhotoUrl="…"          // opcional — preview pequeno
//     onClose={() => ...}            // → volta pra 20.01
//     onRetry={() => ...}            // → 20.01 (nova captura)
//     onSearchManual={() => ...}     // → busca global escopada
//     onAddWine={() => ...}          // → form "adicionar vinho na base"
//   />
//
// Tom: errar é OK. Confiar nas alternativas (3 cards bem distintos).
// ─────────────────────────────────────────────────────────────

function FallbackScanner({
  capturedPhotoUrl,
  onClose = () => {},
  onRetry = () => {},
  onSearchManual = () => {},
  onAddWine = () => {},
}) {
  return (
    <div
      data-screen-label="20.03 FallbackScanner"
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: T.c.n50,
        fontFamily: T.font,
        color: T.c.n950,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center',
        padding: '8px 8px 8px 4px',
        background: T.c.n50,
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
      </header>

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '0 20px 24px',
      }}>
        {/* Hero */}
        <div style={{
          marginTop: 48,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
        }}>
          {/* Photo preview (if available) or search_off icon */}
          {capturedPhotoUrl ? (
            <div style={{
              position: 'relative',
              width: 96, height: 96,
              borderRadius: T.r.lg,
              overflow: 'hidden',
              background: T.c.n200,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 16,
            }}>
              <img
                src={capturedPhotoUrl}
                alt="Foto capturada"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                  filter: 'grayscale(0.4)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(15,15,15,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="search_off" size={36} color={T.c.n0}/>
              </div>
            </div>
          ) : (
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: T.c.n100,
              border: `1px solid ${T.c.n200}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Icon name="search_off" size={48} color={T.c.n400}/>
            </div>
          )}

          <h2 style={{
            margin: 0,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 24, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: T.c.n950, textWrap: 'balance',
            maxWidth: 300,
          }}>Não consegui identificar esse rótulo</h2>

          <p style={{
            margin: '12px 0 0', maxWidth: 320,
            fontSize: 14, lineHeight: 1.55,
            color: T.c.n700,
            textWrap: 'pretty',
          }}>Acontece — alguns rótulos são mais difíceis ou são raros na nossa base.</p>
        </div>

        {/* Section heading */}
        <div style={{
          marginTop: 32, marginBottom: 12,
          ...T.t.overline, color: T.c.n600,
        }}>O que você quer fazer?</div>

        {/* Action cards */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <FallbackOptionCard
            icon="camera_alt"
            title="Tentar de novo"
            description="Aproxime mais, melhore a luz e tenta outra captura."
            onClick={onRetry}
            tone="primary"
          />
          <FallbackOptionCard
            icon="search"
            title="Buscar manualmente"
            description="Digite o nome do produtor ou do vinho — temos mais de 50 mil cadastrados."
            onClick={onSearchManual}
          />
          <FallbackOptionCard
            icon="add_circle"
            title="Cadastrar esse vinho"
            description="Não está na base? Adicione você mesmo — ajuda a comunidade."
            onClick={onAddWine}
          />
        </div>

        {/* Helpful tip */}
        <div style={{
          marginTop: 28,
          padding: '14px 16px',
          background: T.c.a100,
          border: `1px solid ${T.c.a500}`,
          borderRadius: T.r.md,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <Icon name="lightbulb" size={18} color={T.c.a700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              ...T.t.caption, fontWeight: 700,
              color: T.c.p900, letterSpacing: 0.2,
              textTransform: 'uppercase',
            }}>Dica</div>
            <p style={{
              margin: '2px 0 0',
              fontStyle: 'italic',
              fontSize: 13, lineHeight: 1.5,
              color: T.c.n800,
            }}>Rótulos com mais luz funcionam melhor. Tente capturar de frente, sem reflexo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Option card ─────────────────────────────────────────────
function FallbackOptionCard({ icon, title, description, onClick, tone = 'default' }) {
  const isPrimary = tone === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: isPrimary ? T.c.p50 : T.c.n0,
        border: `1px solid ${isPrimary ? T.c.p100 : T.c.n200}`,
        borderRadius: T.r.lg,
        padding: 14,
        cursor: 'pointer',
        fontFamily: T.font,
        display: 'flex', alignItems: 'flex-start', gap: 14,
        transition: 'border-color 120ms, background 120ms, transform 80ms',
        boxShadow: isPrimary ? '0 2px 6px rgba(74,31,36,0.06)' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.c.p300;
        if (!isPrimary) e.currentTarget.style.background = T.c.n0;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isPrimary ? T.c.p100 : T.c.n200;
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.995)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: T.r.md,
        background: isPrimary ? T.c.p700 : T.c.n100,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={icon} size={22} color={isPrimary ? T.c.n0 : T.c.p700} fill={isPrimary ? 1 : 0}/>
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 15,
          letterSpacing: '-0.005em',
        }}>{title}</div>
        <p style={{
          margin: '4px 0 0',
          fontSize: 13, lineHeight: 1.45,
          color: T.c.n700,
        }}>{description}</p>
      </div>
      <Icon name="chevron_right" size={22} color={T.c.n400} style={{ alignSelf: 'center', flexShrink: 0 }}/>
    </button>
  );
}

Object.assign(window, { FallbackScanner });


export { FallbackOptionCard, FallbackScanner };
