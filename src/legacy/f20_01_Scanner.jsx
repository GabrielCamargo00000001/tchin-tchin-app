/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 20.01 · Scanner — full-screen wine label scanner
//
// US-12-2-04 (rótulo) + US-13-1-01 (carta de restaurante)
//
//   <Scanner
//     mode="label"                    // 'label' | 'menu'
//     onClose={() => ...}
//     onCapture={(imageBlob) => ...}  // dispara após captura
//     onPickFromGallery={() => ...}
//     onChangeMode={(mode) => ...}
//     useCamera={false}                // true → pede getUserMedia
//     initialState="idle"              // 'idle' | 'processing' | 'denied'
//   />
//
// Estados: idle (escaneando) · processing (1–3s spinner) · denied
// (permissão negada → empty state com botão "Permitir acesso").
// ─────────────────────────────────────────────────────────────

// Keyframes (injected once)
if (typeof document !== 'undefined' && !document.getElementById('tc-scanner-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-scanner-kf';
  s.textContent = `
    @keyframes tcScannerPulse {
      0%, 100% { opacity: 0.55; }
      50%      { opacity: 1; }
    }
    @keyframes tcScannerLine {
      0%   { transform: translateY(0%); opacity: 0.0; }
      8%   { opacity: 1; }
      92%  { opacity: 1; }
      100% { transform: translateY(100%); opacity: 0.0; }
    }
    @keyframes tcScannerSpin { to { transform: rotate(360deg); } }
    @keyframes tcScannerFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes tcScannerProcessing {
      0%   { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(s);
}

function Scanner({
  mode = 'label',
  onClose = () => {},
  onCapture = () => {},
  onPickFromGallery = () => {},
  onChangeMode = () => {},
  useCamera = false,
  initialState = 'idle',
}) {
  const [state, setState] = React.useState(initialState);     // 'idle' | 'processing' | 'denied'
  const [currentMode, setCurrentMode] = React.useState(mode); // 'label' | 'menu'
  const [flash, setFlash] = React.useState(false);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  // Optional real camera. Off by default for canvas previews.
  React.useEffect(() => {
    if (!useCamera) return;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      setState('denied');
      return;
    }
    let cancelled = false;
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    }).then((stream) => {
      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    }).catch(() => {
      if (!cancelled) setState('denied');
    });
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [useCamera]);

  const handleCapture = () => {
    if (state !== 'idle') return;
    setState('processing');
    // Simulated processing window; real call to ML happens here.
    setTimeout(() => {
      onCapture(null);
      // Caller is expected to navigate away; we stay in 'processing'
      // until unmount so the spinner doesn't flash off.
    }, 1800);
  };

  const handleSetMode = (next) => {
    setCurrentMode(next);
    onChangeMode(next);
  };

  const handleRetryPermission = () => {
    setState('idle');
    // If useCamera is true the effect re-runs on next mount; here we
    // just reset state so the host can re-trigger.
  };

  // Guide rectangle size — taller in menu mode
  const guide = currentMode === 'menu'
    ? { w: 280, h: 420, label: 'Enquadre a carta toda na área' }
    : { w: 260, h: 360, label: 'Enquadre o rótulo na área' };

  const dim = state === 'processing';

  return (
    <div
      data-screen-label="20.01 Scanner"
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: T.c.n950,
        color: T.c.n0,
        fontFamily: T.font,
        overflow: 'hidden',
      }}
    >
      {/* Camera feed (or faux backdrop) */}
      <CameraBackdrop
        useCamera={useCamera}
        videoRef={videoRef}
        flash={flash}
      />

      {state === 'denied' ? (
        <PermissionDeniedState onRetry={handleRetryPermission} onClose={onClose}/>
      ) : (
        <>
          {/* Top bar */}
          <TopBar
            mode={currentMode}
            onChangeMode={handleSetMode}
            onClose={onClose}
            flash={flash}
            onToggleFlash={() => setFlash(f => !f)}
            dim={dim}
          />

          {/* Scan guide */}
          <ScanGuide
            width={guide.w}
            height={guide.h}
            label={guide.label}
            mode={currentMode}
            dim={dim}
          />

          {/* Bottom controls */}
          <BottomBar
            onCapture={handleCapture}
            onPickFromGallery={onPickFromGallery}
            dim={dim}
          />

          {/* Processing overlay */}
          {state === 'processing' && (
            <ProcessingOverlay mode={currentMode}/>
          )}
        </>
      )}
    </div>
  );
}

// ─── Camera backdrop ─────────────────────────────────────────
function CameraBackdrop({ useCamera, videoRef, flash }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: T.c.n950,
      overflow: 'hidden',
    }}>
      {useCamera ? (
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
      ) : (
        <FauxViewfinder/>
      )}

      {/* Flash white-out overlay */}
      {flash && (
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }}/>
      )}

      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

function FauxViewfinder() {
  // A subtle suggestion of a wine bottle on a dark table — for canvas
  // previews where we don't request actual camera permission.
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #1a1414 0%, #0a0606 60%, #0a0a0a 100%)',
      overflow: 'hidden',
    }}>
      {/* Soft warm spotlight */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -10%)',
        width: '120%', height: '60%',
        background: 'radial-gradient(ellipse at center, rgba(160,74,85,0.18) 0%, rgba(74,31,36,0.06) 40%, transparent 70%)',
        pointerEvents: 'none',
      }}/>
      {/* Faint bottle silhouette */}
      <svg
        viewBox="0 0 200 400"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200, height: 400,
          opacity: 0.45,
        }}
      >
        <defs>
          <linearGradient id="tcBotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(74,31,36,0)"/>
            <stop offset="40%" stopColor="rgba(74,31,36,0.55)"/>
            <stop offset="50%" stopColor="rgba(114,47,55,0.85)"/>
            <stop offset="60%" stopColor="rgba(74,31,36,0.55)"/>
            <stop offset="100%" stopColor="rgba(74,31,36,0)"/>
          </linearGradient>
        </defs>
        <path
          d="M88 30 L88 70 Q80 110 80 145 L80 360 Q80 380 100 380 Q120 380 120 360 L120 145 Q120 110 112 70 L112 30 Z"
          fill="url(#tcBotGrad)"
        />
        {/* Label area */}
        <rect x={80} y={200} width={40} height={80} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" strokeWidth={0.5}/>
      </svg>
    </div>
  );
}

// ─── Top bar ─────────────────────────────────────────────────
function TopBar({ mode, onChangeMode, onClose, flash, onToggleFlash, dim }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      padding: '14px 12px 18px',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
      display: 'flex', alignItems: 'center', gap: 8,
      pointerEvents: dim ? 'none' : 'auto',
      opacity: dim ? 0.45 : 1,
      transition: 'opacity 200ms',
    }}>
      <ScannerIconBtn name="close" onClick={onClose} ariaLabel="Fechar"/>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <ModeToggle mode={mode} onChange={onChangeMode}/>
      </div>

      <ScannerIconBtn
        name="bolt"
        onClick={onToggleFlash}
        ariaLabel={flash ? 'Desligar flash' : 'Ligar flash'}
        active={flash}
        fill={flash ? 1 : 0}
      />
    </div>
  );
}

function ModeToggle({ mode, onChange }) {
  const options = [
    { key: 'label', label: 'Rótulo',             icon: 'wine_bar' },
    { key: 'menu',  label: 'Carta',  icon: 'menu_book' },
  ];
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        padding: 4, gap: 2,
        background: 'rgba(15,15,15,0.65)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: T.r.full,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {options.map(o => {
        const active = mode === o.key;
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.key)}
            style={{
              height: 32, padding: '0 14px',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: active ? T.c.n0 : 'transparent',
              color: active ? T.c.n950 : 'rgba(255,255,255,0.85)',
              border: 'none', borderRadius: T.r.full,
              cursor: 'pointer',
              fontFamily: T.font, fontSize: 13, fontWeight: 700,
              transition: 'background 160ms, color 160ms',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name={o.icon} size={14} color={active ? T.c.n950 : 'rgba(255,255,255,0.85)'}/>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ScannerIconBtn({ name, onClick, ariaLabel, active, fill = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: active ? T.c.a500 : 'rgba(15,15,15,0.60)',
        border: '1px solid rgba(255,255,255,0.12)',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 160ms',
        flexShrink: 0,
      }}
    >
      <Icon
        name={name}
        size={18}
        color={active ? T.c.n950 : T.c.n0}
        fill={fill}
        weight={600}
      />
    </button>
  );
}

// ─── Scan guide ──────────────────────────────────────────────
function ScanGuide({ width, height, label, mode, dim }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      transition: 'opacity 200ms',
      opacity: dim ? 0.45 : 1,
    }}>
      <div data-tour-anchor="scanner-frame" style={{
        position: 'relative',
        width, height,
        // Backdrop "cutout" effect via box-shadow inset on screen
      }}>
        {/* Rounded rect outline — subtle pulse */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          border: '2px solid rgba(255,255,255,0.65)',
          borderRadius: T.r.lg,
          animation: 'tcScannerPulse 1500ms ease-in-out infinite',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.32)',
        }}/>

        {/* Corner brackets (more prominent, no pulse) */}
        <Corner pos="tl"/>
        <Corner pos="tr"/>
        <Corner pos="bl"/>
        <Corner pos="br"/>

        {/* Scanning line */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 8,
          overflow: 'hidden',
          borderRadius: T.r.md,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${T.c.p300} 15%, ${T.c.p500} 50%, ${T.c.p300} 85%, transparent 100%)`,
            boxShadow: `0 0 12px ${T.c.p500}, 0 0 24px ${T.c.p700}`,
            animation: 'tcScannerLine 2000ms ease-in-out infinite',
            transformOrigin: 'top center',
          }}/>
        </div>

        {/* Helper text */}
        <div style={{
          position: 'absolute', top: 'calc(100% + 20px)',
          left: '50%', transform: 'translateX(-50%)',
          width: 280,
          textAlign: 'center',
          color: T.c.n0,
          fontFamily: T.font,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 600,
            letterSpacing: '-0.005em',
            textShadow: '0 1px 4px rgba(0,0,0,0.55)',
          }}>{label}</div>
          {mode === 'menu' && (
            <div style={{
              marginTop: 6,
              fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.78)',
              textShadow: '0 1px 4px rgba(0,0,0,0.55)',
            }}>A gente identifica os vinhos e calcula seu match.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Corner({ pos }) {
  const side = 26;
  const thickness = 3;
  const radius = 8;
  // Build a corner with two short lines via borders on a single absolutely-positioned box.
  const styles = {
    tl: { top: -2, left: -2, borderTop: `${thickness}px solid ${T.c.n0}`, borderLeft: `${thickness}px solid ${T.c.n0}`, borderTopLeftRadius: radius },
    tr: { top: -2, right: -2, borderTop: `${thickness}px solid ${T.c.n0}`, borderRight: `${thickness}px solid ${T.c.n0}`, borderTopRightRadius: radius },
    bl: { bottom: -2, left: -2, borderBottom: `${thickness}px solid ${T.c.n0}`, borderLeft: `${thickness}px solid ${T.c.n0}`, borderBottomLeftRadius: radius },
    br: { bottom: -2, right: -2, borderBottom: `${thickness}px solid ${T.c.n0}`, borderRight: `${thickness}px solid ${T.c.n0}`, borderBottomRightRadius: radius },
  };
  return (
    <div aria-hidden="true" style={{
      position: 'absolute',
      width: side, height: side,
      ...styles[pos],
    }}/>
  );
}

// ─── Bottom bar ──────────────────────────────────────────────
function BottomBar({ onCapture, onPickFromGallery, dim }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
      padding: '24px 24px 32px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.85) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      pointerEvents: dim ? 'none' : 'auto',
      opacity: dim ? 0.45 : 1,
      transition: 'opacity 200ms',
    }}>
      {/* Left spacer to center the capture button visually */}
      <div style={{ width: 52, flexShrink: 0 }}/>

      {/* Center: capture button + caption */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <CaptureButton onClick={onCapture}/>
        <div style={{
          fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
          letterSpacing: 0.2,
          textShadow: '0 1px 4px rgba(0,0,0,0.55)',
        }}>Toque pra capturar</div>
      </div>

      {/* Right: gallery */}
      <button
        type="button"
        onClick={onPickFromGallery}
        aria-label="Escolher da galeria"
        style={{
          width: 52, height: 52, borderRadius: T.r.md,
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.18)',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'background 160ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
      >
        <Icon name="photo_library" size={22} color={T.c.n0} fill={0}/>
      </button>
    </div>
  );
}

function CaptureButton({ onClick }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label="Capturar foto"
      style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)',
        border: '3px solid rgba(255,255,255,0.95)',
        padding: 6,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        transition: 'transform 100ms',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
      }}
    >
      <span style={{
        width: '100%', height: '100%',
        borderRadius: '50%',
        background: T.c.n0,
        border: `2px solid ${T.c.p700}`,
        display: 'inline-block',
        transition: 'background 100ms',
      }}/>
    </button>
  );
}

// ─── Processing overlay ──────────────────────────────────────
function ProcessingOverlay({ mode }) {
  const label = mode === 'menu'
    ? 'Lendo a carta…'
    : 'Identificando rótulo…';
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        animation: 'tcScannerProcessing 240ms ease forwards',
      }}
    >
      <Spinner size={68}/>
      <div style={{
        marginTop: 18,
        fontSize: 16, fontWeight: 600,
        color: T.c.n0, letterSpacing: '-0.005em',
        textShadow: '0 1px 4px rgba(0,0,0,0.45)',
      }}>{label}</div>
      <div style={{
        marginTop: 6,
        fontSize: 12, fontWeight: 500,
        color: 'rgba(255,255,255,0.72)',
        letterSpacing: 0.2,
      }}>{mode === 'menu' ? 'Reconhecendo vinhos da carta' : 'Comparando com nossa base'}</div>

      {/* Progress dots */}
      <div style={{
        marginTop: 14,
        display: 'inline-flex', gap: 6,
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: T.c.p300,
              opacity: 0.4,
              animation: `tcScannerPulse 1500ms ease-in-out ${i * 200}ms infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Spinner({ size = 56 }) {
  return (
    <div
      role="progressbar"
      aria-label="Carregando"
      style={{
        position: 'relative',
        width: size, height: size,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: `3px solid rgba(255,255,255,0.16)`,
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: `3px solid transparent`,
        borderTopColor: T.c.p300,
        borderRightColor: T.c.p500,
        animation: 'tcScannerSpin 900ms linear infinite',
      }}/>
    </div>
  );
}

// ─── Permission denied ───────────────────────────────────────
function PermissionDeniedState({ onRetry, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', flexDirection: 'column',
      padding: 24,
      background: 'linear-gradient(180deg, rgba(15,15,15,0.92) 0%, #0a0a0a 100%)',
    }}>
      {/* Mini top bar so user can still close */}
      <div style={{ display: 'flex' }}>
        <ScannerIconBtn name="close" onClick={onClose} ariaLabel="Fechar"/>
      </div>

      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', gap: 18,
        padding: '0 16px',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="no_photography" size={44} color={T.c.a500}/>
        </div>

        <div>
          <h2 style={{
            margin: 0,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 24, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: T.c.n0, textWrap: 'balance',
          }}>Permita acesso à câmera pra scannear</h2>
          <p style={{
            margin: '10px 0 0', maxWidth: 320,
            fontSize: 14, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.72)',
            textWrap: 'pretty',
          }}>A gente usa a câmera só pra ler o rótulo. Nada é salvo ou compartilhado sem você confirmar.</p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          style={{
            height: 48, padding: '0 22px',
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            transition: 'background 120ms',
            boxShadow: '0 4px 12px rgba(74,31,36,0.40)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          <Icon name="photo_camera" size={18} color={T.c.n0}/>
          Permitir acesso à câmera
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 12px',
            color: 'rgba(255,255,255,0.65)',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Scanner });


export { BottomBar, CameraBackdrop, CaptureButton, Corner, FauxViewfinder, ModeToggle, PermissionDeniedState, ProcessingOverlay, ScanGuide, Scanner, ScannerIconBtn, Spinner, TopBar };
