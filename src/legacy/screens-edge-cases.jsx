/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button, MatchBadge } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Edge Cases (5 telas)
//
//   37.01 erro-404           → conteúdo não encontrado
//   37.02 erro-permissao     → sem permissão pra ver
//   37.03 erro-sessao        → re-auth RARO (atualização/segurança/inatividade) — nunca logout de rotina
//   37.04 vinho-indisponivel → vinho fora do ar
//   37.05 erro-servidor      → 500 (algo deu errado do nosso lado)
// ─────────────────────────────────────────────────────────────

function EdgeShell({ children, onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {onBack && (
        <div style={{ padding: '8px 8px', flexShrink: 0 }}>
          <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow_back" size={24} color={T.c.n950}/>
          </button>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 24px' }}>
        {children}
      </div>
    </div>
  );
}

function EdgeIcon({ name, color = T.c.p700, bg = T.c.p50 }) {
  return (
    <div style={{
      width: 120, height: 120, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      position: 'relative', animation: 'tcDrawIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    }}>
      <Icon name={name} size={56} color={color}/>
    </div>
  );
}

// 37.01 ─────────────────────────────────────────────────
function Erro404Screen({ go }) {
  return (
    <EdgeShell onBack={() => go('back')}>
      {/* Visual 404 */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 96, fontWeight: 700, color: T.c.p100, lineHeight: 1, letterSpacing: '-0.04em' }}>404</div>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.c.p700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.el[3] }}>
            <Icon name="wine_bar" size={36} color={T.c.n0}/>
          </div>
        </div>
      </div>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Garrafa não encontrada</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 32, maxWidth: 320, lineHeight: 1.5 }}>
        Esse conteúdo foi removido, mudou de endereço ou nunca existiu. Acontece.
      </div>
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('home')}>Voltar pro início</Button>
        <Button variant="ghost" size="lg" fullWidth leading={<Icon name="search" size={18}/>} onClick={() => go('busca')}>Buscar outra coisa</Button>
      </div>
    </EdgeShell>
  );
}

// 37.02 ─────────────────────────────────────────────────
function ErroPermissaoScreen({ go }) {
  return (
    <EdgeShell onBack={() => go('back')}>
      <EdgeIcon name="lock" color={T.c.w700} bg={T.c.w100}/>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Conteúdo restrito</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 24, maxWidth: 320, lineHeight: 1.5 }}>
        Esta confraria é fechada. Pra ver os encontros, mural e fotos, você precisa ser membro.
      </div>
      <div style={{
        padding: 14, background: T.c.n50, borderRadius: T.r.md, marginBottom: 24, maxWidth: 320,
        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
      }}>
        <Avatar name="Carla Mendes" size={32} level="expert"/>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>Admin desta confraria</div>
          <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Carla Mendes</div>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="person_add" size={20}/>} onClick={() => go('toast', { kind: 'success', message: 'Pedido enviado pra admin.' })}>Pedir pra entrar</Button>
        <Button variant="secondary" size="lg" fullWidth leading={<Icon name="chat" size={18}/>} onClick={() => go('chat-conversa', { chat: { id: 'dm-carla', name: 'Carla Mendes', type: 'dm', level: 'expert' } })}>Mandar mensagem</Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('confrarias')}>Ver outras confrarias</Button>
      </div>
    </EdgeShell>
  );
}

// 37.03 ─────────────────────────────────────────────────
// Re-autenticação é EXCEÇÃO, não rotina. Somos uma rede social: o usuário fica
// sempre conectado e NUNCA é deslogado por "30 dias sem login". Só pedimos login
// de novo em casos raros, sempre com motivo claro. Gabriel decidiu.
//   reason: 'atualizacao' (default) | 'seguranca' | 'inatividade'
const SESSAO_REASON = {
  // Atualização grande que mexeu na autenticação — re-login único pós-update.
  atualizacao: {
    icon: 'system_update_alt', color: T.c.p700, bg: T.c.p50,
    title: 'Atualizamos o app',
    body: 'Fizemos uma atualização grande e, só desta vez, precisamos que você entre de novo. No dia a dia você fica sempre conectado.',
  },
  // Evento de segurança (atividade suspeita / troca de senha em outro aparelho).
  seguranca: {
    icon: 'verified_user', color: T.c.a700, bg: T.c.a100,
    title: 'Confirme que é você',
    body: 'Por precaução de segurança, encerramos a sessão neste aparelho. Entre de novo pra continuar protegido — isso é raro.',
  },
  // Inatividade extrema (meses sem abrir). Tom de boas-vindas, não de punição.
  inatividade: {
    icon: 'schedule', color: T.c.i700, bg: T.c.i100,
    title: 'Bom te ver de novo',
    body: 'Fazia bastante tempo sem acesso, então pedimos um login pra proteger sua conta. Normalmente você nunca é desconectado.',
  },
};

function ErroSessaoScreen({ go, params }) {
  const reason = (params && params.reason) || 'atualizacao';
  const cfg = SESSAO_REASON[reason] || SESSAO_REASON.atualizacao;
  return (
    <EdgeShell>
      <EdgeIcon name={cfg.icon} color={cfg.color} bg={cfg.bg}/>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>{cfg.title}</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 24, maxWidth: 320, lineHeight: 1.5 }}>
        {cfg.body}
      </div>
      <div style={{
        padding: 14, background: T.c.i100, borderRadius: T.r.md, marginBottom: 24, maxWidth: 320,
        display: 'flex', gap: 10, textAlign: 'left',
      }}>
        <Icon name="info" size={20} color={T.c.i700}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
          Seus rascunhos, registros offline e configurações continuam salvos. Nada se perde.
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('login')}>Entrar de novo</Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('recuperar-email')}>Esqueci a senha</Button>
      </div>
    </EdgeShell>
  );
}

// 37.04 ─────────────────────────────────────────────────
function VinhoIndisponivelScreen({ go, params }) {
  const wines = typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : [];
  const reason = (params && params.reason) || 'esgotado'; // 'esgotado' | 'removido' | 'regiao'
  const meta = {
    esgotado: {
      icon: 'production_quantity_limits',
      title: 'Esgotado no momento',
      desc: 'Esse vinho acabou. Quer ser avisado quando voltar?',
      primary: { label: 'Avisar quando voltar', icon: 'notifications_active', action: () => go('toast', { kind: 'success', message: 'Você será avisado.' }) },
    },
    removido: {
      icon: 'do_not_disturb',
      title: 'Vinho fora do catálogo',
      desc: 'O comerciante tirou esse vinho do ar. Podemos sugerir alternativas com perfil parecido.',
      primary: { label: 'Ver alternativas', icon: 'wine_bar', action: () => go('marketplace') },
    },
    regiao: {
      icon: 'public_off',
      title: 'Não vendemos na sua região',
      desc: 'Esse comerciante não entrega pra Brasília — DF. Quer ver outros vendedores?',
      primary: { label: 'Ver outros vendedores', icon: 'store', action: () => go('marketplace') },
    },
  }[reason];

  return (
    <EdgeShell onBack={() => go('back')}>
      <EdgeIcon name={meta.icon} color={T.c.n600} bg={T.c.n100}/>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>{meta.title}</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 24, maxWidth: 320, lineHeight: 1.5 }}>
        {meta.desc}
      </div>

      {/* Alternativas */}
      <div style={{ width: '100%', maxWidth: 360, marginBottom: 24 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10, textAlign: 'left' }}>── 3 ALTERNATIVAS PRO SEU PALADAR ──</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {wines.slice(0, 3).map(w => (
            <button key={w.id} onClick={() => go('wine', { wine: w })} style={{
              width: 140, flexShrink: 0, padding: 10, background: T.c.n0, border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left',
            }}>
              <BottlePlaceholder width={50} height={70} label=""/>
              <div style={{ ...T.t.caption, color: T.c.n950, fontWeight: 700, marginTop: 8, lineHeight: 1.3, height: 32, overflow: 'hidden' }}>{w.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <MatchBadge score={w.match || 84} variant="pill" size="sm"/>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name={meta.primary.icon} size={20}/>} onClick={meta.primary.action}>
          {meta.primary.label}
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('back')}>Voltar</Button>
      </div>
    </EdgeShell>
  );
}

// 37.05 ─────────────────────────────────────────────────
function ErroServidorScreen({ go }) {
  const [retrying, setRetrying] = React.useState(false);
  return (
    <EdgeShell>
      <EdgeIcon name="cloud_off" color={T.c.e700} bg={T.c.e100}/>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Algo deu errado</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 8, maxWidth: 320, lineHeight: 1.5 }}>
        Foi do nosso lado, não seu. Nosso time já recebeu o alerta.
      </div>
      <div style={{
        padding: '6px 10px', background: T.c.n100, borderRadius: T.r.full,
        ...T.t.caption, color: T.c.n600, fontFamily: T.mono, fontWeight: 700, marginBottom: 28,
      }}>Erro #5xc1 · 22:47</div>

      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="refresh" size={20}/>}
          loading={retrying}
          onClick={() => {
            setRetrying(true);
            setTimeout(() => { setRetrying(false); go('home'); }, 1400);
          }}>
          Tentar de novo
        </Button>
        <Button variant="secondary" size="lg" fullWidth leading={<Icon name="support_agent" size={18}/>} onClick={() => go('suporte-contato', { topic: 'bug' })}>
          Reportar o problema
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('home')}>Voltar pro início</Button>
      </div>

      <div style={{ marginTop: 24, ...T.t.caption, color: T.c.n600, maxWidth: 320, lineHeight: 1.5 }}>
        Se acontecer de novo, pode ser problema de rede. Tenta sair e voltar do app.
      </div>
    </EdgeShell>
  );
}

Object.assign(window, {
  EdgeShell, EdgeIcon,
  Erro404Screen, ErroPermissaoScreen, ErroSessaoScreen,
  VinhoIndisponivelScreen, ErroServidorScreen,
});


export { EdgeIcon, EdgeShell, Erro404Screen, ErroPermissaoScreen, ErroServidorScreen, ErroSessaoScreen, VinhoIndisponivelScreen };
