/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.04 Reminder System (D-3 / D-1 / D-0 + email + in-app banner)
// ────────────────────────────────────────────────────────────────
// Frente H3 + I7. Sequência completa de avisos pré-evento. Todos os
// 5 surfaces usam o MESMO `event` payload, então criamos uma família
// coesa de componentes que compartilham vocabulário visual e copy.
//
// As 5 superfícies:
//   1. PushPreviewD3  — push 3 dias antes (18h)
//   2. PushPreviewD1  — push 1 dia antes  (12h)
//   3. PushPreviewD0  — push no dia       (9h)
//   4. EventDayBanner — banner fixo no topo do app no dia do evento
//   5. EmailD1Preview — preview do email D-1 (Frente I7)
//
// As funções `buildPushCopy*` são puras e exportadas — em produção o
// backend usa as mesmas regras de copy pra montar os payloads de push.
//
// Regra de frequência (US-12-12-03):
//   • Máx 1 push/dia
//   • Exceção: D-0 (urgente, <24h)
//   • Só dispara para users com rsvp_status === 'confirmed'
//   • Respeita opt-out global do user

// ─── Pure copy builders ─────────────────────────────────────
function buildPushCopyD3(event) {
  // "[Nome do evento] em 3 dias 🍷 [Local]. Bora?"
  const local = event.location || (event.modality === 'online' ? 'online' : 'em local a definir');
  return {
    title: 'Tchin Tchin',
    body:  `${event.title} em 3 dias 🍷 ${local}. Bora?`,
    deep_link: `tchin://event/${event.id}`,
  };
}
function buildPushCopyD1(event) {
  // "Amanhã é o dia! [Nome do evento] às [hora] em [local]"
  const local = event.location || 'em local a definir';
  return {
    title: 'Tchin Tchin',
    body:  `Amanhã é o dia! ${event.title} às ${event.time} ${event.modality === 'online' ? '(online)' : `em ${local}`}`,
    deep_link: `tchin://event/${event.id}`,
  };
}
function buildPushCopyD0(event) {
  // "Hoje! [Nome] às [hora]. Te espero!"
  return {
    title: 'Tchin Tchin',
    body:  `Hoje! ${event.title} às ${event.time}. Te espero!`,
    deep_link: `tchin://event/${event.id}`,
    priority: 'urgent', // bypass max-1-per-day rule
  };
}
function buildBannerCopyD0(event) {
  return `🍷 Hoje tem ${event.title} às ${event.time}`;
}
function buildEmailSubjectD1(event) {
  return `${event.title} amanhã às ${event.time}`;
}

// ════════════════════════════════════════════════════════════
// PushPreview — shared visual for D-3 / D-1 / D-0
// ════════════════════════════════════════════════════════════
function PushPreview({ time, label, copy, urgent, onTap }) {
  return (
    <button
      onClick={onTap}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: 14,
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: 18,
        boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
        textAlign: 'left', cursor: 'pointer',
        fontFamily: T.font,
        position: 'relative',
      }}>
      {/* App icon — square w/ Tchin glyph */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="wine_bar" size={22} color="#FFFFFF" fill={1}/>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, marginBottom: 2,
        }}>
          <span style={{
            fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.c.n950,
            letterSpacing: '0.05px',
          }}>
            {copy.title}
          </span>
          <span style={{
            fontFamily: T.font, fontSize: 11, color: T.c.n600,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {urgent && (
              <span style={{
                padding: '1px 6px', background: T.c.e700, color: '#FFFFFF',
                borderRadius: T.r.full, fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.4px', textTransform: 'uppercase',
              }}>
                Urgente
              </span>
            )}
            {time}
          </span>
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 13, lineHeight: 1.4, color: T.c.n800,
          wordBreak: 'break-word',
        }}>
          {copy.body}
        </div>
        {label && (
          <div style={{
            marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.c.n100}`,
            fontFamily: T.mono, fontSize: 10, color: T.c.n600,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {label}
          </div>
        )}
      </div>
    </button>
  );
}

function PushPreviewD3({ event, onTap }) {
  return <PushPreview time="ontem · 18:00" label="D-3 antes do evento" copy={buildPushCopyD3(event)} onTap={onTap}/>;
}
function PushPreviewD1({ event, onTap }) {
  return <PushPreview time="hoje · 12:00" label="D-1 antes do evento" copy={buildPushCopyD1(event)} onTap={onTap}/>;
}
function PushPreviewD0({ event, onTap }) {
  return <PushPreview time="agora · 09:00" label="D-0 dia do evento" copy={buildPushCopyD0(event)} urgent onTap={onTap}/>;
}

// ════════════════════════════════════════════════════════════
// EventDayBanner — fixed top banner when day-of and user is in app
// ════════════════════════════════════════════════════════════
function EventDayBanner({ event, onTap, onDismiss }) {
  if (!event) return null;
  return (
    <div
      role="banner"
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: T.c.p700, color: T.c.n0,
        fontFamily: T.font,
        animation: 'tcSlideDownIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        position: 'relative',
      }}>
      <Icon name="event" size={20} color="#FFFFFF" fill={1} style={{ flexShrink: 0 }}/>
      <div
        onClick={onTap}
        style={{
          flex: 1, minWidth: 0, cursor: 'pointer',
          fontSize: 13, fontWeight: 600, lineHeight: 1.35,
        }}>
        🍷 Hoje tem <strong style={{ fontWeight: 700 }}>{event.title}</strong> às {event.time}
      </div>
      {onDismiss && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          aria-label="Fechar banner"
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            border: 'none', cursor: 'pointer', color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
          <Icon name="close" size={16} color="#FFFFFF"/>
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// EmailD1Preview — preview do email enviado D-1
// ════════════════════════════════════════════════════════════
function EmailD1Preview({ event, recipientName, onAddToCalendar, onOpenLanding }) {
  const subject = buildEmailSubjectD1(event);
  const dayLabel = formatEmailEventDate(event.date);
  return (
    <div style={{
      width: '100%',
      background: T.c.n0,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      overflow: 'hidden',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      {/* Email chrome */}
      <div style={{
        padding: '14px 18px',
        background: T.c.n50,
        borderBottom: `1px solid ${T.c.n200}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: T.c.p700, color: T.c.n0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>
          TT
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.c.n950 }}>Tchin Tchin</div>
          <div style={{ fontSize: 10, color: T.c.n600 }}>noreply@tchin.com.br · D-1 antes do evento</div>
        </div>
      </div>

      {/* Subject */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{
          fontFamily: T.mono, fontSize: 10, color: T.c.n600,
          textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4,
        }}>
          Assunto
        </div>
        <div style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 16, fontWeight: 700, color: T.c.n950, lineHeight: 1.3,
        }}>
          {subject}
        </div>
      </div>

      {/* Hero strip */}
      <div style={{
        margin: '12px 20px 0',
        height: 80,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ opacity: 0.18, position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)' }}/>
        <div style={{
          position: 'relative', color: '#FFFFFF',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
          padding: '0 16px', textAlign: 'center',
        }}>
          Amanhã às {event.time} 🍷
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 20px' }}>
        <p style={{
          margin: 0, marginBottom: 12,
          fontSize: 14, lineHeight: 1.55, color: T.c.n800,
        }}>
          Oi {recipientName || 'pessoa'}, lembrando que <strong style={{ color: T.c.n950 }}>{event.title}</strong> é amanhã.
        </p>
        <div style={{
          background: T.c.n50, border: `1px solid ${T.c.n200}`,
          borderRadius: 8, padding: 14, marginBottom: 16,
        }}>
          <EmailRow icon="event" label={dayLabel}/>
          <EmailRow icon="schedule" label={event.time}/>
          <EmailRow
            icon={event.modality === 'online' ? 'link' : 'location_on'}
            label={event.location || '—'}
          />
          {event.confirmedCount != null && (
            <EmailRow icon="groups" label={`${event.confirmedCount} confirmados`}/>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onAddToCalendar}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 18px',
              background: T.c.p700, color: '#FFFFFF',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 14, fontWeight: 600,
            }}>
            <Icon name="event_available" size={18} color="#FFFFFF"/>
            Adicionar ao calendário (.ics)
          </button>
          <button
            onClick={onOpenLanding}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '12px 18px',
              background: 'transparent', color: T.c.p700,
              border: `1px solid ${T.c.p700}`, borderRadius: 6, cursor: 'pointer',
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 14, fontWeight: 600,
            }}>
            Ver detalhes do evento
          </button>
        </div>

        <div style={{
          marginTop: 20, paddingTop: 14,
          borderTop: `1px solid ${T.c.n200}`,
          fontSize: 11, color: T.c.n600, lineHeight: 1.5,
          textAlign: 'center',
        }}>
          Você está recebendo porque confirmou presença em "{event.title}".
          <br/>
          <a href="#" style={{ color: T.c.p700, textDecoration: 'underline' }}>
            Cancelar lembretes por email
          </a>
          {' · '}
          <a href="#" style={{ color: T.c.p700, textDecoration: 'underline' }}>
            Tchin Tchin
          </a>
        </div>
      </div>
    </div>
  );
}

function EmailRow({ icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '4px 0',
      fontSize: 13, color: T.c.n800,
    }}>
      <Icon name={icon} size={16} color={T.c.p700} fill={1}/>
      <span>{label}</span>
    </div>
  );
}

function formatEmailEventDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  return day.charAt(0).toUpperCase() + day.slice(1);
}

// ════════════════════════════════════════════════════════════
// Showcase host — renders all 5 surfaces stacked on a phone-ish surface
// ════════════════════════════════════════════════════════════
function ReminderShowcaseHost() {
  const event = {
    id: 'evt_demo',
    title: 'Degustação de Malbecs',
    date: '2026-05-23',
    time: '19:30',
    location: 'Bar do Vinho · Asa Sul',
    modality: 'presencial',
    confirmedCount: 12,
  };
  return (
    <div style={{
      flex: 1, padding: 20, background: T.c.n50, overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 14, fontFamily: T.font,
    }}>
      <SectionLabel>Push D-3 · 3 dias antes, 18h</SectionLabel>
      <PushPreviewD3 event={event}/>

      <div style={{ height: 4 }}/>
      <SectionLabel>Push D-1 · 1 dia antes, 12h</SectionLabel>
      <PushPreviewD1 event={event}/>

      <div style={{ height: 4 }}/>
      <SectionLabel>Push D-0 · dia do evento, 9h</SectionLabel>
      <PushPreviewD0 event={event}/>

      <div style={{ height: 4 }}/>
      <SectionLabel>Banner fixo · dia do evento</SectionLabel>
      <div style={{
        borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${T.c.n200}`,
      }}>
        <EventDayBanner event={event} onTap={() => {}}/>
      </div>

      <div style={{ height: 4 }}/>
      <SectionLabel>Email D-1</SectionLabel>
      <EmailD1Preview
        event={event}
        recipientName="Ana"
        onAddToCalendar={() => {}}
        onOpenLanding={() => {}}
      />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: T.font, fontSize: 11, fontWeight: 700,
      color: T.c.p700, letterSpacing: '0.5px',
      textTransform: 'uppercase',
    }}>
      {children}
    </div>
  );
}

Object.assign(window, {
  PushPreviewD3, PushPreviewD1, PushPreviewD0,
  EventDayBanner, EmailD1Preview,
  ReminderShowcaseHost,
  buildPushCopyD3, buildPushCopyD1, buildPushCopyD0,
  buildBannerCopyD0, buildEmailSubjectD1,
});


export { EmailD1Preview, EmailRow, EventDayBanner, PushPreview, PushPreviewD0, PushPreviewD1, PushPreviewD3, ReminderShowcaseHost, SectionLabel, buildBannerCopyD0, buildEmailSubjectD1, buildPushCopyD0, buildPushCopyD1, buildPushCopyD3, formatEmailEventDate };
