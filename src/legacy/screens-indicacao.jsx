/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Indicação / Convite (5 telas)
//
//   39.01 indicacao-landing      → "Convide e ganhe" hub
//   39.02 indicacao-compartilhar → modal com link + canais
//   39.03 indicacao-meus-convites→ lista de quem você convidou + status
//   39.04 indicacao-recompensas  → bônus ganhos / desbloqueios
//   39.05 convite-recebido       → tela do convidado (entrou via link)
// ─────────────────────────────────────────────────────────────

function InvShell({ title, onBack, action, children, sticky }) {
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
      {sticky}
    </div>
  );
}

// 39.01 ─────────────────────────────────────────────────
function IndicacaoLandingScreen({ go, ctx }) {
  const u = (ctx && ctx.user) || { name: 'Você' };
  const invited = 3;
  const completed = 2;
  const points = 100;
  return (
    <InvShell title="Convide amigos" onBack={() => go('back')}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <Button variant="primary" size="lg" fullWidth leading={<Icon name="share" size={20}/>} onClick={() => go('indicacao-compartilhar')}>
            Compartilhar meu link
          </Button>
        </div>
      }>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${T.c.p900} 0%, ${T.c.p700} 70%, ${T.c.a700} 100%)`,
        color: T.c.n0, padding: '28px 20px 36px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)', borderRadius: T.r.full, marginBottom: 16 }}>
            <Icon name="celebration" size={16} color={T.c.a500}/>
            <span style={{ ...T.t.caption, color: T.c.n0, fontWeight: 700, letterSpacing: 0.4 }}>PROGRAMA DE INDICAÇÃO</span>
          </div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, fontWeight: 600, lineHeight: 1.15, marginBottom: 10, textWrap: 'balance' }}>
            Cada amigo que entra, vocês dois ganham.
          </div>
          <div style={{ ...T.t.bodyLg, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
            R$ 30 de desconto no marketplace pra você. R$ 30 pra quem entrou. Plus de 1 mês quando 5 amigos aceitam.
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { l: 'Convidados', v: invited,   icon: 'forward_to_inbox' },
            { l: 'Entraram',   v: completed, icon: 'check_circle' },
            { l: 'Pontos',     v: points,    icon: 'workspace_premium' },
          ].map(s => (
            <div key={s.l} style={{ padding: 12, background: T.c.n50, borderRadius: T.r.md, textAlign: 'center' }}>
              <Icon name={s.icon} size={20} color={T.c.p700}/>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.c.n950, fontFamily: T.font, marginTop: 4 }}>{s.v}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Como funciona */}
      <div style={{ padding: '16px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 12 }}>── COMO FUNCIONA ──</div>
        {[
          { icon: 'share', title: 'Compartilha seu link',     body: 'WhatsApp, Stories, e-mail — onde for melhor pro seu amigo.' },
          { icon: 'person_add', title: 'Amigo entra com o link', body: 'Ele cria a conta e usa seu link nos primeiros 7 dias.' },
          { icon: 'redeem', title: 'Vocês dois ganham',        body: 'R$ 30 no marketplace pra cada, no momento da primeira compra dele.' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < 2 ? `1px solid ${T.c.n100}` : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r.md, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={20} color={T.c.p700}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{s.title}</div>
              <div style={{ ...T.t.body, color: T.c.n600, marginTop: 2, lineHeight: 1.5 }}>{s.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recompensas escalonadas */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 12 }}>── DESBLOQUEIOS ──</div>
        <div style={{ background: T.c.n0, borderRadius: T.r.md, border: `1px solid ${T.c.n200}`, overflow: 'hidden' }}>
          {[
            { n: 1,  reward: 'R$ 30 marketplace',          done: true },
            { n: 3,  reward: 'Selo "Embaixador" no perfil', done: false },
            { n: 5,  reward: '1 mês de Plus grátis',       done: false },
            { n: 10, reward: 'Kit Tchin (taça personalizada)', done: false },
            { n: 25, reward: 'R$ 250 marketplace',          done: false },
          ].map((r, i, arr) => (
            <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderBottom: i < arr.length - 1 ? `1px solid ${T.c.n100}` : 'none', background: r.done ? T.c.s100 : T.c.n0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: r.done ? T.c.s700 : T.c.n200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: r.done ? T.c.n0 : T.c.n600, fontFamily: T.mono, fontSize: 13, fontWeight: 700,
              }}>{r.done ? <Icon name="check" size={18} color={T.c.n0}/> : r.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.t.body, color: T.c.n950, fontWeight: r.done ? 600 : 500 }}>{r.reward}</div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{r.done ? 'Desbloqueado!' : `Convide ${r.n} ${r.n === 1 ? 'amigo' : 'amigos'}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('indicacao-meus-convites')}>
          Ver meus convidados ({invited})
        </Button>
      </div>
    </InvShell>
  );
}

// 39.02 ─────────────────────────────────────────────────
function IndicacaoCompartilharScreen({ go, ctx }) {
  const u = (ctx && ctx.user) || { name: 'Você' };
  const handle = (u.name || 'voce').toLowerCase().replace(/\s+/g, '');
  const link = `tchintchin.app/i/${handle}`;
  const [copied, setCopied] = React.useState(false);
  const channels = [
    { id: 'wa',   icon: 'chat',         label: 'WhatsApp',  bg: '#25D366' },
    { id: 'tg',   icon: 'send',         label: 'Telegram',  bg: '#26A5E4' },
    { id: 'ig',   icon: 'photo_camera', label: 'Stories',   bg: '#E4405F' },
    { id: 'tw',   icon: 'tag',          label: 'X / Twitter', bg: '#000' },
    { id: 'mail', icon: 'mail',         label: 'E-mail',    bg: T.c.p700 },
    { id: 'more', icon: 'more_horiz',   label: 'Mais',      bg: T.c.n800 },
  ];
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <InvShell title="Compartilhar convite" onBack={() => go('back')}>
      {/* Preview card */}
      <div style={{ padding: 20, background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 10 }}>Como seus amigos vão ver</div>
        <div style={{
          background: `linear-gradient(135deg, ${T.c.p900}, ${T.c.p700})`,
          color: T.c.n0, borderRadius: T.r.lg, padding: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
            <Avatar name={u.name} size={36}/>
            <div>
              <div style={{ ...T.t.bodyB, color: T.c.n0 }}>{u.name}</div>
              <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.75)' }}>te convidou pro Tchin Tchin</div>
            </div>
          </div>
          <div style={{ ...T.t.h3, color: T.c.n0, marginBottom: 6, fontFamily: '"Fraunces", Georgia, serif', position: 'relative' }}>
            "Bora trocar dicas de vinho?"
          </div>
          <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: 12, position: 'relative' }}>
            Ganha R$ 30 no marketplace na sua primeira compra. Eu também ganho.
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: T.r.full, background: 'rgba(255,255,255,0.16)',
            ...T.t.caption, color: T.c.n0, fontFamily: T.mono, fontWeight: 700, position: 'relative',
          }}>{link}</div>
        </div>
      </div>

      {/* Link */}
      <div style={{ padding: 16, background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Seu link pessoal</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: T.c.n50, borderRadius: T.r.md, border: `1px solid ${T.c.n200}` }}>
          <Icon name="link" size={20} color={T.c.p700}/>
          <div style={{ flex: 1, fontFamily: T.mono, fontSize: 13, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</div>
          <button onClick={copy} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            borderRadius: T.r.sm, border: 'none', cursor: 'pointer',
            background: copied ? T.c.s100 : T.c.p700,
            color: copied ? T.c.s700 : T.c.n0,
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
          }}>
            <Icon name={copied ? 'check' : 'content_copy'} size={16} color={copied ? T.c.s700 : T.c.n0}/>
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Channels */}
      <div style={{ padding: 16, background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 12 }}>Compartilhar em</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {channels.map(c => (
            <button key={c.id} onClick={() => go('toast', { kind: 'success', message: `Convite enviado via ${c.label}.` })} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={c.icon} size={24} color={T.c.n0}/>
              </div>
              <span style={{ ...T.t.caption, color: T.c.n800, fontWeight: 600 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ padding: 14, background: T.c.a100, borderRadius: T.r.md, display: 'flex', gap: 10 }}>
          <Icon name="lightbulb" size={20} color={T.c.a700} fill={1}/>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
            <strong>Dica:</strong> envie a mensagem com algum vinho que você curtiu. Conversão dobra quando vem com história.
          </div>
        </div>
      </div>
    </InvShell>
  );
}

// 39.03 ─────────────────────────────────────────────────
function IndicacaoMeusConvitesScreen({ go }) {
  const items = [
    { name: 'Marina Oliveira', status: 'completed', when: 'há 2 dias',  reward: 'R$ 30 creditados', avatarLvl: 'iniciante' },
    { name: 'Bruno Tavares',   status: 'completed', when: 'há 1 sem',   reward: 'R$ 30 creditados', avatarLvl: 'intermediario' },
    { name: 'Júlia Castro',    status: 'signed',    when: 'há 3 dias',  reward: 'Aguardando 1ª compra' },
    { name: 'Roberto Santos',  status: 'pending',   when: 'há 1 dia',   reward: 'Convite ainda não aceito' },
    { name: 'Pedro Almeida',   status: 'pending',   when: 'há 5 dias',  reward: 'Convite expirou em 2 dias' },
  ];
  const meta = {
    completed: { label: 'Completou',          color: T.c.s700, bg: T.c.s100, icon: 'check_circle' },
    signed:    { label: 'Entrou (sem compra)', color: T.c.a700, bg: T.c.a100, icon: 'hourglass_top' },
    pending:   { label: 'Pendente',           color: T.c.n600, bg: T.c.n100, icon: 'schedule' },
  };
  const [tab, setTab] = React.useState('todos');
  const counts = {
    todos: items.length,
    completed: items.filter(i => i.status === 'completed').length,
    signed:    items.filter(i => i.status === 'signed').length,
    pending:   items.filter(i => i.status === 'pending').length,
  };
  const filtered = items.filter(i => tab === 'todos' || i.status === tab);
  return (
    <InvShell title="Meus convidados" onBack={() => go('back')}>
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, overflowX: 'auto' }}>
        {[
          { id: 'todos',     l: `Todos (${counts.todos})` },
          { id: 'completed', l: `Completos (${counts.completed})` },
          { id: 'signed',    l: `Entraram (${counts.signed})` },
          { id: 'pending',   l: `Pendentes (${counts.pending})` },
        ].map(f => (
          <button key={f.id} onClick={() => setTab(f.id)} style={{
            padding: '6px 12px', borderRadius: T.r.full,
            background: tab === f.id ? T.c.p700 : T.c.n100,
            color: tab === f.id ? T.c.n0 : T.c.n800,
            border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{f.l}</button>
        ))}
      </div>

      <div style={{ background: T.c.n0 }}>
        {filtered.map((it, i) => (
          <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
            <Avatar name={it.name} size={40} level={it.avatarLvl}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{it.name}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{it.when}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: T.r.full,
                background: meta[it.status].bg, color: meta[it.status].color,
                fontFamily: T.font, fontSize: 11, fontWeight: 700,
              }}>
                <Icon name={meta[it.status].icon} size={12} color={meta[it.status].color}/>
                {meta[it.status].label}
              </div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4, fontSize: 11 }}>{it.reward}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="share" size={20}/>} onClick={() => go('indicacao-compartilhar')}>
          Convidar mais
        </Button>
      </div>
    </InvShell>
  );
}

// 39.04 ─────────────────────────────────────────────────
function IndicacaoRecompensasScreen({ go }) {
  const items = [
    { kind: 'desconto',  when: 'hoje',         from: 'Marina entrou', value: 'R$ 30 no marketplace', status: 'available', icon: 'redeem' },
    { kind: 'desconto',  when: 'há 1 sem',     from: 'Bruno entrou',  value: 'R$ 30 no marketplace', status: 'used',      icon: 'redeem' },
    { kind: 'badge',     when: 'há 1 sem',     from: '3 indicações',   value: 'Selo Embaixador',     status: 'active',    icon: 'workspace_premium' },
  ];
  const total = items.filter(i => i.status === 'available').length * 30;
  return (
    <InvShell title="Recompensas ganhas" onBack={() => go('back')}>
      {/* Saldo */}
      <div style={{ padding: 20, background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, color: T.c.n0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.8)' }}>SALDO DISPONÍVEL NO MARKETPLACE</div>
          <div style={{ fontSize: 42, fontWeight: 700, fontFamily: T.font, lineHeight: 1, marginTop: 4 }}>R$ {total}</div>
          <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.9)', marginTop: 6 }}>Aparece como desconto no checkout.</div>
        </div>
      </div>

      <div style={{ ...T.t.overline, color: T.c.n600, padding: '16px 20px 8px' }}>── HISTÓRICO ──</div>
      <div style={{ background: T.c.n0 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i === items.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
            <div style={{
              width: 40, height: 40, borderRadius: T.r.md, flexShrink: 0,
              background: it.status === 'available' ? T.c.s100 : (it.status === 'used' ? T.c.n100 : T.c.a100),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={it.icon} size={20} color={it.status === 'available' ? T.c.s700 : (it.status === 'used' ? T.c.n600 : T.c.a700)} fill={it.status === 'active' ? 1 : 0}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{it.value}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{it.from} · {it.when}</div>
            </div>
            <div style={{
              ...T.t.caption, padding: '3px 8px', borderRadius: T.r.full,
              background: it.status === 'available' ? T.c.s100 : (it.status === 'used' ? T.c.n100 : T.c.a100),
              color: it.status === 'available' ? T.c.s700 : (it.status === 'used' ? T.c.n600 : T.c.a700),
              fontWeight: 700,
            }}>{it.status === 'available' ? 'Disponível' : (it.status === 'used' ? 'Usado' : 'Ativo')}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 16px 24px' }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('marketplace')}>Usar no Marketplace</Button>
        <div style={{ height: 8 }}/>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('indicacao-landing')}>Convidar mais amigos</Button>
      </div>
    </InvShell>
  );
}

// 39.05 ─────────────────────────────────────────────────
function ConviteRecebidoScreen({ go, params }) {
  const inviter = (params && params.inviter) || { name: 'Carla Mendes', level: 'expert' };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'auto' }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${T.c.p900} 0%, ${T.c.p700} 70%, ${T.c.a700} 100%)`,
        color: T.c.n0, padding: '40px 24px 32px', position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Avatar name={inviter.name} size={80} level={inviter.level}/>
          </div>
          <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>VOCÊ FOI CONVIDADO POR</div>
          <div style={{ ...T.t.h2, color: T.c.n0, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 8 }}>{inviter.name}</div>
          <div style={{ ...T.t.bodyLg, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>
            "Bora trocar dicas de vinho? Ganha R$ 30 no marketplace, eu também ganho."
          </div>
        </div>
      </div>

      {/* Bônus */}
      <div style={{ padding: 16, background: T.c.s100, borderBottom: `1px solid ${T.c.n200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: T.c.s700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="redeem" size={24} color={T.c.n0}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.s700 }}>Você ganhou R$ 30 de boas-vindas</div>
            <div style={{ ...T.t.caption, color: T.c.n800, marginTop: 2 }}>Usa no marketplace na primeira compra. Aparece direto no checkout.</div>
          </div>
        </div>
      </div>

      {/* O que é */}
      <div style={{ padding: 20 }}>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 12, fontFamily: '"Fraunces", Georgia, serif' }}>O que é o Tchin Tchin?</div>
        {[
          { icon: 'auto_stories',   title: 'Seu diário de vinhos',       body: 'Registra cada garrafa que prova. Foto, nota, ocasião — sua biografia em vinho.' },
          { icon: 'groups',         title: 'Confrarias',                  body: 'Grupos com seus amigos. Marcam degustações, dividem garrafas, votam vinhos.' },
          { icon: 'science',        title: 'Paladar 5D',                  body: 'Quiz rápido + calibração com vinhos reais. A gente entende seu gosto e recomenda certo.' },
          { icon: 'shopping_bag',   title: 'Marketplace curado',          body: 'Comerciantes parceiros com curadoria de verdade. Match com seu paladar em cada vinho.' },
        ].map(s => (
          <div key={s.title} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={22} color={T.c.p700}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{s.title}</div>
              <div style={{ ...T.t.body, color: T.c.n600, marginTop: 2, lineHeight: 1.5 }}>{s.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '8px 16px 24px' }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('cadastro')}>Criar minha conta grátis</Button>
        <div style={{ height: 8 }}/>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('login')}>Já tenho conta</Button>
        <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
          O bônus aplica automaticamente quando você se cadastrar.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  InvShell,
  IndicacaoLandingScreen, IndicacaoCompartilharScreen,
  IndicacaoMeusConvitesScreen, IndicacaoRecompensasScreen,
  ConviteRecebidoScreen,
});


export { ConviteRecebidoScreen, IndicacaoCompartilharScreen, IndicacaoLandingScreen, IndicacaoMeusConvitesScreen, IndicacaoRecompensasScreen, InvShell };
