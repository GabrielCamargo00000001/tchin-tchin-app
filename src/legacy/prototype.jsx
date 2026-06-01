/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { FAB } from './cards.jsx';
import { AppHeader, BottomNav, Button, Toast } from './components.jsx';
import { MOCK_EVENTS, MOCK_POSTS, MOCK_USER, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { RelatorioMensal } from './f17_04_RelatorioMensal.jsx';
import { RegistroRapido } from './f18_01_RegistroRapido.jsx';
import { RegistroCompleto } from './f18_02_RegistroCompleto.jsx';
import { ConfirmacaoRegistro } from './f18_03_ConfirmacaoRegistro.jsx';
import { SecaoAprenda } from './f19_03_SecaoAprenda.jsx';
import { DetalheCard } from './f19_04_DetalheCard.jsx';
import { Scanner } from './f20_01_Scanner.jsx';
import { ResultadoScan } from './f20_02_ResultadoScan.jsx';
import { FallbackScanner } from './f20_03_FallbackScanner.jsx';
import { DetalheDesafio } from './f22_02_DetalheDesafio.jsx';
import { RankingConfraria } from './f22_03_RankingConfraria.jsx';
import { ModoRestaurante } from './f23_01_ModoRestaurante.jsx';
import { CartaMatches } from './f23_02_CartaMatches.jsx';
import { PorQueCombina } from './f23_03_PorQueCombina.jsx';
import { HarmonizaPrato } from './f23_04_HarmonizaPrato.jsx';
import { HarmonizaResultados } from './f23_05_HarmonizaResultados.jsx';
import { CalibracaoCincoVinhos } from './f23_07_CalibracaoCincoVinhos.jsx';
import { RegisterConsumoScreen } from './screen-register.jsx';
import { AdegaVazia } from './screens-adega-first.jsx';
import { AdegaScreen, BuscaScreen, ComunidadeScreen, ConfrariasScreen, FavoritosScreen, PerfilOutroScreen, PostDetailScreen } from './screens-app.jsx';
import { CadastroScreen, LoginScreen, OnboardingScreen, RecuperarSenhaScreen, WelcomeScreen } from './screens-auth.jsx';
import { BadgesGaleriaScreen } from './screens-badges-galeria.jsx';
import { ChatConversaScreen, ChatListaScreen } from './screens-chat.jsx';
import { CarrinhoScreen, EnderecoScreen, PagamentoScreen, PedidoConfirmadoScreen } from './screens-checkout.jsx';
import { BloqueadosScreen, ConfigContaScreen, ConfigNotifScreen, ConfigPrivacidadeScreen, ContaDesativadaScreen, ContaExcluidaScreen, PoliticaPrivacidadeScreen, TermosScreen } from './screens-config-detalhe.jsx';
import { PreviewConfrariaPrivada, PreviewConfrariaPublica, PreviewEventosDescobrir, PreviewEventosDescobrirEmpty, PreviewEventosMeus, PreviewModalParticiparPrivada, PreviewModalParticiparPublica } from './preview-eventos.jsx';
import { ConfrariaConfigScreen, ConfrariaConvidarScreen, ConfrariaRegrasScreen, ConfrariaSairScreen, ConfrariaTransferirScreen } from './screens-confraria-full.jsx';
import { ConfrariaDetalheScreen } from './screens-confraria.jsx';
import { ComentariosScreen, CriarMomentoScreen, CriarPostScreen } from './screens-criar-post.jsx';
import { DescobrirHomeFirstTime } from './screens-descobrir-first.jsx';
import { DescobrirHome, MarketplaceScreen, ScannerResultScreen, ScannerScreen, WineDetailScreen } from './screens-descobrir.jsx';
import { Erro404Screen, ErroPermissaoScreen, ErroServidorScreen, ErroSessaoScreen, VinhoIndisponivelScreen } from './screens-edge-cases.jsx';
import { EditarPerfilFotoScreen, EditarPerfilPaladarScreen, EditarPerfilPrivacidadeScreen, EditarPerfilScreen } from './screens-editar-perfil.jsx';
import { EventDetalheScreen } from './screens-event-detalhe.jsx';
import { WizardCriarEventoP1Screen } from './screens-event-wizard-p1.jsx';
import { WizardCriarEventoP2Screen } from './screens-event-wizard-p2.jsx';
import { WizardCriarEventoP3Screen } from './screens-event-wizard-p3.jsx';
import { WizardCriarEventoP4Screen } from './screens-event-wizard-p4.jsx';
import { WizardCriarEventoP5Screen } from './screens-event-wizard-p5.jsx';
import { ExpertAplicarScreen, ExpertPendenteScreen, ExpertQAScreen, ExpertResponderScreen, ExpertVirarScreen, PerguntarExpertScreen } from './screens-expert.jsx';
import { FeedFirstTime, readFeedFirstState } from './screens-feed-first.jsx';
import { ConviteRecebidoScreen, IndicacaoCompartilharScreen, IndicacaoLandingScreen, IndicacaoMeusConvitesScreen, IndicacaoRecompensasScreen } from './screens-indicacao.jsx';
import { ConfrariaApresentarScreen, ConfrariaTourRapidoScreen, ConfrariaWelcomeScreen, JornadaCelebrarScreen, JornadaScreen, PontosScreen, PushCanaisScreen, PushNegadoScreen, PushPreviewScreen, PushPrimerScreen } from './screens-jornada-extras.jsx';
import { CompararVinhosScreen, FiltrosAvancadosScreen, ListaDesejosScreen } from './screens-marketplace-pro.jsx';
import { Notificacoes } from './screens-notificacoes.jsx';
import { NudgeD14Screen, NudgeD1Screen, NudgeD3Screen, NudgeD7Screen } from './screens-nudges.jsx';
import { OfflineBanner } from './screens-offline-state.jsx';
import { LoginSocialScreen } from './screens-onboarding-alt.jsx';
import { CelebrationToast, TOUR_STEPS, TutorialTooltip, WelcomeFinalScreen, readTourState, writeTourState } from './screens-onboarding-final.jsx';
import { EventoEditarScreen, EventoPosAtaScreen, EventoPosAvaliarScreen, EventoPresencaScreen } from './screens-organizador.jsx';
import { PerfilAtividadePublicaScreen, PerfilCompararPaladarScreen, PerfilSeguidoresScreen, PerfilSeguindoScreen, PerfilSugestoesScreen, PerfilVinhosProvadosScreen } from './screens-perfil-publico.jsx';
import { PlusOneScreen } from './screens-plus-one.jsx';
import { InteressesScreen, QuizNivelScreen } from './screens-quiz-nivel.jsx';
import { GpsNegadoScreen, GpsPrimerScreen, QuizResultScreen, QuizScreen, TelaIntencaoScreen } from './screens-quiz.jsx';
import { RecuperarEmailScreen, RecuperarEnviadoScreen, RecuperarOtpScreen, RecuperarRedefinirScreen, RecuperarSucessoScreen } from './screens-recuperar-senha.jsx';
import { VoceVeioNoLugarCertoScreen } from './screens-rota-b.jsx';
import { SuporteContatoScreen, SuporteFaqScreen } from './screens-suporte.jsx';
import { TchinTutor, TutoriaisHubScreen, getTutorial, isTutorDone } from './screens-tutor.jsx';
import { WizardCriarConfrariaP2Screen } from './screens-wizard-confraria-p2.jsx';
import { WizardCriarConfrariaP3Screen } from './screens-wizard-confraria-p3.jsx';
import { WizardCriarConfrariaP4Screen } from './screens-wizard-confraria-p4.jsx';
import { WizardCriarConfrariaP5Screen } from './screens-wizard-confraria-p5.jsx';
import { BoraMarcarPrimeiroEncontroScreen } from './screens-wizard-confraria-p6.jsx';
import { WizardCriarConfrariaP1Screen } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';
import { TchinOnboarding } from './onboarding-manager.js';
import { TreinoPaladarHome, TreinoLicaoScreen, TreinoLigaScreen, TreinoAprenderScreen } from './screens-treino-paladar.jsx';

// Tchin Tchin — Interactive Prototype Shell (Android frame + navigation)

function StatusBar() {
  return (
    <div style={{
      height: 28, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 16px',
      background: T.c.p700, color: T.c.n0, fontFamily: T.font,
      fontSize: 13, fontWeight: 600,
    }}>
      <span>9:30</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="signal_cellular_alt" size={14}/>
        <Icon name="wifi" size={14}/>
        <Icon name="battery_full" size={14}/>
      </div>
    </div>
  );
}
function NavBar() {
  return (
    <div style={{ height: 18, background: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 108, height: 4, borderRadius: 2, background: T.c.n800, opacity: 0.4 }}/>
    </div>
  );
}

// ─── App orchestrator ─────────────────────────────────────
// Modo captura/dev: ?screen=<rota>&tab=<aba> abre direto numa tela (p/ screenshots da spec).
function shotParams(screen) {
  const W = (typeof MOCK_WINES !== 'undefined' && MOCK_WINES) || [];
  const E = (typeof MOCK_EVENTS !== 'undefined' && MOCK_EVENTS) || [];
  const P = (typeof MOCK_POSTS !== 'undefined' && MOCK_POSTS) || [];
  return ({
    'wine': { wine: W[0] }, 'comparar-vinhos': { wines: [W[0], W[1]] },
    'event-detalhe': { event: E[0] }, 'evento-editar': { event: E[0] }, 'evento-presenca': { event: E[0] }, 'evento-pos-avaliar': { event: E[0] }, 'evento-pos-ata': { event: E[0] },
    'post-detail': { post: P[0] }, 'comentarios': { post: P[0] },
    'treino-licao': { lessonId: 'licao-01-tanino' },
    'chat-conversa': { chat: { id: 'c1', name: 'Confraria do Vinho', type: 'group', members: 8 } },
    'harmoniza-resultados': { prato: 'Picanha grelhada' },
  })[screen] || {};
}
function TchinApp({ initialScreen = 'onboarding' }) {
  const __q = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const __ss = __q.get('screen'); const __st = __q.get('tab'); const __si = __q.get('intent'); const __sr = __q.get('reason'); const __sk = __q.get('kind'); const __sstate = __q.get('state');
  const __params = __ss ? shotParams(__ss) : {};
  if (__si) { __params.intent = __si; try { window.__tcLastIntent = __si; } catch (e) {} } // capture-mode: ?intent= injeta o intent (gps-primer narrativas + welcome-final copy)
  if (__sr) { __params.reason = __sr; } // capture-mode: ?reason= injeta o motivo (erro-sessao, vinho-indisponivel, etc.)
  if (__sk) { __params.kind = __sk; } // capture-mode: ?kind= injeta o tipo de celebração (jornada-celebrar)
  if (__sstate) { __params.state = __sstate; } // capture-mode: ?state= injeta o estado (desafio-detalhe: active/done/expired)
  const [stack, setStack] = React.useState([{ screen: __ss || initialScreen, params: __params }]);
  const [tab, setTab] = React.useState(__st || 'descobrir');
  const [toast, setToast] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  // Tutorial overlay state — active tutorial id or null
  const [activeTutorial, setActiveTutorial] = React.useState(null);
  // Tour state — step 0..3 or null. Resumes from localStorage on mount.
  const [tour, setTour] = React.useState(() => {
    const persisted = (typeof readTourState === 'function') ? readTourState() : null;
    return persisted; // { destination, step } | null
  });
  const [celebrate, setCelebrate] = React.useState(false);
  const [ctx, setCtx] = React.useState({
    user: MOCK_USER,
    diary: [
      { wine: MOCK_WINES[0], date: '2026-05-08', rating: 5, occasion: 'Confraria', note: 'Carne na brasa do Diego. Casamento perfeito.' },
      { wine: MOCK_WINES[6], date: '2026-05-05', rating: 4, occasion: 'Jantar' },
      { wine: MOCK_WINES[3], date: '2026-04-28', rating: 3, occasion: 'Sozinha', note: 'Bom pro preço. Sem grandes surpresas.' },
    ],
    favorites: [MOCK_WINES[0], MOCK_WINES[1]],
    online: true,
  });
  const [syncing, setSyncing] = React.useState(false);

  const toggleOnline = () => {
    setCtx(c => {
      const goingOnline = !c.online;
      if (goingOnline) {
        const pending = c.diary.filter(e => e._pending);
        if (pending.length > 0) {
          setSyncing(true);
          setTimeout(() => {
            setCtx(c2 => ({ ...c2, diary: c2.diary.map(e => ({ ...e, _pending: false })) }));
            setSyncing(false);
            setToast({ kind: 'success', message: `${pending.length} ${pending.length === 1 ? 'registro sincronizado' : 'registros sincronizados'}.` });
            setTimeout(() => setToast(null), 2800);
          }, 1400);
        }
      }
      return { ...c, online: goingOnline };
    });
  };

  // Block network-only actions: scanner, marketplace browse
  const requiresNetwork = (action) => {
    if (!ctx.online) {
      setToast({ kind: 'warning', message: 'Disponível quando você estiver online.' });
      setTimeout(() => setToast(null), 2400);
      return true;
    }
    return false;
  };

  const current = stack[stack.length - 1];

  // Keep the onboarding coordinator in sync with the shell-level overlays so
  // screen-level overlays (e.g. the post-creation tutorial) can suppress them.
  React.useEffect(() => {
    if (tour) TchinOnboarding.claim('tour'); else TchinOnboarding.release('tour');
    return () => TchinOnboarding.release('tour');
  }, [tour]);
  React.useEffect(() => {
    if (activeTutorial) TchinOnboarding.claim('tutor'); else TchinOnboarding.release('tutor');
    return () => TchinOnboarding.release('tutor');
  }, [activeTutorial]);

  // Expõe o paladar atual pra fluxos fora do ctx (ex.: sugestão automática de
  // vinhos no wizard de evento, #8).
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.__tcUserPaladar = ctx.user && ctx.user.paladar;
  }, [ctx.user]);

  // Auto-fire tutorial on certain screens (first time only).
  // Note: the create-confraria/create-event screens are intentionally omitted —
  // the richer post-creation tutorial (TutorialPosCriacao) covers those, and we
  // don't want two onboarding overlays stacking. The central coordinator is
  // re-checked at fire time so a higher-priority overlay always wins.
  React.useEffect(() => {
    if (activeTutorial) return; // already running
    if (tour) return; // the guided tour has priority
    if (typeof isTutorDone !== 'function') return;
    const map = {
      'harmoniza':       'harmoniza',
      'modo-restaurante':'modo-restaurante',
      'scanner':         'scanner',
      'scanner-v2':      'scanner',
      'confraria-detalhe':'confraria-usar',
      'event-detalhe':    'evento-usar',
      'marketplace':      'marketplace',
      'jornada':          'jornada',
      'indicacao-landing':'indicacao',
      'badges-galeria':   'badges',
    };
    const fire = (id) => {
      // Re-check at fire time: a higher-priority onboarding (post-creation
      // tutorial, tour) may have claimed the slot since we scheduled this.
      if (TchinOnboarding.isBlocked('tutor')) return;
      if (typeof window !== 'undefined' && window.__tcShouldShowBrotherhoodTutorial) return;
      setActiveTutorial(id);
    };
    const tutId = map[current.screen];
    if (tutId && !isTutorDone(tutId)) {
      // Defer slightly so the target screen (and any overlay it owns) mounts first
      const t = setTimeout(() => fire(tutId), 360);
      return () => clearTimeout(t);
    }
    // Adega: o onboarding agora é inline na Estante interativa (sem overlay),
    // então não disparamos mais o tutorial 'adega' aqui.
  }, [current.screen, tab, activeTutorial, tour, ctx.diary]);

  // Telas de fluxo único (onboarding, login, quiz, GPS, nudges): o "voltar"
  // nunca deve cair nelas vindo de uma tela real do app. Dentro do próprio
  // onboarding, o voltar entre as etapas continua normal.
  const BACK_SKIP = new Set([
    'welcome', 'onboarding', 'login', 'cadastro',
    'recuperar', 'recuperar-email', 'recuperar-enviado', 'recuperar-otp', 'recuperar-redefinir', 'recuperar-sucesso',
    'login-social',
    'quiz', 'quiz-nivel', 'quiz-interesses', 'quiz-result',
    'tela-intencao', 'gps-primer', 'gps-negado', 'welcome-final',
    'confraria-welcome', 'confraria-apresentar', 'confraria-tour-rapido',
    'nudge-d1', 'nudge-d3', 'nudge-d7', 'nudge-d14',
  ]);

  const go = (screen, params = {}) => {
    if (screen === 'back') {
      setStack(s => {
        if (s.length <= 1) return s;
        const leaving = s[s.length - 1].screen;
        let next = s.slice(0, -1);
        // Vindo de uma tela real do app, pula telas de fluxo único que
        // ficaram na pilha (ex.: quiz aberto pelo Marketplace).
        if (!BACK_SKIP.has(leaving)) {
          while (next.length > 1 && BACK_SKIP.has(next[next.length - 1].screen)) {
            next = next.slice(0, -1);
          }
          // Se só sobrou tela de fluxo único, cai na home.
          if (BACK_SKIP.has(next[next.length - 1].screen)) {
            return [{ screen: 'home', params: {} }];
          }
        }
        return next;
      });
      return;
    }
    if (screen === 'toast') {
      setToast(params);
      setTimeout(() => setToast(null), 2400);
      return;
    }
    // tab destinations
    const tabMap = { descobrir: 'descobrir', adega: 'adega', comunidade: 'comunidade', confrarias: 'confrarias' };
    if (tabMap[screen]) {
      setTab(tabMap[screen]);
      setStack([{ screen: 'home', params: {} }]);
      return;
    }
    if (screen === 'home') {
      setStack([{ screen: 'home', params }]);
      return;
    }
    setStack(s => [...s, { screen, params }]);
  };

  // Decide what to render
  const isAppScreen = ['home', 'wine', 'marketplace', 'scanner'].includes(current.screen);
  const hideChrome = [
    'welcome', 'onboarding', 'login', 'cadastro', 'recuperar',
    'recuperar-email', 'recuperar-enviado', 'recuperar-otp', 'recuperar-redefinir', 'recuperar-sucesso',
    'quiz', 'quiz-nivel', 'quiz-interesses', 'quiz-result',
    'tela-intencao', 'gps-primer', 'gps-negado', 'welcome-final',
    'wizard-confraria-1', 'wizard-confraria-2', 'wizard-confraria-3',
    'wizard-confraria-4', 'wizard-confraria-5', 'wizard-confraria-6',
    'event-wizard-1', 'event-wizard-2', 'event-wizard-3',
    'event-wizard-4', 'event-wizard-5',
    'nudge-d1', 'nudge-d3', 'nudge-d7', 'nudge-d14',
    'plus-one',
    'aprender', 'aprenda', 'aprenda-detalhe',
    'relatorio-mensal',
    'registro-rapido', 'registro-completo', 'registro-confirmacao',
    'harmoniza', 'harmoniza-resultados',
    'modo-restaurante', 'carta-matches', 'porque-combina',
    'scanner-v2', 'scanner-result-v2', 'scanner-fallback',
    'desafio-detalhe', 'ranking', 'calibracao', 'event-detalhe',
    'scanner', 'post-detail', 'busca',
    'perfil-outro', 'confraria-detalhe', 'register-consumo', 'favoritos',
    // Novos fluxos
    'editar-perfil', 'editar-perfil-foto', 'editar-perfil-paladar', 'editar-perfil-privacidade',
    'config-notif', 'config-privacidade', 'config-conta', 'config-bloqueados', 'conta-desativada', 'conta-excluida',
    'termos', 'politica-privacidade',
    'suporte-faq', 'suporte-contato',
    'confraria-config', 'confraria-convidar', 'confraria-sair', 'confraria-transferir', 'confraria-regras',
    'evento-editar', 'evento-presenca', 'evento-pos-avaliar', 'evento-pos-ata',
    'criar-post', 'criar-momento', 'comentarios',
    'chat-lista', 'chat-conversa',
    'badges-galeria',
    'carrinho', 'endereco', 'pagamento', 'pedido-confirmado',
    'notificacoes',
    // Onboarding alternativo (34.x)
    'login-social',
    // Expert (35.x)
    'expert-virar', 'expert-aplicar', 'expert-pendente', 'expert-q-a', 'expert-responder', 'perguntar-expert',
    // Marketplace pro (36.x)
    'filtros-avancados', 'lista-desejos', 'comparar-vinhos',
    // Edge cases (37.x)
    'erro-404', 'erro-permissao', 'erro-sessao', 'vinho-indisponivel', 'erro-servidor',
    // Tutoriais hub (35.x)
    'tutoriais',
    // Perfil avançado (38.x)
    'perfil-seguidores', 'perfil-seguindo', 'perfil-atividade-publica',
    'perfil-vinhos-provados', 'perfil-sugestoes', 'perfil-comparar-paladar',
    // Indicação (39.x)
    'indicacao-landing', 'indicacao-compartilhar', 'indicacao-meus-convites',
    'indicacao-recompensas', 'convite-recebido',
    // Confraria welcome (40.x)
    'confraria-welcome', 'confraria-apresentar', 'confraria-tour-rapido',
    // Push setup (41.x)
    'push-primer', 'push-negado', 'push-canais', 'push-preview',
    // Jornada (42.x)
    'jornada', 'jornada-celebrar', 'pontos',
    // Previews M11/M12 (full-screen mockups com chrome próprio)
    'prev-eventos-meus', 'prev-eventos-descobrir', 'prev-eventos-descobrir-empty',
    'prev-confraria-publica', 'prev-confraria-privada',
    'prev-modal-publica', 'prev-modal-privada',
    // Treine seu Paladar (feature)
    'treino-paladar', 'treino-licao', 'treino-liga', 'treino-aprender',
  ].includes(current.screen);

  const renderScreen = () => {
    switch (current.screen) {
      case 'onboarding':    return <OnboardingScreen go={go}/>;
      case 'welcome':       return <WelcomeScreen go={go}/>;
      case 'login':         return <LoginScreen go={go}/>;
      case 'cadastro':      return <CadastroScreen go={go}/>;
      case 'recuperar':     return <RecuperarSenhaScreen go={go}/>;
      case 'quiz':          return <QuizScreen go={go} params={current.params}/>;
      case 'quiz-nivel':    return <QuizNivelScreen go={go}/>;
      case 'quiz-interesses': return <InteressesScreen go={go} params={current.params}/>;
      case 'quiz-result':   return <QuizResultScreen go={go} params={current.params}/>;
      case 'tela-intencao': return <TelaIntencaoScreen go={go} params={current.params}/>;
      case 'gps-primer':    return <GpsPrimerScreen go={go} params={current.params}/>;
      case 'gps-negado':    return <GpsNegadoScreen go={go} params={current.params}/>;
      case 'welcome-final': return <WelcomeFinalScreen go={go} ctx={ctx} setCtx={setCtx} startTour={({ destination, step }) => setTour({ destination, step })}/>;
      // ── Wizard Criar Confraria (08.x) ─────────────────────
      case 'wizard-confraria-1': return <WizardCriarConfrariaP1Screen go={go} ctx={ctx} params={current.params}/>;
      case 'wizard-confraria-2': return <WizardCriarConfrariaP2Screen go={go} params={current.params}/>;
      case 'wizard-confraria-3': return <WizardCriarConfrariaP3Screen go={go} params={current.params}/>;
      case 'wizard-confraria-4': return <WizardCriarConfrariaP4Screen go={go} ctx={ctx} params={current.params}/>;
      case 'wizard-confraria-5': return <WizardCriarConfrariaP5Screen go={go} params={current.params}/>;
      case 'wizard-confraria-6': return <BoraMarcarPrimeiroEncontroScreen go={go} setCtx={setCtx} ctx={ctx} params={current.params}/>;
      // ── Wizard Criar Evento (09.x) ────────────────────────
      case 'event-wizard-1': return <WizardCriarEventoP1Screen go={go} params={current.params}/>;
      case 'event-wizard-2': return <WizardCriarEventoP2Screen go={go} params={current.params}/>;
      case 'event-wizard-3': return <WizardCriarEventoP3Screen go={go} params={current.params}/>;
      case 'event-wizard-4': return <WizardCriarEventoP4Screen go={go} params={current.params}/>;
      case 'event-wizard-5': return <WizardCriarEventoP5Screen go={go} params={current.params}/>;
      // ── Nudges pós-criação (10.02–10.05) ──────────────────
      case 'nudge-d1':  return <NudgeD1Screen  go={go} params={current.params}/>;
      case 'nudge-d3':  return <NudgeD3Screen  go={go} params={current.params}/>;
      case 'nudge-d7':  return <NudgeD7Screen  go={go} params={current.params}/>;
      case 'nudge-d14': return <NudgeD14Screen go={go} params={current.params}/>;
      case 'plus-one':  return <PlusOneScreen  go={go} params={current.params}/>;
      case 'aprender':      return <VoceVeioNoLugarCertoScreen go={go} userLevel={(typeof window !== 'undefined' && window.__tcUserLevel) || ctx.user.level || 'iniciante'} onStartLearning={() => go('aprenda')} onCalibratePaladar={() => go('quiz')} params={current.params}/>;
      case 'aprenda':       return <SecaoAprenda userLevel={(typeof window !== 'undefined' && window.__tcUserLevel) || ctx.user.level || 'iniciante'} onBack={() => go('back')} onOpenArticle={(a) => go('aprenda-detalhe', { article: a })}/>;
      case 'aprenda-detalhe': return <DetalheCard article={(current.params && current.params.article) || {}} onBack={() => go('back')} onTapWine={(w) => go('wine', { wine: w })} onTapArticle={(a) => go('aprenda-detalhe', { article: a })} onShare={() => go('toast', { variant: 'info', message: 'Compartilhado!' })}/>;
      case 'relatorio-mensal': return <RelatorioMensal data={(current.params && current.params.data) || undefined} onClose={() => go('back')} onShare={() => go('toast', { variant: 'success', message: 'Imagem gerada!' })}/>;
      case 'registro-rapido': return <RegistroRapido onClose={() => go('back')} onSubmit={() => go('registro-confirmacao', { wine: { name: 'Vinho registrado' } })} onModoCompleto={() => go('registro-completo')}/>;
      case 'registro-completo': return <RegistroCompleto onClose={() => go('back')} onSubmit={(p) => go('registro-confirmacao', { wine: p.wine, pointsAwarded: 10 })} onSaveDraft={() => go('toast', { variant: 'info', message: 'Rascunho salvo.' })}/>;
      case 'registro-confirmacao': return <ConfirmacaoRegistro wine={(current.params && current.params.wine) || { name: 'Catena Malbec 2021' }} pointsAwarded={(current.params && current.params.pointsAwarded) || 10} totalPoints={140} onContinue={() => { setTab('adega'); setStack([{ screen: 'home', params: {} }]); }} onEdit={() => go('back')} onShare={() => go('toast', { variant: 'success', message: 'Compartilhado nos Stories' })} onSeeMoreLearn={() => go('aprenda')}/>;
      case 'harmoniza':     return <HarmonizaPrato onBack={() => go('back')} onSubmit={(prato) => go('harmoniza-resultados', { prato })}/>;
      case 'harmoniza-resultados': return <HarmonizaResultados prato={(current.params && current.params.prato) || 'seu prato'} best={{ wine: { ...MOCK_WINES[0], match: 94 }, reason: 'Taninos firmes acompanham bem.' }} others={[{ wine: { ...MOCK_WINES[5], match: 89 }, reason: 'Outra opção encorpada.' }, { wine: { ...MOCK_WINES[1], match: 81 }, reason: 'Português alternativo.' }]} onBack={() => go('back')} onTapWine={(it) => go('wine', { wine: it.wine })} onBest={() => go('wine', { wine: MOCK_WINES[0] })}/>;
      case 'modo-restaurante': return <ModoRestaurante onClose={() => go('back')} onBackToLabel={() => go('scanner')} onProcess={(pages) => go('carta-matches', { pages })}/>;
      case 'carta-matches': return <CartaMatches identified={[{ wine: { ...MOCK_WINES[0], match: 92 }, price: 189 }, { wine: { ...MOCK_WINES[5], match: 89 }, price: 156 }, { wine: { ...MOCK_WINES[6], match: 78 }, price: 98 }]} unidentified={[{ rawText: 'Tannat Reserva 2019' }]} onBack={() => go('back')} onTapWine={(it) => go('porque-combina', it)} onNewPhoto={() => go('modo-restaurante')}/>;
      case 'porque-combina': return <PorQueCombina item={current.params || { wine: MOCK_WINES[0], price: 189 }} userProfile={{ acidez: 3, tanino: 4, corpo: 4, frutado: 4, docura: 2 }} userExperience={{ evaluationCount: ctx.diary.length || 0 }} onClose={() => go('back')} onShare={() => {}} onChoose={() => go('registro-rapido')} onBackToCarta={() => go('back')}/>;
      case 'scanner-v2':    return <Scanner onClose={() => go('back')} onCapture={() => go('scanner-result-v2')} onPickFromGallery={() => go('scanner-result-v2')} onChangeMode={(m) => { if (m === 'menu') go('modo-restaurante'); }}/>;
      case 'scanner-result-v2': return <ResultadoScan wine={{ ...MOCK_WINES[0], year: '2021', type: 'Tinto', profile: { acidez: 65, tanino: 75, corpo: 70, frutado: 60, docura: 18 } }} userProfile={{ acidez: 3, tanino: 4, corpo: 4, frutado: 4, docura: 2 }} userHasPaladar={!!ctx.user.paladar} matchScore={87} explanation="Acidez e taninos firmes combinam com seu paladar." onClose={() => go('back')} onRegister={() => go('registro-rapido')} onBuy={() => go('marketplace')} onAsk={() => go('comunidade')} onTakeQuiz={() => go('quiz')}/>;
      case 'scanner-fallback': return <FallbackScanner onClose={() => go('back')} onRetry={() => go('scanner-v2')} onSearchManual={() => go('busca')} onAddWine={() => go('registro-completo')}/>;
      case 'desafio-detalhe': return <DetalheDesafio challenge={(current.params && current.params.challenge) || { title: 'Prove um vinho espanhol', weekNumber: 21, endsAt: new Date(Date.now() + 1000*60*60*24*3).toISOString(), criteria: 'Registre um vinho da Espanha antes do prazo.', country: 'Espanha' }} state={(current.params && current.params.state) || 'active'} inConfraria={true} registered={(current.params && current.params.registered) || []} onBack={() => go('back')} onTapWine={(w) => go('wine', { wine: w })} onRegisterFromHere={() => go('registro-rapido')}/>;
      case 'ranking':       return <RankingConfraria confraria={(current.params && current.params.confraria) || { name: 'Brindar em Brasília' }} challenge={{ title: 'Desafio espanhol', flag: '🇪🇸', weekNumber: 21, qualifier: 'espanhóis', unitSingular: 'vinho', unitPlural: 'vinhos' }} entries={[{ userId: 'u1', name: 'Carla Mendes', count: 4, points: 200 }, { userId: 'u2', name: 'Diego Reis', count: 3, points: 150 }, { userId: 'u3', name: 'Fernando Medrado', count: 3, points: 150 }, { userId: 'u4', name: 'Helena Britto', count: 2, points: 100 }, { userId: 'u5', name: 'João Bernardes', count: 2, points: 100 }, { userId: 'me', name: ctx.user.name, count: 1, points: 50 }]} currentUser={{ userId: 'me', name: ctx.user.name, position: 6, count: 1, points: 50 }} onBack={() => go('back')} onRegisterNow={() => go('registro-rapido')}/>;
      case 'calibracao':    return <CalibracaoCincoVinhos selections={[{ wine: MOCK_WINES[0], style: 'Tinto encorpado', styleKey: 'tinto-encorpado', priceRange: 'R$ 150–200', status: 'pending' }, { wine: MOCK_WINES[5], style: 'Tinto médio', styleKey: 'tinto-medio', priceRange: 'R$ 60–100', status: 'pending' }, { wine: MOCK_WINES[2], style: 'Branco seco', styleKey: 'branco-seco', priceRange: 'R$ 200–300', status: 'pending' }, { wine: MOCK_WINES[7], style: 'Branco encorpado', styleKey: 'branco-encorpado', priceRange: 'R$ 120–180', status: 'pending' }, { wine: MOCK_WINES[4], style: 'Espumante', styleKey: 'espumante', priceRange: 'R$ 80–130', status: 'pending' }]} onBack={() => go('back')} onTapWine={(s) => go('wine', { wine: s.wine })} onMarkTasted={() => go('registro-rapido')}/>;
      case 'event-detalhe': return <EventDetalheScreen event={current.params && current.params.event} brotherhood={current.params && current.params.brotherhood} go={go}/>;
      case 'post-detail':   return <PostDetailScreen go={go} params={current.params}/>;
      case 'busca':         return <BuscaScreen go={go}/>;
      case 'perfil-outro':  return <PerfilOutroScreen go={go} params={current.params}/>;
      case 'confraria-detalhe': return <ConfrariaDetalheScreen go={go} params={current.params}/>;
      // ── Recuperar senha (25.x) ────────────────────────────
      case 'recuperar-email':     return <RecuperarEmailScreen go={go}/>;
      case 'recuperar-enviado':   return <RecuperarEnviadoScreen go={go} params={current.params}/>;
      case 'recuperar-otp':       return <RecuperarOtpScreen go={go} params={current.params}/>;
      case 'recuperar-redefinir': return <RecuperarRedefinirScreen go={go}/>;
      case 'recuperar-sucesso':   return <RecuperarSucessoScreen go={go}/>;
      // ── Editar perfil (26.x) ──────────────────────────────
      case 'editar-perfil':            return <EditarPerfilScreen go={go} ctx={ctx} setCtx={setCtx}/>;
      case 'editar-perfil-foto':       return <EditarPerfilFotoScreen go={go} ctx={ctx} setCtx={setCtx}/>;
      case 'editar-perfil-paladar':    return <EditarPerfilPaladarScreen go={go}/>;
      case 'editar-perfil-privacidade':return <EditarPerfilPrivacidadeScreen go={go}/>;
      // ── Configurações detalhadas (27.x) ──────────────────
      case 'config-notif':         return <ConfigNotifScreen go={go}/>;
      case 'config-privacidade':   return <ConfigPrivacidadeScreen go={go}/>;
      case 'config-conta':         return <ConfigContaScreen go={go}/>;
      case 'config-bloqueados':    return <BloqueadosScreen go={go}/>;
      case 'conta-desativada':     return <ContaDesativadaScreen go={go}/>;
      case 'conta-excluida':       return <ContaExcluidaScreen go={go}/>;
      case 'termos':               return <TermosScreen go={go}/>;
      case 'politica-privacidade': return <PoliticaPrivacidadeScreen go={go}/>;
      // ── Suporte (27.04-05) ────────────────────────────────
      case 'suporte-faq':     return <SuporteFaqScreen go={go}/>;
      case 'suporte-contato': return <SuporteContatoScreen go={go} params={current.params}/>;
      // ── Confraria — ações admin/membros (28.x) ───────────
      case 'confraria-config':      return <ConfrariaConfigScreen go={go} params={current.params}/>;
      case 'confraria-convidar':    return <ConfrariaConvidarScreen go={go} params={current.params}/>;
      case 'confraria-sair':        return <ConfrariaSairScreen go={go} params={current.params}/>;
      case 'confraria-transferir':  return <ConfrariaTransferirScreen go={go} params={current.params}/>;
      case 'confraria-regras':      return <ConfrariaRegrasScreen go={go} params={current.params}/>;
      // ── Organizador evento (29.x) ─────────────────────────
      case 'evento-editar':      return <EventoEditarScreen go={go} params={current.params}/>;
      case 'evento-presenca':    return <EventoPresencaScreen go={go} params={current.params}/>;
      case 'evento-pos-avaliar': return <EventoPosAvaliarScreen go={go} params={current.params}/>;
      case 'evento-pos-ata':     return <EventoPosAtaScreen go={go} params={current.params}/>;
      // ── Compositor + comentários (31.x) ───────────────────
      case 'criar-post':    return <CriarPostScreen go={go} ctx={ctx}/>;
      case 'criar-momento': return <CriarMomentoScreen go={go}/>;
      case 'comentarios':   return <ComentariosScreen go={go} params={current.params}/>;
      // ── Chat / DMs (32.x) ─────────────────────────────────
      case 'chat-lista':    return <ChatListaScreen go={go}/>;
      case 'chat-conversa': return <ChatConversaScreen go={go} params={current.params} ctx={ctx}/>;
      // ── Galeria de Conquistas (32.x) ──────────────────────
      case 'badges-galeria': return <BadgesGaleriaScreen go={go}/>;
      // ── Checkout marketplace (33.x) ───────────────────────
      case 'carrinho':           return <CarrinhoScreen go={go}/>;
      case 'endereco':           return <EnderecoScreen go={go} params={current.params}/>;
      case 'pagamento':          return <PagamentoScreen go={go} params={current.params}/>;
      case 'pedido-confirmado':  return <PedidoConfirmadoScreen go={go} params={current.params}/>;
      // ── Notificações (14.03) ─────────────────────────────
      case 'notificacoes':       return <Notificacoes go={go} ctx={ctx}/>;
      // ── Onboarding alternativo (34.x) ──────────────────
      case 'login-social':         return <LoginSocialScreen go={go} mode={(current.params && current.params.mode) || 'cadastro'} provider={(current.params && current.params.provider) || 'google'}/>;
      // magic-link e verif-telefone-otp/concluida removidos do produto (fora do escopo)
      // ── Modo Expert (35.x) ──────────────────────────────
      case 'expert-virar':       return <ExpertVirarScreen go={go} ctx={ctx}/>;
      case 'expert-aplicar':     return <ExpertAplicarScreen go={go}/>;
      case 'expert-pendente':    return <ExpertPendenteScreen go={go}/>;
      case 'expert-q-a':         return <ExpertQAScreen go={go}/>;
      case 'expert-responder':   return <ExpertResponderScreen go={go} params={current.params}/>;
      case 'perguntar-expert':   return <PerguntarExpertScreen go={go}/>;
      // ── Marketplace Pro (36.x) ───────────────────────
      case 'filtros-avancados':  return <FiltrosAvancadosScreen go={go} params={current.params}/>;
      case 'lista-desejos':      return <ListaDesejosScreen go={go}/>;
      case 'comparar-vinhos':    return <CompararVinhosScreen go={go} params={current.params}/>;
      // ── Edge cases (37.x) ───────────────────────────────
      case 'erro-404':            return <Erro404Screen go={go}/>;
      case 'erro-permissao':      return <ErroPermissaoScreen go={go}/>;
      case 'erro-sessao':         return <ErroSessaoScreen go={go} params={current.params}/>;
      case 'vinho-indisponivel':  return <VinhoIndisponivelScreen go={go} params={current.params}/>;
      case 'erro-servidor':       return <ErroServidorScreen go={go}/>;
      // ── Tutoriais hub (35.x) ──────────────────────────────────
      case 'tutoriais':           return <TutoriaisHubScreen go={go} onLaunch={(id) => { setStack(s => s.slice(0, -1)); setActiveTutorial(id); }}/>;
      // ── Perfil avançado (38.x) ──────────────────────────────────
      case 'perfil-seguidores':      return <PerfilSeguidoresScreen go={go} params={current.params}/>;
      case 'perfil-seguindo':        return <PerfilSeguindoScreen go={go}/>;
      case 'perfil-atividade-publica': return <PerfilAtividadePublicaScreen go={go} params={current.params}/>;
      case 'perfil-vinhos-provados': return <PerfilVinhosProvadosScreen go={go} params={current.params}/>;
      case 'perfil-sugestoes':       return <PerfilSugestoesScreen go={go}/>;
      case 'perfil-comparar-paladar': return <PerfilCompararPaladarScreen go={go} params={current.params}/>;
      // ── Indicação (39.x) ────────────────────────────────────
      case 'indicacao-landing':       return <IndicacaoLandingScreen go={go} ctx={ctx}/>;
      case 'indicacao-compartilhar':  return <IndicacaoCompartilharScreen go={go} ctx={ctx}/>;
      case 'indicacao-meus-convites': return <IndicacaoMeusConvitesScreen go={go}/>;
      case 'indicacao-recompensas':   return <IndicacaoRecompensasScreen go={go}/>;
      case 'convite-recebido':        return <ConviteRecebidoScreen go={go} params={current.params}/>;
      // ── Confraria welcome (40.x) ───────────────────────────────
      case 'confraria-welcome':       return <ConfrariaWelcomeScreen go={go} params={current.params}/>;
      case 'confraria-apresentar':    return <ConfrariaApresentarScreen go={go} params={current.params}/>;
      case 'confraria-tour-rapido':   return <ConfrariaTourRapidoScreen go={go} params={current.params}/>;
      // ── Push setup (41.x) ───────────────────────────────────
      case 'push-primer':         return <PushPrimerScreen go={go}/>;
      case 'push-negado':         return <PushNegadoScreen go={go}/>;
      case 'push-canais':         return <PushCanaisScreen go={go}/>;
      case 'push-preview':        return <PushPreviewScreen go={go}/>;
      // ── Jornada (42.x) ──────────────────────────────────────
      case 'jornada':             return <JornadaScreen go={go} ctx={ctx}/>;
      case 'jornada-celebrar':    return <JornadaCelebrarScreen go={go} params={current.params}/>;
      case 'pontos':              return <PontosScreen go={go} ctx={ctx} params={current.params}/>;
      // ── PREVIEWS (Gabriel aprova antes de virar implementação) ──
      case 'prev-eventos-meus':              return <PreviewEventosMeus go={go}/>;
      case 'prev-eventos-descobrir':         return <PreviewEventosDescobrir go={go}/>;
      case 'prev-eventos-descobrir-empty':   return <PreviewEventosDescobrirEmpty go={go}/>;
      case 'prev-confraria-publica':         return <PreviewConfrariaPublica go={go}/>;
      case 'prev-confraria-privada':         return <PreviewConfrariaPrivada go={go}/>;
      case 'prev-modal-publica':             return <PreviewModalParticiparPublica go={go}/>;
      case 'prev-modal-privada':             return <PreviewModalParticiparPrivada go={go}/>;

      // ── Treine seu Paladar (feature) ──────────────────────
      case 'treino-paladar':      return <TreinoPaladarHome go={go}/>;
      case 'treino-licao':        return <TreinoLicaoScreen go={go} params={current.params}/>;
      case 'treino-liga':         return <TreinoLigaScreen go={go}/>;
      case 'treino-aprender':     return <TreinoAprenderScreen go={go}/>;

      case 'wine':          return <WineDetailScreen go={go} params={current.params}/>;
      case 'marketplace':   return <MarketplaceScreen go={go}/>;
      case 'scanner':       return <ScannerScreen go={go}/>;
      case 'scanner-result': return <ScannerResultScreen go={go} params={current.params}/>;
      case 'register-consumo': return <RegisterConsumoScreen go={go} ctx={ctx} setCtx={setCtx}/>;
      case 'favoritos': return <FavoritosScreen go={go} ctx={ctx}/>;
      case 'home':
      default: {
        // First-time discover: user has level but hasn't done Paladar quiz yet.
        const isDiscoverFirstTime = tab === 'descobrir' && !ctx.user.paladar;
        // First-time adega: empty diary AND user came via diary_empty intent.
        const isAdegaFirstTime = tab === 'adega' && (ctx.diary || []).length === 0;
        // Skip-to-feed first time on comunidade: user skipped 04.01 — needs onboarding card.
        const lastIntent = (typeof window !== 'undefined') ? window.__tcLastIntent : null;
        const skipTs     = (typeof window !== 'undefined') ? window.__tcSkipTimestamp : null;
        const skipBannerDay = (lastIntent === 'skip_to_feed' && skipTs)
          ? Math.floor((Date.now() - skipTs) / (24*60*60*1000))
          : null;
        const onSkipBannerIntent = (intent) => {
          try { window.__tcLastIntent = intent; window.__tcSkipTimestamp = null; } catch (e) {}
          // Route to the matching destination just like commit() in 05.01
          if (intent === 'discover_home') { setCtx(c => ({ ...c, user: { ...c.user, paladar: null }})); setTab('descobrir'); setStack([{ screen: 'home', params: {} }]); }
          else if (intent === 'diary_empty')                      go('register-consumo');
          else if (intent === 'learn')                            go('aprender', { intent });
          else if (intent === 'gps_primer_then_confrarias')       go('gps-primer', { next: 'confrarias',      intent });
          else if (intent === 'gps_primer_then_wizard')           go('gps-primer', { next: 'wizard-confraria', intent });
        };
        const feedState  = (typeof readFeedFirstState === 'function') ? readFeedFirstState() : null;
        const isFeedFirstTime = tab === 'comunidade'
          && lastIntent === 'skip_to_feed'
          && feedState && !feedState.closed && feedState.done.length < 2 && feedState.views < 3;
        if (isDiscoverFirstTime) return (
          <DescobrirHomeFirstTime
            userLevel={(typeof window !== 'undefined' && window.__tcUserLevel) || ctx.user.level || 'iniciante'}
            userInterests={(typeof window !== 'undefined' && window.__tcUserInterests) || []}
            paladarComplete={!!ctx.user.paladar}
            user={ctx.user}
            wines={MOCK_WINES}
            skipBannerDay={skipBannerDay}
            onSkipBannerIntent={onSkipBannerIntent}
            onPaladarQuizStart={() => go('quiz')}
            onWineCardTap={(id) => {
              const w = MOCK_WINES.find(x => x.id === id);
              if (w) go('wine', { wine: w });
            }}
            onScannerOpen={() => { if (!requiresNetwork()) go('scanner'); }}
            onNotifOpen={() => go('notificacoes')}
            onProfileOpen={() => setProfileOpen(true)}
          />
        );
        // Adega vazia agora abre direto na Estante interativa (AdegaScreen),
        // que ensina inline a colocar os vinhos. (AdegaVazia mantida só p/ ref.)
        void isAdegaFirstTime;
        if (isFeedFirstTime) return (
          <FeedFirstTime
            userLevel={(typeof window !== 'undefined' && window.__tcUserLevel) || ctx.user.level || 'iniciante'}
            user={ctx.user}
            posts={MOCK_POSTS}
            skipBannerDay={skipBannerDay}
            onSkipBannerIntent={onSkipBannerIntent}
            onQuickAction={(id) => {
              if (id === 'paladar')    go('quiz');
              else if (id === 'registrar')  go('register-consumo');
              else if (id === 'confrarias') { setTab('confrarias'); setStack([{ screen: 'home', params: {} }]); }
              else if (id === 'descobrir')  { setTab('descobrir');  setStack([{ screen: 'home', params: {} }]); }
            }}
            onPostTap={(p) => go('post-detail', { post: p })}
            onPostLike={() => {}}
            onPostComment={(p) => go('post-detail', { post: p })}
            onCloseSticky={() => {}}
            onNotifOpen={() => go('notificacoes')}
            onProfileOpen={() => setProfileOpen(true)}
          />
        );
        if (tab === 'descobrir') return <DescobrirHome go={go} ctx={ctx}/>;
        if (tab === 'adega')     return <AdegaScreen go={go} ctx={ctx}/>;
        if (tab === 'comunidade') return <ComunidadeScreen go={go} ctx={ctx}/>;
        if (tab === 'confrarias') return <ConfrariasScreen go={go} ctx={ctx}/>;
        return null;
      }
    }
  };

  // FAB by tab
  const fabConfig = {
    comunidade: { icon: 'edit', onClick: () => go('criar-post') },
    confrarias: { icon: 'add', onClick: () => go('wizard-confraria-1') },
    descobrir:  { icon: 'qr_code_scanner', onClick: () => { if (!requiresNetwork()) go('scanner'); }, disabled: !ctx.online },
    adega:      { icon: 'add', onClick: () => go('register-consumo') },
  }[tab];

  return (
    <div style={{
      width: 412, height: 892, maxHeight: 'calc(100vh - 16px)', borderRadius: 36, overflow: 'hidden',
      background: T.c.n0, border: '10px solid #1a1a1a',
      boxShadow: '0 30px 80px rgba(0,0,0,0.25), 0 0 0 2px #2a2a2a',
      display: 'flex', flexDirection: 'column', position: 'relative',
      fontFamily: T.font,
    }}>
      <StatusBar/>
      <OfflineBanner online={ctx.online} syncing={syncing} onToggle={toggleOnline}/>
      {isAppScreen && current.screen === 'home'
         && !(tab === 'descobrir' && !ctx.user.paladar)
         && !(tab === 'comunidade' && (typeof window !== 'undefined') && window.__tcLastIntent === 'skip_to_feed') && (
        <AppHeader
          onScan={() => { if (!requiresNetwork()) go('scanner'); }}
          onNotif={() => go('notificacoes')}
          onProfile={() => setProfileOpen(true)}
          notifCount={2}/>
      )}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: T.c.n50, position: 'relative' }}>
        <div key={`${tab}:${stack.length}:${current.screen}`} className="tc-screen-host" style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0,
          animation: stack.length > 1 ? 'tcPushIn 300ms ease-out' : 'tcFadeIn 150ms ease-out',
        }}>
          {renderScreen()}
        </div>
        {isAppScreen && current.screen === 'home' && fabConfig && (
          <FAB icon={fabConfig.icon} onClick={fabConfig.onClick} disabled={fabConfig.disabled}/>
        )}
      </div>
      {!hideChrome && (
        <BottomNav
          active={tab}
          glow={tour ? (TOUR_STEPS[tour.step] && TOUR_STEPS[tour.step].tab) : null}
          onChange={t => {
            // Disable tab switching during the tour — it must follow its own path
            if (tour) return;
            setTab(t);
            setStack([{ screen: 'home', params: {} }]);
          }}/>
      )}
      <NavBar/>
      {/* Toast overlay */}
      {toast && (
        <div style={{ position: 'absolute', bottom: 100, left: 16, right: 16, zIndex: 100, animation: 'tcSlideUp 150ms ease-out' }}>
          <Toast {...toast}/>
        </div>
      )}
      {/* Profile drawer */}
      {profileOpen && <ProfileDrawer ctx={ctx} onClose={() => setProfileOpen(false)} go={(s, p) => { setProfileOpen(false); go(s, p); }} onToggleOnline={toggleOnline}/>}

      {/* TchinTutor overlay — modern conversational tutorial */}
      {activeTutorial && typeof TchinTutor === 'function' && (() => {
        const t = (typeof getTutorial === 'function') ? getTutorial(activeTutorial) : null;
        if (!t) return null;
        return <TchinTutor tutorial={t} onClose={() => setActiveTutorial(null)} onAction={(a) => { setActiveTutorial(null); if (a && a.screen) go(a.screen, a.params); }}/>;
      })()}

      {/* ── Onboarding tour overlay (07.02–05) ── */}
      {tour && !hideChrome && (
        <TutorialTooltip
          step={tour.step}
          total={TOUR_STEPS.length}
          frameWidthPx={412}
          navHeightPx={88}
          onSkip={() => { writeTourState(null); setTour(null); setCelebrate(true); }}
          onNext={() => {
            const nextStep = tour.step + 1;
            const nextTab  = TOUR_STEPS[nextStep] && TOUR_STEPS[nextStep].tab;
            if (nextTab) { setTab(nextTab); setStack([{ screen: 'home', params: {} }]); }
            const nextState = { ...tour, step: nextStep };
            writeTourState(nextState);
            setTour(nextState);
          }}
          onBack={() => {
            const prevStep = Math.max(0, tour.step - 1);
            const prevTab  = TOUR_STEPS[prevStep] && TOUR_STEPS[prevStep].tab;
            if (prevTab) { setTab(prevTab); setStack([{ screen: 'home', params: {} }]); }
            const prevState = { ...tour, step: prevStep };
            writeTourState(prevState);
            setTour(prevState);
          }}
          onDone={() => {
            // Land on the destination the user originally chose
            if (tour.destination) {
              setTab(tour.destination);
              setStack([{ screen: 'home', params: { firstTime: true } }]);
            }
            writeTourState(null);
            setTour(null);
            setCelebrate(true);
          }}
        />
      )}

      {/* ── 07.06 Celebration toast ── */}
      {celebrate && <CelebrationToast onDismiss={() => setCelebrate(false)}/>}
    </div>
  );
}

function ProfileDrawer({ ctx, onClose, go, onToggleOnline }) {
  const [showLogout, setShowLogout] = React.useState(false);
  const sections = [
    { title: 'Atividade', items: [
      { icon: 'auto_stories', label: `Meu diário (${ctx.diary.length})`, onClick: () => go('adega') },
      { icon: 'event',        label: 'Meus eventos',          onClick: () => go('event-detalhe', { event: MOCK_EVENTS[0] }) },
      { icon: 'favorite',     label: 'Favoritos',             onClick: () => go('favoritos') },
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
      { icon: 'favorite',     label: 'Lista de desejos',        onClick: () => go('lista-desejos') },
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
      { icon: 'bug_report', label: 'Ver telas de erro (demo)', onClick: () => go('erro-404') },
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
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.5)', zIndex: 60, animation: 'tcFadeIn 200ms' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '88%', maxWidth: 360,
        background: T.c.n0, display: 'flex', flexDirection: 'column',
        animation: 'tcSlideLeft 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        {/* Top: close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 4px' }}>
          <span style={{ ...T.t.h3, color: T.c.n950 }}>Você</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <Icon name="close" size={22} color={T.c.n800}/>
          </button>
        </div>
        {/* Identity */}
        <div style={{ padding: '16px 20px 20px', borderBottom: `1px solid ${T.c.n200}`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <Avatar name={ctx.user.name} size={64} level={ctx.user.level}/>
          <div style={{ ...T.t.h2, color: T.c.n950, marginTop: 8 }}>{ctx.user.name}</div>
          <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 12 }}>{ctx.user.level} · {ctx.user.city}</div>
          <button onClick={() => go('editar-perfil')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: T.c.p700, fontFamily: T.font, fontSize: 14, fontWeight: 600,
          }}>Editar perfil <Icon name="chevron_right" size={18} color={T.c.p700}/></button>
        </div>
        {/* Sections */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
          {onToggleOnline && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── Modo offline (demo) ──</div>
              <button onClick={() => { onClose(); setTimeout(onToggleOnline, 240); }} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                color: T.c.n800, fontFamily: T.font, fontSize: 15, fontWeight: 500, width: '100%',
              }}>
                <Icon name={ctx.online ? 'wifi_off' : 'wifi'} size={22} color={T.c.n800}/>
                <span style={{ flex: 1 }}>{ctx.online ? 'Simular ficar offline' : 'Voltar a ficar online'}</span>
                <span style={{
                  ...T.t.label, padding: '3px 8px', borderRadius: T.r.xs,
                  background: ctx.online ? T.c.s100 : T.c.w100,
                  color: ctx.online ? T.c.s700 : T.c.w700,
                }}>{ctx.online ? 'Online' : 'Offline'}</span>
              </button>
            </div>
          )}
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
        <div style={{ borderTop: `1px solid ${T.c.n200}`, padding: '12px 20px 4px' }}>
          <button onClick={() => setShowLogout(true)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.n800, fontFamily: T.font, fontSize: 15, fontWeight: 600,
          }}><Icon name="logout" size={20} color={T.c.n800}/>Sair</button>
        </div>
        <div style={{ padding: '4px 20px 20px' }}>
          <button style={{
            width: '100%', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.e700, fontFamily: T.font, fontSize: 13, fontWeight: 600,
            textDecoration: 'underline',
          }}>Excluir conta</button>
        </div>
      </div>
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} onConfirm={() => {
        setShowLogout(false);
        onClose();
        go('welcome');
        setTimeout(() => go('toast', { variant: 'success', message: 'Você saiu da sua conta.' }), 100);
      }}/>}
    </div>
  );
}

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div onClick={onClose} style={{
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
          <Button variant="destructive" size="lg" fullWidth onClick={onConfirm}>Sim, desejo sair</Button>
          <Button variant="ghost" size="lg" fullWidth onClick={onClose}>Quero permanecer logado</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TchinApp, ProfileDrawer, StatusBar, NavBar });


export { LogoutModal, NavBar, ProfileDrawer, StatusBar, TchinApp };
