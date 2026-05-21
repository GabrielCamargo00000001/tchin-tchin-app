/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { SubHeader } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 14.03 · Notificacoes — central de notificações in-app
//
//   <Notificacoes
//     go={(screen, params) => ...}
//     ctx={{ notifications }}
//   />
// ─────────────────────────────────────────────────────────────

// Tipos de notificação suportados — cada um sabe seu próprio
// avatar, ícone-overlay, copy template e destino de navegação.
const NOTIF_TYPES = {
  invite_brotherhood: {
    avatar:  { kind: 'user' },
    badge:   { icon: 'group_add', bg: '#722F37' },
  },
  event_tomorrow: {
    avatar:  { kind: 'event' },
    badge:   { icon: 'event', bg: '#B8894A' },
  },
  plus_one_joined: {
    avatar:  { kind: 'user' },
    badge:   { icon: 'celebration', bg: '#722F37' },
  },
  spot_vip: {
    avatar:  { kind: 'user' },
    badge:   { icon: 'workspace_premium', bg: '#B8894A' },
  },
  challenge_done: {
    avatar:  { kind: 'system', icon: 'flag', bg: '#2E7D32' },
    badge:   null,
  },
  badge_unlocked: {
    avatar:  { kind: 'system', icon: 'military_tech', bg: '#B8894A' },
    badge:   null,
  },
  monthly_summary: {
    avatar:  { kind: 'system', icon: 'calendar_month', bg: '#722F37' },
    badge:   null,
  },
  brotherhood_activity: {
    avatar:  { kind: 'user' },
    badge:   { icon: 'forum', bg: '#1565C0' },
  },
  expert_replied: {
    avatar:  { kind: 'user' },
    badge:   { icon: 'verified', bg: '#1565C0' },
  },
};

// Default mock notifications — covers all 9 types in spec order.
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n01',
    type: 'invite_brotherhood',
    read: false,
    ts: minutesAgo(8),
    actor: { id: 'u_5', name: 'Carla Bittencourt' },
    payload: { brotherhoodId: 'b_1', brotherhoodName: 'Tchin do Cerrado' },
    text: ['Carla Bittencourt', ' te convidou pra ', 'Tchin do Cerrado'],
  },
  {
    id: 'n02',
    type: 'event_tomorrow',
    read: false,
    ts: hoursAgo(3),
    payload: { eventId: 'e_1', eventName: 'Degustação de Malbecs', time: '19h30' },
    text: ['Evento ', 'Degustação de Malbecs', ' é amanhã às ', '19h30'],
  },
  {
    id: 'n03',
    type: 'plus_one_joined',
    read: false,
    ts: hoursAgo(6),
    actor: { id: 'u_9', name: 'Marina Souza' },
    text: ['Seu convidado ', 'Marina Souza', ' se cadastrou! 🎉'],
  },
  {
    id: 'n04',
    type: 'spot_vip',
    read: true,
    ts: hoursAgo(20),
    actor: { id: 'u_2', name: 'Diego Almeida' },
    text: ['Diego Almeida', ' te presenteou com ', 'Spot VIP'],
  },
  {
    id: 'n05',
    type: 'challenge_done',
    read: true,
    ts: daysAgo(1),
    payload: { points: 50 },
    text: ['Desafio cumprido! ', '+50 pts'],
  },
  {
    id: 'n06',
    type: 'badge_unlocked',
    read: true,
    ts: daysAgo(2),
    payload: { badgeName: 'Explorador do Cone Sul' },
    text: ['Você desbloqueou ', 'Explorador do Cone Sul', '!'],
  },
  {
    id: 'n07',
    type: 'monthly_summary',
    read: true,
    ts: daysAgo(3),
    payload: { month: 'abril' },
    text: ['Seu ', 'abril', ' no vinho está pronto'],
  },
  {
    id: 'n08',
    type: 'brotherhood_activity',
    read: true,
    ts: daysAgo(4),
    actor: { id: 'u_7', name: 'Helena Sotero' },
    payload: { brotherhoodName: 'Tchin do Cerrado' },
    text: ['Helena Sotero', ' postou em ', 'Tchin do Cerrado'],
  },
  {
    id: 'n09',
    type: 'expert_replied',
    read: true,
    ts: daysAgo(6),
    actor: { id: 'u_4', name: 'Patrícia Lima' },
    text: ['Sommelier ', 'Patrícia Lima', ' respondeu sua pergunta'],
  },
];

function Notificacoes({ go = () => {}, ctx = {}, initialTab = 'all' }) {
  const [items, setItems] = React.useState(ctx.notifications || DEFAULT_NOTIFICATIONS);
  const [tab, setTab] = React.useState(initialTab);   // 'all' | 'unread'
  const [menuOpen, setMenuOpen] = React.useState(false);

  const unreadCount = items.filter(n => !n.read).length;
  const filtered = tab === 'unread' ? items.filter(n => !n.read) : items;

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    setMenuOpen(false);
  };

  const handleTap = (n) => {
    setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    const route = routeForNotif(n);
    if (route) go(route.screen, route.params);
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: T.c.n0, fontFamily: T.font, overflow: 'hidden',
      position: 'relative',
    }}>
      {/* ─── Top bar ───────────────────────────────────────────── */}
      <SubHeader
        title="Notificações"
        onBack={() => go('home')}
        actions={
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Mais opções"
              style={{
                width: 44, height: 44, border: 'none', background: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="more_vert" size={22} color={T.c.n800}/>
            </button>
            {menuOpen && (
              <React.Fragment>
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: 'absolute', top: -100, right: -100, bottom: -300, left: -300, zIndex: 5 }}
                />
                <div style={{
                  position: 'absolute', top: 44, right: 8, zIndex: 6,
                  background: T.c.n0, borderRadius: T.r.md,
                  boxShadow: '0 8px 28px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
                  minWidth: 220, padding: 4,
                }}>
                  <button
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      background: 'transparent', border: 'none',
                      borderRadius: T.r.sm,
                      color: unreadCount === 0 ? T.c.n400 : T.c.n950,
                      fontSize: 13, fontWeight: 600, fontFamily: T.font,
                      cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    <Icon name="done_all" size={18} color={unreadCount === 0 ? T.c.n400 : T.c.p700}/>
                    Marcar todas como lidas
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
        }
      />

      {/* ─── Tabs ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 4,
        padding: '6px 12px 0',
        borderBottom: `1px solid ${T.c.n100}`,
        background: T.c.n0,
        flexShrink: 0,
      }}>
        <NotifTab
          label="Todas"
          count={items.length}
          active={tab === 'all'}
          onTap={() => setTab('all')}
        />
        <NotifTab
          label="Não lidas"
          count={unreadCount}
          active={tab === 'unread'}
          onTap={() => setTab('unread')}
        />
      </div>

      {/* ─── List / Empty ──────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: T.c.n0 }}>
        {filtered.length === 0 ? (
          <NotifEmptyState tab={tab}/>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((n, i) => (
              <NotifRow
                key={n.id}
                notif={n}
                onTap={() => handleTap(n)}
                last={i === filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab ──────────────────────────────────────────────────────
function NotifTab({ label, count, active, onTap }) {
  return (
    <button
      onClick={onTap}
      style={{
        background: 'none', border: 'none', padding: '10px 6px 12px',
        cursor: 'pointer', fontFamily: T.font,
        fontSize: 14, fontWeight: 600,
        color: active ? T.c.p700 : T.c.n600,
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'color 120ms',
      }}
    >
      {label}
      {typeof count === 'number' && (
        <span style={{
          minWidth: 18, height: 18, borderRadius: 9,
          padding: '0 6px',
          background: active ? T.c.p700 : T.c.n200,
          color: active ? T.c.n0 : T.c.n800,
          fontSize: 11, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1, letterSpacing: 0.2,
        }}>{count}</span>
      )}
      {active && (
        <span style={{
          position: 'absolute', bottom: -1, left: 4, right: 4,
          height: 2, background: T.c.p700, borderRadius: 1,
        }}/>
      )}
    </button>
  );
}

// ─── Row ──────────────────────────────────────────────────────
function NotifRow({ notif, onTap, last }) {
  const [hover, setHover] = React.useState(false);
  const cfg = NOTIF_TYPES[notif.type] || NOTIF_TYPES.brotherhood_activity;

  // Render copy with optional <strong> emphasis on alternating fragments
  const renderCopy = (parts) => {
    return parts.map((part, i) => {
      // Even indices = plain, odd = strong (entity)
      const isStrong = i % 2 === 1;
      return (
        <React.Fragment key={i}>
          {isStrong ? <strong style={{ fontWeight: 700, color: notif.read ? T.c.n800 : T.c.n950 }}>{part}</strong> : part}
        </React.Fragment>
      );
    });
  };

  return (
    <button
      type="button"
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: notif.read
          ? (hover ? T.c.n50 : T.c.n0)
          : (hover ? T.c.p50 : (T.c.p50 || '#FAF1F2') + '99'),
        border: 'none',
        borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
        padding: '14px 16px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        cursor: 'pointer',
        fontFamily: T.font,
        transition: 'background 120ms',
        position: 'relative',
      }}
    >
      {/* Avatar w/ optional badge overlay */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <NotifAvatar notif={notif} cfg={cfg}/>
        {cfg.badge && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 16, height: 16, borderRadius: '50%',
            background: cfg.badge.bg,
            border: `2px solid ${T.c.n0}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={cfg.badge.icon} size={9} color={T.c.n0} fill={1}/>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
        <div style={{
          fontSize: 14,
          lineHeight: 1.45,
          color: notif.read ? T.c.n600 : T.c.n950,
          fontWeight: notif.read ? 400 : 500,
          letterSpacing: '0.05px',
          textWrap: 'pretty',
        }}>
          {renderCopy(notif.text || [])}
        </div>
        <div style={{
          marginTop: 4,
          fontSize: 12,
          color: notif.read ? T.c.n400 : T.c.n600,
          letterSpacing: 0.1,
        }}>
          {formatRelative(notif.ts)}
        </div>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div
          aria-label="Não lida"
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: T.c.p700,
            flexShrink: 0,
            marginTop: 8,
            boxShadow: '0 0 0 2px rgba(114, 47, 55, 0.15)',
          }}
        />
      )}
    </button>
  );
}

// ─── Avatar inside a notification ─────────────────────────────
function NotifAvatar({ notif, cfg }) {
  if (cfg.avatar.kind === 'system') {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: cfg.avatar.bg, color: T.c.n0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={cfg.avatar.icon} size={20} color={T.c.n0} fill={1}/>
      </div>
    );
  }
  if (cfg.avatar.kind === 'event') {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`,
        color: T.c.n0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="event" size={20} color={T.c.n0} fill={1}/>
      </div>
    );
  }
  // user kind
  return <Avatar name={notif.actor ? notif.actor.name : '?'} size={36}/>;
}

// ─── Empty state ──────────────────────────────────────────────
function NotifEmptyState({ tab }) {
  const title = tab === 'unread' ? 'Tudo lido' : 'Tudo em dia';
  const desc  = tab === 'unread'
    ? 'Você não tem notificações não lidas.'
    : 'Nenhuma notificação por aqui. A gente avisa quando algo acontecer.';
  return (
    <div style={{
      padding: '56px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 24,
        background: T.c.n100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
      }}>
        <Icon name={tab === 'unread' ? 'mark_email_read' : 'notifications_paused'} size={48} color={T.c.n400}/>
      </div>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 22, fontWeight: 600,
        color: T.c.n950, letterSpacing: '-0.01em', textWrap: 'balance',
      }}>{title}</div>
      <div style={{
        fontSize: 14, color: T.c.n600,
        lineHeight: 1.55, maxWidth: 280, textWrap: 'pretty',
      }}>{desc}</div>
    </div>
  );
}

// ─── Routing helper (where each notif type takes the user) ────
function routeForNotif(n) {
  switch (n.type) {
    case 'invite_brotherhood':    return { screen: 'confraria-detalhe', params: { id: n.payload && n.payload.brotherhoodId } };
    case 'event_tomorrow':        return { screen: 'event-detalhe',     params: { id: n.payload && n.payload.eventId } };
    case 'plus_one_joined':       return { screen: 'event-detalhe',     params: { id: n.payload && n.payload.eventId } };
    case 'spot_vip':              return { screen: 'event-detalhe',     params: { id: n.payload && n.payload.eventId } };
    case 'challenge_done':        return { screen: 'badges-galeria',    params: {} };
    case 'badge_unlocked':        return { screen: 'badges-galeria',    params: {} };
    case 'monthly_summary':       return { screen: 'relatorio-mensal',  params: {} };
    case 'brotherhood_activity':  return { screen: 'confraria-detalhe', params: { name: n.payload && n.payload.brotherhoodName } };
    case 'expert_replied':        return { screen: 'comentarios',       params: { actorId: n.actor && n.actor.id } };
    default:                      return null;
  }
}

// ─── Time helpers ─────────────────────────────────────────────
function minutesAgo(m) { return new Date(Date.now() - m * 60 * 1000).toISOString(); }
function hoursAgo(h)   { return new Date(Date.now() - h * 60 * 60 * 1000).toISOString(); }
function daysAgo(d)    { return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString(); }

function formatRelative(ts) {
  if (!ts) return '';
  const then = new Date(ts).getTime();
  const now = Date.now();
  const sec = Math.max(1, Math.floor((now - then) / 1000));
  if (sec < 60) return 'agora';
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `há ${day}d`;
  if (day < 30) return `há ${Math.floor(day / 7)}sem`;
  if (day < 365) return `há ${Math.floor(day / 30)}mês`;
  return `há ${Math.floor(day / 365)}a`;
}

Object.assign(window, {
  Notificacoes,
  DEFAULT_NOTIFICATIONS,
  formatRelative,
});


export { DEFAULT_NOTIFICATIONS, NOTIF_TYPES, NotifAvatar, NotifEmptyState, NotifRow, NotifTab, Notificacoes, daysAgo, formatRelative, hoursAgo, minutesAgo, routeForNotif };
