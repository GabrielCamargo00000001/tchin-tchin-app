/* eslint-disable */
// @ts-nocheck
// Tela "Perfil eu" — rota dedicada (decisão Gabriel, junho/2026)
// Substituiu o ProfileDrawer como destino canônico de "abrir meu perfil".
// O ProfileDrawer ainda existe (compat: tap no avatar do topo abre o drawer
// como atalho), mas a rota cheia é a fonte de verdade pra editar/navegar.
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_EVENTS } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

function PerfilEuScreen({ go, ctx }) {
  const [showLogout, setShowLogout] = React.useState(false);
  const sections = [
    { title: 'Atividade', items: [
      { icon: 'auto_stories', label: `Meu diário (${ctx.diary.length})`, onClick: () => go('adega') },
      { icon: 'event',        label: 'Meus eventos',          onClick: () => go('event-detalhe', { event: MOCK_EVENTS[0] }) },
      { icon: 'favorite',     label: 'Favoritos',             onClick: () => go('favoritos') },
      { icon: 'bookmark_added', label: 'Wishlist',            onClick: () => go('lista-desejos') },
      { icon: 'group',        label: 'Seguindo / Seguidores', onClick: () => go('perfil-seguindo') },
      { icon: 'rocket_launch',label: 'Minha jornada',         onClick: () => go('jornada') },
      { icon: 'redeem',       label: 'Meus pontos',           onClick: () => go('pontos') },
      { icon: 'emoji_events', label: 'Desafios da semana',    onClick: () => go('desafio-detalhe') },
      { icon: 'workspace_premium', label: 'Minhas conquistas', onClick: () => go('badges-galeria') },
      { icon: 'leaderboard',  label: 'Ranking da confraria',  onClick: () => go('ranking') },
      { icon: 'chat',         label: 'Mensagens',             onClick: () => go('chat-lista') },
      { icon: 'person_search',label: 'Buscar usuários',       onClick: () => go('busca') },
    ]},
    { title: 'Aprender & descobrir', items: [
      { icon: 'fitness_center',  label: 'Treine seu Paladar',       onClick: () => go('treino-paladar') },
      { icon: 'menu_book',       label: 'Aprenda',                  onClick: () => go('aprenda') },
      { icon: 'restaurant',      label: 'Harmoniza Pra Mim',        onClick: () => go('harmoniza') },
      { icon: 'menu_open',       label: 'Modo Restaurante (carta)', onClick: () => go('modo-restaurante') },
      { icon: 'qr_code_scanner', label: 'Escanear rótulo',          onClick: () => go('scanner-v2') },
      { icon: 'science',         label: 'Calibrar paladar (5 vinhos)', onClick: () => go('calibracao') },
      { icon: 'insights',        label: 'Relatório do mês',         onClick: () => go('relatorio-mensal') },
      { icon: 'verified',        label: 'Vire Expert',              onClick: () => go('expert-virar') },
      { icon: 'forum',           label: 'Perguntar pra Expert',     onClick: () => go('perguntar-expert') },
    ]},
    { title: 'Marketplace', items: [
      { icon: 'shopping_cart',label: 'Meu carrinho',            onClick: () => go('carrinho') },
      { icon: 'tune',         label: 'Filtros avançados',       onClick: () => go('filtros-avancados') },
    ]},
    { title: 'Convites', items: [
      { icon: 'celebration',  label: 'Convidar amigos pro Tchin Tchin', onClick: () => go('indicacao-landing') },
      { icon: 'redeem',       label: 'Minhas recompensas',              onClick: () => go('indicacao-recompensas') },
      { icon: 'group_add',    label: 'Convidar pra uma confraria',      onClick: () => go('confraria-convidar', { confraria: { name: 'Tchin Tchin' } }) },
    ]},
    { title: 'Suporte', items: [
      { icon: 'help_outline', label: 'Dúvidas frequentes',   onClick: () => go('suporte-faq') },
      { icon: 'auto_awesome', label: 'Tutoriais do Tchin',     onClick: () => go('tutoriais') },
      { icon: 'chat_bubble_outline', label: 'Falar com o suporte', onClick: () => go('suporte-contato') },
    ]},
    { title: 'Configurações', items: [
      { icon: 'edit',                label: 'Editar perfil',       onClick: () => go('editar-perfil') },
      { icon: 'notifications_active',label: 'Ligar notificações',  onClick: () => go('push-primer') },
      { icon: 'notifications_none',  label: 'Canais de notificação', onClick: () => go('config-notif') },
      { icon: 'lock_outline',        label: 'Privacidade e dados', onClick: () => go('config-privacidade') },
      { icon: 'manage_accounts',     label: 'Conta',               onClick: () => go('config-conta') },
      { icon: 'block',               label: 'Usuários bloqueados', onClick: () => go('config-bloqueados') },
      { icon: 'description',         label: 'Termos e Privacidade', onClick: () => go('termos') },
    ]},
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      {/* Header da rota — back + título */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px 8px 4px',
        background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0,
      }}>
        <button onClick={() => go('back')} aria-label="Voltar" style={{
          width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrow_back" size={24} color={T.c.n950}/></button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Você</div>
        <button onClick={() => go('editar-perfil')} aria-label="Editar perfil" style={{
          width: 40, height: 40, background: T.c.n50, border: 'none', borderRadius: T.r.full,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4,
        }}>
          <Icon name="edit" size={18} color={T.c.p700}/>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Identity card destacado */}
        <div style={{
          padding: '24px 20px',
          background: `linear-gradient(160deg, ${T.c.p50} 0%, ${T.c.n0} 100%)`,
          borderBottom: `1px solid ${T.c.n200}`,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
        }}>
          <Avatar name={ctx.user.name} size={80} level={ctx.user.level}/>
          <div style={{ ...T.t.h1, color: T.c.n950, marginTop: 10, fontFamily: '"Fraunces", Georgia, serif' }}>{ctx.user.name}</div>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>{ctx.user.level} · {ctx.user.city}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, width: '100%' }}>
            <Button variant="primary" size="sm" onClick={() => go('editar-perfil')}>
              Editar perfil
            </Button>
            <Button variant="ghost" size="sm" onClick={() => go('badges-galeria')}>
              Conquistas
            </Button>
            <Button variant="ghost" size="sm" onClick={() => go('pontos')}>
              Pontos
            </Button>
          </div>
        </div>

        {/* Sections — mesmas categorias do drawer antigo */}
        <div style={{ padding: '8px 0' }}>
          {sections.map(s => (
            <div key={s.title} style={{ marginBottom: 8 }}>
              <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── {s.title} ──</div>
              {s.items.map(item => (
                <button key={item.label} onClick={item.onClick} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: T.c.n800, fontFamily: T.font, fontSize: 15, fontWeight: 500, width: '100%',
                }}>
                  <Icon name={item.icon} size={22} color={T.c.n800}/>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <Icon name="chevron_right" size={20} color={T.c.n400}/>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer — Sair + Excluir */}
        <div style={{ borderTop: `1px solid ${T.c.n200}`, padding: '12px 20px 4px', marginTop: 8 }}>
          <button onClick={() => setShowLogout(true)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.n800, fontFamily: T.font, fontSize: 15, fontWeight: 600,
          }}><Icon name="logout" size={20} color={T.c.n800}/>Sair</button>
        </div>
        <div style={{ padding: '4px 20px 32px' }}>
          <button onClick={() => go('conta-excluida')} style={{
            width: '100%', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.e700, fontFamily: T.font, fontSize: 13, fontWeight: 600,
            textDecoration: 'underline',
          }}>Excluir conta</button>
        </div>
      </div>

      {showLogout && (
        <div onClick={() => setShowLogout(false)} style={{
          position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 80,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          animation: 'tcFadeIn 180ms',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.c.n0, borderRadius: T.r.xl, padding: 24,
            width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column',
            boxShadow: '0 12px 24px rgba(0,0,0,0.18)',
            animation: 'tcPopIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: T.r.full, background: T.c.p50,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <Icon name="logout" size={24} color={T.c.p700}/>
            </div>
            <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 6 }}>Sair do aplicativo</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 20, lineHeight: 1.5 }}>
              Deseja realmente sair? Você vai precisar entrar de novo pra acessar seu diário e confrarias.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button variant="destructive" size="lg" fullWidth onClick={() => {
                setShowLogout(false);
                go('welcome');
                setTimeout(() => go('toast', { variant: 'success', message: 'Você saiu da sua conta.' }), 100);
              }}>Sim, desejo sair</Button>
              <Button variant="ghost" size="lg" fullWidth onClick={() => setShowLogout(false)}>Quero permanecer logado</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { PerfilEuScreen };
