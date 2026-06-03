/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_CONFRARIAS, MOCK_EVENTS, MOCK_WINES } from './data.jsx';
import { getEventCover } from './event-covers.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// EventDetalheScreen — detalhe de evento dentro do app
//
// Acessado de:
//   - ConfrariaDetalheScreen → aba "Eventos" → tap em EventCard
//   - ConfrariasScreen → aba "Eventos" → tap em EventCard
//   - ProfileDrawer → "Meus eventos"
//
// Props:
//   <EventDetalheScreen event={...} brotherhood={...} go={go}/>
//
// Mostra: hero data + título, RSVP one-tap, anfitrião, local,
// "quem vai" inline, ficha de degustação, etc.
// ─────────────────────────────────────────────────────────────

function EventDetalheScreen({ event, brotherhood, go }) {
  const ev = event || (typeof MOCK_EVENTS !== 'undefined' ? MOCK_EVENTS[0] : {
    id: 0, title: 'Evento', date: '2026-05-18', time: '19h30',
    location: 'Local a definir', participants: 0, modality: 'presencial', joined: false,
  });
  const conf = brotherhood || (typeof MOCK_CONFRARIAS !== 'undefined' ? MOCK_CONFRARIAS[0] : { name: 'Confraria' });
  const [rsvp, setRsvp] = React.useState(ev.joined ? 'going' : null);
  const [showShareToast, setShowShareToast] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isOrganizer = ev.organizerSelf === true || (conf && conf._isAdmin === true);
  const isPast = new Date(ev.date + 'T00:00:00') < new Date();
  const cover = getEventCover(ev.cover, ev.type); // capa escolhida (#6) ou padrão por tipo

  const d = new Date(ev.date + 'T00:00:00');
  const weekday = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'][d.getDay()];
  const day = d.getDate();
  const monthFull = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'][d.getMonth()];
  const monthAbbr = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][d.getMonth()];

  const sampleAttendees = [
    { name: 'Carla Mendes',     initials: 'CM', level: 'expert' },
    { name: 'Diego Reis',       initials: 'DR', level: 'intermediario' },
    { name: 'Fernando Medrado', initials: 'FM', level: 'intermediario' },
    { name: 'Helena Britto',    initials: 'HB', level: 'iniciante' },
    { name: 'João Bernardes',   initials: 'JB', level: 'intermediario' },
  ];
  const visibleAttendees = sampleAttendees.slice(0, 4);
  const remaining = Math.max(0, (ev.participants || sampleAttendees.length) - visibleAttendees.length);

  const handleRsvp = (choice) => {
    setRsvp(choice);
    if (choice === 'going') {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2200);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      {/* Top bar with back + share */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n100}`,
        flexShrink: 0,
      }}>
        <button onClick={() => go('back')} aria-label="Voltar" style={{
          width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="arrow_back" size={22} color={T.c.n950}/>
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button aria-label="Compartilhar" style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }} onClick={() => { setShowShareToast(true); setTimeout(() => setShowShareToast(false), 1800); }}>
            <Icon name="share" size={22} color={T.c.n800}/>
          </button>
          <button aria-label="Mais" onClick={() => setMenuOpen(true)} style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icon name="more_horiz" size={22} color={T.c.n800}/>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        {/* Hero — capa do evento (#6): gradiente escolhido + motivo */}
        <div style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${cover.from} 0%, ${cover.to} 100%)`,
          color: T.c.n0, padding: '28px 20px 32px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)`,
          }}/>
          <div style={{
            position: 'absolute', right: 12, top: 10, opacity: 0.22, pointerEvents: 'none',
          }}>
            <Icon name={cover.glyph} size={72} color="#FFFFFF" fill={1}/>
          </div>
          {/* Date pill + modality */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: T.r.full,
              background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)',
              fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>
              <Icon name="event" size={14} color={T.c.n0}/>
              {weekday}, {day} {monthAbbr}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: T.r.full,
              background: 'rgba(255,255,255,0.16)',
              fontSize: 11, fontWeight: 600,
            }}>
              <Icon name={ev.modality === 'online' ? 'videocam' : 'location_on'} size={14} color={T.c.n0}/>
              {ev.modality === 'online' ? 'Online' : 'Presencial'}
            </div>
          </div>

          {/* Title — serif */}
          <h1 style={{
            margin: 0, position: 'relative',
            fontFamily: '"Fraunces", "Georgia", serif',
            fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em',
            lineHeight: 1.15, color: T.c.n0, textWrap: 'balance',
          }}>{ev.title}</h1>

          {/* Brotherhood breadcrumb */}
          {conf && conf.name && (
            <button onClick={() => go('confraria-detalhe', { confraria: conf })} style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: 0, background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500, position: 'relative',
            }}>
              <Icon name="groups" size={14} color="rgba(255,255,255,0.85)"/>
              {conf.name}
              <Icon name="chevron_right" size={16} color="rgba(255,255,255,0.6)"/>
            </button>
          )}
        </div>

        {/* RSVP one-tap row */}
        <div data-tour-anchor="evento-rsvp" style={{ padding: '16px 20px 8px', borderBottom: `1px solid ${T.c.n100}` }}>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>VOCÊ VAI?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'going',  icon: 'check_circle',     label: 'Confirmar',     active: T.c.s700, bg: T.c.s100 },
              { id: 'maybe',  icon: 'help_outline',     label: 'Talvez',        active: T.c.a700, bg: T.c.a100 },
              { id: 'no',     icon: 'cancel',           label: 'Não vou',       active: T.c.n800, bg: T.c.n100 },
            ].map(opt => {
              const selected = rsvp === opt.id;
              return (
                <button key={opt.id} onClick={() => handleRsvp(opt.id)} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 4px', borderRadius: T.r.md,
                  background: selected ? opt.bg : T.c.n0,
                  border: `1.5px solid ${selected ? opt.active : T.c.n200}`,
                  color: selected ? opt.active : T.c.n800,
                  cursor: 'pointer', fontFamily: T.font, fontSize: 12, fontWeight: 600,
                  transition: 'all 150ms',
                }}>
                  <Icon name={opt.icon} size={20} color={selected ? opt.active : T.c.n600}/>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes — onde, quando, anfitrião */}
        <EvDtSection title="Detalhes">
          <EvDtDetailRow icon="schedule" label="Quando">
            <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{weekday[0].toUpperCase()+weekday.slice(1)}, {day} de {monthFull}</div>
            <div style={{ ...T.t.caption, color: T.c.n600 }}>às {ev.time}</div>
          </EvDtDetailRow>
          <EvDtDetailRow icon={ev.modality === 'online' ? 'videocam' : 'location_on'} label="Onde">
            <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{ev.location}</div>
            {ev.modality !== 'online' && <div style={{ ...T.t.caption, color: T.c.n600 }}>Endereço completo será enviado 24h antes.</div>}
          </EvDtDetailRow>
          <EvDtDetailRow icon="person" label="Anfitrião">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name="Carla Mendes" size={32} level="expert"/>
              <div>
                <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>Carla Mendes</div>
                <div style={{ ...T.t.caption, color: T.c.n600 }}>Expert · organiza desde 2024</div>
              </div>
            </div>
          </EvDtDetailRow>
          {/* Valor + taxa — sempre visível antes do CTA (Gabriel jun/2026) */}
          {(ev.paid !== false) && (
            <EvDtDetailRow icon="payments" label="Valor">
              <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>
                R$ {(ev.price || 80).toFixed(2)} <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400 }}>por pessoa</span>
              </div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
                + taxa Tchin Tchin: PIX <strong>R$ 1,20</strong> · Cartão <strong>4%</strong> · Combinar com admin <strong>sem taxa</strong>
              </div>
            </EvDtDetailRow>
          )}
        </EvDtSection>

        {/* Quem vai */}
        <div data-tour-anchor="evento-quem-vai">
        <EvDtSection title={`Quem vai (${ev.participants || sampleAttendees.length})`} action={{ label: 'Ver todos', onClick: () => go('evento-presenca', { event: ev }) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
            <div style={{ display: 'flex' }}>
              {visibleAttendees.map((a, i) => (
                <div key={a.name} style={{ marginLeft: i === 0 ? 0 : -8, border: `2px solid ${T.c.n0}`, borderRadius: '50%' }}>
                  <Avatar name={a.name} size={36} level={a.level}/>
                </div>
              ))}
              {remaining > 0 && (
                <div style={{
                  marginLeft: -8, width: 36, height: 36, borderRadius: '50%',
                  background: T.c.n100, border: `2px solid ${T.c.n0}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: T.c.n800,
                }}>+{remaining}</div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {visibleAttendees.slice(0, 3).map(a => (
              <button key={a.name} onClick={() => go('perfil-outro', { user: a })} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}>
                <Avatar name={a.name} size={32} level={a.level}/>
                <div style={{ flex: 1 }}>
                  <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600 }}>{a.level === 'expert' ? 'Expert' : a.level === 'intermediario' ? 'Intermediário' : 'Iniciante'}</div>
                </div>
                <Icon name="chevron_right" size={18} color={T.c.n400}/>
              </button>
            ))}
          </div>
        </EvDtSection>
        </div>

        {/* Vinhos sugeridos */}
        <EvDtSection title="Vinhos sugeridos" action={{ label: 'Kit do organizador', onClick: () => go('toast', { kind: 'info', message: 'Em breve: kit do organizador.' }) }}>
          <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 10 }}>
            A anfitriã sugere trazer um destes — combine no chat pra não repetir.
          </div>
          {(typeof MOCK_WINES !== 'undefined' ? MOCK_WINES.slice(0, 2) : []).map(w => (
            <button key={w.id} onClick={() => go('wine', { wine: w })} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              background: 'none', border: 'none', borderTop: `1px solid ${T.c.n100}`,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 40, height: 56, borderRadius: 4,
                background: `linear-gradient(180deg, ${T.c.p500} 0%, ${T.c.p900} 100%)`,
                flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                <div style={{ ...T.t.caption, color: T.c.n600 }}>{w.region} · {w.country}</div>
              </div>
              <Icon name="chevron_right" size={18} color={T.c.n400}/>
            </button>
          ))}
        </EvDtSection>

        {/* Sobre */}
        <EvDtSection title="Sobre o evento">
          <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>
            {ev.modality === 'online'
              ? 'Encontro virtual aberto a todos os membros da confraria. Traga sua taça, abra um vinho da sua adega e bora trocar impressões pelo link.'
              : 'Encontro presencial — degustação às cegas de 4 a 6 garrafas. Traga uma garrafa envolta em papel kraft. Tira-gosto por conta da casa.'}
          </div>
        </EvDtSection>

        {/* Lembretes */}
        <EvDtSection title="Lembretes">
          <EvDtReminderRow icon="notifications_active" text="Avisar 1 dia antes" onClick={() => go('toast', { kind: 'success', message: 'Vamos te lembrar 1 dia antes.' })}/>
          <EvDtReminderRow icon="calendar_month" text="Adicionar à agenda" onClick={() => go('toast', { kind: 'success', message: 'Evento adicionado à sua agenda.' })}/>
          {ev.modality !== 'online' && <EvDtReminderRow icon="directions" text="Como chegar (Google Maps)" onClick={() => go('toast', { kind: 'info', message: 'Abrindo no Maps...' })}/>}
        </EvDtSection>
      </div>

      {/* Sticky CTA */}
      <div data-tour-anchor="evento-chat" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 16px 16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: T.c.n0, borderTop: `1px solid ${T.c.n200}`,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}>
        {rsvp === 'going' ? (
          isPast ? (
            <Button variant="primary" size="lg" fullWidth onClick={() => go('evento-pos-avaliar', { event: ev })} leading={<Icon name="star" size={18}/>}>
              Avaliar vinhos do evento
            </Button>
          ) : (
            <Button variant="secondary" size="lg" fullWidth onClick={() => go('chat-conversa', { chat: { id: 'ev-' + (ev.id || 'x'), name: ev.title, type: 'group', members: ev.participants || 6 } })} leading={<Icon name="chat_bubble_outline" size={18}/>}>
              Abrir chat do evento
            </Button>
          )
        ) : (
          <Button variant="primary" size="lg" fullWidth onClick={() => handleRsvp('going')} trailing={<Icon name="arrow_forward" size={18}/>}>
            Confirmar presença
          </Button>
        )}
      </div>

      {/* Share toast */}
      {showShareToast && (
        <div style={{
          position: 'absolute', bottom: 96, left: 16, right: 16, zIndex: 50,
          padding: '12px 16px', background: T.c.n950, color: T.c.n0,
          borderRadius: T.r.md, fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'tcSlideUp 220ms ease-out',
        }}>
          <Icon name="check_circle" size={18} color={T.c.s100}/>
          {rsvp === 'going' ? 'Você confirmou presença! Te aviso 1 dia antes.' : 'Link copiado pra compartilhar.'}
        </div>
      )}

      {/* Menu sheet */}
      {menuOpen && (
        <EventMenuSheet
          event={ev}
          isOrganizer={isOrganizer}
          isPast={isPast}
          onClose={() => setMenuOpen(false)}
          go={(s, p) => { setMenuOpen(false); setTimeout(() => go(s, p), 50); }}
        />
      )}
    </div>
  );
}

function EventMenuSheet({ event, isOrganizer, isPast, onClose, go }) {
  const organizerLive = [
    { icon: 'edit',           label: 'Editar evento',         onClick: () => go('evento-editar', { event }) },
    { icon: 'people',         label: 'Inscritos e pagamentos', onClick: () => go('evento-presenca', { event }) },
    { icon: 'group_add',      label: 'Convidar mais pessoas', onClick: () => go('toast', { variant: 'info', message: 'Link de convite copiado.' }) },
    { icon: 'chat',           label: 'Abrir chat do evento',  onClick: () => go('chat-conversa', { chat: { id: 'ev-' + (event.id || 'x'), name: event.title, type: 'group', members: event.participants || 6 } }) },
    { icon: 'event_busy',     label: 'Cancelar evento',       danger: true, onClick: () => go('evento-editar', { event }) },
  ];
  const organizerPast = [
    { icon: 'star',           label: 'Avaliar vinhos',         onClick: () => go('evento-pos-avaliar', { event }) },
    { icon: 'auto_awesome',   label: 'Publicar ata no mural',  onClick: () => go('evento-pos-ata', { event }) },
    { icon: 'people',         label: 'Quem foi (lista final)', onClick: () => go('evento-presenca', { event }) },
    { icon: 'event_repeat',   label: 'Marcar próximo encontro',onClick: () => go('event-wizard-1') },
  ];
  const participantLive = [
    { icon: 'chat',           label: 'Abrir chat do evento',   onClick: () => go('chat-conversa', { chat: { id: 'ev-' + (event.id || 'x'), name: event.title, type: 'group', members: event.participants || 6 } }) },
    { icon: 'calendar_month', label: 'Adicionar à agenda',     onClick: () => go('toast', { variant: 'success', message: 'Adicionado à agenda.' }) },
    { icon: 'directions',     label: 'Como chegar',            onClick: () => go('toast', { variant: 'info', message: 'Abrindo no Maps...' }) },
    { icon: 'ios_share',      label: 'Compartilhar',           onClick: () => go('toast', { variant: 'success', message: 'Link copiado.' }) },
    { icon: 'notifications_off', label: 'Silenciar lembretes', onClick: () => go('toast', { variant: 'success', message: 'Lembretes silenciados.' }) },
    { icon: 'flag',           label: 'Reportar',               danger: true, onClick: () => go('toast', { variant: 'success', message: 'Reporte enviado.' }) },
  ];
  const participantPast = [
    { icon: 'star',           label: 'Avaliar vinhos provados',onClick: () => go('evento-pos-avaliar', { event }) },
    { icon: 'photo_camera',   label: 'Ver foto coletiva',      onClick: () => go('toast', { variant: 'info', message: 'Em breve.' }) },
    { icon: 'ios_share',      label: 'Compartilhar como foi',  onClick: () => go('toast', { variant: 'success', message: 'Link copiado.' }) },
  ];
  const items = isOrganizer ? (isPast ? organizerPast : organizerLive) : (isPast ? participantPast : participantLive);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)', zIndex: 70,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'tcFadeIn 180ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl,
        padding: '8px 0 12px', width: '100%', animation: 'tcSlideUp 220ms',
      }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '8px auto 12px' }}/>
        <div style={{ ...T.t.overline, color: T.c.n600, padding: '4px 20px 8px' }}>
          {isOrganizer ? (isPast ? '── PÓS-EVENTO (ORGANIZADOR) ──' : '── ORGANIZADOR ──') : (isPast ? '── PÓS-EVENTO ──' : '── AÇÕES ──')}
        </div>
        {items.map(a => (
          <button key={a.label} onClick={a.onClick} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            color: a.danger ? T.c.e700 : T.c.n950, fontFamily: T.font, fontSize: 15, fontWeight: 500,
          }}>
            <Icon name={a.icon} size={22} color={a.danger ? T.c.e700 : T.c.n800}/>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const __EventDetalheScreen_OLD_END = null; // marker for old footer block

function EvDtSection({ title, action, children }) {
  return (
    <div style={{ padding: '20px 20px 4px', borderBottom: `1px solid ${T.c.n100}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ ...T.t.h3, margin: 0, color: T.c.n950 }}>{title}</h3>
        {action && (
          <button onClick={action.onClick} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.p700, fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: 0,
          }}>{action.label}</button>
        )}
      </div>
      <div style={{ paddingBottom: 16 }}>{children}</div>
    </div>
  );
}

function EvDtDetailRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '8px 0' }}>
      <div style={{
        width: 36, height: 36, borderRadius: T.r.md, flexShrink: 0,
        background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color={T.c.p700}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 2, fontSize: 10 }}>{label.toUpperCase()}</div>
        {children}
      </div>
    </div>
  );
}

function EvDtReminderRow({ icon, text, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
      background: 'none', border: 'none', borderTop: `1px solid ${T.c.n100}`, cursor: 'pointer',
      textAlign: 'left',
    }}>
      <Icon name={icon} size={20} color={T.c.n800}/>
      <span style={{ flex: 1, ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{text}</span>
      <Icon name="chevron_right" size={18} color={T.c.n400}/>
    </button>
  );
}

Object.assign(window, { EventDetalheScreen });


export { EvDtDetailRow, EvDtReminderRow, EvDtSection, EventDetalheScreen, EventMenuSheet, __EventDetalheScreen_OLD_END };
