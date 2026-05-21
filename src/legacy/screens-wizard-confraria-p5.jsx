/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { TEMPLATES } from './screens-wizard-confraria-p2.jsx';
import { fbEvent, readWizardDraft, writeWizardDraft } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 08.05 Wizard Criar Confraria, Passo 5 de 5
// ────────────────────────────────────────────────────────────
// Revisar. Última tela antes da criação real. Mostra um resumo de tudo
// que foi configurado nos passos 1–4 e dispara a criação no backend.
//
// O CTA usa 🎉 propositalmente — é o momento de comemoração da jornada
// (única exceção à regra "sem emoji" do design system). A operação de
// criação é async; precisa de loading state porque leva 1–2s para criar
// o registro + uploads de capa + indexar nos feeds.

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    data: { name, template, location, meetingType, description, tags }
//    onCreate: () => Promise<{ brotherhoodId: string }>
//    onBack: () => void
function WizardCriarConfrariaP5({ data, onCreate, onBack }) {
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    setError(null);
    fbEvent('brotherhood_create_submitted', {
      template_id: data.template ? data.template.id : 'zero',
      meeting_type: data.meetingType,
      tags_count: (data.tags || []).length,
      has_location: Boolean(data.location),
    });
    try {
      const result = await onCreate();
      fbEvent('brotherhood_created', { brotherhood_id: result && result.brotherhoodId });
      // success — wizard router handles the route to 08.06
    } catch (e) {
      fbEvent('brotherhood_create_failed', { reason: (e && e.message) || 'unknown' });
      setCreating(false);
      setError('Não conseguimos criar agora. Tenta de novo em alguns segundos.');
    }
  };

  const tpl = data.template;
  const isOnline = data.meetingType === 'online';
  const meetingLabel = data.meetingType === 'ambos' ? 'Presencial + Online'
                    : data.meetingType === 'online'   ? 'Online'
                    : 'Presencial';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          disabled={creating}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            cursor: creating ? 'not-allowed' : 'pointer',
            color: creating ? T.c.n400 : T.c.n950,
            opacity: creating ? 0.5 : 1,
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
        }} aria-label="Passo 5 de 5">
          5 de 5
        </div>
      </header>

      {/* Progress bar — all 5 burgundy */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={5} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: T.c.p700,
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
            fontSize: 22, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Tudo certo?
          </h2>
          <div style={{ height: 12 }}/>
          <p style={{
            margin: 0,
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            Confira antes de criar. Você pode editar depois.
          </p>

          <div style={{ height: 24 }}/>

          {/* ── Resumo card ── */}
          <div style={{
            background: T.c.n50,
            border: `1px solid ${T.c.n200}`,
            borderRadius: T.r.lg,
            padding: 16,
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Cover */}
            <ReviewCover template={tpl} name={data.name}/>

            <div style={{ height: 16 }}/>

            {/* Nome + tema */}
            <div style={{
              fontFamily: T.font,
              fontSize: 18, lineHeight: 1.25, fontWeight: 700,
              color: T.c.n950,
              textWrap: 'balance',
            }}>
              {data.name || 'Sem nome'}
            </div>
            <div style={{ height: 4 }}/>
            <div style={{
              fontFamily: T.font,
              fontSize: 12, lineHeight: 1.4, color: T.c.n800,
            }}>
              Tema: <strong style={{ fontWeight: 600 }}>{tpl ? tpl.name : 'Do zero'}</strong>
            </div>

            <div style={{ height: 12 }}/>

            {/* Local */}
            <ReviewRow icon="location_on" label={
              isOnline
                ? 'Online'
                : (data.location ? `${data.location.city}, ${data.location.uf}` : '—')
            }/>

            <div style={{ height: 8 }}/>

            {/* Tipo */}
            <ReviewRow icon="groups" label={meetingLabel}/>

            <div style={{ height: 16 }}/>

            {/* Descrição */}
            <ReviewSection title="Descrição">
              {data.description ? (
                <div style={{
                  fontFamily: T.font,
                  fontSize: 14, lineHeight: 1.5, color: T.c.n950,
                  whiteSpace: 'pre-wrap',
                }}>
                  {data.description}
                </div>
              ) : (
                <div style={{
                  fontFamily: T.font, fontSize: 13, lineHeight: 1.5,
                  color: T.c.n600, fontStyle: 'italic',
                }}>
                  Sem descrição.
                </div>
              )}
            </ReviewSection>

            <div style={{ height: 16 }}/>

            {/* Tags */}
            <ReviewSection title="Tags">
              {data.tags && data.tags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: T.font, fontSize: 11, fontWeight: 500,
                      color: T.c.n800, background: T.c.n100,
                      padding: '4px 8px', borderRadius: T.r.full,
                      lineHeight: 1.2,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{
                  fontFamily: T.font, fontSize: 13, lineHeight: 1.5,
                  color: T.c.n600, fontStyle: 'italic',
                }}>
                  Sem tags.
                </div>
              )}
            </ReviewSection>
          </div>

          {/* Inline error (rare; usually we route via toast) */}
          {error && (
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px',
              background: T.c.e100, border: `1px solid ${T.c.e700}`,
              borderRadius: T.r.md,
            }}>
              <Icon name="error" size={18} color={T.c.e700} fill={1}/>
              <div style={{
                fontFamily: T.font, fontSize: 13, lineHeight: 1.4, color: T.c.e700,
              }}>
                {error}
              </div>
            </div>
          )}

          <div style={{ height: 32 }}/>
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
          loading={creating}
          onClick={handleCreate}
          data-route="brotherhood_created">
          {creating ? 'Criando…' : '🎉 Criar minha confraria'}
        </Button>
        <Button
          variant="ghost" size="md" fullWidth
          disabled={creating}
          onClick={onBack}>
          Voltar e editar
        </Button>
      </div>
    </div>
  );
}

// ─── Cover preview ──────────────────────────────────────────
function ReviewCover({ template, name }) {
  const gradient = template ? template.gradient : ['#D6D6D6', '#6B6B6B'];
  const glyph = template ? template.glyph : 'wine_bar';
  return (
    <div style={{
      position: 'relative',
      height: 100,
      borderRadius: T.r.md,
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 14px)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.55,
      }}>
        <Icon name={glyph} size={44} color="#FFFFFF" fill={1}/>
      </div>
      {/* Bottom-left badge mostrando que é capa-padrão */}
      <div style={{
        position: 'absolute', left: 10, bottom: 10,
        padding: '4px 10px',
        background: 'rgba(0,0,0,0.55)',
        borderRadius: T.r.full,
        fontFamily: T.font, fontSize: 10, fontWeight: 600,
        color: '#FFFFFF', letterSpacing: '0.4px',
        textTransform: 'uppercase',
      }}>
        Capa-padrão
      </div>
    </div>
  );
}

// ─── ReviewRow ──────────────────────────────────────────────
function ReviewRow({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon name={icon} size={18} color={T.c.n600} fill={1}/>
      <span style={{
        fontFamily: T.font, fontSize: 14, fontWeight: 500,
        color: T.c.n950, lineHeight: 1.4,
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── ReviewSection ──────────────────────────────────────────
function ReviewSection({ title, children }) {
  return (
    <div>
      <div style={{
        fontFamily: T.font,
        fontSize: 11, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n600, marginBottom: 6,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarConfrariaP5Screen({ go, params = {} }) {
  const draft = React.useMemo(() => readWizardDraft() || {}, []);
  const templateId = draft.template_id || 'zero';
  const template = templateId === 'zero'
    ? null
    : (TEMPLATES.find(t => t.id === templateId) || null);

  // Assemble the review payload from whatever the wizard accumulated.
  const data = {
    name: draft.name || params.name || 'Confraria sem nome',
    template,
    description: draft.description || (template ? template.description : ''),
    tags: draft.tags || (template ? template.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)) : []),
    meetingType: draft.meeting_type || 'presencial',
    location: draft.location || null,
  };

  const onCreate = async () => {
    // Mock creation — em produção: POST /brotherhoods + upload de capa
    await new Promise(r => setTimeout(r, 1400));
    const id = 'brh_' + Math.random().toString(36).slice(2, 9);
    writeWizardDraft(null); // clear draft on success
    // Navega para o "bora marcar primeiro encontro" passando os dados
    // necessários para esse passo (brotherhoodId + nome + template).
    go('wizard-confraria-6', {
      brotherhoodId: id,
      brotherhoodName: data.name,
      template_id: templateId,
      template_name: template ? template.name : null,
    });
    return { brotherhoodId: id };
  };

  const onBack = () => go('back');

  return (
    <WizardCriarConfrariaP5
      data={data}
      onCreate={onCreate}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarConfrariaP5,
  WizardCriarConfrariaP5Screen,
});


export { ReviewCover, ReviewRow, ReviewSection, WizardCriarConfrariaP5, WizardCriarConfrariaP5Screen };
