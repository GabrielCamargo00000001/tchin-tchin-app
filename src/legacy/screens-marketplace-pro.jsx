/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button, Chip, MatchBadge } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Marketplace Pro (4 telas)
//
//   36.01 filtros-avancados  → full-screen filter sheet
//   36.02 lista-desejos      → wishlist (wines saved)
//   36.03 comparar-vinhos    → side-by-side comparison
// ─────────────────────────────────────────────────────────────

function MpShell({ title, onBack, action, children, sticky }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>
        {action}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      {sticky}
    </div>
  );
}

// 36.01 ─────────────────────────────────────────────────
function FiltrosAvancadosScreen({ go, params }) {
  const init = (params && params.filters) || {};
  const [tipos,    setTipos]    = React.useState(init.tipos    || []);
  const [paises,   setPaises]   = React.useState(init.paises   || []);
  const [uvas,     setUvas]     = React.useState(init.uvas     || []);
  const [price,    setPrice]    = React.useState(init.price    || [40, 500]);
  const [match,    setMatch]    = React.useState(init.match    || 60);
  const [anoMin,   setAnoMin]   = React.useState(init.anoMin   || 2018);
  const [body,     setBody]     = React.useState(init.body     || []);
  const [doce,     setDoce]     = React.useState(init.doce     || []);
  const [acidez,   setAcidez]   = React.useState(init.acidez   || []);
  const [tanino,   setTanino]   = React.useState(init.tanino   || []);
  const [premiado, setPremiado] = React.useState(init.premiado || false);
  const [organico, setOrganico] = React.useState(init.organico || false);
  const [comFoto,  setComFoto]  = React.useState(init.comFoto  || false);
  const [emEstoque, setEmEstoque] = React.useState(init.emEstoque !== false);

  const t = (list, setList, v) => setList(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const count = tipos.length + paises.length + uvas.length + body.length + doce.length + acidez.length + tanino.length
              + (premiado ? 1 : 0) + (organico ? 1 : 0) + (comFoto ? 1 : 0) + (!emEstoque ? 1 : 0);

  const clearAll = () => {
    setTipos([]); setPaises([]); setUvas([]); setPrice([40, 500]); setMatch(60); setAnoMin(2018);
    setBody([]); setDoce([]); setAcidez([]); setTanino([]);
    setPremiado(false); setOrganico(false); setComFoto(false); setEmEstoque(true);
  };

  return (
    <MpShell title="Filtros avançados" onBack={() => go('back')}
      action={count > 0 && <button onClick={clearAll} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: T.c.p700, fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: '8px 14px',
      }}>Limpar tudo</button>}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => { go('toast', { kind: 'success', message: `${count} ${count === 1 ? 'filtro aplicado' : 'filtros aplicados'}` }); go('back'); }}>
            Aplicar {count > 0 && `(${count})`}
          </Button>
        </div>
      }>
      {/* Match score */}
      <FaSection title="Match com seu paladar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative', height: 36, display: 'flex', alignItems: 'center' }}>
            <input type="range" min={0} max={100} value={match} onChange={e => setMatch(+e.target.value)} style={{
              width: '100%', accentColor: T.c.p700, height: 6,
            }}/>
          </div>
          <div style={{ minWidth: 64, ...T.t.h3, color: T.c.p700, fontFamily: T.mono, textAlign: 'right' }}>{match}+</div>
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4 }}>Só vinhos com match {match}% ou maior.</div>
      </FaSection>

      <FaSection title="Tipo">
        <ChipRow values={['Tinto', 'Branco', 'Rosé', 'Espumante', 'Fortificado', 'Sobremesa', 'Laranja']} selected={tipos} onToggle={(v) => t(tipos, setTipos, v)}/>
      </FaSection>

      <FaSection title="Preço">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950, fontFamily: T.mono }}>R$ {price[0]} – R$ {price[1] === 1000 ? '1k+' : price[1]}</div>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>{price[0] === 40 && price[1] === 500 ? 'padrão' : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <RangeInput value={price[0]} min={0} max={price[1] - 10} step={10} onChange={(v) => setPrice([v, price[1]])} label="Mínimo"/>
          <RangeInput value={price[1]} min={price[0] + 10} max={1000} step={10} onChange={(v) => setPrice([price[0], v])} label="Máximo"/>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['até 60', [0,60]], ['60-150', [60,150]], ['150-300', [150,300]], ['300+', [300,1000]]].map(([l, range]) => (
            <Chip key={l} size="sm" selected={price[0] === range[0] && price[1] === range[1]} onClick={() => setPrice(range)}>{l}</Chip>
          ))}
        </div>
      </FaSection>

      <FaSection title="País">
        <ChipRow values={['Argentina', 'Chile', 'Brasil', 'Portugal', 'Itália', 'França', 'Espanha', 'Uruguai', 'EUA', 'África do Sul']} selected={paises} onToggle={(v) => t(paises, setPaises, v)}/>
      </FaSection>

      <FaSection title="Uva">
        <ChipRow values={['Malbec', 'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Tannat', 'Syrah', 'Tempranillo', 'Chardonnay', 'Sauvignon Blanc', 'Riesling']} selected={uvas} onToggle={(v) => t(uvas, setUvas, v)}/>
      </FaSection>

      <FaSection title="Safra mínima">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="range" min={2010} max={2024} value={anoMin} onChange={e => setAnoMin(+e.target.value)} style={{ flex: 1, accentColor: T.c.p700 }}/>
          <div style={{ minWidth: 64, ...T.t.h3, color: T.c.n950, fontFamily: T.mono, textAlign: 'right' }}>{anoMin}+</div>
        </div>
      </FaSection>

      <FaSection title="Perfil sensorial">
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 6 }}>Corpo</div>
        <ChipRow values={['Leve', 'Médio', 'Encorpado']} selected={body} onToggle={(v) => t(body, setBody, v)}/>
        <div style={{ ...T.t.caption, color: T.c.n600, margin: '12px 0 6px' }}>Doçura</div>
        <ChipRow values={['Seco', 'Meio-seco', 'Doce']} selected={doce} onToggle={(v) => t(doce, setDoce, v)}/>
        <div style={{ ...T.t.caption, color: T.c.n600, margin: '12px 0 6px' }}>Acidez</div>
        <ChipRow values={['Baixa', 'Média', 'Alta']} selected={acidez} onToggle={(v) => t(acidez, setAcidez, v)}/>
        <div style={{ ...T.t.caption, color: T.c.n600, margin: '12px 0 6px' }}>Tanino</div>
        <ChipRow values={['Suave', 'Médio', 'Firme']} selected={tanino} onToggle={(v) => t(tanino, setTanino, v)}/>
      </FaSection>

      <FaSection title="Mais">
        <FaToggle on={premiado}  onChange={setPremiado}  icon="emoji_events"   label="Premiado"          sub="Medalhas em concursos internacionais"/>
        <FaToggle on={organico}  onChange={setOrganico}  icon="eco"             label="Orgânico / biodinâmico" sub="Selos verificados"/>
        <FaToggle on={comFoto}   onChange={setComFoto}   icon="image"           label="Com foto do rótulo" sub="Esconde os vinhos com placeholder"/>
        <FaToggle on={!emEstoque} onChange={(v) => setEmEstoque(!v)} icon="inventory_2" label="Incluir esgotados" sub="Por padrão escondemos"/>
      </FaSection>

      <div style={{ height: 32 }}/>
    </MpShell>
  );
}

function FaSection({ title, children }) {
  return (
    <div style={{ background: T.c.n0, padding: '16px', borderBottom: `8px solid ${T.c.n50}` }}>
      <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}
function ChipRow({ values, selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {values.map(v => (
        <Chip key={v} size="md" selected={selected.includes(v)} onClick={() => onToggle(v)}>{v}</Chip>
      ))}
    </div>
  );
}
function RangeInput({ value, min, max, step, onChange, label }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 4 }}>{label}</div>
      <input type="number" value={value} onChange={e => onChange(Math.max(min, Math.min(max, +e.target.value)))} min={min} max={max} step={step} style={{
        width: '100%', padding: '10px 12px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
        background: T.c.n0, fontFamily: T.mono, fontSize: 14, color: T.c.n950, outline: 'none', boxSizing: 'border-box',
      }}/>
    </div>
  );
}
function FaToggle({ on, onChange, icon, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: `1px solid ${T.c.n100}` }}>
      {icon && <Icon name={icon} size={22} color={T.c.n800} style={{ marginTop: 2 }}/>}
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{label}</div>
        {sub && <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!on)} style={{
        width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
        background: on ? T.c.p700 : T.c.n300, transition: 'background 150ms', position: 'relative', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: T.c.n0, transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
      </button>
    </div>
  );
}

// 36.02 ─────────────────────────────────────────────────
function ListaDesejosScreen({ go }) {
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : [];
  const [items, setItems] = React.useState(wines.slice(0, 6).map(w => ({ ...w, addedAt: 'há 3 dias', priceWatch: Math.random() > 0.6 })));
  const [selecting, setSelecting] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const toggleSel = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : (s.length < 2 ? [...s, id] : s));
  return (
    <MpShell title="Lista de desejos" onBack={() => go('back')}
      action={items.length > 0 && (
        <button onClick={() => { setSelecting(s => !s); setSelected([]); }} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: T.c.p700, fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: '8px 14px',
        }}>{selecting ? 'Cancelar' : 'Comparar'}</button>
      )}
      sticky={selecting && selected.length === 2 && (
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <Button variant="primary" size="lg" fullWidth leading={<Icon name="compare_arrows" size={20}/>} onClick={() => {
            const [a, b] = selected.map(id => items.find(x => x.id === id));
            go('comparar-vinhos', { a, b });
          }}>
            Comparar lado a lado
          </Button>
        </div>
      )}>
      {/* Header info */}
      {!selecting && (
        <div style={{ padding: '16px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="favorite" size={22} color={T.c.e700} fill={1}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{items.length} {items.length === 1 ? 'vinho salvo' : 'vinhos salvos'}</div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Te avisamos quando algum baixar de preço.</div>
          </div>
          {items.length >= 2 && (
            <Button variant="secondary" size="sm" leading={<Icon name="compare_arrows" size={16}/>} onClick={() => { setSelecting(true); setSelected([]); }}>Comparar</Button>
          )}
        </div>
      )}
      {selecting && (
        <div style={{ padding: '16px', background: T.c.p50, borderBottom: `8px solid ${T.c.n50}` }}>
          <div style={{ ...T.t.bodyB, color: T.c.p700, marginBottom: 4 }}>Selecione 2 pra comparar</div>
          <div style={{ ...T.t.caption, color: T.c.n800 }}>{selected.length}/2 selecionados</div>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Icon name="favorite_border" size={56} color={T.c.n400}/>
          <div style={{ ...T.t.h2, color: T.c.n950, marginTop: 16 }}>Sua lista está vazia</div>
          <div style={{ ...T.t.body, color: T.c.n600, marginTop: 8, marginBottom: 20 }}>Toque ♡ em qualquer vinho pra guardar aqui.</div>
          <Button variant="primary" size="lg" onClick={() => go('marketplace')}>Explorar Marketplace</Button>
        </div>
      ) : (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(w => (
            <button key={w.id} onClick={() => selecting ? toggleSel(w.id) : go('wine', { wine: w })} style={{
              display: 'flex', gap: 12, padding: 12,
              background: selected.includes(w.id) ? T.c.p50 : T.c.n0,
              border: `1.5px solid ${selected.includes(w.id) ? T.c.p700 : T.c.n200}`,
              borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left', position: 'relative',
              opacity: selecting && selected.length === 2 && !selected.includes(w.id) ? 0.5 : 1,
            }}>
              <BottlePlaceholder width={56} height={80} label=""/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 2 }}>{w.name}</div>
                <div style={{ ...T.t.caption, color: T.c.n600 }}>{w.country}{w.region ? ' · ' + w.region : ''}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ ...T.t.bodyB, color: T.c.n950, fontFamily: T.font }}>R$ {w.price || 159}</span>
                  {w.priceWatch && <span style={{ ...T.t.caption, padding: '2px 6px', borderRadius: T.r.xs, background: T.c.s100, color: T.c.s700, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="trending_down" size={12} color={T.c.s700}/>−15%
                  </span>}
                </div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4 }}>Adicionado {w.addedAt}</div>
              </div>
              {selecting ? (
                <div style={{
                  width: 24, height: 24, borderRadius: T.r.xs, flexShrink: 0, alignSelf: 'flex-start',
                  background: selected.includes(w.id) ? T.c.p700 : T.c.n0,
                  border: `1.5px solid ${selected.includes(w.id) ? T.c.p700 : T.c.n300}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{selected.includes(w.id) && <Icon name="check" size={16} color={T.c.n0}/>}</div>
              ) : (
                <button onClick={e => { e.stopPropagation(); setItems(it => it.filter(x => x.id !== w.id)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'flex-start' }}>
                  <Icon name="favorite" size={20} color={T.c.e700} fill={1}/>
                </button>
              )}
            </button>
          ))}
        </div>
      )}
    </MpShell>
  );
}

// 36.03 ─────────────────────────────────────────────────
function CompararVinhosScreen({ go, params }) {
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : [];
  const a = (params && params.a) || wines[0];
  const b = (params && params.b) || wines[5];
  const rows = [
    { l: 'Preço',     a: `R$ ${a.price || 189}`, b: `R$ ${b.price || 156}`,                    best: (a.price || 189) < (b.price || 156) ? 'a' : 'b', lowerBetter: true },
    { l: 'Match',     a: `${a.match || 87}%`,    b: `${b.match || 79}%`,                       best: (a.match || 87) > (b.match || 79) ? 'a' : 'b' },
    { l: 'País',      a: a.country,              b: b.country },
    { l: 'Região',    a: a.region || '—',        b: b.region || '—' },
    { l: 'Uva',       a: (a.uvas && a.uvas[0]) || a.uvaPrincipal || 'Malbec', b: (b.uvas && b.uvas[0]) || b.uvaPrincipal || 'Tannat' },
    { l: 'Safra',     a: a.year || '2021',       b: b.year || '2020' },
    { l: 'Corpo',     a: 'Encorpado',            b: 'Médio' },
    { l: 'Tanino',    a: 'Firme',                b: 'Médio' },
    { l: 'Acidez',    a: 'Média',                b: 'Alta' },
    { l: 'Premiado',  a: 'Decanter 92pts',       b: '—',                                       best: 'a' },
    { l: 'Avaliações', a: '4.6 ★ (124)',         b: '4.3 ★ (87)',                              best: 'a' },
  ];
  return (
    <MpShell title="Comparar" onBack={() => go('back')}>
      {/* Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 16, background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        {[a, b].map((w, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <BottlePlaceholder width={64} height={92} label=""/>
            <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 8, fontFamily: '"Fraunces", Georgia, serif' }}>{w.name}</div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{w.producer || 'Bodega'}</div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
              <MatchBadge score={w.match || (i === 0 ? 87 : 79)} variant="pill" size="sm"/>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison rows */}
      <div style={{ background: T.c.n0 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: 4, alignItems: 'center',
            padding: '12px 16px', borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${T.c.n100}`,
          }}>
            <div style={{ ...T.t.caption, color: T.c.n600, fontWeight: 600 }}>{r.l}</div>
            <CompareCell value={r.a} highlight={r.best === 'a'}/>
            <CompareCell value={r.b} highlight={r.best === 'b'}/>
          </div>
        ))}
      </div>

      {/* Radar comparison placeholder */}
      <div style={{ padding: 16, background: T.c.n0, marginTop: 8 }}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 12 }}>Paladar lado a lado</div>
        <div style={{ height: 200, borderRadius: T.r.md, background: `radial-gradient(circle at 30% 50%, rgba(160,74,85,0.15), transparent 50%), radial-gradient(circle at 70% 50%, rgba(212,165,116,0.15), transparent 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.c.n600 }}>[ radar 5D sobreposto ]</div>
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: T.c.p700 }}/>
            <span style={{ ...T.t.caption, color: T.c.n800 }}>{a.name.slice(0, 20)}...</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: T.c.a700 }}/>
            <span style={{ ...T.t.caption, color: T.c.n800 }}>{b.name.slice(0, 20)}...</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: 16, display: 'flex', gap: 10 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('wine', { wine: a })}>Ver {a.name.split(' ')[0]}</Button>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('wine', { wine: b })}>Ver {b.name.split(' ')[0]}</Button>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        <Button variant="ghost" size="md" fullWidth leading={<Icon name="forum" size={16}/>} onClick={() => go('perguntar-expert')}>Perguntar pra um expert: "qual vale mais?"</Button>
      </div>
    </MpShell>
  );
}

function CompareCell({ value, highlight }) {
  return (
    <div style={{
      ...T.t.bodyB, color: highlight ? T.c.s700 : T.c.n950,
      fontFamily: T.font, textAlign: 'center', padding: '4px 8px',
      borderRadius: T.r.sm, background: highlight ? T.c.s100 : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    }}>
      {highlight && <Icon name="check_circle" size={14} color={T.c.s700} fill={1}/>}
      {value}
    </div>
  );
}

Object.assign(window, {
  MpShell,
  FiltrosAvancadosScreen, ListaDesejosScreen, CompararVinhosScreen,
});


export { ChipRow, CompararVinhosScreen, CompareCell, FaSection, FaToggle, FiltrosAvancadosScreen, ListaDesejosScreen, MpShell, RangeInput };
