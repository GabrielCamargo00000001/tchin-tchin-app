/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { PaladarRadar } from './screens-quiz.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 16.01 · MatchScoreBadge — o componente mais usado do app
//
//   <MatchScoreBadge
//     score={92}                  // 0-100 or null
//     userHasPaladar={true}
//     wineHasProfile={true}
//     size="md"                   // 'sm' | 'md' | 'lg'
//     onTap={() => ...}
//     showExplanation={true}      // lg only — opens "Why this match?" modal
//     wineProfile={...}           // optional, for radar in explanation modal
//     userProfile={...}
//   />
//
// 5 estados:
//   1) score >= 75      → emerald circle (pulse if lg)
//   2) 50 ≤ score < 75  → amber circle
//   3) score < 50       → neutral/400 circle
//   4) !userHasPaladar  → "Faça o quiz pra ver match" pill
//   5) !wineHasProfile  → "Avalie pra descobrir" pill
// ─────────────────────────────────────────────────────────────

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('tc-match-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-match-kf';
  s.textContent = `
    @keyframes tcMatchPulse {
      0%, 100% { opacity: 0.92; box-shadow: 0 0 0 0 rgba(46,125,50,0.25); }
      50%      { opacity: 1.00; box-shadow: 0 0 0 6px rgba(46,125,50,0.10); }
    }
    @keyframes tcMatchCrossfadeIn  { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
    @keyframes tcMatchCrossfadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes tcMatchModalIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes tcMatchModalCardIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  document.head.appendChild(s);
}

const MATCH_SIZES = {
  sm: { px: 28, fs: 10, fsPct: 8,  ring: 1.5 },
  md: { px: 56, fs: 16, fsPct: 10, ring: 2 },
  lg: { px: 120, fs: 32, fsPct: 14, ring: 3 },
};

// Tier resolution (75/50 thresholds per spec, not 80/60 like legacy)
function matchTier(score) {
  if (typeof score !== 'number' || isNaN(score)) return 'unknown';
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

const MATCH_TIER_COLORS = {
  high:    { bg: '#2E7D32', ring: '#1B5E20', fg: '#FFFFFF' },  // emerald/600 + emerald/800 ring
  medium:  { bg: '#B8894A', ring: '#9A6F3A', fg: '#FFFFFF' },  // amber/500 (corrigido pra T.c.a700) + darker ring
  low:     { bg: '#B0B0B0', ring: '#909090', fg: '#FFFFFF' },  // neutral/400
};

function MatchScoreBadge({
  score = null,
  userHasPaladar = true,
  wineHasProfile = true,
  size = 'md',
  onTap,
  showExplanation = false,
  wineProfile,
  userProfile,
  ariaLabel,
  style = {},
}) {
  const sz = MATCH_SIZES[size] || MATCH_SIZES.md;
  const [modalOpen, setModalOpen] = React.useState(false);

  // Estado 4: user sem paladar
  if (!userHasPaladar) {
    return <MatchPillState
      kind="no-paladar"
      onTap={onTap}
      ariaLabel="Faça o quiz pra ver match"
      style={style}
    />;
  }
  // Estado 5: vinho sem perfil
  if (!wineHasProfile) {
    return <MatchPillState
      kind="no-profile"
      onTap={onTap}
      ariaLabel="Vinho sem perfil — avalie pra descobrir"
      style={style}
    />;
  }

  // Estados 1-3: circle
  const tier = matchTier(score);
  const colors = MATCH_TIER_COLORS[tier];
  const isHigh = tier === 'high';
  const isLg = size === 'lg';

  const handleClick = () => {
    if (isLg && showExplanation && tier !== 'unknown') {
      setModalOpen(true);
    } else if (onTap) {
      onTap();
    }
  };

  const Tag = (onTap || (isLg && showExplanation)) ? 'button' : 'div';

  return (
    <React.Fragment>
      <Tag
        type={Tag === 'button' ? 'button' : undefined}
        onClick={Tag === 'button' ? handleClick : undefined}
        role={Tag === 'button' ? undefined : 'img'}
        aria-label={ariaLabel || `Match ${score}%`}
        style={{
          width: sz.px,
          height: sz.px,
          flexShrink: 0,
          borderRadius: '50%',
          background: colors.bg,
          color: colors.fg,
          border: isLg ? `${sz.ring}px solid ${colors.ring}` : 'none',
          padding: 0,
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: Tag === 'button' ? 'pointer' : 'default',
          fontFamily: T.font,
          letterSpacing: '0.1px',
          boxShadow: isLg
            ? `0 4px 12px rgba(0,0,0,0.10), inset 0 -3px 6px rgba(0,0,0,0.10)`
            : `0 1px 2px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(0,0,0,0.08)`,
          animation: (isHigh && isLg)
            ? 'tcMatchPulse 2.4s ease-in-out infinite'
            : 'tcMatchCrossfadeIn 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          outline: 'none',
          userSelect: 'none',
          lineHeight: 1,
          ...style,
        }}
      >
        <span style={{
          fontSize: sz.fs,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>{score}</span>
        <span style={{
          fontSize: sz.fsPct,
          fontWeight: 600,
          opacity: 0.85,
          marginTop: isLg ? 4 : 1,
          letterSpacing: '0.4px',
        }}>%</span>
      </Tag>

      {/* Explanation modal — lg + showExplanation only */}
      {modalOpen && (
        <MatchExplanationModal
          score={score}
          tier={tier}
          wineProfile={wineProfile}
          userProfile={userProfile}
          onClose={() => setModalOpen(false)}
        />
      )}
    </React.Fragment>
  );
}

// ─── Pill states (estados 4 e 5) ──────────────────────────────
function MatchPillState({ kind, onTap, ariaLabel, style }) {
  const isNoPaladar = kind === 'no-paladar';
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: T.c.n100,
        color: T.c.n600,
        border: 'none',
        borderRadius: 9999,
        fontFamily: T.font,
        fontSize: 12,
        fontWeight: 500,
        cursor: onTap ? 'pointer' : 'default',
        letterSpacing: '0.1px',
        fontStyle: isNoPaladar ? 'normal' : 'italic',
        whiteSpace: 'nowrap',
        transition: 'background 120ms',
        animation: 'tcMatchCrossfadeIn 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        ...style,
      }}
      onMouseEnter={(e) => { if (onTap) e.currentTarget.style.background = T.c.n200; }}
      onMouseLeave={(e) => { if (onTap) e.currentTarget.style.background = T.c.n100; }}
    >
      {isNoPaladar && (
        <Icon name="psychology" size={12} color={T.c.n600}/>
      )}
      {isNoPaladar ? 'Faça o quiz pra ver match' : 'Avalie pra descobrir'}
    </button>
  );
}

// ─── Explanation modal (mini) ─────────────────────────────────
function MatchExplanationModal({ score, tier, wineProfile, userProfile, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const tierLabel = tier === 'high'   ? 'Excelente combinação'
                  : tier === 'medium' ? 'Boa combinação'
                  : 'Combinação limitada';
  const tierColor = tier === 'high'   ? T.c.s700
                  : tier === 'medium' ? T.c.a700
                  : T.c.n600;

  const explanation = generateExplanation(tier, wineProfile, userProfile);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-explanation-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}
      style={{
        position: 'fixed',
        inset: 0, zIndex: 9700,
        background: 'rgba(15, 15, 15, 0.60)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: T.font,
        animation: 'tcMatchModalIn 200ms ease forwards',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 320, maxWidth: '100%',
          background: T.c.n0, borderRadius: 16, padding: 24,
          boxShadow: '0 24px 60px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.12)',
          animation: 'tcMatchModalCardIn 240ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
          color: T.c.n950,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <MatchScoreBadge
            score={score}
            userHasPaladar
            wineHasProfile
            size="md"
            showExplanation={false}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              id="match-explanation-title"
              style={{
                fontFamily: T.serif || "'Fraunces', Georgia, serif",
                fontSize: 18, fontWeight: 600,
                letterSpacing: '-0.01em', lineHeight: 1.2,
                color: T.c.n950,
              }}
            >Por que esse match?</div>
            <div style={{
              fontSize: 12, color: tierColor, fontWeight: 700,
              marginTop: 2, letterSpacing: '0.4px', textTransform: 'uppercase',
            }}>{tierLabel}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: T.c.n100, border: 'none', color: T.c.n800,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 120ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.c.n200; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.c.n100; }}
          >
            <Icon name="close" size={16} color={T.c.n800}/>
          </button>
        </div>

        {/* Mini radar comparison (uses PaladarRadar if available) */}
        {wineProfile && userProfile && typeof PaladarRadar !== 'undefined' ? (
          <div style={{
            display: 'flex', justifyContent: 'center',
            padding: '8px 0 12px',
          }}>
            <PaladarRadar
              paladar={userProfile}
              wine={{ perfil: wineProfile }}
              size={200}
              showLabels
              animate={false}
              showWine
            />
          </div>
        ) : (
          <ProfileComparisonBars wineProfile={wineProfile} userProfile={userProfile}/>
        )}

        <div style={{
          marginTop: 8,
          fontSize: 13, lineHeight: 1.55,
          color: T.c.n800,
          textWrap: 'pretty',
        }}>{explanation}</div>

        <div style={{
          marginTop: 12,
          fontSize: 11,
          color: T.c.n600,
          letterSpacing: '0.1px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="info" size={12} color={T.c.n600}/>
          <span>Calculado a partir do seu paladar + perfil sensorial do vinho.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mini comparison fallback (when no radar available) ──────
function ProfileComparisonBars({ wineProfile = {}, userProfile = {} }) {
  const axes = [
    { key: 'docura', label: 'Doçura' },
    { key: 'acidez', label: 'Acidez' },
    { key: 'tanino', label: 'Tanino' },
    { key: 'corpo',  label: 'Corpo' },
    { key: 'alcool', label: 'Álcool' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0 16px' }}>
      {axes.map(ax => {
        const u = Math.min(100, Math.max(0, userProfile[ax.key] || 0));
        const w = Math.min(100, Math.max(0, wineProfile[ax.key] || 0));
        return (
          <div key={ax.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 60, fontSize: 11, fontWeight: 600, color: T.c.n800 }}>{ax.label}</div>
            <div style={{
              flex: 1, height: 8, borderRadius: 4,
              background: T.c.n100, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: `${u}%`,
                background: T.c.p500, opacity: 0.7,
              }}/>
              <div style={{
                position: 'absolute', left: `${w}%`, top: -2, bottom: -2, width: 2,
                background: T.c.a700,
              }}/>
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 10, color: T.c.n600 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, background: T.c.p500, opacity: 0.7, borderRadius: 2 }}/>Você
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 2, height: 10, background: T.c.a700 }}/>Vinho
        </span>
      </div>
    </div>
  );
}

// ─── Explanation text generator ───────────────────────────────
function generateExplanation(tier, wineProfile, userProfile) {
  if (tier === 'high') {
    return 'Esse vinho casa muito bem com seu paladar. As dimensões principais — corpo, tanino e acidez — estão dentro da sua faixa de preferência.';
  }
  if (tier === 'medium') {
    return 'Tem afinidade com seu paladar, mas com algumas diferenças. Vale provar pra ver se gosta — pode surpreender ou expandir seu repertório.';
  }
  return 'Esse perfil sai bastante do seu paladar habitual. Pode ser uma boa experiência pra explorar fora da zona de conforto, ou não — depende do seu humor pro novo.';
}

Object.assign(window, {
  MatchScoreBadge,
  MatchExplanationModal,
  MATCH_SIZES,
  MATCH_TIER_COLORS,
  matchTier,
});


export { MATCH_SIZES, MATCH_TIER_COLORS, MatchExplanationModal, MatchPillState, MatchScoreBadge, ProfileComparisonBars, generateExplanation, matchTier };
