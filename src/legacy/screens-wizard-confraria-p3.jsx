/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { TEMPLATES } from './screens-wizard-confraria-p2.jsx';
import { fbEvent, readWizardDraft, writeWizardDraft } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 08.03 Wizard Criar Confraria, Passo 3 de 5
// ────────────────────────────────────────────────────────────
// Personalização. Hydrates from the template chosen in 08.02:
//   • Cover photo  → template gradient (placeholder until user picks one)
//   • Descrição    → template.description (editable, 240 chars)
//   • Tags         → template.tags pre-selected, user picks up to 5 total
//   • Tipo encontro → 'Presencial' por padrão, 'Ambos' se Wine & Netflix
//
// Para confrarias criadas "do zero", os campos vêm vazios e o cover é um
// placeholder neutro.
//
// US-12-10-01 — emite `brotherhood_p3_completed` com flags de edição (foto
// trocada? descrição editada?) e contagem de tags para medir o quanto o
// template realmente economiza trabalho.

const TAG_UNIVERSE = [
  // Tipos de vinho
  'Tintos', 'Brancos', 'Rosés', 'Espumantes',
  // Nível
  'Iniciante', 'Intermediário', 'Avançado',
  // Contexto
  'Harmonização', 'Regiões', 'Casa', 'Bar', 'Online',
];

const MAX_TAGS = 5;
const DESC_MAX = 240;

// Map de tipos de encontro. Material Symbols substituem os emoji da spec
// pra manter consistência com o resto do app (que é todo Material).
const ENCONTRO_OPTIONS = [
  { id: 'presencial', label: 'Presencial', icon: 'home_pin'  },
  { id: 'online',     label: 'Online',     icon: 'computer'  },
  { id: 'ambos',      label: 'Ambos',      icon: 'public'    },
];

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    templateData: { id, name, description, tags, gradient, glyph, priceTier }
//    onContinue: (data: BrotherhoodCustomization) => void
//    onBack: () => void
function WizardCriarConfrariaP3({ templateData, onContinue, onBack }) {
  const tpl = templateData || { id: 'zero', name: 'Do zero', description: '', tags: [], gradient: ['#E5E5E5', '#B0B0B0'], glyph: 'wine_bar' };

  // Capitalize template tags pra bater com o universo (que é capitalizado)
  const normalizeTag = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const initialTags = (tpl.tags || []).map(normalizeTag).slice(0, MAX_TAGS);

  // Tipo de encontro default: 'ambos' pra Wine & Netflix, senão 'presencial'
  const defaultEncontro = tpl.id === 'wine_netflix' ? 'ambos' : 'presencial';

  const [coverChanged, setCoverChanged] = React.useState(false);
  const [description, setDescription]   = React.useState(tpl.description || '');
  const [tags, setTags]                 = React.useState(initialTags);
  const [encontro, setEncontro]         = React.useState(defaultEncontro);

  // Track if user edited the auto-filled description
  const originalDesc = React.useRef(tpl.description || '');
  const descEdited = description.trim() !== originalDesc.current.trim();

  const onChangeDesc = (v) => setDescription(v.slice(0, DESC_MAX));

  const toggleTag = (tag) => {
    setTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= MAX_TAGS) return prev; // cap
      return [...prev, tag];
    });
  };

  const onTrocarFoto = () => {
    // Stub — em produção abriria seletor de galeria/câmera. Por ora
    // só flipa o flag pra Firebase saber que houve interação.
    setCoverChanged(true);
    fbEvent('brotherhood_cover_change_tapped');
  };

  const handleContinue = () => {
    fbEvent('brotherhood_p3_completed', {
      foto_trocada: coverChanged,
      desc_editada: descEdited,
      tags_count: tags.length,
    });
    const data = {
      cover_changed: coverChanged,
      description: description.trim(),
      tags,
      meeting_type: encontro,
    };
    // Persist on draft so 08.04 (Localização) and 08.05 (Revisar) can hydrate
    const draft = readWizardDraft() || {};
    writeWizardDraft({ ...draft, ...data, step: 4 });
    onContinue(data);
  };

  // The universe shown in the grid is the static 12 + any template tag that
  // isn't already in the universe (treated as a "custom" tag). Pre-selected
  // tags are highlighted; user can deselect or pick up to 5 total.
  const chipPool = React.useMemo(() => {
    const extras = initialTags.filter(t => !TAG_UNIVERSE.includes(t));
    return [...extras, ...TAG_UNIVERSE];
  }, [initialTags]);

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
          Criar confraria
        </div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }} aria-label="Passo 3 de 5">
          3 de 5
        </div>
      </header>

      {/* Progress bar — 5 segments, 1–3 burgundy */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={3} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= 2 ? T.c.p700 : T.c.n200,
            transition: 'background 240ms',
          }}/>
        ))}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '24px 16px 0' }}>
          <h2 style={{
            margin: 0, padding: '0 8px',
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 22, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Como ela é por dentro?
          </h2>
          <div style={{ height: 12 }}/>
          <p style={{
            margin: 0, padding: '0 8px',
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            Já preenchemos com base no template. Ajuste se quiser.
          </p>

          <div style={{ height: 24 }}/>

          {/* ── Cover photo ── */}
          <CoverPhoto template={tpl} changed={coverChanged} onChange={onTrocarFoto}/>

          <div style={{ height: 16 }}/>

          {/* ── Descrição ── */}
          <DescriptionField
            value={description}
            onChange={onChangeDesc}
            maxLength={DESC_MAX}
          />

          <div style={{ height: 16 }}/>

          {/* ── Tags ── */}
          <TagsPicker
            tags={chipPool}
            selected={tags}
            onToggle={toggleTag}
          />

          <div style={{ height: 16 }}/>

          {/* ── Tipo de encontro ── */}
          <MeetingTypePicker
            value={encontro}
            onChange={setEncontro}
          />

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
          onClick={handleContinue}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="wizard_step_4">
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

// ─── CoverPhoto — gradient placeholder + "Trocar foto" CTA ──
function CoverPhoto({ template, changed, onChange }) {
  return (
    <div>
      <div style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: 12, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n800,
        textTransform: 'uppercase', letterSpacing: '0.4px',
        marginBottom: 8, paddingLeft: 8,
      }}>
        Foto de capa
      </div>
      <div style={{
        position: 'relative',
        height: 120,
        borderRadius: T.r.lg,
        background: `linear-gradient(135deg, ${template.gradient[0]} 0%, ${template.gradient[1]} 100%)`,
        overflow: 'hidden',
        border: `1px solid ${T.c.n200}`,
      }}>
        {/* Subtle diagonal texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 14px)',
        }}/>
        {/* Central glyph as a "default cover" visual */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.55,
        }}>
          <Icon name={template.glyph || 'wine_bar'} size={56} color="#FFFFFF" fill={1}/>
        </div>
        {/* Bottom-left overlay with caption */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '20px 12px 10px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <span style={{
            fontFamily: T.font,
            fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
            color: '#FFFFFF', textTransform: 'uppercase',
          }}>
            {changed ? 'Foto trocada' : 'Capa atual'}
          </span>
          <button
            onClick={onChange}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.96)', border: 'none', borderRadius: T.r.full,
              fontFamily: T.font, fontSize: 12, fontWeight: 600,
              color: T.c.n950, cursor: 'pointer',
            }}>
            <Icon name="photo_camera" size={14}/>
            Trocar foto
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DescriptionField — textarea + char counter ────────────
function DescriptionField({ value, onChange, maxLength }) {
  const [focused, setFocused] = React.useState(false);
  const len = value.length;
  const nearLimit = len > maxLength * 0.9;

  return (
    <div style={{ padding: '0 8px' }}>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: 12, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n800,
        textTransform: 'uppercase', letterSpacing: '0.4px',
        marginBottom: 8,
      }}>
        Descrição
      </label>
      <div style={{
        position: 'relative',
        border: `1.5px solid ${focused ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.md, background: T.c.n0,
        transition: 'border-color 160ms',
      }}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Conta o espírito da confraria — público, frequência, vibe…"
          maxLength={maxLength}
          rows={4}
          style={{
            width: '100%', padding: '14px 16px 24px',
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font,
            fontSize: 15, lineHeight: 1.5, color: T.c.n950,
            resize: 'vertical', minHeight: 80, maxHeight: 160,
            boxSizing: 'border-box',
            display: 'block',
          }}
        />
        <span style={{
          position: 'absolute', right: 12, bottom: 6,
          fontFamily: T.mono, fontSize: 12, fontWeight: 500,
          color: nearLimit ? T.c.w700 : T.c.n400,
          pointerEvents: 'none',
        }}>
          {len}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ─── TagsPicker — grid 3-col multi-select, cap 5 ───────────
function TagsPicker({ tags, selected, onToggle }) {
  const atCap = selected.length >= MAX_TAGS;
  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8,
      }}>
        <label style={{
          fontFamily: T.font,
          fontSize: 12, fontWeight: 600, lineHeight: 1.4,
          color: T.c.n800,
          textTransform: 'uppercase', letterSpacing: '0.4px',
        }}>
          Tags <span style={{ color: T.c.n600, fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
            (até {MAX_TAGS})
          </span>
        </label>
        <span style={{
          fontFamily: T.mono, fontSize: 11, fontWeight: 500,
          color: atCap ? T.c.w700 : T.c.n600,
        }}>
          {selected.length}/{MAX_TAGS}
        </span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {tags.map(tag => {
          const isSelected = selected.includes(tag);
          const isDisabled = !isSelected && atCap;
          return (
            <button
              key={tag}
              onClick={() => !isDisabled && onToggle(tag)}
              disabled={isDisabled}
              style={{
                height: 36, padding: '0 10px',
                background: isSelected ? T.c.p700 : T.c.n0,
                color: isSelected ? '#FFFFFF' : (isDisabled ? T.c.n400 : T.c.n800),
                border: `1.5px solid ${isSelected ? T.c.p700 : (isDisabled ? T.c.n200 : T.c.n300)}`,
                borderRadius: T.r.full,
                fontFamily: T.font, fontSize: 13, fontWeight: 500,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                transition: 'all 120ms',
                opacity: isDisabled ? 0.6 : 1,
              }}>
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MeetingTypePicker — 3 radio cards horizontais ─────────
function MeetingTypePicker({ value, onChange }) {
  return (
    <div style={{ padding: '0 8px' }}>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: 12, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n800,
        textTransform: 'uppercase', letterSpacing: '0.4px',
        marginBottom: 8,
      }}>
        Como se encontram
      </label>
      <div style={{ display: 'flex', gap: 8 }} role="radiogroup" aria-label="Tipo de encontro">
        {ENCONTRO_OPTIONS.map(opt => {
          const sel = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              role="radio"
              aria-checked={sel}
              style={{
                flex: 1, minHeight: 72,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 4,
                background: sel ? T.c.p50 : T.c.n0,
                color: sel ? T.c.p700 : T.c.n800,
                border: `${sel ? 2 : 1.5}px solid ${sel ? T.c.p700 : T.c.n300}`,
                borderRadius: T.r.md,
                padding: sel ? 11 : 12,
                cursor: 'pointer',
                fontFamily: T.font,
                transition: 'all 140ms',
              }}>
              <Icon name={opt.icon} size={22} color={sel ? T.c.p700 : T.c.n600}/>
              <span style={{ fontSize: 13, fontWeight: sel ? 600 : 500 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarConfrariaP3Screen({ go, params = {} }) {
  const draft = React.useMemo(() => readWizardDraft() || {}, []);
  const templateId = params.template_id || draft.template_id || 'zero';
  const templateData = templateId === 'zero'
    ? { id: 'zero', name: 'Do zero', description: '', tags: [], gradient: ['#D6D6D6', '#6B6B6B'], glyph: 'wine_bar' }
    : (TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0]);

  const onContinue = (data) => {
    // Se a confraria for 100% online, pula 08.04 (localização) direto pra 08.05
    if (data.meeting_type === 'online') {
      go('wizard-confraria-5');
    } else {
      go('wizard-confraria-4', { meeting_type: data.meeting_type });
    }
  };

  const onBack = () => go('back');

  return (
    <WizardCriarConfrariaP3
      templateData={templateData}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarConfrariaP3,
  WizardCriarConfrariaP3Screen,
  TAG_UNIVERSE,
});


export { CoverPhoto, DESC_MAX, DescriptionField, ENCONTRO_OPTIONS, MAX_TAGS, MeetingTypePicker, TAG_UNIVERSE, TagsPicker, WizardCriarConfrariaP3, WizardCriarConfrariaP3Screen };
