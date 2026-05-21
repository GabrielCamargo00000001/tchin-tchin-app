/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.08 Resumo Pós-Evento
// ────────────────────────────────────────────────────────────────
// Card gerado automaticamente 24h depois do evento, postado no feed da
// confraria. Compartilhável (gera imagem padrão pra Stories).
//
// US-12-12-02. Duas variantes:
//   • rich    — evento teve ≥3 registros: stats, vinho top, grid de fotos
//   • enxuta  — evento teve 1–2 registros: card empático, sem stats
// Regra: 0 registros → card NÃO é criado pelo backend (não é responsabilidade
// do componente — esperamos que o caller só renderize quando tem o que mostrar).

// ─── Pure component ─────────────────────────────────────────
//  props:
//    eventData: {
//      title, date, attendeesCount, checkinsCount, winesCount, photosCount,
//      photos: [{ id, src? }], topWine: { name, rating, region, type }
//    }
//    variant: 'rich' | 'enxuta'
//    onShare: () => void
//    onDetailsTap: () => void
function ResumoPosEvento({ eventData, variant, onShare, onDetailsTap }) {
  // Auto-detect variant if caller didn't specify. <3 registros => enxuta.
  const totalRegistros = (eventData.checkinsCount || 0)
    + (eventData.winesCount || 0)
    + (eventData.photosCount || 0);
  const resolvedVariant = variant || (totalRegistros < 3 ? 'enxuta' : 'rich');

  React.useEffect(() => {
    fbEvent('post_event_summary_shown', {
      variant: resolvedVariant,
      total_registros: totalRegistros,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = () => {
    fbEvent('post_event_summary_shared', { destination: 'stories' });
    onShare && onShare();
  };

  return (
    <article
      data-tour-anchor="post-event-summary"
      style={{
        width: '100%',
        background: `linear-gradient(160deg, ${T.c.p50} 0%, ${T.c.n50} 70%, ${T.c.n50} 100%)`,
        border: `1px solid ${T.c.p100}`,
        borderRadius: T.r.lg,
        padding: 20,
        fontFamily: T.font,
        boxShadow: '0 2px 8px rgba(74,31,36,0.04)',
        position: 'relative', overflow: 'hidden',
      }}>
      {/* Decorative wine glass faint */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: -10, top: -10,
        opacity: 0.06, pointerEvents: 'none',
      }}>
        <Icon name="wine_bar" size={120} color={T.c.p700} fill={1}/>
      </div>

      {/* Eyebrow */}
      <div style={{
        position: 'relative',
        fontFamily: T.font, fontSize: 10, fontWeight: 700,
        color: T.c.n600, letterSpacing: '0.6px',
        textTransform: 'uppercase', marginBottom: 4,
      }}>
        Resumo do evento
      </div>

      {/* Title */}
      <h3 style={{
        position: 'relative',
        margin: 0, marginBottom: 8,
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: 20, lineHeight: 1.2, fontWeight: 600,
        letterSpacing: '-0.015em', color: T.c.n950,
        textWrap: 'balance',
      }}>
        {resolvedVariant === 'enxuta' ? 'Quem foi já sente saudade 🍷' : eventData.title}
      </h3>

      {resolvedVariant === 'enxuta' ? (
        <EnxutaBody eventData={eventData}/>
      ) : (
        <RichBody eventData={eventData}/>
      )}

      {/* Bottom — share + ver detalhes */}
      <div style={{
        position: 'relative',
        marginTop: 16, paddingTop: 12,
        borderTop: `1px solid ${T.c.p100}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 4px',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            color: T.c.p700,
          }}>
          <Icon name="share" size={16} color={T.c.p700}/>
          Compartilhar
        </button>
        <button
          onClick={onDetailsTap}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 4px',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            color: T.c.p700,
          }}>
          Ver detalhes
          <Icon name="chevron_right" size={16} color={T.c.p700}/>
        </button>
      </div>
    </article>
  );
}

// ─── Rich body (≥3 registros) ───────────────────────────────
function RichBody({ eventData }) {
  return (
    <>
      <div style={{
        position: 'relative',
        fontFamily: T.font, fontSize: 12, lineHeight: 1.4, color: T.c.n800,
        marginBottom: 16,
      }}>
        {formatPostEventDate(eventData.date)}
      </div>

      {/* Stats row */}
      <StatsRow
        stats={[
          { value: eventData.checkinsCount || 0, label: 'Check-ins' },
          { value: eventData.winesCount    || 0, label: 'Vinhos registrados' },
          { value: eventData.photosCount   || 0, label: 'Fotos' },
        ]}
      />

      {/* Vinho top */}
      {eventData.topWine && (
        <>
          <div style={{ height: 16 }}/>
          <SubsectionLabel>Vinho mais bem avaliado</SubsectionLabel>
          <TopWineCard wine={eventData.topWine}/>
        </>
      )}

      {/* Photos */}
      {eventData.photos && eventData.photos.length > 0 && (
        <>
          <div style={{ height: 16 }}/>
          <SubsectionLabel>{eventData.photosCount || eventData.photos.length} fotos do encontro</SubsectionLabel>
          <PhotosGrid photos={eventData.photos} totalCount={eventData.photosCount || eventData.photos.length}/>
        </>
      )}
    </>
  );
}

// ─── Enxuta body (1–2 registros) ────────────────────────────
function EnxutaBody({ eventData }) {
  const count = eventData.attendeesCount || eventData.checkinsCount || 1;
  return (
    <>
      <div style={{
        position: 'relative',
        fontFamily: T.font, fontSize: 13, lineHeight: 1.5, color: T.c.n800,
        marginBottom: 12,
      }}>
        <strong style={{ color: T.c.n950 }}>{count} {count === 1 ? 'pessoa compareceu' : 'pessoas compareceram'}</strong>{' '}
        à <strong style={{ color: T.c.n950 }}>{eventData.title}</strong>. Que a próxima seja ainda melhor.
      </div>
      <div style={{
        position: 'relative',
        fontFamily: T.font, fontSize: 11, color: T.c.n600,
      }}>
        {formatPostEventDate(eventData.date)}
      </div>
    </>
  );
}

// ─── StatsRow — 3 cols ──────────────────────────────────────
function StatsRow({ stats }) {
  return (
    <div style={{
      position: 'relative',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '12px 8px',
          background: T.c.n0,
          border: `1px solid ${T.c.p100}`,
          borderRadius: T.r.md,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 24, lineHeight: 1, fontWeight: 700,
            color: T.c.p700, letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {s.value}
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: T.font, fontSize: 10, fontWeight: 500,
            color: T.c.n600, lineHeight: 1.2,
            textTransform: 'uppercase', letterSpacing: '0.3px',
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SubsectionLabel ────────────────────────────────────────
function SubsectionLabel({ children }) {
  return (
    <div style={{
      position: 'relative',
      fontFamily: T.font, fontSize: 11, fontWeight: 600, lineHeight: 1.4,
      color: T.c.n600, marginBottom: 8,
      textTransform: 'uppercase', letterSpacing: '0.5px',
    }}>
      {children}
    </div>
  );
}

// ─── TopWineCard — horizontal mini-card with rating ────────
function TopWineCard({ wine }) {
  const rating = wine.rating ?? 4.5;
  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 10,
      background: T.c.n0,
      border: `1px solid ${T.c.p100}`,
      borderRadius: T.r.md,
    }}>
      <BottlePlaceholder width={42} height={56} label=""/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950,
          lineHeight: 1.3, marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wine.name}
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 11, color: T.c.n600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wine.region || wine.country || ''}{wine.type ? ` · ${wine.type}` : ''}
        </div>
        <StarRating value={rating}/>
      </div>
    </div>
  );
}

function StarRating({ value }) {
  // 5 stars; partial fill not shown — round to nearest 0.5 via half-star
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4, marginTop: 4,
    }}>
      <div style={{ display: 'inline-flex', gap: 1 }}>
        {[0, 1, 2, 3, 4].map(i => {
          const isFull = i < full;
          const isHalf = i === full && half;
          return (
            <Icon
              key={i}
              name={isFull ? 'star' : isHalf ? 'star_half' : 'star'}
              size={13}
              color={isFull || isHalf ? T.c.a700 : T.c.n300}
              fill={isFull || isHalf ? 1 : 0}
            />
          );
        })}
      </div>
      <span style={{
        fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.c.n800,
        marginLeft: 2,
      }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

// ─── PhotosGrid — 4-up with +N overflow on the last cell ───
function PhotosGrid({ photos, totalCount }) {
  // Show up to 4. If totalCount > 4, the 4th cell becomes a "+N" overlay.
  const shown = photos.slice(0, 4);
  const overflow = Math.max(0, (totalCount || photos.length) - 4);
  return (
    <div style={{
      position: 'relative',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
    }}>
      {shown.map((photo, i) => {
        const showOverflowOverlay = i === shown.length - 1 && overflow > 0 && shown.length === 4;
        return (
          <PhotoCell
            key={photo.id || i}
            photo={photo}
            overflow={showOverflowOverlay ? overflow : 0}
            index={i}
          />
        );
      })}
    </div>
  );
}

function PhotoCell({ photo, overflow, index }) {
  // Deterministic faux-photo: gradient based on photo id, with a small wine
  // glyph offset so each cell looks distinct without needing real images.
  const HUES = [
    [T.c.p300, T.c.p700],
    [T.c.a500, T.c.a700],
    [T.c.p100, T.c.p500],
    [T.c.p500, T.c.p900],
    [T.c.a100, T.c.a700],
  ];
  const idx = photo.id != null ? Number(photo.id) % HUES.length : index % HUES.length;
  const [c0, c1] = HUES[idx];

  return (
    <div style={{
      position: 'relative',
      aspectRatio: '1 / 1',
      borderRadius: T.r.sm,
      background: photo.src
        ? `url(${photo.src}) center/cover`
        : `linear-gradient(135deg, ${c0} 0%, ${c1} 100%)`,
      overflow: 'hidden',
    }}>
      {!photo.src && (
        <>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 12px)',
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.45,
          }}>
            <Icon name="photo_camera" size={22} color="#FFFFFF" fill={1}/>
          </div>
        </>
      )}
      {overflow > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,15,15,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em',
        }}>
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────
function formatPostEventDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const s = dt.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Demo host — surfaces both variants in a feed-like surface ─
function ResumoPosEventoHostDemo({ variant = 'rich' }) {
  const richEvent = {
    title: 'Degustação de Malbecs — encontro de maio',
    date: '2026-05-15',
    attendeesCount: 12,
    checkinsCount: 11,
    winesCount: 8,
    photosCount: 14,
    photos: [
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
      { id: 6 }, { id: 7 }, { id: 8 },
    ],
    topWine: {
      name: 'Salentein Reserve Malbec',
      region: 'Uco Valley',
      type: 'Tinto',
      rating: 4.7,
    },
  };

  const enxutaEvent = {
    title: 'Reunião informal · primeiro tinto',
    date: '2026-05-15',
    attendeesCount: 2,
    checkinsCount: 2,
    winesCount: 1,
    photosCount: 0,
    photos: [],
    topWine: null,
  };

  const event = variant === 'enxuta' ? enxutaEvent : richEvent;

  return (
    <div style={{
      flex: 1, padding: 16, background: T.c.n50, overflowY: 'auto',
      fontFamily: T.font, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Feed-like header pra contexto */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 4px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: T.c.p700, color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.font, fontSize: 12, fontWeight: 700,
        }}>
          TC
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.c.n950,
          }}>
            Tchin do Cerrado · automático
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 11, color: T.c.n600,
          }}>
            há 24h · post do sistema
          </div>
        </div>
      </div>

      <ResumoPosEvento
        eventData={event}
        variant={variant}
        onShare={() => console.log('share')}
        onDetailsTap={() => console.log('details')}
      />

      {/* Hint */}
      <div style={{
        marginTop: 4, padding: '10px 12px',
        background: T.c.n100, borderRadius: T.r.md,
        fontFamily: T.font, fontSize: 11, lineHeight: 1.45, color: T.c.n600,
      }}>
        Este card aparece automaticamente no feed da confraria 24h depois do evento.
        {variant === 'enxuta' && ' Variante "enxuta" porque tiveram <3 registros (check-ins + vinhos + fotos).'}
      </div>
    </div>
  );
}

Object.assign(window, {
  ResumoPosEvento,
  ResumoPosEventoHostDemo,
  formatPostEventDate,
});


export { EnxutaBody, PhotoCell, PhotosGrid, ResumoPosEvento, ResumoPosEventoHostDemo, RichBody, StarRating, StatsRow, SubsectionLabel, TopWineCard, formatPostEventDate };
