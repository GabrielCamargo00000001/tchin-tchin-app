/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button, Chip } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Modo Expert / Sommelier (4 telas)
//
//   35.01 expert-virar      → "Vire Expert" landing (requisitos + CTA)
//   35.02 expert-aplicar    → formulário de candidatura
//   35.03 expert-pendente   → status review (aguardando aprovação)
//   35.04 expert-q-a        → tela de Q&A (perguntas pendentes pra responder)
//   35.05 perguntar-expert  → fazer pergunta pra expert
// ─────────────────────────────────────────────────────────────

function ExShell({ title, onBack, action, children }) {
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
    </div>
  );
}

// 35.01 ─────────────────────────────────────────────────
function ExpertVirarScreen({ go, ctx }) {
  const reqs = [
    { ok: true,  label: '6+ meses no app',         sub: 'Você está com a gente há 8 meses' },
    { ok: true,  label: '30+ vinhos no diário',    sub: 'Seu diário tem 47 entradas' },
    { ok: true,  label: 'Paladar 5D calibrado',    sub: 'Calibrado há 12 dias' },
    { ok: false, label: '20+ Q&A respondidos',     sub: 'Você respondeu 3 dúvidas até agora' },
    { ok: false, label: 'Formação ou experiência', sub: 'Vamos perguntar no formulário' },
  ];
  const done = reqs.filter(r => r.ok).length;
  return (
    <ExShell title="Vire Expert" onBack={() => go('back')}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${T.c.p900} 0%, ${T.c.p700} 100%)`,
        color: T.c.n0, padding: '32px 20px 36px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 14px)` }}/>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
            background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)',
            borderRadius: T.r.full, marginBottom: 16,
          }}>
            <Icon name="verified" size={16} color={T.c.a500} fill={1}/>
            <span style={{ ...T.t.caption, color: T.c.n0, fontWeight: 700, letterSpacing: 0.4 }}>SELO EXPERT</span>
          </div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 30, fontWeight: 600, lineHeight: 1.15, marginBottom: 10, textWrap: 'balance' }}>
            Compartilhe seu conhecimento. Ajude a comunidade.
          </div>
          <div style={{ ...T.t.bodyLg, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
            Experts respondem dúvidas, têm selo verificado e ganham visibilidade no Tchin Tchin.
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 12 }}>── O QUE VOCÊ GANHA ──</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { icon: 'verified',       title: 'Selo verificado',  desc: 'Aparece ao lado do seu nome em todo o app.' },
            { icon: 'forum',          title: 'Responder Q&A',    desc: 'Suas respostas viram referência pra comunidade.' },
            { icon: 'visibility',     title: 'Mais visibilidade',desc: 'Posts em destaque, perfil recomendado.' },
            { icon: 'campaign',       title: 'Voz no produto',   desc: 'Acesso antecipado a novos recursos.' },
          ].map(b => (
            <div key={b.title} style={{ padding: 14, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md }}>
              <Icon name={b.icon} size={22} color={T.c.p700}/>
              <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 8 }}>{b.title}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2, lineHeight: 1.4 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 12 }}>── REQUISITOS ── {done}/{reqs.length}</div>
        <div style={{ background: T.c.n0, borderRadius: T.r.md, border: `1px solid ${T.c.n200}`, padding: 4 }}>
          {reqs.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 12, borderBottom: i === reqs.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
              <Icon name={r.ok ? 'check_circle' : 'radio_button_unchecked'} size={22} color={r.ok ? T.c.s700 : T.c.n400} fill={r.ok ? 1 : 0}/>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.t.bodyB, color: r.ok ? T.c.n950 : T.c.n800 }}>{r.label}</div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '8px 16px 24px' }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="auto_awesome" size={20}/>} onClick={() => go('expert-aplicar')}>
          {done === reqs.length ? 'Candidatar-me a Expert' : 'Candidatar-me mesmo assim'}
        </Button>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
          Análise em 5-7 dias úteis. Avaliamos formação, experiência e contribuição.
        </div>
      </div>
    </ExShell>
  );
}

// 35.02 ─────────────────────────────────────────────────
function ExpertAplicarScreen({ go }) {
  const [bio, setBio] = React.useState('');
  const [bg, setBg]   = React.useState([]);
  const [years, setYears] = React.useState(null);
  const [specs, setSpecs] = React.useState([]);
  const [links, setLinks] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const valid = bio.trim().length > 50 && bg.length > 0 && years && specs.length > 0 && accept;
  const toggle = (list, setList, v) => setList(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  return (
    <ExShell title="Candidatura Expert" onBack={() => go('back')}>
      <div style={{ padding: '16px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.5, marginBottom: 8 }}>
          Tudo confidencial. Só nosso time de curadoria vê.
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600 }}>Quanto mais detalhe, mais rápido aprovamos.</div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Conta sobre você (em vinho) <span style={{ color: T.c.e700 }}>*</span></div>
        <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 500))} placeholder="Ex.: Sou sommelier há 6 anos, com WSET nível 3. Trabalhei em 2 restaurantes premiados e hoje faço consultoria pra cartas de vinhos em Brasília..." rows={5} style={exInput}/>
        <div style={{ ...T.t.caption, color: bio.length < 50 ? T.c.w700 : T.c.n600, textAlign: 'right', marginBottom: 12 }}>{bio.length}/500 (mín. 50)</div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Sua formação ou origem <span style={{ color: T.c.e700 }}>*</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {['Sommelier formado', 'WSET (qualquer nível)', 'Curso ABS', 'Trabalho em restaurante', 'Trabalho em importadora', 'Trabalho em vinícola', 'Autodidata sério', 'Outro'].map(opt => (
            <Chip key={opt} size="md" selected={bg.includes(opt)} onClick={() => toggle(bg, setBg, opt)}>{opt}</Chip>
          ))}
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Anos de experiência <span style={{ color: T.c.e700 }}>*</span></div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['< 2', '2-5', '5-10', '10+'].map(opt => (
            <button key={opt} onClick={() => setYears(opt)} style={{
              flex: 1, padding: '10px 4px', borderRadius: T.r.md,
              background: years === opt ? T.c.p700 : T.c.n0,
              border: `1.5px solid ${years === opt ? T.c.p700 : T.c.n300}`,
              color: years === opt ? T.c.n0 : T.c.n800,
              cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: 600,
            }}>{opt}</button>
          ))}
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Em que você é mais forte? <span style={{ color: T.c.e700 }}>*</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {['Vinhos do Velho Mundo', 'Vinhos do Novo Mundo', 'Espumantes', 'Vinhos do Brasil', 'Harmonização', 'Cellar / guarda', 'Cervejas e cidras', 'Saquês'].map(opt => (
            <Chip key={opt} size="md" selected={specs.includes(opt)} onClick={() => toggle(specs, setSpecs, opt)}>{opt}</Chip>
          ))}
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Links de portfólio ou redes <span style={{ color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
        <textarea value={links} onChange={e => setLinks(e.target.value)} placeholder="LinkedIn, Instagram, blog, vídeos no YouTube..." rows={2} style={exInput}/>

        <button onClick={() => setAccept(a => !a)} style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12,
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 8,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: T.r.xs, flexShrink: 0, marginTop: 2,
            background: accept ? T.c.p700 : T.c.n0,
            border: `1.5px solid ${accept ? T.c.p700 : T.c.n300}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{accept && <Icon name="check" size={16} color={T.c.n0}/>}</div>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
            Concordo em seguir o <strong>Código de Conduta Expert</strong>: respostas baseadas em fato, sem promoção de produtos sem disclosure, sem trash-talk a outras pessoas.
          </div>
        </button>

        <div style={{ marginTop: 20 }}>
          <Button variant="primary" size="lg" fullWidth disabled={!valid} onClick={() => go('expert-pendente')}>
            Enviar candidatura
          </Button>
        </div>
      </div>
    </ExShell>
  );
}

const exInput = {
  width: '100%', padding: '12px 14px', border: `1.5px solid ${T.c.n300}`,
  borderRadius: T.r.md, fontFamily: T.font, fontSize: 15, color: T.c.n950,
  outline: 'none', boxSizing: 'border-box', background: T.c.n0, resize: 'vertical',
};

// 35.03 ─────────────────────────────────────────────────
function ExpertPendenteScreen({ go }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, padding: '40px 24px 24px', textAlign: 'center' }}>
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.c.p100}, ${T.c.p50})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px auto',
        position: 'relative',
      }}>
        <Icon name="hourglass_empty" size={56} color={T.c.p700}/>
        <div style={{
          position: 'absolute', inset: -4, borderRadius: '50%',
          border: `3px solid ${T.c.p100}`,
          borderTopColor: T.c.p700,
          animation: 'tcSpin 1.4s linear infinite',
        }}/>
      </div>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Candidatura recebida</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 24, lineHeight: 1.5 }}>
        Nosso time de curadoria revisa em 5-7 dias úteis. Você recebe a resposta por push e e-mail.
      </div>
      <div style={{ padding: 16, background: T.c.n50, borderRadius: T.r.md, marginBottom: 32, textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <Icon name="check_circle" size={20} color={T.c.s700} fill={1}/>
          <span style={{ ...T.t.body, color: T.c.n800 }}>Candidatura enviada</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <Icon name="visibility" size={20} color={T.c.a700}/>
          <span style={{ ...T.t.body, color: T.c.n800 }}>Em análise pela curadoria</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Icon name="radio_button_unchecked" size={20} color={T.c.n400}/>
          <span style={{ ...T.t.body, color: T.c.n600 }}>Resultado enviado</span>
        </div>
      </div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 20, lineHeight: 1.5, maxWidth: 320, margin: '0 auto 20px' }}>
        Enquanto isso, você pode <strong style={{ color: T.c.n800 }}>responder Q&A</strong> e mostrar seu valor pra comunidade.
      </div>
      <Button variant="primary" size="lg" fullWidth onClick={() => go('expert-q-a')}>Ver Q&A pendentes</Button>
      <div style={{ height: 8 }}/>
      <Button variant="ghost" size="lg" fullWidth onClick={() => go('home')}>Voltar pro app</Button>
    </div>
  );
}

// 35.04 ─────────────────────────────────────────────────
function ExpertQAScreen({ go }) {
  const [tab, setTab] = React.useState('pendentes');
  const perguntas = [
    { id: 'q1', author: 'Helena Britto', level: 'iniciante', when: 'há 30min', tags: ['Riesling', 'harmonização'], text: 'Qual prato vai bem com Riesling alemão Kabinett? Pensei em comida tailandesa, faz sentido?', urgent: true, viewers: 12 },
    { id: 'q2', author: 'Pedro Almeida', level: 'iniciante', when: 'há 2h', tags: ['Tannat', 'guarda'], text: 'Posso guardar um Tannat uruguaio jovem por 5 anos? Ou já tomo agora?', urgent: false, viewers: 8 },
    { id: 'q3', author: 'Marina Oliveira', level: 'iniciante', when: 'há 5h', tags: ['Champagne', 'celebração'], text: 'Diferença entre Champagne, Cava e Prosecco — em palavras simples?', urgent: false, viewers: 24 },
    { id: 'q4', author: 'Roberto Santos', level: 'intermediario', when: 'ontem', tags: ['Chianti', 'temperatura'], text: 'Qual temperatura ideal pra Chianti Riserva? Tem diferença pro Classico?', urgent: false, viewers: 5 },
  ];
  const minhas = [
    { id: 'm1', q: 'Decanter para vinho jovem ajuda?', when: 'há 2 dias', views: 124, useful: 18 },
    { id: 'm2', q: 'Vinho aberto dura quantos dias?', when: 'há 1 sem', views: 312, useful: 41 },
  ];
  return (
    <ExShell title="Q&A da comunidade" onBack={() => go('back')}>
      <div style={{ display: 'flex', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, padding: '0 16px' }}>
        {[
          { id: 'pendentes', l: `Pendentes (${perguntas.length})` },
          { id: 'minhas',    l: `Minhas (${minhas.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '14px 16px', background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? T.c.p700 : 'transparent'}`,
            color: tab === t.id ? T.c.p700 : T.c.n600,
            fontFamily: T.font, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{t.l}</button>
        ))}
      </div>

      {tab === 'pendentes' && (
        <div style={{ padding: 16 }}>
          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {['Todas', 'Tinto', 'Branco', 'Espumante', 'Harmonização', 'Guarda'].map((c, i) => (
              <Chip key={c} size="sm" selected={i === 0}>{c}</Chip>
            ))}
          </div>
          {perguntas.map(p => (
            <button key={p.id} onClick={() => go('expert-responder', { question: p })} style={{
              width: '100%', display: 'block', background: T.c.n0, border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.md, padding: 14, cursor: 'pointer', textAlign: 'left', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Avatar name={p.author} size={28} level={p.level}/>
                <div style={{ flex: 1 }}>
                  <div style={{ ...T.t.caption, color: T.c.n800, fontWeight: 600 }}>{p.author}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600, fontSize: 11 }}>{p.when} · {p.viewers} acompanham</div>
                </div>
                {p.urgent && <span style={{ ...T.t.caption, padding: '2px 8px', borderRadius: T.r.full, background: T.c.w100, color: T.c.w700, fontWeight: 700 }}>Resposta logo</span>}
              </div>
              <div style={{ ...T.t.body, color: T.c.n950, lineHeight: 1.5, marginBottom: 10 }}>{p.text}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.tags.map(t => (
                  <span key={t} style={{ ...T.t.caption, padding: '2px 8px', borderRadius: T.r.full, background: T.c.n100, color: T.c.n800, fontWeight: 500 }}>#{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'minhas' && (
        <div style={{ padding: 16 }}>
          {minhas.map(m => (
            <div key={m.id} style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, padding: 14, marginBottom: 10 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 6 }}>{m.q}</div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 8, ...T.t.caption, color: T.c.n600 }}>
                <span>{m.when}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="visibility" size={14} color={T.c.n600}/>{m.views} vistas</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: T.c.s700, fontWeight: 600 }}><Icon name="thumb_up" size={14} color={T.c.s700}/>{m.useful} úteis</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ExShell>
  );
}

// 35.05 ─────────────────────────────────────────────────
function ExpertResponderScreen({ go, params }) {
  const q = (params && params.question) || { author: 'Helena Britto', level: 'iniciante', text: 'Qual prato vai bem com Riesling Kabinett?', when: 'há 30min', tags: [], viewers: 12 };
  const [answer, setAnswer] = React.useState('');
  const [wineRef, setWineRef] = React.useState(null);
  return (
    <ExShell title="Responder" onBack={() => go('back')}
      action={<button onClick={() => { go('toast', { kind: 'success', message: 'Resposta publicada como Verificada.' }); go('back'); }} disabled={answer.trim().length < 40} style={{
        background: answer.trim().length >= 40 ? T.c.p700 : T.c.n200,
        color: answer.trim().length >= 40 ? T.c.n0 : T.c.n600,
        border: 'none', cursor: answer.trim().length >= 40 ? 'pointer' : 'default',
        fontFamily: T.font, fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: T.r.full, marginRight: 8,
      }}>Publicar</button>}>
      {/* Question card */}
      <div style={{ padding: 16, background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Avatar name={q.author} size={32} level={q.level}/>
          <div>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{q.author}</div>
            <div style={{ ...T.t.caption, color: T.c.n600 }}>{q.when} · {q.viewers} acompanham</div>
          </div>
        </div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.55 }}>{q.text}</div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: T.r.full, background: T.c.p50, marginBottom: 10 }}>
          <Icon name="verified" size={14} color={T.c.p700} fill={1}/>
          <span style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700 }}>SUA RESPOSTA VAI VIRAR "VERIFICADA"</span>
        </div>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Resposta</div>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)} autoFocus placeholder="Vai direto ao ponto. Explica o porquê em 1-3 parágrafos curtos. Cita exemplos se ajudar." rows={8} style={{ ...exInput, minHeight: 180 }}/>
        <div style={{ ...T.t.caption, color: answer.length < 40 ? T.c.w700 : T.c.n600, textAlign: 'right', marginBottom: 16 }}>{answer.length} caracteres (mín. 40)</div>

        {wineRef && (
          <div style={{ display: 'flex', gap: 12, padding: 10, background: T.c.n50, borderRadius: T.r.md, marginBottom: 12, position: 'relative' }}>
            <BottlePlaceholder width={36} height={50} label=""/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700 }}>VINHO REFERENCIADO</div>
              <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 2 }}>{wineRef.name}</div>
            </div>
            <button onClick={() => setWineRef(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="close" size={18} color={T.c.n600}/></button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="md" leading={<Icon name="wine_bar" size={16}/>} onClick={() => setWineRef({ name: 'Mosselland Riesling Kabinett 2022' })}>Citar vinho</Button>
          <Button variant="secondary" size="md" leading={<Icon name="link" size={16}/>} onClick={() => go('toast', { kind: 'info', message: 'Em breve: linkar artigos.' })}>Citar artigo</Button>
        </div>

        <div style={{ marginTop: 20, padding: 12, background: T.c.i100, borderRadius: T.r.md, display: 'flex', gap: 10 }}>
          <Icon name="info" size={18} color={T.c.i700}/>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
            Respostas Expert ficam fixas no topo da pergunta com selo verificado. O usuário recebe push.
          </div>
        </div>
      </div>
    </ExShell>
  );
}

// 35.06 ─────────────────────────────────────────────────
function PerguntarExpertScreen({ go }) {
  const [text, setText] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [urgent, setUrgent] = React.useState(false);
  const valid = text.trim().length > 20;
  const toggle = (v) => setTags(tags.includes(v) ? tags.filter(x => x !== v) : [...tags, v]);
  return (
    <ExShell title="Perguntar pra Expert" onBack={() => go('back')}
      action={<button onClick={() => { go('toast', { kind: 'success', message: 'Pergunta enviada. Você recebe push quando responderem.' }); go('back'); }} disabled={!valid} style={{
        background: valid ? T.c.p700 : T.c.n200, color: valid ? T.c.n0 : T.c.n600,
        border: 'none', cursor: valid ? 'pointer' : 'default',
        fontFamily: T.font, fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: T.r.full, marginRight: 8,
      }}>Enviar</button>}>
      <div style={{ padding: 16 }}>
        <div style={{ padding: 14, background: T.c.p50, borderRadius: T.r.md, marginBottom: 16, display: 'flex', gap: 10 }}>
          <Icon name="auto_awesome" size={20} color={T.c.p700}/>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
            <strong>Pergunte de tudo:</strong> harmonização, guarda, decantar, temperatura, importadora, preço. Experts certificados respondem em até 24h.
          </div>
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Sua pergunta</div>
        <textarea value={text} onChange={e => setText(e.target.value.slice(0, 400))} autoFocus placeholder="Ex.: Comprei um Malbec 2018. Já posso abrir ou guardo mais? Que comida combina melhor?" rows={5} style={exInput}/>
        <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'right', marginBottom: 16 }}>{text.length}/400</div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Categoria <span style={{ color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {['Harmonização', 'Guarda', 'Servir', 'Compra', 'Defeitos', 'Uvas', 'Regiões', 'Tipos'].map(opt => (
            <Chip key={opt} size="md" selected={tags.includes(opt)} onClick={() => toggle(opt)}>#{opt}</Chip>
          ))}
        </div>

        <button onClick={() => setUrgent(u => !u)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
          background: urgent ? T.c.w100 : T.c.n0,
          border: `1.5px solid ${urgent ? T.c.w700 : T.c.n200}`,
          borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left', marginBottom: 16,
        }}>
          <Icon name="bolt" size={22} color={urgent ? T.c.w700 : T.c.n600}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Resposta urgente (24h)</div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Prioriza pra qualquer Expert online responder primeiro.</div>
          </div>
          <Icon name={urgent ? 'check_circle' : 'radio_button_unchecked'} size={22} color={urgent ? T.c.w700 : T.c.n400} fill={urgent ? 1 : 0}/>
        </button>

        <div style={{ ...T.t.caption, color: T.c.n600, lineHeight: 1.5 }}>
          Sua pergunta é pública pra outros membros aprenderem também.
        </div>
      </div>
    </ExShell>
  );
}

Object.assign(window, {
  ExShell, ExpertVirarScreen, ExpertAplicarScreen, ExpertPendenteScreen,
  ExpertQAScreen, ExpertResponderScreen, PerguntarExpertScreen,
});


export { ExShell, ExpertAplicarScreen, ExpertPendenteScreen, ExpertQAScreen, ExpertResponderScreen, ExpertVirarScreen, PerguntarExpertScreen, exInput };
