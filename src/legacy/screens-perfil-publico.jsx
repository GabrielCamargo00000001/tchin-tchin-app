/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Perfil avançado (6 telas)
//
//   38.01 perfil-seguidores        → lista de quem me segue
//   38.02 perfil-seguindo          → lista de quem sigo
//   38.03 perfil-atividade-publica → timeline pública (posts, eventos, conquistas)
//   38.04 perfil-vinhos-provados   → diário compartilhado (se público)
//   38.05 perfil-sugestoes         → sugestões pra seguir
//   38.06 perfil-comparar-paladar  → comparar paladar com outro usuário
// ─────────────────────────────────────────────────────────────

function PfShell({ title, onBack, action, children }) {
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

const MOCK_FOLLOWERS = [
  { name: 'Carla Mendes',     level: 'expert',         since: 'há 3 meses',  mutual: 12, isExpert: true },
  { name: 'Diego Reis',       level: 'intermediario',  since: 'há 5 meses',  mutual: 8 },
  { name: 'Fernando Medrado', level: 'intermediario',  since: 'há 2 meses',  mutual: 14 },
  { name: 'Helena Britto',    level: 'iniciante',      since: 'há 4 sem',    mutual: 3 },
  { name: 'João Bernardes',   level: 'intermediario',  since: 'há 6 meses',  mutual: 22 },
  { name: 'Marina Oliveira',  level: 'iniciante',      since: 'há 2 sem',    mutual: 1 },
  { name: 'Pedro Almeida',    level: 'expert',         since: 'há 1 ano',    mutual: 18, isExpert: true },
  { name: 'Roberto Santos',   level: 'iniciante',      since: 'ontem',       mutual: 0 },
];

// 38.01 ─────────────────────────────────────────────────
function PerfilSeguidoresScreen({ go, params }) {
  const [q, setQ] = React.useState('');
  const list = MOCK_FOLLOWERS.filter(u => !q || u.name.toLowerCase().includes(q.toLowerCase()));
  const user = (params && params.user) || { name: 'Você' };
  return (
    <PfShell title={`${list.length} seguidores`} onBack={() => go('back')}>
      <div style={{ padding: '12px 16px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: T.c.n100, borderRadius: T.r.full }}>
          <Icon name="search" size={20} color={T.c.n600}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar seguidores" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: T.font, fontSize: 14, color: T.c.n950 }}/>
        </div>
      </div>
      <div style={{ background: T.c.n0 }}>
        {list.map((u, i) => (
          <FollowRow key={u.name} u={u} last={i === list.length - 1} go={go} variant="follower"/>
        ))}
      </div>
    </PfShell>
  );
}

// 38.02 ─────────────────────────────────────────────────
function PerfilSeguindoScreen({ go }) {
  const [q, setQ] = React.useState('');
  const [list, setList] = React.useState(MOCK_FOLLOWERS.slice(2));
  const filtered = list.filter(u => !q || u.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <PfShell title={`Seguindo ${list.length}`} onBack={() => go('back')}>
      <div style={{ padding: '12px 16px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: T.c.n100, borderRadius: T.r.full }}>
          <Icon name="search" size={20} color={T.c.n600}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar quem você segue" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: T.font, fontSize: 14, color: T.c.n950 }}/>
        </div>
      </div>
      <div style={{ background: T.c.n0 }}>
        {filtered.map((u, i) => (
          <FollowRow key={u.name} u={u} last={i === filtered.length - 1} go={go} variant="following" onUnfollow={() => setList(l => l.filter(x => x.name !== u.name))}/>
        ))}
      </div>
      <div style={{ padding: 16 }}>
        <Button variant="secondary" size="md" fullWidth leading={<Icon name="person_add" size={18}/>} onClick={() => go('perfil-sugestoes')}>
          Sugestões pra seguir
        </Button>
      </div>
    </PfShell>
  );
}

function FollowRow({ u, last, go, variant, onUnfollow }) {
  const [following, setFollowing] = React.useState(variant === 'following');
  const toggle = (e) => {
    e.stopPropagation();
    if (variant === 'following' && following && onUnfollow) onUnfollow();
    setFollowing(f => !f);
  };
  return (
    <button onClick={() => go('perfil-outro', { user: u })} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      background: 'none', border: 'none', borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <Avatar name={u.name} size={44} level={u.level}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ ...T.t.bodyB, color: T.c.n950 }}>{u.name}</span>
          {u.isExpert && <Icon name="verified" size={14} color={T.c.p700} fill={1}/>}
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
          {variant === 'follower' ? `Te segue desde ${u.since}` : `${u.mutual} em comum`}
        </div>
      </div>
      <Button variant={following ? 'secondary' : 'primary'} size="sm" onClick={toggle}
        leading={following ? <Icon name="check" size={14}/> : null}>
        {following ? 'Seguindo' : 'Seguir'}
      </Button>
    </button>
  );
}

// 38.03 ─────────────────────────────────────────────────
function PerfilAtividadePublicaScreen({ go, params }) {
  const user = (params && params.user) || { name: 'Carla Mendes', level: 'expert' };
  const acts = [
    { type: 'wine',       when: 'hoje · 14:32',   text: 'Provou', body: 'Catena Malbec Reserva 2021', rating: 5, icon: 'wine_bar' },
    { type: 'post',       when: 'hoje · 12:08',   text: 'Postou',  body: '"Mosselland Riesling Kabinett tá sensacional. Recomendo demais."', icon: 'forum' },
    { type: 'event',      when: 'ontem · 19:00',  text: 'Participou de', body: 'Degustação às cegas · Brindar em Brasília', icon: 'event' },
    { type: 'badge',      when: 'há 2 dias',       text: 'Desbloqueou', body: 'Tour pela Argentina · 10 Malbecs', icon: 'workspace_premium' },
    { type: 'follow',     when: 'há 3 dias',       text: 'Começou a seguir', body: 'Pedro Almeida', icon: 'person_add' },
    { type: 'confraria',  when: 'há 1 sem',        text: 'Entrou em',   body: 'Vinhos da Zona Sul (22 membros)', icon: 'groups' },
    { type: 'wine',       when: 'há 2 sem',        text: 'Provou', body: 'Quinta do Crasto Douro 2019', rating: 4, icon: 'wine_bar' },
    { type: 'expert',     when: 'há 3 sem',        text: 'Virou', body: 'Expert Tchin Tchin · sommelier verificada', icon: 'verified' },
  ];
  return (
    <PfShell title={`Atividade · ${user.name}`} onBack={() => go('back')}>
      <div style={{ padding: '16px 16px 12px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={user.name} size={36} level={user.level}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{user.name}</div>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>Tudo que ela faz no Tchin Tchin · público</div>
        </div>
      </div>
      <div style={{ padding: 12, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 2, background: T.c.n200 }}/>
        {acts.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, position: 'relative', padding: '8px 0' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: T.c.n0, border: `2px solid ${T.c.p700}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
            }}>
              <Icon name={a.icon} size={18} color={T.c.p700} fill={a.type === 'badge' || a.type === 'expert' ? 1 : 0}/>
            </div>
            <div style={{ flex: 1, background: T.c.n0, padding: 12, borderRadius: T.r.md, border: `1px solid ${T.c.n200}`, marginBottom: 6 }}>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{a.when}</div>
              <div style={{ ...T.t.body, color: T.c.n950, marginTop: 2 }}>
                <span style={{ color: T.c.n600 }}>{a.text} </span>
                <strong style={{ color: T.c.n950 }}>{a.body}</strong>
                {a.rating && (
                  <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 2, verticalAlign: 'middle' }}>
                    {[1,2,3,4,5].map(s => (
                      <Icon key={s} name="star" size={12} color={s <= a.rating ? T.c.a700 : T.c.n300} fill={s <= a.rating ? 1 : 0}/>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div style={{ padding: '16px 0 24px', textAlign: 'center', position: 'relative' }}>
          <div style={{ ...T.t.caption, color: T.c.n600, fontFamily: T.mono }}>· · ·</div>
        </div>
      </div>
    </PfShell>
  );
}

// 38.04 ─────────────────────────────────────────────────
function PerfilVinhosProvadosScreen({ go, params }) {
  const user = (params && params.user) || { name: 'Carla Mendes', level: 'expert' };
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : [];
  const [tab, setTab] = React.useState('todos');
  const meu = wines.slice(0, 8).map((w, i) => ({ ...w, rating: 3 + (i % 3), when: ['há 2 dias', 'há 1 sem', 'há 2 sem', 'há 1 mês'][i % 4] }));
  return (
    <PfShell title={`Vinhos de ${user.name.split(' ')[0]}`} onBack={() => go('back')}>
      <div style={{ background: T.c.n0, padding: '16px 16px 12px', borderBottom: `1px solid ${T.c.n200}` }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { l: 'Total',   v: meu.length },
            { l: 'Países',  v: 5 },
            { l: 'Estrelas média', v: '4.2' },
          ].map(s => (
            <div key={s.l} style={{ padding: 10, background: T.c.n50, borderRadius: T.r.md, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.c.p700, fontFamily: T.font }}>{s.v}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {[
            { id: 'todos',   l: 'Todos' },
            { id: 'top',     l: '5 ★' },
            { id: 'tinto',   l: 'Tintos' },
            { id: 'branco',  l: 'Brancos' },
            { id: 'espumante', l: 'Espumantes' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '6px 12px', borderRadius: T.r.full,
              background: tab === t.id ? T.c.p700 : T.c.n100,
              color: tab === t.id ? T.c.n0 : T.c.n800,
              border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {meu.map((w, i) => (
          <button key={i} onClick={() => go('wine', { wine: w })} style={{
            padding: 10, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <BottlePlaceholder width={50} height={70} label=""/>
            <div style={{ ...T.t.caption, color: T.c.n950, fontWeight: 700, marginTop: 8, lineHeight: 1.3, height: 32, overflow: 'hidden' }}>{w.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
              {[1,2,3,4,5].map(s => (
                <Icon key={s} name="star" size={11} color={s <= w.rating ? T.c.a700 : T.c.n300} fill={s <= w.rating ? 1 : 0}/>
              ))}
            </div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4, fontSize: 10 }}>{w.when}</div>
          </button>
        ))}
      </div>
    </PfShell>
  );
}

// 38.05 ─────────────────────────────────────────────────
function PerfilSugestoesScreen({ go }) {
  const groups = [
    { title: 'Por afinidade de paladar', items: [
      { name: 'Marina Oliveira',  level: 'iniciante', sub: '89% de match no paladar', match: 89 },
      { name: 'Bruno Tavares',    level: 'intermediario', sub: '82% de match', match: 82 },
    ]},
    { title: 'Conhecidos no seu app', items: [
      { name: 'Pedro Almeida',    level: 'expert', sub: 'Sommelier verificado · 4 conhecidos em comum' },
      { name: 'Júlia Castro',     level: 'intermediario', sub: '8 conhecidos em comum' },
      { name: 'Roberto Santos',   level: 'iniciante', sub: 'Mora perto de você' },
    ]},
    { title: 'Experts da sua região', items: [
      { name: 'Carla Mendes',     level: 'expert', sub: 'Expert · Brasília · 4 confrarias' },
      { name: 'Helena Britto',    level: 'iniciante', sub: 'Curadora · 12 confrarias' },
    ]},
  ];
  return (
    <PfShell title="Sugestões pra seguir" onBack={() => go('back')}>
      {groups.map(g => (
        <div key={g.title} style={{ marginBottom: 12 }}>
          <div style={{ ...T.t.overline, color: T.c.n600, padding: '14px 20px 8px' }}>── {g.title.toUpperCase()} ──</div>
          <div style={{ background: T.c.n0 }}>
            {g.items.map((u, i) => (
              <SuggestRow key={u.name} u={u} last={i === g.items.length - 1} go={go}/>
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 24 }}/>
    </PfShell>
  );
}

function SuggestRow({ u, last, go }) {
  const [following, setFollowing] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: last ? 'none' : `1px solid ${T.c.n100}` }}>
      <button onClick={() => go('perfil-outro', { user: u })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <Avatar name={u.name} size={44} level={u.level}/>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{u.name}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{u.sub}</div>
        {u.match && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '2px 8px', background: T.c.s100, color: T.c.s700, borderRadius: T.r.full, fontSize: 11, fontWeight: 700, fontFamily: T.mono }}>
            <Icon name="auto_awesome" size={11} color={T.c.s700} fill={1}/>{u.match}% paladar
          </div>
        )}
      </div>
      <Button variant={following ? 'secondary' : 'primary'} size="sm" onClick={() => setFollowing(f => !f)} leading={following ? <Icon name="check" size={14}/> : null}>
        {following ? 'Seguindo' : 'Seguir'}
      </Button>
    </div>
  );
}

// 38.06 ─────────────────────────────────────────────────
function PerfilCompararPaladarScreen({ go, params }) {
  const other = (params && params.user) || { name: 'Carla Mendes', level: 'expert' };
  const meu  = { acidez: 3, tanino: 4, corpo: 4, frutado: 4, docura: 2 };
  const dele = { acidez: 4, tanino: 5, corpo: 5, frutado: 3, docura: 1 };
  const dims = [
    { k: 'acidez',  l: 'Acidez' },
    { k: 'tanino',  l: 'Tanino' },
    { k: 'corpo',   l: 'Corpo' },
    { k: 'frutado', l: 'Frutado' },
    { k: 'docura',  l: 'Doçura' },
  ];
  const score = Math.round(100 - dims.reduce((s, d) => s + Math.abs(meu[d.k] - dele[d.k]) * 100 / 5, 0) / dims.length);
  return (
    <PfShell title="Comparar paladar" onBack={() => go('back')}>
      {/* Header com avatares */}
      <div style={{ padding: '20px 16px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Avatar name="Você" size={64}/>
          <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 8 }}>Você</div>
        </div>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: score >= 75 ? T.c.s100 : score >= 50 ? T.c.a100 : T.c.n100,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: score >= 75 ? T.c.s700 : score >= 50 ? T.c.a700 : T.c.n600, fontFamily: T.font, lineHeight: 1 }}>{score}%</div>
          <div style={{ ...T.t.caption, color: T.c.n600, fontSize: 10 }}>match</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Avatar name={other.name} size={64} level={other.level}/>
          <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 8 }}>{other.name.split(' ')[0]}</div>
        </div>
      </div>

      {/* Dimensões */}
      <div style={{ padding: 16, background: T.c.n0 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 12 }}>── DIMENSÃO POR DIMENSÃO ──</div>
        {dims.map(d => (
          <div key={d.k} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ ...T.t.body, color: T.c.n950, fontWeight: 600 }}>{d.l}</span>
              <span style={{ ...T.t.caption, color: T.c.n600, fontFamily: T.mono }}>diferença: {Math.abs(meu[d.k] - dele[d.k])}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ ...T.t.caption, color: T.c.p700, fontFamily: T.mono, width: 22, textAlign: 'right' }}>{meu[d.k]}</div>
              <div style={{ flex: 1, height: 24, background: T.c.n100, borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: `${(meu[d.k] - 1) * 25}%`, top: 4, bottom: 4, width: 4, background: T.c.p700, borderRadius: 2 }}/>
                <div style={{ position: 'absolute', left: `${(dele[d.k] - 1) * 25}%`, top: 4, bottom: 4, width: 4, background: T.c.a700, borderRadius: 2 }}/>
              </div>
              <div style={{ ...T.t.caption, color: T.c.a700, fontFamily: T.mono, width: 22 }}>{dele[d.k]}</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 16 }}>
          <span style={{ ...T.t.caption, color: T.c.n800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: T.c.p700 }}/>Você
          </span>
          <span style={{ ...T.t.caption, color: T.c.n800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: T.c.a700 }}/>{other.name.split(' ')[0]}
          </span>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ padding: 16, background: T.c.p50, borderRadius: T.r.lg }}>
          <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 6 }}>Onde vocês concordam</div>
          <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 12 }}>
            Vocês dois preferem vinhos secos (doçura baixa) e gostam de corpo forte. Encontros de degustação devem ser ótimos!
          </div>
          <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 6 }}>Onde divergem</div>
          <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>
            {other.name.split(' ')[0]} prefere taninos mais firmes que você. Ela vai pelo carregado; você vai pelo equilíbrio.
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="restaurant" size={20}/>} onClick={() => go('harmoniza')}>
          Achar um vinho que agrade os dois
        </Button>
      </div>
    </PfShell>
  );
}

Object.assign(window, {
  PfShell, FollowRow,
  PerfilSeguidoresScreen, PerfilSeguindoScreen, PerfilAtividadePublicaScreen,
  PerfilVinhosProvadosScreen, PerfilSugestoesScreen, PerfilCompararPaladarScreen,
  MOCK_FOLLOWERS,
});


export { FollowRow, MOCK_FOLLOWERS, PerfilAtividadePublicaScreen, PerfilCompararPaladarScreen, PerfilSeguidoresScreen, PerfilSeguindoScreen, PerfilSugestoesScreen, PerfilVinhosProvadosScreen, PfShell, SuggestRow };
