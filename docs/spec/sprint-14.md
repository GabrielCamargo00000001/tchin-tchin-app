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

Bugs urgentes herdados: 8 itens.
Alterações de UX e label herdadas: 5 itens.
Features novas e itens do backlog que ganham definição nesta Sprint: 12 itens.
Pushes em produção desde Sprint 13 que precisam de revisão de copy: 3 itens.

Total de 28 itens organizados em 6 blocos sequenciais.

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
3. Adicionar uma faixa informativa no rodapé do card: "Em breve: compra direta
   pelo app".

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

## 5. Bloco de alterações de UX e label

### A1. Tela Descobri (nova feature)

Responsável: Guilherme.
Origem: backlog Sprint 13, marcado "Falta definir funcionalidade das telas e figma".
Status: indefinido nesta Sprint, vira definição agora.

Definição: a tela Descobri é o hub editorial e algorítmico do app, que substitui
a antiga home/descobrir como ponto de entrada da aba esquerda. A arquitetura está
documentada em M04 § 4.0.

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

### A2. Label "Adega" continua "Adega de vinhos" e não "Estoque"

Origem: backlog Sprint 13, item entregue por Gustavo na Sprint 13 com label
"Estoque".

Decisão Gabriel revisão jun 2026: reverter pra "Adega". O termo Adega é parte da
identidade da marca e da experiência prometida ao usuário ("guarde sua adega
pessoal"). Estoque é jargão de comerciante e quebra a poesia.

Correção:
1. Reverter label "Estoque" pra "Adega" em todos os pontos onde foi trocado na
   Sprint 13.
2. Na sub aba interna (M07 § 7.0.1), usar "Estante" pra slot físico, "Diário"
   pra histórico, "Favoritos" pra referência, "Wishlist" pra intent de compra.
3. Banner "Onde fica o quê" (M07 § 7.0) reforça a taxonomia.

Pontos a corrigir:
1. Bottom nav: tab "Adega" (não "Estoque").
2. Header da tela: "Minha Adega".
3. ProfileDrawer e perfil-eu: linha "Meu diário (N)" e "Adega" (não Estoque).
4. Push 4h pós cadastro: copy continua "vinho" mas o destino é "Adega".

Aceite:
1. Nenhuma string visível ao usuário usa Estoque.
2. Telas internas usam Estante, Diário, Favoritos, Wishlist como taxonomia
   canônica (M07 § 7.0.1).

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

### F3. Reverter label Estoque para Adega

Fechado em A2.

### F4. Onboarding inicial com imagens guias antes de logar

Responsável: Bruno.
Origem: Sprint 13, em produção 1.6.6.
Status: entregue, documentar pra ter referência.

Sequência atual (M01 e M02):
1. Splash com logo Tchin Tchin.
2. Onboarding pre auth com 3 slides editoriais: identidade da marca, dor 1
   (incerteza de compra), dor 3 (memória fragmentada).
3. Welcome com SSO Apple e Google (M01).
4. Pós login: quiz nivel, quiz interesses, tela intenção, gps primer,
   welcome final (M02).

Ajuste fino nesta Sprint:
1. O MKT enviou outro layout pros 3 slides. Aplicar o novo layout sem mudar a
   estrutura.
2. Adicionar transição suave entre slides (slide horizontal, sem fade).
3. Indicadores de dots fixos abaixo dos slides.
4. Botão "Avançar" no rodapé do slide 1 e 2, "Começar" no slide 3.
5. Botão "Pular" no canto superior direito de todos os slides.

Aceite:
1. Primeiro abrir: vê os 3 slides com layout novo.
2. Pular: vai direto pro welcome.
3. Completar: vai direto pro welcome.
4. Reinstall: vê os slides de novo.
5. Login subsequente do mesmo dispositivo: pula os slides.

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

### F8. Push lembrete D+3 sem evento criado

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta figma e local para mostrar a mensagem".
Status: definição feita aqui.

Gatilho: 3 dias após a criação da confraria, se nenhum evento foi criado.

Notificação push:
1. Título: "Sua confraria está esperando".
2. Corpo: "Marca o primeiro encontro de {nome da confraria} pra começar bem".
3. Disparo: 10h da manhã do D+3.
4. Quiet hours: respeita 22h às 8h da timezone do usuário.
5. Cap: dispara 1 vez. Se o usuário ignorar, dispara outro em D+7 e D+14 (cross
   M18 nudges).

Local in app pra reforçar:
1. Banner sticky no topo do detalhe da confraria, visível apenas pro admin:
   "Sua confraria não tem evento ainda. {Crie o primeiro evento}".
2. CTA do banner leva pro event-wizard com template sugerido (F6).
3. Banner some quando o primeiro evento é criado.

Aceite:
1. Criar confraria, esperar 3 dias sem evento: push dispara às 10h.
2. Criar evento antes do D+3: push não dispara.
3. Admin vê banner sticky no detalhe da confraria.
4. Não admin não vê banner.

### F9. Onboarding novo membro em confraria

Responsável: indefinido nesta Sprint, alocar.
Origem: backlog "Falta figma e definir o que conversa ativa".
Status: definição feita aqui.

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

### F11. Cutuca o organizador

Responsável: Otavio (mover lógica pra ele dado que cuida do bloco de pushes).
Origem: backlog "Falta figma e definir o período de inatividade".
Status: definição feita aqui.

Gatilho de inatividade da confraria:
1. 14 dias sem nenhuma publicação no feed da confraria.
2. 21 dias sem nenhum evento marcado.
3. Apenas uma das duas condições basta pra disparar.

Comportamento:
1. Card no feed da confraria, visível pra qualquer membro: "Tá quieto por aqui.
   {Cutuca os admins}".
2. CTA "Cutuca os admins" dispara push pros admins.
3. Cooldown de cutucada: 7 dias entre tentativas, pra evitar spam.

Push pra admins:
1. Título: "Cutucada da confraria".
2. Corpo: "{nome do usuário} sente falta de movimento em {nome da confraria}.
   Que tal um evento?".
3. Quiet hours: 22h às 8h.
4. Cap: 1 push por cutucada. Cooldown de 7 dias pra mesma confraria.

Aceite:
1. Confraria sem publicação há 15 dias: card aparece pra qualquer membro.
2. Membro cutuca: push chega pros admins.
3. Após cutucada, 7 dias sem nova cutucada possível.
4. Após nova publicação ou evento criado: card some.

### F12. Push de evento D-3, D-1, e dia

Responsável: Otavio.
Origem: backlog.
Status: definição feita aqui.

Cadência de push pré evento:

Push D-3 às 19h da timezone do usuário:
1. Título: "Daqui a 3 dias".
2. Corpo: "{nome do evento} é em 3 dias. {Você está confirmado | Falta confirmar
   sua presença}".
3. Destino do tap: event-detalhe.

Push D-1 às 19h:
1. Título: "Amanhã: {nome do evento}".
2. Corpo: "{Você está confirmado, te vemos lá | Falta confirmar pra garantir
   sua vaga}".
3. Destino do tap: event-detalhe.

Push do dia às 9h:
1. Título: "Hoje às {hora}".
2. Corpo: "{nome do evento} em {local resumido}. {Vamos lá | Confirma sua
   presença até as 12h}".
3. Destino do tap: event-detalhe.

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

## 7. Bloco de pushes em produção (revisão de copy)

Os 3 pushes abaixo foram entregues na Sprint 13 e estão ativos em 1.6.6. Nesta
Sprint, ajustar a copy pra acompanhar o tom atualizado.

### P1. Push 4h após cadastro sem registrar vinho

Status: ativo.
Copy atual: "Pronto pra registrar seu primeiro vinho? Vai levar 1 minuto".
Copy ajustada: "Vamos começar sua adega? Registra o primeiro vinho em 1 minuto".

Ajuste necessário: tom mais convidativo, foco na ação concreta.

Comportamento: dispara 4h após criação da conta se o usuário não tiver feito
nenhum registro no diário. Não dispara de novo.

Quiet hours: respeita 22h às 8h. Se as 4h caem em quiet, posterga pras 9h.

### P2. Push do 3º dia 9h da manhã sobre quiz paladar

Status: ativo.
Copy atual: "Já experimentou ver os vinhos que combinam com seu paladar?".
Copy ajustada: "Calibrou seu paladar? Em 2 minutos a gente descobre".

Comportamento: dispara no 3º dia após cadastro às 9h da manhã, apenas se o
usuário não tiver feito o quiz de paladar (M03). Não dispara de novo.

### P3. Push do 7º dia às 18h sentiu sua falta

Status: ativo.
Copy atual: "[Nome do usuário], a gente sentiu sua falta. Vem ver as confrarias
da sua região".
Copy ajustada: "{Nome}, sentimos sua falta. Tem confraria nova na sua região".

Comportamento: dispara no 7º dia após cadastro às 18h, apenas se o usuário não
abriu o app nos últimos 3 dias. Não dispara de novo.

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
