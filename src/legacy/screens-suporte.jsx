/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Suporte (2 telas)
//   27.04 suporte-faq      → categorias + perguntas frequentes
//   27.05 suporte-contato  → form ou chat (escolha)
// ─────────────────────────────────────────────────────────────

function SupShell({ title, onBack, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

const FAQ_DATA = [
  { cat: 'Conta', icon: 'person', items: [
    { q: 'Como recupero minha senha?', a: 'Vai em Login → Esqueci minha senha. Mandamos um código de 6 dígitos no seu e-mail.' },
    { q: 'Posso mudar meu e-mail?', a: 'Vai em Configurações → Conta → E-mail. Pedimos confirmação no e-mail novo antes de trocar.' },
    { q: 'Como deletar minha conta?', a: 'Configurações → Conta → Excluir conta permanentemente. Você tem 30 dias pra reverter.' },
  ]},
  { cat: 'Diário e Paladar', icon: 'auto_stories', items: [
    { q: 'O que é o Paladar 5D?', a: 'Um perfil que mede 5 dimensões do seu gosto: acidez, taninos, corpo, frutado e doçura — em escala de 1 a 5. A gente usa isso pra dar os matches no Descobrir.' },
    { q: 'Posso registrar um vinho que não está na base?', a: 'Pode! Use o cadastro manual ou tente o scanner de rótulo. Vinhos cadastrados manualmente ficam só pra você.' },
    { q: 'Como funcionam os pontos?', a: 'Cada vinho registrado vale 10 pontos. Desafios cumpridos valem 50. Pontos servem pra rankings e badges.' },
  ]},
  { cat: 'Confrarias e eventos', icon: 'groups', items: [
    { q: 'Quantas confrarias posso criar?', a: 'Sem limite. Você pode ser admin de várias, e participante de muito mais.' },
    { q: 'Como convido pessoas?', a: 'Dentro da confraria, toque em Membros → Convidar. Pode mandar por link, contatos ou WhatsApp.' },
    { q: 'O que acontece se eu sair de uma confraria?', a: 'Você perde acesso ao mural, eventos e chat. Suas avaliações de vinhos no diário continuam suas.' },
  ]},
  { cat: 'Marketplace', icon: 'shopping_cart', items: [
    { q: 'Quem vende os vinhos?', a: 'Comerciantes parceiros (não somos nós). Cada anúncio mostra o vendedor e o prazo de entrega.' },
    { q: 'Posso devolver?', a: 'Sim, em até 7 dias úteis (CDC). Cada vendedor tem política própria de troca.' },
    { q: 'Como funciona o frete?', a: 'O comerciante define. Mostramos o valor antes de fechar a compra.' },
  ]},
  { cat: 'Privacidade', icon: 'lock', items: [
    { q: 'Quem vê meu diário?', a: 'Por padrão, só você. Você pode mudar pra confraria ou público em Privacidade.' },
    { q: 'Como bloquear alguém?', a: 'Toque no perfil da pessoa → mais (⋯) → Bloquear. Ela some pra você e vice-versa.' },
    { q: 'Vocês vendem meus dados?', a: 'Não. Detalhes na Política de Privacidade.' },
  ]},
];

// 27.04 ─────────────────────────────────────────────────
function SuporteFaqScreen({ go }) {
  const [openCat, setOpenCat] = React.useState(null);
  const [openQ, setOpenQ] = React.useState(null);
  const [q, setQ] = React.useState('');
  const matches = q.trim() ? FAQ_DATA.flatMap(c => c.items.filter(i => (i.q + ' ' + i.a).toLowerCase().includes(q.toLowerCase())).map(i => ({ ...i, cat: c.cat }))) : null;
  return (
    <SupShell title="Central de ajuda" onBack={() => go('back')}>
      <div style={{ background: T.c.n0, padding: '16px 16px 20px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: T.c.n100, borderRadius: T.r.md }}>
          <Icon name="search" size={20} color={T.c.n600}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Como podemos te ajudar?" style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font, fontSize: 15, color: T.c.n950,
          }}/>
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="close" size={18} color={T.c.n600}/></button>}
        </div>
      </div>

      {matches !== null ? (
        <div style={{ padding: 16 }}>
          {matches.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <Icon name="search_off" size={48} color={T.c.n400}/>
              <div style={{ ...T.t.body, color: T.c.n600, marginTop: 12, marginBottom: 16 }}>Nenhuma pergunta encontrada pra "{q}".</div>
              <Button variant="secondary" size="md" onClick={() => go('suporte-contato')}>Falar com o suporte</Button>
            </div>
          ) : matches.map((m, i) => (
            <FaqItem key={i} item={m} prefix={m.cat} open={openQ === i} onToggle={() => setOpenQ(openQ === i ? null : i)}/>
          ))}
        </div>
      ) : (
        <>
          {/* Quick actions */}
          <div style={{ background: T.c.n0, padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderBottom: `8px solid ${T.c.n50}` }}>
            <QuickHelp icon="bug_report" label="Relatar um bug"        onClick={() => go('suporte-contato', { topic: 'bug' })}/>
            <QuickHelp icon="lightbulb"  label="Sugerir melhoria"      onClick={() => go('suporte-contato', { topic: 'sugestao' })}/>
            <QuickHelp icon="receipt_long" label="Dúvida sobre compra" onClick={() => go('suporte-contato', { topic: 'compra' })}/>
            <QuickHelp icon="contact_support" label="Outro assunto"    onClick={() => go('suporte-contato', { topic: 'outro' })}/>
          </div>
          {/* Categories */}
          <div style={{ padding: '16px 16px 0', ...T.t.overline, color: T.c.n600 }}>── Perguntas frequentes ──</div>
          <div style={{ padding: '8px 16px 16px' }}>
            {FAQ_DATA.map(cat => (
              <div key={cat.cat} style={{ background: T.c.n0, borderRadius: T.r.md, marginBottom: 10, overflow: 'hidden', border: `1px solid ${T.c.n200}` }}>
                <button onClick={() => setOpenCat(openCat === cat.cat ? null : cat.cat)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: T.r.md, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={cat.icon} size={20} color={T.c.p700}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{cat.cat}</div>
                    <div style={{ ...T.t.caption, color: T.c.n600 }}>{cat.items.length} perguntas</div>
                  </div>
                  <Icon name={openCat === cat.cat ? 'expand_less' : 'expand_more'} size={22} color={T.c.n600}/>
                </button>
                {openCat === cat.cat && (
                  <div style={{ borderTop: `1px solid ${T.c.n100}`, padding: '4px 12px 12px' }}>
                    {cat.items.map((it, i) => (
                      <FaqItem key={i} item={it} open={openQ === `${cat.cat}-${i}`} onToggle={() => setOpenQ(openQ === `${cat.cat}-${i}` ? null : `${cat.cat}-${i}`)}/>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Still need help */}
          <div style={{ padding: '8px 16px 32px' }}>
            <div style={{ background: T.c.p50, borderRadius: T.r.lg, padding: 20, textAlign: 'center' }}>
              <Icon name="support_agent" size={32} color={T.c.p700}/>
              <div style={{ ...T.t.h3, color: T.c.n950, marginTop: 8, marginBottom: 4 }}>Não achou o que precisava?</div>
              <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>Nosso time responde em até 24h úteis.</div>
              <Button variant="primary" size="md" fullWidth onClick={() => go('suporte-contato')}>Falar com o suporte</Button>
            </div>
          </div>
        </>
      )}
    </SupShell>
  );
}

function QuickHelp({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
      padding: 14, background: T.c.n50, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <Icon name={icon} size={22} color={T.c.p700}/>
      <span style={{ ...T.t.bodyB, color: T.c.n950 }}>{label}</span>
    </button>
  );
}

function FaqItem({ item, prefix, open, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${T.c.n100}` }}>
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 0',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ flex: 1 }}>
          {prefix && <div style={{ ...T.t.caption, color: T.c.p700, fontWeight: 600, marginBottom: 2 }}>{prefix}</div>}
          <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{item.q}</div>
        </div>
        <Icon name={open ? 'remove' : 'add'} size={20} color={T.c.n600}/>
      </button>
      {open && <div style={{ ...T.t.body, color: T.c.n800, paddingBottom: 12, lineHeight: 1.55 }}>{item.a}</div>}
    </div>
  );
}

// 27.05 ─────────────────────────────────────────────────
function SuporteContatoScreen({ go, params }) {
  const topics = [
    { id: 'bug',      label: 'Relatar um bug',        icon: 'bug_report' },
    { id: 'compra',   label: 'Dúvida sobre compra',   icon: 'receipt_long' },
    { id: 'conta',    label: 'Acesso ou conta',       icon: 'person' },
    { id: 'denuncia', label: 'Denunciar um usuário',  icon: 'flag' },
    { id: 'sugestao', label: 'Sugerir uma melhoria',  icon: 'lightbulb' },
    { id: 'outro',    label: 'Outro assunto',         icon: 'help' },
  ];
  const [topic, setTopic] = React.useState((params && params.topic) || null);
  const [msg, setMsg] = React.useState('');
  const [attached, setAttached] = React.useState(0);
  const valid = topic && msg.trim().length >= 10;
  return (
    <SupShell title="Falar com o suporte" onBack={() => go('back')}>
      <div style={{ background: T.c.n0, padding: '16px 16px 20px' }}>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5 }}>
          Respondemos por e-mail em até 24h úteis. Pra agilizar, conta tudo que conseguir.
        </div>
      </div>
      <div style={{ background: T.c.n0, padding: '16px', borderTop: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 10 }}>Sobre o que é?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {topics.map(t => (
            <button key={t.id} onClick={() => setTopic(t.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 12px', borderRadius: T.r.full,
              background: topic === t.id ? T.c.p700 : T.c.n0,
              border: `1.5px solid ${topic === t.id ? T.c.p700 : T.c.n300}`,
              color: topic === t.id ? T.c.n0 : T.c.n800,
              cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
            }}>
              <Icon name={t.icon} size={16} color={topic === t.id ? T.c.n0 : T.c.n800}/>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: T.c.n0, padding: 16, borderTop: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>O que aconteceu?</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Descreva o problema com o máximo de detalhe possível. Inclua passos pra reproduzir, se for um bug." rows={6} style={{
          width: '100%', padding: '14px 16px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
          background: T.c.n0, fontFamily: T.font, fontSize: 15, color: T.c.n950, outline: 'none', boxSizing: 'border-box',
          resize: 'vertical', minHeight: 120, marginBottom: 4,
        }}/>
        <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'right', marginBottom: 12 }}>{msg.length} caracteres (mín. 10)</div>
        {/* Attach */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          {[...Array(attached)].map((_, i) => (
            <div key={i} style={{
              width: 56, height: 56, borderRadius: T.r.sm, background: T.c.n100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <Icon name="image" size={24} color={T.c.n600}/>
              <button onClick={() => setAttached(a => a - 1)} style={{
                position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
                background: T.c.n950, border: 'none', cursor: 'pointer', color: T.c.n0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name="close" size={14} color={T.c.n0}/></button>
            </div>
          ))}
          {attached < 3 && (
            <button onClick={() => setAttached(a => a + 1)} style={{
              width: 56, height: 56, borderRadius: T.r.sm,
              background: T.c.n0, border: `1.5px dashed ${T.c.n300}`, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: T.c.n600,
            }}>
              <Icon name="add_a_photo" size={20} color={T.c.n600}/>
              <span style={{ fontSize: 9, marginTop: 2, fontWeight: 500 }}>{attached}/3</span>
            </button>
          )}
          <div style={{ ...T.t.caption, color: T.c.n600, flex: 1, paddingLeft: 8 }}>
            Print da tela ajuda muito (até 3 imagens).
          </div>
        </div>
        <div style={{ padding: 12, background: T.c.n50, borderRadius: T.r.md, marginBottom: 20 }}>
          <div style={{ ...T.t.caption, color: T.c.n600, lineHeight: 1.5 }}>
            <strong style={{ color: T.c.n800 }}>Vamos anexar automaticamente:</strong> versão do app, modelo do dispositivo e ID anônimo de sessão. Pra ajudar a debugar.
          </div>
        </div>
        <Button variant="primary" size="lg" fullWidth disabled={!valid} onClick={() => { go('toast', { kind: 'success', message: 'Mensagem enviada! Te respondemos por e-mail.' }); go('back'); }}>
          Enviar
        </Button>
      </div>
      <div style={{ padding: '16px 16px 32px', textAlign: 'center' }}>
        <div style={{ ...T.t.caption, color: T.c.n600 }}>
          Ou escreve direto pra <a href="#" onClick={e => e.preventDefault()} style={{ color: T.c.p700, fontWeight: 600 }}>ajuda@tchintchin.app</a>
        </div>
      </div>
    </SupShell>
  );
}

Object.assign(window, { SupShell, SuporteFaqScreen, SuporteContatoScreen });


export { FAQ_DATA, FaqItem, QuickHelp, SupShell, SuporteContatoScreen, SuporteFaqScreen };
