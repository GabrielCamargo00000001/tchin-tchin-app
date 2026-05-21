/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { suggestWinesForEvent } from './screens-event-wizard-p3.jsx';
import { TEMPLATES } from './screens-wizard-confraria-p2.jsx';
import { FIRST_EVENT_TITLES, nextSaturdayLabel } from './screens-wizard-confraria-p6.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — 10.02–10.05 Família de Nudges pós-criação de confraria
// ────────────────────────────────────────────────────────────
// 4 telas disparadas por push em momentos específicos da vida da
// confraria. Cada uma tem um propósito narrativo distinto:
//
//   10.02 · NudgeD1   · 24h sem evento  → gentil, sugestão básica
//   10.03 · NudgeD3   · 72h sem evento  → concreto, com 3 vinhos pré-listados
//   10.04 · NudgeD7   · D-7 com <3 RSVPs → composer in-app pra cutucar a galera
//   10.05 · NudgeD14  · 14d sem ação    → 3 ideias pra destravar
//
// Regras de negócio (US-12-11-01..04):
//   - D1 não cobra de novo até D3
//   - Após 2 "não" (D1 + D3) o sistema para de cobrar
//   - D14 não se repete; após 30d sem ação, brotherhood.at_risk=true
//
// Estado é mock — em produção o backend agenda os pushes e o deep link
// abre a tela apropriada baseado em `nudge_kind` do payload.

// ════════════════════════════════════════════════════════════
// 10.02 — Nudge D1 (24h)
// ════════════════════════════════════════════════════════════

function NudgeD1({ brotherhoodName, templateName, onCreateEvent, onLater }) {
  React.useEffect(() => {
    fbEvent('nudge_d1_shown', { template_name: templateName });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    fbEvent('nudge_d1_accepted', { template_name: templateName });
    onCreateEvent();
  };
  const handleLater = () => {
    fbEvent('nudge_d1_dismissed', { template_name: templateName });
    onLater();
  };

  const tpl = TEMPLATES.find(t => t.name === templateName);
  const suggestionTitle = (FIRST_EVENT_TITLES && FIRST_EVENT_TITLES[templateName])
    || 'Primeiro encontro';
  const dateLabel = nextSaturdayLabel();

  return (
    <NudgeShell onClose={handleLater} closeLabel="Fechar e voltar pra Comunidade">
      <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <WaitingGlassesHero/>

        <div style={{ height: 24 }}/>

        <h2 style={{
          margin: 0,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 24, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.015em', color: T.c.n950,
          textAlign: 'center', textWrap: 'balance', maxWidth: 280,
        }}>
          Sua confraria está esperando
        </h2>

        <div style={{ height: 12 }}/>

        <p style={{
          margin: 0,
          fontFamily: T.font,
          fontSize: 15, lineHeight: 1.5, color: T.c.n800,
          textAlign: 'center', textWrap: 'pretty', maxWidth: 300,
        }}>
          Você criou a <strong style={{ color: T.c.n950 }}>{brotherhoodName || 'sua confraria'}</strong> ontem. Vamos marcar o primeiro encontro? A gente já tem uma sugestão baseada no seu tema.
        </p>

        <div style={{ height: 24 }}/>

        <NudgeSuggestionCard
          title={suggestionTitle}
          dateLabel={dateLabel}
          subline="3 vinhos sugeridos"
          gradient={tpl ? tpl.gradient : ['#C97D87', '#722F37']}
          glyph={tpl ? tpl.glyph : 'wine_bar'}
        />
      </div>

      <NudgeBottomCTAs
        primary={{ label: 'Criar primeiro evento', icon: 'arrow_forward', onClick: handleCreate }}
        secondary={{ label: 'Mais tarde', onClick: handleLater }}
      />
    </NudgeShell>
  );
}

// ════════════════════════════════════════════════════════════
// 10.03 — Nudge D3 (72h)
// ════════════════════════════════════════════════════════════

function NudgeD3({ brotherhoodName, templateName, suggestedWines, onCreateEvent, onLater }) {
  React.useEffect(() => {
    fbEvent('nudge_d3_shown', { template_name: templateName });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    fbEvent('nudge_d3_accepted', { template_name: templateName });
    onCreateEvent();
  };
  const handleLater = () => {
    fbEvent('nudge_d3_dismissed', { template_name: templateName });
    onLater();
  };

  const tpl = TEMPLATES.find(t => t.name === templateName);
  const themeLabel = templateName || 'do seu tema';
  const wines = (suggestedWines && suggestedWines.length)
    ? suggestedWines.slice(0, 3)
    : (suggestWinesForEvent('degustacao').flat().filter(Boolean).slice(0, 3));

  return (
    <NudgeShell onClose={handleLater}>
      <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ThemeHero gradient={tpl ? tpl.gradient : ['#C97D87', '#722F37']} glyph={tpl ? tpl.glyph : 'wine_bar'}/>

        <div style={{ height: 24 }}/>

        <h2 style={{
          margin: 0,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 24, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.015em', color: T.c.n950,
          textAlign: 'center', textWrap: 'balance', maxWidth: 280,
        }}>
          Que tal essa ideia?
        </h2>

        <div style={{ height: 16 }}/>

        <div style={{
          fontFamily: T.font, fontSize: 11, fontWeight: 700,
          color: T.c.p700, letterSpacing: '0.6px', textTransform: 'uppercase',
        }}>
          Sugestão baseada no seu tema
        </div>
        <div style={{ height: 8 }}/>
        <div style={{
          fontFamily: T.font, fontSize: 16, lineHeight: 1.35, fontWeight: 700,
          color: T.c.n950, textAlign: 'center', textWrap: 'balance',
          maxWidth: 300,
        }}>
          Degustação de {themeLabel} no próximo sábado, 19h
        </div>

        <div style={{ height: 20 }}/>

        {/* 3 wine mini-cards */}
        <div style={{
          width: '100%',
          background: T.c.n50,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.lg,
          padding: 14,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wines.map((w, i) => (
              <div key={`${w.id}-${i}`} style={{
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
                    {w.name}
                  </div>
                  <div style={{
                    fontFamily: T.font, fontSize: 10, color: T.c.n600,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {w.region || w.country} · {w.type}
                  </div>
                </div>
                <div style={{
                  fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.c.p700,
                  flexShrink: 0,
                }}>
                  R$ {w.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, paddingTop: 10,
            borderTop: `1px solid ${T.c.n200}`,
            fontFamily: T.font, fontSize: 12, lineHeight: 1.4,
            color: T.c.n600, textAlign: 'center',
          }}>
            Esses 3 vinhos do seu template ficam bem juntos.
          </div>
        </div>
      </div>

      <NudgeBottomCTAs
        primary={{ label: 'Topa? Criar evento agora', icon: 'arrow_forward', onClick: handleCreate }}
        secondary={{ label: 'Não, vou pensar', onClick: handleLater }}
      />
    </NudgeShell>
  );
}

// ════════════════════════════════════════════════════════════
// 10.04 — Nudge D7 (composer "Mando lembrete pra galera?")
// ════════════════════════════════════════════════════════════

const COMPOSER_MAX = 280;

function NudgeD7({ eventName, eventDate, daysUntil, confirmedCount, onSend, onCancel }) {
  // Pre-fill da mensagem
  const defaultMessage = composeReminderMessage(eventName, eventDate);
  const [message, setMessage] = React.useState(defaultMessage);
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    fbEvent('nudge_d7_shown', { event_name: eventName, confirmed_count: confirmedCount });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (v) => setMessage(v.slice(0, COMPOSER_MAX));

  const handleSend = async () => {
    if (sending || !message.trim()) return;
    setSending(true);
    fbEvent('nudge_d7_message_sent', { event_name: eventName, message_length: message.length });
    try {
      await onSend(message.trim());
    } catch (e) {
      setSending(false);
    }
  };

  return (
    <NudgeShell title="Mensagem pra galera" onClose={onCancel}>
      <div style={{ padding: '20px 24px 0' }}>
        <p style={{
          margin: 0,
          fontFamily: T.font,
          fontSize: 15, lineHeight: 1.5, color: T.c.n800,
          textWrap: 'pretty',
        }}>
          Seu evento <strong style={{ color: T.c.n950 }}>"{eventName || 'sem nome'}"</strong> tá em{' '}
          <strong style={{ color: T.c.n950 }}>{daysUntil || 7} dias</strong> com apenas{' '}
          <strong style={{ color: T.c.p700 }}>{confirmedCount || 0} confirmados</strong>.{' '}
          Que tal mandar um lembrete?
        </p>

        <div style={{ height: 16 }}/>

        {/* Composer textarea */}
        <ComposerField
          value={message}
          onChange={onChange}
          maxLength={COMPOSER_MAX}
        />

        <div style={{ height: 16 }}/>

        {/* Preview */}
        <div>
          <div style={{
            fontFamily: T.font,
            fontSize: 11, fontWeight: 600, lineHeight: 1.4,
            color: T.c.n600, marginBottom: 8, paddingLeft: 4,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Como vai aparecer
          </div>
          <FeedPostPreview message={message.trim() || '…'}/>
        </div>

        <div style={{ height: 24 }}/>
      </div>

      <NudgeBottomCTAs
        primary={{
          label: sending ? 'Enviando…' : 'Enviar pra galera',
          icon: !sending && 'send',
          loading: sending,
          disabled: !message.trim(),
          onClick: handleSend,
        }}
        secondary={{ label: 'Cancelar', onClick: onCancel, disabled: sending }}
      />
    </NudgeShell>
  );
}

// Helper: gera o pre-fill da mensagem D7 com o nome do evento e dia da semana
function composeReminderMessage(eventName, eventDate) {
  let weekday = 'sábado';
  if (eventDate) {
    try {
      const [y, m, d] = eventDate.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      weekday = dt.toLocaleDateString('pt-BR', { weekday: 'long' });
    } catch (e) {}
  }
  const cleanName = eventName ? `"${eventName}"` : 'nosso encontro';
  return `Pessoal, lembrando que ${weekday} tem ${cleanName}. Quem vai? Confirma aí pra gente fechar número 🍷`;
}

function ComposerField({ value, onChange, maxLength }) {
  const [focused, setFocused] = React.useState(false);
  const len = value.length;
  const nearLimit = len > maxLength * 0.9;

  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: 11, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n800, marginBottom: 8, paddingLeft: 4,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        Sua mensagem
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
          rows={4}
          maxLength={maxLength}
          style={{
            width: '100%', padding: '14px 16px 28px',
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font,
            fontSize: 15, lineHeight: 1.5, color: T.c.n950,
            resize: 'vertical', minHeight: 96, maxHeight: 180,
            boxSizing: 'border-box',
          }}
        />
        <span style={{
          position: 'absolute', right: 12, bottom: 6,
          fontFamily: T.mono, fontSize: 11, fontWeight: 500,
          color: nearLimit ? T.c.w700 : T.c.n400,
          pointerEvents: 'none',
        }}>
          {len}/{maxLength}
        </span>
      </div>
    </div>
  );
}

function FeedPostPreview({ message }) {
  return (
    <div style={{
      background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg,
      padding: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: T.c.p700, color: T.c.n0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.font, fontSize: 14, fontWeight: 700,
          flexShrink: 0,
        }}>
          {(window.MOCK_USER && window.MOCK_USER.initials) || 'AB'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.c.n950 }}>
            {(window.MOCK_USER && window.MOCK_USER.name) || 'Você'} <span style={{ color: T.c.p700, fontSize: 11, fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>· admin</span>
          </div>
          <div style={{ fontFamily: T.font, fontSize: 11, color: T.c.n600 }}>
            agora · lembrete do organizador
          </div>
        </div>
      </div>
      <div style={{
        fontFamily: T.font, fontSize: 13, lineHeight: 1.5, color: T.c.n950,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {message}
      </div>
      <div style={{
        marginTop: 12, paddingTop: 10,
        borderTop: `1px solid ${T.c.n100}`,
        display: 'flex', gap: 16,
        fontFamily: T.font, fontSize: 12, color: T.c.n600,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="favorite_border" size={14}/> Curtir
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="chat_bubble_outline" size={14}/> Comentar
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="notifications_active" size={14} color={T.c.p700}/>
          <span style={{ color: T.c.p700, fontWeight: 600 }}>Push pra todos</span>
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 10.05 — Nudge D14 (3 ações)
// ════════════════════════════════════════════════════════════

function NudgeD14({ brotherhoodName, onCreateEvent, onComposePost, onInviteFriends, onDismiss }) {
  React.useEffect(() => {
    fbEvent('nudge_d14_shown', { brotherhood_name: brotherhoodName });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = (kind, fn) => {
    fbEvent('nudge_d14_action_selected', { action: kind });
    fn();
  };
  const handleDismiss = () => {
    fbEvent('nudge_d14_dismissed');
    onDismiss();
  };

  const ACTIONS = [
    {
      id: 'create_event',
      icon: 'event',
      title: 'Criar evento',
      body: 'Um encontro real faz a confraria existir. Sugestão pré-pronta com 3 vinhos.',
      onClick: () => handleAction('create_event', onCreateEvent),
    },
    {
      id: 'compose_post',
      icon: 'edit_note',
      title: 'Fazer primeiro post',
      body: 'Um "Bem-vindos" curto pra galera saber que o canal tá ativo.',
      onClick: () => handleAction('compose_post', onComposePost),
    },
    {
      id: 'invite_friends',
      icon: 'person_add',
      title: 'Convidar mais 3 amigos',
      body: 'Grupo com 6+ membros tem 3× mais chance de fazer evento.',
      onClick: () => handleAction('invite_friends', onInviteFriends),
    },
  ];

  return (
    <NudgeShell onClose={handleDismiss}>
      <div style={{ padding: '32px 24px 0' }}>
        <TumbleweedHero/>

        <div style={{ height: 24 }}/>

        <h2 style={{
          margin: 0,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 24, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.015em', color: T.c.n950,
          textAlign: 'center', textWrap: 'balance',
        }}>
          Sua confraria tá quieta 🍷
        </h2>

        <div style={{ height: 12 }}/>

        <p style={{
          margin: 0,
          fontFamily: T.font,
          fontSize: 15, lineHeight: 1.5, color: T.c.n800,
          textAlign: 'center', textWrap: 'pretty',
        }}>
          Aqui vão 3 ideias pra começar:
        </p>

        <div style={{ height: 24 }}/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ACTIONS.map(a => (
            <ActionCard key={a.id} {...a}/>
          ))}
        </div>

        <div style={{ height: 24 }}/>
      </div>

      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        background: T.c.n0, flexShrink: 0,
      }}>
        <Button variant="ghost" size="md" fullWidth onClick={handleDismiss}>
          Não preciso de ideias agora
        </Button>
      </div>
    </NudgeShell>
  );
}

function ActionCard({ icon, title, body, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: 14,
        background: T.c.n0, border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg, cursor: 'pointer',
        textAlign: 'left', fontFamily: T.font,
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: T.r.md, flexShrink: 0,
        background: T.c.p50, border: `1px solid ${T.c.p100}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={22} color={T.c.p700} fill={1}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.font, fontSize: 14, fontWeight: 700,
          color: T.c.n950, lineHeight: 1.3,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 12, lineHeight: 1.4, color: T.c.n800,
          marginTop: 2,
        }}>
          {body}
        </div>
      </div>
      <Icon name="chevron_right" size={20} color={T.c.n400} style={{ flexShrink: 0 }}/>
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// Shared shell + heroes + CTA primitives
// ════════════════════════════════════════════════════════════

// Shared takeover shell — close X (top-right), scrollable body, fixed CTAs
function NudgeShell({ title, onClose, closeLabel, children }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: T.c.n0, position: 'relative', overflow: 'hidden',
      animation: 'tcFadeIn 260ms ease',
    }}>
      {title ? (
        <header style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
        }}>
          <button onClick={onClose} aria-label="Fechar"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950,
            }}>
            <Icon name="close" size={24}/>
          </button>
          <div style={{
            flex: 1,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 17, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
          }}>
            {title}
          </div>
          <div style={{ width: 44, flexShrink: 0 }}/>
        </header>
      ) : (
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <button onClick={onClose} aria-label={closeLabel || 'Fechar'}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n800,
            }}>
            <Icon name="close" size={24}/>
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function NudgeBottomCTAs({ primary, secondary }) {
  return (
    <div style={{
      padding: '12px 24px 24px',
      paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      display: 'flex', flexDirection: 'column', gap: 12,
      background: T.c.n0, flexShrink: 0,
    }}>
      <Button
        variant="primary" size="lg" fullWidth
        loading={primary.loading}
        disabled={primary.disabled}
        onClick={primary.onClick}
        trailing={primary.icon ? <Icon name={primary.icon} size={18}/> : null}>
        {primary.label}
      </Button>
      <Button variant="ghost" size="md" fullWidth
        disabled={secondary.disabled}
        onClick={secondary.onClick}>
        {secondary.label}
      </Button>
    </div>
  );
}

// ─── Hero: Waiting glasses (D1) ─────────────────────────────
function WaitingGlassesHero() {
  return (
    <div style={{
      width: 160, height: 160,
      background: T.c.p50,
      borderRadius: T.r.lg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Subtle diagonal */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(114,47,55,0.4) 0 1px, transparent 1px 14px)',
      }}/>
      {/* 3 wine glasses */}
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" style={{ position: 'relative' }}>
        {[20, 60, 100].map((cx, i) => (
          <g key={i} style={{ animation: `tcGlassWiggle 2400ms ease-in-out ${i * 300}ms infinite` }}>
            <path
              d={`M${cx - 12} 10 Q${cx - 12} 38 ${cx} 44 L${cx} 70 L${cx - 8} 70 L${cx - 8} 76 L${cx + 8} 76 L${cx + 8} 70 L${cx} 70 L${cx} 44 Q${cx + 12} 38 ${cx + 12} 10 Z`}
              fill="rgba(255,255,255,0.95)"
              stroke={T.c.p700}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Wine fill */}
            <path
              d={`M${cx - 10} 14 L${cx + 10} 14 Q${cx + 10} 32 ${cx} 36 Q${cx - 10} 32 ${cx - 10} 14 Z`}
              fill={T.c.p700} opacity="0.75"
            />
          </g>
        ))}
      </svg>
      {/* Inject the wiggle keyframes once */}
      <style>{`@keyframes tcGlassWiggle { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }`}</style>
    </div>
  );
}

// ─── Hero: Theme-themed (D3) ────────────────────────────────
function ThemeHero({ gradient, glyph }) {
  return (
    <div style={{
      width: 160, height: 160,
      borderRadius: T.r.lg,
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 14px)',
      }}/>
      <Icon name={glyph} size={72} color="#FFFFFF" fill={1}/>
    </div>
  );
}

// ─── Hero: Tumbleweed quiet (D14) — sutil, sem julgar ───────
function TumbleweedHero() {
  return (
    <div style={{
      width: '100%',
      height: 140,
      background: T.c.n100,
      borderRadius: T.r.lg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Soft ground line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 36, height: 1,
        background: T.c.n300, opacity: 0.6,
      }}/>
      {/* Cactus silhouette + tumbleweed */}
      <svg width="220" height="120" viewBox="0 0 220 120" fill="none" style={{ position: 'absolute', bottom: 0 }}>
        {/* Cactus */}
        <g opacity="0.4">
          <rect x="178" y="50" width="10" height="50" rx="5" fill={T.c.n600}/>
          <rect x="174" y="62" width="6" height="20" rx="3" fill={T.c.n600}/>
          <rect x="186" y="58" width="6" height="24" rx="3" fill={T.c.n600}/>
        </g>
        {/* Tumbleweed rolling */}
        <g style={{ animation: 'tcTumbleRoll 4s linear infinite' }}>
          <circle cx="40" cy="86" r="18" stroke={T.c.n600} strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M 28 78 L 52 96 M 22 86 L 58 86 M 28 96 L 52 78 M 40 68 L 40 104" stroke={T.c.n600} strokeWidth="1.5" opacity="0.5"/>
        </g>
      </svg>
      {/* Wine glass — small, lonely on a 'counter' */}
      <svg width="32" height="56" viewBox="0 0 32 56" fill="none" style={{ position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', opacity: 0.55 }}>
        <path
          d="M6 4 Q6 26 14 30 L14 48 L8 48 L8 52 L24 52 L24 48 L18 48 L18 30 Q26 26 26 4 Z"
          fill="none" stroke={T.c.n800} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 6 L24 6 Q23 18 16 20 Q9 18 8 6 Z" fill={T.c.p700} opacity="0.5"/>
      </svg>
      <style>{`@keyframes tcTumbleRoll {
        0% { transform: translateX(0) rotate(0deg); }
        100% { transform: translateX(180px) rotate(360deg); }
      }`}</style>
    </div>
  );
}

// ─── Suggestion card (shared by D1) ─────────────────────────
function NudgeSuggestionCard({ title, dateLabel, subline, gradient, glyph }) {
  return (
    <div style={{
      width: '100%',
      background: T.c.n50,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      padding: 0,
      overflow: 'hidden',
    }}>
      {/* Optional themed strip */}
      <div style={{
        height: 8,
        background: `linear-gradient(90deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}/>
      <div style={{ padding: 16 }}>
        <div style={{
          fontFamily: T.font,
          fontSize: 11, fontWeight: 600, lineHeight: 1.4,
          color: T.c.n600, marginBottom: 4,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          Sugestão
        </div>
        <div style={{
          fontFamily: T.font,
          fontSize: 15, lineHeight: 1.3, fontWeight: 700,
          color: T.c.n950, marginBottom: 12,
          textWrap: 'balance',
        }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Icon name="calendar_today" size={18} color={T.c.p700}/>
          <span style={{
            fontFamily: T.font, fontSize: 14, fontWeight: 500,
            color: T.c.n950, lineHeight: 1.4,
          }}>
            {dateLabel}
          </span>
        </div>
        {subline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="wine_bar" size={18} color={T.c.p700}/>
            <span style={{
              fontFamily: T.font, fontSize: 14, fontWeight: 500,
              color: T.c.n950, lineHeight: 1.4,
            }}>
              {subline}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Prototype wrappers — connect to go() and clear nudge state
// ════════════════════════════════════════════════════════════

function NudgeD1Screen({ go, params = {} }) {
  const brh = (typeof window !== 'undefined') ? window.__tcCurrentBrotherhood : null;
  const brotherhoodName = params.brotherhoodName || (brh && brh.name) || 'sua confraria';
  const templateName    = params.templateName || (brh && brh.template_name) || 'Churrasco & Vinho';
  const templateId      = (brh && brh.template_id) || 'churrasco_vinho';
  return (
    <NudgeD1
      brotherhoodName={brotherhoodName}
      templateName={templateName}
      onCreateEvent={() => go('event-wizard-1', { template_id: templateId, fromNudge: 'd1' })}
      onLater={() => go('comunidade')}
    />
  );
}

function NudgeD3Screen({ go, params = {} }) {
  const brh = (typeof window !== 'undefined') ? window.__tcCurrentBrotherhood : null;
  const brotherhoodName = params.brotherhoodName || (brh && brh.name) || 'sua confraria';
  const templateName    = params.templateName || (brh && brh.template_name) || 'Churrasco & Vinho';
  const templateId      = (brh && brh.template_id) || 'churrasco_vinho';
  const suggestedWines  = suggestWinesForEvent('jantar').flat().filter(Boolean);
  return (
    <NudgeD3
      brotherhoodName={brotherhoodName}
      templateName={templateName}
      suggestedWines={suggestedWines}
      onCreateEvent={() => go('event-wizard-1', { template_id: templateId, fromNudge: 'd3' })}
      onLater={() => go('comunidade')}
    />
  );
}

function NudgeD7Screen({ go, params = {} }) {
  return (
    <NudgeD7
      eventName={params.eventName || 'Primeiro encontro'}
      eventDate={params.eventDate || '2026-05-30'}
      daysUntil={params.daysUntil || 7}
      confirmedCount={params.confirmedCount ?? 2}
      onSend={async (message) => {
        await new Promise(r => setTimeout(r, 900));
        go('toast', { kind: 'success', message: 'Mensagem enviada · push disparado pra galera.' });
        window.setTimeout(() => go('comunidade'), 400);
      }}
      onCancel={() => go('back')}
    />
  );
}

function NudgeD14Screen({ go, params = {} }) {
  const brh = (typeof window !== 'undefined') ? window.__tcCurrentBrotherhood : null;
  const brotherhoodName = params.brotherhoodName || (brh && brh.name) || 'sua confraria';
  return (
    <NudgeD14
      brotherhoodName={brotherhoodName}
      onCreateEvent={() => go('event-wizard-1', { fromNudge: 'd14' })}
      onComposePost={() => go('toast', { kind: 'info', message: 'Abrindo composer de post…' })}
      onInviteFriends={() => go('toast', { kind: 'info', message: 'Abrindo convites…' })}
      onDismiss={() => go('comunidade')}
    />
  );
}

Object.assign(window, {
  NudgeD1, NudgeD3, NudgeD7, NudgeD14,
  NudgeD1Screen, NudgeD3Screen, NudgeD7Screen, NudgeD14Screen,
  composeReminderMessage,
});


export { ActionCard, COMPOSER_MAX, ComposerField, FeedPostPreview, NudgeBottomCTAs, NudgeD1, NudgeD14, NudgeD14Screen, NudgeD1Screen, NudgeD3, NudgeD3Screen, NudgeD7, NudgeD7Screen, NudgeShell, NudgeSuggestionCard, ThemeHero, TumbleweedHero, WaitingGlassesHero, composeReminderMessage };
