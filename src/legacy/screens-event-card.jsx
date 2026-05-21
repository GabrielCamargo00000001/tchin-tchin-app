/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.01 Card Próximo Evento
// ────────────────────────────────────────────────────────────
// Card destacado no topo do feed da Confraria. Aparece pra qualquer
// membro com evento futuro. Frente H1 — é o objeto de mais alta
// hierarquia visual da tela de detalhe de confraria quando há evento.
//
// Inclui inline as primitivas que serão extraídas como 11.02 (RSVP
// one-tap) e 11.03 ("Quem vai" inline avatares) — versões enxutas que
// vivem aqui até virarem componentes próprios.

const RSVP_LABELS = {
  pending:   { label: 'Vou',           icon: 'how_to_reg',    tone: 'cta' },
  confirmed: { label: 'Confirmado',    icon: 'check_circle',  tone: 'on' },
  declined:  { label: 'Não vou',       icon: 'close',         tone: 'off' },
};

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    event: { id, title, date (YYYY-MM-DD), time, location, attendees }
//    userRSVPStatus: 'pending' | 'confirmed' | 'declined'
//    onRSVPTap: () => void
//    onCardTap: () => void
//    onAvatarsTap?: () => void   — opcional, abre lista "Quem vai" (11.03 future)
function CardProximoEvento({ event, userRSVPStatus = 'pending', onRSVPTap, onCardTap, onAvatarsTap }) {
  if (!event) return null;

  const dateLabel = formatEventDayTime(event.date, event.time);
  const daysUntil = computeDaysUntil(event.date);
  const daysLabel = formatDaysUntil(daysUntil);

  const handleCardClick = (e) => {
    // Não dispara quando tap originou no botão RSVP ou no avatar row
    if (e.target.closest('[data-stop-card-tap]')) return;
    onCardTap && onCardTap();
  };

  return (
    <div
      data-tour-anchor="confraria-event-next"
      onClick={handleCardClick}
      role="button"
      aria-label={`Próximo evento: ${event.title}, ${dateLabel}`}
      style={{
        position: 'relative',
        width: '100%',
        background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
        borderRadius: T.r.lg,
        padding: 20,
        color: T.c.n0,
        fontFamily: T.font,
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(74,31,36,0.18)',
        overflow: 'hidden',
      }}>

      {/* Decorative glyph faint in background */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: -16, top: -16,
        opacity: 0.08, pointerEvents: 'none',
      }}>
        <Icon name="event" size={140} color="#FFFFFF" fill={1}/>
      </div>

      {/* Top row — eyebrow + days */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: T.font,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.6px',
          color: 'rgba(255,255,255,0.8)',
          textTransform: 'uppercase',
        }}>
          Próximo evento
        </span>
        <DaysUntilBadge label={daysLabel} urgent={daysUntil <= 3}/>
      </div>

      {/* Title */}
      <h3 style={{
        position: 'relative',
        margin: 0, marginBottom: 12,
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: 20, lineHeight: 1.2, fontWeight: 600,
        letterSpacing: '-0.015em',
        color: T.c.n0,
        textWrap: 'balance',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {event.title}
      </h3>

      {/* Info rows */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
        <InfoRow icon="calendar_today" label={dateLabel}/>
        <InfoRow
          icon={event.modality === 'online' ? 'link' : 'location_on'}
          label={event.location || '—'}
        />
      </div>

      {/* Quem vai (11.03 inline) */}
      <div
        data-stop-card-tap
        onClick={(e) => { e.stopPropagation(); onAvatarsTap && onAvatarsTap(); }}
        style={{
          marginBottom: 16, cursor: onAvatarsTap ? 'pointer' : 'default',
        }}>
        <AttendeesRow
          attendees={event.attendees || []}
          confirmedCount={event.confirmedCount ?? (event.attendees ? event.attendees.length : 0)}
        />
      </div>

      {/* Bottom row — RSVP CTA + chevron */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div data-stop-card-tap>
          <RSVPButton status={userRSVPStatus} onClick={onRSVPTap}/>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} aria-hidden="true">
          <Icon name="chevron_right" size={18} color="#FFFFFF"/>
        </div>
      </div>
    </div>
  );
}

// ─── DaysUntilBadge ─────────────────────────────────────────
function DaysUntilBadge({ label, urgent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px',
      background: urgent ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.18)',
      color: urgent ? T.c.p700 : '#FFFFFF',
      borderRadius: T.r.full,
      fontFamily: T.mono, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.2px',
    }}>
      {urgent && <Icon name="schedule" size={12}/>}
      {label}
    </div>
  );
}

// ─── InfoRow ────────────────────────────────────────────────
function InfoRow({ icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: T.font, fontSize: 14, fontWeight: 500,
      color: 'rgba(255,255,255,0.96)', lineHeight: 1.4,
    }}>
      <Icon name={icon} size={16} color="rgba(255,255,255,0.85)" fill={1}/>
      <span style={{
        minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── AttendeesRow (11.03 inline) ────────────────────────────
function AttendeesRow({ attendees, confirmedCount }) {
  const shown = attendees.slice(0, 5);
  const remaining = Math.max(0, confirmedCount - shown.length);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {shown.map((a, i) => (
          <div key={a.id || i} style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `2px solid ${T.c.p700}`,
            background: a.src
              ? `${a.src} center/cover`
              : initialsBg(a.name || '?'),
            backgroundSize: 'cover',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.c.n0, fontFamily: T.font, fontSize: 11, fontWeight: 700,
            marginLeft: i === 0 ? 0 : -8,
            position: 'relative', zIndex: shown.length - i,
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          }}>
            {!a.src && initials(a.name || '?')}
          </div>
        ))}
        {remaining > 0 && (
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `2px solid ${T.c.p700}`,
            background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: T.mono, fontSize: 10, fontWeight: 700,
            marginLeft: -8, position: 'relative', zIndex: 0,
          }}>
            +{remaining}
          </div>
        )}
      </div>
      <span style={{
        fontFamily: T.font, fontSize: 13, fontWeight: 500,
        color: 'rgba(255,255,255,0.85)',
      }}>
        {confirmedCount} confirmados
      </span>
    </div>
  );
}

function initials(name) {
  return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
}
// Soft, deterministic accent based on the name so each member has a distinct color
function initialsBg(name) {
  const hues = ['#B8894A', '#A04A55', '#D4A574', '#722F37', '#6B6B6B'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return hues[h % hues.length];
}

// ─── RSVPButton (11.02 inline) ─────────────────────────────
function RSVPButton({ status = 'pending', onClick }) {
  const cfg = RSVP_LABELS[status] || RSVP_LABELS.pending;

  // Three visual treatments to make state legible inside the burgundy card:
  //   pending  → solid white pill, burgundy text (high-contrast CTA)
  //   confirmed → translucent white pill with check icon (committed)
  //   declined → outline-only ghost (you said no, but you can change your mind)
  const STATE_STYLES = {
    pending: {
      background: '#FFFFFF',
      color: T.c.p700,
      border: '1.5px solid #FFFFFF',
    },
    confirmed: {
      background: 'rgba(255,255,255,0.96)',
      color: T.c.s700,
      border: '1.5px solid rgba(255,255,255,0.96)',
    },
    declined: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.92)',
      border: '1.5px solid rgba(255,255,255,0.6)',
    },
  };
  const s = STATE_STYLES[status] || STATE_STYLES.pending;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      aria-label={`RSVP: ${cfg.label}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 40, padding: '0 18px',
        borderRadius: T.r.full,
        ...s,
        cursor: 'pointer',
        fontFamily: T.font, fontSize: 14, fontWeight: 700,
        letterSpacing: '0.1px',
        transition: 'background 140ms, transform 80ms',
      }}>
      <Icon name={cfg.icon} size={18} color={s.color} fill={status === 'confirmed' ? 1 : 0}/>
      {cfg.label}
    </button>
  );
}

// ─── Helpers ────────────────────────────────────────────────
function computeDaysUntil(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (24 * 60 * 60 * 1000));
  return diff;
}

function formatDaysUntil(diff) {
  if (diff == null) return '';
  if (diff < 0)  return 'já passou';
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  return `em ${diff} dias`;
}

function formatEventDayTime(dateStr, time) {
  if (!dateStr) return time || '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekday = dt.toLocaleDateString('pt-BR', { weekday: 'long' });
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return time ? `${cap}, ${time}` : cap;
}

Object.assign(window, {
  CardProximoEvento,
  RSVPButton,
  AttendeesRow,
  DaysUntilBadge,
  computeDaysUntil,
});


export { AttendeesRow, CardProximoEvento, DaysUntilBadge, InfoRow, RSVPButton, RSVP_LABELS, computeDaysUntil, formatDaysUntil, formatEventDayTime, initials, initialsBg };
