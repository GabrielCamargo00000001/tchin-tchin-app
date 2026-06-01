/* eslint-disable */
// @ts-nocheck
// PREVIEWS pra Gabriel aprovar — não é a implementação final.
// Cada preview mostra a tela no CONTEXTO REAL (com AppHeader, abas da home
// Confrarias|Eventos e BottomNav; ou capa/abas do confraria-detalhe; ou
// hero do event-detalhe com modal por cima). Após aprovação, vira a
// implementação real.
import React from 'react';
import { AppHeader, BottomNav, Button } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ════════════════════════════════════════════════════════════════
// SHELLS — wrappers que reproduzem o contexto real
// ════════════════════════════════════════════════════════════════

// 1) Home/Confrarias shell (header + tabs Confrarias|Eventos + body + bottom nav)
function HomeShell({ children, mainTab = 'eventos' }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <AppHeader notifCount={3}/>
      <div style={{ background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <div style={{ padding: '12px 16px 6px' }}>
          <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif' }}>Confrarias</div>
          <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Grupos de pessoas que abrem garrafas juntas.</div>
        </div>
        <div style={{ display: 'flex', gap: 16, padding: '8px 16px 0' }}>
          {[['confrarias','Confrarias'],['eventos','Eventos']].map(([k,l]) => (
            <div key={k} style={{
              padding: '8px 0 12px', fontFamily: T.font, fontSize: 14,
              fontWeight: mainTab === k ? 700 : 500,
              color: mainTab === k ? T.c.p700 : T.c.n600,
              borderBottom: `2.5px solid ${mainTab === k ? T.c.p700 : 'transparent'}`,
            }}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      <BottomNav active="confrarias" onChange={() => {}}/>
    </div>
  );
}

// 2) Confraria detalhe shell (header + capa + meta + Participar + 4 abas)
function ConfrariaDetalheShell({ confraria, activeTab = 'eventos', isPrivate = false, isMember = false, onBack, children }) {
  const tabs = [
    { id: 'eventos', label: 'Eventos', icon: 'event' },
    { id: 'publicacoes', label: 'Publicações', icon: 'forum' },
    { id: 'membros', label: 'Membros', icon: 'group' },
    { id: 'adega', label: 'Adega', icon: 'wine_bar' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <header style={{
        display: 'flex', alignItems: 'center', padding: '8px 8px', background: T.c.p700, color: T.c.n0, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', color: T.c.n0 }}>
          <Icon name="arrow_back" size={22} color={T.c.n0}/>
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>{confraria.name}</div>
        <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="more_vert" size={22} color={T.c.n0}/>
        </button>
      </header>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Capa */}
        <div style={{
          height: 140, background: `linear-gradient(135deg, ${T.c.p900}, ${T.c.p500})`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        </div>
        {/* Header detalhe */}
        <div style={{ padding: '14px 16px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n100}` }}>
          <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>{confraria.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            <span style={{ ...T.t.caption, padding: '3px 8px', background: '#FFEDD5', color: '#C2410C', borderRadius: T.r.full, fontWeight: 700 }}>🔥 Muito ativa</span>
            <span style={{ ...T.t.caption, padding: '3px 8px', background: T.c.n100, color: T.c.n800, borderRadius: T.r.full }}>{confraria.members} membros</span>
            <span style={{ ...T.t.caption, padding: '3px 8px', background: isPrivate ? T.c.a100 : T.c.s100, color: isPrivate ? T.c.a700 : T.c.s700, borderRadius: T.r.full, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name={isPrivate ? 'lock' : 'public'} size={11} color={isPrivate ? T.c.a700 : T.c.s700}/>
              {isPrivate ? 'Privada' : 'Pública'}
            </span>
            <span style={{ ...T.t.caption, padding: '3px 8px', background: T.c.n100, color: T.c.n800, borderRadius: T.r.full }}>📍 {confraria.location}</span>
          </div>
          {!isMember && (
            <Button variant="primary" size="md" fullWidth leading={<Icon name={isPrivate ? 'lock' : 'add'} size={16}/>}>
              {isPrivate ? 'Solicitar entrada' : 'Participar'}
            </Button>
          )}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, position: 'sticky', top: 0, zIndex: 2 }}>
          {tabs.map(t => (
            <div key={t.id} style={{
              flex: 1, padding: '12px 0', textAlign: 'center',
              fontFamily: T.font, fontSize: 12.5,
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? T.c.p700 : T.c.n600,
              borderBottom: `2.5px solid ${activeTab === t.id ? T.c.p700 : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <Icon name={t.icon} size={14} color={activeTab === t.id ? T.c.p700 : T.c.n600}/>
              {t.label}
            </div>
          ))}
        </div>
        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}

// 3) Event detalhe shell (back + hero + body + modal sobreposto)
function EventDetalheShell({ event, modal }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden', position: 'relative' }}>
      <header style={{
        display: 'flex', alignItems: 'center', padding: '8px 8px', background: T.c.n0, flexShrink: 0,
      }}>
        <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="arrow_back" size={22} color={T.c.n950}/>
        </button>
        <div style={{ flex: 1 }}/>
        <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="more_vert" size={22} color={T.c.n950}/>
        </button>
      </header>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          height: 180, background: `linear-gradient(135deg, ${event.from}, ${event.to})`,
          position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 18,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.32)', color: '#fff', borderRadius: T.r.full, fontSize: 11, fontWeight: 700 }}>📅 {event.date}</span>
            <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.32)', color: '#fff', borderRadius: T.r.full, fontSize: 11, fontWeight: 700 }}>🏛️ Presencial</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 4 }}>{event.title}</div>
          <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 16 }}>{event.confraria}</div>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8 }}>VOCÊ VAI?</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Confirmar','Talvez','Não vou'].map((l,i) => (
              <button key={i} style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: T.c.n0, border: `1.5px solid ${T.c.n300}`, color: T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 600 }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      {modal}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Componentes compartilhados (segmented, chips, cards)
// ════════════════════════════════════════════════════════════════
function Segmented({ items, value }) {
  return (
    <div style={{ display: 'flex', padding: 4, background: T.c.n100, borderRadius: T.r.full, margin: '12px 16px' }}>
      {items.map(it => (
        <div key={it.v} style={{
          flex: 1, padding: '10px 12px', borderRadius: T.r.full,
          background: value === it.v ? T.c.n0 : 'transparent',
          color: value === it.v ? T.c.n950 : T.c.n600,
          fontFamily: T.font, fontSize: 13, fontWeight: 700, textAlign: 'center',
          boxShadow: value === it.v ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
        }}>{it.l}</div>
      ))}
    </div>
  );
}
function StatusChips({ items, value }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px 8px', overflowX: 'auto' }}>
      {items.map(it => (
        <div key={it.v} style={{
          flexShrink: 0, padding: '7px 14px', borderRadius: T.r.full,
          background: value === it.v ? T.c.p700 : T.c.n0,
          color: value === it.v ? T.c.n0 : T.c.n800,
          border: `1.5px solid ${value === it.v ? T.c.p700 : T.c.n200}`,
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
        }}>{it.l}</div>
      ))}
    </div>
  );
}
function EventCardPrev({ ev, scope }) {
  return (
    <div style={{
      background: T.c.n0, borderRadius: T.r.lg, margin: '0 16px 12px',
      overflow: 'hidden', border: `1px solid ${T.c.n200}`,
    }}>
      <div style={{
        height: 80, background: `linear-gradient(135deg, ${ev.from || T.c.p700}, ${ev.to || T.c.p900})`,
        position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 10,
      }}>
        <Icon name={ev.icon || 'wine_bar'} size={22} color="#FFFFFF" fill={1} style={{ opacity: 0.85 }}/>
        {ev.status === 'andamento' && (
          <span style={{ position: 'absolute', top: 8, right: 8, padding: '3px 10px', background: '#2E7D32', color: '#fff', borderRadius: T.r.full, fontSize: 10.5, fontWeight: 800 }}>
            Acontecendo agora
          </span>
        )}
      </div>
      <div style={{ padding: '10px 14px 12px' }}>
        {scope === 'descobrir' && (
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            <Icon name="groups" size={11} color={T.c.n600}/>
            Origem · {ev.confraria}
          </div>
        )}
        <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14, marginBottom: 3 }}>{ev.title}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2, fontSize: 12 }}>
          <Icon name="schedule" size={12} color={T.c.n600}/> {ev.date}
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <Icon name="place" size={12} color={T.c.n600}/> {ev.place}
        </div>
      </div>
    </div>
  );
}

// Cadeado em aba bloqueada (privada/não-membro)
function LockedTab({ label, sub }) {
  return (
    <div style={{ padding: '40px 28px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.c.a100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon name="lock" size={32} color={T.c.a700} fill={1}/>
      </div>
      <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 6, fontFamily: '"Fraunces", Georgia, serif' }}>{label}</div>
      <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
        {sub || 'Esta seção é só pra membros. Solicite entrada na confraria pra desbloquear.'}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 1 — Home › Aba Eventos › Meus eventos · Próximos
// ════════════════════════════════════════════════════════════════
function PreviewEventosMeus({ go }) {
  return (
    <HomeShell mainTab="eventos">
      <Segmented value="meus" items={[
        { v: 'meus', l: 'Meus eventos' },
        { v: 'descobrir', l: 'Descobrir eventos' },
      ]}/>
      <StatusChips value="proximos" items={[
        { v: 'proximos', l: 'Próximos' },
        { v: 'andamento', l: 'Andamento' },
        { v: 'finalizados', l: 'Finalizados' },
      ]}/>
      <div style={{ padding: '0 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>Ordem: mais cedo primeiro · 3 eventos</span>
      </div>
      <EventCardPrev scope="meus" ev={{
        title: 'Degustação de Malbecs', date: 'Sáb 23 mai · 19h30', place: 'Bar do Vinho · Asa Sul',
        from: '#722F37', to: '#4A1F24', icon: 'wine_bar', status: 'andamento',
      }}/>
      <EventCardPrev scope="meus" ev={{
        title: 'Tintos do Mundo — rodada 1', date: 'Dom 24 mai · 18h00', place: 'Casa da Carla · Lago Sul',
        from: '#8E3B47', to: '#3F1A1E', icon: 'local_bar',
      }}/>
      <EventCardPrev scope="meus" ev={{
        title: 'Churrasco harmonizado', date: 'Sáb 30 mai · 13h00', place: 'Quintal do Diego',
        from: '#A65A3A', to: '#4A1F24', icon: 'restaurant',
      }}/>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 2 — Home › Aba Eventos › Descobrir eventos · Próximos
// ════════════════════════════════════════════════════════════════
function PreviewEventosDescobrir({ go }) {
  return (
    <HomeShell mainTab="eventos">
      <Segmented value="descobrir" items={[
        { v: 'meus', l: 'Meus eventos' },
        { v: 'descobrir', l: 'Descobrir eventos' },
      ]}/>
      {/* Em "Descobrir" NÃO mostra Finalizados */}
      <StatusChips value="proximos" items={[
        { v: 'proximos', l: 'Próximos' },
        { v: 'andamento', l: 'Andamento' },
      ]}/>
      <div style={{ padding: '0 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>Ordem: mais cedo primeiro · 3 eventos</span>
        <span style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700 }}>Perto de mim ▾</span>
      </div>
      <EventCardPrev scope="descobrir" ev={{
        title: 'Espumantes às cegas', date: 'Sex 22 mai · 20h00', place: 'Brasília, DF',
        confraria: 'Espumantes & Cia', from: '#E2B86B', to: '#B8894A', icon: 'celebration',
      }}/>
      <EventCardPrev scope="descobrir" ev={{
        title: 'Vinho Verde no Lago', date: 'Sáb 23 mai · 16h00', place: 'Lago Norte, Brasília',
        confraria: 'Douro & Cia (privada 🔒)', from: '#5C7A3A', to: '#2E4A22', icon: 'tour',
      }}/>
      <EventCardPrev scope="descobrir" ev={{
        title: 'Wine & Netflix night', date: 'Sáb 23 mai · 21h30', place: 'Online',
        confraria: 'Vinhos de Garagem', from: '#4A3550', to: '#1C1620', icon: 'nightlife',
      }}/>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 3 — Home › Aba Eventos › Descobrir › Empty
// ════════════════════════════════════════════════════════════════
function PreviewEventosDescobrirEmpty({ go }) {
  return (
    <HomeShell mainTab="eventos">
      <Segmented value="descobrir" items={[
        { v: 'meus', l: 'Meus eventos' },
        { v: 'descobrir', l: 'Descobrir eventos' },
      ]}/>
      <StatusChips value="proximos" items={[
        { v: 'proximos', l: 'Próximos' },
        { v: 'andamento', l: 'Andamento' },
      ]}/>
      <div style={{ padding: '40px 28px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.c.n100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name="event_busy" size={36} color={T.c.n400}/>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 6, fontFamily: '"Fraunces", Georgia, serif' }}>
          Ainda não tem evento perto de você
        </div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 20, maxWidth: 280, margin: '0 auto 20px' }}>
          Crie uma confraria e seja o primeiro a marcar um encontro na sua região.
        </div>
        <Button variant="primary" size="md" leading={<Icon name="add" size={16}/>}>
          Criar uma confraria
        </Button>
      </div>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 4 — Confraria PÚBLICA (não-membro, sem cadeado)
// ════════════════════════════════════════════════════════════════
function PreviewConfrariaPublica({ go }) {
  return (
    <ConfrariaDetalheShell
      confraria={{ name: 'Brindar em Brasília', members: 84, location: 'Brasília, DF' }}
      activeTab="eventos" isPrivate={false} isMember={false} onBack={() => go && go('back')}>
      <div style={{ padding: '12px 16px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...T.t.overline, color: T.c.n600 }}>PRÓXIMOS · 2</span>
        <span style={{ ...T.t.caption, color: T.c.s700, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="public" size={12} color={T.c.s700}/> Visível pra qualquer um
        </span>
      </div>
      <EventCardPrev ev={{
        title: 'Degustação de Malbecs', date: 'Sáb 23 mai · 19h30', place: 'Bar do Vinho · Asa Sul',
        from: '#722F37', to: '#4A1F24', icon: 'wine_bar',
      }}/>
      <EventCardPrev ev={{
        title: 'Tintos do Mundo — rodada 2', date: 'Sáb 30 mai · 19h00', place: 'Casa da Carla',
        from: '#8E3B47', to: '#3F1A1E', icon: 'local_bar',
      }}/>
      <div style={{ padding: '8px 16px 0' }}>
        <span style={{ ...T.t.overline, color: T.c.n600 }}>PASSADOS · 7</span>
      </div>
      <EventCardPrev ev={{
        title: 'Degustação às cegas — Carmenère', date: 'Sáb 9 mai · 19h30', place: 'Lago Sul',
        from: '#6B4A3A', to: '#3F2A20', icon: 'wine_bar',
      }}/>
      <div style={{ padding: '4px 16px 16px', ...T.t.caption, color: T.c.s700, background: T.c.s100, margin: '4px 16px 16px', borderRadius: T.r.md, padding: '10px 12px', display: 'flex', gap: 8 }}>
        <Icon name="check_circle" size={14} color={T.c.s700} fill={1}/>
        Sem cadeado: pública mostra Publicações, Membros e Adega abertas pra qualquer um.
      </div>
    </ConfrariaDetalheShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 5 — Confraria PRIVADA (não-membro): Eventos aberto, demais com cadeado
// ════════════════════════════════════════════════════════════════
function PreviewConfrariaPrivada({ go }) {
  return (
    <ConfrariaDetalheShell
      confraria={{ name: 'Douro & Cia', members: 47, location: 'Brasília, DF' }}
      activeTab="eventos" isPrivate={true} isMember={false} onBack={() => go && go('back')}>
      <div style={{ padding: '12px 16px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...T.t.overline, color: T.c.n600 }}>PRÓXIMOS · 1</span>
        <span style={{ ...T.t.caption, color: T.c.a700, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="lock" size={12} color={T.c.a700}/> Endereço só após aprovação
        </span>
      </div>
      <EventCardPrev ev={{
        title: 'Vinho Verde no Lago', date: 'Sáb 23 mai · 16h00', place: 'Lago Norte, Brasília', /* região, não endereço */
        from: '#5C7A3A', to: '#2E4A22', icon: 'tour',
      }}/>
      <div style={{ background: T.c.a100, margin: '4px 16px 16px', borderRadius: T.r.md, padding: '10px 12px', display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.a700}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45 }}>
          <strong>Esta é uma confraria privada.</strong> Só a aba Eventos fica visível pra não-membro. Publicações, Membros e Adega coletiva ficam fechadas até o admin aprovar seu pedido.
        </div>
      </div>
      {/* Mostra também como ficaria ao tocar nas 3 abas bloqueadas */}
      <div style={{ ...T.t.overline, color: T.c.n600, padding: '14px 16px 6px' }}>── COMO FICAM AS OUTRAS 3 ABAS ──</div>
      <LockedTab label="Publicações" sub="O feed do mural é só pra membros. Solicite entrada na confraria pra ler."/>
    </ConfrariaDetalheShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 6 — Event detalhe + Modal Participar (PÚBLICA)
// ════════════════════════════════════════════════════════════════
function PreviewModalParticiparPublica({ go }) {
  const modal = (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ width: '100%', background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, animation: 'tcSlideUp 220ms', maxHeight: '88%' }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="public" size={18} color={T.c.s700} fill={1}/>
          </div>
          <div style={{ ...T.t.overline, color: T.c.s700, fontWeight: 700, fontSize: 11 }}>CONFRARIA PÚBLICA</div>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>Participar do evento</div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 14, fontSize: 14 }}>
          Ao confirmar, você participa de <strong>Degustação de Malbecs</strong> e entra na confraria <strong>Brindar em Brasília</strong>.
        </div>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6, fontSize: 11 }}>VOCÊ VAI?</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {[['vou','Vou','check_circle',true],['talvez','Talvez','help',false],['nao','Não vou','cancel',false]].map(([k,l,ic,on]) => (
            <div key={k} style={{
              flex: 1, padding: '10px 4px', borderRadius: T.r.md,
              background: on ? T.c.p50 : T.c.n0,
              border: `1.5px solid ${on ? T.c.p700 : T.c.n200}`,
              color: on ? T.c.p700 : T.c.n800,
              fontFamily: T.font, fontSize: 12, fontWeight: 700,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <Icon name={ic} size={16} color={on ? T.c.p700 : T.c.n600} fill={on ? 1 : 0}/>
              {l}
            </div>
          ))}
        </div>
        <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
          <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4, fontSize: 12 }}>
            Pode sair da confraria depois nas Configurações. Cancelar a presença e sair da confraria são ações separadas.
          </div>
        </div>
        <Button variant="primary" size="md" fullWidth>Confirmar participação</Button>
        <div style={{ height: 6 }}/>
        <Button variant="ghost" size="sm" fullWidth>Cancelar</Button>
      </div>
    </div>
  );
  return <EventDetalheShell event={{
    title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30',
    confraria: 'Brindar em Brasília · Pública',
    from: '#722F37', to: '#4A1F24',
  }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 7 — Event detalhe + Modal Participar (PRIVADA)
// ════════════════════════════════════════════════════════════════
function PreviewModalParticiparPrivada({ go }) {
  const modal = (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ width: '100%', background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, animation: 'tcSlideUp 220ms', maxHeight: '88%' }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.a100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="lock" size={18} color={T.c.a700} fill={1}/>
          </div>
          <div style={{ ...T.t.overline, color: T.c.a700, fontWeight: 700, fontSize: 11 }}>CONFRARIA PRIVADA</div>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>Solicitar para participar</div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 14, fontSize: 14 }}>
          <strong>Douro & Cia</strong> é uma confraria privada. Vamos mandar uma solicitação pro admin pra você participar de <strong>Vinho Verde no Lago</strong> e entrar na confraria. Você é notificado quando aprovar.
        </div>
        <div style={{ background: T.c.n50, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14 }}>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4, fontSize: 11 }}>ENQUANTO ESPERA</div>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5, fontSize: 12 }}>
            · Endereço completo só após aprovação<br/>
            · Lista nominal de confirmados fica oculta até lá<br/>
            · Push quando o admin responder
          </div>
        </div>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 4, fontSize: 12 }}>Mensagem pro admin (opcional)</div>
        <textarea placeholder="Conta rapidinho por que quer entrar..." rows={2} style={{
          width: '100%', padding: '8px 10px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
          fontFamily: T.font, fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 14,
        }}/>
        <Button variant="primary" size="md" fullWidth leading={<Icon name="send" size={16}/>}>Enviar solicitação</Button>
        <div style={{ height: 6 }}/>
        <Button variant="ghost" size="sm" fullWidth>Cancelar</Button>
      </div>
    </div>
  );
  return <EventDetalheShell event={{
    title: 'Vinho Verde no Lago', date: 'SÁB 23 MAI · 16h00',
    confraria: 'Douro & Cia · Privada 🔒',
    from: '#5C7A3A', to: '#2E4A22',
  }} modal={modal}/>;
}

Object.assign(window, {
  PreviewEventosMeus, PreviewEventosDescobrir, PreviewEventosDescobrirEmpty,
  PreviewConfrariaPublica, PreviewConfrariaPrivada,
  PreviewModalParticiparPublica, PreviewModalParticiparPrivada,
});

export {
  PreviewConfrariaPrivada, PreviewConfrariaPublica,
  PreviewEventosDescobrir, PreviewEventosDescobrirEmpty, PreviewEventosMeus,
  PreviewModalParticiparPrivada, PreviewModalParticiparPublica,
};
