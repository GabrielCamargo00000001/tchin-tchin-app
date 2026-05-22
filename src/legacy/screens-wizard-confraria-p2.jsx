/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { fbEvent, readWizardDraft, writeWizardDraft } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 08.02 Wizard Criar Confraria, Passo 2 de 5
// ────────────────────────────────────────────────────────────
// Template selection. Five curated templates pre-fill description, 3 tags,
// a default cover image, and a wine-price tier suggestion for step 08.03.
// A 6th option ("começar do zero") visually breaks the row to signal that
// nothing will be pre-filled.
//
// US-12-10-01 — brotherhood_template_selected event is fired with the
// template_name param so we can measure which template Brazilians actually
// pick. The template ID is also persisted on the wizard draft so the next
// step can hydrate fields without re-prompting.

const TEMPLATES = [
  {
    id: 'iniciantes',
    name: 'Iniciantes',
    description: 'Pra quem tá começando — vinhos acessíveis, dicas básicas, ambiente sem pressão.',
    tags: ['iniciante', 'didático', 'acessível'],
    gradient: ['#FFF1F2', '#FECDD3'], // rose/50 → rose/200
    glyph: 'school',
    glyphColor: '#9F1239', // rose/800 for legibility on light gradient
    priceTier: 'acessivel',
  },
  {
    id: 'tintos_mundo',
    name: 'Tintos do Mundo',
    description: 'Explorar tintos de regiões clássicas: Bordeaux, Toscana, Mendoza, Douro.',
    tags: ['tintos', 'regiões', 'internacional'],
    gradient: ['#C97D87', '#722F37'], // p300 → p700 (burgundy)
    glyph: 'public',
    glyphColor: '#FFFFFF',
    priceTier: 'medio',
  },
  {
    id: 'churrasco_vinho',
    name: 'Churrasco & Vinho',
    description: 'Harmonização com churrasco brasileiro. Tintos encorpados, brasileiros e argentinos.',
    tags: ['churrasco', 'harmonização', 'carne'],
    gradient: ['#FCD34D', '#D97706'], // amber/300 → amber/600
    glyph: 'outdoor_grill',
    glyphColor: '#FFFFFF',
    priceTier: 'medio',
  },
  {
    id: 'wine_netflix',
    name: 'Wine & Netflix',
    description: 'Encontros casuais em casa: 1 vinho, 1 série, 1 conversa boa. Sem formalidade.',
    tags: ['casual', 'casa', 'social'],
    gradient: ['#A5B4FC', '#4338CA'], // indigo/300 → indigo/700
    glyph: 'weekend',
    glyphColor: '#FFFFFF',
    priceTier: 'acessivel',
  },
  {
    id: 'girls_wine_night',
    name: 'Girls Wine Night',
    description: 'Encontros femininos com curadoria leve: brancos, rosés, espumantes e papo aberto.',
    tags: ['feminino', 'leveza', 'social'],
    gradient: ['#F9A8D4', '#DB2777'], // pink/300 → pink/600
    glyph: 'diversity_3',
    glyphColor: '#FFFFFF',
    priceTier: 'medio',
  },
];

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    onTemplateSelected: (templateId) => void
//    onBack: () => void
//    selectedTemplate?: string
function WizardCriarConfrariaP2({ onTemplateSelected, onBack, selectedTemplate }) {
  const [selected, setSelected] = React.useState(selectedTemplate || null);

  const onPick = (id) => {
    setSelected(id);
    // Note: Firebase event fires on Continue, not on tap — picking is
    // exploratory and we don't want to flood analytics with every tap.
  };

  const handleContinue = () => {
    if (!selected) return;
    const tpl = TEMPLATES.find(t => t.id === selected);
    const template_name = tpl ? tpl.name : 'zero';
    fbEvent('brotherhood_template_selected', { template_name, template_id: selected });
    // Persist on draft for hydrating step 3
    const draft = readWizardDraft() || {};
    writeWizardDraft({ ...draft, template_id: selected, step: 3 });
    onTemplateSelected(selected);
  };

  const selectedTpl = selected && selected !== 'zero' ? TEMPLATES.find(t => t.id === selected) : null;
  const ctaLabel = selectedTpl ? `Continuar com ${selectedTpl.name}` : (selected === 'zero' ? 'Continuar do zero' : 'Continuar');

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
        }} aria-label="Passo 2 de 5">
          2 de 5
        </div>
      </header>

      {/* Progress bar — 5 segments, segments 1–2 burgundy */}
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

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 24, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Escolha um tema pra começar
          </h2>
          <div style={{ height: 12 }}/>
          <p style={{
            margin: 0,
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            A gente já preenche pra você. Você pode mudar tudo depois.
          </p>

          <div style={{ height: 16 }}/>

          {/* ── Começar do zero — primeira opção ── */}
          <FromScratchCard
            selected={selected === 'zero'}
            onSelect={() => onPick('zero')}
          />

          <div style={{ height: 12 }}/>

          {/* ── Template cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} role="radiogroup" aria-label="Templates de confraria">
            {TEMPLATES.map(tpl => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                selected={selected === tpl.id}
                onSelect={() => onPick(tpl.id)}
              />
            ))}
          </div>

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
          disabled={!selected}
          onClick={handleContinue}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="wizard_step_3">
          {ctaLabel}
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

// ─── TemplateCard — image + content + selection state ──────
function TemplateCard({ template, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        width: '100%', minHeight: 96,
        background: T.c.n50,
        border: `${selected ? 2 : 1}px solid ${selected ? T.c.p700 : T.c.n200}`,
        borderRadius: T.r.lg,
        padding: selected ? 15 : 16, // compensate the extra 1px border so layout doesn't shift
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 140ms, background 140ms',
        boxShadow: selected ? '0 0 0 4px rgba(114,47,55,0.08)' : 'none',
      }}>
      {/* Selection checkmark — top-right */}
      {selected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 22, height: 22, borderRadius: '50%',
          background: T.c.p700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={14} color="#FFFFFF" weight={700}/>
        </div>
      )}

      {/* Thematic image placeholder — 72×72 gradient */}
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        borderRadius: T.r.md,
        background: `linear-gradient(135deg, ${template.gradient[0]} 0%, ${template.gradient[1]} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle diagonal texture for richness */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 12px)',
        }}/>
        <Icon name={template.glyph} size={32} color={template.glyphColor} fill={1} style={{ position: 'relative' }}/>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: selected ? 28 : 18 /* breathing room for chevron/checkmark */ }}>
        <div style={{
          fontFamily: T.font,
          fontSize: 15, lineHeight: 1.3, fontWeight: 700,
          color: T.c.n950, marginBottom: 4,
        }}>
          {template.name}
        </div>
        <div style={{
          fontFamily: T.font,
          fontSize: 12, lineHeight: 1.4, color: T.c.n800,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 8,
        }}>
          {template.description}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {template.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: T.font, fontSize: 11, fontWeight: 500,
              color: T.c.n800,
              background: T.c.n100,
              padding: '4px 8px',
              borderRadius: T.r.full,
              lineHeight: 1.2,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Chevron — only when not selected (replaced by checkmark) */}
      {!selected && (
        <div style={{
          position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
          color: T.c.n400, display: 'flex',
        }}>
          <Icon name="chevron_right" size={20}/>
        </div>
      )}
    </button>
  );
}

// ─── FromScratchCard — sexto card, estilo diferente ────────
function FromScratchCard({ selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4,
        width: '100%', minHeight: 96,
        background: selected ? T.c.p50 : 'transparent',
        border: `2px dashed ${selected ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.lg,
        padding: 16,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'border-color 140ms, background 140ms',
      }}>
      {selected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 22, height: 22, borderRadius: '50%',
          background: T.c.p700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={14} color="#FFFFFF" weight={700}/>
        </div>
      )}
      <Icon name="edit_note" size={24} color={selected ? T.c.p700 : T.c.n600}/>
      <div style={{
        fontFamily: T.font,
        fontSize: 14, lineHeight: 1.4, fontWeight: 600,
        color: selected ? T.c.p700 : T.c.n800,
      }}>
        Começar do zero
      </div>
      <div style={{
        fontFamily: T.font,
        fontSize: 12, lineHeight: 1.4, color: T.c.n600,
      }}>
        Eu defino tudo manualmente
      </div>
    </button>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarConfrariaP2Screen({ go, params = {} }) {
  const draft = React.useMemo(() => readWizardDraft() || {}, []);
  const initialSelected = params.selectedTemplate || draft.template_id || null;

  const onTemplateSelected = (templateId) => {
    go('wizard-confraria-3', { template_id: templateId });
  };

  const onBack = () => go('back');

  return (
    <WizardCriarConfrariaP2
      onTemplateSelected={onTemplateSelected}
      onBack={onBack}
      selectedTemplate={initialSelected}
    />
  );
}

Object.assign(window, {
  WizardCriarConfrariaP2,
  WizardCriarConfrariaP2Screen,
  TEMPLATES,
});


export { FromScratchCard, TEMPLATES, TemplateCard, WizardCriarConfrariaP2, WizardCriarConfrariaP2Screen };
