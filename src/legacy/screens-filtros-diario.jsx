/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { BottomSheet } from './f13_04_BottomSheet.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 17.02 · FiltrosDiario — bottom sheet pra filtrar o diário
//
//   <FiltrosDiario
//     isOpen
//     onClose={...}
//     diary={[...]}
//     initialFilters={...}
//     onApply={(filters, resultsCount) => ...}
//     contained                                 — phone mocks
//   />
//
//   filters shape:
//     {
//       rating:   'all' | '4plus' | '5',
//       grapes:   ['Malbec', 'Cabernet', ...],
//       countries:['Argentina', ...],
//       period:   'month' | '3months' | 'year' | 'all' | 'custom',
//       contexts: ['Confraria', 'Jantar em casa', ...],
//     }
// ─────────────────────────────────────────────────────────────

const DIARY_GRAPES = ['Malbec','Cabernet','Merlot','Pinot','Tempranillo','Sangiovese','Touriga','Chardonnay','Sauvignon','Carmenere','Tannat','Syrah'];
const DIARY_CONTEXTS = ['Casa', 'Restaurante', 'Confraria', 'Evento', 'Bar', 'Vinícola', 'Outro'];
const DIARY_PERIODS = [
  { id: 'month',     label: 'Último mês' },
  { id: '3months',   label: 'Últimos 3 meses' },
  { id: 'year',      label: 'Último ano' },
  { id: 'all',       label: 'Tudo' },
  { id: 'custom',    label: 'Período customizado' },
];

const DEFAULT_DIARY_FILTERS = {
  rating: 'all',
  grapes: [],
  countries: [],
  period: 'all',
  contexts: [],
  customRange: null,   // [startISO, endISO]
};

function FiltrosDiario({
  isOpen,
  onClose,
  diary = [],
  initialFilters,
  onApply,
  contained = false,
}) {
  const [filters, setFilters] = React.useState(initialFilters || DEFAULT_DIARY_FILTERS);
  const [debouncedFilters, setDebouncedFilters] = React.useState(filters);

  // Reset when reopened
  React.useEffect(() => {
    if (isOpen) setFilters(initialFilters || DEFAULT_DIARY_FILTERS);
  }, [isOpen]); // eslint-disable-line

  // Debounce filter changes for the result count (300ms per spec)
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(id);
  }, [filters]);

  // Compute available facets from this user's diary
  const facets = React.useMemo(() => computeFacets(diary), [diary]);
  // Recompute result count when debounced filters change
  const resultsCount = React.useMemo(() => filterDiary(diary, debouncedFilters).length, [diary, debouncedFilters]);

  const patch = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const toggleInArray = (key, value) => setFilters(prev => {
    const arr = prev[key] || [];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    return { ...prev, [key]: next };
  });

  const clearAll = () => setFilters(DEFAULT_DIARY_FILTERS);
  const apply = () => {
    if (onApply) onApply(filters, resultsCount);
    if (onClose) onClose();
  };

  const isPristine = (
    filters.rating === 'all' &&
    (filters.grapes || []).length === 0 &&
    (filters.countries || []).length === 0 &&
    filters.period === 'all' &&
    (filters.contexts || []).length === 0
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filtrar"
      contained={contained}
      maxHeight="86vh"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 92 }}>

        {/* ─── Nota ─────────────────────────────────────────────── */}
        <FilterSection title="Nota">
          <SegmentedControl
            value={filters.rating}
            onChange={(v) => patch('rating', v)}
            options={[
              { id: 'all',   label: 'Todas' },
              { id: '4plus', label: '4+ estrelas' },
              { id: '5',     label: '5 estrelas' },
            ]}
          />
        </FilterSection>

        {/* ─── Uva ──────────────────────────────────────────────── */}
        <FilterSection title="Uva" subtitle={`${(filters.grapes || []).length} selecionada${(filters.grapes || []).length === 1 ? '' : 's'}`}>
          {facets.grapes.length === 0 ? (
            <FacetEmpty msg="Sem uvas detectadas no seu diário."/>
          ) : (
            <ChipMultiSelect
              options={facets.grapes}
              value={filters.grapes || []}
              onToggle={(v) => toggleInArray('grapes', v)}
            />
          )}
        </FilterSection>

        {/* ─── País ─────────────────────────────────────────────── */}
        <FilterSection title="País" subtitle={`${(filters.countries || []).length} selecionado${(filters.countries || []).length === 1 ? '' : 's'}`}>
          {facets.countries.length === 0 ? (
            <FacetEmpty msg="Sem países detectados no seu diário."/>
          ) : (
            <ChipMultiSelect
              options={facets.countries}
              value={filters.countries || []}
              onToggle={(v) => toggleInArray('countries', v)}
            />
          )}
        </FilterSection>

        {/* ─── Período ──────────────────────────────────────────── */}
        <FilterSection title="Período">
          <RadioList
            value={filters.period}
            onChange={(v) => patch('period', v)}
            options={DIARY_PERIODS}
          />
          {filters.period === 'custom' && (
            <CustomDateRange
              value={filters.customRange}
              onChange={(v) => patch('customRange', v)}
            />
          )}
        </FilterSection>

        {/* ─── Contexto ─────────────────────────────────────────── */}
        <FilterSection title="Contexto" subtitle={`${(filters.contexts || []).length} selecionado${(filters.contexts || []).length === 1 ? '' : 's'}`}>
          <ChipMultiSelect
            options={DIARY_CONTEXTS}
            value={filters.contexts || []}
            onToggle={(v) => toggleInArray('contexts', v)}
          />
        </FilterSection>
      </div>

      {/* ─── Bottom CTA bar (sticky inside sheet) ──────────────── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        padding: '14px 16px',
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
        display: 'flex', gap: 10,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}>
        <button
          type="button"
          onClick={clearAll}
          disabled={isPristine}
          style={{
            flex: 1, height: 44,
            background: 'transparent',
            color: isPristine ? T.c.n400 : T.c.p700,
            border: 'none',
            borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 14, fontWeight: 600,
            cursor: isPristine ? 'not-allowed' : 'pointer',
            letterSpacing: '0.1px',
          }}
        >Limpar filtros</button>
        <button
          type="button"
          onClick={apply}
          style={{
            flex: 1, height: 44,
            background: T.c.p700, color: T.c.n0,
            border: 'none',
            borderRadius: T.r.md,
            fontFamily: T.font, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.1px',
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
        >
          Aplicar ({resultsCount})
        </button>
      </div>
    </BottomSheet>
  );
}

// ─── Section wrapper ──────────────────────────────────────────
function FilterSection({ title, subtitle, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700,
          color: T.c.p700,
          textTransform: 'uppercase', letterSpacing: 0.6,
        }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 11, color: T.c.n600, fontWeight: 500 }}>{subtitle}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function FacetEmpty({ msg }) {
  return (
    <div style={{
      padding: '12px 14px', background: T.c.n50,
      border: `1px dashed ${T.c.n200}`, borderRadius: T.r.sm,
      fontSize: 12, color: T.c.n600, lineHeight: 1.5,
    }}>{msg}</div>
  );
}

// ─── Segmented control (rating) ───────────────────────────────
function SegmentedControl({ value, onChange, options }) {
  return (
    <div
      role="radiogroup"
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        gap: 2,
        background: T.c.n100, borderRadius: T.r.md,
        padding: 2, width: '100%',
      }}
    >
      {options.map(opt => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            style={{
              padding: '10px 12px',
              border: 'none',
              background: active ? T.c.n0 : 'transparent',
              color: active ? T.c.n950 : T.c.n600,
              borderRadius: T.r.sm,
              fontFamily: T.font, fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 140ms ease',
              letterSpacing: '0.1px',
            }}
          >{opt.label}</button>
        );
      })}
    </div>
  );
}

// ─── Multi-select chips ───────────────────────────────────────
function ChipMultiSelect({ options, value = [], onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            style={{
              padding: '6px 12px',
              borderRadius: 9999,
              border: `1.5px solid ${active ? T.c.p700 : T.c.n200}`,
              background: active ? T.c.p50 : T.c.n0,
              color: active ? T.c.p700 : T.c.n800,
              fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: T.font,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              transition: 'all 120ms ease',
              letterSpacing: '0.1px',
            }}
          >
            {active && <Icon name="check" size={12} color={T.c.p700}/>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Radio list (period) ──────────────────────────────────────
function RadioList({ value, onChange, options }) {
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {options.map(opt => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            style={{
              padding: '10px 12px',
              background: active ? T.c.p50 : 'transparent',
              border: `1.5px solid ${active ? T.c.p700 : 'transparent'}`,
              borderRadius: T.r.md,
              fontFamily: T.font, fontSize: 14, fontWeight: active ? 600 : 500,
              color: active ? T.c.p700 : T.c.n800,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'background 120ms, border-color 120ms, color 120ms',
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${active ? T.c.p700 : T.c.n300}`,
              background: T.c.n0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {active && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: T.c.p700,
                }}/>
              )}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Custom date range (mini) ─────────────────────────────────
function CustomDateRange({ value, onChange }) {
  const [start, end] = value || [null, null];
  return (
    <div style={{
      marginTop: 10,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
    }}>
      <DateField
        label="De"
        value={start}
        onChange={(v) => onChange([v, end])}
      />
      <DateField
        label="Até"
        value={end}
        onChange={(v) => onChange([start, v])}
      />
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      fontFamily: T.font,
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.c.n600, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</span>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        style={{
          padding: '10px 12px',
          border: `1.5px solid ${T.c.n200}`,
          borderRadius: T.r.md,
          fontFamily: T.font, fontSize: 13,
          color: T.c.n950,
          background: T.c.n0,
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = T.c.p700; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = T.c.n200; }}
      />
    </label>
  );
}

// ─── Facets: extract grapes + countries from this user's diary ─
function computeFacets(diary) {
  const wines = (diary || []).map(d => d.wine).filter(Boolean);

  const grapeCount = {};
  wines.forEach(w => {
    const hay = `${w.name || ''} ${w.producer || ''}`.toLowerCase();
    DIARY_GRAPES.forEach(g => {
      if (hay.includes(g.toLowerCase())) grapeCount[g] = (grapeCount[g] || 0) + 1;
    });
  });
  const grapes = Object.keys(grapeCount)
    .sort((a, b) => grapeCount[b] - grapeCount[a])
    .slice(0, 10);

  const countries = Array.from(new Set(wines.map(w => w.country).filter(Boolean))).sort();

  return { grapes, countries };
}

// ─── Filter logic (matches the panel state) ──────────────────
function filterDiary(diary, f) {
  const now = new Date();
  return (diary || []).filter(entry => {
    // Rating
    if (f.rating === '4plus' && (entry.rating || 0) < 4) return false;
    if (f.rating === '5'     && (entry.rating || 0) < 5) return false;

    // Grape (any match)
    if ((f.grapes || []).length > 0) {
      const hay = `${entry.wine && entry.wine.name || ''} ${entry.wine && entry.wine.producer || ''}`.toLowerCase();
      const ok = f.grapes.some(g => hay.includes(g.toLowerCase()));
      if (!ok) return false;
    }

    // Country
    if ((f.countries || []).length > 0) {
      if (!entry.wine || !f.countries.includes(entry.wine.country)) return false;
    }

    // Period
    if (f.period && f.period !== 'all') {
      if (!entry.date) return false;
      const ed = new Date(entry.date);
      if (f.period === 'month'   && (now - ed) > 31  * 86400000) return false;
      if (f.period === '3months' && (now - ed) > 93  * 86400000) return false;
      if (f.period === 'year'    && (now - ed) > 366 * 86400000) return false;
      if (f.period === 'custom' && f.customRange) {
        const [s, e] = f.customRange;
        if (s && entry.date < s) return false;
        if (e && entry.date > e) return false;
      }
    }

    // Context (looks for matching occasion text)
    if ((f.contexts || []).length > 0) {
      const occ = (entry.occasion || '').toLowerCase();
      const ok = f.contexts.some(c => occ.includes(c.toLowerCase()));
      if (!ok) return false;
    }

    return true;
  });
}

Object.assign(window, {
  FiltrosDiario,
  DEFAULT_DIARY_FILTERS,
  filterDiary,
  computeFacets,
  DIARY_CONTEXTS,
});


export { ChipMultiSelect, CustomDateRange, DEFAULT_DIARY_FILTERS, DIARY_CONTEXTS, DIARY_GRAPES, DIARY_PERIODS, DateField, FacetEmpty, FilterSection, FiltrosDiario, RadioList, SegmentedControl, computeFacets, filterDiary };
