/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { CuriosityCard, WineCard } from './cards.jsx';
import { Button, Card, Chip, MatchBadge, SubHeader } from './components.jsx';
import { MOCK_USER, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { EmptyState } from './f19_03_SecaoAprenda.jsx';
import { PaladarRadar } from './screens-quiz.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';
import { MultiSelectWinesModal } from './multi-select-wines.jsx';

// Tchin Tchin — Descobrir (home, marketplace, detalhe vinho, scanner)

// ─── Descobrir Home ────────────────────────────────────────
function DescobrirHome({ go, ctx }) {
  const quizDone = !!(ctx?.user?.paladar);
  const sorted = [...MOCK_WINES].sort((a, b) => b.match - a.match);
  const hero = sorted[0];
  const grid = sorted.slice(1, 5);

  const categorias = [
    { id: 'iniciantes', label: 'Pra iniciantes', emoji: '🍷' },
    { id: 'alta',       label: 'Em alta',        emoji: '⭐' },
    { id: 'ate50',      label: 'Até R$ 50',      emoji: '💰' },
    { id: 'brasil',     label: 'Brasileiros',    emoji: '🇧🇷' },
    { id: 'chile',      label: 'Chilenos',       emoji: '🇨🇱' },
    { id: 'especiais',  label: 'Especiais',      emoji: '💎' },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.c.n50 }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 4 }}>Olá, {ctx.user.name.split(' ')[0]}</div>
        <div style={{ ...T.t.body, color: T.c.n600 }}>Descubra a próxima garrafa pra abrir.</div>
      </div>

      {/* Hero — Pra você, hoje */}
      <div style={{ padding: '8px 16px 0' }}>
        {quizDone ? (
          <div onClick={() => go('wine', { wine: hero })} style={{
            background: T.c.p50, border: `1px solid ${T.c.p100}`, borderRadius: T.r.lg,
            padding: 16, cursor: 'pointer', boxShadow: T.shadow?.e1 || '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 10 }}>PRA VOCÊ, HOJE</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Bottle placeholder */}
              <div style={{
                width: 84, height: 132, borderRadius: 10, background: `linear-gradient(180deg, ${T.c.p900}, ${T.c.p700})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative',
                boxShadow: '0 6px 14px rgba(74,31,36,0.25)',
              }}>
                <Icon name="wine_bar" size={40} color="rgba(255,255,255,0.55)"/>
                <div style={{ position: 'absolute', bottom: 12, left: 6, right: 6, height: 18, background: 'rgba(255,255,255,0.92)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: T.c.p900, letterSpacing: 0.3, textAlign: 'center', padding: '0 2px' }}>CATENA</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.c.n950, lineHeight: 1.25, marginBottom: 4 }}>{hero.name}</div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 10 }}>{hero.producer} · {hero.country}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: T.r.full,
                  background: T.c.a700, color: '#fff', fontSize: 12, fontWeight: 700, marginBottom: 10,
                }}>
                  <Icon name="auto_awesome" size={14} color="#fff"/>
                  {hero.match}% pra você
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.c.n950, fontFamily: T.font }}>R$ {hero.price.toFixed(2).replace('.', ',')}</div>
              </div>
            </div>
            <Button variant="primary" size="md" fullWidth onClick={(e) => { e.stopPropagation?.(); go('wine', { wine: hero }); }}
              trailing={<Icon name="arrow_forward" size={16}/>}
              style={{ marginTop: 14 }}>
              Ver detalhes
            </Button>
          </div>
        ) : (
          <div style={{ background: T.c.p50, border: `1px solid ${T.c.p100}`, borderRadius: T.r.lg, padding: 20, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon name="quiz" size={26} color="#fff"/>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n950, marginBottom: 6 }}>Quer recomendações pra você?</div>
            <div style={{ fontSize: 13, color: T.c.n800, marginBottom: 14, maxWidth: 280, margin: '0 auto 14px' }}>Faça o quiz de paladar — 5 perguntas, 2 minutos. Aí a gente sabe o que combina contigo.</div>
            <Button variant="primary" size="md" onClick={() => go('quiz')}>Fazer quiz</Button>
          </div>
        )}
      </div>

      {/* Card CTA scanner */}
      <div style={{ padding: '16px 16px 0' }}>
        <div onClick={() => go('scanner')} style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: 14,
          background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, cursor: 'pointer',
          boxShadow: T.shadow?.e1 || '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: T.r.md, background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="qr_code_scanner" size={28} color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>Escanear rótulo</div>
            <div style={{ fontSize: 13, color: T.c.n600, lineHeight: 1.35 }}>Tire foto da garrafa e descubra seu match.</div>
          </div>
          <Icon name="arrow_forward_ios" size={16} color={T.c.n600}/>
        </div>
      </div>

      {/* 🆕 Marketplace de Experiência (Gabriel jun/2026) */}
      <div style={{ padding: '16px 16px 0' }}>
        <button onClick={() => go('confraria-detalhe', { confraria: { name: 'Brindar em Brasília', _experienciaTab: true } })} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 14,
          background: `linear-gradient(135deg, ${T.c.a100} 0%, ${T.c.p50} 100%)`,
          border: `1px solid ${T.c.a700}`, borderRadius: T.r.lg, cursor: 'pointer',
          textAlign: 'left', boxShadow: T.shadow?.e1 || '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: T.r.md, background: T.c.a700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="storefront" size={28} color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ padding: '2px 7px', background: T.c.a700, color: T.c.n0, borderRadius: T.r.full, fontSize: 9, fontWeight: 800 }}>NOVO</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>Marketplace de Experiência</span>
            </div>
            <div style={{ fontSize: 12.5, color: T.c.n800, lineHeight: 1.4 }}>
              Vinícolas, kits, locais, conteúdo. Em R$ ou em cristais do Treino.
            </div>
          </div>
          <Icon name="arrow_forward_ios" size={16} color={T.c.n600}/>
        </button>
      </div>

      {/* Categorias */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 12 }}>Categorias</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categorias.map(c => (
            <button key={c.id} onClick={() => go('marketplace', { filter: c.id })} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 14px', borderRadius: T.r.full,
              background: T.c.n0, border: `1px solid ${T.c.n300}`, color: T.c.n950,
              fontSize: 13, fontWeight: 600, fontFamily: T.font, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 15 }}>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace preview */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ ...T.t.h2, color: T.c.n950 }}>Marketplace</div>
          <button onClick={() => go('marketplace')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, color: T.c.p700, fontSize: 13, fontWeight: 600 }}>
            Ver tudo →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {grid.map(w => <WineCard key={w.id} wine={w} onClick={() => go('wine', { wine: w })} compact/>)}
        </div>
        <Button variant="secondary" size="md" fullWidth onClick={() => go('marketplace')}
          trailing={<Icon name="arrow_forward" size={16}/>}
          style={{ marginTop: 14 }}>
          Ver mais vinhos
        </Button>
      </div>

      <CuriosityCardSection/>
      <div style={{ height: 24 }}/>
    </div>
  );
}
function CuriosityCardSection() {
  return (
    <div style={{ padding: '8px 16px 0' }}>
      <CuriosityCard
        topic="Uva da semana"
        title="Tannat"
        text="Originária do sudoeste francês, a Tannat encontrou no Uruguai sua segunda casa. Tânica, profunda, com notas de ameixa preta e couro — pede comida com gordura."
        source="Sommelier Convidado · Diego Reis"
      />
    </div>
  );
}

// ─── Marketplace lista ─────────────────────────────────────
function MarketplaceScreen({ go, ctx }) {
  const [query, setQuery] = React.useState('');
  const [filtersActive, setFiltersActive] = React.useState({}); // {tipos:[], paises:[], minMatch:0, maxPrice:500}
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [multiOpen, setMultiOpen] = React.useState(false); // #9 — multi-add ao carrinho
  const [loading, setLoading] = React.useState(true);
  const quizDone = !!(ctx?.user?.paladar);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const activeCount = (
    (filtersActive.tipos?.length || 0) +
    (filtersActive.paises?.length || 0) +
    (filtersActive.uvas?.length || 0) +
    (filtersActive.minMatch ? 1 : 0) +
    (filtersActive.maxPrice && filtersActive.maxPrice < 500 ? 1 : 0)
  );

  let wines = [...MOCK_WINES];
  if (query.trim()) {
    const q = query.toLowerCase();
    wines = wines.filter(w => w.name.toLowerCase().includes(q) || w.producer.toLowerCase().includes(q));
  }
  if (filtersActive.tipos?.length) wines = wines.filter(w => filtersActive.tipos.includes(w.type));
  if (filtersActive.paises?.length) wines = wines.filter(w => filtersActive.paises.includes(w.country));
  if (filtersActive.uvas?.length) wines = wines.filter(w => filtersActive.uvas.some(u => (w.uvas || '').toLowerCase().includes(u.toLowerCase())));
  if (filtersActive.minMatch) wines = wines.filter(w => (w.match || 0) >= filtersActive.minMatch);
  if (filtersActive.maxPrice && filtersActive.maxPrice < 500) wines = wines.filter(w => w.price <= filtersActive.maxPrice);
  wines = wines.sort((a, b) => (b.match || 0) - (a.match || 0));

  const clearFilters = () => { setFiltersActive({}); setQuery(''); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50 }}>
      <SubHeader title="Marketplace" onBack={() => go('back')}/>

      {/* Action row: Filtrar + Escanear + Desejos */}
      <div style={{ padding: '4px 16px 12px', display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={() => setSheetOpen(true)} onContextMenu={(e) => { e.preventDefault(); go('filtros-avancados', { filters: filtersActive }); }} style={{
          flex: 1, height: 44, padding: '0 14px', borderRadius: T.r.md,
          background: activeCount > 0 ? T.c.p50 : T.c.n0,
          border: `1px solid ${activeCount > 0 ? T.c.p300 : T.c.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: 600,
          color: activeCount > 0 ? T.c.p700 : T.c.n950,
        }}>
          <Icon name="tune" size={18} color={activeCount > 0 ? T.c.p700 : T.c.n800}/>
          Filtrar
          {activeCount > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, padding: '0 6px', borderRadius: T.r.full, background: T.c.p700, color: '#fff', fontSize: 11, fontWeight: 700 }}>{activeCount}</span>
          )}
        </button>
        <button onClick={() => go('filtros-avancados', { filters: filtersActive })} aria-label="Filtros avançados" style={{
          width: 44, height: 44, borderRadius: T.r.md,
          background: T.c.n0, border: `1px solid ${T.c.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="tune" size={18} color={T.c.n800} fill={1}/>
        </button>
        <button onClick={() => go('lista-desejos')} aria-label="Lista de desejos" style={{
          width: 44, height: 44, borderRadius: T.r.md,
          background: T.c.n0, border: `1px solid ${T.c.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="favorite_border" size={18} color={T.c.n800}/>
        </button>
        <button onClick={() => go('carrinho')} aria-label="Carrinho" style={{
          width: 44, height: 44, borderRadius: T.r.md,
          background: T.c.n0, border: `1px solid ${T.c.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
        }}>
          <Icon name="shopping_cart" size={18} color={T.c.n800}/>
          <span style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9,
            background: T.c.p700, color: T.c.n0, fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${T.c.n0}`,
          }}>2</span>
        </button>
      </div>
      <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
        <button onClick={() => go('scanner')} style={{
          width: '100%', height: 44, padding: '0 14px', borderRadius: T.r.md,
          background: T.c.p700, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: 600, color: '#fff',
        }}>
          <Icon name="qr_code_scanner" size={18} color="#fff"/>
          Escanear rótulo
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
        <div style={{
          height: 44, padding: '0 12px', borderRadius: T.r.md,
          background: T.c.n0, border: `1px solid ${T.c.n300}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="search" size={18} color={T.c.n600}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Digite o nome do vinho"
            style={{ flex: 1, border: 'none', outline: 'none', fontFamily: T.font, fontSize: 14, background: 'transparent', color: T.c.n950 }}/>
          {query && (
            <button onClick={() => setQuery('')} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={18} color={T.c.n600}/>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {/* No quiz banner */}
        {!quizDone && (
          <div style={{
            padding: 12, marginBottom: 12, borderRadius: T.r.md,
            background: T.c.i100, border: `1px solid ${T.c.i700}33`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon name="info" size={20} color={T.c.i700}/>
            <div style={{ flex: 1, fontSize: 13, color: T.c.n800, lineHeight: '18px' }}>
              Faça o <strong style={{ color: T.c.p700 }}>quiz de paladar</strong> para ver vinhos compatíveis.
            </div>
            <button onClick={() => go('quiz')} style={{ padding: '6px 12px', borderRadius: T.r.sm, background: T.c.p700, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: T.font, cursor: 'pointer' }}>Fazer</button>
          </div>
        )}

        {/* h2 + Adicionar vários (#9) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 12px' }}>
          <div style={{ ...T.t.h2, color: T.c.n950 }}>
            {quizDone ? 'Vinhos pra você' : 'Todos os vinhos'}
            {!loading && wines.length > 0 && (
              <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400, marginLeft: 8 }}>· {wines.length}</span>
            )}
          </div>
          <button onClick={() => setMultiOpen(true)} aria-label="Adicionar vários ao carrinho" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', flexShrink: 0,
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.p700, fontFamily: T.font, fontSize: 13, fontWeight: 700,
          }}>
            <Icon name="library_add" size={16}/>
            Adicionar vários
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ borderRadius: T.r.md, background: T.c.n0, overflow: 'hidden', border: `1px solid ${T.c.n200}` }}>
                <div style={{ aspectRatio: '4/3', background: T.c.n100 }}/>
                <div style={{ padding: 12 }}>
                  <div style={{ width: '90%', height: 12, background: T.c.n100, borderRadius: 4, marginBottom: 8 }}/>
                  <div style={{ width: '50%', height: 12, background: T.c.n100, borderRadius: 4, marginBottom: 8 }}/>
                  <div style={{ width: '70%', height: 12, background: T.c.n100, borderRadius: 4 }}/>
                </div>
              </div>
            ))}
          </div>
        ) : wines.length === 0 ? (
          <EmptyState icon="search_off" title="Nenhum vinho com esses filtros"
            description="Tenta ajustar os filtros ou explorar outras categorias."
            primary={{ label: 'Limpar filtros', onClick: clearFilters }}/>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {wines.map(w => <WineCard key={w.id} wine={w} layout="grid" onClick={() => go('wine', { wine: w })}/>)}
          </div>
        )}
      </div>

      {sheetOpen && (
        <MarketplaceFilterSheet
          active={filtersActive}
          onApply={(f) => { setFiltersActive(f); setSheetOpen(false); }}
          onClose={() => setSheetOpen(false)}
          onClear={() => setFiltersActive({})}
        />
      )}

      {multiOpen && (
        <MultiSelectWinesModal
          title="Adicionar ao carrinho"
          confirmLabel={(n) => `Adicionar ${n} ao carrinho`}
          wines={MOCK_WINES}
          onConfirm={(ids) => {
            setMultiOpen(false);
            go('toast', { kind: 'success', message: `${ids.length} ${ids.length === 1 ? 'vinho adicionado' : 'vinhos adicionados'} ao carrinho` });
          }}
          onClose={() => setMultiOpen(false)}
        />
      )}
    </div>
  );
}

function MarketplaceFilterSheet({ active, onApply, onClose, onClear }) {
  const [tipos, setTipos] = React.useState(active.tipos || []);
  const [paises, setPaises] = React.useState(active.paises || []);
  const [uvas, setUvas] = React.useState(active.uvas || []);
  const [uvaQuery, setUvaQuery] = React.useState('');
  const [minMatch, setMinMatch] = React.useState(active.minMatch || 0);
  const [maxPrice, setMaxPrice] = React.useState(active.maxPrice || 500);
  const TIPOS = ['Tinto', 'Branco', 'Rosé', 'Espumante'];
  const UVAS = ['Malbec', 'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Tannat', 'Carmenère', 'Syrah', 'Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Tempranillo', 'Sangiovese'];
  const PAISES = [
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'IT', name: 'Itália', flag: '🇮🇹' },
    { code: 'FR', name: 'França', flag: '🇫🇷' },
  ];
  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  const activeCount = tipos.length + paises.length + uvas.length + (minMatch ? 1 : 0) + (maxPrice < 500 ? 1 : 0);
  const filteredUvas = UVAS.filter(u => u.toLowerCase().includes(uvaQuery.toLowerCase()));

  return (
    <ModalSheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ ...T.t.h2, color: T.c.n950 }}>Filtros {activeCount > 0 && <span style={{ color: T.c.p700 }}>({activeCount} ativos)</span>}</div>
        <button onClick={onClose} style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={22} color={T.c.n800}/>
        </button>
      </div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>Refine sua busca</div>

      <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: 4 }}>
        <FilterSection title="Faixa de preço">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...T.t.body, color: T.c.n800 }}>Até</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.c.p700, fontFamily: T.font }}>R$ {maxPrice}{maxPrice >= 500 ? '+' : ''}</span>
          </div>
          <input type="range" min={20} max={500} step={10} value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.c.p700 }}/>
        </FilterSection>

        <FilterSection title="Tipo">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TIPOS.map(t => <Chip key={t} selected={tipos.includes(t)} onClick={() => toggle(tipos, setTipos, t)}>{t}</Chip>)}
          </div>
        </FilterSection>

        <FilterSection title="País">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PAISES.map(p => (
              <Chip key={p.code} selected={paises.includes(p.name)} onClick={() => toggle(paises, setPaises, p.name)}>
                <span style={{ marginRight: 4 }}>{p.flag}</span>{p.name}
              </Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Uvas">
          <div style={{
            height: 38, padding: '0 12px', borderRadius: T.r.sm,
            background: T.c.n0, border: `1px solid ${T.c.n300}`,
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <Icon name="search" size={16} color={T.c.n600}/>
            <input value={uvaQuery} onChange={e => setUvaQuery(e.target.value)} placeholder="Buscar uva"
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: T.font, fontSize: 13, background: 'transparent', color: T.c.n950 }}/>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {filteredUvas.length === 0
              ? <div style={{ ...T.t.caption, color: T.c.n600 }}>Nenhuma uva encontrada</div>
              : filteredUvas.map(u => <Chip key={u} selected={uvas.includes(u)} onClick={() => toggle(uvas, setUvas, u)}>{u}</Chip>)}
          </div>
        </FilterSection>

        <FilterSection title="Match Score mínimo">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...T.t.body, color: T.c.n800 }}>Mostrar a partir de</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.c.p700, fontFamily: T.font }}>{minMatch}% pra mim</span>
          </div>
          <input type="range" min={0} max={90} step={10} value={minMatch}
            onChange={e => setMinMatch(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.c.p700 }}/>
        </FilterSection>
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: `1px solid ${T.c.n200}`, marginTop: 16 }}>
        <Button variant="ghost" size="md" onClick={() => { onClear(); setTipos([]); setPaises([]); setUvas([]); setMinMatch(0); setMaxPrice(500); }} disabled={activeCount === 0}>
          Limpar
        </Button>
        <Button variant="primary" size="md" fullWidth onClick={() => onApply({ tipos, paises, uvas, minMatch, maxPrice })}>
          Ver resultados
        </Button>
      </div>
    </ModalSheet>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{title}</div>
      {children}
    </div>
  );
}

// ─── Detalhe de Vinho ──────────────────────────────────────
function WineDetailScreen({ go, params }) {
  const wine = params?.wine || MOCK_WINES[0];
  const [fav, setFav] = React.useState(false);
  const [showAdd, setShowAdd] = React.useState(false);
  const [userRating, setUserRating] = React.useState(0);
  const [userReview, setUserReview] = React.useState('');
  const [reviews, setReviews] = React.useState([
    { id: 1, author: 'Carla M.', level: 'expert', rating: 5, text: 'Tanino sedoso, final muito longo. Esperava mais corpo, mas a complexidade compensa.', time: '3 dias' },
    { id: 2, author: 'Bruno V.', level: 'intermediario', rating: 4, text: 'Surpreendente pra faixa de preço. Combinou super bem com costela braseada.', time: '1 sem' },
  ]);
  const isComprable = wine.shoppable !== false; // default: comprável
  const flagMap = { Argentina: '🇦🇷', Brasil: '🇧🇷', Chile: '🇨🇱', Portugal: '🇵🇹', Itália: '🇮🇹', França: '🇫🇷' };
  const flag = flagMap[wine.country] || '🌐';

  // Match microcopy por tier
  const matchPhrase = wine.match >= 80
    ? 'Acidez vibrante + corpo médio combinam com o que você costuma curtir. Aposta segura.'
    : wine.match >= 60
      ? 'Bom encaixe com seu paladar — o corpo está alinhado, a intensidade vai te agradar.'
      : 'Tem características diferentes do seu padrão, mas pode te surpreender.';

  const submitReview = () => {
    if (!userRating) return;
    setReviews([{ id: Date.now(), author: 'Você', level: 'iniciante', rating: userRating, text: userReview || '(sem comentário)', time: 'agora' }, ...reviews]);
    setUserRating(0); setUserReview('');
    go('toast', { kind: 'success', message: 'Avaliação publicada ✓' });
  };

  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1).replace('.', ',');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50 }}>
      {/* Overlay header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 8px' }}>
        <button onClick={() => go('back')} style={{ width: 40, height: 40, borderRadius: T.r.full, background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.el[1] }}>
          <Icon name="arrow_back" size={22} color={T.c.n950}/>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: T.r.full, background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.el[1] }}>
            <Icon name="ios_share" size={20} color={T.c.n800}/>
          </button>
          <button onClick={() => setFav(!fav)} style={{ width: 40, height: 40, borderRadius: T.r.full, background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.el[1] }}>
            <Icon name="favorite" size={20} color={fav ? T.c.e700 : T.c.n800} fill={fav ? 1 : 0}/>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Hero photo 4:3 */}
        <div style={{ position: 'relative', aspectRatio: '4/3', background: `linear-gradient(180deg, ${T.c.p50}, ${T.c.p100})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BottlePlaceholder width={130} height={210} label="rótulo"/>
          <div style={{ position: 'absolute', bottom: 12, left: 12, height: 28, padding: '0 10px', borderRadius: T.r.full, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, boxShadow: T.el[1] }}>
            <span>{flag}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.c.n800 }}>{wine.country}</span>
          </div>
        </div>

        <div style={{ padding: '20px 16px 16px' }}>
          {/* Title */}
          <div style={{ ...T.t.h1, color: T.c.n950, fontSize: 22, lineHeight: '28px', marginBottom: 6, textWrap: 'pretty' }}>{wine.name}</div>
          <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 14 }}>{wine.producer} · {wine.vintage || 2021}</div>

          {/* Stat row: rating + match */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={16} color={T.c.a700} fill={1}/>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.c.n800, fontFamily: T.font }}>{(wine.rating || 4.5).toFixed(1).replace('.', ',')}</span>
            </div>
            <span style={{ color: T.c.n300 }}>·</span>
            {wine.match >= 40 && <MatchBadge score={wine.match} size="sm" variant="pill"/>}
          </div>

          {/* Preço */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: T.c.n950, fontFamily: T.font }}>R$ {wine.price.toFixed(2).replace('.', ',')}</span>
            <span style={{ ...T.t.caption, color: T.c.n600 }}>(sujeito a alterações)</span>
          </div>

          {/* Banner se não comprável */}
          {!isComprable && (
            <div style={{ padding: 12, marginBottom: 16, borderRadius: T.r.md, background: T.c.i100, border: `1px solid ${T.c.i700}33`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Icon name="info" size={18} color={T.c.i700}/>
              <div style={{ flex: 1, fontSize: 13, color: T.c.n800, lineHeight: '18px' }}>
                Vinho não disponível no Marketplace — mas você pode registrá-lo no seu Diário.
              </div>
            </div>
          )}

          {/* Por que combina */}
          <div style={{ padding: 14, marginBottom: 18, borderRadius: T.r.md, background: T.c.p50, border: `1px solid ${T.c.p100}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="lightbulb" size={18} color={T.c.p700}/>
              <span style={{ ...T.t.bodyB, color: T.c.p700 }}>Por que combina com você?</span>
            </div>
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: '21px', textWrap: 'pretty' }}>
              {matchPhrase}
            </div>
          </div>

          {/* CTAs hierarquizados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {isComprable ? (
              <>
                <Button variant="primary" size="lg" fullWidth leading={<Icon name="shopping_bag" size={18}/>}
                  onClick={() => go('carrinho')}>
                  Comprar
                </Button>
                <Button variant="secondary" size="md" fullWidth leading={<Icon name="chat" size={16}/>}
                  onClick={() => go('toast', { kind: 'info', message: 'Abrindo WhatsApp…' })}>
                  Falar com vendedor
                </Button>
                <Button variant="ghost" size="md" fullWidth leading={<Icon name="bookmark_add" size={16}/>}
                  onClick={() => setShowAdd(true)}>
                  Salvar no Diário
                </Button>
              </>
            ) : (
              <Button variant="primary" size="lg" fullWidth leading={<Icon name="bookmark_add" size={18}/>}
                onClick={() => setShowAdd(true)}>
                Salvar no Diário
              </Button>
            )}
          </div>

          {/* Ficha técnica */}
          <SectionDivider title="Ficha técnica"/>
          <div style={{ marginBottom: 24 }}>
            <DetailRow label="Tipo" value={wine.type}/>
            <DetailRow label="Uvas" value={wine.uvas || 'Chardonnay, Pinot Noir'}/>
            <DetailRow label="Região" value={`${wine.region || 'Vale dos Vinhedos'}, ${wine.country}`}/>
            <DetailRow label="Volume" value="750ml"/>
            <DetailRow label="Teor alcoólico" value={wine.abv || '12,5%'}/>
            <DetailRow label="Maturação" value={wine.maturation || '14 meses em carvalho francês'}/>
            <DetailRow label="Servir a" value={wine.serve || '16–18 °C'}/>
          </div>

          {/* Perfil sensorial */}
          <SectionDivider title="Perfil sensorial"/>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <PaladarRadar paladar={MOCK_USER.paladar} wine={wine.perfil} size={240}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <Legend color={T.c.p700} label="Seu paladar"/>
            <Legend color={T.c.a700} label={wine.name.split(' ')[0]} dashed/>
          </div>

          {/* Harmonização */}
          <SectionDivider title="Harmonização"/>
          <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 24, lineHeight: '22px', textWrap: 'pretty' }}>
            {wine.pairing || 'Ostras frescas, canapés de salmão, bolinho de bacalhau e queijos suaves.'}
          </div>

          {/* Avaliações */}
          <SectionDivider title={`Avaliações (${reviews.length})`}/>

          {/* Form de avaliação */}
          <Card padding={14} style={{ marginBottom: 14 }}>
            <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Dê uma nota e avalie</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setUserRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <Icon name="star" size={28} color={i <= userRating ? T.c.a700 : T.c.n300} fill={i <= userRating ? 1 : 0}/>
                </button>
              ))}
            </div>
            <textarea value={userReview} onChange={e => setUserReview(e.target.value)} placeholder="Digite sua avaliação (opcional)"
              style={{
                width: '100%', minHeight: 70, padding: 10, borderRadius: T.r.sm,
                border: `1px solid ${T.c.n300}`, background: T.c.n0,
                fontFamily: T.font, fontSize: 13, color: T.c.n950, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                marginBottom: 10,
              }}/>
            <Button variant="primary" size="md" onClick={submitReview} disabled={!userRating}>
              Publicar
            </Button>
          </Card>

          {/* Stats avaliações */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, padding: '12px 14px', background: T.c.n0, borderRadius: T.r.md, border: `1px solid ${T.c.n200}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.c.p900, fontFamily: T.font, lineHeight: 1 }}>{avg}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={14} color={i <= Math.round(reviews.reduce((a,r)=>a+r.rating,0)/reviews.length) ? T.c.a700 : T.c.n300} fill={1}/>)}
              </div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{reviews.length} avaliações</div>
            </div>
          </div>

          {/* Lista de reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {reviews.map(r => (
              <Card key={r.id} padding={12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Avatar name={r.author} size={32} level={r.level}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{r.author}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={12} color={i <= r.rating ? T.c.a700 : T.c.n300} fill={1}/>)}
                      </div>
                      <span style={{ ...T.t.caption, color: T.c.n600 }}>· há {r.time}</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...T.t.body, color: T.c.n800, lineHeight: '20px', textWrap: 'pretty' }}>{r.text}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <AddToDiaryModal wine={wine} onClose={() => setShowAdd(false)} onSave={() => { setShowAdd(false); go('toast', { kind: 'success', message: 'Vinho registrado no Diário ✓' }); }}/>}
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 14px' }}>
      <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
      <div style={{ ...T.t.overline, color: T.c.n800 }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
    </div>
  );
}
function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${T.c.n100}` }}>
      <span style={{ ...T.t.body, color: T.c.n600 }}>{label}</span>
      <span style={{ ...T.t.bodyB, color: T.c.n950, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
function Legend({ color, label, dashed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 16, height: 3, borderRadius: 2, background: color, borderTop: dashed ? `2px dashed ${color}` : 'none' }}/>
      <span style={{ ...T.t.caption, color: T.c.n800, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ─── Add to Diary modal ─────────────────────────────────────
function AddToDiaryModal({ wine, onClose, onSave }) {
  const [rating, setRating] = React.useState(0);
  const [note, setNote] = React.useState('');
  const [occasion, setOccasion] = React.useState('');
  const occasions = ['Sozinha', 'Com amigos', 'Confraria', 'Jantar', 'Especial'];
  return (
    <ModalSheet onClose={onClose}>
      <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 4 }}>Registrar no Diário</div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>{wine.name}</div>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Sua nota</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} onClick={() => setRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Icon name="star" size={32} color={i <= rating ? T.c.a700 : T.c.n300} fill={i <= rating ? 1 : 0}/>
          </button>
        ))}
      </div>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Em que momento?</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {occasions.map(o => <Chip key={o} selected={occasion === o} onClick={() => setOccasion(o)}>{o}</Chip>)}
      </div>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Anotações (opcional)</div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Notas de prova, contexto, com quem você abriu…"
        style={{
          width: '100%', minHeight: 80, padding: 12, borderRadius: T.r.md,
          border: `1.5px solid ${T.c.n300}`, fontFamily: T.font, fontSize: 14,
          resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 20,
        }}/>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="ghost" size="lg" fullWidth onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="lg" fullWidth onClick={onSave} disabled={rating === 0}>Salvar</Button>
      </div>
    </ModalSheet>
  );
}

// ─── Modal Sheet ────────────────────────────────────────────
function ModalSheet({ children, onClose, padding = 20 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 50,
      animation: 'tcFadeIn 200ms ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '85%', overflow: 'auto',
        background: T.c.n0, borderRadius: `${T.r.xl}px ${T.r.xl}px 0 0`,
        padding, animation: 'tcSlideUp 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        <div style={{ width: 40, height: 4, background: T.c.n300, borderRadius: 2, margin: '0 auto 16px' }}/>
        {children}
      </div>
    </div>
  );
}

// ─── Scanner ────────────────────────────────────────────────
function ScannerScreen({ go }) {
  const [phase, setPhase] = React.useState('aim'); // aim | capturing | analyzing
  const [flashOn, setFlashOn] = React.useState(false);
  const [showTip, setShowTip] = React.useState(() => !localStorage.getItem('tc:scanner:firstUse'));
  const [showHelp, setShowHelp] = React.useState(false);

  const dismissTip = () => {
    localStorage.setItem('tc:scanner:firstUse', '1');
    setShowTip(false);
  };

  const handleCapture = () => {
    if (phase !== 'aim') return;
    dismissTip();
    setPhase('capturing');
    setTimeout(() => setPhase('analyzing'), 350);
    // 70% success / 30% fallback for demo
    setTimeout(() => {
      const success = Math.random() > 0.3;
      go('scanner-result', success
        ? { status: 'success', wine: MOCK_WINES[5], confidence: Math.random() > 0.5 ? 'high' : 'low' }
        : { status: 'fail' });
    }, 1800);
  };

  React.useEffect(() => {
    // Toast info on entry — but not on top of tooltip
    if (!showTip) {
      const t = setTimeout(() => {
        go('toast', { kind: 'info', message: 'Iluminação ajuda — gire o rótulo se precisar.' });
      }, 400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div style={{ flex: 1, background: '#000', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Header overlay transparent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
        <button onClick={() => go('back')} style={{ width: 44, height: 44, border: 'none', background: 'rgba(0,0,0,0.4)', cursor: 'pointer', borderRadius: T.r.full, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <Icon name="arrow_back" size={22} color={T.c.n0}/>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setFlashOn(!flashOn)} style={{ width: 44, height: 44, border: 'none', background: flashOn ? T.c.a700 : 'rgba(0,0,0,0.4)', cursor: 'pointer', borderRadius: T.r.full, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <Icon name={flashOn ? 'flash_on' : 'flash_off'} size={20} color={T.c.n0}/>
          </button>
          <button onClick={() => setShowHelp(true)} style={{ width: 44, height: 44, border: 'none', background: 'rgba(0,0,0,0.4)', cursor: 'pointer', borderRadius: T.r.full, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <Icon name="help_outline" size={20} color={T.c.n0}/>
          </button>
        </div>
      </div>

      {/* Camera bg */}
      <div style={{ position: 'absolute', inset: 0, background: flashOn ? 'radial-gradient(circle at 50% 55%, #4a2a1a 0%, #000 75%)' : 'radial-gradient(circle at 50% 60%, #2a1a1a 0%, #000 70%)', transition: 'background 200ms' }}/>
      {/* Faux bottle silhouette */}
      <svg width="120" height="240" viewBox="0 0 60 120" style={{ position: 'absolute', left: '50%', top: '32%', transform: 'translateX(-50%)', opacity: 0.5 }}>
        <path d="M24 4 L24 22 Q18 25 18 38 L18 110 Q18 116 24 116 L36 116 Q42 116 42 110 L42 38 Q42 25 36 22 L36 4 Z" fill="#5a1a1f"/>
      </svg>

      {/* Rectangular vertical frame — wine label aspect ratio */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingBottom: 40 }}>
        <div style={{ position: 'relative', width: 220, height: 300 }}>
          {/* Vignette overlay */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: T.r.md,
            boxShadow: '0 0 0 1000px rgba(0,0,0,0.55)',
            outline: phase === 'capturing' ? `3px solid ${T.c.n0}` : 'none',
            transition: 'outline 120ms',
          }}/>
          {/* Corners */}
          {['tl','tr','bl','br'].map(c => (
            <div key={c} style={{
              position: 'absolute', width: 32, height: 32,
              borderColor: phase === 'analyzing' ? T.c.a700 : T.c.n0, borderStyle: 'solid', borderWidth: 0,
              transition: 'border-color 200ms',
              ...(c.includes('t') ? { top: -2, borderTopWidth: 4 } : { bottom: -2, borderBottomWidth: 4 }),
              ...(c.includes('l') ? { left: -2, borderLeftWidth: 4 } : { right: -2, borderRightWidth: 4 }),
              borderTopLeftRadius: c === 'tl' ? T.r.md : 0,
              borderTopRightRadius: c === 'tr' ? T.r.md : 0,
              borderBottomLeftRadius: c === 'bl' ? T.r.md : 0,
              borderBottomRightRadius: c === 'br' ? T.r.md : 0,
            }}/>
          ))}
          {/* Animated guide line */}
          {phase === 'aim' && (
            <div style={{
              position: 'absolute', left: 6, right: 6, top: '50%', height: 2,
              background: `linear-gradient(90deg, transparent, ${T.c.a500}, transparent)`,
              animation: 'tcScanPulse 2s ease-in-out infinite',
              opacity: 0.85,
            }}/>
          )}
          {phase === 'analyzing' && (
            <div style={{
              position: 'absolute', left: 8, right: 8, height: 3, background: T.c.a700,
              boxShadow: `0 0 16px ${T.c.a700}`,
              animation: 'tcScan 1.4s ease-in-out infinite',
              borderRadius: 2,
            }}/>
          )}
        </div>

        {/* Helper text */}
        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', padding: '0 32px' }}>
          <div style={{ ...T.t.bodyLg, color: T.c.n0, fontWeight: 600 }}>
            {phase === 'aim' && 'Centraliza o rótulo no quadro'}
            {phase === 'capturing' && 'Capturando…'}
            {phase === 'analyzing' && 'Identificando o vinho…'}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: '16px 24px 28px', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <button style={{ width: 48, height: 48, border: 'none', background: 'rgba(255,255,255,0.12)', borderRadius: T.r.full, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <Icon name="photo_library" size={22} color={T.c.n0}/>
        </button>

        {/* Capture button 80dp */}
        <button onClick={handleCapture} disabled={phase !== 'aim'} style={{
          width: 80, height: 80, borderRadius: T.r.full,
          background: T.c.n0,
          border: `4px solid ${T.c.p700}`,
          cursor: phase === 'aim' ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, transition: 'transform 120ms',
          transform: phase === 'capturing' ? 'scale(0.92)' : 'scale(1)',
          boxShadow: '0 4px 16px rgba(114,47,55,0.5)',
        }}>
          <div style={{ width: 60, height: 60, borderRadius: T.r.full, background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={phase === 'analyzing' ? 'autorenew' : 'camera_alt'} size={28} color={T.c.n0}/>
          </div>
        </button>

        <button onClick={() => go('marketplace')} style={{ width: 48, height: 48, border: 'none', background: 'rgba(255,255,255,0.12)', borderRadius: T.r.full, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <Icon name="search" size={22} color={T.c.n0}/>
        </button>
      </div>

      {/* First-use tooltip overlay */}
      {showTip && (
        <div onClick={dismissTip} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.c.n0, borderRadius: T.r.lg, padding: 20, maxWidth: 320, marginBottom: 120, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 16, height: 16, background: T.c.n0 }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: T.r.full, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="qr_code_scanner" size={20} color={T.c.p700}/>
              </div>
              <div style={{ ...T.t.h3, color: T.c.n950 }}>Como funciona</div>
            </div>
            <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 14, lineHeight: '20px' }}>
              Aponte pro rótulo do vinho e pressione o botão de captura. A gente identifica e mostra seu match score.
            </div>
            <Button variant="primary" size="md" fullWidth onClick={dismissTip}>Entendi</Button>
          </div>
        </div>
      )}

      {/* Help sheet */}
      {showHelp && (
        <ModalSheet onClose={() => setShowHelp(false)}>
          <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 4 }}>Dicas pra capturar bem</div>
          <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>Maximize as chances do app identificar o vinho.</div>
          {[
            { icon: 'wb_sunny', t: 'Boa iluminação', d: 'Evite sombras direto no rótulo.' },
            { icon: 'center_focus_strong', t: 'Rótulo centralizado', d: 'Deixe o rótulo dentro do quadro, paralelo à câmera.' },
            { icon: '360', t: 'Gire se precisar', d: 'Rótulos curvos podem precisar de mais de uma tentativa.' },
            { icon: 'edit', t: 'Não achou?', d: 'Use a busca pelo nome no canto inferior.' },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? `1px solid ${T.c.n100}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: T.r.full, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={d.icon} size={18} color={T.c.p700}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{d.t}</div>
                <div style={{ ...T.t.caption, color: T.c.n600 }}>{d.d}</div>
              </div>
            </div>
          ))}
          <Button variant="primary" size="md" fullWidth onClick={() => setShowHelp(false)} style={{ marginTop: 16 }}>Fechar</Button>
        </ModalSheet>
      )}
    </div>
  );
}



// ─── Resultado do Scanner ───────────────────────────────────
function ScannerResultScreen({ go, params }) {
  const status = params?.status || 'fail';
  const wine = params?.wine;
  const confidence = params?.confidence || 'high';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50 }}>
      <SubHeader title="Resultado" onBack={() => go('back')}/>

      {status === 'success' && wine ? (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Success banner */}
          <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: T.r.full, background: T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check_circle" size={20} color={T.c.s700} fill={1}/>
            </div>
            <div style={{ ...T.t.bodyB, color: T.c.s700 }}>Encontramos!</div>
          </div>

          {/* Low confidence warning */}
          {confidence === 'low' && (
            <div style={{ margin: '4px 16px 12px', padding: 12, borderRadius: T.r.md, background: T.c.w100, border: `1px solid ${T.c.w700}33`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Icon name="warning" size={18} color={T.c.w700}/>
              <div style={{ flex: 1, fontSize: 13, color: T.c.n800, lineHeight: '18px' }}>
                Identificamos com <strong>72% de certeza</strong> — confirme se é esse mesmo antes de salvar.
              </div>
            </div>
          )}

          {/* Wine card detalhado */}
          <div style={{ padding: '4px 16px 16px' }}>
            <Card padding={0} style={{ overflow: 'hidden' }}>
              <div style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', background: `linear-gradient(180deg, ${T.c.p50}, ${T.c.n0})` }}>
                <BottlePlaceholder width={80} height={130}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 2 }}>{wine.type}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.c.n950, lineHeight: 1.25, marginBottom: 4, textWrap: 'pretty' }}>{wine.name}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 8 }}>{wine.producer} · {wine.country}</div>
                  {wine.match >= 40 && <MatchBadge score={wine.match} size="sm" variant="pill"/>}
                </div>
              </div>
              <div style={{ padding: 16, borderTop: `1px solid ${T.c.n200}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ ...T.t.caption, color: T.c.n600 }}>Preço médio</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.c.n950, fontFamily: T.font }}>R$ {wine.price.toFixed(2).replace('.', ',')}</div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="star" size={16} color={T.c.a700} fill={1}/>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.c.n800 }}>{(wine.rating || 4.5).toFixed(1).replace('.', ',')}</span>
                  </div>
                </div>
                <Button variant="primary" size="lg" fullWidth onClick={() => go('wine', { wine })}
                  trailing={<Icon name="arrow_forward" size={18}/>}>
                  Ver detalhes completos
                </Button>
              </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <Button variant="secondary" size="md" fullWidth leading={<Icon name="bookmark_add" size={16}/>}
                onClick={() => go('toast', { kind: 'success', message: 'Salvo nos favoritos ✓' })}>
                Salvar nos favoritos
              </Button>
              <Button variant="ghost" size="md" fullWidth leading={<Icon name="refresh" size={16}/>}
                onClick={() => go('scanner')}>
                Não é esse — escanear de novo
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // FAIL state
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px 32px', textAlign: 'center' }}>
          {/* Illustration */}
          <div style={{ width: 120, height: 120, marginBottom: 20, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: T.c.p50 }}/>
            <Icon name="search_off" size={64} color={T.c.p700} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}/>
          </div>

          <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Não conseguimos identificar</div>
          <div style={{ ...T.t.body, color: T.c.n800, maxWidth: 300, lineHeight: '22px', marginBottom: 28 }}>
            A foto pode estar com pouca luz ou o rótulo amassado. Tente de novo ou busque manualmente.
          </div>

          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => go('scanner')}
              leading={<Icon name="qr_code_scanner" size={18}/>}>
              Tentar de novo
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={() => go('marketplace')}
              leading={<Icon name="search" size={16}/>}>
              Buscar manualmente
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={() => go('toast', { kind: 'info', message: 'Cadastro manual em breve' })}
              leading={<Icon name="edit_note" size={16}/>}>
              Cadastrar manualmente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  DescobrirHome, MarketplaceScreen, WineDetailScreen, ScannerScreen, ScannerResultScreen,
  AddToDiaryModal, ModalSheet, DetailRow, Legend, CuriosityCardSection,
});


export { AddToDiaryModal, CuriosityCardSection, DescobrirHome, DetailRow, FilterSection, Legend, MarketplaceFilterSheet, MarketplaceScreen, ModalSheet, ScannerResultScreen, ScannerScreen, SectionDivider, WineDetailScreen };
