/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Compositor + Comentários (3 telas)
//
//   31.01 criar-post    → compositor (foto + texto + marcar vinho + audiência)
//   31.02 criar-momento → "Momento" (vídeo curto / story do Tchin Tchin)
//   31.03 comentarios   → tela cheia de comentários + responder + reportar
//
//   Acessadas via FAB "edit" no tab Comunidade, ou tap em comentário no post.
// ─────────────────────────────────────────────────────────────

function PostShell({ title, onBack, action, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>
        {action}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

// 31.01 ─────────────────────────────────────────────────
function CriarPostScreen({ go, ctx }) {
  const u = (ctx && ctx.user) || { name: 'Você' };
  const [text, setText] = React.useState('');
  const [photo, setPhoto] = React.useState(false);
  const [wine, setWine] = React.useState(null);
  const [audience, setAudience] = React.useState('confraria');
  const [audOpen, setAudOpen] = React.useState(false);
  const [wineOpen, setWineOpen] = React.useState(false);
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : [];
  const canPost = text.trim().length > 0 || photo || wine;
  const audiences = [
    { id: 'public',    icon: 'public',  label: 'Todo mundo',     sub: 'Qualquer pessoa no Tchin Tchin' },
    { id: 'confraria', icon: 'groups',  label: 'Minhas confrarias', sub: 'Brindar em Brasília + 2 outras' },
    { id: 'only-me',   icon: 'lock',    label: 'Só você',        sub: 'Salva no rascunho, ninguém vê' },
  ];
  const audMeta = audiences.find(a => a.id === audience);

  return (
    <PostShell title="Novo post" onBack={() => go('back')}
      action={<button onClick={() => { go('toast', { kind: 'success', message: 'Post publicado!' }); go('back'); }} disabled={!canPost} style={{
        background: canPost ? T.c.p700 : T.c.n200, border: 'none', cursor: canPost ? 'pointer' : 'default',
        color: canPost ? T.c.n0 : T.c.n600,
        fontFamily: T.font, fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: T.r.full, marginRight: 8,
      }}>Publicar</button>}>
      {/* Author + audience */}
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={u.name} size={40} level={u.level}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{u.name}</div>
          <button onClick={() => setAudOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4,
            padding: '3px 10px', borderRadius: T.r.full, background: T.c.n100, border: 'none', cursor: 'pointer',
            color: T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 600,
          }}>
            <Icon name={audMeta.icon} size={14} color={T.c.n800}/>
            {audMeta.label}
            <Icon name="expand_more" size={16} color={T.c.n800}/>
          </button>
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding: '8px 16px' }}>
        <textarea autoFocus value={text} onChange={e => setText(e.target.value.slice(0, 500))}
          placeholder="No que está pensando? Conta a história, marca o vinho..." rows={6} style={{
          width: '100%', padding: 0, border: 'none', outline: 'none',
          background: 'transparent', fontFamily: T.font, fontSize: 17, color: T.c.n950,
          resize: 'none', boxSizing: 'border-box', lineHeight: 1.5,
        }}/>
        <div style={{ ...T.t.caption, color: text.length > 450 ? T.c.w700 : T.c.n400, textAlign: 'right' }}>{text.length}/500</div>
      </div>

      {/* Attached media */}
      {photo && (
        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{
            position: 'relative', height: 280, borderRadius: T.r.lg, overflow: 'hidden',
            background: `linear-gradient(135deg, ${T.c.p500} 0%, ${T.c.p900} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.22,
              backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 12px)`,
            }}/>
            <Icon name="image" size={48} color="rgba(255,255,255,0.65)"/>
            <button onClick={() => setPhoto(false)} style={{
              position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(15,15,15,0.7)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="close" size={18} color={T.c.n0}/></button>
          </div>
        </div>
      )}

      {wine && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 12, padding: 12, background: T.c.n50, borderRadius: T.r.md, border: `1px solid ${T.c.n200}`, position: 'relative' }}>
            <BottlePlaceholder width={40} height={56} label=""/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.t.overline, color: T.c.p700 }}>VINHO MARCADO</div>
              <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 2 }}>{wine.name}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{wine.country}{wine.region ? ' · ' + wine.region : ''}</div>
            </div>
            <button onClick={() => setWine(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'flex-start' }}>
              <Icon name="close" size={18} color={T.c.n600}/>
            </button>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div style={{
        position: 'sticky', bottom: 0, padding: 12, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <PostBarBtn icon="photo_library" label="Foto"        onClick={() => setPhoto(true)}/>
        <PostBarBtn icon="wine_bar"      label="Vinho"       onClick={() => setWineOpen(true)} active={!!wine}/>
        <PostBarBtn icon="alternate_email" label="Marcar"    onClick={() => setText(t => t + ' @')}/>
        <PostBarBtn icon="emoji_events"  label="Desafio"     onClick={() => go('toast', { kind: 'info', message: 'Você está participando do Desafio Espanhol!' })}/>
        <PostBarBtn icon="poll"          label="Enquete"     onClick={() => go('toast', { kind: 'info', message: 'Em breve: enquetes.' })}/>
      </div>

      {/* Audience sheet */}
      {audOpen && (
        <div onClick={() => setAudOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl, padding: 20, width: '100%', animation: 'tcSlideUp 220ms' }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 12 }}>Quem vê esse post?</div>
            {audiences.map(a => (
              <button key={a.id} onClick={() => { setAudience(a.id); setAudOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                background: audience === a.id ? T.c.p50 : T.c.n0,
                border: `1.5px solid ${audience === a.id ? T.c.p700 : T.c.n200}`,
                borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left', marginBottom: 8,
              }}>
                <Icon name={a.icon} size={22} color={audience === a.id ? T.c.p700 : T.c.n600}/>
                <div style={{ flex: 1 }}>
                  <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{a.label}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{a.sub}</div>
                </div>
                {audience === a.id && <Icon name="check_circle" size={20} color={T.c.p700} fill={1}/>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wine picker sheet */}
      {wineOpen && (
        <div onClick={() => setWineOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl, padding: 20, width: '100%', maxHeight: '70%', display: 'flex', flexDirection: 'column', animation: 'tcSlideUp 220ms' }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 12 }}>Marcar um vinho</div>
            <div style={{ overflow: 'auto', flex: 1 }}>
              {wines.slice(0, 6).map((w, i) => (
                <button key={i} onClick={() => { setWine(w); setWineOpen(false); }} style={{
                  width: '100%', display: 'flex', gap: 12, padding: 10, background: 'none', border: 'none',
                  borderBottom: `1px solid ${T.c.n100}`, cursor: 'pointer', textAlign: 'left',
                }}>
                  <BottlePlaceholder width={36} height={50} label=""/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{w.name}</div>
                    <div style={{ ...T.t.caption, color: T.c.n600 }}>{w.producer} · {w.country}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PostShell>
  );
}

function PostBarBtn({ icon, label, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer',
      color: active ? T.c.p700 : T.c.n800,
    }}>
      <Icon name={icon} size={22} color={active ? T.c.p700 : T.c.n800} fill={active ? 1 : 0}/>
      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: T.font }}>{label}</span>
    </button>
  );
}

// 31.02 ─────────────────────────────────────────────────
function CriarMomentoScreen({ go }) {
  const [hue, setHue] = React.useState(20);
  const [caption, setCaption] = React.useState('');
  const filters = [
    { name: 'Cru',     hue: 0 },
    { name: 'Borgonha', hue: 350 },
    { name: 'Câmara',  hue: 30 },
    { name: 'Crepúsculo', hue: 280 },
    { name: 'Verde',   hue: 90 },
  ];
  return (
    <PostShell title="Novo momento" onBack={() => go('back')}
      action={<button onClick={() => { go('toast', { kind: 'success', message: 'Momento publicado por 24h.' }); go('back'); }} style={{
        background: T.c.p700, border: 'none', cursor: 'pointer', color: T.c.n0,
        fontFamily: T.font, fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: T.r.full, marginRight: 8,
      }}>Publicar</button>}>
      {/* Preview canvas (9:16 portrait) */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
        <div style={{
          width: 260, height: 460, borderRadius: T.r.lg, overflow: 'hidden', position: 'relative',
          background: `linear-gradient(180deg, hsl(${hue}, 50%, 40%) 0%, hsl(${hue + 20}, 65%, 18%) 100%)`,
          boxShadow: T.el[4],
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.22,
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)`,
          }}/>
          {/* Bottle silhouette */}
          <svg viewBox="0 0 100 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M40 20 L40 60 Q30 80 30 100 L30 175 Q30 185 40 185 L60 185 Q70 185 70 175 L70 100 Q70 80 60 60 L60 20 Z" fill="rgba(255,255,255,0.2)"/>
          </svg>
          {caption && (
            <div style={{
              position: 'absolute', bottom: 24, left: 16, right: 16, color: T.c.n0,
              fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, fontWeight: 600,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)', lineHeight: 1.3,
            }}>{caption}</div>
          )}
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 12, height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 2,
          }}>
            <div style={{ height: '100%', width: '60%', background: T.c.n0, borderRadius: 2 }}/>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 10 }}>Filtro</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {filters.map(f => (
            <button key={f.name} onClick={() => setHue(f.hue)} style={{
              flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: T.r.md,
                background: `linear-gradient(180deg, hsl(${f.hue}, 50%, 40%) 0%, hsl(${f.hue + 20}, 65%, 18%) 100%)`,
                border: `2px solid ${hue === f.hue ? T.c.p700 : 'transparent'}`,
              }}/>
              <span style={{ ...T.t.caption, color: hue === f.hue ? T.c.p700 : T.c.n600, fontWeight: 600 }}>{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div style={{ padding: 16 }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Legenda</div>
        <input value={caption} onChange={e => setCaption(e.target.value.slice(0, 80))} placeholder="Conta em poucas palavras..." style={{
          width: '100%', padding: '12px 14px', border: `1.5px solid ${T.c.n300}`,
          borderRadius: T.r.md, fontFamily: T.font, fontSize: 15, color: T.c.n950,
          outline: 'none', boxSizing: 'border-box', background: T.c.n0,
        }}/>
      </div>

      {/* Action row */}
      <div style={{ padding: '0 16px 24px', display: 'flex', gap: 8 }}>
        <Button variant="secondary" size="md" leading={<Icon name="wine_bar" size={18}/>} onClick={() => {}}>Vinho</Button>
        <Button variant="secondary" size="md" leading={<Icon name="music_note" size={18}/>} onClick={() => {}}>Música</Button>
        <Button variant="secondary" size="md" leading={<Icon name="schedule" size={18}/>} onClick={() => {}}>24h</Button>
      </div>
    </PostShell>
  );
}

// 31.03 ─────────────────────────────────────────────────
function ComentariosScreen({ go, params }) {
  const post = (params && params.post) || { author: 'Carla Mendes', text: 'Mosselle Riesling tá sensacional hoje. Recomendo!', when: 'há 2h', level: 'expert' };
  const [comments, setComments] = React.useState([
    { id: 1, author: 'Diego Reis',       level: 'intermediario', text: 'Onde achaste? Tô há semanas atrás disso.', when: 'há 1h',    likes: 3, mine: false, replies: [
      { id: 11, author: 'Carla Mendes',  level: 'expert',         text: 'Enoteca da 410. Tinha 3 garrafas ainda.', when: 'há 45min', likes: 1, mine: false },
    ]},
    { id: 2, author: 'Fernando Medrado', level: 'intermediario', text: 'Concordo plenamente. Tomei semana passada.', when: 'há 1h', likes: 0, mine: false, replies: [] },
    { id: 3, author: 'Helena Britto',    level: 'iniciante',     text: 'Riesling combina com o quê? Aceito sugestão!', when: 'há 30min', likes: 2, mine: false, replies: [] },
  ]);
  const [text, setText] = React.useState('');
  const [replyTo, setReplyTo] = React.useState(null);
  const [menuFor, setMenuFor] = React.useState(null);
  const [liked, setLiked] = React.useState({});

  const send = () => {
    if (!text.trim()) return;
    const newC = { id: Date.now(), author: 'Você', level: 'intermediario', text: text.trim(), when: 'agora', likes: 0, mine: true, replies: [] };
    if (replyTo) {
      setComments(cs => cs.map(c => c.id === replyTo ? { ...c, replies: [...c.replies, newC] } : c));
    } else {
      setComments(cs => [...cs, newC]);
    }
    setText(''); setReplyTo(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', borderBottom: `1px solid ${T.c.n200}` }}>
        <button onClick={() => go('back')} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Comentários</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Original post mini */}
        <div style={{ padding: 16, background: T.c.n50, borderBottom: `1px solid ${T.c.n200}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <Avatar name={post.author} size={32} level={post.level}/>
            <div>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{post.author}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{post.when}</div>
            </div>
          </div>
          <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>{post.text}</div>
        </div>

        {/* Comments */}
        <div style={{ padding: '8px 0' }}>
          {comments.map(c => (
            <div key={c.id}>
              <CommentRow c={c} liked={liked[c.id]} onLike={() => setLiked(l => ({ ...l, [c.id]: !l[c.id] }))} onReply={() => setReplyTo(c.id)} onMenu={() => setMenuFor(c.id)} go={go}/>
              {c.replies.map(r => (
                <div key={r.id} style={{ paddingLeft: 48 }}>
                  <CommentRow c={r} liked={liked[r.id]} onLike={() => setLiked(l => ({ ...l, [r.id]: !l[r.id] }))} onReply={() => setReplyTo(c.id)} onMenu={() => setMenuFor(r.id)} go={go} reply/>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding: 12, borderTop: `1px solid ${T.c.n200}`, background: T.c.n0 }}>
        {replyTo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: T.c.p50, borderRadius: T.r.sm, marginBottom: 8 }}>
            <Icon name="reply" size={14} color={T.c.p700}/>
            <span style={{ ...T.t.caption, color: T.c.n800, flex: 1 }}>Respondendo a <strong>{comments.find(c => c.id === replyTo)?.author}</strong></span>
            <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="close" size={14} color={T.c.n600}/></button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Avatar name="Você" size={32}/>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Adicionar comentário..." rows={1} style={{
              width: '100%', padding: '10px 44px 10px 14px', border: `1px solid ${T.c.n300}`, borderRadius: 20,
              background: T.c.n50, fontFamily: T.font, fontSize: 14, color: T.c.n950, outline: 'none', boxSizing: 'border-box', resize: 'none',
            }}/>
            <button onClick={send} disabled={!text.trim()} style={{
              position: 'absolute', right: 6, bottom: 6, width: 30, height: 30, borderRadius: '50%',
              background: text.trim() ? T.c.p700 : T.c.n300, border: 'none', cursor: text.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="send" size={14} color={T.c.n0}/></button>
          </div>
        </div>
      </div>

      {/* Menu sheet */}
      {menuFor && (
        <div onClick={() => setMenuFor(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl, padding: '8px 0 12px', width: '100%', animation: 'tcSlideUp 220ms' }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '4px auto 12px' }}/>
            {[
              { icon: 'reply',            label: 'Responder',        action: () => { setReplyTo(menuFor); setMenuFor(null); } },
              { icon: 'content_copy',     label: 'Copiar texto',     action: () => { setMenuFor(null); go('toast', { kind: 'success', message: 'Texto copiado.' }); } },
              { icon: 'flag',             label: 'Reportar',         danger: true, action: () => { setMenuFor(null); go('toast', { kind: 'success', message: 'Comentário reportado. Vamos analisar.' }); } },
              { icon: 'block',            label: 'Bloquear usuário', danger: true, action: () => { setMenuFor(null); go('toast', { kind: 'warning', message: 'Usuário bloqueado.' }); } },
            ].map(a => (
              <button key={a.label} onClick={a.action} style={{
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
      )}
    </div>
  );
}

function CommentRow({ c, liked, onLike, onReply, onMenu, go, reply }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 16px' }}>
      <Avatar name={c.author} size={reply ? 28 : 36} level={c.level}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: T.c.n100, borderRadius: T.r.lg,
          padding: '8px 12px', display: 'inline-block',
          maxWidth: '100%',
        }}>
          <div style={{ ...T.t.caption, color: T.c.n800, fontWeight: 600 }}>{c.author}</div>
          <div style={{ ...T.t.body, color: T.c.n950, lineHeight: 1.45, marginTop: 2 }}>{c.text}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 12px 0' }}>
          <span style={{ ...T.t.caption, color: T.c.n600 }}>{c.when}</span>
          <button onClick={onLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4, color: liked ? T.c.p700 : T.c.n600, fontFamily: T.font, fontSize: 12, fontWeight: 600 }}>
            Curtir {(c.likes + (liked ? 1 : 0)) > 0 && <span>· {c.likes + (liked ? 1 : 0)}</span>}
          </button>
          <button onClick={onReply} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: T.c.n600, fontFamily: T.font, fontSize: 12, fontWeight: 600 }}>Responder</button>
          <button onClick={onMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 'auto', display: 'flex' }}>
            <Icon name="more_horiz" size={16} color={T.c.n400}/>
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PostShell, CriarPostScreen, CriarMomentoScreen, ComentariosScreen });


export { ComentariosScreen, CommentRow, CriarMomentoScreen, CriarPostScreen, PostBarBtn, PostShell };
