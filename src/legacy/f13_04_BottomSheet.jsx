/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';

// ─────────────────────────────────────────────────────────────
// 13.04 · BottomSheet — Android-style bottom sheet
//
//   <BottomSheet isOpen onClose={...} title="Filter">
//     ...content...
//   </BottomSheet>
//
//   Props:
//     isOpen: boolean
//     onClose: () => void
//     title?: string                — optional Fraunces header + close X
//     children: ReactNode
//     dismissOnSwipe?: boolean      — default true; drag handle to dismiss
//     dismissOnBackdrop?: boolean   — default true
//     maxHeight?: number|string     — default '80vh'
//     contained?: boolean           — default false; absolute inside parent
//                                     (e.g. for phone mocks)
// ─────────────────────────────────────────────────────────────

if (typeof document !== 'undefined' && !document.getElementById('tc-bsheet-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-bsheet-kf';
  s.textContent = `
    @keyframes tcSheetBdIn  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes tcSheetBdOut { from { opacity: 1 } to { opacity: 0 } }
    @keyframes tcSheetIn    { from { transform: translateY(100%) } to { transform: translateY(0) } }
    @keyframes tcSheetOut   { from { transform: translateY(0) } to { transform: translateY(100%) } }
  `;
  document.head.appendChild(s);
}

function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  dismissOnSwipe = true,
  dismissOnBackdrop = true,
  maxHeight = '80vh',
  contained = false,
  ariaLabel,
}) {
  // mounted controls actual DOM presence so exit animation can play.
  const [mounted, setMounted] = React.useState(isOpen);
  const [leaving, setLeaving] = React.useState(false);
  const sheetRef = React.useRef(null);
  const wasFocused = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setLeaving(false);
    } else if (mounted) {
      setLeaving(true);
      const t = setTimeout(() => { setMounted(false); setLeaving(false); }, 260);
      return () => clearTimeout(t);
    }
  }, [isOpen]); // eslint-disable-line

  // Focus management + Esc + body scroll lock
  React.useEffect(() => {
    if (!mounted || leaving) return;
    wasFocused.current = document.activeElement;
    const prevOverflow = contained ? null : document.body.style.overflow;
    if (!contained) document.body.style.overflow = 'hidden';

    // Focus first focusable element inside sheet
    setTimeout(() => {
      if (!sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      else sheetRef.current.focus();
    }, 60);

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose && onClose(); }
      // Focus trap
      if (e.key === 'Tab' && sheetRef.current) {
        const focusable = Array.from(sheetRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter((el) => !el.disabled && el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      if (!contained && prevOverflow !== null) document.body.style.overflow = prevOverflow;
      if (wasFocused.current && wasFocused.current.focus) {
        try { wasFocused.current.focus(); } catch (e) {}
      }
    };
  }, [mounted, leaving, onClose, contained]);

  // Drag-to-dismiss on the handle.
  const dragState = React.useRef(null);
  const [dragOffset, setDragOffset] = React.useState(0);

  const onHandlePointerDown = (e) => {
    if (!dismissOnSwipe) return;
    e.preventDefault();
    e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
    dragState.current = { startY: e.clientY, id: e.pointerId };
  };
  const onHandlePointerMove = (e) => {
    if (!dragState.current || e.pointerId !== dragState.current.id) return;
    const dy = e.clientY - dragState.current.startY;
    setDragOffset(Math.max(0, dy));   // only allow downward drag
  };
  const onHandlePointerUp = (e) => {
    if (!dragState.current || e.pointerId !== dragState.current.id) return;
    const dy = e.clientY - dragState.current.startY;
    dragState.current = null;
    if (dy > 80) {
      // Animate the rest of the way down
      setDragOffset(800);
      setTimeout(() => { onClose && onClose(); setDragOffset(0); }, 160);
    } else {
      setDragOffset(0);
    }
  };

  if (!mounted) return null;

  const positionStyle = contained
    ? { position: 'absolute', inset: 0 }
    : { position: 'fixed', inset: 0 };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Bottom sheet'}
      onClick={(e) => {
        if (e.target === e.currentTarget && dismissOnBackdrop && onClose) onClose();
      }}
      style={{
        ...positionStyle,
        zIndex: 9000,
        background: 'rgba(15, 15, 15, 0.60)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: leaving
          ? 'tcSheetBdOut 220ms ease forwards'
          : 'tcSheetBdIn 220ms ease forwards',
      }}
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight,
          background: '#FFFFFF',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.18), 0 -2px 8px rgba(0,0,0,0.10)',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: '#0F0F0F',
          display: 'flex',
          flexDirection: 'column',
          animation: leaving
            ? 'tcSheetOut 240ms cubic-bezier(0.4, 0, 1, 1) forwards'
            : 'tcSheetIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
          transform: `translateY(${dragOffset}px)`,
          transition: dragState.current ? 'none' : 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          outline: 'none',
        }}
      >
        {/* Drag handle */}
        <div
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '8px 0 4px',
            cursor: dismissOnSwipe ? 'grab' : 'default',
            touchAction: 'none',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: 32,
              height: 4,
              borderRadius: 2,
              background: '#D6D6D6',
            }}
          />
        </div>

        {/* Optional title row */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 16px 12px 24px',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <h4
              style={{
                margin: 0,
                flex: 1,
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 20,
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                color: '#0F0F0F',
                textWrap: 'balance',
              }}
            >{title}</h4>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              style={{
                width: 36, height: 36, borderRadius: 18,
                border: 'none', background: 'transparent',
                cursor: 'pointer',
                color: '#6B6B6B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 120ms, color 120ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F2F2F2'; e.currentTarget.style.color = '#0F0F0F'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B6B6B'; }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: 20, lineHeight: 1, fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}
              >close</span>
            </button>
          </div>
        )}

        {/* Content (scrollable) */}
        <div
          style={{
            padding: title ? '0 24px 24px' : '8px 24px 24px',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            minHeight: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BottomSheet });


export { BottomSheet };
