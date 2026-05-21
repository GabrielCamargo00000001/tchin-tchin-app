/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MOCK_WINES } from './data.jsx';
import { MatchScoreBadge } from './f16_01_MatchScoreBadge.jsx';
import { APRENDA_CATALOG, SectionHeader } from './f19_03_SecaoAprenda.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 19.04 · DetalheCard — leitura do artigo educacional
//
//   <DetalheCard
//     article={{                              // veio do catálogo (19.03)
//       id, title, categoryLabel, readMin, gradient, icon,
//       body: [                                // blocos de conteúdo
//         { type: 'lead', text: '…' },
//         { type: 'p',    text: '…' },
//         { type: 'h2',   text: '…' },
//         { type: 'list', items: ['…', '…'] },
//         { type: 'quote', text: '…', by: '—' },
//       ],
//       relatedWineIds: [1, 6, 2],            // opcional
//       relatedArticleIds: ['douro-xisto'],   // opcional
//     }}
//     wines={MOCK_WINES}
//     allArticles={APRENDA_CATALOG}
//     onBack={() => ...}
//     onShare={() => ...}
//     onToggleBookmark={(saved) => ...}
//     onTapWine={(wine) => ...}
//     onTapArticle={(article) => ...}
//     onFeedback={(value) => ...}             // value: 'sim' | 'nao'
//   />
//
// Componente é "burro" — quem decide quais wines/relatedArticles vêm
// é o host. Render aceita conteúdo padrão para artigos sem `body`.
// ─────────────────────────────────────────────────────────────

function DetalheCard({
  article = {},
  wines = (typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : []),
  allArticles = (typeof APRENDA_CATALOG !== 'undefined' ? APRENDA_CATALOG : []),
  onBack = () => {},
  onShare = () => {},
  onToggleBookmark = () => {},
  onTapWine = () => {},
  onTapArticle = () => {},
  onFeedback = () => {},
}) {
  const [bookmarked, setBookmarked] = React.useState(!!article.bookmarked);
  const [feedback, setFeedback] = React.useState(null); // 'sim' | 'nao' | null

  const handleBookmark = () => {
    setBookmarked(b => {
      const next = !b;
      onToggleBookmark(next);
      return next;
    });
  };

  const handleFeedback = (value) => {
    setFeedback(prev => prev === value ? null : value);
    if (feedback !== value) onFeedback(value);
  };

  const grad = article.gradient || ['#A04A55', '#4A1F24'];
  const body = (article.body && article.body.length) ? article.body : defaultBody(article);

  // Resolve related wines from ids (or first N wines as fallback)
  const relatedWines = (article.relatedWineIds && article.relatedWineIds.length)
    ? article.relatedWineIds.map(id => wines.find(w => w.id === id)).filter(Boolean)
    : wines.slice(0, 5);

  // Resolve related articles from ids (or same-category fallback)
  const relatedArticles = (article.relatedArticleIds && article.relatedArticleIds.length)
    ? article.relatedArticleIds.map(id => allArticles.find(a => a.id === id)).filter(Boolean)
    : allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div
      data-screen-label="19.04 DetalheCard"
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: T.c.n0,
        fontFamily: T.font,
        color: T.c.n950,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating top bar — overlay over the hero image */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 8px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)',
      }}>
        <DetalheIconBtn name="arrow_back" onClick={onBack} ariaLabel="Voltar"/>
        <div style={{ display: 'flex', gap: 8 }}>
          <DetalheIconBtn name="ios_share" onClick={onShare} ariaLabel="Compartilhar"/>
          <DetalheIconBtn
            name="bookmark"
            onClick={handleBookmark}
            ariaLabel={bookmarked ? 'Remover dos salvos' : 'Salvar'}
            fill={bookmarked ? 1 : 0}
            active={bookmarked}
          />
        </div>
      </div>

      {/* Scroll body */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 100,
      }}>
        {/* Hero image */}
        <DetalheHero
          gradient={grad}
          icon={article.icon || 'auto_stories'}
          imageUrl={article.imageUrl}
        />

        {/* Main content */}
        <article style={{ padding: '20px 20px 28px' }}>
          {/* Eyebrow */}
          <div style={{
            ...T.t.overline, color: T.c.p700,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span aria-hidden="true" style={{
              width: 18, height: 1, background: T.c.p700, opacity: 0.6,
            }}/>
            {(article.categoryLabel || 'Aprenda').toUpperCase()}
            <span aria-hidden="true" style={{ color: T.c.n400, fontWeight: 400 }}>·</span>
            <span style={{ color: T.c.n600, fontWeight: 500 }}>
              {article.readMin || 3} min de leitura
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            margin: '8px 0 0',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 28, fontWeight: 500,
            letterSpacing: '-0.025em', lineHeight: 1.1,
            color: T.c.n950, textWrap: 'balance',
          }}>{article.title || 'Artigo'}</h1>

          {/* Author / meta strip */}
          <div style={{
            marginTop: 16, paddingTop: 14,
            borderTop: `1px solid ${T.c.n200}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`,
              color: T.c.n0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              fontFamily: T.serif || "'Fraunces', Georgia, serif",
              letterSpacing: '-0.01em',
              flexShrink: 0,
            }}>TT</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 13 }}>Equipe Tchin Tchin</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>Editorial</div>
            </div>
            {article.popular && (
              <div style={{
                ...T.t.caption, color: T.c.n600,
                fontFamily: T.mono, fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Icon name="visibility" size={14} color={T.c.n600}/>
                {formatPopularViews(article.popular)}
              </div>
            )}
          </div>

          {/* Body blocks */}
          <div style={{ marginTop: 20 }}>
            {body.map((block, i) => (
              <ContentBlock key={i} block={block}/>
            ))}
          </div>
        </article>

        {/* Section: Vinhos pra experimentar */}
        {relatedWines.length > 0 && (
          <RelatedWinesSection
            wines={relatedWines}
            categoryLabel={article.categoryLabel}
            onTapWine={onTapWine}
          />
        )}

        {/* Section: Cards relacionados */}
        {relatedArticles.length > 0 && (
          <RelatedArticlesSection
            articles={relatedArticles}
            onTapArticle={onTapArticle}
          />
        )}

        <div style={{ height: 8 }}/>
      </div>

      {/* Fixed bottom footer — feedback */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n200}`,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            ...T.t.bodyB, color: T.c.n950, fontSize: 13,
          }}>{feedback ? 'Valeu pelo feedback!' : 'Esse conteúdo te ajudou?'}</div>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>
            {feedback === 'sim' && 'A gente vai mostrar mais conteúdo assim.'}
            {feedback === 'nao' && 'Vamos refinar — obrigado pela honestidade.'}
            {!feedback && 'Sua resposta nos ajuda a recomendar melhor.'}
          </div>
        </div>
        <DetalheFeedbackBtn
          icon="thumb_up"
          label="Sim"
          active={feedback === 'sim'}
          onClick={() => handleFeedback('sim')}
        />
        <DetalheFeedbackBtn
          icon="thumb_down"
          label="Não"
          active={feedback === 'nao'}
          onClick={() => handleFeedback('nao')}
        />
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────
function DetalheHero({ gradient, icon, imageUrl }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: 240,
      background: imageUrl
        ? T.c.n200
        : `linear-gradient(165deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      overflow: 'hidden',
    }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
      ) : (
        <>
          {/* Subtle diagonal texture */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, opacity: 0.18,
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 18px)`,
          }}/>
          {/* Soft orb */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: -60, right: -40,
            width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
          }}/>
          {/* Big icon glyph */}
          <Icon
            name={icon}
            size={96}
            color="rgba(255,255,255,0.92)"
            fill={1}
            style={{
              position: 'absolute', bottom: 24, right: 24,
            }}
          />
        </>
      )}
      {/* Bottom shadow lift so eyebrow doesn't fight the hero edge */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.10) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

// ─── Content blocks renderer ─────────────────────────────────
function ContentBlock({ block }) {
  if (!block || !block.type) return null;
  switch (block.type) {
    case 'lead':
      return (
        <p style={{
          margin: '0 0 16px',
          fontSize: 17, lineHeight: 1.55, fontWeight: 500,
          color: T.c.n950, letterSpacing: '-0.005em',
          textWrap: 'pretty',
        }}>{block.text}</p>
      );
    case 'p':
      return (
        <p style={{
          margin: '0 0 14px',
          fontSize: 15, lineHeight: 1.65,
          color: T.c.n800, textWrap: 'pretty',
        }}>{block.text}</p>
      );
    case 'h2':
      return (
        <h2 style={{
          margin: '20px 0 10px',
          fontFamily: T.serif || "'Fraunces', Georgia, serif",
          fontSize: 20, fontWeight: 600,
          letterSpacing: '-0.015em',
          color: T.c.n950, lineHeight: 1.25,
        }}>{block.text}</h2>
      );
    case 'list':
      return (
        <ul style={{
          margin: '0 0 14px', padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {(block.items || []).map((item, i) => (
            <li key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              fontSize: 15, lineHeight: 1.55, color: T.c.n800,
            }}>
              <span aria-hidden="true" style={{
                width: 6, height: 6, borderRadius: '50%',
                background: T.c.p700,
                marginTop: 9, flexShrink: 0,
              }}/>
              <span style={{ flex: 1, minWidth: 0 }}>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote style={{
          position: 'relative',
          margin: '20px 0',
          padding: '16px 18px 14px',
          background: T.c.p50,
          borderLeft: `3px solid ${T.c.p700}`,
          borderRadius: `0 ${T.r.md}px ${T.r.md}px 0`,
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: -6, left: 10,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 44, lineHeight: 1, color: T.c.p700,
            fontWeight: 600, opacity: 0.35,
          }}>“</div>
          <p style={{
            margin: 0, position: 'relative',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 16, fontWeight: 500, fontStyle: 'italic',
            lineHeight: 1.5, color: T.c.p900,
            textWrap: 'pretty',
          }}>{block.text}</p>
          {block.by && (
            <div style={{
              marginTop: 8, ...T.t.caption,
              color: T.c.p700, fontWeight: 600,
            }}>— {block.by}</div>
          )}
        </blockquote>
      );
    default:
      return null;
  }
}

// ─── Related wines (horizontal scroll) ───────────────────────
function RelatedWinesSection({ wines, categoryLabel, onTapWine }) {
  const headline = (categoryLabel || '').toLowerCase() === 'uva'
    ? 'Pra você provar essa uva'
    : (categoryLabel || '').toLowerCase() === 'região'
      ? 'Pra você provar essa região'
      : 'Vinhos pra experimentar';
  return (
    <section style={{
      background: T.c.n50,
      padding: '24px 0 20px',
      borderTop: `1px solid ${T.c.n200}`,
      borderBottom: `1px solid ${T.c.n200}`,
    }}>
      <div style={{ padding: '0 20px' }}>
        <SectionHeader
          eyebrow="Recomendações"
          title={headline}
          fraunces
          icon="wine_bar"
        />
      </div>
      <div style={{
        marginTop: 14,
        display: 'flex', gap: 12,
        overflowX: 'auto', overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        padding: '4px 20px',
      }}>
        {wines.map((w, i) => (
          <WineSuggestionCard
            key={w.id || i}
            wine={w}
            onTap={() => onTapWine(w)}
          />
        ))}
      </div>
    </section>
  );
}

function WineSuggestionCard({ wine, onTap }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: 160, flexShrink: 0,
        textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: T.font,
        display: 'flex', flexDirection: 'column',
        transition: 'transform 100ms, border-color 120ms',
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
      <div style={{
        position: 'relative',
        height: 130,
        background: T.c.n100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <BottlePlaceholder width={64} height={100} label="" showLabel={false}/>
        {typeof wine.match === 'number' && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
          }}>
            {typeof MatchScoreBadge !== 'undefined' ? (
              <MatchScoreBadge score={wine.match} variant="pill" size="sm" interactive={false}/>
            ) : (
              <span style={{
                padding: '2px 8px',
                background: T.c.p700, color: T.c.n0,
                borderRadius: T.r.full,
                fontSize: 11, fontWeight: 700,
              }}>{wine.match}%</span>
            )}
          </div>
        )}
      </div>
      <div style={{
        padding: 12, display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        <div style={{
          ...T.t.overline, color: T.c.n600, letterSpacing: 0.8,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.producer || '—'}</div>
        <div style={{
          ...T.t.bodyB, color: T.c.n950,
          fontSize: 13, lineHeight: 1.3,
          marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name}</div>
        <div style={{
          marginTop: 'auto', paddingTop: 6,
          ...T.t.caption, color: T.c.n600,
        }}>{wine.country}{wine.region ? ` · ${wine.region}` : ''}</div>
      </div>
    </button>
  );
}

// ─── Related articles ────────────────────────────────────────
function RelatedArticlesSection({ articles, onTapArticle }) {
  return (
    <section style={{
      padding: '24px 20px 20px',
    }}>
      <SectionHeader
        eyebrow="Mais sobre o tema"
        title="Cards relacionados"
        fraunces
        icon="auto_stories"
      />
      <div style={{
        marginTop: 14,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {articles.map(a => (
          <RelatedRow
            key={a.id}
            article={a}
            onTap={() => onTapArticle(a)}
          />
        ))}
      </div>
    </section>
  );
}

function RelatedRow({ article, onTap }) {
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
        transition: 'border-color 120ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.c.p300; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.c.n200; }}
    >
      <div style={{
        width: 76, height: 76, flexShrink: 0,
        borderRadius: T.r.sm,
        background: `linear-gradient(160deg, ${article.gradient[0]} 0%, ${article.gradient[1]} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
        padding: 6,
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, opacity: 0.14,
          backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 14px)`,
        }}/>
        <Icon
          name={article.icon || 'auto_stories'}
          size={22}
          color="rgba(255,255,255,0.92)"
          fill={1}
          style={{ position: 'relative' }}
        />
      </div>
      <div style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column',
        gap: 2,
      }}>
        <div style={{
          ...T.t.overline, color: T.c.p700, letterSpacing: 0.8,
        }}>{article.categoryLabel}</div>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 14, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{article.title}</div>
        <div style={{
          marginTop: 'auto',
          ...T.t.caption, color: T.c.n600,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="schedule" size={12} color={T.c.n600}/>
          {article.readMin || 3} min
        </div>
      </div>
      <Icon name="chevron_right" size={20} color={T.c.n400} style={{ alignSelf: 'center' }}/>
    </button>
  );
}

// ─── Bits ─────────────────────────────────────────────────────
function DetalheIconBtn({ name, onClick, ariaLabel, fill = 0, active }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: hover ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.18)',
        border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 160ms',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <Icon
        name={name}
        size={20}
        color={active ? '#FFFFFF' : T.c.n0}
        fill={fill}
        weight={active ? 600 : 400}
      />
    </button>
  );
}

function DetalheFeedbackBtn({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 40, padding: '0 14px',
        background: active ? T.c.p700 : T.c.n0,
        color: active ? T.c.n0 : T.c.n800,
        border: `1px solid ${active ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.full,
        cursor: 'pointer',
        fontFamily: T.font, fontSize: 13, fontWeight: 600,
        flexShrink: 0,
        transition: 'background 120ms, color 120ms, border-color 120ms',
      }}
    >
      <Icon name={icon} size={16} color={active ? T.c.n0 : T.c.n800} fill={active ? 1 : 0}/>
      {label}
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function formatPopularViews(n) {
  if (!n) return '0';
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(1).replace('.0', '').replace('.', ',') + 'k';
}

// Default article body when an item from the catalog doesn't carry one.
function defaultBody(article) {
  const lead = article.excerpt || 'Uma leitura rápida pra acrescentar contexto na próxima taça.';
  return [
    { type: 'lead', text: lead },
    { type: 'p', text: 'Este conteúdo está sendo preparado pelo editorial. Em breve você encontra aqui o texto completo — com história, técnica e curiosidades pra colocar à mesa.' },
    { type: 'p', text: 'Enquanto isso, vale explorar os vinhos recomendados abaixo e os artigos relacionados no fim da página.' },
  ];
}

Object.assign(window, { DetalheCard });


export { ContentBlock, DetalheCard, DetalheFeedbackBtn, DetalheHero, DetalheIconBtn, RelatedArticlesSection, RelatedRow, RelatedWinesSection, WineSuggestionCard, defaultBody, formatPopularViews };
