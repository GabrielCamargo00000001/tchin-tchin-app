/* eslint-disable */
// @ts-nocheck
// Multi-seleção de vinhos do catálogo (#9). Reutilizado no Marketplace
// (adicionar vários ao carrinho) e na Adega (adicionar vários à adega).
// Padrão visual do modal segue o do wizard de evento.
import React from 'react';
import { Button } from './components.jsx';
import { WineCard } from './cards.jsx';
import { Icon, T } from './tokens.jsx';

function MultiSelectWinesModal({
  title = 'Selecionar vinhos',
  confirmLabel = (n) => `Adicionar ${n}`,
  wines,
  onConfirm,
  onClose,
}) {
  const catalog = wines || (typeof window !== 'undefined' && window.MOCK_WINES) || [];
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState([]); // ids

  const list = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((w) =>
      (w.name || '').toLowerCase().includes(q) ||
      (w.producer || '').toLowerCase().includes(q)
    );
  }, [query, catalog]);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const count = selected.length;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(15,15,15,0.5)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'tcFadeIn 200ms ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        display: 'flex', flexDirection: 'column', maxHeight: '88%', minHeight: 0,
        animation: 'tcSlideUp 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        {/* Header + busca */}
        <div style={{ padding: '16px 20px 8px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: T.c.n300, margin: '0 auto 16px' }}/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: T.c.n950 }}>{title}</div>
            <button onClick={onClose} aria-label="Fechar" style={{
              width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="close" size={22} color={T.c.n800}/>
            </button>
          </div>
          <div style={{
            marginTop: 12, height: 44, padding: '0 12px', borderRadius: T.r.md,
            background: T.c.n0, border: `1px solid ${T.c.n300}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon name="search" size={18} color={T.c.n600}/>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar vinho"
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: T.font, fontSize: 14, background: 'transparent', color: T.c.n950 }}
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Limpar busca" style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="close" size={18} color={T.c.n600}/>
              </button>
            )}
          </div>
        </div>

        {/* Lista (grade com checkbox) */}
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '8px 20px' }}>
          {list.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: T.c.n600, fontSize: 14 }}>Nenhum vinho encontrado.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {list.map((w) => {
                const sel = selected.includes(w.id);
                return (
                  <div key={w.id} style={{
                    position: 'relative', borderRadius: T.r.md,
                    outline: sel ? `2px solid ${T.c.p700}` : 'none', outlineOffset: -2,
                  }}>
                    <WineCard wine={w} layout="grid" onClick={() => toggle(w.id)}/>
                    {sel && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%',
                        background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 0 2px ${T.c.n0}`, pointerEvents: 'none',
                      }}>
                        <Icon name="check" size={14} color="#fff" weight={700}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmar */}
        <div style={{
          flexShrink: 0, padding: '12px 20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          borderTop: `1px solid ${T.c.n100}`, background: T.c.n0,
        }}>
          <Button variant="primary" size="lg" fullWidth disabled={count === 0} onClick={() => onConfirm(selected)}>
            {count > 0 ? confirmLabel(count) : 'Selecione ao menos 1'}
          </Button>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  Object.assign(window, { MultiSelectWinesModal });
}

export { MultiSelectWinesModal };
