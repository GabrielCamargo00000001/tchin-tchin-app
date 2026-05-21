/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { readEventDraft, writeEventDraft } from './screens-event-wizard-p1.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — 09.03 Wizard Criar Evento, Passo 3 de 5
// ────────────────────────────────────────────────────────────
// Sugestão de vinhos por faixa de preço (US-12-12-01). O organizador
// recebe 3 sugestões iniciais (uma por faixa) extraídas do catálogo real
// (MOCK_WINES) e pode:
//   • Trocar qualquer slot → abre WineSearchModal com a base
//   • Adicionar outro slot na mesma faixa
//   • Remover sugestões
//
// O toggle "Permitir membros sugerirem outros vinhos" controla se a
// degustação é fechada ou colaborativa (default ON pra reduzir fricção
// e dar voz à galera).

const PRICE_TIERS = [
  { id: 'budget',   label: 'Até R$60',         min: 0,   max: 60 },
  { id: 'mid',      label: 'R$60–120',         min: 60,  max: 120 },
  { id: 'premium',  label: 'Acima de R$120',   min: 120, max: Infinity },
];

function priceTierOf(price) {
  if (price < 60) return 'budget';
  if (price <= 120) return 'mid';
  return 'premium';
}

// Pré-seleciona 3 vinhos do catálogo (um por faixa) priorizando match
// alto e tipo apropriado pro evento.
function suggestWinesForEvent(eventType /* degustacao | jantar | festa | visita */) {
  const TINTO_TYPES = new Set(['Tinto']);
  const FESTA_TYPES = new Set(['Espumante', 'Branco', 'Rosé']);

  // Por tipo, define preferência (sem excluir; só prioriza ordenação)
  const prefers = (w) => {
    if (eventType === 'festa') return FESTA_TYPES.has(w.type);
    if (eventType === 'degustacao' || eventType === 'jantar' || eventType === 'visita') return TINTO_TYPES.has(w.type);
    return true;
  };

  return PRICE_TIERS.map(tier => {
    const pool = MOCK_WINES
      .filter(w => priceTierOf(w.price) === tier.id)
      .sort((a, b) => {
        // 1º critério: tipo preferido vence
        const ap = prefers(a) ? 1 : 0;
        const bp = prefers(b) ? 1 : 0;
        if (ap !== bp) return bp - ap;
        // 2º critério: maior match score
        return (b.match || 0) - (a.match || 0);
      });
    return pool.length ? [pool[0]] : [];
  });
}

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    eventType: string                 — tipo escolhido em 09.01 (default 'degustacao')
//    initialData?: {
//      slots: [ [Wine|null, …], [Wine|null, …], [Wine|null, …] ],
//      allowMemberSuggestions?: boolean,
//    }
//    onContinue: (data) => void
//    onBack: () => void
function WizardCriarEventoP3({ eventType = 'degustacao', initialData, onContinue, onBack }) {
  const init = initialData || {};
  const [slots, setSlots] = React.useState(
    init.slots || suggestWinesForEvent(eventType)
  );
  const [allowMembers, setAllowMembers] = React.useState(
    init.allowMemberSuggestions !== false // default ON
  );
  const [swapping, setSwapping] = React.useState(null); // { tierIndex, slotIndex } | null

  const addSlot = (tierIndex) => {
    setSlots(prev => prev.map((s, i) => i === tierIndex ? [...s, null] : s));
  };
  const removeSlot = (tierIndex, slotIndex) => {
    setSlots(prev => prev.map((s, i) => i === tierIndex ? s.filter((_, j) => j !== slotIndex) : s));
  };
  const replaceSlot = (tierIndex, slotIndex, wine) => {
    setSlots(prev => prev.map((s, i) => i === tierIndex
      ? s.map((w, j) => j === slotIndex ? wine : w)
      : s));
  };

  const totalWines = slots.reduce((acc, tier) => acc + tier.filter(Boolean).length, 0);

  const handleContinue = () => {
    fbEvent('event_p3_completed', {
      total_wines: totalWines,
      allow_member_suggestions: allowMembers,
    });
    const data = { slots, allowMemberSuggestions: allowMembers };
    const draft = readEventDraft() || {};
    writeEventDraft({ ...draft, wines: data, step: 4 });
    onContinue(data);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950,
          }}>
          <Icon name="close" size={24}/>
        </button>
        <div style={{
          flex: 1, textAlign: 'center',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 17, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Criar evento
        </div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }} aria-label="Passo 3 de 5">
          3 de 5
        </div>
      </header>

      {/* Progress bar — 3 de 5 burgundy */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={3} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= 2 ? T.c.p700 : T.c.n200,
            transition: 'background 240ms',
          }}/>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 22, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Vinhos da degustação
          </h2>
          <div style={{ height: 12 }}/>
          <p style={{
            margin: 0,
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            Sugerimos 3 por faixa de preço. Você pode trocar.
          </p>

          <div style={{ height: 24 }}/>

          {/* ── Tier sections ── */}
          {PRICE_TIERS.map((tier, tierIndex) => (
            <PriceTierSection
              key={tier.id}
              tier={tier}
              slots={slots[tierIndex] || []}
              onSwap={(slotIndex) => setSwapping({ tierIndex, slotIndex })}
              onRemove={(slotIndex) => removeSlot(tierIndex, slotIndex)}
              onAdd={() => addSlot(tierIndex)}
            />
          ))}

          <div style={{ height: 16 }}/>

          {/* Allow members toggle */}
          <AllowMembersToggle value={allowMembers} onChange={setAllowMembers}/>

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* ── Bottom CTAs ── */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
        flexShrink: 0,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          disabled={totalWines === 0}
          onClick={handleContinue}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="event_wizard_4">
          Continuar
        </Button>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', alignSelf: 'center',
            fontFamily: T.font, fontSize: 13, fontWeight: 500,
            color: T.c.n600, letterSpacing: '0.1px',
          }}>
          Voltar
        </button>
      </div>

      {/* Wine search modal */}
      {swapping && (
        <WineSearchModal
          tier={PRICE_TIERS[swapping.tierIndex]}
          currentWine={slots[swapping.tierIndex][swapping.slotIndex]}
          onPick={(wine) => {
            replaceSlot(swapping.tierIndex, swapping.slotIndex, wine);
            fbEvent('event_wine_swapped', { tier_id: PRICE_TIERS[swapping.tierIndex].id, wine_id: wine.id });
            setSwapping(null);
          }}
          onClose={() => setSwapping(null)}
        />
      )}
    </div>
  );
}

// ─── PriceTierSection ───────────────────────────────────────
function PriceTierSection({ tier, slots, onSwap, onRemove, onAdd }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{
          fontFamily: T.font,
          fontSize: 11, fontWeight: 700, lineHeight: 1.4,
          color: T.c.p700,
          textTransform: 'uppercase', letterSpacing: '0.6px',
        }}>
          {tier.label}
        </span>
        <span style={{
          fontFamily: T.mono, fontSize: 11, fontWeight: 500, color: T.c.n600,
        }}>
          {slots.filter(Boolean).length} {slots.filter(Boolean).length === 1 ? 'vinho' : 'vinhos'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slots.length === 0 ? (
          <EmptyTierSlot onAdd={onAdd}/>
        ) : slots.map((wine, i) => (
          wine
            ? <WineSuggestionCard
                key={`${wine.id}-${i}`}
                wine={wine}
                onSwap={() => onSwap(i)}
                onRemove={() => onRemove(i)}
                showRemove={slots.length > 1 || slots.filter(Boolean).length > 1}
              />
            : <EmptyTierSlot key={`empty-${i}`} onAdd={() => onSwap(i)} placeholder/>
        ))}
        {slots.length > 0 && (
          <Button
            variant="ghost" size="sm" fullWidth
            onClick={onAdd}
            leading={<Icon name="add" size={16}/>}>
            Adicionar outro nesta faixa
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── WineSuggestionCard ─────────────────────────────────────
function WineSuggestionCard({ wine, onSwap, onRemove, showRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 12,
      background: T.c.n50, border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
    }}>
      <BottlePlaceholder width={48} height={64} label=""/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950,
          lineHeight: 1.3, marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {wine.name}
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 11, color: T.c.n600,
          lineHeight: 1.3, marginBottom: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wine.region || wine.country} · {wine.type}
        </div>
        <div style={{
          fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.c.p700,
        }}>
          R$ {wine.price.toFixed(2).replace('.', ',')}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <button
          onClick={onSwap}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 8px',
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            color: T.c.p700,
          }}>
          Trocar
        </button>
        {showRemove && (
          <button
            onClick={onRemove}
            aria-label="Remover este vinho"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.c.n600,
            }}>
            <Icon name="delete_outline" size={16}/>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── EmptyTierSlot ──────────────────────────────────────────
function EmptyTierSlot({ onAdd, placeholder }) {
  return (
    <button
      onClick={onAdd}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '20px 16px',
        background: 'transparent',
        border: `2px dashed ${T.c.n300}`,
        borderRadius: T.r.lg,
        cursor: 'pointer',
        fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.c.n800,
      }}>
      <Icon name="add" size={18} color={T.c.n600}/>
      {placeholder ? 'Escolher vinho desta faixa' : 'Adicionar primeiro vinho'}
    </button>
  );
}

// ─── AllowMembersToggle ─────────────────────────────────────
function AllowMembersToggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 14,
        background: T.c.n50, border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg, cursor: 'pointer',
        textAlign: 'left',
      }}>
      <Icon name="group_add" size={22} color={value ? T.c.p700 : T.c.n600}/>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: T.font, fontSize: 14, fontWeight: 600,
          color: T.c.n950, lineHeight: 1.3,
        }}>
          Permitir membros sugerirem outros vinhos
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 12, color: T.c.n600,
          lineHeight: 1.4, marginTop: 2,
        }}>
          Sua confraria fica colaborativa.
        </div>
      </div>
      {/* iOS-style toggle */}
      <div style={{
        width: 40, height: 24, borderRadius: 12,
        background: value ? T.c.p700 : T.c.n300,
        position: 'relative', flexShrink: 0,
        transition: 'background 180ms',
      }}>
        <div style={{
          position: 'absolute', top: 2,
          left: value ? 18 : 2,
          width: 20, height: 20, borderRadius: '50%',
          background: T.c.n0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'left 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}/>
      </div>
    </button>
  );
}

// ─── WineSearchModal — pick a wine from the catalogue ──────
function WineSearchModal({ tier, currentWine, onPick, onClose }) {
  const [q, setQ] = React.useState('');
  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = MOCK_WINES
    .filter(w => priceTierOf(w.price) === tier.id)
    .filter(w => {
      if (!q.trim()) return true;
      const t = (w.name + ' ' + w.producer + ' ' + w.country + ' ' + w.region).toLowerCase();
      return t.includes(q.toLowerCase());
    });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 80,
        background: 'rgba(15,15,15,0.60)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'tcFadeIn 180ms ease',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true"
        style={{
          width: '100%', maxHeight: '85%',
          background: T.c.n0,
          borderTopLeftRadius: T.r.lg, borderTopRightRadius: T.r.lg,
          padding: '12px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          animation: 'tcSlideUp 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontFamily: T.font,
          display: 'flex', flexDirection: 'column',
        }}>
        <div style={{
          width: 32, height: 4, borderRadius: 2,
          background: T.c.n300, margin: '0 auto 12px',
        }}/>
        <div style={{ padding: '0 16px' }}>
          <h3 style={{
            margin: 0, marginBottom: 4,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 18, fontWeight: 600, color: T.c.n950,
          }}>
            Escolher vinho — {tier.label}
          </h3>
          <p style={{
            margin: 0, marginBottom: 12,
            fontFamily: T.font, fontSize: 12, color: T.c.n600,
          }}>
            {results.length} {results.length === 1 ? 'opção' : 'opções'} no catálogo
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            background: T.c.n50, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
            marginBottom: 12,
          }}>
            <Icon name="search" size={18} color={T.c.n600}/>
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar por nome ou produtor"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: T.font, fontSize: 14, color: T.c.n950,
              }}
            />
            {q && (
              <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <Icon name="close" size={16} color={T.c.n600}/>
              </button>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          {results.length === 0 ? (
            <div style={{
              padding: '32px 16px', textAlign: 'center',
              fontFamily: T.font, fontSize: 13, color: T.c.n600,
            }}>
              Nenhum vinho encontrado nesta faixa.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map(w => (
                <button
                  key={w.id}
                  onClick={() => onPick(w)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: 10,
                    background: currentWine && currentWine.id === w.id ? T.c.p50 : T.c.n0,
                    border: `1px solid ${currentWine && currentWine.id === w.id ? T.c.p700 : T.c.n200}`,
                    borderRadius: T.r.md,
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <BottlePlaceholder width={36} height={48} label=""/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.c.n950,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {w.name}
                    </div>
                    <div style={{
                      fontFamily: T.font, fontSize: 11, color: T.c.n600,
                    }}>
                      {w.region || w.country} · {w.type}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.c.p700,
                    flexShrink: 0,
                  }}>
                    R$ {w.price.toFixed(2).replace('.', ',')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarEventoP3Screen({ go }) {
  const draft = React.useMemo(() => readEventDraft() || {}, []);
  const eventType = draft.type || 'degustacao';

  const onContinue = (data) => {
    go('event-wizard-4');
  };
  const onBack = () => go('back');

  return (
    <WizardCriarEventoP3
      eventType={eventType}
      initialData={draft.wines}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}

Object.assign(window, {
  WizardCriarEventoP3,
  WizardCriarEventoP3Screen,
  PRICE_TIERS,
  suggestWinesForEvent,
  priceTierOf,
});


export { AllowMembersToggle, EmptyTierSlot, PRICE_TIERS, PriceTierSection, WineSearchModal, WineSuggestionCard, WizardCriarEventoP3, WizardCriarEventoP3Screen, priceTierOf, suggestWinesForEvent };
