/* eslint-disable */
// @ts-nocheck
// Hub navegável da Sprint 14 (jun 2026)
// Listagem completa dos 28 itens descritos em docs/spec/sprint-14.md com
// cards filtráveis por tipo e responsável. Cada card abre uma tela
// detalhada com sintoma, UX correta, regra de negócio e aceite.
//
// Acessível em ?screen=sprint14-hub
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// Catálogo dos 28 itens da Sprint 14
const SPRINT14_ITEMS = [
  // Bugs urgentes herdados da 1.6.1
  { id: 'B1', kind: 'bug', title: 'Teclado iOS permanece aberto após primeiro acesso', owner: 'Otavio', module: 'M01', status: 'iniciado', urgent: true,
    summary: 'Em iOS, no primeiro fluxo de cadastro ou login, o teclado nativo permanece aberto sobre a tela ao tocar fora dos campos.',
    cause: 'Os campos têm onFocus que reabre o teclado no ciclo de render seguinte ao toque no botão. O blur disputa frame com o click.',
    fix: 'Remover handlers de onFocus dos campos. Aplicar blur explícito ao detectar toque fora da área de input. Dismiss via UIResponder no iOS.',
    accept: [
      'iOS, primeiro cadastro: tocar fora do campo fecha o teclado.',
      'iOS, login: tocar em Entrar dispara a ação na primeira tentativa e o teclado fecha.',
      'iOS, retomar app via swipe: nenhum teclado abre sozinho.',
      'Android: comportamento atual permanece sem regressão.',
      'Tela de comentário no feed: toque fora fecha o teclado.',
    ],
    telas: [
      'welcome', 'login', 'cadastro', 'login-social',
      'recuperar', 'recuperar-email', 'recuperar-otp', 'recuperar-redefinir',
      'criar-post', 'comentarios', 'chat-conversa',
      'register-consumo', 'registro-rapido', 'registro-completo',
      'wizard-confraria-1 a wizard-confraria-6',
      'event-wizard-1 a event-wizard-5',
      'editar-perfil-foto', 'config-conta', 'suporte-contato',
      'expert-aplicar', 'perguntar-expert', 'criar-momento',
    ],
  },
  { id: 'B2', kind: 'alteracao', title: 'Botão Comprar na tela de detalhe do vinho', owner: 'Guilherme', module: 'M04', status: 'iniciado', urgent: true,
    summary: 'Botão Comprar tenta levar a checkout incompleto sem banco de produtos ligado nem comissão definida.',
    rule: 'Marketplace de vinhos vende parceiros externos. Tchin não estoca. Até a base de produtos estar pronta e a regra de taxa do marketplace definida, remover o botão.',
    fix: 'Remover Comprar de WineDetailScreen. Manter Salvar na Wishlist, Adicionar à Estante e Ver onde encontrar. Adicionar faixa Em breve no rodapé.',
    accept: [
      'Detalhe de vinho não exibe botão Comprar.',
      'Faixa Em breve visível abaixo dos botões.',
      'Botão Salvar na Wishlist continua funcional.',
      'Botão Adicionar à Estante continua funcional.',
      'Nenhuma rota de checkout dispara a partir do detalhe do vinho.',
    ],
    telas: ['wine', 'marketplace', 'carta-matches', 'comparar-vinhos', 'lista-desejos', 'perfil-eu seção Atividade'],
  },
  { id: 'B3', kind: 'bug', title: 'Valor obrigatório para evento gratuito', owner: 'Mauricio', module: 'M12', status: 'iniciado', urgent: true,
    summary: 'No wizard de criação de evento, ao selecionar tipo Gratuito, o campo Valor continua marcando como obrigatório.',
    cause: 'Validador aplica required em Valor sem condicional pelo flag paid.',
    fix: 'Tornar Valor obrigatório apenas se o evento for Pago. Em Gratuito, ocultar o campo. Valor enviado pro backend é zero ou null.',
    accept: [
      'Criar evento Gratuito: avançar sem preencher Valor.',
      'Criar evento Pago: Valor obrigatório, mensagem clara em vermelho.',
      'Editar evento existente: trocar de Pago pra Gratuito limpa Valor.',
      'Validação client e server consistentes.',
    ],
    telas: ['event-wizard-1', 'event-wizard-2', 'event-wizard-3', 'event-wizard-4', 'event-wizard-5', 'evento-editar', 'event-detalhe', 'ParticiparSheet (M12)'],
  },
  { id: 'B4', kind: 'bug', title: 'Contador de comentários não atualiza ao excluir', owner: 'Mateus', module: 'M13', status: 'iniciado', urgent: false,
    summary: 'No post detail, excluir um comentário próprio deixa o contador inalterado até sair e voltar.',
    cause: 'Handler de delete remove item da lista mas não decrementa o contador exibido no cabeçalho do post.',
    fix: 'Ao deletar comentário, decrementar contador na mesma ação. Contador deriva do array de comentários, sem state duplicado.',
    accept: [
      'Deletar comentário próprio: contador cai em 1 imediatamente.',
      'Dono do post deletar comentário de terceiro: contador cai em 1 imediatamente.',
      'Adicionar comentário: contador sobe em 1 imediatamente.',
      'Recarregar a tela: contador permanece consistente.',
    ],
    telas: ['post-detail', 'comentarios', 'home/comunidade', 'perfil-atividade-publica'],
  },
  { id: 'B5', kind: 'bug', title: 'Deixar de seguir usuário sem ação visível', owner: 'Otavio', module: 'M14', status: 'investigar', urgent: false,
    summary: 'Tocar em Deixando de seguir no perfil de outro usuário não muda o estado do botão.',
    cause: 'Não reproduzido nos testes internos. Hipóteses: race condition, cache de seguidos com TTL longo, mismatch entre estado local e backend.',
    fix: 'Garantir que o botão sempre reflete a resposta do backend. Erro: toast de falha. Sucesso: atualiza state e invalida cache.',
    accept: [
      'Seguir usuário: botão muda pra Seguindo imediatamente.',
      'Deixar de seguir: botão muda pra Seguir imediatamente.',
      'Sair do perfil e voltar: estado consistente.',
      'Lista de Seguindo reflete a mudança ao reabrir.',
    ],
    telas: ['perfil-outro', 'perfil-seguidores', 'perfil-seguindo', 'perfil-sugestoes', 'confraria-detalhe aba Membros', 'comentarios', 'post-detail', 'home/comunidade'],
  },
  { id: 'B6', kind: 'bug', title: 'Modal cancelar evento gratuito não fecha', owner: 'Guilherme', module: 'M12', status: 'iniciado', urgent: false,
    summary: 'Em evento Gratuito, ao confirmar o cancelamento, a modal permanece visível.',
    cause: 'Callback de confirmação não chama setOpen(false) antes da navegação.',
    fix: 'Fechar a modal antes de disparar navegação ou animação. Garantir que modal não fica aberta após qualquer ação do CTA.',
    accept: [
      'Evento Gratuito: cancelar fecha a modal e atualiza o RSVP.',
      'Evento Pago >24h: cancelar abre fluxo de reembolso.',
      'Evento Pago 24h a 2h: cancelar abre fluxo de crédito em Pontos.',
      'Evento Pago <2h: opção desabilitada com explicação.',
    ],
    telas: ['event-detalhe', 'CancelarSheet (M12)', 'evento-presenca', 'notificacoes'],
  },
  { id: 'B7', kind: 'bug', title: 'Compartilhar aparece pra não-membros da confraria', owner: 'Mauricio', module: 'M11', status: 'iniciado', urgent: true,
    summary: 'Usuário não-membro vê o botão Compartilhar no menu da confraria, permitindo vazamento do link de convite.',
    rule: 'Compartilhar e Convidar só aparecem pra membros e admins. Não-membros veem apenas Reportar e voltar.',
    fix: 'Condicionar exibição à flag isMember. Membro: Compartilhar. Admin: Compartilhar + Convidar amigos. Convite mantém autoria do emissor.',
    accept: [
      'Não-membro: menu sem Compartilhar.',
      'Membro: menu com Compartilhar.',
      'Admin: menu com Compartilhar e Convidar amigos.',
    ],
    telas: ['confraria-detalhe', 'confraria-convidar', 'home/confrarias', 'confraria-regras'],
  },
  { id: 'B8', kind: 'alteracao', title: 'Botão flutuante em telas de detalhamento', owner: 'Mateus', module: 'transversal', status: 'iniciado', urgent: false,
    summary: 'FAB visível em quase todas as telas, inclusive em detalhamentos onde polui leitura ou sobrepõe CTAs principais.',
    rule: 'Whitelist: aparecer apenas em home/descobrir, home/comunidade, home/confrarias, home/adega, busca, marketplace, favoritos, lista-desejos, chat-lista. Ocultar em detalhamentos, wizards, onboardings, edge cases, configurações, sheets, telas modais.',
    fix: 'Implementar whitelist. Ação do FAB parametrizada por rota.',
    accept: [
      'Abrir wine: nenhum FAB.',
      'Abrir home/descobrir: FAB de Scanner.',
      'Abrir event-detalhe: nenhum FAB.',
      'Abrir chat-lista: FAB de Nova conversa.',
      'Voltar de detalhada pra home: FAB volta a aparecer.',
    ],
    telas: [
      'Mostrar: home/descobrir, home/comunidade, home/confrarias, home/adega, busca, marketplace, favoritos, lista-desejos, chat-lista.',
      'Ocultar: wine, event-detalhe, confraria-detalhe, post-detail, perfil-outro, perfil-eu, comentarios, perfil-seguidores, perfil-seguindo, perfil-atividade-publica, perfil-vinhos-provados, perfil-sugestoes, perfil-comparar-paladar.',
      'Ocultar: badges-galeria, relatorio-mensal.',
      'Ocultar: event-wizard-1 a event-wizard-5, wizard-confraria-1 a wizard-confraria-6.',
      'Ocultar: register-consumo, registro-rapido, registro-completo, registro-confirmacao.',
      'Ocultar: welcome, onboarding, login, cadastro, login-social, recuperar (todas), termos, politica-privacidade.',
      'Ocultar: quiz-nivel, quiz-interesses, tela-intencao, gps-primer, gps-negado, welcome-final, tutoriais.',
      'Ocultar: quiz, quiz-result.',
      'Ocultar: erro-404, erro-permissao, erro-sessao, erro-servidor, vinho-indisponivel.',
      'Ocultar: config-notif, config-privacidade, config-conta, conta-desativada, conta-excluida, config-bloqueados, suporte-faq, suporte-contato.',
      'Ocultar: carrinho, endereco, pagamento, pedido-confirmado.',
      'Ocultar: ParticiparSheet, EscolherMetodoSheet, PixLaciSheet, PagarForaSheet, CancelarSheet.',
      'Ocultar: scanner, scanner-result, scanner-v2, scanner-result-v2, scanner-fallback, modo-restaurante, carta-matches, porque-combina.',
      'Ocultar: harmoniza, harmoniza-resultados.',
      'Ocultar: treino-paladar, treino-licao, treino-liga, treino-aprender.',
      'Ocultar: aprender, aprenda, aprenda-detalhe.',
      'Ocultar: indicacao-landing, indicacao-compartilhar, indicacao-meus-convites, indicacao-recompensas, convite-recebido.',
      'Ocultar: expert-virar, expert-aplicar, expert-pendente, expert-q-a, expert-responder, perguntar-expert.',
      'Ocultar: confraria-config, confraria-convidar, confraria-sair, confraria-transferir, confraria-regras, confraria-welcome, confraria-apresentar, confraria-tour-rapido.',
      'Ocultar: evento-editar, evento-presenca, evento-pos-avaliar, evento-pos-ata.',
      'Ocultar: editar-perfil, editar-perfil-foto, editar-perfil-paladar, editar-perfil-privacidade.',
      'Ocultar: push-primer, push-negado, push-canais, push-preview, plus-one, nudge-d1, nudge-d3, nudge-d7, nudge-d14.',
      'Ocultar: jornada, pontos, jornada-celebrar, desafio-detalhe.',
      'Ocultar: chat-conversa.',
      'Ocultar: criar-post, criar-momento.',
      'Ocultar: filtros-avancados, comparar-vinhos.',
      'Ocultar: qualquer sheet, modal ou overlay em geral.',
    ],
  },
  // Alterações de UX e label
  { id: 'A1', kind: 'feature', title: 'Tela Descobri', owner: 'Guilherme', module: 'M04', status: 'definir', urgent: false,
    summary: 'Hub editorial e algorítmico que substitui a antiga tela marketplace. A home/descobrir continua sendo o hub principal e ganha CTA destacado pra abrir a Descobri.',
    rule: 'Algoritmo de Pra você: 50% paladar, 30% popularidade, 20% editorial. Sem login vira Editorial top picks. Sem registros usa só paladar. Com registros usa fórmula completa.',
    fix: 'Bloco 1: Hero do dia editorial. Bloco 2: Pra você algorítmico. Bloco 3: Confrarias da região. Bloco 4: Eventos próximos. Bloco 5: Marketplace de Experiência. Bloco 6: Curiosidades editoriais. Sticky bottom: FAB de Scanner.',
    accept: [
      'Abrir Descobri: hero visível em 700ms.',
      'Bloco Pra você carrega progressivamente.',
      'Sem GPS: mostra capital do estado do usuário.',
      'Tap em qualquer item navega pra detail correto.',
      'Pull to refresh atualiza editorial e algorítmico.',
    ],
    telas: ['marketplace (substituído pelo novo Descobri)', 'home/descobrir (mantém hub e ganha CTA Abrir Descobri)', 'wine', 'confraria-detalhe', 'event-detalhe', 'confraria-detalhe aba Experiência', 'scanner (entry via FAB)', 'quiz (calibração)'],
  },
  { id: 'A2', kind: 'alteracao', title: 'Sub aba Adega da confraria volta de Estoque pra Adega', owner: 'Gustavo', module: 'M11', status: 'definido', urgent: false,
    summary: 'Sprint 13 trocou a quarta aba do confraria-detalhe (vinhos catalogados pela confraria) de Adega pra Estoque. Decisão Gabriel jun 2026 reverte pra Adega.',
    rule: 'Adega é a poesia da marca. Estoque é jargão de comerciante. Escopo da correção: SÓ a quarta aba do confraria-detalhe. Nenhuma outra tela é tocada.',
    fix: 'Reverter o rótulo da quarta sub aba do confraria-detalhe de Estoque pra Adega. Manter conteúdo do AdegaConfTab inalterado.',
    accept: [
      'confraria-detalhe: a quarta aba chama Adega e não Estoque.',
      'Nenhuma outra tela do app foi tocada.',
    ],
    telas: ['confraria-detalhe header de abas (quarta aba muda de Estoque pra Adega)', 'AdegaConfTab (componente que renderiza a aba, só ajusta header)'],
  },
  { id: 'A3', kind: 'feature', title: 'Match do paladar com vinhos', owner: 'Mateus', module: 'M04', status: 'pausado', urgent: false,
    summary: 'Fórmula de match score por vinho. Pausado por falta de banco de produtos e cálculo do percentual.',
    rule: 'score = 0.50 * cosineSim(paladarUsuario, perfilVinho) + 0.30 * popularityBoost + 0.20 * editorialBoost. Pesos calibráveis server side.',
    fix: 'Estados: sem paladar não exibe. Paladar sem registros: só w1. Paladar e registros: fórmula completa. Faixas: <50% Combina pouco. 50-70% cinza. 70-85% burgundy. >85% chip Alto match.',
    accept: [
      'Usuário sem paladar: nenhum percentual.',
      'Usuário com paladar: percentual em todos os cards de vinho.',
      'Mudança de paladar: scores recalculados na próxima abertura.',
    ],
    telas: ['wine', 'marketplace', 'home/descobrir', 'carta-matches', 'comparar-vinhos', 'scanner-result-v2', 'porque-combina', 'harmoniza-resultados'],
  },
  { id: 'A4', kind: 'feature', title: 'Login Google em conta com senha', owner: 'João', module: 'M01', status: 'producao', urgent: true,
    summary: 'Sprint 12 1.6.2. Usuário cadastrado com email e senha pode logar via Google se o email bater.',
    rule: 'Vínculo automático se email do Google bater. Senha continua válida em paralelo (duas formas de entrar na mesma conta). Email Google diferente cria conta nova.',
    fix: 'Login: botão Entrar com Google funciona pra contas com senha. Cadastro: igual. config-conta: linha Vincular Google com status.',
    accept: [
      'Conta antiga com senha, primeiro login com Google: cai na conta correta.',
      'Conta antiga, Google com email diferente: cria conta nova.',
      'config-conta mostra vínculos ativos.',
    ],
    telas: ['welcome', 'login', 'login-social', 'cadastro', 'config-conta'],
  },
  { id: 'A5', kind: 'alteracao', title: 'Migração Apple Store e Google Play', owner: 'Mauricio', module: 'infra', status: 'producao', urgent: false,
    summary: 'Sprint 13. App migrado de LIVI pra TchinTchin oficial nas duas lojas. Bundle id preservado.',
    rule: 'Push tokens FCM continuam válidos. AppsFlyer SDK manteve o link. In App Reviews resetam contador.',
    fix: 'Pendência menor: atualizar screenshot da loja com novos shots da Adega e do Descobri após A1.',
    accept: [
      'Migração concluída.',
      'Screenshots atualizados após A1.',
    ],
    telas: ['Nenhuma tela do app é tocada (apenas store assets)', 'Regerar 6 screenshots da loja após A1 e R7'],
  },
  // Features e backlog priorizados
  { id: 'F1', kind: 'feature', title: 'Importação banco de vinhos do marketplace', owner: 'LAPM', module: 'M04', status: 'andamento', urgent: false,
    summary: 'Importar 200 mil vinhos seed, normalizar campos, gerar perfil sensorial estimado, disponibilizar endpoints.',
    rule: 'Campos: nome, produtor, país, região, uva principal, uvas secundárias, safra, tipo, teor alcoólico, preço sugerido, foto. Perfil sensorial por uva + região + estilo alimenta o match (A3).',
    fix: 'Importar, normalizar, gerar perfil, disponibilizar endpoints. Thumbnails randômicas reusam Sprint 13.',
    accept: [
      'Marketplace lista sem campos null.',
      'Detalhe mostra todas as informações.',
      'Match score consegue calcular pra qualquer vinho.',
      'Busca por nome retorna em <1s pra 95% das queries.',
    ],
    telas: ['marketplace', 'wine', 'busca', 'filtros-avancados', 'comparar-vinhos', 'lista-desejos', 'carta-matches', 'home/descobrir bloco Pra você'],
  },
  { id: 'F2', kind: 'feature', title: 'Token Keycloak e regra de logout', owner: 'Bruno', module: 'M01 e M21', status: 'producao', urgent: false,
    summary: 'Usuário permanece logado indefinidamente em condições normais. Refresh token renova em background.',
    rule: 'Logout só dispara em 3 cenários: atualização grande, segurança (atividade suspeita), inatividade (>30 dias sem abrir).',
    fix: 'Refresh token expira em 30 dias e renova a cada uso. Erro-sessao com reason claro em cada caso.',
    accept: [
      'Abrir diariamente: nunca cai em erro-sessao.',
      '7 dias sem abrir: entra direto.',
      '60 dias sem abrir: erro-sessao reason inatividade.',
    ],
    telas: ['welcome', 'login', 'erro-sessao (3 reasons)', 'recuperar-email'],
  },
  { id: 'F3', kind: 'alteracao', title: 'Reverter Estoque pra Adega (sub aba da confraria)', owner: 'Gustavo', module: 'M11', status: 'definido', urgent: false,
    summary: 'Ver A2. Escopo: apenas a quarta aba do confraria-detalhe.',
    rule: 'Idem A2.',
    fix: 'Idem A2.',
    accept: [],
    telas: ['confraria-detalhe header de abas (quarta aba)', 'AdegaConfTab'],
  },
  { id: 'F4', kind: 'feature', title: 'Onboarding com 3 slides MKT', owner: 'Bruno', module: 'M02', status: 'producao', urgent: false,
    summary: 'Sprint 13. 3 slides editoriais pre auth: identidade, dor 1 (incerteza), dor 3 (memória).',
    rule: 'Layout novo do MKT. Transição horizontal sem fade. Dots fixos. Avançar nos 2 primeiros, Começar no terceiro. Pular no topo direito.',
    fix: 'Aplicar layout novo sem mudar estrutura.',
    accept: [
      'Primeira abertura: 3 slides com layout novo.',
      'Pular: vai direto pro welcome.',
      'Completar: vai direto pro welcome.',
      'Reinstall: vê os slides de novo.',
      'Login do mesmo dispositivo: pula slides.',
    ],
    telas: ['onboarding (3 slides pre auth)', 'welcome'],
  },
  { id: 'F5', kind: 'feature', title: 'Templates para criação de eventos', owner: 'alocar', module: 'M12', status: 'definido', urgent: false,
    summary: '5 templates prontos no wizard de evento.',
    rule: 'T1 Vinhos por país (default Brasil). T2 Degustação às cegas. T3 Comparativo de uvas. T4 Tema livre social. T5 Vinho e harmonização.',
    fix: 'No passo Tema do wizard, linha Use um template com 5 cards. Tap preenche tema, descrição, quantidade sugerida, checklist. Editar depois mantém vínculo como Personalizado.',
    accept: [
      'Wizard mostra 5 templates.',
      'Tap em T1 com país Brasil preenche campos.',
      'Trocar de template substitui sem confirmação dupla.',
      'Editar campo após template marca como Personalizado.',
    ],
    telas: ['event-wizard-1 (passo Tema com 5 cards de template)', 'event-wizard-2 (Descrição preenchida)', 'event-wizard-4 (Capacidade sugerida)', 'evento-editar'],
  },
  { id: 'F6', kind: 'feature', title: 'Correlação confraria template', owner: 'alocar', module: 'M12', status: 'definido', urgent: false,
    summary: 'Sugere template mais coerente com estilo da confraria ao abrir wizard.',
    rule: 'Brasil/Iniciantes: T1. Velho Mundo/Estudo: T3. Variedade/Eclético: T2. Social: T4. Gastronomia: T5. Sem estilo: nenhum sugerido.',
    fix: 'Card sugerido aparece primeiro com badge Sugerido pra esta confraria. Outros 4 em ordem normal. Tocar em outro mostra confirmação rápida.',
    accept: [
      'Confraria Velho Mundo: T3 com badge.',
      'Confraria Social: T4 com badge.',
      'Confraria sem estilo: lista normal sem badge.',
    ],
    telas: ['confraria-detalhe (CTA Criar evento)', 'event-wizard-1 (badge Sugerido)', 'wizard-confraria-6 (captura estilo)'],
  },
  { id: 'F7', kind: 'feature', title: 'Modal tutorial pós criação de confraria', owner: 'alocar', module: 'M11', status: 'definido', urgent: false,
    summary: 'Modal de boas vindas ao concluir wizard de confraria, com 3 passos sugeridos.',
    rule: '3 passos: Convide o pessoal, Crie o primeiro evento (com template sugerido), Compartilhe nas redes.',
    fix: 'Header Sua confraria está pronta. Subheader Próximo passo: marca o primeiro evento. Footer Começar agora abre passo 2. Link Vou fazer depois fecha. Não dispara de novo após fechar.',
    accept: [
      'Criar confraria e concluir wizard: modal aparece.',
      'Fechar: vai pro detalhe sem regressão.',
      'Reabrir detalhe: modal não aparece de novo.',
      'CTA do passo 2 leva pro wizard com template sugerido.',
    ],
    telas: ['wizard-confraria-6 (último passo)', 'confraria-welcome', 'confraria-detalhe (primeira abertura)', 'confraria-convidar', 'event-wizard-1 (com template sugerido)', 'indicacao-compartilhar'],
  },
  { id: 'F8', kind: 'push', title: 'Push D+3 sem evento criado', owner: 'alocar', module: 'M11 e M18', status: 'definido', urgent: false,
    summary: 'Push lembrete 3 dias após criação da confraria sem evento. Banner sticky no detalhe pra admin.',
    rule: 'Disparo: 10h do D+3. Quiet hours 22h-8h. Cap: 1 vez. Repetir em D+7 e D+14.',
    fix: 'Push: Sua confraria está esperando. Marca o primeiro encontro de {nome} pra começar bem. Banner sticky pra admin: Sua confraria não tem evento ainda. Crie o primeiro evento.',
    accept: [
      'Confraria sem evento por 3 dias: push às 10h.',
      'Evento criado antes do D+3: push não dispara.',
      'Admin vê banner sticky.',
      'Não admin não vê banner.',
    ],
    telas: ['notificacoes (push enviado)', 'push-preview', 'confraria-detalhe (banner sticky pra admin)', 'event-wizard-1 (destino do CTA do banner)'],
  },
  { id: 'F9', kind: 'feature', title: 'Onboarding novo membro em confraria', owner: 'alocar', module: 'M11', status: 'definido', urgent: false,
    summary: 'Modal de boas vindas ao entrar pela primeira vez. 3 highlights: próximo evento, conversa ativa, adega coletiva.',
    rule: 'Conversa ativa = publicação no feed da confraria com menos de 7 dias. Adega coletiva = banco de vinhos da confraria (US-179).',
    fix: 'Header com avatar grande + nome. Texto Bem vindo à {nome}. 3 highlights. CTA Apresenta você leva pro confraria-apresentar. CTA Mais tarde fecha e vai pro detalhe.',
    accept: [
      'Primeiro acesso pós entrada: modal aparece.',
      'Acessos subsequentes: não aparece.',
      'Highlights renderizam mesmo sem dados (vazias claras).',
    ],
    telas: ['confraria-welcome (entrada pós convite)', 'confraria-detalhe (primeira abertura)', 'confraria-apresentar', 'confraria-tour-rapido'],
  },
  { id: 'F10', kind: 'feature', title: 'Feed da confraria com contadores', owner: 'alocar', module: 'M11', status: 'definido', urgent: false,
    summary: 'Barra com 3 contadores abaixo do header da confraria.',
    rule: 'Eventos próximos: próximos 30 dias. Publicações: últimos 7 dias. Novos vinhos: últimos 30 dias. Se tudo zero: barra some.',
    fix: '3 chips iguais lado a lado, número grande no topo + label em caps. Tap muda de aba (Eventos com filtro Próximos, Publicações, Adega).',
    accept: [
      'Confraria ativa: barra com 3 contadores corretos.',
      'Confraria apagada (tudo zero): barra não aparece.',
      'Tap em chip muda de aba.',
    ],
    telas: ['confraria-detalhe (barra abaixo do header)', 'confraria-detalhe aba Eventos', 'confraria-detalhe aba Publicações', 'confraria-detalhe aba Adega'],
  },
  { id: 'F11', kind: 'feature', title: 'Cutuca o organizador', owner: 'Otavio', module: 'M11 e M18', status: 'definido', urgent: false,
    summary: 'Card no feed da confraria quando inativa há 14 dias sem publicação ou 21 dias sem evento.',
    rule: 'Cooldown 7 dias entre cutucadas. Push pros admins com cooldown próprio. Card some após nova publicação ou evento criado.',
    fix: 'Card: Tá quieto por aqui. {Cutuca os admins}. Push pro admin: Cutucada da confraria. {nome do usuário} sente falta de movimento em {confraria}. Que tal um evento?',
    accept: [
      'Sem publicação há 15 dias: card aparece pra qualquer membro.',
      'Membro cutuca: push chega pros admins.',
      'Após cutucada: 7 dias sem nova cutucada possível.',
      'Após nova atividade: card some.',
    ],
    telas: ['confraria-detalhe aba Publicações', 'confraria-detalhe aba Eventos', 'notificacoes (push registrado)', 'push-preview'],
  },
  { id: 'F12', kind: 'push', title: 'Push de evento D-3 D-1 dia', owner: 'Otavio', module: 'M12 e M18', status: 'definido', urgent: false,
    summary: 'Cadência de push pré evento com banner em destaque no detalhe da confraria.',
    rule: 'D-3 às 19h. D-1 às 19h. Dia às 9h. Quiet 22h-8h. Cap 1 por push. Evento confirmado + gratuito: D-3 não dispara. Cancelado: nenhum push.',
    fix: 'D-3 Daqui a 3 dias. {nome} é em 3 dias. D-1 Amanhã: {nome}. Dia Hoje às {hora}. Banner sticky aba Eventos quando próximo evento a 3 dias ou menos.',
    accept: [
      'Evento daqui 3 dias: push D-3 às 19h.',
      'Confirmado em evento gratuito: D-3 não dispara.',
      'Cancelado: nenhum push.',
      'Banner sticky pra eventos a 3 dias ou menos.',
    ],
    telas: ['event-detalhe (banner sticky)', 'confraria-detalhe aba Eventos (banner)', 'home/confrarias aba Eventos Meus (banner)', 'notificacoes (3 pushes)', 'push-preview'],
  },
  // Pushes em produção (revisão de copy)
  { id: 'P1', kind: 'push', title: 'Push 4h após cadastro sem registrar', owner: 'Otavio', module: 'M18', status: 'producao', urgent: false,
    summary: 'Sprint 13. Dispara 4h após criação da conta se usuário não tem registro no diário.',
    rule: 'Cap 1 vez. Quiet 22h-8h, posterga pras 9h se cai em quiet.',
    fix: 'Copy ajustada: Vamos começar sua adega? Registra o primeiro vinho em 1 minuto.',
    accept: [
      '4h após cadastro sem registro: push dispara.',
      'Registrou antes das 4h: push não dispara.',
      'Quiet hours: posterga pra 9h.',
    ],
    telas: ['Nenhuma tela do app é tocada (só copy do push)', 'Destino do tap: register-consumo ou home/adega'],
  },
  { id: 'P2', kind: 'push', title: 'Push 3º dia 9h sobre quiz paladar', owner: 'Otavio', module: 'M18', status: 'producao', urgent: false,
    summary: 'Sprint 13. Dispara no 3º dia após cadastro às 9h se usuário não fez quiz.',
    rule: 'Cap 1 vez.',
    fix: 'Copy ajustada: Calibrou seu paladar? Em 2 minutos a gente descobre.',
    accept: [
      '3º dia 9h sem quiz: push dispara.',
      'Fez quiz antes: não dispara.',
    ],
    telas: ['Nenhuma tela do app é tocada (só copy do push)', 'Destino do tap: quiz'],
  },
  { id: 'P3', kind: 'push', title: 'Push 7º dia 18h sentiu sua falta', owner: 'Otavio', module: 'M18', status: 'producao', urgent: false,
    summary: 'Sprint 13. Dispara no 7º dia após cadastro às 18h se usuário não abriu nos últimos 3 dias.',
    rule: 'Cap 1 vez.',
    fix: 'Copy ajustada: {Nome}, sentimos sua falta. Tem confraria nova na sua região.',
    accept: [
      '7º dia 18h sem abrir nos últimos 3: push dispara.',
      'Abriu nos últimos 3 dias: não dispara.',
    ],
    telas: ['Nenhuma tela do app é tocada (só copy do push)', 'Destino do tap: home/confrarias'],
  },
  // Bloco R1 a R21: refatoração v2 visual de todos os módulos
  { id: 'R1', kind: 'refator', title: 'Refatoração v2 do M01 Auth e Acesso', owner: 'time design + Otavio', module: 'M01', status: 'definido', urgent: false,
    summary: 'Aplicar identidade burgundy + SSO Apple/Google em destaque nas 13 telas de autenticação. Sem magic link, sem OTP de telefone.',
    rule: 'Sprint 13 entregou base SSO. Esta refatoração unifica visual com tokens v2. Tipografia Fraunces em headlines, Inter em corpo. Botões burgundy primary.',
    fix: 'Refatorar cada tela usando design system v2.',
    accept: [
      'Todas as 13 telas com identidade visual unificada.',
      'SSO Apple e Google em destaque no welcome.',
      'Sem regressão funcional.',
    ],
    telas: ['welcome', 'onboarding', 'login', 'cadastro', 'login-social', 'recuperar', 'recuperar-email', 'recuperar-enviado', 'recuperar-otp', 'recuperar-redefinir', 'recuperar-sucesso', 'termos', 'politica-privacidade'],
  },
  { id: 'R2', kind: 'refator', title: 'Refatoração v2 do M02 Onboarding educacional', owner: 'time design + Bruno', module: 'M02', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 7 telas de onboarding educacional pós auth. Inclui as variantes de gps-primer por intent.',
    rule: 'Mínimo 3 interesses no quiz-interesses. GPS por intent. Welcome final com 3 highlights + pílula sutil de Pontos Tchin (M19 § 19.0.2).',
    fix: 'Aplicar v2 com transições suaves entre passos.',
    accept: [
      'Todas as telas com identidade v2.',
      'Validação de mínimo 3 interesses funcional.',
      'Pílula de Pontos Tchin sutil no welcome-final.',
    ],
    telas: ['quiz-nivel', 'quiz-interesses', 'tela-intencao', 'gps-primer (todas as variantes por intent)', 'gps-negado', 'welcome-final', 'tutoriais'],
  },
  { id: 'R3', kind: 'refator', title: 'Refatoração v2 do M03 Meu Paladar', owner: 'time design', module: 'M03', status: 'definido', urgent: false,
    summary: 'Refatoração v2 do quiz de paladar (5 perguntas) e resultado (radar 5 dimensões).',
    rule: 'Dimensões canônicas: Acidez, Tanino, Corpo, Doçura, Aromas (M07 § 7.5 fecha como Aromas).',
    fix: 'Refatorar quiz com swipe horizontal e radar visual modernizado.',
    accept: [
      'Quiz com transição entre perguntas fluida.',
      'Resultado com radar refeito.',
      'CTA Refazer disponível.',
    ],
    telas: ['quiz', 'quiz-result'],
  },
  { id: 'R4', kind: 'refator', title: 'Refatoração v2 do M04 Descobrir e Marketplace', owner: 'time design + Guilherme', module: 'M04', status: 'definido', urgent: false,
    summary: 'Refatoração v2 do hub Descobri (já tratada em A1), do marketplace e das telas de exploração e detalhe de vinho.',
    rule: 'home/descobrir vira Descobri (A1). Marketplace sem botão Comprar (B2). Wine com match score (A3) e taxonomia clara.',
    fix: 'A1 entrega o novo Descobri. As outras 6 telas ganham layout v2.',
    accept: [
      '7 telas com identidade v2.',
      'Match score visível.',
      'Sem botão Comprar inline.',
    ],
    telas: ['home/descobrir (transformado em Descobri)', 'marketplace', 'wine', 'busca', 'filtros-avancados', 'lista-desejos', 'comparar-vinhos'],
  },
  { id: 'R5', kind: 'refator', title: 'Refatoração v2 do M05 Carrinho e Checkout', owner: 'time design', module: 'M05', status: 'definido', urgent: false,
    summary: 'Refatoração v2 do carrinho geral, não dos eventos (que ficam em M12). Bloqueio de back em pedido-confirmado.',
    rule: 'Bloqueio de back em pedido-confirmado (M05 § 5.0). Tabela de cupons (não hard-coded). Avaliação opcional pós compra.',
    fix: 'Refatorar 4 telas do checkout principal.',
    accept: [
      '4 telas com identidade v2.',
      'Bloqueio de back funcional.',
      'Cupom com tabela aplicada.',
    ],
    telas: ['carrinho', 'endereco', 'pagamento', 'pedido-confirmado'],
  },
  { id: 'R6', kind: 'refator', title: 'Refatoração v2 do M06 Scanner e Aprenda Bebendo', owner: 'time design + Guilherme', module: 'M06', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 8 telas do scanner (legado v1, atual v2, modo restaurante, harmonização).',
    rule: 'Aposentar v1 (M06 § 6.0). Pontos 15 por contribuir vinho novo (cap 5/dia). Compartilhar carta pública.',
    fix: 'Refatorar todas as 8 telas com a v2.',
    accept: [
      '8 telas com v2.',
      'Aviso de aposentadoria do v1.',
      'Match score no scanner-result-v2.',
    ],
    telas: ['scanner (legado v1)', 'scanner-result (legado v1)', 'scanner-v2', 'scanner-result-v2', 'scanner-fallback', 'modo-restaurante', 'carta-matches', 'porque-combina'],
  },
  { id: 'R7', kind: 'refator', title: 'Refatoração v2 do M07 Adega e Diário', owner: 'time design + Mateus', module: 'M07', status: 'definido', urgent: false,
    summary: 'Refatoração v2 da Adega: taxonomia 4 conceitos visível, slot multi garrafa, relatório mensal e anual.',
    rule: 'Banner Onde fica o quê dispensável via localStorage tc.adega.tax.dismissed. Slot com badge x N. Pontuação escalonada (5/8/10/15/20 cap 3/dia). Reverter Estoque pra Adega (A2).',
    fix: 'Refatorar 7 telas da Adega.',
    accept: [
      '7 telas com v2.',
      'Banner taxonomia funcional.',
      'Slot multi garrafa visível.',
      'Label Adega revertido.',
    ],
    telas: ['home/adega', 'register-consumo', 'registro-rapido', 'registro-completo', 'registro-confirmacao', 'relatorio-mensal', 'favoritos'],
  },
  { id: 'R8', kind: 'refator', title: 'Refatoração v2 do M08 Treine seu Paladar', owner: 'time design', module: 'M08', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 4 telas do Treino. Vidas regeneram 4h. Divisões nomeadas.',
    rule: 'Frisante, Branco, Rosé, Tinto, Reserva, Gran Reserva. Cristais convertem em pontos (1 cristal = 5 pts).',
    fix: 'Aplicar v2 nas 4 telas do Treino.',
    accept: [
      '4 telas com v2.',
      'Vidas com regeneração funcional.',
      'Divisões nomeadas no liga.',
    ],
    telas: ['treino-paladar (8 passos onboarding mascote)', 'treino-licao (conceito, exercício, feedback, completa)', 'treino-liga', 'treino-aprender'],
  },
  { id: 'R9', kind: 'refator', title: 'Refatoração v2 do M09 Aprenda hub educacional', owner: 'time design', module: 'M09', status: 'definido', urgent: false,
    summary: 'Unificar M06 (Aprenda Bebendo) e M09 (Aprenda editorial) num hub único.',
    rule: 'Botão Começar leva pro hub unificado. Acesso pela bottom nav ou pelo header de Descobrir.',
    fix: 'Refatorar 3 telas do Aprenda com v2 e ponto de unificação com M06.',
    accept: [
      '3 telas com v2.',
      'Acesso unificado funcional.',
    ],
    telas: ['aprender', 'aprenda', 'aprenda-detalhe'],
  },
  { id: 'R10', kind: 'refator', title: 'Refatoração v2 do M10 Harmoniza', owner: 'time design', module: 'M10', status: 'definido', urgent: false,
    summary: 'Refatoração v2 do harmoniza prato vs vinho. Bidirecional (prato pede vinho ou vinho pede prato).',
    rule: 'Contexto: ocasião, estação, orçamento.',
    fix: 'Refatorar 2 telas com v2 e habilitar bidirecionalidade.',
    accept: [
      '2 telas com v2.',
      'Pode partir de prato OU de vinho.',
    ],
    telas: ['harmoniza (entry)', 'harmoniza-resultados (sugestões com match individual)'],
  },
  { id: 'R11', kind: 'refator', title: 'Refatoração v2 do M11 Confrarias', owner: 'time design + Mauricio', module: 'M11', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 21 telas do módulo Confrarias. Inclui 5 abas no confraria-detalhe (Eventos, Publicações, Membros, Adega, Experiência).',
    rule: 'Compartilhar e Convidar só pra membros e admins (B7). Onboarding novo membro 3 highlights (F9). Modal pós criação 3 passos (F7). Banner D+3 (F8). Card Cutuca (F11). Barra 3 contadores (F10).',
    fix: 'Refatorar 21 telas com v2 e plugar todas as features F7 a F11.',
    accept: [
      '21 telas com v2.',
      'Compartilhar oculto pra não membro.',
      'Modal pós criação funcional.',
      'Barra 3 contadores funcional.',
    ],
    telas: ['home/confrarias', 'confraria-detalhe header', 'confraria-detalhe aba Eventos', 'confraria-detalhe aba Publicações', 'confraria-detalhe aba Membros', 'confraria-detalhe aba Adega', 'confraria-detalhe aba Experiência', 'wizard-confraria-1', 'wizard-confraria-2', 'wizard-confraria-3', 'wizard-confraria-4', 'wizard-confraria-5', 'wizard-confraria-6', 'confraria-config', 'confraria-convidar', 'confraria-sair', 'confraria-transferir', 'confraria-regras', 'confraria-welcome', 'confraria-apresentar', 'confraria-tour-rapido'],
  },
  { id: 'R12', kind: 'refator', title: 'Refatoração v2 do M12 Eventos', owner: 'time design + Guilherme', module: 'M12', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 11 telas do módulo Eventos. Inclui wizard, detalhe, presença, pós evento e sheets de pagamento.',
    rule: 'Taxa visível e separada (M12 § 12.A.1). 3 janelas de cancelamento. Endereço 24h antes. Templates (F5). Correlação (F6). Push D-3 D-1 dia (F12).',
    fix: 'Refatorar 11 telas com v2 e plugar todas as features F5, F6, F12.',
    accept: [
      '11 telas com v2.',
      'Row Valor com breakdown taxa em event-detalhe.',
      'CancelarSheet com 3 variações.',
      '5 templates funcionais no wizard.',
    ],
    telas: ['event-wizard-1', 'event-wizard-2', 'event-wizard-3', 'event-wizard-4', 'event-wizard-5', 'event-detalhe', 'evento-editar', 'evento-presenca', 'evento-pos-avaliar', 'evento-pos-ata', 'ParticiparSheet + EscolherMetodoSheet + PixLaciSheet + PagarForaSheet + CancelarSheet'],
  },
  { id: 'R13', kind: 'refator', title: 'Refatoração v2 do M13 Comunidade e Feed', owner: 'time design + Mateus', module: 'M13', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 5 telas do feed e posts.',
    rule: 'Comentários tela cheia E inline (M13 § 13.0). Stories existem (criar-momento). Audiência default Minhas confrarias.',
    fix: 'Refatorar 5 telas com v2. Contador de comentários atualiza ao excluir (B4).',
    accept: [
      '5 telas com v2.',
      'Stories funcionais.',
      'Contador atualiza ao excluir.',
    ],
    telas: ['home/comunidade', 'criar-post', 'criar-momento', 'post-detail', 'comentarios'],
  },
  { id: 'R14', kind: 'refator', title: 'Refatoração v2 do M14 Perfil e Social', owner: 'time design', module: 'M14', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 13 telas de perfil. perfil-eu como rota dedicada.',
    rule: 'perfil-eu canônico (M14 § 14.3). Seguir bilateral se privado (M14 § 14.1). Handle com cooldown 30 dias (M14 § 14.2).',
    fix: 'Refatorar 13 telas com v2.',
    accept: [
      '13 telas com v2.',
      'perfil-eu como rota.',
      'Cooldown handle aplicado.',
    ],
    telas: ['perfil-outro', 'perfil-eu', 'editar-perfil', 'editar-perfil-foto', 'editar-perfil-paladar', 'editar-perfil-privacidade', 'perfil-seguidores', 'perfil-seguindo', 'perfil-atividade-publica', 'perfil-vinhos-provados', 'perfil-sugestoes', 'perfil-comparar-paladar', 'badges-galeria'],
  },
  { id: 'R15', kind: 'refator', title: 'Refatoração v2 do M15 Expert', owner: 'time design', module: 'M15', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 6 telas do Expert.',
    rule: 'Só badge sem comissão (M15 § 15.1). Resposta pública, notif só pra quem perguntou (M15 § 15.2). Cooldown 30 dias (M15 § 15.3).',
    fix: 'Refatorar 6 telas com v2.',
    accept: [
      '6 telas com v2.',
      'Cooldown de reaplicação aplicado.',
    ],
    telas: ['expert-virar', 'expert-aplicar', 'expert-pendente', 'expert-q-a', 'expert-responder', 'perguntar-expert'],
  },
  { id: 'R16', kind: 'refator', title: 'Refatoração v2 do M16 Indicação e Convites', owner: 'time design', module: 'M16', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 5 telas de Indicação.',
    rule: 'Bilateral R$ 30 e R$ 30 (M16). Bônus libera no cadastro do convidado (M16 § 16.0.1). Teto 25 com badge Top Embaixador (M16 § 16.0.2).',
    fix: 'Refatorar 5 telas com v2.',
    accept: [
      '5 telas com v2.',
      'Badge Top Embaixador aplicado ao chegar em 25.',
    ],
    telas: ['indicacao-landing', 'indicacao-compartilhar', 'indicacao-meus-convites', 'indicacao-recompensas', 'convite-recebido'],
  },
  { id: 'R17', kind: 'refator', title: 'Refatoração v2 do M17 Chat e DMs', owner: 'time design', module: 'M17', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 2 telas do Chat.',
    rule: 'DM configurável pelo user (M17 § 17.0.1). Histórico de grupo retroativo (M17 § 17.0.2).',
    fix: 'Refatorar 2 telas com v2.',
    accept: [
      '2 telas com v2.',
      '5 opções de DM em config-privacidade.',
    ],
    telas: ['chat-lista (tabs Todas, Pessoas, Grupos, Não lidas)', 'chat-conversa'],
  },
  { id: 'R18', kind: 'refator', title: 'Refatoração v2 do M18 Notificações e Engajamento', owner: 'time design', module: 'M18', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 11 telas de notificações e nudges.',
    rule: 'Quiet hours 22h-8h em todas as notifs. Cap diário ~4 por usuário. Novos pushes (F8, F11, F12) entram no catálogo.',
    fix: 'Refatorar 11 telas com v2 e plugar novos pushes.',
    accept: [
      '11 telas com v2.',
      'Quiet hours aplicado.',
      'F8 F11 F12 no catálogo.',
    ],
    telas: ['notificacoes', 'push-primer', 'push-negado', 'push-canais', 'push-preview', 'nudge-d1', 'nudge-d3', 'nudge-d7', 'nudge-d14', 'plus-one'],
  },
  { id: 'R19', kind: 'refator', title: 'Refatoração v2 do M19 Jornada Pontos e Desafios', owner: 'time design', module: 'M19', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das telas de Jornada e Pontos. 4ª aba Como funcionam.',
    rule: 'Economia unificada (Pontos Tchin). 4 abas no /pontos: Resgatar, Ganhar, Extrato, Como funcionam. Tabela mestra de 24 linhas em 6 grupos (M19 § 19.0.4). Decisão de reativação do backend é da Sprint 15 R6 (Sprint 14 entrega só visual).',
    fix: 'Refatorar 5 telas com v2.',
    accept: [
      '5 telas com v2.',
      '4 abas em /pontos.',
      'Tabela mestra visível.',
    ],
    telas: ['jornada', 'pontos (4 abas)', 'jornada-celebrar (5 variações)', 'desafio-detalhe (8 templates x 3 estados)', 'badges'],
  },
  { id: 'R20', kind: 'refator', title: 'Refatoração v2 do M20 Config e Suporte', owner: 'time design', module: 'M20', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 8 telas de configuração e suporte.',
    rule: 'Sem 2FA. Sem telefone. Sem Tchin Tchin Plus. Telas de desativar e excluir conta.',
    fix: 'Refatorar 8 telas com v2. Plugar linha Vincular Google em config-conta (A4).',
    accept: [
      '8 telas com v2.',
      'Desativar e excluir funcionais.',
      'Vincular Google em config-conta.',
    ],
    telas: ['config-notif', 'config-privacidade', 'config-conta', 'conta-desativada', 'conta-excluida', 'config-bloqueados', 'suporte-faq', 'suporte-contato'],
  },
  { id: 'R21', kind: 'refator', title: 'Refatoração v2 do M21 Estados de sistema', owner: 'time design', module: 'M21', status: 'definido', urgent: false,
    summary: 'Refatoração v2 das 6 telas de erro e do componente Toast transversal.',
    rule: 'Linguagem de marca em vez de jargão técnico. Sempre oferecer saída. erro-sessao só em 3 cenários (F2). Status page interna (M21 § 21.0.1). Toasts empilham até 3 (M21 § 21.0.2).',
    fix: 'Refatorar 6 telas com v2 e componente Toast.',
    accept: [
      '6 telas com v2.',
      'Toast empilhamento funcional.',
      'erro-sessao com 3 reasons.',
    ],
    telas: ['erro-404 (Garrafa não encontrada)', 'erro-permissao (Conteúdo restrito)', 'erro-sessao (3 reasons: atualizacao, seguranca, inatividade)', 'vinho-indisponivel', 'erro-servidor', 'toast (overlay transversal)'],
  },
  { id: 'R22', kind: 'refator', title: 'Refatoração v2 de Onboarding e Tutoriais conversacionais', owner: 'time design + Bruno', module: 'transversal', status: 'definido', urgent: false,
    summary: 'Refatoração v2 de 40 telas e overlays do sistema de onboarding e tutoriais com mascote. Cobre as 4 famílias: pre auth, pos auth, tour bottom nav, e tutoriais conversacionais por feature (scanner, restaurante, confraria, treino paladar).',
    rule: 'Mascote no canto inferior direito com pulse 1.8s. Balão de fala fade in 200ms. Spotlight escurece tela fora da zona alvo. Coachmark com seta ou círculo pulsante. Pular sempre disponível canto superior direito. Persistência em localStorage tc.tutor.done JSON id timestamp. Cada tutorial dispara 1 vez automático.',
    fix: 'Unificar identidade do mascote, padronizar balão de fala, spotlight e coachmark. Migrar TourDiario SVG legado pro TchinTutor moderno. confraria-usar deixa de disparar automático e fica opcional via menu (Gabriel jun 2026, M11 § 11.A.1).',
    accept: [
      'Cada tutorial dispara 1 vez e não volta sozinho.',
      'Hub /tutoriais lista 7 famílias + tour de 4 passos com status Concluído ou Pendente.',
      'Pular fecha tutorial e marca como feito.',
      'Mascote, balão, spotlight e coachmark seguem padrão v2 nas 7 famílias.',
      'Reset pelos debug tools volta tutorial pra Pendente.',
    ],
    telas: [
      'Onboarding pre auth: onboarding slide 1, slide 2, slide 3.',
      'Onboarding pos auth: quiz-nivel, quiz-interesses (mínimo 3), tela-intencao.',
      'GPS primer com 7 variantes: discover, diario, aprender, treino, confraria, wizard, skip.',
      'gps-negado, welcome-final (3 highlights + pílula Pontos sutil).',
      'Tour 4 passos: tour-passo-1-comunidade, tour-passo-2-confrarias, tour-passo-3-descobrir, tour-passo-4-adega, tour-celebracao.',
      'Hub: tutoriais (rota /tutoriais, acessível por perfil-eu seção Suporte).',
      'Tutor scanner: tutor-scanner-intro, step-1, step-2, step-3.',
      'Tutor restaurante: tutor-restaurante-intro, step-1, step-2, step-3, step-4.',
      'Tutor confraria: tutor-confraria-intro, step-1, step-2, step-3.',
      'Tutor opcional: confraria-usar (deixa de disparar automático).',
      'Tutor treino paladar com mascote: treino-onb-intro, say1, objetivo, goal, say2, streakgoal, gems, final.',
      'Modal pós criação confraria (F7).',
      'Modal boas vindas novo membro confraria (F9, com 3 highlights).',
      'TourDiario legado (SVG mask, deprecar nesta Sprint).',
    ],
  },
];

const KIND_LABEL = {
  bug: 'Bug',
  alteracao: 'Alteração',
  feature: 'Feature',
  push: 'Push',
  refator: 'Refator v2',
};
const KIND_COLOR = {
  bug: { bg: T.c.e100, fg: T.c.e700 },
  alteracao: { bg: T.c.w100, fg: T.c.w700 },
  feature: { bg: T.c.i100, fg: T.c.i700 },
  push: { bg: T.c.a100, fg: T.c.a700 },
  refator: { bg: T.c.p50, fg: T.c.p700 },
};
const STATUS_LABEL = {
  iniciado: 'Iniciado',
  investigar: 'Investigar',
  pausado: 'Pausado',
  definir: 'Definir',
  definido: 'Definido',
  andamento: 'Em andamento',
  producao: 'Em produção',
};
const STATUS_COLOR = {
  iniciado: T.c.w700,
  investigar: T.c.e700,
  pausado: T.c.n600,
  definir: T.c.n800,
  definido: T.c.i700,
  andamento: T.c.p700,
  producao: T.c.s700,
};

function Sprint14HubScreen({ go }) {
  const [filter, setFilter] = React.useState('all'); // all | bug | alteracao | feature | push | urgent

  const filtered = SPRINT14_ITEMS.filter(it => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return it.urgent === true;
    return it.kind === filter;
  });

  const counts = {
    all: SPRINT14_ITEMS.length,
    bug: SPRINT14_ITEMS.filter(i => i.kind === 'bug').length,
    alteracao: SPRINT14_ITEMS.filter(i => i.kind === 'alteracao').length,
    feature: SPRINT14_ITEMS.filter(i => i.kind === 'feature').length,
    push: SPRINT14_ITEMS.filter(i => i.kind === 'push').length,
    refator: SPRINT14_ITEMS.filter(i => i.kind === 'refator').length,
    urgent: SPRINT14_ITEMS.filter(i => i.urgent).length,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 16px 14px',
        background: `linear-gradient(160deg, ${T.c.p900} 0%, ${T.c.p700} 60%, ${T.c.a700} 100%)`,
        color: T.c.n0,
      }}>
        <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.85, marginBottom: 6 }}>
          Sprint 14 · 01 a 12 de junho de 2026
        </div>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 26, fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>
          Plano de execução completo
        </div>
        <div style={{ fontFamily: T.font, fontSize: 13, lineHeight: 1.45, opacity: 0.92 }}>
          50 itens organizados em 7 blocos. Versão alvo 1.7.0.
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: T.r.full, fontSize: 11, fontWeight: 600 }}>
            {counts.bug} bugs
          </span>
          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: T.r.full, fontSize: 11, fontWeight: 600 }}>
            {counts.alteracao} alterações
          </span>
          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: T.r.full, fontSize: 11, fontWeight: 600 }}>
            {counts.feature} features
          </span>
          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: T.r.full, fontSize: 11, fontWeight: 600 }}>
            {counts.push} pushes
          </span>
          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: T.r.full, fontSize: 11, fontWeight: 600 }}>
            {counts.refator} refator v2
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 12px 8px', overflow: 'auto', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
        {[
          { id: 'all', label: `Todos (${counts.all})` },
          { id: 'urgent', label: `Urgentes (${counts.urgent})` },
          { id: 'bug', label: `Bugs (${counts.bug})` },
          { id: 'alteracao', label: `Alterações (${counts.alteracao})` },
          { id: 'feature', label: `Features (${counts.feature})` },
          { id: 'push', label: `Pushes (${counts.push})` },
          { id: 'refator', label: `Refator v2 (${counts.refator})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '6px 12px', borderRadius: T.r.full, whiteSpace: 'nowrap',
            background: filter === f.id ? T.c.p700 : T.c.n0,
            border: `1px solid ${filter === f.id ? T.c.p700 : T.c.n200}`,
            color: filter === f.id ? T.c.n0 : T.c.n800,
            fontFamily: T.font, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px 24px' }}>
        {filtered.map(item => {
          const kc = KIND_COLOR[item.kind];
          const statusColor = STATUS_COLOR[item.status] || T.c.n600;
          return (
            <button key={item.id} onClick={() => go('sprint14-item', { item })} style={{
              width: '100%', display: 'flex', flexDirection: 'column', gap: 8,
              padding: '12px 14px', marginBottom: 10,
              background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  padding: '3px 8px', borderRadius: T.r.full,
                  background: kc.bg, color: kc.fg,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 800,
                }}>{item.id} · {KIND_LABEL[item.kind]}</span>
                {item.urgent && (
                  <span style={{
                    padding: '3px 8px', borderRadius: T.r.full,
                    background: T.c.e700, color: T.c.n0,
                    fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                  }}>URGENTE</span>
                )}
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }}/>
                  <span style={{ fontFamily: T.font, fontSize: 10, color: statusColor, fontWeight: 700 }}>
                    {STATUS_LABEL[item.status]}
                  </span>
                </span>
              </div>
              <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.c.n950, lineHeight: 1.3 }}>
                {item.title}
              </div>
              <div style={{ fontFamily: T.font, fontSize: 12, color: T.c.n600, lineHeight: 1.45 }}>
                {item.summary}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontFamily: T.font, fontSize: 11, color: T.c.n800 }}>
                  {item.owner}
                </span>
                <span style={{ fontFamily: T.font, fontSize: 11, color: T.c.n400 }}>·</span>
                <span style={{ fontFamily: T.font, fontSize: 11, color: T.c.n600 }}>
                  {item.module}
                </span>
                <Icon name="chevron_right" size={16} color={T.c.n400} style={{ marginLeft: 'auto' }}/>
              </div>
            </button>
          );
        })}

        <div style={{
          marginTop: 16, padding: '14px 16px',
          background: T.c.p50, border: `1px solid ${T.c.p100}`, borderRadius: T.r.md,
        }}>
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.c.p700, marginBottom: 6 }}>
            Doc completo
          </div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.c.n800, lineHeight: 1.5 }}>
            Cada item tem critérios de aceite, edge cases e testes regressivos detalhados em
            docs/spec/sprint-14.md. Sprints 15 e 16 já têm encadeamento próprio em
            sprint-15.md e sprint-16.md.
          </div>
        </div>
      </div>
    </div>
  );
}

// Detalhe de um item da Sprint 14
function Sprint14ItemScreen({ go, params }) {
  const item = params?.item || SPRINT14_ITEMS[0];
  const kc = KIND_COLOR[item.kind];
  const statusColor = STATUS_COLOR[item.status] || T.c.n600;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px 8px 4px',
        background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0,
      }}>
        <button onClick={() => go('back')} aria-label="Voltar" style={{
          width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrow_back" size={24} color={T.c.n950}/></button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{item.id}</div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }}/>
          <span style={{ fontFamily: T.font, fontSize: 11, color: statusColor, fontWeight: 700 }}>
            {STATUS_LABEL[item.status]}
          </span>
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 32px' }}>
        {/* Tag de tipo */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <span style={{
            padding: '4px 10px', borderRadius: T.r.full,
            background: kc.bg, color: kc.fg,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 800,
          }}>{KIND_LABEL[item.kind]}</span>
          {item.urgent && (
            <span style={{
              padding: '4px 10px', borderRadius: T.r.full,
              background: T.c.e700, color: T.c.n0,
              fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
            }}>URGENTE</span>
          )}
        </div>

        {/* Título */}
        <h1 style={{
          margin: 0, marginBottom: 14,
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 22, fontWeight: 600, lineHeight: 1.2, color: T.c.n950,
        }}>{item.title}</h1>

        {/* Metadata */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 6,
          padding: '12px 14px', background: T.c.n50,
          border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
          marginBottom: 20,
        }}>
          <Row label="Responsável" value={item.owner}/>
          <Row label="Módulo" value={item.module}/>
          <Row label="Status" value={STATUS_LABEL[item.status]} valueColor={statusColor}/>
        </div>

        {/* Sumário */}
        <Section title="Comportamento atual ou contexto">
          <p style={{ ...textStyle }}>{item.summary}</p>
        </Section>

        {item.cause && (
          <Section title="Causa raiz identificada">
            <p style={{ ...textStyle }}>{item.cause}</p>
          </Section>
        )}

        {item.rule && (
          <Section title="Regra de negócio">
            <p style={{ ...textStyle }}>{item.rule}</p>
          </Section>
        )}

        {item.fix && (
          <Section title="UX correta">
            <p style={{ ...textStyle }}>{item.fix}</p>
          </Section>
        )}

        {item.accept && item.accept.length > 0 && (
          <Section title="Critérios de aceite">
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {item.accept.map((a, i) => (
                <li key={i} style={{ ...textStyle, marginBottom: 6 }}>{a}</li>
              ))}
            </ol>
          </Section>
        )}

        {item.telas && item.telas.length > 0 && (
          <Section title="Telas afetadas em ordem">
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {item.telas.map((t, i) => (
                <li key={i} style={{
                  ...textStyle, marginBottom: 4,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: T.c.n950,
                }}>{t}</li>
              ))}
            </ol>
          </Section>
        )}

        <div style={{ marginTop: 20 }}>
          <Button variant="ghost" size="md" fullWidth leading={<Icon name="arrow_back" size={16}/>} onClick={() => go('sprint14-hub')}>
            Voltar à lista
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontFamily: T.font, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
        color: T.c.n600, textTransform: 'uppercase', minWidth: 88,
      }}>{label}</span>
      <span style={{
        fontFamily: T.font, fontSize: 13, fontWeight: 600,
        color: valueColor || T.c.n950, flex: 1,
      }}>{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{
        margin: 0, marginBottom: 8,
        fontFamily: T.font, fontSize: 11, fontWeight: 700,
        color: T.c.p700, letterSpacing: 0.8, textTransform: 'uppercase',
      }}>{title}</h3>
      {children}
    </div>
  );
}

const textStyle = {
  margin: 0,
  fontFamily: T.font,
  fontSize: 13.5,
  lineHeight: 1.55,
  color: T.c.n800,
};

export { Sprint14HubScreen, Sprint14ItemScreen };
