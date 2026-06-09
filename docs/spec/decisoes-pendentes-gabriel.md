# Decisoes pendentes que precisam de aprovacao do Gabriel

Este documento consolida todas as decisoes em aberto espalhadas pela super doc,
pelo plano da Sprint 14 e pelos planos das Sprints 15 e 16. Cada decisao tem
contexto, opcoes encontradas pelo trabalho ate aqui, recomendacao (quando ja
faz sentido), origem (referencia ao item) e impacto se nao for decidida.

Use este doc como checklist unico em sessao dedicada com o time. Marque cada
decisao como Aprovado, Ajustar ou Rejeitado.

Total de 33 decisoes pendentes organizadas em 5 blocos por urgencia.

---

## Bloco 1, Decisoes criticas que bloqueiam Sprint 14

### D1, Credenciais Meta Business Manager pra F13

Contexto: F13 (Meta SDK Instagram, Facebook e tracking) precisa de cadastro da
Tchin Tchin como aplicativo no Meta Developers App Dashboard, com permissoes
por ambiente Dev, Stage e Prod.
Decisao necessaria:
1. Confirmar que o Meta Business Manager Tchin Tchin esta ativo.
2. Listar quem tem acesso de Admin pra criar o app.
3. Aprovar abrir App Review da Meta no dia 1 da Sprint pra permissoes
   avancadas (instagram_graph_user_media, ads_management).
Origem: sprint-14.md F13 Dependencias tecnicas.
Impacto se nao decidir: F13 nao consegue avancar alem da estrutura, fica em
implementacao parcial.

RESPOSTA GABRIEL (06/2026): APROVADO. Credenciais Meta sao acessadas pelo email
do marketing, que auto direciona pra conta do Facebook. O time de marketing ja
tem acesso. Otavio coordena com MKT pra liberar acesso de dev e iniciar App
Review no dia 1 da Sprint 14.

### D2, Reativar epico de Pontos ou descartar definitivamente

Contexto: a maior parte do epico foi adiada pelo time de produto (US-082, 083,
091 a 096). O prototipo entregou a UX completa em 4 abas (Resgatar, Ganhar,
Extrato, Como funcionam) com tabela mestra de 24 linhas.
Decisao necessaria:
1. Opcao A: reativar tudo (badges, niveis, resgate, anti-farming).
2. Opcao B: manter adiado e remover sistema de niveis e badges
   definitivamente.
3. Opcao C: reativar parcialmente apenas Pontos com resgate, sem niveis nem
   badges.
Origem: sprint-15.md R6, sprint-16.md Bloco A, 99-gaps-produto.md F4.
Impacto se nao decidir: gamificacao, retencao, badges (F3 e R14) e resgate de
Marketplace de Experiencia (Bloco B da Sprint 16) ficam cosmeticos.
Recomendacao: Opcao A com priorizacao por valor de retencao.

RESPOSTA GABRIEL (06/2026): Epico de Pontos fica PAUSADO e fora da Sprint 14.
Entra na Sprint 16 ou 17. Sprint 15 R6 fica como entrada explicita na Sprint
16/17. Refatoracao visual da R19 nas telas /jornada, /pontos, /jornada-celebrar,
/desafio-detalhe e /badges entra normalmente na Sprint 14, sem backend novo.
Toda referencia a pontuacao em outras features (F4, F8, F11, F12, R19, R22)
fica como placeholder ate Sprint 16/17.

### D3, Rota tecnica interna do novo Descobri

Contexto: A1 substituiu a tela marketplace pelo hub Descobri. A rota no
roteador atual ainda se chama marketplace.
Decisao necessaria:
1. Manter rota interna como marketplace pra evitar mudancas em deep links e
   trackeamento existente.
2. Renomear pra descobri pra refletir o novo papel.
Origem: sprint-14.md A1 Telas afetadas em ordem.
Impacto se nao decidir: dev fica esperando definicao no PR.
Recomendacao: manter marketplace internamente e usar descobri so como nome de
UX.

RESPOSTA GABRIEL (06/2026): O Marketplace fica DENTRO do Descobri, com o nome
Marketplace. Ou seja: a tela Descobri e o hub principal que contem o
Marketplace como bloco interno. Rota tecnica do bloco Marketplace permanece
marketplace. A rota nova Descobri agrega Marketplace como uma das suas
secoes. Deep links existentes seguem funcionais.

### D4, Reverter aba Estoque pra Adega no confraria-detalhe

Contexto: Sprint 13 trocou o rotulo da quarta sub aba do confraria-detalhe de
Adega pra Estoque. Decisao de Sprint 14 reverte.
Decisao necessaria:
1. Confirmar que o rotulo correto e Adega (sem Coletiva, sem Acervo, sem
   outras variantes).
2. Confirmar que o conteudo do AdegaConfTab permanece igual.
Origem: sprint-14.md A2 e F3.
Impacto se nao decidir: Sprint nao fecha o item.
Recomendacao: confirmar Adega.

RESPOSTA GABRIEL (06/2026): MANTER Estoque na sub aba da confraria. NAO
reverter. O label da Sprint 13 fica como ficou. A2 e F3 sao retirados da
Sprint 14. O conteudo do AdegaConfTab e o componente seguem inalterados, so
o rotulo "Estoque" permanece. Adega como conceito da marca segue valido pra
Adega individual do usuario (M07), mas dentro do contexto da confraria, o
acervo coletivo se chama Estoque.

### D5, Layout final dos 3 slides do onboarding pre auth do MKT

Contexto: o MKT mandou um novo layout pros 3 slides do onboarding pre auth.
Decisao necessaria:
1. Aprovar o layout do MKT final (formatos, copy, imagens).
2. Confirmar a copy de cada slide (identidade, dor 1, dor 3).
3. Aprovar transicao horizontal sem fade.
Origem: sprint-14.md F4 e R1.
Impacto se nao decidir: Sprint 14 nao fecha onboarding.

RESPOSTA GABRIEL (06/2026): aguardando. Bruno reenvia hoje (06/2026) os 3
slides em alta resolucao pro Gabriel aprovar individualmente. Copy proposta
nos slides 1 a 3 esta listada abaixo no bloco de copys pra validar.

APROVACAO FINAL GABRIEL (06/2026): APROVADO CONFORME PROPOSTO. Os 3 slides
ficam exatamente como propostos:

Slide 1, Identidade da marca:
  Imagem: hero burgundy com tacas clinking.
  Headline: "O app de vinho que entende seu paladar."
  Body: "Descubra, registre, compartilhe. Sua jornada com vinho comeca aqui."
  CTA: "Avancar". Skip topo direito: "Pular".

Slide 2, Dor 1 Incerteza de compra:
  Imagem: corredor de vinhos com pessoa indecisa, overlay burgundy.
  Headline: "Saiba qual vinho combina com voce antes de comprar."
  Body: "Match score baseado no seu paladar, recomendacoes curadas,
    comparativos lado a lado."
  CTA: "Avancar". Skip: "Pular".

Slide 3, Dor 3 Memoria fragmentada:
  Imagem: caderno aberto com taca e foto de rotulo.
  Headline: "Lembre de cada vinho que provou."
  Body: "Adega, diario e relatorio mensal. Sua historia com vinho em um so
    lugar."
  CTA: "Comecar". Skip: "Pular".

Visual em todos os 3:
1. Background gradient burgundy/50 para burgundy/100.
2. Headline Fraunces 32px peso 600.
3. Body Inter 14px lineheight 1.5 cor n800.
4. 3 dots indicadores no rodape acima do CTA. Dot ativo burgundy/700, dots
   inativos n300.
5. Transicao horizontal swipe sem fade. Swipe pra tras permitido.

---

## Bloco 2, Decisoes de copy e UX que precisam de aprovacao

RESPOSTA GABRIEL (06/2026) PRO BLOCO INTEIRO: APROVADO CONFORME PROPOSTO em
D6 a D13. Todas as copys e definicoes ficam exatamente como redigidas neste
documento, sem ajustes. Implementacao direta na Sprint 14.

### D6, Copy dos pushes P1, P2, P3 ajustada

Contexto: copy ajustada pra acompanhar tom atualizado.
Decisao necessaria, aprovar texto:
1. P1 push 4h, copy proposta: "Vamos comecar sua adega? Registra o primeiro
   vinho em 1 minuto."
2. P2 push 3o dia 9h, copy proposta: "Calibrou seu paladar? Em 2 minutos a
   gente descobre."
3. P3 push 7o dia 18h, copy proposta: "{Nome}, sentimos sua falta. Tem
   confraria nova na sua regiao."
Origem: sprint-14.md P1, P2, P3.
Impacto se nao decidir: continua copy atual em producao.

### D7, Copy do push F8 sem evento criado D+3

Contexto: push lembrete 3 dias apos criacao da confraria sem evento.
Decisao necessaria, aprovar texto:
1. Titulo proposto: "Sua confraria esta esperando."
2. Corpo proposto: "Marca o primeiro encontro de {nome da confraria} pra
   comecar bem."
3. Horario proposto: 10h da manha.
4. Cadencia proposta: dispara D+3, D+7, D+14 caso usuario ignore.
Origem: sprint-14.md F8.
Impacto se nao decidir: F8 nao entrega.

### D8, Copy do banner sticky no detalhe da confraria pro admin

Contexto: banner sticky pro admin no topo da aba Eventos do confraria-detalhe
quando confraria nao tem evento criado.
Decisao necessaria, aprovar texto:
1. Mensagem proposta: "Sua confraria nao tem evento ainda. Crie o primeiro
   evento."
2. CTA proposto: "Crie o primeiro evento" que leva pro event-wizard com
   template sugerido por F6.
Origem: sprint-14.md F8.

### D9, Copy do push do card Cutuca o organizador F11

Contexto: push pros admins quando membro cutuca.
Decisao necessaria, aprovar texto:
1. Titulo proposto: "Cutucada da confraria."
2. Corpo proposto: "{nome do usuario} sente falta de movimento em {nome da
   confraria}. Que tal um evento?"
3. Texto do card no feed da confraria: "Ta quieto por aqui. Cutuca os
   admins."
Origem: sprint-14.md F11.

### D10, Copy dos pushes D-3, D-1 e dia do evento F12

Contexto: cadencia de push pre evento.
Decisao necessaria, aprovar 3 textos:
1. D-3 as 19h, titulo "Daqui a 3 dias", corpo "{nome do evento} e em 3 dias.
   {Voce esta confirmado ou Falta confirmar sua presenca}."
2. D-1 as 19h, titulo "Amanha: {nome do evento}", corpo "{Voce esta
   confirmado, te vemos la ou Falta confirmar pra garantir sua vaga}."
3. Dia as 9h, titulo "Hoje as {hora}", corpo "{nome do evento} em {local
   resumido}. {Vamos la ou Confirma sua presenca ate as 12h}."
Origem: sprint-14.md F12.

### D11, Definicao de Conversa ativa no onboarding de novo membro F9

Contexto: F9 onboarding novo membro mostra 3 highlights, um deles e Conversa
ativa.
Decisao necessaria:
1. Definicao proposta: publicacao no feed da confraria com timestamp menor
   que 7 dias.
2. Mensagem de empty: "Seja o primeiro a publicar."
Origem: sprint-14.md F9.

### D12, Mensagem de erro pro convite plus one viral

Contexto: plus one viral (US-228 e US-295) foi retirado pelo time de produto.
Decisao necessaria:
1. Confirmar que continua retirado.
2. Decidir se mantem alguma tela placeholder pra futuro ou deleta
   completamente.
Origem: sprint-14.md B6 referencia, sprint-14.md R18 plus-one.

### D13, Copy ajustada da faixa Em breve no detalhe do vinho

Contexto: B2 removeu botao Comprar do detalhe do vinho.
Decisao necessaria, aprovar texto:
1. Faixa proposta no rodape: "Em breve: compra direta pelo app."
2. Manter botoes Salvar na Wishlist, Adicionar a Estante e Ver onde encontrar.
Origem: sprint-14.md B2.

---

## Bloco 3, Decisoes de produto sobre features adiadas

RESPOSTA GABRIEL (06/2026) PRO BLOCO INTEIRO: aprovar D14 a D23 todas com
detalhamento completo. D24 e D25 ficam FORA da Sprint 14.

### D14, Nivel de conhecimento visivel no perfil

Contexto: US-050 adiada. Chip Iniciante, Intermediario, Enofilo, Expert
existe no prototipo.
Decisao necessaria:
1. Reativar e mostrar o chip no identity card do perfil.
2. Manter adiado.
Origem: sprint-14.md R14, M14 § 14.0, 99-gaps-produto.md F3.

RESPOSTA GABRIEL (06/2026): APROVADO REATIVAR. Chip visivel no identity card
do perfil-eu e do perfil-outro. 4 niveis:
1. Iniciante: usuario sem quiz de paladar concluido OU com menos de 5
   registros no diario.
2. Intermediario: quiz concluido E entre 5 e 30 registros.
3. Enofilo: entre 31 e 100 registros OU 6 meses ativos no app.
4. Expert: badge oficial Tchin Tchin pos curadoria manual (US-097 ja
   entregue).
Visual: chip burgundy abaixo do nome no identity card. Iniciante usa fundo
cinza claro, Intermediario fundo ambar suave, Enofilo fundo burgundy/100,
Expert fundo burgundy/700 com texto branco e icone verified.
Telas afetadas: perfil-eu identity card, perfil-outro identity card,
home/comunidade autores nos posts (chip pequeno ao lado do nome),
confraria-detalhe aba Membros lista (chip pequeno em cada linha).

### D15, Minha Biblioteca (posts salvos) no perfil

Contexto: US-059 adiada. M14 menciona.
Decisao necessaria:
1. Reativar como secao do perfil-eu.
2. Manter adiado.
Origem: 99-gaps-produto.md F3.

RESPOSTA GABRIEL (06/2026): APROVADO REATIVAR. Secao Minha Biblioteca dentro
do perfil-eu na area Atividade, posicionada entre Meu diario e Favoritos.
Conteudo: posts do feed marcados pelo usuario via icone de bookmark (icone
novo a ser adicionado nos cards de post). Lista cronologica reversa.
Filtros: Todos, Posts educacionais, Stories salvos, Q&A respondidas.
Limite: sem limite tecnico, paginacao de 30 em 30. Empty state com CTA "Toque
no marcador em qualquer post para guardar aqui".
Telas afetadas: perfil-eu secao Atividade ganha linha Minha Biblioteca (N).
Nova rota minha-biblioteca. Cards de post no home/comunidade ganham icone
bookmark ao lado dos icones de like e comentario.

### D16, Card educacional pos registro de vinho

Contexto: US-204 nao entregue, US-250 adiada. M07 fala mas e placeholder.
Decisao necessaria:
1. Reativar e definir taxonomia de conteudo (uva, regiao).
2. Manter adiado.
Origem: 99-gaps-produto.md F1, M07 § 7.0.

RESPOSTA GABRIEL (06/2026): APROVADO REATIVAR. Card educacional aparece na
tela registro-confirmacao logo apos salvar um vinho. Conteudo dinamico
baseado em:
1. Uva principal do vinho registrado: card mostra origem da uva, perfil
   sensorial tipico, sugestao de harmonizacao em 1 linha.
2. Regiao do vinho: card mostra caracteristicas da regiao, clima, solo, em
   2 a 3 linhas.
3. Vinificacao quando disponivel: tipo de fermentacao, barrica, tempo de
   guarda recomendado.
Layout: card branco com border burgundy/100, icone editorial na esquerda,
texto a direita, titulo "Sobre {uva} ou {regiao}", body de no maximo 150
caracteres, CTA Saber mais que leva pra aprenda-detalhe (cross M09).
Limite: 1 card por registro, prioridade Uva > Regiao > Vinificacao. Banco de
cards puxado de US-110 (100 curiosidades pro scanner) ja em execucao.
Telas afetadas: registro-confirmacao recebe o card abaixo dos pontos ganhos
e acima dos CTAs Continuar e Editar.

### D17, Janela de consumo na Adega

Contexto: US-305 adiada. M07 menciona "esse vinho esta no ponto ou passando
do ponto".
Decisao necessaria:
1. Reativar.
2. Manter adiado.
Origem: 99-gaps-produto.md F1.

RESPOSTA GABRIEL (06/2026): APROVADO REATIVAR. Janela de consumo no slot da
Estante (M07). Calculo baseado em:
1. Data de safra do vinho.
2. Tipo (tinto, branco, rose, espumante, fortificado).
3. Faixa de preco (proxy de complexidade e potencial de guarda).
4. Recomendacao de janela do produtor quando disponivel no banco.
3 estados visuais no slot:
1. Verde Beba agora: dentro da janela ideal.
2. Ambar Beba em breve: faltam 6 meses ou menos pro fim da janela.
3. Vermelho Passou do ponto: janela ja fechou.
Sem estado: dado insuficiente, slot fica neutro.
Push opcional: 1 push semanal listando ate 3 vinhos da estante que entram em
Beba em breve ou Passou do ponto. Opt out em config-notif.
Telas afetadas: home/adega aba Estante slots ganham bolinha colorida no canto
inferior direito. wine ganha secao Janela de consumo abaixo do match score.
notificacoes registra push semanal.

### D18, Tour guiado pos cadastro US-008

Contexto: tour de 4 passos da bottom nav. US-008 esta como nao entregue.
Decisao necessaria:
1. Confirmar que entra na R22 da Sprint 14.
2. Reduzir o tour caso seja muito intrusivo.
3. Tornar opcional via menu como confraria-usar fez.
Origem: sprint-14.md R22 e sprint-16.md Bloco D.

RESPOSTA GABRIEL (06/2026): APROVADO ENTRAR NA R22 DA SPRINT 14. Tour de 4
passos no welcome-final, opcional via CTA "Pular tour, ir direto" sempre
visivel no rodape. Manter os 4 passos cobrindo Comunidade, Confrarias,
Descobrir, Adega, mais 1 celebracao curta no final (tour-celebracao).
Comportamento: 1 vez automatico apos welcome-final. Quem pular pode reativar
em qualquer momento via perfil-eu secao Suporte ou hub /tutoriais. Persiste
em localStorage tc.tour.bottomnav.done.
Telas afetadas: welcome-final ganha CTA primario Comecar tour e CTA ghost
Pular tour. Cada passo do tour mostra spotlight na tab correspondente da
bottom nav e tooltip com headline mais 1 a 2 linhas de body. Hub tutoriais
lista o tour como item com status Concluido ou Pendente.

### D19, Pesos do match score de paladar

Contexto: A3 propos 50 percent paladar, 30 percent popularidade, 20 percent
editorial (M04 § 4.0.1).
Decisao necessaria:
1. Aprovar pesos default.
2. Calibrar valores diferentes.
3. Confirmar que ficam configuraveis server side via backoffice.
Origem: sprint-14.md A3.
Recomendacao: aprovar default e deixar configuracao server side.

RESPOSTA GABRIEL (06/2026): APROVADO 50/30/20 como default. Configuravel
server side via backoffice sem necessidade de deploy. Backoffice tem 3
sliders (paladar, popularidade, editorial) que somam 100 percent. Mudanca
propaga em ate 5 minutos via config cache. Histórico de calibracoes salvo
pra auditoria.
Estados visuais do score nos cards de vinho (cross A3):
1. Score abaixo de 50: nao exibe percentual, label Combina pouco.
2. Score entre 50 e 70: percentual em cinza neutro.
3. Score entre 70 e 85: percentual em burgundy.
4. Score acima de 85: percentual em burgundy negrito + chip Alto match.
Telas afetadas: wine, marketplace, home/descobrir bloco Pra voce, carta-matches,
comparar-vinhos, scanner-result-v2, porque-combina, harmoniza-resultados.

### D20, 5 templates de evento F5

Contexto: 5 templates propostos pro wizard de evento.
Decisao necessaria, aprovar cada um:
1. T1 Vinhos por pais, default Brasil.
2. T2 Degustacao as cegas.
3. T3 Comparativo de uvas.
4. T4 Tema livre social.
5. T5 Vinho e harmonizacao.
Origem: sprint-14.md F5.

RESPOSTA GABRIEL (06/2026): APROVADOS OS 5. Detalhamento final de cada:

T1 Vinhos por pais
  Tema sugerido no campo: Vinhos do {pais sugerido}
  Pais default sugerido: Brasil
  Descricao automatica: Cada participante traz uma garrafa do {pais}. Bom pra
    quem quer comecar a explorar o estilo de uma regiao especifica.
  Quantidade sugerida: 1 garrafa por pessoa
  Capacidade sugerida: 6 a 10 pessoas
  Estilos da confraria correlatos: Iniciantes, Brasil, Variedade

T2 Degustacao as cegas
  Tema sugerido: Degustacao as cegas: {uva ou regiao}
  Descricao automatica: Garrafas embrulhadas em papel kraft. Voto secreto.
    Boa pra calibrar paladar e gerar conversa.
  Quantidade sugerida: 4 a 6 garrafas, 1 por dupla
  Capacidade sugerida: 8 a 12 pessoas
  Estilos correlatos: Variedade, Velho Mundo, Avancado

T3 Comparativo de uvas
  Tema sugerido: Comparativo de {uva}: {regiao A} vs {regiao B}
  Descricao automatica: Mesma uva, regioes diferentes. Ideal pra estudo
    aprofundado e calibracao sensorial.
  Quantidade sugerida: 4 garrafas (2 por regiao)
  Capacidade sugerida: 6 a 10 pessoas
  Estilos correlatos: Velho Mundo, Estudo aprofundado

T4 Tema livre social
  Tema sugerido: Encontro descontraido
  Descricao automatica: Sem tema, social. Cada um traz o que quiser. Otimo
    pra confraternizar.
  Quantidade sugerida: 1 garrafa por pessoa
  Capacidade sugerida: livre
  Estilos correlatos: Social, Sem estilo definido

T5 Vinho e harmonizacao
  Tema sugerido: Harmonizacao: vinho mais prato
  Descricao automatica: Cada participante traz um vinho mais um prato que
    harmoniza. Conversa rica sobre combinacoes.
  Quantidade sugerida: 1 garrafa e 1 prato por pessoa
  Capacidade sugerida: 4 a 8 pessoas
  Estilos correlatos: Gastronomia, Avancado, Variedade

Telas afetadas: event-wizard-1 (passo Tema com 5 cards de template),
event-wizard-2 (Descricao preenchida pelo template selecionado),
event-wizard-4 (Capacidade sugerida pelo template), evento-editar (mesmos
templates disponiveis ao trocar de tema).

### D21, Mapa de correlacao confraria template F6

Contexto: sugere template mais coerente com estilo da confraria.
Decisao necessaria, aprovar mapa:
1. Estilo Brasil ou Iniciantes ou Mistas, sugere T1.
2. Estilo Velho Mundo ou Estudo aprofundado, sugere T3.
3. Estilo Variedade ou Ecletico, sugere T2.
4. Estilo Social, sugere T4.
5. Estilo Gastronomia, sugere T5.
6. Confraria sem estilo definido, sem sugestao.
Origem: sprint-14.md F6.

RESPOSTA GABRIEL (06/2026): APROVADO MAPA. Implementacao:
1. Ao abrir event-wizard-1 a partir do confraria-detalhe, sistema le
   confraria.estilo e busca correlacao.
2. Template correlato aparece primeiro na grid de templates com badge
   Sugerido pra esta confraria em burgundy.
3. Os outros 4 templates aparecem em ordem normal abaixo.
4. Tocar no sugerido preenche os campos imediatamente.
5. Tocar em outro mostra sheet rapida: "Trocar pelo template {nome}?" com
   botoes Trocar e Cancelar.
6. Confraria sem estilo definido: nenhum badge, grid mostra os 5 em ordem
   alfabetica.
7. Confraria com multiplos estilos: aplica regra de prioridade Brasil >
   Velho Mundo > Variedade > Gastronomia > Social.

Cobertura completa por estilo da confraria do M11 atual:
1. Brasil → T1.
2. Iniciantes → T1.
3. Mistas → T1.
4. Velho Mundo → T3.
5. Estudo aprofundado → T3.
6. Variedade → T2.
7. Ecletico → T2.
8. Social → T4.
9. Gastronomia → T5.
10. Espumantes → T4 (sem template proprio, social com bolhas funciona).
11. Brasil novo (nicho experimental) → T1.
12. Sem estilo → grid normal.

Telas afetadas: event-wizard-1 (badge Sugerido pra esta confraria),
confraria-detalhe CTA Criar evento (entrada via essa rota faz a sugestao
acontecer), wizard-confraria-6 (captura do estilo da confraria pra alimentar
a correlacao).

### D22, Thresholds dos badges em cards de confrarias V4 Sprint 15

Contexto: badges em cards de confrarias.
Decisao necessaria, aprovar thresholds:
1. Badge Em alta: 20 percent de crescimento de membros em 30 dias, minimo
   10 membros.
2. Badge Nova: criada nos ultimos 14 dias.
3. Badge Verificada: ao lado do nome quando admin verificado (cross US-117).
4. Chip Sua confraria: abaixo do nome quando o usuario e membro.
5. Regra de prioridade: Nova sobrepoe Em alta. Verificada sempre aparece ao
   lado do nome. Sua confraria sempre aparece quando aplicavel.
Origem: sprint-15.md V4.

RESPOSTA GABRIEL (06/2026): APROVADO. Detalhamento visual e calculo:

Badge Em alta:
  Calculo: (membros_atuais - membros_30d_atras) / membros_30d_atras >= 0.20
  Filtro extra: membros_atuais >= 10.
  Atualizacao: recalcula a cada 24h via cron noturno.
  Visual: canto superior direito do card, fundo ambar (T.c.a700), texto
    branco, fonte JetBrains Mono 9px, padding 3 por 8, border radius full.
    Texto: EM ALTA.

Badge Nova:
  Calculo: created_at > now - 14 dias.
  Visual: mesmo posicionamento do Em alta, fundo burgundy (T.c.p700), texto
    branco. Texto: NOVA. Sobrepoe Em alta quando ambos se aplicam.

Badge Verificada:
  Calculo: confraria.admin.business_verified === true (cross US-117).
  Visual: ao lado do nome, icone check em circulo azul (T.c.i700), 16px,
    sem texto. Sempre aparece.

Chip Sua confraria:
  Calculo: usuario eh membro da confraria.
  Visual: abaixo do nome, chip pequeno fundo cinza claro (T.c.n100), texto
    burgundy (T.c.p700), fonte Inter 11px, padding 2 por 7. Texto:
    Sua confraria.

Telas afetadas: home/confrarias cards, confraria-detalhe header (replica),
perfil-sugestoes cards, home/comunidade card de sugestao de confraria,
home/descobrir bloco 3 Confrarias da regiao (cross A1).

### D23, Thresholds de inatividade Cutuca o organizador F11

Contexto: card aparece no feed da confraria quando inativa.
Decisao necessaria, aprovar thresholds:
1. 14 dias sem publicacao OU 21 dias sem evento criado.
2. Cooldown 7 dias entre cutucadas.
3. Push pro admin com mesmo cooldown.
Origem: sprint-14.md F11.

RESPOSTA GABRIEL (06/2026): APROVADO. Detalhamento:

Triggers de aparicao do card no feed da confraria:
1. ultima_publicacao_at < now - 14 dias.
2. ultimo_evento_criado_at < now - 21 dias.
3. Basta uma das duas condicoes pra disparar.
4. Filtro extra: confraria tem 5 membros ou mais (evita cutucar confraria com
   1 ou 2 pessoas).

Cooldown de cutucada:
1. Mesmo usuario nao pode cutucar a mesma confraria por 7 dias apos cutucar.
2. Cada confraria so pode receber 1 cutucada total por janela de 7 dias
   (independente de quantos membros tentam).
3. Push pros admins respeita o mesmo cooldown global de 7 dias por confraria.

Apresentacao do card no feed:
1. Posicao: topo da aba Publicacoes da confraria, antes do feed normal.
2. Visual: card branco com border ambar (T.c.a700/1px), padding 14, icone
   bell ringer no topo esquerdo, headline serif "Ta quieto por aqui",
   subheadline regular "Que tal cutucar os admins pra marcar um evento?".
3. CTA primario: botao burgundy "Cutuca os admins".
4. Apos cutucar: card vira estado pos cutucada por 24h: "Cutucada enviada
   pros admins. Eles foram avisados.", botao desabilitado.

Push pros admins:
1. Titulo: Cutucada da confraria.
2. Corpo: "{nome do usuario} sente falta de movimento em {nome da confraria}.
   Que tal um evento?"
3. Quiet hours: 22h as 8h. Posterga se cair em quiet.
4. Tap no push: leva pro confraria-detalhe aba Eventos com banner sticky
   indicando "Membro cutucou pra marcar evento" e CTA Criar evento.

Card some quando:
1. Nova publicacao no feed da confraria.
2. Novo evento criado.

Telas afetadas: confraria-detalhe aba Publicacoes (card no topo),
confraria-detalhe aba Eventos (banner pos cutucada pro admin), notificacoes
(push registrado), push-preview (preview pra QA).

### D24, Tempo minimo pra admin finalizar evento V1 Sprint 15

Contexto: botao Finalizar evento do admin.
Decisao necessaria:
1. Habilitar apos data e hora de inicio do evento mais 2 horas.
2. Tempo diferente.
3. Confirmar default automatico de 24h apos data original.
Origem: sprint-15.md V1.

RESPOSTA GABRIEL (06/2026): FORA DA SPRINT 14. Mantem default automatico de
24h apos data e hora original (Sprint 13 ja entregue). Botao manual pra admin
nao entra nesta Sprint. Reavaliar na Sprint 15 ou posterior.

### D25, Conversao Cristais ↔ Pontos

Contexto: cross M08 e M19. Cristais do Treino podem virar beneficios na
Marketplace de Experiencia.
Decisao necessaria:
1. Aprovar taxa proposta 1 cristal = 5 pontos.
2. Calibrar valor diferente.
Origem: 99-gaps-produto.md F4.

RESPOSTA GABRIEL (06/2026): FORA DA SPRINT 14. Depende do epico de Pontos
ser reativado (D2 ficou pausado, entra Sprint 16/17). Quando D2 voltar,
reavaliar D25 junto.

---

## Bloco 4, Decisoes de stack, integracoes e infra

RESPOSTA GABRIEL (06/2026) PRO BLOCO INTEIRO: aprovar D26 a D29 todas com
detalhe completo. Entram na Sprint 14.

### D26, Tempo de App Review da Meta pra F13

Contexto: F13 precisa de revisao manual da Meta pra permissoes avancadas.
Estimativa de 5 a 10 dias uteis.
Decisao necessaria:
1. Iniciar submissao no dia 1 da Sprint 14 e absorver risco de demora.
2. Adiar pra Sprint 15 e usar a Sprint 14 pra preparar codigo e submissao.
Origem: sprint-14.md F13 Riscos.
Recomendacao: iniciar no dia 1 da Sprint 14 com plano B (permissoes basicas
ja aprovadas no caminho critico).

RESPOSTA GABRIEL (06/2026): APROVADO INICIAR NO DIA 1. Plano:
1. Dia 1: Otavio coordena com MKT, recebe acesso ao Meta Business Manager
   da Tchin, cadastra o app no Developers Dashboard.
2. Dias 2 a 4: prepara o material de App Review (videos demo, screenshots,
   politica de privacidade ajustada, casos de uso por permissao).
3. Dia 5: submete pedido de App Review pras permissoes avancadas
   (instagram_graph_user_media, ads_management).
4. Dias 6 a 14: implementacao continua com permissoes basicas que nao
   precisam de revisao (public_profile, email, instagram_basic). Frente 1
   conta usuario fica fechada antes do final da Sprint.
5. Janela de revisao Meta: paralela ao desenvolvimento, sem bloquear caminho
   critico.
6. Caso a Meta peca ajustes na revisao: Otavio aborda na propria Sprint 14.
7. Caso negue: revisar abordagem na Sprint 15.

### D27, Sincronizacao da conta Tchin no Instagram com o app

Contexto: Frente 2 do F13 permite o time editorial publicar no Instagram
oficial e replicar como card no feed do app.
Decisao necessaria:
1. Replicar todo post editorial automaticamente.
2. Manter flag opt in no admin pra escolher o que sincroniza.
3. Manual manual no admin.
Origem: sprint-14.md F13 Frente 2.
Recomendacao: opt in por post pra evitar replicar postagem de bastidor.

RESPOSTA GABRIEL (06/2026): APROVADO OPT IN POR POST. Implementacao:
1. Backoffice (admin Tchin) tem nova secao Conta Tchin no Instagram com
   listagem dos posts da conta oficial.
2. Cada post tem 1 botao Replicar pro app que abre form rapido com:
   campo Categoria (Uva da semana, Dica do dia, Curiosidade editorial,
   Confraria em alta, Outro), campo Tempo de exibicao (1 a 30 dias), campo
   Bloco de exibicao (escolhe Bloco 1 Hero do dia ou Bloco 6 Curiosidades
   do Descobri).
3. Botao Confirmar dispara a replicacao: card aparece no app no bloco
   escolhido em ate 5 minutos.
4. Tempo de exibicao expirado: card some automaticamente.
5. Edicao do post original no Instagram nao atualiza o card no app
   automaticamente (evita inconsistencias). Admin precisa replicar de novo
   se quiser refletir mudanca.
6. Replicacao envolve copy textual mais imagem principal. Carrossel pega so
   a primeira imagem.

Telas afetadas: backoffice Conta Tchin no Instagram (nova secao admin,
fora do app do usuario), home/descobrir Descobri Bloco 1 Hero do dia (card
replicado pode virar hero do dia), Bloco 6 Curiosidades editoriais (cards
replicados ocupam slots).

### D28, Conversions API Meta opt out

Contexto: F13 Frente 3 envia eventos server side pra calibrar campanhas.
Decisao necessaria:
1. Opt in por padrao com toggle off em config-privacidade.
2. Opt out por padrao com toggle on opcional.
Origem: sprint-14.md F13 Frente 3.
Recomendacao: opt in por padrao com toggle de opt out claramente visivel
(compliance LGPD).

RESPOSTA GABRIEL (06/2026): APROVADO OPT IN POR PADRAO COM TOGGLE DE OPT
OUT VISIVEL. Implementacao:
1. Default: tracking server side ativo pra todo usuario novo (opt in
   implicito).
2. Toggle em config-privacidade nova sub secao Dados de publicidade:
   "Permitir uso anonimo dos meus eventos pra calibrar campanhas". Default
   on, com texto auxiliar "Compartilhamos apenas eventos sem identificacao
   pessoal (sem nome, email ou foto) pra entender como o app funciona e
   melhorar o que mostramos pra voce. Voce pode desligar a qualquer momento."
3. Desligar o toggle interrompe o envio server side em tempo real.
4. Eventos enviados: account_created, paladar_completed, register_consumo,
   evento_rsvp_paid, scanner_used, treino_licao_done. Todos sem PII
   (apenas user_id hash sha256, timestamp, valor monetario quando aplica).
5. Pra usuarios criados antes da Sprint 14 (opt out implicito pelo principio
   privacy by default): banner sticky no topo do app na primeira abertura
   pos atualizacao pedindo consentimento expresso. Banner some apos resposta.
6. LGPD compliance: registro de consentimento em audit log, opt out
   propaga em tempo real pro server.

Telas afetadas: config-privacidade nova sub secao Dados de publicidade,
banner sticky de consentimento pra base atual, audit log no backend.

### D29, Politica e termos com mencao a Meta API

Contexto: termos e politica-privacidade precisam atualizar texto pra mencionar
uso da API Meta.
Decisao necessaria:
1. Aprovar texto novo redigido pelo legal.
2. Pedir versao revisada antes de promover pra producao.
Origem: sprint-14.md F13 Dependencias tecnicas.

RESPOSTA GABRIEL (06/2026): APROVADO ATUALIZAR. Fluxo:
1. Otavio redige draft de texto pra inserir em politica-privacidade e
   termos, focando em 3 secoes novas:
   a. Vinculo opcional com contas Meta (Instagram e Facebook): que dados
      coletamos quando o usuario vincula, como usamos, como desvincula.
   b. Compartilhamento de eventos com Meta (Conversions API): que eventos
      enviamos, sem PII, como opt out.
   c. Conteudo replicado da conta oficial Tchin no Instagram: como
      curadoria editorial funciona, que conteudo aparece no app.
2. Envia pro legal Tchin pra revisao juridica (estimativa 3 dias uteis).
3. Apos aprovacao do legal, Otavio plugar texto nas telas termos e
   politica-privacidade.
4. Push opcional pra base atual avisando da atualizacao dos termos com link
   pra ler na integra (LGPD pede comunicacao expressa).
5. Versao dos termos sobe um numero (de v1.6 pra v1.7), data marcada na
   propria tela.

Telas afetadas: termos (texto novo das 3 secoes), politica-privacidade
(texto novo das 3 secoes), push opcional avisando atualizacao (cross M18),
banner pro usuario ler a nova versao na primeira abertura pos atualizacao.

---

## Bloco 5, Decisoes de curadoria de conteudo

### D30, 20 parceiros piloto pro Marketplace de Experiencia R5 Sprint 15

Contexto: pre cadastrar parceiros antes do lancamento da feature.
Decisao necessaria, aprovar lista por categoria:
1. 10 vinicolas (foco Serra Gaucha e Vale dos Vinhedos).
2. 5 wine bars e restaurantes parceiros (foco Brasilia e Sao Paulo).
3. 5 fornecedores de kit (importadoras e lojas especializadas).
Origem: sprint-15.md R5 e 99-gaps-produto.md F5.
Impacto: sem curadoria, a aba Experiencia aparece vazia e queima o conceito.

### D31, Conteudo dos cards Uva da semana e Dica do dia US-017 e US-018 ja entregue

Contexto: ja entregues, decisao de mantenimento.
Decisao necessaria:
1. Time editorial responsavel pela rotacao semanal e diaria.
2. Definir calendario inicial para primeiras 12 semanas (US-112 ja entregue
   pra Uva da semana).
3. Definir calendario inicial para primeiros 90 dias (US-113 ja entregue pra
   Dica do dia).
Origem: M04 e bloco 6 do Descobri (A1).

### D32, Conteudo dos primeiros 100 posts educacionais US-108 em execucao

Contexto: buffer de 2 meses, em execucao, nao entregue.
Decisao necessaria:
1. Confirmar produtor de conteudo.
2. Definir prazo final.
3. Definir cobertura tematica (uvas, regioes, tecnicas, etc).
Origem: validacao por epico.

### D33, Conteudo dos 10 videos Expert Talks US-111 nao entregue

Contexto: 10 videos com embaixadores, 15s cada, nao entregue.
Decisao necessaria:
1. Confirmar embaixadores convidados.
2. Definir prazo de gravacao.
3. Definir local de publicacao no app (cross M09 Aprenda e A1 Bloco 6 do
   Descobri).
Origem: validacao por epico.

---

## Como usar este documento

Sessao recomendada com Gabriel:
1. Bloco 1: 30 minutos. Bloqueia Sprint 14.
2. Bloco 2: 20 minutos. Ajustes de copy.
3. Bloco 3: 45 minutos. Decisoes de produto.
4. Bloco 4: 20 minutos. Stack e infra.
5. Bloco 5: 30 minutos. Curadoria.

Total estimado: 2h15.

Para cada decisao, marcar:
1. Aprovado conforme proposto.
2. Aprovado com ajuste (descrever).
3. Rejeitado (justificar e propor alternativa).
4. Adiar (definir prazo).
