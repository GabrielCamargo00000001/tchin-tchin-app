/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_USER, QUIZ_QUESTIONS } from './data.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — Quiz Paladar + Radar resultado

// 5D Radar chart (the centerpiece — replaces donut)
// Axis order: Acidez (top), Tanino (top-right), Corpo (bottom-right),
//             Frutado (bottom-left, maps to 'alcool' key), Doçura (top-left)
function PaladarRadar({ paladar, wine, size = 280, animate = true, showLabels = true, showWine = !!wine }) {
  const axes = [
    { key: 'acidez',  label: 'Acidez',  pos: 'top' },
    { key: 'tanino',  label: 'Tanino',  pos: 'tr' },
    { key: 'corpo',   label: 'Corpo',   pos: 'br' },
    { key: 'alcool',  label: 'Frutado', pos: 'bl' },
    { key: 'docura',  label: 'Doçura',  pos: 'tl' },
  ];
  const cx = size / 2, cy = size / 2;
  const r = size * 0.36;
  const angle = i => (-Math.PI / 2) + (i * 2 * Math.PI / 5);
  const pt = (i, v) => {
    const a = angle(i);
    const rad = r * (v / 100);
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  };
  const labelPt = i => {
    const a = angle(i);
    const rad = r + 24;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  };
  const userPoly = axes.map((ax, i) => pt(i, paladar[ax.key])).map(p => p.join(',')).join(' ');
  const winePoly = wine ? axes.map((ax, i) => pt(i, wine[ax.key])).map(p => p.join(',')).join(' ') : null;
  const grid = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Grid pentagons */}
      {grid.map(g => (
        <polygon key={g}
          points={axes.map((_, i) => pt(i, g).join(',')).join(' ')}
          fill="none" stroke={T.c.n200} strokeWidth="1"/>
      ))}
      {/* Spokes */}
      {axes.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={T.c.n200} strokeWidth="1"/>;
      })}
      {/* Wine perfil overlay */}
      {showWine && winePoly && (
        <polygon points={winePoly} fill={T.c.a700} fillOpacity="0.15" stroke={T.c.a700} strokeWidth="2" strokeDasharray="4 3"
                 style={{ animation: animate ? 'tcFadeIn 600ms ease 200ms both' : 'none' }}/>
      )}
      {/* User paladar */}
      <polygon points={userPoly} fill={T.c.p700} fillOpacity="0.22" stroke={T.c.p700} strokeWidth="2.5" strokeLinejoin="round"
               style={{ animation: animate ? 'tcDrawIn 700ms ease both' : 'none' }}/>
      {axes.map((ax, i) => {
        const [x, y] = pt(i, paladar[ax.key]);
        return <circle key={i} cx={x} cy={y} r="4" fill={T.c.p700}/>;
      })}
      {/* Axis labels */}
      {showLabels && axes.map((ax, i) => {
        const [x, y] = labelPt(i);
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={T.c.n800} fontFamily="Inter">
              {ax.label}
            </text>
            <text y="14" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="500" fill={T.c.p700} fontFamily="Inter">
              {paladar[ax.key]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Quiz Paladar ──────────────────────────────────────────
function QuizScreen({ go }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [pending, setPending] = React.useState(null);
  const q = QUIZ_QUESTIONS[step];
  const total = QUIZ_QUESTIONS.length;
  const current = pending != null ? pending : answers[q.id];

  const back = () => {
    setPending(null);
    if (step > 0) setStep(step - 1);
    else go('cadastro');
  };
  const next = () => {
    if (current == null) return;
    const merged = { ...answers, [q.id]: current };
    setAnswers(merged);
    setPending(null);
    if (step < total - 1) setStep(step + 1);
    else go('quiz-result', { paladar: merged });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 4px', minHeight: 56, borderBottom: `1px solid ${T.c.n100}` }}>
        <button onClick={back} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950 }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: T.c.n950 }}>Seu paladar</div>
        <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.c.n600, padding: '6px 10px', background: T.c.n100, borderRadius: 999 }}>
          {step + 1} de {total}
        </div>
      </div>

      {/* Progress segments */}
      <div style={{ padding: '16px 24px 0', display: 'flex', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i <= step ? T.c.p700 : T.c.n200,
            transition: 'background 240ms',
          }}/>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: T.c.n600, marginBottom: 8 }}>
          Pergunta {step + 1} de {total}
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 700, color: T.c.n950, marginBottom: 6, textWrap: 'balance' }}>{q.question}</div>
        <div style={{ fontSize: 14, color: T.c.n600, lineHeight: 1.45 }}>{q.hint}</div>
      </div>

      <div style={{ flex: 1, padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
        {q.options.map((o, i) => {
          const selected = current === o.value;
          return (
            <button key={i} onClick={() => setPending(o.value)} style={{
              padding: '16px 18px', minHeight: 64,
              background: selected ? T.c.p50 : T.c.n0,
              border: `${selected ? 2 : 1.5}px solid ${selected ? T.c.p700 : T.c.n300}`,
              borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 160ms', fontFamily: T.font,
              boxShadow: selected ? '0 1px 3px rgba(114,47,55,0.12)' : 'none',
            }}>
              <div style={{ fontSize: 24, lineHeight: 1, width: 32, textAlign: 'center', flexShrink: 0 }}>{o.emoji}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: T.c.n950 }}>{o.label}</div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${selected ? T.c.p700 : T.c.n300}`,
                background: T.c.n0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 160ms',
              }}>
                {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.c.p700 }}/>}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${T.c.n100}` }}>
        <Button variant="primary" size="lg" fullWidth disabled={current == null} onClick={next}>
          {step === total - 1 ? 'Ver meu paladar' : 'Continuar'}
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={back}>Voltar</Button>
      </div>
    </div>
  );
}

// ─── Quiz Result (radar 5D) ────────────────────────────────
function classifyPaladar(p) {
  const { docura = 0, acidez = 0, tanino = 0, corpo = 0, alcool = 0 } = p;
  // Doce: doçura alta + acidez baixa
  if (docura >= 60 && acidez <= 45)
    return { name: 'Doce', text: 'Você curte vinhos doces e aveludados, com baixa acidez. Moscatel, Sauternes e Lambrusco Amabile vão te conquistar.' };
  // Intenso: tanino alto + corpo alto
  if (tanino >= 60 && corpo >= 60)
    return { name: 'Intenso', text: 'Seu paladar pede vinhos encorpados, com taninos firmes e estrutura marcante. Malbec, Cabernet Sauvignon e Syrah são pra você.' };
  // Clássico: acidez alta + tanino médio-alto
  if (acidez >= 55 && tanino >= 50)
    return { name: 'Clássico', text: 'Seu paladar pede vinhos com estrutura e acidez vibrante. Sangiovese, Nebbiolo e Barbera vão te conquistar.' };
  // Vibrante: acidez alta + corpo leve
  if (acidez >= 55 && corpo <= 45)
    return { name: 'Vibrante', text: 'Brancos refrescantes e tintos leves combinam com você. Sauvignon Blanc, Pinot Grigio e Beaujolais são apostas certeiras.' };
  // Suave: acidez baixa + tanino baixo
  if (acidez <= 45 && tanino <= 45)
    return { name: 'Suave', text: 'Você prefere vinhos macios, fáceis de beber, sem aspereza. Lambrusco, Moscato e Merlot leves vão te agradar.' };
  // Elegante: equilíbrio em tudo (default)
  return { name: 'Elegante', text: 'Seu paladar é equilibrado, sem extremos — pede vinhos refinados de meio-termo. Pinot Noir, Chianti e Tempranillo são pra você.' };
}

function QuizResultScreen({ go, params }) {
  const paladar = params?.paladar || MOCK_USER.paladar;
  const profile = classifyPaladar(paladar);
  // Profile description (2 lines max)
  const profileBody = {
    'Doce':      'Você tende a gostar de vinhos macios e aveludados, com baixa acidez. Moscatel, Lambrusco Amabile e Sauternes costumam combinar com seu paladar.',
    'Intenso':   'Você tende a gostar de vinhos estruturados, com taninos marcantes e final longo. Cabernet, Malbec e Tannat costumam combinar com seu paladar.',
    'Clássico':  'Você tende a gostar de vinhos com acidez vibrante e estrutura clássica. Sangiovese, Nebbiolo e Barbera costumam combinar com seu paladar.',
    'Vibrante':  'Você tende a gostar de brancos refrescantes e tintos leves, com acidez marcante. Sauvignon Blanc, Pinot Grigio e Beaujolais costumam combinar.',
    'Suave':     'Você tende a gostar de vinhos macios, fáceis de beber, sem aspereza. Lambrusco, Moscato e Merlot leves costumam combinar com seu paladar.',
    'Elegante':  'Você tende a gostar de vinhos equilibrados, refinados, sem extremos. Pinot Noir, Chianti e Tempranillo costumam combinar com seu paladar.',
  }[profile.name] || profile.text;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Top bar — progress + etapa final */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 4px', minHeight: 56, borderBottom: `1px solid ${T.c.n100}` }}>
        <button onClick={() => go('quiz')} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950 }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ ...T.t.caption, color: T.c.p700, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>Etapa final</div>
          <div style={{ ...T.t.label, color: T.c.n800, fontFamily: T.mono, marginTop: 1 }}>5 de 5</div>
        </div>
        <div style={{ width: 48 }}/>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Title block */}
        <div style={{ padding: '28px 24px 8px', textAlign: 'center' }}>
          <div style={{
            fontSize: 28, lineHeight: 1.1, fontWeight: 700,
            color: T.c.p900, letterSpacing: '-0.02em',
            fontFamily: '"Fraunces", "Inter", Georgia, serif',
            marginBottom: 8,
          }}>Seu DNA de Paladar</div>
          <div style={{ ...T.t.body, color: T.c.n800, fontSize: 14 }}>
            Calculamos seu perfil sensorial em 5 dimensões
          </div>
        </div>

        {/* Radar — 280×280, 5 axes in exact order: Acidez, Tanino, Corpo, Frutado, Doçura */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
          <PaladarRadar paladar={paladar} size={280}/>
        </div>

        {/* Card "Perfil identificado" */}
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: T.c.n50, borderRadius: T.r.lg,
            padding: 20, border: `1px solid ${T.c.n200}`,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.6px',
              textTransform: 'uppercase', color: T.c.p700, marginBottom: 6,
            }}>Perfil identificado</div>
            <div style={{
              fontSize: 20, lineHeight: 1.2, fontWeight: 600,
              color: T.c.n950, letterSpacing: '-0.01em',
              fontFamily: '"Fraunces", "Inter", Georgia, serif',
              marginBottom: 8,
            }}>{profile.name}</div>
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>
              {profileBody}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: 32 }}/>
      </div>

      {/* Bottom fixed CTAs */}
      <div style={{
        padding: '12px 24px 24px',
        borderTop: `1px solid ${T.c.n100}`,
        background: T.c.n0,
        display: 'flex', flexDirection: 'column', gap: 8,
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}>
        <Button variant="primary" size="lg" fullWidth
          onClick={() => go('tela-intencao', { paladar })}
          trailing={<Icon name="arrow_forward" size={18}/>}>
          Continuar
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('quiz')}>
          Refazer quiz
        </Button>
      </div>
    </div>
  );
}

// ─── 06.01 GPS Permission Primer ──────────────────────────
// Explains *why* GPS is needed BEFORE calling the native OS prompt.
// Material 3 / Apple HIG best practice: never trigger the cold native prompt.
//
// API (explicit — used when the screen is rendered directly):
//   variant            'D' (find confrarias) | 'E' (create confraria wizard)
//   onActivateLocation callback fired on user tap of primary CTA
//   onSkip             callback fired on "Agora não"
//
// Routing (legacy — used when navigated via the prototype's go() with params):
//   params.next     'confrarias' | 'wizard-confraria'
//   params.intent   'gps_primer_then_confrarias' | 'gps_primer_then_wizard'
function GpsPrimerScreen({
  go, params = {},
  variant,
  onActivateLocation,
  onSkip,
}) {
  const [requesting, setRequesting] = React.useState(false);
  const [dialog, setDialog]         = React.useState(false);

  // Resolve variant: explicit prop wins, then derive from params
  const isWizard = variant === 'E'
    || params.intent === 'gps_primer_then_wizard'
    || params.next === 'wizard-confraria';
  const next     = params.next || (isWizard ? 'wizard-confraria' : 'confrarias');
  const rota     = isWizard ? 'E' : 'D';

  // Copy variants — discovery (default) vs. wizard (create-confraria)
  const copy = isWizard
    ? {
        title: 'Pra cadastrar onde sua confraria se encontra',
        body:  'Você pode escolher cidade e UF manualmente também — mas usar GPS é mais rápido. Desativável depois.',
      }
    : {
        title: 'Pra encontrar confrarias perto de você',
        body:  'Usamos sua localização só pra mostrar confrarias e eventos da sua região. Você pode desativar a qualquer momento nas Configurações.',
      };

  // Analytics — fire 'gps_primer_shown' once on mount
  React.useEffect(() => {
    try {
      if (typeof window.tcAnalytics === 'function') window.tcAnalytics('gps_primer_shown', { rota });
      else if (typeof window.gtag === 'function')   window.gtag('event', 'gps_primer_shown', { rota });
    } catch (e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const trackResponse = (response) => {
    try {
      const payload = { rota, response };
      if (typeof window.tcAnalytics === 'function') window.tcAnalytics('gps_primer_response', payload);
      else if (typeof window.gtag === 'function')   window.gtag('event', 'gps_primer_response', payload);
    } catch (e) {}
  };

  // Routes the user to their post-primer destination, tagging the
  // location_status. Wizard intent skips welcome-final — the create-confraria
  // wizard takes priority over the tour overlay per matriz §4.
  const routeToDest = (locationStatus) => {
    const i = params.intent || (isWizard ? 'gps_primer_then_wizard' : 'gps_primer_then_confrarias');
    try { window.__tcLastIntent = i; } catch (e) {}
    if (i === 'gps_primer_then_wizard' || next === 'wizard-confraria') {
      go('wizard-confraria-1', { location_status: locationStatus, intent: i });
      return;
    }
    go('welcome-final', { intent: i, location_status: locationStatus });
  };

  // CTA — Allow → triggers (simulated) native OS prompt
  const onAllow = () => {
    if (requesting) return;
    if (typeof onActivateLocation === 'function') {
      onActivateLocation();
      return;
    }
    setRequesting(true);
    window.setTimeout(() => { setRequesting(false); setDialog(true); }, 350);
  };
  // OS prompt outcomes
  const systemGrant = () => {
    setDialog(false);
    trackResponse('granted');
    go('toast', { variant: 'success', message: 'Tudo certo! Mostrando confrarias da sua região.' });
    window.setTimeout(() => routeToDest('granted'), 220);
  };
  const systemDeny = () => {
    setDialog(false);
    trackResponse('denied');
    // 06.03 — hard deny state (system-level denial)
    go('gps-negado', { next, intent: params.intent });
  };
  // "Agora não" — soft deny, never destructive styling
  const onNotNow = () => {
    trackResponse('soft');
    if (typeof onSkip === 'function') { onSkip(); return; }
    routeToDest('denied_soft');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative' }}>
      {/* Top bar — back + "Etapa 7 de 7" caption */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px 8px 4px', minHeight: 56,
      }}>
        <button
          onClick={() => go('back')}
          aria-label="Voltar"
          style={{
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
          Etapa 7 de 7
        </div>
      </div>

      {/* Body — generous vertical spacing per spec (64 / 32 / 12 / 48) */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 24px', overflow: 'auto',
      }}>
        <div style={{ height: 64 }}/>

        {/* Illustration — 160×160, burgundy/50, radius full, Material Symbol 80×80 */}
        <div style={{
          width: 160, height: 160, borderRadius: T.r.full,
          background: T.c.p50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="location_on" size={80} color={T.c.p700} weight={500} fill={1}/>
        </div>

        <div style={{ height: 32 }}/>

        {/* h2 — Fraunces, centered, max 2 lines */}
        <h2 style={{
          margin: 0, textAlign: 'center', maxWidth: 312,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 24, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
          textWrap: 'balance',
        }}>
          {copy.title}
        </h2>

        <div style={{ height: 12 }}/>

        {/* body/default — Geist 14, neutral/700 (closest token n800), max-width 280 */}
        <p style={{
          margin: 0, textAlign: 'center', maxWidth: 280,
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
          textWrap: 'pretty',
        }}>
          {copy.body}
        </p>

        <div style={{ height: 48 }}/>
      </div>

      {/* Fixed bottom CTAs */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: T.c.n0,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          loading={requesting}
          onClick={onAllow}
          leading={<Icon name="my_location" size={18}/>}
          data-route="allow_gps">
          Ativar localização
        </Button>
        <Button
          variant="ghost" size="md" fullWidth
          onClick={onNotNow}
          disabled={requesting}
          data-route="not_now">
          Agora não
        </Button>
      </div>

      {/* Simulated system dialog (Android style) — only after user taps CTA */}
      {dialog && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50, animation: 'tcFadeIn 200ms ease' }}>
          <div style={{ background: T.c.n0, borderRadius: 28, padding: '24px 24px 12px', width: '100%', maxWidth: 320, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Icon name="my_location" size={32} color={T.c.n800}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: T.c.n950, textAlign: 'center', marginBottom: 8, lineHeight: 1.3 }}>
              Permitir que Tchin Tchin acesse a localização deste dispositivo?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
              {[
                { label: 'Durante o uso do app', onClick: systemGrant },
                { label: 'Somente desta vez',    onClick: systemGrant },
                { label: 'Não permitir',         onClick: systemDeny },
              ].map((opt, i) => (
                <button key={i} onClick={opt.onClick} style={{
                  padding: '14px 12px', background: 'transparent', border: 'none',
                  fontSize: 14, fontWeight: 500, color: T.c.p700, textAlign: 'left',
                  cursor: 'pointer', fontFamily: T.font, borderRadius: 8,
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.c.n100}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 06.03 GPS Negado (hard-deny state) ───────────────────
// Reached when the user denied the OS prompt. Offers a manual path forward
// and a way to retry via system settings.
function GpsNegadoScreen({ go, params = {} }) {
  const next = params.next || 'confrarias';

  const proceedManual = () => {
    const i = params.intent || 'gps_primer_then_confrarias';
    try { window.__tcLastIntent = i; } catch (e) {}
    if (i === 'gps_primer_then_wizard' || params.next === 'wizard-confraria') {
      go('wizard-confraria-1', { location_status: 'denied', intent: i });
      return;
    }
    go('welcome-final', { intent: i, location_status: 'denied' });
  };
  const tryAgain      = () => go('gps-primer', { next, intent: params.intent });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Top bar */}
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
          Etapa 7 de 7
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px', overflow: 'auto' }}>
        <div style={{ height: 64 }}/>
        <div style={{
          width: 160, height: 160, borderRadius: T.r.full,
          background: T.c.n100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="location_off" size={72} color={T.c.n600} weight={500}/>
        </div>
        <div style={{ height: 32 }}/>
        <h2 style={{
          margin: 0, textAlign: 'center', maxWidth: 312,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 24, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Sem problema, dá pra continuar
        </h2>
        <div style={{ height: 12 }}/>
        <p style={{
          margin: 0, textAlign: 'center', maxWidth: 280,
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
        }}>
          Você pode escolher cidade e UF manualmente. Pra liberar GPS depois, é só ir em Configurações do app no celular.
        </p>
        <div style={{ height: 48 }}/>
      </div>

      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <Button variant="primary" size="lg" fullWidth onClick={proceedManual}>
          Escolher cidade manualmente
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={tryAgain}>
          Tentar de novo
        </Button>
      </div>
    </div>
  );
}

// ─── Tela de Intenção (05.01) — production ────────────────
// Routes the user to one of 4 paths after seeing their Paladar profile.
// Single-tap routing: card press immediately commits the intent.
const INTENT_OPTIONS = [
  {
    id: 'discover_home',
    icon: 'local_bar',
    title: 'Descobrir vinhos pro meu paladar',
    sub:  'Veja recomendações com base no seu DNA',
  },
  {
    id: 'diary_empty',
    icon: 'menu_book',
    title: 'Registrar um vinho que provei',
    sub:  'Comece sua adega pessoal com 1 registro de 15 segundos',
  },
  {
    id: 'learn',
    icon: 'school',
    title: 'Aprender sobre vinho',
    sub:  'Conteúdo curado pra começar do começo, no seu nível',
  },
  {
    id: 'treino_paladar',
    icon: 'fitness_center',
    title: 'Treinar meu paladar todo dia',
    sub:  'Lições de 90 segundos, estilo joguinho — com streak e conquistas',
  },
  {
    id: 'gps_primer_then_confrarias',
    icon: 'groups',
    title: 'Participar de uma confraria',
    sub:  'Encontre grupos perto de você que se reúnem para degustar',
  },
  {
    id: 'gps_primer_then_wizard',
    icon: 'construction',
    title: 'Criar minha própria confraria',
    sub:  'Trazer meu grupo pro app',
  },
];

function TelaIntencaoScreen({ go, params, onIntentSelected }) {
  const [pressed, setPressed]   = React.useState(null);   // card briefly highlighted on tap
  const [routing, setRouting]   = React.useState(false);  // lock to prevent double-tap
  const [showSkip, setShowSkip] = React.useState(false);

  // Resolve a route name to the prototype's navigation. The component still
  // honors the typed `onIntentSelected` callback when provided. Every intent
  // funnels through 07.01 WelcomeFinal — it owns the tour entry + skip path.
  const commit = (intent) => {
    if (typeof onIntentSelected === 'function') onIntentSelected(intent);
    // Stash for WelcomeFinal so it can resolve the post-tour destination
    try { window.__tcLastIntent = intent; } catch (e) {}
    switch (intent) {
      case 'discover_home':
        go('welcome-final', { intent }); return;
      case 'diary_empty':
        go('welcome-final', { intent }); return;
      case 'learn':
        // 04.B is a self-contained destination — no tour, no welcome-final
        go('aprender', { intent, level: window.__tcUserLevel }); return;
      case 'treino_paladar':
        // Vai direto pra feature "Treine seu Paladar" (sem tour)
        go('treino-paladar', { intent }); return;
      case 'gps_primer_then_confrarias':
        go('gps-primer', { next: 'confrarias', intent }); return;
      case 'gps_primer_then_wizard':
        go('gps-primer', { next: 'wizard-confraria', intent }); return;
      case 'skip_to_feed':
      default:
        try { window.__tcSkipTimestamp = Date.now(); } catch (e) {}
        go('welcome-final', { intent: 'skip_to_feed' }); return;
    }
  };

  const tapCard = (id) => {
    if (routing) return;
    setRouting(true);
    setPressed(id);
    // 200ms press feedback before route — matches spec
    window.setTimeout(() => commit(id), 200);
  };

  const tapSkip = () => {
    if (routing) return;
    setShowSkip(true);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative' }}>
      {/* Top bar — back arrow + step caption */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px 8px 4px', minHeight: 56,
      }}>
        <button
          onClick={() => go('back')}
          aria-label="Voltar"
          style={{
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
          Etapa 3 de 3
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '32px 24px 0' }}>
          {/* h1 — Fraunces 32 / leading-tight — must fit in ≤2 lines on 360px */}
          <h1 style={{
            margin: 0, fontFamily: '"Fraunces", "Inter", Georgia, serif',
            fontSize: 32, lineHeight: 1.1, fontWeight: 600,
            letterSpacing: '-0.02em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Por onde você quer começar?
          </h1>

          <div style={{ height: 8 }}/>

          {/* body/large — Geist 16 / neutral 700 */}
          <p style={{
            margin: 0, fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 16, lineHeight: 1.5, color: T.c.n600,
          }}>
            A gente te leva direto. Você pode explorar tudo depois.
          </p>

          <div style={{ height: 24 }}/>

          {/* 4 cards — vertical stack, gap 12 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {INTENT_OPTIONS.map(opt => (
              <IntentCard
                key={opt.id}
                option={opt}
                pressed={pressed === opt.id}
                dimmed={routing && pressed !== opt.id}
                onClick={() => tapCard(opt.id)}
              />
            ))}
          </div>

          <div style={{ height: 16 }}/>

          {/* Skip link — Button/Text/md, centered */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
            <Button
              variant="ghost"
              size="md"
              onClick={tapSkip}
              disabled={routing}
              style={{ color: T.c.n600 }}
              data-route="skip_to_feed">
              Ainda não sei, me leva pro app
            </Button>
          </div>

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* 05.02 — Skip confirmation modal */}
      {showSkip && (
        <SkipConfirmModal
          onCancel={() => setShowSkip(false)}
          onConfirm={() => {
            setShowSkip(false);
            setRouting(true);
            commit('skip_to_feed');
          }}
        />
      )}
    </div>
  );
}

function IntentCard({ option, pressed, dimmed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-route={option.id}
      aria-label={option.title}
      style={{
        width: '100%', minHeight: 72,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 16, textAlign: 'left',
        background: pressed ? T.c.p50 : T.c.n50,
        border: `1px solid ${pressed ? T.c.p300 : T.c.n200}`,
        borderRadius: T.r.lg,
        cursor: dimmed ? 'default' : 'pointer',
        fontFamily: T.font,
        opacity: dimmed ? 0.55 : 1,
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease, opacity 160ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {/* Icon — 40×40, burgundy/50 bg, radius md */}
      <div style={{
        width: 40, height: 40, flexShrink: 0,
        borderRadius: T.r.md, background: T.c.p50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={option.icon} size={22} color={T.c.p700} weight={500}/>
      </div>

      {/* Title + sub */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 15, lineHeight: 1.3, fontWeight: 600, color: T.c.n950,
        }}>
          {option.title}
        </div>
        <div style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 12, lineHeight: 1.4, color: T.c.n600,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {option.sub}
        </div>
      </div>

      {/* Chevron — 16, neutral/400 */}
      <Icon name="chevron_right" size={16} color={T.c.n400} style={{ flexShrink: 0 }}/>
    </button>
  );
}

// ─── 05.02 — ConfirmacaoSkip (bottom sheet) ───────────────
// Nielsen #5 — error prevention. The skip path goes through this dialog so
// users don't bounce out of the most important step by accident. CTA
// hierarchy is intentionally inverted: the *primary* action returns to
// 05.01; "Seguir sem escolher" is the quieter, ghost-styled escape hatch.
function SkipConfirmModal({ onCancel, onConfirm }) {
  // Esc to dismiss
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'absolute', inset: 0, zIndex: 80,
        // neutral/950 @ 60%
        background: 'rgba(15, 15, 15, 0.60)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'tcFadeIn 180ms ease',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skip-modal-title"
        aria-describedby="skip-modal-body"
        style={{
          width: '100%',
          background: T.c.n0,
          // radius-top lg only — sheet is anchored to bottom edge
          borderTopLeftRadius: T.r.lg,
          borderTopRightRadius: T.r.lg,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: '12px 24px 28px',
          paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          animation: 'tcSlideUp 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontFamily: T.font,
        }}>
        {/* Drag handle pill — 32×4, neutral/300, centered */}
        <div style={{
          width: 32, height: 4, borderRadius: 2,
          background: T.c.n300, margin: '0 auto 16px',
        }}/>

        {/* h3 — Fraunces, neutral/950 */}
        <h3 id="skip-modal-title" style={{
          margin: 0, marginBottom: 8,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 20, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Tem certeza que quer pular?
        </h3>

        {/* body/default — Geist 14, neutral/700 (closest token: n800) */}
        <p id="skip-modal-body" style={{
          margin: 0, marginBottom: 24,
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
          textWrap: 'pretty',
        }}>
          Sem isso a gente vai te mostrar conteúdo geral. Você pode preencher depois no seu perfil.
        </p>

        {/* CTAs — primary returns user to 05.01, ghost commits the skip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="primary" size="lg" fullWidth onClick={onCancel}
            data-route="back_to_intent">
            Voltar e escolher
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={onConfirm}
            data-route="skip_to_feed">
            Pular mesmo assim
          </Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PaladarRadar, QuizScreen, QuizResultScreen, GpsPrimerScreen, GpsNegadoScreen, TelaIntencaoScreen, SkipConfirmModal });


export { GpsNegadoScreen, GpsPrimerScreen, INTENT_OPTIONS, IntentCard, PaladarRadar, QuizResultScreen, QuizScreen, SkipConfirmModal, TelaIntencaoScreen, classifyPaladar };
