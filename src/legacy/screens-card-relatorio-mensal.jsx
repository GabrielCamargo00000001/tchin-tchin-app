/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 17.03 · CardRelatorioMensal — feed card "Seu {mês} no vinho"
//
//   <CardRelatorioMensal
//     month="abril"
//     monthIndex={3}              // 0-11, optional, picks theme
//     stats={{ wines: 7, countries: 3, grapes: 5 }}
//     favorite={{ wine, rating }}
//     newCountry={{ name: 'Portugal', flag: '🇵🇹' }}  // optional
//     onTapDetails={() => ...}
//     onShare={() => ...}
//     onClose={() => ...}
//   />
//
// Empty variant (mês sem registros):
//   <CardRelatorioMensal month="maio" empty onTapRegister={...} onClose={...} />
// ─────────────────────────────────────────────────────────────

// 12-month theme — each month gets a sutile gradient swap so the card
// feels fresh year-round but stays inside the burgundy + amber palette.
const MONTH_THEMES = [
  { from: '#F5E3E5', to: '#FAF1F2' },  // jan
  { from: '#F5E9D4', to: '#FAF1F2' },  // fev
  { from: '#F5E3E5', to: '#F5E9D4' },  // mar
  { from: '#F5E9D4', to: '#FAF1F2' },  // abr
  { from: '#F5E3E5', to: '#F5E9D4' },  // mai
  { from: '#F5E9D4', to: '#F5E3E5' },  // jun
  { from: '#F5E3E5', to: '#F5E9D4' },  // jul
  { from: '#F5E9D4', to: '#FAF1F2' },  // ago
  { from: '#F5E3E5', to: '#FAF1F2' },  // set
  { from: '#F5E9D4', to: '#F5E3E5' },  // out
  { from: '#F5E3E5', to: '#FAF1F2' },  // nov
  { from: '#F5E9D4', to: '#F5E3E5' },  // dez
];

function CardRelatorioMensal({
  month = 'maio',
  monthIndex,
  stats = { wines: 0, countries: 0, grapes: 0 },
  favorite,
  newCountry,
  empty = false,
  onTapDetails,
  onShare,
  onClose,
  onTapRegister,
  style = {},
}) {
  // Resolve theme: explicit monthIndex > name → index > random fallback
  const idx = (typeof monthIndex === 'number')
    ? monthIndex
    : monthNameToIndex(month);
  const theme = MONTH_THEMES[idx] || MONTH_THEMES[0];
  const monthCap = capitalize(month);

  if (empty) {
    return (
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
        border: `1px solid ${T.c.p100}`,
        borderRadius: T.r.lg,
        padding: 20,
        fontFamily: T.font,
        boxShadow: '0 2px 8px rgba(74, 31, 36, 0.06)',
        overflow: 'hidden',
        ...style,
      }}>
        {onClose && <CloseButton onClick={onClose}/>}
        <div style={{
          fontSize: 11, fontWeight: 700, color: T.c.n600,
          textTransform: 'uppercase', letterSpacing: 0.6,
        }}>Relatório mensal</div>
        <h2 style={{
          margin: '4px 0 0',
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em',
          color: T.c.n950, lineHeight: 1.2,
          textWrap: 'balance',
        }}>Nenhum vinho em {monthCap}</h2>
        <p style={{
          margin: '8px 0 16px',
          fontSize: 14, color: T.c.n800, lineHeight: 1.55,
        }}>Que tal começar? Cada vinho registrado vira história.</p>
        <button
          type="button"
          onClick={onTapRegister}
          style={{
            height: 36, padding: '0 16px',
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.sm,
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          <Icon name="add" size={16} color={T.c.n0}/>
          Registrar agora
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
      border: `1px solid ${T.c.p100}`,
      borderRadius: T.r.lg,
      padding: 20,
      fontFamily: T.font,
      boxShadow: '0 2px 8px rgba(74, 31, 36, 0.06)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Background flourish */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle, ${T.c.a500}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {onClose && <CloseButton onClick={onClose}/>}

      <div style={{
        fontSize: 11, fontWeight: 700, color: T.c.n600,
        textTransform: 'uppercase', letterSpacing: 0.6,
        position: 'relative',
      }}>Relatório mensal</div>

      <h2 style={{
        margin: '4px 0 0',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em',
        color: T.c.n950, lineHeight: 1.15,
        textWrap: 'balance', maxWidth: 280,
        position: 'relative',
      }}>Seu {monthCap} no vinho 🍷</h2>

      {/* Stats row */}
      <div style={{
        marginTop: 16,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        background: 'rgba(255,255,255,0.55)',
        borderRadius: T.r.md,
        padding: '12px 8px',
        position: 'relative',
      }}>
        <ReportStat value={String(stats.wines)} label={stats.wines === 1 ? 'vinho' : 'vinhos'}/>
        <ReportStat value={String(stats.countries)} label={stats.countries === 1 ? 'país' : 'países'} border/>
        <ReportStat value={String(stats.grapes)} label={stats.grapes === 1 ? 'uva' : 'uvas'}/>
      </div>

      {/* Favorite of the month */}
      {favorite && favorite.wine && (
        <div style={{ marginTop: 16, position: 'relative' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: T.c.p700,
            textTransform: 'uppercase', letterSpacing: 0.6,
            marginBottom: 6,
          }}>Favorito do mês</div>
          <MiniWineCard wine={favorite.wine} rating={favorite.rating} onTap={favorite.onTap}/>
        </div>
      )}

      {/* New country callout */}
      {newCountry && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.55)',
          borderRadius: T.r.sm,
          border: `1px solid ${T.c.p100}`,
          display: 'flex', alignItems: 'center', gap: 10,
          position: 'relative',
        }}>
          <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">{newCountry.flag || '🌍'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.c.n950, lineHeight: 1.35 }}>
              Você provou <b style={{ color: T.c.p700 }}>{newCountry.name}</b> pela primeira vez
            </div>
            {newCountry.context && (
              <div style={{ fontSize: 12, color: T.c.n600, marginTop: 2 }}>{newCountry.context}</div>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTAs */}
      <div style={{
        marginTop: 16,
        display: 'flex', gap: 8,
        position: 'relative',
      }}>
        <button
          type="button"
          onClick={onTapDetails}
          style={{
            height: 36, padding: '0 14px',
            background: T.c.p700, color: T.c.n0,
            border: 'none', borderRadius: T.r.sm,
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          Ver tudo
          <Icon name="arrow_forward" size={14} color={T.c.n0}/>
        </button>
        <button
          type="button"
          onClick={onShare}
          style={{
            height: 36, padding: '0 14px',
            background: 'transparent', color: T.c.p700,
            border: 'none',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'background 120ms',
            borderRadius: T.r.sm,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon name="share" size={16} color={T.c.p700}/>
          Compartilhar
        </button>
      </div>
    </div>
  );
}

// ─── Mini sub-components ──────────────────────────────────────
function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fechar relatório"
      style={{
        position: 'absolute', top: 8, right: 8, zIndex: 2,
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(255,255,255,0.65)', border: 'none',
        color: T.c.n800, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 120ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.65)'; }}
    >
      <Icon name="close" size={16} color={T.c.n800}/>
    </button>
  );
}

function ReportStat({ value, label, border }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '0 4px',
      borderLeft: border ? `1px solid ${T.c.p100}` : 'none',
      borderRight: border ? `1px solid ${T.c.p100}` : 'none',
    }}>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 24, fontWeight: 700, lineHeight: 1.1,
        color: T.c.n950, letterSpacing: '-0.01em',
      }}>{value}</div>
      <div style={{
        fontSize: 11, fontWeight: 500, color: T.c.n600,
        marginTop: 2, letterSpacing: 0.2,
      }}>{label}</div>
    </div>
  );
}

function MiniWineCard({ wine, rating, onTap }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: 'rgba(255,255,255,0.75)',
        border: `1px solid ${T.c.p100}`,
        borderRadius: T.r.sm,
        padding: 10,
        display: 'flex', gap: 12, alignItems: 'center',
        cursor: onTap ? 'pointer' : 'default',
        fontFamily: T.font,
      }}
    >
      <div style={{
        width: 40, height: 56, flexShrink: 0, borderRadius: 6,
        background: `linear-gradient(160deg, ${T.c.p100} 0%, ${T.c.p500} 55%, ${T.c.p900} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="wine_bar" size={20} color="rgba(255,255,255,0.92)" fill={1}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: T.c.n600,
          textTransform: 'uppercase', letterSpacing: 0.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.producer || '—'}</div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: T.c.n950, lineHeight: 1.25,
          marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name || 'Vinho'}</div>
        <div style={{ marginTop: 4 }}>
          <ReportStars value={rating || 0}/>
        </div>
      </div>
    </button>
  );
}

function ReportStars({ value = 0 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }} aria-label={`${value} de 5 estrelas`}>
      {[0, 1, 2, 3, 4].map(i => (
        <Icon
          key={i}
          name="star"
          size={13}
          color={i < value ? T.c.p700 : T.c.n300}
          fill={i < value ? 1 : 0}
        />
      ))}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function monthNameToIndex(name) {
  const map = {
    janeiro: 0, fevereiro: 1, março: 2, marco: 2, abril: 3,
    maio: 4, junho: 5, julho: 6, agosto: 7,
    setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
  };
  return map[(name || '').toLowerCase()] || 0;
}

Object.assign(window, { CardRelatorioMensal, MONTH_THEMES });


export { CardRelatorioMensal, CloseButton, MONTH_THEMES, MiniWineCard, ReportStars, ReportStat, capitalize, monthNameToIndex };
