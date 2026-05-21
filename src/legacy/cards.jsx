/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Card, MatchBadge } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — Screen wine card + post card + confraria card + event card

// ─── Wine Card (list / grid) ───────────────────────────────
function WineCard({ wine, onClick, layout = 'row', showMatch = true }) {
  const { name, producer, country, region, type, price, image, match, favorited } = wine;
  const typeColors = {
    Tinto: T.c.p700, Branco: T.c.a700, Rosé: T.c.p300,
    Espumante: T.c.a500, Fortificado: T.c.p900,
  };
  if (layout === 'row') {
    return (
      <Card onClick={onClick} hoverable padding={12} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {image
          ? <img src={image} alt={name} style={{ width: 64, height: 88, objectFit: 'cover', borderRadius: T.r.sm }}/>
          : <BottlePlaceholder width={64} height={88} label="sem foto"/>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ ...T.t.overline, color: typeColors[type] || T.c.n600 }}>{type}</span>
            {country && <span style={{ fontSize: 11, color: T.c.n400 }}>·</span>}
            {country && <span style={{ fontSize: 11, color: T.c.n600 }}>{country}</span>}
          </div>
          <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 6 }}>{producer}{region ? ' · ' + region : ''}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {showMatch && <MatchBadge score={match} size="sm" variant="pill"/>}
            {price != null && (
              <span style={{ fontSize: 14, fontWeight: 700, color: T.c.n950, fontFamily: T.font }}>
                R$ {price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  }
  // grid layout — per spec §7.19
  const flagMap = { Argentina: '🇦🇷', Brasil: '🇧🇷', Chile: '🇨🇱', Portugal: '🇵🇹', Itália: '🇮🇹', França: '🇫🇷', Espanha: '🇪🇸', Uruguai: '🇺🇾' };
  const flag = flagMap[country] || '🌐';
  const [favLocal, setFavLocal] = React.useState(!!favorited);
  return (
    <Card onClick={onClick} hoverable padding={0} style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', background: T.c.n100 }}>
        {image
          ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, ${T.c.p50}, ${T.c.n100})` }}>
              <BottlePlaceholder width={62} height={108} label=""/>
            </div>
          )}
        {/* Flag chip top-left */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          height: 26, padding: '0 8px', borderRadius: T.r.full,
          background: 'rgba(255,255,255,0.95)', boxShadow: T.el[1],
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14,
        }}>
          <span>{flag}</span>
          {country && <span style={{ fontSize: 11, fontWeight: 600, color: T.c.n800 }}>{country}</span>}
        </div>
        {/* Heart top-right (≥44dp tap target, visual ~32) */}
        <button onClick={(e) => { e.stopPropagation(); setFavLocal(!favLocal); }} style={{
          position: 'absolute', top: 0, right: 0,
          width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: T.r.full, background: T.c.n0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: T.el[1],
          }}>
            <Icon name="favorite" size={18} color={favLocal ? T.c.e700 : T.c.n600} fill={favLocal ? 1 : 0}/>
          </div>
        </button>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{
          ...T.t.h3, color: T.c.n950, marginBottom: 6,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          lineHeight: '20px', minHeight: 40, fontSize: 14,
        }}>{name}</div>
        {price != null && (
          <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n950, fontFamily: T.font, marginBottom: 6 }}>
            R$ {price.toFixed(2).replace('.', ',')}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Icon name="star" size={14} color={T.c.a700} fill={1}/>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.c.n800, fontFamily: T.font }}>
              {(wine.rating || 4.5).toFixed(1).replace('.', ',')}
            </span>
          </div>
          {showMatch && match != null && match >= 40 && (
            <>
              <span style={{ color: T.c.n300, fontSize: 11 }}>·</span>
              <MatchBadge score={match} size="sm" variant="pill"/>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Post Card ─────────────────────────────────────────────
function PostCard({ post, onLike, onComment, onShare }) {
  const { author, level, time, content, image, wineRef, likes, comments, liked, withUser } = post;
  const levelLabel = level === 'expert' ? 'Enófilo' : level === 'intermediario' ? 'Intermediário' : 'Iniciante';
  // Render content with hashtag highlighting
  const renderContent = (text) => {
    const parts = text.split(/(#[\wÀ-ú]+|\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('#')) return <span key={i} style={{ color: T.c.p700, fontWeight: 600, cursor: 'pointer' }}>{p}</span>;
      if (p.startsWith('**')) return <strong key={i} style={{ fontWeight: 700, color: T.c.n950 }}>{p.slice(2, -2)}</strong>;
      return <React.Fragment key={i}>{p}</React.Fragment>;
    });
  };
  return (
    <Card padding={0} style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14 }}>
        <Avatar name={author} size={40} level={level}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{author}</div>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>{levelLabel} · há {time}</div>
          {withUser && (
            <div style={{ ...T.t.caption, color: T.c.n800, marginTop: 2 }}>
              Com <strong style={{ fontWeight: 600, color: T.c.p700 }}>{withUser}</strong>
            </div>
          )}
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, alignSelf: 'flex-start' }}>
          <Icon name="more_vert" size={20} color={T.c.n600}/>
        </button>
      </div>
      {content && (
        <div style={{
          padding: '0 14px 12px', ...T.t.bodyLg, color: T.c.n800,
          textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{renderContent(content)}</div>
      )}
      {image && (
        <div style={{ background: T.c.n100, aspectRatio: '4/3', overflow: 'hidden' }}>
          {typeof image === 'string'
            ? <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.c.p50 }}>
                <BottlePlaceholder width={120} height={160}/>
              </div>}
        </div>
      )}
      {wineRef && (
        <div style={{ margin: '0 14px 12px', padding: 10, background: T.c.p50, borderRadius: T.r.md, display: 'flex', gap: 10, alignItems: 'center', border: `1px solid ${T.c.p100}` }}>
          <BottlePlaceholder width={36} height={50} label=""/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.t.caption, color: T.c.p700, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Vinho referenciado</div>
            <div style={{ ...T.t.bodyB, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wineRef.name}</div>
            <div style={{ ...T.t.caption, color: T.c.n600 }}>{wineRef.producer}</div>
          </div>
          <MatchBadge score={wineRef.match} size="sm"/>
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        borderTop: `1px solid ${T.c.n200}`, padding: '6px 0',
      }}>
        <PostAction icon="favorite" label={likes} active={liked} activeColor={T.c.e700} onClick={onLike}/>
        <PostAction icon="chat_bubble" label={comments} onClick={onComment}/>
        <PostAction icon="ios_share" label="" onClick={onShare}/>
      </div>
    </Card>
  );
}
function PostAction({ icon, label, active, activeColor, onClick }) {
  const [bumpKey, setBumpKey] = React.useState(0);
  const prevActive = React.useRef(active);
  React.useEffect(() => {
    if (active && !prevActive.current) setBumpKey(k => k + 1);
    prevActive.current = active;
  }, [active]);
  return (
    <button onClick={onClick} style={{
      flex: 1, background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '10px 0', color: active ? activeColor : T.c.n600,
      fontFamily: T.font, fontSize: 13, fontWeight: 500,
      transition: 'color 200ms ease',
    }}>
      <span key={bumpKey} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        animation: bumpKey ? 'tcLikePop 300ms ease-out' : 'none',
      }}>
        <Icon name={icon} size={20} fill={active ? 1 : 0}/>
      </span>
      {label !== '' && <span>{label}</span>}
    </button>
  );
}

// ─── Confraria Card ────────────────────────────────────────
const ACTIVITY_META = {
  'muito-ativa': { emoji: '🔥', label: 'Muito ativa', bg: '#FFEDD5', fg: '#C2410C' },
  'ativa':       { emoji: '⚡', label: 'Ativa',       bg: '#FEF3C7', fg: '#A16207' },
  'pouco-ativa': { emoji: '💤', label: 'Pouco ativa', bg: '#E5E7EB', fg: '#4B5563' },
  'inativa':     { emoji: '🌙', label: 'Inativa',     bg: '#E5E7EB', fg: '#6B7280' },
};

function ConfrariaCard({ confraria, onClick }) {
  const { name, description, members, activity = 'ativa', visibility = 'publica', modality, location, tags = [], color = T.c.p700, cover } = confraria;
  const act = ACTIVITY_META[activity] || ACTIVITY_META['ativa'];
  const place = modality === 'presencial' ? `📍 ${location || 'Brasília, DF'}` : modality === 'online' ? '🌐 Online' : '🔀 Híbrida';
  const visLabel = visibility === 'privada' ? 'Grupo Privado' : 'Grupo Público';
  return (
    <Card onClick={onClick} hoverable padding={0} style={{ overflow: 'hidden' }}>
      {/* Cover — default: gradient burgundy + ícone groups */}
      <div style={{
        aspectRatio: '16 / 9', background: cover ? `url(${cover}) center/cover` : `linear-gradient(135deg, ${color} 0%, ${T.c.p900} 100%)`,
        position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 10,
      }}>
        {!cover && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.18 }}>
            <Icon name="groups" size={72} color="#fff"/>
          </div>
        )}
        {/* Bottom-left meta row */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: T.r.full,
            background: act.bg, color: act.fg, fontSize: 11, fontWeight: 600,
          }}>
            <span>{act.emoji}</span>{act.label}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: T.r.full,
            background: 'rgba(255,255,255,0.92)', color: T.c.n950, fontSize: 11, fontWeight: 600,
          }}>
            {place}
          </div>
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>{name}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 8 }}>{visLabel} · {members} membros</div>
        <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.slice(0, 2).map(t => (
              <span key={t} style={{ padding: '4px 10px', borderRadius: T.r.full, background: T.c.p50, color: T.c.p700, fontSize: 11, fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Event Card ────────────────────────────────────────────
function EventCard({ event, onClick }) {
  const { title, date, time, location, participants, modality, joined } = event;
  const d = new Date(date);
  const day = d.getDate();
  const month = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][d.getMonth()];
  return (
    <Card onClick={onClick} hoverable padding={12} style={{ display: 'flex', gap: 12 }}>
      <div style={{
        width: 56, height: 64, background: T.c.p50, borderRadius: T.r.md,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, border: `1px solid ${T.c.p100}`,
      }}>
        <div style={{ ...T.t.overline, color: T.c.p700, fontSize: 10 }}>{month}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.c.p900, fontFamily: T.font, lineHeight: 1 }}>{day}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <Icon name="schedule" size={14} color={T.c.n600}/>
          <span style={{ ...T.t.caption, color: T.c.n600 }}>{time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <Icon name={modality === 'online' ? 'videocam' : 'location_on'} size={14} color={T.c.n600}/>
          <span style={{ ...T.t.caption, color: T.c.n600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...T.t.caption, color: T.c.n800 }}>
            <strong>{participants}</strong> participam
          </span>
          <span style={{
            padding: '4px 10px', background: joined ? T.c.s100 : T.c.p50,
            color: joined ? T.c.s700 : T.c.p700, borderRadius: T.r.full,
            fontSize: 11, fontWeight: 600,
          }}>
            {joined ? '✓ Confirmado' : 'Participar'}
          </span>
        </div>
      </div>
    </Card>
  );
}

// ─── Curiosity Card (Uva da Semana) ────────────────────────
function CuriosityCard({ topic, title, text, source }) {
  return (
    <Card padding={16} style={{ background: `linear-gradient(135deg, ${T.c.p50}, ${T.c.p100})`, border: `1px solid ${T.c.p100}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ ...T.t.overline, color: T.c.p700 }}>{topic}</span>
        <div style={{ flex: 1, height: 1, background: T.c.p100 }}/>
      </div>
      <div style={{ ...T.t.h2, color: T.c.p900, marginBottom: 6, fontFamily: T.font }}>{title}</div>
      <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 8, lineHeight: '22px' }}>{text}</div>
      {source && <div style={{ ...T.t.caption, color: T.c.n600, fontStyle: 'italic' }}>— {source}</div>}
    </Card>
  );
}

// ─── Section header ────────────────────────────────────────
function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 16px', marginBottom: 12 }}>
      <div style={{ ...T.t.h2, color: T.c.n950 }}>{title}</div>
      {action && (
        <button onClick={action.onClick} style={{ background: 'none', border: 'none', color: T.c.p700, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: T.font }}>
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── FAB ───────────────────────────────────────────────────
function FAB({ icon, label, onClick, extended, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      opacity: disabled ? 0.5 : 1,
      position: 'absolute', bottom: 80, right: 16, zIndex: 10,
      height: 56, padding: extended ? '0 20px 0 16px' : 0,
      width: extended ? 'auto' : 56, borderRadius: T.r.lg,
      background: T.c.p700, color: T.c.n0, border: 'none',
      boxShadow: T.el[3], cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: T.font, fontWeight: 600, fontSize: 14,
    }}>
      <Icon name={icon} size={24}/>
      {extended && label}
    </button>
  );
}

Object.assign(window, {
  WineCard, PostCard, ConfrariaCard, EventCard, CuriosityCard, ACTIVITY_META,
  SectionHeader, FAB, PostAction,
});


export { ACTIVITY_META, ConfrariaCard, CuriosityCard, EventCard, FAB, PostAction, PostCard, SectionHeader, WineCard };
