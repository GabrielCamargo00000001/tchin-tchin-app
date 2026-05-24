/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { CfgToggle } from './screens-config-detalhe.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Welcome novos membros / confraria + Push + Jornada
//
// CONFRARIA WELCOME (3):
//   40.01 confraria-welcome      → boas-vindas (quando entra)
//   40.02 confraria-apresentar   → "conta pro pessoal quem você é" (form rápido)
//   40.03 confraria-tour-rapido  → 4 cartões: como navegar
//
// PUSH (4):
//   41.01 push-primer            → pré-permissão (vende o "por que")
//   41.02 push-negado            → permissão negada (deep link configs)
//   41.03 push-canais            → setup detalhado (canais)
//   41.04 push-preview           → testar push (preview do que aparece)
//
// JORNADA (2):
//   42.01 jornada                → hub de progresso (gamificado)
//   42.02 jornada-celebrar       → celebração ao completar etapa
// ─────────────────────────────────────────────────────────────

function WlShell({ title, onBack, children, sticky }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      {(title || onBack) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
          {onBack && (
            <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="arrow_back" size={24} color={T.c.n950}/>
            </button>
          )}
          {title && <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      {sticky}
    </div>
  );
}

// ═══ 40.01 ConfrariaWelcome ═════════════════════════════
function ConfrariaWelcomeScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'Brindar em Brasília', members: 24 };
  const admin = { name: 'Carla Mendes', level: 'expert' };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      <div style={{
        flex: 1,
        background: `linear-gradient(180deg, ${T.c.p900} 0%, ${T.c.p700} 40%, ${T.c.p500} 100%)`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', color: T.c.n0, textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        {/* Confetti */}
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '20%',
            left: `${(i * 7 + 5) % 100}%`,
            width: 8, height: 8, borderRadius: i % 3 === 0 ? '50%' : 2,
            background: ['#D4A574', '#F5E3E5', '#FFFFFF'][i % 3],
            opacity: 0.9,
            animation: `tcConfetti${i % 2} ${2 + (i % 5) * 0.3}s ease-out ${i * 0.08}s 1`,
          }}/>
        ))}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', animation: 'tcDrawIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}>
            <Icon name="groups" size={48} color={T.c.n0}/>
          </div>
          <div style={{ ...T.t.overline, color: T.c.a500, marginBottom: 6, letterSpacing: 1.2 }}>VOCÊ FAZ PARTE</div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, fontWeight: 600, color: T.c.n0, lineHeight: 1.15, marginBottom: 12, textWrap: 'balance' }}>
            Bem-vinda à<br/>{confraria.name}
          </div>
          <div style={{ ...T.t.bodyLg, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
            Você é a {confraria.members + 1}ª pessoa do grupo. Bora apresentar.
          </div>

          {/* Admin card */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)',
            borderRadius: T.r.full, color: T.c.n0,
          }}>
            <Avatar name={admin.name} size={28} level={admin.level}/>
            <span style={{ ...T.t.caption, color: T.c.n0, fontWeight: 600 }}>Admin: {admin.name}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="lg" fullWidth trailing={<Icon name="arrow_forward" size={20}/>} onClick={() => go('confraria-apresentar', { confraria })}>
          Me apresentar pro grupo
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('confraria-tour-rapido', { confraria })}>
          Pular e ver como funciona
        </Button>
      </div>
    </div>
  );
}

// ═══ 40.02 ConfrariaApresentar ══════════════════════════
function ConfrariaApresentarScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'sua confraria' };
  const [nome, setNome] = React.useState('Raphaela');
  const [profissao, setProfissao] = React.useState('');
  const [favorito, setFavorito] = React.useState('');
  const [historia, setHistoria] = React.useState('');
  const [emoji, setEmoji] = React.useState('🍷');
  const emojis = ['🍷', '🍾', '🥂', '🍇', '🧀', '🥖', '🌟', '🔥', '💜', '✨'];
  return (
    <WlShell title="Sua apresentação" onBack={() => go('back')}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}` }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => { go('toast', { kind: 'success', message: 'Apresentação postada no mural!' }); go('confraria-tour-rapido', { confraria }); }} disabled={!historia.trim()}>
            Postar no mural
          </Button>
          <div style={{ height: 8 }}/>
          <Button variant="ghost" size="md" fullWidth onClick={() => go('confraria-tour-rapido', { confraria })}>
            Pular por enquanto
          </Button>
        </div>
      }>
      <div style={{ padding: '16px 16px 8px', background: T.c.n0 }}>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 6, fontFamily: '"Fraunces", Georgia, serif' }}>Oi! Conta pra gente quem você é</div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5 }}>
          Os membros da {confraria.name} vão ver. Quanto mais autêntico, melhor.
        </div>
      </div>

      {/* Preview */}
      <div style={{ padding: 16 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8 }}>── PRÉ-VISUALIZAÇÃO ──</div>
        <div style={{ background: T.c.n0, borderRadius: T.r.md, padding: 14, border: `1px solid ${T.c.n200}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <Avatar name={nome} size={36}/>
            <div>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{nome} {emoji}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>Acabou de entrar · agora</div>
            </div>
          </div>
          {(profissao || favorito || historia) && (
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, paddingLeft: 46, paddingTop: 4 }}>
              {historia || (
                <span style={{ color: T.c.n400, fontStyle: 'italic' }}>
                  {profissao && `${profissao}. `}
                  {favorito && `Vinho favorito: ${favorito}.`}
                  {!profissao && !favorito && 'Sua história aparece aqui...'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: T.c.n0, padding: 16 }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Como pode te chamar?</div>
        <input value={nome} onChange={e => setNome(e.target.value)} style={cwInput}/>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8, marginTop: 12 }}>Um emoji que te define</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {emojis.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              width: 44, height: 44, borderRadius: T.r.md, border: `1.5px solid ${emoji === e ? T.c.p700 : T.c.n200}`,
              background: emoji === e ? T.c.p50 : T.c.n0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>{e}</button>
          ))}
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6, marginTop: 4 }}>O que você faz? <span style={{ color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
        <input value={profissao} onChange={e => setProfissao(e.target.value)} placeholder="Ex.: Arquiteta, professor, dev..." style={cwInput}/>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6, marginTop: 12 }}>Vinho favorito ou uma uva <span style={{ color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
        <input value={favorito} onChange={e => setFavorito(e.target.value)} placeholder="Ex.: Malbec, Riesling alemão, Tannat uruguaio..." style={cwInput}/>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6, marginTop: 12 }}>Conta sua história em uma frase</div>
        <textarea value={historia} onChange={e => setHistoria(e.target.value.slice(0, 240))} placeholder="Ex.: Sou de Minas, descobri vinho aos 30 com um Malbec barato e nunca mais parei. Quero aprender com vocês." rows={4} style={{ ...cwInput, resize: 'vertical' }}/>
        <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'right', marginTop: 4 }}>{historia.length}/240</div>
      </div>

      <div style={{ height: 24 }}/>
    </WlShell>
  );
}

const cwInput = {
  width: '100%', padding: '12px 14px', border: `1.5px solid ${T.c.n300}`,
  borderRadius: T.r.md, fontFamily: T.font, fontSize: 15, color: T.c.n950,
  outline: 'none', boxSizing: 'border-box', background: T.c.n0,
};

// ═══ 40.03 ConfrariaTourRapido ══════════════════════════
function ConfrariaTourRapidoScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'sua confraria' };
  const [step, setStep] = React.useState(0);
  const steps = [
    {
      icon: 'forum',
      bg: T.c.p700,
      title: 'Mural é o coração',
      body: 'Posts, fotos, papo de vinho. Todo mundo vê, todo mundo comenta.',
      cta: 'Continuar',
    },
    {
      icon: 'event',
      bg: T.c.a700,
      title: 'Eventos juntam o pessoal',
      body: 'Degustação às cegas, jantar, encontro virtual. Você marca, todos confirmam, vocês se vêem.',
      cta: 'Continuar',
    },
    {
      icon: 'emoji_events',
      bg: T.c.s700,
      title: 'Desafios semanais',
      body: 'Toda segunda abre um desafio (ex.: "Espanhol"). Quem registra mais vinhos do tema, ganha pontos.',
      cta: 'Continuar',
    },
    {
      icon: 'chat',
      bg: T.c.p900,
      title: 'Chat é direto',
      body: 'Conversa em tempo real com o grupo. Mande foto da garrafa, link, vídeo, áudio.',
      cta: 'Bora começar',
    },
  ];
  const cfg = steps[step];
  const isLast = step >= steps.length - 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px' }}>
        <button onClick={() => go('confraria-detalhe', { confraria })} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: T.c.n600, fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: '8px 12px',
        }}>Pular</button>
      </div>

      {/* Slide */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }} key={step}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: `linear-gradient(135deg, ${cfg.bg}, ${T.c.p900})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
          boxShadow: `0 16px 40px ${cfg.bg}66`,
          animation: 'tcPopIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}>
          <Icon name={cfg.icon} size={64} color={T.c.n0}/>
        </div>
        <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 12, fontFamily: '"Fraunces", Georgia, serif', textWrap: 'balance' }}>{cfg.title}</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n600, lineHeight: 1.5, maxWidth: 320 }}>{cfg.body}</div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i === step ? T.c.p700 : T.c.n300,
            transition: 'all 240ms',
          }}/>
        ))}
      </div>

      <div style={{ padding: '8px 16px 24px', display: 'flex', gap: 8 }}>
        {step > 0 && (
          <Button variant="ghost" size="lg" onClick={() => setStep(s => s - 1)} style={{ flex: 0.6 }}>Voltar</Button>
        )}
        <Button variant="primary" size="lg" fullWidth onClick={() => { if (isLast) go('confraria-detalhe', { confraria }); else setStep(s => s + 1); }} trailing={isLast ? null : <Icon name="arrow_forward" size={20}/>}>
          {cfg.cta}
        </Button>
      </div>
    </div>
  );
}

// ═══ 41.01 PushPrimer ═════════════════════════════════
function PushPrimerScreen({ go }) {
  const [showSheet, setShowSheet] = React.useState(false);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, padding: '40px 24px 24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'tcBreath 2.4s ease-in-out infinite',
        }}>
          <Icon name="notifications_active" size={64} color={T.c.p700} fill={1}/>
        </div>
        {/* Animated badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          minWidth: 28, height: 28, borderRadius: 14,
          background: T.c.e700, color: T.c.n0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.font, fontSize: 12, fontWeight: 700,
          border: `3px solid ${T.c.n0}`,
          animation: 'tcWiggle 1.6s ease-in-out infinite',
        }}>3</div>
      </div>

      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Liga as notificações?</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 32, maxWidth: 320, lineHeight: 1.5 }}>
        Pra que serve push? Pra você não perder o que importa do seu grupo.
      </div>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {[
          { icon: 'event', t: 'Eventos da sua confraria',         d: '1 dia e 1 hora antes — pra você não esquecer.' },
          { icon: 'chat',  t: 'Mensagens no chat',                 d: 'Quando alguém te mencionar ou responder.' },
          { icon: 'emoji_events', t: 'Desafio da semana',          d: 'Aberto toda segunda. 50 pontos pra quem completa.' },
          { icon: 'favorite', t: 'Vinho da sua wishlist baixou',  d: 'Avisamos se cair de preço no marketplace.' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: 12, background: T.c.n50, borderRadius: T.r.md, textAlign: 'left' }}>
            <Icon name={s.icon} size={22} color={T.c.p700} style={{ marginTop: 2 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{s.t}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="notifications" size={20}/>} onClick={() => setShowSheet(true)}>
          Permitir notificações
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('home')}>Mais tarde</Button>
      </div>

      <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 20, lineHeight: 1.5, maxWidth: 320 }}>
        Você sempre pode mudar em Configurações → Notificações.
      </div>

      {/* Fake system permission sheet */}
      {showSheet && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: T.c.n0, borderRadius: T.r.lg, padding: '20px 16px 12px', width: '100%', maxWidth: 320, animation: 'tcPopIn 220ms' }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950, textAlign: 'center', marginBottom: 4 }}>"Tchin Tchin" quer enviar notificações</div>
            <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'center', lineHeight: 1.5, marginBottom: 16 }}>
              As notificações podem incluir alertas, sons e marcas de ícone. Você pode configurar em Ajustes.
            </div>
            <div style={{ display: 'flex', borderTop: `1px solid ${T.c.n200}` }}>
              <button onClick={() => { setShowSheet(false); go('push-negado'); }} style={{
                flex: 1, padding: '12px 0', background: 'none', border: 'none', borderRight: `1px solid ${T.c.n200}`,
                cursor: 'pointer', color: T.c.i700, fontFamily: T.font, fontSize: 15,
              }}>Não permitir</button>
              <button onClick={() => { setShowSheet(false); go('push-canais'); }} style={{
                flex: 1, padding: '12px 0', background: 'none', border: 'none',
                cursor: 'pointer', color: T.c.i700, fontFamily: T.font, fontSize: 15, fontWeight: 700,
              }}>Permitir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ 41.02 PushNegado ══════════════════════════════════
function PushNegadoScreen({ go }) {
  return (
    <WlShell title="Notificações" onBack={() => go('back')}>
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%', background: T.c.w100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Icon name="notifications_off" size={48} color={T.c.w700}/>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Notificações desligadas no sistema</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n600, lineHeight: 1.5, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
          Você bloqueou pelo Android. Pra reativar precisa ir nas configurações do sistema.
        </div>

        <div style={{ background: T.c.n50, borderRadius: T.r.md, padding: 16, marginBottom: 24, textAlign: 'left', maxWidth: 360, margin: '0 auto 24px' }}>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>COMO REATIVAR (3 PASSOS)</div>
          {[
            'Toca em "Abrir configurações" abaixo',
            'Vai em "Notificações" no menu',
            'Liga o switch principal',
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: T.c.p700, color: T.c.n0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.mono, fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.4 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '0 auto' }}>
          <Button variant="primary" size="lg" fullWidth leading={<Icon name="settings" size={20}/>} onClick={() => go('toast', { kind: 'info', message: 'Abrindo configurações do Android...' })}>
            Abrir configurações
          </Button>
          <Button variant="ghost" size="lg" fullWidth onClick={() => go('home')}>Mais tarde</Button>
        </div>
      </div>
    </WlShell>
  );
}

// ═══ 41.03 PushCanais ══════════════════════════════════
function PushCanaisScreen({ go }) {
  const [state, setState] = React.useState({
    all: true,
    confraria: true, eventos: true, chat: true,
    desafios: true, ranking: false,
    nudges: true, marketing: false,
    wishlist: true, social: true,
  });
  const set = (k) => (v) => setState(s => ({ ...s, [k]: v }));
  const groups = [
    { title: 'Confrarias', items: [
      { k: 'confraria', icon: 'groups', l: 'Atividade da confraria', d: 'Novos posts no mural, membros entrando.' },
      { k: 'eventos',   icon: 'event',  l: 'Eventos',                d: 'Confirmações, mudanças, lembretes (1d e 1h antes).' },
      { k: 'chat',      icon: 'chat',   l: 'Chat',                    d: 'Quando te mencionarem ou responderem você.' },
    ]},
    { title: 'Gamificação', items: [
      { k: 'desafios',  icon: 'emoji_events', l: 'Desafios da semana',    d: 'Aberto toda segunda.' },
      { k: 'ranking',   icon: 'leaderboard',  l: 'Mudanças no ranking',  d: 'Quando você subir ou descer no top.' },
    ]},
    { title: 'Marketplace', items: [
      { k: 'wishlist',  icon: 'favorite',  l: 'Wishlist em promoção',   d: 'Vinhos da sua lista que caíram de preço.' },
    ]},
    { title: 'Social', items: [
      { k: 'social',    icon: 'thumb_up',  l: 'Curtidas e comentários', d: 'Quando seu post receber reação.' },
    ]},
    { title: 'Editorial', items: [
      { k: 'nudges',    icon: 'auto_awesome', l: 'Dicas e curadoria',  d: 'Curiosidade da semana, harmonização do dia.' },
      { k: 'marketing', icon: 'campaign',     l: 'Promoções',          d: 'Eventos pagos, lançamentos.' },
    ]},
  ];
  return (
    <WlShell title="Canais de notificação" onBack={() => go('back')}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}` }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => { go('toast', { kind: 'success', message: 'Notificações configuradas!' }); go('push-preview'); }}>
            Salvar e testar
          </Button>
        </div>
      }>
      {/* Master switch */}
      <div style={{ padding: 16, background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="notifications" size={22} color={T.c.p700} fill={1}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Notificações push</div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Master switch — desliga tudo de uma vez se preferir.</div>
          </div>
          <CfgToggle on={state.all} onChange={set('all')}/>
        </div>
      </div>

      {groups.map(g => (
        <div key={g.title} style={{ marginBottom: 12 }}>
          <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── {g.title.toUpperCase()} ──</div>
          <div style={{ background: T.c.n0 }}>
            {g.items.map((it, i) => (
              <div key={it.k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderBottom: i < g.items.length - 1 ? `1px solid ${T.c.n100}` : 'none' }}>
                <Icon name={it.icon} size={20} color={state.all && state[it.k] ? T.c.n800 : T.c.n400}/>
                <div style={{ flex: 1 }}>
                  <div style={{ ...T.t.bodyB, color: state.all ? T.c.n950 : T.c.n400 }}>{it.l}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{it.d}</div>
                </div>
                <CfgToggle on={state.all && state[it.k]} onChange={set(it.k)}/>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 32 }}/>
    </WlShell>
  );
}

// ═══ 41.04 PushPreview ═════════════════════════════════
function PushPreviewScreen({ go }) {
  const [previewing, setPreviewing] = React.useState(false);
  const fire = () => {
    setPreviewing(true);
    setTimeout(() => setPreviewing(false), 4500);
  };
  return (
    <WlShell title="Testar uma notificação" onBack={() => go('back')}>
      <div style={{ padding: '24px 16px 16px' }}>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Vê como uma push do Tchin Tchin aparece</div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 20 }}>
          Vamos disparar uma notificação de demonstração no seu dispositivo. Pode levar 5 segundos.
        </div>

        {/* Preview do que vai aparecer */}
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8 }}>── COMO VAI APARECER ──</div>
        <div style={{
          background: T.c.n950, borderRadius: T.r.lg, padding: 14, marginBottom: 20,
          color: T.c.n0, display: 'flex', gap: 12, position: 'relative',
        }}>
          <div style={{ width: 40, height: 40, borderRadius: T.r.sm, background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TchinLogo size={24}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>TCHIN TCHIN · agora</div>
            <div style={{ ...T.t.bodyB, color: T.c.n0, marginTop: 2 }}>Carla postou no mural</div>
            <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.85)', marginTop: 2, lineHeight: 1.4 }}>"Mosselland Riesling Kabinett tá sensacional! Quem topa marcar pra essa semana?"</div>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth leading={<Icon name="send" size={20}/>} onClick={fire} disabled={previewing}>
          {previewing ? 'Disparando...' : 'Enviar notificação de teste'}
        </Button>

        {previewing && (
          <div style={{
            position: 'absolute', top: 80, left: 12, right: 12,
            background: T.c.n0, borderRadius: T.r.md, padding: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)', border: `1px solid ${T.c.n200}`,
            display: 'flex', gap: 10, animation: 'tcSlideDownIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)', zIndex: 60,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: T.r.sm, background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TchinLogo size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.caption, color: T.c.n600, fontSize: 10 }}>TCHIN TCHIN · agora</div>
              <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 1 }}>Carla postou no mural</div>
              <div style={{ ...T.t.caption, color: T.c.n800, marginTop: 2, lineHeight: 1.4 }}>"Mosselland Riesling tá sensacional! Quem topa marcar?"</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <Button variant="ghost" size="md" fullWidth onClick={() => go('home')}>Concluir setup</Button>
        </div>
      </div>
    </WlShell>
  );
}

// ═══ 42.01 Jornada ═════════════════════════════════════
function JornadaScreen({ go, ctx }) {
  const u = (ctx && ctx.user) || { name: 'Você' };
  const milestones = [
    { id: 'cadastro',   label: 'Criar conta',           pts: 50,  done: true,  icon: 'person_add' },
    { id: 'quiz',       label: 'Calibrar paladar',      pts: 50,  done: true,  icon: 'science' },
    { id: 'primeiro',   label: 'Primeiro vinho no diário', pts: 30, done: true, icon: 'wine_bar' },
    { id: 'confraria',  label: 'Entrar numa confraria', pts: 40,  done: true,  icon: 'groups' },
    { id: 'evento',     label: 'Confirmar 1º evento',   pts: 30,  done: false, icon: 'event', active: true },
    { id: 'scan',       label: 'Escanear um rótulo',    pts: 20,  done: false, icon: 'qr_code_scanner' },
    { id: 'expert',     label: 'Perguntar pra Expert',  pts: 20,  done: false, icon: 'forum' },
    { id: 'amigo',      label: 'Convidar 1 amigo',      pts: 50,  done: false, icon: 'share' },
    { id: 'badge',      label: 'Conquistar 5 badges',   pts: 100, done: false, icon: 'workspace_premium' },
  ];
  const completed = milestones.filter(m => m.done).length;
  const totalPts = milestones.filter(m => m.done).reduce((s, m) => s + m.pts, 0);
  const pct = Math.round((completed / milestones.length) * 100);
  return (
    <WlShell title="Sua jornada" onBack={() => go('back')}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${T.c.p900} 0%, ${T.c.p700} 60%, ${T.c.a700} 100%)`,
        padding: '24px 20px', color: T.c.n0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>SUA JORNADA NO TCHIN TCHIN</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 700, fontFamily: T.font, lineHeight: 1 }}>{completed}<span style={{ fontSize: 22, opacity: 0.7 }}>/{milestones.length}</span></div>
            <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.9)' }}>etapas</div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: T.c.a500, borderRadius: 4, transition: 'width 300ms' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...T.t.caption, color: 'rgba(255,255,255,0.85)' }}>
            <span>{pct}% completo</span>
            <span>{totalPts} pontos ganhos</span>
          </div>
        </div>
      </div>

      {/* Active step highlight */}
      {(() => {
        const active = milestones.find(m => m.active);
        if (!active) return null;
        return (
          <div style={{ padding: 16 }}>
            <div style={{ background: T.c.p50, borderRadius: T.r.lg, padding: 16, display: 'flex', gap: 12, border: `1.5px solid ${T.c.p700}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', borderRadius: T.r.full, background: T.c.p700, color: T.c.n0, ...T.t.caption, fontSize: 10, fontWeight: 800 }}>PRÓXIMA</div>
              <div style={{ width: 48, height: 48, borderRadius: T.r.md, background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={active.icon} size={26} color={T.c.n0}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{active.label}</div>
                <div style={{ ...T.t.caption, color: T.c.p700, marginTop: 4, fontWeight: 700, fontFamily: T.mono }}>+{active.pts} pontos</div>
                <button onClick={() => go(active.id === 'evento' ? 'event-detalhe' : 'home')} style={{
                  marginTop: 8, padding: '6px 12px', background: T.c.p700, color: T.c.n0, border: 'none', cursor: 'pointer',
                  borderRadius: T.r.full, fontFamily: T.font, fontSize: 12, fontWeight: 700,
                }}>Vamos lá →</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* All milestones */}
      <div style={{ ...T.t.overline, color: T.c.n600, padding: '8px 20px 6px' }}>── TODAS AS ETAPAS ──</div>
      <div style={{ padding: '0 16px 16px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 36, top: 24, bottom: 24, width: 2, background: T.c.n200 }}/>
        {milestones.map((m, i) => (
          <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', position: 'relative' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0, zIndex: 1,
              background: m.done ? T.c.s700 : (m.active ? T.c.p700 : T.c.n0),
              border: `2px solid ${m.done ? T.c.s700 : (m.active ? T.c.p700 : T.c.n200)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: m.active ? `0 0 0 6px rgba(160,74,85,0.15)` : 'none',
              animation: m.active ? 'tcBreath 1.8s ease-in-out infinite' : 'none',
            }}>
              <Icon name={m.done ? 'check' : m.icon} size={20} color={m.done || m.active ? T.c.n0 : T.c.n600} fill={m.done ? 1 : 0}/>
            </div>
            <div style={{ flex: 1, padding: '10px 0' }}>
              <div style={{ ...T.t.bodyB, color: m.done ? T.c.n600 : T.c.n950, textDecoration: m.done ? 'line-through' : 'none' }}>{m.label}</div>
              <div style={{ ...T.t.caption, color: m.done ? T.c.s700 : T.c.n600, fontFamily: T.mono, marginTop: 2, fontWeight: 700 }}>{m.done ? '✓ feito' : `+${m.pts} pts`}</div>
            </div>
          </div>
        ))}
      </div>
    </WlShell>
  );
}

// ═══ 42.02 JornadaCelebrar ═════════════════════════════
function JornadaCelebrarScreen({ go, params }) {
  const milestone = (params && params.milestone) || { label: 'Primeiro vinho no diário', pts: 30, icon: 'wine_bar' };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: `radial-gradient(circle at center, ${T.c.p50}, ${T.c.n0})`, padding: '40px 24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      {[...Array(24)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${20 + (i % 5) * 8}%`,
          left: `${(i * 11 + 5) % 100}%`,
          width: 10, height: 10, borderRadius: i % 3 === 0 ? '50%' : 2,
          background: ['#D4A574', '#722F37', '#A04A55', '#F5E3E5'][i % 4],
          opacity: 0.9,
          animation: `tcConfetti${i % 2} ${2 + (i % 5) * 0.3}s ease-out ${i * 0.06}s infinite`,
        }}/>
      ))}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', boxShadow: `0 16px 40px rgba(74,31,36,0.4)`,
          animation: 'tcDrawIn 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}>
          <Icon name={milestone.icon} size={64} color={T.c.n0}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 6, letterSpacing: 1.4 }}>ETAPA COMPLETA!</div>
        <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 12, fontFamily: '"Fraunces", Georgia, serif', textWrap: 'balance' }}>
          {milestone.label}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', background: T.c.p700, color: T.c.n0,
          borderRadius: T.r.full, marginBottom: 24,
          ...T.t.h3, fontFamily: T.font, fontWeight: 800,
          animation: 'tcPopIn 600ms cubic-bezier(0.2, 0.8, 0.2, 1) 200ms backwards',
        }}>
          <Icon name="workspace_premium" size={20} color={T.c.a500} fill={1}/>
          +{milestone.pts} pontos
        </div>
        <div style={{ ...T.t.bodyLg, color: T.c.n600, lineHeight: 1.5, marginBottom: 32, maxWidth: 320 }}>
          Tá indo bem. Você já está construindo sua biografia em vinho.
        </div>

        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => go('jornada')}>Ver minha jornada</Button>
          <Button variant="ghost" size="lg" fullWidth onClick={() => go('home')}>Continuar</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  WlShell,
  ConfrariaWelcomeScreen, ConfrariaApresentarScreen, ConfrariaTourRapidoScreen,
  PushPrimerScreen, PushNegadoScreen, PushCanaisScreen, PushPreviewScreen,
  JornadaScreen, JornadaCelebrarScreen,
});


export { ConfrariaApresentarScreen, ConfrariaTourRapidoScreen, ConfrariaWelcomeScreen, JornadaCelebrarScreen, JornadaScreen, PushCanaisScreen, PushNegadoScreen, PushPreviewScreen, PushPrimerScreen, WlShell, cwInput };
