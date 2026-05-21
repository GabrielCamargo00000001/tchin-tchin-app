/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { MOCK_CONFRARIAS } from './data.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 12.01 Card Confraria (refator)
// ────────────────────────────────────────────────────────────────
// Refator do card de listagem de confrarias. Decisão: copiar o padrão
// Sympla — descrição VISÍVEL na listagem (até 2 linhas) pra reduzir
// taps até o detalhe.
//
// Antes (em cards.jsx): cover ratio 16:9 + avatar + meta no fundo do
// cover. Era visualmente pesado, escondia conteúdo, exigia clique pra
// avaliar relevância.
//
// Agora: avatar 56×56 esquerda, conteúdo denso à direita, descrição
// inline, e — diferencial chave — uma "próxima evento" pill highlight
// burgundy/p50 no rodapé que vira fallback "Sem eventos próximos" pra
// confrarias inativas.
//
// US-12-6-01. Visível em: Recomendações, Suas Confrarias, busca.

// ─── Pure component ─────────────────────────────────────────
//  props:
//    brotherhood: { id, name, description, members, location, modality, tags, activity?, color? }
//    nextEvent?:  { title, date, time, modality, location }
//    onTap: () => void
function CardConfraria({ brotherhood, nextEvent, onTap }) {
  const {
    name, description, members,
    location, modality, tags = [],
    activity = 'ativa', color,
  } = brotherhood || {};

  // Descrição: usa primeira linha do texto OU placeholder
  const cleanDescription = (description || '').split(/\n+/)[0].trim();
  const descShown = cleanDescription || 'Sem descrição ainda';
  const descIsPlaceholder = !cleanDescription;

  const visibleTags = tags.slice(0, 3);
  const remainingTags = Math.max(0, tags.length - visibleTags.length);

  // Computar "dias inativa" pro fallback do rodapé
  const daysInactive = activity === 'inativa' ? 60 : activity === 'pouco-ativa' ? 28 : 0;

  return (
    <button
      onClick={onTap}
      style={{
        width: '100%',
        display: 'flex', flexDirection: 'column', gap: 12,
        padding: 16,
        background: T.c.n50,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        cursor: 'pointer', textAlign: 'left',
        fontFamily: T.font,
        transition: 'background 120ms, border-color 120ms',
      }}>

      {/* ── Top row: avatar + name/meta/tags ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <BrotherhoodAvatar
          brotherhood={brotherhood}
          color={color}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name */}
          <div style={{
            fontFamily: T.font, fontSize: 15, fontWeight: 700,
            color: T.c.n950, lineHeight: 1.3, marginBottom: 4,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </div>

          {/* Meta — members + place */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
            marginBottom: 6,
          }}>
            <MetaItem icon="groups" label={`${members || 0} ${members === 1 ? 'membro' : 'membros'}`}/>
            <DotSeparator/>
            <MetaItem
              icon={modality === 'online' ? 'language' : 'location_on'}
              label={modality === 'online' ? 'Online' : (location || '—')}
            />
          </div>

          {/* Tags row */}
          {visibleTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {visibleTags.map(t => (
                <span key={t} style={{
                  padding: '2px 8px',
                  background: T.c.n100, color: T.c.n800,
                  borderRadius: T.r.full,
                  fontFamily: T.font, fontSize: 10, fontWeight: 600,
                  lineHeight: 1.4,
                }}>
                  {t}
                </span>
              ))}
              {remainingTags > 0 && (
                <span style={{
                  padding: '2px 8px',
                  background: T.c.n100, color: T.c.n600,
                  borderRadius: T.r.full,
                  fontFamily: T.mono, fontSize: 10, fontWeight: 600,
                  lineHeight: 1.4,
                }}>
                  +{remainingTags}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Descrição (até 2 linhas) ── */}
      <div style={{
        fontFamily: T.font, fontSize: 13, lineHeight: 1.5,
        color: descIsPlaceholder ? T.c.n400 : T.c.n800,
        fontStyle: descIsPlaceholder ? 'italic' : 'normal',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        // textWrap pretty mantém quebras agradáveis sem ficar dramatic
        textWrap: 'pretty',
      }}>
        {descShown}
      </div>

      {/* ── Footer: próximo evento OU estado inativo ── */}
      {nextEvent ? (
        <NextEventBar event={nextEvent}/>
      ) : (
        <InactiveBar daysInactive={daysInactive}/>
      )}
    </button>
  );
}

// ─── Avatar — usa initials + activity color hint ────────────
function BrotherhoodAvatar({ brotherhood, color }) {
  if (!brotherhood) return null;
  const name = brotherhood.name || '?';
  const inits = name.split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const bg = color || T.c.p700;
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: brotherhood.avatarSrc
        ? `url(${brotherhood.avatarSrc}) center/cover`
        : `linear-gradient(135deg, ${bg} 0%, ${T.c.p900} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#FFFFFF',
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(74,31,36,0.15)',
    }}>
      {!brotherhood.avatarSrc && inits}
    </div>
  );
}

// ─── Meta item — icon + label ───────────────────────────────
function MetaItem({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: T.font, fontSize: 12, color: T.c.n600,
      lineHeight: 1.3, minWidth: 0,
    }}>
      <Icon name={icon} size={14} color={T.c.n600} fill={1} style={{ flexShrink: 0 }}/>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </span>
  );
}

function DotSeparator() {
  return (
    <span aria-hidden="true" style={{
      width: 3, height: 3, borderRadius: '50%',
      background: T.c.n400, flexShrink: 0,
    }}/>
  );
}

// ─── NextEventBar — burgundy highlight com left-border ─────
function NextEventBar({ event }) {
  const dateLabel = formatCardEventDate(event.date, event.time);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px',
      background: T.c.p50,
      borderLeft: `3px solid ${T.c.p700}`,
      borderRadius: `0 ${T.r.md}px ${T.r.md}px 0`,
      overflow: 'hidden',
    }}>
      <Icon name="calendar_today" size={14} color={T.c.p700} fill={1} style={{ flexShrink: 0 }}/>
      <div style={{
        flex: 1, minWidth: 0,
        fontFamily: T.font, fontSize: 13, fontWeight: 600,
        color: T.c.p900, lineHeight: 1.35,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        Próximo: {dateLabel} · {event.title}
      </div>
    </div>
  );
}

// ─── InactiveBar — fallback quando não tem evento ──────────
function InactiveBar({ daysInactive }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      paddingLeft: 0,
      fontFamily: T.font, fontSize: 12,
      color: T.c.n400, fontStyle: 'italic',
      lineHeight: 1.4,
    }}>
      <Icon name="event_busy" size={14} color={T.c.n400} style={{ flexShrink: 0 }}/>
      {daysInactive > 0
        ? `Sem eventos próximos — confraria inativa há ${daysInactive} dias`
        : 'Sem eventos próximos no momento'}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────
function formatCardEventDate(dateStr, time) {
  if (!dateStr) return time || 'sem data';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  // Compact format: "sáb, 23 mai" or "sáb, 23 mai · 19h"
  const s = dt.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\./g, '');
  return time ? `${s} · ${time}` : s;
}

// ─── Demo host pra canvas — empilha 4 cards num feed-like surface ──
function CardConfrariaHostDemo() {
  const baseSet = (typeof MOCK_CONFRARIAS !== 'undefined' && MOCK_CONFRARIAS) ? MOCK_CONFRARIAS : [];
  const fakeEvents = {
    1: { title: 'Tintos Argentinos', date: '2026-05-23', time: '19h30' },
    2: { title: 'Wine & Netflix · ep 1', date: '2026-05-25', time: '21h' },
    4: { title: 'Harmonização: Brasileira', date: '2026-06-01', time: '20h' },
  };
  return (
    <div style={{
      flex: 1, padding: 16, background: T.c.n50, overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 12, fontFamily: T.font,
    }}>
      <div style={{
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: 18, fontWeight: 600, color: T.c.n950,
        letterSpacing: '-0.01em',
      }}>
        Recomendações
      </div>
      {baseSet.map(c => (
        <CardConfraria
          key={c.id}
          brotherhood={c}
          nextEvent={fakeEvents[c.id]}
          onTap={() => console.log('tap', c.id)}
        />
      ))}
    </div>
  );
}

Object.assign(window, {
  CardConfraria,
  CardConfrariaHostDemo,
  BrotherhoodAvatar,
  NextEventBar,
  formatCardEventDate,
});


export { BrotherhoodAvatar, CardConfraria, CardConfrariaHostDemo, DotSeparator, InactiveBar, MetaItem, NextEventBar, formatCardEventDate };
