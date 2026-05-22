/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { getEventCover } from './event-covers.jsx';
import { readEventDraft, writeEventDraft } from './screens-event-wizard-p1.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — 09.05 Wizard Criar Evento, Passo 5 de 5
// ────────────────────────────────────────────────────────────
// Revisar e publicar. Última tela antes do INSERT real no banco.
// Mirror estrutural do 08.05 (revisar confraria) mas com payload de
// evento: nome + tipo + data/hora + local + capacidade + vinhos +
// settings (Plus One, Pagamento, RSVP, Lembretes).
//
// O CTA usa 📅 propositalmente — é o momento "publicação" e o emoji
// reforça a ação de calendarizar (mesma exceção à regra de no-emoji
// que usamos no 08.05 com 🎉).

const EVENT_TYPE_LABEL = {
  degustacao: 'Degustação',
  jantar:     'Jantar',
  festa:      'Festa',
  visita:     'Visita a vinícola',
};

const PAYMENT_LABEL = {
  free:  'Grátis',
  split: 'Rateio entre todos',
  fixed: 'Valor fixo por pessoa',
};

const RSVP_LABEL = {
  open:   'Aberto a todos da confraria',
  manual: 'Aprovação manual',
};

const EVENT_TYPE_GRADIENT = {
  degustacao: ['#C97D87', '#722F37'], // burgundy
  jantar:     ['#FCD34D', '#D97706'], // amber
  festa:      ['#F9A8D4', '#DB2777'], // pink
  visita:     ['#A5B4FC', '#4338CA'], // indigo
};

const EVENT_TYPE_GLYPH = {
  degustacao: 'wine_bar',
  jantar:     'restaurant',
  festa:      'celebration',
  visita:     'tour',
};

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    data: full event payload assembled from steps 1–4
//    onPublish: () => Promise<{ eventId: string }>
//    onBack: () => void
function WizardCriarEventoP5({ data, onPublish, onBack }) {
  const [publishing, setPublishing] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    setError(null);
    fbEvent('event_publish_submitted', {
      event_type: data.type,
      capacity: data.settings ? data.settings.capacity : null,
      total_wines: countWines(data.wines),
    });
    try {
      const result = await onPublish();
      fbEvent('event_published', { event_id: result && result.eventId });
    } catch (e) {
      fbEvent('event_publish_failed', { reason: (e && e.message) || 'unknown' });
      setPublishing(false);
      setError('Não conseguimos publicar agora. Tenta de novo.');
    }
  };

  const settings = data.settings || {};

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          disabled={publishing}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            cursor: publishing ? 'not-allowed' : 'pointer',
            color: publishing ? T.c.n400 : T.c.n950,
            opacity: publishing ? 0.5 : 1,
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
            Tudo pronto pra publicar?
          </h2>

          <div style={{ height: 24 }}/>

          {/* ── Resumo card ── */}
          <div style={{
            background: T.c.n50,
            border: `1px solid ${T.c.n200}`,
            borderRadius: T.r.lg,
            padding: 16,
          }}>
            {/* Cover */}
            <EventReviewCover type={data.type} name={data.name} cover={data.cover}/>

            <div style={{ height: 16 }}/>

            {/* Nome + tipo */}
            <div style={{
              fontFamily: T.font,
              fontSize: 18, lineHeight: 1.25, fontWeight: 700,
              color: T.c.n950,
              textWrap: 'balance',
            }}>
              {data.name || 'Sem nome'}
            </div>
            <div style={{
              fontFamily: T.font, fontSize: 12, lineHeight: 1.4, color: T.c.n800,
              marginTop: 4,
            }}>
              Tipo: <strong style={{ fontWeight: 600 }}>{EVENT_TYPE_LABEL[data.type] || data.type}</strong>
            </div>

            <div style={{ height: 12 }}/>

            {/* Quando + onde + vagas — info rows */}
            <SummaryRow icon="event" label={formatEventDate(data.date, data.time)}/>
            <SummaryRow
              icon={data.locationMode === 'online' ? 'link' : 'location_on'}
              label={data.locationText || '—'}
              clamp
            />
            <SummaryRow icon="groups" label={`${settings.capacity || '—'} vagas no total`}/>

            <Divider/>

            {/* Vinhos sugeridos */}
            <ReviewSubsection title="Vinhos sugeridos" badge={`${countWines(data.wines)}`}>
              {data.wines && data.wines.slots ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.wines.slots.flat().filter(Boolean).map((w, i) => (
                    <WineMiniCard key={`${w.id}-${i}`} wine={w}/>
                  ))}
                </div>
              ) : (
                <EmptyHint>Nenhum vinho sugerido.</EmptyHint>
              )}
            </ReviewSubsection>

            <Divider/>

            {/* Configurações */}
            <ReviewSubsection title="Configurações">
              <ConfigRow
                icon="person_add"
                label="Plus One"
                value={settings.plusOne
                  ? `${settings.plusOnePerMember} por membro`
                  : 'Desativado'}
                positive={Boolean(settings.plusOne)}
              />
              <ConfigRow
                icon="attach_money"
                label="Pagamento"
                value={PAYMENT_LABEL[settings.payment] || 'Grátis'}
                amount={settings.payment === 'fixed' ? `R$ ${settings.paymentAmount}` : null}
              />
              <ConfigRow
                icon="how_to_reg"
                label="RSVP"
                value={RSVP_LABEL[settings.rsvp] || 'Aberto'}
              />
              <ConfigRow
                icon="notifications"
                label="Lembretes"
                value={countReminders(settings.reminders) + ' de 4 ativos'}
              />
            </ReviewSubsection>
          </div>

          {/* Inline error */}
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
          loading={publishing}
          onClick={handlePublish}
          data-route="event_published">
          {publishing ? 'Publicando…' : '📅 Publicar evento'}
        </Button>
        <Button
          variant="ghost" size="md" fullWidth
          disabled={publishing}
          onClick={onBack}>
          Voltar e editar
        </Button>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────
function countWines(wines) {
  if (!wines || !wines.slots) return 0;
  return wines.slots.reduce((acc, tier) => acc + tier.filter(Boolean).length, 0);
}

function countReminders(reminders) {
  if (!reminders) return 0;
  return Object.values(reminders).filter(Boolean).length;
}

function formatEventDate(dateStr, time) {
  if (!dateStr) return time || '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  // Capitaliza primeira letra
  const dayCap = day.charAt(0).toUpperCase() + day.slice(1);
  return time ? `${dayCap}, ${time}` : dayCap;
}

// ─── EventReviewCover — usa a capa escolhida (#6) ou o tipo ─
function EventReviewCover({ type, name, cover }) {
  const c = getEventCover(cover, type);
  return (
    <div style={{
      position: 'relative',
      height: 100,
      borderRadius: T.r.md,
      background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
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
        <Icon name={c.glyph} size={44} color="#FFFFFF" fill={1}/>
      </div>
      <div style={{
        position: 'absolute', left: 10, bottom: 10,
        padding: '4px 10px',
        background: 'rgba(0,0,0,0.55)',
        borderRadius: T.r.full,
        fontFamily: T.font, fontSize: 10, fontWeight: 600,
        color: '#FFFFFF', letterSpacing: '0.4px',
        textTransform: 'uppercase',
      }}>
        Capa · {c.label}
      </div>
    </div>
  );
}

// ─── SummaryRow — icon + label ──────────────────────────────
function SummaryRow({ icon, label, clamp }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 0',
    }}>
      <Icon name={icon} size={18} color={T.c.n600} fill={1} style={{ flexShrink: 0 }}/>
      <span style={{
        fontFamily: T.font, fontSize: 14, fontWeight: 500,
        color: T.c.n950, lineHeight: 1.4, minWidth: 0,
        ...(clamp ? {
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        } : {}),
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── ReviewSubsection — eyebrow + content ───────────────────
function ReviewSubsection({ title, badge, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 10,
      }}>
        <div style={{
          fontFamily: T.font,
          fontSize: 11, fontWeight: 600, lineHeight: 1.4,
          color: T.c.n600,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {title}
        </div>
        {badge && (
          <div style={{
            padding: '1px 8px',
            background: T.c.n200, color: T.c.n800,
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            borderRadius: T.r.full,
          }}>
            {badge}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── WineMiniCard — compact 36px-tall card ──────────────────
function WineMiniCard({ wine }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: 8,
      background: T.c.n0,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.md,
    }}>
      <BottlePlaceholder width={28} height={38} label=""/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.font, fontSize: 12, fontWeight: 600,
          color: T.c.n950, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wine.name}
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 10, color: T.c.n600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wine.region || wine.country} · {wine.type}
        </div>
      </div>
      <div style={{
        fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.c.p700,
        flexShrink: 0,
      }}>
        R$ {wine.price.toFixed(2).replace('.', ',')}
      </div>
    </div>
  );
}

// ─── ConfigRow — icon + label + value (+ optional amount) ──
function ConfigRow({ icon, label, value, amount, positive }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 0',
      borderBottom: `1px solid ${T.c.n200}`,
    }}>
      <Icon name={icon} size={16} color={T.c.n600} style={{ flexShrink: 0 }}/>
      <div style={{
        fontFamily: T.font, fontSize: 12, fontWeight: 500,
        color: T.c.n800, lineHeight: 1.3, flexShrink: 0,
      }}>
        {label}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
          color: positive ? T.c.s700 : T.c.n950,
          lineHeight: 1.3, textAlign: 'right',
        }}>
          {value}
        </span>
        {amount && (
          <span style={{
            fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.c.p700,
          }}>
            · {amount}
          </span>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.c.n200, margin: '14px 0' }}/>;
}

function EmptyHint({ children }) {
  return (
    <div style={{
      fontFamily: T.font, fontSize: 13, lineHeight: 1.5,
      color: T.c.n600, fontStyle: 'italic',
    }}>
      {children}
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarEventoP5Screen({ go }) {
  const draft = React.useMemo(() => readEventDraft() || {}, []);

  const data = {
    name: draft.name || 'Evento sem nome',
    type: draft.type || 'degustacao',
    cover: draft.cover,
    date: draft.date,
    time: draft.time,
    locationMode: draft.locationMode || 'presencial',
    locationText: draft.locationText || '',
    wines: draft.wines,
    settings: draft.settings,
  };

  const onPublish = async () => {
    // Mock publish — em produção: POST /events + push setup + LACI link
    await new Promise(r => setTimeout(r, 1400));
    const id = 'evt_' + Math.random().toString(36).slice(2, 9);
    writeEventDraft(null); // clear draft on success

    // Atualiza a flag global pra confraria atual (primeiro evento criado)
    if (typeof window !== 'undefined' && window.__tcCurrentBrotherhood) {
      window.__tcCurrentBrotherhood = {
        ...window.__tcCurrentBrotherhood,
        firstEventScheduled: true,
        firstEventId: id,
      };
      // Dispara o tutorial pós-criação na próxima abertura da confraria
      window.__tcShouldShowBrotherhoodTutorial = true;
    }

    // Volta pra confraria com o evento publicado
    const brh = (typeof window !== 'undefined') ? window.__tcCurrentBrotherhood : null;
    if (brh) {
      const syntheticConfraria = {
        id: brh.id, name: brh.name,
        description: 'Confraria criada agora mesmo.',
        members: 1, activity: 'ativa',
        visibility: 'publica', modality: data.locationMode === 'online' ? 'online' : 'presencial',
        location: data.locationMode === 'online' ? null : (data.locationText || 'Brasília, DF'),
        tags: [],
        _justCreated: true, _isAdmin: true,
        _firstEvent: { id, ...data },
      };
      go('toast', { kind: 'success', message: 'Evento publicado!' });
      window.setTimeout(() => go('confraria-detalhe', { confraria: syntheticConfraria, justCreated: true }), 400);
    } else {
      go('toast', { kind: 'success', message: 'Evento publicado!' });
      window.setTimeout(() => go('confrarias'), 400);
    }
    return { eventId: id };
  };

  const onBack = () => go('back');

  return (
    <WizardCriarEventoP5
      data={data}
      onPublish={onPublish}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarEventoP5,
  WizardCriarEventoP5Screen,
  EVENT_TYPE_LABEL,
  PAYMENT_LABEL,
  RSVP_LABEL,
});


export { ConfigRow, Divider, EVENT_TYPE_GLYPH, EVENT_TYPE_GRADIENT, EVENT_TYPE_LABEL, EmptyHint, EventReviewCover, PAYMENT_LABEL, RSVP_LABEL, ReviewSubsection, SummaryRow, WineMiniCard, WizardCriarEventoP5, WizardCriarEventoP5Screen, countReminders, countWines, formatEventDate };
