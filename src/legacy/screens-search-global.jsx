/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MOCK_CONFRARIAS, MOCK_POSTS, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 14.04 · SearchGlobal — full-screen busca global
//
//   <SearchGlobal
//     isOpen
//     onClose={...}
//     go={(screen, params) => ...}
//     ctx={{ wines, brotherhoods, posts, recents, contained }}
//   />
// ─────────────────────────────────────────────────────────────

const SEARCH_SUGGESTIONS = [
  { label: 'Malbec argentino',       query: 'Malbec' },
  { label: 'Confrarias em Brasília', query: 'Brasília' },
  { label: 'Vinhos até R$50',        query: 'até 50' },
  { label: 'Eventos próximos',       query: 'eventos' },
];

const SEARCH_FILTERS = [
  { id: 'all',           label: 'Tudo' },
  { id: 'wines',         label: 'Vinhos' },
  { id: 'brotherhoods',  label: 'Confrarias' },
  { id: 'people',        label: 'Pessoas' },
  { id: 'posts',         label: 'Posts' },
];

// Mock people pool (sintetizado dos posts/confrarias)
const MOCK_PEOPLE = [
  { id: 'u_1', name: 'Carla Mendes',     level: 'expert',         bio: 'Sommelier · 12 confrarias' },
  { id: 'u_2', name: 'Diego Almeida',    level: 'intermediário',  bio: 'Brasília · churrasco & vinho' },
  { id: 'u_3', name: 'Bruno Tavares',    level: 'iniciante',      bio: 'Começando a explorar' },
  { id: 'u_4', name: 'Helena Sotero',    level: 'intermediário',  bio: 'Adora tintos do Douro' },
  { id: 'u_5', name: 'Vitor Pessoa',     level: 'intermediário',  bio: 'Wine & Netflix host' },
  { id: 'u_6', name: 'Ana Souza',        level: 'expert',         bio: 'Vinhos naturais · BH' },
];

const DEFAULT_RECENTS = ['Malbec Catena', 'Brindar em Brasília', 'tannat'];

function SearchGlobal({
  isOpen,
  onClose,
  go = () => {},
  ctx = {},
  contained = false,
  initialQuery = '',
  initialFilter = 'all',
}) {
  const wines = ctx.wines || (typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : []);
  const brotherhoods = ctx.brotherhoods || (typeof MOCK_CONFRARIAS !== 'undefined' ? MOCK_CONFRARIAS : []);
  const people = ctx.people || MOCK_PEOPLE;
  const posts = ctx.posts || (typeof MOCK_POSTS !== 'undefined' ? MOCK_POSTS : []);

  const [query, setQuery] = React.useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = React.useState(initialQuery);
  const [filter, setFilter] = React.useState(initialFilter);
  const [recents, setRecents] = React.useState(ctx.recents || DEFAULT_RECENTS);
  const inputRef = React.useRef(null);

  // Auto-focus on open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => { inputRef.current && inputRef.current.focus(); }, 80);
    }
  }, [isOpen]);

  // Debounce 300ms
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  // Esc closes
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose && onClose(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasQuery = debouncedQuery.length > 0;

  const results = hasQuery
    ? searchAll(debouncedQuery, { wines, brotherhoods, people, posts, filter })
    : null;

  const isAllEmpty = results &&
    results.wines.length === 0 &&
    results.brotherhoods.length === 0 &&
    results.people.length === 0 &&
    results.posts.length === 0;

  const commitSearch = (q) => {
    const trimmed = (q || query).trim();
    if (!trimmed) return;
    setRecents(prev => [trimmed, ...prev.filter(r => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5));
    if (onClose) onClose();
    go('search-results', { query: trimmed });
  };

  const pickRecent = (q) => {
    setQuery(q);
    setDebouncedQuery(q);
  };

  const positionStyle = contained
    ? { position: 'absolute', inset: 0 }
    : { position: 'fixed', inset: 0 };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscar"
      style={{
        ...positionStyle,
        zIndex: 9500,
        background: T.c.n0,
        display: 'flex', flexDirection: 'column',
        fontFamily: T.font,
        animation: 'tcSearchModalIn 240ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      }}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 8px 10px 12px',
        borderBottom: `1px solid ${T.c.n100}`,
        background: T.c.n0,
        flexShrink: 0,
      }}>
        <Icon name="search" size={20} color={T.c.n600}/>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commitSearch(); }}
          placeholder="Buscar vinhos, confrarias, pessoas…"
          style={{
            flex: 1, height: 40,
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font, fontSize: 15, color: T.c.n950,
            letterSpacing: '0.1px',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setDebouncedQuery(''); inputRef.current && inputRef.current.focus(); }}
            aria-label="Limpar"
            style={{
              width: 32, height: 32, border: 'none', background: T.c.n100,
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="close" size={14} color={T.c.n800}/>
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            width: 40, height: 40, border: 'none', background: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 2,
          }}
        >
          <Icon name="close" size={22} color={T.c.n800}/>
        </button>
      </div>

      {/* ─── Filter chips (horizontal scroll) ────────────────────── */}
      <div style={{
        display: 'flex', gap: 8,
        padding: '12px 16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        borderBottom: `1px solid ${T.c.n100}`,
        flexShrink: 0,
      }}>
        {SEARCH_FILTERS.map(f => (
          <FilterChip
            key={f.id}
            label={f.label}
            active={filter === f.id}
            onTap={() => setFilter(f.id)}
          />
        ))}
      </div>

      {/* ─── Body ───────────────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        background: T.c.n0,
      }}>
        {!hasQuery && (
          <EmptyQueryView
            recents={recents}
            onClearRecents={() => setRecents([])}
            onPickRecent={pickRecent}
            onPickSuggestion={pickRecent}
          />
        )}

        {hasQuery && isAllEmpty && (
          <NoResultsView query={debouncedQuery} onClearFilters={() => setFilter('all')} hasFilter={filter !== 'all'}/>
        )}

        {hasQuery && !isAllEmpty && (
          <ResultsView
            query={debouncedQuery}
            results={results}
            filter={filter}
            onTapWine={(w) => { if (onClose) onClose(); go('wine-detail', { wine: w }); }}
            onTapBrotherhood={(b) => { if (onClose) onClose(); go('confraria-detail', { confraria: b }); }}
            onTapPerson={(p) => { if (onClose) onClose(); go('profile', { id: p.id }); }}
            onTapPost={(p) => { if (onClose) onClose(); go('post-detail', { id: p.id }); }}
            onSeeAll={(kind) => { setFilter(kind); }}
          />
        )}
      </div>

      <style>{`
        @keyframes tcSearchModalIn { from { transform: translateY(-12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────
function FilterChip({ label, active, onTap }) {
  return (
    <button
      onClick={onTap}
      style={{
        flexShrink: 0,
        padding: '7px 14px',
        borderRadius: 9999,
        border: `1.5px solid ${active ? T.c.p700 : T.c.n200}`,
        background: active ? T.c.p700 : T.c.n0,
        color: active ? T.c.n0 : T.c.n800,
        fontSize: 13, fontWeight: 600,
        fontFamily: T.font,
        cursor: 'pointer',
        letterSpacing: '0.1px',
        transition: 'background 120ms, color 120ms, border-color 120ms',
      }}
    >{label}</button>
  );
}

// ─── Empty query view (no input typed) ────────────────────────
function EmptyQueryView({ recents, onClearRecents, onPickRecent, onPickSuggestion }) {
  return (
    <div style={{ padding: '8px 0 24px' }}>
      {/* Recents */}
      {recents.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px 8px',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: T.c.p700,
              textTransform: 'uppercase', letterSpacing: 0.6,
            }}>Buscas recentes</div>
            <button
              onClick={onClearRecents}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: T.c.n600, fontSize: 12, fontWeight: 600,
                fontFamily: T.font, padding: 4,
              }}
            >Limpar</button>
          </div>
          {recents.map((q, i) => (
            <button
              key={i}
              onClick={() => onPickRecent(q)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none',
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer',
                fontFamily: T.font,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.c.n50; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon name="history" size={20} color={T.c.n600}/>
              <span style={{ fontSize: 14, color: T.c.n800, fontWeight: 500, flex: 1 }}>{q}</span>
              <Icon name="north_west" size={16} color={T.c.n400}/>
            </button>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div>
        <div style={{
          padding: '14px 20px 12px',
          fontSize: 11, fontWeight: 700, color: T.c.p700,
          textTransform: 'uppercase', letterSpacing: 0.6,
        }}>Sugestões</div>
        <div style={{
          padding: '0 16px',
          display: 'flex', flexWrap: 'wrap', gap: 8,
        }}>
          {SEARCH_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => onPickSuggestion(s.query)}
              style={{
                padding: '10px 16px',
                borderRadius: 9999,
                border: `1px solid ${T.c.n200}`,
                background: T.c.n0,
                color: T.c.n800,
                fontSize: 13, fontWeight: 500,
                fontFamily: T.font, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'background 120ms, border-color 120ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p50; e.currentTarget.style.borderColor = T.c.p100; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.c.n0; e.currentTarget.style.borderColor = T.c.n200; }}
            >
              <Icon name="sparkle" size={14} color={T.c.p700}/>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Results view ─────────────────────────────────────────────
function ResultsView({ query, results, filter, onTapWine, onTapBrotherhood, onTapPerson, onTapPost, onSeeAll }) {
  const show = (kind) => filter === 'all' || filter === kind;

  return (
    <div style={{ padding: '8px 0 24px' }}>
      {show('wines') && results.wines.length > 0 && (
        <ResultsSection
          title="Vinhos"
          count={results.totalWines}
          showSeeAll={filter === 'all' && results.totalWines > 3}
          onSeeAll={() => onSeeAll('wines')}
        >
          {results.wines.slice(0, filter === 'all' ? 3 : results.wines.length).map(w => (
            <WineResult key={w.id} wine={w} query={query} onTap={() => onTapWine(w)}/>
          ))}
        </ResultsSection>
      )}

      {show('brotherhoods') && results.brotherhoods.length > 0 && (
        <ResultsSection
          title="Confrarias"
          count={results.totalBrotherhoods}
          showSeeAll={filter === 'all' && results.totalBrotherhoods > 3}
          onSeeAll={() => onSeeAll('brotherhoods')}
        >
          {results.brotherhoods.slice(0, filter === 'all' ? 3 : results.brotherhoods.length).map(b => (
            <BrotherhoodResult key={b.id} brotherhood={b} query={query} onTap={() => onTapBrotherhood(b)}/>
          ))}
        </ResultsSection>
      )}

      {show('people') && results.people.length > 0 && (
        <ResultsSection
          title="Pessoas"
          count={results.totalPeople}
          showSeeAll={filter === 'all' && results.totalPeople > 3}
          onSeeAll={() => onSeeAll('people')}
        >
          {results.people.slice(0, filter === 'all' ? 3 : results.people.length).map(p => (
            <PersonResult key={p.id} person={p} query={query} onTap={() => onTapPerson(p)}/>
          ))}
        </ResultsSection>
      )}

      {show('posts') && results.posts.length > 0 && (
        <ResultsSection
          title="Posts"
          count={results.totalPosts}
          showSeeAll={filter === 'all' && results.totalPosts > 3}
          onSeeAll={() => onSeeAll('posts')}
        >
          {results.posts.slice(0, filter === 'all' ? 3 : results.posts.length).map(p => (
            <PostResult key={p.id} post={p} query={query} onTap={() => onTapPost(p)}/>
          ))}
        </ResultsSection>
      )}
    </div>
  );
}

function ResultsSection({ title, count, showSeeAll, onSeeAll, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '14px 20px 8px',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 8,
        }}>
          <span style={{
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
            color: T.c.n950,
          }}>{title}</span>
          {typeof count === 'number' && count > 0 && (
            <span style={{ fontSize: 12, color: T.c.n600, fontWeight: 500 }}>· {count}</span>
          )}
        </div>
        {showSeeAll && (
          <button
            onClick={onSeeAll}
            style={{
              background: 'transparent', border: 'none',
              color: T.c.p700, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', padding: 4,
            }}
          >Ver todos</button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── Result row primitives ────────────────────────────────────
function WineResult({ wine, query, onTap }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: hover ? T.c.n50 : T.c.n0, border: 'none',
        padding: '10px 20px',
        display: 'flex', gap: 12, alignItems: 'center',
        cursor: 'pointer', fontFamily: T.font,
        transition: 'background 120ms',
      }}
    >
      <div style={{
        width: 36, height: 50, flexShrink: 0, borderRadius: 6,
        background: `linear-gradient(160deg, ${T.c.p100} 0%, ${T.c.p500} 55%, ${T.c.p900} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="wine_bar" size={16} color="rgba(255,255,255,0.92)"/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.c.n950,
          lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{highlight(wine.name, query)}</div>
        <div style={{ fontSize: 12, color: T.c.n600, marginTop: 2 }}>
          {wine.producer} · {wine.region || wine.country}
        </div>
      </div>
      <Icon name="chevron_right" size={18} color={T.c.n400}/>
    </button>
  );
}

function BrotherhoodResult({ brotherhood, query, onTap }) {
  const initials = (brotherhood.name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: hover ? T.c.n50 : T.c.n0, border: 'none',
        padding: '10px 20px',
        display: 'flex', gap: 12, alignItems: 'center',
        cursor: 'pointer', fontFamily: T.font,
        transition: 'background 120ms',
      }}
    >
      <div style={{
        width: 40, height: 40, flexShrink: 0, borderRadius: 10,
        background: `linear-gradient(135deg, ${T.c.a500}, ${T.c.a700})`,
        color: T.c.n0, fontWeight: 700, fontSize: 13,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.c.n950, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{highlight(brotherhood.name, query)}</div>
        <div style={{ fontSize: 12, color: T.c.n600, marginTop: 2 }}>
          {brotherhood.members} membros · {brotherhood.location || brotherhood.modality}
        </div>
      </div>
      <Icon name="chevron_right" size={18} color={T.c.n400}/>
    </button>
  );
}

function PersonResult({ person, query, onTap }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: hover ? T.c.n50 : T.c.n0, border: 'none',
        padding: '10px 20px',
        display: 'flex', gap: 12, alignItems: 'center',
        cursor: 'pointer', fontFamily: T.font,
        transition: 'background 120ms',
      }}
    >
      <Avatar name={person.name} size={40} level={person.level}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.c.n950, lineHeight: 1.3,
        }}>{highlight(person.name, query)}</div>
        <div style={{ fontSize: 12, color: T.c.n600, marginTop: 2 }}>{person.bio}</div>
      </div>
      <Icon name="chevron_right" size={18} color={T.c.n400}/>
    </button>
  );
}

function PostResult({ post, query, onTap }) {
  const [hover, setHover] = React.useState(false);
  const body = post.body || post.text || post.content || '';
  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: hover ? T.c.n50 : T.c.n0, border: 'none',
        padding: '10px 20px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        cursor: 'pointer', fontFamily: T.font,
        transition: 'background 120ms',
      }}
    >
      <Avatar name={post.author || 'A'} size={36}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: T.c.n950, lineHeight: 1.3,
        }}>{post.author} <span style={{ color: T.c.n400, fontWeight: 400 }}>· {post.time || 'agora'}</span></div>
        <div style={{
          fontSize: 13, color: T.c.n800, marginTop: 4, lineHeight: 1.45,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{highlight(body, query)}</div>
      </div>
    </button>
  );
}

// ─── No results ───────────────────────────────────────────────
function NoResultsView({ query, onClearFilters, hasFilter }) {
  return (
    <div style={{
      padding: '64px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 24,
        background: T.c.n100, color: T.c.n400,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="search_off" size={48} color={T.c.n400}/>
      </div>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 22, fontWeight: 600,
        color: T.c.n950, letterSpacing: '-0.01em', textWrap: 'balance',
      }}>Nada encontrado pra “{query}”</div>
      <div style={{
        fontSize: 14, color: T.c.n600, lineHeight: 1.55, maxWidth: 280, textWrap: 'pretty',
      }}>
        Tente outros termos ou {hasFilter ? 'limpe os filtros.' : 'use as sugestões.'}
      </div>
      {hasFilter && (
        <button
          onClick={onClearFilters}
          style={{
            marginTop: 4,
            background: T.c.p700, color: T.c.n0,
            border: 'none', padding: '10px 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: T.font,
          }}
        >Limpar filtros</button>
      )}
    </div>
  );
}

// ─── Search logic ─────────────────────────────────────────────
function searchAll(q, { wines, brotherhoods, people, posts, filter }) {
  const matches = (text) => text && text.toLowerCase().includes(q.toLowerCase());

  const wineHits = wines.filter(w =>
    matches(w.name) || matches(w.producer) || matches(w.region) || matches(w.country) || matches(w.type)
  );
  const brHits = brotherhoods.filter(b =>
    matches(b.name) || matches(b.description) || matches(b.location) || (b.tags && b.tags.some(t => matches(t)))
  );
  const peopleHits = people.filter(p =>
    matches(p.name) || matches(p.bio) || matches(p.level)
  );
  const postHits = posts.filter(p =>
    matches(p.body || p.text || p.content) || matches(p.author)
  );

  return {
    wines:        wineHits,
    brotherhoods: brHits,
    people:       peopleHits,
    posts:        postHits,
    totalWines:        wineHits.length,
    totalBrotherhoods: brHits.length,
    totalPeople:       peopleHits.length,
    totalPosts:        postHits.length,
  };
}

// ─── Highlight matching substring ────────────────────────────
function highlight(text, q) {
  if (!text || !q) return text || '';
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <React.Fragment>
      {text.slice(0, idx)}
      <span style={{ background: T.c.a100 || '#F5E9D4', fontWeight: 700, color: T.c.p700, padding: '0 1px', borderRadius: 2 }}>
        {text.slice(idx, idx + q.length)}
      </span>
      {text.slice(idx + q.length)}
    </React.Fragment>
  );
}

Object.assign(window, {
  SearchGlobal,
  SEARCH_SUGGESTIONS,
  SEARCH_FILTERS,
  MOCK_PEOPLE,
});


export { BrotherhoodResult, DEFAULT_RECENTS, EmptyQueryView, FilterChip, MOCK_PEOPLE, NoResultsView, PersonResult, PostResult, ResultsSection, ResultsView, SEARCH_FILTERS, SEARCH_SUGGESTIONS, SearchGlobal, WineResult, highlight, searchAll };
