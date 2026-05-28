// Captura ESTADOS internos (carrosséis, abas, passos de wizard) que o
// capture-shots.mjs não pega (ele só captura o estado inicial de cada rota).
// Cada sequência abre uma URL e executa "ops" em ordem:
//   {shot:'nome'}                -> screenshot docs/spec/shots/nome.png
//   {click:'Texto do botão'}     -> clica botão por texto (has-text)
//   {clickAll:['t1','t2',...]}   -> clica múltiplos botões por texto (em ordem)
//   {fill:['placeholder','valor']} -> preenche input por placeholder
//   {fillType:['date','1990-01-01']} -> preenche input por type
//   {wait: ms}
//   node scripts/capture-states.mjs
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const SEQ = [
  // ── Módulo 01 — Auth & Acesso ───────────────────────────
  { url: '?screen=onboarding', ops: [
    { shot: 'onboarding-1' },
    { click: 'Avançar' }, { shot: 'onboarding-2' },
    { click: 'Avançar' }, { shot: 'onboarding-3' },
  ]},
  { url: '?screen=cadastro', ops: [
    { shot: 'cadastro-1' },
    { fill: ['Digite seu e-mail', 'maria@email.com'] },
    { fill: ['Crie uma senha', 'Teste@123'] },
    { click: 'Continuar' }, { shot: 'cadastro-2' },
    { fill: ['Como gostaria de ser chamada(o)', 'Maria Silva'] },
    { fillType: ['date', '1990-01-01'] },
    { click: 'Continuar' }, { shot: 'cadastro-3' },
  ]},

  // ── Módulo 02 — Onboarding educacional & Roteamento ─────
  // 03.01 — Quiz de Nível (1 de 3) — apenas estado inicial
  { url: '?screen=quiz-nivel', ops: [
    { shot: 'nivel-default' },
  ]},

  // 03.02 — Interesses (2 de 3) — default / 3 selecionados / 8 selecionados
  { url: '?screen=quiz-interesses', ops: [
    { shot: 'interesses-default' },
    // Selecionar 3 (mínimo) — Cabernet Sauvignon, Malbec, Mendoza
    { click: 'Cabernet Sauvignon' },
    { click: 'Malbec' },
    { click: 'Mendoza' },
    { shot: 'interesses-min' },
    // Adicionar mais 5 (chegar a 8 — máximo) — Merlot, Pinot Noir, Syrah, Tannat, Bordeaux
    { click: 'Merlot' },
    { click: 'Pinot Noir' },
    { click: 'Syrah' },
    { click: 'Tannat' },
    { click: 'Bordeaux' },
    { shot: 'interesses-max' },
    // Tentar selecionar 9º — deve disparar shake + toast
    { click: 'Chardonnay' },
    { wait: 150 },
    { shot: 'interesses-overflow' },
  ]},

  // 05.01 — Tela de Intenção (3 de 3) — default + skip modal
  { url: '?screen=tela-intencao', ops: [
    { shot: 'intencao-default' },
    { click: 'Ainda não sei, me leva pro app' },
    { wait: 250 },
    { shot: 'intencao-skip-modal' },
  ]},

  // 06.01 — GPS Primer — default + dialog "Permitir" aberto (rota D: confrarias)
  { url: '?screen=gps-primer', ops: [
    { shot: 'gps-primer-default' },
    { click: 'Ativar localização' },
    { wait: 500 },
    { shot: 'gps-primer-dialog' },
  ]},

  // 06.01.E — GPS Primer (rota E: criar confraria) — copy variante
  { url: '?screen=gps-primer&intent=gps_primer_then_wizard', ops: [
    { shot: 'gps-primer-wizard-variant' },
  ]},

  // 06.03 — GPS Negado (estado único, já temos em gps-negado.png, refazendo p/ nome consistente)
  { url: '?screen=gps-negado', ops: [
    { shot: 'gps-negado-default' },
  ]},

  // 07.01 — Welcome Final (intent skip por default — sem __tcLastIntent setado)
  { url: '?screen=welcome-final', ops: [
    { shot: 'welcome-final-default' },
  ]},

  // 35.x — Tutoriais hub
  { url: '?screen=tutoriais', ops: [
    { shot: 'tutoriais-hub' },
  ]},

  // ── Módulo 16 — Indicação & Convites ────────────────────
  { url: '?screen=indicacao-landing',       ops: [ { wait: 500 }, { shot: 'indicacao-landing' } ]},
  { url: '?screen=indicacao-compartilhar',  ops: [ { wait: 500 }, { shot: 'indicacao-compartilhar' } ]},
  { url: '?screen=indicacao-meus-convites', ops: [ { wait: 500 }, { shot: 'indicacao-meus-convites' } ]},
  { url: '?screen=indicacao-recompensas',   ops: [ { wait: 500 }, { shot: 'indicacao-recompensas' } ]},
  { url: '?screen=convite-recebido',        ops: [ { wait: 500 }, { shot: 'convite-recebido' } ]},

  // ── Módulo 15 — Expert ──────────────────────────────────
  { url: '?screen=expert-virar',     ops: [ { wait: 500 }, { shot: 'expert-virar' } ]},
  { url: '?screen=expert-aplicar',   ops: [ { wait: 500 }, { shot: 'expert-aplicar' } ]},
  { url: '?screen=expert-pendente',  ops: [ { wait: 500 }, { shot: 'expert-pendente' } ]},
  { url: '?screen=expert-q-a',       ops: [ { wait: 500 }, { shot: 'expert-q-a' } ]},
  { url: '?screen=expert-responder', ops: [ { wait: 500 }, { shot: 'expert-responder' } ]},
  { url: '?screen=perguntar-expert', ops: [ { wait: 500 }, { shot: 'perguntar-expert' } ]},

  // ── Módulo 14 — Perfil & Social ─────────────────────────
  { url: '?screen=perfil-outro',              ops: [ { wait: 600 }, { shot: 'perfil-outro' } ]},
  { url: '?screen=editar-perfil',             ops: [ { wait: 500 }, { shot: 'editar-perfil' } ]},
  { url: '?screen=editar-perfil-foto',        ops: [ { wait: 500 }, { shot: 'editar-perfil-foto' } ]},
  { url: '?screen=editar-perfil-paladar',     ops: [ { wait: 500 }, { shot: 'editar-perfil-paladar' } ]},
  { url: '?screen=editar-perfil-privacidade', ops: [ { wait: 500 }, { shot: 'editar-perfil-privacidade' } ]},
  { url: '?screen=perfil-seguidores',         ops: [ { wait: 500 }, { shot: 'perfil-seguidores' } ]},
  { url: '?screen=perfil-seguindo',           ops: [ { wait: 500 }, { shot: 'perfil-seguindo' } ]},
  { url: '?screen=perfil-atividade-publica',  ops: [ { wait: 500 }, { shot: 'perfil-atividade-publica' } ]},
  { url: '?screen=perfil-vinhos-provados',    ops: [ { wait: 500 }, { shot: 'perfil-vinhos-provados' } ]},
  { url: '?screen=perfil-sugestoes',          ops: [ { wait: 500 }, { shot: 'perfil-sugestoes' } ]},
  { url: '?screen=perfil-comparar-paladar',   ops: [ { wait: 600 }, { shot: 'perfil-comparar-paladar' } ]},
  { url: '?screen=badges-galeria',            ops: [ { wait: 500 }, { shot: 'badges-galeria' } ]},

  // ── Módulo 13 — Comunidade & Feed ───────────────────────
  // home/comunidade já capturada como home-comunidade.png (capture-shots)
  { url: '?screen=criar-post', ops: [
    { wait: 500 }, { shot: 'criar-post-default' },
    { fill: ['No que está pensando? Conta a história, marca o vinho...', 'Abri um Malbec sensacional ontem 🍷'] },
    { wait: 300 }, { shot: 'criar-post-texto' },
  ]},
  { url: '?screen=criar-momento', ops: [ { wait: 500 }, { shot: 'criar-momento-default' } ]},
  { url: '?screen=post-detail', ops: [ { wait: 600 }, { shot: 'post-detail-default' } ]},
  { url: '?screen=comentarios', ops: [ { wait: 500 }, { shot: 'comentarios-default' } ]},

  // ── Módulo 12 — Eventos ─────────────────────────────────
  // Wizard de criar evento (5 passos)
  { url: '?screen=event-wizard-1', ops: [ { wait: 500 }, { shot: 'event-wizard-1' } ]},
  { url: '?screen=event-wizard-2', ops: [ { wait: 500 }, { shot: 'event-wizard-2' } ]},
  { url: '?screen=event-wizard-3', ops: [ { wait: 500 }, { shot: 'event-wizard-3' } ]},
  { url: '?screen=event-wizard-4', ops: [ { wait: 500 }, { shot: 'event-wizard-4' } ]},
  { url: '?screen=event-wizard-5', ops: [ { wait: 500 }, { shot: 'event-wizard-5' } ]},

  // Detalhe do evento
  { url: '?screen=event-detalhe', ops: [ { wait: 700 }, { shot: 'event-detalhe' } ]},
  // Editar evento
  { url: '?screen=evento-editar', ops: [ { wait: 500 }, { shot: 'evento-editar' } ]},
  // Presença (Presença | Pagamentos com LACI)
  { url: '?screen=evento-presenca', ops: [
    { wait: 600 }, { shot: 'evento-presenca-presenca' },
    { click: 'Pagamentos' }, { wait: 400 }, { shot: 'evento-presenca-pagamentos' },
  ]},
  // Pós-evento: avaliar vinhos
  { url: '?screen=evento-pos-avaliar', ops: [ { wait: 500 }, { shot: 'evento-pos-avaliar' } ]},
  // Pós-evento: ata do encontro
  { url: '?screen=evento-pos-ata', ops: [ { wait: 500 }, { shot: 'evento-pos-ata' } ]},

  // ── Módulo 11 — Confrarias ──────────────────────────────
  // Detalhe (4 abas: Eventos/Publicações/Membros/Adega)
  { url: '?screen=confraria-detalhe', ops: [
    { wait: 700 },
    { shot: 'confraria-detalhe-eventos' },
    { click: 'Publicações' }, { wait: 400 }, { shot: 'confraria-detalhe-publicacoes' },
    { click: 'Membros' }, { wait: 400 }, { shot: 'confraria-detalhe-membros' },
    { click: 'Adega' }, { wait: 400 }, { shot: 'confraria-detalhe-adega' },
  ]},

  // Wizard de criação (6 passos)
  { url: '?screen=wizard-confraria-1', ops: [ { wait: 500 }, { shot: 'wizard-confraria-1' } ]},
  { url: '?screen=wizard-confraria-2', ops: [ { wait: 500 }, { shot: 'wizard-confraria-2' } ]},
  { url: '?screen=wizard-confraria-3', ops: [ { wait: 500 }, { shot: 'wizard-confraria-3' } ]},
  { url: '?screen=wizard-confraria-4', ops: [ { wait: 500 }, { shot: 'wizard-confraria-4' } ]},
  { url: '?screen=wizard-confraria-5', ops: [ { wait: 500 }, { shot: 'wizard-confraria-5' } ]},
  { url: '?screen=wizard-confraria-6', ops: [ { wait: 700 }, { shot: 'wizard-confraria-6' } ]},

  // Gestão (admin)
  { url: '?screen=confraria-config',     ops: [ { wait: 500 }, { shot: 'confraria-config' } ]},
  { url: '?screen=confraria-convidar',   ops: [ { wait: 500 }, { shot: 'confraria-convidar' } ]},
  { url: '?screen=confraria-sair',       ops: [ { wait: 500 }, { shot: 'confraria-sair' } ]},
  { url: '?screen=confraria-transferir', ops: [ { wait: 500 }, { shot: 'confraria-transferir' } ]},
  { url: '?screen=confraria-regras',     ops: [ { wait: 500 }, { shot: 'confraria-regras' } ]},

  // Tutorial conversacional 'confraria-usar' (auto-trigger no detalhe) — 3 steps
  { url: '?screen=confraria-detalhe', keepTutors: true, resetTutors: ['confraria-usar'], ops: [
    { wait: 1200 },
    { shot: 'tutor-confraria-intro' },
    { click: 'Vamos começar' }, { wait: 600 }, { shot: 'tutor-confraria-step-1' },
    { click: 'Próximo' }, { wait: 600 }, { shot: 'tutor-confraria-step-2' },
    { click: 'Próximo' }, { wait: 600 }, { shot: 'tutor-confraria-step-3' },
  ]},

  // Onboarding pós-entrada (welcome → apresentar → tour 3 slides)
  { url: '?screen=confraria-welcome',    ops: [ { wait: 700 }, { shot: 'confraria-welcome' } ]},
  { url: '?screen=confraria-apresentar', ops: [ { wait: 500 }, { shot: 'confraria-apresentar' } ]},
  { url: '?screen=confraria-tour-rapido', ops: [
    { wait: 600 }, { shot: 'confraria-tour-1' },
    { click: 'Continuar' }, { wait: 400 }, { shot: 'confraria-tour-2' },
    { click: 'Continuar' }, { wait: 400 }, { shot: 'confraria-tour-3' },
  ]},

  // ── Módulo 10 — Harmoniza ───────────────────────────────
  // harmoniza (digitar prato) — default + com prato digitado (autocomplete)
  { url: '?screen=harmoniza', ops: [
    { wait: 500 },
    { shot: 'harmoniza-default' },
    { fill: ['Ex: picanha grelhada', 'Picanha'] },
    { wait: 500 },
    { shot: 'harmoniza-autocomplete' },
  ]},
  // harmoniza-resultados (melhor match + outras opções)
  { url: '?screen=harmoniza-resultados', ops: [
    { wait: 1400 },
    { shot: 'harmoniza-resultados-default' },
  ]},

  // ── Módulo 09 — Aprenda (hub educacional) ───────────────
  // aprender (04.B "Você veio no lugar certo" — preview por nível)
  { url: '?screen=aprender', ops: [
    { wait: 500 },
    { shot: 'aprender-default' },
  ]},
  // aprenda (catálogo/hub de conteúdo) + busca
  { url: '?screen=aprenda', ops: [
    { wait: 500 },
    { shot: 'aprenda-default' },
  ]},
  // aprenda-detalhe (artigo/card)
  { url: '?screen=aprenda-detalhe', ops: [
    { wait: 500 },
    { shot: 'aprenda-detalhe-default' },
  ]},

  // ── Módulo 08 — Treine seu Paladar (Duolingo do vinho) ──
  // Onboarding do mascote TchinDuo (8 passos) — clearLs força aparecer
  { url: '?screen=treino-paladar', clearLs: ['tc.treino.v3'], keepTutors: true, ops: [
    { wait: 900 },
    { shot: 'treino-onb-intro' },
    { click: 'Continuar' }, { wait: 500 },
    { shot: 'treino-onb-say1' },
    { click: 'Continuar' }, { wait: 500 },
    { shot: 'treino-onb-objetivo' },
    { click: 'Escolher sem errar na loja' }, { wait: 500 },
    { shot: 'treino-onb-goal' },
    { click: 'Regular' }, { wait: 500 },
    { shot: 'treino-onb-say2' },
    { click: 'Continuar' }, { wait: 500 },
    { shot: 'treino-onb-streakgoal' },
    { click: '14 dias' }, { wait: 500 },
    { shot: 'treino-onb-gems' },
    { click: 'Quero!' }, { wait: 500 },
    { shot: 'treino-onb-final' },
  ]},

  // Home / Trilha (estado com progresso, sem onboarding)
  { url: '?screen=treino-paladar', keepTutors: true, ops: [
    { setLs: ['tc.treino.v3', '{"onboarded":true,"xp":120,"streak":3,"hearts":5,"gems":40,"done":["licao-01-tanino"],"goal":"regular","weekXp":85,"badges":["primeira-gota"]}'] },
    { wait: 700 },
    { shot: 'treino-home' },
  ]},

  // Lição: conceito → exercício → feedback
  { url: '?screen=treino-licao', keepTutors: true, ops: [
    { setLs: ['tc.treino.v3', '{"onboarded":true,"hearts":5,"goal":"regular"}'] },
    { wait: 600 },
    { shot: 'treino-licao-conceito' },
    { click: 'Continuar' }, { wait: 500 },
    { shot: 'treino-licao-exercicio' },
    { click: 'O tanino' }, { wait: 700 },
    { shot: 'treino-licao-feedback' },
  ]},

  // Lição completa (fluxo inteiro → tela de conclusão)
  { url: '?screen=treino-licao', keepTutors: true, ops: [
    { setLs: ['tc.treino.v3', '{"onboarded":true,"hearts":5,"goal":"regular"}'] },
    { wait: 600 },
    { click: 'Continuar' }, { wait: 400 },     // conceito → ex1
    { click: 'O tanino' }, { wait: 500 },       // mc correto
    { click: 'Continuar' }, { wait: 400 },      // → ex2 (fill)
    { click: 'amarra' }, { wait: 500 },         // fill correto
    { click: 'Continuar' }, { wait: 400 },      // → aplicação
    { click: 'Concluir lição' }, { wait: 900 }, // → conclusão
    { shot: 'treino-licao-completa' },
  ]},

  // Liga (leaderboard semanal)
  { url: '?screen=treino-liga', keepTutors: true, ops: [
    { setLs: ['tc.treino.v3', '{"onboarded":true,"weekXp":85,"xp":120}'] },
    { wait: 600 },
    { shot: 'treino-liga-default' },
  ]},

  // Aprender (escolher tema / busca de tópico)
  { url: '?screen=treino-aprender', keepTutors: true, ops: [
    { wait: 500 },
    { shot: 'treino-aprender-default' },
  ]},

  // ── Módulo 07 — Adega, Diário & Estante ─────────────────
  // register-consumo (2 passos: escolher vinho → avaliar)
  { url: '?screen=register-consumo', ops: [
    { shot: 'register-consumo-step1' },
    { fill: ['Buscar vinho na base', 'Malbec'] },
    { wait: 500 },
    { shot: 'register-consumo-step1-busca' },
  ]},

  // registro-rapido (modal/tela de avaliacao rapida)
  { url: '?screen=registro-rapido', ops: [
    { wait: 400 },
    { shot: 'registro-rapido-default' },
  ]},

  // registro-completo (form completo)
  { url: '?screen=registro-completo', ops: [
    { wait: 400 },
    { shot: 'registro-completo-default' },
  ]},

  // registro-confirmacao (sucesso + pontos)
  { url: '?screen=registro-confirmacao', ops: [
    { wait: 500 },
    { shot: 'registro-confirmacao-default' },
  ]},

  // relatorio-mensal (wrapped da adega)
  { url: '?screen=relatorio-mensal', ops: [
    { wait: 500 },
    { shot: 'relatorio-mensal-default' },
  ]},

  // favoritos
  { url: '?screen=favoritos', ops: [
    { shot: 'favoritos-default' },
  ]},

  // ── Módulo 06 — Scanner & Aprenda Bebendo ───────────────
  // Scanner v1 (legacy): viewfinder default + tooltip + help sheet
  { url: '?screen=scanner', ops: [
    { wait: 1100 },  // espera tooltip "Como funciona" aparecer
    { shot: 'scanner-v1-tooltip' },
    { click: 'Entendi' },
    { wait: 400 },
    { shot: 'scanner-v1-default' },
  ]},

  // Scanner v1 — abrir help sheet (botao "?" no canto superior direito)
  // Dispensa tooltip via localStorage, depois clica no botao help (3o botao = icone help_outline)
  { url: '?screen=scanner', ops: [
    { setLs: ['tc:scanner:firstUse', '1'] },
    { wait: 600 },
    { clickIcon: 'help_outline' },
    { wait: 400 },
    { shot: 'scanner-v1-help' },
  ]},

  // Scanner v1 result — sucesso high confidence (default mock)
  // Tela "scanner-result" sem params cai em fail (default no prototype.jsx)
  // entao precisamos forcar status=success via URL
  { url: '?screen=scanner-result', ops: [
    { wait: 400 },
    { shot: 'scanner-result-v1-fail' },
  ]},

  // Scanner v2 (canonico): viewfinder com guia maior
  { url: '?screen=scanner-v2', ops: [
    { wait: 600 },
    { shot: 'scanner-v2-default' },
  ]},

  // Scanner-result-v2 (ResultadoScan completo com radar + match + acoes)
  { url: '?screen=scanner-result-v2', ops: [
    { wait: 700 },
    { shot: 'scanner-result-v2-default' },
  ]},

  // Fallback (nao identificou)
  { url: '?screen=scanner-fallback', ops: [
    { shot: 'scanner-fallback-default' },
  ]},

  // Modo restaurante (captura de carta — ate 3 paginas)
  { url: '?screen=modo-restaurante', ops: [
    { shot: 'modo-restaurante-default' },
  ]},

  // Carta-matches (lista de matches identificados na carta) — sort default + Por preco + nao identificados expandido
  { url: '?screen=carta-matches', ops: [
    { shot: 'carta-matches-default' },
    { click: 'Por preço' },
    { wait: 300 },
    { shot: 'carta-matches-por-preco' },
    { click: 'Por tipo' },
    { wait: 300 },
    { shot: 'carta-matches-por-tipo' },
  ]},

  // Por que combina (explicacao com radar sobreposto)
  { url: '?screen=porque-combina', ops: [
    { wait: 500 },
    { shot: 'porque-combina-default' },
  ]},

  // ── Módulo 06 — Tutoriais (overlays conversacionais) ─────
  // keepTutors:true + resetTutors:[id] pra limpar localStorage e overlay aparecer
  { url: '?screen=scanner-v2', keepTutors: true, resetTutors: ['scanner'], ops: [
    { wait: 1500 },  // espera 360ms do useEffect + render
    { shot: 'tutor-scanner-intro' },
    { click: 'Vamos começar' },
    { wait: 600 },
    { shot: 'tutor-scanner-step-1' },
    { click: 'Próximo' },
    { wait: 600 },
    { shot: 'tutor-scanner-step-2' },
    { click: 'Próximo' },
    { wait: 600 },
    { shot: 'tutor-scanner-step-3' },
  ]},

  // Tutorial Modo Restaurante — 4 steps
  { url: '?screen=modo-restaurante', keepTutors: true, resetTutors: ['modo-restaurante'], ops: [
    { wait: 1500 },
    { shot: 'tutor-restaurante-intro' },
    { click: 'Vamos começar' },
    { wait: 600 },
    { shot: 'tutor-restaurante-step-1' },
    { click: 'Próximo' },
    { wait: 600 },
    { shot: 'tutor-restaurante-step-2' },
    { click: 'Próximo' },
    { wait: 600 },
    { shot: 'tutor-restaurante-step-3' },
    { click: 'Próximo' },
    { wait: 600 },
    { shot: 'tutor-restaurante-step-4' },
  ]},

  // ── Módulo 05 — Carrinho & Checkout ─────────────────────
  // Carrinho: default (2 items + cupom area) · cupom BRINDE10 aplicado
  { url: '?screen=carrinho', ops: [
    { shot: 'carrinho-default' },
    { fill: ['Ex.: BRINDE10', 'BRINDE10'] },
    { click: 'Aplicar' },
    { wait: 400 },
    { shot: 'carrinho-cupom-ok' },
  ]},

  // Endereco: default (lista) · modal "novo endereco" aberto
  { url: '?screen=endereco', ops: [
    { shot: 'endereco-default' },
    { click: 'Adicionar novo endereço' },
    { wait: 350 },
    { shot: 'endereco-novo' },
  ]},

  // Pagamento: cartao (default) · pix (QR) · boleto (form)
  { url: '?screen=pagamento', ops: [
    { shot: 'pagamento-cartao' },
    { click: 'Pix' },
    { wait: 350 },
    { shot: 'pagamento-pix' },
    { click: 'Boleto bancário' },
    { wait: 350 },
    { shot: 'pagamento-boleto' },
  ]},

  // Pedido confirmado
  { url: '?screen=pedido-confirmado', ops: [
    { wait: 500 },
    { shot: 'pedido-confirmado-default' },
  ]},

  // ── Módulo 04 — Descobrir & Marketplace ─────────────────
  // Marketplace: default · sheet de filtros · modal multi-select · search ativa
  // (dispensa o tutorial "Vamos começar" antes de seguir)
  { url: '?screen=marketplace', ops: [
    { wait: 800 },
    { click: 'Vamos começar' },
    { wait: 400 },
    { shot: 'marketplace-default' },
    { click: 'Filtrar' },
    { wait: 350 },
    { shot: 'marketplace-filtersheet' },
  ]},
  { url: '?screen=marketplace', ops: [
    { wait: 800 },
    { click: 'Vamos começar' },
    { wait: 400 },
    { fill: ['Digite o nome do vinho', 'Malbec'] },
    { wait: 800 },
    { shot: 'marketplace-search' },
  ]},
  { url: '?screen=marketplace', ops: [
    { wait: 800 },
    { click: 'Vamos começar' },
    { wait: 400 },
    { click: 'Adicionar vários' },
    { wait: 450 },
    { shot: 'marketplace-multi' },
  ]},

  // Wine detail — default (com paladar overlay)
  { url: '?screen=wine', ops: [
    { shot: 'wine-default' },
  ]},

  // Busca — empty (sugestões) · com query
  { url: '?screen=busca', ops: [
    { shot: 'busca-empty' },
    { fill: ['Buscar pessoas, vinhos, confrarias…', 'Malbec'] },
    { wait: 600 },
    { shot: 'busca-results' },
  ]},

  // Filtros avançados — default · com filtros aplicados
  { url: '?screen=filtros-avancados', ops: [
    { shot: 'filtros-default' },
    { click: 'Tinto' },
    { click: 'Argentina' },
    { click: 'Malbec' },
    { wait: 200 },
    { shot: 'filtros-applied' },
  ]},

  // Lista de desejos — default · modo Comparar (selecionando)
  { url: '?screen=lista-desejos', ops: [
    { shot: 'desejos-default' },
    { click: 'Comparar' },
    { wait: 250 },
    { shot: 'desejos-selecting' },
  ]},

  // Comparar vinhos
  { url: '?screen=comparar-vinhos', ops: [
    { shot: 'comparar-default' },
  ]},

  // ── Módulo 03 — Meu Paladar (Quiz 5 perguntas + Radar 5D) ──
  { url: '?screen=quiz', ops: [
    { shot: 'paladar-q1' },
    { click: 'Amargo, sem açúcar' },
    { shot: 'paladar-q1-selected' },
    { click: 'Continuar' },
    { shot: 'paladar-q2' },
    { click: 'Apimentado, sabor marcado' },
    { click: 'Continuar' },
    { shot: 'paladar-q3' },
    { click: 'Morango maduro' },
    { click: 'Continuar' },
    { shot: 'paladar-q4' },
    { click: 'Meio amargo' },
    { click: 'Continuar' },
    { shot: 'paladar-q5' },
    { click: 'Mais encorpada, intensa' },
    { click: 'Ver meu paladar' },
    { wait: 600 },
    { shot: 'paladar-result' },
  ]},

  // ── Módulo 03+ — Home sub-tabs ─────────────────────────
  { url: '?screen=home&tab=adega', ops: [
    { shot: 'home-adega-estante' },
    { click: 'Diário' }, { shot: 'home-adega-diario' },
    { click: 'Indicadores' }, { shot: 'home-adega-indicadores' },
    { click: 'Paladar' }, { shot: 'home-adega-paladar' },
  ]},
  { url: '?screen=home&tab=confrarias', ops: [
    { shot: 'home-confrarias-confrarias' },
    { click: 'Eventos' }, { shot: 'home-confrarias-eventos' },
  ]},
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Pre-marca tutoriais conhecidos como done — chamado nas sequências que
// historicamente dependiam de não ver o overlay "primeira visita".
// Sequências de TUTORIAL (que QUEREM mostrar o overlay) pulam esta etapa.
const KNOWN_TUTORS = ['marketplace','wine_detail','adega','diario','confraria','confraria-usar','confraria-criar','wizard_confraria','event_wizard','evento-usar','evento-criar','scanner','scanner_v2','carta_matches','harmoniza','radar_paladar','feed','comunidade','registro_consumo','ata_evento','treino_paladar','jornada','indicacao','badges'];
async function dismissAllTutors() {
  await page.evaluate((known) => {
    try {
      const done = Object.fromEntries(known.map(id => [id, true]));
      window.localStorage.setItem('tc.tutor.done', JSON.stringify(done));
    } catch (e) {}
  }, KNOWN_TUTORS);
}
for (const s of SEQ) {
  // Remove chaves de localStorage ANTES de navegar (ex.: forçar onboarding de feature)
  if (Array.isArray(s.clearLs) && s.clearLs.length) {
    if (page.url() === 'about:blank') {
      await page.goto(BASE + '/', { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(300);
    }
    await page.evaluate((keys) => { keys.forEach(k => { try { window.localStorage.removeItem(k); } catch (e) {} }); }, s.clearLs);
  }
  // Reseta tutoriais alvo no localStorage ANTES de navegar (se a sequência pediu)
  if (Array.isArray(s.resetTutors) && s.resetTutors.length) {
    // precisa estar em ALGUM origin pra ter acesso ao localStorage; navega no root primeiro
    if (page.url() === 'about:blank') {
      await page.goto(BASE + '/', { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(300);
    }
    await page.evaluate((ids) => {
      try {
        const raw = window.localStorage.getItem('tc.tutor.done') || '{}';
        const done = JSON.parse(raw);
        ids.forEach(id => { delete done[id]; });
        window.localStorage.setItem('tc.tutor.done', JSON.stringify(done));
      } catch (e) {}
    }, s.resetTutors);
  }
  await page.goto(BASE + '/' + s.url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(900);
  // Por padrão dispensa tutoriais; sequências de tutorial usam keepTutors:true
  if (!s.keepTutors) {
    await dismissAllTutors();
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(600);
  }
  for (const op of s.ops) {
    try {
      if (op.fill) { await page.getByPlaceholder(op.fill[0]).first().fill(op.fill[1]); await page.waitForTimeout(200); }
      else if (op.fillType) { await page.locator(`input[type=${op.fillType[0]}]`).first().fill(op.fillType[1]); await page.waitForTimeout(200); }
      else if (op.click) { await page.locator(`button:has-text("${op.click}")`).first().click({ timeout: 5000 }); await page.waitForTimeout(750); }
      else if (op.clickAria) { await page.locator(`button[aria-label="${op.clickAria}"], [role="button"][aria-label="${op.clickAria}"]`).first().click({ timeout: 5000 }); await page.waitForTimeout(750); }
      else if (op.clickIcon) {
        // Botao que contem um icone Material Symbol (texto do span do icone)
        const idx = op.iconNth || 0;
        const buttons = await page.locator(`button:has-text("${op.clickIcon}")`).all();
        if (buttons[idx]) { await buttons[idx].click({ timeout: 5000 }); await page.waitForTimeout(750); }
        else { throw new Error(`clickIcon: nao achou botao [${idx}] com icone ${op.clickIcon}`); }
      }
      else if (op.setLs) {
        await page.evaluate(([k, v]) => { try { window.localStorage.setItem(k, v); } catch (e) {} }, op.setLs);
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(500);
      }
      else if (op.resetTutor) {
        // Marca os tutorials informados como NAO-feitos no localStorage (forca overlay aparecer)
        const ids = op.resetTutor;
        await page.evaluate((toReset) => {
          try {
            const raw = window.localStorage.getItem('tc.tutor.done') || '{}';
            const done = JSON.parse(raw);
            toReset.forEach(id => { delete done[id]; });
            window.localStorage.setItem('tc.tutor.done', JSON.stringify(done));
          } catch (e) {}
        }, ids);
        // Reload pra effect re-disparar
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(400);
      }
      else if (op.wait) { await page.waitForTimeout(op.wait); }
      else if (op.shot) { await page.screenshot({ path: `${OUT}/${op.shot}.png` }); console.log('ok   ' + op.shot); }
    } catch (e) { console.log('FALHA op ' + JSON.stringify(op) + ' :: ' + String(e.message).split('\n')[0]); }
  }
}
await browser.close();
console.log('done');
