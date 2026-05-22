/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { CoverPicker, COVER_BY_TYPE, suggestEventNames } from './event-covers.jsx';
import { TEMPLATES } from './screens-wizard-confraria-p2.jsx';
import { FIRST_EVENT_TITLES } from './screens-wizard-confraria-p6.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 09.01 Wizard Criar Evento, Passo 1 de 5
// ────────────────────────────────────────────────────────────
// Primeiro passo do wizard de criação de evento. Dois pontos de entrada:
//   1. Sugestão pós-criação de confraria (08.06 → "Criar primeiro evento")
//      → prefill com título + tipo derivado do template
//   2. Tap manual em "Criar evento" dentro de uma confraria
//      → campos em branco, tipo default = 'degustacao'
//
// Wizard map (5 passos):
//   09.01 · Nome + Tipo       ← este arquivo
//   09.02 · Data + Local
//   09.03 · Vinhos sugeridos
//   09.04 · Configurações
//   09.05 · Revisar

const EVENT_DRAFT_KEY = 'tc.wizard.event.draft';
const EVENT_NAME_MIN = 3;
const EVENT_NAME_MAX = 80;

function readEventDraft() {
  try { return JSON.parse(window.localStorage.getItem(EVENT_DRAFT_KEY) || 'null'); }
  catch (e) { return null; }
}
function writeEventDraft(draft) {
  try {
    if (draft == null) window.localStorage.removeItem(EVENT_DRAFT_KEY);
    else window.localStorage.setItem(EVENT_DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {}
}

const EVENT_TYPES = [
  { id: 'degustacao', label: 'Degustação',         icon: 'wine_bar'   },
  { id: 'jantar',     label: 'Jantar',             icon: 'restaurant' },
  { id: 'festa',      label: 'Festa',              icon: 'celebration'},
  { id: 'visita',     label: 'Visita a vinícola',  icon: 'tour'       },
];

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    prefill?: { name?, type? }
//    onContinue: (data) => void
//    onBack: () => void
function WizardCriarEventoP1({ prefill, tags, onContinue, onBack }) {
  const hasPrefill = Boolean(prefill && (prefill.name || prefill.type));

  const [name, setName] = React.useState(prefill && prefill.name ? prefill.name : '');
  const [type, setType] = React.useState(prefill && prefill.type ? prefill.type : 'degustacao');
  const [cover, setCover] = React.useState(
    (prefill && prefill.cover) || COVER_BY_TYPE[(prefill && prefill.type) || 'degustacao'] || 'classico'
  );

  React.useEffect(() => {
    fbEvent('event_wizard_started', { from_template: hasPrefill });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trimmed = name.trim();
  const nameValid = trimmed.length >= EVENT_NAME_MIN;

  const onChangeName = (v) => setName(v.slice(0, EVENT_NAME_MAX));

  // Sugestões de nome por IA (#6) — derivadas do tipo + tags da confraria.
  const suggestions = React.useMemo(() => suggestEventNames(type, tags), [type, tags]);

  const handleContinue = () => {
    if (!nameValid) return;
    const data = { name: trimmed, type, cover };
    const draft = readEventDraft() || {};
    writeEventDraft({ ...draft, ...data, step: 2 });
    onContinue(data);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          aria-label="Fechar wizard"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950,
          }}>
          <Icon name="close" size={24}/>
        </button>
        <div style={{
          flex: 1, textAlign: 'center',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 17, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Criar evento
        </div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }} aria-label="Passo 1 de 5">
          1 de 5
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={1} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i === 0 ? T.c.p700 : T.c.n200,
            transition: 'background 240ms',
          }}/>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 22, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Como vai chamar o encontro?
          </h2>

          {hasPrefill && (
            <>
              <div style={{ height: 8 }}/>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px 4px 8px',
                background: T.c.p50, border: `1px solid ${T.c.p100}`,
                borderRadius: T.r.full,
              }}>
                <Icon name="auto_awesome" size={14} color={T.c.p700} fill={1}/>
                <span style={{
                  fontFamily: T.font, fontSize: 11, fontWeight: 600,
                  color: T.c.p700, letterSpacing: '0.2px',
                }}>
                  Pré-preenchido pelo tema
                </span>
              </div>
            </>
          )}

          <div style={{ height: 16 }}/>

          <EventNameField
            value={name}
            onChange={onChangeName}
            maxLength={EVENT_NAME_MAX}
            minLength={EVENT_NAME_MIN}
          />

          {/* Sugestões de nome por IA — toque para preencher */}
          <NameSuggestions suggestions={suggestions} onPick={(s) => onChangeName(s)}/>

          <div style={{ height: 24 }}/>

          {/* ── Capa do evento (mesmo estilo da confraria, no topo) ── */}
          <CoverPicker value={cover} onChange={setCover}/>

          <div style={{ height: 24 }}/>

          {/* ── Tipo de encontro ── */}
          <EventTypePicker value={type} onChange={setType}/>

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* ── Bottom CTAs ── */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
        flexShrink: 0,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          disabled={!nameValid}
          onClick={handleContinue}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="event_wizard_2">
          Continuar
        </Button>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', alignSelf: 'center',
            fontFamily: T.font, fontSize: 13, fontWeight: 500,
            color: T.c.n600, letterSpacing: '0.1px',
          }}>
          Voltar
        </button>
      </div>
    </div>
  );
}

// ─── EventNameField — floating-label input + counter ───────
function EventNameField({ value, onChange, minLength, maxLength }) {
  const [focused, setFocused] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const len = value.length;
  const tooShort = touched && len > 0 && len < minLength;
  const labelFloating = focused || len > 0;

  return (
    <div>
      <div data-tour-anchor="evento-titulo" style={{
        position: 'relative',
        border: `1.5px solid ${tooShort ? T.c.e700 : (focused ? T.c.p700 : T.c.n300)}`,
        borderRadius: T.r.md, background: T.c.n0,
        transition: 'border-color 160ms',
      }}>
        <label
          htmlFor="event-name"
          style={{
            position: 'absolute',
            left: labelFloating ? 12 : 16,
            top: labelFloating ? -8 : 18,
            padding: labelFloating ? '0 6px' : 0,
            background: labelFloating ? T.c.n0 : 'transparent',
            fontFamily: T.font,
            fontSize: labelFloating ? 11 : 15,
            fontWeight: labelFloating ? 600 : 400,
            color: focused ? T.c.p700 : (tooShort ? T.c.e700 : T.c.n600),
            pointerEvents: 'none',
            transition: 'all 140ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            letterSpacing: labelFloating ? '0.2px' : '0',
          }}>
          Nome do evento
        </label>
        <input
          id="event-name"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          placeholder={labelFloating ? 'Ex: Degustação de Malbecs' : ''}
          maxLength={maxLength}
          aria-invalid={tooShort}
          style={{
            width: '100%', padding: '18px 64px 18px 16px',
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.4, color: T.c.n950,
            boxSizing: 'border-box',
          }}
        />
        <span style={{
          position: 'absolute', right: 12, bottom: 6,
          fontFamily: T.mono, fontSize: 12, fontWeight: 500,
          color: len > maxLength * 0.9 ? T.c.w700 : T.c.n400,
          pointerEvents: 'none',
        }}>
          {len}/{maxLength}
        </span>
      </div>
      <div style={{
        marginTop: 6, minHeight: 16, paddingLeft: 4,
        fontFamily: T.font,
        fontSize: 12, lineHeight: 1.4,
        color: tooShort ? T.c.e700 : T.c.n600,
      }}>
        {tooShort ? `Mínimo de ${minLength} caracteres.` : ' '}
      </div>
    </div>
  );
}

// ─── NameSuggestions — chips de sugestão de nome (IA) ──────
function NameSuggestions({ suggestions, onPick }) {
  if (!suggestions || !suggestions.length) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8,
        fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.c.p700, letterSpacing: '0.2px',
      }}>
        <Icon name="auto_awesome" size={14} color={T.c.p700} fill={1}/>
        Sugestões pra você
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {suggestions.map((s) => (
          <button key={s} onClick={() => onPick(s)} style={{
            padding: '8px 12px', background: T.c.p50, border: `1px solid ${T.c.p100}`,
            borderRadius: T.r.full, cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.c.p700,
          }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── EventTypePicker — 2x2 grid of radio cards ─────────────
function EventTypePicker({ value, onChange }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: 12, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n800,
        textTransform: 'uppercase', letterSpacing: '0.4px',
        marginBottom: 10,
      }}>
        Tipo de encontro
      </label>
      <div
        role="radiogroup" aria-label="Tipo de encontro"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
        }}>
        {EVENT_TYPES.map(opt => {
          const sel = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              role="radio"
              aria-checked={sel}
              style={{
                position: 'relative',
                minHeight: 96,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                background: sel ? T.c.p50 : T.c.n0,
                color: sel ? T.c.p700 : T.c.n800,
                border: `${sel ? 2 : 1.5}px solid ${sel ? T.c.p700 : T.c.n300}`,
                borderRadius: T.r.md,
                padding: sel ? 15 : 16,
                cursor: 'pointer',
                fontFamily: T.font,
                transition: 'all 140ms',
              }}>
              {sel && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 20, height: 20, borderRadius: '50%',
                  background: T.c.p700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={13} color="#FFFFFF" weight={700}/>
                </div>
              )}
              <Icon name={opt.icon} size={28} color={sel ? T.c.p700 : T.c.n600} fill={sel ? 1 : 0}/>
              <span style={{
                fontSize: 13, fontWeight: sel ? 700 : 500,
                color: sel ? T.c.p700 : T.c.n950,
              }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helper — derive a prefill payload from a brotherhood template ─
//  Usado pelo flow 08.06 → 09.01 quando user toca "Criar primeiro evento".
function eventPrefillFromTemplate(templateId) {
  // Mantém alinhado com FIRST_EVENT_TITLES (08.06)
  const TYPE_MAP = {
    iniciantes:        'degustacao',
    tintos_mundo:      'degustacao',
    churrasco_vinho:   'jantar',
    wine_netflix:      'jantar',
    girls_wine_night:  'festa',
  };
  const tpl = TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return null;
  return {
    name: (FIRST_EVENT_TITLES && FIRST_EVENT_TITLES[tpl.name]) || 'Primeiro encontro',
    type: TYPE_MAP[templateId] || 'degustacao',
  };
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarEventoP1Screen({ go, params = {} }) {
  // Hidrata prefill: vindo do flow 08.06 → 09.01 (params.template_id) OU
  // draft anterior que o user salvou.
  const draft = React.useMemo(() => readEventDraft() || {}, []);
  const templateId = params.template_id;
  const prefill = params.prefill
    || (templateId ? eventPrefillFromTemplate(templateId) : null)
    || (draft.name ? { name: draft.name, type: draft.type, cover: draft.cover } : null);

  // Tags da confraria atual alimentam as sugestões de nome por IA.
  const tags = (params.brotherhoodTags)
    || (typeof window !== 'undefined' && window.__tcCurrentBrotherhood && window.__tcCurrentBrotherhood.tags)
    || [];

  const onContinue = (data) => {
    go('event-wizard-2');
  };
  const onBack = () => go('back');

  return (
    <WizardCriarEventoP1
      prefill={prefill}
      tags={tags}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarEventoP1,
  WizardCriarEventoP1Screen,
  EVENT_DRAFT_KEY,
  EVENT_TYPES,
  readEventDraft,
  writeEventDraft,
  eventPrefillFromTemplate,
});


export { EVENT_DRAFT_KEY, EVENT_NAME_MAX, EVENT_NAME_MIN, EVENT_TYPES, EventNameField, EventTypePicker, WizardCriarEventoP1, WizardCriarEventoP1Screen, eventPrefillFromTemplate, readEventDraft, writeEventDraft };
