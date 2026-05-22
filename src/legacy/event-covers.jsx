/* eslint-disable */
// @ts-nocheck
// Capas prontas de evento (#6) + sugestão de nome por IA.
// O organizador escolhe uma capa no passo 1 do wizard de evento; cada capa é um
// visual pronto (gradiente + motivo) no estilo da marca (sem foto de estoque).
import React from 'react';
import { Icon, T } from './tokens.jsx';

const EVENT_COVERS = [
  { id: 'classico', label: 'Clássico', from: '#722F37', to: '#4A1F24', glyph: 'wine_bar' },
  { id: 'tinto',    label: 'Tinto',    from: '#8E3B47', to: '#3F1A1E', glyph: 'local_bar' },
  { id: 'dourado',  label: 'Dourado',  from: '#E2B86B', to: '#B8894A', glyph: 'celebration' },
  { id: 'jantar',   label: 'Jantar',   from: '#A65A3A', to: '#4A1F24', glyph: 'restaurant' },
  { id: 'vinicola', label: 'Vinícola', from: '#5C7A3A', to: '#2E4A22', glyph: 'tour' },
  { id: 'noturno',  label: 'Noturno',  from: '#4A3550', to: '#1C1620', glyph: 'nightlife' },
];

// Capa padrão por tipo de evento, quando o organizador não escolhe uma.
const COVER_BY_TYPE = {
  degustacao: 'classico',
  jantar: 'jantar',
  festa: 'dourado',
  visita: 'vinicola',
};

function getEventCover(coverId, type) {
  if (coverId) {
    const found = EVENT_COVERS.find((c) => c.id === coverId);
    if (found) return found;
  }
  const byType = COVER_BY_TYPE[type];
  return EVENT_COVERS.find((c) => c.id === byType) || EVENT_COVERS[0];
}

// Visual de uma capa — reutilizado no picker, no review e no hero do detalhe.
function CoverThumb({ cover, height = 60, radius = 12, glyphSize = 26, label }) {
  return (
    <div style={{
      position: 'relative', height, borderRadius: radius, overflow: 'hidden',
      background: `linear-gradient(135deg, ${cover.from} 0%, ${cover.to} 100%)`,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 14px)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
        <Icon name={cover.glyph} size={glyphSize} color="#FFFFFF" fill={1}/>
      </div>
      {label && (
        <div style={{
          position: 'absolute', left: 8, bottom: 6, padding: '2px 8px',
          background: 'rgba(0,0,0,0.5)', borderRadius: T.r.full,
          fontFamily: T.font, fontSize: 10, fontWeight: 600, color: '#fff', letterSpacing: '0.3px',
        }}>{label}</div>
      )}
    </div>
  );
}

// Escolha de capa — passo 1 do wizard.
function CoverPicker({ value, onChange }) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: T.font, fontSize: 12, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n800, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10,
      }}>
        Capa do evento
      </label>
      <div role="radiogroup" aria-label="Capa do evento" style={{
        display: 'flex', gap: 10, overflowX: 'auto', padding: '0 4px 4px', margin: '0 -4px',
      }}>
        {EVENT_COVERS.map((c) => {
          const sel = value === c.id;
          return (
            <button key={c.id} onClick={() => onChange(c.id)} role="radio" aria-checked={sel} aria-label={`Capa ${c.label}`} style={{
              flexShrink: 0, width: 104, padding: 0, background: 'none', cursor: 'pointer',
              border: `${sel ? 2 : 1.5}px solid ${sel ? T.c.p700 : T.c.n300}`, borderRadius: T.r.md, overflow: 'hidden',
            }}>
              <div style={{ position: 'relative' }}>
                <CoverThumb cover={c} height={64} radius={0} glyphSize={24}/>
                {sel && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%',
                    background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="check" size={13} color="#fff" weight={700}/>
                  </div>
                )}
              </div>
              <div style={{
                padding: '6px 6px', fontFamily: T.font, fontSize: 12,
                fontWeight: sel ? 700 : 500, color: sel ? T.c.p700 : T.c.n800, textAlign: 'center',
              }}>{c.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Sugestões de nome (#6) com base no tipo de evento + tags da confraria.
function suggestEventNames(type, tags) {
  const tag = tags && tags.length ? String(tags[0]) : null;
  const byType = {
    degustacao: ['Degustação às Cegas', tag ? `Noite ${tag}` : 'Noite de Tintos', 'Taça a Taça', 'Degustação Guiada'],
    jantar:     ['Jantar Harmonizado', 'Mesa & Vinho', tag ? `Jantar ${tag}` : 'Jantar entre Amigos', 'Comida & Taça'],
    festa:      ['Tchin Tchin Night', 'Brinde entre Amigos', tag ? `Festa ${tag}` : 'Festa do Vinho', 'Noite de Bolhas'],
    visita:     ['Dia de Vindima', 'Visita à Vinícola', 'Rota do Vinho', 'Bate-volta Enoturismo'],
  };
  const list = byType[type] || byType.degustacao;
  return [...new Set(list)].slice(0, 4);
}

if (typeof window !== 'undefined') {
  Object.assign(window, { EVENT_COVERS, getEventCover, CoverThumb, CoverPicker, suggestEventNames });
}

export { EVENT_COVERS, COVER_BY_TYPE, getEventCover, CoverThumb, CoverPicker, suggestEventNames };
