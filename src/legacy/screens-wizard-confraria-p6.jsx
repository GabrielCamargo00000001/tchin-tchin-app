/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { TEMPLATES } from './screens-wizard-confraria-p2.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 08.06 Bora Marcar Primeiro Encontro
// ────────────────────────────────────────────────────────────
// Full-screen takeover que aparece imediatamente depois que o backend
// retorna { brotherhoodId }. NÃO é bottom-sheet — é o momento de
// celebração, então pega a tela inteira. US-12-10-02.
//
// Por que esta tela existe: o doc estima que 91% dos organizadores
// abandonam confraria se não agendam o primeiro evento em 7 dias. Esta
// é a porta de entrada pro Wizard Criar Evento (09.01) com tudo
// pré-preenchido a partir do template escolhido em 08.02.

// Mapeamento de template → título do primeiro encontro (spec literal)
const FIRST_EVENT_TITLES = {
  'Iniciantes':         'Primeiro encontro — degustação intro',
  'Tintos do Mundo':    'Primeiro encontro — explorando tintos',
  'Churrasco & Vinho':  'Primeiro encontro — churrasco com vinho',
  'Wine & Netflix':     'Wine & Netflix — episódio 1',
  'Girls Wine Night':   'Primeira noite só nossas',
};
const DEFAULT_FIRST_EVENT_TITLE = 'Primeiro encontro';

// Próximo sábado, formato pt-BR humanizado. Spec usa "Próximo sábado, 19h"
// como label literal; incluímos o dia/mês entre vírgulas pra dar contexto
// real ("Próximo sábado, 24 mai, 19h") já que a sugestão precisa ser
// concreta o bastante pro user entender o que vai virar evento.
function nextSaturdayLabel(now = new Date()) {
  const d = new Date(now);
  const dow = d.getDay(); // 0=Sun, 6=Sat
  const add = dow <= 6 ? (6 - dow || 7) : 1; // se hoje é sábado, pula pro próximo
  d.setDate(d.getDate() + add);
  const dia = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `Próximo sábado, ${dia.replace('.', '')}, 19h`;
}

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    templateName: string             — nome humano do template
//    brotherhoodId: string            — pra analytics
//    onCreateEvent: () => void        — abre 09.01 Wizard Criar Evento
//    onSkip: () => void               — Agora não → vai pra tela da confraria
function BoraMarcarPrimeiroEncontro({ templateName, brotherhoodId, onCreateEvent, onSkip }) {
  // Fire impression once on mount. brotherhood_created já foi disparado em P5,
  // mas reforçamos aqui também via first_event_cta_shown.
  React.useEffect(() => {
    fbEvent('first_event_cta_shown', { brotherhood_id: brotherhoodId, template_name: templateName });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    fbEvent('first_event_cta_clicked', { brotherhood_id: brotherhoodId, template_name: templateName });
    onCreateEvent();
  };
  const handleSkip = () => {
    fbEvent('first_event_cta_skipped', { brotherhood_id: brotherhoodId, template_name: templateName });
    onSkip();
  };

  const suggestionTitle = FIRST_EVENT_TITLES[templateName] || DEFAULT_FIRST_EVENT_TITLE;
  const dateLabel = nextSaturdayLabel();

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: T.c.n0, position: 'relative', overflow: 'hidden',
      animation: 'tcFadeIn 280ms ease',
    }}>
      {/* ── Close X (skip implícito) ── */}
      <div style={{
        position: 'absolute', top: 8, right: 8, zIndex: 2,
      }}>
        <button
          onClick={handleSkip}
          aria-label="Fechar e ir pra confraria"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n800,
          }}>
          <Icon name="close" size={24}/>
        </button>
      </div>

      {/* ── Scrollable body — celebração ── */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '48px 24px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <CelebrationHero/>

        <div style={{ height: 24 }}/>

        <h1 style={{
          margin: 0,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 28, lineHeight: 1.15, fontWeight: 600,
          letterSpacing: '-0.015em', color: T.c.n950,
          textAlign: 'center', textWrap: 'balance',
          maxWidth: 300,
        }}>
          Sua confraria está criada!
        </h1>

        <div style={{ height: 12 }}/>

        <p style={{
          margin: 0,
          fontFamily: T.font,
          fontSize: 15, lineHeight: 1.5, color: T.c.n800,
          textAlign: 'center', textWrap: 'pretty',
          maxWidth: 320,
        }}>
          Bora marcar o primeiro encontro? A gente já preparou uma sugestão baseada no seu tema.
        </p>

        <div style={{ height: 32 }}/>

        {/* ── Sugestão card ── */}
        <SuggestionCard title={suggestionTitle} dateLabel={dateLabel}/>

        <div style={{ height: 24 }}/>
      </div>

      {/* ── Bottom CTAs ── */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: T.c.n0,
        flexShrink: 0,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          onClick={handleCreate}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="event_wizard_1">
          Criar primeiro evento
        </Button>
        <Button
          variant="ghost" size="md" fullWidth
          onClick={handleSkip}>
          Agora não
        </Button>
      </div>
    </div>
  );
}

// ─── CelebrationHero — confetti + event icon ────────────────
function CelebrationHero() {
  // Confetti pré-calculado pra render determinístico (sem layout shift)
  const confetti = React.useMemo(() => {
    const palette = [T.c.p700, T.c.a700, T.c.p300, T.c.a500, T.c.p500];
    const pieces = [];
    const seed = [
      [12, 18, -22, 0], [88, 22, 14, 1], [22, 36, 10, 2], [78, 44, -8, 3],
      [40, 14, -14, 4], [62, 12, 22, 0], [10, 60, 6, 1], [90, 70, -18, 2],
      [30, 78, 24, 3], [70, 84, -6, 4], [50, 90, 12, 0], [18, 88, -10, 1],
      [82, 92, 18, 2], [44, 64, -22, 3], [56, 70, 14, 4],
    ];
    seed.forEach(([x, y, rot, ci], i) => {
      pieces.push({
        x, y, rot,
        color: palette[ci % palette.length],
        shape: i % 3, // 0 rect, 1 circle, 2 thin bar
      });
    });
    return pieces;
  }, []);

  return (
    <div style={{
      width: 200, height: 160,
      background: T.c.p50,
      borderRadius: T.r.lg,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {/* Confetti */}
      {confetti.map((c, i) => {
        const baseStyle = {
          position: 'absolute',
          left: `${c.x}%`, top: `${c.y}%`,
          transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
          background: c.color,
          opacity: 0.78,
        };
        if (c.shape === 0) return <div key={i} style={{ ...baseStyle, width: 8, height: 8, borderRadius: 1 }}/>;
        if (c.shape === 1) return <div key={i} style={{ ...baseStyle, width: 6, height: 6, borderRadius: '50%' }}/>;
        return <div key={i} style={{ ...baseStyle, width: 12, height: 3, borderRadius: 1 }}/>;
      })}
      {/* Event glyph — centered, scaled up for impact */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: T.c.n0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(74,31,36,0.18)',
        position: 'relative',
        animation: 'tcDrawIn 480ms cubic-bezier(0.2, 0.8, 0.2, 1) 80ms both',
      }}>
        <Icon name="event" size={42} color={T.c.p700} fill={1}/>
      </div>
    </div>
  );
}

// ─── SuggestionCard ─────────────────────────────────────────
function SuggestionCard({ title, dateLabel }) {
  return (
    <div style={{
      width: '100%',
      background: T.c.n50,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      padding: 16,
    }}>
      <div style={{
        fontFamily: T.font,
        fontSize: 11, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n600, marginBottom: 4,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        Sugestão
      </div>
      <div style={{
        fontFamily: T.font,
        fontSize: 15, lineHeight: 1.3, fontWeight: 700,
        color: T.c.n950, marginBottom: 12,
        textWrap: 'balance',
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Icon name="calendar_today" size={18} color={T.c.p700} fill={0}/>
        <span style={{
          fontFamily: T.font, fontSize: 14, fontWeight: 500,
          color: T.c.n950, lineHeight: 1.4,
        }}>
          {dateLabel}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="wine_bar" size={18} color={T.c.p700} fill={0}/>
        <span style={{
          fontFamily: T.font, fontSize: 14, fontWeight: 500,
          color: T.c.n950, lineHeight: 1.4,
        }}>
          3 vinhos sugeridos
        </span>
      </div>
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function BoraMarcarPrimeiroEncontroScreen({ go, params = {}, setCtx, ctx }) {
  const brotherhoodId = params.brotherhoodId || 'brh_demo';
  const brotherhoodName = params.brotherhoodName || 'Sua confraria';
  const templateId = params.template_id || 'churrasco_vinho';
  const tpl = TEMPLATES.find(t => t.id === templateId);
  const templateName = tpl ? tpl.name : 'Do zero';

  // Persist a synthetic "current brotherhood" so the tutorial overlay tem
  // contexto pra rodar depois da criação.
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__tcCurrentBrotherhood = {
        id: brotherhoodId,
        name: brotherhoodName,
        template_id: templateId,
        template_name: templateName,
        isAdmin: true,
        firstEventScheduled: false,
      };
    }
  }, [brotherhoodId, brotherhoodName, templateId, templateName]);

  const onCreateEvent = () => {
    go('event-wizard-1', {
      brotherhoodId,
      brotherhoodName,
      template_id: templateId,
      fromBrotherhoodCreation: true,
    });
  };
  const onSkip = () => {
    // Marca first_event_scheduled=false e abre a confraria criada
    // (placeholder synthetic) + dispara o tutorial 08.07 na primeira visita.
    if (typeof window !== 'undefined') {
      window.__tcShouldShowBrotherhoodTutorial = true;
    }
    const syntheticConfraria = {
      id: brotherhoodId,
      name: brotherhoodName,
      description: tpl ? tpl.description : 'Confraria criada agora mesmo.',
      members: 1,
      activity: 'pouco-ativa',
      visibility: 'publica',
      modality: 'presencial',
      location: 'Brasília, DF',
      tags: tpl ? tpl.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)) : [],
      _justCreated: true,
      _isAdmin: true,
    };
    go('confraria-detalhe', { confraria: syntheticConfraria, justCreated: true });
  };

  return (
    <BoraMarcarPrimeiroEncontro
      templateName={templateName}
      brotherhoodId={brotherhoodId}
      onCreateEvent={onCreateEvent}
      onSkip={onSkip}
    />
  );
}

Object.assign(window, {
  BoraMarcarPrimeiroEncontro,
  BoraMarcarPrimeiroEncontroScreen,
  FIRST_EVENT_TITLES,
  nextSaturdayLabel,
});


export { BoraMarcarPrimeiroEncontro, BoraMarcarPrimeiroEncontroScreen, CelebrationHero, DEFAULT_FIRST_EVENT_TITLE, FIRST_EVENT_TITLES, SuggestionCard, nextSaturdayLabel };
