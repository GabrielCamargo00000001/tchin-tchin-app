# Sprint 14: plano completo de execução

## 1. Contexto

A Sprint 14 começa em 01/06/2026 e termina em 12/06/2026 (entrega prevista 15/06).
Versão de produção atual: 1.6.6 (encerrada na Sprint 13).
Versão alvo desta Sprint: 1.7.0.

A Sprint 14 herda oito bugs urgentes que vazaram da release 1.6.1 e da Sprint 13,
mais a fila de itens do backlog que estavam "Falta definir figma" ou "Falta passar
definição". Este documento fecha cada uma dessas definições, descreve o
comportamento atual no app de produção, define a UX correta e dá critérios de aceite
suficientes pra QA validar item por item.

Conteúdo de origem: relatório war room (Página 1), planilha de validação por épico
e planilha cronograma sprint 01 a 15. As referências cruzam com os módulos da
super doc em `docs/spec/`.

## 2. Resumo do que entra

Bugs urgentes herdados: 8 itens (B1 a B8).
Alterações de UX e label herdadas: 5 itens (A1 a A5).
Features novas e itens do backlog que ganham definição nesta Sprint: 12 itens (F1 a F12).
Pushes em produção desde Sprint 13 que precisam de revisão de copy: 3 itens (P1 a P3).
Refatoração visual v2 de todas as telas existentes: 22 blocos (R1 a R22). R1 a R21
cobrem um módulo da super doc cada. R22 cobre o sistema transversal de tutoriais
conversacionais com mascote e tours guiados (40 telas e overlays).

Integração Meta SDK pra puxar dados de Instagram e Facebook das contas dos usuários
e do app: 1 item (F13).

Total de 51 itens organizados em 7 blocos sequenciais.

Princípio da refatoração visual: as telas que já existem no app são repensadas com
o design system v2 e as decisões de produto fechadas em junho de 2026. Não é só
cosmético. Cada tela ganha as regras de negócio canônicas dos módulos, as
mudanças de fluxo decididas pelo Gabriel e a consistência visual da identidade
nova.

## 3. Atribuição por desenvolvedor

Otavio: B1, B5, F11, F12.
Guilherme: B2, B6, A1.
Mauricio: B3, B7, A2.
Mateus: B4, B8, A3.
João: A4, A5.
Bruno: F2, F4.
Gustavo: F3.
LAPM (infra): F1.
Indefinido pra alocar nesta sprint: F5, F6, F7, F8, F9, F10.

Bloco urgência 1 (B1 a B8): fechar até 06/06.
Bloco alterações (A1 a A5): fechar até 09/06.
Bloco features e backlog priorizado (F1 a F12): fechar até 12/06.

## 4. Bloco de bugs urgentes herdados da 1.6.1

### B1. Teclado iOS permanece aberto após primeiro acesso

Responsável: Otavio.
Versão de origem: 1.6.1.
Status: iniciado.

Sintoma reproduzido: em iOS, no primeiro fluxo de cadastro ou login, ao terminar a
digitação e tocar fora do campo, o teclado nativo permanece aberto sobre a tela.
Ao tocar no botão Entrar ou Avançar, o teclado sobrepõe parte do CTA e a ação
muitas vezes não dispara na primeira tentativa.

Causa raiz: os campos de input estão com handler de onFocus que reabre o teclado
no ciclo de render seguinte ao toque no botão. O blur do input ocorre tarde demais
e disputa frame com o click do botão.

Correção: remover handlers de onFocus dos campos. Aplicar blur explícito no
componente de form ao detectar toque fora da área de input. No iOS, dispatcher
de keyboard dismiss via UIResponder ao tocar fora.

Aceite:
1. iOS, primeiro cadastro: digitar email, tocar fora do campo, teclado fecha.
2. iOS, login: digitar senha, tocar em Entrar, o clique dispara a ação na primeira
   tentativa e o teclado fecha junto.
3. iOS, retomar app via swipe: nenhum teclado abre sozinho.
4. Android: comportamento atual permanece sem regressão.
5. Tela de comentário no feed: toque fora fecha o teclado.

Edge cases: ao trocar de campo via Next do teclado nativo, o teclado permanece
aberto até o último campo. Submit fecha o teclado.

Testes regressivos: cadastro (M01), login (M01), recuperar senha (M01), criar post
(M13), comentar (M13), enviar mensagem no chat (M17), criar evento wizard (M12).

Telas afetadas em ordem:
1. welcome
2. login
3. cadastro
4. login-social
5. recuperar
6. recuperar-email
7. recuperar-otp
8. recuperar-redefinir
9. criar-post (textarea + busca de menção)
10. comentarios (input no rodapé)
11. chat-conversa (composer)
12. register-consumo (passo 1, busca de vinho)
13. registro-rapido (todos os campos)
14. registro-completo (todos os campos)
15. wizard-confraria-1 a wizard-confraria-6 (inputs)
16. event-wizard-1 a event-wizard-5 (inputs)
17. editar-perfil-foto (campos de nome, bio, handle)
18. config-conta (campos de email e senha)
19. suporte-contato (textarea)
20. expert-aplicar (textarea de bio)
21. perguntar-expert (textarea da pergunta)
22. criar-momento (textarea)

### B2. Botão Comprar na tela de detalhe do vinho

Responsável: Guilherme.
Versão de origem: 1.6.1.
Status: iniciado.
Categoria: alteração (não é bug funcional, é definição de produto).

Comportamento atual em produção: o card do vinho exibe botão Comprar que tenta
direcionar pra um fluxo de checkout incompleto, sem banco de produtos parceiros
ligado e sem comissão configurada.

Definição de produto (Gabriel, junho 2026): o marketplace de vinhos vende vinhos
de parceiros externos. Não é a Tchin que estoca. A integração com base de produtos
ainda está em normalização. Até a base estar pronta e a regra de comissão definida,
remover o botão Comprar da tela de detalhe do vinho.

Correção:
1. Remover o botão Comprar do componente WineDetailScreen (M04).
2. Manter o botão Salvar na Wishlist (US-060 ja entregue), o botão Adicionar à
   Estante (M07 § 7.0.2) e o botão Ver onde encontrar (que abre lista de
   parceiros sem checkout).
3. Adicionar uma faixa informativa no rodapé do card. Copy aprovada por Gabriel
   (jun 2026, D13): "Em breve: compra direta pelo app."

Dependência: o desbloqueio do botão Comprar volta quando a importação do banco de
produtos do marketplace (Sprint 13, LAPM) estiver completa e quando a regra de
taxa Tchin Tchin do marketplace de vinho estiver definida (separada da taxa de
evento documentada em M12 § 12.A.1).

Aceite:
1. Detalhe de vinho não exibe botão Comprar.
2. Faixa "Em breve" visível abaixo dos botões.
3. Botão Salvar na Wishlist continua funcional.
4. Botão Adicionar à Estante continua funcional.
5. Nenhuma rota de checkout dispara a partir do detalhe do vinho.

Telas afetadas em ordem:
1. wine (remover botão Comprar e adicionar faixa Em breve).
2. marketplace (revisar cards: nenhum CTA Comprar inline, manter Match score, Salvar).
3. carta-matches (idem).
4. comparar-vinhos (idem).
5. lista-desejos (idem).
6. wishlist do perfil (perfil-eu seção Atividade).

### B3. Valor obrigatório para criação de evento gratuito

Responsável: Mauricio.
Versão de origem: 1.6.1.
Status: iniciado.

Sintoma reproduzido: no wizard de criação de evento (M12 § event-wizard-1 a 5),
ao selecionar tipo Gratuito, o campo Valor por pessoa continua marcando como
obrigatório e bloqueia o avanço pra próxima etapa.

Causa raiz: o validador do form aplica regra required em Valor independentemente
do tipo do evento. Falta condicional pelo flag paid.

Correção: tornar o campo Valor obrigatório apenas se o tipo do evento for Pago.
Em Gratuito, o campo precisa ficar oculto ou desabilitado e o valor enviado pro
backend é zero ou null.

UX correta:
1. No passo "Tipo do evento" do wizard, escolher Gratuito.
2. O passo "Valor e pagamento" pula automaticamente, ou exibe apenas a confirmação
   "Evento gratuito sem cobrança".
3. Pagar fora do app: opção também não aparece pra evento gratuito.

Aceite:
1. Criar evento Gratuito: avançar pra Resumo sem preencher Valor.
2. Criar evento Pago: Valor obrigatório, mensagem de erro clara em vermelho.
3. Editar evento existente: trocar de Pago pra Gratuito limpa o Valor e remove o
   obrigatório.
4. Validação client e server consistentes.

Regra de negócio amarrada: a taxa Tchin Tchin (M12 § 12.A.1) só se aplica a evento
Pago. Em Gratuito, taxa não aparece em lugar nenhum.

Telas afetadas em ordem:
1. event-wizard-1 (passo Tipo do evento, pode marcar Gratuito).
2. event-wizard-2 (passo Tema, sem mudança direta).
3. event-wizard-3 (passo Valor e pagamento, esconder se Gratuito).
4. event-wizard-4 (passo Capacidade, sem mudança direta).
5. event-wizard-5 (passo Revisão, mostrar "Sem cobrança" se Gratuito).
6. evento-editar (replicar mesma regra ao trocar de Pago pra Gratuito).
7. event-detalhe (esconder row Valor e qualquer menção à taxa quando Gratuito).
8. ParticiparSheet (M12 event-pagamento) (não exibir bloco de pagamento quando
   Gratuito).

### B4. Contador de comentários não atualiza ao excluir

Responsável: Mateus.
Versão de origem: 1.6.1.
Status: iniciado.

Sintoma reproduzido: no post detail (M13), excluir um comentário próprio deixa o
contador "N comentários" inalterado até o usuário sair da tela e voltar.

Causa raiz provável: o handler de delete remove o item da lista local mas não
decrementa o contador exibido no cabeçalho do post. O contador lê de um state
separado que só atualiza no reload da rota.

Correção: ao deletar comentário, decrementar o contador na mesma ação. Garantir
que a fonte do contador é única (derivado do array de comentários, não state
duplicado). Aplicar a mesma correção quando o dono do post deleta comentário de
terceiro (US-013 pede esse comportamento).

Aceite:
1. Deletar comentário próprio: contador cai em 1 imediatamente, sem reload.
2. Dono do post deletar comentário de terceiro: contador cai em 1 imediatamente.
3. Adicionar comentário: contador sobe em 1 imediatamente (sem regressão).
4. Recarregar a tela: contador permanece consistente com a quantidade real.

Testes regressivos: like e dislike de post (US-012 parcial, tratar junto se der
tempo), contador de curtidas, contador de comentários em comentários aninhados (se
aplicável).

Telas afetadas em ordem:
1. post-detail (contador no header do post).
2. comentarios (rota dedicada, contador no topo da lista).
3. home/comunidade (contador no card do post na timeline do feed).
4. perfil-atividade-publica (cards de post mostrando contagem).

### B5. Deixar de seguir um usuário sem ação visível

Responsável: Otavio.
Versão de origem: 1.6.1.
Status: bug não reproduzido nos testes internos, mas reportado por usuário em
produção.

Sintoma reportado: tocar em "Deixando de seguir" no perfil de outro usuário não
muda o estado do botão e o usuário continua aparecendo como seguido.

Hipóteses a investigar:
1. Race condition no toggle de follow quando o usuário toca duas vezes rápido.
2. Cache da lista de seguidos com TTL longo não invalidando.
3. Mismatch entre estado local do botão e estado retornado pelo backend.

Procedimento de investigação:
1. Reproduzir em emulador iOS e Android com conta de teste.
2. Adicionar log no PerfilOutroScreen (M14) com timestamp do toggle.
3. Comparar estado retornado pelo endpoint de follow com state local após o toggle.

Correção esperada: garantir que o botão Seguir/Deixar de seguir sempre reflete a
resposta do backend. Se o toggle der erro, mostrar toast de falha. Se der sucesso,
atualizar o state e invalidar o cache de seguidos.

Aceite:
1. Seguir usuário: botão muda pra "Seguindo" imediatamente.
2. Deixar de seguir: botão muda pra "Seguir" imediatamente.
3. Sair do perfil e voltar: estado permanece consistente com o backend.
4. Lista de Seguindo (M14 § perfil-seguindo) reflete a mudança ao reabrir.

Regra de negócio cross M14 § 14.1: em perfil privado, o botão Seguir abre o estado
pending até aprovação do dono. Tocar em "Cancelar solicitação" desfaz o pending.

Telas afetadas em ordem:
1. perfil-outro (botão Seguir/Deixar de seguir no header).
2. perfil-seguidores (cada linha tem botão Seguir/Deixar de seguir).
3. perfil-seguindo (cada linha tem botão Deixar de seguir).
4. perfil-sugestoes (cada linha tem botão Seguir).
5. confraria-detalhe aba Membros (cada membro tem botão Seguir se não-membro).
6. comentarios (avatar + nome do autor abre perfil-outro).
7. post-detail (autor do post abre perfil-outro).
8. home/comunidade (autores dos posts no feed).

### B6. Modal de cancelamento de evento gratuito não fecha

Responsável: Guilherme.
Versão de origem: 1.6.1.
Status: iniciado.

Sintoma reproduzido: no detalhe de um evento Gratuito, tocar em "Cancelar
participação" abre a modal de confirmação. Após confirmar o cancelamento, a ação
é executada (RSVP volta a estado Não vou), mas a modal permanece visível e o
usuário fica preso até forçar o back.

Causa raiz: o callback de confirmação não chama o setOpen(false) da modal antes
de redirecionar.

Correção: no handler de confirmação, fechar a modal antes de disparar a navegação
ou a animação. Garantir que a modal não pode mais ficar aberta após qualquer ação
do CTA.

UX correta de cancelamento (M12):
1. Tocar em Cancelar participação abre uma modal pequena.
2. Modal tem texto "Tem certeza? Sua vaga vai pra lista de espera (se houver)".
3. Dois botões: Sim, cancelar (destructive) e Continuar com a vaga (ghost).
4. Confirmar: modal fecha, RSVP atualiza, toast de sucesso, lista de espera é
   notificada se houver gente esperando.
5. Continuar: modal fecha, nada muda.

Importante: o fluxo de cancelamento pago tem 3 janelas distintas (M12 § 12.0.x).
Esta correção é só pra evento Gratuito. Se o evento for Pago, o fluxo abre o
CancelarSheet (M12 event-pagamento) com a janela apropriada.

Aceite:
1. Evento Gratuito: cancelar fecha a modal e atualiza o RSVP.
2. Evento Pago janela maior que 24h: cancelar abre fluxo de reembolso (M12).
3. Evento Pago janela entre 24h e 2h: cancelar abre fluxo de crédito em Pontos.
4. Evento Pago janela menor que 2h: opção desabilitada com explicação.

Telas afetadas em ordem:
1. event-detalhe (modal de cancelamento gratuito).
2. CancelarSheet de M12 event-pagamento (3 variações pra evento pago).
3. evento-presenca (atualizar contadores de RSVP após cancelamento).
4. notificacoes (notificar lista de espera se houver, cross M18).

### B7. Botão Compartilhar aparece para não-membros da confraria

Responsável: Mauricio.
Versão de origem: 1.6.1.
Status: iniciado.

Sintoma reproduzido: no detalhe de confraria (M11), um usuário que não é membro
vê o botão Compartilhar no menu de ações. Compartilhar uma confraria sem ser
membro permite vazamento do link de convite com tracking do não-membro como
emissor.

Definição de regra: o botão Compartilhar e os botões de Convidar amigos só
aparecem se o usuário for membro da confraria (ou admin, que é caso particular de
membro).

Correção: condicionar a exibição do botão Compartilhar e do CTA de Convidar à
flag isMember. Pra não-membros, o menu de ações exibe apenas Reportar e voltar.

Aceite:
1. Não-membro entra no detalhe da confraria: menu não tem Compartilhar.
2. Membro: menu tem Compartilhar.
3. Admin: menu tem Compartilhar e Convidar amigos.
4. Convite gerado mantém autoria do membro emissor (Sprint 11 já entregue).

Cross M11 § 11.0: confraria Pública sem ser membro permite ver detalhes e
publicações públicas, mas sem ações sociais sobre a confraria. Confraria Privada
sem ser membro só vê descrição, capa e botão "Pedir entrada".

Telas afetadas em ordem:
1. confraria-detalhe (header, ações do top right, menu de 3 pontos).
2. confraria-convidar (esconder rota completa pra não-membros).
3. home/confrarias (cards de confraria não-membro com share oculto se aplicável).
4. confraria-regras (menu, esconder Compartilhar se não-membro).

### B8. Botão flutuante aparece em telas de detalhamento

Responsável: Mateus.
Versão de origem: 1.6.1.
Status: iniciado.
Categoria: alteração de comportamento.

Comportamento atual: o botão flutuante de ação rápida (FAB) está visível em quase
todas as telas, inclusive em detalhamentos onde polui a leitura ou sobrepõe CTAs
principais.

Definição fechada nesta Sprint:

Mostrar o botão flutuante apenas nas seguintes telas (lista exaustiva):

1. home/descobrir.
2. home/comunidade.
3. home/confrarias.
4. home/adega.
5. busca (M04).
6. marketplace (listagem M04).
7. favoritos (M07).
8. lista-desejos (M04).
9. chat-lista (M17, com ação Nova conversa).

Ocultar o botão flutuante nas seguintes telas (lista exaustiva):

1. Todas as telas de detalhamento: wine, event-detalhe, confraria-detalhe,
   post-detail, perfil-outro, perfil-eu.
2. Todos os wizards: event-wizard 1 a 5, wizard-confraria 1 a 6, register-consumo.
3. Todos os onboardings: welcome, login, cadastro, quiz, gps-primer,
   welcome-final, confraria-welcome, confraria-apresentar.
4. Todos os edge cases: erro-404, erro-permissao, erro-sessao, erro-servidor,
   vinho-indisponivel.
5. Configurações: config-notif, config-privacidade, config-conta,
   config-bloqueados, suporte-faq, suporte-contato.
6. Pagamento: carrinho, endereco, pagamento, pedido-confirmado e todos os sheets
   de pagamento de evento.
7. Telas modais e sheets em geral.

Ação do botão flutuante por contexto:
1. home/descobrir, busca, marketplace: ação primária Scanner.
2. home/comunidade: ação primária Criar post.
3. home/confrarias: ação primária Criar confraria.
4. home/adega: ação primária Registrar consumo.
5. favoritos, lista-desejos: ação primária Adicionar vinho.
6. chat-lista: ação primária Nova conversa.

Correção: implementar a whitelist de rotas em que o FAB aparece. Em qualquer rota
fora da whitelist, FAB não renderiza. A ação do FAB é parametrizada pela rota.

Aceite:
1. Abrir wine: nenhum FAB visível.
2. Abrir home/descobrir: FAB de Scanner visível, ação dispara o scanner.
3. Abrir event-detalhe: nenhum FAB visível.
4. Abrir chat-lista: FAB de Nova conversa visível.
5. Voltar de uma tela detalhada pra home: FAB volta a aparecer.

Telas afetadas em ordem (mostrar FAB):
1. home/descobrir (FAB Scanner).
2. home/comunidade (FAB Criar post).
3. home/confrarias (FAB Criar confraria).
4. home/adega (FAB Registrar consumo).
5. busca (FAB Scanner).
6. marketplace (FAB Scanner).
7. favoritos (FAB Adicionar vinho).
8. lista-desejos (FAB Adicionar vinho).
9. chat-lista (FAB Nova conversa).

Telas afetadas em ordem (ocultar FAB):
1. wine.
2. event-detalhe.
3. confraria-detalhe.
4. post-detail.
5. perfil-outro.
6. perfil-eu.
7. comentarios.
8. perfil-seguidores, perfil-seguindo, perfil-atividade-publica,
   perfil-vinhos-provados, perfil-sugestoes, perfil-comparar-paladar.
9. badges-galeria.
10. relatorio-mensal.
11. event-wizard-1 a event-wizard-5.
12. wizard-confraria-1 a wizard-confraria-6.
13. register-consumo (passo 1 e 2), registro-rapido, registro-completo,
    registro-confirmacao.
14. welcome, onboarding, login, cadastro, login-social, recuperar (todas as
    sub-telas de recuperar), termos, politica-privacidade.
15. quiz-nivel, quiz-interesses, tela-intencao, gps-primer, gps-negado,
    welcome-final, tutoriais.
16. quiz, quiz-result.
17. erro-404, erro-permissao, erro-sessao, erro-servidor, vinho-indisponivel.
18. config-notif, config-privacidade, config-conta, conta-desativada,
    conta-excluida, config-bloqueados, suporte-faq, suporte-contato.
19. carrinho, endereco, pagamento, pedido-confirmado.
20. ParticiparSheet, EscolherMetodoSheet, PixLaciSheet, PagarForaSheet,
    CancelarSheet (sheets de pagamento de evento).
21. scanner, scanner-result, scanner-v2, scanner-result-v2, scanner-fallback,
    modo-restaurante, carta-matches, porque-combina.
22. harmoniza, harmoniza-resultados.
23. treino-paladar, treino-licao, treino-liga, treino-aprender.
24. aprender, aprenda, aprenda-detalhe.
25. indicacao-landing, indicacao-compartilhar, indicacao-meus-convites,
    indicacao-recompensas, convite-recebido.
26. expert-virar, expert-aplicar, expert-pendente, expert-q-a, expert-responder,
    perguntar-expert.
27. confraria-config, confraria-convidar, confraria-sair, confraria-transferir,
    confraria-regras, confraria-welcome, confraria-apresentar,
    confraria-tour-rapido.
28. evento-editar, evento-presenca, evento-pos-avaliar, evento-pos-ata.
29. editar-perfil, editar-perfil-foto, editar-perfil-paladar,
    editar-perfil-privacidade.
30. push-primer, push-negado, push-canais, push-preview, plus-one, nudge-d1,
    nudge-d3, nudge-d7, nudge-d14.
31. jornada, pontos, jornada-celebrar, desafio-detalhe.
32. chat-conversa.
33. criar-post, criar-momento.
34. lista-desejos quando vinda de Pedir presente (não conta, exibir FAB normal).
35. filtros-avancados, comparar-vinhos.
36. Qualquer sheet, modal ou overlay em geral.

## 5. Bloco de alterações de UX e label

### A1. Tela Descobri (nova feature)

Responsável: Guilherme.
Origem: backlog Sprint 13, marcado "Falta definir funcionalidade das telas e figma".
Status: indefinido nesta Sprint, vira definição agora.

Definicao: a tela Descobri e o hub principal que CONTEM o Marketplace como bloco
interno. Decisao Gabriel jun 2026 (D3): o Marketplace fica DENTRO do Descobri,
mantendo o nome Marketplace. A rota tecnica do bloco interno continua se chamando
marketplace (compat de deep links e tracking). A tela Descobri agrega esse
bloco mais 5 outros blocos editoriais e algoritmicos. A home/descobrir continua
sendo a tab esquerda do bottom nav e ganha CTA destacado Abrir Descobri.
A arquitetura completa esta documentada em M04 § 4.0.

Estrutura completa da tela Descobri:

Bloco 1, Hero do dia:
1. Card grande no topo com headline editorial.
2. Item destacado pode ser: vinho do dia, confraria em alta, evento próximo da
   região, post mais curtido da semana.
3. Curadoria editorial é manual pela Tchin (rotação semanal).

Bloco 2, Pra você (algorítmico):
1. Lista horizontal de 5 a 10 vinhos com match score por paladar.
2. Algoritmo de ordenação: 50 por cento paladar do usuário, 30 por cento
   popularidade na base, 20 por cento curadoria editorial (Gabriel jun 2026, M04 §
   4.0.1).
3. Cada card mostra vinho, score numérico (87 por cento) e uva principal.
4. Tap abre wine detail.

Bloco 3, Confrarias da sua região:
1. Lista horizontal de até 6 confrarias próximas que aceitam novos membros.
2. Ordenação por proximidade (se GPS autorizado) ou por crescimento (se não).
3. Cada card mostra nome, foto, número de membros, estilo.
4. Tap abre confraria-detalhe.

Bloco 4, Eventos próximos:
1. Lista horizontal de até 6 eventos públicos abertos pra inscrição.
2. Ordenação cronológica (mais próximos primeiro).
3. Cada card mostra capa, título, data, local.
4. Tap abre event-detalhe.

Bloco 5, Marketplace de Experiência (M04 § 4.0.3):
1. Card destacado com badge Novo apontando pro hub de experiências.
2. Tap abre confraria-detalhe na aba Experiência (M11 § 11.5).

Bloco 6, Curiosidades editoriais:
1. Card mensal "Uva da semana" (US-017 já entregue).
2. Card "Dica do dia" (US-018 já entregue).
3. Rotação automática.

Sticky bottom: FAB de Scanner (B8).

Regras de comportamento:
1. Sem login: Pra você vira Editorial top picks (sem paladar). Confrarias e eventos
   filtram por região se GPS autorizado.
2. Com paladar mas sem registros: Pra você usa só o paladar (sem boost de
   histórico).
3. Com paladar e registros: full algoritmo 50/30/20.

Aceite:
1. Abrir Descobri: hero visível em 700 ms.
2. Bloco Pra você carrega progressivamente (skeleton primeiro).
3. Sem GPS: confrarias e eventos mostram conteúdo da capital do estado do usuário.
4. Tap em qualquer item navega pra detail correto.
5. Pull to refresh atualiza editorial + algorítmico.

Dependência: importação do banco de vinhos (LAPM, F1) precisa estar concluída pra
Pra você ter dataset.

Telas afetadas em ordem:
1. marketplace (substituído pelo novo Descobri com os 6 blocos descritos
   acima). A rota interna continua se chamando marketplace ou passa a se
   chamar descobri, decisão técnica do dev.
2. home/descobrir (mantém papel de hub editorial, ganha CTA destacado "Abrir
   Descobri" que leva pro novo hub).
3. wine (cards do bloco Pra você abrem detalhe normal).
4. confraria-detalhe (entrada via bloco Confrarias da região).
5. event-detalhe (entrada via bloco Eventos próximos).
6. confraria-detalhe aba Experiência (entrada via bloco Marketplace de
   Experiência).
7. scanner (entry via FAB do hub Descobri).
8. quiz (rota de calibração de paladar se vier do estado "Sem paladar").

### A2. Sub aba Estoque da confraria fica como Estoque (decisao revista)

Origem: backlog Sprint 13, Gustavo trocou a quarta aba do confraria-detalhe
(que mostra os vinhos catalogados pela confraria como coletivo) de Adega pra
Estoque.

Decisao Gabriel revisao jun 2026 (atualizada apos resposta D4): MANTER
Estoque. O label da Sprint 13 fica como ficou. Nao reverter pra Adega.

Justificativa: Adega como conceito da marca segue valido pra Adega individual
do usuario (M07). Dentro do contexto da confraria, o acervo coletivo se chama
Estoque, que descreve melhor o que e (vinhos da confraria, coletivo) e nao
conflita com a Adega pessoal.

Acao na Sprint 14: NENHUMA. Item retirado da Sprint.

Telas afetadas em ordem:
1. Nenhuma. A2 sai da Sprint 14.

### A3. Match do paladar com vinhos (PAUSADO)

Responsável: Mateus.
Status na war room: PAUSADO.
Dependências: banco de dados de vinhos marketing place + fórmula de cálculo do
percentual.

Definição fechada nesta Sprint:

Formula do match score por vinho:

score = w1 * cosineSim(paladarUsuario, perfilVinho) + w2 * popularityBoost + w3 * editorialBoost

Onde:
1. cosineSim é a similaridade de cosseno entre o vetor de 5 dimensões do paladar do
   usuário (Acidez, Tanino, Corpo, Doçura, Aromas) e o perfil pré calculado do
   vinho na mesma escala.
2. popularityBoost é log(1 + registros30d) normalizado em escala 0 a 1.
3. editorialBoost é flag binária 0 ou 1 multiplicada por um peso menor.

Pesos default (M04 § 4.0.1):
1. w1 = 0.50 (paladar pessoal).
2. w2 = 0.30 (popularidade).
3. w3 = 0.20 (editorial).

Calibração: os pesos vão em config server side, ajustáveis sem deploy. Backoffice
controla.

Estados do match na UI:
1. Sem paladar: não exibe percentual. Card mostra apenas tag genérica
   "Recomendado pela Tchin" (vem do editorial).
2. Paladar definido mas sem registros: exibe percentual baseado só em w1.
3. Paladar e registros: full fórmula.

Limites:
1. Score abaixo de 50 por cento: não exibe o percentual, exibe "Combina pouco".
2. Score entre 50 e 70: exibe percentual em cinza.
3. Score entre 70 e 85: exibe percentual em burgundy.
4. Score acima de 85: exibe percentual em burgundy negrito + chip "Alto match".

Onde o match aparece:
1. Cards de vinho no Descobrir bloco Pra você.
2. Cards de vinho no Marketplace.
3. Detalhe do vinho (top da tela, abaixo do nome).
4. Lista de Carta de restaurante (M06 carta-matches).

Aceite:
1. Usuario novo sem paladar: nenhum percentual exibido.
2. Usuario com paladar: percentual aparece em todos os cards de vinho.
3. Mudança de paladar (refazer quiz M03): scores recalculados na próxima abertura
   do Descobrir.

Desbloqueio do PAUSADO: depende de F1 (importação do banco de produtos) entregar.

Telas afetadas em ordem:
1. wine (chip do match score abaixo do nome).
2. marketplace (cards de vinho com chip de match).
3. home/descobrir (bloco Pra você, cards com match).
4. carta-matches (lista ordenada por match score, ja existia parcialmente).
5. comparar-vinhos (match comparativo entre 2 ou 3 vinhos).
6. scanner-result-v2 (match score destacado no resultado do scan).
7. porque-combina (explicação do match aplicada).
8. harmoniza-resultados (vinhos sugeridos com match individual).

### A4. Permitir login social Google a quem se cadastrou com senha

Responsável: João.
Origem: Sprint 12 1.6.2.
Status: iniciado, entregue em produção 1.6.6.

Documentação do comportamento final pra fechar a US:

Regra fechada:
1. Usuário cadastrado com email e senha pode, depois, vincular login social
   Google ao mesmo email.
2. O vínculo é automático se o email do Google bater com o email da conta.
3. Se o usuário já tem conta com senha e tenta logar via Google com mesmo email,
   o login Google funciona e a senha continua válida em paralelo (duas formas de
   entrar na mesma conta).
4. Se o email do Google não bate com nenhuma conta, cria conta nova social.

UX nas telas:
1. Login: botão "Entrar com Google" funciona pra contas criadas com senha (regra
   nova) e pra contas criadas com Google (já funcionava).
2. Cadastro: botão "Cadastrar com Google" continua igual.
3. config-conta: nova linha "Vincular Google" mostra o status atual (Vinculado /
   Não vinculado). Toque permite desvincular se já vinculado.

Aceite:
1. Conta antiga com senha, primeiro login com Google: cai na conta correta.
2. Conta antiga com senha, tentar Google com email diferente: cria conta nova.
3. config-conta mostra vínculos ativos.

Telas afetadas em ordem:
1. welcome (botão Entrar com Google funciona pra contas com senha).
2. login (botão Entrar com Google).
3. login-social (passo intermediário do SSO).
4. cadastro (botão Cadastrar com Google).
5. config-conta (linha Vincular Google com status).

### A5. Migrar Apps de conta dentro da Apple Store e Google Play

Responsável: Mauricio.
Origem: Sprint 13.
Status: iniciado, em produção 1.6.6.

Documentação pra fechar a US:

Migração concluída na Sprint 13. O app passou da conta de desenvolvedor antiga
(LIVI) pra conta TchinTchin oficial nas duas lojas. Atenção pra:
1. O bundle id e package name foram preservados pra manter usuários atuais.
2. Push tokens (Firebase Cloud Messaging) continuam válidos sem re registro.
3. AppsFlyer SDK manteve o link.
4. In App Reviews resetam contador (regra das lojas).

Pendência menor: atualizar o screenshot da loja com os novos shots da Adega
(M07 home-adega-estante-limpa) e do hub Descobrir após A1 estar pronto.

Telas afetadas em ordem:
1. Nenhuma tela do app é tocada nesta entrega (impacto somente em store assets).
2. Pós entrega de A1 (Descobri) e v2 da Adega (R7): regerar 6 screenshots da loja
   com versão 1.7.0.

## 6. Bloco de features e backlog priorizados

### F1. Importação e normalização do banco de produtos do marketplace

Responsável: LAPM.
Origem: Sprint 12, iniciada e estendida pra Sprint 14.
Status: em andamento.

Escopo:
1. Importar dataset de 200 mil vinhos seed (cross com US-240 em desenvolvimento).
2. Normalizar campos: nome, produtor, país, região, uva principal, uvas
   secundárias, safra, tipo (tinto, branco, rosé, espumante, fortificado, sobremesa),
   teor alcoólico, preço sugerido, foto.
3. Gerar perfil sensorial estimado por uva + região + estilo (alimenta o match
   score de A3).
4. Disponibilizar endpoint de busca, listagem e detalhe (já existia, ajustar pra
   novo modelo se necessário).
5. Thumbnails randômicas pra vinhos sem foto (Sprint 13 já entregue por Guilherme,
   reusar lógica).

Aceite:
1. Marketplace lista vinhos sem erro de campos null.
2. Detalhe do vinho mostra todas as informações do dataset.
3. Match score (A3) consegue calcular pra qualquer vinho do dataset.
4. Busca por nome retorna em menos de 1 segundo pra 95 por cento das queries.

Bloqueia: A3 (match), A1 (bloco Pra você no Descobrir).

Telas afetadas em ordem:
1. marketplace (listagem completa com novo dataset).
2. wine (detalhe com campos enriquecidos).
3. busca (resultados com novo dataset).
4. filtros-avancados (filtros sobre o novo dataset).
5. comparar-vinhos (catálogo expandido).
6. lista-desejos (vinhos da wishlist com perfil sensorial).
7. carta-matches (sugestões a partir do dataset).
8. home/descobrir bloco Pra você (cards Pra você dependem do dataset).

### F2. Salvar token Keycloak permitindo logout esperado

Responsável: Bruno.
Origem: Sprint 13, em produção 1.6.6.
Status: entregue, documentação aqui pra fechar US e descrever a regra final.

Regra final fechada (M21 § 21.3 e M01):

Em condições normais, o usuário permanece logado indefinidamente. Refresh token
do Keycloak é renovado em background quando o access token expira.

Cenários de logout válidos (a tela erro-sessao só dispara nesses 3 casos):
1. atualizacao: versão de app fez breaking change na autenticação. Acontece 1 vez
   por atualização grande. Copy: "Atualizamos o app".
2. seguranca: backend detectou atividade suspeita ou usuário trocou senha em
   outro aparelho. Copy: "Confirme que é você".
3. inatividade: 6 meses ou mais sem abrir o app. Copy: "Bom te ver de novo".

Comportamento técnico:
1. Token de refresh tem expiração longa (default 30 dias) e renova a cada uso.
2. Se o app fica fechado por menos de 30 dias, refresh continua válido.
3. Se passa de 30 dias sem abrir, refresh expira e cai em erro-sessao com reason
   inatividade.

Aceite:
1. Usuario abre o app diariamente: nunca cai em erro-sessao.
2. Usuario fica 7 dias sem abrir: ao abrir, entra direto.
3. Usuario fica 60 dias sem abrir: erro-sessao com reason inatividade.

Telas afetadas em ordem:
1. welcome (entry point pós erro-sessao).
2. login (rota de re-autenticação).
3. erro-sessao com 3 reasons: atualizacao, seguranca, inatividade.
4. recuperar-email (rota disparada por erro-sessao reason seguranca).

### F3. Manter Estoque na sub aba da confraria (decisao revista)

Fechado em A2. Decisao Gabriel jun 2026: manter Estoque. Sem acao. Item
retirado da Sprint 14.

### F4. Onboarding inicial com imagens guias antes de logar

Responsável: Bruno.
Origem: Sprint 13, em produção 1.6.6.
Status: APROVADO POR GABRIEL (jun 2026, D5). Copy e visual finais abaixo.

Sequência atual (M01 e M02):
1. Splash com logo Tchin Tchin.
2. Onboarding pre auth com 3 slides editoriais (detalhamento abaixo).
3. Welcome com SSO Apple e Google (M01).
4. Pós login: quiz nivel, quiz interesses, tela intenção, gps primer,
   welcome final (M02).

Conteúdo final dos 3 slides (aprovado por Gabriel):

Slide 1, Identidade da marca:
1. Imagem: hero burgundy com taças clinking.
2. Headline (Fraunces 32px peso 600): "O app de vinho que entende seu paladar."
3. Body (Inter 14px lineheight 1.5 cor n800): "Descubra, registre, compartilhe.
   Sua jornada com vinho começa aqui."
4. CTA primário no rodapé: "Avançar."
5. Skip no canto superior direito: "Pular."

Slide 2, Dor 1 Incerteza de compra:
1. Imagem: corredor de vinhos com pessoa indecisa, overlay burgundy.
2. Headline: "Saiba qual vinho combina com você antes de comprar."
3. Body: "Match score baseado no seu paladar, recomendações curadas,
   comparativos lado a lado."
4. CTA: "Avançar." Skip: "Pular."

Slide 3, Dor 3 Memória fragmentada:
1. Imagem: caderno aberto com taça e foto de rótulo.
2. Headline: "Lembre de cada vinho que provou."
3. Body: "Adega, diário e relatório mensal. Sua história com vinho em um só
   lugar."
4. CTA: "Começar." Skip: "Pular."

Visual em todos os 3 slides:
1. Background gradient burgundy/50 → burgundy/100.
2. Headline Fraunces 32px peso 600.
3. Body Inter 14px lineheight 1.5 cor n800.
4. 3 dots indicadores no rodapé acima do CTA, dot ativo burgundy/700, dots
   inativos n300.
5. Transição horizontal swipe sem fade. Swipe pra trás permitido.

Aceite:
1. Primeiro abrir: vê os 3 slides com layout novo.
2. Pular: vai direto pro welcome.
3. Completar: vai direto pro welcome.
4. Reinstall: vê os slides de novo.
5. Login subsequente do mesmo dispositivo: pula os slides.

Telas afetadas em ordem:
1. onboarding (3 slides pre auth).
2. welcome (destino pós onboarding pre auth).

### F5. Templates para criação de eventos (definição completa)

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta Gabriel disponibilizar o figma com os modelos".
Status: definição feita aqui.

Definição de 5 templates de evento, prontos pra entrar no wizard de criação:

Template T1, "Vinhos por país":
1. Tema sugerido: "Vinhos do {país sugerido}".
2. País default: Brasil (vinícolas nacionais).
3. Regra implícita: cada participante traz uma garrafa do país.
4. Quantidade sugerida de vinhos: 1 por pessoa.
5. Estilo da confraria correlato: Iniciantes, Brasil, Variedade.

Template T2, "Degustação às cegas":
1. Tema sugerido: "Degustação às cegas: {uva ou região}".
2. Regra implícita: garrafas embrulhadas em papel kraft. Voto secreto.
3. Quantidade sugerida: 4 a 6 garrafas, 1 por dupla.
4. Estilo da confraria correlato: Variedade, Velho Mundo, Avançado.

Template T3, "Comparativo de uvas":
1. Tema sugerido: "Comparativo de {uva}: {região A} vs {região B}".
2. Regra implícita: mesma uva, produtores ou regiões diferentes.
3. Quantidade sugerida: 4 garrafas (2 por região).
4. Estilo da confraria correlato: Velho Mundo, Estudo aprofundado.

Template T4, "Tema livre social":
1. Tema sugerido: "Encontro descontraído".
2. Regra implícita: sem tema, social, cada um traz o que quiser.
3. Quantidade sugerida: 1 por pessoa.
4. Estilo da confraria correlato: Social, Sem estilo definido.

Template T5, "Vinho e harmonização":
1. Tema sugerido: "Harmonização: vinho + prato".
2. Regra implícita: cada um traz vinho + prato que harmoniza.
3. Quantidade sugerida: 1 por pessoa de cada.
4. Estilo da confraria correlato: Gastronomia, Avançado, Variedade.

Implementação:
1. No wizard de evento, passo "Tema" ganha uma linha "Use um template" com 5
   cards horizontais (T1 a T5).
2. Tap em um card preenche tema, descrição, quantidade sugerida e checklist.
3. Usuário pode editar tudo depois.
4. Botão "Criar do zero" mantém o fluxo atual sem template.

Aceite:
1. Wizard mostra 5 templates no passo Tema.
2. Tap em T1 com país Brasil preenche os campos.
3. Tap em outro template substitui o preenchimento sem confirmação dupla.
4. Editar campo após selecionar template não remove o vínculo (template fica
   marcado como "Personalizado").

Telas afetadas em ordem:
1. event-wizard-1 (passo Tema com 5 cards de template).
2. event-wizard-2 (Descrição preenchida pelo template).
3. event-wizard-4 (Capacidade sugerida pelo template).
4. evento-editar (templates disponíveis se trocar de tema).

### F6. Correlação confraria template (sugestão automática)

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta Gabriel informar a correlação".
Status: definição feita aqui.

Regra de sugestão: ao abrir o wizard de criação de evento dentro de uma confraria,
o sistema sugere o template mais coerente com o estilo da confraria.

Mapa de correlação:
1. Estilo Brasil ou Iniciantes ou Mistas: sugere T1 (Vinhos por país, default
   Brasil).
2. Estilo Velho Mundo ou Estudo aprofundado: sugere T3 (Comparativo de uvas).
3. Estilo Variedade ou Eclético: sugere T2 (Degustação às cegas).
4. Estilo Social: sugere T4 (Tema livre social).
5. Estilo Gastronomia: sugere T5 (Vinho e harmonização).
6. Confraria sem estilo definido: nenhum template sugerido, mostra os 5.

UI da sugestão:
1. Card do template sugerido aparece primeiro na lista, com badge "Sugerido pra
   esta confraria".
2. Os outros 4 templates aparecem em ordem normal.
3. Tocar no sugerido preenche os campos. Tocar em outro mostra confirmação rápida
   "Trocar pelo template X?".

Aceite:
1. Confraria Velho Mundo: T3 aparece com badge.
2. Confraria Social: T4 aparece com badge.
3. Confraria sem estilo: nenhum badge, lista normal.

Telas afetadas em ordem:
1. confraria-detalhe (CTA Criar evento dispara wizard com sugestão).
2. event-wizard-1 (badge Sugerido pra esta confraria no template correlato).
3. wizard-confraria-6 (último passo do wizard de confraria, captura o estilo
   pra usar na correlação).

### F7. Modal tutorial pós criação de confraria

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta figma que o Gabriel está disponibilizando".
Status: definição feita aqui.

Disparo: ao concluir o wizard de criação de confraria (M11 § 11.3), antes de
ir pro detalhe, dispara uma modal tutorial.

Conteúdo da modal:
1. Header: "Sua confraria está pronta".
2. Subheader: "Próximo passo: marca o primeiro evento".
3. Bloco de 3 passos com ícones e texto curto:
   a. Passo 1: "Convide o pessoal" (CTA leva pra confraria-convidar).
   b. Passo 2: "Crie o primeiro evento" (CTA leva pro event-wizard com template
      sugerido por F6).
   c. Passo 3: "Compartilhe nas redes" (CTA abre share nativo com texto
      "Acabei de criar a confraria {nome}, vem participar.").
4. Footer: botão "Começar agora" abre passo 2 imediatamente. Link "Vou fazer
   depois" fecha a modal e leva pro detalhe.

Regras de comportamento:
1. A modal aparece apenas na primeira abertura do detalhe pós criação.
2. Se o usuário fecha sem agir, não dispara de novo.
3. Se o usuário fechar mas não criar evento em 3 dias, dispara o push F8 (lembrete).

Aceite:
1. Criar confraria + concluir wizard: modal aparece.
2. Fechar a modal: ir pro detalhe sem regressão.
3. Reabrir o detalhe: modal não aparece de novo.
4. CTA do passo 2 leva pro event-wizard com template sugerido.

Telas afetadas em ordem:
1. wizard-confraria-6 (último passo, conclui o wizard).
2. confraria-welcome (após o wizard, antes do detalhe).
3. confraria-detalhe (modal aparece sobre a primeira abertura).
4. confraria-convidar (CTA Convide o pessoal).
5. event-wizard-1 (CTA Crie o primeiro evento, sai com template sugerido por F6).
6. indicacao-compartilhar (CTA Compartilhe nas redes pode encaminhar pra cá ou
   pro share nativo, conforme decisão de UX final).

### F8. Push lembrete D+3 sem evento criado

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta figma e local para mostrar a mensagem".
Status: APROVADO POR GABRIEL (jun 2026, D7 e D8).

Gatilho: 3 dias após a criação da confraria, se nenhum evento foi criado.

Notificação push (copy aprovada):
1. Título: "Sua confraria está esperando."
2. Corpo: "Marca o primeiro encontro de {nome da confraria} pra começar bem."
3. Disparo: 10h da manhã do D+3.
4. Quiet hours: respeita 22h às 8h da timezone do usuário.
5. Cap: dispara 1 vez. Se o usuário ignorar, dispara outro em D+7 e D+14 (cross
   M18 nudges).

Local in app pra reforçar (banner sticky no detalhe da confraria, copy
aprovada):
1. Mensagem: "Sua confraria não tem evento ainda. Crie o primeiro evento."
2. CTA do banner: "Crie o primeiro evento" leva pro event-wizard-1 com
   template sugerido por F6.
3. Visível apenas pro admin.
4. Banner some quando o primeiro evento é criado.

Aceite:
1. Criar confraria, esperar 3 dias sem evento: push dispara às 10h.
2. Criar evento antes do D+3: push não dispara.
3. Admin vê banner sticky no detalhe da confraria.
4. Não admin não vê banner.

Telas afetadas em ordem:
1. notificacoes (registro do push enviado).
2. push-preview (preview do push pra QA).
3. confraria-detalhe (banner sticky pra admin no topo da aba Eventos).
4. event-wizard-1 (destino do CTA do banner sticky).

### F9. Onboarding novo membro em confraria

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta figma e definir o que conversa ativa".
Status: APROVADO POR GABRIEL (jun 2026, D11). Definição de Conversa ativa
fechada: publicação no feed da confraria com timestamp menor que 7 dias.
Empty state aprovado: "Seja o primeiro a publicar."

Disparo: ao entrar em uma confraria pela primeira vez (não vale pra fundador,
vale pra membro que aceita convite ou pede entrada e é aprovado).

Modal de boas vindas:
1. Header com avatar grande da confraria + nome.
2. Texto: "Bem vindo à {nome}".
3. Subtexto: "Aqui é onde {nome} se encontra pra falar de vinho".
4. Bloco de 3 highlights:
   a. Próximo evento: data do próximo evento confirmado (se houver). Se não:
      "Sem evento agendado ainda".
   b. Conversa ativa: última publicação na confraria há menos de 7 dias.
      Mostra o título da publicação ou o resumo do post. Se não houver: "Seja
      o primeiro a publicar".
   c. Adega coletiva: contagem de vinhos do banco de vinhos da confraria
      (US-179 já entregue). Mostra "X vinhos catalogados".
5. CTA principal: "Apresenta você" leva pro confraria-apresentar (M11 § 11.5).
6. CTA secundário: "Mais tarde" fecha e vai pro detalhe.

Definição de "conversa ativa": publicação no feed da confraria com timestamp
menos de 7 dias atrás. Se não houver, exibir CTA "Seja o primeiro a publicar".

Aceite:
1. Primeiro acesso pós entrada: modal aparece.
2. Acessos subsequentes: modal não aparece.
3. Highlights renderizam mesmo quando não há dados (mensagens vazias claras).

Telas afetadas em ordem:
1. confraria-welcome (entrada após aceitar convite ou ter solicitação aprovada).
2. confraria-detalhe (modal aparece sobre a primeira abertura).
3. confraria-apresentar (CTA Apresenta você leva pra cá).
4. confraria-tour-rapido (opção alternativa pós apresentar).

### F10. Feed da confraria com contadores

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta figma e definir quais eventos devem ser contabilizados".
Status: definição feita aqui.

Posição no detalhe da confraria: barra de status logo abaixo do header de
identidade, antes das abas (Eventos, Publicações, Membros, Adega, Experiência).

Conteúdo da barra (3 contadores):
1. Eventos próximos: contagem de eventos confirmados com data nos próximos 30
   dias.
2. Publicações da semana: contagem de publicações na confraria nos últimos 7
   dias.
3. Novos vinhos: contagem de vinhos adicionados à adega coletiva da confraria
   nos últimos 30 dias.

Layout: 3 chips iguais lado a lado, cada um com número grande no topo e label
abaixo em caps tracking.

Tap em cada chip:
1. Eventos próximos: muda pra aba Eventos com filtro Próximos.
2. Publicações: muda pra aba Publicações.
3. Novos vinhos: muda pra aba Adega.

Estado vazio:
1. Se zero em todos os 3: a barra some inteira (não polui se a confraria está
   apagada).

Aceite:
1. Confraria ativa: barra aparece com 3 contadores corretos.
2. Confraria apagada: barra não aparece.
3. Tap em chip muda de aba corretamente.

Telas afetadas em ordem:
1. confraria-detalhe (barra abaixo do header, antes das abas).
2. confraria-detalhe aba Eventos (destino do chip Eventos próximos).
3. confraria-detalhe aba Publicações (destino do chip Publicações).
4. confraria-detalhe aba Adega (destino do chip Novos vinhos).

### F11. Cutuca o organizador

Responsável: Otavio (mover lógica pra ele dado que cuida do bloco de pushes).
Origem: backlog "Falta figma e definir o período de inatividade".
Status: APROVADO POR GABRIEL (jun 2026, D9 copy e D23 thresholds).

Gatilho de inatividade da confraria:
1. 14 dias sem nenhuma publicação no feed da confraria.
2. 21 dias sem nenhum evento marcado.
3. Apenas uma das duas condições basta pra disparar.
4. Filtro extra (D23): confraria tem 5 membros ou mais. Evita cutucar
   confraria com 1 ou 2 pessoas.

Card no feed da confraria (copy aprovada):
1. Visível pra qualquer membro da confraria.
2. Headline: "Tá quieto por aqui."
3. Subheadline: "Que tal cutucar os admins pra marcar um evento?"
4. CTA: "Cutuca os admins."
5. Após tocar: card vira estado pós cutucada por 24h: "Cutucada enviada pros
   admins. Eles foram avisados." com botão desabilitado.

Cooldown de cutucada:
1. Mesmo usuário não pode cutucar a mesma confraria por 7 dias após cutucar.
2. Cada confraria só pode receber 1 cutucada total por janela de 7 dias
   (independente de quantos membros tentam).

Push pra admins (copy aprovada):
1. Título: "Cutucada da confraria."
2. Corpo: "{nome do usuário} sente falta de movimento em {nome da confraria}.
   Que tal um evento?"
3. Quiet hours: 22h às 8h. Posterga se cair em quiet.
4. Cap: 1 push por cutucada. Cooldown global de 7 dias por confraria.
5. Tap no push: leva pro confraria-detalhe aba Eventos com banner sticky
   indicando "Membro cutucou pra marcar evento" e CTA Criar evento.

Aceite:
1. Confraria sem publicação há 15 dias: card aparece pra qualquer membro.
2. Membro cutuca: push chega pros admins.
3. Após cutucada, 7 dias sem nova cutucada possível.
4. Após nova publicação ou evento criado: card some.

Telas afetadas em ordem:
1. confraria-detalhe aba Publicações (card no topo da timeline).
2. confraria-detalhe aba Eventos (card também aparece se inatividade for de
   eventos).
3. notificacoes (push registrado).
4. push-preview (preview pra QA).

### F12. Push de evento D-3, D-1, e dia

Responsável: Otavio.
Origem: backlog.
Status: APROVADO POR GABRIEL (jun 2026, D10).

Cadência de push pré evento (copys aprovadas):

Push D-3 às 19h da timezone do usuário:
1. Título: "Daqui a 3 dias."
2. Corpo se confirmado: "{nome do evento} é em 3 dias. Você está confirmado."
3. Corpo se não confirmado: "{nome do evento} é em 3 dias. Falta confirmar
   sua presença."
4. Destino do tap: event-detalhe.

Push D-1 às 19h:
1. Título: "Amanhã: {nome do evento}."
2. Corpo se confirmado: "Você está confirmado, te vemos lá."
3. Corpo se não confirmado: "Falta confirmar pra garantir sua vaga."
4. Destino do tap: event-detalhe.

Push do dia às 9h:
1. Título: "Hoje às {hora}."
2. Corpo se confirmado: "{nome do evento} em {local resumido}. Vamos lá."
3. Corpo se não confirmado: "{nome do evento} em {local resumido}. Confirma
   sua presença até as 12h."
4. Destino do tap: event-detalhe.

Banner em destaque no detalhe da confraria pra evento próximo:
1. Quando o próximo evento da confraria está a 3 dias ou menos, um banner
   sticky aparece no topo da aba Eventos.
2. Banner mostra: capa do evento + data + countdown ("Amanhã às 19h") + CTA
   "Confirmar presença" (se não confirmou) ou "Ver detalhes" (se confirmou).

Regras de quiet hours e cap:
1. Todos os pushes respeitam 22h às 8h.
2. Cada push dispara 1 vez por usuário.
3. Se o usuário já confirmou e o evento é gratuito: push D-3 não dispara
   (evita spam).
4. Se o evento foi cancelado: nenhum push.

Aceite:
1. Evento daqui 3 dias: push D-3 dispara às 19h.
2. Evento já confirmado por usuário em evento gratuito: D-3 não dispara.
3. Evento cancelado: nenhum push pra ninguém.
4. Banner no topo da aba Eventos quando evento está a 3 dias ou menos.

Telas afetadas em ordem:
1. event-detalhe (banner sticky com countdown).
2. confraria-detalhe aba Eventos (banner sticky no topo da aba).
3. home/confrarias aba Eventos segmento Meus (banner sticky se houver evento
   próximo entre os meus).
4. notificacoes (registro dos 3 pushes).
5. push-preview (preview dos 3 pushes pra QA).

### F13. Criação e integração da API Meta SDK pra Instagram, Facebook e contas do app

Responsável: Otavio (já cuida do tracking AppsFlyer e Meta Ads).
Origem: necessidade nova levantada na sessão Gabriel jun 2026 mais cruzamento
com US-236 (Meta App Events SDK e Conversions API em desenvolvimento), US-192
(compartilhamento multi canal em desenvolvimento) e US-239 (compartilhamento
nativo Instagram Stories em desenvolvimento).
Status: definido nesta Sprint, dependência de credenciais Meta Business.

Definição: o app passa a se integrar com a Meta SDK em três frentes complementares:

Frente 1, conta do usuário (Instagram e Facebook pessoais):
1. Usuário pode conectar a conta de Instagram dele no perfil (perfil-eu seção
   Configurações ou editar-perfil).
2. Usuário pode conectar a conta de Facebook dele no mesmo lugar.
3. Conexão via OAuth oficial da Meta (Facebook Login SDK iOS e Android +
   Instagram Basic Display API quando aplicável).
4. Dados puxados da conta do usuário: foto de perfil, nome público, handle do
   Instagram, contagem de seguidores, contagem de posts, biografia, e a lista
   dos últimos 9 posts públicos (capa apenas, com permissão Basic Display).
5. Esses dados ficam disponíveis no perfil Tchin do usuário (linha "Minhas
   redes" no perfil-eu, com chips Instagram e Facebook conectados ou pendentes).
6. Política: nada é compartilhado pra outros usuários do Tchin sem opt in. A
   linha Minhas redes vira pública só se o usuário ativar em
   config-privacidade nova seção Redes sociais.

Frente 2, conta do app (página oficial Tchin Tchin):
1. App passa a ler dados da conta oficial Tchin Tchin no Instagram e Facebook
   via Graph API com token do app.
2. Dados puxados da conta do app: últimos posts editoriais, número de
   seguidores oficial, estatísticas de alcance dos posts marcados como
   campanha.
3. Esses dados alimentam o Bloco 6 do hub Descobri (A1) Curiosidades editoriais
   e o card editorial mensal Uva da semana, ambos podem virar reflexo das
   publicações da conta oficial.
4. Permite ao time editorial publicar no Instagram oficial e, com flag de
   sincronização, replicar o conteúdo dentro do app como card de feed.

Frente 3, tracking publicitário (Meta App Events e Conversions API):
1. Continuar e completar a integração já em desenvolvimento US-236.
2. Tracking AppsFlyer já fechado em Sprint 12 e 13 (criação de conta a partir
   de Meta Ads) continua válido.
3. Adicionar eventos de conversão server side via Conversions API (compra,
   RSVP pago, scanner usado, lição concluída).
4. Sincronizar Customer List Audiences (segmentação de usuários do Tchin pra
   reaproveitar em campanhas).
5. Garantir compliance LGPD: opt out na config-privacidade seção Dados de
   publicidade.

Permissões Meta solicitadas no fluxo OAuth da Frente 1:
1. instagram_basic (foto, posts públicos básicos).
2. instagram_graph_user_profile (handle, nome).
3. instagram_graph_user_media (últimos posts da conta pessoal).
4. public_profile (nome e foto do Facebook).
5. email (apenas pra validação se já não tem email no Tchin).
6. user_posts (opcional, só pra contagem de posts).

Permissões para a Frente 2 (token do app):
1. instagram_basic com conta business Tchin Tchin.
2. pages_show_list, pages_read_engagement (Facebook Page).
3. ads_management e ads_read se forem precisos pra Frente 3.

Onde aparece na UI:

1. perfil-eu seção Configurações ganha sub seção Minhas redes com 2 cards:
   Instagram (Conectar ou Conectada) e Facebook (Conectar ou Conectada).
2. editar-perfil ganha CTA Conectar Instagram e Facebook quando ainda não
   conectado.
3. config-conta ganha linha Contas conectadas que duplica a sub seção pra
   acesso direto.
4. config-privacidade ganha nova sub seção Redes sociais com toggles: Mostrar
   Instagram no meu perfil público (default off), Mostrar Facebook no meu
   perfil público (default off).
5. config-privacidade ganha nova sub seção Dados de publicidade com toggle
   Permitir uso anônimo dos meus eventos pra calibrar campanhas (default on,
   opt out disponível).
6. perfil-outro mostra chips Instagram e Facebook apenas se o dono autorizou.
7. home/descobrir (Descobri) Bloco 6 puxa as últimas curiosidades editoriais
   também da conta oficial Tchin no Instagram.

Aceite:
1. Conectar Instagram da conta pessoal: fluxo OAuth nativo abre, retorna pro
   app, chip aparece como Conectada.
2. Desconectar: chip volta pra Conectar, dados são removidos do perfil em
   menos de 24h.
3. Conta do app: editorial publica no Instagram oficial e o card aparece no
   Bloco 6 do Descobri após sincronização.
4. Tracking server side: evento RSVP pago dispara uma conversão na Meta com
   parâmetros sanitizados (sem PII).
5. LGPD: opt out de dados de publicidade desliga o tracking server side em
   tempo real.
6. Falha de OAuth (cancelar no meio): app volta pro perfil-eu sem estado
   parcial e mostra toast "Conexão cancelada".
7. Token expirado: app marca chip como Reconectar e dispara push de aviso.

Dependências e considerações técnicas:
1. Cadastro da Tchin Tchin como aplicativo no Meta Developers App Dashboard
   (já existe parcialmente, validar permissões e ambientes Dev, Stage, Prod).
2. App Review da Meta pra permissões avançadas (instagram_graph_user_media,
   ads_management). Estimativa: 5 a 10 dias úteis de revisão.
3. Domínio verificado no Meta Business Manager.
4. Política de privacidade e termos de uso precisam mencionar uso da API Meta
   (rota termos e politica-privacidade já existem, ajustar texto se
   necessário).
5. Esta Sprint entrega a base e a Frente 1 completa. Frentes 2 e 3 podem
   ficar como Em desenvolvimento e fechar até Sprint 15.

Riscos:
1. Risco de App Review demorar mais que a Sprint. Mitigação: iniciar revisão
   no dia 1 da Sprint, usar permissões básicas que não precisam de revisão
   manual enquanto avançadas estão em fila.
2. Risco de mudança de política da Meta sobre dados de Instagram. Mitigação:
   monitorar release notes da Graph API.

Telas afetadas em ordem:
1. perfil-eu seção Configurações (nova sub seção Minhas redes com 2 cards).
2. editar-perfil (CTA Conectar Instagram, CTA Conectar Facebook).
3. config-conta (linha Contas conectadas duplicando o acesso).
4. config-privacidade (nova sub seção Redes sociais com 2 toggles; nova sub
   seção Dados de publicidade com 1 toggle de opt out).
5. perfil-outro (chips Instagram e Facebook quando autorizado pelo dono).
6. home/descobrir bloco 6 do Descobri (alimentação da conta oficial Tchin no
   Instagram).
7. Fluxo OAuth nativo da Meta (modal externo do sistema, não tela do app).
8. Toast de sucesso e de erro pós OAuth (overlay transversal, M21).
9. notificacoes (registro de aviso de token expirado).
10. termos e politica-privacidade (texto ajustado pra mencionar uso da API
    Meta).

## 7. Bloco de pushes em produção (revisão de copy)

Os 3 pushes abaixo foram entregues na Sprint 13 e estão ativos em 1.6.6. Nesta
Sprint, ajustar a copy pra acompanhar o tom atualizado.

### P1. Push 4h após cadastro sem registrar vinho

Status: ativo.
Copy aprovada por Gabriel (jun/2026): "Vamos começar sua adega? Registra o
primeiro vinho em 1 minuto."

Comportamento: dispara 4h após criação da conta se o usuário não tiver feito
nenhum registro no diário. Não dispara de novo. Quiet hours respeita 22h às
8h. Se as 4h caem em quiet, posterga pras 9h.

### P2. Push do 3º dia 9h da manhã sobre quiz paladar

Status: ativo.
Copy aprovada por Gabriel (jun/2026): "Calibrou seu paladar? Em 2 minutos a
gente descobre."

Comportamento: dispara no 3º dia após cadastro às 9h da manhã, apenas se o
usuário não tiver feito o quiz de paladar (M03). Não dispara de novo.

### P3. Push do 7º dia às 18h sentiu sua falta

Status: ativo.
Copy aprovada por Gabriel (jun/2026): "{Nome}, sentimos sua falta. Tem
confraria nova na sua região."

Comportamento: dispara no 7º dia após cadastro às 18h, apenas se o usuário não
abriu o app nos últimos 3 dias. Não dispara de novo.

## 7B. Bloco de refatoração visual v2 de todas as telas existentes

A Sprint 14 inclui a refatoração visual de todas as telas existentes do app pra
acompanhar a v2 do design system. Iniciada na Sprint 13 com Splash, Onboarding
pre auth, Auth, Setup Perfil e Criação de Confraria/Evento, agora abrange o app
inteiro. Cada bloco abaixo representa um módulo da super doc.

Princípio único: a refatoração não é cosmética. Cada tela aplica as decisões de
produto fechadas até junho de 2026 (vide super doc) e ganha consistência total
com a identidade Tchin Tchin (tokens em src/legacy/tokens.jsx).

Regras gerais da v2 aplicáveis em todas as telas:
1. Cores burgundy primárias com âmbar como secundária para destaques editoriais.
2. Tipografia Fraunces serif em headlines, Inter sans serif em corpo.
3. Espaçamento em múltiplos de 4 px.
4. Botões com 4 variants: primary (burgundy), secondary (outline burgundy),
   ghost (texto burgundy), destructive (vermelho).
5. Cards com border radius médio, sombra suave, fundo branco em modo claro.
6. Estados vazios sempre com ilustração + título + body + 1 CTA primário (CTA
   ghost secundário opcional).
7. Toast top anchored, 3 s, 3 variants (success, info, warning, error).
8. Header de rotas de detalhe sempre com back à esquerda + título centro ou
   início + ações à direita.

### R1. Módulo 01 Auth e Acesso

Princípio: identidade burgundy + Apple e Google SSO em destaque. Sem magic link e
sem OTP de telefone (fora do produto, M01 § 1.0).

Telas afetadas em ordem:
1. welcome (SSO Apple + Google, hero serif).
2. onboarding (3 slides pre auth do MKT, fechado em F4).
3. login (formulário inputs + SSO).
4. cadastro (formulário + SSO + termos).
5. login-social (passo intermediário do SSO).
6. recuperar (entry point).
7. recuperar-email (input de email).
8. recuperar-enviado (estado pós envio).
9. recuperar-otp (input do código).
10. recuperar-redefinir (nova senha).
11. recuperar-sucesso (confirmação).
12. termos (texto rolável).
13. politica-privacidade (texto rolável).

Regras de negócio aplicadas:
1. SSO Apple + Google em destaque no welcome (Sprint 12 já entregou base, agora
   ajusta visual).
2. Vincular Google em config-conta (A4 desta Sprint).
3. Sem campo de telefone em momento algum (M01 § 1.0).

### R2. Módulo 02 Onboarding educacional e Roteamento

Princípio: 5 perguntas no quiz nivel, mínimo 3 interesses, GPS por intent, welcome
final com 3 highlights e CTA pra tour ou skip.

Telas afetadas em ordem:
1. quiz-nivel.
2. quiz-interesses.
3. tela-intencao.
4. gps-primer (variantes por intent: discover, diario, aprender, treino,
   confraria, wizard).
5. gps-negado.
6. welcome-final (3 highlights, CTA Começar tour ou Pular tour).
7. tutoriais (hub de tutoriais conversacionais).

Regras aplicadas:
1. Mínimo 3 interesses (validação no avançar).
2. Welcome final inclui pílula sutil de Pontos Tchin (M19 § 19.0.2).
3. Tour rapido com 4 passos cobrindo Comunidade, Confrarias, Descobrir, Adega.

### R3. Módulo 03 Meu Paladar

Princípio: 5 perguntas com swipe horizontal, resultado em radar 5 dimensões.

Telas afetadas em ordem:
1. quiz (5 perguntas).
2. quiz-result (radar + característica dominante + CTA Refazer).

Regras aplicadas:
1. Dimensões canônicas: Acidez, Tanino, Corpo, Doçura, Aromas (M07 § 7.5
   diferenciação Aromas vs Frutado fica fechada como Aromas).
2. Resultado abre Descobrir bloco Pra você imediatamente.

### R4. Módulo 04 Descobrir e Marketplace

Princípio: home/descobrir vira Descobri (A1 desta Sprint). Marketplace consume
banco novo (F1). Wine sem botão Comprar (B2).

Telas afetadas em ordem:
1. home/descobrir transformada em Descobri (A1).
2. marketplace (cards com match score, sem Comprar inline).
3. wine (sem botão Comprar, com match score, taxonomia clara).
4. busca (resultados sobre novo dataset).
5. filtros-avancados (filtros sobre novo dataset).
6. lista-desejos (taxonomia Wishlist M07 § 7.0).
7. comparar-vinhos (match comparativo).

### R5. Módulo 05 Carrinho e Checkout

Princípio: este módulo aplica ao carrinho geral (não eventos). Eventos têm seu
próprio fluxo em M12. O carrinho aqui é referência pra futura compra direta de
parceiros e pra resgate de Pontos.

Telas afetadas em ordem:
1. carrinho.
2. endereco.
3. pagamento.
4. pedido-confirmado.

Regras aplicadas:
1. Bloqueio de back em pedido-confirmado (M05 § 5.0).
2. Tabela de cupons (não hard-coded).
3. Avaliação opcional pós compra.

### R6. Módulo 06 Scanner e Aprenda Bebendo

Princípio: aposentar scanner v1, manter v2 e fallback. Carta-matches integrada.

Telas afetadas em ordem:
1. scanner (legado v1, manter pra compat) com aviso de aposentadoria.
2. scanner-result (legado v1).
3. scanner-v2 (atual).
4. scanner-result-v2 (atual, com match score A3).
5. scanner-fallback (busca manual).
6. modo-restaurante.
7. carta-matches (lista ordenada por match).
8. porque-combina.

Regras aplicadas:
1. Aposentar v1 conforme M06 § 6.0.
2. Pontos 15 por contribuir vinho novo (cap 5/dia), conforme M19 e M07 § 7.0.5.
3. Compartilhar carta pública.

### R7. Módulo 07 Adega, Diário e Estante

Princípio: taxonomia 4 conceitos (Estante, Diário, Favoritos, Wishlist),
slot multi garrafa, relatório mensal + anual (Wrapped).

Telas afetadas em ordem:
1. home/adega (banner Onde fica o quê dispensável, chips Favoritos e Wishlist,
   pílula inline por aba).
2. register-consumo passo 1 e 2.
3. registro-rapido.
4. registro-completo.
5. registro-confirmacao.
6. relatorio-mensal (e anual via mesmo template).
7. favoritos.

Regras aplicadas:
1. Banner taxonomia persistente em localStorage tc.adega.tax.dismissed.
2. Slot multi garrafa com badge times N.
3. Pontuação escalonada 5/8/10/15/20 com cap 3/dia.
4. Reverter label pra Adega (A2).

### R8. Módulo 08 Treine seu Paladar

Princípio: vidas regeneram a cada 4h, divisões nomeadas (Frisante, Branco, Rosé,
Tinto, Reserva, Gran Reserva), liga global + amigos, cristais com 2 destinos
(loja interna + Marketplace de Experiência).

Telas afetadas em ordem:
1. treino-paladar (home do Treino, 8 passos do onboarding do mascote).
2. treino-licao (conceito, exercício, feedback, completa).
3. treino-liga (ranking).
4. treino-aprender (catálogo de unidades).

Regras aplicadas:
1. Vidas regeneram 4h cada uma.
2. Cristais convertem em pontos Tchin (M19) a 1 cristal = 5 pts.

### R9. Módulo 09 Aprenda (hub educacional)

Princípio: unificar com M06 num só hub educacional (Gabriel jun 2026, M09 § 9.0).

Telas afetadas em ordem:
1. aprender.
2. aprenda.
3. aprenda-detalhe.

Regras aplicadas:
1. Botão Começar leva pro hub unificado.
2. Unificar M06 e M09 num único acesso a partir do bottom nav ou do header de
   Descobrir.

### R10. Módulo 10 Harmoniza

Princípio: bidirecional prato vs vinho, contexto (ocasião, estação, orçamento).

Telas afetadas em ordem:
1. harmoniza (entry, escolher prato ou vinho).
2. harmoniza-resultados (sugestões com match individual).

### R11. Módulo 11 Confrarias

Princípio: 5 abas (Eventos, Publicações, Membros, Adega, Experiência), papéis
Admin Membro Convidado, privacidade Pública Privada.

Telas afetadas em ordem:
1. home/confrarias (segmented Confrarias e Eventos, filtros, badges em cards via
   V4 da Sprint 15).
2. confraria-detalhe header.
3. confraria-detalhe aba Eventos.
4. confraria-detalhe aba Publicações.
5. confraria-detalhe aba Membros.
6. confraria-detalhe aba Adega.
7. confraria-detalhe aba Experiência (cross M04 § 4.0.3).
8. wizard-confraria-1 (info básica).
9. wizard-confraria-2 (estilo e perfil).
10. wizard-confraria-3 (privacidade).
11. wizard-confraria-4 (cidade e localização).
12. wizard-confraria-5 (capa e ícone).
13. wizard-confraria-6 (revisão e CTA Criar).
14. confraria-config (admin).
15. confraria-convidar (membro e admin).
16. confraria-sair (modal de confirmação).
17. confraria-transferir (admin only).
18. confraria-regras (mostrar regras editáveis).
19. confraria-welcome (pós convite aceito).
20. confraria-apresentar (escrever apresentação).
21. confraria-tour-rapido (tour de 3 passos).

Regras aplicadas:
1. Compartilhar e Convidar só pra membros e admins (B7).
2. Onboarding novo membro com 3 highlights (F9).
3. Modal pós criação com 3 passos (F7).
4. Banner D+3 sticky pra admin sem evento criado (F8).
5. Card Cutuca os admins na inatividade (F11).
6. Barra de 3 contadores (F10).

### R12. Módulo 12 Eventos

Princípio: 5 passos no wizard, taxa visível e separada, 3 janelas de cancelamento,
LACI vs Combinar com admin, endereço sempre 24h antes.

Telas afetadas em ordem:
1. event-wizard-1 (tipo, tema com 5 templates F5).
2. event-wizard-2 (descrição preenchida por template).
3. event-wizard-3 (valor e pagamento, oculto pra Gratuito B3).
4. event-wizard-4 (capacidade sugerida por template).
5. event-wizard-5 (revisão).
6. event-detalhe (RSVP, row Valor com taxa, CTA sticky V3 Sprint 15).
7. evento-editar (replicar regras).
8. evento-presenca (presença e pagamentos).
9. evento-pos-avaliar (avaliar vinhos).
10. evento-pos-ata (publicar ata).
11. ParticiparSheet, EscolherMetodoSheet, PixLaciSheet, PagarForaSheet,
    CancelarSheet (sheets do fluxo de pagamento).

Regras aplicadas:
1. Taxa Tchin Tchin visível e separada (M12 § 12.A.1).
2. 3 janelas de cancelamento (M12 § 12.0.x).
3. Endereço 24h antes (M12 § 12.A.3).
4. Templates de evento (F5).
5. Correlação confraria template (F6).
6. Push D-3, D-1, dia (F12).

### R13. Módulo 13 Comunidade e Feed

Princípio: feed cronológico + sugestões, posts e momentos (Stories), comentários
em tela cheia e inline (M13 § 13.0).

Telas afetadas em ordem:
1. home/comunidade (feed principal).
2. criar-post.
3. criar-momento (Stories).
4. post-detail.
5. comentarios (rota dedicada).

Regras aplicadas:
1. Comentários em tela cheia E inline (Gabriel jun 2026).
2. Stories existem (Momentos).
3. Audiência default Minhas confrarias.
4. Contador de comentários atualiza ao excluir (B4).

### R14. Módulo 14 Perfil e Social

Princípio: perfil próprio como rota dedicada (perfil-eu), seguir bilateral se
perfil privado, @handle com cooldown 30 dias.

Telas afetadas em ordem:
1. perfil-outro.
2. perfil-eu (rota dedicada, M14 § 14.3).
3. editar-perfil (hub).
4. editar-perfil-foto.
5. editar-perfil-paladar.
6. editar-perfil-privacidade.
7. perfil-seguidores.
8. perfil-seguindo.
9. perfil-atividade-publica.
10. perfil-vinhos-provados.
11. perfil-sugestoes.
12. perfil-comparar-paladar.
13. badges-galeria.

Regras aplicadas:
1. perfil-eu canônico (M14 § 14.3 e implementação atual no protótipo).
2. Seguir bilateral se privado (M14 § 14.1).
3. Cooldown 30 dias no handle (M14 § 14.2), com tela de aviso quando dentro do
   cooldown.

### R15. Módulo 15 Expert

Princípio: badge only (sem comissão), Q&A resposta pública mas notificação
privada, cooldown 30 dias pra reaplicar (M15 § 15.0).

Telas afetadas em ordem:
1. expert-virar.
2. expert-aplicar.
3. expert-pendente.
4. expert-q-a.
5. expert-responder.
6. perguntar-expert.

Regras aplicadas:
1. Só badge, sem comissão (M15 § 15.1).
2. Resposta pública, notificação só pra quem perguntou (M15 § 15.2).
3. Cooldown 30 dias (M15 § 15.3).

### R16. Módulo 16 Indicação e Convites

Princípio: bilateral (R$ 30 e R$ 30), bônus libera no cadastro do convidado (não
1ª compra), teto 25 com badge Top Embaixador (M16 § 16.0).

Telas afetadas em ordem:
1. indicacao-landing.
2. indicacao-compartilhar.
3. indicacao-meus-convites.
4. indicacao-recompensas.
5. convite-recebido (tela do convidado).

Regras aplicadas:
1. Bônus libera no cadastro (M16 § 16.0.1).
2. Teto 25 indicações com badge Top Embaixador (M16 § 16.0.2).

### R17. Módulo 17 Chat e DMs

Princípio: DM configurável pelo user (M17 § 17.0.1), histórico de grupo
retroativo (M17 § 17.0.2).

Telas afetadas em ordem:
1. chat-lista (tabs Todas, Pessoas, Grupos, Não lidas).
2. chat-conversa.

Regras aplicadas:
1. DM com 5 opções de quem pode mandar (anyone, following, mutual, none, misto).
2. Histórico do grupo visível pra quem entra depois (M17 § 17.0.2).

### R18. Módulo 18 Notificações e Engajamento

Princípio: catálogo amplo (~50 notificações), canais opt-out, nudges D+1, D+3,
D+7, D+14.

Telas afetadas em ordem:
1. notificacoes (lista in app).
2. push-primer.
3. push-negado.
4. push-canais.
5. push-preview.
6. nudge-d1, nudge-d3, nudge-d7, nudge-d14.
7. plus-one.

Regras aplicadas:
1. Quiet hours 22h às 8h em todas as notifs (P1, P2, P3, F8, F11, F12).
2. Cap diário de notifs em torno de 4 por usuário.
3. Pushes novos desta Sprint (F8, F11, F12) entram no catálogo.

### R19. Módulo 19 Jornada, Pontos e Desafios

Princípio: economia unificada (Pontos Tchin), 4 abas em pontos (Resgatar, Ganhar,
Extrato, Como funcionam), tabela mestra de 24 linhas em 6 grupos.

Telas afetadas em ordem:
1. jornada (marcos do usuário).
2. pontos com 4 abas (M19 § 19.4).
3. jornada-celebrar (5 variações: marco, desafio, nível, streak, resgate).
4. desafio-detalhe (8 templates × 3 estados).
5. badges (cross M14 § 14.6).

Regras aplicadas:
1. 4 abas na pontos (Sprint 14 jun 2026).
2. Tabela mestra completa M19 § 19.0.4.

Atenção: a decisão de reativar o épico de Pontos no backend é da Sprint 15 R6. O
trabalho visual da v2 entra aqui de qualquer forma.

### R20. Módulo 20 Config e Suporte

Princípio: sem 2FA, sem telefone, sem Tchin Tchin Plus, telas de desativar e
excluir conta.

Telas afetadas em ordem:
1. config-notif.
2. config-privacidade (com privacy granular cross M14 e M17).
3. config-conta (linha Vincular Google de A4).
4. conta-desativada.
5. conta-excluida.
6. config-bloqueados.
7. suporte-faq.
8. suporte-contato.

Regras aplicadas:
1. Desativar (reversível) vs Excluir (soft delete 30 dias).
2. Vínculo Google em config-conta (A4).

### R21. Módulo 21 Estados de sistema

Princípio: linguagem de marca em vez de jargão técnico, sempre oferecer saída.

Telas afetadas em ordem:
1. erro-404 (Garrafa não encontrada).
2. erro-permissao (Conteúdo restrito).
3. erro-sessao com 3 reasons: atualizacao, seguranca, inatividade (M21 § 21.3).
4. vinho-indisponivel.
5. erro-servidor (assume a culpa do nosso lado).
6. toast (overlay, transversal).

Regras aplicadas:
1. erro-sessao só em 3 cenários raros (F2).
2. Status page interna (não pública), conforme M21 § 21.0.1.
3. Toasts empilham, até 3 visíveis, M21 § 21.0.2.

### R22. Onboarding visual e Tutoriais conversacionais com mascote

Princípio: o app já tem 4 famílias distintas de orientação ao usuário (pre auth,
pos auth, tour de 4 passos da bottom nav, tutoriais conversacionais com mascote em
features específicas). A v2 unifica a identidade do mascote, padroniza balão de
fala, spotlight e coachmark, e mantém a regra de "ver 1 vez e marca como feito"
(localStorage tc.tutor.done JSON id timestamp).

Telas afetadas em ordem:

Onboarding pre auth (já em R1):
1. onboarding slide 1 (identidade da marca).
2. onboarding slide 2 (dor 1, incerteza de compra).
3. onboarding slide 3 (dor 3, memória fragmentada).

Onboarding pos auth (já em R2):
4. quiz-nivel.
5. quiz-interesses (mínimo 3).
6. tela-intencao.
7. gps-primer e variantes (discover, diario, aprender, treino, confraria, wizard,
   skip).
8. gps-negado.
9. welcome-final (3 highlights mais pílula sutil de Pontos, M19 § 19.0.2).

Tour guiado de 4 passos da bottom nav (cross M02):
10. tour-passo-1-comunidade.
11. tour-passo-2-confrarias.
12. tour-passo-3-descobrir.
13. tour-passo-4-adega.
14. tour-celebracao (após completar os 4 passos).

Hub de tutoriais (cross M20 Suporte):
15. tutoriais (rota /tutoriais, lista de todos os tutoriais com status de
    completo ou pendente, acessível por perfil-eu seção Suporte ou por
    config-conta).

Tutorial conversacional do scanner (M06):
16. tutor-scanner-intro (mascote no canto, balão de fala).
17. tutor-scanner-step-1.
18. tutor-scanner-step-2.
19. tutor-scanner-step-3.

Tutorial conversacional do modo restaurante (M06):
20. tutor-restaurante-intro.
21. tutor-restaurante-step-1.
22. tutor-restaurante-step-2.
23. tutor-restaurante-step-3.
24. tutor-restaurante-step-4.

Tutorial conversacional de confraria (M11):
25. tutor-confraria-intro.
26. tutor-confraria-step-1.
27. tutor-confraria-step-2.
28. tutor-confraria-step-3.

Tutorial conversacional alternativo confraria-usar (M11):
29. confraria-usar (tutorial conversacional opcional via menu, decisão Gabriel
    junho 2026, M11 § 11.A.1, deixa de disparar automaticamente).

Onboarding gamificado do Treino seu Paladar com mascote (M08):
30. treino-onb-intro.
31. treino-onb-say1.
32. treino-onb-objetivo.
33. treino-onb-goal.
34. treino-onb-say2.
35. treino-onb-streakgoal.
36. treino-onb-gems.
37. treino-onb-final.

Modais e overlays:
38. Modal pós criação de confraria (F7).
39. Modal de boas vindas pra novo membro de confraria (F9, com 3 highlights).
40. TourDiario legado (SVG mask, substituído oficialmente pelo TchinTutor
    moderno; deprecar a versão SVG nesta Sprint).

Regras gerais da v2 dos tutoriais:
1. Mascote no canto inferior direito com pulse suave de 1.8 segundos.
2. Balão de fala com fade in de 200 ms, máximo 2 linhas de texto, fonte Inter.
3. Spotlight escurece a tela inteira fora da zona alvo com gradiente radial.
4. Coachmark com seta ou círculo pulsante apontando pra zona alvo.
5. Botão Pular sempre disponível, canto superior direito.
6. Botão Próximo no rodapé (Voltar quando aplicável a partir do passo 2).
7. Ao completar tutorial inteiro: confete suave de 800 ms mais toast "Tutorial
   concluído. Você ganhou 10 pts" (depende da reativação do épico Pontos em
   Sprint 16 ou na decisão Gabriel da Sprint 15 R6).
8. Persistência: cada tutorial guarda done em localStorage tc.tutor.done JSON
   id timestamp. Reset via debug ou via config-conta seção Tutoriais.

Regras de disparo automático (resumo):
1. Onboarding pre auth: primeira abertura após instalar.
2. Onboarding pos auth: imediatamente após primeiro cadastro.
3. Tour de 4 passos: ao concluir welcome-final, se o usuário escolher Começar
   tour. Se pular, fica disponível pelo hub /tutoriais.
4. Tutor scanner: primeira vez que abrir scanner-v2.
5. Tutor restaurante: primeira vez que abrir modo-restaurante.
6. Tutor confraria: primeira vez que entrar em confraria-detalhe sendo membro.
7. Tutor treino: primeira vez que abrir treino-paladar.
8. confraria-usar: NÃO dispara mais automaticamente, fica opcional via menu.

Aceite:
1. Cada tutorial dispara 1 vez e não volta sozinho.
2. Hub /tutoriais lista os 7 tutoriais conversacionais mais o tour de 4 passos
   com status Concluído ou Pendente.
3. Tutorial concluído manualmente pelo hub também marca como feito.
4. Pular fecha o tutorial e marca como feito.
5. Mascote, balão, spotlight e coachmark seguem o padrão v2 nas 7 famílias de
   tutorial.
6. Reset pelos debug tools volta tutorial pra Pendente.

## 7C. Inventário completo das telas afetadas na Sprint 14, fluxo a fluxo

Esta seção lista uma a uma todas as telas existentes do app, em ordem dentro de
cada módulo, com a indicação de quais itens da Sprint 14 (B/A/F/P/R) tocam
cada tela. Use como checklist final do QA da Sprint.

Notação:
- Tela: nome da rota no roteador do app.
- Estados: variantes capturadas em produção (empty, loading, populated, erro, etc).
- Entra de: telas anteriores que levam ao destino.
- Sai pra: telas seguintes a partir daqui.
- Toca: lista de itens da Sprint 14 que mexem nesta tela.

### Módulo 01, Auth e Acesso (13 telas)

1. welcome
   - Estados: padrão.
   - Entra de: cold start sem sessão; logout.
   - Sai pra: login, cadastro, login-social Google, login-social Apple, recuperar.
   - Toca: B1 (teclado iOS), A4 (login Google em conta com senha), F2 (token
     Keycloak), R1, R22.

2. onboarding (3 slides pre auth)
   - Estados: slide 1, slide 2, slide 3.
   - Entra de: primeira abertura após install.
   - Sai pra: welcome (Pular ou Começar).
   - Toca: F4 (3 slides MKT), R1, R22.

3. login
   - Estados: padrão, erro de senha, loading.
   - Entra de: welcome.
   - Sai pra: home/comunidade após sucesso; recuperar.
   - Toca: B1, A4, F2, R1, R22.

4. cadastro
   - Estados: passo 1 (email e senha), passo 2 (nome e termos), erro.
   - Entra de: welcome.
   - Sai pra: quiz-nivel após sucesso.
   - Toca: B1, A4, R1, R22.

5. login-social
   - Estados: Google, Apple.
   - Entra de: welcome botões SSO.
   - Sai pra: quiz-nivel se conta nova, home/comunidade se conta existente.
   - Toca: A4, R1.

6. recuperar
   - Estados: padrão.
   - Entra de: login link "Esqueci senha".
   - Sai pra: recuperar-email.
   - Toca: B1, R1.

7. recuperar-email
   - Estados: input, validando, enviado.
   - Entra de: recuperar.
   - Sai pra: recuperar-enviado.
   - Toca: B1, F2 (entry point pós erro-sessao reason seguranca), R1.

8. recuperar-enviado
   - Estados: padrão.
   - Entra de: recuperar-email.
   - Sai pra: recuperar-otp.
   - Toca: R1.

9. recuperar-otp
   - Estados: input, validando, erro.
   - Entra de: recuperar-enviado.
   - Sai pra: recuperar-redefinir.
   - Toca: B1, R1.

10. recuperar-redefinir
    - Estados: input, validando, sucesso.
    - Entra de: recuperar-otp.
    - Sai pra: recuperar-sucesso.
    - Toca: B1, R1.

11. recuperar-sucesso
    - Estados: padrão.
    - Entra de: recuperar-redefinir.
    - Sai pra: login.
    - Toca: R1.

12. termos
    - Estados: rolável.
    - Entra de: cadastro link Termos; perfil-eu seção Configurações.
    - Sai pra: back.
    - Toca: R1.

13. politica-privacidade
    - Estados: rolável.
    - Entra de: cadastro link Privacidade; perfil-eu seção Configurações.
    - Sai pra: back.
    - Toca: R1.

### Módulo 02, Onboarding educacional e Roteamento (7 telas + variantes)

1. quiz-nivel
   - Estados: padrão, selecionado, default.
   - Entra de: cadastro ou login-social conta nova.
   - Sai pra: quiz-interesses.
   - Toca: R2, R22.

2. quiz-interesses
   - Estados: default, min (menos de 3), max, overflow (mais de N), selecionado.
   - Entra de: quiz-nivel.
   - Sai pra: tela-intencao.
   - Toca: R2 (validação mínimo 3), R22.

3. tela-intencao
   - Estados: default, skip-modal.
   - Entra de: quiz-interesses.
   - Sai pra: gps-primer com intent escolhido, ou skip pro welcome-final.
   - Toca: R2, R22.

4. gps-primer (7 variantes por intent)
   - Estados: discover, diario, aprender, treino, confraria, wizard, skip; mais
     o dialog do sistema.
   - Entra de: tela-intencao.
   - Sai pra: welcome-final (sucesso ou negado).
   - Toca: R2, R22.

5. gps-negado
   - Estados: padrão.
   - Entra de: gps-primer recusado.
   - Sai pra: welcome-final.
   - Toca: R2, R22.

6. welcome-final
   - Estados: default, confraria (quando intent = confraria).
   - Entra de: gps-primer ou gps-negado.
   - Sai pra: home da bottom nav escolhido pelo intent; tour-passo-1.
   - Toca: R2 (3 highlights, pílula sutil de Pontos M19), R22.

7. tutoriais (hub)
   - Estados: lista com 7 famílias de tutorial mais o tour de 4 passos.
   - Entra de: perfil-eu seção Suporte; config-conta seção Tutoriais.
   - Sai pra: cada tutorial individualmente.
   - Toca: R22.

8. Tour 4 passos (sub fluxo do welcome-final)
   - tour-passo-1-comunidade, tour-passo-2-confrarias, tour-passo-3-descobrir,
     tour-passo-4-adega, tour-celebracao.
   - Entra de: welcome-final CTA "Começar tour".
   - Sai pra: home/comunidade ao concluir.
   - Toca: R22.

### Módulo 03, Meu Paladar (2 telas)

1. quiz
   - Estados: q1, q1-selected, q2, q3, q4, q5.
   - Entra de: home/descobrir card "Quer recomendações?"; perfil-eu CTA Refazer
     paladar; A1 estado sem paladar.
   - Sai pra: quiz-result.
   - Toca: R3.

2. quiz-result
   - Estados: padrão com radar.
   - Entra de: quiz.
   - Sai pra: home/descobrir bloco Pra você (A1 ativa).
   - Toca: R3.

### Módulo 04, Descobrir e Marketplace (7 telas)

1. home/descobrir
   - Estados: default (com paladar), first-time sem paladar.
   - Entra de: bottom nav tab Descobrir; deep link.
   - Sai pra: Descobri (CTA Abrir Descobri), wine, scanner, marketplace
     (continua existindo internamente), categorias.
   - Toca: B8 (FAB Scanner visível), A1 (ganha CTA Abrir Descobri), R4.

2. marketplace (substituído pelo novo Descobri, A1)
   - Estados antes da Sprint: default, filtersheet, search, multi-select.
   - Estados após A1: 6 blocos do novo Descobri (Hero do dia, Pra você,
     Confrarias da região, Eventos próximos, Marketplace de Experiência,
     Curiosidades editoriais).
   - Entra de: home/descobrir CTA Abrir Descobri; deep link.
   - Sai pra: wine, confraria-detalhe, event-detalhe, scanner, quiz.
   - Toca: A1 (substituição), A3 (match score nos cards), B2 (sem botão Comprar
     inline), F1 (dataset novo), R4, B8 (FAB Scanner).

3. wine
   - Estados: default.
   - Entra de: marketplace, home/descobrir bloco Pra você, busca, scanner-result,
     comparar-vinhos, carta-matches, lista-desejos, favoritos, register-consumo
     passo 1.
   - Sai pra: comparar-vinhos, harmoniza, perfil-outro (autor), back.
   - Toca: B2 (sem botão Comprar), A3 (chip de match score abaixo do nome), F1
     (dataset novo), R4, B8 (sem FAB).

4. busca
   - Estados: empty, results.
   - Entra de: home/descobrir ícone busca; bottom nav.
   - Sai pra: wine, perfil-outro.
   - Toca: B8 (FAB Scanner), F1 (dataset novo), R4.

5. filtros-avancados
   - Estados: default, applied.
   - Entra de: marketplace long press no ícone tune.
   - Sai pra: marketplace com filtros aplicados.
   - Toca: F1 (filtros sobre novo dataset), R4, B8 (sem FAB).

6. lista-desejos
   - Estados: default, selecting.
   - Entra de: home/adega chip Wishlist; perfil-eu seção Atividade; profile
     drawer Marketplace.
   - Sai pra: wine.
   - Toca: B2 (sem botão Comprar inline), F1 (dataset novo), R4, B8 (FAB
     Adicionar vinho).

7. comparar-vinhos
   - Estados: default.
   - Entra de: wine CTA Comparar; lista-desejos seleção múltipla.
   - Sai pra: wine, harmoniza.
   - Toca: A3 (match comparativo), F1, R4, B8 (sem FAB).

### Módulo 05, Carrinho e Checkout (4 telas)

1. carrinho
   - Estados: default, cupom-ok.
   - Entra de: marketplace ícone carrinho; perfil-eu seção Marketplace.
   - Sai pra: endereco.
   - Toca: R5, B8 (sem FAB).

2. endereco
   - Estados: default, novo.
   - Entra de: carrinho.
   - Sai pra: pagamento.
   - Toca: R5, B8 (sem FAB).

3. pagamento
   - Estados: cartao, pix, boleto.
   - Entra de: endereco.
   - Sai pra: pedido-confirmado.
   - Toca: R5, B8 (sem FAB).

4. pedido-confirmado
   - Estados: default.
   - Entra de: pagamento.
   - Sai pra: home (sem back, M05 § 5.0).
   - Toca: R5 (bloqueio de back), B8 (sem FAB).

### Módulo 06, Scanner e Aprenda Bebendo (8 telas)

1. scanner (legado v1)
   - Estados: tooltip, default, help.
   - Entra de: home/descobrir card scanner; FAB de Scanner (B8); perfil-eu.
   - Sai pra: scanner-result.
   - Toca: R6 (aviso de aposentadoria), B8.

2. scanner-result (legado v1)
   - Estados: fail.
   - Entra de: scanner.
   - Sai pra: wine, scanner-fallback.
   - Toca: R6.

3. scanner-v2
   - Estados: default.
   - Entra de: substituirá scanner v1 após aposentadoria; FAB.
   - Sai pra: scanner-result-v2.
   - Toca: R6, R22 (tutor scanner dispara primeira vez).

4. scanner-result-v2
   - Estados: default.
   - Entra de: scanner-v2.
   - Sai pra: wine, porque-combina.
   - Toca: A3 (match destacado), R6.

5. scanner-fallback
   - Estados: default.
   - Entra de: scanner-result quando match falha.
   - Sai pra: wine via busca manual.
   - Toca: R6.

6. modo-restaurante
   - Estados: default.
   - Entra de: perfil-eu seção Aprender; deep link.
   - Sai pra: carta-matches.
   - Toca: R6, R22 (tutor restaurante 5 passos dispara primeira vez).

7. carta-matches
   - Estados: default, por-preco, por-tipo.
   - Entra de: modo-restaurante.
   - Sai pra: wine, porque-combina.
   - Toca: A3 (ordenação por match), F1, R6.

8. porque-combina
   - Estados: default.
   - Entra de: carta-matches; scanner-result-v2; harmoniza-resultados.
   - Sai pra: back.
   - Toca: A3, R6.

### Módulo 07, Adega, Diário e Estante (7 telas)

1. home/adega (rota da tab da bottom nav)
   - Estados: estante, diario, indicadores, paladar.
   - Entra de: bottom nav tab Adega.
   - Sai pra: register-consumo, wine, favoritos, lista-desejos, quiz, descobrir.
   - Toca: R7 (banner taxonomia, chips, pílula inline), B8 (FAB Registrar
     consumo).

2. register-consumo
   - Estados: passo 1 (escolher vinho), passo 1 busca, passo 2 (avaliar).
   - Entra de: home/adega CTA Adicionar; FAB; empty state do Diário.
   - Sai pra: home/adega após salvar; scanner-v2.
   - Toca: B1 (teclado), B8 (sem FAB), R7.

3. registro-rapido
   - Estados: default.
   - Entra de: home/adega CTA atalho; FAB.
   - Sai pra: registro-confirmacao após salvar; registro-completo (Modo
     completo).
   - Toca: B1, B8 (sem FAB), R7.

4. registro-completo
   - Estados: default.
   - Entra de: registro-rapido link Modo completo.
   - Sai pra: registro-confirmacao.
   - Toca: B1, B8 (sem FAB), R7.

5. registro-confirmacao
   - Estados: default.
   - Entra de: register-consumo passo 2 sucesso; registro-rapido sucesso;
     registro-completo sucesso.
   - Sai pra: home/adega.
   - Toca: R7.

6. relatorio-mensal
   - Estados: default (storytelling vertical).
   - Entra de: home/adega Indicadores; push nudge mensal.
   - Sai pra: back, share nativo (gera imagem 1080x1920 pra Stories).
   - Toca: R7.

7. favoritos
   - Estados: default.
   - Entra de: home/adega chip Favoritos; perfil-eu seção Atividade.
   - Sai pra: wine.
   - Toca: B2 (sem Comprar inline nos cards), B8 (FAB Adicionar vinho), R7.

### Módulo 08, Treine seu Paladar (4 telas + 8 passos do onboarding)

1. treino-paladar (home do Treino)
   - Estados: home; 8 passos do onboarding do mascote (intro, say1, objetivo,
     goal, say2, streakgoal, gems, final).
   - Entra de: perfil-eu seção Aprender; tela-intencao intent treino.
   - Sai pra: treino-licao, treino-liga, treino-aprender.
   - Toca: R8, R22 (tutor treino paladar com mascote).

2. treino-licao
   - Estados: conceito, exercicio, feedback, completa.
   - Entra de: treino-paladar.
   - Sai pra: treino-paladar.
   - Toca: R8.

3. treino-liga
   - Estados: default.
   - Entra de: treino-paladar.
   - Sai pra: back.
   - Toca: R8.

4. treino-aprender
   - Estados: default.
   - Entra de: treino-paladar.
   - Sai pra: back.
   - Toca: R8.

### Módulo 09, Aprenda (3 telas)

1. aprender
   - Estados: default.
   - Entra de: bottom nav ou rota direta.
   - Sai pra: aprenda; aprenda-detalhe.
   - Toca: R9 (unificar com M06).

2. aprenda
   - Estados: default.
   - Entra de: aprender; perfil-eu seção Aprender.
   - Sai pra: aprenda-detalhe.
   - Toca: R9.

3. aprenda-detalhe
   - Estados: default.
   - Entra de: aprenda.
   - Sai pra: back.
   - Toca: R9.

### Módulo 10, Harmoniza (2 telas)

1. harmoniza
   - Estados: default, autocomplete.
   - Entra de: perfil-eu seção Aprender; wine CTA Harmonizar; comparar-vinhos.
   - Sai pra: harmoniza-resultados.
   - Toca: R10 (bidirecional, contexto).

2. harmoniza-resultados
   - Estados: default.
   - Entra de: harmoniza.
   - Sai pra: wine; porque-combina.
   - Toca: A3 (match individual), R10.

### Módulo 11, Confrarias (21 telas)

1. home/confrarias
   - Estados: aba Confrarias, aba Eventos com segmented Meus | Descobrir e chips
     Próximos | Andamento | Finalizados.
   - Entra de: bottom nav tab Confrarias.
   - Sai pra: confraria-detalhe; wizard-confraria-1; event-detalhe.
   - Toca: R11, B8 (FAB Criar confraria).

2. confraria-detalhe
   - Estados: 5 abas (Eventos, Publicacoes, Membros, Estoque, Experiencia);
     diferentes por papel (admin, membro, nao-membro); just-created (modal F7);
     empty por aba.
   - Entra de: home/confrarias; cards de sugestao; convite-recebido aprovado.
   - Sai pra: 5 abas; event-detalhe; wizard-confraria-1; confraria-config;
     confraria-convidar; confraria-regras; confraria-sair; confraria-transferir;
     perfil-outro membros.
   - Toca: B7 (compartilhar oculto pra nao membro), F7 (modal pos criacao), F8
     (banner sticky D+3 pro admin), F9 (modal boas vindas novo membro), F10
     (barra 3 contadores), F11 (card Cutuca os admins), F12 (banner sticky pra
     proximo evento <3 dias), R11. A4ª aba mantem o nome Estoque (decisao
     Gabriel jun 2026, A2 retirado).

3. wizard-confraria-1
   - Estados: passo 1 info básica.
   - Entra de: home/confrarias CTA Criar; FAB; confraria-detalhe vazio.
   - Sai pra: wizard-confraria-2.
   - Toca: B1, R11, B8 (sem FAB).

4. wizard-confraria-2
   - Estados: passo 2 estilo e perfil.
   - Entra de: wizard-confraria-1.
   - Sai pra: wizard-confraria-3.
   - Toca: B1, R11, B8 (sem FAB).

5. wizard-confraria-3
   - Estados: passo 3 privacidade (Pública vs Privada).
   - Entra de: wizard-confraria-2.
   - Sai pra: wizard-confraria-4.
   - Toca: B1, R11, B8 (sem FAB).

6. wizard-confraria-4
   - Estados: passo 4 cidade e localização.
   - Entra de: wizard-confraria-3.
   - Sai pra: wizard-confraria-5.
   - Toca: B1, R11, B8 (sem FAB).

7. wizard-confraria-5
   - Estados: passo 5 capa e ícone.
   - Entra de: wizard-confraria-4.
   - Sai pra: wizard-confraria-6.
   - Toca: B1, R11, B8 (sem FAB).

8. wizard-confraria-6
   - Estados: passo 6 revisão e CTA Criar.
   - Entra de: wizard-confraria-5.
   - Sai pra: confraria-welcome (após criar).
   - Toca: F6 (captura estilo pra correlação template), F7 (dispara modal),
     R11, B8 (sem FAB).

9. confraria-config
   - Estados: padrão (admin).
   - Entra de: confraria-detalhe menu 3 pontos.
   - Sai pra: editar campos, confraria-transferir, sair.
   - Toca: R11, B8 (sem FAB).

10. confraria-convidar
    - Estados: lista de contatos, share.
    - Entra de: confraria-detalhe menu (só membros e admins, B7); modal F7
      passo Convide o pessoal.
    - Sai pra: share nativo; back.
    - Toca: B7 (gating), F7 (entrada), R11, B8 (sem FAB).

11. confraria-sair
    - Estados: modal de confirmação.
    - Entra de: confraria-detalhe menu.
    - Sai pra: home/confrarias após sair.
    - Toca: R11.

12. confraria-transferir
    - Estados: lista de membros admin only.
    - Entra de: confraria-config.
    - Sai pra: confirmação e back.
    - Toca: R11, B8 (sem FAB).

13. confraria-regras
    - Estados: lista de regras editáveis.
    - Entra de: confraria-detalhe menu.
    - Sai pra: back.
    - Toca: B7 (Compartilhar oculto pra não-membro no menu), R11, B8 (sem FAB).

14. confraria-welcome
    - Estados: padrão pós criação ou pós aceite de convite.
    - Entra de: wizard-confraria-6 sucesso; convite-recebido aprovado.
    - Sai pra: confraria-apresentar.
    - Toca: F7 (passo após criar), F9 (entrada novo membro), R11, R22.

15. confraria-apresentar
    - Estados: textarea.
    - Entra de: confraria-welcome.
    - Sai pra: confraria-tour-rapido; confraria-detalhe.
    - Toca: B1 (teclado), F9 (CTA Apresenta você), R11, B8 (sem FAB).

16. confraria-tour-rapido
    - Estados: tour de 3 passos.
    - Entra de: confraria-apresentar.
    - Sai pra: confraria-detalhe.
    - Toca: R11, R22.

### Módulo 12, Eventos (11 telas)

1. event-wizard-1
   - Estados: tipo do evento (Gratuito ou Pago); tema com 5 templates F5;
     correlação confraria template badge F6.
   - Entra de: confraria-detalhe CTA Criar evento; modal F7 passo Crie o
     primeiro evento; banner sticky F8.
   - Sai pra: event-wizard-2.
   - Toca: B1, B3 (Valor não obrigatório em Gratuito), F5 (5 templates), F6
     (badge sugerido), R12, B8 (sem FAB).

2. event-wizard-2
   - Estados: descrição (preenchida por template).
   - Entra de: event-wizard-1.
   - Sai pra: event-wizard-3.
   - Toca: B1, B3, F5, R12.

3. event-wizard-3
   - Estados: valor e pagamento (oculto se Gratuito).
   - Entra de: event-wizard-2.
   - Sai pra: event-wizard-4.
   - Toca: B1, B3 (valor obrigatório só se Pago), R12.

4. event-wizard-4
   - Estados: capacidade sugerida por template.
   - Entra de: event-wizard-3.
   - Sai pra: event-wizard-5.
   - Toca: B1, B3, F5, R12.

5. event-wizard-5
   - Estados: revisão. Resumo mostra Sem cobrança se Gratuito.
   - Entra de: event-wizard-4.
   - Sai pra: event-detalhe após criar.
   - Toca: B1, B3, R12.

6. event-detalhe
   - Estados: confirmado, talvez, não vou, sem RSVP; pago vs gratuito; com vs
     sem banner D-3 ou D-1 ou Dia (F12).
   - Entra de: home/confrarias aba Eventos; confraria-detalhe aba Eventos;
     event-wizard-5; push F12.
   - Sai pra: ParticiparSheet (pago), modal Cancelar gratuito (B6),
     evento-presenca, evento-pos-avaliar, evento-pos-ata.
   - Toca: B3 (esconder row Valor se Gratuito), B6 (modal fecha após
     cancelar), F12 (banner sticky), R12, B8 (sem FAB).

7. evento-editar
   - Estados: padrão (admin).
   - Entra de: event-detalhe menu.
   - Sai pra: back.
   - Toca: B1, B3 (troca Pago pra Gratuito limpa Valor), F5 (templates
     disponíveis), R12, B8 (sem FAB).

8. evento-presenca
   - Estados: aba Presença; aba Pagamentos.
   - Entra de: event-detalhe menu Inscritos e pagamentos.
   - Sai pra: back.
   - Toca: B6 (atualiza contadores pós cancelamento), R12, B8 (sem FAB).

9. evento-pos-avaliar
   - Estados: padrão.
   - Entra de: event-detalhe após finalização (V1 da Sprint 15 ou auto após
     24h, decisão Sprint 13).
   - Sai pra: back.
   - Toca: R12, B8 (sem FAB).

10. evento-pos-ata
    - Estados: padrão.
    - Entra de: event-detalhe após finalização.
    - Sai pra: back.
    - Toca: R12, B8 (sem FAB).

11. Sheets de pagamento de evento (M12 event-pagamento)
    - ParticiparSheet (público vs privado, pago vs gratuito).
    - EscolherMetodoSheet (LACI vs Combinar com admin).
    - PixLaciSheet (aguardando vs confirmado).
    - PagarForaSheet.
    - CancelarSheet (3 janelas: > 24h, 24h a 2h, < 2h).
    - Entra de: event-detalhe; b6 modal de cancelamento de gratuito não usa
      essas sheets.
    - Sai pra: ConfirmadoBanner; back; event-detalhe atualizado.
    - Toca: B3 (sem bloco de pagamento em Gratuito), B6 (3 janelas pra pago),
      R12, B8 (sem FAB).

### Módulo 13, Comunidade e Feed (5 telas)

1. home/comunidade
   - Estados: default com card sugestão de confraria e banner referral
     interleaved.
   - Entra de: bottom nav tab Comunidade; welcome-final intent skip_to_feed.
   - Sai pra: post-detail, perfil-outro, criar-post, criar-momento.
   - Toca: B4 (contador comentário em cards), B5 (autores), R13, B8 (FAB
     Criar post).

2. criar-post
   - Estados: default, texto.
   - Entra de: home/comunidade FAB; perfil-eu.
   - Sai pra: home/comunidade após publicar.
   - Toca: B1, R13, B8 (sem FAB).

3. criar-momento (Stories)
   - Estados: default.
   - Entra de: home/comunidade régua de stories.
   - Sai pra: home/comunidade.
   - Toca: B1, R13, B8 (sem FAB).

4. post-detail
   - Estados: default com comentários inline.
   - Entra de: home/comunidade tap em post.
   - Sai pra: comentarios (rota dedicada), perfil-outro autor.
   - Toca: B4 (contador), B5 (autor), R13, B8 (sem FAB).

5. comentarios
   - Estados: default.
   - Entra de: post-detail tap em Ver todos os comentários.
   - Sai pra: perfil-outro autor; back.
   - Toca: B1 (teclado no input), B4 (contador), B5 (autores), R13, B8 (sem FAB).

### Módulo 14, Perfil e Social (13 telas)

1. perfil-outro
   - Estados: loading skeleton, normal, following toggle, blocked.
   - Entra de: home/comunidade autor; confraria-detalhe Membros; sugestoes;
     resultados de busca.
   - Sai pra: perfil-seguidores, perfil-seguindo, perfil-comparar-paladar,
     chat-conversa, wine.
   - Toca: B5 (Seguir e Deixar de seguir), R14, B8 (sem FAB).

2. perfil-eu (rota dedicada)
   - Estados: padrão; gestão de seções.
   - Entra de: avatar do header (após R14 plugar); deep link.
   - Sai pra: editar-perfil, badges-galeria, pontos, jornada, chat-lista, adega,
     favoritos, lista-desejos, indicacao-landing, config-*.
   - Toca: R14 (rota canônica), R22 (acesso ao hub tutoriais via Suporte), B8
     (sem FAB).

3. editar-perfil (hub)
   - Estados: padrão.
   - Entra de: perfil-eu chip Editar.
   - Sai pra: editar-perfil-foto, editar-perfil-paladar,
     editar-perfil-privacidade.
   - Toca: R14, B8 (sem FAB).

4. editar-perfil-foto
   - Estados: padrão; modo trocar foto; trocar handle (cooldown).
   - Entra de: editar-perfil.
   - Sai pra: editar-perfil.
   - Toca: B1, R14 (cooldown 30 dias no handle), B8 (sem FAB).

5. editar-perfil-paladar
   - Estados: padrão.
   - Entra de: editar-perfil.
   - Sai pra: quiz (refazer).
   - Toca: R14.

6. editar-perfil-privacidade
   - Estados: padrão.
   - Entra de: editar-perfil; perfil-eu Configurações.
   - Sai pra: back.
   - Toca: R14 (privacy granular), B8 (sem FAB).

7. perfil-seguidores
   - Estados: default, empty.
   - Entra de: perfil-outro contador Seguidores; perfil-eu seção Atividade.
   - Sai pra: perfil-outro.
   - Toca: B5, R14, B8 (sem FAB).

8. perfil-seguindo
   - Estados: default, empty.
   - Entra de: perfil-outro contador Seguindo; perfil-eu seção Atividade.
   - Sai pra: perfil-outro.
   - Toca: B5, R14, B8 (sem FAB).

9. perfil-atividade-publica
   - Estados: default, empty.
   - Entra de: perfil-outro; perfil-eu.
   - Sai pra: post-detail.
   - Toca: B4 (contador em cards), R14, B8 (sem FAB).

10. perfil-vinhos-provados
    - Estados: default, empty.
    - Entra de: perfil-outro; perfil-eu.
    - Sai pra: wine.
    - Toca: R14, B8 (sem FAB).

11. perfil-sugestoes
    - Estados: default.
    - Entra de: perfil-eu; home/comunidade card sugestão.
    - Sai pra: perfil-outro.
    - Toca: B5, R14, B8 (sem FAB).

12. perfil-comparar-paladar
    - Estados: default.
    - Entra de: perfil-outro CTA Comparar.
    - Sai pra: back.
    - Toca: R14, B8 (sem FAB).

13. badges-galeria
    - Estados: default, com badges, sem badges.
    - Entra de: perfil-eu chip Conquistas; perfil-outro.
    - Sai pra: back.
    - Toca: R14 (depende de F4 reativar pra ter badges reais), B8 (sem FAB).

### Módulo 15, Expert (6 telas)

1. expert-virar
   - Estados: padrão (requisitos N/5).
   - Entra de: perfil-eu seção Aprender; perfil-outro de expert.
   - Sai pra: expert-aplicar.
   - Toca: R15, B8 (sem FAB).

2. expert-aplicar
   - Estados: form.
   - Entra de: expert-virar.
   - Sai pra: expert-pendente.
   - Toca: B1, R15, B8 (sem FAB).

3. expert-pendente
   - Estados: padrão.
   - Entra de: expert-aplicar enviar.
   - Sai pra: voltar.
   - Toca: R15, B8 (sem FAB).

4. expert-q-a (inbox do expert)
   - Estados: pendentes, respondidas.
   - Entra de: perfil-eu Q&A; push de nova pergunta.
   - Sai pra: expert-responder.
   - Toca: R15, B8 (sem FAB).

5. expert-responder
   - Estados: composer.
   - Entra de: expert-q-a.
   - Sai pra: back.
   - Toca: B1, R15, B8 (sem FAB).

6. perguntar-expert
   - Estados: composer.
   - Entra de: comparar-vinhos CTA Perguntar pra um expert; wine; perfil de
     expert.
   - Sai pra: back.
   - Toca: B1, R15, B8 (sem FAB).

### Módulo 16, Indicação e Convites (5 telas)

1. indicacao-landing
   - Estados: padrão com stats.
   - Entra de: feed banner referral; perfil-eu seção Convites.
   - Sai pra: indicacao-compartilhar; indicacao-meus-convites;
     indicacao-recompensas.
   - Toca: R16, B8 (sem FAB).

2. indicacao-compartilhar
   - Estados: padrão com link e canais.
   - Entra de: indicacao-landing; F7 modal pós criação confraria passo
     Compartilhe nas redes.
   - Sai pra: share nativo; back.
   - Toca: F7 (entrada opcional), R16, B8 (sem FAB).

3. indicacao-meus-convites
   - Estados: lista com status.
   - Entra de: indicacao-landing.
   - Sai pra: back.
   - Toca: R16, B8 (sem FAB).

4. indicacao-recompensas
   - Estados: créditos.
   - Entra de: indicacao-landing.
   - Sai pra: marketplace (usar crédito); back.
   - Toca: R16, B8 (sem FAB).

5. convite-recebido
   - Estados: padrão.
   - Entra de: deep link com ref.
   - Sai pra: cadastro com ref atrelado.
   - Toca: R16, B8 (sem FAB).

### Módulo 17, Chat e DMs (2 telas)

1. chat-lista
   - Estados: tabs Todas, Pessoas, Grupos, Não lidas.
   - Entra de: bottom nav (se houver); perfil-eu seção Atividade.
   - Sai pra: chat-conversa.
   - Toca: R17, B8 (FAB Nova conversa).

2. chat-conversa
   - Estados: padrão.
   - Entra de: chat-lista; perfil-outro CTA Mensagem.
   - Sai pra: perfil-outro do interlocutor; back.
   - Toca: B1 (teclado no composer), R17, B8 (sem FAB).

### Módulo 18, Notificações e Engajamento (10 telas)

1. notificacoes
   - Estados: padrão com agrupamento.
   - Entra de: header sino; deep link.
   - Sai pra: cada notificação leva pro destino próprio.
   - Toca: B6 (notificar lista de espera), F8 (push D+3 registrado), F11 (push
     Cutuca registrado), F12 (3 pushes de evento registrados), P1 P2 P3 (copy
     ajustada), R18, B8 (sem FAB).

2. push-primer
   - Estados: padrão.
   - Entra de: pós onboarding.
   - Sai pra: dialog nativo; push-canais ou push-negado.
   - Toca: R18, B8 (sem FAB).

3. push-negado
   - Estados: padrão.
   - Entra de: usuário recusou no dialog.
   - Sai pra: back.
   - Toca: R18, B8 (sem FAB).

4. push-canais
   - Estados: padrão.
   - Entra de: push-primer aceito; config-notif.
   - Sai pra: back.
   - Toca: R18, B8 (sem FAB).

5. push-preview
   - Estados: cada push novo preview pra QA.
   - Entra de: tools internos.
   - Sai pra: back.
   - Toca: F8, F11, F12 (todos os novos pushes têm preview), R18, B8 (sem FAB).

6-9. nudge-d1, nudge-d3, nudge-d7, nudge-d14
   - Estados: cada um com copy próprio.
   - Entra de: scheduler server side.
   - Sai pra: tela target (home, registro, etc).
   - Toca: P1, P2, P3 (copy ajustada cross), R18.

10. plus-one
    - Estados: default, link.
    - Entra de: convite plus-one (M12 § 12.0.6).
    - Sai pra: cadastro convidado.
    - Toca: R18 (decisão Gabriel: retirada plus-one viral, validar copy).

### Módulo 19, Jornada, Pontos e Desafios (5 telas)

1. jornada
   - Estados: marcos do usuário.
   - Entra de: perfil-eu chip Jornada; profile drawer Atividade.
   - Sai pra: jornada-celebrar; desafio-detalhe; pontos.
   - Toca: R19, B8 (sem FAB).

2. pontos
   - Estados: 4 abas Resgatar, Ganhar, Extrato, Como funcionam.
   - Entra de: perfil-eu chip Pontos; welcome-final pílula sutil.
   - Sai pra: catálogo de resgate; marketplace.
   - Toca: R19 (4 abas com tabela mestra completa), B8 (sem FAB).

3. jornada-celebrar
   - Estados: marco, desafio, nivel, streak, resgate.
   - Entra de: gatilhos server side.
   - Sai pra: back.
   - Toca: R19, B8 (sem FAB).

4. desafio-detalhe
   - Estados: ativo, cumprido, encerrado (3 estados x 8 templates).
   - Entra de: jornada; notificacoes.
   - Sai pra: back.
   - Toca: R19, B8 (sem FAB).

5. badges (alias de badges-galeria, M14)
   - Estados: ver M14.
   - Toca: ver M14.

### Módulo 20, Config e Suporte (8 telas)

1. config-notif
   - Estados: padrão.
   - Entra de: perfil-eu seção Configurações.
   - Sai pra: back.
   - Toca: R20, B8 (sem FAB).

2. config-privacidade
   - Estados: padrão com 4 toggles granulares cross M07 e M17.
   - Entra de: perfil-eu seção Configurações.
   - Sai pra: back.
   - Toca: R20 (plugar privacy granular com 4 toggles), B8 (sem FAB).

3. config-conta
   - Estados: padrão com linha Vincular Google.
   - Entra de: perfil-eu seção Configurações; editar-perfil.
   - Sai pra: conta-desativada, conta-excluida.
   - Toca: B1 (teclado em campos), A4 (Vincular Google), R20, B8 (sem FAB).

4. conta-desativada
   - Estados: padrão.
   - Entra de: config-conta.
   - Sai pra: back.
   - Toca: R20.

5. conta-excluida
   - Estados: padrão com soft delete 30 dias.
   - Entra de: config-conta; perfil-eu link Excluir conta.
   - Sai pra: welcome.
   - Toca: R20.

6. config-bloqueados
   - Estados: lista, empty.
   - Entra de: perfil-eu seção Configurações.
   - Sai pra: back.
   - Toca: R20, B8 (sem FAB).

7. suporte-faq
   - Estados: lista de perguntas.
   - Entra de: perfil-eu seção Suporte.
   - Sai pra: detalhe da pergunta; suporte-contato.
   - Toca: R20, B8 (sem FAB).

8. suporte-contato
   - Estados: form.
   - Entra de: suporte-faq; perfil-eu seção Suporte.
   - Sai pra: back.
   - Toca: B1 (teclado no textarea), R20, B8 (sem FAB).

### Módulo 21, Estados de sistema (6 telas)

1. erro-404
   - Estados: padrão.
   - Entra de: rota inválida.
   - Sai pra: home; busca.
   - Toca: R21, B8 (sem FAB).

2. erro-permissao
   - Estados: padrão.
   - Entra de: tentativa de acesso a recurso restrito (ex.: confraria privada).
   - Sai pra: pedir entrar; mandar mensagem; outras confrarias.
   - Toca: R21, B8 (sem FAB).

3. erro-sessao
   - Estados: atualizacao, seguranca, inatividade.
   - Entra de: gatilho server side raro (F2).
   - Sai pra: login (Entrar de novo); recuperar-email.
   - Toca: F2 (3 reasons), R21, B8 (sem FAB).

4. vinho-indisponivel
   - Estados: padrão com vinhos similares.
   - Entra de: tentativa de abrir vinho removido.
   - Sai pra: similares; back.
   - Toca: R21, B8 (sem FAB).

5. erro-servidor
   - Estados: padrão.
   - Entra de: falha 500.
   - Sai pra: tentar de novo; voltar pro início.
   - Toca: R21, B8 (sem FAB).

6. toast (overlay transversal)
   - Estados: success, info, warning, error; empilhamento até 3.
   - Entra de: qualquer ação que dispara feedback.
   - Sai pra: dismiss automático em 3s.
   - Toca: R21 (empilhamento).

## 8. Critérios gerais de aceite da Sprint 14

1. Todos os bugs B1 a B8 fechados e sem regressão.
2. Todas as alterações A1 a A5 documentadas e em produção.
3. Todas as features F1 a F12 com regras definidas e em desenvolvimento ou
   prontas, dependendo de prazo.
4. Nenhum item da Sprint vaza pra Sprint 15 sem justificativa documentada na war
   room.
5. Pushes P1 a P3 com copy ajustada e disparo confirmado.
6. Análise de regressão de todas as áreas tocadas pelos itens da Sprint.

## 9. Testes regressivos obrigatórios

Áreas a cobrir após qualquer mudança nesta Sprint:

1. Autenticação completa: cadastro novo, cadastro Google, cadastro Apple, login
   com senha, login Google, login Apple, recuperar senha, vincular Google a
   conta com senha (A4).
2. Onboarding completo: 3 slides pre auth, quiz nivel, quiz interesses, tela
   intenção, gps primer, welcome final.
3. Confrarias: criar do zero (wizard 6 passos), entrar como membro,
   sair, transferir, convidar, modal pós criação (F7), banner D+3 (F8).
4. Eventos: criar (wizard 5 passos), com template (F5 e F6), gratuito (B3),
   pago, cancelar gratuito (B6), cancelar pago (M12), check in, finalizar.
5. Feed: criar post, comentar, excluir comentário (B4), curtir, deixar de
   seguir (B5), compartilhar (B7).
6. Adega: adicionar à estante, registrar consumo, ver diário, ver paladar.
7. Marketplace: listar vinhos sem botão Comprar (B2), match score (A3 quando
   F1 estiver pronto), thumbnails randômicas.
8. Pagamento de evento (M12): PIX via LACI, combinar fora, cancelar com
   3 janelas.
9. Push notifications: P1, P2, P3, F8, F11, F12.
10. iOS específico: teclado fecha em todos os forms (B1).

## 10. Riscos e dependências

Risco 1: F1 (importação de banco de vinhos) atrasa.
Mitigação: A3 (match) e A1 (bloco Pra você do Descobrir) ficam com dataset
limitado. Acionar contingência.

Risco 2: B1 (teclado iOS) sem repro confiável.
Mitigação: pareamento Otavio com QA pra reproduzir em sessão dedicada antes de
implementar a correção.

Risco 3: B5 (deixar de seguir) sem repro.
Mitigação: instrumentar com logs antes de tentar corrigir. Considerar feature
flag pra desabilitar cache de seguidos se causa for cache.

Risco 4: F5 e F6 (templates e correlação) entram tarde na Sprint.
Mitigação: já fica desenhado neste doc, dev usa este doc como spec única, não
espera figma adicional.

Risco 5: F1 atrasa e libera A1 só na Sprint 15.
Mitigação: A1 (Descobri) pode ir pra produção com bloco Pra você desabilitado
sem quebrar a tela.

## 11. Definition of Done por item

Cada item da Sprint só é considerado done quando atender:

1. Implementado no app e na infra correspondente.
2. Coberto por testes manuais documentados.
3. Coberto por regressão das áreas adjacentes (seção 9).
4. Aprovado por QA com print da regra atendida.
5. Documentado nesta planilha ou nos módulos da super doc correspondentes.
6. Push pra branch principal e merge na branch de release 1.7.0.
7. Validado em ambiente de staging antes da promoção pra produção.

## 12. Encadeamento com Sprint 15 e Sprint 16

Itens que naturalmente caem na Sprint 15 caso falte tempo nesta Sprint:
1. Opção pro admin finalizar evento manualmente (regra de quando aparece) vai
   pra Sprint 15 (`docs/spec/sprint-15.md`).
2. Evento mais próximo em destaque no feed da confraria, conflito com F10 a
   resolver, vai pra Sprint 15.
3. Botão de confirmação destacada no detalhe do evento pra quem não confirmou
   ainda + pop pop de sucesso vai pra Sprint 15.
4. Badges em cards de confrarias (definição de quando mostrar cada um) vai pra
   Sprint 15.
5. Reativação ou descarte definitivo do épico de Pontos (F4 do doc de gaps) vai
   pra Sprint 16.

## 13. Referências cruzadas com a super doc

1. M01 Auth: B1 (teclado iOS), A4 (vincular Google).
2. M02 Onboarding: F4 (3 slides MKT).
3. M04 Descobrir e Marketplace: A1 (Descobri), A3 (match), B2 (botão Comprar),
   F1 (importação de vinhos).
4. M07 Adega e Diário: A2 (label Adega), B8 (FAB em adega).
5. M11 Confrarias: B7 (compartilhar não membro), F7 (modal pós criação),
   F8 (push D+3), F9 (onboarding novo membro), F10 (feed com contadores),
   F11 (cutuca organizador).
6. M12 Eventos: B3 (valor obrigatório gratuito), B6 (modal cancelar gratuito),
   F5 (templates de evento), F6 (correlação confraria template), F12 (push
   D-3 D-1 dia).
7. M13 Comunidade: B4 (contador de comentário).
8. M14 Perfil: B5 (deixar de seguir).
9. M18 Notificações: P1 P2 P3 (copy), F8 F11 F12 (novos pushes).
10. M19 Jornada e Pontos: nenhum item da Sprint 14 (decisão F4 cai pra Sprint 16).
11. M21 Estados: F2 (token Keycloak e erro sessao).

## 14. Protótipo navegável de apoio

Foi gerado um hub de navegação visual da Sprint 14 acessível em
`?screen=sprint14-hub`. O hub lista todos os 28 itens deste documento com:
1. Status atual (Iniciado, Pausado, Não iniciado, Em produção).
2. Tipo (Bug, Alteração, Feature, Push).
3. Responsável.
4. Tap em cada card abre uma rota detalhada com:
   a. Sintoma ou definição.
   b. UX correta.
   c. Critérios de aceite.
   d. Print de referência quando aplicável.

Rotas registradas:
1. `sprint14-hub` (listagem completa).
2. `sprint14-bug-{1 a 8}`.
3. `sprint14-alteracao-{1 a 5}`.
4. `sprint14-feature-{1 a 12}`.

A captura desses estados vive em `docs/spec/shots/sprint14-*`.

## 15. Itens fora do escopo desta Sprint mas mencionados no PDF

1. Considerar evento finalizado após 24h da data e hora: já entregue na Sprint
   13, em produção 1.6.6.
2. Botão "Criar evento" virar "Crie o primeiro evento" quando confraria está
   sem eventos: já entregue na Sprint 13, em produção 1.6.6.
3. Listar todos os confirmados com avatar dos 5 primeiros no detalhe do evento:
   já entregue na Sprint 13, em produção 1.6.6.
4. Compartilhar publicação Instagram e Facebook direcionando pro app: limitação
   do Instagram (apenas manual), Facebook funcional. Documentar limitação.

## 16. Encadeamento histórico de versões

1. 1.6.1: release com os 8 bugs listados em B1 a B8.
2. 1.6.2: corrigiu B parcial mais 2 melhorias da Sprint 12 (B2 LACI vinculado
   etc).
3. 1.6.3: Sprint 13 fechou (push de 4h, 3º dia, 7º dia, token Keycloak,
   onboarding novo, conciliação LACI).
4. 1.6.6: release de produção atual.
5. 1.7.0: alvo desta Sprint.
