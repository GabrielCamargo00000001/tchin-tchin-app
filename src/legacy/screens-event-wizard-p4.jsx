/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { readEventDraft, writeEventDraft } from './screens-event-wizard-p1.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 09.04 Wizard Criar Evento, Passo 4 de 5
// ────────────────────────────────────────────────────────────
// Configurações operacionais do evento: vagas, Plus One (RSVP Viral
// US-14-2-01), pagamento, RSVP, e lembretes automáticos.
//
// Defaults pensados pra reduzir fricção pro organizador comum:
//   • 10 vagas
//   • Plus One ON (1 acompanhante por membro)
//   • Grátis
//   • RSVP aberto a todos da confraria
//   • Lembretes todos marcados (3d, 1d, dia, email D-1)

const DEFAULT_REMINDERS = {
  push3d: true,
  push1d: true,
  pushDay: true,
  emailIcs: true,
};

const REMINDERS_META = [
  { id: 'push3d',   label: 'Push 3 dias antes',           icon: 'notifications' },
  { id: 'push1d',   label: 'Push 1 dia antes',            icon: 'notifications' },
  { id: 'pushDay',  label: 'Push no dia (manhã)',         icon: 'wb_sunny' },
  { id: 'emailIcs', label: 'Email D-1 com .ics calendar', icon: 'mail' },
];

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    initialData?: { capacity, plusOne, plusOnePerMember, payment, paymentAmount, rsvp, reminders }
//    onContinue: (data) => void
//    onBack: () => void
function WizardCriarEventoP4({ initialData, onContinue, onBack }) {
  const init = initialData || {};
  const [capacity, setCapacity]   = React.useState(init.capacity ?? 10);
  const [plusOne, setPlusOne]     = React.useState(init.plusOne !== false);
  const [plusOnePerMember, setPlusOnePerMember] = React.useState(init.plusOnePerMember ?? 1);
  const [payment, setPayment]     = React.useState(init.payment || 'free'); // free | split | fixed
  const [paymentAmount, setPaymentAmount] = React.useState(init.paymentAmount || '');
  const [rsvp, setRsvp]           = React.useState(init.rsvp || 'open');    // open | manual
  const [reminders, setReminders] = React.useState(init.reminders || DEFAULT_REMINDERS);

  const toggleReminder = (id) => setReminders(r => ({ ...r, [id]: !r[id] }));

  const valid = payment !== 'fixed' || (paymentAmount && Number(paymentAmount.replace(',', '.')) > 0);

  const handleContinue = () => {
    if (!valid) return;
    fbEvent('event_p4_completed', {
      capacity,
      plus_one: plusOne,
      plus_one_per_member: plusOne ? plusOnePerMember : 0,
      payment_kind: payment,
      rsvp_mode: rsvp,
      reminders_count: Object.values(reminders).filter(Boolean).length,
    });
    const data = {
      capacity, plusOne, plusOnePerMember,
      payment, paymentAmount: payment === 'fixed' ? paymentAmount : null,
      rsvp, reminders,
    };
    const draft = readEventDraft() || {};
    writeEventDraft({ ...draft, settings: data, step: 5 });
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
        }} aria-label="Passo 4 de 5">
          4 de 5
        </div>
      </header>

      {/* Progress bar — 4 de 5 burgundy */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={4} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= 3 ? T.c.p700 : T.c.n200,
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
          }}>
            Configurações
          </h2>

          <div style={{ height: 24 }}/>

          {/* ── Vagas ── */}
          <Section title="Vagas" subtitle="Quantas pessoas no máximo?">
            <Stepper value={capacity} onChange={setCapacity} min={2} max={50}/>
            <div style={{ ...HELP_STYLE, marginTop: 8 }}>
              Inclui você como organizador.
            </div>
          </Section>

          <div style={{ height: 16 }}/>

          {/* ── Plus One ── */}
          <Section
            title="Permitir Plus One"
            badge="RSVP Viral"
            subtitle="Cada membro pode convidar 1 acompanhante não-membro.">
            <ToggleRow
              value={plusOne}
              onChange={setPlusOne}
              label={plusOne ? 'Ativado' : 'Desativado'}
            />
            {plusOne && (
              <div style={{ marginTop: 12 }}>
                <div style={{ ...HELP_STYLE, marginBottom: 8, fontWeight: 600, color: T.c.n800 }}>
                  Plus One por membro
                </div>
                <Stepper
                  value={plusOnePerMember}
                  onChange={setPlusOnePerMember}
                  min={0}
                  max={3}
                  compact
                />
              </div>
            )}
          </Section>

          <div style={{ height: 16 }}/>

          {/* ── Pagamento ── */}
          <Section
            title="Pagamento"
            subtitle="Você pode configurar integração LACI depois.">
            <RadioList
              value={payment}
              onChange={setPayment}
              options={[
                { id: 'free',  label: 'Grátis',             icon: 'volunteer_activism' },
                { id: 'split', label: 'Rateio entre todos', icon: 'group',
                  helper: 'Rachão automático no fim do evento.' },
                { id: 'fixed', label: 'Valor fixo por pessoa', icon: 'attach_money' },
              ]}
            />
            {payment === 'fixed' && (
              <div style={{ marginTop: 12 }}>
                <CurrencyInput
                  value={paymentAmount}
                  onChange={setPaymentAmount}
                />
              </div>
            )}
          </Section>

          <div style={{ height: 16 }}/>

          {/* ── RSVP ── */}
          <Section title="RSVP">
            <RadioList
              value={rsvp}
              onChange={setRsvp}
              options={[
                { id: 'open',   label: 'Aberto a todos da confraria', icon: 'group_add',
                  helper: 'Qualquer membro confirma direto.' },
                { id: 'manual', label: 'Aprovação manual',           icon: 'how_to_reg',
                  helper: 'Você aprova cada confirmação.' },
              ]}
            />
          </Section>

          <div style={{ height: 16 }}/>

          {/* ── Lembretes ── */}
          <Section title="Lembretes" subtitle="A gente cuida dos lembretes automáticos.">
            <CheckboxList
              reminders={reminders}
              onToggle={toggleReminder}
            />
          </Section>

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
          data-route="event_wizard_5">
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

// Shared style constants
const HELP_STYLE = {
  fontFamily: T.font, fontSize: 12, lineHeight: 1.45, color: T.c.n600,
};

// ─── Section — title + optional subtitle + body ─────────────
function Section({ title, subtitle, badge, children }) {
  return (
    <section style={{
      background: T.c.n50,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      padding: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: subtitle ? 4 : 12 }}>
        <h3 style={{
          margin: 0,
          fontFamily: T.font,
          fontSize: 14, fontWeight: 700, color: T.c.n950, lineHeight: 1.3,
        }}>
          {title}
        </h3>
        {badge && (
          <span style={{
            padding: '2px 8px',
            background: T.c.p700, color: T.c.n0,
            fontFamily: T.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.5px', textTransform: 'uppercase',
            borderRadius: T.r.full,
          }}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <div style={{ ...HELP_STYLE, marginBottom: 12 }}>
          {subtitle}
        </div>
      )}
      {children}
    </section>
  );
}

// ─── Stepper · - [N] + ──────────────────────────────────────
function Stepper({ value, onChange, min = 0, max = 99, compact }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const atMin = value <= min;
  const atMax = value >= max;
  const size = compact ? 36 : 44;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 0,
      background: T.c.n0, border: `1.5px solid ${T.c.n300}`,
      borderRadius: T.r.full, padding: 4,
    }}>
      <button
        onClick={dec} disabled={atMin}
        aria-label="Diminuir"
        style={{
          width: size, height: size, borderRadius: '50%',
          background: atMin ? 'transparent' : T.c.p50,
          color: atMin ? T.c.n400 : T.c.p700,
          border: 'none', cursor: atMin ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 120ms',
        }}>
        <Icon name="remove" size={compact ? 18 : 20} weight={700}/>
      </button>
      <div style={{
        minWidth: compact ? 44 : 56, padding: '0 8px',
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: compact ? 18 : 22, fontWeight: 600,
        color: T.c.n950, textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      <button
        onClick={inc} disabled={atMax}
        aria-label="Aumentar"
        style={{
          width: size, height: size, borderRadius: '50%',
          background: atMax ? 'transparent' : T.c.p50,
          color: atMax ? T.c.n400 : T.c.p700,
          border: 'none', cursor: atMax ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 120ms',
        }}>
        <Icon name="add" size={compact ? 18 : 20} weight={700}/>
      </button>
    </div>
  );
}

// ─── ToggleRow — switch + label ─────────────────────────────
function ToggleRow({ value, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '8px 0',
        background: 'none', border: 'none', cursor: 'pointer',
      }}>
      <div style={{
        width: 40, height: 24, borderRadius: 12,
        background: value ? T.c.p700 : T.c.n300,
        position: 'relative', flexShrink: 0,
        transition: 'background 180ms',
      }}>
        <div style={{
          position: 'absolute', top: 2,
          left: value ? 18 : 2,
          width: 20, height: 20, borderRadius: '50%',
          background: T.c.n0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'left 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}/>
      </div>
      <span style={{
        fontFamily: T.font, fontSize: 14, fontWeight: 600,
        color: value ? T.c.p700 : T.c.n800,
      }}>
        {label}
      </span>
    </button>
  );
}

// ─── RadioList — vertical radio options w/ icons + helpers ──
function RadioList({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup">
      {options.map(opt => {
        const sel = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            role="radio"
            aria-checked={sel}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: sel ? T.c.p50 : T.c.n0,
              border: `${sel ? 2 : 1.5}px solid ${sel ? T.c.p700 : T.c.n300}`,
              borderRadius: T.r.md,
              padding: sel ? 11 : 12,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 140ms',
            }}>
            <Icon name={opt.icon} size={20} color={sel ? T.c.p700 : T.c.n600} style={{ flexShrink: 0, marginTop: 1 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: T.font, fontSize: 14, fontWeight: 600,
                color: sel ? T.c.p700 : T.c.n950, lineHeight: 1.3,
              }}>
                {opt.label}
              </div>
              {opt.helper && (
                <div style={{
                  fontFamily: T.font, fontSize: 12, color: T.c.n600,
                  lineHeight: 1.4, marginTop: 2,
                }}>
                  {opt.helper}
                </div>
              )}
            </div>
            {/* Radio dot */}
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${sel ? T.c.p700 : T.c.n400}`,
              background: T.c.n0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 2,
            }}>
              {sel && (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: T.c.p700,
                }}/>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── CheckboxList — reminders grupo ─────────────────────────
function CheckboxList({ reminders, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {REMINDERS_META.map(r => {
        const checked = reminders[r.id];
        return (
          <button
            key={r.id}
            onClick={() => onToggle(r.id)}
            role="checkbox"
            aria-checked={checked}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 4px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              textAlign: 'left',
              borderRadius: T.r.sm,
            }}>
            {/* Checkbox */}
            <div style={{
              width: 20, height: 20, borderRadius: 5,
              border: `2px solid ${checked ? T.c.p700 : T.c.n400}`,
              background: checked ? T.c.p700 : T.c.n0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 120ms',
            }}>
              {checked && (
                <Icon name="check" size={14} color="#FFFFFF" weight={700}/>
              )}
            </div>
            <Icon name={r.icon} size={18} color={checked ? T.c.p700 : T.c.n600} style={{ flexShrink: 0 }}/>
            <span style={{
              flex: 1,
              fontFamily: T.font, fontSize: 14, fontWeight: 500,
              color: checked ? T.c.n950 : T.c.n800, lineHeight: 1.4,
            }}>
              {r.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── CurrencyInput — R$ input pra valor fixo ────────────────
function CurrencyInput({ value, onChange }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      border: `1.5px solid ${focused ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.md, background: T.c.n0,
      padding: '0 12px', transition: 'border-color 160ms',
    }}>
      <span style={{
        fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: T.c.n600,
      }}>
        R$
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={e => {
          // só dígitos, ponto e vírgula
          const cleaned = e.target.value.replace(/[^\d,.]/g, '');
          onChange(cleaned);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="0,00"
        style={{
          flex: 1, padding: '14px 0',
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.mono, fontSize: 15, fontWeight: 600,
          color: T.c.n950, boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarEventoP4Screen({ go }) {
  const draft = React.useMemo(() => readEventDraft() || {}, []);

  const onContinue = (data) => {
    go('event-wizard-5');
  };
  const onBack = () => go('back');

  return (
    <WizardCriarEventoP4
      initialData={draft.settings}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarEventoP4,
  WizardCriarEventoP4Screen,
  DEFAULT_REMINDERS,
});


export { CheckboxList, CurrencyInput, DEFAULT_REMINDERS, HELP_STYLE, REMINDERS_META, RadioList, Section, Stepper, ToggleRow, WizardCriarEventoP4, WizardCriarEventoP4Screen };
