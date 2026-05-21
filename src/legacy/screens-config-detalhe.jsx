/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Configurações detalhadas (3 telas)
//
//   27.01 config-notif       → granular notif toggles
//   27.02 config-privacidade → bloqueados, dados, sessões
//   27.03 config-conta       → e-mail, senha, LGPD (export), excluir conta
//
//   Suporte → screens-suporte.jsx
// ─────────────────────────────────────────────────────────────

function CfgRow({ icon, label, sub, value, onClick, danger, toggle, last }) {
  return (
    <button onClick={onClick} disabled={!onClick && !toggle} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      background: T.c.n0, border: 'none', borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
      cursor: onClick || toggle ? 'pointer' : 'default', textAlign: 'left',
    }}>
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: T.r.md, flexShrink: 0,
          background: danger ? T.c.e100 : T.c.n100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={20} color={danger ? T.c.e700 : T.c.n800}/>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.t.bodyB, color: danger ? T.c.e700 : T.c.n950 }}>{label}</div>
        {sub && <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{sub}</div>}
      </div>
      {value && <div style={{ ...T.t.caption, color: T.c.n600 }}>{value}</div>}
      {toggle ? toggle : (onClick && !danger && <Icon name="chevron_right" size={20} color={T.c.n400}/>)}
    </button>
  );
}

function CfgToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      background: on ? T.c.p700 : T.c.n300, transition: 'background 150ms',
      position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20,
        borderRadius: '50%', background: T.c.n0, transition: 'left 150ms',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}/>
    </button>
  );
}

function CfgGroup({ title, children, hint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── {title} ──</div>
      <div style={{ background: T.c.n0 }}>{children}</div>
      {hint && <div style={{ ...T.t.caption, color: T.c.n600, padding: '8px 20px 0', lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}

function CfgShell({ title, onBack, children }) {
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

// 27.01 ─────────────────────────────────────────────────
function ConfigNotifScreen({ go }) {
  const [state, setState] = React.useState({
    pushEnabled: true,
    confrariaEvento: true, confrariaPost: true, confrariaChat: true,
    desafioSemana: true, desafioVencido: true, rankingMudou: false,
    nudgesMarketing: false, nudgesD1: true, nudgesD3: true, nudgesD7: false,
    mention: true, follow: true, like: false, comment: true,
    quietHours: true,
    email: true, emailRelatorio: true, emailMarketing: false,
  });
  const set = (k) => (v) => setState(s => ({ ...s, [k]: v }));
  return (
    <CfgShell title="Notificações" onBack={() => go('back')}>
      <CfgGroup title="Geral" hint="Quando desligado, nenhum push é enviado, independente das opções abaixo.">
        <CfgRow icon="notifications_active" label="Notificações push" sub={state.pushEnabled ? 'Ligadas' : 'Desligadas'} toggle={<CfgToggle on={state.pushEnabled} onChange={set('pushEnabled')}/>} last/>
      </CfgGroup>
      <CfgGroup title="Confrarias">
        <CfgRow icon="event" label="Eventos novos / convites"  toggle={<CfgToggle on={state.confrariaEvento} onChange={set('confrariaEvento')}/>}/>
        <CfgRow icon="forum" label="Posts no mural"            toggle={<CfgToggle on={state.confrariaPost}   onChange={set('confrariaPost')}/>}/>
        <CfgRow icon="chat" label="Mensagens no chat"          toggle={<CfgToggle on={state.confrariaChat}   onChange={set('confrariaChat')}/>} last/>
      </CfgGroup>
      <CfgGroup title="Desafios e ranking">
        <CfgRow icon="emoji_events" label="Desafio da semana abriu" toggle={<CfgToggle on={state.desafioSemana} onChange={set('desafioSemana')}/>}/>
        <CfgRow icon="check_circle" label="Você cumpriu um desafio" toggle={<CfgToggle on={state.desafioVencido} onChange={set('desafioVencido')}/>}/>
        <CfgRow icon="leaderboard" label="Você mudou de posição no ranking" toggle={<CfgToggle on={state.rankingMudou} onChange={set('rankingMudou')}/>} last/>
      </CfgGroup>
      <CfgGroup title="Lembretes e nudges">
        <CfgRow label="Lembrete D+1 após criar evento" sub="Convida o time."         toggle={<CfgToggle on={state.nudgesD1} onChange={set('nudgesD1')}/>}/>
        <CfgRow label="Lembrete D+3"                    sub="Confirma local e horário." toggle={<CfgToggle on={state.nudgesD3} onChange={set('nudgesD3')}/>}/>
        <CfgRow label="Lembrete D+7"                    sub="Define os vinhos."         toggle={<CfgToggle on={state.nudgesD7} onChange={set('nudgesD7')}/>}/>
        <CfgRow label="Marketing e dicas"               sub="Vinho da semana, eventos sugeridos." toggle={<CfgToggle on={state.nudgesMarketing} onChange={set('nudgesMarketing')}/>} last/>
      </CfgGroup>
      <CfgGroup title="Social">
        <CfgRow icon="alternate_email" label="Te mencionaram"      toggle={<CfgToggle on={state.mention} onChange={set('mention')}/>}/>
        <CfgRow icon="person_add"      label="Te seguiram"         toggle={<CfgToggle on={state.follow}  onChange={set('follow')}/>}/>
        <CfgRow icon="favorite_border" label="Curtiram seu post"   toggle={<CfgToggle on={state.like}    onChange={set('like')}/>}/>
        <CfgRow icon="chat_bubble_outline" label="Comentaram seu post" toggle={<CfgToggle on={state.comment} onChange={set('comment')}/>} last/>
      </CfgGroup>
      <CfgGroup title="Horário silencioso" hint="Não envia push das 22h às 8h.">
        <CfgRow icon="bedtime" label="Silenciar à noite" toggle={<CfgToggle on={state.quietHours} onChange={set('quietHours')}/>} last/>
      </CfgGroup>
      <CfgGroup title="E-mail">
        <CfgRow icon="mail" label="Avisos importantes"   sub="Pagamento, RSVP de eventos, mudanças críticas." toggle={<CfgToggle on={state.email} onChange={set('email')}/>}/>
        <CfgRow icon="insights" label="Relatório mensal" sub="Resumo do seu mês de vinhos."                   toggle={<CfgToggle on={state.emailRelatorio} onChange={set('emailRelatorio')}/>}/>
        <CfgRow icon="campaign" label="Dicas e novidades" sub="Curadoria editorial, novos recursos."         toggle={<CfgToggle on={state.emailMarketing} onChange={set('emailMarketing')}/>} last/>
      </CfgGroup>
      <div style={{ height: 32 }}/>
    </CfgShell>
  );
}

// 27.02 ─────────────────────────────────────────────────
function ConfigPrivacidadeScreen({ go }) {
  return (
    <CfgShell title="Privacidade e dados" onBack={() => go('back')}>
      <CfgGroup title="Pessoas">
        <CfgRow icon="block"        label="Usuários bloqueados"    sub="3 pessoas"               onClick={() => go('config-bloqueados')}/>
        <CfgRow icon="person_off"   label="Quem deixou de te seguir" sub="Histórico só pra você" onClick={() => go('toast', { kind: 'info', message: 'Em breve.' })}/>
        <CfgRow icon="settings_accessibility" label="Visibilidade do perfil" value="Padrão" onClick={() => go('editar-perfil-privacidade')} last/>
      </CfgGroup>
      <CfgGroup title="Dados e atividade">
        <CfgRow icon="history"  label="Histórico de busca"          sub="Limpar buscas recentes" onClick={() => go('toast', { kind: 'success', message: 'Histórico limpo.' })}/>
        <CfgRow icon="cookie"   label="Cookies e rastreamento"      onClick={() => {}}/>
        <CfgRow icon="location_on" label="Compartilhar localização" sub="Só ao criar evento ou ver confrarias perto" toggle={<CfgToggle on={true} onChange={() => {}}/>} last/>
      </CfgGroup>
      <CfgGroup title="Sessões ativas" hint="Se você não reconhece algum dispositivo, desconecta agora e troca sua senha.">
        <CfgRow icon="phone_android" label="Pixel 7 · Brasília" sub="Este dispositivo · ativo agora" onClick={() => {}}/>
        <CfgRow icon="laptop"        label="MacBook · Brasília" sub="Última atividade há 2 dias"      onClick={() => go('toast', { kind: 'success', message: 'Sessão encerrada.' })}/>
        <CfgRow icon="logout"        label="Sair de todas as outras sessões" danger onClick={() => go('toast', { kind: 'warning', message: 'Todas as outras sessões foram encerradas.' })} last/>
      </CfgGroup>
      <CfgGroup title="LGPD · seus direitos">
        <CfgRow icon="download"  label="Baixar meus dados"        sub="Diário, paladar, confrarias — formato JSON" onClick={() => go('toast', { kind: 'success', message: 'Pedido recebido. Enviaremos por e-mail em até 72h.' })}/>
        <CfgRow icon="description" label="Termos de uso"          onClick={() => go('termos')}/>
        <CfgRow icon="privacy_tip" label="Política de privacidade" onClick={() => go('politica-privacidade')} last/>
      </CfgGroup>
      <div style={{ height: 32 }}/>
    </CfgShell>
  );
}

// 27.03 ─────────────────────────────────────────────────
function ConfigContaScreen({ go }) {
  const [showDelete, setShowDelete] = React.useState(false);
  return (
    <CfgShell title="Conta" onBack={() => go('back')}>
      <CfgGroup title="Informações da conta">
        <CfgRow icon="mail"     label="E-mail"   value="raphaela@email.com" onClick={() => go('config-trocar-email')}/>
        <CfgRow icon="phone"    label="Telefone" value="(61) 9****-**12"     onClick={() => go('config-trocar-telefone')}/>
        <CfgRow icon="lock"     label="Senha"    sub="Trocada há 12 dias"    onClick={() => go('recuperar-redefinir')}/>
        <CfgRow icon="verified_user" label="Verificação em duas etapas" value="Ativa" onClick={() => {}} last/>
      </CfgGroup>
      <CfgGroup title="Assinatura">
        <CfgRow icon="workspace_premium" label="Tchin Tchin Plus" sub="Plano gratuito · sem assinatura ativa" onClick={() => go('toast', { kind: 'info', message: 'Em breve: assinatura Plus.' })} last/>
      </CfgGroup>
      <CfgGroup title="Zona de perigo" hint="Excluir a conta apaga seu diário, suas confrarias e seu paladar. Ação irreversível.">
        <CfgRow icon="pause_circle" label="Desativar conta temporariamente" sub="Some do app, mas dados ficam preservados" onClick={() => go('toast', { kind: 'warning', message: 'Sua conta foi desativada.' })}/>
        <CfgRow icon="delete_forever" label="Excluir conta permanentemente" danger onClick={() => setShowDelete(true)} last/>
      </CfgGroup>
      <div style={{ height: 40 }}/>
      {showDelete && <ConfirmDeleteModal onCancel={() => setShowDelete(false)} onConfirm={() => { setShowDelete(false); go('welcome'); setTimeout(() => go('toast', { kind: 'warning', message: 'Sua conta foi marcada pra exclusão. Você tem 30 dias pra reverter.' }), 200); }}/>}
    </CfgShell>
  );
}

function ConfirmDeleteModal({ onCancel, onConfirm }) {
  const [step, setStep] = React.useState(1);
  const [confirm, setConfirm] = React.useState('');
  return (
    <div onClick={onCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'tcFadeIn 180ms' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl, padding: 24, width: '100%', boxShadow: T.el[5], animation: 'tcSlideUp 220ms' }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
        {step === 1 ? (
          <>
            <div style={{ width: 48, height: 48, borderRadius: T.r.full, background: T.c.e100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="warning" size={24} color={T.c.e700}/>
            </div>
            <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Excluir conta permanentemente?</div>
            <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 20 }}>
              Isso apaga, em 30 dias, todo o seu diário (47 entradas), suas confrarias (3), seu paladar 5D e suas conexões. Não dá pra desfazer depois desse prazo.
            </div>
            <div style={{ padding: 14, background: T.c.w100, borderRadius: T.r.md, marginBottom: 20, display: 'flex', gap: 10 }}>
              <Icon name="lightbulb" size={20} color={T.c.w700}/>
              <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
                <strong>Considere desativar.</strong> Você some do app mas seus dados ficam preservados — basta entrar de novo pra reverter.
              </div>
            </div>
            <Button variant="destructive" size="lg" fullWidth onClick={() => setStep(2)}>Continuar pra exclusão</Button>
            <div style={{ height: 10 }}/>
            <Button variant="ghost" size="lg" fullWidth onClick={onCancel}>Cancelar</Button>
          </>
        ) : (
          <>
            <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Última confirmação</div>
            <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 16 }}>
              Pra confirmar, digite <strong style={{ color: T.c.n950, fontFamily: T.mono }}>EXCLUIR</strong> abaixo.
            </div>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="EXCLUIR" style={{
              width: '100%', padding: '14px 16px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
              fontFamily: T.mono, fontSize: 16, color: T.c.n950, outline: 'none', boxSizing: 'border-box', marginBottom: 20,
            }}/>
            <Button variant="destructive" size="lg" fullWidth disabled={confirm !== 'EXCLUIR'} onClick={onConfirm}>Excluir minha conta</Button>
            <div style={{ height: 10 }}/>
            <Button variant="ghost" size="lg" fullWidth onClick={() => setStep(1)}>Voltar</Button>
          </>
        )}
      </div>
    </div>
  );
}

// Static legal pages (lightweight)
function TermosScreen({ go }) {
  return (
    <CfgShell title="Termos de uso" onBack={() => go('back')}>
      <div style={{ background: T.c.n0, padding: 20 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4 }}>VERSÃO 2.1 · MAIO 2026</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.6 }}>
          Ao usar o Tchin Tchin você concorda com as regras abaixo. Texto resumido — versão completa em PDF no link no rodapé.
        </div>
        {[
          ['1. O que é o Tchin Tchin', 'Plataforma social pra registrar, descobrir e compartilhar vinhos com sua confraria. Não vendemos vinho diretamente — somos um marketplace que conecta você a comerciantes parceiros.'],
          ['2. Sua conta', 'Você precisa ter 18+ pra usar. Mantenha seus dados atualizados e a senha em segredo. Você é responsável pelo que publica.'],
          ['3. Conteúdo que você publica', 'Você mantém os direitos sobre suas fotos e textos. Ao publicar, você nos dá uma licença pra exibir esse conteúdo no app pros seus contatos e confrarias.'],
          ['4. Conduta', 'Sem spam, sem assédio, sem discurso de ódio, sem venda fora do marketplace, sem dados falsos. Quem desrespeita pode ser bloqueado ou ter conta removida.'],
          ['5. Privacidade', 'Tratamos seus dados segundo a LGPD. Detalhes na Política de Privacidade.'],
          ['6. Encerramento', 'Você pode desativar ou excluir sua conta a qualquer momento. A gente também pode encerrar contas que descumpram estes termos.'],
        ].map(([h, b]) => (
          <div key={h} style={{ marginTop: 20 }}>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 6 }}>{h}</div>
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.6 }}>{b}</div>
          </div>
        ))}
        <div style={{ marginTop: 28, padding: 14, background: T.c.n50, borderRadius: T.r.md }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: T.c.p700, fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: 0 }}>
            <Icon name="picture_as_pdf" size={18} color={T.c.p700}/>Baixar versão completa em PDF
          </button>
        </div>
      </div>
      <div style={{ height: 24 }}/>
    </CfgShell>
  );
}
function PoliticaPrivacidadeScreen({ go }) {
  return (
    <CfgShell title="Política de privacidade" onBack={() => go('back')}>
      <div style={{ background: T.c.n0, padding: 20 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 4 }}>LGPD · ATUALIZADO MAIO 2026</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.6 }}>
          A gente coleta o mínimo necessário pra fazer o app funcionar, e você é dono dos seus dados.
        </div>
        {[
          ['Quais dados coletamos', 'Cadastro (nome, e-mail, telefone); diário de vinhos; paladar; interações (likes, comentários); localização aproximada quando você dá permissão; dispositivo e versão do app.'],
          ['Pra que usamos', 'Pra rodar o app, recomendar vinhos pelo seu paladar, conectar você a confrarias e melhorar produto. Não vendemos seus dados.'],
          ['Com quem compartilhamos', 'Comerciantes parceiros (só ao concluir compra), processadores de pagamento, infra de nuvem. Listamos parceiros na seção "Subprocessadores".'],
          ['Seus direitos LGPD', 'Acesso, correção, portabilidade, exclusão, revogação de consentimento. Tudo disponível em Configurações → Privacidade.'],
          ['Cookies', 'Usamos cookies essenciais e de medição de uso (sem rastreamento de terceiros).'],
          ['Contato do DPO', 'dpo@tchintchin.app'],
        ].map(([h, b]) => (
          <div key={h} style={{ marginTop: 20 }}>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 6 }}>{h}</div>
            <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.6 }}>{b}</div>
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <Button variant="secondary" size="md" fullWidth leading={<Icon name="download" size={18}/>} onClick={() => go('toast', { kind: 'success', message: 'Pedido recebido. Enviaremos por e-mail em até 72h.' })}>
            Baixar meus dados (JSON)
          </Button>
        </div>
      </div>
      <div style={{ height: 24 }}/>
    </CfgShell>
  );
}

function BloqueadosScreen({ go }) {
  const [list, setList] = React.useState([
    { name: 'Diogo P.', when: 'há 3 meses' },
    { name: 'usuario_fake_12', when: 'há 1 mês' },
    { name: 'Roberto S.', when: 'há 2 semanas' },
  ]);
  return (
    <CfgShell title="Usuários bloqueados" onBack={() => go('back')}>
      <div style={{ padding: '16px 20px', ...T.t.body, color: T.c.n600, lineHeight: 1.5 }}>
        Pessoas bloqueadas não veem seu perfil, posts ou diário. Você também não vê nada delas.
      </div>
      <div style={{ background: T.c.n0 }}>
        {list.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Icon name="sentiment_satisfied" size={48} color={T.c.n400}/>
            <div style={{ ...T.t.body, color: T.c.n600, marginTop: 12 }}>Nenhuma pessoa bloqueada.</div>
          </div>
        ) : list.map((u, i) => (
          <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i === list.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
            <Avatar name={u.name} size={40}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{u.name}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>Bloqueado {u.when}</div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => { setList(l => l.filter(x => x.name !== u.name)); go('toast', { kind: 'success', message: `${u.name} desbloqueado.` }); }}>Desbloquear</Button>
          </div>
        ))}
      </div>
    </CfgShell>
  );
}

Object.assign(window, {
  CfgShell, CfgRow, CfgToggle, CfgGroup,
  ConfigNotifScreen, ConfigPrivacidadeScreen, ConfigContaScreen,
  TermosScreen, PoliticaPrivacidadeScreen, BloqueadosScreen,
});


export { BloqueadosScreen, CfgGroup, CfgRow, CfgShell, CfgToggle, ConfigContaScreen, ConfigNotifScreen, ConfigPrivacidadeScreen, ConfirmDeleteModal, PoliticaPrivacidadeScreen, TermosScreen };
