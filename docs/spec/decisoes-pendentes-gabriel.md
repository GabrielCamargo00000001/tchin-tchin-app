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

### D5, Layout final dos 3 slides do onboarding pre auth do MKT

Contexto: o MKT mandou um novo layout pros 3 slides do onboarding pre auth.
Decisao necessaria:
1. Aprovar o layout do MKT final (formatos, copy, imagens).
2. Confirmar a copy de cada slide (identidade, dor 1, dor 3).
3. Aprovar transicao horizontal sem fade.
Origem: sprint-14.md F4 e R1.
Impacto se nao decidir: Sprint 14 nao fecha onboarding.

---

## Bloco 2, Decisoes de copy e UX que precisam de aprovacao

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

### D14, Nivel de conhecimento visivel no perfil

Contexto: US-050 adiada. Chip Iniciante, Intermediario, Enofilo, Expert
existe no prototipo.
Decisao necessaria:
1. Reativar e mostrar o chip no identity card do perfil.
2. Manter adiado.
Origem: sprint-14.md R14, M14 § 14.0, 99-gaps-produto.md F3.

### D15, Minha Biblioteca (posts salvos) no perfil

Contexto: US-059 adiada. M14 menciona.
Decisao necessaria:
1. Reativar como secao do perfil-eu.
2. Manter adiado.
Origem: 99-gaps-produto.md F3.

### D16, Card educacional pos registro de vinho

Contexto: US-204 nao entregue, US-250 adiada. M07 fala mas e placeholder.
Decisao necessaria:
1. Reativar e definir taxonomia de conteudo (uva, regiao).
2. Manter adiado.
Origem: 99-gaps-produto.md F1, M07 § 7.0.

### D17, Janela de consumo na Adega

Contexto: US-305 adiada. M07 menciona "esse vinho esta no ponto ou passando
do ponto".
Decisao necessaria:
1. Reativar.
2. Manter adiado.
Origem: 99-gaps-produto.md F1.

### D18, Tour guiado pos cadastro US-008

Contexto: tour de 4 passos da bottom nav. US-008 esta como nao entregue.
Decisao necessaria:
1. Confirmar que entra na R22 da Sprint 14.
2. Reduzir o tour caso seja muito intrusivo.
3. Tornar opcional via menu como confraria-usar fez.
Origem: sprint-14.md R22 e sprint-16.md Bloco D.

### D19, Pesos do match score de paladar

Contexto: A3 propos 50 percent paladar, 30 percent popularidade, 20 percent
editorial (M04 § 4.0.1).
Decisao necessaria:
1. Aprovar pesos default.
2. Calibrar valores diferentes.
3. Confirmar que ficam configuraveis server side via backoffice.
Origem: sprint-14.md A3.
Recomendacao: aprovar default e deixar configuracao server side.

### D20, 5 templates de evento F5

Contexto: 5 templates propostos pro wizard de evento.
Decisao necessaria, aprovar cada um:
1. T1 Vinhos por pais, default Brasil.
2. T2 Degustacao as cegas.
3. T3 Comparativo de uvas.
4. T4 Tema livre social.
5. T5 Vinho e harmonizacao.
Origem: sprint-14.md F5.

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

### D23, Thresholds de inatividade Cutuca o organizador F11

Contexto: card aparece no feed da confraria quando inativa.
Decisao necessaria, aprovar thresholds:
1. 14 dias sem publicacao OU 21 dias sem evento criado.
2. Cooldown 7 dias entre cutucadas.
3. Push pro admin com mesmo cooldown.
Origem: sprint-14.md F11.

### D24, Tempo minimo pra admin finalizar evento V1 Sprint 15

Contexto: botao Finalizar evento do admin.
Decisao necessaria:
1. Habilitar apos data e hora de inicio do evento mais 2 horas.
2. Tempo diferente.
3. Confirmar default automatico de 24h apos data original.
Origem: sprint-15.md V1.

### D25, Conversao Cristais ↔ Pontos

Contexto: cross M08 e M19. Cristais do Treino podem virar beneficios na
Marketplace de Experiencia.
Decisao necessaria:
1. Aprovar taxa proposta 1 cristal = 5 pontos.
2. Calibrar valor diferente.
Origem: 99-gaps-produto.md F4.

---

## Bloco 4, Decisoes de stack, integracoes e infra

### D26, Tempo de App Review da Meta pra F13

Contexto: F13 precisa de revisao manual da Meta pra permissoes avancadas.
Estimativa de 5 a 10 dias uteis.
Decisao necessaria:
1. Iniciar submissao no dia 1 da Sprint 14 e absorver risco de demora.
2. Adiar pra Sprint 15 e usar a Sprint 14 pra preparar codigo e submissao.
Origem: sprint-14.md F13 Riscos.
Recomendacao: iniciar no dia 1 da Sprint 14 com plano B (permissoes basicas
ja aprovadas no caminho critico).

### D27, Sincronizacao da conta Tchin no Instagram com o app

Contexto: Frente 2 do F13 permite o time editorial publicar no Instagram
oficial e replicar como card no feed do app.
Decisao necessaria:
1. Replicar todo post editorial automaticamente.
2. Manter flag opt in no admin pra escolher o que sincroniza.
3. Manual manual no admin.
Origem: sprint-14.md F13 Frente 2.
Recomendacao: opt in por post pra evitar replicar postagem de bastidor.

### D28, Conversions API Meta opt out

Contexto: F13 Frente 3 envia eventos server side pra calibrar campanhas.
Decisao necessaria:
1. Opt in por padrao com toggle off em config-privacidade.
2. Opt out por padrao com toggle on opcional.
Origem: sprint-14.md F13 Frente 3.
Recomendacao: opt in por padrao com toggle de opt out claramente visivel
(compliance LGPD).

### D29, Politica e termos com mencao a Meta API

Contexto: termos e politica-privacidade precisam atualizar texto pra mencionar
uso da API Meta.
Decisao necessaria:
1. Aprovar texto novo redigido pelo legal.
2. Pedir versao revisada antes de promover pra producao.
Origem: sprint-14.md F13 Dependencias tecnicas.

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
