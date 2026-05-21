/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Avatar } from './f13_01_Avatar.jsx';
import { BadgeExpert } from './f21_01_BadgeExpert.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 21.02 · RespostaVerificada — resposta de Expert no Q&A
//
// US-12-13-04 · sempre renderizada no topo da lista de respostas
//
//   <RespostaVerificada
//     answer={{
//       id, body, timeAgo: 'há 2h',
//       likes: 24, liked: false,
//       commentCount: 3, saved: false,
//     }}
//     expert={{
//       name: 'Carla Mendes',
//       avatarUrl?: '…',
//       handle: 'carlinha',
//       formacao: 'ABS-SP, atua há 12 anos',
//     }}
//     onLike={() => ...}
//     onComment={() => ...}
//     onSave={() => ...}
//     onTapExpert={() => ...}
//   />
//
// Visual: blue/50 → white gradient, 4px left border blue/500, BadgeExpert
// inline, label "✓ RESPOSTA VERIFICADA", chip "Sommelier" no canto.
// ─────────────────────────────────────────────────────────────

const RESPOSTA_CLAMP_LINES = 6;

function RespostaVerificada({
  answer = {},
  expert = {},
  onLike = () => {},
  onComment = () => {},
  onSave = () => {},
  onTapExpert = () => {},
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [overflows, setOverflows] = React.useState(false);
  const bodyRef = React.useRef(null);
  const [liked, setLiked] = React.useState(!!answer.liked);
  const [likeCount, setLikeCount] = React.useState(answer.likes || 0);
  const [saved, setSaved] = React.useState(!!answer.saved);

  // Measure overflow after mount to decide if "Ver mais" should show
  React.useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current;
    const isOver = el.scrollHeight - el.clientHeight > 2;
    setOverflows(isOver);
  }, [answer.body]);

  const handleLike = () => {
    setLiked(l => {
      const next = !l;
      setLikeCount(c => Math.max(0, c + (next ? 1 : -1)));
      return next;
    });
    onLike();
  };
  const handleSave = () => {
    setSaved(s => !s);
    onSave();
  };

  return (
    <article style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${T.c.i100} 0%, ${T.c.n0} 60%, ${T.c.n0} 100%)`,
      border: `1px solid ${T.c.i100}`,
      borderLeft: `4px solid ${T.c.i700}`,
      borderRadius: T.r.md,
      padding: 16,
      fontFamily: T.font,
      boxShadow: '0 1px 3px rgba(21,101,192,0.06)',
      overflow: 'hidden',
    }}>
      {/* Decorative ribbon icon top-right */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -8, right: -8,
        width: 64, height: 64, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(21,101,192,0.10) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      {/* Top row */}
      <header style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        position: 'relative',
      }}>
        <button
          type="button"
          onClick={onTapExpert}
          aria-label={`Ver perfil de ${expert.name}`}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            flexShrink: 0, borderRadius: '50%',
            outlineOffset: 2,
          }}
        >
          {typeof Avatar !== 'undefined' ? (
            <Avatar
              size="md"
              name={expert.name}
              userId={expert.id || expert.handle || expert.name}
              src={expert.avatarUrl}
            />
          ) : (
            <FallbackAvatar name={expert.name}/>
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={onTapExpert}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'baseline', gap: 6,
              fontFamily: T.font,
              fontSize: 15, fontWeight: 700, color: T.c.n950,
              letterSpacing: '-0.005em',
              textAlign: 'left',
            }}
          >
            {expert.name || 'Expert'}
            {typeof BadgeExpert !== 'undefined' && (
              <BadgeExpert
                size="sm"
                expertData={expert.formacao ? { formacao: expert.formacao } : undefined}
              />
            )}
          </button>

          <div style={{
            marginTop: 2,
            ...T.t.overline,
            color: T.c.i700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            letterSpacing: 1.2,
          }}>
            <Icon name="verified" size={11} color={T.c.i700} fill={1}/>
            Resposta verificada
          </div>
        </div>

        {/* Sommelier chip */}
        <div style={{
          padding: '3px 9px',
          background: T.c.i100,
          color: T.c.i700,
          borderRadius: T.r.full,
          fontSize: 11, fontWeight: 700,
          letterSpacing: 0.2,
          alignSelf: 'flex-start',
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="local_bar" size={11} color={T.c.i700}/>
          Sommelier
        </div>
      </header>

      {/* Body */}
      <div style={{ marginTop: 12 }}>
        <div
          ref={bodyRef}
          style={{
            fontSize: 14, lineHeight: 1.55,
            color: T.c.n800,
            textWrap: 'pretty',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : RESPOSTA_CLAMP_LINES,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
            whiteSpace: 'pre-wrap',
          }}
        >{answer.body || ''}</div>

        {overflows && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            style={{
              marginTop: 6,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer',
              color: T.c.i700,
              fontFamily: T.font, fontSize: 13, fontWeight: 600,
            }}
          >
            Ver mais
            <Icon name="expand_more" size={14} color={T.c.i700}/>
          </button>
        )}
        {overflows && expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            style={{
              marginTop: 6,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer',
              color: T.c.i700,
              fontFamily: T.font, fontSize: 13, fontWeight: 600,
            }}
          >
            Ver menos
            <Icon name="expand_less" size={14} color={T.c.i700}/>
          </button>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 14, paddingTop: 12,
        borderTop: `1px solid rgba(21,101,192,0.12)`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          flex: 1, minWidth: 0,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="schedule" size={12} color={T.c.n600}/>
          Respondida {answer.timeAgo || 'agora'}
        </div>

        <RespostaAction
          icon="thumb_up"
          label={String(likeCount)}
          active={liked}
          activeColor={T.c.i700}
          onClick={handleLike}
        />
        <RespostaAction
          icon="chat_bubble"
          label={answer.commentCount > 0 ? String(answer.commentCount) : null}
          onClick={onComment}
        />
        <RespostaAction
          icon="bookmark"
          active={saved}
          activeColor={T.c.p700}
          onClick={handleSave}
        />
      </footer>
    </article>
  );
}

// ─── Action button ───────────────────────────────────────────
function RespostaAction({ icon, label, active, activeColor, onClick }) {
  const color = active ? activeColor : T.c.n600;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 28, padding: label ? '0 10px' : '0 8px',
        background: active ? `${activeColor}14` : 'transparent',
        color,
        border: 'none', borderRadius: T.r.full,
        cursor: 'pointer',
        fontFamily: T.font, fontSize: 12, fontWeight: 600,
        transition: 'background 120ms, color 120ms',
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = T.c.n100;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <Icon
        name={icon}
        size={14}
        color={color}
        fill={active ? 1 : 0}
        weight={active ? 600 : 500}
      />
      {label}
    </button>
  );
}

// ─── Fallback avatar (when 13.01_Avatar isn't loaded) ────────
function FallbackAvatar({ name }) {
  const initials = String(name || '?').trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%',
      background: `linear-gradient(135deg, ${T.c.i700}, ${T.c.p700})`,
      color: T.c.n0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.font, fontSize: 15, fontWeight: 700,
    }}>{initials}</div>
  );
}

Object.assign(window, { RespostaVerificada });


export { FallbackAvatar, RESPOSTA_CLAMP_LINES, RespostaAction, RespostaVerificada };
