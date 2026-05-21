/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Chat / DMs (2 telas)
//
//   32.01 chat-lista     → conversas individuais + grupos de confraria
//   32.02 chat-conversa  → conversa aberta (timeline + composer)
//
//   Acessadas via ProfileDrawer → Mensagens, ou perfil de usuário → Enviar mensagem
// ─────────────────────────────────────────────────────────────

const MOCK_CHATS = [
  { id: 'c-bsb', name: 'Brindar em Brasília', type: 'group', members: 8,  last: 'Carla: Bora marcar pro próximo sábado?', when: '14:32', unread: 3, level: null },
  { id: 'd-1',   name: 'Carla Mendes',         type: 'dm',    last: 'Tá liberado o Riesling lá da 410, vai correndo', when: '12:08', unread: 1, level: 'expert' },
  { id: 'c-zo',  name: 'Vinhos da Zona Sul',   type: 'group', members: 22, last: 'Bruno: alguém recomenda Cabernet português?', when: 'ontem', unread: 0, level: null },
  { id: 'd-2',   name: 'Diego Reis',           type: 'dm',    last: 'Você: já abri o Malbec, espetacular',                when: 'ontem', unread: 0, level: 'intermediario' },
  { id: 'd-3',   name: 'Helena Britto',        type: 'dm',    last: 'Foto coletiva ficou ótima!',                          when: 'ter', unread: 0, level: 'iniciante' },
  { id: 'c-pt',  name: 'Tannat & Cia',         type: 'group', members: 4,  last: 'Pedro: fechei a reserva da pousada',     when: 'seg', unread: 0, level: null },
];

const MOCK_MESSAGES = [
  { id: 1, from: 'Carla Mendes', text: 'Oi! Tá liberado o Riesling lá da 410, vai correndo. 3 garrafas só.', when: '12:05', mine: false, level: 'expert' },
  { id: 2, from: 'Você',         text: 'Sério? Tô a caminho do trabalho mas passo na volta!', when: '12:06', mine: true },
  { id: 3, from: 'Carla Mendes', text: 'Manda quanto custou. Quero levar pro nosso encontro.', when: '12:07', mine: false, level: 'expert' },
  { id: 4, from: 'Você',         text: 'Combinado. Marca aí o vinho que eu te mostro.', when: '12:08', mine: true, wineAttached: true },
];

function ChatShell({ title, subtitle, onBack, action, leading, children, footer }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        {leading}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.t.h3, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
          {subtitle && <div style={{ ...T.t.caption, color: T.c.n600 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>{children}</div>
      {footer}
    </div>
  );
}

// 32.01 ─────────────────────────────────────────────────
function ChatListaScreen({ go }) {
  const [q, setQ] = React.useState('');
  const [tab, setTab] = React.useState('todas');
  const totalUnread = MOCK_CHATS.reduce((s, c) => s + c.unread, 0);
  const filtered = MOCK_CHATS.filter(c => {
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (tab === 'grupos') return c.type === 'group';
    if (tab === 'pessoas') return c.type === 'dm';
    if (tab === 'nao-lidas') return c.unread > 0;
    return true;
  });
  return (
    <ChatShell title="Mensagens" subtitle={totalUnread > 0 ? `${totalUnread} não lidas` : 'Tudo em dia'} onBack={() => go('back')}
      action={<button onClick={() => go('toast', { kind: 'info', message: 'Em breve: nova conversa.' })} style={{
        width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name="edit_square" size={22} color={T.c.n950}/></button>}>
      {/* Search */}
      <div style={{ padding: '12px 16px 8px', background: T.c.n0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: T.c.n100, borderRadius: T.r.full }}>
          <Icon name="search" size={20} color={T.c.n600}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar conversas" style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font, fontSize: 14, color: T.c.n950,
          }}/>
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="close" size={18} color={T.c.n600}/></button>}
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 16px 8px', gap: 8, background: T.c.n0 }}>
        {[
          { id: 'todas',     l: 'Todas' },
          { id: 'pessoas',   l: 'Pessoas' },
          { id: 'grupos',    l: 'Grupos' },
          { id: 'nao-lidas', l: 'Não lidas' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '6px 12px', borderRadius: T.r.full,
            background: tab === t.id ? T.c.p700 : T.c.n100,
            color: tab === t.id ? T.c.n0 : T.c.n800,
            border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
          }}>{t.l}</button>
        ))}
      </div>
      <div style={{ height: 1, background: T.c.n200 }}/>
      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <Icon name="forum" size={48} color={T.c.n400}/>
          <div style={{ ...T.t.body, color: T.c.n600, marginTop: 12 }}>Nenhuma conversa encontrada.</div>
        </div>
      ) : (
        <div style={{ background: T.c.n0 }}>
          {filtered.map((c, i) => (
            <button key={c.id} onClick={() => go('chat-conversa', { chat: c })} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              background: 'none', border: 'none', borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${T.c.n100}`,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ position: 'relative' }}>
                {c.type === 'group' ? (
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="groups" size={24} color={T.c.n0}/>
                  </div>
                ) : (
                  <Avatar name={c.name} size={48} level={c.level}/>
                )}
                {c.unread > 0 && (
                  <div style={{
                    position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9,
                    background: T.c.p700, color: T.c.n0, fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                    border: `2px solid ${T.c.n0}`,
                  }}>{c.unread}</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ ...T.t.bodyB, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}{c.type === 'group' && <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400, marginLeft: 6 }}>· {c.members}</span>}
                  </div>
                  <div style={{ ...T.t.caption, color: c.unread > 0 ? T.c.p700 : T.c.n600, fontWeight: c.unread > 0 ? 600 : 400, flexShrink: 0 }}>{c.when}</div>
                </div>
                <div style={{
                  ...T.t.body, color: c.unread > 0 ? T.c.n950 : T.c.n600,
                  fontWeight: c.unread > 0 ? 500 : 400, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
                }}>{c.last}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </ChatShell>
  );
}

// 32.02 ─────────────────────────────────────────────────
function ChatConversaScreen({ go, params, ctx }) {
  const chat = (params && params.chat) || MOCK_CHATS[1];
  const [messages, setMessages] = React.useState(MOCK_MESSAGES);
  const [text, setText] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : [];
  const send = () => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { id: Date.now(), from: 'Você', text: text.trim(), when: now, mine: true }]);
    setText('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, from: chat.name, text: 'Pode crer, pulando aqui no recreio!', when: now, mine: false, level: chat.level }]);
    }, 1600);
  };
  return (
    <ChatShell
      onBack={() => go('back')}
      leading={chat.type === 'group' ? (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="groups" size={18} color={T.c.n0}/>
        </div>
      ) : (
        <Avatar name={chat.name} size={36} level={chat.level}/>
      )}
      title={chat.name}
      subtitle={chat.type === 'group' ? `${chat.members} membros` : (typing ? 'digitando…' : 'online agora')}
      action={
        <div style={{ display: 'flex' }}>
          <button onClick={() => go('toast', { kind: 'info', message: 'Em breve: chamada de voz.' })} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="call" size={22} color={T.c.n950}/></button>
          <button onClick={() => go('toast', { kind: 'info', message: 'Em breve: chamada de vídeo.' })} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="videocam" size={22} color={T.c.n950}/></button>
          <button onClick={() => {}} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="more_vert" size={22} color={T.c.n950}/></button>
        </div>
      }
      footer={
        <div style={{ padding: 8, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <button onClick={() => go('toast', { kind: 'info', message: 'Em breve: anexar.' })} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            <Icon name="add_circle" size={28} color={T.c.p700}/>
          </button>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', background: T.c.n100, borderRadius: 22, paddingRight: 4 }}>
            <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Mensagem..." rows={1} style={{
              flex: 1, padding: '10px 14px', border: 'none', outline: 'none',
              background: 'transparent', fontFamily: T.font, fontSize: 15, color: T.c.n950,
              resize: 'none', maxHeight: 120,
            }}/>
            <button style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="wine_bar" size={20} color={T.c.n600}/>
            </button>
            <button style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="photo_camera" size={20} color={T.c.n600}/>
            </button>
          </div>
          {text.trim() ? (
            <button onClick={send} style={{ width: 40, height: 40, borderRadius: '50%', background: T.c.p700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="send" size={20} color={T.c.n0}/>
            </button>
          ) : (
            <button onClick={() => go('toast', { kind: 'info', message: 'Em breve: gravar áudio.' })} style={{ width: 40, height: 40, borderRadius: '50%', background: T.c.p700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="mic" size={20} color={T.c.n0}/>
            </button>
          )}
        </div>
      }>
      {/* Day separator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
        <div style={{ padding: '4px 12px', background: T.c.n100, borderRadius: T.r.full, ...T.t.caption, color: T.c.n600 }}>Hoje</div>
      </div>

      {/* Messages */}
      <div style={{ padding: '0 12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showAvatar = !m.mine && (!prev || prev.mine || prev.from !== m.from);
          return (
            <div key={m.id} style={{ display: 'flex', gap: 6, alignItems: 'flex-end', justifyContent: m.mine ? 'flex-end' : 'flex-start' }}>
              {!m.mine && (showAvatar ? <Avatar name={m.from} size={28} level={m.level}/> : <div style={{ width: 28 }}/>)}
              <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: m.mine ? 'flex-end' : 'flex-start', gap: 2 }}>
                <div style={{
                  background: m.mine ? T.c.p700 : T.c.n100,
                  color: m.mine ? T.c.n0 : T.c.n950,
                  padding: '8px 12px',
                  borderRadius: 18,
                  borderBottomRightRadius: m.mine ? 4 : 18,
                  borderBottomLeftRadius:  m.mine ? 18 : 4,
                  ...T.t.body, lineHeight: 1.4,
                }}>
                  {m.text}
                  {m.wineAttached && wines[0] && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, padding: 8, background: m.mine ? 'rgba(255,255,255,0.14)' : T.c.n0, borderRadius: T.r.sm }}>
                      <BottlePlaceholder width={32} height={44} label="" showLabel={false}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...T.t.caption, color: m.mine ? 'rgba(255,255,255,0.9)' : T.c.n800, fontWeight: 700 }}>{wines[0].name}</div>
                        <div style={{ ...T.t.caption, color: m.mine ? 'rgba(255,255,255,0.7)' : T.c.n600, fontSize: 11 }}>R$ 189 · Casa Valduga</div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: m.mine ? 0 : 4, paddingRight: m.mine ? 4 : 0 }}>
                  <span style={{ ...T.t.caption, color: T.c.n600, fontSize: 11 }}>{m.when}</span>
                  {m.mine && <Icon name="done_all" size={14} color={T.c.i700}/>}
                </div>
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', marginTop: 4 }}>
            <Avatar name={chat.name} size={28} level={chat.level}/>
            <div style={{ background: T.c.n100, padding: '12px 14px', borderRadius: 18, borderBottomLeftRadius: 4, display: 'inline-flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: T.c.n600,
                  animation: `tcTypingDot 1.2s infinite ${i * 0.18}s`,
                }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inject typing keyframes */}
      <style>{`@keyframes tcTypingDot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }`}</style>
    </ChatShell>
  );
}

Object.assign(window, { ChatShell, ChatListaScreen, ChatConversaScreen, MOCK_CHATS, MOCK_MESSAGES });


export { ChatConversaScreen, ChatListaScreen, ChatShell, MOCK_CHATS, MOCK_MESSAGES };
