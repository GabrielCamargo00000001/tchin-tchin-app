/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';

// ─────────────────────────────────────────────────────────────
// 13.06 · StarsRating — interactive input OR read-only display
//
//   Interactive:
//     <StarsRating mode="interactive" value={v} onChange={setV} />
//     <StarsRating mode="interactive" value={v} onChange={setV} allowHalf />
//
//   Display:
//     <StarsRating mode="display" value={4.3} size="sm" reviewCount={128} />
// ─────────────────────────────────────────────────────────────

// Inject pulse keyframes once
if (typeof document !== 'undefined' && !document.getElementById('tc-stars-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-stars-kf';
  s.textContent = `
    @keyframes tcStarPop {
      0%   { transform: scale(1); }
      45%  { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(s);
}

const STARS_DISPLAY_SIZES = {
  sm: { px: 16, gap: 2 },
  md: { px: 20, gap: 3 },
  lg: { px: 24, gap: 4 },
};

const STARS_FILLED   = '#722F37';
const STARS_EMPTY    = '#D6D6D6';

function StarsRating({
  mode = 'display',
  value = 0,
  onChange,
  size = 'md',
  allowHalf = false,
  showCaption = false,
  reviewCount,
  ariaLabel,
  style = {},
}) {
  if (mode === 'interactive') {
    return (
      <InteractiveStars
        value={value}
        onChange={onChange}
        allowHalf={allowHalf}
        showCaption={showCaption}
        ariaLabel={ariaLabel}
        style={style}
      />
    );
  }
  return (
    <DisplayStars
      value={value}
      size={size}
      showCaption={showCaption}
      reviewCount={reviewCount}
      ariaLabel={ariaLabel}
      style={style}
    />
  );
}

// ─── Interactive ─────────────────────────────────────────────
function InteractiveStars({ value, onChange, allowHalf, showCaption, ariaLabel, style }) {
  const px = 32;
  const gap = 8;
  // hoverValue lets the user preview before tapping
  const [hoverValue, setHoverValue] = React.useState(null);
  // animation key for star pulses
  const [animSeq, setAnimSeq] = React.useState({ to: 0, at: 0 });

  const displayed = hoverValue != null ? hoverValue : value;

  const commit = (next) => {
    if (next === value) return;
    setAnimSeq({ to: next, at: Date.now() });
    if (onChange) onChange(next);
  };

  const onStarMouseMove = (i) => (e) => {
    if (!allowHalf) { setHoverValue(i + 1); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = (e.clientX - rect.left) < rect.width / 2;
    setHoverValue(i + (isLeft ? 0.5 : 1));
  };

  const onStarClick = (i) => (e) => {
    if (!allowHalf) { commit(i + 1); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = (e.clientX - rect.left) < rect.width / 2;
    commit(i + (isLeft ? 0.5 : 1));
  };

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = allowHalf ? 0.5 : 1;
      commit(Math.min(5, value + step));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = allowHalf ? 0.5 : 1;
      commit(Math.max(0, value - step));
    } else if (/^[0-5]$/.test(e.key)) {
      e.preventDefault();
      commit(parseInt(e.key, 10));
    }
  };

  const caption = value === 0
    ? 'Toque pra avaliar'
    : `${value}${(value % 1 === 0) ? '' : ''}/5 ${value === 1 ? 'estrela' : 'estrelas'}`;

  return (
    <div
      role="slider"
      aria-label={ariaLabel || 'Avaliação'}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={onKey}
      onMouseLeave={() => setHoverValue(null)}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 8,
        outline: 'none',
        ...style,
      }}
    >
      <div style={{ display: 'inline-flex', gap }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fillRatio = Math.max(0, Math.min(1, displayed - i));
          // Star pulses if it was just newly filled
          const justFilled = (animSeq.to >= i + 1) && (Date.now() - animSeq.at < 700);
          const pulseDelay = justFilled ? `${i * 70}ms` : '0ms';
          const pulseAnim = justFilled
            ? `tcStarPop 320ms ease ${pulseDelay} both`
            : 'none';
          return (
            <button
              key={i}
              type="button"
              onMouseMove={onStarMouseMove(i)}
              onClick={onStarClick(i)}
              onFocus={() => {}}
              style={{
                width: px,
                height: px,
                padding: 0,
                margin: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                lineHeight: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 120ms ease',
                animation: pulseAnim,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.10)'; }}
              onMouseOut={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
              aria-label={`${i + 1} ${i === 0 ? 'estrela' : 'estrelas'}`}
            >
              <StarGlyph size={px} fillRatio={fillRatio}/>
            </button>
          );
        })}
      </div>
      {showCaption && (
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            color: value === 0 ? '#6B6B6B' : '#0F0F0F',
            fontWeight: value === 0 ? 400 : 600,
            transition: 'color 160ms',
          }}
          aria-hidden="true"
        >{caption}</div>
      )}
    </div>
  );
}

// ─── Display ─────────────────────────────────────────────────
function DisplayStars({ value, size, showCaption, reviewCount, ariaLabel, style }) {
  const sz = STARS_DISPLAY_SIZES[size] || STARS_DISPLAY_SIZES.md;
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));

  const formattedValue = clamped.toFixed(1).replace('.', ',');
  const reviewSuffix = (typeof reviewCount === 'number')
    ? `(${reviewCount.toLocaleString('pt-BR')} ${reviewCount === 1 ? 'avaliação' : 'avaliações'})`
    : '';

  return (
    <div
      role="img"
      aria-label={ariaLabel || `${clamped.toFixed(1)} de 5 estrelas${reviewSuffix ? ' ' + reviewSuffix : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: "'Inter', system-ui, sans-serif",
        ...style,
      }}
    >
      <div style={{ display: 'inline-flex', gap: sz.gap }} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fillRatio = Math.max(0, Math.min(1, clamped - i));
          return <StarGlyph key={i} size={sz.px} fillRatio={fillRatio} />;
        })}
      </div>
      {showCaption && (
        <span
          style={{
            fontSize: sz.px === 16 ? 12 : (sz.px === 20 ? 13 : 14),
            color: '#2A2A2A',
            fontWeight: 600,
            letterSpacing: '0.1px',
          }}
        >
          {formattedValue}
          {reviewSuffix && (
            <span style={{ color: '#6B6B6B', fontWeight: 400, marginLeft: 6 }}>
              {reviewSuffix}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

// ─── Star glyph with partial fill support (clip-path on a filled star) ─
function StarGlyph({ size = 24, fillRatio = 0 }) {
  // Two stacked icons: outline always rendered; filled clipped to fillRatio width.
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        lineHeight: 0,
      }}
      aria-hidden="true"
    >
      {/* Empty outline */}
      <span
        className="material-symbols-rounded"
        style={{
          position: 'absolute',
          inset: 0,
          fontSize: size,
          color: STARS_EMPTY,
          lineHeight: 1,
          fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
        }}
      >star</span>
      {/* Filled overlay, clipped to fillRatio */}
      {fillRatio > 0 && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            width: `${fillRatio * 100}%`,
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: size,
              color: STARS_FILLED,
              lineHeight: 1,
              fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24",
              display: 'inline-block',
              width: size,   // keep filled star at its natural width
            }}
          >star</span>
        </span>
      )}
    </span>
  );
}

Object.assign(window, {
  StarsRating,
  StarGlyph,
  STARS_DISPLAY_SIZES,
});


export { DisplayStars, InteractiveStars, STARS_DISPLAY_SIZES, STARS_EMPTY, STARS_FILLED, StarGlyph, StarsRating };
