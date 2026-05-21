/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';

// ─────────────────────────────────────────────────────────────
// 13.01 · Avatar — reusable circular user avatar
//
// Image with deterministic-color initials fallback.
//   • size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'      (default 'md')
//   • name: string                                 (required)
//   • userId: string                               (required; seeds bg color)
//   • imageUrl?: string                            (falls back to initials on error)
//   • badge?: 'online' | 'expert' | 'host'
//   • onTap?: () => void                           (renders as <button>)
//   • ring?: boolean                               (white ring, default true)
//   • ariaLabel?: string                           (overrides aria-label)
// ─────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { name: 'burgundy', bg: '#722F37' }, //  burgundy/700
  { name: 'amber',    bg: '#B8894A' }, //  amber/700
  { name: 'indigo',   bg: '#3F51B5' }, //  indigo/600
  { name: 'emerald',  bg: '#2E7D32' }, //  emerald/700
  { name: 'rose',     bg: '#E11D67' }, //  rose/600
  { name: 'purple',   bg: '#7B3FBF' }, //  purple/600
  { name: 'blue',     bg: '#1565C0' }, //  blue/700
  { name: 'teal',     bg: '#00897B' }, //  teal/600
];

const AVATAR_SIZES = {
  xs: { px: 24, fs: 10, badge: 8,  badgeIcon: 0,   ring: 1.5 },
  sm: { px: 32, fs: 12, badge: 10, badgeIcon: 0,   ring: 1.5 },
  md: { px: 40, fs: 14, badge: 12, badgeIcon: 10,  ring: 2   },
  lg: { px: 56, fs: 18, badge: 16, badgeIcon: 12,  ring: 2.5 },
  xl: { px: 80, fs: 24, badge: 22, badgeIcon: 16,  ring: 3   },
};

// Deterministic hash → palette index. Stable across devices & sessions.
function avatarColorFor(userId) {
  const s = String(userId || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

// "Rafael Carvalho" → "RC"   ·   "Helena" → "H"
function avatarInitials(name) {
  const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({
  size = 'md',
  name,
  userId,
  imageUrl,
  badge,
  onTap,
  ring = true,
  ariaLabel,
  style = {},
}) {
  const sz = AVATAR_SIZES[size] || AVATAR_SIZES.md;
  const palette = React.useMemo(() => avatarColorFor(userId), [userId]);
  const initials = React.useMemo(() => avatarInitials(name), [name]);

  // Track image load failure so we can fall back to initials without flicker.
  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(() => { setImgFailed(false); }, [imageUrl]);

  const showImage = !!imageUrl && !imgFailed;
  const Wrapper = onTap ? 'button' : 'div';

  const containerStyle = {
    position: 'relative',
    width: sz.px,
    height: sz.px,
    flexShrink: 0,
    padding: 0,
    border: 0,
    background: 'transparent',
    cursor: onTap ? 'pointer' : 'default',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const bubbleStyle = {
    width: sz.px,
    height: sz.px,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: showImage ? '#F2F2F2' : palette.bg,
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: sz.fs,
    letterSpacing: '0.2px',
    fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
    boxShadow: ring ? `0 0 0 ${sz.ring}px #FFFFFF` : 'none',
    userSelect: 'none',
    lineHeight: 1,
  };

  return (
    <Wrapper
      type={onTap ? 'button' : undefined}
      onClick={onTap}
      aria-label={ariaLabel || name || 'Avatar'}
      role={onTap ? undefined : 'img'}
      style={containerStyle}
    >
      <div style={bubbleStyle}>
        {showImage ? (
          <img
            src={imageUrl}
            alt=""
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>

      {badge && <AvatarBadge kind={badge} sizeKey={size} />}
    </Wrapper>
  );
}

function AvatarBadge({ kind, sizeKey }) {
  const sz = AVATAR_SIZES[sizeKey] || AVATAR_SIZES.md;
  const d = sz.badge;
  const offset = -Math.round(d * 0.1);

  const palettes = {
    online: { bg: '#2E7D32', fg: '#FFFFFF', icon: null },           // green dot
    expert: { bg: '#FFFFFF', fg: '#1565C0', icon: 'verified' },     // white bg, blue check
    host:   { bg: '#722F37', fg: '#FFFFFF', icon: null },           // burgundy dot
  };
  const p = palettes[kind] || palettes.online;

  const base = {
    position: 'absolute',
    bottom: offset,
    right: offset,
    width: d,
    height: d,
    borderRadius: '50%',
    background: p.bg,
    border: `${Math.max(1.5, d * 0.18)}px solid #FFFFFF`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: p.fg,
    pointerEvents: 'none',
  };

  // For expert with material icon — only when there's room (md+)
  if (p.icon && sz.badgeIcon > 0) {
    return (
      <span style={base} aria-hidden="true">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: sz.badgeIcon,
            color: p.fg,
            fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 20",
            lineHeight: 1,
          }}
        >{p.icon}</span>
      </span>
    );
  }
  return <span style={base} aria-hidden="true" />;
}

// Export to global scope so multiple <script type="text/babel"> tags can share.

Object.assign(window, { Avatar, AVATAR_PALETTE, AVATAR_SIZES, avatarColorFor, avatarInitials });


export { AVATAR_PALETTE, AVATAR_SIZES, Avatar, AvatarBadge, avatarColorFor, avatarInitials };
