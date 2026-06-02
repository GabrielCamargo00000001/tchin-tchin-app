/* eslint-disable */
// @ts-nocheck
// PREVIEWS pra Gabriel aprovar antes de virar implementação.
// Pacote completo das mudanças de Confrarias/Eventos + fluxo de pagamento.
// Mantém a constância (aba Confrarias intacta) e adiciona as mudanças onde
// pertinente.
import React from 'react';
import { AppHeader, BottomNav, Button, Chip } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ════════════════════════════════════════════════════════════════
// SHELLS reusáveis (contexto real)
// ════════════════════════════════════════════════════════════════
function HomeShell({ children, mainTab = 'eventos', banner }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <AppHeader notifCount={3}/>
      {banner}
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

function ConfrariaDetalheShell({ confraria, activeTab = 'eventos', isPrivate = false, isMember = false, onBack, children }) {
  const tabs = [
    { id: 'eventos', label: 'Eventos', icon: 'event' },
    { id: 'publicacoes', label: 'Publicações', icon: 'forum' },
    { id: 'membros', label: 'Membros', icon: 'group' },
    { id: 'adega', label: 'Adega', icon: 'wine_bar' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '8px 8px', background: T.c.p700, color: T.c.n0, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', color: T.c.n0 }}>
          <Icon name="arrow_back" size={22} color={T.c.n0}/>
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>{confraria.name}</div>
        <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="more_vert" size={22} color={T.c.n0}/>
        </button>
      </header>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ height: 140, background: `linear-gradient(135deg, ${T.c.p900}, ${T.c.p500})`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
        </div>
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
        <div>{children}</div>
      </div>
    </div>
  );
}

// EventDetalheShell — hero do evento + body com banner contextual + opcional modal sheet
function EventDetalheShell({ event, paymentBanner, body, modal }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden', position: 'relative' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '8px 8px', background: T.c.n0, flexShrink: 0 }}>
        <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="arrow_back" size={22} color={T.c.n950}/>
        </button>
        <div style={{ flex: 1 }}/>
        <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="more_vert" size={22} color={T.c.n950}/>
        </button>
      </header>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ height: 160, background: `linear-gradient(135deg, ${event.from}, ${event.to})`, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.32)', color: '#fff', borderRadius: T.r.full, fontSize: 11, fontWeight: 700 }}>📅 {event.date}</span>
            <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.32)', color: '#fff', borderRadius: T.r.full, fontSize: 11, fontWeight: 700 }}>🏛️ Presencial</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 4 }}>{event.title}</div>
          <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 12 }}>{event.confraria}</div>
          {event.price != null && (
            <div style={{ ...T.t.body, color: T.c.n800, marginBottom: 12, padding: '8px 12px', background: T.c.n50, borderRadius: T.r.md, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="payments" size={16} color={T.c.n800}/>
              <strong>R$ {event.price.toFixed(2)}</strong> por pessoa
            </div>
          )}
          {paymentBanner}
          {body}
        </div>
      </div>
      {modal}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Helpers visuais (cards, sheets, chips, banner)
// ────────────────────────────────────────────────────────────
function Sheet({ children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ width: '100%', background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, animation: 'tcSlideUp 220ms', maxHeight: '92%' }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 14px' }}/>
        {children}
      </div>
    </div>
  );
}
function PaymentBanner({ kind, label, sub, ctaLabel }) {
  const map = {
    pix:    { bg: T.c.w100, fg: T.c.w700, ic: 'schedule',     border: T.c.w700 },
    admin:  { bg: T.c.i100, fg: T.c.i700, ic: 'hourglass_top',border: T.c.i700 },
    pago:   { bg: T.c.s100, fg: T.c.s700, ic: 'check_circle', border: T.c.s700 },
    expir:  { bg: T.c.e100, fg: T.c.e700, ic: 'error',        border: T.c.e700 },
  };
  const m = map[kind] || map.pix;
  return (
    <div style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: T.r.md, padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Icon name={m.ic} size={20} color={m.fg} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: m.fg, fontSize: 14, marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4 }}>{sub}</div>}
        {ctaLabel && (
          <button style={{ marginTop: 8, padding: '6px 12px', background: m.fg, color: T.c.n0, border: 'none', borderRadius: T.r.full, cursor: 'pointer', fontFamily: T.font, fontSize: 12, fontWeight: 700 }}>{ctaLabel}</button>
        )}
      </div>
    </div>
  );
}
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
    <div style={{ background: T.c.n0, borderRadius: T.r.lg, margin: '0 16px 12px', overflow: 'hidden', border: `1px solid ${T.c.n200}` }}>
      <div style={{ height: 80, background: `linear-gradient(135deg, ${ev.from}, ${ev.to})`, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 10 }}>
        <Icon name={ev.icon || 'wine_bar'} size={22} color="#FFFFFF" fill={1} style={{ opacity: 0.85 }}/>
        {ev.status === 'andamento' && (
          <span style={{ position: 'absolute', top: 8, right: 8, padding: '3px 10px', background: '#2E7D32', color: '#fff', borderRadius: T.r.full, fontSize: 10.5, fontWeight: 800 }}>Acontecendo agora</span>
        )}
      </div>
      <div style={{ padding: '10px 14px 12px' }}>
        {scope === 'descobrir' && (
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            <Icon name="groups" size={11} color={T.c.n600}/> Origem · {ev.confraria}
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
function MockConfrariaCard({ name, desc, members, activity, location, badges = [] }) {
  const act = { 'muito-ativa': { e: '🔥', bg: '#FFEDD5', fg: '#C2410C', l: 'Muito ativa' }, 'ativa': { e: '⚡', bg: '#FEF3C7', fg: '#A16207', l: 'Ativa' } }[activity] || { e: '💤', bg: '#E5E7EB', fg: '#4B5563', l: 'Pouco ativa' };
  return (
    <div style={{ background: T.c.n0, borderRadius: T.r.lg, padding: 14, border: `1px solid ${T.c.n200}` }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 16 }}>
          {name.split(' ').filter(Boolean).map(s => s[0]).slice(0,2).join('')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 15 }}>{name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 3 }}>
            <span style={{ ...T.t.caption, padding: '2px 7px', borderRadius: T.r.full, background: act.bg, color: act.fg, fontWeight: 700, fontSize: 10.5 }}>{act.e} {act.l}</span>
            <span style={{ ...T.t.caption, color: T.c.n600, fontSize: 11 }}>👥 {members}</span>
            <span style={{ ...T.t.caption, color: T.c.n600, fontSize: 11 }}>📍 {location}</span>
            {badges.map((b, i) => (
              <span key={i} style={{ ...T.t.caption, padding: '2px 7px', borderRadius: T.r.full, background: b.bg, color: b.fg, fontWeight: 700, fontSize: 10.5 }}>{b.l}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12.5 }}>{desc}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 1 — Home › ABA CONFRARIAS (INTACTA — pra confirmar constância)
// ════════════════════════════════════════════════════════════════
function PreviewHomeConfrarias({ go }) {
  return (
    <HomeShell mainTab="confrarias">
      {/* Busca + filtros */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 8px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md }}>
          <Icon name="search" size={18} color={T.c.n600}/>
          <span style={{ ...T.t.body, color: T.c.n400, fontSize: 14 }}>Buscar confrarias</span>
        </div>
        <div style={{ width: 44, background: T.c.n0, border: `1px solid ${T.c.n300}`, borderRadius: T.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="tune" size={20} color={T.c.n800}/>
        </div>
      </div>
      {/* Criar */}
      <div style={{ padding: '0 16px 8px' }}>
        <Button variant="secondary" size="md" fullWidth leading={<Icon name="add" size={18}/>}>Criar confraria</Button>
      </div>
      {/* Sub-pills */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 16px 8px' }}>
        <div style={{ padding: '7px 14px', borderRadius: T.r.full, background: T.c.p700, color: T.c.n0, fontFamily: T.font, fontSize: 13, fontWeight: 600 }}>Recomendações (6)</div>
        <div style={{ padding: '7px 14px', borderRadius: T.r.full, background: T.c.n0, color: T.c.n800, border: `1px solid ${T.c.n300}`, fontFamily: T.font, fontSize: 13, fontWeight: 600 }}>Suas (2)</div>
      </div>
      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 8px' }}>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>6 resultados</span>
        <span style={{ ...T.t.caption, color: T.c.n800, fontWeight: 600 }}>⇅ Ordenar: Mais ativa</span>
      </div>
      {/* Cards */}
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MockConfrariaCard name="Brindar em Brasília" desc="Encontros mensais no Lago Sul. Foco em tintos sul-americanos e harmonização com cozinha brasileira." members={84} activity="muito-ativa" location="Brasília, DF" badges={[{ l: '✓ Verificada', bg: '#E3F2FD', fg: '#1565C0' }, { l: '📅 Evento esta semana', bg: '#E8F5E9', fg: '#2E7D32' }]}/>
        <MockConfrariaCard name="Vinhos de Garagem" desc="Confraria virtual para pequenos produtores e descobertas fora do óbvio." members={312} activity="muito-ativa" location="Online" badges={[{ l: 'Em alta', bg: '#FFEDD5', fg: '#C2410C' }]}/>
        <MockConfrariaCard name="Tinto na Mesa" desc="Vinho e gastronomia. Cada encontro tem um tema regional." members={126} activity="ativa" location="Brasília, DF"/>
      </div>
      <div style={{ background: T.c.s100, border: `1px solid ${T.c.s700}`, margin: '0 16px 16px', padding: 12, borderRadius: T.r.md, ...T.t.caption, color: T.c.s700 }}>
        ✓ Esta aba <strong>não muda</strong>: busca + filtros + "Criar" + sub-pills Recomendações/Suas + ordenação + lista de CardConfraria — exatamente como hoje.
      </div>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 2 — Aba Eventos · Meus · Próximos
// ════════════════════════════════════════════════════════════════
function PreviewEventosMeus({ go }) {
  return (
    <HomeShell mainTab="eventos">
      <Segmented value="meus" items={[{ v: 'meus', l: 'Meus eventos' }, { v: 'descobrir', l: 'Descobrir eventos' }]}/>
      <StatusChips value="proximos" items={[{ v: 'proximos', l: 'Próximos' }, { v: 'andamento', l: 'Andamento' }, { v: 'finalizados', l: 'Finalizados' }]}/>
      <div style={{ padding: '0 16px 8px' }}>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>Ordem: mais cedo primeiro · 3 eventos</span>
      </div>
      <EventCardPrev ev={{ title: 'Degustação de Malbecs', date: 'Sáb 23 mai · 19h30', place: 'Bar do Vinho · Asa Sul', from: '#722F37', to: '#4A1F24', icon: 'wine_bar', status: 'andamento' }}/>
      <EventCardPrev ev={{ title: 'Tintos do Mundo — rodada 1', date: 'Dom 24 mai · 18h00', place: 'Casa da Carla · Lago Sul', from: '#8E3B47', to: '#3F1A1E', icon: 'local_bar' }}/>
      <EventCardPrev ev={{ title: 'Churrasco harmonizado', date: 'Sáb 30 mai · 13h00', place: 'Quintal do Diego', from: '#A65A3A', to: '#4A1F24', icon: 'restaurant' }}/>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 3 — Aba Eventos · Descobrir · Próximos
// ════════════════════════════════════════════════════════════════
function PreviewEventosDescobrir({ go }) {
  return (
    <HomeShell mainTab="eventos">
      <Segmented value="descobrir" items={[{ v: 'meus', l: 'Meus eventos' }, { v: 'descobrir', l: 'Descobrir eventos' }]}/>
      <StatusChips value="proximos" items={[{ v: 'proximos', l: 'Próximos' }, { v: 'andamento', l: 'Andamento' }]}/>
      <div style={{ padding: '0 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>Ordem: mais cedo primeiro · 3 eventos</span>
        <span style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700 }}>Perto de mim ▾</span>
      </div>
      <EventCardPrev scope="descobrir" ev={{ title: 'Espumantes às cegas', date: 'Sex 22 mai · 20h00', place: 'Brasília, DF', confraria: 'Espumantes & Cia', from: '#E2B86B', to: '#B8894A', icon: 'celebration' }}/>
      <EventCardPrev scope="descobrir" ev={{ title: 'Vinho Verde no Lago', date: 'Sáb 23 mai · 16h00', place: 'Lago Norte, Brasília', confraria: 'Douro & Cia (privada 🔒)', from: '#5C7A3A', to: '#2E4A22', icon: 'tour' }}/>
      <EventCardPrev scope="descobrir" ev={{ title: 'Wine & Netflix night', date: 'Sáb 23 mai · 21h30', place: 'Online', confraria: 'Vinhos de Garagem', from: '#4A3550', to: '#1C1620', icon: 'nightlife' }}/>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 4 — Aba Eventos · Descobrir · Empty
// ════════════════════════════════════════════════════════════════
function PreviewEventosDescobrirEmpty({ go }) {
  return (
    <HomeShell mainTab="eventos">
      <Segmented value="descobrir" items={[{ v: 'meus', l: 'Meus eventos' }, { v: 'descobrir', l: 'Descobrir eventos' }]}/>
      <StatusChips value="proximos" items={[{ v: 'proximos', l: 'Próximos' }, { v: 'andamento', l: 'Andamento' }]}/>
      <div style={{ padding: '40px 28px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.c.n100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name="event_busy" size={36} color={T.c.n400}/>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 6, fontFamily: '"Fraunces", Georgia, serif' }}>Ainda não tem evento perto de você</div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 20, maxWidth: 280, margin: '0 auto 20px' }}>Crie uma confraria e seja o primeiro a marcar um encontro na sua região.</div>
        <Button variant="primary" size="md" leading={<Icon name="add" size={16}/>}>Criar uma confraria</Button>
      </div>
    </HomeShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 5 — Confraria PÚBLICA (não-membro, sem cadeado)
// ════════════════════════════════════════════════════════════════
function PreviewConfrariaPublica({ go }) {
  return (
    <ConfrariaDetalheShell confraria={{ name: 'Brindar em Brasília', members: 84, location: 'Brasília, DF' }} activeTab="eventos" isPrivate={false} isMember={false} onBack={() => go && go('back')}>
      <div style={{ padding: '12px 16px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...T.t.overline, color: T.c.n600 }}>PRÓXIMOS · 2</span>
        <span style={{ ...T.t.caption, color: T.c.s700, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="public" size={12} color={T.c.s700}/> Visível pra qualquer um
        </span>
      </div>
      <EventCardPrev ev={{ title: 'Degustação de Malbecs', date: 'Sáb 23 mai · 19h30', place: 'Bar do Vinho · Asa Sul', from: '#722F37', to: '#4A1F24', icon: 'wine_bar' }}/>
      <EventCardPrev ev={{ title: 'Tintos do Mundo — rodada 2', date: 'Sáb 30 mai · 19h00', place: 'Casa da Carla', from: '#8E3B47', to: '#3F1A1E', icon: 'local_bar' }}/>
      <div style={{ background: T.c.s100, margin: '4px 16px 16px', borderRadius: T.r.md, padding: '10px 12px', display: 'flex', gap: 8 }}>
        <Icon name="check_circle" size={14} color={T.c.s700} fill={1}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45 }}>Sem cadeado: pública mostra Publicações, Membros e Adega abertas pra qualquer um.</div>
      </div>
    </ConfrariaDetalheShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 6 — Confraria PRIVADA (não-membro)
// ════════════════════════════════════════════════════════════════
function PreviewConfrariaPrivada({ go }) {
  return (
    <ConfrariaDetalheShell confraria={{ name: 'Douro & Cia', members: 47, location: 'Brasília, DF' }} activeTab="eventos" isPrivate={true} isMember={false} onBack={() => go && go('back')}>
      <div style={{ padding: '12px 16px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...T.t.overline, color: T.c.n600 }}>PRÓXIMOS · 1</span>
        <span style={{ ...T.t.caption, color: T.c.a700, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="lock" size={12} color={T.c.a700}/> Endereço só após aprovação
        </span>
      </div>
      <EventCardPrev ev={{ title: 'Vinho Verde no Lago', date: 'Sáb 23 mai · 16h00', place: 'Lago Norte, Brasília', from: '#5C7A3A', to: '#2E4A22', icon: 'tour' }}/>
      <div style={{ background: T.c.a100, margin: '4px 16px 16px', borderRadius: T.r.md, padding: '10px 12px', display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.a700}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45 }}>
          <strong>Esta é uma confraria privada.</strong> Só Eventos visível pra não-membro. Publicações/Membros/Adega ficam fechadas até o admin aprovar.
        </div>
      </div>
      <div style={{ ...T.t.overline, color: T.c.n600, padding: '14px 16px 6px' }}>── EXEMPLO: PUBLICAÇÕES (NÃO-MEMBRO) ──</div>
      <LockedTab label="Publicações" sub="O feed do mural é só pra membros. Solicite entrada na confraria pra ler."/>
    </ConfrariaDetalheShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 7 — Modal Participar (Pública · GRATUITO)
// ════════════════════════════════════════════════════════════════
function PreviewModalPublicaGratuito({ go }) {
  const modal = (
    <Sheet>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="public" size={18} color={T.c.s700} fill={1}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.s700, fontWeight: 700, fontSize: 11 }}>CONFRARIA PÚBLICA · GRATUITO</div>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>Participar do evento</div>
      <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 14, fontSize: 14 }}>
        Ao confirmar, você participa de <strong>Degustação de Malbecs</strong> e entra na confraria <strong>Brindar em Brasília</strong>.
      </div>
      <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6, fontSize: 11 }}>VOCÊ VAI?</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[['vou','Vou','check_circle',true],['talvez','Talvez','help',false],['nao','Não vou','cancel',false]].map(([k,l,ic,on]) => (
          <div key={k} style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: on ? T.c.p50 : T.c.n0, border: `1.5px solid ${on ? T.c.p700 : T.c.n200}`, color: on ? T.c.p700 : T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Icon name={ic} size={16} color={on ? T.c.p700 : T.c.n600} fill={on ? 1 : 0}/>{l}
          </div>
        ))}
      </div>
      <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4, fontSize: 12 }}>Cancelar a presença e sair da confraria são ações separadas.</div>
      </div>
      <Button variant="primary" size="md" fullWidth>Confirmar participação</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Cancelar</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24' }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 8 — Modal Participar (Pública · PAGO) 🆕
// ════════════════════════════════════════════════════════════════
function PreviewModalPublicaPago({ go }) {
  const modal = (
    <Sheet>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="public" size={18} color={T.c.s700} fill={1}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.s700, fontWeight: 700, fontSize: 11 }}>CONFRARIA PÚBLICA · PAGO</div>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>Participar do evento</div>
      <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 10, fontSize: 14 }}>
        Ao confirmar, você participa de <strong>Degustação de Malbecs</strong> e entra na confraria <strong>Brindar em Brasília</strong>.
      </div>
      <div style={{ padding: '12px 14px', background: T.c.a100, border: `1px solid ${T.c.a700}`, borderRadius: T.r.md, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="payments" size={18} color={T.c.a700}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14 }}>Evento pago · R$ 80,00 por pessoa</div>
          <div style={{ ...T.t.caption, color: T.c.n800, fontSize: 11.5 }}>Escolha como pagar no próximo passo. Vaga reservada por 2h enquanto você decide.</div>
        </div>
      </div>
      <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6, fontSize: 11 }}>VOCÊ VAI? <span style={{ color: T.c.n400, fontWeight: 400 }}>(sem "Talvez" em evento pago)</span></div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <div style={{ flex: 2, padding: '10px 4px', borderRadius: T.r.md, background: T.c.p50, border: `1.5px solid ${T.c.p700}`, color: T.c.p700, fontFamily: T.font, fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Icon name="check_circle" size={16} color={T.c.p700} fill={1}/>Vou (+ R$ 80,00)
        </div>
        <div style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: T.c.n0, border: `1.5px solid ${T.c.n200}`, color: T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Icon name="cancel" size={16} color={T.c.n600}/>Não vou
        </div>
      </div>
      <Button variant="primary" size="md" fullWidth trailing={<Icon name="arrow_forward" size={16}/>}>Confirmar e escolher pagamento</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Cancelar</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 9 — Modal Participar (Privada · paga ou grátis)
// ════════════════════════════════════════════════════════════════
function PreviewModalPrivada({ go }) {
  const modal = (
    <Sheet>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.a100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={18} color={T.c.a700} fill={1}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.a700, fontWeight: 700, fontSize: 11 }}>CONFRARIA PRIVADA</div>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>Solicitar para participar</div>
      <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 12, fontSize: 14 }}>
        <strong>Douro & Cia</strong> é privada. Vamos mandar uma solicitação pro admin pra você participar de <strong>Vinho Verde no Lago</strong> e entrar na confraria. Você é notificado quando aprovar.
      </div>
      <div style={{ background: T.c.n50, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4, fontSize: 11 }}>ENQUANTO ESPERA</div>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5, fontSize: 12 }}>· Endereço completo só após aprovação<br/>· Lista nominal de confirmados fica oculta<br/>· Push quando o admin responder</div>
      </div>
      <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12, display: 'flex', gap: 8 }}>
        <Icon name="payments" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>Se o evento for pago (R$ 80), o pagamento só rola <strong>depois que o admin aprovar</strong>. A gente nunca cobra antes da aprovação.</div>
      </div>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 4, fontSize: 12 }}>Mensagem pro admin (opcional)</div>
      <textarea placeholder="Conta rapidinho por que quer entrar..." rows={2} style={{ width: '100%', padding: '8px 10px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md, fontFamily: T.font, fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}/>
      <Button variant="primary" size="md" fullWidth leading={<Icon name="send" size={16}/>}>Enviar solicitação</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Cancelar</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Vinho Verde no Lago', date: 'SÁB 23 MAI · 16h00', confraria: 'Douro & Cia · Privada 🔒', from: '#5C7A3A', to: '#2E4A22', price: 80 }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 10 — Sheet Escolher método 🆕
// ════════════════════════════════════════════════════════════════
function PreviewSheetMetodo({ go }) {
  const modal = (
    <Sheet>
      <div style={{ ...T.t.overline, color: T.c.p700, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>2/2 · PAGAMENTO</div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 4 }}>Como você quer pagar?</div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16, fontSize: 13.5 }}>R$ 80,00 por pessoa · vaga reservada por 2h</div>
      {/* Opção LACI (recomendada) */}
      <div style={{ border: `2px solid ${T.c.p700}`, background: T.c.p50, borderRadius: T.r.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: T.c.p700, color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="bolt" size={20} color={T.c.n0} fill={1}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14 }}>Pagar agora via LACI</div>
              <span style={{ padding: '2px 7px', background: T.c.p700, color: T.c.n0, borderRadius: T.r.full, fontSize: 10, fontWeight: 800 }}>RECOMENDADO</span>
            </div>
            <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, marginTop: 3, fontSize: 12 }}>PIX instantâneo · confirmação automática · vaga garantida na hora</div>
          </div>
          <Icon name="radio_button_checked" size={20} color={T.c.p700}/>
        </div>
      </div>
      {/* Opção Pagar fora */}
      <div style={{ border: `1.5px solid ${T.c.n300}`, background: T.c.n0, borderRadius: T.r.lg, padding: 14, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="handshake" size={20} color={T.c.n800}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14 }}>Combinar com o admin</div>
            <div style={{ ...T.t.caption, color: T.c.n600, lineHeight: 1.45, marginTop: 3, fontSize: 12 }}>PIX em outra conta · dinheiro no local · etc. <strong>O admin marca como pago</strong> quando receber.</div>
          </div>
          <Icon name="radio_button_unchecked" size={20} color={T.c.n400}/>
        </div>
      </div>
      <Button variant="primary" size="md" fullWidth trailing={<Icon name="arrow_forward" size={16}/>}>Continuar com LACI</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Voltar</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 11 — Sheet PIX LACI (aguardando) 🆕
// ════════════════════════════════════════════════════════════════
function PreviewSheetPixAguardando({ go }) {
  const modal = (
    <Sheet>
      <div style={{ ...T.t.overline, color: T.c.p700, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>LACI · PAGUE COM PIX</div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 12 }}>R$ 80,00</div>
      {/* QR code mock */}
      <div style={{ background: T.c.n0, border: `2px dashed ${T.c.n300}`, borderRadius: T.r.lg, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 180, height: 180, background: '#000', backgroundImage: 'repeating-conic-gradient(#000 0 90deg, #fff 0 180deg)', backgroundSize: '14px 14px', borderRadius: 6 }}/>
      </div>
      <div style={{ background: T.c.n50, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="content_copy" size={16} color={T.c.p700}/>
        <div style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.c.n800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>00020126...laci.app/p/abc123def</div>
        <span style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700, fontSize: 11 }}>Copiar</span>
      </div>
      {/* Status pulsando */}
      <div style={{ background: T.c.w100, border: `1px solid ${T.c.w700}`, borderRadius: T.r.md, padding: '12px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: T.c.w700, animation: 'tcBreath 1.4s ease-in-out infinite' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.bodyB, color: T.c.w700, fontSize: 13 }}>Aguardando seu pagamento…</div>
          <div style={{ ...T.t.caption, color: T.c.n800, fontSize: 11.5 }}>Expira em <strong style={{ fontFamily: T.mono }}>29:45</strong></div>
        </div>
      </div>
      <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12, display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4, fontSize: 12 }}>Pode fechar essa tela — a gente te avisa por push e no app assim que o PIX cair.</div>
      </div>
      <Button variant="secondary" size="md" fullWidth>Já paguei, fechar</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Cancelar pagamento</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 12 — Sheet PIX LACI (confirmado) 🆕
// ════════════════════════════════════════════════════════════════
function PreviewSheetPixConfirmado({ go }) {
  const modal = (
    <Sheet>
      <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: T.c.s100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, animation: 'tcDrawIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
          <Icon name="check_circle" size={56} color={T.c.s700} fill={1}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.s700, marginBottom: 4, letterSpacing: 1.4 }}>PAGAMENTO CONFIRMADO</div>
        <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 8 }}>Sua vaga está garantida</div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 18, fontSize: 14 }}>
          <strong>R$ 80,00</strong> recebidos via LACI · vaga em <strong>Degustação de Malbecs</strong> consolidada.
        </div>
      </div>
      <div style={{ background: T.c.s100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
        <Icon name="check" size={14} color={T.c.s700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>Endereço completo + lista de confirmados liberados. Adicionamos no seu calendário e mandamos lembretes (D-7 / D-1 / 2h antes).</div>
      </div>
      <Button variant="primary" size="md" fullWidth>Ver o evento</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Adicionar ao calendário</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 13 — Sheet Pagar Fora 🆕
// ════════════════════════════════════════════════════════════════
function PreviewSheetPagarFora({ go }) {
  const modal = (
    <Sheet>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="handshake" size={18} color={T.c.n800}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.n800, fontWeight: 700, fontSize: 11 }}>COMBINAR COM O ADMIN</div>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 12 }}>Como pagar</div>
      <div style={{ background: T.c.n50, borderRadius: T.r.md, padding: 14, marginBottom: 14 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8, fontSize: 11 }}>INSTRUÇÕES DA CARLA (ADMIN)</div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.55, fontSize: 13.5 }}>
          "PIX pra <strong style={{ fontFamily: T.mono }}>carla.mendes@gmail.com</strong> com seu nome no recibo — ou paga em dinheiro no local na chegada. R$ 80,00."
        </div>
      </div>
      <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>
          Sua vaga é <strong>provisória</strong> até o admin marcar como pago. Você tem até <strong>24h antes</strong> do evento pra pagar — depois disso, a vaga pode liberar.
        </div>
      </div>
      <div style={{ background: T.c.w100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
        <Icon name="notifications_active" size={14} color={T.c.w700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>Te avisamos quando a Carla marcar seu pagamento.</div>
      </div>
      <Button variant="primary" size="md" fullWidth>Combinado, fechar</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth>Voltar (usar LACI)</Button>
    </Sheet>
  );
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} modal={modal}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 14-17 — event-detalhe com cada estado de pagamento 🆕
// ════════════════════════════════════════════════════════════════
function rsvpBody() {
  return (
    <>
      <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6 }}>VOCÊ VAI?</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <div style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: T.c.p50, border: `1.5px solid ${T.c.p700}`, color: T.c.p700, fontFamily: T.font, fontSize: 12, fontWeight: 700, textAlign: 'center' }}>✓ Vou</div>
        <div style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: T.c.n0, border: `1.5px solid ${T.c.n300}`, color: T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>Não vou</div>
      </div>
      <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6 }}>VINHOS DO ENCONTRO</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 60, borderRadius: T.r.md, background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="wine_bar" size={20} color="#fff"/>
          </div>
        ))}
      </div>
    </>
  );
}
function PreviewEventAguardandoPix({ go }) {
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} paymentBanner={<PaymentBanner kind="pix" label="Aguardando seu PIX via LACI" sub="Expira em 24min — quando cair, sua vaga é consolidada automaticamente." ctaLabel="Abrir PIX"/>} body={rsvpBody()}/>;
}
function PreviewEventAguardandoAdmin({ go }) {
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} paymentBanner={<PaymentBanner kind="admin" label="Aguardando confirmação do admin" sub="Você combinou pagar por fora. Quando a Carla marcar como pago, te avisamos. Prazo: até 24h antes do evento." ctaLabel="Ver instruções"/>} body={rsvpBody()}/>;
}
function PreviewEventPago({ go }) {
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} paymentBanner={<PaymentBanner kind="pago" label="✓ Pagamento confirmado · vaga garantida" sub="R$ 80,00 recebidos. Endereço completo + lista de confirmados liberados. Lembretes ativados (D-7, D-1, 2h)."/>} body={rsvpBody()}/>;
}
function PreviewEventExpirado({ go }) {
  return <EventDetalheShell event={{ title: 'Degustação de Malbecs', date: 'SÁB 23 MAI · 19h30', confraria: 'Brindar em Brasília · Pública', from: '#722F37', to: '#4A1F24', price: 80 }} paymentBanner={<PaymentBanner kind="expir" label="Pagamento não recebido" sub="Seu PIX expirou e a vaga foi pra lista de espera. Pague agora pra voltar — se não houver vaga, você entra na fila." ctaLabel="Pagar agora"/>} body={rsvpBody()}/>;
}

// ════════════════════════════════════════════════════════════════
// PREVIEW 18 — Banner ao reabrir o app 🆕
// ════════════════════════════════════════════════════════════════
function PreviewBannerConfirmado({ go }) {
  const banner = (
    <div style={{ background: T.c.s100, borderBottom: `1px solid ${T.c.s700}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, animation: 'tcSlideDownIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
      <Icon name="check_circle" size={22} color={T.c.s700} fill={1} style={{ flexShrink: 0 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: T.c.s700, fontSize: 13.5 }}>✓ Pagamento de Degustação de Malbecs confirmado</div>
        <div style={{ ...T.t.caption, color: T.c.n800, fontSize: 11.5 }}>Vaga garantida · toque pra ver o evento</div>
      </div>
      <Icon name="chevron_right" size={20} color={T.c.s700}/>
    </div>
  );
  return (
    <HomeShell mainTab="eventos" banner={banner}>
      <Segmented value="meus" items={[{ v: 'meus', l: 'Meus eventos' }, { v: 'descobrir', l: 'Descobrir eventos' }]}/>
      <StatusChips value="proximos" items={[{ v: 'proximos', l: 'Próximos' }, { v: 'andamento', l: 'Andamento' }, { v: 'finalizados', l: 'Finalizados' }]}/>
      <EventCardPrev ev={{ title: 'Degustação de Malbecs', date: 'Sáb 23 mai · 19h30', place: 'Bar do Vinho · Asa Sul', from: '#722F37', to: '#4A1F24', icon: 'wine_bar' }}/>
      <EventCardPrev ev={{ title: 'Tintos do Mundo — rodada 1', date: 'Dom 24 mai · 18h00', place: 'Casa da Carla · Lago Sul', from: '#8E3B47', to: '#3F1A1E', icon: 'local_bar' }}/>
    </HomeShell>
  );
}

Object.assign(window, {
  PreviewHomeConfrarias, PreviewEventosMeus, PreviewEventosDescobrir, PreviewEventosDescobrirEmpty,
  PreviewConfrariaPublica, PreviewConfrariaPrivada,
  PreviewModalPublicaGratuito, PreviewModalPublicaPago, PreviewModalPrivada,
  PreviewSheetMetodo, PreviewSheetPixAguardando, PreviewSheetPixConfirmado, PreviewSheetPagarFora,
  PreviewEventAguardandoPix, PreviewEventAguardandoAdmin, PreviewEventPago, PreviewEventExpirado,
  PreviewBannerConfirmado,
});

export {
  PreviewBannerConfirmado, PreviewConfrariaPrivada, PreviewConfrariaPublica,
  PreviewEventAguardandoAdmin, PreviewEventAguardandoPix, PreviewEventExpirado, PreviewEventPago,
  PreviewEventosDescobrir, PreviewEventosDescobrirEmpty, PreviewEventosMeus,
  PreviewHomeConfrarias, PreviewModalPrivada, PreviewModalPublicaGratuito, PreviewModalPublicaPago,
  PreviewSheetMetodo, PreviewSheetPagarFora, PreviewSheetPixAguardando, PreviewSheetPixConfirmado,
};
