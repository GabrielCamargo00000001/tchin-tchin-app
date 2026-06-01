/* eslint-disable */
// @ts-nocheck
// PREVIEWS pra Gabriel aprovar — não é a implementação final.
// Mostram a nova estrutura da aba Eventos (escopo + status), os cards de
// Descobrir (com confraria de origem) e os 2 modais de Participar (pública vs
// privada). Após aprovação, vira a implementação real.
import React from 'react';
import { Button } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─── Shell mínimo (header + body scroll) ─────────────────────
function PrevShell({ title, onBack, sub, children, sheet }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden', position: 'relative' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', borderBottom: `1px solid ${T.c.n100}`, background: T.c.n0, flexShrink: 0 }}>
        {onBack && (
          <button onClick={onBack} aria-label="Voltar" style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow_back" size={22} color={T.c.n950}/>
          </button>
        )}
        <div style={{ flex: 1, paddingLeft: onBack ? 0 : 6 }}>
          <div style={{ ...T.t.h3, color: T.c.n950, fontSize: 17, fontWeight: 700 }}>{title}</div>
          {sub && <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 1 }}>{sub}</div>}
        </div>
      </header>
      <div style={{ flex: 1, overflowY: 'auto', background: T.c.n50 }}>{children}</div>
      {sheet}
    </div>
  );
}

// ─── Segmented control (escopo: Meus / Descobrir) ─────────────
function Segmented({ items, value, onChange }) {
  return (
    <div style={{ display: 'flex', padding: 4, background: T.c.n100, borderRadius: T.r.full, margin: 12 }}>
      {items.map(it => (
        <button key={it.v} onClick={() => onChange(it.v)} style={{
          flex: 1, padding: '10px 12px', borderRadius: T.r.full, border: 'none', cursor: 'pointer',
          background: value === it.v ? T.c.n0 : 'transparent',
          color: value === it.v ? T.c.n950 : T.c.n600,
          fontFamily: T.font, fontSize: 13, fontWeight: 700,
          boxShadow: value === it.v ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
          transition: 'all 140ms',
        }}>{it.l}</button>
      ))}
    </div>
  );
}

// ─── Status chips ─────────────────────────────────────────────
function StatusChips({ items, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 12px 8px', overflowX: 'auto' }}>
      {items.map(it => (
        <button key={it.v} onClick={() => onChange(it.v)} style={{
          flexShrink: 0, padding: '8px 14px', borderRadius: T.r.full, cursor: 'pointer',
          background: value === it.v ? T.c.p700 : T.c.n0,
          color: value === it.v ? T.c.n0 : T.c.n800,
          border: `1.5px solid ${value === it.v ? T.c.p700 : T.c.n200}`,
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
        }}>{it.l}</button>
      ))}
    </div>
  );
}

// ─── Event card (versão Meus eventos / Descobrir) ─────────────
function EventCardPrev({ ev, scope }) {
  return (
    <div style={{
      background: T.c.n0, borderRadius: T.r.lg, margin: '0 12px 12px',
      overflow: 'hidden', border: `1px solid ${T.c.n200}`,
    }}>
      {/* Capa */}
      <div style={{
        height: 92, background: `linear-gradient(135deg, ${ev.from || T.c.p700}, ${ev.to || T.c.p900})`,
        position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 10,
      }}>
        <Icon name={ev.icon || 'wine_bar'} size={24} color="#FFFFFF" fill={1} style={{ opacity: 0.85 }}/>
        {ev.status === 'andamento' && (
          <span style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', background: '#2E7D32', color: '#fff', borderRadius: T.r.full, fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>
            Acontecendo agora
          </span>
        )}
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        {scope === 'descobrir' && (
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="groups" size={12} color={T.c.n600}/>
            Origem · {ev.confraria}
          </div>
        )}
        <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 15, marginBottom: 4 }}>{ev.title}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <Icon name="schedule" size={13} color={T.c.n600}/> {ev.date}
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="place" size={13} color={T.c.n600}/> {ev.place}
        </div>
      </div>
    </div>
  );
}

// ═══ PREVIEW 1 — Aba Eventos / Meus / Próximos ════════════════
function PreviewEventosMeus({ go }) {
  return (
    <PrevShell title="Eventos" sub="Meus eventos · Próximos" onBack={() => go('back')}>
      <Segmented value="meus" onChange={() => {}} items={[
        { v: 'meus', l: 'Meus eventos' },
        { v: 'descobrir', l: 'Descobrir eventos' },
      ]}/>
      <StatusChips value="proximos" onChange={() => {}} items={[
        { v: 'proximos', l: 'Próximos' },
        { v: 'andamento', l: 'Andamento' },
        { v: 'finalizados', l: 'Finalizados' },
      ]}/>
      <div>
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
      </div>
    </PrevShell>
  );
}

// ═══ PREVIEW 2 — Aba Eventos / Descobrir / Próximos ════════════
function PreviewEventosDescobrir({ go }) {
  return (
    <PrevShell title="Eventos" sub="Descobrir eventos · Próximos" onBack={() => go('back')}>
      <Segmented value="descobrir" onChange={() => {}} items={[
        { v: 'meus', l: 'Meus eventos' },
        { v: 'descobrir', l: 'Descobrir eventos' },
      ]}/>
      {/* Em "Descobrir" NÃO mostra "Finalizados" */}
      <StatusChips value="proximos" onChange={() => {}} items={[
        { v: 'proximos', l: 'Próximos' },
        { v: 'andamento', l: 'Andamento' },
      ]}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 8px' }}>
        <span style={{ ...T.t.caption, color: T.c.n600 }}>Ordem: mais cedo primeiro · 4 eventos</span>
        <button style={{ background: 'none', border: 'none', color: T.c.p700, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Perto de mim ▾
        </button>
      </div>
      <div>
        <EventCardPrev scope="descobrir" ev={{
          title: 'Espumantes às cegas', date: 'Sex 22 mai · 20h00', place: 'Brasília, DF',
          confraria: 'Espumantes & Cia', from: '#E2B86B', to: '#B8894A', icon: 'celebration',
        }}/>
        <EventCardPrev scope="descobrir" ev={{
          title: 'Vinho Verde no Lago', date: 'Sáb 23 mai · 16h00', place: 'Lago Norte, Brasília',
          confraria: 'Douro & Cia', from: '#5C7A3A', to: '#2E4A22', icon: 'tour',
        }}/>
        <EventCardPrev scope="descobrir" ev={{
          title: 'Wine & Netflix night', date: 'Sáb 23 mai · 21h30', place: 'Online',
          confraria: 'Vinhos de Garagem', from: '#4A3550', to: '#1C1620', icon: 'nightlife',
        }}/>
      </div>
    </PrevShell>
  );
}

// ═══ PREVIEW 3 — Modal Participar (Confraria PÚBLICA) ══════════
function PreviewModalParticiparPublica({ go }) {
  const [rsvp, setRsvp] = React.useState('vou');
  return (
    <PrevShell title="Eventos" sub="(Modal de Participar — Pública)" onBack={() => go('back')}
      sheet={
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, animation: 'tcSlideUp 220ms', maxHeight: '92%' }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="public" size={20} color={T.c.s700} fill={1}/>
              </div>
              <div style={{ ...T.t.overline, color: T.c.s700, fontWeight: 700 }}>CONFRARIA PÚBLICA</div>
            </div>
            <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 8 }}>
              Participar do evento
            </div>
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 16 }}>
              Ao confirmar, você participa de <strong>Degustação de Malbecs</strong> e entra na confraria <strong>Brindar em Brasília</strong>.
            </div>
            <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8 }}>VOCÊ VAI?</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[['vou', 'Vou', 'check_circle'], ['talvez', 'Talvez', 'help'], ['nao', 'Não vou', 'cancel']].map(([k, l, ic]) => (
                <button key={k} onClick={() => setRsvp(k)} style={{
                  flex: 1, padding: '12px 6px', borderRadius: T.r.md, cursor: 'pointer',
                  background: rsvp === k ? T.c.p50 : T.c.n0,
                  border: `1.5px solid ${rsvp === k ? T.c.p700 : T.c.n200}`,
                  color: rsvp === k ? T.c.p700 : T.c.n800,
                  fontFamily: T.font, fontSize: 13, fontWeight: 700,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <Icon name={ic} size={18} color={rsvp === k ? T.c.p700 : T.c.n600} fill={rsvp === k ? 1 : 0}/>
                  {l}
                </button>
              ))}
            </div>
            <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 16, display: 'flex', gap: 8 }}>
              <Icon name="info" size={16} color={T.c.i700} style={{ flexShrink: 0, marginTop: 2 }}/>
              <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4 }}>
                Você pode sair da confraria depois pelas Configurações. Cancelar a presença e sair da confraria são ações separadas.
              </div>
            </div>
            <Button variant="primary" size="lg" fullWidth>Confirmar participação</Button>
            <div style={{ height: 8 }}/>
            <Button variant="ghost" size="md" fullWidth>Cancelar</Button>
          </div>
        </div>
      }
    />
  );
}

// ═══ PREVIEW 4 — Modal Participar (Confraria PRIVADA) ══════════
function PreviewModalParticiparPrivada({ go }) {
  return (
    <PrevShell title="Eventos" sub="(Modal de Participar — Privada)" onBack={() => go('back')}
      sheet={
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, animation: 'tcSlideUp 220ms', maxHeight: '92%' }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.c.a100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="lock" size={20} color={T.c.a700} fill={1}/>
              </div>
              <div style={{ ...T.t.overline, color: T.c.a700, fontWeight: 700 }}>CONFRARIA PRIVADA</div>
            </div>
            <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 8 }}>
              Solicitar para participar
            </div>
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 16 }}>
              <strong>Douro & Cia</strong> é uma confraria privada. Vamos mandar uma solicitação pro admin pra você participar de <strong>Vinho Verde no Lago</strong> e entrar na confraria. Você é notificado quando aprovar.
            </div>
            <div style={{ background: T.c.n50, padding: '12px 14px', borderRadius: T.r.md, marginBottom: 16 }}>
              <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6 }}>ENQUANTO ESPERA</div>
              <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
                · Endereço completo só é liberado após aprovação<br/>
                · Lista nominal de confirmados fica oculta até lá<br/>
                · Você recebe push quando o admin responder
              </div>
            </div>
            <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Mensagem pro admin (opcional)</div>
            <textarea placeholder="Conta rapidinho por que quer entrar..." rows={3} style={{
              width: '100%', padding: '10px 12px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
              fontFamily: T.font, fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 16,
            }}/>
            <Button variant="primary" size="lg" fullWidth leading={<Icon name="send" size={18}/>}>
              Enviar solicitação
            </Button>
            <div style={{ height: 8 }}/>
            <Button variant="ghost" size="md" fullWidth>Cancelar</Button>
          </div>
        </div>
      }
    />
  );
}

// ═══ PREVIEW 5 — Empty state de Descobrir eventos ══════════════
function PreviewDescobrirEmpty({ go }) {
  return (
    <PrevShell title="Eventos" sub="Descobrir eventos · Próximos (vazio)" onBack={() => go('back')}>
      <Segmented value="descobrir" onChange={() => {}} items={[
        { v: 'meus', l: 'Meus eventos' },
        { v: 'descobrir', l: 'Descobrir eventos' },
      ]}/>
      <StatusChips value="proximos" onChange={() => {}} items={[
        { v: 'proximos', l: 'Próximos' },
        { v: 'andamento', l: 'Andamento' },
      ]}/>
      <div style={{ padding: '48px 28px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: T.c.n100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Icon name="event_busy" size={40} color={T.c.n400}/>
        </div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>
          Ainda não tem evento perto de você
        </div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 22, maxWidth: 280, margin: '0 auto 22px' }}>
          Crie uma confraria e seja o primeiro a marcar um encontro na sua região.
        </div>
        <Button variant="primary" size="lg" leading={<Icon name="add" size={18}/>}>
          Criar uma confraria
        </Button>
      </div>
    </PrevShell>
  );
}

Object.assign(window, {
  PreviewEventosMeus, PreviewEventosDescobrir,
  PreviewModalParticiparPublica, PreviewModalParticiparPrivada,
  PreviewDescobrirEmpty,
});

export {
  PreviewEventosMeus, PreviewEventosDescobrir,
  PreviewModalParticiparPublica, PreviewModalParticiparPrivada,
  PreviewDescobrirEmpty,
};
