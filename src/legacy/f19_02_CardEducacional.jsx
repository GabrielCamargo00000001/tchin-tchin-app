/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 19.02 · CardEducacional — card "Você sabia?" contextual
//
// US-12-4-01 · aparece pós-registro com fato relevante ao vinho
// (uva, região, produtor, harmonização).
//
//   <CardEducacional
//     cardData={{
//       eyebrow: 'VOCÊ SABIA?',          // opcional, default
//       title: 'Tannat é a uva nacional do Uruguai',
//       body: 'Trazida em 1870 por imigrantes bascos…',
//       category: 'Uva',                  // opcional
//       imageGradient: ['#722F37', '#4A1F24'],  // OU
//       imageUrl: 'https://…',            // imagem inline 80×80
//       icon: 'eco',                      // opcional, fallback se sem imagem
//     }}
//     onSimTap={() => trackHelpful('sim')}
//     onNaoTap={() => trackHelpful('nao')}
//     onVerMais={() => goAprenda()}
//   />
//
// Tipologia: card compacto neutral, contraponto ao card hero do 18.03
// (que usa gradiente cheio). Use este aqui em listas, feeds, post-actions.
// ─────────────────────────────────────────────────────────────

function CardEducacional({
  cardData = {},
  onSimTap = () => {},
  onNaoTap = () => {},
  onVerMais = () => {},
  style = {},
}) {
  const {
    eyebrow = 'Você sabia?',
    title = 'Curiosidade do vinho',
    body = '',
    category,
    imageGradient,
    imageUrl,
    icon,
  } = cardData;

  const [vote, setVote] = React.useState(null); // 'sim' | 'nao' | null

  const handleSim = () => {
    setVote(prev => prev === 'sim' ? null : 'sim');
    if (vote !== 'sim') onSimTap();
  };
  const handleNao = () => {
    setVote(prev => prev === 'nao' ? null : 'nao');
    if (vote !== 'nao') onNaoTap();
  };

  return (
    <article style={{
      position: 'relative',
      background: T.c.n50,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      padding: 16,
      fontFamily: T.font,
      ...style,
    }}>
      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span aria-hidden="true" style={{
          width: 16, height: 1, background: T.c.p700, opacity: 0.6,
        }}/>
        <div style={{
          ...T.t.overline,
          color: T.c.p700,
          letterSpacing: 1.4,
        }}>{eyebrow}</div>
        {category && (
          <span style={{
            ...T.t.caption,
            color: T.c.n600,
            fontWeight: 500,
            marginLeft: 'auto',
          }}>{category}</span>
        )}
      </div>

      {/* Title + body with inline-right thumbnail */}
      <div style={{ marginTop: 4 }}>
        {/* Thumbnail floated right so body wraps around it */}
        {(imageUrl || imageGradient || icon) && (
          <EducacionalThumb
            imageUrl={imageUrl}
            imageGradient={imageGradient}
            icon={icon}
          />
        )}

        <h4 style={{
          margin: 0,
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 18, fontWeight: 600,
          color: T.c.n950, letterSpacing: '-0.015em',
          lineHeight: 1.2,
          textWrap: 'balance',
        }}>{title}</h4>

        <p style={{
          margin: '8px 0 0',
          fontSize: 14, lineHeight: 1.5,
          color: T.c.n800,
          textWrap: 'pretty',
        }}>{body}</p>

        {/* Clear the float */}
        <div style={{ clear: 'both' }}/>
      </div>

      {/* Feedback row */}
      <div style={{
        marginTop: 16, paddingTop: 12,
        borderTop: `1px solid ${T.c.n200}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          ...T.t.caption,
          color: T.c.n600,
          fontWeight: 500,
          marginRight: 'auto',
        }}>{vote ? 'Valeu pelo feedback!' : 'Sabia disso?'}</span>

        <GhostBtn
          icon="thumb_up"
          label="Sim"
          active={vote === 'sim'}
          onClick={handleSim}
        />
        <GhostBtn
          icon="thumb_down"
          label="Não"
          active={vote === 'nao'}
          onClick={handleNao}
        />
      </div>

      {/* "Ver mais" link */}
      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          onClick={onVerMais}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
            color: T.c.p700, fontFamily: T.font,
            fontSize: 13, fontWeight: 600,
            letterSpacing: '-0.005em',
            transition: 'color 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = T.c.p700; }}
        >
          <Icon name="auto_stories" size={14} color="currentColor"/>
          Ver mais na Seção Aprenda
          <Icon name="arrow_forward" size={14} color="currentColor"/>
        </button>
      </div>
    </article>
  );
}

// ─── Thumbnail (right-floated) ───────────────────────────────
function EducacionalThumb({ imageUrl, imageGradient, icon }) {
  const grad = imageGradient || [T.c.p500, T.c.p900];
  const size = 80;
  return (
    <div
      aria-hidden="true"
      style={{
        float: 'right',
        marginLeft: 12, marginBottom: 6,
        width: size, height: size,
        borderRadius: T.r.md,
        overflow: 'hidden',
        background: imageUrl
          ? T.c.n100
          : `linear-gradient(160deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
      ) : (
        <>
          {/* Subtle diagonal texture */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.16,
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 14px)`,
          }}/>
          <Icon
            name={icon || 'auto_stories'}
            size={32}
            color="rgba(255,255,255,0.92)"
            fill={1}
          />
        </>
      )}
    </div>
  );
}

// ─── Ghost button (sm) ───────────────────────────────────────
function GhostBtn({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 30, padding: '0 12px',
        background: active ? T.c.p700 : T.c.n0,
        color: active ? T.c.n0 : T.c.n800,
        border: `1px solid ${active ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.full,
        cursor: 'pointer',
        fontFamily: T.font, fontSize: 12, fontWeight: 600,
        transition: 'background 120ms, color 120ms, border-color 120ms',
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = T.c.n100;
        e.currentTarget.style.borderColor = T.c.n400;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = T.c.n0;
        e.currentTarget.style.borderColor = T.c.n300;
      }}
    >
      <Icon name={icon} size={14} color={active ? T.c.n0 : T.c.n800} fill={active ? 1 : 0}/>
      {label}
    </button>
  );
}

Object.assign(window, { CardEducacional });


export { CardEducacional, EducacionalThumb, GhostBtn };
