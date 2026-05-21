/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Chip } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { StarsRating } from './f13_06_StarsRating.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 18.01 · RegistroRapido — full-screen modal, registro em 15s
//
// US-T2-001 · disparado de qualquer "+ Adicionar vinho"
//
//   <RegistroRapido
//     wines={MOCK_WINES}       // base pra autocomplete (opcional)
//     onClose={() => ...}
//     onSubmit={(payload) => ...}   // payload: { photo, wine, rating, note, place }
//     onModoCompleto={() => ...}    // vai pra 18.02
//     onManualAdd={(q) => ...}      // quando não acha no autocomplete
//   />
//
// Tempo médio meta: 15s do open ao submit.
// Autocomplete: debounced 300ms.
// CTA habilita quando há foto OU nome do vinho.
// ─────────────────────────────────────────────────────────────

const REGISTRO_PLACES = ['Casa', 'Restaurante', 'Confraria', 'Bar', 'Outro'];

function RegistroRapido({
  wines = (typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : []),
  onClose = () => {},
  onSubmit = () => {},
  onModoCompleto = () => {},
  onManualAdd = () => {},
  initialWineQuery = '',
  initialWineSel = null,
  initialRating = 0,
  initialNote = '',
  initialPlace = null,
  initialPhoto = null,
  initialAcOpen = false,
}) {
  const [photo, setPhoto] = React.useState(initialPhoto);       // object URL or null
  const [wineQuery, setWineQuery] = React.useState(initialWineQuery); // raw input text
  const [wineSel, setWineSel]   = React.useState(initialWineSel); // picked wine object or { name, manual: true }
  const [acOpen, setAcOpen]     = React.useState(initialAcOpen);
  const [debouncedQ, setDebouncedQ] = React.useState(initialWineQuery);
  const [rating, setRating]     = React.useState(initialRating);
  const [note, setNote]         = React.useState(initialNote);
  const [place, setPlace]       = React.useState(initialPlace);
  const fileInputRef = React.useRef(null);

  // Debounce autocomplete 300ms
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(wineQuery), 300);
    return () => clearTimeout(id);
  }, [wineQuery]);

  const results = React.useMemo(() => {
    const q = debouncedQ.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return wines
      .filter(w => {
        const t = (w.name + ' ' + w.producer + ' ' + w.country).toLowerCase();
        return t.includes(q);
      })
      .slice(0, 5);
  }, [debouncedQ, wines]);

  const canSubmit = !!photo || !!wineSel || wineQuery.trim().length > 0;
  const note140 = Math.max(0, 140 - note.length);

  const handlePhotoTap = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  const handleRemovePhoto = () => {
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePickWine = (w) => {
    setWineSel(w);
    setWineQuery(w.name);
    setAcOpen(false);
  };

  const handleManual = () => {
    const q = wineQuery.trim();
    if (!q) return;
    setWineSel({ name: q, manual: true });
    setAcOpen(false);
    onManualAdd(q);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      photo,
      wine: wineSel || (wineQuery.trim() ? { name: wineQuery.trim(), manual: true } : null),
      rating,
      note: note.trim() || null,
      place,
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      data-screen-label="18.01 RegistroRapido"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: T.c.n0,
        fontFamily: T.font,
        color: T.c.n950,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Top bar ────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '8px 8px 8px 4px',
        borderBottom: `1px solid ${T.c.n200}`,
        background: T.c.n0,
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
          margin: 0, ...T.t.h3, color: T.c.n950,
          flex: 1, fontSize: 17, fontWeight: 600,
        }}>Registrar vinho</h4>
        <div style={{
          ...T.t.caption, color: T.c.p700,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.p50,
          borderRadius: T.r.full, marginRight: 12,
          letterSpacing: 0.3,
        }}>~15s</div>
      </header>

      {/* ── Scrollable body ────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '24px 16px 140px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Foto */}
        <PhotoUpload
          photo={photo}
          onTap={handlePhotoTap}
          onRemove={handleRemovePhoto}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Nome do vinho */}
        <Field label="O que você bebeu?">
          <WineAutocomplete
            value={wineQuery}
            picked={wineSel}
            results={results}
            open={acOpen}
            onFocus={() => setAcOpen(true)}
            onChange={(v) => {
              setWineQuery(v);
              setWineSel(null);
              setAcOpen(true);
            }}
            onPick={handlePickWine}
            onManual={handleManual}
            onClear={() => {
              setWineQuery('');
              setWineSel(null);
              setAcOpen(false);
            }}
          />
        </Field>

        {/* Avaliação */}
        <Field label="Como foi?">
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', gap: 6,
          }}>
            <StarsRating
              mode="interactive"
              value={rating}
              onChange={setRating}
              showCaption={false}
            />
            <div style={{
              ...T.t.caption, color: rating === 0 ? T.c.n600 : T.c.n800,
              fontWeight: rating === 0 ? 400 : 600,
              transition: 'color 160ms',
              minHeight: 16,
            }}>
              {rating === 0 ? 'Toque pra avaliar' : RATING_PHRASES[rating]}
            </div>
          </div>
        </Field>

        {/* Pensamento curto */}
        <Field
          label="Um pensamento curto"
          optional
          trailing={(
            <span style={{
              ...T.t.caption, color: note140 < 20 ? T.c.w700 : T.c.n600,
              fontFamily: T.mono, fontWeight: 500,
            }}>{note.length}/140</span>
          )}
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 140))}
            placeholder="Frutado, lembra meu jantar da semana passada…"
            rows={3}
            maxLength={140}
            style={{
              width: '100%', padding: 12,
              border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
              background: T.c.n0, fontFamily: T.font,
              fontSize: 14, lineHeight: 1.45, color: T.c.n950,
              resize: 'none', outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 120ms, box-shadow 120ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = T.c.p700;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${T.c.p100}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = T.c.n300;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </Field>

        {/* Contexto */}
        <Field label="Onde foi?" optional>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {REGISTRO_PLACES.map(opt => (
              <Chip
                key={opt}
                size="md"
                selected={place === opt}
                onClick={() => setPlace(place === opt ? null : opt)}
              >{opt}</Chip>
            ))}
          </div>
        </Field>
      </div>

      {/* ── Fixed bottom CTA ───────────────────── */}
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
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            transition: 'background 120ms, transform 80ms',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.background = T.c.p700; }}
          onMouseDown={(e)  => { if (canSubmit) e.currentTarget.style.transform = 'scale(0.99)'; }}
          onMouseUp={(e)    => { if (canSubmit) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Registrar
          <span style={{ fontSize: 16 }} aria-hidden="true">🍷</span>
        </button>
        <div style={{
          display: 'flex', justifyContent: 'center', marginTop: 4,
        }}>
          <button
            type="button"
            onClick={onModoCompleto}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 12px', display: 'inline-flex',
              alignItems: 'center', gap: 6,
              color: T.c.p700, fontFamily: T.font,
              fontSize: 13, fontWeight: 600,
            }}
          >
            Modo completo
            <Icon name="arrow_forward" size={14} color={T.c.p700}/>
          </button>
        </div>
      </div>
    </div>
  );
}

const RATING_PHRASES = ['Toque pra avaliar', 'Fraco', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

// ─── Photo upload zone ────────────────────────────────────────
function PhotoUpload({ photo, onTap, onRemove }) {
  const W = '100%';
  const H = 200;
  if (photo) {
    return (
      <div style={{
        position: 'relative',
        width: W, height: H,
        borderRadius: T.r.lg,
        overflow: 'hidden',
        background: T.c.n100,
        boxShadow: T.el[2],
      }}>
        <img
          src={photo}
          alt="Foto do vinho"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
        {/* Bottom overlay with edit/remove */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          display: 'flex', gap: 6,
        }}>
          <PhotoActionBtn icon="edit" label="Trocar" onClick={onTap}/>
          <PhotoActionBtn icon="delete" label="Remover" onClick={onRemove} danger/>
        </div>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label="Adicionar foto do vinho"
      style={{
        width: W, height: H,
        borderRadius: T.r.lg,
        background: T.c.n100,
        border: `2px dashed ${T.c.n300}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: 16,
        fontFamily: T.font,
        transition: 'background 120ms, border-color 120ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = T.c.p50;
        e.currentTarget.style.borderColor = T.c.p300;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = T.c.n100;
        e.currentTarget.style.borderColor = T.c.n300;
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: T.c.n0, border: `1px solid ${T.c.n200}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="add_a_photo" size={28} color={T.c.p700}/>
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: T.c.n950,
      }}>Toque pra foto</div>
      <div style={{
        ...T.t.caption, color: T.c.n600,
      }}>Câmera ou galeria · opcional</div>
    </button>
  );
}

function PhotoActionBtn({ icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={label}
      style={{
        height: 32, padding: '0 10px',
        background: danger ? 'rgba(198,40,40,0.92)' : 'rgba(15,15,15,0.78)',
        color: T.c.n0,
        border: 'none', borderRadius: T.r.full,
        fontFamily: T.font, fontSize: 12, fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <Icon name={icon} size={14} color={T.c.n0}/>
      {label}
    </button>
  );
}

// ─── Wine autocomplete ────────────────────────────────────────
function WineAutocomplete({
  value, picked, results, open,
  onFocus, onChange, onPick, onManual, onClear,
}) {
  const hasQuery = value.trim().length > 0;
  const showDropdown = open && hasQuery;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px',
        height: 48,
        background: T.c.n0,
        border: `1px solid ${picked ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.md,
        boxShadow: picked ? `0 0 0 3px ${T.c.p100}` : 'none',
        transition: 'border-color 120ms, box-shadow 120ms',
      }}>
        <Icon
          name={picked ? 'check_circle' : 'search'}
          size={20}
          color={picked ? T.c.s700 : T.c.n600}
          fill={picked ? 1 : 0}
        />
        <input
          type="text"
          value={value}
          placeholder="Comece a digitar…"
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          style={{
            flex: 1, height: '100%',
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font, fontSize: 15, color: T.c.n950,
            minWidth: 0,
          }}
        />
        {hasQuery && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="close" size={18} color={T.c.n600}/>
          </button>
        )}
      </div>

      {/* Selected wine summary chip */}
      {picked && !picked.manual && (
        <div style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px',
          background: T.c.p50,
          border: `1px solid ${T.c.p100}`,
          borderRadius: T.r.sm,
        }}>
          <BottlePlaceholder width={32} height={44} label="" showLabel={false}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              ...T.t.bodyB, color: T.c.n950, fontSize: 13,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{picked.name}</div>
            <div style={{
              ...T.t.caption, color: T.c.n600,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{[picked.producer, picked.country].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
      )}
      {picked && picked.manual && (
        <div style={{
          marginTop: 8,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px',
          background: T.c.a100,
          border: `1px solid ${T.c.a500}`,
          borderRadius: T.r.full,
          ...T.t.caption, color: T.c.p900, fontWeight: 600,
        }}>
          <Icon name="edit" size={12} color={T.c.p900}/>
          Cadastro manual
        </div>
      )}

      {/* Autocomplete dropdown */}
      {showDropdown && !picked && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)',
          left: 0, right: 0, zIndex: 5,
          background: T.c.n0,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.md,
          boxShadow: T.el[4],
          overflow: 'hidden',
          maxHeight: 280, overflowY: 'auto',
        }}>
          {results.length === 0 ? (
            <div style={{
              padding: 16,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ ...T.t.body, color: T.c.n600 }}>
                Nenhum vinho encontrado para “<b style={{ color: T.c.n950 }}>{value}</b>”.
              </div>
              <button
                type="button"
                onClick={onManual}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 12px',
                  background: T.c.p50, color: T.c.p700,
                  border: `1px solid ${T.c.p100}`,
                  borderRadius: T.r.sm,
                  fontFamily: T.font, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                <Icon name="add" size={16} color={T.c.p700}/>
                Adicionar “{value.length > 24 ? value.slice(0, 22) + '…' : value}” manualmente
              </button>
            </div>
          ) : (
            <>
              {results.map((w, i) => (
                <button
                  key={w.id || i}
                  type="button"
                  onClick={() => onPick(w)}
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', gap: 10, padding: '10px 12px',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', borderBottom: i < results.length - 1 ? `1px solid ${T.c.n100}` : 'none',
                    transition: 'background 80ms',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = T.c.n50; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <BottlePlaceholder width={28} height={40} label="" showLabel={false}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      ...T.t.bodyB, color: T.c.n950, fontSize: 13,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{w.name}</div>
                    <div style={{
                      ...T.t.caption, color: T.c.n600,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{w.producer} · {w.country}</div>
                  </div>
                  <Icon name="chevron_right" size={18} color={T.c.n400}/>
                </button>
              ))}
              <button
                type="button"
                onClick={onManual}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px',
                  background: T.c.p50, border: 'none', cursor: 'pointer',
                  fontFamily: T.font, fontSize: 13, fontWeight: 600,
                  color: T.c.p700,
                  borderTop: `1px solid ${T.c.n200}`,
                }}
              >
                <Icon name="add" size={16} color={T.c.p700}/>
                Não está aqui — adicionar manualmente
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────
function Field({ label, optional, trailing, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 6,
        marginBottom: 8,
      }}>
        <label style={{
          ...T.t.label, color: T.c.n800,
          fontSize: 13, fontWeight: 600,
        }}>{label}</label>
        {optional && (
          <span style={{
            ...T.t.caption, color: T.c.n400,
            fontWeight: 400,
          }}>(opcional)</span>
        )}
        <div style={{ flex: 1 }}/>
        {trailing}
      </div>
      {children}
    </div>
  );
}

Object.assign(window, {
  RegistroRapido, REGISTRO_PLACES,
  PhotoUpload, PhotoActionBtn,
  WineAutocomplete, Field,
});


export { Field, PhotoActionBtn, PhotoUpload, RATING_PHRASES, REGISTRO_PLACES, RegistroRapido, WineAutocomplete };
