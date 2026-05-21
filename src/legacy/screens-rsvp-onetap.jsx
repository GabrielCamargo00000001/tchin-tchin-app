/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.02 RSVP One-Tap
// ────────────────────────────────────────────────────────────
// Botão de RSVP self-contained pra surfaces claras (lista de eventos,
// detalhe do evento, etc). Diferente do RSVPButton interno do
// CardProximoEvento (que é estilizado pro card escuro burgundy), este
// segue o spec literal de 11.02 com 3 estados sobre fundo branco.
//
// Comportamento:
//   • pending  → tap = confirma direto (sem modal); toast burgundy "Você confirmou 🍷"
//   • confirmed → tap = abre modal "Cancelar presença?"
//   • declined → tap = volta direto pra pending
//
// US-12-12-02: 1 tap no caminho feliz é o ponto inteiro do componente —
// modal só aparece pra cancelar, que é a ação destrutiva.

// ─── Pure component ─────────────────────────────────────────
//  props:
//    status: 'pending' | 'confirmed' | 'declined'
//    eventId?: string        — pra analytics
//    onConfirm: () => void   — chamado quando user confirma (pending→confirmed OU declined→pending→tap)
//    onCancel: () => void    — chamado quando user cancela do confirmed
//    onDecline?: () => void  — opcional, pra suporte futuro a "decline" como ação direta
function RSVPOneTap({ status = 'pending', eventId, onConfirm, onCancel, onDecline }) {
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const toastTimer = React.useRef(null);

  // Internal status tracking pra suportar a animação local quando o caller
  // controla via prop — o flash de toast depende de saber QUE houve confirm.
  const triggerToast = () => {
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2400);
  };
  React.useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const handleTap = () => {
    if (status === 'pending' || status === 'declined') {
      fbEvent('rsvp_toggled', { event_id: eventId, new_status: 'confirmed' });
      onConfirm && onConfirm();
      triggerToast();
      return;
    }
    if (status === 'confirmed') {
      setShowCancelModal(true);
      return;
    }
  };

  const cfg = RSVP_STATE_CONFIG[status] || RSVP_STATE_CONFIG.pending;

  return (
    <>
      <button
        onClick={handleTap}
        aria-label={`RSVP: ${cfg.aria}`}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          minWidth: 120, height: 40, padding: '0 16px',
          background: cfg.bg,
          color: cfg.fg,
          border: cfg.border,
          borderRadius: T.r.full,
          fontFamily: T.font, fontSize: 14, fontWeight: 700,
          letterSpacing: '0.1px', cursor: 'pointer',
          transition: 'background 200ms cubic-bezier(0.2, 0.8, 0.2, 1), color 200ms, border-color 200ms, transform 80ms',
          outline: 'none',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {cfg.icon && <Icon name={cfg.icon} size={16} color={cfg.fg} fill={status === 'confirmed' ? 1 : 0}/>}
        <span style={{ transition: 'opacity 200ms' }}>{cfg.label}</span>
        {cfg.trailing && <span aria-hidden="true">{cfg.trailing}</span>}
      </button>

      {showCancelModal && (
        <RSVPCancelModal
          onConfirmCancel={() => {
            fbEvent('rsvp_toggled', { event_id: eventId, new_status: 'pending' });
            setShowCancelModal(false);
            onCancel && onCancel();
          }}
          onKeepGoing={() => setShowCancelModal(false)}
        />
      )}

      {showToast && <RSVPConfirmToast onClose={() => setShowToast(false)}/>}
    </>
  );
}

// State configuration — single source of truth pros 3 tratamentos visuais
const RSVP_STATE_CONFIG = {
  pending: {
    label: 'Vou',
    trailing: '✓',
    icon: null,
    bg: '#FFFFFF',
    fg: '#722F37', // p700
    border: '1.5px solid #722F37',
    aria: 'Marcar presença',
  },
  confirmed: {
    label: 'Você confirmou',
    icon: 'check_circle',
    trailing: null,
    bg: '#722F37', // p700
    fg: '#FFFFFF',
    border: '1.5px solid #722F37',
    aria: 'Cancelar presença',
  },
  declined: {
    label: 'Não vou',
    icon: null,
    trailing: null,
    bg: '#F2F2F2', // n100
    fg: '#2A2A2A', // n800
    border: '1px solid #D6D6D6', // n300
    aria: 'Voltar pra pendente',
  },
};

// ─── Cancel modal — protege o cancelamento (destrutivo) ───
function RSVPCancelModal({ onConfirmCancel, onKeepGoing }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onKeepGoing(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKeepGoing]);

  return (
    <div
      onClick={onKeepGoing}
      style={{
        position: 'absolute', inset: 0, zIndex: 90,
        background: 'rgba(15,15,15,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'tcFadeIn 180ms ease',
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="rsvp-cancel-title"
        style={{
          background: T.c.n0, borderRadius: T.r.xl, padding: 24,
          width: '100%', maxWidth: 340,
          boxShadow: '0 12px 24px rgba(0,0,0,0.18)',
          animation: 'tcModalIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontFamily: T.font,
        }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: T.c.w100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <Icon name="event_busy" size={24} color={T.c.w700}/>
        </div>
        <h3 id="rsvp-cancel-title" style={{
          margin: 0, marginBottom: 6,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 18, fontWeight: 600, color: T.c.n950,
          letterSpacing: '-0.01em',
        }}>
          Cancelar presença?
        </h3>
        <p style={{
          margin: 0, marginBottom: 20,
          fontFamily: T.font, fontSize: 14, lineHeight: 1.5, color: T.c.n800,
        }}>
          A galera vai saber que você não vai mais. Você pode confirmar de novo a qualquer momento.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="destructive" size="lg" fullWidth onClick={onConfirmCancel}>
            Sim, cancelar
          </Button>
          <Button variant="ghost" size="lg" fullWidth onClick={onKeepGoing}>
            Manter confirmado
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm toast — micro-celebração ──────────────────────
function RSVPConfirmToast({ onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute', left: 16, right: 16, bottom: 24,
        zIndex: 100,
        animation: 'tcSlideUpToast 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
      <div
        onClick={onClose}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px',
          background: T.c.p700, color: T.c.n0,
          borderRadius: T.r.full,
          boxShadow: '0 6px 20px rgba(74,31,36,0.32)',
          cursor: 'pointer',
          fontFamily: T.font,
        }}>
        <Icon name="celebration" size={20} color="#FFFFFF" fill={1}/>
        <div style={{
          flex: 1,
          fontSize: 13, fontWeight: 600, lineHeight: 1.4,
        }}>
          Você confirmou. A confraria vai saber!
        </div>
      </div>
    </div>
  );
}

// Inject one-shot keyframes for the toast (different from the existing
// tcSlideUp pattern — this one fades in from below with bounce-stop)
if (typeof document !== 'undefined' && !document.getElementById('tc-rsvp-toast-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-rsvp-toast-kf';
  s.textContent = `
    @keyframes tcSlideUpToast {
      0%   { transform: translateY(28px); opacity: 0; }
      60%  { transform: translateY(-4px); opacity: 1; }
      100% { transform: translateY(0);    opacity: 1; }
    }
  `;
  document.head.appendChild(s);
}

// ─── Demo host pra canvas — cycles through states ─────────
function RSVPOneTapHostDemo({ initialStatus = 'pending' }) {
  const [status, setStatus] = React.useState(initialStatus);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
      padding: 24, background: T.c.n0, fontFamily: T.font,
      position: 'relative',
    }}>
      <div style={{
        fontFamily: T.mono, fontSize: 11, color: T.c.n600,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        Estado: {status}
      </div>
      <RSVPOneTap
        status={status}
        eventId="demo_evt"
        onConfirm={() => setStatus('confirmed')}
        onCancel={() => setStatus('pending')}
      />
      <div style={{
        marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {['pending', 'confirmed', 'declined'].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: '4px 10px',
              background: status === s ? T.c.n950 : T.c.n100,
              color: status === s ? T.c.n0 : T.c.n800,
              border: 'none', borderRadius: T.r.full,
              fontFamily: T.mono, fontSize: 10, fontWeight: 600,
              cursor: 'pointer',
            }}>
            {s}
          </button>
        ))}
      </div>
      <div style={{
        marginTop: 8, fontFamily: T.font, fontSize: 11, color: T.c.n600,
        textAlign: 'center', maxWidth: 240, lineHeight: 1.4,
      }}>
        Tap no botão pra simular o fluxo real: pending→confirmed (com toast), confirmed→modal de cancelamento.
      </div>
    </div>
  );
}

Object.assign(window, {
  RSVPOneTap,
  RSVPOneTapHostDemo,
  RSVPCancelModal,
  RSVPConfirmToast,
  RSVP_STATE_CONFIG,
});


export { RSVPCancelModal, RSVPConfirmToast, RSVPOneTap, RSVPOneTapHostDemo, RSVP_STATE_CONFIG };
