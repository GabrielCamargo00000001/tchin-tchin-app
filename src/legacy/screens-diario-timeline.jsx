/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { SubHeader } from './components.jsx';
import { MOCK_USER } from './data.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 17.01 · DiarioTimeline — main view do Diário (US-12-3-01)
//
//   <DiarioTimeline
//     go={(screen, params) => ...}
//     ctx={{ user, diary }}
//   />
//
//  Diary entry shape:
//    { wine, date: 'YYYY-MM-DD', rating: 0..5, occasion?: string, note?: string }
// ─────────────────────────────────────────────────────────────

function DiarioTimeline({ go = () => {}, ctx = {} }) {
  const diary = ctx.diary || [];
  const user = ctx.user || (typeof MOCK_USER !== 'undefined' ? MOCK_USER : { name: 'Você' });

  // Sort newest first + group by month
  const sorted = React.useMemo(() => [...diary].sort((a, b) => (b.date || '').localeCompare(a.date || '')), [diary]);
  const groups = React.useMemo(() => groupByMonth(sorted), [sorted]);

  // Aggregated stats (reuse the logic from PerfilUsuario if available)
  const stats = React.useMemo(() => computeDiaryStats(sorted), [sorted]);

  // Empty state
  if (diary.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, fontFamily: T.font, overflow: 'hidden' }}>
        <SubHeader title="Meu Diário" onBack={() => go('home')}/>
        <DiaryEmpty go={go}/>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: T.c.n0, fontFamily: T.font, overflow: 'hidden',
    }}>
      <SubHeader
        title="Meu Diário"
        onBack={() => go('home')}
        actions={
          <React.Fragment>
            <button
              onClick={() => go('diary-filters')}
              aria-label="Filtrar diário"
              style={{
                width: 44, height: 44, border: 'none', background: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="filter_list" size={22} color={T.c.n800}/>
            </button>
            <button
              onClick={() => go('search', { scope: 'diary' })}
              aria-label="Buscar no diário"
              style={{
                width: 44, height: 44, border: 'none', background: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="search" size={22} color={T.c.n800}/>
            </button>
          </React.Fragment>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* ─── Stats banner ────────────────────────────────────── */}
        <div style={{
          background: T.c.n50,
          padding: '16px 20px',
          borderBottom: `1px solid ${T.c.n100}`,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
            alignItems: 'center',
            gap: 0,
          }}>
            <DiaryStatItem value={String(stats.wineCount)} label="provados"/>
            <div style={{ height: 32, background: T.c.n200 }}/>
            <DiaryStatItem value={String(stats.countryCount)} label={stats.countryCount === 1 ? 'país' : 'países'}/>
            <div style={{ height: 32, background: T.c.n200 }}/>
            <DiaryStatItem value={stats.topGrape || '—'} label="uva favorita"/>
          </div>
        </div>

        {/* ─── Timeline by month ───────────────────────────────── */}
        <div>
          {groups.map(group => (
            <MonthGroup
              key={group.key}
              label={group.label}
              count={group.entries.length}
              entries={group.entries}
              onTapEntry={(e) => go('diary-entry', { entry: e })}
            />
          ))}
        </div>

        {/* Spacer for fab + bottom nav */}
        <div style={{ height: 80 }}/>
      </div>

      {/* FAB pra registrar */}
      <button
        type="button"
        onClick={() => go('scanner', { from: 'diary' })}
        aria-label="Registrar novo vinho"
        style={{
          position: 'absolute', bottom: 76, right: 16,
          width: 56, height: 56, borderRadius: 28,
          background: T.c.p700, color: T.c.n0,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(74, 31, 36, 0.30), 0 2px 6px rgba(0,0,0,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 80ms ease, background 120ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Icon name="add" size={28} color={T.c.n0}/>
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────
function DiaryEmpty({ go }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      gap: 16,
    }}>
      <div
        aria-hidden="true"
        style={{
          width: 120, height: 120, borderRadius: 24,
          background: T.c.p50,
          border: `1.5px dashed ${T.c.p300 || '#C97D87'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Icon name="auto_stories" size={56} color={T.c.p700}/>
      </div>

      <h3 style={{
        margin: 0,
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 24, fontWeight: 600,
        letterSpacing: '-0.015em',
        color: T.c.n950,
        textWrap: 'balance',
        maxWidth: 300,
        lineHeight: 1.2,
      }}>Sua memória de vinhos começa aqui</h3>

      <p style={{
        margin: 0,
        fontSize: 14, lineHeight: 1.6,
        color: T.c.n700 || T.c.n800,
        maxWidth: 280,
        textWrap: 'pretty',
      }}>Cada vinho que você prova vira história. Pode ser aquele da última terça.</p>

      <button
        type="button"
        onClick={() => go('scanner', { from: 'diary_empty' })}
        style={{
          marginTop: 12,
          width: '100%', maxWidth: 280, height: 48,
          background: T.c.p700, color: T.c.n0,
          border: 'none', borderRadius: T.r.md,
          fontFamily: T.font, fontSize: 14, fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 120ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
      >
        <Icon name="add" size={18} color={T.c.n0}/>
        Registrar agora
      </button>

      <div style={{
        marginTop: 8,
        fontSize: 12, color: T.c.n600,
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="lightbulb" size={14} color={T.c.a700}/>
        Pode escanear o rótulo ou buscar pelo nome.
      </div>
    </div>
  );
}

// ─── Stat item ────────────────────────────────────────────────
function DiaryStatItem({ value, label }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 8px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 22, fontWeight: 700, lineHeight: 1.1,
        color: T.c.n950, letterSpacing: '-0.01em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
      }}>{value}</div>
      <div style={{
        fontSize: 11, fontWeight: 500, color: T.c.n600,
        marginTop: 2, letterSpacing: 0.2,
      }}>{label}</div>
    </div>
  );
}

// ─── Month group with sticky header ───────────────────────────
function MonthGroup({ label, count, entries, onTapEntry }) {
  return (
    <section>
      <h2 style={{
        position: 'sticky', top: 0, zIndex: 5,
        margin: 0,
        padding: '10px 20px',
        background: T.c.n0,
        borderBottom: `1px solid ${T.c.n100}`,
        fontFamily: T.font,
        fontSize: 11, fontWeight: 700,
        color: T.c.p700,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span style={{
          fontSize: 11, fontWeight: 500, color: T.c.n600,
          textTransform: 'none', letterSpacing: 0,
        }}>{count} {count === 1 ? 'vinho' : 'vinhos'}</span>
      </h2>
      <div>
        {entries.map((entry, i) => (
          <DiaryEntryRow
            key={`${entry.date}-${i}`}
            entry={entry}
            onTap={() => onTapEntry && onTapEntry(entry)}
            last={i === entries.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Diary entry row ──────────────────────────────────────────
function DiaryEntryRow({ entry, onTap, last }) {
  const [hover, setHover] = React.useState(false);
  const wine = entry.wine || {};
  const dayMonth = formatDayMonth(entry.date);

  return (
    <button
      type="button"
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: hover ? T.c.n50 : T.c.n0,
        border: 'none',
        borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
        padding: '14px 20px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        cursor: 'pointer',
        fontFamily: T.font,
        transition: 'background 120ms',
      }}
    >
      {/* Bottle */}
      <div style={{
        width: 64, height: 80, flexShrink: 0,
        borderRadius: T.r.md, overflow: 'hidden',
        background: `linear-gradient(160deg, ${T.c.p100} 0%, ${T.c.p500} 55%, ${T.c.p900} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 12px)',
            pointerEvents: 'none',
          }}
        />
        <Icon name="wine_bar" size={28} color="rgba(255,255,255,0.92)" fill={1}/>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: T.c.n950, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name || 'Vinho sem nome'}</div>
        <div style={{
          marginTop: 2,
          fontSize: 12, color: T.c.n600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.producer ? `${wine.producer}${wine.year ? ` · ${wine.year}` : ''}` : (wine.region || '—')}</div>

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <DiaryStars value={entry.rating || 0}/>
          <span style={{ fontSize: 12, color: T.c.n600, fontWeight: 500 }}>{dayMonth}</span>
        </div>

        {entry.occasion && (
          <div style={{
            marginTop: 6,
            fontSize: 12, fontStyle: 'italic',
            color: T.c.n500 || T.c.n600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <Icon name={iconForOccasion(entry.occasion)} size={12} color={T.c.n500 || T.c.n600}/>
            {entry.occasion}
          </div>
        )}

        {entry.note && !entry.occasion && (
          <div style={{
            marginTop: 6,
            fontSize: 12, color: T.c.n600,
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            fontStyle: 'italic',
          }}>"{entry.note}"</div>
        )}
      </div>
    </button>
  );
}

// ─── Inline mini stars (sm size for diary rows) ──────────────
function DiaryStars({ value = 0 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }} aria-label={`${value} de 5 estrelas`}>
      {[0, 1, 2, 3, 4].map(i => (
        <Icon
          key={i}
          name="star"
          size={14}
          color={i < value ? T.c.p700 : T.c.n300}
          fill={i < value ? 1 : 0}
          weight={i < value ? 600 : 500}
        />
      ))}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function groupByMonth(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const key = (e.date || '').slice(0, 7);   // 'YYYY-MM'
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(e);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, entries]) => ({
      key,
      label: formatMonthLabel(key),
      entries,
    }));
}

function formatMonthLabel(yyyyMm) {
  if (!yyyyMm) return 'Sem data';
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const [y, m] = yyyyMm.split('-').map((x) => parseInt(x, 10));
  if (!y || !m) return yyyyMm;
  return `${months[m - 1]} ${y}`;
}

function formatDayMonth(iso) {
  if (!iso) return '';
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function iconForOccasion(occ) {
  const o = (occ || '').toLowerCase();
  if (o.includes('confraria') || o.includes('grupo')) return 'groups';
  if (o.includes('jantar') || o.includes('casa'))     return 'dinner_dining';
  if (o.includes('bar') || o.includes('restau'))      return 'restaurant';
  if (o.includes('festa') || o.includes('aniver'))    return 'celebration';
  if (o.includes('sozinh') || o.includes('a sós'))    return 'self_improvement';
  return 'event';
}

// ─── Stats computation (similar to PerfilUsuario but local) ──
function computeDiaryStats(diary) {
  const wines = (diary || []).filter(d => d.wine).map(d => d.wine);
  const wineCount = wines.length;
  const countries = new Set(wines.map(w => w.country).filter(Boolean));
  const countryCount = countries.size;

  const grapeKeywords = ['Malbec','Cabernet','Merlot','Pinot','Tempranillo','Sangiovese','Touriga','Chardonnay','Sauvignon','Carmenere','Tannat','Syrah','Riesling'];
  const grapeCount = {};
  wines.forEach(w => {
    const hay = `${w.name || ''} ${w.producer || ''}`.toLowerCase();
    grapeKeywords.forEach(g => { if (hay.includes(g.toLowerCase())) grapeCount[g] = (grapeCount[g] || 0) + 1; });
  });
  const topGrape = Object.keys(grapeCount).sort((a, b) => grapeCount[b] - grapeCount[a])[0];

  return { wineCount, countryCount, topGrape };
}

Object.assign(window, { DiarioTimeline, computeDiaryStats });


export { DiarioTimeline, DiaryEmpty, DiaryEntryRow, DiaryStars, DiaryStatItem, MonthGroup, computeDiaryStats, formatDayMonth, formatMonthLabel, groupByMonth, iconForOccasion };
