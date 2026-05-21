/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 19.03 · SecaoAprenda — biblioteca de conteúdo educacional
//
// US-12-4-03 · acessada pelo bottom nav "Aprenda" ou via "Ver mais"
// de qualquer CardEducacional.
//
//   <SecaoAprenda
//     userLevel="intermediario"   // 'iniciante' | 'intermediario' | 'expert'
//     onBack={() => ...}
//     onOpenArticle={(article) => go('aprenda-detalhe', article)}
//   />
//
// Comportamento:
//  - Search box filtra por título / categoria / tags
//  - Chips filtram por categoria
//  - Quando há filtro/busca ativo → mostra grid único filtrado
//  - Sem filtro → seções curadas: Continue lendo / Pro seu nível /
//                 Mais lidos / Pra começar (só iniciantes)
// ─────────────────────────────────────────────────────────────

const APRENDA_CATEGORIAS = [
  { key: 'tudo',        label: 'Tudo',          icon: 'apps' },
  { key: 'uvas',        label: 'Uvas',          icon: 'eco' },
  { key: 'regioes',     label: 'Regiões',       icon: 'terrain' },
  { key: 'curiosidades',label: 'Curiosidades',  icon: 'lightbulb' },
  { key: 'historia',    label: 'História',      icon: 'history_edu' },
  { key: 'harmonizacao',label: 'Harmonização',  icon: 'restaurant' },
  { key: 'tecnica',     label: 'Técnica',       icon: 'science' },
];

// 12-month theme — each article gets a gradient pulled from a small
// palette so the grid feels alive without hand-picking colors per item.
const APRENDA_GRADIENTS = [
  ['#A04A55', '#4A1F24'], // burgundy deep
  ['#D4A574', '#722F37'], // amber → burgundy
  ['#722F37', '#1565C0'], // burgundy → indigo
  ['#B8894A', '#4A1F24'], // brass → wine
  ['#C97D87', '#722F37'], // rose → burgundy
  ['#2A2A2A', '#722F37'], // graphite → burgundy
  ['#A04A55', '#B8894A'], // wine → amber
  ['#722F37', '#0F0F0F'], // burgundy → near-black
];

const APRENDA_CATALOG = [
  {
    id: 'tannat-uruguai',
    title: 'Tannat: a uva nacional do Uruguai',
    category: 'uvas', categoryLabel: 'Uva',
    icon: 'eco',
    readMin: 3,
    excerpt: 'Trazida em 1870 por imigrantes bascos, encontrou no clima atlântico um lar inesperado.',
    tags: ['tannat', 'uruguai', 'uva'],
    level: 'intermediario',
    popular: 1240,
    isRead: true,
    progress: 1,
    gradient: APRENDA_GRADIENTS[0],
  },
  {
    id: 'douro-xisto',
    title: 'Por que Douro envelhece bem?',
    category: 'regioes', categoryLabel: 'Região',
    icon: 'terrain',
    readMin: 4,
    excerpt: 'O xisto retém calor e força raízes profundas. Resultado: taninos que se polem com o tempo.',
    tags: ['douro', 'portugal', 'terroir'],
    level: 'intermediario',
    popular: 2180,
    isRead: false,
    progress: 0.42,
    gradient: APRENDA_GRADIENTS[1],
  },
  {
    id: 'malbec-frances',
    title: 'O Malbec não nasceu argentino',
    category: 'historia', categoryLabel: 'História',
    icon: 'history_edu',
    readMin: 5,
    excerpt: 'Veio de Cahors, na França. Quase desapareceu lá depois da geada de 1956 — e renasceu em Mendoza.',
    tags: ['malbec', 'historia', 'argentina'],
    level: 'iniciante',
    popular: 3450,
    isRead: true,
    progress: 1,
    gradient: APRENDA_GRADIENTS[2],
  },
  {
    id: 'como-ler-rotulo',
    title: 'Como ler um rótulo (sem fingir que entende)',
    category: 'tecnica', categoryLabel: 'Técnica',
    icon: 'menu_book',
    readMin: 4,
    excerpt: 'AOC, DOC, IGP, varietal, blend, safra. Decifra o rótulo em 4 minutos.',
    tags: ['rotulo', 'iniciante', 'leitura'],
    level: 'iniciante',
    popular: 5800,
    isRead: false,
    essential: true,
    gradient: APRENDA_GRADIENTS[3],
  },
  {
    id: 'tinto-vs-branco',
    title: 'Tinto × Branco: a diferença real',
    category: 'tecnica', categoryLabel: 'Técnica',
    icon: 'science',
    readMin: 3,
    excerpt: 'Não é só a cor da uva. O segredo está no contato com a casca.',
    tags: ['tinto', 'branco', 'vinificacao'],
    level: 'iniciante',
    popular: 6230,
    isRead: false,
    essential: true,
    gradient: APRENDA_GRADIENTS[4],
  },
  {
    id: '5-uvas-essenciais',
    title: '5 uvas que você precisa conhecer',
    category: 'uvas', categoryLabel: 'Uva',
    icon: 'eco',
    readMin: 6,
    excerpt: 'Cabernet, Merlot, Malbec, Chardonnay, Sauvignon Blanc. O básico que abre 70% das cartas.',
    tags: ['uvas', 'iniciante', 'fundamentos'],
    level: 'iniciante',
    popular: 4820,
    isRead: false,
    essential: true,
    gradient: APRENDA_GRADIENTS[5],
  },
  {
    id: 'champagne-protecao',
    title: 'Champagne só é Champagne se vier de Champagne',
    category: 'curiosidades', categoryLabel: 'Curiosidade',
    icon: 'lightbulb',
    readMin: 3,
    excerpt: 'A denominação é protegida desde 1936. Bolha de outras regiões? Vira Crémant.',
    tags: ['champagne', 'denominacao', 'frança'],
    level: 'intermediario',
    popular: 3100,
    isRead: false,
    gradient: APRENDA_GRADIENTS[6],
  },
  {
    id: 'harmonizacao-feijoada',
    title: 'O que tomar com feijoada (sem clichês)',
    category: 'harmonizacao', categoryLabel: 'Harmonização',
    icon: 'restaurant',
    readMin: 4,
    excerpt: 'Spoiler: caipirinha existe por um motivo. Mas se for vinho, um tinto jovem encorpado faz a ponte.',
    tags: ['feijoada', 'harmonizacao', 'brasil'],
    level: 'intermediario',
    popular: 2750,
    isRead: false,
    gradient: APRENDA_GRADIENTS[7],
  },
  {
    id: 'vindima-significa',
    title: 'O que significa "vindima"?',
    category: 'curiosidades', categoryLabel: 'Curiosidade',
    icon: 'agriculture',
    readMin: 2,
    excerpt: 'Mais que colheita — é o momento crítico que define o ano todo de uma vinícola.',
    tags: ['vindima', 'colheita', 'producao'],
    level: 'iniciante',
    popular: 1640,
    isRead: false,
    gradient: APRENDA_GRADIENTS[0],
  },
  {
    id: 'pinot-noir-borgonha',
    title: 'Pinot Noir: por que Borgonha é o padrão',
    category: 'regioes', categoryLabel: 'Região',
    icon: 'terrain',
    readMin: 5,
    excerpt: 'Solo calcário, clima fresco e séculos de seleção massal. A geografia que virou estilo.',
    tags: ['pinot', 'borgonha', 'frança'],
    level: 'expert',
    popular: 1980,
    isRead: false,
    gradient: APRENDA_GRADIENTS[2],
  },
  {
    id: 'taninos-explicados',
    title: 'Taninos: o que é exatamente?',
    category: 'tecnica', categoryLabel: 'Técnica',
    icon: 'science',
    readMin: 3,
    excerpt: 'Aquela sensação de "secar a boca" tem nome, função, e diz muito sobre o vinho.',
    tags: ['tanino', 'tecnica', 'paladar'],
    level: 'iniciante',
    popular: 4180,
    isRead: false,
    gradient: APRENDA_GRADIENTS[5],
  },
  {
    id: 'safra-importa',
    title: 'Safra importa de verdade?',
    category: 'curiosidades', categoryLabel: 'Curiosidade',
    icon: 'event',
    readMin: 4,
    excerpt: 'Pra alguns vinhos, faz toda a diferença. Pra outros, é só número no rótulo.',
    tags: ['safra', 'vintage', 'clima'],
    level: 'intermediario',
    popular: 2240,
    isRead: false,
    gradient: APRENDA_GRADIENTS[1],
  },
  {
    id: 'historia-do-vinho',
    title: 'Uma linha do tempo do vinho em 7 marcos',
    category: 'historia', categoryLabel: 'História',
    icon: 'history_edu',
    readMin: 7,
    excerpt: 'Da Geórgia neolítica aos vinhos de garagem do século XXI.',
    tags: ['historia', 'tempo', 'civilizacao'],
    level: 'expert',
    popular: 1490,
    isRead: false,
    gradient: APRENDA_GRADIENTS[3],
  },
  {
    id: 'orgaonico-natural',
    title: 'Orgânico, biodinâmico, natural — o que muda?',
    category: 'tecnica', categoryLabel: 'Técnica',
    icon: 'compost',
    readMin: 5,
    excerpt: 'Três rótulos, três filosofias diferentes. E uma pergunta: vale a pena?',
    tags: ['organico', 'biodinamico', 'natural'],
    level: 'intermediario',
    popular: 2620,
    isRead: false,
    gradient: APRENDA_GRADIENTS[6],
  },
];

function SecaoAprenda({
  userLevel = 'intermediario',
  catalog = APRENDA_CATALOG,
  onBack = () => {},
  onOpenArticle = () => {},
}) {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('tudo');

  const filtering = query.trim().length > 0 || category !== 'tudo';

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(a => {
      if (category !== 'tudo' && a.category !== category) return false;
      if (q) {
        const hay = (a.title + ' ' + a.excerpt + ' ' + (a.tags || []).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [catalog, query, category]);

  const inProgress = catalog.filter(a => a.progress > 0 && a.progress < 1);
  const forLevel = catalog
    .filter(a => a.level === userLevel || (userLevel === 'iniciante' && a.level === 'iniciante'))
    .filter(a => !a.isRead)
    .slice(0, 6);
  const mostRead = [...catalog].sort((a, b) => b.popular - a.popular).slice(0, 6);
  const essentials = catalog.filter(a => a.essential);
  const isIniciante = userLevel === 'iniciante';

  return (
    <div
      data-screen-label="19.03 SecaoAprenda"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: T.c.n50,
        fontFamily: T.font,
        color: T.c.n950,
        overflow: 'hidden',
      }}
    >
      {/* ── Top bar ────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '8px 8px 8px 4px',
        background: T.c.n0,
        borderBottom: `1px solid ${T.c.n200}`,
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <h4 style={{
          margin: 0, flex: 1,
          fontSize: 17, fontWeight: 600,
          color: T.c.n950, letterSpacing: '-0.01em',
        }}>Aprenda</h4>
        <div style={{
          ...T.t.caption, color: T.c.p700,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.p50,
          borderRadius: T.r.full, marginRight: 12,
          letterSpacing: 0.3,
        }}>{catalog.length} artigos</div>
      </header>

      {/* ── Sticky search + chips ──────────────── */}
      <div style={{
        background: T.c.n50,
        padding: '12px 16px 8px',
        borderBottom: `1px solid ${T.c.n200}`,
        flexShrink: 0,
        position: 'relative', zIndex: 2,
      }}>
        <AprendaSearchBox
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
        <div style={{ height: 12 }}/>
        <AprendaChips
          value={category}
          onChange={setCategory}
        />
      </div>

      {/* ── Scrollable body ────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
      }}>
        {filtering ? (
          <FilteredGrid
            articles={filtered}
            query={query}
            category={category}
            onOpenArticle={onOpenArticle}
          />
        ) : (
          <>
            {inProgress.length > 0 && (
              <ContinueLendoSection
                articles={inProgress}
                onOpenArticle={onOpenArticle}
              />
            )}

            <RecommendedSection
              articles={forLevel}
              onOpenArticle={onOpenArticle}
              userLevel={userLevel}
            />

            <MostReadSection
              articles={mostRead}
              onOpenArticle={onOpenArticle}
            />

            {isIniciante && essentials.length > 0 && (
              <EssentialsSection
                articles={essentials}
                onOpenArticle={onOpenArticle}
              />
            )}

            <div style={{ height: 32 }}/>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Search box ──────────────────────────────────────────────
function AprendaSearchBox({ value, onChange, onClear }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px',
      height: 44,
      background: T.c.n0,
      border: `1px solid ${focus ? T.c.p700 : T.c.n300}`,
      borderRadius: T.r.full,
      boxShadow: focus ? `0 0 0 3px ${T.c.p100}` : 'none',
      transition: 'border-color 120ms, box-shadow 120ms',
    }}>
      <Icon name="search" size={20} color={focus ? T.c.p700 : T.c.n600}/>
      <input
        type="text"
        value={value}
        placeholder="Busque por uva, região, tema…"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1, height: '100%', minWidth: 0,
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950,
        }}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, display: 'inline-flex',
          }}
        >
          <Icon name="close" size={16} color={T.c.n600}/>
        </button>
      )}
    </div>
  );
}

// ─── Chip filter row ─────────────────────────────────────────
function AprendaChips({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 8,
      overflowX: 'auto', overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      paddingBottom: 4, marginBottom: -4,
    }}>
      {APRENDA_CATEGORIAS.map(c => {
        const active = value === c.key;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 32, padding: '0 14px',
              background: active ? T.c.p700 : T.c.n0,
              color: active ? T.c.n0 : T.c.n800,
              border: `1px solid ${active ? T.c.p700 : T.c.n300}`,
              borderRadius: T.r.full,
              cursor: 'pointer',
              fontFamily: T.font, fontSize: 13, fontWeight: 600,
              transition: 'background 120ms, color 120ms, border-color 120ms',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name={c.icon} size={14} color={active ? T.c.n0 : T.c.p700}/>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Filtered grid (single section view) ──────────────────────
function FilteredGrid({ articles, query, category, onOpenArticle }) {
  const categoryLabel = (APRENDA_CATEGORIAS.find(c => c.key === category) || {}).label || 'Tudo';
  return (
    <div style={{ padding: '16px 16px 32px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div>
          <div style={{ ...T.t.overline, color: T.c.n600 }}>Resultados</div>
          <div style={{ ...T.t.h3, color: T.c.n950, marginTop: 2 }}>
            {articles.length} {articles.length === 1 ? 'artigo' : 'artigos'}
            {query && <> · "<i style={{ color: T.c.p700, fontWeight: 600 }}>{query}</i>"</>}
            {category !== 'tudo' && <> · {categoryLabel}</>}
          </div>
        </div>
      </div>

      {articles.length === 0 ? (
        <EmptyState query={query}/>
      ) : (
        <ArticleGrid articles={articles} onOpenArticle={onOpenArticle}/>
      )}
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <div style={{
      padding: '40px 16px',
      textAlign: 'center',
      background: T.c.n0,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: T.c.n100,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
      }}>
        <Icon name="search_off" size={28} color={T.c.n400}/>
      </div>
      <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 4 }}>
        Nada por aqui {query && <>pra "<i>{query}</i>"</>}
      </div>
      <div style={{ ...T.t.caption, color: T.c.n600 }}>
        Tenta uma busca mais ampla ou troca o filtro.
      </div>
    </div>
  );
}

// ─── Section: Continue lendo ─────────────────────────────────
function ContinueLendoSection({ articles, onOpenArticle }) {
  return (
    <section style={{ padding: '20px 16px 4px' }}>
      <SectionHeader
        eyebrow="Pra retomar"
        title="Continue lendo"
        icon="bookmark"
      />
      <div style={{
        marginTop: 12,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {articles.map(a => (
          <ContinueRow key={a.id} article={a} onTap={() => onOpenArticle(a)}/>
        ))}
      </div>
    </section>
  );
}

function ContinueRow({ article, onTap }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.md,
        padding: 10,
        display: 'flex', alignItems: 'stretch', gap: 12,
        cursor: 'pointer',
        fontFamily: T.font,
        transition: 'border-color 120ms, transform 80ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.c.p300; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.c.n200; }}
    >
      <ArticleThumb article={article} width={72} height={72} compact/>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...T.t.overline, color: T.c.p700, letterSpacing: 0.8 }}>
          {article.categoryLabel}
        </div>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          lineHeight: 1.3,
        }}>{article.title}</div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1, height: 4, background: T.c.n200, borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              width: `${Math.round((article.progress || 0) * 100)}%`,
              height: '100%', background: T.c.p700,
            }}/>
          </div>
          <span style={{ ...T.t.caption, color: T.c.n600, fontFamily: T.mono, fontWeight: 500 }}>
            {Math.round((article.progress || 0) * 100)}%
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Section: Recomendados (horizontal scroll) ───────────────
function RecommendedSection({ articles, onOpenArticle, userLevel }) {
  const levelLabel = userLevel === 'iniciante'
    ? 'iniciante'
    : userLevel === 'expert'
      ? 'expert'
      : 'intermediário';
  return (
    <section style={{ padding: '20px 0 4px' }}>
      <div style={{ padding: '0 16px' }}>
        <SectionHeader
          eyebrow={`Pro seu nível · ${levelLabel}`}
          title="Pro seu nível"
          fraunces
          icon="auto_awesome"
        />
      </div>
      <div style={{
        marginTop: 12,
        display: 'flex', gap: 12,
        overflowX: 'auto', overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        padding: '4px 16px',
      }}>
        {articles.map(a => (
          <ArticleCard
            key={a.id}
            article={a}
            onTap={() => onOpenArticle(a)}
            width={180}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Section: Mais lidos (2-col grid) ─────────────────────────
function MostReadSection({ articles, onOpenArticle }) {
  return (
    <section style={{ padding: '20px 16px 4px' }}>
      <SectionHeader
        eyebrow="Em alta"
        title="Mais lidos esta semana"
        fraunces
        icon="local_fire_department"
      />
      <div style={{ marginTop: 14 }}>
        <ArticleGrid articles={articles} onOpenArticle={onOpenArticle}/>
      </div>
    </section>
  );
}

// ─── Section: Essentials (iniciantes only) ───────────────────
function EssentialsSection({ articles, onOpenArticle }) {
  return (
    <section style={{ padding: '20px 16px 4px' }}>
      <SectionHeader
        eyebrow="Fundamentos"
        title="Pra começar bem"
        fraunces
        icon="rocket_launch"
      />
      <p style={{
        margin: '6px 0 14px',
        fontSize: 13, color: T.c.n600, lineHeight: 1.5,
      }}>Três leituras curtas que mudam como você lê qualquer rótulo daqui pra frente.</p>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {articles.map((a, i) => (
          <EssentialRow
            key={a.id}
            index={i + 1}
            article={a}
            onTap={() => onOpenArticle(a)}
          />
        ))}
      </div>
    </section>
  );
}

function EssentialRow({ index, article, onTap }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.md,
        padding: 12,
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        fontFamily: T.font,
        transition: 'border-color 120ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.c.p300; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.c.n200; }}
    >
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        borderRadius: T.r.sm,
        background: `linear-gradient(160deg, ${article.gradient[0]} 0%, ${article.gradient[1]} 100%)`,
        color: T.c.n0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 18, fontWeight: 600,
        letterSpacing: '-0.02em',
      }}>{index}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{article.title}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
          {article.categoryLabel} · {article.readMin} min de leitura
        </div>
      </div>
      <Icon name="chevron_right" size={22} color={T.c.n400}/>
    </button>
  );
}

// ─── Section header ──────────────────────────────────────────
function SectionHeader({ eyebrow, title, icon, fraunces }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        ...T.t.overline, color: T.c.p700,
      }}>
        {icon && <Icon name={icon} size={13} color={T.c.p700}/>}
        {eyebrow}
      </div>
      <h3 style={{
        margin: '4px 0 0',
        ...(fraunces ? {
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
        } : {
          fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
        }),
        color: T.c.n950, lineHeight: 1.2,
      }}>{title}</h3>
    </div>
  );
}

// ─── Article grid (2-col) ────────────────────────────────────
function ArticleGrid({ articles, onOpenArticle }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 12,
    }}>
      {articles.map(a => (
        <ArticleCard
          key={a.id}
          article={a}
          onTap={() => onOpenArticle(a)}
        />
      ))}
    </div>
  );
}

// ─── Article card (catalog item) ─────────────────────────────
function ArticleCard({ article, onTap, width }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: width || 'auto',
        flexShrink: width ? 0 : 1,
        textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: T.font,
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 120ms, transform 100ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.c.p300;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.c.n200;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <ArticleThumb article={article} height={100}/>

      <div style={{
        padding: 12,
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        <div style={{
          ...T.t.overline, color: T.c.p700,
          letterSpacing: 0.8,
        }}>{article.categoryLabel}</div>
        <div style={{
          ...T.t.bodyB, color: T.c.n950,
          marginTop: 4, lineHeight: 1.3,
          fontSize: 14,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{article.title}</div>
        <div style={{
          marginTop: 'auto', paddingTop: 8,
          display: 'flex', alignItems: 'center', gap: 6,
          ...T.t.caption, color: T.c.n600,
        }}>
          <Icon name="schedule" size={12} color={T.c.n600}/>
          {article.readMin} min
        </div>
      </div>
    </button>
  );
}

// ─── Thumb (top of card OR compact square) ───────────────────
function ArticleThumb({ article, width, height = 100, compact }) {
  const grad = article.gradient || APRENDA_GRADIENTS[0];
  return (
    <div style={{
      position: 'relative',
      width: width || '100%',
      height,
      flexShrink: 0,
      borderRadius: compact ? T.r.sm : 0,
      background: `linear-gradient(160deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
      overflow: 'hidden',
    }}>
      {/* Subtle diagonal texture */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0.12,
        backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 14px)`,
      }}/>

      {/* Big icon glyph */}
      <div style={{
        position: 'absolute',
        bottom: compact ? 4 : 8,
        left: compact ? 4 : 10,
        display: 'inline-flex',
      }}>
        <Icon
          name={article.icon || 'auto_stories'}
          size={compact ? 22 : 30}
          color="rgba(255,255,255,0.92)"
          fill={1}
        />
      </div>

      {/* Read badge */}
      {article.isRead && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: compact ? 18 : 22, height: compact ? 18 : 22,
          borderRadius: '50%',
          background: T.c.s700,
          color: T.c.n0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
        }}>
          <Icon name="check" size={compact ? 12 : 14} color={T.c.n0} weight={700}/>
        </div>
      )}

      {/* Popular badge */}
      {!article.isRead && article.popular > 4000 && !compact && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          padding: '2px 8px',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          borderRadius: T.r.full,
          color: T.c.a500,
          fontFamily: T.mono, fontSize: 10, fontWeight: 600,
          letterSpacing: 0.3,
          display: 'inline-flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name="local_fire_department" size={11} color={T.c.a500} fill={1}/>
          {formatThousands(article.popular)}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function formatThousands(n) {
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(1).replace('.0', '').replace('.', ',') + 'k';
}

Object.assign(window, {
  SecaoAprenda, APRENDA_CATALOG, APRENDA_CATEGORIAS, APRENDA_GRADIENTS,
});


export { APRENDA_CATALOG, APRENDA_CATEGORIAS, APRENDA_GRADIENTS, AprendaChips, AprendaSearchBox, ArticleCard, ArticleGrid, ArticleThumb, ContinueLendoSection, ContinueRow, EmptyState, EssentialRow, EssentialsSection, FilteredGrid, MostReadSection, RecommendedSection, SecaoAprenda, SectionHeader, formatThousands };
