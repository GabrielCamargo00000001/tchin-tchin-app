/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { EventCard, PostAction, PostCard, WineCard } from './cards.jsx';
import { Button, Card, Chip, MatchBadge } from './components.jsx';
import { DENUNCIA_TAXONOMIA, MOCK_CONFRARIAS, MOCK_EVENTS, MOCK_POSTS, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { EmptyState } from './f19_03_SecaoAprenda.jsx';
import { CardConfraria } from './screens-card-confraria.jsx';
import { ModalSheet } from './screens-descobrir.jsx';
import { PaladarRadar } from './screens-quiz.jsx';
import { TourDiario } from './screens-tour-diario.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — Adega, Comunidade, Confrarias screens

// ─── Adega Dashboard ──────────────────────────────────────
function AdegaScreen({ go, ctx }) {
  const [tab, setTab] = React.useState('diario');
  // Old diary tour (SVG mask) — superseded by the new TchinTutor system.
  const [diarioTourStep, setDiarioTourStep] = React.useState(null);
  const subtitleByTab = {
    diario: `${ctx.diary.length} ${ctx.diary.length === 1 ? 'vinho registrado' : 'vinhos registrados'} · desde ${ctx.user.joined}`,
    indicadores: 'Padrões do seu paladar ao longo do tempo',
    paladar: 'Seu perfil sensorial em 5 dimensões',
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, position: 'relative' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.h1, color: T.c.n950 }}>Minha Adega</div>
          <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 16 }}>
            {subtitleByTab[tab]}
          </div>
        </div>
        {/* Adicionar vinho — atalho sempre visível no topo da Adega (qualquer aba) */}
        <div style={{ marginTop: 4 }} data-tour-anchor="diario-add-button">
          <Button variant="primary" size="sm" leading={<Icon name="add" size={16}/>} onClick={() => go('register-consumo')}>
            Adicionar
          </Button>
        </div>
        <button onClick={() => go('favoritos')} style={{
          width: 40, height: 40, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.full,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          position: 'relative', marginTop: 4,
        }} aria-label="Favoritos">
          <Icon name="favorite" size={20} color={T.c.p700} fill={ctx.favorites.length > 0 ? 1 : 0}/>
          {ctx.favorites.length > 0 && (
            <div style={{
              position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px',
              background: T.c.p700, color: T.c.n0, borderRadius: T.r.full,
              fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${T.c.n0}`,
              boxSizing: 'content-box',
            }}>{ctx.favorites.length}</div>
          )}
        </button>
      </div>
      <div style={{ display: 'flex', padding: '0 16px', borderBottom: `1px solid ${T.c.n200}`, gap: 4 }}>
        {[
          { id: 'diario', label: 'Diário' },
          { id: 'indicadores', label: 'Indicadores' },
          { id: 'paladar', label: 'Paladar' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '12px 12px', background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? T.c.p700 : 'transparent'}`,
            color: tab === t.id ? T.c.p700 : T.c.n600, fontWeight: 600, fontSize: 14,
            cursor: 'pointer', fontFamily: T.font, marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'diario' && <DiarioTab ctx={ctx} go={go}/>}
        {tab === 'indicadores' && <IndicadoresTab ctx={ctx} go={go}/>}
        {tab === 'paladar' && <PaladarTab ctx={ctx} go={go}/>}
      </div>

      {/* Adicionar vinho fica no botão do topo + no FAB global da Adega (app shell),
          disponível em todas as abas. O FAB interno (só no Diário) foi removido
          para evitar dois FABs sobrepostos. */}

      {/* 05.Diário Tour overlay — first-visit pattern */}
      {diarioTourStep != null && typeof TourDiario === 'function' && (
        <TourDiario
          currentStep={diarioTourStep}
          onStepComplete={(s) => setDiarioTourStep(s + 1)}
          onSkip={() => setDiarioTourStep(null)}
          onTourComplete={() => setDiarioTourStep(null)}
          onAddFirstWine={() => { setDiarioTourStep(null); go('register-consumo'); }}
        />
      )}
    </div>
  );
}

function DiarioTab({ ctx, go }) {
  const [query, setQuery] = React.useState('');
  if (ctx.diary.length === 0) {
    return (
      <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <DiarioEmptyIllustration/>
        <div style={{ ...T.t.h2, color: T.c.n950, marginTop: 24, marginBottom: 8 }}>Comece sua história<br/>com vinho</div>
        <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 28, maxWidth: 280 }}>Registre o primeiro vinho que você bebeu, com nota e contexto.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => go('register-consumo')}>Registrar primeiro vinho</Button>
          <Button variant="ghost" size="lg" fullWidth onClick={() => go('descobrir')}>Explorar Marketplace</Button>
        </div>
      </div>
    );
  }
  // Group by smart date labels
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const monthsShort = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const filtered = ctx.diary.filter(e => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (e.wine.name + ' ' + e.wine.producer + ' ' + (e.note || '')).toLowerCase().includes(q);
  });
  const grouped = [];
  filtered.forEach(d => {
    const date = new Date(d.date);
    const dayMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const daysDiff = Math.floor((today - dayMs) / 86400000);
    let key;
    if (daysDiff === 0) key = 'Hoje';
    else if (daysDiff === 1) key = 'Ontem';
    else if (daysDiff <= 14) key = `${date.getDate()} de ${monthsShort[date.getMonth()]}`;
    else key = months[date.getMonth()];
    let group = grouped.find(g => g.key === key);
    if (!group) { group = { key, entries: [] }; grouped.push(group); }
    group.entries.push(d);
  });
  return (
    <div style={{ padding: '12px 16px 96px' }}>
      {/* Stats summary card — anchored as data-tour-anchor="diario-stats" */}
      <DiarioStatsCard diary={ctx.diary}/>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, marginBottom: 16,
      }}>
        <Icon name="search" size={18} color={T.c.n400}/>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar no diário" style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 14, color: T.c.n950,
        }}/>
        {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="close" size={18} color={T.c.n600}/></button>}
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <Icon name="search_off" size={32} color={T.c.n400}/>
          <div style={{ ...T.t.body, color: T.c.n600, marginTop: 12 }}>Nenhum registro para "{query}"</div>
        </div>
      ) : (
        <div data-tour-anchor="diario-timeline">
          {grouped.map(g => (
          <div key={g.key} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 0, ...T.t.overline, color: T.c.n600, whiteSpace: 'nowrap' }}>── {g.key} ──</div>
              <div style={{ flex: 1, height: 1, background: 'transparent' }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.entries.map((e, i) => <DiaryEntry key={i} entry={e}/>)}
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

// ─── DiarioStatsCard ─ small stats strip + tour anchor ──────
function DiarioStatsCard({ diary }) {
  if (!diary || diary.length === 0) return null;
  const total = diary.length;
  const rated = diary.filter(e => typeof e.rating === 'number' && e.rating > 0);
  const avg = rated.length
    ? (rated.reduce((s, e) => s + e.rating, 0) / rated.length).toFixed(1).replace('.', ',')
    : '—';
  // Most-frequent country
  const countryCounts = {};
  diary.forEach(e => {
    const c = e.wine && e.wine.country;
    if (c) countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  let topCountry = '—';
  let topCount = 0;
  Object.entries(countryCounts).forEach(([c, n]) => { if (n > topCount) { topCountry = c; topCount = n; } });
  return (
    <div
      data-tour-anchor="diario-stats"
      style={{
        display: 'flex', gap: 8, marginBottom: 16,
        padding: 12,
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.md,
      }}>
      <StatChip label="Registros" value={String(total)}/>
      <StatChip label="Média"     value={avg}/>
      <StatChip label="Mais bebido" value={topCountry}/>
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      display: 'flex', flexDirection: 'column', gap: 2,
      padding: '4px 0',
    }}>
      <span style={{
        fontFamily: '"Geist", "Inter", system-ui, sans-serif',
        fontSize: 10, lineHeight: 1.3, fontWeight: 600,
        letterSpacing: '0.5px', textTransform: 'uppercase',
        color: T.c.n600,
      }}>{label}</span>
      <span style={{
        fontFamily: '"Geist", "Inter", system-ui, sans-serif',
        fontSize: 15, lineHeight: 1.2, fontWeight: 700, color: T.c.n950,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{value}</span>
    </div>
  );
}
function DiarioEmptyIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill={T.c.p50}/>
      {/* taça */}
      <path d="M40 32 Q40 56 50 64 L50 86 L42 86 L42 92 L70 92 L70 86 L62 86 L62 64 Q72 56 72 32 Z" fill={T.c.p100} stroke={T.c.p700} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M44 36 Q44 50 50 58 Q56 60 62 58 Q68 50 68 36 Z" fill={T.c.p700} opacity="0.85"/>
      {/* bookmark */}
      <path d="M82 26 L82 58 L92 50 L102 58 L102 26 Z" fill={T.c.a700} stroke={T.c.n950} strokeWidth="2" strokeLinejoin="round"/>
      <line x1="86" y1="34" x2="98" y2="34" stroke={T.c.n0} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="86" y1="40" x2="96" y2="40" stroke={T.c.n0} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
const RATING_LABEL = { 5: 'Excelente', 4: 'Muito bom', 3: 'Bom', 2: 'Regular', 1: 'Fraco' };
function DiaryEntry({ entry }) {
  return (
    <Card padding={12} style={{ display: 'flex', gap: 12, position: 'relative' }}>
      <BottlePlaceholder width={48} height={64} label=""/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 24 }}>{entry.wine.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={13} color={i <= entry.rating ? T.c.a700 : T.c.n300} fill={i <= entry.rating ? 1 : 0}/>)}
          </div>
          <span style={{ ...T.t.caption, color: T.c.n600 }}>{RATING_LABEL[entry.rating] || ''}</span>
          {entry._pending && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 6px', borderRadius: T.r.xs, background: T.c.w100,
              color: T.c.w700, ...T.t.label, marginLeft: 'auto',
            }}>
              <Icon name="cloud_off" size={12} color={T.c.w700}/>
              Pendente
            </span>
          )}
        </div>
        {entry.note && <div style={{ ...T.t.caption, color: T.c.n800, fontStyle: 'italic', lineHeight: '16px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>"{entry.note}"</div>}
        {entry.occasion && !entry.note && <div style={{ ...T.t.caption, color: T.c.n600 }}>{entry.occasion}</div>}
      </div>
      <button style={{
        position: 'absolute', top: 8, right: 8, width: 28, height: 28,
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: T.r.full,
      }}><Icon name="more_vert" size={18} color={T.c.n600}/></button>
    </Card>
  );
}

const TYPE_COLORS = {
  'Tinto': '#722F37',       // burgundy/700
  'Branco': '#D4A574',      // accent/500 (dourado claro)
  'Rosé': '#C97D87',        // primary/300
  'Espumante': '#B8894A',   // accent/700
  'Fortificado': '#4A1F24', // primary/900
};

function IndicadoresTab({ ctx, go }) {
  if (ctx.diary.length < 3) {
    const have = ctx.diary.length;
    const left = 3 - have;
    return (
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: T.r.full, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon name="insights" size={56} color={T.c.p700}/>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Quase lá</div>
        <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 20, maxWidth: 280 }}>
          {have === 0
            ? 'Registre 3 vinhos no Diário para ver seus indicadores.'
            : `Falta${left > 1 ? 'm' : ''} ${left} ${left > 1 ? 'vinhos' : 'vinho'} pra desbloquear seus indicadores.`}
        </div>
        {/* progress bar */}
        <div style={{ width: '100%', maxWidth: 260, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...T.t.caption, color: T.c.n600, marginBottom: 6 }}>
            <span>{have} de 3 registrados</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{Math.round((have/3)*100)}%</span>
          </div>
          <div style={{ height: 8, background: T.c.n200, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(have/3)*100}%`, background: T.c.p700, transition: 'width 400ms' }}/>
          </div>
        </div>
        <Button variant="primary" size="lg" fullWidth={false} onClick={() => go('register-consumo')}>Registrar vinho</Button>
      </div>
    );
  }
  const total = ctx.diary.length;
  const byType = {};
  const byUva = {};
  ctx.diary.forEach(e => {
    byType[e.wine.type] = (byType[e.wine.type] || 0) + 1;
    (e.wine.uvas || []).forEach(u => { byUva[u] = (byUva[u] || 0) + 1; });
  });
  const avgRating = ctx.diary.reduce((s, e) => s + e.rating, 0) / total;
  // Timeline: last 8 weeks count
  const now = new Date();
  const weeks = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(now); start.setDate(now.getDate() - i*7 - 6);
    const end = new Date(now); end.setDate(now.getDate() - i*7);
    const count = ctx.diary.filter(e => {
      const d = new Date(e.date);
      return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate())
          && d <= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59);
    }).length;
    weeks.push({ label: `${end.getDate()}/${end.getMonth()+1}`, count });
  }
  const maxWeek = Math.max(1, ...weeks.map(w => w.count));
  const typeEntries = Object.entries(byType).sort((a,b) => b[1]-a[1]);
  const uvaEntries = Object.entries(byUva).sort((a,b) => b[1]-a[1]).slice(0, 10);
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <StatCard label="Registrados" value={total} icon="auto_stories"/>
        <StatCard label="Nota média" value={avgRating.toFixed(1)} icon="star"/>
      </div>

      {/* Donut por tipo */}
      <Card padding={16}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 16 }}>Por tipo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <TypeDonut entries={typeEntries} total={total} size={120}/>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {typeEntries.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: TYPE_COLORS[k] || T.c.n400 }}/>
                <div style={{ flex: 1, ...T.t.body, color: T.c.n800 }}>{k}</div>
                <div style={{ ...T.t.caption, color: T.c.n600, fontFamily: 'JetBrains Mono, monospace' }}>{v} · {Math.round(v/total*100)}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card padding={16}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Ao longo do tempo</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 16 }}>Últimas 8 semanas</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ ...T.t.caption, color: T.c.n950, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, height: 12 }}>{w.count > 0 ? w.count : ''}</div>
              <div style={{
                width: '100%', height: `${(w.count / maxWeek) * 70 + (w.count > 0 ? 4 : 2)}px`,
                background: w.count > 0 ? T.c.p700 : T.c.n200, borderRadius: 4,
                transition: 'height 400ms',
              }}/>
              <div style={{ ...T.t.caption, color: T.c.n600, fontSize: 10 }}>{w.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Por uva */}
      <Card padding={16}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Por uva</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 12 }}>Top {uvaEntries.length} das suas escolhas</div>
        {uvaEntries.length === 0 ? (
          <div style={{ ...T.t.body, color: T.c.n600, fontStyle: 'italic' }}>Sem uvas registradas ainda.</div>
        ) : uvaEntries.map(([k, v]) => (
          <BarRow key={k} label={k} value={v} max={total} color={T.c.a700}/>
        ))}
      </Card>
    </div>
  );
}

// Donut SVG: animated slice by type
function TypeDonut({ entries, total, size = 120 }) {
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.c.n100} strokeWidth={stroke}/>
      {entries.map(([k, v], i) => {
        const pct = v / total;
        const dash = pct * c;
        const slice = (
          <circle key={k} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={TYPE_COLORS[k] || T.c.n400} strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: 'stroke-dasharray 500ms' }}/>
        );
        offset += dash;
        return slice;
      })}
      <text x={size/2} y={size/2 - 4} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, fill: T.c.n950 }}>{total}</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 11, fill: T.c.n600 }}>vinhos</text>
    </svg>
  );
}
function StatCard({ label, value, icon }) {
  return (
    <Card padding={14}>
      <Icon name={icon} size={20} color={T.c.p700}/>
      <div style={{ fontSize: 28, fontWeight: 700, color: T.c.n950, fontFamily: T.font, marginTop: 4, lineHeight: 1 }}>{value}</div>
      <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{label}</div>
    </Card>
  );
}
function BarRow({ label, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ ...T.t.body, color: T.c.n800 }}>{label}</span>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>{value} · {Math.round(pct)}%</span>
      </div>
      <div style={{ height: 8, background: T.c.n100, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 400ms' }}/>
      </div>
    </div>
  );
}

function PaladarTab({ ctx, go }) {
  const paladar = ctx.user.paladar;
  const totalDiary = ctx.diary.length;
  const nextMilestone = Math.ceil(totalDiary / 5) * 5 || 5;
  const left = nextMilestone - totalDiary;
  // Dimensions list with values
  const dims = [
    { key: 'acidez',   label: 'Acidez',   color: '#722F37' },
    { key: 'tanino',   label: 'Tanino',   color: '#B8894A' },
    { key: 'corpo',    label: 'Corpo',    color: '#4A1F24' },
    { key: 'docura',   label: 'Doçura',   color: '#D4A574' },
    { key: 'aroma',    label: 'Aromas',   color: '#A04A55' },
  ];
  // Top trait (highest value)
  const sorted = [...dims].sort((a, b) => (paladar[b.key] || 0) - (paladar[a.key] || 0));
  const top = sorted[0];
  return (
    <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero card with radar */}
      <Card padding={20} style={{ textAlign: 'center' }}>
        <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 4 }}>SEU PERFIL</div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 4 }}>Paladar elegante</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 16 }}>Calibrado em {ctx.user.joined}</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <PaladarRadar paladar={paladar} size={240}/>
        </div>
        {/* Values grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: 8, paddingTop: 16, borderTop: `1px solid ${T.c.n200}` }}>
          {dims.map(d => (
            <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
              <div style={{ flex: 1, ...T.t.caption, color: T.c.n800, textAlign: 'left' }}>{d.label}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color: T.c.n950 }}>{paladar[d.key]}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Característica */}
      <Card padding={16} style={{ background: T.c.p50, border: `1px solid ${T.c.p100}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Icon name="lightbulb" size={18} color={T.c.p700}/>
          <span style={{ ...T.t.overline, color: T.c.p700 }}>CARACTERÍSTICA</span>
        </div>
        <div style={{ ...T.t.body, color: T.c.n950, lineHeight: 1.5 }}>
          Você prefere {top.label.toLowerCase()} acima da média. Bons primeiros passos: vinhos com estrutura média, taninos polidos e final mineral.
        </div>
      </Card>

      {/* Evolução contextual */}
      <Card padding={16}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: T.r.full, background: T.c.a100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="trending_up" size={22} color={T.c.a700}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 4 }}>Quando seu paladar evolui</div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 10, lineHeight: 1.5 }}>
              {totalDiary === 0
                ? 'Registre 5 vinhos no Diário para atualizarmos seu perfil automaticamente.'
                : `Registre mais ${left} ${left === 1 ? 'vinho' : 'vinhos'} pra atualizarmos seu perfil. (${totalDiary}/${nextMilestone})`}
            </div>
            <div style={{ height: 6, background: T.c.n200, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(totalDiary % 5) / 5 * 100}%`, background: T.c.a700, transition: 'width 400ms' }}/>
            </div>
          </div>
        </div>
      </Card>

      {/* Histórico (placeholder v2) */}
      <Card padding={16} style={{ opacity: 0.7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Icon name="history" size={20} color={T.c.n600}/>
          <div style={{ ...T.t.bodyB, color: T.c.n800 }}>Histórico do seu paladar</div>
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, paddingLeft: 28 }}>
          Em breve você vai poder ver como seu perfil mudou ao longo do tempo.
        </div>
      </Card>

      {/* CTA */}
      <Button variant="secondary" size="lg" fullWidth onClick={() => go('quiz')} leading={<Icon name="restart_alt" size={18}/>}>
        Refazer quiz
      </Button>
    </div>
  );
}

function FavoritosScreen({ ctx, go }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px 8px 4px',
        background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`,
      }}>
        <button onClick={() => go('back')} style={{
          width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrow_back" size={24} color={T.c.n950}/></button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Favoritos</div>
        {ctx.favorites.length > 0 && (
          <div style={{
            ...T.t.caption, color: T.c.n600, fontFamily: 'JetBrains Mono, monospace',
            padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full, marginRight: 8,
          }}>{ctx.favorites.length}</div>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {ctx.favorites.length === 0 ? (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 120, height: 120, borderRadius: T.r.full, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Icon name="favorite_border" size={56} color={T.c.p700}/>
            </div>
            <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Nada salvo por aqui</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 28, maxWidth: 280 }}>Toque ♡ em qualquer vinho que você quiser guardar pra olhar depois.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
              <Button variant="primary" size="lg" fullWidth onClick={() => go('marketplace')}>Explorar Marketplace</Button>
              <Button variant="ghost" size="lg" fullWidth onClick={() => go('scanner')}>Escanear um rótulo</Button>
            </div>
          </div>
        ) : (
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {ctx.favorites.map(w => <WineCard key={w.id} wine={w} onClick={() => go('wine', { wine: w })}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoritosTab({ ctx, go }) {
  if (ctx.favorites.length === 0) {
    return <EmptyState icon="favorite_border" title="Sem favoritos ainda"
      description="Toque no ♡ em qualquer vinho pra guardar aqui."
      primary={{ label: 'Explorar Marketplace', onClick: () => go('marketplace') }}/>;
  }
  return (
    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {ctx.favorites.map(w => <WineCard key={w.id} wine={w} onClick={() => go('wine', { wine: w })}/>)}
    </div>
  );
}

// ─── Comunidade Feed ────────────────────────────────────────
function ComunidadeScreen({ go, ctx }) {
  const [posts, setPosts] = React.useState(MOCK_POSTS);
  const toggleLike = id => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));

  // Interleave a confrarias suggestion block after every 3 posts, and a referral banner every 5
  const feedItems = [];
  posts.forEach((p, i) => {
    feedItems.push({ kind: 'post', data: p });
    if ((i + 1) % 3 === 0 && i < posts.length - 1) {
      feedItems.push({ kind: 'suggestion' });
    }
    if (i === 1) feedItems.push({ kind: 'referral' });
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.c.n50 }}>
      {/* Editorial top: Uva da Semana */}
      <div style={{ padding: '14px 16px 0' }}>
        <Card padding={0} style={{ overflow: 'hidden', background: T.c.n0, border: `1px solid ${T.c.p100}` }}>
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ width: 64, background: `linear-gradient(160deg, ${T.c.p100}, ${T.c.p50})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🍇</div>
            <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.c.p700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Uva da semana</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n950, marginBottom: 2 }}>Malbec</div>
              <div style={{ fontSize: 13, color: T.c.n600, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                Uva tinta de origem francesa, famosa na Argentina pela intensidade e taninos macios.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Feed divider */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.c.n600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sua rede</div>
        <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
      </div>

      {/* Feed */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {feedItems.map((item, i) => {
          if (item.kind === 'post') {
            return (
              <div key={`p-${item.data.id}`} onClick={() => go('post-detail', { post: item.data })} style={{ cursor: 'pointer' }}>
                <PostCard post={item.data}
                  onLike={(e) => { e?.stopPropagation?.(); toggleLike(item.data.id); }}
                  onComment={() => go('post-detail', { post: item.data })}
                  onShare={() => {}}/>
              </div>
            );
          }
          if (item.kind === 'referral') {
            return (
              <button key={`r-${i}`} onClick={() => go('indicacao-landing')} style={{
                width: '100%', display: 'flex', gap: 14, padding: 16,
                background: `linear-gradient(135deg, ${T.c.p900} 0%, ${T.c.p700} 60%, ${T.c.a700} 100%)`,
                color: T.c.n0, border: 'none', cursor: 'pointer',
                borderRadius: T.r.lg, textAlign: 'left', position: 'relative', overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(74,31,36,0.3)',
              }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
                <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="celebration" size={28} color={T.c.a500}/>
                </div>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.c.a500, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>INDICAÇÃO</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n0, lineHeight: 1.3, marginBottom: 4, fontFamily: '"Fraunces", Georgia, serif' }}>Convida um amigo, vocês dois ganham R$ 30</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>Cada amigo que entra rende crédito pros dois no marketplace.</div>
                </div>
                <Icon name="chevron_right" size={20} color="rgba(255,255,255,0.85)" style={{ position: 'relative', alignSelf: 'center' }}/>
              </button>
            );
          }
          // Suggestion block — horizontal carousel of confrarias
          return (
            <div key={`s-${i}`} style={{ background: T.c.p50, borderRadius: T.r.lg, padding: '14px 0 14px 14px', border: `1px solid ${T.c.p100}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 14, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.c.p700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sugestão pra você</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950, marginTop: 2 }}>Confrarias que você pode gostar</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, paddingRight: 14 }}>
                {MOCK_CONFRARIAS.slice(0, 3).map(c => (
                  <div key={c.id} style={{ width: 220, flexShrink: 0, background: T.c.n0, borderRadius: T.r.md, padding: 12, border: `1px solid ${T.c.n200}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.p700, color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                        {c.name.slice(0, 1)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: T.c.n600 }}>{c.members} membros</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: T.c.n600, lineHeight: 1.4, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</div>
                    <Button variant="secondary" size="sm" fullWidth>Ver confraria</Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 96 }}/>
    </div>
  );
}

// ─── Confrarias ─────────────────────────────────────────────
function ConfrariasScreen({ go }) {
  const [tab, setTab] = React.useState('descobrir');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ activity: [], modality: [], style: [] });
  const [sortBy, setSortBy] = React.useState('ativa'); // 'ativa' | 'membros' | 'recente'

  const filterCount = filters.activity.length + filters.modality.length + filters.style.length;
  const toggle = (group, val) => setFilters(f => ({ ...f, [group]: f[group].includes(val) ? f[group].filter(v => v !== val) : [...f[group], val] }));
  const clearAll = () => setFilters({ activity: [], modality: [], style: [] });

  let recomendadas = MOCK_CONFRARIAS;
  if (filters.activity.length) recomendadas = recomendadas.filter(c => filters.activity.includes(c.activity));
  if (filters.modality.length) recomendadas = recomendadas.filter(c => filters.modality.includes(c.modality === 'hibrida' ? 'online' : c.modality));
  if (filters.style.length)    recomendadas = recomendadas.filter(c => (c.tags || []).some(t => filters.style.includes(t)));
  // Sort
  const actRank = { 'muito-ativa': 4, 'ativa': 3, 'pouco-ativa': 2, 'inativa': 1 };
  if (sortBy === 'ativa')    recomendadas = [...recomendadas].sort((a, b) => actRank[b.activity] - actRank[a.activity]);
  if (sortBy === 'membros')  recomendadas = [...recomendadas].sort((a, b) => b.members - a.members);
  if (sortBy === 'recente')  recomendadas = [...recomendadas].sort((a, b) => b.id - a.id);

  const suas = MOCK_CONFRARIAS.slice(0, 2);
  const sortLabel = { ativa: 'Mais ativa', membros: 'Mais membros', recente: 'Mais recente' }[sortBy];
  const styleOptions = ['Degustação Técnica', 'Vinhos da Região', 'Harmonização', 'Pequenos Produtores'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50 }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ ...T.t.h1, color: T.c.n950 }}>Confrarias</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 16 }}>Grupos de pessoas que abrem garrafas juntas.</div>
      </div>

      {/* Row 2 botões */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
        <Button variant="secondary" size="md" fullWidth leading={<Icon name="add" size={18}/>} onClick={() => go('wizard-confraria-1')}>
          Criar confraria
        </Button>
        <Button variant="secondary" size="md" fullWidth leading={<Icon name="tune" size={18}/>} onClick={() => setFilterOpen(true)}>
          Filtrar{filterCount > 0 ? ` · ${filterCount}` : ''}
        </Button>
      </div>

      {/* Tabs primary */}
      <div style={{ display: 'flex', padding: '0 16px', borderBottom: `1px solid ${T.c.n200}`, gap: 4 }}>
        {[
          { id: 'descobrir', label: `Recomendações (${recomendadas.length})` },
          { id: 'suas', label: `Suas (${suas.length})` },
          { id: 'eventos', label: 'Eventos' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '12px 14px', background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? T.c.p700 : 'transparent'}`,
            color: tab === t.id ? T.c.p700 : T.c.n600, fontWeight: 600, fontSize: 14,
            cursor: 'pointer', fontFamily: T.font, marginBottom: -1, whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 80px' }}>
        {tab === 'descobrir' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Sort row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{recomendadas.length} {recomendadas.length === 1 ? 'resultado' : 'resultados'}</div>
              <button onClick={() => {
                const next = { ativa: 'membros', membros: 'recente', recente: 'ativa' }[sortBy];
                setSortBy(next);
              }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, color: T.c.n800, fontSize: 13, fontWeight: 600 }}>
                <Icon name="swap_vert" size={16}/>
                <span>Ordenar: {sortLabel}</span>
              </button>
            </div>
            {recomendadas.length > 0 ? (
              recomendadas.map(c => <CardConfraria key={c.id} brotherhood={c} onTap={() => go('confraria-detalhe', { confraria: c })}/>)
            ) : (
              <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="groups" size={32} color={T.c.p700}/>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n950 }}>Nenhuma confraria com esses filtros</div>
                <div style={{ fontSize: 13, color: T.c.n600, maxWidth: 260 }}>Tente limpar os filtros ou criar uma confraria com o seu jeito.</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <Button variant="secondary" size="md" onClick={clearAll}>Limpar filtros</Button>
                  <Button variant="primary" size="md" onClick={() => go('wizard-confraria-1')}>Criar confraria</Button>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'suas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {suas.length > 0 ? suas.map(c => <CardConfraria key={c.id} brotherhood={c} onTap={() => go('confraria-detalhe', { confraria: c })}/>) : (
              <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="groups" size={32} color={T.c.p700}/>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n950 }}>Você ainda não está em nenhuma confraria</div>
                <div style={{ fontSize: 13, color: T.c.n600, maxWidth: 260 }}>Explore recomendações pra entrar em uma — ou crie a sua.</div>
                <Button variant="primary" size="md" onClick={() => setTab('descobrir')}>Ver recomendações</Button>
              </div>
            )}
          </div>
        )}
        {tab === 'eventos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_EVENTS.map(e => <EventCard key={e.id} event={e} onClick={() => go('event-detalhe', { event: e })}/>)}
          </div>
        )}
      </div>

      {filterOpen && (
        <ModalSheet onClose={() => setFilterOpen(false)}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
            <div>
              <div style={{ ...T.t.h2, color: T.c.n950 }}>Filtros{filterCount > 0 ? <span style={{ color: T.c.p700, fontWeight: 600 }}> ({filterCount} {filterCount === 1 ? 'ativo' : 'ativos'})</span> : ''}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Refine sua descoberta</div>
            </div>
            <button onClick={() => setFilterOpen(false)} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.c.n100, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Icon name="close" size={18} color={T.c.n800}/>
            </button>
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto', margin: '14px -4px 18px', padding: '0 4px' }}>
            {/* Atividade */}
            <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 10, fontWeight: 600 }}>Atividade</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {[
                { id: 'muito-ativa', label: '🔥 Muito ativa' },
                { id: 'ativa',       label: '⚡ Ativa' },
                { id: 'pouco-ativa', label: '💤 Pouco ativa' },
              ].map(o => (
                <Chip key={o.id} selected={filters.activity.includes(o.id)} onClick={() => toggle('activity', o.id)}>{o.label}</Chip>
              ))}
            </div>

            {/* Modalidade */}
            <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 10, fontWeight: 600 }}>Modalidade</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              <Chip selected={filters.modality.includes('presencial')} onClick={() => toggle('modality', 'presencial')}>📍 Presencial</Chip>
              <Chip selected={filters.modality.includes('online')} onClick={() => toggle('modality', 'online')}>🌐 Online / Híbrida</Chip>
            </div>

            {/* Estilo — agora pills horizontais */}
            <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 10, fontWeight: 600 }}>Estilo</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              {styleOptions.map(s => (
                <Chip key={s} selected={filters.style.includes(s)} onClick={() => toggle('style', s)}>{s}</Chip>
              ))}
            </div>
          </div>

          {/* Footer — Limpar sempre visível + Aplicar */}
          <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${T.c.n200}`, marginTop: 4, paddingTop: 14 }}>
            <Button variant="ghost" size="lg" fullWidth disabled={filterCount === 0} onClick={clearAll}>Limpar filtros</Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => setFilterOpen(false)}>Ver {recomendadas.length} resultados</Button>
          </div>
        </ModalSheet>
      )}
    </div>
  );
}

// ─── Modal Denúncia (refatorado com taxonomia) ──────────────
function DenunciaModal({ onClose, onSubmit, post }) {
  const [selected, setSelected] = React.useState(null);
  const [outro, setOutro] = React.useState('');
  const target = post || MOCK_POSTS[0];
  const outroValid = selected !== 'outro' || outro.trim().length >= 20;
  const canSubmit = selected && outroValid;
  return (
    <ModalSheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ ...T.t.h2, color: T.c.n950 }}>Denunciar publicação</div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.c.n100, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <Icon name="close" size={18} color={T.c.n800}/>
        </button>
      </div>

      {/* Thumb da publicação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: T.c.n100, borderRadius: T.r.md, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 8, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Avatar name={target.author} size={40} level={target.level}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.c.n950 }}>{target.author}</div>
          <div style={{ fontSize: 12, color: T.c.n600 }}>há {target.time}</div>
        </div>
      </div>

      <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 12, fontWeight: 600 }}>
        Por que você está denunciando?
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
        {DENUNCIA_TAXONOMIA.map(t => {
          const sel = selected === t.id;
          return (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 4px', background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left', fontFamily: T.font, width: '100%',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${sel ? T.c.p700 : T.c.n300}`,
                background: T.c.n0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 160ms',
              }}>
                {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.c.p700 }}/>}
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: T.c.n950 }}>{t.label}</div>
            </button>
          );
        })}
      </div>

      {selected === 'outro' && (
        <div style={{ marginBottom: 14 }}>
          <textarea value={outro} onChange={e => setOutro(e.target.value)} placeholder="Descreva o problema (mínimo 20 caracteres)"
            style={{ width: '100%', minHeight: 88, padding: 12, borderRadius: T.r.md, border: `1.5px solid ${outroValid ? T.c.n300 : T.c.e700}`, fontFamily: T.font, fontSize: 14, color: T.c.n950, boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: outroValid ? T.c.n600 : T.c.e700 }}>
            <span>{outroValid ? ' ' : `Faltam ${20 - outro.trim().length} caracteres`}</span>
            <span style={{ fontFamily: T.mono }}>{outro.trim().length}/20</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="destructive" size="lg" fullWidth disabled={!canSubmit} onClick={() => onSubmit(selected, selected === 'outro' ? outro.trim() : null)}>
          Enviar denúncia
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={onClose}>Cancelar</Button>
      </div>
    </ModalSheet>
  );
}

// ─── Modal Bloqueio (confirmação destrutiva) ───────────────
function BloqueioModal({ onClose, onConfirm, user }) {
  const target = user || { name: 'Matheus Garzon', level: 'intermediario' };
  const levelLabel = target.level === 'expert' ? 'Enófilo' : target.level === 'intermediario' ? 'Intermediário' : 'Iniciante';
  return (
    <ModalSheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ ...T.t.h2, color: T.c.n950 }}>Bloquear usuário</div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.c.n100, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <Icon name="close" size={18} color={T.c.n800}/>
        </button>
      </div>

      {/* Identidade do usuário */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: T.c.n100, borderRadius: T.r.md, marginBottom: 16 }}>
        <Avatar name={target.name} size={48} level={target.level}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.c.n950 }}>{target.name}</div>
          <div style={{ fontSize: 12, color: T.c.n600 }}>{levelLabel}</div>
        </div>
      </div>

      {/* Consequências */}
      <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 12, fontWeight: 600 }}>
        O que acontece quando você bloqueia?
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          'Esta pessoa não verá suas publicações nem seu perfil.',
          'Vocês deixam de se seguir automaticamente.',
          'Comentários e mensagens entre vocês ficam ocultos.',
        ].map((txt, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: T.c.n800, lineHeight: 1.45 }}>
            <Icon name="check" size={18} color={T.c.p700}/>
            <span style={{ flex: 1 }}>{txt}</span>
          </li>
        ))}
      </ul>

      {/* Card warning */}
      <div style={{ display: 'flex', gap: 10, padding: 12, background: T.c.w100, borderRadius: T.r.md, marginBottom: 18, border: `1px solid ${T.c.w700}30` }}>
        <Icon name="warning" size={20} color={T.c.w700}/>
        <div style={{ flex: 1, fontSize: 13, color: T.c.n950, lineHeight: 1.45 }}>
          <strong style={{ fontWeight: 700 }}>Atenção:</strong> você será removido das confrarias que este usuário é dono.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="destructive" size="lg" fullWidth onClick={onConfirm}>Sim, desejo bloquear</Button>
        <Button variant="ghost" size="lg" fullWidth onClick={onClose}>Quero manter como está</Button>
      </div>
    </ModalSheet>
  );
}

// ─── Post Detail (tela própria, comentários inline) ────────
function PostDetailScreen({ go, params }) {
  const post = params?.post || MOCK_POSTS[0];
  const [liked, setLiked] = React.useState(post.liked);
  const [likes, setLikes] = React.useState(post.likes);
  const [comments, setComments] = React.useState(post.commentsList || []);
  const [draft, setDraft] = React.useState('');
  const inputRef = React.useRef(null);
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setComments(cs => [...cs, { id: Date.now(), author: 'Você', level: 'intermediario', time: 'agora', text: t }]);
    setDraft('');
  };
  const levelLabel = l => l === 'expert' ? 'Enófilo' : l === 'intermediario' ? 'Intermediário' : 'Iniciante';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Header (back only, no actions) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 4px', minHeight: 56, borderBottom: `1px solid ${T.c.n200}`, background: T.c.n0, flexShrink: 0 }}>
        <button onClick={() => go('back')} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950 }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: T.c.n950 }}>Publicação</div>
      </div>

      {/* Scrolling content */}
      <div style={{ flex: 1, overflow: 'auto', background: T.c.n50 }}>
        {/* Post — expanded, no line clamp */}
        <div style={{ background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 16 }}>
            <Avatar name={post.author} size={44} level={post.level}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{post.author}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{levelLabel(post.level)} · há {post.time}</div>
              {post.withUser && (
                <div style={{ ...T.t.caption, color: T.c.n800, marginTop: 2 }}>
                  Com <strong style={{ fontWeight: 600, color: T.c.p700 }}>{post.withUser}</strong>
                </div>
              )}
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <Icon name="more_vert" size={20} color={T.c.n600}/>
            </button>
          </div>
          {post.content && (
            <div style={{ padding: '0 16px 14px', fontSize: 16, lineHeight: 1.55, color: T.c.n800, whiteSpace: 'pre-wrap', textWrap: 'pretty' }}>
              {post.content.split(/(#[\wÀ-ú]+)/g).map((p, i) =>
                p.startsWith('#')
                  ? <span key={i} style={{ color: T.c.p700, fontWeight: 600 }}>{p}</span>
                  : <React.Fragment key={i}>{p}</React.Fragment>
              )}
            </div>
          )}
          {post.image && (
            <div style={{ aspectRatio: '4/3', background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BottlePlaceholder width={140} height={190}/>
            </div>
          )}
          {post.wineRef && (
            <div style={{ margin: '14px 16px', padding: 12, background: T.c.p50, borderRadius: T.r.md, display: 'flex', gap: 12, alignItems: 'center', border: `1px solid ${T.c.p100}` }}>
              <BottlePlaceholder width={40} height={56} label=""/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.c.p700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Vinho referenciado</div>
                <div style={{ ...T.t.bodyB, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.wineRef.name}</div>
                <div style={{ ...T.t.caption, color: T.c.n600 }}>{post.wineRef.producer}</div>
              </div>
              <MatchBadge score={post.wineRef.match} size="sm"/>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderTop: `1px solid ${T.c.n200}`, padding: '4px 0' }}>
            <PostAction icon="favorite" label={likes} active={liked} activeColor={T.c.e700}
              onClick={() => { setLiked(!liked); setLikes(n => liked ? n - 1 : n + 1); }}/>
            <PostAction icon="chat_bubble" label={comments.length} onClick={() => inputRef.current?.focus()}/>
            <PostAction icon="ios_share" label="" onClick={() => {}}/>
          </div>
        </div>

        {/* Comments section */}
        <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.c.n600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Comentários ({comments.length})
          </div>
          <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
        </div>

        {comments.length === 0 ? (
          <div style={{ padding: '32px 24px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chat_bubble_outline" size={26} color={T.c.n600}/>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.c.n950, marginTop: 4 }}>Seja o primeiro a comentar</div>
            <div style={{ fontSize: 13, color: T.c.n600, maxWidth: 260, lineHeight: 1.4 }}>Compartilhe sua opinião sobre essa publicação.</div>
          </div>
        ) : (
          <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Avatar name={c.author} size={36} level={c.level}/>
                <div style={{ flex: 1, background: T.c.n100, borderRadius: 14, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.c.n950 }}>{c.author}</span>
                    <span style={{ fontSize: 11, color: T.c.n600 }}>há {c.time}</span>
                  </div>
                  <div style={{ fontSize: 14, color: T.c.n800, lineHeight: 1.45 }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky bottom composer */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${T.c.n200}`, background: T.c.n0, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <Avatar name="Você" size={36}/>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: T.c.n100, borderRadius: 999, padding: '4px 4px 4px 14px' }}>
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Digite um comentário…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: T.font, fontSize: 14, color: T.c.n950, minWidth: 0 }}/>
          <button onClick={send} disabled={!draft.trim()} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: draft.trim() ? T.c.p700 : T.c.n300, color: T.c.n0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: draft.trim() ? 'pointer' : 'not-allowed', transition: 'background 160ms',
          }}>
            <Icon name="arrow_upward" size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Busca ──────────────────────────────────────────────────
const SEARCH_SUGGESTIONS = ['Malbec', 'Cabernet', 'Iniciante', 'Portugal', 'Brasília'];

function BuscaScreen({ go }) {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('todos');
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const query = q.trim().toLowerCase();
  const match = (s) => s.toLowerCase().includes(query);

  const allPosts    = query ? MOCK_POSTS.filter(p => match(p.content) || match(p.author)) : [];
  const allPeople   = query ? [
    { name: 'Carla Mendes', level: 'expert', bio: 'Enófila · Brasília' },
    { name: 'Bruno Tavares', level: 'iniciante', bio: 'Aprendendo vinho · Rio' },
    { name: 'Diego Reis', level: 'intermediario', bio: 'Sommelier amador' },
  ].filter(p => match(p.name) || match(p.bio)) : [];
  const allWines    = query ? MOCK_WINES.filter(w => match(w.name) || match(w.producer) || match(w.grape || '')) : [];
  const allConfs    = query ? MOCK_CONFRARIAS.filter(c => match(c.name) || match(c.description)) : [];

  const counts = { todos: allPosts.length + allPeople.length + allWines.length + allConfs.length,
    posts: allPosts.length, pessoas: allPeople.length, vinhos: allWines.length, confrarias: allConfs.length };

  const chips = [
    { id: 'todos', label: 'Todos' }, { id: 'posts', label: 'Posts' },
    { id: 'pessoas', label: 'Pessoas' }, { id: 'vinhos', label: 'Vinhos' }, { id: 'confrarias', label: 'Confrarias' },
  ];

  const showPosts = filter === 'todos' || filter === 'posts';
  const showPeople = filter === 'todos' || filter === 'pessoas';
  const showWines = filter === 'todos' || filter === 'vinhos';
  const showConfs = filter === 'todos' || filter === 'confrarias';

  const totalShown = (showPosts ? allPosts.length : 0) + (showPeople ? allPeople.length : 0)
    + (showWines ? allWines.length : 0) + (showConfs ? allConfs.length : 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50 }}>
      {/* Header with prominent search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', minHeight: 56, background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={() => go('back')} style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950, flexShrink: 0 }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: T.c.n100, borderRadius: 999, padding: '8px 12px', gap: 8 }}>
          <Icon name="search" size={20} color={T.c.n600}/>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Buscar pessoas, vinhos, confrarias…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: T.font, fontSize: 14, color: T.c.n950, minWidth: 0 }}/>
          {q && (
            <button onClick={() => setQ('')} style={{ width: 24, height: 24, borderRadius: '50%', background: T.c.n300, color: T.c.n0, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Icon name="close" size={14}/>
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        {chips.map(c => {
          const sel = filter === c.id;
          const n = counts[c.id];
          return (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{
              padding: '6px 14px', borderRadius: 999, flexShrink: 0,
              background: sel ? T.c.p700 : T.c.n0,
              color: sel ? T.c.n0 : T.c.n800,
              border: `1px solid ${sel ? T.c.p700 : T.c.n300}`,
              fontFamily: T.font, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {c.label}
              {query && <span style={{ fontFamily: T.mono, fontSize: 11, opacity: 0.8 }}>{n}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* No query — suggestions */}
        {!query && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.c.n600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Sugestões</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {SEARCH_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setQ(s)} style={{
                  padding: '8px 14px', borderRadius: 999, background: T.c.n0,
                  border: `1px solid ${T.c.n300}`, fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.c.n800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Icon name="trending_up" size={14} color={T.c.p700}/>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.c.n600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Recentes</div>
            <div style={{ fontSize: 13, color: T.c.n600 }}>Nenhuma busca recente</div>
          </div>
        )}

        {/* Has query, has results */}
        {query && totalShown > 0 && (
          <>
            <div style={{ fontSize: 12, color: T.c.n600, marginBottom: 12 }}>
              {totalShown} resultado{totalShown !== 1 ? 's' : ''} para “<strong style={{ color: T.c.n950 }}>{q}</strong>”
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {showPeople && allPeople.map((p, i) => (
                <div key={`pe-${i}`} style={{ background: T.c.n0, borderRadius: T.r.md, padding: 12, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${T.c.n200}` }}>
                  <Avatar name={p.name} size={44} level={p.level}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.c.n950 }}>{p.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: T.c.p700, padding: '2px 6px', background: T.c.p50, borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Pessoa</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.c.n600 }}>{p.bio}</div>
                  </div>
                  <Button variant="secondary" size="sm">Seguir</Button>
                </div>
              ))}
              {showWines && allWines.map(w => (
                <div key={`w-${w.id}`} onClick={() => go('wine', { wine: w })} style={{ background: T.c.n0, borderRadius: T.r.md, padding: 12, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${T.c.n200}`, cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 64, background: T.c.p50, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BottlePlaceholder width={32} height={48} label=""/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: T.c.p700, padding: '2px 6px', background: T.c.p50, borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Vinho</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: T.c.n600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.producer} · {w.country}</div>
                  </div>
                  {w.match != null && <MatchBadge score={w.match} size="sm"/>}
                </div>
              ))}
              {showConfs && allConfs.map(c => (
                <div key={`c-${c.id}`} style={{ background: T.c.n0, borderRadius: T.r.md, padding: 12, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${T.c.n200}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: T.c.p700, color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{c.name.slice(0, 1)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: T.c.p700, padding: '2px 6px', background: T.c.p50, borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Confraria</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: T.c.n600 }}>{c.members} membros</div>
                  </div>
                </div>
              ))}
              {showPosts && allPosts.map(p => (
                <div key={`po-${p.id}`} onClick={() => go('post-detail', { post: p })} style={{ background: T.c.n0, borderRadius: T.r.md, padding: 12, border: `1px solid ${T.c.n200}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Avatar name={p.author} size={28} level={p.level}/>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.c.n950 }}>{p.author}</span>
                    <span style={{ fontSize: 11, color: T.c.n600 }}>· há {p.time}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, color: T.c.p700, padding: '2px 6px', background: T.c.p50, borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Post</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.c.n800, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.content}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Has query, no results */}
        {query && totalShown === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="search_off" size={32} color={T.c.n600}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.c.n950, marginBottom: 6 }}>Nenhum resultado para “{q}”</div>
            <div style={{ fontSize: 14, color: T.c.n600, marginBottom: 20, lineHeight: 1.45 }}>Tente outra palavra ou explore todas as opções.</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="md" onClick={() => go('confrarias')}>Ver confrarias</Button>
              <Button variant="secondary" size="md" onClick={() => go('marketplace')}>Ver vinhos</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Perfil de outro usuário ────────────────────────────────
function PerfilOutroScreen({ go, params }) {
  const user = params?.user || { name: 'Matheus Garzon', level: 'intermediario', location: 'Brasília', followers: 4, following: 6 };
  const [loading, setLoading] = React.useState(true);
  const [following, setFollowing] = React.useState(false);
  const [blocked, setBlocked] = React.useState(false);
  const [blockOpen, setBlockOpen] = React.useState(false);
  const [tab, setTab] = React.useState('pubs');
  const [q, setQ] = React.useState('');
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const userPosts = MOCK_POSTS.slice(0, 6).map((p, i) => ({ ...p, id: `u-${i}`, author: user.name, level: user.level }));
  const filtered = q ? userPosts.filter(p => p.content.toLowerCase().includes(q.toLowerCase())) : userPosts;
  const levelLabel = user.level === 'expert' ? 'Enófilo' : user.level === 'intermediario' ? 'Intermediário' : 'Iniciante';

  const Header = ({ title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 4px', minHeight: 56, background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
      <button onClick={() => go('back')} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950 }}>
        <Icon name="arrow_back" size={24}/>
      </button>
      <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
    </div>
  );

  // Skeleton
  if (loading) {
    const Box = ({ w, h, r = 8, mb = 0 }) => <div style={{ width: w, height: h, borderRadius: r, background: T.c.n100, marginBottom: mb }}/>;
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
        <Header title={user.name}/>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Box w={96} h={96} r={999}/>
          <Box w={180} h={20} mb={4}/>
          <Box w={140} h={14}/>
          <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
            <Box w={60} h={32}/><Box w={60} h={32}/>
          </div>
          <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 12 }}>
            <Box w="100%" h={44} r={12}/><Box w="100%" h={44} r={12}/>
          </div>
        </div>
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Box w="100%" h={120} r={12}/><Box w="100%" h={120} r={12}/>
          <Box w="100%" h={120} r={12}/><Box w="100%" h={120} r={12}/>
        </div>
        <style>{`@keyframes tcSkel{0%,100%{opacity:1}50%{opacity:.55}} [style*="background: rgb(242, 242, 242)"]{animation:tcSkel 1.2s ease-in-out infinite}`}</style>
      </div>
    );
  }

  // Blocked
  if (blocked) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
        <Header title={user.name}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.c.e100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="block" size={32} color={T.c.e700}/>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.c.n950 }}>Você bloqueou este usuário</div>
          <div style={{ fontSize: 14, color: T.c.n600, maxWidth: 280, lineHeight: 1.45 }}>{user.name} não pode mais te seguir, ver suas publicações ou enviar comentários.</div>
          <Button variant="secondary" size="lg" onClick={() => setBlocked(false)}>Desbloquear</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      <Header title={user.name}/>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Profile head */}
        <div style={{ padding: '24px 20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar name={user.name} size={96} level={user.level}/>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.c.n950, marginTop: 14 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: T.c.n600, marginTop: 2 }}>{levelLabel} · {user.location}</div>

          <div style={{ display: 'flex', gap: 32, marginTop: 16 }}>
            <button onClick={() => go('perfil-seguidores', { user })} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', padding: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.c.n950 }}>{user.followers}</div>
              <div style={{ fontSize: 12, color: T.c.n600 }}>Seguidores</div>
            </button>
            <button onClick={() => go('perfil-seguindo', { user })} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', padding: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.c.n950 }}>{user.following}</div>
              <div style={{ fontSize: 12, color: T.c.n600 }}>Seguindo</div>
            </button>
            <button onClick={() => go('perfil-vinhos-provados', { user })} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', padding: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.c.n950 }}>47</div>
              <div style={{ fontSize: 12, color: T.c.n600 }}>Vinhos</div>
            </button>
          </div>

          {/* Quick links row */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => go('perfil-atividade-publica', { user })} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: T.r.full,
              background: T.c.n100, border: 'none', cursor: 'pointer',
              color: T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 600,
            }}>
              <Icon name="timeline" size={14} color={T.c.n800}/>Atividade
            </button>
            <button onClick={() => go('perfil-comparar-paladar', { user })} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: T.r.full,
              background: T.c.p50, border: 'none', cursor: 'pointer',
              color: T.c.p700, fontFamily: T.font, fontSize: 12, fontWeight: 700,
            }}>
              <Icon name="compare_arrows" size={14} color={T.c.p700}/>Comparar paladar
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 18 }}>
            <Button variant={following ? 'secondary' : 'primary'} size="md" fullWidth
              leading={following ? <Icon name="check" size={16}/> : null}
              onClick={() => setFollowing(f => !f)}>
              {following ? 'Seguindo' : 'Seguir'}
            </Button>
            <Button variant="secondary" size="md" fullWidth leading={<Icon name="chat" size={16}/>} onClick={() => go('chat-conversa', { chat: { id: 'd-' + (user.name || 'x'), name: user.name, type: 'dm', level: user.level } })}>
              Mensagem
            </Button>
            <Button variant="secondary" size="md" onClick={() => setBlockOpen(true)} style={{ minWidth: 44 }}>
              <Icon name="more_horiz" size={18}/>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '12px 16px 0', borderBottom: `1px solid ${T.c.n200}`, gap: 4 }}>
          {[{ id: 'pubs', label: `Publicações (${userPosts.length})` }, { id: 'aval', label: 'Avaliações' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 16px', background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t.id ? T.c.p700 : 'transparent'}`,
              color: tab === t.id ? T.c.p700 : T.c.n600, fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: T.font, marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'pubs' && (
          <div style={{ padding: '16px' }}>
            {userPosts.length > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', background: T.c.n100, borderRadius: 999, padding: '8px 14px', gap: 8, marginBottom: 14 }}>
                  <Icon name="search" size={18} color={T.c.n600}/>
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar uma publicação…"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: T.font, fontSize: 14, color: T.c.n950 }}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filtered.map(p => (
                    <div key={p.id} onClick={() => go('post-detail', { post: p })} style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, padding: 14, cursor: 'pointer' }}>
                      <div style={{ fontSize: 11, color: T.c.n600, marginBottom: 6 }}>há {p.time}</div>
                      <div style={{ fontSize: 14, color: T.c.n800, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.content}</div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12, color: T.c.n600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="favorite_border" size={14}/> {p.likes}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="chat_bubble_outline" size={14}/> {p.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 32, color: T.c.n600, fontSize: 14 }}>Esse usuário ainda não publicou.</div>
            )}
          </div>
        )}

        {tab === 'aval' && (
          <div style={{ textAlign: 'center', padding: 48, color: T.c.n600, fontSize: 14 }}>Esse usuário ainda não avaliou nenhum vinho.</div>
        )}
      </div>
      {blockOpen && (
        <BloqueioModal
          user={user}
          onClose={() => setBlockOpen(false)}
          onConfirm={() => { setBlockOpen(false); setBlocked(true); }}
        />
      )}
    </div>
  );
}

Object.assign(window, {
  AdegaScreen, DiarioTab, IndicadoresTab, PaladarTab, FavoritosTab, FavoritosScreen,
  ComunidadeScreen, ConfrariasScreen, DenunciaModal, BloqueioModal,
  DiaryEntry, StatCard, BarRow,
  PostDetailScreen, BuscaScreen, PerfilOutroScreen,
});


export { AdegaScreen, BarRow, BloqueioModal, BuscaScreen, ComunidadeScreen, ConfrariasScreen, DenunciaModal, DiarioEmptyIllustration, DiarioStatsCard, DiarioTab, DiaryEntry, FavoritosScreen, FavoritosTab, IndicadoresTab, PaladarTab, PerfilOutroScreen, PostDetailScreen, RATING_LABEL, SEARCH_SUGGESTIONS, StatCard, StatChip, TYPE_COLORS, TypeDonut };
