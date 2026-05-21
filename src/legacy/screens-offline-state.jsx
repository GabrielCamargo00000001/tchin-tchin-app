/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 14.05 · OfflineState — two pieces
//
//   A) <OfflineBanner offline={bool} reconnected={bool} />
//      Thin persistent banner at top. Auto-shows a green
//      "Conectado de novo" pill for 2s after reconnect.
//
//   B) <OfflineScreen onRetry={...} />
//      Full-screen fallback when a screen needs network and can't.
//
// Both pieces are stateless presentational components.
// In real app, an upstream <OfflineProvider /> would feed them
// the live online/offline status via navigator.onLine events.
// ─────────────────────────────────────────────────────────────

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('tc-offline-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-offline-kf';
  s.textContent = `
    @keyframes tcBannerDown   { from { transform: translateY(-100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    @keyframes tcBannerUp     { from { transform: translateY(0); opacity: 1 } to { transform: translateY(-100%); opacity: 0 } }
    @keyframes tcReconnectIn  { from { transform: translateY(-100%); } to { transform: translateY(0); } }
    @keyframes tcReconnectOut { from { transform: translateY(0); opacity: 1 } to { transform: translateY(-100%); opacity: 0 } }
  `;
  document.head.appendChild(s);
}

// ─── A) OfflineBanner (thin, top, persistent) ────────────────
function OfflineBanner({ offline = false, showReconnectedFor = 2000 }) {
  // We accept the simple `offline` boolean for static use, and also
  // track an internal "just reconnected" flash for live use.
  const [reconnected, setReconnected] = React.useState(false);
  const prev = React.useRef(offline);

  React.useEffect(() => {
    if (prev.current === true && offline === false) {
      setReconnected(true);
      const t = setTimeout(() => setReconnected(false), showReconnectedFor);
      return () => clearTimeout(t);
    }
    prev.current = offline;
  }, [offline, showReconnectedFor]);

  if (!offline && !reconnected) return null;

  // Green flash
  if (!offline && reconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          zIndex: 200,
          background: T.c.s700 || '#2E7D32',
          color: T.c.n0,
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: T.font,
          fontSize: 13, fontWeight: 600, letterSpacing: '0.1px',
          animation: 'tcReconnectIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
        }}
      >
        <Icon name="check_circle" size={16} color={T.c.n0} fill={1}/>
        Conectado de novo
      </div>
    );
  }

  // Offline banner
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Sem conexão"
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 200,
        background: T.c.w100 || '#FFF4E5',
        borderBottom: `1px solid ${T.c.w300 || '#FFD8A8'}`,
        color: T.c.w700 || '#9A5A00',
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: T.font,
        fontSize: 13, fontWeight: 600, letterSpacing: '0.1px',
        animation: 'tcBannerDown 220ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      }}
    >
      <Icon name="wifi_off" size={16} color={T.c.w700 || '#9A5A00'}/>
      <span style={{ color: T.c.w950 || '#3F2700' }}>Sem conexão</span>
    </div>
  );
}

// ─── B) OfflineScreen (full-screen fallback) ─────────────────
function OfflineScreen({ onRetry, onTryOffline, retrying = false, title, description }) {
  const [busy, setBusy] = React.useState(false);

  const handleRetry = async () => {
    if (busy || retrying) return;
    setBusy(true);
    try {
      if (onRetry) await onRetry();
    } finally {
      setTimeout(() => setBusy(false), 600);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
      background: T.c.n50,
      fontFamily: T.font,
      textAlign: 'center',
      gap: 16,
    }}>
      {/* Icon tile */}
      <div
        aria-hidden="true"
        style={{
          width: 120, height: 120, borderRadius: 24,
          background: T.c.n100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8,
          position: 'relative',
        }}
      >
        <Icon name="cloud_off" size={64} color={T.c.n400}/>
        {/* Subtle disabled-wifi ripple */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24,
          border: `1.5px dashed ${T.c.n300}`,
          opacity: 0.6,
          pointerEvents: 'none',
        }}/>
      </div>

      <h3 style={{
        margin: 0,
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 24, fontWeight: 600,
        letterSpacing: '-0.015em',
        color: T.c.n950,
        textWrap: 'balance',
        maxWidth: 320,
        lineHeight: 1.2,
      }}>{title || 'Sem internet'}</h3>

      <p style={{
        margin: 0,
        fontSize: 14, lineHeight: 1.55,
        color: T.c.n700 || T.c.n800,
        maxWidth: 280,
        textWrap: 'pretty',
      }}>{description || 'Verifique sua conexão e tente novamente.'}</p>

      <div style={{
        marginTop: 16, width: '100%', maxWidth: 280,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <button
          type="button"
          onClick={handleRetry}
          disabled={busy || retrying}
          style={{
            width: '100%', height: 48,
            background: (busy || retrying) ? T.c.p500 : T.c.p700,
            color: T.c.n0,
            border: 'none', borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 14, fontWeight: 600,
            cursor: (busy || retrying) ? 'wait' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 120ms',
            letterSpacing: '0.1px',
          }}
        >
          {(busy || retrying) ? (
            <RetrySpinner/>
          ) : (
            <Icon name="refresh" size={18} color={T.c.n0}/>
          )}
          {(busy || retrying) ? 'Tentando…' : 'Tentar de novo'}
        </button>

        {onTryOffline && (
          <button
            type="button"
            onClick={onTryOffline}
            style={{
              width: '100%', height: 40,
              background: 'transparent', color: T.c.p700,
              border: 'none',
              fontFamily: T.font, fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Icon name="visibility" size={16} color={T.c.p700}/>
            Continuar offline
          </button>
        )}
      </div>

      {/* Tip footer */}
      <div style={{
        marginTop: 24,
        padding: '10px 14px',
        background: T.c.n100,
        borderRadius: 10,
        fontSize: 12, color: T.c.n600, lineHeight: 1.5,
        maxWidth: 280,
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="lightbulb" size={14} color={T.c.a700}/>
        <span>Algumas telas funcionam offline. Sua adega e diário estão sempre disponíveis.</span>
      </div>
    </div>
  );
}

function RetrySpinner() {
  return (
    <span style={{
      display: 'inline-block', width: 16, height: 16,
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.35)',
      borderTopColor: T.c.n0,
      animation: 'tcSpin 800ms linear infinite',
    }}/>
  );
}

Object.assign(window, { OfflineBanner, OfflineScreen });


export { OfflineBanner, OfflineScreen, RetrySpinner };
