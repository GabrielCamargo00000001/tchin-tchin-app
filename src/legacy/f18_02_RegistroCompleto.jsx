/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Chip } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { StarsRating } from './f13_06_StarsRating.jsx';
import { Field, PhotoUpload, WineAutocomplete } from './f18_01_RegistroRapido.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 18.02 · RegistroCompleto — full-screen modal, versão detalhista
//
//   <RegistroCompleto
//     wines={MOCK_WINES}
//     onClose={() => ...}
//     onSubmit={(payload) => ...}
//     onSaveDraft={(payload) => ...}
//   />
//
// Tudo opcional exceto o nome. Reusa PhotoUpload / WineAutocomplete /
// Field do 18.01 — exporta tudo via window.
// ─────────────────────────────────────────────────────────────

const SENSORIAL_AXES = [
  { key: 'acidez',  label: 'Acidez',  low: 'Baixa',     high: 'Alta'     },
  { key: 'tanino',  label: 'Tanino',  low: 'Suave',     high: 'Firme'    },
  { key: 'corpo',   label: 'Corpo',   low: 'Leve',      high: 'Encorpado'},
  { key: 'frutado', label: 'Frutado', low: 'Sutil',     high: 'Explosivo'},
  { key: 'docura',  label: 'Doçura',  low: 'Seco',      high: 'Doce'     },
];

const COMPLETO_PLACES = ['Casa', 'Restaurante', 'Confraria', 'Bar', 'Outro'];
const COMPLETO_COMPANY = ['Sozinho', 'Família', 'Amigos', 'Cliente', 'Parceiro(a)', 'Confraria', 'Equipe'];

const COMPLETO_COUNTRIES = [
  'Argentina', 'Brasil', 'Chile', 'França', 'Portugal', 'Itália',
  'Espanha', 'Uruguai', 'Estados Unidos', 'Nova Zelândia', 'África do Sul',
  'Austrália', 'Alemanha', 'Áustria', 'Outro',
];

const COMPLETO_UVAS = [
  'Malbec', 'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah',
  'Tempranillo', 'Sangiovese', 'Nebbiolo', 'Touriga Nacional',
  'Carmenère', 'Tannat', 'Chardonnay', 'Sauvignon Blanc', 'Riesling',
  'Pinot Grigio', 'Albariño', 'Verdejo', 'Garganega', 'Vinho Verde',
];

const COMPLETO_REGIOES = [
  'Mendoza', 'Uco Valley', 'Vale dos Vinhedos', 'Maipo', 'Colchagua',
  'Casablanca', 'Bordeaux', 'Borgonha', 'Champagne', 'Rhône',
  'Douro', 'Alentejo', 'Dão', 'Vinho Verde', 'Rioja',
  'Ribera del Duero', 'Toscana', 'Piemonte', 'Marlborough', 'Napa Valley',
];

const CURRENT_YEAR = new Date().getFullYear();
const COMPLETO_YEARS = (() => {
  const out = [];
  for (let y = CURRENT_YEAR; y >= 1980; y--) out.push(y);
  return out;
})();

function RegistroCompleto({
  wines = (typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : []),
  onClose = () => {},
  onSubmit = () => {},
  onSaveDraft = () => {},
  // Demo seed props
  initialState,
}) {
  const seed = initialState || {};
  const [photo, setPhoto] = React.useState(seed.photo || null);

  // O vinho
  const [name, setName]         = React.useState(seed.name || '');
  const [nameSel, setNameSel]   = React.useState(seed.nameSel || null);
  const [nameAc, setNameAc]     = React.useState(false);
  const [debouncedName, setDebouncedName] = React.useState(seed.name || '');
  const [producer, setProducer] = React.useState(seed.producer || '');
  const [year, setYear]         = React.useState(seed.year || '');
  const [uva, setUva]           = React.useState(seed.uva || '');
  const [regiao, setRegiao]     = React.useState(seed.regiao || '');
  const [pais, setPais]         = React.useState(seed.pais || '');

  // Avaliação
  const [rating, setRating] = React.useState(seed.rating || 0);
  const [sensorial, setSensorial] = React.useState(seed.sensorial || {
    acidez: 3, tanino: 3, corpo: 3, frutado: 3, docura: 2,
  });

  // Notas
  const [notas, setNotas] = React.useState(seed.notas || '');

  // Contexto
  const [place, setPlace]     = React.useState(seed.place || null);
  const [company, setCompany] = React.useState(seed.company || []);
  const [price, setPrice]     = React.useState(seed.price || '');
  const [venueName, setVenueName] = React.useState(seed.venueName || '');

  const fileInputRef = React.useRef(null);

  // Wine name debounced autocomplete
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedName(name), 300);
    return () => clearTimeout(id);
  }, [name]);

  const nameResults = React.useMemo(() => {
    const q = debouncedName.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return wines.filter(w => {
      const t = (w.name + ' ' + w.producer + ' ' + w.country).toLowerCase();
      return t.includes(q);
    }).slice(0, 5);
  }, [debouncedName, wines]);

  const setSenso = (key, val) => setSensorial(s => ({ ...s, [key]: val }));
  const toggleCompany = (opt) => setCompany(c => c.includes(opt) ? c.filter(x => x !== opt) : [...c, opt]);

  const showVenueField = place === 'Restaurante' || place === 'Bar';
  const canSubmit = (nameSel || name.trim().length > 0);

  const handlePhotoTap = () => { if (fileInputRef.current) fileInputRef.current.click(); };
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

  const handlePickName = (w) => {
    setNameSel(w);
    setName(w.name);
    setProducer(p => p || w.producer || '');
    setPais(c => c || w.country || '');
    setRegiao(r => r || w.region || '');
    setNameAc(false);
  };

  const handleManualName = () => {
    const q = name.trim();
    if (!q) return;
    setNameSel({ name: q, manual: true });
    setNameAc(false);
  };

  const buildPayload = () => ({
    photo,
    wine: {
      name: name.trim(),
      producer: producer.trim() || null,
      year: year || null,
      uva: uva.trim() || null,
      region: regiao.trim() || null,
      country: pais || null,
      manual: !!(nameSel && nameSel.manual),
      id: nameSel && !nameSel.manual ? nameSel.id : null,
    },
    rating,
    sensorial,
    notas: notas.trim() || null,
    context: {
      place,
      company,
      price: price ? parseFloat(price.replace(',', '.')) : null,
      venueName: showVenueField ? (venueName.trim() || null) : null,
    },
    submittedAt: new Date().toISOString(),
  });

  return (
    <div
      data-screen-label="18.02 RegistroCompleto"
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
        <div style={{
          flex: 1, display: 'flex', alignItems: 'baseline', gap: 8,
          minWidth: 0,
        }}>
          <h4 style={{
            margin: 0, fontSize: 17, fontWeight: 600,
            color: T.c.n950, letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}>Registrar (completo)</h4>
          <span style={{
            ...T.t.caption, color: T.c.n600,
            fontWeight: 400,
            whiteSpace: 'nowrap',
          }}>(opcional)</span>
        </div>
        <div style={{
          ...T.t.caption, color: T.c.a700,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.a100,
          borderRadius: T.r.full, marginRight: 12,
          letterSpacing: 0.3,
        }}>~3min</div>
      </header>

      {/* ── Scrollable body ────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '20px 16px 140px',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        {/* Foto */}
        <Section eyebrow="01" title="Foto" subtitle="Bate uma foto do rótulo ou aproveita uma da galeria.">
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
        </Section>

        {/* O vinho */}
        <Section eyebrow="02" title="O vinho">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Nome">
              <WineAutocomplete
                value={name}
                picked={nameSel}
                results={nameResults}
                open={nameAc}
                onFocus={() => setNameAc(true)}
                onChange={(v) => {
                  setName(v);
                  setNameSel(null);
                  setNameAc(true);
                }}
                onPick={handlePickName}
                onManual={handleManualName}
                onClear={() => { setName(''); setNameSel(null); setNameAc(false); }}
              />
            </Field>

            <Field label="Produtor">
              <TextInput
                value={producer}
                onChange={setProducer}
                placeholder="Ex.: Bodega Catena Zapata"
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Safra">
                <Select value={year} onChange={setYear} placeholder="Ano">
                  {COMPLETO_YEARS.map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </Select>
              </Field>
              <Field label="País">
                <Select value={pais} onChange={setPais} placeholder="Selecionar">
                  {COMPLETO_COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Uva">
              <DatalistInput
                value={uva}
                onChange={setUva}
                placeholder="Ex.: Malbec"
                listId="completo-uvas"
                options={COMPLETO_UVAS}
              />
            </Field>

            <Field label="Região">
              <DatalistInput
                value={regiao}
                onChange={setRegiao}
                placeholder="Ex.: Mendoza"
                listId="completo-regioes"
                options={COMPLETO_REGIOES}
              />
            </Field>
          </div>
        </Section>

        {/* Avaliação */}
        <Section eyebrow="03" title="Avaliação">
          <Field label="Nota geral">
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', gap: 6,
            }}>
              <StarsRating
                mode="interactive"
                value={rating}
                onChange={setRating}
                allowHalf
                showCaption={false}
              />
              <div style={{
                ...T.t.caption,
                color: rating === 0 ? T.c.n600 : T.c.n800,
                fontWeight: rating === 0 ? 400 : 600,
              }}>
                {rating === 0 ? 'Toque pra avaliar' : `${rating.toString().replace('.', ',')} / 5`}
              </div>
            </div>
          </Field>

          <div style={{
            marginTop: 20,
            display: 'flex', flexDirection: 'column', gap: 14,
            padding: 16,
            background: T.c.n50,
            borderRadius: T.r.md,
            border: `1px solid ${T.c.n200}`,
          }}>
            <div style={{
              ...T.t.overline, color: T.c.n600,
            }}>Perfil sensorial</div>
            {SENSORIAL_AXES.map(axis => (
              <SensorialSlider
                key={axis.key}
                label={axis.label}
                low={axis.low}
                high={axis.high}
                value={sensorial[axis.key]}
                onChange={(v) => setSenso(axis.key, v)}
              />
            ))}
          </div>
        </Section>

        {/* Notas de degustação */}
        <Section eyebrow="04" title="Notas de degustação" subtitle="Escreve o que vier. Esse campo é seu — ninguém mais vê.">
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder={
              'Que aromas senti?\n' +
              'Como foi no paladar?\n' +
              'Combinou com a comida?\n' +
              'Lembrou alguma coisa?\n' +
              'Eu pagaria de novo?'
            }
            rows={8}
            style={{
              width: '100%', padding: 14,
              border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
              background: T.c.n0, fontFamily: T.font,
              fontSize: 14, lineHeight: 1.55, color: T.c.n950,
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              minHeight: 180,
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
          <div style={{
            ...T.t.caption, color: T.c.n600,
            marginTop: 6, fontFamily: T.mono,
            letterSpacing: 0.3,
          }}>{notas.length} {notas.length === 1 ? 'caractere' : 'caracteres'}</div>
        </Section>

        {/* Contexto */}
        <Section eyebrow="05" title="Contexto">
          <Field label="Onde foi?" optional>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}>
              {COMPLETO_PLACES.map(opt => (
                <RadioCard
                  key={opt}
                  selected={place === opt}
                  onClick={() => setPlace(place === opt ? null : opt)}
                  label={opt}
                  icon={placeIcon(opt)}
                />
              ))}
            </div>
          </Field>

          {showVenueField && (
            <Field label={`Nome do ${place.toLowerCase()}`} optional>
              <TextInput
                value={venueName}
                onChange={setVenueName}
                placeholder={place === 'Restaurante' ? 'Ex.: Olympe' : 'Ex.: Bar do Vinho'}
                icon="place"
              />
            </Field>
          )}

          <Field label="Com quem?" optional>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COMPLETO_COMPANY.map(opt => (
                <Chip
                  key={opt}
                  size="md"
                  selected={company.includes(opt)}
                  onClick={() => toggleCompany(opt)}
                >{opt}</Chip>
              ))}
            </div>
          </Field>

          <Field label="Quanto pagou?" optional>
            <TextInput
              value={price}
              onChange={(v) => setPrice(v.replace(/[^0-9,.]/g, ''))}
              placeholder="0,00"
              leadingText="R$"
              inputMode="decimal"
            />
          </Field>
        </Section>
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
          onClick={() => canSubmit && onSubmit(buildPayload())}
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
            onClick={() => onSaveDraft(buildPayload())}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 12px', display: 'inline-flex',
              alignItems: 'center', gap: 6,
              color: T.c.n600, fontFamily: T.font,
              fontSize: 13, fontWeight: 600,
            }}
          >
            <Icon name="save" size={14} color={T.c.n600}/>
            Salvar rascunho
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────
function Section({ eyebrow, title, subtitle, children }) {
  return (
    <section>
      <header style={{ marginBottom: 14 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {eyebrow && (
            <span style={{
              fontFamily: T.mono, fontSize: 10, fontWeight: 600,
              color: T.c.p700, letterSpacing: 1.5,
              padding: '2px 6px',
              background: T.c.p50,
              borderRadius: T.r.xs,
            }}>{eyebrow}</span>
          )}
          <h3 style={{
            margin: 0, fontSize: 16, fontWeight: 700,
            color: T.c.n950, letterSpacing: '-0.01em',
          }}>{title}</h3>
          <div style={{ flex: 1, height: 1, background: T.c.n200, marginLeft: 4 }}/>
        </div>
        {subtitle && (
          <p style={{
            ...T.t.caption, color: T.c.n600,
            margin: '6px 0 0',
          }}>{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}

// ─── Text input with optional leading text/icon ──────────────
function TextInput({ value, onChange, placeholder, leadingText, icon, inputMode, type = 'text' }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px',
      height: 44,
      background: T.c.n0,
      border: `1px solid ${focus ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md,
      boxShadow: focus ? `0 0 0 3px ${T.c.p100}` : 'none',
      transition: 'border-color 120ms, box-shadow 120ms',
    }}>
      {leadingText && (
        <span style={{
          ...T.t.body, color: T.c.n600, fontWeight: 600,
        }}>{leadingText}</span>
      )}
      {icon && (
        <Icon name={icon} size={18} color={T.c.n600}/>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        inputMode={inputMode}
        style={{
          flex: 1, height: '100%', minWidth: 0,
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950,
        }}
      />
    </div>
  );
}

// ─── Datalist input (free text + suggestions) ─────────────────
function DatalistInput({ value, onChange, placeholder, listId, options }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px',
      height: 44,
      background: T.c.n0,
      border: `1px solid ${focus ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md,
      boxShadow: focus ? `0 0 0 3px ${T.c.p100}` : 'none',
      transition: 'border-color 120ms, box-shadow 120ms',
    }}>
      <input
        type="text"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        style={{
          flex: 1, height: '100%', minWidth: 0,
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950,
        }}
      />
      <datalist id={listId}>
        {options.map(o => <option key={o} value={o}/>)}
      </datalist>
      <Icon name="expand_more" size={20} color={T.c.n400}/>
    </div>
  );
}

// ─── Select (native, brand-styled) ────────────────────────────
function Select({ value, onChange, placeholder, children }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center',
      height: 44,
      background: T.c.n0,
      border: `1px solid ${focus ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md,
      boxShadow: focus ? `0 0 0 3px ${T.c.p100}` : 'none',
      transition: 'border-color 120ms, box-shadow 120ms',
    }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1, height: '100%', padding: '0 36px 0 12px',
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: value ? T.c.n950 : T.c.n600,
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <Icon
        name="expand_more"
        size={20}
        color={T.c.n600}
        style={{ position: 'absolute', right: 10, pointerEvents: 'none' }}
      />
    </div>
  );
}

// ─── Sensorial slider (1–5 with end labels) ───────────────────
// Inject thumb styles once
if (typeof document !== 'undefined' && !document.getElementById('tc-senso-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-senso-kf';
  s.textContent = `
    .tc-senso { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: transparent; outline: none; }
    .tc-senso::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: #E5E5E5; }
    .tc-senso::-moz-range-track { height: 6px; border-radius: 3px; background: #E5E5E5; }
    .tc-senso::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #722F37; border: 3px solid #FFFFFF; box-shadow: 0 1px 4px rgba(0,0,0,0.18); margin-top: -8px; cursor: pointer; transition: transform 120ms; }
    .tc-senso::-webkit-slider-thumb:hover { transform: scale(1.12); }
    .tc-senso::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #722F37; border: 3px solid #FFFFFF; box-shadow: 0 1px 4px rgba(0,0,0,0.18); cursor: pointer; }
    .tc-senso:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(114,47,55,0.25), 0 1px 4px rgba(0,0,0,0.18); }
  `;
  document.head.appendChild(s);
}

function SensorialSlider({ label, low, high, value, onChange }) {
  const pct = ((value - 1) / 4) * 100;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        marginBottom: 6,
      }}>
        <div style={{
          ...T.t.bodyB, fontSize: 13,
          color: T.c.n950,
        }}>{label}</div>
        <div style={{ flex: 1 }}/>
        <div style={{
          fontFamily: T.mono, fontSize: 11, fontWeight: 600,
          color: T.c.p700, letterSpacing: 0.3,
          padding: '2px 8px',
          background: T.c.p50,
          borderRadius: T.r.xs,
        }}>{value} / 5</div>
      </div>
      <div style={{ position: 'relative', padding: '6px 0' }}>
        {/* Filled track */}
        <div style={{
          position: 'absolute', top: 'calc(50% - 3px)', left: 0,
          width: `${pct}%`, height: 6, borderRadius: 3,
          background: T.c.p700,
          pointerEvents: 'none',
          transition: 'width 120ms',
        }}/>
        {/* Step ticks */}
        <div style={{
          position: 'absolute', top: 'calc(50% - 1px)', left: 0, right: 0,
          height: 2, display: 'flex', justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              style={{
                width: 2, height: 2, borderRadius: '50%',
                background: i <= (value - 1) ? 'rgba(255,255,255,0.55)' : T.c.n400,
              }}
            />
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="tc-senso"
          style={{ position: 'relative', zIndex: 1 }}
        />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        ...T.t.caption, color: T.c.n600,
        marginTop: 2,
      }}>
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// ─── Radio card (Onde foi) ────────────────────────────────────
function RadioCard({ selected, onClick, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: selected ? T.c.p50 : T.c.n0,
        border: `1px solid ${selected ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.md,
        cursor: 'pointer', textAlign: 'left',
        boxShadow: selected ? `0 0 0 3px ${T.c.p100}` : 'none',
        transition: 'background 120ms, border-color 120ms, box-shadow 120ms',
        fontFamily: T.font,
      }}
    >
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        border: `2px solid ${selected ? T.c.p700 : T.c.n400}`,
        background: T.c.n0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && (
          <span style={{
            width: 10, height: 10, borderRadius: '50%', background: T.c.p700,
          }}/>
        )}
      </span>
      {icon && <Icon name={icon} size={16} color={selected ? T.c.p700 : T.c.n600}/>}
      <span style={{
        fontSize: 14, fontWeight: 600,
        color: selected ? T.c.p900 : T.c.n950,
      }}>{label}</span>
    </button>
  );
}

function placeIcon(p) {
  switch (p) {
    case 'Casa':         return 'home';
    case 'Restaurante':  return 'restaurant';
    case 'Confraria':    return 'groups';
    case 'Bar':          return 'local_bar';
    case 'Outro':        return 'more_horiz';
    default:             return null;
  }
}

Object.assign(window, {
  RegistroCompleto,
  SENSORIAL_AXES, COMPLETO_PLACES, COMPLETO_COMPANY,
  COMPLETO_COUNTRIES, COMPLETO_UVAS, COMPLETO_REGIOES,
});


export { COMPLETO_COMPANY, COMPLETO_COUNTRIES, COMPLETO_PLACES, COMPLETO_REGIOES, COMPLETO_UVAS, COMPLETO_YEARS, CURRENT_YEAR, DatalistInput, RadioCard, RegistroCompleto, SENSORIAL_AXES, Section, Select, SensorialSlider, TextInput, placeIcon };
