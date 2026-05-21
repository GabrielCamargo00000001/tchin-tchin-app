/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 08.01 Wizard Criar Confraria, Passo 1 de 5
// ────────────────────────────────────────────────────────────
// First step of the create-brotherhood wizard. Entry points:
//   1. User picked intent='create_brotherhood' on Tela de Intenção (03.03)
//   2. User started creation from inside the Confrarias tab
//
// Wizard map (5 passos):
//   08.01 · Nome           ← este arquivo
//   08.02 · Templates
//   08.03 · Personalização
//   08.04 · Localização
//   08.05 · Revisar
//
// Persistence: a draft is mirrored to localStorage so the user can leave the
// wizard mid-flow ("Salvar e continuar depois") and return later.

const WIZARD_DRAFT_KEY = 'tc.wizard.confraria.draft';
const NAME_MIN = 3;
const NAME_MAX = 60;

function readWizardDraft() {
  try { return JSON.parse(window.localStorage.getItem(WIZARD_DRAFT_KEY) || 'null'); }
  catch (e) { return null; }
}
function writeWizardDraft(draft) {
  try {
    if (draft == null) window.localStorage.removeItem(WIZARD_DRAFT_KEY);
    else window.localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {}
}

// Lightweight Firebase Analytics shim — logs to console so the prototype
// surfaces every event without a real Firebase wiring.
function fbEvent(name, params) {
  try {
    if (params) console.log(`[firebase] ${name}`, params);
    else        console.log(`[firebase] ${name}`);
  } catch (e) {}
}

// ─── Pure component (matches the spec contract) ─────────────
//  props:
//    userCity?: string            — interpola "Tchin da [cidade]" se presente
//    onContinue: (name) => void
//    onSaveDraft: (name) => void
//    onClose: () => void
function WizardCriarConfrariaP1({ userCity, onContinue, onSaveDraft, onClose, initialName = '' }) {
  const [name, setName] = React.useState(initialName);
  const [showExit, setShowExit] = React.useState(false);
  const inputRef = React.useRef(null);

  // Fire wizard_started exactly once on mount
  React.useEffect(() => { fbEvent('brotherhood_wizard_started', { step: 1 }); }, []);

  const trimmed = name.trim();
  const nameValid = trimmed.length >= NAME_MIN;

  const onChangeName = (v) => setName(v.slice(0, NAME_MAX));

  const handleContinue = () => {
    if (!nameValid) return;
    writeWizardDraft({ name: trimmed, step: 2 });
    onContinue(trimmed);
  };

  const handleSaveDraft = () => {
    // Spec allows saving with whatever's typed (including empty) — minimum is
    // enforced on Continue, not here. But if blank, no draft is created.
    if (trimmed) writeWizardDraft({ name: trimmed, step: 1 });
    onSaveDraft(trimmed);
  };

  const handleClose = () => {
    if (!trimmed) { onClose(); return; }
    setShowExit(true);
  };

  // Suggestions — "Tchin da [cidade]" só aparece se userCity foi soft-granted
  // (proxy: prop está presente). Extrai a cidade antes da vírgula.
  const cityShort = userCity ? userCity.split(',')[0].trim() : null;
  const suggestions = [
    cityShort ? `Tchin da ${cityShort}` : null,
    'Confraria do Vale',
    'Galera do vinho',
    'Brothers of Wine',
  ].filter(Boolean);

  const onSuggestionTap = (label) => {
    fbEvent('brotherhood_suggestion_tapped', { suggestion_label: label });
    setName(label.slice(0, NAME_MAX));
    // Focus o input pra usuário poder editar de imediato
    window.setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar — close · title · "1 de 5" ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={handleClose}
          aria-label="Sair do wizard"
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
          Criar confraria
        </div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }} aria-label="Passo 1 de 5">
          1 de 5
        </div>
      </header>

      {/* Progress bar — 5 segments, segment 1 burgundy/700 */}
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

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '32px 24px 0' }}>
          {/* h2 — Fraunces 24 */}
          <h2 style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 24, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Como sua confraria vai se chamar?
          </h2>

          <div style={{ height: 12 }}/>

          {/* body/default neutral/700 — 16px per spec */}
          <p style={{
            margin: 0,
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            Pode ser informal — "Galera do vinho" funciona. Pode editar depois.
          </p>

          <div style={{ height: 32 }}/>

          {/* Input — nome */}
          <NameField
            ref={inputRef}
            value={name}
            onChange={onChangeName}
            maxLength={NAME_MAX}
            minLength={NAME_MIN}
          />

          <div style={{ height: 24 }}/>

          {/* Sugestões — chips em scroll horizontal */}
          <SuggestionsRow
            suggestions={suggestions}
            current={name}
            onTap={onSuggestionTap}
          />

          {/* Espaço pro fundo não colar no CTA fixo */}
          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* ── Fixed bottom CTAs ── */}
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
          data-route="wizard_step_2">
          Continuar
        </Button>
        <Button
          variant="ghost" size="md" fullWidth
          onClick={handleSaveDraft}
          data-route="wizard_save_draft">
          Salvar e continuar depois
        </Button>
      </div>

      {/* Exit confirmation modal */}
      {showExit && (
        <ExitConfirmModal
          onCancel={() => setShowExit(false)}
          onConfirm={() => { writeWizardDraft(null); setShowExit(false); onClose(); }}
        />
      )}
    </div>
  );
}

// ─── NameField — input + char counter + helper text ───────
const NameField = React.forwardRef(function NameField({ value, onChange, minLength, maxLength }, ref) {
  const [focused, setFocused] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const len = value.length;
  const tooShort = touched && len > 0 && len < minLength;
  const labelFloating = focused || len > 0;

  return (
    <div>
      <div data-tour-anchor="confraria-nome" style={{
        position: 'relative',
        border: `1.5px solid ${tooShort ? T.c.e700 : (focused ? T.c.p700 : T.c.n300)}`,
        borderRadius: T.r.md, background: T.c.n0,
        transition: 'border-color 160ms',
      }}>
        {/* Floating label */}
        <label
          htmlFor="confraria-name"
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
          Nome da confraria
        </label>
        <input
          id="confraria-name"
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          placeholder={labelFloating ? 'Ex: Tchin do Cerrado' : ''}
          maxLength={maxLength}
          aria-invalid={tooShort}
          aria-describedby="name-helper name-counter"
          style={{
            width: '100%', padding: '18px 16px 18px 16px',
            paddingRight: 64,
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.4, color: T.c.n950,
            boxSizing: 'border-box',
          }}
        />
        {/* Char counter — bottom-right inside border, caption/12 neutral/500 */}
        <span id="name-counter" style={{
          position: 'absolute', right: 12, bottom: 6,
          fontFamily: T.mono, fontSize: 12, fontWeight: 500,
          color: len > maxLength * 0.9 ? T.c.w700 : T.c.n400,
          pointerEvents: 'none',
        }}>
          {len}/{maxLength}
        </span>
      </div>
      <div id="name-helper" style={{
        marginTop: 6, minHeight: 16, paddingLeft: 4,
        fontFamily: T.font,
        fontSize: 12, lineHeight: 1.4,
        color: tooShort ? T.c.e700 : T.c.n600,
      }}>
        {tooShort ? `Mínimo de ${minLength} caracteres.` : ' '}
      </div>
    </div>
  );
});

// ─── SuggestionsRow — section header + horizontal-scroll chips ───
function SuggestionsRow({ suggestions, current, onTap }) {
  return (
    <div>
      <div style={{
        fontFamily: T.font,
        fontSize: 13, lineHeight: 1.4, fontWeight: 600,
        color: T.c.n800, marginBottom: 10,
        textTransform: 'uppercase', letterSpacing: '0.4px',
      }}>
        Sugestões
      </div>
      <div style={{
        display: 'flex', gap: 8,
        overflowX: 'auto', overflowY: 'hidden',
        margin: '0 -24px', padding: '4px 24px 8px',
        scrollbarWidth: 'none',
      }}
      className="tc-no-scrollbar">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => onTap(s)}
            style={{
              flexShrink: 0,
              height: 36, padding: '0 14px',
              background: current === s ? T.c.p50 : T.c.n0,
              color: current === s ? T.c.p700 : T.c.n800,
              border: `1.5px solid ${current === s ? T.c.p700 : T.c.n300}`,
              borderRadius: T.r.full,
              fontFamily: T.font, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 120ms',
            }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Exit confirmation modal — protects user from data loss ──
function ExitConfirmModal({ onCancel, onConfirm }) {
  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'absolute', inset: 0, zIndex: 80,
        background: 'rgba(15,15,15,0.60)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'tcFadeIn 180ms ease',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
        style={{
          width: '100%',
          background: T.c.n0,
          borderTopLeftRadius: T.r.lg, borderTopRightRadius: T.r.lg,
          padding: '12px 24px 28px',
          paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          animation: 'tcSlideUp 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontFamily: T.font,
        }}>
        <div style={{
          width: 32, height: 4, borderRadius: 2,
          background: T.c.n300, margin: '0 auto 16px',
        }}/>
        <h3 id="exit-modal-title" style={{
          margin: 0, marginBottom: 8,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 20, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Sair sem salvar?
        </h3>
        <p style={{
          margin: 0, marginBottom: 24,
          fontFamily: T.font,
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
        }}>
          Você vai perder o que digitou até aqui. Se quiser, dá pra salvar como rascunho.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="primary" size="lg" fullWidth onClick={onCancel}>
            Continuar onde parei
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={onConfirm}
            style={{ color: T.c.e700 }}>
            Sair sem salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
// Bridges the pure component to the prototype's go/ctx machinery so the
// existing route 'wizard-confraria-1' keeps working.
function WizardCriarConfrariaP1Screen({ go, params = {}, ctx }) {
  const gpsStatus = params.location_status || (ctx && ctx.user && ctx.user.city ? 'granted' : 'denied');
  const softGranted = gpsStatus === 'granted' || gpsStatus === 'denied_soft';
  const userCity = softGranted ? (params.userCity || (ctx && ctx.user && ctx.user.city)) : undefined;

  const draft = React.useMemo(() => readWizardDraft() || {}, []);

  const onContinue = (name) => {
    go('wizard-confraria-2');
  };

  const onSaveDraft = (name) => {
    go('toast', { kind: 'info', message: 'Você tem uma confraria em rascunho.' });
    window.setTimeout(() => go('comunidade'), 200);
  };

  const onClose = () => go('back');

  return (
    <WizardCriarConfrariaP1
      userCity={userCity}
      initialName={draft.name || ''}
      onContinue={onContinue}
      onSaveDraft={onSaveDraft}
      onClose={onClose}
    />
  );
}

// Inject scrollbar-hide CSS once
if (typeof document !== 'undefined' && !document.getElementById('tc-no-scrollbar-css')) {
  const s = document.createElement('style');
  s.id = 'tc-no-scrollbar-css';
  s.textContent = `.tc-no-scrollbar::-webkit-scrollbar { display: none; }`;
  document.head.appendChild(s);
}

Object.assign(window, {
  WizardCriarConfrariaP1,
  WizardCriarConfrariaP1Screen,
  WIZARD_DRAFT_KEY,
  readWizardDraft,
  writeWizardDraft,
  fbEvent,
});


export { ExitConfirmModal, NAME_MAX, NAME_MIN, NameField, SuggestionsRow, WIZARD_DRAFT_KEY, WizardCriarConfrariaP1, WizardCriarConfrariaP1Screen, fbEvent, readWizardDraft, writeWizardDraft };
