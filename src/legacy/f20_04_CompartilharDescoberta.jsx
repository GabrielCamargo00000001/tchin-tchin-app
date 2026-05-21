/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { BottomSheet } from './f13_04_BottomSheet.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 20.04 · CompartilharDescoberta — Loop Scanner Social
//
// US-13-6-01 · disparado do "Compartilhar" no 20.02 ResultadoScan
//
//   <CompartilharDescoberta
//     isOpen
//     wine={{ name, producer, year, region, country, photoGradient }}
//     matchScore={87}
//     username="anabeatriz"
//     onClose={() => ...}
//     onShare={(target, message) => ...}   // 'instagram'|'whatsapp'|'twitter'|'more'
//     contained={true}                      // pra phone mock
//   />
//
// Loop viral: gera Story 1080×1920 com Match Score, share intent
// nativo do device, +30 pts pelo share.
// ─────────────────────────────────────────────────────────────

const SHARE_TARGETS = [
  { key: 'instagram', label: 'Stories',  brand: 'instagram' },
  { key: 'whatsapp',  label: 'WhatsApp', brand: 'whatsapp'  },
  { key: 'twitter',   label: 'X',        brand: 'twitter'   },
  { key: 'more',      label: 'Mais',     brand: 'more'      },
];

function CompartilharDescoberta({
  isOpen,
  wine = {},
  matchScore = 87,
  username = 'voce',
  onClose = () => {},
  onShare = () => {},
  contained = false,
}) {
  const defaultMessage = `Olha o vinho que combina ${matchScore}% comigo no Tchin 🍷`;
  const [message, setMessage] = React.useState(defaultMessage);
  const [sharing, setSharing] = React.useState(false);

  // Reset message when score/wine changes (reopen for different wine)
  React.useEffect(() => {
    setMessage(`Olha o vinho que combina ${matchScore}% comigo no Tchin 🍷`);
  }, [matchScore, wine.id]);

  const handleTarget = (target) => {
    if (sharing) return;
    setSharing(true);
    setTimeout(() => {
      onShare(target, message);
      setSharing(false);
    }, 600); // simulate share-sheet flicker
  };

  const handleGenerate = () => {
    handleTarget('more');
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Compartilhar descoberta"
      contained={contained}
      maxHeight="92%"
    >
      <div style={{
        padding: '0 16px 16px',
        display: 'flex', flexDirection: 'column', gap: 16,
        fontFamily: T.font,
      }}>
        {/* Preview card — IG Story aspect */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          paddingTop: 4,
        }}>
          <StoryPreview
            wine={wine}
            matchScore={matchScore}
            username={username}
          />
        </div>

        {/* Targets row */}
        <div>
          <div style={{
            ...T.t.overline, color: T.c.n600, marginBottom: 10,
          }}>Compartilhar em</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
          }}>
            {SHARE_TARGETS.map(t => (
              <ShareTargetButton
                key={t.key}
                target={t}
                onClick={() => handleTarget(t.key)}
                disabled={sharing}
              />
            ))}
          </div>
        </div>

        {/* Message input */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <label style={{
              ...T.t.label, color: T.c.n800,
              fontSize: 13, fontWeight: 600,
            }}>Mensagem</label>
            <span style={{
              ...T.t.caption, color: T.c.n600,
              fontFamily: T.mono, fontWeight: 500,
            }}>{message.length}/280</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 280))}
            rows={3}
            maxLength={280}
            style={{
              width: '100%', padding: 12,
              border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
              background: T.c.n0, fontFamily: T.font,
              fontSize: 14, lineHeight: 1.5, color: T.c.n950,
              resize: 'none', outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 120ms, box-shadow 120ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = T.c.p700;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${T.c.p100}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = T.c.n300;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Reward hint */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 12px',
          background: T.c.a100,
          border: `1px solid ${T.c.a500}`,
          borderRadius: T.r.full,
          fontSize: 12, fontWeight: 600,
          color: T.c.p900,
          alignSelf: 'center',
        }}>
          <Icon name="stars" size={14} color={T.c.a700} fill={1}/>
          +30 pts por compartilhar
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={sharing}
          style={{
            width: '100%', height: 48,
            background: sharing ? T.c.p500 : T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 15, fontWeight: 700,
            cursor: sharing ? 'wait' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '-0.005em',
            transition: 'background 120ms',
            boxShadow: '0 4px 12px rgba(74,31,36,0.18)',
          }}
          onMouseEnter={(e) => { if (!sharing) e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { if (!sharing) e.currentTarget.style.background = T.c.p700; }}
        >
          {sharing ? (
            <>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `2px solid rgba(255,255,255,0.3)`,
                borderTopColor: T.c.n0,
                animation: 'tcScannerSpin 700ms linear infinite',
              }}/>
              Gerando…
            </>
          ) : (
            <>
              <Icon name="image" size={18} color={T.c.n0}/>
              Gerar imagem e compartilhar
            </>
          )}
        </button>
      </div>
    </BottomSheet>
  );
}

// ─── Story preview (IG vertical aspect) ──────────────────────
function StoryPreview({ wine, matchScore, username }) {
  // Card is 9:16 like IG Stories, scaled to a comfortable preview width
  const w = 240;
  const h = 400;
  const grad = wine.photoGradient || ['#722F37', '#0F0F0F'];

  return (
    <div style={{
      position: 'relative',
      width: w, height: h,
      borderRadius: 18,
      overflow: 'hidden',
      background: `linear-gradient(165deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
      boxShadow: '0 12px 32px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10)',
      color: T.c.n0,
      fontFamily: T.font,
    }}>
      {/* Diagonal texture */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0.18,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 18px)',
      }}/>

      {/* Soft glow behind label */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -10%)',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,165,116,0.30) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Logo top */}
      <div style={{
        position: 'absolute', top: 14, left: 14,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px 4px 6px',
        background: 'rgba(255,255,255,0.14)',
        border: '1px solid rgba(255,255,255,0.20)',
        borderRadius: T.r.full,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        {typeof TchinLogo !== 'undefined'
          ? <TchinLogo size={16} color="#FFFFFF"/>
          : <Icon name="wine_bar" size={12} color={T.c.n0}/>
        }
        <span style={{
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 11, fontWeight: 600,
          color: T.c.n0, letterSpacing: '-0.005em',
        }}>Tchin Tchin</span>
      </div>

      {/* Schematic bottle/label centered */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -54%)',
        width: 96, height: 130,
        background: 'rgba(245,233,212,0.96)',
        borderRadius: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 8, textAlign: 'center',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        color: '#4A1F24',
      }}>
        <div style={{ fontSize: 6, letterSpacing: 1.6, fontWeight: 700, opacity: 0.7 }}>
          {(wine.country || 'BR').toUpperCase()}
        </div>
        <div style={{ width: 18, height: 1, background: '#722F37', margin: '4px 0 6px', opacity: 0.5 }}/>
        <div style={{
          fontSize: 10, fontWeight: 600, lineHeight: 1.1,
          letterSpacing: '-0.015em',
        }}>{wine.producer || 'Produtor'}</div>
        <div style={{
          fontSize: 7, fontWeight: 500, lineHeight: 1.2,
          marginTop: 3, fontStyle: 'italic',
          maxWidth: 80, textWrap: 'balance',
        }}>{(wine.name || '').slice(0, 28) || 'Vinho'}</div>
        <div style={{ width: 12, height: 1, background: '#722F37', margin: '4px 0', opacity: 0.5 }}/>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '-0.01em' }}>{wine.year || '2021'}</div>
      </div>

      {/* Match badge — draggable sticker positioned at top-right */}
      <div style={{
        position: 'absolute',
        top: 56, right: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: matchToneStoryColor(matchScore),
          border: '3px solid rgba(255,255,255,0.92)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
          color: T.c.n0,
          boxShadow: '0 6px 16px rgba(0,0,0,0.30)',
        }}>{matchScore}%</div>
        <div style={{
          ...T.t.overline,
          color: T.c.n0,
          textShadow: '0 1px 3px rgba(0,0,0,0.55)',
          letterSpacing: 1.2,
          fontSize: 9,
        }}>MATCH</div>
        {/* Drag hint */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -6, right: -6,
          width: 18, height: 18, borderRadius: '50%',
          background: T.c.n0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}>
          <Icon name="drag_indicator" size={12} color={T.c.n600}/>
        </div>
      </div>

      {/* Bottom block: wine name + attribution */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '40px 18px 20px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.85) 100%)',
      }}>
        <div style={{
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 17, fontWeight: 600,
          letterSpacing: '-0.015em', lineHeight: 1.15,
          color: T.c.n0, textWrap: 'balance',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name || 'Vinho descoberto'}</div>
        <div style={{
          marginTop: 4,
          fontSize: 11, fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
          letterSpacing: 0.2,
        }}>{wine.producer || '—'}{wine.year ? ` · ${wine.year}` : ''}</div>
        <div style={{
          marginTop: 10,
          fontSize: 11, fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ color: T.c.a500 }}>@{username}</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>descobriu no Tchin Tchin</span>
        </div>
      </div>
    </div>
  );
}

function matchToneStoryColor(score) {
  if (typeof score !== 'number') return '#6B6B6B';
  if (score >= 75) return '#2E7D32';
  if (score >= 50) return '#B8894A';
  return '#6B6B6B';
}

// ─── Share target button ─────────────────────────────────────
function ShareTargetButton({ target, onClick, disabled }) {
  const meta = SHARE_BRAND_META[target.brand] || SHARE_BRAND_META.more;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Compartilhar em ${target.label}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: 0,
        background: 'none', border: 'none', cursor: disabled ? 'wait' : 'pointer',
        fontFamily: T.font,
        opacity: disabled ? 0.6 : 1,
        transition: 'opacity 120ms, transform 80ms',
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: T.r.lg,
        background: meta.bg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
      }}>
        <BrandGlyph brand={target.brand}/>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600,
        color: T.c.n800,
      }}>{target.label}</span>
    </button>
  );
}

const SHARE_BRAND_META = {
  instagram: { bg: 'linear-gradient(135deg, #FEDA77 0%, #F58529 25%, #DD2A7B 50%, #8134AF 75%, #515BD4 100%)' },
  whatsapp:  { bg: '#25D366' },
  twitter:   { bg: '#0F1419' },
  more:      { bg: '#F2F2F2' },
};

function BrandGlyph({ brand }) {
  const W = '#FFFFFF';
  switch (brand) {
    case 'instagram':
      return (
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x={3} y={3} width={18} height={18} rx={5} stroke={W} strokeWidth={2}/>
          <circle cx={12} cy={12} r={4} stroke={W} strokeWidth={2}/>
          <circle cx={17.3} cy={6.7} r={1.2} fill={W}/>
        </svg>
      );
    case 'whatsapp':
      return (
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2C6.5 2 2 6.5 2 12c0 1.9 0.5 3.6 1.4 5.1L2 22l5-1.3c1.5 0.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.4 14.2c-0.2 0.6-1.3 1.2-1.8 1.2-0.5 0-1 0.2-3.4-0.9-2.9-1.2-4.7-4.2-4.9-4.4-0.1-0.2-1.1-1.4-1.1-2.7s0.7-1.9 1-2.2c0.2-0.2 0.5-0.3 0.7-0.3h0.5c0.2 0 0.5 0 0.7 0.5 0.2 0.7 0.8 2.2 0.9 2.3 0.1 0.2 0.1 0.3 0 0.5-0.1 0.2-0.2 0.3-0.3 0.5l-0.4 0.4c-0.2 0.2-0.4 0.3-0.2 0.6 0.2 0.3 0.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.6 0.3 0.1 0.5 0.1 0.7-0.1 0.2-0.2 0.7-0.9 1-1.1 0.2-0.3 0.4-0.2 0.7-0.1l2 0.9c0.3 0.1 0.5 0.2 0.6 0.3 0.1 0.3 0.1 1-0.1 1.6z"
            fill={W}
          />
        </svg>
      );
    case 'twitter':
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 3h3l-7.5 8.6L22 21h-6.8l-5.3-7-6 7H1l8-9.3L1.7 3h7l4.8 6.4L18 3zm-1.2 16h1.7L7.3 5h-1.8l11.3 14z"
            fill={W}
          />
        </svg>
      );
    case 'more':
    default:
      return (
        <Icon name="more_horiz" size={24} color="#6B6B6B" weight={600}/>
      );
  }
}

Object.assign(window, { CompartilharDescoberta });


export { BrandGlyph, CompartilharDescoberta, SHARE_BRAND_META, SHARE_TARGETS, ShareTargetButton, StoryPreview, matchToneStoryColor };
