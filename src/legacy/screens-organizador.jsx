/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_EVENTS, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { CfgRow } from './screens-config-detalhe.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Organizador de Evento (4 telas)
//
//   29.01 evento-editar      → admin/organizador edita evento existente
//   29.02 evento-presenca    → lista de presença + checkin
//   29.03 evento-pos-avaliar → pós-evento: avaliar vinhos servidos
//   29.04 evento-pos-ata     → ata coletiva + foto do grupo
//
//   Acessadas via EventDetalheScreen (botão de organizador / após data)
// ─────────────────────────────────────────────────────────────

function OrgShell({ title, onBack, action, children }) {
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

// 29.01 ─────────────────────────────────────────────────
function EventoEditarScreen({ go, params }) {
  const ev = (params && params.event) || (typeof MOCK_EVENTS !== 'undefined' ? MOCK_EVENTS[0] : { title: 'Degustação às cegas', date: '2026-05-18', time: '19h30', location: 'Casa da Carla — Asa Sul' });
  const [title, setTitle] = React.useState(ev.title);
  const [date, setDate] = React.useState(ev.date);
  const [time, setTime] = React.useState(ev.time);
  const [loc, setLoc] = React.useState(ev.location);
  const [modality, setModality] = React.useState(ev.modality || 'presencial');
  const [desc, setDesc] = React.useState('Degustação às cegas de 4 a 6 garrafas. Cada um traz uma envolta em papel kraft.');
  const [showCancel, setShowCancel] = React.useState(false);

  return (
    <OrgShell title="Editar evento" onBack={() => go('back')}
      action={<button onClick={() => { go('toast', { kind: 'success', message: 'Mudanças salvas. Os participantes foram avisados.' }); go('back'); }} style={{
        background: 'none', border: 'none', color: T.c.p700, fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: '8px 16px', cursor: 'pointer',
      }}>Salvar</button>}>
      {/* Avisar mudança */}
      <div style={{ padding: 14, background: T.c.i100, margin: 16, borderRadius: T.r.md, display: 'flex', gap: 10 }}>
        <Icon name="info" size={20} color={T.c.i700}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
          <strong>{ev.participants || 5} pessoas já confirmaram.</strong> Vamos avisar todas em push e e-mail quando você salvar.
        </div>
      </div>

      {/* Campos */}
      <div style={{ background: T.c.n0, padding: '4px 16px 16px' }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginTop: 12, marginBottom: 6 }}>Nome do evento</div>
        <input value={title} onChange={e => setTitle(e.target.value)} style={oeInput}/>

        <div style={{ ...T.t.label, color: T.c.n800, marginTop: 16, marginBottom: 6 }}>Quando</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...oeInput, flex: 2 }}/>
          <input type="time" value={time.replace('h', ':')} onChange={e => setTime(e.target.value.replace(':', 'h'))} style={{ ...oeInput, flex: 1 }}/>
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginTop: 16, marginBottom: 6 }}>Modalidade</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'presencial', icon: 'location_on', label: 'Presencial' },
            { id: 'online',     icon: 'videocam',    label: 'Online' },
            { id: 'hibrido',    icon: 'cast',        label: 'Híbrido' },
          ].map(m => (
            <button key={m.id} onClick={() => setModality(m.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 4px', borderRadius: T.r.md,
              background: modality === m.id ? T.c.p50 : T.c.n0,
              border: `1.5px solid ${modality === m.id ? T.c.p700 : T.c.n200}`,
              color: modality === m.id ? T.c.p700 : T.c.n800,
              cursor: 'pointer', fontFamily: T.font, fontSize: 12, fontWeight: 600,
            }}>
              <Icon name={m.icon} size={20} color={modality === m.id ? T.c.p700 : T.c.n600}/>
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginTop: 16, marginBottom: 6 }}>{modality === 'online' ? 'Link da reunião' : 'Endereço'}</div>
        <div style={{ position: 'relative' }}>
          <input value={loc} onChange={e => setLoc(e.target.value)} style={{ ...oeInput, paddingLeft: 40 }}/>
          <Icon name={modality === 'online' ? 'link' : 'location_on'} size={20} color={T.c.n600} style={{ position: 'absolute', left: 12, top: 14 }}/>
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginTop: 16, marginBottom: 6 }}>Descrição</div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} style={{ ...oeInput, resize: 'vertical' }}/>
      </div>

      {/* Lista de presença atalho */}
      <div style={{ background: T.c.n0, marginTop: 12 }}>
        <CfgRow icon="people"        label="Lista de presença"  sub={`${ev.participants || 5} confirmados · 2 talvez · 1 não vai`} onClick={() => go('evento-presenca', { event: ev })}/>
        <CfgRow icon="wine_bar"      label="Kit do organizador" sub="Garrafas, taças, tira-gosto" onClick={() => go('toast', { kind: 'info', message: 'Em breve: kit do organizador.' })}/>
        <CfgRow icon="checklist"     label="Checklist (D-7 / D-3 / D-1)" sub="3 de 5 concluídos" onClick={() => go('toast', { kind: 'info', message: 'Em breve.' })} last/>
      </div>

      {/* Cancelar evento */}
      <div style={{ padding: '20px 16px 32px' }}>
        <Button variant="ghost" size="md" fullWidth onClick={() => setShowCancel(true)} leading={<Icon name="event_busy" size={18}/>}>
          Cancelar evento
        </Button>
      </div>

      {showCancel && (
        <div onClick={() => setShowCancel(false)} style={{
          position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'tcFadeIn 180ms',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl,
            padding: 24, width: '100%', animation: 'tcSlideUp 220ms',
          }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
            <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Cancelar evento?</div>
            <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 20 }}>
              Vamos avisar os {ev.participants || 5} confirmados que o evento foi cancelado. Quem topar pode marcar uma nova data.
            </div>
            <Button variant="destructive" size="lg" fullWidth onClick={() => {
              setShowCancel(false);
              go('toast', { kind: 'warning', message: 'Evento cancelado. Participantes avisados.' });
              go('confraria-detalhe');
            }}>Sim, cancelar</Button>
            <div style={{ height: 10 }}/>
            <Button variant="ghost" size="lg" fullWidth onClick={() => setShowCancel(false)}>Manter evento</Button>
          </div>
        </div>
      )}
    </OrgShell>
  );
}

const oeInput = {
  width: '100%', padding: '12px 14px', border: `1.5px solid ${T.c.n300}`,
  borderRadius: T.r.md, fontFamily: T.font, fontSize: 15, color: T.c.n950,
  outline: 'none', boxSizing: 'border-box', background: T.c.n0,
};

// 29.02 ─────────────────────────────────────────────────
// Visão do organizador: duas abas — Presença (RSVP + check-in) e Pagamentos
// (quem pagou, via conta própria ou LACI, com reconhecimento automático). #A
const fmtBRL = (n) => 'R$ ' + Number(n).toFixed(2).replace('.', ',');

function eventFixedAmount(ev) {
  const s = ev && ev.settings;
  if (s && s.payment === 'free') return 0;
  if (s && s.payment === 'fixed') return Number(String(s.paymentAmount || '').replace(',', '.')) || 0;
  if (ev && ev.paymentAmount) return Number(String(ev.paymentAmount).replace(',', '.')) || 0;
  return 80; // fallback de demonstração quando o evento mock não traz config de pagamento
}

function EventoPresencaScreen({ go, params }) {
  const ev = (params && params.event) || { title: 'Degustação às cegas', participants: 8 };
  const [view, setView] = React.useState('presenca'); // presenca | pagamentos
  const [filter, setFilter] = React.useState('todos');
  const [checkin, setCheckin] = React.useState({ 'Carla Mendes': true, 'Diego Reis': true });

  const fixedAmount = eventFixedAmount(ev);
  const isPaid = fixedAmount > 0;

  // payMethod: 'laci' (reconhecido automático) | 'conta' (pago pela conta) | null (pendente)
  const all = [
    { name: 'Carla Mendes',     status: 'going',  level: 'expert',         host: true, payMethod: 'laci' },
    { name: 'Diego Reis',       status: 'going',  level: 'intermediario',  payMethod: 'conta' },
    { name: 'Fernando Medrado', status: 'going',  level: 'intermediario',  payMethod: 'laci' },
    { name: 'Helena Britto',    status: 'going',  level: 'iniciante',      payMethod: null },
    { name: 'João Bernardes',   status: 'going',  level: 'intermediario',  payMethod: null },
    { name: 'Marina Oliveira',  status: 'maybe',  level: 'iniciante' },
    { name: 'Pedro Almeida',    status: 'maybe',  level: 'expert' },
    { name: 'Roberto Santos',   status: 'no',     level: 'iniciante' },
    { name: 'Sem resposta · Júlia Castro', status: 'pending', level: 'intermediario' },
  ];
  const counts = {
    todos: all.length,
    going: all.filter(a => a.status === 'going').length,
    maybe: all.filter(a => a.status === 'maybe').length,
    no:    all.filter(a => a.status === 'no').length,
    pending: all.filter(a => a.status === 'pending').length,
  };
  const checkedCount = Object.values(checkin).filter(Boolean).length;
  const filtered = all.filter(a => filter === 'todos' || a.status === filter);

  // Pagamentos — admin pode marcar manualmente quem pagou (os via LACI já entram pagos)
  const goingList = all.filter(a => a.status === 'going');
  const [manualPaid, setManualPaid] = React.useState({}); // name -> true (marcado pelo admin)
  const isPaidBy = (p) => p.payMethod === 'laci' || p.payMethod === 'conta' || manualPaid[p.name];
  const paidCount = goingList.filter(isPaidBy).length;
  const arrecadado = paidCount * fixedAmount;
  const meta = goingList.length * fixedAmount;

  return (
    <OrgShell title="Gerenciar evento" onBack={() => go('back')}>
      {/* Stats hero — muda conforme a aba */}
      <div style={{ background: `linear-gradient(135deg, ${T.c.p700}, ${T.c.p900})`, color: T.c.n0, padding: '20px 16px' }}>
        <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{ev.title}</div>
        {view === 'presenca' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 36, fontWeight: 700, fontFamily: T.font, lineHeight: 1 }}>{checkedCount}<span style={{ fontSize: 18, opacity: 0.8 }}>/{counts.going}</span></div>
              <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.85)' }}>presentes</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { k: 'going',   l: 'Confirmados', v: counts.going },
                { k: 'maybe',   l: 'Talvez',      v: counts.maybe },
                { k: 'no',      l: 'Não vão',     v: counts.no },
                { k: 'pending', l: 'Sem resp.',   v: counts.pending },
              ].map(s => (
                <div key={s.k} style={{ padding: 8, background: 'rgba(255,255,255,0.12)', borderRadius: T.r.md }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: T.font }}>{s.v}</div>
                  <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.8)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: T.font, lineHeight: 1 }}>{fmtBRL(arrecadado)}</div>
              {isPaid && <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.8)' }}>de {fmtBRL(meta)}</div>}
            </div>
            <div style={{ ...T.t.caption, color: 'rgba(255,255,255,0.85)', marginBottom: 12 }}>
              {isPaid ? `${paidCount} de ${goingList.length} pagaram · ${fmtBRL(fixedAmount)} por pessoa` : 'Evento gratuito'}
            </div>
            {isPaid && (
              <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${meta ? (arrecadado / meta) * 100 : 0}%`, background: T.c.a500, transition: 'width 240ms' }}/>
              </div>
            )}
          </>
        )}
      </div>

      {/* Abas Presença | Pagamentos */}
      <div style={{ display: 'flex', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
        {[
          { id: 'presenca',   label: 'Presença' },
          { id: 'pagamentos', label: 'Pagamentos' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${view === t.id ? T.c.p700 : 'transparent'}`,
            color: view === t.id ? T.c.p700 : T.c.n600, fontWeight: 600, fontSize: 14,
            fontFamily: T.font, marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'presenca' && (
        <>
          {/* Filter pills */}
          <div style={{ background: T.c.n0, padding: '12px 16px 8px', borderBottom: `1px solid ${T.c.n100}`, display: 'flex', gap: 8, overflowX: 'auto' }}>
            {[
              { id: 'todos',   label: `Todos (${counts.todos})` },
              { id: 'going',   label: `Confirmados (${counts.going})` },
              { id: 'maybe',   label: `Talvez (${counts.maybe})` },
              { id: 'no',      label: `Não vão (${counts.no})` },
              { id: 'pending', label: `Sem resp. (${counts.pending})` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '8px 14px', borderRadius: T.r.full,
                background: filter === f.id ? T.c.p700 : T.c.n100,
                color: filter === f.id ? T.c.n0 : T.c.n800,
                border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{f.label}</button>
            ))}
          </div>

          {/* List */}
          <div style={{ background: T.c.n0 }}>
            {filtered.map((p, i) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
                <Avatar name={p.name.replace('Sem resposta · ', '')} size={40} level={p.level}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...T.t.bodyB, color: T.c.n950, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name.replace('Sem resposta · ', '')}
                    {p.host && <span style={{ ...T.t.caption, padding: '2px 6px', borderRadius: T.r.xs, background: T.c.a100, color: T.c.a700, fontWeight: 600 }}>anfitriã</span>}
                  </div>
                  <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
                    {p.status === 'going'   && 'Confirmado'}
                    {p.status === 'maybe'   && 'Marcou talvez'}
                    {p.status === 'no'      && 'Não vai'}
                    {p.status === 'pending' && 'Ainda não respondeu'}
                  </div>
                </div>
                {p.status === 'going' ? (
                  <button onClick={() => setCheckin(c => ({ ...c, [p.name]: !c[p.name] }))} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: T.r.full,
                    background: checkin[p.name] ? T.c.s100 : T.c.n0,
                    border: `1.5px solid ${checkin[p.name] ? T.c.s700 : T.c.n300}`,
                    color: checkin[p.name] ? T.c.s700 : T.c.n800,
                    cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
                  }}>
                    <Icon name={checkin[p.name] ? 'check_circle' : 'radio_button_unchecked'} size={16} color={checkin[p.name] ? T.c.s700 : T.c.n600} fill={checkin[p.name] ? 1 : 0}/>
                    {checkin[p.name] ? 'Presente' : 'Marcar'}
                  </button>
                ) : p.status === 'pending' ? (
                  <Button variant="secondary" size="sm" onClick={() => go('toast', { kind: 'success', message: `Lembrete enviado pra ${p.name.replace('Sem resposta · ', '')}.` })}>Cutucar</Button>
                ) : null}
              </div>
            ))}
          </div>

          <div style={{ padding: 16 }}>
            <Button variant="secondary" size="md" fullWidth leading={<Icon name="download" size={18}/>} onClick={() => go('toast', { kind: 'success', message: 'Lista exportada.' })}>
              Exportar lista (CSV)
            </Button>
          </div>
        </>
      )}

      {view === 'pagamentos' && (
        <>
          {!isPaid ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: T.c.n600 }}>
              <Icon name="volunteer_activism" size={40} color={T.c.n400}/>
              <div style={{ ...T.t.h3, color: T.c.n950, marginTop: 12, marginBottom: 4 }}>Evento gratuito</div>
              <div style={{ ...T.t.body, color: T.c.n600 }}>Não há cobrança pra este evento.</div>
            </div>
          ) : (
            <>
              {/* Aviso LACI */}
              <div style={{ display: 'flex', gap: 10, margin: 16, padding: 12, background: T.c.i100, borderRadius: T.r.md }}>
                <Icon name="bolt" size={20} color={T.c.i700} fill={1}/>
                <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
                  Pagamentos pelo <strong>LACI</strong> são reconhecidos automaticamente. Quem paga pela própria conta você confirma manualmente.
                </div>
              </div>

              <div style={{ background: T.c.n0 }}>
                {goingList.map((p, i) => {
                  const paid = isPaidBy(p);
                  return (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i === goingList.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
                      <Avatar name={p.name} size={40} level={p.level}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{p.name}</div>
                        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
                          {paid
                            ? (p.payMethod === 'laci' ? 'Pago via LACI · automático' : (p.payMethod === 'conta' ? 'Pago pela conta' : 'Pago · confirmado por você'))
                            : `Pendente · ${fmtBRL(fixedAmount)}`}
                        </div>
                      </div>
                      {paid ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: T.r.full,
                          background: T.c.s100, color: T.c.s700, fontFamily: T.font, fontSize: 12, fontWeight: 700,
                        }}>
                          <Icon name={p.payMethod === 'laci' ? 'bolt' : 'check_circle'} size={15} color={T.c.s700} fill={1}/>
                          {p.payMethod === 'laci' ? 'LACI' : 'Pago'}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <button onClick={() => setManualPaid(m => ({ ...m, [p.name]: true }))} style={{
                            padding: '7px 12px', borderRadius: T.r.full, background: T.c.p700, color: T.c.n0,
                            border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 12, fontWeight: 600,
                          }}>Marcar pago</button>
                          <button onClick={() => go('toast', { kind: 'success', message: `Cobrança enviada pra ${p.name}.` })} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: T.c.p700,
                            fontFamily: T.font, fontSize: 12, fontWeight: 600, padding: 0,
                          }}>Cobrar</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button variant="secondary" size="md" fullWidth leading={<Icon name="notifications_active" size={18}/>}
                  onClick={() => go('toast', { kind: 'success', message: 'Lembrete de pagamento enviado aos pendentes.' })}>
                  Cobrar todos os pendentes
                </Button>
                <Button variant="ghost" size="md" fullWidth leading={<Icon name="download" size={18}/>}
                  onClick={() => go('toast', { kind: 'success', message: 'Relatório de pagamentos exportado.' })}>
                  Exportar pagamentos (CSV)
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </OrgShell>
  );
}

// 29.03 ─────────────────────────────────────────────────
function EventoPosAvaliarScreen({ go, params }) {
  const ev = (params && params.event) || { title: 'Degustação às cegas' };
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES.slice(0, 4) : [];
  const [ratings, setRatings] = React.useState({});
  const [notes, setNotes]     = React.useState({});
  const total = wines.length;
  const done  = Object.values(ratings).filter(Boolean).length;

  return (
    <OrgShell title="Avaliar vinhos do evento" onBack={() => go('back')}>
      {/* Progress hero */}
      <div style={{ background: T.c.n0, padding: '16px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{ev.title}</div>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Conta como foi cada vinho</div>
        <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 12 }}>
          Suas notas vão pro seu diário e contribuem pra média da confraria. Os outros membros já avaliaram — você vê o consenso depois.
        </div>
        <div style={{ height: 6, background: T.c.n200, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(done / total) * 100}%`, background: T.c.p700, transition: 'width 200ms' }}/>
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 6 }}>{done}/{total} avaliados</div>
      </div>

      {/* Wine cards */}
      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {wines.map((w, i) => (
          <div key={i} style={{ background: T.c.n0, borderRadius: T.r.md, padding: 14, border: `1px solid ${T.c.n200}` }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <BottlePlaceholder width={48} height={68} label=""/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.t.overline, color: T.c.n600 }}>VINHO {i + 1}</div>
                <div style={{ ...T.t.bodyB, color: T.c.n950, marginTop: 2 }}>{w.name}</div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{w.country}{w.region ? ' · ' + w.region : ''}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRatings(r => ({ ...r, [i]: s }))} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                  transform: ratings[i] === s ? 'scale(1.15)' : 'scale(1)', transition: 'transform 120ms',
                }}>
                  <Icon name="star" size={28} color={s <= (ratings[i] || 0) ? T.c.a700 : T.c.n300} fill={s <= (ratings[i] || 0) ? 1 : 0}/>
                </button>
              ))}
              <span style={{ ...T.t.caption, color: T.c.n600, marginLeft: 8, fontFamily: T.mono }}>
                {ratings[i] ? `${ratings[i]}/5` : '—'}
              </span>
            </div>
            <textarea value={notes[i] || ''} onChange={e => setNotes(n => ({ ...n, [i]: e.target.value }))}
              placeholder="Anota uma palavra ou frase (opcional)..." rows={2} style={{
              width: '100%', padding: 10, border: `1px solid ${T.c.n200}`, borderRadius: T.r.sm,
              background: T.c.n50, fontFamily: T.font, fontSize: 13, color: T.c.n950, outline: 'none', boxSizing: 'border-box', resize: 'vertical',
            }}/>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        <Button variant="primary" size="lg" fullWidth disabled={done === 0} onClick={() => { go('evento-pos-ata', { event: ev, ratings, notes }); }}>
          {done === total ? 'Continuar pra ata' : `Salvar ${done} e continuar`}
        </Button>
      </div>
    </OrgShell>
  );
}

// 29.04 ─────────────────────────────────────────────────
function EventoPosAtaScreen({ go, params }) {
  const ev = (params && params.event) || { title: 'Degustação às cegas' };
  const [photo, setPhoto] = React.useState(true);
  const [highlight, setHighlight] = React.useState('');
  const [next, setNext]           = React.useState('');
  return (
    <OrgShell title="Ata do encontro" onBack={() => go('back')}>
      {/* Photo collage placeholder */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Foto do grupo</div>
        {photo ? (
          <div style={{ position: 'relative', height: 220, borderRadius: T.r.lg, overflow: 'hidden', background: `linear-gradient(135deg, ${T.c.p500} 0%, ${T.c.p900} 100%)` }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.25,
              backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 12px)`,
            }}/>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: T.c.n0 }}>
              <Icon name="groups" size={42} color="rgba(255,255,255,0.85)"/>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>[ foto do grupo · 6 pessoas ]</div>
            </div>
            <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 6 }}>
              <button onClick={() => go('toast', { kind: 'info', message: 'Em breve: editor de foto.' })} style={{
                padding: '8px 12px', background: 'rgba(15,15,15,0.7)', color: T.c.n0, border: 'none', borderRadius: T.r.full,
                fontFamily: T.font, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}><Icon name="edit" size={16} color={T.c.n0}/>Editar</button>
              <button onClick={() => setPhoto(false)} style={{
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(15,15,15,0.7)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name="close" size={18} color={T.c.n0}/></button>
            </div>
          </div>
        ) : (
          <button onClick={() => setPhoto(true)} style={{
            width: '100%', height: 160, borderRadius: T.r.lg, border: `2px dashed ${T.c.n300}`,
            background: T.c.n50, cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, color: T.c.n600,
            fontFamily: T.font, fontSize: 14, fontWeight: 500,
          }}>
            <Icon name="add_a_photo" size={32} color={T.c.n600}/>
            Adicionar foto do grupo
          </button>
        )}
      </div>

      {/* Summary card */}
      <div style={{ margin: 16, padding: 16, background: T.c.n0, borderRadius: T.r.lg, border: `1px solid ${T.c.n200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: T.r.md, background: T.c.a100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="auto_awesome" size={20} color={T.c.a700}/>
          </div>
          <div>
            <div style={{ ...T.t.overline, color: T.c.n600 }}>RESUMO DA CONFRARIA</div>
            <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{ev.title}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { l: 'Presentes',    v: '6' },
            { l: 'Vinhos',       v: '4' },
            { l: 'Nota média',   v: '4.2' },
          ].map(s => (
            <div key={s.l} style={{ padding: 10, background: T.c.n50, borderRadius: T.r.md, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.c.p700, fontFamily: T.font }}>{s.v}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.55 }}>
          <strong style={{ color: T.c.n950 }}>Destaque do consenso:</strong> Catena Malbec 2021 — nota média 4.6 entre 6 avaliações.
        </div>
      </div>

      {/* Highlights */}
      <div style={{ background: T.c.n0, padding: 16 }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>O que ficou de melhor? <span style={{ color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
        <textarea value={highlight} onChange={e => setHighlight(e.target.value)} placeholder="Ex.: o Malbec arrebatou geral; tira-gosto da Carla salvou; nova descoberta foi o Tannat uruguaio." rows={3} style={{ ...oeInput, resize: 'vertical' }}/>

        <div style={{ ...T.t.label, color: T.c.n800, marginTop: 16, marginBottom: 6 }}>Próximo encontro? <span style={{ color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
        <textarea value={next} onChange={e => setNext(e.target.value)} placeholder="Ex.: degustação portuguesa no Diego, dia 15/06." rows={2} style={{ ...oeInput, resize: 'vertical' }}/>
      </div>

      {/* CTAs */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="share" size={20}/>} onClick={() => {
          go('toast', { kind: 'success', message: 'Ata publicada no mural da confraria.' });
          go('back');
          go('back');
        }}>Publicar no mural</Button>
        <Button variant="secondary" size="lg" fullWidth leading={<Icon name="download" size={20}/>} onClick={() => go('toast', { kind: 'success', message: 'Ata salva como PDF.' })}>
          Salvar como PDF
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('back')}>Editar depois</Button>
      </div>
    </OrgShell>
  );
}

Object.assign(window, {
  OrgShell, EventoEditarScreen, EventoPresencaScreen,
  EventoPosAvaliarScreen, EventoPosAtaScreen,
});


export { EventoEditarScreen, EventoPosAtaScreen, EventoPosAvaliarScreen, EventoPresencaScreen, OrgShell, oeInput };
