/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs

// Tchin Tchin Design System — Tokens v1
const T = {
  // Burgundy primaries
  c: {
    p900: '#4A1F24', p700: '#722F37', p500: '#A04A55', p300: '#C97D87', p100: '#F5E3E5', p50: '#FAF1F2',
    a700: '#B8894A', a500: '#D4A574', a100: '#F5E9D4',
    n950: '#0F0F0F', n800: '#2A2A2A', n600: '#6B6B6B', n400: '#B0B0B0',
    n300: '#D6D6D6', n200: '#E5E5E5', n100: '#F2F2F2', n50: '#FAFAF8', n0: '#FFFFFF',
    s700: '#2E7D32', s100: '#E8F5E9',
    w700: '#ED6C02', w100: '#FFF4E5',
    e700: '#C62828', e100: '#FFEBEE',
    i700: '#1565C0', i100: '#E3F2FD',
    mExcellent: '#2E7D32', mGood: '#B8894A', mRegular: '#6B6B6B', mUnknown: '#B0B0B0',
  },
  // Typography
  font: "'Inter', 'Roboto', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
  t: {
    display: { fontSize: 32, lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.02em' },
    h1:      { fontSize: 24, lineHeight: '32px', fontWeight: 700, letterSpacing: '-0.01em' },
    h2:      { fontSize: 20, lineHeight: '28px', fontWeight: 600 },
    h3:      { fontSize: 16, lineHeight: '24px', fontWeight: 600 },
    bodyLg:  { fontSize: 16, lineHeight: '24px', fontWeight: 400 },
    body:    { fontSize: 14, lineHeight: '20px', fontWeight: 400 },
    bodyB:   { fontSize: 14, lineHeight: '20px', fontWeight: 600 },
    caption: { fontSize: 12, lineHeight: '16px', fontWeight: 400 },
    label:   { fontSize: 12, lineHeight: '16px', fontWeight: 500 },
    button:  { fontSize: 14, lineHeight: '20px', fontWeight: 600 },
    overline:{ fontSize: 11, lineHeight: '16px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' },
  },
  // Spacing
  s: { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64 },
  // Radius
  r: { xs:4, sm:8, md:12, lg:16, xl:24, full:9999 },
  // Elevations
  el: {
    0: 'none',
    1: '0 1px 2px rgba(0,0,0,0.04)',
    2: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    3: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    4: '0 8px 16px rgba(0,0,0,0.10)',
    5: '0 12px 24px rgba(0,0,0,0.12)',
  },
};

// Material Symbols Rounded helper (uses Google font, loaded in HTML)
function Icon({ name, size = 24, color, style = {}, weight = 400, fill = 0 }) {
  return (
    <span
      className="material-symbols-rounded"
      style={{
        fontSize: size,
        color: color || 'currentColor',
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        userSelect: 'none',
        lineHeight: 1,
        ...style,
      }}
    >{name}</span>
  );
}

// Tchin Tchin wordmark logo (SVG, scalable, brand colors)
function TchinLogo({ size = 40, withWordmark = false, color = '#4A1F24' }) {
  const w = withWordmark ? size * 2.2 : size;
  const h = size;
  return (
    <svg width={w} height={h} viewBox={withWordmark ? '0 0 88 40' : '0 0 40 40'} fill="none" aria-label="Tchin Tchin">
      {/* Two clinking glasses */}
      <g>
        {/* Left glass */}
        <path d="M9 5 L9 18 Q9 25 14 26 L14 33 L10 33 L10 35 L19 35 L19 33 L15 33 L15 26 Q19.5 25 19.5 18.5 L19.5 5 Z"
              fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M10 7 L19 7 Q18.5 16 14 17 Q11 17 10 13 Z" fill={color}/>
        {/* Right glass */}
        <path d="M21 5 L21 18 Q21 25 26 26 L26 33 L22 33 L22 35 L31 35 L31 33 L27 33 L27 26 Q31.5 25 31.5 18.5 L31.5 5 Z"
              fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M21.5 9 L31 9 Q31 19 26 19 Q22 18 21.5 15 Z" fill={color}/>
      </g>
      {withWordmark && (
        <text x="44" y="27" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="20" fill={color} letterSpacing="-0.5">
          Tchin Tchin
        </text>
      )}
    </svg>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────
// Shimmer keyframes injected once
if (typeof document !== 'undefined' && !document.getElementById('tc-skeleton-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-skeleton-kf';
  s.textContent = `@keyframes tcShimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }`;
  document.head.appendChild(s);
}
function Skeleton({ width = '100%', height = 12, radius = 4, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: `linear-gradient(90deg, ${T.c.n100} 0%, ${T.c.n200} 40%, ${T.c.n100} 80%)`,
      backgroundSize: '200% 100%',
      animation: 'tcShimmer 1.6s ease-in-out infinite',
      ...style,
    }}/>
  );
}
function SkeletonText({ lines = 3, lastWidth = '60%' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? lastWidth : '100%'}/>
      ))}
    </div>
  );
}
function SkeletonAvatar({ size = 40 }) {
  return <Skeleton width={size} height={size} radius={size}/>;
}
function SkeletonCardWine() {
  return (
    <div style={{ background: T.c.n0, borderRadius: T.r.md, padding: 12, display: 'flex', gap: 12, border: `1px solid ${T.c.n200}` }}>
      <Skeleton width={48} height={64} radius={6}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
        <Skeleton height={14} width="80%"/>
        <Skeleton height={11} width="55%"/>
        <Skeleton height={20} width={68} radius={10}/>
      </div>
    </div>
  );
}
function SkeletonCardPost() {
  return (
    <div style={{ background: T.c.n0, borderRadius: T.r.md, padding: 14, border: `1px solid ${T.c.n200}` }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <SkeletonAvatar size={36}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={11} width="40%"/>
          <Skeleton height={9} width="22%"/>
        </div>
      </div>
      <SkeletonText lines={3} lastWidth="45%"/>
      <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
        <Skeleton height={14} width={48}/>
        <Skeleton height={14} width={48}/>
        <Skeleton height={14} width={48}/>
      </div>
    </div>
  );
}
function SkeletonDetail() {
  return (
    <div style={{ padding: 16 }}>
      <Skeleton height={200} radius={12} style={{ marginBottom: 16 }}/>
      <Skeleton height={20} width="70%" style={{ marginBottom: 8 }}/>
      <Skeleton height={14} width="45%" style={{ marginBottom: 16 }}/>
      <SkeletonText lines={3} lastWidth="60%"/>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Skeleton height={44} radius={8} style={{ flex: 1 }}/>
        <Skeleton height={44} radius={8} style={{ flex: 1 }}/>
      </div>
    </div>
  );
}

// Wine bottle placeholder (for when no image is available)
function BottlePlaceholder({ width = 80, height = 120, label = 'sem foto', showLabel = true }) {
  const isSmall = width < 70 || height < 90;
  const iconSize = Math.max(20, Math.min(48, width * 0.45));
  const captionLabel = isSmall ? '' : 'Sem foto do rótulo';
  return (
    <div style={{
      width, height,
      background: `linear-gradient(160deg, ${T.c.p100} 0%, ${T.c.p300} 55%, ${T.c.n400} 100%)`,
      borderRadius: T.r.sm,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: isSmall ? 0 : 6, position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle diagonal texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 14px)`,
      }}/>
      {/* Wine glyph */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none" style={{ position: 'relative' }}>
        <path d="M14 6 Q14 22 22 27 L22 38 L17 38 L17 42 L31 42 L31 38 L26 38 L26 27 Q34 22 34 6 Z"
              fill="rgba(255,255,255,0.78)" stroke="rgba(255,255,255,0.92)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {showLabel && captionLabel && (
        <div style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 500,
          color: 'rgba(255,255,255,0.72)', letterSpacing: '0.3px',
          textAlign: 'center', padding: '0 8px', position: 'relative',
        }}>{captionLabel}</div>
      )}
    </div>
  );
}

Object.assign(window, { T, Icon, TchinLogo, BottlePlaceholder, Skeleton, SkeletonText, SkeletonAvatar, SkeletonCardWine, SkeletonCardPost, SkeletonDetail });


export { BottlePlaceholder, Icon, Skeleton, SkeletonAvatar, SkeletonCardPost, SkeletonCardWine, SkeletonDetail, SkeletonText, T, TchinLogo };
