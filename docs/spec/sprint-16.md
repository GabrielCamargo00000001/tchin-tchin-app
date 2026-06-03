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
