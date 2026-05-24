/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { EventCard, PostCard } from './cards.jsx';
import { Button } from './components.jsx';
import { MOCK_CONFRARIAS, MOCK_EVENTS, MOCK_POSTS, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { ChecklistOrganizador } from './screens-checklist-organizador.jsx';
import { ModalSheet } from './screens-descobrir.jsx';
import { TutorialPosCriacao } from './screens-wizard-confraria-p7.jsx';
import { Icon, T } from './tokens.jsx';

// ─── Detalhe Confraria (4 tabs) ────────────────────────────
// Ordem: Eventos primeiro (é o que a galera mais busca), Publicações logo em
// seguida. A descrição vive no topo (bloco de identidade) e as Regras ficam
// no menu (3 pontos) — por isso não há mais aba "Sobre".
const CONFRARIA_TABS = [
  { id: 'eventos', label: 'Eventos', icon: 'event', highlight: true },
  { id: 'publicacoes', label: 'Publicações' },
  { id: 'membros', label: 'Membros' },
  { id: 'adega', label: 'Adega' },
];

function ConfrariaDetalheScreen({ go, params }) {
  const confraria = params?.confraria || MOCK_CONFRARIAS[4];
  const isAdmin = confraria._isAdmin === true;
  const justCreated = params?.justCreated === true;
  const [tab, setTab] = React.useState('eventos');
  // Persisted "joined" state per confraria id — survives navigation
  // through welcome → apresentar → tour-rapido and back.
  const confKey = confraria.id != null ? `c${confraria.id}` : (confraria.name || 'c').toLowerCase();
  if (typeof window !== 'undefined' && !window.__tcJoinedConfrarias) window.__tcJoinedConfrarias = {};
  const initialJoined = isAdmin || (typeof window !== 'undefined' && window.__tcJoinedConfrarias[confKey] === true);
  const [joined, setJoinedState] = React.useState(initialJoined);
  const setJoined = (v) => {
    setJoinedState(v);
    if (typeof window !== 'undefined') {
      window.__tcJoinedConfrarias = window.__tcJoinedConfrarias || {};
      window.__tcJoinedConfrarias[confKey] = !!v;
    }
  };
  // Re-sync if user comes back from welcome flow (state may have been set elsewhere)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.__tcJoinedConfrarias && window.__tcJoinedConfrarias[confKey]) {
      setJoinedState(true);
    }
  });
  const [confirmLeave, setConfirmLeave] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Checklist do organizador (antes na aba Sobre, agora na aba Eventos p/ admin)
  const [checklistDone, setChecklistDone] = React.useState(['tema_descricao', 'foto_capa']);
  const onChecklistTap = (id) => {
    if (id === 'primeiro_evento') { go('event-wizard-1', { brotherhoodId: confraria.id, brotherhoodName: confraria.name }); return; }
    if (id === 'primeiro_post')   { setTab('publicacoes'); return; }
    if (id === 'convidou_amigos') { setChecklistDone(prev => prev.includes(id) ? prev : [...prev, id]); return; }
  };

  // 08.07 — Tutorial pós-criação overlay
  const shouldShowTutorial = isAdmin && (typeof window !== 'undefined') && window.__tcShouldShowBrotherhoodTutorial;
  const [showTutorial, setShowTutorial] = React.useState(Boolean(shouldShowTutorial));
  React.useEffect(() => {
    if (showTutorial && typeof window !== 'undefined') {
      // Limpa a flag pra não disparar de novo na próxima entrada
      window.__tcShouldShowBrotherhoodTutorial = false;
      // Claim the onboarding slot so the auto-fired TchinTutor stays suppressed
      // while this richer post-creation tutorial is on screen.
      window.TchinOnboarding && window.TchinOnboarding.claim('post-criacao');
      return () => { window.TchinOnboarding && window.TchinOnboarding.release('post-criacao'); };
    }
  }, [showTutorial]);

  const act = (window.ACTIVITY_META && window.ACTIVITY_META[confraria.activity]) || { emoji: '🔥', label: 'Muito ativa' };
  const visLabel = confraria.visibility === 'privada' ? 'Privada' : 'Pública';
  const place = confraria.modality === 'presencial' ? `📍 ${confraria.location || 'Brasília-DF'}` : confraria.modality === 'online' ? '🌐 Online' : '🔀 Híbrida';
  const styleTag = (confraria.tags && confraria.tags[0]) || 'Degustação Técnica';

  const handleJoinToggle = () => {
    if (joined) { setConfirmLeave(true); return; }
    setJoined(true);
    // New member: open the welcome flow (welcome → apresentar → tour rápido)
    go('confraria-welcome', { confraria });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Cover with transparent overlay header */}
      <div style={{ position: 'relative', height: 200, background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.18 }}>
          <Icon name="groups" size={140} color="#fff"/>
        </div>
        {/* gradient scrim bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)' }}/>
        {/* Header overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px' }}>
          <button onClick={() => go('back')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <Icon name="arrow_back" size={22} color="#fff"/>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => go('chat-conversa', { chat: { id: 'c-' + (confraria.id || 'x'), name: confraria.name, type: 'group', members: confraria.members || 8 } })} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <Icon name="chat" size={20} color="#fff"/>
            </button>
            <button onClick={() => go('toast', { variant: 'info', message: 'Link copiado!' })} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <Icon name="ios_share" size={20} color="#fff"/>
            </button>
            <button onClick={() => setMenuOpen(true)} data-tour-anchor="confraria-menu" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <Icon name="more_vert" size={20} color="#fff"/>
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Identity block */}
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 6 }}>{confraria.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
            <Badge>{act.emoji} {act.label}</Badge>
            <Badge>{confraria.members} membros</Badge>
            <Badge>{visLabel}</Badge>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            <Badge subtle>{place}</Badge>
            <Badge subtle>{styleTag}</Badge>
          </div>
          <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 16, lineHeight: 1.5 }}>{confraria.description}</div>

          <Button variant={joined ? 'secondary' : 'primary'} size="lg" fullWidth
            leading={<Icon name={isAdmin ? 'admin_panel_settings' : (joined ? 'check' : 'group_add')} size={18}/>}
            onClick={isAdmin ? () => go('toast', { kind: 'info', message: 'Você é o admin desta confraria.' }) : handleJoinToggle}>
            {isAdmin ? 'Você é admin' : (joined ? 'Participando' : 'Participar')}
          </Button>
        </div>

        {/* ─── Próximo evento — banner principal pra discoverability ── */}
        <NextEventBanner confraria={confraria} joined={joined} isAdmin={isAdmin} go={go} onCreate={() => go('event-wizard-1', { brotherhoodId: confraria.id, brotherhoodName: confraria.name })}/>

        {/* Tabs scrollable */}
        <div style={{ marginTop: 18, borderBottom: `1px solid ${T.c.n200}`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', gap: 4, padding: '0 12px', minWidth: 'max-content' }}>
            {CONFRARIA_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '12px 14px', background: 'none', border: 'none',
                borderBottom: `2px solid ${tab === t.id ? T.c.p700 : 'transparent'}`,
                color: tab === t.id ? T.c.p700 : (t.highlight ? T.c.p700 : T.c.n600),
                fontWeight: t.highlight ? 700 : 600, fontSize: 14,
                cursor: 'pointer', fontFamily: T.font, marginBottom: -1, whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {t.icon && <Icon name={t.icon} size={16} color={tab === t.id ? T.c.p700 : (t.highlight ? T.c.p700 : T.c.n600)}/>}
                {t.label}
                {t.id === 'eventos' && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
                    background: T.c.p700, color: T.c.n0,
                    fontSize: 10, fontWeight: 800, fontFamily: T.mono,
                  }}>2</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px 20px 32px' }}>
          {/* Checklist do organizador (admin) — antes vivia na aba Sobre; agora
              acompanha a aba Eventos pra não perder o onboarding de novo admin. */}
          {tab === 'eventos' && isAdmin && (
            <div style={{ marginBottom: 18 }}>
              <ChecklistOrganizador completedItems={checklistDone} onItemTap={onChecklistTap}/>
            </div>
          )}
          {tab === 'membros'     && <MembrosTab confraria={confraria}/>}
          {tab === 'eventos'     && <EventosTab confraria={confraria} joined={joined} isAdmin={isAdmin} onJoin={handleJoinToggle} go={go} onCreateEvent={() => go('event-wizard-1', { brotherhoodId: confraria.id, brotherhoodName: confraria.name })}/>}
          {tab === 'adega'       && <AdegaConfTab confraria={confraria} go={go}/>}
          {tab === 'publicacoes' && <PublicacoesConfTab confraria={confraria} joined={joined}/>}
        </div>
      </div>

      {/* 08.07 Tutorial pós-criação — primeira visita à confraria recém-criada */}
      {showTutorial && (
        <TutorialPosCriacao
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      )}

      {confirmLeave && (
        <ModalSheet onClose={() => setConfirmLeave(false)}>
          <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 6 }}>Sair da confraria?</div>
          <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 18, lineHeight: 1.5 }}>
            Você não vai mais receber convites pros eventos da <strong>{confraria.name}</strong>. Pode entrar de novo a qualquer momento.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button variant="destructive" size="lg" fullWidth onClick={() => { setJoined(false); setConfirmLeave(false); go('toast', { variant: 'info', message: 'Você saiu da confraria.' }); }}>Sim, sair</Button>
            <Button variant="ghost" size="lg" fullWidth onClick={() => setConfirmLeave(false)}>Continuar participando</Button>
          </div>
        </ModalSheet>
      )}

      {menuOpen && (
        <ConfrariaMenuSheet
          isAdmin={isAdmin}
          joined={joined}
          confraria={confraria}
          onClose={() => setMenuOpen(false)}
          go={(s, p) => { setMenuOpen(false); setTimeout(() => go(s, p), 50); }}
        />
      )}
    </div>
  );
}

// ─── Badge helper ─────────────────────────────────────────
function Badge({ children, subtle }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: T.r.full,
      background: subtle ? T.c.n100 : T.c.p50, color: subtle ? T.c.n800 : T.c.p700,
      fontSize: 12, fontWeight: 600, fontFamily: T.font,
    }}>{children}</span>
  );
}

// ─── Sobre Tab ─────────────────────────────────────────────
function SobreTab({ confraria, isAdmin, justCreated, onCreateEvent, onOpenEventos, onOpenPublicacoes }) {
  // When admin (especially on a freshly-created confraria), the "Sobre" tab
  // doubles as the organizer command center: checklist on top, feed/events
  // teasers below. This keeps all 3 tutorial anchors visible in one view.
  const showCommandCenter = isAdmin;

  // Mock checklist state — for the prototype, start with auto-complete steps
  // (template + cover are done by the wizard) and let the user tick the rest.
  const [completedItems, setCompletedItems] = React.useState(() => {
    return justCreated ? ['tema_descricao', 'foto_capa'] : ['tema_descricao', 'foto_capa'];
  });
  const onChecklistTap = (id) => {
    if (id === 'primeiro_evento') { onCreateEvent(); return; }
    if (id === 'primeiro_post')   { onOpenPublicacoes(); return; }
    if (id === 'convidou_amigos') {
      setCompletedItems(prev => prev.includes(id) ? prev : [...prev, id]);
      return;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {showCommandCenter && (
        <>
          {/* 10.01 Checklist do Organizador */}
          <ChecklistOrganizador
            completedItems={completedItems}
            onItemTap={onChecklistTap}
          />

          {/* Feed teaser — anchor pra tutorial 08.07 Frame 1 */}
          <div data-tour-anchor="confraria-feed" style={{
            background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg,
            padding: 14, cursor: 'pointer',
          }} onClick={onOpenPublicacoes}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="forum" size={18} color={T.c.n600}/>
              <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950 }}>
                Feed da confraria
              </div>
              <div style={{ flex: 1 }}/>
              <Icon name="chevron_right" size={18} color={T.c.n400}/>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.c.n600, lineHeight: 1.4 }}>
              Ainda sem posts. Comece com um "Bem-vindos" pra galera saber que o canal tá ativo.
            </div>
          </div>

          {/* Eventos teaser — anchor pra tutorial 08.07 Frame 2 */}
          <div data-tour-anchor="confraria-events" style={{
            background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg,
            padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="event" size={18} color={T.c.n600}/>
              <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950 }}>
                Próximos eventos
              </div>
              <div style={{ flex: 1 }}/>
              <button onClick={onOpenEventos} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 8px',
                fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.c.p700,
              }}>
                Ver todos
              </button>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.c.n600, lineHeight: 1.4, marginBottom: 12 }}>
              Marque o primeiro encontro — confrarias com evento nos 7 primeiros dias têm 4× mais chance de virar comunidade ativa.
            </div>
            <Button variant="primary" size="sm" leading={<Icon name="add" size={16}/>} onClick={onCreateEvent}>
              Criar primeiro evento
            </Button>
          </div>
        </>
      )}

      {/* Descrição mora no topo (bloco de identidade), não aqui — evita repetição. */}

      {!justCreated && (
        <Section title="Regras">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Sem proselitismo de marca — falamos de uvas, não de comerciantes.',
              'Confirmação até 48h antes do evento. Falta sem aviso conta como ausência.',
              'Respeito ao paladar dos outros — todo vinho merece uma chance.',
            ].map((r, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, ...T.t.body, color: T.c.n800, lineHeight: 1.45 }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: T.c.p50, color: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ flex: 1 }}>{r}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Dono">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={isAdmin ? (window.MOCK_USER ? window.MOCK_USER.name : 'Você') : 'Carla Mendes'} size={48} level={isAdmin ? 'intermediario' : 'expert'}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.c.n950 }}>
              {isAdmin ? 'Você' : 'Carla Mendes'}
            </div>
            <div style={{ ...T.t.caption, color: T.c.n600 }}>
              {isAdmin ? 'Admin · acabou de criar' : 'Enófila · Brasília'}
            </div>
          </div>
          {!isAdmin && <Button variant="ghost" size="sm">Ver perfil</Button>}
        </div>
      </Section>

      {!justCreated && (
        <Section title="Criada em">
          <div style={{ ...T.t.body, color: T.c.n800 }}>14 de março de 2024 · há 2 anos</div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

// ─── Membros Tab ───────────────────────────────────────────
const MOCK_MEMBROS = [
  { id: 1, name: 'Carla Mendes', role: 'admin', level: 'expert' },
  { id: 2, name: 'Diego Almeida', role: 'mod', level: 'intermediario' },
  { id: 3, name: 'Ana Beatriz', role: 'mod', level: 'intermediario' },
  { id: 4, name: 'Matheus Garzon', role: 'membro', level: 'intermediario' },
  { id: 5, name: 'Helena Sotero', role: 'membro', level: 'iniciante' },
  { id: 6, name: 'Bruno Tavares', role: 'membro', level: 'iniciante' },
  { id: 7, name: 'Patricia Rocha', role: 'membro', level: 'intermediario' },
  { id: 8, name: 'Rafael Lima', role: 'membro', level: 'expert' },
  { id: 9, name: 'Lia Cardoso', role: 'membro', level: 'iniciante' },
  { id: 10, name: 'Vitor Pessoa', role: 'membro', level: 'intermediario' },
  { id: 11, name: 'Sofia Brandão', role: 'membro', level: 'intermediario' },
];

function MembrosTab({ confraria }) {
  const [q, setQ] = React.useState('');
  const filtered = MOCK_MEMBROS.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
  const groups = [
    { id: 'admin', label: 'Dono', items: filtered.filter(m => m.role === 'admin') },
    { id: 'mod', label: 'Moderadores', items: filtered.filter(m => m.role === 'mod') },
    { id: 'membro', label: `Membros · ${filtered.filter(m => m.role === 'membro').length}`, items: filtered.filter(m => m.role === 'membro') },
  ];
  const roleColor = { admin: T.c.p700, mod: T.c.a700, membro: T.c.n600 };
  const roleLabel = { admin: 'Dono', mod: 'Mod', membro: '' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ position: 'relative' }}>
        <Icon name="search" size={20} color={T.c.n600} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}/>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar membro" style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 12px 12px 40px',
          borderRadius: T.r.md, border: `1.5px solid ${T.c.n300}`, fontFamily: T.font, fontSize: 14, color: T.c.n950,
          outline: 'none', background: T.c.n0,
        }}/>
      </div>
      {groups.map(g => g.items.length > 0 && (
        <div key={g.id}>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8 }}>{g.label}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {g.items.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${T.c.n100}` }}>
                <Avatar name={m.name} size={40} level={m.level}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.c.n950 }}>{m.name}</div>
                  <div style={{ ...T.t.caption, color: T.c.n600 }}>{m.level === 'expert' ? 'Enófilo' : m.level === 'intermediario' ? 'Intermediário' : 'Iniciante'}</div>
                </div>
                {roleLabel[m.role] && (
                  <span style={{ padding: '4px 8px', borderRadius: T.r.full, background: T.c.n0, border: `1px solid ${roleColor[m.role]}`, color: roleColor[m.role], fontSize: 11, fontWeight: 700 }}>{roleLabel[m.role]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: T.c.n600, fontSize: 14 }}>Nenhum membro com esse nome.</div>
      )}
    </div>
  );
}

// ─── Eventos Tab ───────────────────────────────────────────
function EventosTab({ confraria, joined, isAdmin, onJoin, onCreateEvent, go }) {
  const [sub, setSub] = React.useState('proximos');
  const proximos = MOCK_EVENTS.filter(e => new Date(e.date) >= new Date('2026-05-10'));
  const passados = MOCK_EVENTS.filter(e => new Date(e.date) < new Date('2026-05-10'));
  const list = sub === 'proximos' ? proximos : passados;

  // Admin sempre vê os eventos + tem botão de criar
  if (isAdmin) {
    return (
      <div data-tour-anchor="confraria-events" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <SubTabs value={sub} onChange={setSub} items={[{ id: 'proximos', label: `Próximos (${proximos.length})` }, { id: 'passados', label: `Passados (${passados.length})` }]}/>
          <Button variant="primary" size="sm" leading={<Icon name="add" size={16}/>} onClick={onCreateEvent}>
            Novo evento
          </Button>
        </div>
        {list.length > 0 ? list.map(e => <EventCard key={e.id} event={e} onClick={() => go('event-detalhe', { event: e, brotherhood: confraria })}/>) : (
          <div style={{
            padding: 24, background: T.c.p50, borderRadius: T.r.lg,
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <Icon name="event_available" size={32} color={T.c.p700}/>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>
              {sub === 'proximos' ? 'Nenhum evento agendado' : 'Sem histórico de eventos.'}
            </div>
            {sub === 'proximos' && (
              <>
                <div style={{ fontSize: 13, color: T.c.n800, maxWidth: 260 }}>
                  Confrarias que marcam o primeiro evento em 7 dias têm 4× mais chance de virar comunidade ativa.
                </div>
                <Button variant="primary" size="md" leading={<Icon name="add" size={18}/>} onClick={onCreateEvent}>
                  Criar primeiro evento
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!joined && sub === 'proximos') {
    // Show locked state with first event preview
    return (
      <div data-tour-anchor="confraria-events" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SubTabs value={sub} onChange={setSub} items={[{ id: 'proximos', label: `Próximos (${proximos.length})` }, { id: 'passados', label: `Passados (${passados.length})` }]}/>
        <div style={{ padding: 24, background: T.c.p50, borderRadius: T.r.lg, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Icon name="lock" size={32} color={T.c.p700}/>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>Eventos são pra membros</div>
          <div style={{ fontSize: 13, color: T.c.n800, maxWidth: 260 }}>Entre na {confraria.name} pra ver datas, participar e levar sua garrafa.</div>
          <Button variant="primary" size="md" onClick={onJoin}>Participar</Button>
        </div>
      </div>
    );
  }
  return (
    <div data-tour-anchor="confraria-events" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SubTabs value={sub} onChange={setSub} items={[{ id: 'proximos', label: `Próximos (${proximos.length})` }, { id: 'passados', label: `Passados (${passados.length})` }]}/>
      {list.length > 0 ? list.map(e => <EventCard key={e.id} event={e} onClick={() => go('event-detalhe', { event: e, brotherhood: confraria })}/>) : (
        <div style={{ padding: 32, textAlign: 'center', color: T.c.n600, fontSize: 14 }}>{sub === 'proximos' ? 'Nenhum evento agendado ainda.' : 'Sem histórico de eventos.'}</div>
      )}
    </div>
  );
}

function SubTabs({ value, onChange, items }) {
  return (
    <div style={{ display: 'inline-flex', background: T.c.n100, borderRadius: T.r.full, padding: 4, gap: 0, alignSelf: 'flex-start' }}>
      {items.map(i => (
        <button key={i.id} onClick={() => onChange(i.id)} style={{
          padding: '6px 14px', borderRadius: T.r.full, border: 'none', cursor: 'pointer',
          background: value === i.id ? T.c.n0 : 'transparent',
          color: value === i.id ? T.c.n950 : T.c.n600, fontWeight: 600, fontSize: 13, fontFamily: T.font,
          boxShadow: value === i.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
        }}>{i.label}</button>
      ))}
    </div>
  );
}

// ─── Adega Coletiva Tab ────────────────────────────────────
function AdegaConfTab({ confraria, go }) {
  const wines = MOCK_WINES.slice(0, 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ ...T.t.caption, color: T.c.n600 }}>Vinhos discutidos nos encontros da confraria. {wines.length} cadastrados.</div>
      {wines.map(w => (
        <div key={w.id} onClick={() => go('wine', { wine: w })} style={{ display: 'flex', gap: 12, padding: 12, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, cursor: 'pointer' }}>
          <div style={{ width: 56, height: 72, background: T.c.p50, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="wine_bar" size={28} color={T.c.p700}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.c.n950, marginBottom: 2 }}>{w.name}</div>
            <div style={{ ...T.t.caption, color: T.c.n600 }}>{w.producer} · {w.country}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <Icon name="star" size={14} color={T.c.a700}/>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.c.n800 }}>{(w.rating || 4.2).toFixed(1)}</span>
              <span style={{ ...T.t.caption, color: T.c.n600 }}>· discutido em 3 encontros</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Publicações da Confraria Tab ──────────────────────────
function PublicacoesConfTab({ confraria, joined }) {
  const posts = MOCK_POSTS.slice(0, 2);
  if (!joined) {
    return (
      <div style={{ padding: 24, background: T.c.p50, borderRadius: T.r.lg, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Icon name="lock" size={32} color={T.c.p700}/>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>Feed exclusivo de membros</div>
        <div style={{ fontSize: 13, color: T.c.n800, maxWidth: 260 }}>Entre pra ver as publicações da confraria — fotos dos encontros, reviews internos, decisões do mês.</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {posts.map(p => <PostCard key={p.id} post={p} onLike={() => {}} onComment={() => {}} onShare={() => {}}/>)}
    </div>
  );
}



// ─── NextEventBanner — banner principal do próximo evento ─────
function NextEventBanner({ confraria, joined, isAdmin, go, onCreate }) {
  const events = (typeof MOCK_EVENTS !== 'undefined' ? MOCK_EVENTS : []).filter(e => new Date(e.date) >= new Date('2026-05-10'));
  // Confraria recém-criada usa o próprio evento (se houver) e NÃO empresta um
  // evento mock; confraria estabelecida (mock) mostra a agenda mock.
  const fe = (confraria && confraria._firstEvent && confraria._firstEvent.date) ? confraria._firstEvent : null;
  const synthetic = confraria && (confraria._justCreated || confraria._isAdmin);
  const ev = fe
    ? { ...fe,
        title: fe.name || fe.title || 'Seu evento',
        location: fe.locationMode === 'online' ? 'Online' : (fe.locationText || fe.location || 'Local a definir'),
        modality: fe.locationMode === 'online' ? 'online' : 'presencial' }
    : (synthetic ? null : events[0]);
  if (!ev) {
    if (isAdmin) {
      return (
        <div style={{ margin: '16px 20px 18px', padding: 16, background: T.c.p50, borderRadius: T.r.lg, border: `1.5px dashed ${T.c.p300}`, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: T.r.md, background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="event_available" size={22} color={T.c.n0}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Sem evento marcado</div>
            <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Confrarias sem evento esfriam. Marca o primeiro.</div>
          </div>
          <Button variant="primary" size="sm" leading={<Icon name="add" size={14}/>} onClick={onCreate}>Criar</Button>
        </div>
      );
    }
    return null;
  }
  const d = new Date(ev.date + 'T00:00:00');
  const day = d.getDate();
  const monthAbbr = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][d.getMonth()];
  const weekday = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'][d.getDay()];
  const goEvent = () => go('event-detalhe', { event: ev, brotherhood: confraria });
  return (
    <button onClick={goEvent} style={{
      width: 'calc(100% - 40px)', margin: '16px 20px 18px',
      display: 'flex', alignItems: 'stretch', gap: 0,
      background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
      border: 'none', borderRadius: T.r.lg, cursor: 'pointer',
      overflow: 'hidden', textAlign: 'left',
      boxShadow: '0 8px 24px rgba(74,31,36,0.28)',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 12px)` }}/>
      {/* Date column */}
      <div style={{
        width: 72, padding: '14px 0',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: T.c.n0, position: 'relative', flexShrink: 0,
      }}>
        <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 700, letterSpacing: 0.6 }}>{weekday}</div>
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, fontFamily: T.font }}>{day}</div>
        <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 700, letterSpacing: 0.6 }}>{monthAbbr}</div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: '12px 14px', color: T.c.n0, position: 'relative', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: T.r.full, background: T.c.a500, color: T.c.p900,
            fontFamily: T.font, fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
          }}>PRÓXIMO EVENTO</div>
        </div>
        <div style={{ ...T.t.bodyB, color: T.c.n0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 16, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, color: 'rgba(255,255,255,0.85)' }}>
          <Icon name="schedule" size={12} color="rgba(255,255,255,0.85)"/>
          <span style={{ ...T.t.caption, color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>às {ev.time}</span>
          <Icon name={ev.modality === 'online' ? 'videocam' : 'location_on'} size={12} color="rgba(255,255,255,0.85)"/>
          <span style={{ ...T.t.caption, color: 'rgba(255,255,255,0.85)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.modality === 'online' ? 'Online' : (ev.location || 'Presencial')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: T.r.full,
            background: T.c.n0, color: T.c.p900,
            fontFamily: T.font, fontSize: 11, fontWeight: 700,
          }}>
            {joined || isAdmin ? 'Confirmar presença' : 'Ver detalhes'}
            <Icon name="arrow_forward" size={12} color={T.c.p900}/>
          </div>
        </div>
      </div>
    </button>
  );
}



// ─── Sheet de menu (admin + membro) ─────────────────────────
function ConfrariaMenuSheet({ isAdmin, joined, confraria, onClose, go }) {
  const adminItems = [
    { icon: 'edit',                 label: 'Editar confraria',  onClick: () => go('confraria-config', { confraria }) },
    { icon: 'group_add',            label: 'Convidar membros',  onClick: () => go('confraria-convidar', { confraria }) },
    { icon: 'gavel',                label: 'Regras',            onClick: () => go('confraria-regras', { confraria }) },
    { icon: 'chat',                 label: 'Mural / chat',      onClick: () => go('chat-conversa', { chat: { id: 'c-' + (confraria.id || 'x'), name: confraria.name, type: 'group', members: confraria.members || 8 } }) },
    { icon: 'leaderboard',          label: 'Ranking da semana', onClick: () => go('ranking', { confraria }) },
    { icon: 'notifications_none',   label: 'Notificações',      onClick: () => go('config-notif') },
    { icon: 'swap_horiz',           label: 'Transferir admin',  onClick: () => go('confraria-transferir', { confraria }) },
    { icon: 'logout',               label: 'Sair da confraria', danger: true, onClick: () => go('confraria-sair', { confraria: { ...confraria, isAdmin: true } }) },
  ];
  const memberItems = [
    { icon: 'group_add',            label: 'Convidar amigos',   onClick: () => go('confraria-convidar', { confraria }) },
    { icon: 'gavel',                label: 'Ver regras',        onClick: () => go('confraria-regras', { confraria }) },
    { icon: 'chat',                 label: 'Mural / chat',      onClick: () => go('chat-conversa', { chat: { id: 'c-' + (confraria.id || 'x'), name: confraria.name, type: 'group', members: confraria.members || 8 } }) },
    { icon: 'leaderboard',          label: 'Ranking da semana', onClick: () => go('ranking', { confraria }) },
    { icon: 'notifications_off',    label: 'Silenciar',         onClick: () => go('toast', { variant: 'success', message: 'Notificações silenciadas por 7 dias.' }) },
    { icon: 'flag',                 label: 'Reportar',          danger: true, onClick: () => go('toast', { variant: 'success', message: 'Reporte enviado. Vamos analisar.' }) },
    { icon: 'logout',               label: 'Sair da confraria', danger: true, onClick: () => go('confraria-sair', { confraria }) },
  ];
  const items = isAdmin ? adminItems : (joined ? memberItems : [
    { icon: 'group_add',  label: 'Convidar amigos', onClick: () => go('confraria-convidar', { confraria }) },
    { icon: 'gavel',      label: 'Ver regras',      onClick: () => go('confraria-regras', { confraria }) },
    { icon: 'flag',       label: 'Reportar',        danger: true, onClick: () => go('toast', { variant: 'success', message: 'Reporte enviado.' }) },
  ]);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'tcFadeIn 180ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl,
        padding: '8px 0 12px', width: '100%', animation: 'tcSlideUp 220ms',
      }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '8px auto 12px' }}/>
        <div style={{ ...T.t.overline, color: T.c.n600, padding: '4px 20px 8px' }}>
          {isAdmin ? '── ADMIN ──' : '── AÇÕES ──'}
        </div>
        {items.map(a => (
          <button key={a.label} onClick={a.onClick} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            color: a.danger ? T.c.e700 : T.c.n950, fontFamily: T.font, fontSize: 15, fontWeight: 500,
          }}>
            <Icon name={a.icon} size={22} color={a.danger ? T.c.e700 : T.c.n800}/>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ConfrariaDetalheScreen, SobreTab, MembrosTab, EventosTab, AdegaConfTab, PublicacoesConfTab, Badge, SubTabs,
});
Object.assign(window, { NextEventBanner });
Object.assign(window, { ConfrariaMenuSheet });


export { AdegaConfTab, Badge, CONFRARIA_TABS, ConfrariaDetalheScreen, ConfrariaMenuSheet, EventosTab, MOCK_MEMBROS, MembrosTab, NextEventBanner, PublicacoesConfTab, Section, SobreTab, SubTabs };
