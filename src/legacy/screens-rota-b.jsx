/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 04.B Você veio no lugar certo (intent='learn')
// ────────────────────────────────────────────────────────────
// Destination for intent='learn' — preview 3 educational cards filtered by
// userLevel. From here the user enters Comunidade with a #educacao bias for
// 14 days (filter applied downstream).
//
// Cards are READ-ONLY on this screen — they're a preview, not a TOC. Both
// CTAs route forward (feed or paladar); the cards themselves don't open
// detail views.

const LEARNING_CARDS = {
  iniciante: [
    { id: 'rotulo',     tag: 'UVA',       icon: 'label',
      title: 'Como ler um rótulo de vinho em 30 segundos',
      preview: 'Safra, produtor, denominação — o que olhar primeiro pra escolher melhor.' },
    { id: 'tipos',      tag: 'BÁSICO',    icon: 'wine_bar',
      title: 'Tinto, branco, rosé: a diferença que importa',
      preview: 'Pra além da cor: corpo, ocasião e harmonização básica de cada um.' },
    { id: 'erros',      tag: 'PRÁTICA',   icon: 'tips_and_updates',
      title: 'Os 5 erros de iniciante que todo mundo comete',
      preview: 'Temperatura, decantação, taça… coisas que ninguém te contou.' },
  ],
  intermediario: [
    { id: 'malbec',     tag: 'HISTÓRIA',  icon: 'public',
      title: 'Por que o Malbec virou argentino?',
      preview: 'A migração da uva francesa pra Mendoza e o que isso mudou no estilo.' },
    { id: 'sensorial',  tag: 'TÉCNICA',   icon: 'science',
      title: 'Acidez, tanino, corpo — como sentir cada um',
      preview: 'Exercícios práticos pra treinar o paladar sem ficar pretensioso.' },
    { id: 'harmonia',   tag: 'COMIDA',    icon: 'restaurant',
      title: 'Harmonização: regras que valem a pena saber',
      preview: 'Três princípios simples que cobrem 90% das ocasiões reais.' },
  ],
  avancado: [
    { id: 'terroir',    tag: 'TÉCNICA',   icon: 'terrain',
      title: 'Terroir além do marketing: o que muda na prática',
      preview: 'Solo, clima, mão humana — separando dado de discurso comercial.' },
    { id: 'natural',    tag: 'DEBATE',    icon: 'forest',
      title: 'Vinhos naturais x convencionais: o debate honesto',
      preview: 'Sem romantizar nem demonizar. O que cada lado defende e por quê.' },
    { id: 'investir',   tag: 'NEGÓCIO',   icon: 'trending_up',
      title: 'Investir em vinho: vale a pena?',
      preview: 'Como funcionam leilões, garrafas de guarda e o risco real do mercado.' },
  ],
};

const LEVEL_LABEL = {
  iniciante:     'iniciante',
  intermediario: 'entusiasta',
  avancado:      'expert',
};

function VoceVeioNoLugarCertoScreen({
  go,
  userLevel = 'iniciante',
  onStartLearning,
  onCalibratePaladar,
}) {
  const cards = LEARNING_CARDS[userLevel] || LEARNING_CARDS.iniciante;
  const levelLabel = LEVEL_LABEL[userLevel] || LEVEL_LABEL.iniciante;

  const track = (event, params = {}) => {
    try {
      if (typeof window.tcAnalytics === 'function') window.tcAnalytics(event, params);
      else if (typeof window.gtag === 'function')   window.gtag('event', event, params);
    } catch (e) {}
  };

  const handleStartLearning = () => {
    track('rota_b_to_feed', { level: userLevel });
    if (typeof onStartLearning === 'function') onStartLearning();
    else go('comunidade', { feedFilter: 'educacao', firstTime: true });
  };

  const handleCalibrate = () => {
    track('rota_b_to_paladar', { from_entry: 'rota_b_secondary' });
    if (typeof onCalibratePaladar === 'function') onCalibratePaladar();
    else go('quiz');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Top bar — back, no right action */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px 8px 4px', minHeight: 56,
      }}>
        <button onClick={() => go('back')} aria-label="Voltar" style={{
          width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950,
        }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1 }}/>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
          <div style={{ height: 32 }}/>

          {/* Hero illustration — 200×160, burgundy/50 bg */}
          <BooksAndGlassIllustration/>

          <div style={{ height: 24 }}/>

          {/* h1 — Fraunces 28, centered */}
          <h1 style={{
            margin: 0, textAlign: 'center', maxWidth: 312,
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 28, lineHeight: 1.15, fontWeight: 600,
            letterSpacing: '-0.02em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Você veio no lugar certo
          </h1>

          <div style={{ height: 12 }}/>

          {/* Body — Geist 14, neutral/800, max 320 */}
          <p style={{
            margin: 0, textAlign: 'center', maxWidth: 320,
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 14, lineHeight: 1.5, color: T.c.n800,
            textWrap: 'pretty',
          }}>
            Pra {levelLabel}, esses 3 cards são um ótimo começo.
          </p>

          <div style={{ height: 32 }}/>

          {/* 3 educational preview cards — tappable, route to aprenda-detalhe */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cards.map(c => <LearningPreviewCard key={c.id} card={c} onTap={() => {
              track('rota_b_card_tap', { card_id: c.id, level: userLevel });
              // Convert the preview card to a DetalheCard-compatible article
              const article = {
                id: c.id,
                title: c.title,
                categoryLabel: c.tag ? c.tag[0] + c.tag.slice(1).toLowerCase() : 'Aprenda',
                category: 'curiosidades',
                icon: c.icon,
                readMin: 3,
                preview: c.preview,
              };
              go('aprenda-detalhe', { article });
            }}/>)}
          </div>

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          onClick={handleStartLearning}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="rota_b_to_feed">
          Começar a aprender
        </Button>
        <Button
          variant="ghost" size="md" fullWidth
          onClick={handleCalibrate}
          data-route="rota_b_to_paladar">
          Primeiro, calibrar meu paladar
        </Button>
      </div>
    </div>
  );
}

// ─── Learning preview card — tappable ─────────────────────
function LearningPreviewCard({ card, onTap }) {
  const Tag = onTap ? 'button' : 'div';
  return (
    <Tag
      data-card-id={card.id}
      aria-label={card.title}
      onClick={onTap}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: 16, textAlign: 'left',
        background: T.c.n50, border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg, fontFamily: T.font,
        cursor: onTap ? 'pointer' : 'default',
      }}>
      {/* Image — 64×64 burgundy-tinted placeholder */}
      <div style={{
        width: 64, height: 64, flexShrink: 0,
        borderRadius: T.r.md,
        background: `linear-gradient(135deg, ${T.c.p100} 0%, ${T.c.p300} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 10px)`,
        }}/>
        <Icon name={card.icon} size={28} color={T.c.n0} weight={500} style={{ position: 'relative' }}/>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 10, lineHeight: 1.3, fontWeight: 600,
          letterSpacing: '0.7px', textTransform: 'uppercase',
          color: T.c.n600,
        }}>
          {card.tag}
        </div>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.35, fontWeight: 700, color: T.c.n950,
          marginTop: 2,
        }}>
          {card.title}
        </div>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 12, lineHeight: 1.4, color: T.c.n600,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginTop: 4,
        }}>
          {card.preview}
        </div>
      </div>

      <Icon name="arrow_forward" size={16} color={T.c.n400} style={{ flexShrink: 0, marginTop: 8 }}/>
    </Tag>
  );
}

// ─── Hero illustration — books with a wine glass ──────────
function BooksAndGlassIllustration() {
  return (
    <div style={{
      width: 200, height: 160, borderRadius: T.r.lg,
      background: T.c.p50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative', overflow: 'hidden',
    }} aria-hidden="true">
      {/* Subtle wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.5) 0%, transparent 60%)`,
        opacity: 0.7,
      }}/>
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none" style={{ position: 'relative' }}>
        {/* Shelf line */}
        <line x1="14" y1="98" x2="146" y2="98" stroke={T.c.p300} strokeWidth="2" strokeLinecap="round"/>

        {/* Stack of 3 books, leaning */}
        {/* Bottom book — burgundy */}
        <rect x="32" y="82" width="58" height="16" rx="1.5"
              fill={T.c.p700} stroke={T.c.p900} strokeWidth="1"/>
        <line x1="36" y1="86" x2="86" y2="86" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6"/>
        <line x1="36" y1="94" x2="86" y2="94" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6"/>

        {/* Middle book — gold */}
        <rect x="38" y="68" width="48" height="14" rx="1.5"
              fill={T.c.a700} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <line x1="42" y1="72" x2="82" y2="72" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6"/>

        {/* Top book — cream, slight tilt */}
        <g transform="rotate(-4 64 60)">
          <rect x="44" y="56" width="42" height="12" rx="1.5"
                fill={T.c.n0} stroke={T.c.n300} strokeWidth="1"/>
          <line x1="48" y1="60" x2="82" y2="60" stroke={T.c.n300} strokeWidth="0.5"/>
        </g>

        {/* Wine glass on the right — burgundy liquid */}
        <g>
          {/* Stem */}
          <line x1="120" y1="62" x2="120" y2="94" stroke={T.c.n800} strokeWidth="2" strokeLinecap="round"/>
          {/* Base */}
          <ellipse cx="120" cy="96" rx="14" ry="3.5" fill={T.c.n800}/>
          {/* Cup outer */}
          <path d="M 104 28 Q 104 60 120 62 Q 136 60 136 28 Z"
                fill="rgba(255,255,255,0.85)" stroke={T.c.n400} strokeWidth="1.2" strokeLinejoin="round"/>
          {/* Liquid */}
          <path d="M 107 40 Q 107 58 120 60 Q 133 58 133 40 Q 120 44 107 40 Z"
                fill={T.c.p700} opacity="0.92"/>
          {/* Highlight */}
          <path d="M 108 32 Q 110 44 114 50" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
}

Object.assign(window, { VoceVeioNoLugarCertoScreen, LearningPreviewCard, BooksAndGlassIllustration, LEARNING_CARDS, LEVEL_LABEL });


export { BooksAndGlassIllustration, LEARNING_CARDS, LEVEL_LABEL, LearningPreviewCard, VoceVeioNoLugarCertoScreen };
