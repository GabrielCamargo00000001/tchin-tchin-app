/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T, TchinLogo } from './tokens.jsx';

// Tchin Tchin core UI components

// ─── Button ─────────────────────────────────────────────────
function Button({ variant = 'primary', size = 'md', fullWidth, leading, trailing, loading, disabled, onClick, children, style = {}, type = 'button' }) {
  const sizes = {
    sm: { h: 32, px: 12, fs: 13, gap: 6, r: T.r.sm },
    md: { h: 44, px: 18, fs: 14, gap: 8, r: T.r.md },
    lg: { h: 52, px: 22, fs: 15, gap: 10, r: T.r.md },
  };
  const sz = sizes[size];
  const variants = {
    primary:     { bg: T.c.p700, fg: T.c.n0, bd: 'transparent', hover: T.c.p900 },
    secondary:   { bg: T.c.n0, fg: T.c.p700, bd: T.c.p700, hover: T.c.p50 },
    ghost:       { bg: 'transparent', fg: T.c.p700, bd: 'transparent', hover: T.c.p50 },
    destructive: { bg: T.c.e700, fg: T.c.n0, bd: 'transparent', hover: '#9B1F1F' },
    neutral:     { bg: T.c.n100, fg: T.c.n800, bd: 'transparent', hover: T.c.n200 },
  };
  const v = variants[variant];
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        height: sz.h, padding: `0 ${sz.px}px`, gap: sz.gap,
        background: disabled ? T.c.n200 : (press ? v.hover : (hover ? v.hover : v.bg)),
        color: disabled ? T.c.n400 : v.fg,
        border: `1.5px solid ${disabled ? T.c.n200 : v.bd}`,
        borderRadius: sz.r,
        fontSize: sz.fs, fontWeight: 600, fontFamily: T.font,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        transition: 'background 120ms ease, transform 80ms ease',
        transform: press && !disabled ? 'scale(0.985)' : 'scale(1)',
        letterSpacing: '0.1px',
        outline: 'none',
        ...style,
      }}
    >
      {loading ? <Spinner size={sz.fs + 4} color={v.fg}/> : leading}
      {children}
      {!loading && trailing}
    </button>
  );
}

function Spinner({ size = 16, color = 'currentColor' }) {
  return (
    <span style={{
      width: size, height: size, display: 'inline-block',
      border: `2px solid ${color}40`, borderTopColor: color,
      borderRadius: '50%', animation: 'tcSpin 0.7s linear infinite',
    }}/>
  );
}

// ─── Input ──────────────────────────────────────────────────
function Input({ label, value, onChange, type = 'text', placeholder, helper, error, leading, trailing, disabled, autoFocus, onFocus, onBlur, inputMode }) {
  const [focused, setFocused] = React.useState(false);
  const id = React.useId();
  const borderColor = error ? T.c.e700 : (focused ? T.c.p700 : T.c.n300);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ ...T.t.label, color: T.c.n800 }}>{label}</label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 48, padding: '0 14px', gap: 10,
        background: disabled ? T.c.n100 : T.c.n0,
        border: `1.5px solid ${borderColor}`,
        borderRadius: T.r.md,
        transition: 'border-color 120ms',
      }}>
        {leading && <span style={{ color: T.c.n600, display: 'flex' }}>{leading}</span>}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value || ''}
          autoFocus={autoFocus}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={e => { setFocused(true); onFocus && onFocus(e); }}
          onBlur={e => { setFocused(false); onBlur && onBlur(e); }}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 15, fontFamily: T.font, color: T.c.n950,
            minWidth: 0,
          }}
        />
        {trailing}
      </div>
      {(helper || error) && (
        <div style={{ ...T.t.caption, color: error ? T.c.e700 : T.c.n600 }}>
          {error || helper}
        </div>
      )}
    </div>
  );
}

// ─── Match Score Badge (proprietary) ─────────────────────────
function MatchBadge({ score, size = 'md', variant = 'pill', style = {} }) {
  const tier = score == null ? 'unknown' : score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'regular' : 'unknown';
  const colors = {
    excellent: { bg: T.c.s100, fg: T.c.s700, sparkle: T.c.s700 },
    good:      { bg: T.c.a100, fg: T.c.a700, sparkle: T.c.a700 },
    regular:   { bg: T.c.n100, fg: T.c.n600, sparkle: T.c.n600 },
    unknown:   { bg: T.c.n100, fg: T.c.n400, sparkle: T.c.n400 },
  }[tier];
  const labelByTier = {
    excellent: 'pro seu paladar',
    good: 'compatível',
    regular: 'mais ou menos',
    unknown: 'sem dado',
  }[tier];

  if (variant === 'pill') {
    const sz = size === 'sm' ? { h: 22, fs: 11, px: 8, ic: 12 } :
               size === 'lg' ? { h: 32, fs: 14, px: 12, ic: 16 } :
                               { h: 26, fs: 12, px: 10, ic: 14 };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: sz.h, padding: `0 ${sz.px}px`,
        background: colors.bg, color: colors.fg,
        borderRadius: T.r.full, fontWeight: 600, fontSize: sz.fs,
        fontFamily: T.font, whiteSpace: 'nowrap', ...style,
      }}>
        <Icon name="auto_awesome" size={sz.ic}/>
        {score == null ? '—' : `${score}%`}
      </span>
    );
  }
  if (variant === 'ring') {
    const sz = size === 'lg' ? 88 : size === 'sm' ? 44 : 64;
    const r = sz / 2 - 4;
    const C = 2 * Math.PI * r;
    const pct = score == null ? 0 : score / 100;
    return (
      <div style={{ position: 'relative', width: sz, height: sz, ...style }}>
        <svg width={sz} height={sz} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={T.c.n200} strokeWidth="4"/>
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={colors.fg} strokeWidth="4"
                  strokeDasharray={`${C * pct} ${C}`} strokeLinecap="round"/>
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0,
        }}>
          <span style={{ fontSize: sz/3.2, fontWeight: 700, color: colors.fg, fontFamily: T.font, lineHeight: 1 }}>
            {score == null ? '—' : score}
          </span>
          {size !== 'sm' && (
            <span style={{ fontSize: 9, color: T.c.n600, fontWeight: 500 }}>match</span>
          )}
        </div>
      </div>
    );
  }
  if (variant === 'card') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 12, background: colors.bg, borderRadius: T.r.md,
        border: `1px solid ${colors.fg}20`, ...style,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: T.r.full,
          background: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: colors.fg, fontWeight: 700, fontSize: 18, fontFamily: T.font,
          border: `2px solid ${colors.fg}`,
        }}>{score == null ? '—' : score}</div>
        <div>
          <div style={{ fontSize: 11, color: T.c.n600, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Match Score</div>
          <div style={{ fontSize: 15, color: colors.fg, fontWeight: 600 }}>{labelByTier}</div>
        </div>
      </div>
    );
  }
  // bar
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 11, color: T.c.n600, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Match</span>
        <span style={{ fontSize: 16, color: colors.fg, fontWeight: 700 }}>{score == null ? '—' : score + '%'}</span>
      </div>
      <div style={{ height: 6, background: T.c.n200, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score || 0}%`, background: colors.fg, borderRadius: 3, transition: 'width 600ms' }}/>
      </div>
    </div>
  );
}

// ─── Chip ────────────────────────────────────────────────────
function Chip({ children, selected, onClick, leading, trailing, onRemove, size = 'md' }) {
  const sz = size === 'sm' ? { h: 28, fs: 12, px: 10 } : { h: 34, fs: 13, px: 12 };
  return (
    <button onClick={onClick} style={{
      height: sz.h, padding: `0 ${sz.px}px`, gap: 6,
      background: selected ? T.c.p700 : T.c.n0,
      color: selected ? T.c.n0 : T.c.n800,
      border: `1.5px solid ${selected ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.full, fontSize: sz.fs, fontWeight: 500,
      fontFamily: T.font, display: 'inline-flex', alignItems: 'center',
      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 120ms',
    }}>
      {leading}
      {children}
      {trailing}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', marginLeft: 2 }}>
          <Icon name="close" size={14}/>
        </span>
      )}
    </button>
  );
}

// ─── Avatar ─────────────────────────────────────────────────
function Avatar({ name = '?', size = 40, src, badge, level }) {
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  const levelColors = { iniciante: T.c.n600, intermediario: T.c.a700, expert: T.c.p700 };
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: src ? `url(${src}) center/cover` : T.c.p700,
        color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: size * 0.4, fontFamily: T.font,
      }}>
        {!src && initials}
      </div>
      {level && (
        <div title={level} style={{
          position: 'absolute', bottom: -2, right: -2,
          width: size * 0.36, height: size * 0.36, borderRadius: '50%',
          background: levelColors[level] || T.c.n600,
          border: `2px solid ${T.c.n0}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.c.n0, fontSize: size * 0.2,
        }}>
          <Icon name={level === 'expert' ? 'workspace_premium' : level === 'intermediario' ? 'auto_awesome' : 'eco'} size={size * 0.22}/>
        </div>
      )}
      {badge && (
        <div style={{
          position: 'absolute', top: -2, right: -2,
          width: 14, height: 14, borderRadius: '50%',
          background: T.c.e700, border: `2px solid ${T.c.n0}`,
        }}/>
      )}
    </div>
  );
}

// ─── Card primitive ────────────────────────────────────────
function Card({ children, padding = T.s[4], onClick, style = {}, hoverable }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: T.c.n0, borderRadius: T.r.lg, padding,
        border: `1px solid ${T.c.n200}`,
        boxShadow: hoverable && hover ? T.el[2] : T.el[1],
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 160ms, transform 120ms',
        transform: hoverable && hover ? 'translateY(-1px)' : 'none',
        ...style,
      }}
    >{children}</div>
  );
}

// ─── Toast ─────────────────────────────────────────────────
function Toast({ kind = 'success', message, action, onClose }) {
  const cfg = {
    success: { bg: T.c.s700, icon: 'check_circle' },
    error:   { bg: T.c.e700, icon: 'error' },
    warning: { bg: T.c.w700, icon: 'warning' },
    info:    { bg: T.c.i700, icon: 'info' },
  }[kind];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', background: cfg.bg, color: T.c.n0,
      borderRadius: T.r.md, boxShadow: T.el[3], minWidth: 240,
    }}>
      <Icon name={cfg.icon} size={20}/>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{message}</span>
      {action && (
        <button onClick={action.onClick} style={{
          background: 'transparent', border: 'none', color: T.c.n0,
          fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>{action.label}</button>
      )}
    </div>
  );
}

// ─── Bottom Nav ─────────────────────────────────────────────
function BottomNav({ active, onChange, glow = null }) {
  const tabs = [
    { id: 'comunidade', icon: 'forum', label: 'Comunidade' },
    { id: 'confrarias', icon: 'groups', label: 'Confrarias' },
    { id: 'descobrir',  icon: 'local_bar', label: 'Descobrir' },
    { id: 'adega',      icon: 'book', label: 'Adega' },
  ];
  return (
    <div data-bottom-nav style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'stretch',
      background: T.c.n0, borderTop: `1px solid ${T.c.n200}`,
      padding: '6px 0 8px', flexShrink: 0, position: 'relative', zIndex: 70,
    }}>
      {tabs.map(t => {
        const on   = active === t.id;
        const glow_= glow === t.id;
        return (
          <button key={t.id} data-tab={t.id} onClick={() => onChange && onChange(t.id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 0', minHeight: 48, position: 'relative',
          }}>
            <div style={{
              padding: '2px 14px', borderRadius: T.r.full,
              background: on ? T.c.p100 : 'transparent',
              transition: 'background 160ms',
              boxShadow: glow_ ? `0 0 0 4px ${T.c.p500}` : 'none',
              animation: glow_ ? 'tcTabGlow 1.5s ease-in-out infinite' : 'none',
            }}>
              <Icon name={t.icon} size={22} color={on ? T.c.p700 : T.c.n600} fill={on ? 1 : 0}/>
            </div>
            <span style={{
              fontSize: 11, fontWeight: on ? 600 : 500,
              color: on ? T.c.p700 : T.c.n600, fontFamily: T.font,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── App Header ─────────────────────────────────────────────
function AppHeader({ onScan, onNotif, onProfile, notifCount = 0 }) {
  return (
    <div style={{
      background: T.c.p700, color: T.c.n0,
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TchinLogo size={28} color={T.c.n0}/>
        <span style={{ fontSize: 18, fontWeight: 700, fontFamily: T.font, letterSpacing: '-0.2px' }}>Tchin Tchin</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <HeaderIcon name="qr_code_scanner" onClick={onScan}/>
        <HeaderIcon name="notifications" onClick={onNotif} badge={notifCount > 0}/>
        <button onClick={onProfile} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
          <Avatar name="Ana" size={32}/>
        </button>
      </div>
    </div>
  );
}
function HeaderIcon({ name, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      width: 44, height: 44, border: 'none', background: 'none',
      color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: T.r.full, cursor: 'pointer', position: 'relative',
    }}>
      <Icon name={name} size={24}/>
      {badge && <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: T.c.a700, border: `1.5px solid ${T.c.p700}` }}/>}
    </button>
  );
}

// ─── Sub header (back, title, actions) ──────────────────────
function SubHeader({ title, onBack, actions, transparent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '8px 8px', minHeight: 56,
      background: transparent ? 'transparent' : T.c.n0,
      borderBottom: transparent ? 'none' : `1px solid ${T.c.n200}`,
      flexShrink: 0,
    }}>
      {onBack && (
        <button onClick={onBack} style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={22} color={T.c.n800}/>
        </button>
      )}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 600, color: T.c.n950, padding: onBack ? '0' : '0 16px' }}>{title}</div>
      {actions}
    </div>
  );
}

// ─── Error State ────────────────────────────────────────────
// Variants: 'network' | 'server' | 'permission' | 'generic'
function ErrorState({ variant = 'generic', title, description, onRetry, onSettings, secondary }) {
  const presets = {
    network: {
      icon: 'wifi_off', tone: 'warning',
      title: title || 'Sem conexão',
      description: description || 'Verifique sua internet e tente de novo.',
      cta: 'Tentar de novo',
    },
    server: {
      icon: 'cloud_off', tone: 'error',
      title: title || 'Algo deu errado',
      description: description || 'Estamos trabalhando nisso. Tente em alguns minutos.',
      cta: 'Tentar de novo',
    },
    permission: {
      icon: 'lock', tone: 'warning',
      title: title || 'Permissão necessária',
      description: description || 'Pra usar essa função, você precisa autorizar nas configurações do seu celular.',
      cta: 'Ir para configurações',
    },
    generic: {
      icon: 'error_outline', tone: 'error',
      title: title || 'Não foi possível carregar',
      description: description || 'Tente atualizar a tela.',
      cta: 'Tentar de novo',
    },
  };
  const p = presets[variant];
  const tones = {
    warning: { bg: T.c.w100, fg: T.c.w700 },
    error:   { bg: T.c.e100, fg: T.c.e700 },
  };
  const tc = tones[p.tone];
  const primaryHandler = variant === 'permission' ? onSettings : onRetry;
  return (
    <div style={{
      padding: '48px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center', gap: 12,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: T.r.full, background: tc.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={p.icon} size={48} color={tc.fg}/>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, marginTop: 8 }}>{p.title}</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, maxWidth: 280 }}>{p.description}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, width: '100%', maxWidth: 280 }}>
        {primaryHandler && (
          <Button variant="primary" size="md" fullWidth onClick={primaryHandler}
            leading={<Icon name={variant === 'permission' ? 'settings' : 'refresh'} size={18}/>}>
            {p.cta}
          </Button>
        )}
        {secondary && <Button variant="ghost" size="md" fullWidth onClick={secondary.onClick}>{secondary.label}</Button>}
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────
function EmptyState({ icon = 'sentiment_satisfied', title, description, primary, secondary }) {
  return (
    <div style={{
      padding: '48px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center', gap: 12,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: T.r.full, background: T.c.p50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={48} color={T.c.p700}/>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, marginTop: 8 }}>{title}</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, maxWidth: 280 }}>{description}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, width: '100%', maxWidth: 280 }}>
        {primary && <Button variant="primary" size="md" fullWidth onClick={primary.onClick}>{primary.label}</Button>}
        {secondary && <Button variant="ghost" size="md" fullWidth onClick={secondary.onClick}>{secondary.label}</Button>}
      </div>
    </div>
  );
}

// ─── Offline Banner ─────────────────────────────────────────
function OfflineBanner({ online, syncing, onToggle }) {
  if (online && !syncing) return null;
  const isSync = syncing && online;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 16px',
      background: isSync ? T.c.s100 : T.c.w100,
      borderBottom: `1px solid ${isSync ? T.c.s700 : T.c.w700}`,
      flexShrink: 0,
      animation: 'tcSlideDown 200ms ease',
    }}>
      <Icon name={isSync ? 'cloud_sync' : 'wifi_off'} size={16} color={isSync ? T.c.s700 : T.c.w700}/>
      <div style={{ flex: 1, ...T.t.caption, color: isSync ? T.c.s700 : T.c.w700, fontWeight: 500 }}>
        {isSync ? 'Sincronizando registros pendentes…' : 'Você está offline. Algumas funções podem não funcionar.'}
      </div>
      {!isSync && onToggle && (
        <button onClick={onToggle} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          color: T.c.w700, fontFamily: T.font, fontSize: 12, fontWeight: 600, textDecoration: 'underline',
        }}>Reconectar</button>
      )}
    </div>
  );
}

Object.assign(window, {
  Button, Spinner, Input, MatchBadge, Chip, Avatar, Card, Toast,
  BottomNav, AppHeader, HeaderIcon, SubHeader, EmptyState, ErrorState, OfflineBanner,
});


export { AppHeader, Avatar, BottomNav, Button, Card, Chip, EmptyState, ErrorState, HeaderIcon, Input, MatchBadge, OfflineBanner, Spinner, SubHeader, Toast };
