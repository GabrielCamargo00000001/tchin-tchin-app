/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 23.01 · ModoRestaurante — captura de carta via foto
//
// US-13-1-01 · acionado pelo toggle "Carta" no Scanner (20.01)
//
//   <ModoRestaurante
//     onClose={() => ...}
//     onBackToLabel={() => ...}            // toggle volta pra rótulo
//     onProcess={(pages) => ...}           // [{ id, photoUrl }]
//     initialPages={[]}                    // pré-carregadas (resume)
//     initialState="idle"                  // 'idle' | 'processing'
//   />
//
// Captura até 3 páginas. Após 1ª foto, mostra strip de thumbnails +
// botão "Pronto, processar". OCR roda no host (callback onProcess).
// ─────────────────────────────────────────────────────────────

const MR_MAX_PAGES = 3;

if (typeof document !== 'undefined' && !document.getElementById('tc-mr-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-mr-kf';
  s.textContent = `
    @keyframes tcMrPulse { 0%,100% { opacity: 0.55 } 50% { opacity: 1 } }
    @keyframes tcMrFlash { 0% { opacity: 0 } 50% { opacity: 0.85 } 100% { opacity: 0 } }
    @keyframes tcMrSpin  { to { transform: rotate(360deg) } }
    @keyframes tcMrThumbIn { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  `;
  document.head.appendChild(s);
}

function ModoRestaurante({
  onClose = () => {},
  onBackToLabel = () => {},
  onProcess = () => {},
  initialPages = [],
  initialState = 'idle',
}) {
  const [pages, setPages] = React.useState(initialPages);
  const [state, setState] = React.useState(initialState);   // 'idle' | 'processing'
  const [flash, setFlash] = React.useState(false);
  const [flashing, setFlashing] = React.useState(false);    // visual flash blink
  const [progress, setProgress] = React.useState(0);

  const canAdd = pages.length < MR_MAX_PAGES;

  const handleCapture = () => {
    if (state !== 'idle' || !canAdd) return;
    // Simulate capture flash
    setFlashing(true);
    setTimeout(() => setFlashing(false), 220);
    const id = Date.now();
    setPages(p => [...p, { id, photoUrl: null }]);
  };

  const handleRemove = (id) => {
    setPages(p => p.filter(x => x.id !== id));
  };

  const handleProcess = () => {
    if (pages.length === 0) return;
    setState('processing');
    // simulate per-page OCR progress
    let i = 0;
    setProgress(0);
    const tick = setInterval(() => {
      i += 1;
      setProgress(i);
      if (i >= pages.length) {
        clearInterval(tick);
        setTimeout(() => onProcess(pages), 400);
      }
    }, 700);
  };

  return (
    <div
      data-screen-label="23.01 ModoRestaurante"
      style={{
        flex: 1, position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: T.c.n950,
        color: T.c.n0,
        fontFamily: T.font,
        overflow: 'hidden',
      }}
    >
      {/* Faux camera backdrop */}
      <MRViewfinder flash={flash}/>

      {/* Flash blink overlay (single-shot per capture) */}
      {flashing && (
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 5,
          background: '#FFFFFF',
          animation: 'tcMrFlash 220ms ease forwards',
          pointerEvents: 'none',
        }}/>
      )}

      {state === 'processing' ? (
        <MRProcessing total={pages.length} done={progress}/>
      ) : (
        <>
          {/* Top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
            padding: '14px 12px 18px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <MRIconBtn name="close" onClick={onClose} ariaLabel="Fechar"/>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <MRModeToggle onBackToLabel={onBackToLabel}/>
            </div>
            <MRIconBtn
              name="bolt"
              active={flash}
              fill={flash ? 1 : 0}
              onClick={() => setFlash(f => !f)}
              ariaLabel={flash ? 'Desligar flash' : 'Ligar flash'}
            />
          </div>

          {/* Page guide */}
          <MRPageGuide pagesCount={pages.length}/>

          {/* Captured thumbnails strip */}
          {pages.length > 0 && (
            <MRThumbnailStrip
              pages={pages}
              canAdd={canAdd}
              onRemove={handleRemove}
              onAdd={() => {/* tap area is implicit — capture button */}}
            />
          )}

          {/* Bottom bar */}
          <MRBottomBar
            pages={pages}
            canAdd={canAdd}
            onCapture={handleCapture}
            onProcess={handleProcess}
          />
        </>
      )}
    </div>
  );
}

// ─── Faux viewfinder (with menu-page silhouette) ─────────────
function MRViewfinder() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #161412 0%, #0d0a08 100%)',
      overflow: 'hidden',
    }}>
      {/* Warm spotlight */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: 'translate(-50%, -10%)',
        width: '120%', height: '70%',
        background: 'radial-gradient(ellipse at center, rgba(184,137,74,0.18) 0%, rgba(74,31,36,0.05) 50%, transparent 75%)',
      }}/>
      {/* Menu-page silhouette */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -52%) rotate(-1.5deg)',
        width: 220, height: 290,
        background: 'rgba(245,233,212,0.10)',
        border: '1px solid rgba(245,233,212,0.16)',
        borderRadius: 4,
        padding: 18,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Faux menu line items */}
        <div style={{ height: 14, width: '60%', background: 'rgba(245,233,212,0.18)', borderRadius: 2, margin: '0 auto 8px' }}/>
        {[12, 10, 11, 9, 12, 10, 11, 9, 10].map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, height: h, background: 'rgba(245,233,212,0.10)', borderRadius: 1 }}/>
            <div style={{ width: 28, height: h, background: 'rgba(245,233,212,0.10)', borderRadius: 1 }}/>
          </div>
        ))}
      </div>
      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
      }}/>
    </div>
  );
}

// ─── Mode toggle (Rótulo / Carta — Carta active) ─────────────
function MRModeToggle({ onBackToLabel }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        padding: 4, gap: 2,
        background: 'rgba(15,15,15,0.65)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: T.r.full,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <button
        role="tab" aria-selected="false" type="button"
        onClick={onBackToLabel}
        style={{
          height: 32, padding: '0 14px',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'transparent',
          color: 'rgba(255,255,255,0.85)',
          border: 'none', borderRadius: T.r.full, cursor: 'pointer',
          fontFamily: T.font, fontSize: 13, fontWeight: 700,
        }}
      >
        <Icon name="wine_bar" size={14} color="rgba(255,255,255,0.85)"/>
        Rótulo
      </button>
      <button
        role="tab" aria-selected="true" type="button"
        style={{
          height: 32, padding: '0 14px',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: T.c.n0, color: T.c.n950,
          border: 'none', borderRadius: T.r.full, cursor: 'default',
          fontFamily: T.font, fontSize: 13, fontWeight: 700,
        }}
      >
        <Icon name="menu_book" size={14} color={T.c.n950}/>
        Carta
      </button>
    </div>
  );
}

function MRIconBtn({ name, onClick, ariaLabel, active, fill = 0 }) {
  return (
    <button
      type="button" onClick={onClick} aria-label={ariaLabel}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: active ? T.c.a500 : 'rgba(15,15,15,0.60)',
        border: '1px solid rgba(255,255,255,0.12)',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      <Icon name={name} size={18} color={active ? T.c.n950 : T.c.n0} fill={fill} weight={600}/>
    </button>
  );
}

// ─── Page guide ──────────────────────────────────────────────
function MRPageGuide({ pagesCount }) {
  const w = 280;
  const h = 360;
  const counterLabel = pagesCount > 0
    ? `Página ${pagesCount + 1}${pagesCount + 1 > MR_MAX_PAGES ? '' : ` de até ${MR_MAX_PAGES}`}`
    : null;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{ position: 'relative', width: w, height: h }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          border: '2px solid rgba(255,255,255,0.65)',
          borderRadius: T.r.lg,
          animation: 'tcMrPulse 1500ms ease-in-out infinite',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.32)',
        }}/>
        <MRCorner pos="tl"/>
        <MRCorner pos="tr"/>
        <MRCorner pos="bl"/>
        <MRCorner pos="br"/>

        <div style={{
          position: 'absolute', top: 'calc(100% + 20px)',
          left: '50%', transform: 'translateX(-50%)',
          width: 280, textAlign: 'center',
          color: T.c.n0, fontFamily: T.font,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 600,
            letterSpacing: '-0.005em',
            textShadow: '0 1px 4px rgba(0,0,0,0.55)',
          }}>Enquadre a página da carta</div>
          {counterLabel && (
            <div style={{
              marginTop: 6,
              ...T.t.caption, fontWeight: 600,
              color: T.c.a500,
              letterSpacing: 0.3,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}>{counterLabel}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MRCorner({ pos }) {
  const side = 28;
  const thickness = 3;
  const radius = 8;
  const styles = {
    tl: { top: -2, left: -2, borderTop: `${thickness}px solid ${T.c.n0}`, borderLeft: `${thickness}px solid ${T.c.n0}`, borderTopLeftRadius: radius },
    tr: { top: -2, right: -2, borderTop: `${thickness}px solid ${T.c.n0}`, borderRight: `${thickness}px solid ${T.c.n0}`, borderTopRightRadius: radius },
    bl: { bottom: -2, left: -2, borderBottom: `${thickness}px solid ${T.c.n0}`, borderLeft: `${thickness}px solid ${T.c.n0}`, borderBottomLeftRadius: radius },
    br: { bottom: -2, right: -2, borderBottom: `${thickness}px solid ${T.c.n0}`, borderRight: `${thickness}px solid ${T.c.n0}`, borderBottomRightRadius: radius },
  };
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', width: side, height: side, ...styles[pos],
    }}/>
  );
}

// ─── Thumbnails strip ────────────────────────────────────────
function MRThumbnailStrip({ pages, canAdd, onRemove }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 120, zIndex: 10,
      padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      overflowX: 'auto', scrollbarWidth: 'none',
    }}>
      {pages.map((p, i) => (
        <MRThumb
          key={p.id}
          page={p}
          index={i + 1}
          onRemove={() => onRemove(p.id)}
        />
      ))}
      {canAdd && pages.length < MR_MAX_PAGES && (
        <div style={{
          flexShrink: 0,
          width: 60, height: 80, borderRadius: T.r.sm,
          background: 'rgba(255,255,255,0.10)',
          border: '1.5px dashed rgba(255,255,255,0.50)',
          color: 'rgba(255,255,255,0.78)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2,
          fontFamily: T.font, fontSize: 10, fontWeight: 600,
          letterSpacing: 0.3,
        }}>
          <Icon name="add" size={20} color="rgba(255,255,255,0.85)"/>
          Adicionar
        </div>
      )}
    </div>
  );
}

function MRThumb({ page, index, onRemove }) {
  return (
    <div style={{
      position: 'relative',
      flexShrink: 0,
      width: 60, height: 80, borderRadius: T.r.sm,
      background: page.photoUrl ? T.c.n200 : `linear-gradient(160deg, #2a2018 0%, #15100a 100%)`,
      overflow: 'hidden',
      border: '1.5px solid rgba(255,255,255,0.60)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.30)',
      animation: 'tcMrThumbIn 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
    }}>
      {page.photoUrl ? (
        <img src={page.photoUrl} alt={`Página ${index}`} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(245,233,212,0.50)',
        }}>
          <Icon name="description" size={24} color="rgba(245,233,212,0.65)"/>
        </div>
      )}
      <span style={{
        position: 'absolute', top: 3, left: 3,
        padding: '1px 6px',
        background: 'rgba(0,0,0,0.65)',
        color: T.c.n0,
        fontFamily: T.mono, fontSize: 9, fontWeight: 700,
        borderRadius: T.r.xs,
        letterSpacing: 0.3,
      }}>{index}</span>
      <button
        type="button" onClick={onRemove}
        aria-label={`Remover página ${index}`}
        style={{
          position: 'absolute', top: -6, right: -6,
          width: 20, height: 20, borderRadius: '50%',
          background: T.c.n0, border: 'none',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.30)',
        }}
      >
        <Icon name="close" size={12} color={T.c.n950} weight={700}/>
      </button>
    </div>
  );
}

// ─── Bottom bar ──────────────────────────────────────────────
function MRBottomBar({ pages, canAdd, onCapture, onProcess }) {
  const hasPages = pages.length > 0;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
      padding: '20px 20px 32px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.70) 60%, rgba(0,0,0,0.88) 100%)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Left spacer */}
      </div>

      {/* Center: capture button */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        flexShrink: 0,
      }}>
        <button
          type="button" onClick={onCapture} disabled={!canAdd}
          aria-label="Capturar página"
          data-tour-anchor="restaurante-capture"
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            border: '3px solid rgba(255,255,255,0.95)',
            padding: 6,
            cursor: canAdd ? 'pointer' : 'not-allowed',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            transition: 'transform 100ms',
            opacity: canAdd ? 1 : 0.5,
          }}
        >
          <span style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: T.c.n0, border: `2px solid ${T.c.p700}`,
          }}/>
        </button>
        <div style={{
          fontSize: 11, fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
          textShadow: '0 1px 4px rgba(0,0,0,0.55)',
        }}>{canAdd ? `${pages.length}/${MR_MAX_PAGES}` : `${MR_MAX_PAGES}/${MR_MAX_PAGES}`}</div>
      </div>

      {/* Right: Process CTA */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {hasPages ? (
          <button
            type="button" onClick={onProcess}
            style={{
              height: 44, padding: '0 16px',
              background: T.c.n0, color: T.c.p900,
              border: 'none', borderRadius: T.r.full,
              fontFamily: T.font, fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.30)',
              letterSpacing: '-0.005em',
              flexShrink: 0,
            }}
          >
            Pronto, processar
            <Icon name="arrow_forward" size={14} color={T.c.p900}/>
          </button>
        ) : (
          <div style={{
            ...T.t.caption,
            color: 'rgba(255,255,255,0.55)',
            fontStyle: 'italic',
            textAlign: 'right',
          }}>Capture a 1ª página</div>
        )}
      </div>
    </div>
  );
}

// ─── Processing state ────────────────────────────────────────
function MRProcessing({ total, done }) {
  const pct = Math.min(100, Math.round((done / Math.max(1, total)) * 100));
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        padding: 24,
      }}
    >
      <div style={{
        position: 'relative', width: 80, height: 80,
        marginBottom: 22,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.16)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: T.c.a500,
          borderRightColor: T.c.p500,
          animation: 'tcMrSpin 900ms linear infinite',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 18, fontWeight: 700, color: T.c.n0,
        }}>{pct}%</div>
      </div>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 22, fontWeight: 600,
        letterSpacing: '-0.02em',
        color: T.c.n0, textAlign: 'center',
      }}>Processando OCR…</div>
      <div style={{
        marginTop: 6,
        fontSize: 13, fontWeight: 500,
        color: 'rgba(255,255,255,0.78)',
        letterSpacing: 0.2,
      }}>{done} / {total} {total === 1 ? 'página' : 'páginas'}</div>
      <div style={{
        marginTop: 22,
        ...T.t.caption,
        color: 'rgba(255,255,255,0.55)', fontStyle: 'italic',
        maxWidth: 280, textAlign: 'center', lineHeight: 1.4,
      }}>Identificando vinhos da carta e calculando match com seu paladar.</div>
    </div>
  );
}

Object.assign(window, { ModoRestaurante });


export { MRBottomBar, MRCorner, MRIconBtn, MRModeToggle, MRPageGuide, MRProcessing, MRThumb, MRThumbnailStrip, MRViewfinder, MR_MAX_PAGES, ModoRestaurante };
