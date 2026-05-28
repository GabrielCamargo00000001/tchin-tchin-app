/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_CONFRARIAS } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { CfgRow, CfgToggle } from './screens-config-detalhe.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Confraria · ações admin e membros (3 telas)
//
//   28.01 confraria-config     → admin edita (nome, regras, foto, privacidade)
//   28.02 confraria-convidar   → convidar amigos (link, contatos, WhatsApp)
//   28.03 confraria-sair       → fluxo de sair (modal) + transferir admin
//
//   Acessadas a partir de ConfrariaDetalheScreen → menu ⋯
// ─────────────────────────────────────────────────────────────

function CfShell({ title, onBack, onSave, saveDisabled, children, danger }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>
        {onSave && (
          <button onClick={onSave} disabled={saveDisabled} style={{
            background: 'none', border: 'none', cursor: saveDisabled ? 'default' : 'pointer',
            color: saveDisabled ? T.c.n400 : T.c.p700,
            fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: '8px 16px',
          }}>Salvar</button>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

// 28.01 ─────────────────────────────────────────────────
function ConfrariaConfigScreen({ go, params }) {
  const confraria = (params && params.confraria) || (typeof MOCK_CONFRARIAS !== 'undefined' ? MOCK_CONFRARIAS[4] : { name: 'Brindar em Brasília', cidade: 'Brasília' });
  const [name, setName] = React.useState(confraria.name);
  const [desc, setDesc] = React.useState(confraria.descricao || 'Confraria pra trocar dicas, marcar degustações e viver Brasília no copo.');
  const [city, setCity] = React.useState(confraria.cidade || 'Brasília');
  const [privacidade, setPrivacidade] = React.useState(confraria.privacidade || 'aberta');
  const [aprovacao, setAprovacao] = React.useState(true);
  const [chatOn, setChatOn] = React.useState(true);
  const dirty = name !== confraria.name || desc !== (confraria.descricao || 'Confraria pra trocar dicas, marcar degustações e viver Brasília no copo.');
  return (
    <CfShell title="Editar confraria" onBack={() => go('back')}
      onSave={() => { go('toast', { kind: 'success', message: 'Confraria atualizada.' }); go('back'); }}
      saveDisabled={!dirty}>
      {/* Cover */}
      <div style={{ background: T.c.n0, padding: '20px 16px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Capa</div>
        <div style={{
          height: 140, borderRadius: T.r.lg, position: 'relative',
          background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.18,
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 14px)`,
          }}/>
          <Icon name="photo_camera" size={28} color="rgba(255,255,255,0.7)"/>
          <button style={{
            position: 'absolute', bottom: 12, right: 12, padding: '8px 12px',
            background: 'rgba(15,15,15,0.7)', color: T.c.n0, border: 'none', borderRadius: T.r.full,
            cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="edit" size={16} color={T.c.n0}/>Trocar capa
          </button>
        </div>
      </div>

      {/* Identidade */}
      <div style={{ background: T.c.n0, padding: '16px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Nome</div>
        <input value={name} onChange={e => setName(e.target.value.slice(0, 60))} style={cfInput}/>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4, textAlign: 'right' }}>{name.length}/60</div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6, marginTop: 16 }}>Descrição</div>
        <textarea value={desc} onChange={e => setDesc(e.target.value.slice(0, 280))} rows={3} style={{ ...cfInput, resize: 'vertical' }}/>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4, textAlign: 'right' }}>{desc.length}/280</div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6, marginTop: 16 }}>Cidade</div>
        <input value={city} onChange={e => setCity(e.target.value)} style={cfInput}/>
      </div>

      {/* Privacidade */}
      <div style={{ background: T.c.n0, padding: '16px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>QUEM PODE ENTRAR</div>
        {[
          { id: 'aberta',     icon: 'public',     label: 'Aberta',     sub: 'Qualquer pessoa pode entrar direto.' },
          { id: 'aprovacao',  icon: 'how_to_reg', label: 'Por aprovação', sub: 'Pedidos passam por você antes de virar membro.' },
          { id: 'fechada',    icon: 'lock',       label: 'Fechada',    sub: 'Só com convite direto seu.' },
        ].map(opt => (
          <button key={opt.id} onClick={() => setPrivacidade(opt.id)} style={{
            width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
            background: privacidade === opt.id ? T.c.p50 : T.c.n0,
            border: `1.5px solid ${privacidade === opt.id ? T.c.p700 : T.c.n200}`,
            borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left', marginBottom: 8,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r.md, background: privacidade === opt.id ? T.c.p100 : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={opt.icon} size={20} color={privacidade === opt.id ? T.c.p700 : T.c.n600}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{opt.label}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{opt.sub}</div>
            </div>
            <Icon name={privacidade === opt.id ? 'check_circle' : 'radio_button_unchecked'} size={20} color={privacidade === opt.id ? T.c.p700 : T.c.n400} fill={privacidade === opt.id ? 1 : 0}/>
          </button>
        ))}
      </div>

      {/* Recursos */}
      <div style={{ background: T.c.n0 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, padding: '16px 16px 6px' }}>── RECURSOS DA CONFRARIA ──</div>
        <CfgRow label="Aprovar novos posts antes de publicar" sub="Recomendado pra confrarias grandes" toggle={<CfgToggle on={aprovacao} onChange={setAprovacao}/>}/>
        <CfgRow label="Chat coletivo"                          sub="Conversa em tempo real entre membros" toggle={<CfgToggle on={chatOn} onChange={setChatOn}/>}/>
        <CfgRow icon="gavel" label="Regras da confraria"       sub="Defina o tom e os limites" onClick={() => go('confraria-regras', { confraria })} last/>
      </div>

      {/* Zona de perigo */}
      <div style={{ marginTop: 12, marginBottom: 32 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, padding: '4px 20px 6px' }}>── ADMIN ──</div>
        <div style={{ background: T.c.n0 }}>
          <CfgRow icon="swap_horiz" label="Transferir admin" sub="Outro membro vira admin no seu lugar" onClick={() => go('confraria-transferir', { confraria })}/>
          <CfgRow icon="archive"    label="Arquivar confraria" sub="Some pros membros, mas histórico fica" onClick={() => go('toast', { kind: 'warning', message: 'Confraria arquivada.' })}/>
          <CfgRow icon="delete_forever" label="Excluir confraria" danger onClick={() => go('toast', { kind: 'warning', message: 'Em breve: exclusão definitiva.' })} last/>
        </div>
      </div>
    </CfShell>
  );
}

const cfInput = {
  width: '100%', padding: '12px 14px', border: `1.5px solid ${T.c.n300}`,
  borderRadius: T.r.md, fontFamily: T.font, fontSize: 15, color: T.c.n950,
  outline: 'none', boxSizing: 'border-box', background: T.c.n0,
};

// 28.02 ─────────────────────────────────────────────────
function ConfrariaConvidarScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'sua confraria' };
  const inviteLink = `tchintchin.app/c/${(confraria.name || 'confraria').toLowerCase().replace(/\s+/g, '-')}`;
  const [copied, setCopied] = React.useState(false);
  const sugestoes = [
    { name: 'Júlia Castro',     status: 'app',     subtitle: 'Já está no Tchin Tchin', level: 'intermediario' },
    { name: 'Pedro Almeida',    status: 'app',     subtitle: '@palmeida · expert',     level: 'expert' },
    { name: 'Marina Oliveira',  status: 'contato', subtitle: '(61) 9****-**42',         level: null },
    { name: 'Roberto Santos',   status: 'contato', subtitle: 'roberto@email.com',       level: null },
    { name: 'Isabela Lima',     status: 'app',     subtitle: '@isabelima · iniciante',  level: 'iniciante' },
    { name: 'Bruno Tavares',    status: 'contato', subtitle: '(11) 9****-**87',         level: null },
  ];
  const [selected, setSelected] = React.useState({});
  const count = Object.values(selected).filter(Boolean).length;
  return (
    <CfShell title="Convidar pra confraria" onBack={() => go('back')}>
      {/* Link bar */}
      <div style={{ background: T.c.n0, padding: '16px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Link de convite</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: T.c.n50, borderRadius: T.r.md, border: `1px solid ${T.c.n200}` }}>
          <Icon name="link" size={20} color={T.c.n600}/>
          <div style={{ flex: 1, fontFamily: T.mono, fontSize: 13, color: T.c.n800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteLink}</div>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: T.r.sm,
            background: copied ? T.c.s100 : T.c.p700, color: copied ? T.c.s700 : T.c.n0,
            border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
          }}>
            <Icon name={copied ? 'check' : 'content_copy'} size={16} color={copied ? T.c.s700 : T.c.n0}/>
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { icon: 'chat',     label: 'WhatsApp',  bg: '#25D366' },
            { icon: 'send',     label: 'Telegram',  bg: '#26A5E4' },
            { icon: 'mail',     label: 'E-mail',    bg: T.c.p700 },
            { icon: 'more_horiz', label: 'Mais',    bg: T.c.n800 },
          ].map(s => (
            <button key={s.label} onClick={() => go('toast', { kind: 'success', message: `Convite enviado via ${s.label}.` })} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name={s.icon} size={22} color={T.c.n0}/></div>
              <span style={{ ...T.t.caption, color: T.c.n800, fontWeight: 500 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sugestoes */}
      <div style={{ ...T.t.overline, color: T.c.n600, padding: '16px 20px 6px' }}>── SUGESTÕES DA SUA AGENDA ──</div>
      <div style={{ background: T.c.n0 }}>
        {sugestoes.map((s, i) => (
          <button key={i} onClick={() => setSelected(p => ({ ...p, [s.name]: !p[s.name] }))} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
            background: 'none', border: 'none', borderBottom: i === sugestoes.length - 1 ? 'none' : `1px solid ${T.c.n100}`,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <Avatar name={s.name} size={40} level={s.level}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950, display: 'flex', alignItems: 'center', gap: 6 }}>
                {s.name}
                {s.status === 'app' && <span style={{
                  ...T.t.caption, padding: '2px 6px', borderRadius: T.r.xs,
                  background: T.c.p50, color: T.c.p700, fontWeight: 600,
                }}>no app</span>}
              </div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{s.subtitle}</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: T.r.xs, flexShrink: 0,
              background: selected[s.name] ? T.c.p700 : T.c.n0,
              border: `1.5px solid ${selected[s.name] ? T.c.p700 : T.c.n300}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{selected[s.name] && <Icon name="check" size={16} color={T.c.n0}/>}</div>
          </button>
        ))}
      </div>

      {/* CTA sticky */}
      {count > 0 && (
        <div style={{ position: 'sticky', bottom: 0, padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => { go('toast', { kind: 'success', message: `${count} ${count === 1 ? 'convite enviado' : 'convites enviados'}.` }); go('back'); }}>
            Enviar {count} {count === 1 ? 'convite' : 'convites'}
          </Button>
        </div>
      )}
    </CfShell>
  );
}

// 28.03 ─────────────────────────────────────────────────
function ConfrariaSairScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'sua confraria', isAdmin: false };
  const isAdmin = confraria.isAdmin === true;
  const [step, setStep] = React.useState(1);
  const [reason, setReason] = React.useState(null);
  const reasons = [
    'Não estava conseguindo participar',
    'Pouca atividade no grupo',
    'Conflito com outro membro',
    'Mudei de cidade',
    'Outro motivo',
  ];
  return (
    <CfShell title="Sair da confraria" onBack={() => go('back')}>
      {step === 1 && (
        <div style={{ padding: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: T.r.full, background: T.c.w100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Icon name="logout" size={28} color={T.c.w700}/>
          </div>
          <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Sair de "{confraria.name}"?</div>
          <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.55, marginBottom: 20 }}>
            Você perde acesso ao mural, aos eventos futuros e ao chat. Suas avaliações no diário continuam suas.
          </div>
          {isAdmin && (
            <div style={{ padding: 14, background: T.c.w100, borderRadius: T.r.md, marginBottom: 20, display: 'flex', gap: 10 }}>
              <Icon name="warning" size={20} color={T.c.w700}/>
              <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
                <strong>Você é admin.</strong> Antes de sair, transfira a administração pra outro membro.
              </div>
            </div>
          )}
          {isAdmin ? (
            <>
              <Button variant="primary" size="lg" fullWidth onClick={() => go('confraria-transferir', { confraria })}>Transferir admin</Button>
              <div style={{ height: 10 }}/>
              <Button variant="ghost" size="lg" fullWidth onClick={() => go('back')}>Cancelar</Button>
            </>
          ) : (
            <>
              <Button variant="destructive" size="lg" fullWidth onClick={() => setStep(2)}>Continuar pra sair</Button>
              <div style={{ height: 10 }}/>
              <Button variant="ghost" size="lg" fullWidth onClick={() => go('back')}>Cancelar</Button>
            </>
          )}
        </div>
      )}
      {step === 2 && (
        <div style={{ padding: 20 }}>
          <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 8 }}>Conta pra gente o motivo</div>
          <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>Opcional, mas ajuda a melhorar a experiência das confrarias.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {reasons.map(r => (
              <button key={r} onClick={() => setReason(r)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                background: reason === r ? T.c.p50 : T.c.n0,
                border: `1.5px solid ${reason === r ? T.c.p700 : T.c.n200}`,
                borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left',
              }}>
                <Icon name={reason === r ? 'radio_button_checked' : 'radio_button_unchecked'} size={20} color={reason === r ? T.c.p700 : T.c.n400}/>
                <span style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{r}</span>
              </button>
            ))}
          </div>
          <Button variant="destructive" size="lg" fullWidth onClick={() => {
            go('toast', { kind: 'success', message: `Você saiu de ${confraria.name}.` });
            go('confrarias');
          }}>Sair definitivamente</Button>
          <div style={{ height: 10 }}/>
          <Button variant="ghost" size="lg" fullWidth onClick={() => go('back')}>Cancelar</Button>
        </div>
      )}
    </CfShell>
  );
}

function ConfrariaTransferirScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'sua confraria' };
  const [chosen, setChosen] = React.useState(null);
  const candidatos = [
    { name: 'Carla Mendes',     when: 'membro há 18 meses · expert',       level: 'expert' },
    { name: 'Diego Reis',       when: 'membro há 14 meses · intermediário', level: 'intermediario' },
    { name: 'Fernando Medrado', when: 'membro há 9 meses · intermediário',  level: 'intermediario' },
    { name: 'Helena Britto',    when: 'membro há 4 meses · iniciante',      level: 'iniciante' },
  ];
  return (
    <CfShell title="Transferir admin" onBack={() => go('back')}>
      <div style={{ padding: '16px 20px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>
          Escolha um membro pra virar admin de "<strong>{confraria.name}</strong>". Ele recebe controle total: editar, banir, criar eventos, gerenciar membros.
        </div>
      </div>
      <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── MEMBROS ATIVOS ──</div>
      <div style={{ background: T.c.n0 }}>
        {candidatos.map((c, i) => (
          <button key={c.name} onClick={() => setChosen(c.name)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
            background: chosen === c.name ? T.c.p50 : 'none',
            border: 'none', borderBottom: i === candidatos.length - 1 ? 'none' : `1px solid ${T.c.n100}`,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <Avatar name={c.name} size={44} level={c.level}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{c.name}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{c.when}</div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2px solid ${chosen === c.name ? T.c.p700 : T.c.n400}`,
              background: chosen === c.name ? T.c.p700 : T.c.n0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{chosen === c.name && <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.c.n0 }}/>}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="lg" fullWidth disabled={!chosen} onClick={() => {
          go('toast', { kind: 'success', message: `${chosen} agora é admin de ${confraria.name}.` });
          go('back');
        }}>Transferir admin pra {chosen || '...'}</Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('back')}>Cancelar</Button>
      </div>
    </CfShell>
  );
}

function ConfrariaRegrasScreen({ go, params }) {
  const confraria = (params && params.confraria) || { name: 'sua confraria' };
  const [rules, setRules] = React.useState([
    { title: 'Respeite os colegas',   body: 'Trato cordial. Críticas a vinhos sim, ataques pessoais não.' },
    { title: 'Sem venda fora do app', body: 'Quem quer vender vinho usa o Marketplace. Aqui é confraria.' },
    { title: 'Spoilers às cegas',     body: 'Em degustação cega, não conte o vinho antes da revelação.' },
  ]);
  const [editing, setEditing] = React.useState(null);
  return (
    <CfShell title="Regras da confraria" onBack={() => go('back')}>
      <div style={{ padding: '16px 20px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>
          Regras visíveis pra todos os membros. Aparecem no onboarding ao entrar e na seção "Sobre" da confraria.
        </div>
      </div>
      <div style={{ background: T.c.n0 }}>
        {rules.map((r, i) => (
          <div key={i} style={{ padding: 16, borderBottom: i === rules.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: T.c.p100,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                color: T.c.p700, fontFamily: T.mono, fontSize: 12, fontWeight: 700,
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 4 }}>{r.title}</div>
                <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5 }}>{r.body}</div>
              </div>
              <button onClick={() => setEditing(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <Icon name="edit" size={18} color={T.c.n600}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 16 }}>
        <Button variant="secondary" size="md" fullWidth leading={<Icon name="add" size={18}/>} onClick={() => { setRules(r => [...r, { title: 'Nova regra', body: 'Descreva aqui.' }]); }}>
          Adicionar regra
        </Button>
      </div>
    </CfShell>
  );
}

Object.assign(window, {
  CfShell,
  ConfrariaConfigScreen, ConfrariaConvidarScreen,
  ConfrariaSairScreen, ConfrariaTransferirScreen, ConfrariaRegrasScreen,
});


export { CfShell, ConfrariaConfigScreen, ConfrariaConvidarScreen, ConfrariaRegrasScreen, ConfrariaSairScreen, ConfrariaTransferirScreen, cfInput };
