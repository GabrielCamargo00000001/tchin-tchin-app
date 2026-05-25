/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 03.01 QuizNivel (gate 1 de 2 do onboarding)
// ────────────────────────────────────────────────────────────
// First gate after cadastro/login. Self-declared knowledge level powers:
//   1. Feed personalization (% conteúdo iniciante vs avançado)
//   2. Microcopy tone ("Sommelier" vs "Iniciante")
//   3. Default sort em Descobrir (populares vs raros/premiados)
//
// O Quiz de Paladar (5 perguntas) foi removido do onboarding — vira
// contextual depois (offered in-app pelo Descobrir).

const NIVEL_OPTIONS = [
  {
    id:    'iniciante',
    icon:  'school',
    title: 'Tô começando agora',
    body:  'Bebo vinho de vez em quando, mas não sei muito. Quero aprender sem complicar.',
  },
  {
    id:    'intermediario',
    icon:  'auto_stories',
    title: 'Curto vinho e quero saber mais',
    body:  'Já tenho meus favoritos, leio sobre vinho às vezes, gosto de descobrir novidades.',
  },
  {
    id:    'avancado',
    icon:  'workspace_premium',
    title: 'Sou entusiasta ou expert',
    body:  'Conheço regiões, uvas, harmonização. Vinho é parte da minha rotina ou profissão.',
  },
];

function QuizNivelScreen({ go, onLevelSelected }) {
  const [pressed, setPressed] = React.useState(null);
  const [routing, setRouting] = React.useState(false);

  const commit = (level) => {
    if (typeof onLevelSelected === 'function') onLevelSelected(level);
    // Stash for downstream personalization (microcopy/sort/etc.)
    try { window.__tcUserLevel = level; } catch (e) {}
    // Analytics hook — 'level_selected' { level }
    try {
      if (typeof window.tcAnalytics === 'function') {
        window.tcAnalytics('level_selected', { level });
      } else if (typeof window.gtag === 'function') {
        window.gtag('event', 'level_selected', { level });
      }
    } catch (e) {}
    // 03.01 → 03.02 (Interesses) per refactor; was tela-intencao
    go('quiz-interesses', { level });
  };

  const tapCard = (id) => {
    if (routing) return;
    setRouting(true);
    setPressed(id);
    // 200ms press feedback before route — matches Tela de Intenção pattern
    window.setTimeout(() => commit(id), 200);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative' }}>
      {/* Top bar — back disabled (first onboarding screen) + "1 de 3" caption */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px 8px 4px', minHeight: 56,
      }}>
        <button
          disabled
          aria-label="Voltar (desativado — primeira tela)"
          aria-disabled="true"
          style={{
            width: 48, height: 48, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            cursor: 'not-allowed', color: T.c.n300,
          }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1 }}/>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }}>
          1 de 3
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '32px 24px 0' }}>
          {/* h1 — Fraunces 32, neutral/950, ≤2 lines em 360px */}
          <h1 style={{
            margin: 0,
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 32, lineHeight: 1.1, fontWeight: 600,
            letterSpacing: '-0.02em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Como você se descreve no mundo do vinho?
          </h1>

          <div style={{ height: 12 }}/>

          {/* body/default — Geist 16, neutral/700 (token n800) */}
          <p style={{
            margin: 0,
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
            textWrap: 'pretty',
          }}>
            Sem julgamento — é só pra gente saber por onde começar com você.
          </p>

          <div style={{ height: 32 }}/>

          {/* 3 cards, vertical stack, gap 12, mínimo 84dp touch target */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NIVEL_OPTIONS.map(opt => (
              <NivelCard
                key={opt.id}
                option={opt}
                pressed={pressed === opt.id}
                dimmed={routing && pressed !== opt.id}
                onClick={() => tapCard(opt.id)}
              />
            ))}
          </div>

          <div style={{ height: 32 }}/>
        </div>
      </div>
    </div>
  );
}

function NivelCard({ option, pressed, dimmed, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-level={option.id}
      aria-label={option.title}
      style={{
        width: '100%', minHeight: 84,
        display: 'flex', flexDirection: 'column', gap: 12,
        padding: 20, textAlign: 'left',
        background: pressed
          ? T.c.p50
          : hover ? T.c.n100 : T.c.n50,
        border: `1px solid ${pressed ? T.c.p300 : (hover ? T.c.n300 : T.c.n200)}`,
        borderRadius: T.r.lg,
        cursor: dimmed ? 'default' : 'pointer',
        fontFamily: T.font,
        opacity: dimmed ? 0.55 : 1,
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease, opacity 160ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {/* Icon — 48×48, burgundy/50 bg, radius md */}
      <div style={{
        width: 48, height: 48, flexShrink: 0,
        borderRadius: T.r.md, background: T.c.p50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={option.icon} size={28} color={T.c.p700} weight={500}/>
      </div>

      {/* Title — h3 Fraunces */}
      <div style={{
        fontFamily: '"Fraunces", "Inter", Georgia, serif',
        fontSize: 18, lineHeight: 1.25, fontWeight: 600,
        letterSpacing: '-0.01em', color: T.c.n950,
      }}>
        {option.title}
      </div>

      {/* Body — Geist 14, neutral/700 (n800), 2 lines */}
      <div style={{
        fontFamily: '"Geist", "Inter", system-ui, sans-serif',
        fontSize: 14, lineHeight: 1.5, color: T.c.n800,
        textWrap: 'pretty',
        marginTop: -8, // tightens the 4px gap intent (12 - 8 ≈ 4 visual)
      }}>
        {option.body}
      </div>
    </button>
  );
}



// ─── 03.02 Interesses ─────────────────────────────────────
// Multi-select de uvas + regiões. 3 mínimo, 8 máximo. Feeds early-feed
// personalization (30% conteúdo taggeado + 70% geral nos primeiros 14 dias).
const UVAS_OPTIONS = [
  { id: 'cabernet_sauvignon', label: 'Cabernet Sauvignon', tint: '#4A1F24' },
  { id: 'merlot',             label: 'Merlot',             tint: '#5C2A30' },
  { id: 'malbec',             label: 'Malbec',             tint: '#3F1A1E' },
  { id: 'pinot_noir',         label: 'Pinot Noir',         tint: '#722F37' },
  { id: 'syrah',              label: 'Syrah',              tint: '#3A151A' },
  { id: 'tannat',             label: 'Tannat',             tint: '#2E1014' },
  { id: 'chardonnay',         label: 'Chardonnay',         tint: '#C8A85A' },
  { id: 'sauvignon_blanc',    label: 'Sauvignon Blanc',    tint: '#B8C68A' },
];
const ESTILOS_OPTIONS = [
  { id: 'rose',      label: 'Rosé',      tint: '#E8A0A8' },
  { id: 'espumante', label: 'Espumante', tint: '#D9C07A' },
];
const REGIOES_OPTIONS = [
  { id: 'vale_vinhedos',      label: 'Vale dos Vinhedos',     flag: '🇧🇷', tint: '#2E5734' },
  { id: 'serra_gaucha',       label: 'Serra Gaúcha',          flag: '🇧🇷', tint: '#356B3E' },
  { id: 'vale_sao_francisco', label: 'Vale do São Francisco', flag: '🇧🇷', tint: '#8A6A2A' },
  { id: 'mendoza',            label: 'Mendoza',               flag: '🇦🇷', tint: '#6B3540' },
  { id: 'douro',              label: 'Douro',                 flag: '🇵🇹', tint: '#5B2730' },
  { id: 'bordeaux',           label: 'Bordeaux',              flag: '🇫🇷', tint: '#4A1F24' },
  { id: 'toscana',            label: 'Toscana',               flag: '🇮🇹', tint: '#8A4A2A' },
  { id: 'rioja',              label: 'Rioja',                 flag: '🇪🇸', tint: '#6E2B2F' },
];
const MIN_INTERESSES = 3;
const MAX_INTERESSES = 8;
const TOTAL_OPTIONS  = UVAS_OPTIONS.length + ESTILOS_OPTIONS.length + REGIOES_OPTIONS.length; // 18

function InteressesScreen({ go, params = {}, onInterestsSelected, initialSelected }) {
  const [selected, setSelected] = React.useState(initialSelected || []);
  const [shake, setShake]       = React.useState(null); // card id that just got rejected

  const toast = (message, kind = 'warning') => {
    if (typeof go === 'function') go('toast', { kind, message });
  };

  const toggle = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= MAX_INTERESSES) {
        toast(`Máximo ${MAX_INTERESSES} interesses`, 'warning');
        setShake(id);
        window.setTimeout(() => setShake(null), 400);
        return prev;
      }
      return [...prev, id];
    });
  };

  const canContinue = selected.length >= MIN_INTERESSES;

  const onContinue = () => {
    if (!canContinue) {
      toast(`Selecione pelo menos ${MIN_INTERESSES}`, 'warning');
      return;
    }
    // Analytics — interests_completed { count, interests }
    try {
      const payload = { count: selected.length, interests: selected };
      if (typeof window.tcAnalytics === 'function') window.tcAnalytics('interests_completed', payload);
      else if (typeof window.gtag === 'function')   window.gtag('event', 'interests_completed', payload);
    } catch (e) {}
    try { window.__tcUserInterests = selected; } catch (e) {}
    if (typeof onInterestsSelected === 'function') onInterestsSelected(selected);
    go('tela-intencao', { level: params.level, interests: selected });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Top bar — back + "2 de 3" */}
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
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }}>
          2 de 3
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{
            margin: 0,
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 28, lineHeight: 1.15, fontWeight: 600,
            letterSpacing: '-0.02em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Escolha seus interesses
          </h2>
          <div style={{ height: 8 }}/>
          <p style={{
            margin: 0,
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            Selecione entre {MIN_INTERESSES} e {MAX_INTERESSES}. Você pode mudar depois.
          </p>
          <div style={{ height: 16 }}/>

          {/* UVAS */}
          <SectionLabel>UVAS</SectionLabel>
          <InteresseGrid
            items={UVAS_OPTIONS}
            selected={selected}
            shake={shake}
            onToggle={toggle}
            renderArt={(item) => <GrapeArt tint={item.tint}/>}
          />

          <div style={{ height: 16 }}/>

          {/* ESTILOS */}
          <SectionLabel>ESTILOS</SectionLabel>
          <InteresseGrid
            items={ESTILOS_OPTIONS}
            selected={selected}
            shake={shake}
            onToggle={toggle}
            renderArt={(item) => <StyleArt tint={item.tint} sparkle={item.id === 'espumante'}/>}
          />

          <div style={{ height: 16 }}/>

          {/* REGIÕES */}
          <SectionLabel>REGIÕES</SectionLabel>
          <InteresseGrid
            items={REGIOES_OPTIONS}
            selected={selected}
            shake={shake}
            onToggle={toggle}
            renderArt={(item) => <RegionArt tint={item.tint} flag={item.flag}/>}
          />

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* Bottom — counter + CTA */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
      }}>
        <div aria-live="polite" style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 12, lineHeight: 1.4, color: T.c.n600,
          marginBottom: 8,
        }}>
          <span style={{ color: T.c.n950, fontWeight: 600 }}>{selected.length}</span> de {TOTAL_OPTIONS} selecionados
          {selected.length > 0 && selected.length < MIN_INTERESSES && (
            <span style={{ color: T.c.w700, marginLeft: 6 }}>
              · faltam {MIN_INTERESSES - selected.length}
            </span>
          )}
        </div>
        <Button
          variant="primary" size="lg" fullWidth
          disabled={!canContinue}
          onClick={onContinue}
          trailing={canContinue ? <Icon name="arrow_forward" size={18}/> : null}
          data-route="continue_to_intencao">
          {canContinue ? 'Continuar' : `Selecione ${MIN_INTERESSES - selected.length}`}
        </Button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: '"Geist", "Inter", system-ui, sans-serif',
      fontSize: 11, lineHeight: 1.4, fontWeight: 600,
      letterSpacing: '0.8px', textTransform: 'uppercase',
      color: T.c.n600, marginBottom: 8,
    }}>{children}</div>
  );
}

function InteresseGrid({ items, selected, shake, onToggle, renderArt }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
    }}>
      {items.map(item => (
        <InteresseCard
          key={item.id}
          item={item}
          selected={selected.includes(item.id)}
          shaking={shake === item.id}
          onToggle={() => onToggle(item.id)}
          renderArt={renderArt}
        />
      ))}
    </div>
  );
}

function InteresseCard({ item, selected, shaking, onToggle, renderArt }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-id={item.id}
      aria-pressed={selected}
      aria-label={item.label}
      style={{
        position: 'relative',
        width: '100%', aspectRatio: '1 / 1', minHeight: 96,
        padding: 0,
        background: T.c.n50,
        border: `${selected ? 2 : 1}px solid ${selected ? T.c.p700 : T.c.n200}`,
        borderRadius: T.r.md,
        overflow: 'hidden',
        cursor: 'pointer', fontFamily: T.font,
        display: 'flex', flexDirection: 'column',
        transform: shaking ? 'translateX(2px)' : (selected ? 'scale(0.97)' : 'scale(1)'),
        transition: 'transform 200ms ease, border-color 160ms ease, background 160ms ease',
        animation: shaking ? 'tcShake 380ms ease' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {/* Art area — ~70% */}
      <div style={{
        flex: '0 0 68%', position: 'relative',
        background: T.c.n100, overflow: 'hidden',
      }}>
        {renderArt(item)}
      </div>
      {/* Label */}
      <div style={{
        flex: '1 1 auto', padding: '6px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Geist", "Inter", system-ui, sans-serif',
        fontSize: 11, lineHeight: 1.2, fontWeight: 500,
        color: T.c.n950, textAlign: 'center',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        width: '100%',
      }}>
        {item.label}{item.flag ? ` ${item.flag}` : ''}
      </div>
      {/* Selected badge — top-right 16×16 burgundy/700 + white check */}
      {selected && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 18, height: 18, borderRadius: '50%',
          background: T.c.p700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 2px ' + T.c.n0,
        }}>
          <Icon name="check" size={12} color={T.c.n0} weight={700}/>
        </div>
      )}
    </button>
  );
}

// Stylized grape SVG — abstract, never mistaken for a real photo
function GrapeArt({ tint = '#722F37' }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 96 64" preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block', background: `linear-gradient(135deg, ${T.c.n100}, ${T.c.n50})` }}>
      {/* Stem */}
      <path d="M48 6 Q52 10 50 18" stroke="#6B6B6B" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M44 10 Q42 14 46 18" stroke="#6B6B6B" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Cluster — 6 grape circles */}
      {[
        [42, 24], [54, 24],
        [36, 34], [48, 34], [60, 34],
        [42, 44], [54, 44],
        [48, 54],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill={tint} opacity={0.85}/>
      ))}
      {/* highlight */}
      <circle cx="40" cy="22" r="1.5" fill="rgba(255,255,255,0.5)"/>
    </svg>
  );
}

// Region card — banded landscape silhouette with flag overlay
function RegionArt({ tint = '#4A1F24', flag = '🇧🇷' }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg width="100%" height="100%" viewBox="0 0 96 64" preserveAspectRatio="xMidYMid slice"
        style={{ display: 'block' }}>
        <rect x="0" y="0" width="96" height="64" fill={tint} opacity="0.85"/>
        {/* Rolling hills silhouette */}
        <path d="M0 44 Q24 32 48 40 T96 38 L96 64 L0 64 Z" fill="rgba(0,0,0,0.25)"/>
        <path d="M0 52 Q20 46 44 50 T96 48 L96 64 L0 64 Z" fill="rgba(0,0,0,0.35)"/>
        {/* Sun */}
        <circle cx="74" cy="18" r="6" fill="rgba(255,255,255,0.35)"/>
      </svg>
      <span style={{
        position: 'absolute', top: 6, left: 6,
        fontSize: 14, lineHeight: 1, pointerEvents: 'none',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.35))',
      }}>{flag}</span>
    </div>
  );
}

// Stylized wine-glass SVG for styles (Rosé / Espumante) — abstract, on-brand
function StyleArt({ tint = '#E8A0A8', sparkle = false }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 96 64" preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block', background: `linear-gradient(135deg, ${T.c.n100}, ${T.c.n50})` }}>
      {/* Bowl */}
      <path d="M37 14 L59 14 Q58 31 48 39 Q38 31 37 14 Z" fill={tint} opacity="0.9"/>
      {/* Stem + base */}
      <path d="M48 39 L48 51" stroke="#6B6B6B" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M40 53 L56 53" stroke="#6B6B6B" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Bubbles for espumante */}
      {sparkle && [[46, 30], [50, 26], [47, 22], [51, 18]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.3" fill="rgba(255,255,255,0.85)"/>
      ))}
    </svg>
  );
}

Object.assign(window, { QuizNivelScreen, NIVEL_OPTIONS, InteressesScreen, UVAS_OPTIONS, ESTILOS_OPTIONS, REGIOES_OPTIONS });


export { ESTILOS_OPTIONS, GrapeArt, InteresseCard, InteresseGrid, InteressesScreen, MAX_INTERESSES, MIN_INTERESSES, NIVEL_OPTIONS, NivelCard, QuizNivelScreen, REGIOES_OPTIONS, RegionArt, SectionLabel, StyleArt, TOTAL_OPTIONS, UVAS_OPTIONS };
