# Sprint 15: plano de execução

## 1. Contexto

A Sprint 15 começa em 17/06/2026 e termina em 30/06/2026 (entrega prevista 02/07).
Versão de produção atual ao iniciar: 1.7.0 (Sprint 14 entregue).
Versão alvo desta Sprint: 1.7.5.

Esta Sprint é a primeira que opera com a base estabilizada pós Sprint 14. O foco
está em três blocos:

1. Itens que vazaram da Sprint 14 por falta de tempo.
2. Itens da v2 visual que continuam (Sprint 14 começou v2 de Splash, Onboarding,
   Setup Perfil, Criação de Confraria e Evento; Sprint 15 segue com Listagem,
   Detalhe e Adega v2).
3. Refinamento dos gaps de UX que sobraram do mapeamento de features prontas no
   protótipo (M07 taxonomia, M12 taxa, M14 perfil-eu, M19 pontos, M04 Marketplace
   Experiência).

## 2. Resumo do que entra

Itens vazados da Sprint 14: 5 itens.
Continuação v2 visual: 3 itens grandes.
Refinamentos da super doc: 6 itens.
Bug fixes recém abertos em 1.7.0: backlog adaptativo (definir após release).

Total fixo de 14 itens nesta Sprint.

## 3. Bloco vazados da Sprint 14

### V1. Opção para admin finalizar evento manualmente

Origem: backlog Sprint 13 e 14, "Falta definir o momento que será permitido
finalizar o evento".

Regra fechada:
1. Botão "Finalizar evento" aparece no detalhe do evento apenas para o admin
   (organizador ou admin da confraria dona do evento).
2. Botão fica desabilitado até a data e hora de início do evento mais 2 horas
   (tempo mínimo de duração estimado).
3. Após data e hora + 2h: botão fica habilitado.
4. Default automático: se ninguém finalizar manualmente, o sistema finaliza após
   24h da data e hora original (Sprint 13 já entregue como automação).
5. Finalizar manualmente trava o RSVP, libera a aba Pós evento (avaliar vinhos,
   ata), notifica os participantes ("O evento foi finalizado, registre seu
   feedback").

UX:
1. Botão "Finalizar evento" no menu de ações (3 pontos) do detalhe do evento.
2. Antes de habilitar: tooltip "Disponível 2h após o início".
3. Após habilitar: confirmação modal "Finalizar agora? Você não vai mais poder
   editar".
4. Após finalizar: badge "Finalizado" no header e CTA "Registrar feedback".

Aceite:
1. Admin abre evento antes do horário: botão Finalizar desabilitado.
2. 2h após início: botão habilita.
3. Finalizar dispara: aba Pós evento liberada, notificação aos participantes.
4. Não admin: botão não aparece.

### V2. Evento mais próximo em destaque no feed da confraria

Origem: backlog Sprint 14, "verificar se há conflito com a linha 47 (F10)".

Conflito resolvido:
1. F10 da Sprint 14 colocou a barra de contadores (Eventos próximos, Publicações,
   Novos vinhos) abaixo do header.
2. V2 da Sprint 15 coloca o card de destaque do próximo evento dentro da aba
   Eventos, no topo da lista, antes da listagem de próximos.

Regra:
1. O evento marcado como destaque é o próximo evento confirmado com data mais
   próxima e com pelo menos 1 confirmado.
2. O card destacado tem altura maior, gradient, countdown e CTA "Ver detalhes".
3. Se não houver evento com confirmados, o destaque some e a aba mostra apenas
   a lista normal.

UX:
1. Posição: topo da aba Eventos, antes do filtro Próximos/Passados.
2. Layout: card 2x altura normal, capa em background, título serif em destaque,
   data e hora em pílula, número de confirmados, CTA "Ver detalhes".
3. Tap: abre event-detalhe.

Aceite:
1. Confraria com 3 eventos futuros, todos com confirmados: destaque mostra o
   mais próximo.
2. Confraria com eventos sem confirmados: destaque some, lista normal.
3. Após o evento passar: destaque atualiza pro próximo automaticamente.

### V3. Botão destaque para confirmar presença

Origem: backlog Sprint 14, "Verificar como está a confirmação hoje e se ocorre
o fluxo".

Estado atual no app: dentro do detalhe do evento, o RSVP fica em 3 botões pequenos
(Vou, Talvez, Não vou). Não há destaque pra quem ainda não confirmou.

Definição nova:
1. Quando o usuário ainda não confirmou e o evento está confirmado pra acontecer
   (não cancelado e não finalizado), os 3 botões ficam pequenos e abaixo aparece
   um botão grande sticky no rodapé: "Confirmar presença".
2. Tap no sticky equivale a tocar Vou.
3. Após confirmar: o sticky some, os 3 botões aparecem normais com Vou
   destacado.
4. Após confirmar: dispara um pop pop de sucesso (toast visual + animação curta).

UX do pop pop:
1. Toast no topo: "Presença confirmada".
2. Animação: badge verde com check pulsa por 600 ms.
3. Som: nenhum (regras de acessibilidade).

Aceite:
1. Usuário não confirmou + evento futuro: sticky aparece.
2. Tap no sticky: confirma, pop pop, sticky some.
3. Tocar em Não vou diretamente: sticky some sem pop pop.
4. Evento cancelado: sticky não aparece em nenhum cenário.

### V4. Badges em cards de confrarias

Origem: backlog Sprint 13 e 14, "Precisa especificar quando mostra cada um".

Definição fechada de badges no card de confraria:

Badge "Em alta":
1. Confraria com aumento de pelo menos 20 por cento de membros nos últimos 30
   dias.
2. Mínimo de 10 membros pra evitar números pequenos.
3. Posição: canto superior direito do card, fundo âmbar.

Badge "Nova":
1. Confraria criada nos últimos 14 dias.
2. Posição: canto superior direito do card, fundo burgundy.
3. Não acumula com "Em alta" (Nova ganha prioridade).

Badge "Verificada":
1. Confraria de comerciante verificado (cross US-117).
2. Posição: ao lado do nome, ícone check com fundo azul.

Badge "Sua confraria":
1. Aparece se o usuário é membro.
2. Posição: chip pequeno abaixo do nome.

Regra de prioridade quando mais de um se aplica:
1. Nova sobrepõe Em alta.
2. Verificada sempre aparece (não conflita com Nova ou Em alta, mora ao lado do
   nome).
3. Sua confraria sempre aparece quando aplicável.

Aceite:
1. Confraria criada há 5 dias: badge Nova.
2. Confraria criada há 30 dias com crescimento alto: badge Em alta.
3. Confraria de comerciante verificado: badge Verificada ao lado do nome.
4. Confraria onde o usuário é membro: chip Sua confraria visível.

### V5. Plugar taxonomia da Adega no app real

Origem: protótipo Sprint 14 e M07 § 7.0 (decisão Gabriel).

Refinamento que precisa entrar no app:
1. Banner "Onde fica o quê" com 4 conceitos canônicos (Estante, Diário,
   Favoritos, Wishlist) dispensável via persistência local.
2. Chips de atalho Favoritos e Wishlist sempre visíveis no header da Adega.
3. Pílula de definição inline em cada aba (Estante: "O que TENHO na minha
   garrafeira física", Diário: "O que JÁ PROVEI meu histórico").
4. Slot multi garrafa: cada slot guarda quantity, badge ×N quando maior que 1,
   botões mais e menos pra ajustar.

Aceite:
1. Primeira abertura da Adega: banner visível, dispensável.
2. Chips Favoritos e Wishlist com contadores corretos.
3. Pílula muda conforme aba selecionada.
4. Slot com 3 garrafas mostra badge ×3.

## 4. Bloco v2 visual continuado

### v2.1. Listagem e detalhe v2 de confrarias e eventos

Origem: Sprint 14 backlog, "Aguardar o novo layout".

Continuação da v2 visual iniciada na Sprint 14. Após Splash, Auth, Setup Perfil
e Criação ganharem v2, agora as listagens e detalhes entram.

Escopo de listagem:
1. home/confrarias: novo layout dos cards, animações de entrada, estados vazios
   redesenhados.
2. home/comunidade aba Eventos: cards alinhados com a nova linguagem.
3. Marketplace: cards de vinho com novo layout (preparado pra match score
   destacado quando A3 da Sprint 14 estiver pronto).

Escopo de detalhe:
1. confraria-detalhe: header refinado, abas com transições, conteúdo de cada
   aba revisado.
2. event-detalhe: hero capa redesenhado, RSVP repensado pra dar destaque ao CTA
   sticky de V3.
3. wine: layout limpo, taxonomia clara, sem botão Comprar (B2 já correto).

Critérios:
1. Todas as telas refletem o design system v2.
2. Sem regressão funcional.
3. Aprovação do MKT antes do merge.

### v2.2. Adega v2

Origem: Sprint 14 backlog.

Layout v2 da Adega:
1. Header reorganizado com identidade Tchin (gradient burgundy suave).
2. Tabs com transição suave.
3. Estante visual com rack 3D mais realista.
4. Diário com timeline melhorada.
5. Indicadores e Paladar com gráficos modernizados.

Cruza com V5 (taxonomia plugada).

### v2.3. Match do paladar com vinhos

Origem: A3 da Sprint 14 que estava bloqueado por F1.

Após F1 (importação de banco) estar pronto, plugar A3 (match) com a fórmula
definida na Sprint 14:

1. score = 0.50 * cosineSim + 0.30 * popularityBoost + 0.20 * editorialBoost
2. Exibir nos cards de vinho, detalhe do vinho e carta-matches.
3. Estados visuais por faixa de score (cinza, burgundy, burgundy negrito).

## 5. Bloco refinamentos da super doc

### R1. Plugar display da taxa Tchin Tchin no event-detalhe

Origem: protótipo Sprint 14 e M12 § 12.A.1.

Refinamentos a entrar no app:
1. Row "Valor" no event-detalhe (seção Detalhes) mostrando preço base + linha
   completa da taxa por método.
2. Componente PriceBreakdownLines no ParticiparSheet, EscolherMetodoSheet e
   PixLaciSheet.
3. Badge "SEM TAXA" no método "Combinar com admin".

Aceite:
1. Evento pago: row Valor mostra base + taxa por método.
2. ParticiparSheet: caixa de aviso "+ taxa Tchin Tchin no próximo passo".
3. EscolherMetodoSheet: breakdown completo em cada opção, badge SEM TAXA em
   Combinar.
4. PixLaciSheet: total com decomposição base + taxa.

### R2. Plugar rota dedicada perfil-eu

Origem: protótipo Sprint 14 e M14 § 14.3.

Refinamento:
1. Avatar do header passa a abrir a rota perfil-eu (não mais o drawer).
2. PerfilEuScreen com identity card destacado + 3 chips de ação + seções
   completas + footer Sair e Excluir conta.
3. ProfileDrawer mantido como atalho rápido (acesso secundário).

Aceite:
1. Avatar do header: abre rota perfil-eu.
2. perfil-eu: identity card e seções renderizadas.
3. Drawer ainda funciona via atalho lateral.

### R3. @handle com cooldown 30 dias

Origem: M14 § 14.2.

Plugar regra:
1. Trocar handle: só permite se a última troca foi há mais de 30 dias.
2. Mostrar mensagem "Você poderá trocar de novo em N dias" se dentro do
   cooldown.
3. Lista de handles reservados: admin, tchin, sommelier, expert, tchin-oficial.

Aceite:
1. Primeira troca: permitida.
2. Tentar trocar 5 dias depois: mensagem de cooldown bloqueia.
3. Tentar handle reservado: mensagem "Esse nome está reservado".

### R4. Privacy granular por seção

Origem: M14 § privacy granular.

Plugar enforcement no backend:
1. Diário visível para: Público / Seguidores / Privado.
2. Confrarias visível para: Público / Seguidores / Privado.
3. Paladar visível para: Público / Seguidores / Privado.
4. DM aceita de: Qualquer um / Quem eu sigo / Mesma confraria / Misto / Ninguém
   (cross M17 § 17.0.1).

Aceite:
1. Usuário A com Diário Privado: usuário B não consegue ver Diário de A.
2. Usuário A com Diário Seguidores: usuário B só vê se seguir A.
3. Edge case: bloqueio sobrepõe qualquer regra de privacidade.

### R5. Cadastrar primeiros parceiros do Marketplace de Experiência

Origem: M04 § 4.0.3 e M11 § 11.5.

Sem implementar a feature inteira (que é épico próprio), começar pelo trabalho
de curadoria:
1. Pré-cadastrar 20 parceiros piloto: 10 vinícolas (DF e SP), 5 wine bars / 
   restaurantes, 5 fornecedores de kit.
2. Página interna de gestão de parceiros (admin only) pra cadastrar e ativar.
3. Aba Experiência da confraria fica oculta até ter pelo menos 5 parceiros
   ativos na região do usuário.

Aceite:
1. 20 parceiros cadastrados.
2. Página admin de gestão funcional.
3. Aba Experiência aparece pra usuários em DF (que tem cobertura).

### R6. Decidir destino do épico Pontos

Origem: gaps-produto, F4.

Decisão a tomar na Sprint 15 (não na 14):
1. Reativar todas as USs 082, 083, 091 a 096?
2. Manter adiado e remover sistema de níveis e badges definitivamente?
3. Opção C, reativar parcialmente apenas Pontos com resgate (sem níveis nem
   badges)?

Esta decisão fica pra começo da Sprint 15. Após decidida, distribui em Sprint
16 ou 17.

## 6. Critérios gerais e DoD

Mesma estrutura da Sprint 14, seção 8.

## 7. Encadeamento com Sprint 16

Itens que naturalmente caem na Sprint 16:
1. Implementação completa do Marketplace de Experiência (épico próprio).
2. Reativação do épico de Pontos (se decidida em R6).
3. Refinamentos remanescentes da v2 visual (estados, animações, fine tuning).
4. Início do épico de Q&A com Expert verificado (US-021 estava adiada).

## 8. Referências cruzadas

1. M07 § 7.0: V5 (taxonomia).
2. M11 § 11.x: V4 (badges), V2 (destaque evento), v2.1 (listagem e detalhe v2).
3. M12 § 12.x: V1 (admin finaliza), V3 (sticky confirmar), R1 (display taxa),
   v2.1 (event-detalhe v2).
4. M14 § 14.x: R2 (perfil-eu), R3 (handle), R4 (privacy).
5. M04 § 4.0.x: R5 (parceiros), v2.3 (match).
6. M19: R6 (decisão Pontos).
