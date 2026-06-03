# Gaps de produto — o que falta pra fechar UX das 5 features

> **Contexto:** o app **já existe e está em produção** (13 sprints entregues entre nov/2025 e mai/2026). Backend, auth (Keycloak), banco, push, login social, integração LACI/Celcoin, feed, scanner, dashboards — tudo já em pé. O que veio **incompleto ou com usabilidade ruim** é o que esta sessão de super-doc + protótipo está endereçando.
>
> **Este doc não é plano técnico** — é um mapa de **gaps de UX/produto** ligando cada uma das 5 implementações de protótipo (commit `f0837ca`) às **USs reais** que estão "Parcialmente entregue" ou "Não entregue" na planilha de validação por épico (Gabriel jun/2026). Serve pro time de produto/dev decidir o que entra na próxima sprint.
>
> **Última atualização:** 2026-06-03 · **Cronograma:** Sprint 14 em desenvolvimento (v2 visual), Sprint 15 em backlog.

---

## Resumo — 5 features × o que falta pra ficar boa

| Feature | Doc | Estado no app real | Principais gaps de UX |
|---|---|---|---|
| **F1** Adega / Diário / Estante / Favoritos / Wishlist | M07 | Muito entregue (US-060, 062, 058, 202). Sprint 11 melhorou bastante (Meu Diário + Meu Paladar + Aprimoramento da Adega). | **Taxonomia ainda não está clara no app** (4 conceitos misturados) · Relatório mensal ❌ · Card educacional pós-registro ❌ · Filtros no diário ❌ · Quantidade por slot ❌ |
| **F2** Pagamento de evento + taxa | M12 | Eventos criados/RSVP ✅. LACI/Celcoin em integração final (Sprint 11-13). | **Taxa não é mostrada** ainda no app · Rachão incompleto (input custos, divisão, quem pagou antes) · Lembretes incompletos (faltam 7d, customização) · Check-in sem QR único |
| **F3** Perfil próprio | M14 | Editar/visualizar perfil ✅. Seguir ✅. Drawer de menu existe. | **Perfil próprio não é tela cheia** (vive em sheet) · Badges adiadas · Privacy granular não-enforced · @handle sem cooldown · Bloquear/denunciar reais |
| **F4** Pontos Tchin | M19 | **Todo o sistema de pontos foi adiado pelo time de produto** (US-082, 083, 092-096). | **Não existe pontuação real no app hoje.** Tabela mestra, expiração, resgate, anti-fraude — tudo precisa entrar. O protótipo já tem a UX completa pronta. |
| **F5** Marketplace de Experiência | M04/M11 | Catálogo de comerciante existe (US-155). Boost adiado. | **Não existe ainda** como sub-feature unificada. Conceito novo do Gabriel jun/2026 — entra como épico próprio. |

---

## F1 — Adega / Diário / Estante / Favoritos / Wishlist (M07)

### O que já está em pé no app
| US | Descrição | Status |
|---|---|---|
| US-060 | Salvar Vinhos na Adega (Wishlist) | ✅ Entregue |
| US-062 | Adicionar Nota Pessoal | ✅ Entregue |
| US-058 | Listar Vinhos Salvos | ✅ Entregue |
| US-179 | Banco de Vinhos da Confraria | ✅ Entregue |
| US-202 | Timeline Pessoal | ✅ Entregue |
| Sprint 11 | App > Adega > Meu Diário · Meu Paladar · Aprimoramento da Adega | ✅ Entregue |

### O que está parcial/falta — gaps de UX

| Gap | Origem (US) | O que o protótipo já entrega | O que o time precisa fazer |
|---|---|---|---|
| **Taxonomia confusa** (4 conceitos misturados) | — *(decisão Gabriel § 7.0.1)* | Banner "Onde fica o quê" + chips Favoritos/Wishlist + pílula inline em cada aba (`shots/home-adega-estante.png`) | Plugar no app: render do banner + chips + pílula. Usar localStorage `tc.adega.tax.dismissed` pra dispensar. |
| **Registro só via Adega** | US-201 (Registro Rápido 15s — parcial) | UX de registro rápido detalhada no M07 § 7.7 | Habilitar entry points fora da adega (feed, scanner-result, harmoniza-result). |
| **Sem relatório mensal** | US-203 ❌ / US-248 ❌ Relatório mensal automático | RelatorioMensal (Wrapped) pronto no protótipo · M07 § 7.8 | Implementar agregação real (já tem dados no diário) + scheduler mensal pra notificação. |
| **Sem card educacional pós-registro** | US-204 ❌ / US-250 🚫 (adiado) | M07 fala mas é placeholder | **Confirmar com produto se reativa** (foi adiado). Se sim, definir taxonomia de conteúdo (uva/região). |
| **Sem progresso/badges educacionais** | US-205 ❌ | Badges adiadas em massa (US-083 a US-091) | Cross M19 — quando pontuação entrar, badges entram junto. |
| **Sem sugestão de harmonização no registro** | US-207 ❌ | M07 + M10 cruzam | Pegar paladar do registro + chamar motor de harmoniza (M10). |
| **Sem quantidade por slot na Estante** | — *(decisão Gabriel § 7.0.2)* | Slot multi-garrafa com badge ×N + botões +/− (`shots/home-adega-estante.png`) | Plugar UX no app real. Schema da estante ganha campo `quantity` (mínima mudança). |
| **Sem filtros no diário** | US-247 ❌ Timeline cronológica com filtros | Diário tem busca textual; falta filtros por tipo/país/nota/data | Adicionar filter bar acima da timeline. |
| **Sem organização da estante** | — *(§ 7.0.3)* | Decisão fechada: dividir por prateleira/região/temperatura | Sub-tabs/filtro lateral em fase posterior. |
| **Sem janela de consumo** | US-305 🚫 (adiado) | "Esse vinho está no ponto" — adiado | Confirmar com produto se reativa. |
| **Sem estatísticas no perfil** | US-249 ❌ | M14 perfil-eu já lista entry points | Plugar contadores reais (total vinhos, países, etc.). |
| **Adega Espelho (privacidade)** | US-307 🔄 No roadmap | Espelhar o que outros vão ver da minha adega | UX a definir; conectar a privacy granular do M14. |

### USs/épicos relacionados pendentes
- **US-211/212/213** — Tags multi-bebida + Diário multi-bebida + Desafios multi-bebida (📅 roadmap)
- **US-231 a US-235** — Criando adega · adicionando vinho (matriarcal e tradicional) · mover vinho · vinho zerado (Sprint v2 em curso na 14/15)

---

## F2 — Pagamento de evento + taxa (M12)

### O que já está em pé no app
| US | Descrição | Status |
|---|---|---|
| US-166 | Criação de Evento Completa | ✅ Entregue |
| US-167 | Sistema de RSVP Inteligente | ✅ Entregue |
| US-176 | Chave PIX da Confraria | ✅ Entregue |
| Sprint 11-13 | Eventos com conciliação automática via LACI/Celcoin | ✅ Entregue (3 sprints) |
| Sprint 12 | Migração de estrutura para produção | ✅ Entregue |

### O que está parcial/falta — gaps de UX

| Gap | Origem (US) | O que o protótipo já entrega | O que o time precisa fazer |
|---|---|---|---|
| **Taxa não é visível no app** | — *(decisão Gabriel § 12.A.1)* | Row "Valor" no event-detalhe + breakdown PIX R$1,20 / Cartão 4% / Combinar sem taxa em todos os sheets (`shots/event-detalhe.png` + `event-sheet-metodo.png`) | **Plugar no app real:** mostrar base + taxa + total separados sempre. Componente `PriceBreakdownLines` do protótipo serve de referência. |
| **Lembretes incompletos** | US-168 ⚠️ Parcial | Doc M12 lista janelas (D-7/D-1/2h) | Faltam: lembrete D-7 · customização de texto pelo admin · desativar lembretes específicos · lembrete especial. |
| **Check-in sem QR único** | US-169 ⚠️ Parcial | M12 fala MVP1 (manual) + MVP1.5 (QR) + v2 (geo) | Implementar QR único por evento. Auto check-in foi adiado. Sistema de pontos no check-in depende de F4. |
| **Registro de vinhos do evento incompleto** | US-170 ⚠️ Parcial | M12 doc Pós-evento + ata | Faltam: campo "Quem trouxe" · nota coletiva (média) · comentários dos participantes · preço pago (rachão) · fotos múltiplas. |
| **Rachão incompleto** | US-173 ⚠️ Parcial | M12 § 12.A.2 mantém valor fixo no MVP — split dinâmico backlog | Implementar input de custos (vinhos/comida/local) + divisão igualitária + "quem já pagou antecipado". |
| **Status de pagamento individual** | US-174 ❌ | Mostrado na aba Pagamentos do evento-presenca | Plugar visual real do estado por participante (pendente/pago/falhou). |
| **Cobrança não-constrangedora** | US-175 ❌ | M12 doc fala em nudge sutil | Sequência de lembretes ao pendente: D-3 inline → D-1 push → 2h cobrança ao admin. |
| **Convite por link com tracking** | US-164 ⚠️ Parcial | M12 + M16 indicação | Link existe; falta tracking, link funcionar pra quem não tem app, rota de direcionamento. |
| **Plus One viral** | US-228 / US-295 🚫 (retirado) | M18 nudge plus-one | Decisão de produto: foi retirado. Confirmar se mantém. |

### USs relacionadas em desenvolvimento agora
- **US-177** Confirmação automática via PIX LACI 🔄
- **US-208** Rachão automático no evento 🔄
- **US-210** Histórico de rachões 🔄
- **US-209** Integração LACI 🔄

---

## F3 — Perfil próprio + grafo social (M14)

### O que já está em pé no app
| US | Descrição | Status |
|---|---|---|
| US-047 | Visualizar Perfil Próprio | ✅ Entregue |
| US-048 | Editar Perfil | ✅ Entregue |
| US-049 | Visualizar Perfil de Outros | ✅ Entregue |
| US-054 | Contador de Posts, Seguidores | ✅ Entregue |
| US-055 | Seguir/Deixar de Seguir | ✅ Entregue |
| Sprint 10 | Bloqueio de usuários | ✅ Entregue (UI design + implementação) |

### O que está parcial/falta — gaps de UX

| Gap | Origem (US) | O que o protótipo já entrega | O que o time precisa fazer |
|---|---|---|---|
| **Perfil próprio em sheet/drawer (não rota)** | — *(decisão Gabriel § 14.3)* | Rota dedicada `perfil-eu` (`PerfilEuScreen`) com identity card + 3 chips de ação + seções completas (`shots/perfil-eu.png`) | Plugar no app real: avatar do header abre `perfil-eu` (rota), não sheet. Drawer pode ficar como atalho. |
| **Nível de conhecimento visível** | US-050 🚫 (adiado) | Chip "Iniciante/Intermediário/Enófilo/Expert" no identity card | Decisão de produto: reativar? O protótipo mostra. |
| **Barra de progresso "X pts pro próximo nível"** | US-056 🚫 (adiado) | Depende de F4 | Reativar junto com pontuação. |
| **Badges no perfil (grid 2×3)** | US-057 / US-058 🚫 (adiado) | M14 § 14.6 — `badges-galeria` linkado | Reativar junto com pontuação. |
| **Minha Biblioteca (posts salvos)** | US-059 🚫 (adiado) | M14 menciona | Decisão de produto. |
| **@handle com cooldown 30d** | — *(decisão Gabriel § 14.2)* | M14 § 14.0 documenta regra | Adicionar campo `handle_changed_at` no perfil + validação no `editar-perfil`. Lista de handles reservados. |
| **Seguir bilateral em perfis privados** | — *(decisão Gabriel § 14.1)* | M14 § 14.0 documenta regra | Add status `pending` na relação follow quando target tem perfil privado. |
| **Privacy granular não-enforced** | US-301 (Wishlist privacy) 🚫 + privacy M14 | M14 § 14.2 — tela `editar-perfil-privacidade` | Aplicar policy nos endpoints que retornam dados de terceiros. |
| **Notificação push de comentários** | US-103 ⚠️ Parcial | M18 catálogo de notifs | Plugar — outras notifs (like, badge) já estão. |
| **Bloquear/denunciar real** | US-159 ✅ (reportar) + denúncia perfil ❌ | M14 fala "DENUNCIA_TAXONOMIA" mas sem tela | Tela de denunciar usuário (taxonomia já existe). |

---

## F4 — Pontos Tchin (M19)

### Situação geral

**Praticamente tudo de pontuação foi adiado pelo time de produto.** USs adiadas:
- US-082 (backend pontos + triggers) 🚫
- US-083 (badge no perfil + toast) 🚫
- US-091 (página todos os badges) 🚫
- US-092 (tabela de pontos por ação) 🚫
- US-093 (tracking de leitura +5 pts) 🚫
- US-094 (5 níveis de progressão) 🚫
- US-095 (barra de progresso no perfil) 🚫
- US-096 (notificação celebratória ao subir de nível) 🚫
- US-084 a US-090 (badges variados) 🚫

**Não-entregues:** US-203 (relatório mensal), US-205 (progresso e badges educacionais), US-206 (desafio semanal individual), US-284 / US-308 / US-310 (desafios).

### O que o protótipo já entrega

| Item | Onde |
|---|---|
| Carteira `/pontos` com saldo + 3 abas (Resgatar / Ganhar / Extrato) | M19 § 19.4 |
| **4ª aba "Como funcionam"** com tabela mestra de 24 linhas em 6 grupos | M19 § 19.0.1 (`shots/pontos-como-funcionam.png`) |
| Onboarding sutil em `welcome-final` ("Você ganha pontos por usar o app · entenda") | M19 § 19.0.2 |
| Tabela canônica de pontos por ação (`PONTOS_TABELA`) | M19 § 19.0 + tabela |
| Anti-fraude documentado (cap 3/dia, dedup, expiração 12m, server-side) | M19 § 19.0.3 |

### Decisão necessária

**Gabriel + produto:** reativar o épico de pontos? Sem ele:
- Toda a mecânica de retenção (jornada, desafios, marcos, celebrações) fica cosmética.
- Marketplace de Experiência (F5) perde uma das moedas (resgate via pontos).
- Badges (F3) ficam vazios — sem trigger.

Se sim, a UX **já está pronta** no protótipo. Resta plugar:
- Sistema de eventos pontuáveis (cada ação do app dispara um "award" no pontos).
- Validação anti-farming.
- Resgate (3 categorias: crédito marketplace, vinho grátis, experiência).

### Mapeamento — onde cada ação pontuada já existe no app

| Grupo do § 19.0.4 | Ação | US relacionada (no app hoje) | Trigger |
|---|---|---|---|
| Registro de vinho | Registrar nome | US-060 Salvar na Adega ✅ | já existe — só falta pontuação |
| Registro de vinho | + nota + foto + harmonização | US-062 nota ✅ · foto via scanner US-031 ⚠️ | já existe — só falta pontuação |
| Treine | Lição concluída | M08 — fora do escopo dessas USs | dependência |
| Confrarias | Participar de evento | US-167 RSVP ✅ + US-169 check-in ⚠️ | já existe — só falta pontuação |
| Comunidade | Post no feed | US-011 ✅ | já existe — só falta pontuação |
| Comunidade | Comentário relevante | US-013 ⚠️ Parcial | já existe — só falta pontuação |
| Marcos | Criou conta | US-001 ✅ + US-002 SSO ✅ | trigger imediato |
| Indicação | Amigo aceitou | US-191 Link de convite ⚠️ Parcial | depende de tracking que está parcial |

---

## F5 — Marketplace de Experiência (M04/M11)

### Situação

Conceito **novo do Gabriel jun/2026**. Não existe no app real ainda como sub-feature unificada.

### O que existe parcialmente que serve de base

| US | Descrição | Status | Como conecta com F5 |
|---|---|---|---|
| US-120 | Comerciante cria post de produto | ✅ | Vira "oferta" da categoria Equipamentos/Kits |
| US-121 | Carrossel de até 5 fotos por produto | ✅ | Reaproveita layout |
| US-122 | Tags do produto (uva, região, tipo, faixa de preço) | ✅ | Vira metadados da oferta |
| US-128 | Comerciante cria confraria própria | ✅ | Vira parceiro do tipo "Comerciante" |
| US-155 | Catálogo (vitrine de até 20 produtos fixos) | ✅ | Vira página do parceiro |
| US-156 | Clicar em produto → detalhes + botão compra | ✅ | Fluxo de compra reaproveitável |
| US-152 | Botão CTA customizável ("Comprar", "Saiba Mais", "Peça Agora") | ✅ | Adicionar variantes de CTA Experiência |

### O que o protótipo já entrega

- **5ª aba "Experiência"** em `confraria-detalhe` (`ExperienciaTab`) com 6 categorias (Vinícolas / Locais / Kits / Conteúdo / Equipamentos / Serviços), destaques pagos+grátis, CTA admin "Montar kit pro próximo evento" — `shots/confraria-detalhe-experiencia.png`.
- **Card destacado** "Marketplace de Experiência" no DescobrirHome — `shots/descobrir-com-experiencia.png`.

### Gaps pra virar feature real

| Gap | Decisão Gabriel | O que o time precisa fazer |
|---|---|---|
| Sub-hub em `/descobrir` | M04 § 4.0.3 | Rota dedicada vs aba — definir UX |
| Cadastro de parceiros | M04 § 4.0.3 modelo de receita | Curadoria manual primeiros 20 (vinícolas DF/SP + 5 fornecedores de kit) |
| Diferenciação ofertas pagas vs grátis | M04 § 4.0.3 | Badge GRÁTIS já no protótipo, plugar lógica |
| Pagamento de oferta | Cross M05 (carrinho) + M12 (taxa) | Reusar checkout que já existe (US-156) |
| Resgate via pontos / cristais | Cross M08 (cristais) + M19 (pontos) | Depende de F4 estar de pé |
| "Selo Tchin Verificado" pra parceiros | M04 § 4.0.3 | Cross com US-117 ("Parceiro Verificado" do comerciante ✅) |
| "Montar kit pro próximo evento" pro admin | M11 ExperienciaTab + M12 § 12.0.x | UX a desenhar na próxima sessão |

### USs vizinhas pendentes que vão se cruzar
- US-184 Catálogo de Parceiros por Tier 🚫 (adiado) — provavelmente reativar como parte de F5
- US-185 Eventos Patrocinados 🚫 (adiado) — sub-feature de F5
- US-138 Impulsionar post ❌ — modelo de receita análogo
- US-142 Boosts avulsos (R$ 50) ❌ — modelo de receita análogo

---

## Próximas sessões sugeridas

| Prioridade | Tema | Por que primeiro |
|---|---|---|
| **1** | **Plugar F1 e F2 no app real** (taxonomia Adega + display da taxa) | UX já desenhada · custo baixo · libera Sprint 15 v2 |
| **2** | **Decidir F4** (reativar épico de pontos?) | Bloqueia gamificação, retenção, badges, resgate F5 |
| **3** | Refinar gaps parciais de F2 (rachão, lembretes, registro de vinhos do evento) | Eventos já são feature principal — completar UX |
| **4** | Plugar F3 (`perfil-eu` rota) e definir privacy enforcement | Quick win, libera grafo social |
| **5** | Cadastrar primeiros parceiros de F5 e desenhar UX detalhada do hub | Diferenciação competitiva, mas pode esperar wave 2 |

---

## Conexões com a super-doc

- M07 § 7.0 → F1
- M12 § 12.A → F2
- M14 § 14.0 → F3
- M19 § 19.0 → F4
- M04 § 4.0.3 + M11 § 11.5 → F5
- Doc de validação por épico (Gabriel jun/2026) → mapeamento de US neste arquivo
- Cronograma sprints 01-15 → estado real do app
