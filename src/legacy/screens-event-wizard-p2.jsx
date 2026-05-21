/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { readEventDraft, writeEventDraft } from './screens-event-wizard-p1.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 09.02 Wizard Criar Evento, Passo 2 de 5
// ────────────────────────────────────────────────────────────
// Data + Local. Usamos <input type="date"> e <input type="time"> pra herdar
// os pickers nativos do OS (mais rápidos e familiares que custom). Default:
//   • Data: próximo sábado
//   • Hora: 19:00
//
// Local: toggle Presencial/Online com input que muda de tipo:
//   • Presencial → input livre (futuramente Google Places autocomplete)
//   • Online     → input pra link da reunião + nota de privacidade

function nextSaturdayDate(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const add = dow === 6 ? 7 : (6 - dow); // se hoje é sábado, pula 7 dias
  d.setDate(d.getDate() + add);
  return d;
}

function toDateInputValue(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateHuman(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\./g, '');
}

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    initialData?: { date?, time?, locationMode?, locationText? }
//    onContinue: (data) => void
//    onBack: () => void
function WizardCriarEventoP2({ initialData, onContinue, onBack }) {
  const init = initialData || {};
  const defaultDate = toDateInputValue(nextSaturdayDate());

  const [date, setDate] = React.useState(init.date || defaultDate);
  const [time, setTime] = React.useState(init.time || '19:00');
  const [mode, setMode] = React.useState(init.locationMode || 'presencial'); // 'presencial' | 'online'
  const [location, setLocation] = React.useState(init.locationText || '');

  const valid = Boolean(date && time && location.trim());

  const handleContinue = () => {
    if (!valid) return;
    const data = {
      date, time,
      locationMode: mode,
      locationText: location.trim(),
    };
    const draft = readEventDraft() || {};
    writeEventDraft({ ...draft, ...data, step: 3 });
    fbEvent('event_p2_completed', { mode, has_location: Boolean(location.trim()) });
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
          aria-label="Voltar"
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
        }} aria-label="Passo 2 de 5">
          2 de 5
        </div>
      </header>

      {/* Progress bar — 2 de 5 burgundy */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= 1 ? T.c.p700 : T.c.n200,
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
            Quando e onde?
          </h2>

          <div style={{ height: 24 }}/>

          {/* ── Section · Data e horário ── */}
          <SectionLabel>Data e horário</SectionLabel>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <DateField value={date} onChange={setDate}/>
            </div>
            <div style={{ width: 120, flexShrink: 0 }}>
              <TimeField value={time} onChange={setTime}/>
            </div>
          </div>
          {date && (
            <div style={{
              marginTop: 8, paddingLeft: 4,
              fontFamily: T.font, fontSize: 12, color: T.c.n600,
            }}>
              {formatDateHuman(date)} · {time}
            </div>
          )}

          <div style={{ height: 24 }}/>

          {/* ── Section · Local ── */}
          <SectionLabel>Local</SectionLabel>
          <ModeToggle value={mode} onChange={(m) => { setMode(m); setLocation(''); }}/>

          <div style={{ height: 14 }}/>

          {mode === 'presencial' ? (
            <LocationInput
              key="presencial"
              value={location}
              onChange={setLocation}
              placeholder="Restaurante / Casa / Bar / Endereço"
              label="Local"
              icon="place"
            />
          ) : (
            <>
              <LocationInput
                key="online"
                value={location}
                onChange={setLocation}
                placeholder="https://meet.google.com/…"
                label="Link da reunião"
                icon="link"
                inputType="url"
              />
              <div style={{
                marginTop: 8, paddingLeft: 4,
                display: 'flex', alignItems: 'flex-start', gap: 6,
                fontFamily: T.font, fontSize: 12, lineHeight: 1.45, color: T.c.n600,
              }}>
                <Icon name="lock" size={14} color={T.c.n600} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
                <span>Cole o link aqui — só membros confirmados vão ver.</span>
              </div>
            </>
          )}

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
          disabled={!valid}
          onClick={handleContinue}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="event_wizard_3">
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

// ─── SectionLabel ───────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <label style={{
      display: 'block',
      fontFamily: T.font,
      fontSize: 12, fontWeight: 600, lineHeight: 1.4,
      color: T.c.n800,
      textTransform: 'uppercase', letterSpacing: '0.4px',
      marginBottom: 10,
    }}>
      {children}
    </label>
  );
}

// ─── DateField — wraps <input type="date"> with brand chrome ──
function DateField({ value, onChange }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{
      position: 'relative',
      border: `1.5px solid ${focused ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md, background: T.c.n0,
      transition: 'border-color 160ms',
      display: 'flex', alignItems: 'center',
      paddingLeft: 12,
    }}>
      <Icon name="calendar_today" size={18} color={T.c.n600} style={{ flexShrink: 0 }}/>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '14px 12px',
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950,
          boxSizing: 'border-box', appearance: 'none', WebkitAppearance: 'none',
        }}
      />
    </div>
  );
}

// ─── TimeField — wraps <input type="time"> ───────────────────
function TimeField({ value, onChange }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{
      position: 'relative',
      border: `1.5px solid ${focused ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md, background: T.c.n0,
      transition: 'border-color 160ms',
      display: 'flex', alignItems: 'center',
      paddingLeft: 12,
    }}>
      <Icon name="schedule" size={18} color={T.c.n600} style={{ flexShrink: 0 }}/>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '14px 8px',
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950, fontWeight: 600,
          boxSizing: 'border-box', appearance: 'none', WebkitAppearance: 'none',
        }}
      />
    </div>
  );
}

// ─── ModeToggle — Presencial / Online segmented ─────────────
function ModeToggle({ value, onChange }) {
  const OPTIONS = [
    { id: 'presencial', label: 'Presencial', icon: 'home_pin'  },
    { id: 'online',     label: 'Online',     icon: 'videocam'  },
  ];
  return (
    <div style={{
      display: 'inline-flex', padding: 4,
      background: T.c.n100, borderRadius: T.r.full,
      width: '100%',
    }} role="tablist" aria-label="Modo do evento">
      {OPTIONS.map(opt => {
        const sel = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            role="tab"
            aria-selected={sel}
            style={{
              flex: 1, height: 38,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: sel ? T.c.n0 : 'transparent',
              color: sel ? T.c.p700 : T.c.n800,
              border: 'none', borderRadius: T.r.full,
              cursor: 'pointer',
              fontFamily: T.font, fontSize: 13, fontWeight: sel ? 700 : 500,
              boxShadow: sel ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 140ms',
            }}>
            <Icon name={opt.icon} size={16} color={sel ? T.c.p700 : T.c.n600}/>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── LocationInput — generic floating-label text input ─────
function LocationInput({ value, onChange, placeholder, label, icon, inputType = 'text' }) {
  const [focused, setFocused] = React.useState(false);
  const labelFloating = focused || (value && value.length > 0);
  return (
    <div style={{
      position: 'relative',
      border: `1.5px solid ${focused ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md, background: T.c.n0,
      transition: 'border-color 160ms',
      display: 'flex', alignItems: 'center',
    }}>
      <label
        style={{
          position: 'absolute',
          left: labelFloating ? 12 : 40,
          top: labelFloating ? -8 : 18,
          padding: labelFloating ? '0 6px' : 0,
          background: labelFloating ? T.c.n0 : 'transparent',
          fontFamily: T.font,
          fontSize: labelFloating ? 11 : 15,
          fontWeight: labelFloating ? 600 : 400,
          color: focused ? T.c.p700 : T.c.n600,
          pointerEvents: 'none',
          transition: 'all 140ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          letterSpacing: labelFloating ? '0.2px' : '0',
        }}>
        {label}
      </label>
      <Icon name={icon} size={18} color={T.c.n600} style={{ marginLeft: 12, flexShrink: 0 }}/>
      <input
        type={inputType}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={labelFloating ? placeholder : ''}
        style={{
          width: '100%', padding: '18px 16px 18px 10px',
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarEventoP2Screen({ go }) {
  const draft = React.useMemo(() => readEventDraft() || {}, []);

  const onContinue = (data) => {
    go('event-wizard-3');
  };
  const onBack = () => go('back');

  return (
    <WizardCriarEventoP2
      initialData={draft}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarEventoP2,
  WizardCriarEventoP2Screen,
  nextSaturdayDate,
  toDateInputValue,
});


export { DateField, LocationInput, ModeToggle, SectionLabel, TimeField, WizardCriarEventoP2, WizardCriarEventoP2Screen, formatDateHuman, nextSaturdayDate, toDateInputValue };
