/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 10.01 Checklist do Organizador
// ────────────────────────────────────────────────────────────
// Card que aparece SÓ pra admin na Tela da Confraria. Cinco passos
// concretos pra confraria "ganhar vida". US-12-10-03.
//
// As 5 conquistas:
//   1. tema_descricao    — auto-completa quando user fecha 08.03
//   2. foto_capa         — auto-completa quando user trocou foto em 08.03
//   3. convidou_amigos   — quando invites_sent ≥ 3
//   4. primeiro_evento   — quando first_event_created === true
//   5. primeiro_post     — quando first_post_count === 1
//
// Quando todos os 5 batem, mostra o badge "Confraria no ar 🍷" e
// persiste por 24h antes de sumir (controle externo via `dismissedAt`).

const CHECKLIST_ITEMS = [
  { id: 'tema_descricao',  label: 'Escolhi tema e descrição',     action: 'edit_brotherhood', autoComplete: true },
  { id: 'foto_capa',       label: 'Adicionei foto de capa',       action: 'change_cover',     autoComplete: true },
  { id: 'convidou_amigos', label: 'Convidei 3 amigos',            action: 'invite_friends',   autoComplete: false },
  { id: 'primeiro_evento', label: 'Marquei o primeiro encontro',  action: 'create_event',     autoComplete: false },
  { id: 'primeiro_post',   label: 'Fiz o primeiro post no feed',  action: 'compose_post',     autoComplete: false },
];

// Inject one-shot keyframes for the completion pulse
if (typeof document !== 'undefined' && !document.getElementById('tc-checklist-kf')) {
  const s = document.createElement('style');
  s.id = 'tc-checklist-kf';
  s.textContent = `
    @keyframes tcChecklistPulse {
      0%   { transform: scale(1);   }
      40%  { transform: scale(1.18); }
      100% { transform: scale(1);   }
    }
    @keyframes tcChecklistCheck {
      0%   { opacity: 0; transform: scale(0.5); }
      60%  { opacity: 1; transform: scale(1.15); }
      100% { opacity: 1; transform: scale(1);   }
    }
    @keyframes tcChecklistBadgePop {
      0%   { transform: scale(0.85); opacity: 0; }
      60%  { transform: scale(1.08); opacity: 1; }
      100% { transform: scale(1);    opacity: 1; }
    }
  `;
  document.head.appendChild(s);
}

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    completedItems: string[]               — IDs do CHECKLIST_ITEMS já completos
//    onItemTap: (itemId: string) => void    — chamado quando user toca item incompleto
function ChecklistOrganizador({ completedItems = [], onItemTap }) {
  // Track previously-completed set to animate newly-flipped items
  const prevCompletedRef = React.useRef(new Set(completedItems));
  const [justCompleted, setJustCompleted] = React.useState(new Set());

  React.useEffect(() => {
    const current = new Set(completedItems);
    const prev = prevCompletedRef.current;
    const newlyCompleted = [...current].filter(id => !prev.has(id));
    if (newlyCompleted.length > 0) {
      setJustCompleted(new Set(newlyCompleted));
      newlyCompleted.forEach(id => fbEvent('checklist_item_completed', { item_id: id }));
      // Clear the "just completed" state after animation
      const timeout = setTimeout(() => setJustCompleted(new Set()), 800);
      // Detect full completion
      if (current.size === CHECKLIST_ITEMS.length && prev.size < CHECKLIST_ITEMS.length) {
        fbEvent('brotherhood_checklist_completed');
      }
      prevCompletedRef.current = current;
      return () => clearTimeout(timeout);
    }
    prevCompletedRef.current = current;
  }, [completedItems]);

  const completedSet = React.useMemo(() => new Set(completedItems), [completedItems]);
  const completedCount = CHECKLIST_ITEMS.filter(it => completedSet.has(it.id)).length;
  const allDone = completedCount === CHECKLIST_ITEMS.length;

  return (
    <section
      data-tour-anchor="confraria-checklist"
      aria-label="Checklist do organizador"
      style={{
        background: T.c.p50,
        border: `1px solid ${T.c.p100}`,
        borderRadius: T.r.lg,
        padding: 16,
        fontFamily: T.font,
      }}>
      {/* ── Top row ── */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
        marginBottom: 12,
      }}>
        <h3 style={{
          margin: 0,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 16, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
          textWrap: 'balance',
        }}>
          Colocando de pé sua confraria
        </h3>
        <span style={{
          flexShrink: 0,
          fontFamily: T.mono, fontSize: 11, fontWeight: 600,
          color: T.c.n800,
          background: T.c.n0,
          padding: '3px 8px',
          borderRadius: T.r.full,
          border: `1px solid ${T.c.p100}`,
        }}>
          {completedCount}/{CHECKLIST_ITEMS.length} feito
        </span>
      </div>

      {/* ── Items ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {CHECKLIST_ITEMS.map(item => (
          <ChecklistItem
            key={item.id}
            item={item}
            completed={completedSet.has(item.id)}
            justCompleted={justCompleted.has(item.id)}
            onTap={onItemTap}
          />
        ))}
      </div>

      {/* ── Bottom: progress OR celebration ── */}
      <div style={{ marginTop: 14 }}>
        {allDone ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            background: T.c.p700, color: T.c.n0,
            borderRadius: T.r.full,
            fontFamily: T.font, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.3px',
            animation: 'tcChecklistBadgePop 420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}>
            <Icon name="check_circle" size={14} color={T.c.n0} fill={1}/>
            Confraria no ar 🍷
          </div>
        ) : (
          <div role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={CHECKLIST_ITEMS.length}>
            <div style={{ display: 'flex', gap: 4 }}>
              {CHECKLIST_ITEMS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < completedCount ? T.c.p700 : T.c.p100,
                  transition: 'background 320ms',
                }}/>
              ))}
            </div>
            <div style={{
              marginTop: 6,
              fontFamily: T.font, fontSize: 11, color: T.c.n800,
              lineHeight: 1.4,
            }}>
              {nextStepHint(completedSet)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ChecklistItem ──────────────────────────────────────────
function ChecklistItem({ item, completed, justCompleted, onTap }) {
  const interactive = !completed && typeof onTap === 'function';

  return (
    <button
      onClick={() => interactive && onTap(item.id)}
      disabled={!interactive}
      aria-checked={completed}
      role="checkbox"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '8px 10px',
        background: completed ? T.c.n100 : 'transparent',
        border: 'none',
        borderRadius: T.r.md,
        cursor: interactive ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'background 200ms',
        fontFamily: T.font,
      }}>
      {/* Checkbox visual */}
      <div style={{
        width: 24, height: 24, flexShrink: 0,
        borderRadius: 6,
        background: completed ? T.c.p700 : T.c.n0,
        border: completed ? 'none' : `2px solid ${T.c.n400}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: justCompleted ? 'tcChecklistPulse 600ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
        transition: 'background 220ms, border-color 220ms',
      }}>
        {completed && (
          <span style={{
            display: 'flex',
            animation: justCompleted ? 'tcChecklistCheck 400ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
          }}>
            <Icon name="check" size={16} color="#FFFFFF" weight={700}/>
          </span>
        )}
      </div>

      {/* Label */}
      <span style={{
        flex: 1, minWidth: 0,
        fontSize: 13, fontWeight: 500,
        color: completed ? T.c.n600 : T.c.n950,
        lineHeight: 1.4,
        textDecoration: completed ? 'line-through' : 'none',
        textDecorationColor: T.c.n400,
        transition: 'color 220ms',
      }}>
        {item.label}
      </span>

      {/* Trailing chevron pra incompleto interativo */}
      {interactive && (
        <Icon name="chevron_right" size={18} color={T.c.n400} style={{ flexShrink: 0 }}/>
      )}
    </button>
  );
}

// ─── Helper: hint do próximo passo ──────────────────────────
function nextStepHint(completedSet) {
  const next = CHECKLIST_ITEMS.find(it => !completedSet.has(it.id));
  if (!next) return '';
  return `Próximo: ${next.label.toLowerCase()}`;
}

// ─── Demo host pra canvas — Tela da Confraria com checklist ──
// Stub leve da brotherhood detail só pra demonstrar o card em contexto.
function ChecklistHostDemo({ completedItems = [] }) {
  const [items, setItems] = React.useState(completedItems);

  const onItemTap = (id) => {
    // No demo, completa o item ao tocar pra mostrar a animação
    if (items.includes(id)) return;
    setItems(prev => [...prev, id]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px', background: T.c.n0,
        borderBottom: `1px solid ${T.c.n200}`, minHeight: 56, flexShrink: 0,
      }}>
        <Icon name="arrow_back" size={24} color={T.c.n950}/>
        <div style={{
          flex: 1,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 17, fontWeight: 600, color: T.c.n950,
        }}>
          Tchin do Cerrado
        </div>
        <span style={{
          padding: '3px 10px', borderRadius: T.r.full,
          background: T.c.p700, color: T.c.n0,
          fontFamily: T.font, fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          Admin
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ChecklistOrganizador completedItems={items} onItemTap={onItemTap}/>

        {/* Stub: trecho da Tela da Confraria abaixo */}
        <div style={{
          background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg,
          padding: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="forum" size={18} color={T.c.n600}/>
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950 }}>
              Feed
            </div>
          </div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.c.n600 }}>
            Ainda sem posts. Tap em "Fiz o primeiro post" pra começar.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ChecklistOrganizador,
  ChecklistHostDemo,
  CHECKLIST_ITEMS,
});


export { CHECKLIST_ITEMS, ChecklistHostDemo, ChecklistItem, ChecklistOrganizador, nextStepHint };
