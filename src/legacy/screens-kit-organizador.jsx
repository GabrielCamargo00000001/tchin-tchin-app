/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { suggestWinesForEvent } from './screens-event-wizard-p3.jsx';
import { TEMPLATES } from './screens-wizard-confraria-p2.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.07 Kit do Organizador
// ────────────────────────────────────────────────────────────────
// Seção colapsável dentro da tela do evento, visível APENAS para o
// organizador. US-12-12-01.
//
// 4 sub-seções:
//   1. Vinhos sugeridos       — 3 cards horizontais com swap
//   2. Ficha de degustação    — thumbnail PDF + share/preview
//   3. Dicas de harmonização  — 3 chips de copy
//   4. Playlist Spotify       — link externo (opcional, pode não existir)
//
// O conteúdo vem de um lookup `template_id × tema_id` → 10 kits
// pré-produzidos pelo time Tchin. Quando não há kit correspondente,
// caímos no `GENERIC_KIT` (3 vinhos versáteis + ficha + dicas genéricas
// + playlist genérica) — nunca renderiza vazio.

// ─── Kit data (mockado pro protótipo — em produção vem da API) ──
const GENERIC_KIT = {
  id: 'generic',
  themeLabel: 'Encontro versátil',
  fichaTitle: 'Ficha de degustação · Modelo Tchin',
  fichaSize: '128 KB',
  tips: [
    'Com queijos curados, prove um Sangiovese.',
    'Com carne vermelha, prefira um Cabernet ou Malbec.',
    'Com sobremesas, vinho do Porto Ruby vai bem.',
  ],
  playlist: {
    title: 'Wine & Vibes',
    subtitle: 'Playlist neutra · 42 faixas · 2h54',
    url: 'https://open.spotify.com/playlist/wine-vibes',
    color: '#1DB954',
  },
};

const KIT_BY_TEMPLATE = {
  churrasco_vinho: {
    id: 'kit_churrasco',
    themeLabel: 'Churrasco & Vinho',
    fichaTitle: 'Ficha de degustação · Tintos encorpados',
    fichaSize: '142 KB',
    tips: [
      'Picanha pede tinto encorpado — Malbec ou Cabernet Sauvignon.',
      'Linguiça curada combina com tintos jovens, frutados (Tempranillo).',
      'Pão de alho, queijo coalho? Branco encorpado faz o contraponto.',
    ],
    playlist: {
      title: 'Churrasco & Tinto',
      subtitle: 'Bossa, samba-rock, MPB · 3h12',
      url: 'https://open.spotify.com/playlist/churrasco-tinto',
      color: '#1DB954',
    },
  },
  wine_netflix: {
    id: 'kit_netflix',
    themeLabel: 'Wine & Netflix',
    fichaTitle: 'Ficha "sem pressão" · Notas livres',
    fichaSize: '96 KB',
    tips: [
      'Drama denso? Tinto encorpado acompanha bem.',
      'Comédia romântica leve? Espumante ou rosé.',
      'Série de mistério? Tinto de meio corpo — pra não competir com a atenção.',
    ],
    playlist: {
      title: 'Wine & Chill',
      subtitle: 'Lo-fi, indie · 2h40',
      url: 'https://open.spotify.com/playlist/wine-chill',
      color: '#1DB954',
    },
  },
  tintos_mundo: {
    id: 'kit_tintos',
    themeLabel: 'Tintos do Mundo',
    fichaTitle: 'Ficha técnica · Análise sensorial 5D',
    fichaSize: '186 KB',
    tips: [
      'Sirva tintos a 16–18°C. Mais quente, álcool sobressai.',
      'Decante tintos com mais de 10 anos antes de servir.',
      'Compare 2 regiões da mesma uva no mesmo encontro: Mendoza × Bordeaux.',
    ],
    playlist: {
      title: 'Old World · New World',
      subtitle: 'Jazz, clássica acústica · 3h08',
      url: 'https://open.spotify.com/playlist/old-new-world',
      color: '#1DB954',
    },
  },
  iniciantes: {
    id: 'kit_iniciantes',
    themeLabel: 'Iniciantes',
    fichaTitle: 'Ficha didática · Sem jargões',
    fichaSize: '108 KB',
    tips: [
      'Comece pela cor: clara, média, intensa? Já dá pra adivinhar o corpo.',
      'Cheire 2× — primeira impressão e depois de mexer a taça.',
      'Sem "errado" — anote o que VOCÊ sentiu, não o que esperam que sinta.',
    ],
    playlist: {
      title: 'Primeiros Goles',
      subtitle: 'Indie suave · 2h20',
      url: 'https://open.spotify.com/playlist/primeiros-goles',
      color: '#1DB954',
    },
  },
  girls_wine_night: {
    id: 'kit_girls_night',
    themeLabel: 'Girls Wine Night',
    fichaTitle: 'Ficha leve · Notas e mood',
    fichaSize: '102 KB',
    tips: [
      'Espumante quebra-gelo no início — sempre.',
      'Rosé harmoniza com salada, peixe leve, sushi.',
      'Tinto leve (Pinot Noir, Gamay) acompanha conversa sem pesar.',
    ],
    playlist: {
      title: 'Girls Night In',
      subtitle: 'Pop, soul, R&B · 2h48',
      url: 'https://open.spotify.com/playlist/girls-night',
      color: '#1DB954',
    },
  },
};

function lookupKit(templateId) {
  return KIT_BY_TEMPLATE[templateId] || GENERIC_KIT;
}

// ─── Pure component ─────────────────────────────────────────
//  props:
//    eventData: { id, type, ... }
//    templateData: { id, name, gradient, glyph, ... } | null
//    suggestedWines?: Wine[]         — vem do passo 09.03; default = generated
//    onWineSwap: () => void          — abre wine search modal
//    onPDFShare: () => void
//    onPDFView?: () => void
//    onPlaylistOpen: () => void
//    defaultOpen?: boolean           — default true na primeira visita
function KitOrganizador({
  eventData, templateData,
  suggestedWines, onWineSwap, onPDFShare, onPDFView, onPlaylistOpen,
  defaultOpen = true,
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const hasExpandedRef = React.useRef(false);

  // Fire kit_expanded once per session
  React.useEffect(() => {
    if (open && !hasExpandedRef.current) {
      fbEvent('kit_expanded', { event_id: eventData && eventData.id });
      hasExpandedRef.current = true;
    }
  }, [open, eventData]);

  const templateId = (templateData && templateData.id) || (eventData && eventData.template_id) || null;
  const kit = lookupKit(templateId);

  // Default wine suggestions if caller didn't pass them: pull from
  // suggestWinesForEvent (defined in screens-event-wizard-p3.jsx) so
  // there's always a meaningful set even without 09.03 data.
  const wines = React.useMemo(() => {
    if (suggestedWines && suggestedWines.length) return suggestedWines.slice(0, 3);
    if (typeof suggestWinesForEvent === 'function') {
      const eventType = (eventData && eventData.type) || 'degustacao';
      return suggestWinesForEvent(eventType).flat().filter(Boolean).slice(0, 3);
    }
    return [];
  }, [suggestedWines, eventData]);

  const handlePDFShare = () => {
    fbEvent('kit_pdf_shared', { event_id: eventData && eventData.id, kit_id: kit.id });
    onPDFShare && onPDFShare();
  };
  const handlePlaylistOpen = () => {
    fbEvent('kit_playlist_opened', { event_id: eventData && eventData.id, kit_id: kit.id });
    onPlaylistOpen && onPlaylistOpen();
  };
  const handleWineSwap = () => {
    fbEvent('kit_wine_swapped', { event_id: eventData && eventData.id, kit_id: kit.id });
    onWineSwap && onWineSwap();
  };

  return (
    <section
      data-tour-anchor="confraria-event-kit"
      style={{
        width: '100%',
        background: T.c.n0,
        border: `1px solid ${T.c.p100}`,
        borderRadius: T.r.lg,
        overflow: 'hidden',
        fontFamily: T.font,
      }}>
      {/* ── Section header (toggle) ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="kit-content"
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          background: T.c.p50,
          border: 'none', cursor: 'pointer',
          textAlign: 'left', fontFamily: T.font,
          transition: 'background 140ms',
        }}>
        <div style={{
          width: 36, height: 36, borderRadius: T.r.sm, flexShrink: 0,
          background: T.c.n0, border: `1px solid ${T.c.p100}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="celebration" size={20} color={T.c.p700} fill={1}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 16, lineHeight: 1.25, fontWeight: 600,
            color: T.c.n950, letterSpacing: '-0.01em',
          }}>
            Kit do Organizador
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 11, color: T.c.n600,
            marginTop: 2,
          }}>
            {kit.themeLabel} · só você vê isso
          </div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: T.c.n0, border: `1px solid ${T.c.p100}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          color: T.c.p700, flexShrink: 0,
        }}>
          <Icon name="expand_more" size={18} color={T.c.p700}/>
        </div>
      </button>

      {/* ── Expanded content ── */}
      {open && (
        <div id="kit-content" style={{
          padding: 16,
          display: 'flex', flexDirection: 'column', gap: 24,
          animation: 'tcFadeIn 220ms ease',
        }}>
          {/* 1. Vinhos sugeridos */}
          <KitSubsection emoji="🍷" title="Vinhos sugeridos" subtitle="3 sugestões por faixa de preço, baseadas no tema">
            {wines.length === 0 ? (
              <EmptySubsectionState>Sem vinhos sugeridos ainda.</EmptySubsectionState>
            ) : (
              <div style={{
                display: 'flex', gap: 8,
                overflowX: 'auto', overflowY: 'hidden',
                margin: '0 -16px', padding: '4px 16px 8px',
                scrollbarWidth: 'none',
              }} className="tc-no-scrollbar">
                {wines.map((w, i) => <WineMiniCardKit key={`${w.id}-${i}`} wine={w}/>)}
              </div>
            )}
            <KitTextButton onClick={handleWineSwap} icon="swap_horiz">
              Trocar sugestões
            </KitTextButton>
          </KitSubsection>

          {/* 2. Ficha de degustação */}
          <KitSubsection emoji="📋" title="Ficha de degustação" subtitle="Modelo pronto pra imprimir ou compartilhar">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12,
              background: T.c.n50, border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.md,
            }}>
              <PDFThumbnail/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: T.font, fontSize: 13, fontWeight: 700,
                  color: T.c.n950, lineHeight: 1.3,
                }}>
                  {kit.fichaTitle}
                </div>
                <div style={{
                  fontFamily: T.mono, fontSize: 10, fontWeight: 500,
                  color: T.c.n600, marginTop: 2,
                  textTransform: 'uppercase', letterSpacing: '0.4px',
                }}>
                  PDF · {kit.fichaSize}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
              <Button variant="secondary" size="sm" leading={<Icon name="ios_share" size={16}/>} onClick={handlePDFShare}>
                Compartilhar
              </Button>
              <KitTextButton onClick={onPDFView} icon="visibility">
                Visualizar
              </KitTextButton>
            </div>
          </KitSubsection>

          {/* 3. Dicas de harmonização */}
          <KitSubsection emoji="💡" title="Dicas de harmonização">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {kit.tips.map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 12px',
                  background: T.c.a100,
                  borderRadius: T.r.md,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: T.c.a700, color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                    flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    flex: 1,
                    fontFamily: T.font, fontSize: 13, lineHeight: 1.45, color: T.c.n950,
                  }}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </KitSubsection>

          {/* 4. Playlist Spotify */}
          {kit.playlist && (
            <KitSubsection emoji="🎵" title="Playlist Spotify" subtitle="Opcional · joga som no fundo">
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 12,
                background: T.c.n50, border: `1px solid ${T.c.n200}`,
                borderRadius: T.r.md,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: T.r.sm, flexShrink: 0,
                  background: kit.playlist.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
                    backgroundImage: 'repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0 2px, transparent 2px 12px)',
                  }}/>
                  <Icon name="library_music" size={26} color="#FFFFFF" fill={1} style={{ position: 'relative' }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: T.font, fontSize: 13, fontWeight: 700,
                    color: T.c.n950, lineHeight: 1.3,
                  }}>
                    {kit.playlist.title}
                  </div>
                  <div style={{
                    fontFamily: T.font, fontSize: 11, color: T.c.n600, marginTop: 2,
                  }}>
                    {kit.playlist.subtitle}
                  </div>
                </div>
              </div>
              <KitTextButton onClick={handlePlaylistOpen} icon="open_in_new">
                Abrir no Spotify
              </KitTextButton>
            </KitSubsection>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Sub-section header + body ──────────────────────────────
function KitSubsection({ emoji, title, subtitle, children }) {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontFamily: T.font,
          fontSize: 14, fontWeight: 700, lineHeight: 1.3,
          color: T.c.n950,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span aria-hidden="true">{emoji}</span>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontFamily: T.font, fontSize: 11, lineHeight: 1.4, color: T.c.n600,
            marginTop: 2,
          }}>
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Wine mini-card optimized for horizontal scroll ─────────
function WineMiniCardKit({ wine }) {
  return (
    <div style={{
      flexShrink: 0, width: 140,
      background: T.c.n0,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.md,
      padding: 10,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <BottlePlaceholder width={120} height={88} label=""/>
      <div style={{
        fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.c.n950,
        lineHeight: 1.25,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', minHeight: 30,
      }}>
        {wine.name}
      </div>
      <div style={{
        fontFamily: T.font, fontSize: 10, color: T.c.n600,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {wine.region || wine.country}
      </div>
      <div style={{
        fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.c.p700,
        marginTop: 2,
      }}>
        R$ {wine.price.toFixed(2).replace('.', ',')}
      </div>
    </div>
  );
}

// ─── PDF thumbnail — stylized "page" preview ───────────────
function PDFThumbnail() {
  return (
    <div style={{
      width: 48, height: 60, borderRadius: 4,
      background: '#FFFFFF',
      border: `1px solid ${T.c.n300}`,
      position: 'relative', flexShrink: 0,
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Folded corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 0, height: 0,
        borderTop: `12px solid ${T.c.p100}`,
        borderLeft: `12px solid transparent`,
      }}/>
      {/* Faux text lines */}
      <div style={{ padding: '6px 5px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[16, 22, 14, 24, 18].map((w, i) => (
          <div key={i} style={{
            height: 2, borderRadius: 1, background: T.c.n300,
            width: `${w * 1.2}px`, maxWidth: '100%',
          }}/>
        ))}
      </div>
      {/* PDF badge */}
      <div style={{
        position: 'absolute', bottom: 4, left: 4,
        padding: '1px 5px',
        background: T.c.e700, color: '#FFFFFF',
        borderRadius: 3,
        fontFamily: T.mono, fontSize: 7, fontWeight: 700,
        letterSpacing: '0.3px',
      }}>
        PDF
      </div>
    </div>
  );
}

// ─── KitTextButton — small text-style link ─────────────────
function KitTextButton({ children, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: 8, padding: '6px 8px',
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: T.font, fontSize: 13, fontWeight: 600,
        color: T.c.p700,
      }}>
      {icon && <Icon name={icon} size={14} color={T.c.p700}/>}
      {children}
    </button>
  );
}

function EmptySubsectionState({ children }) {
  return (
    <div style={{
      padding: '16px 12px',
      background: T.c.n50, border: `1px dashed ${T.c.n300}`,
      borderRadius: T.r.md,
      fontFamily: T.font, fontSize: 12, lineHeight: 1.5,
      color: T.c.n600, textAlign: 'center',
    }}>
      {children}
    </div>
  );
}

// ─── Demo host — shows kit on a stub event-detail surface ──
function KitOrganizadorHostDemo({ templateId = 'churrasco_vinho' }) {
  const tpl = TEMPLATES.find(t => t.id === templateId) || null;
  const event = {
    id: 'evt_demo',
    title: 'Primeiro encontro — churrasco com vinho',
    type: 'jantar',
    template_id: templateId,
    date: '2026-05-23',
    time: '19:30',
    location: 'Casa do Diego · Lago Sul',
    confirmedCount: 8,
  };
  return (
    <div style={{
      flex: 1, padding: 16, background: T.c.n50,
      overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14,
      fontFamily: T.font,
    }}>
      {/* Stub event header */}
      <div style={{
        background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
        borderRadius: T.r.lg, padding: 16, color: T.c.n0,
      }}>
        <div style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.6px', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)', marginBottom: 4,
        }}>
          Detalhe do evento · você é o organizador
        </div>
        <div style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 18, fontWeight: 600, color: '#FFFFFF',
          letterSpacing: '-0.01em',
        }}>
          {event.title}
        </div>
      </div>

      {/* The kit itself */}
      <KitOrganizador
        eventData={event}
        templateData={tpl}
        onWineSwap={() => console.log('swap')}
        onPDFShare={() => console.log('pdf share')}
        onPDFView={() => console.log('pdf view')}
        onPlaylistOpen={() => console.log('playlist')}
      />
    </div>
  );
}

Object.assign(window, {
  KitOrganizador,
  KitOrganizadorHostDemo,
  KIT_BY_TEMPLATE,
  GENERIC_KIT,
  lookupKit,
});


export { EmptySubsectionState, GENERIC_KIT, KIT_BY_TEMPLATE, KitOrganizador, KitOrganizadorHostDemo, KitSubsection, KitTextButton, PDFThumbnail, WineMiniCardKit, lookupKit };
