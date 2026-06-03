# Sprint 16: plano de execução preliminar

## 1. Contexto

A Sprint 16 começa em 06/07/2026 e termina em 17/07/2026 (entrega prevista 20/07).
Versão de produção alvo: 1.8.0.

Esta Sprint é preliminar: a definição final depende do que sair da Sprint 15
e da decisão sobre o épico de Pontos. O documento descreve os blocos prováveis e
deixa espaço pra ajuste fino.

## 2. Blocos prováveis

### Bloco A: épico Pontos (decisão da Sprint 15)

Se R6 da Sprint 15 decidir reativar Pontos, este bloco entra na íntegra:

1. Backend de pontos com triggers automáticos (US-082).
2. Frontend de saldo, extrato, resgate.
3. 4ª aba "Como funcionam" do protótipo plugada com a tabela mestra de 24
   linhas (M19 § 19.0).
4. Anti farming server side: cap por ação por dia, dedup, expiração 12 meses.
5. Notificação celebratória ao subir de nível (US-096).
6. Onboarding sutil em welcome final (M19 § 19.0.2).

### Bloco B: Marketplace de Experiência

Após R5 da Sprint 15 cadastrar os primeiros parceiros, esta Sprint constrói:

1. Aba Experiência no detalhe da confraria com listagem real de ofertas.
2. Categorias funcionais: Vinícolas, Locais, Kits, Conteúdo, Equipamentos,
   Serviços.
3. Página de detalhe da oferta.
4. Fluxo de compra (reusa carrinho do M05).
5. Voucher único gerado por compra com QR code.
6. Validade da oferta (por padrão 90 dias pra serviços, sem validade pra kits).

### Bloco C: Q&A com Expert verificado

US-021 (botão Fazer Pergunta) estava adiada pelo time de produto. Reativar?

Se sim:
1. Botão Fazer Pergunta no feed e no detalhe do vinho.
2. Tag #Dúvida nas perguntas (US-022 já entregue, reaproveitar).
3. Curadoria manual de admins marcando usuários como Experts (US-097 já
   entregue).
4. Push para Experts (US-023 parcial, completar).
5. Resposta verificada com badge (US-025 adiada, reativar).

### Bloco D: refinamentos da v2 visual

Detalhes finais que sobraram da v2 visual:
1. Telas de erro com nova identidade.
2. Toast e popovers com nova animação.
3. Tour guiado pós cadastro (US-008, adiada, considerar reativar).
4. Tutoriais conversacionais com mascote em pontos chave (já existe em algumas
   telas, completar cobertura).

## 2B. Inventário das telas afetadas na Sprint 16, fluxo a fluxo

### Bloco A, épico Pontos (se reativado)

1. pontos aba Resgatar
   - Mudança: catálogo real de resgate. 3 categorias visíveis: crédito de
     marketplace (300, 600, 1000 pts), vinho grátis (vinhos com price <= R$ 80
     custeados pela Tchin) e experiência (voucher pra Marketplace de Experiência
     do Bloco B).
2. pontos aba Ganhar
   - Como ganhar por feature, com links pros módulos.
3. pontos aba Extrato
   - Lista cronológica de ganho e gasto com filtros.
4. pontos aba Como funcionam
   - Tabela mestra de 24 linhas em 6 grupos (M19 § 19.0.4) plugada com regras
     reais.
5. jornada
   - Marcos plugados com gatilhos server side.
6. jornada-celebrar (5 variações)
   - Disparos reais a partir de gatilhos do app.
7. desafio-detalhe
   - 8 templates funcionais com 3 estados cada.
8. badges-galeria
   - Badges reais conforme tabela.
9. welcome-final
   - Pílula sutil de Pontos plugada com saldo zero do novo usuário (ganho de
     marco "Criou conta" +50 pts).
10. notificacoes
    - Push celebratório ao subir de nível (US-096 reativada se decisão Gabriel
      jun 2026 R6 da Sprint 15 aprovar).
11. perfil-eu
    - Chip Pontos no identity card mostra saldo real.

### Bloco B, Marketplace de Experiência

1. confraria-detalhe aba Experiência
   - Lista real de ofertas em vez de mock. Filtro por categoria (Vinícolas,
     Locais, Kits, Conteúdo, Equipamentos, Serviços).
   - Badge Selo Tchin Verificado (cross US-117).
   - CTA admin Montar kit pro próximo evento.
2. Página de detalhe da oferta (rota nova: experiencia-detalhe)
   - Capa, descrição, preço em R$ e em cristais e em pontos quando aplicável,
     CTA Comprar (reusa M05).
3. Página do parceiro (rota nova: experiencia-parceiro)
   - Capa, descrição, ofertas do parceiro, selo se verificado, avaliações dos
     membros.
4. home/descobrir Bloco 5 (Descobri)
   - Card destacado leva pro hub de experiências e pra ofertas do dia.
5. carrinho
   - Aceita ofertas de experiência ao lado de vinhos.
6. pedido-confirmado
   - Mostra voucher único TCHIN-XXX-1234 com QR code.
7. perfil-eu seção Atividade
   - Linha "Meus vouchers" com lista de vouchers ativos.
8. Tela de voucher (rota nova: voucher-detalhe)
   - QR code grande, código alfanumérico, validade, parceiro, como usar.

### Bloco C, Q&A com Expert verificado

1. home/comunidade
   - Botão Fazer Pergunta no header da aba.
2. wine
   - Botão Perguntar pra um expert sobre este vinho.
3. perguntar-expert
   - Reativado e tag #Dúvida aplicada (US-022 reusa).
4. expert-virar (US-097 já entregue, só refinar fluxo).
5. expert-aplicar.
6. expert-pendente.
7. expert-q-a (inbox do expert).
8. expert-responder.
9. notificacoes
   - Push pro expert quando nova pergunta cai na fila dele.
   - Push pra quem perguntou quando expert responde.
10. post-detail
    - Tag #Dúvida visível no card e no detalhe.
11. badges-galeria
    - Badge Expert Verificado (US-014 já entregue, replicar consistência v2).

### Bloco D, refinamentos da v2 visual

1. erro-404, erro-permissao, erro-sessao, erro-servidor, vinho-indisponivel
   - Polimento de copy e ilustração com nova identidade.
2. Toast transversal
   - Refinamento de animação de entrada e saída.
3. Tour guiado pós cadastro (US-008, considerar reativar)
   - Decisão de produto.
4. Tutoriais conversacionais com mascote em pontos chave
   - Cobertura completa: garantir que TchinTutor moderno substitui o legado
     TourDiario em todos os pontos.

## 3. Critérios e DoD

Mesma estrutura das Sprints anteriores.

## 4. Itens que ficam fora ou pra Sprint 17

1. Feed vertical infinito (US-214) em roadmap, sem prazo.
2. Convite do capitão (US-226) em roadmap, sem prazo.
3. Compartilhar descoberta pós scan (US-290) adiada, decisão de produto.
4. Marketplace de Perguntas para Experts (US-299) retirado pelo time de produto.
5. Mapa de calor de taças (US-324) adiado, decisão de produto.

## 5. Referências cruzadas

1. M19 inteiro: Bloco A.
2. M04 § 4.0.3 e M11 § 11.5: Bloco B.
3. M15 inteiro: Bloco C.
4. M21 e tutoriais: Bloco D.
