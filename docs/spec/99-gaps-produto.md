# Gaps de produto — o que falta pra fechar UX das 5 features

> **Contexto:** o app **já existe e está em produção** (13 sprints entregues entre nov/2025 e mai/2026). Backend, auth (Keycloak), banco, push, login social, integração LACI/Celcoin, feed, scanner, dashboards — tudo já em pé. O que veio **incompleto ou com usabilidade ruim** é o que esta sessão de super-doc + protótipo está endereçando.
>
> **Este doc não é plano técnico** — é um mapa de **gaps de UX/produto + regras de negócio canônicas** ligando cada uma das 5 implementações de protótipo (commit `f0837ca`) às **USs reais** que estão "Parcialmente entregue" ou "Não entregue" na planilha de validação por épico (Gabriel jun/2026). Serve pro time de produto/dev decidir o que entra na próxima sprint.
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

### Regras de negócio canônicas (Gabriel jun/2026)

#### 4 conceitos cruzados (taxonomia oficial — § 7.0.1)
| Conceito | Significado | Estado físico | Estado social |
|---|---|---|---|
| **Estante** | O que TENHO na minha garrafeira física, agora | Tenho | Possessão |
| **Diário** | O que JÁ PROVEI (histórico de experiências) | Não tenho mais | Memória |
| **Favoritos** | O que CURTI pra referência (sem ter provado nem ter) | Não tenho | Intenção/interesse |
| **Wishlist** | O que QUERO COMPRAR (intent de compra rastreado pelo price-watch) | Não tenho | Intenção de compra |

**Cruzamentos previstos:**
- Provei + tenho na estante → Estante (com flag "provei na data X") + Diário (registro).
- Provei e gostei → Diário (com nota alta) + opcional marcar como Favorito.
- Não provei mas quero comprar → Wishlist.
- Não provei mas é referência → Favoritos.

#### Slot multi-garrafa (§ 7.0.2)
- Cada slot da Estante aceita **N garrafas do mesmo vinho** (`quantity` no item).
- Badge `×N` no canto do slot quando >1.
- Botões `+`/`−` pra ajustar; chegando em 0, remove.
- Contador da Estante separa "X de Y espaços" (slots únicos) de "Z garrafas" (total).

#### Organização da Estante (§ 7.0.3)
- Cada slot pode ser etiquetado por **prateleira** (Prateleira 1, 2, 3...), **região** (agrupa por país de origem) ou **temperatura/local de armazenamento** (Cave 12 °C / Adega 16 °C / Geladeira / Ambiente).
- UI ganha sub-tabs OU filtro lateral por essas 3 dimensões.

#### Pontuação escalonada por qualidade do registro (§ 7.0.5)
| Tipo de registro | Pontos |
|---|---|
| Nome do vinho só | **+5** |
| Nome + nota (estrelas) | **+8** |
| Nome + nota + foto do rótulo | **+10** |
| Nome + nota + foto + harmonização escrita | **+15** |
| Tudo acima + ocasião + companhia (completo) | **+20** |

#### Regras anti-farming
- **Cap diário**: 3 registros/dia pontuam. Do 4º em diante, **registra mas não pontua** (UX precisa avisar: "Você já registrou 3 vinhos hoje — esse entra no diário mas sem pontos").
- **Dedup**: mesmo vinho no mesmo dia conta 1 vez só (não pontua 2x).
- **Janela de reversão**: deletar registro em <24h reverte os pontos.

#### Relatório (§ 7.0.4)
- **Mensal** (estilo Wrapped): scroll storytelling, gera imagem 1080×1920 pra Stories. Disponível todo dia 1º do mês.
- **Anual** ("Seu 2026 no vinho"): retrospectiva de fim de ano. Disponível em dezembro.

### Gaps de UX que precisam virar trabalho

| Gap | Origem (US) | O que o protótipo já entrega | O que o time precisa fazer |
|---|---|---|---|
| **Taxonomia confusa** (4 conceitos misturados no app real) | — *(decisão Gabriel § 7.0.1)* | Banner "Onde fica o quê" + chips Favoritos/Wishlist + pílula inline em cada aba (`shots/home-adega-estante.png` + `home-adega-estante-limpa.png`) | Plugar no app: banner dispensável (persiste em `localStorage['tc.adega.tax.dismissed']`) + chips de atalho sempre visíveis + pílula de definição em cada aba. |
| **Registro só via Adega** | US-201 (Registro Rápido 15s — parcial) | UX de registro rápido detalhada no M07 § 7.7 | Habilitar entry points fora da adega (feed, scanner-result, harmoniza-result). |
| **Sem relatório mensal** | US-203 ❌ / US-248 ❌ | RelatorioMensal (Wrapped) pronto no protótipo · M07 § 7.8 | Implementar agregação do mês + scheduler mensal pra notificação + gerar imagem 1080×1920. |
| **Sem retrospectiva anual** | — *(§ 7.0.4)* | "Seu 2026 no vinho" — decidido em junho | Disponibilizar em dezembro/2026. UX igual ao mensal, só com escopo maior. |
| **Sem card educacional pós-registro** | US-204 ❌ / US-250 🚫 (adiado) | M07 fala mas é placeholder | **Confirmar com produto se reativa**. Se sim, definir taxonomia de conteúdo (uva/região). |
| **Sem progresso/badges educacionais** | US-205 ❌ | Badges adiadas em massa (US-083 a US-091) | Cross M19 — quando pontuação entrar, badges entram junto. |
| **Sem sugestão de harmonização no registro** | US-207 ❌ | M07 + M10 cruzam | Pegar paladar do registro + chamar motor de harmoniza (M10). |
| **Sem quantidade por slot na Estante** | — *(§ 7.0.2)* | Slot multi-garrafa com badge ×N + botões +/− | Plugar UX no app real. Item da estante guarda `quantity` (campo extra mínimo). |
| **Sem filtros no diário** | US-247 ❌ | Diário tem busca textual; falta filtros por tipo/país/nota/data | Adicionar filter bar acima da timeline. |
| **Sem organização da estante (prateleira/região/temperatura)** | — *(§ 7.0.3)* | Decisão fechada: 3 dimensões | Sub-tabs OU filtro lateral. UX a desenhar em fase posterior. |
| **Sem janela de consumo** | US-305 🚫 (adiado) | "Esse vinho está no ponto / passando" — adiado | Confirmar com produto se reativa. |
| **Sem estatísticas no perfil** | US-249 ❌ | M14 perfil-eu já lista entry points | Plugar contadores reais (total vinhos, países, uvas, gasto). |
| **Adega Espelho (privacidade)** | US-307 🔄 No roadmap | "O que outros vão ver da minha adega" | UX a definir; conectar a privacy granular do M14. |
| **Sync offline** | — | Badge "Pendente" existe no diário mas sem fila de sync | Fila de retry quando volta online. |
| **Editar/excluir registro** | — | `more_vert` no card do diário é placeholder | Tela de editar + confirmação de excluir. |

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

### Regras de negócio canônicas (Gabriel jun/2026)

#### Modelo de taxa (§ 12.A.1)
| Método | Taxa cobrada do pagador | Como aparece na UI |
|---|---|---|
| **PIX (LACI)** | + **R$ 1,20 fixo** | "R$ 80,00 · taxa R$ 1,20 = total R$ 81,20" |
| **Cartão** | + **4%** | "R$ 80,00 · taxa 4% (R$ 3,20) = total R$ 83,20" |
| **Combinar com admin** | **Sem taxa** | "R$ 80,00 · total R$ 80,00" + badge **SEM TAXA** |

**Princípio de transparência:** taxa **sempre visível, separada do valor base**, em todos os pontos da jornada de pagamento. Nunca cobrar base+fee como número único.

**Pontos da UI que mostram a taxa:**
1. **`event-detalhe` → seção Detalhes → row "Valor"** — visível antes de tocar em Participar.
2. **`ParticiparSheet`** — caixa de aviso "+ taxa Tchin Tchin no próximo passo".
3. **`EscolherMetodoSheet`** — breakdown completo em cada opção (PIX/Cartão/Combinar).
4. **`PixLaciSheet`** — valor total no topo + decomposição "R$ X do evento + R$ Y taxa".
5. **CTA do método** — exibe total ("Continuar com LACI · R$ 81,20").

#### Fluxo PIX completo (jornada do usuário)
1. User toca **"Participar"** no event-detalhe → abre `ParticiparSheet`.
2. Confirma participação → abre `EscolherMetodoSheet` (LACI vs Combinar).
3. Escolhe **LACI** → vaga reservada por **2 horas** (após isso libera e expira).
4. Abre `PixLaciSheet` com QR code + copia-cola PIX + valor total = base + taxa.
5. User paga PIX externo (qualquer app de banco).
6. Confirmação automática chega via LACI/Celcoin → estado vira "pago".
7. App mostra `ConfirmadoBanner` "✓ Pagamento confirmado · Vaga garantida".
8. Endereço completo do evento é **liberado** (regra § 12.A.3 — 24h antes pra quem tem RSVP+pagamento ok).

#### Confraria PRIVADA + evento PAGO (regra especial)
- Cobrança **só rola depois que o admin aprovar** a solicitação.
- A gente **NUNCA** cobra antes da aprovação.
- UI mostra: "O pagamento (R$ X + taxa) só rola depois que o admin aprovar".

#### Reserva temporária da vaga
- Toca em "Participar (pago)" → vaga **reservada por 2 horas**.
- Se não paga em 2h, vaga libera automático.
- Banner contextual com countdown ("vaga reservada por 1h 47min").

#### 3 janelas de cancelamento pós-pago (§ 12.0.x)
| Janela | Política |
|---|---|
| **> 24h antes do evento** | Reembolso integral via LACI |
| **24h–2h antes** | Crédito em **Pontos Tchin** (valor base × 1.0, sem taxa) |
| **< 2h antes** | Sem reembolso, registra como "não compareceu" |

#### Endereço — sempre 24h antes (§ 12.A.3)
- **Regra fixa, não-configurável** pelo organizador.
- Quem confirmou + pagou vê o endereço completo 24h antes.
- Quem não confirmou vê só UF + Cidade.
- Sem opções de "X dias antes" pelo admin — uniformidade total.

#### Split dinâmico — backlog (§ 12.A.2)
- MVP usa **valor fixo por pessoa**. "Gastei R$400 + R$100, divide entre 6" fica em backlog **EV-SPLIT-DYNAMIC**.

### Gaps de UX que precisam virar trabalho

| Gap | Origem (US) | O que o protótipo já entrega | O que o time precisa fazer |
|---|---|---|---|
| **Taxa não é visível no app real** | — *(§ 12.A.1)* | Row "Valor" no event-detalhe + breakdown em todos os sheets (`shots/event-detalhe.png` + `event-sheet-metodo.png`) | Plugar: mostrar base + taxa + total separados em todos os 5 pontos da jornada. |
| **Lembretes incompletos** | US-168 ⚠️ Parcial | Doc M12 lista janelas (D-7/D-1/2h) | Faltam: lembrete D-7 · customização de texto pelo admin · desativar lembretes específicos · "lembrete especial" (personalizado pelo organizador). |
| **Check-in sem QR único** | US-169 ⚠️ Parcial | M12 fala MVP1 (manual) + MVP1.5 (QR) + v2 (geo) | Implementar QR único por evento. Auto check-in adiado. Pontos no check-in dependem de F4. |
| **Registro de vinhos do evento incompleto** | US-170 ⚠️ Parcial | M12 doc Pós-evento + ata | Faltam: campo "Quem trouxe" · **nota coletiva** (média das individuais) · comentários dos participantes · preço pago (alimenta rachão) · fotos múltiplas. |
| **Rachão incompleto** | US-173 ⚠️ Parcial | M12 § 12.A.2 mantém valor fixo no MVP — split dinâmico backlog | Input de custos do evento (vinhos/comida/local/outros) + divisão igualitária (total / presentes) + campo "quem já pagou antecipado" (desconta do total). |
| **Status de pagamento individual** | US-174 ❌ | Aba Pagamentos do `evento-presenca` mostra estados | Plugar visual real por participante (pendente/pago/falhou/expirado). |
| **Cobrança não-constrangedora** | US-175 ❌ | M12 doc fala em nudge sutil | Sequência: D-3 in-app inline → D-1 push pessoal → 2h antes alerta ao admin (não pro pendente, pra evitar constrangimento). |
| **Convite por link com tracking** | US-164 + US-191 ⚠️ Parcial | M12 + M16 indicação | Link existe; falta: tracking de cliques · expiração · "enviado por X" · funcionar pra quem **não tem o app** (cair em landing → install → deep link pro evento) · preview customizável. |
| **Endereço só após pagamento** | — *(§ 12.A.3)* | Regra documentada | Aplicar gate: só mostra endereço completo se `payment_status === 'paid'` E `event.start_at - now < 24h`. |
| **Reserva de 2h** | — | Banner contextual com countdown | Implementar timer + libera vaga automaticamente. |
| **3 janelas de cancelamento** | — *(§ 12.0.x)* | `CancelarSheet` no protótipo com 3 variações | Plugar lógica + UI da janela atual. |
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

### Regras de negócio canônicas (Gabriel jun/2026)

#### Seguir — depende da privacidade (§ 14.1)
- **Perfil público** (default): assimétrico, sem aprovação (estilo Twitter).
- **Perfil privado**: bilateral, precisa de aprovação. "Solicitar pra seguir" enquanto não foi aceito.

#### @handle (§ 14.2)
- Editável **com cooldown de 30 dias** entre mudanças.
- Sem limite total de vezes (só o cooldown entre cada).
- **Handles reservados** (não disponíveis pra user comum): `admin`, `tchin`, `sommelier`, `expert`, `tchin-oficial`.
- Validação no `editar-perfil-foto`: se trocou há <30 dias, mostra "Você poderá trocar em N dias".

#### Perfil próprio como rota dedicada (§ 14.3)
- Vira **rota cheia `perfil-eu`** (não mais bottom sheet/drawer).
- Acessível pelo avatar do header (tap) e por deep link.
- Tem identity card destacado + chips de ação (Editar/Conquistas/Pontos) + todas as seções do antigo drawer.

#### Privacy granular (cross com M07 e M17)
Cada user controla quem vê cada seção do perfil:
| Seção | Opções de visibilidade |
|---|---|
| **Diário** | Público · Seguidores · Privado |
| **Confrarias** | Público · Seguidores · Privado |
| **Paladar** | Público · Seguidores · Privado |
| **Adega Espelho** (US-307) | Público · Seguidores · Privado |
| **DM (M17 § 17.0.1)** | Qualquer um · Quem eu sigo · Mesma confraria · Misto · Ninguém |

#### Bloquear (já existe na Sprint 10) — efeitos
- Quem bloqueou **não vê mais** posts/comentários do bloqueado.
- Bloqueado **não consegue** seguir, comentar, mandar DM.
- DM existente **some** dos dois lados (não some do servidor — fica oculto).

### Gaps de UX que precisam virar trabalho

| Gap | Origem (US) | O que o protótipo já entrega | O que o time precisa fazer |
|---|---|---|---|
| **Perfil próprio em sheet/drawer (não rota)** | — *(§ 14.3)* | Rota dedicada `perfil-eu` (`PerfilEuScreen`) com identity card + 3 chips de ação + seções completas (`shots/perfil-eu.png`) | Plugar no app real: avatar do header abre `perfil-eu` (rota), não sheet. Drawer pode ficar como atalho secundário. |
| **Nível de conhecimento visível** | US-050 🚫 (adiado) | Chip "Iniciante/Intermediário/Enófilo/Expert" no identity card | Decisão de produto: reativar? O protótipo mostra. |
| **Barra de progresso "X pts pro próximo nível"** | US-056 🚫 (adiado) | Depende de F4 | Reativar junto com pontuação. |
| **Badges no perfil (grid 2×3)** | US-057 / US-058 🚫 (adiado) | M14 § 14.6 — `badges-galeria` linkado | Reativar junto com pontuação. |
| **Minha Biblioteca (posts salvos)** | US-059 🚫 (adiado) | M14 menciona | Decisão de produto. |
| **@handle com cooldown 30d** | — *(§ 14.2)* | M14 § 14.0 documenta regra | Adicionar validação no `editar-perfil` + lista de handles reservados + mensagem "Você poderá trocar em N dias". |
| **Seguir bilateral em perfis privados** | — *(§ 14.1)* | M14 § 14.0 documenta regra | Status `pending` na relação follow quando target é privado + fila de solicitações no perfil. |
| **Privacy granular não-enforced** | US-301 (Wishlist privacy) 🚫 + privacy M14 | M14 § 14.2 — tela `editar-perfil-privacidade` | Aplicar a regra: quem não está autorizado **não vê** a seção restrita (não é só esconder no front). |
| **Notificação push de comentários** | US-103 ⚠️ Parcial | M18 catálogo de notifs | Plugar — outras notifs (like, badge) já estão. |
| **Bloquear/denunciar real** | US-159 ✅ (reportar) + denúncia perfil ❌ | M14 fala "DENUNCIA_TAXONOMIA" mas sem tela | Tela de denunciar usuário (taxonomia já existe: spam · conteúdo inapropriado · assédio · fake · outro). |
| **Sugestões de quem seguir** | — | M14 § 14.5 `perfil-sugestoes` | Algoritmo: pessoas em comum (confraria) + paladar similar (% de match) + amigos de amigos. |

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

### Regras de negócio canônicas (Gabriel jun/2026)

#### Princípios
- **Moeda única** — Pontos Tchin. (XP do Treino vira só placar da Liga, não moeda separada.)
- **Transparente e auditável** — usuário vê tudo (saldo, extrato, tabela mestra de ganho).
- **Anti-pegadinha** — cap, expiração, regras anti-fraude tudo visível na aba "Como funcionam".

#### Conversão e resgate
- **10 pts = R$ 1,00** (referência base).
- **Resgates por crédito no marketplace**: 300 pts = R$ 30 · 600 pts = R$ 60 · 1000 pts = R$ 100.
- **Vinhos resgatáveis grátis**: vinhos de entrada com `price ≤ R$ 80` (`freeWineMaxPriceBRL`). **Custo absorvido pela Tchin** (não fura margem do parceiro).
- **Experiências**: voucher pra Marketplace de Experiência (F5).

#### Expiração
- Pontos expiram em **12 meses de inatividade** (saldo zerado após 1 ano sem mexer).
- Avisos: **D-30**, **D-7**, **D-1** antes da expiração (push + in-app).
- Hero da `/pontos` mostra "X pts expiram em jan/2027".

#### Anti-fraude (server-side)
- **Cap diário** por ação (varia por tipo — ver tabela mestra abaixo).
- **Cap por entidade** (ex.: 1 vez por evento, 1 vez por post).
- **Cap total** (ex.: indicação tem teto 25 — § 16.0).
- **Dedup** por ação+entidade — não pontua o mesmo evento 2x.
- **Janela de reversão** — deletar ação em <24h reverte os pontos.
- **Validação server-side** — UI mostra "pts a ganhar" mas o servidor confirma se o cap permite. Outliers vão pra revisão manual.

#### Tabela mestra de ganho (24 linhas, 6 grupos)

**Registro de vinho (M07)**
| Ação | Pts | Cap | Ref |
|---|---|---|---|
| Registrar nome do vinho | +5 | 3/dia | M07 |
| + nota (1-5 estrelas) | +8 | 3/dia | M07 |
| + foto do rótulo | +10 | 3/dia | M07 |
| + harmonização | +15 | 3/dia | M07 |
| Registro completo | +20 | 3/dia | M07 |
| Contribuir vinho novo na base | +15 | 5/dia | M06 |

**Treine seu Paladar (M08)**
| Ação | Pts | Cap | Ref |
|---|---|---|---|
| Lição concluída | +15 | sem limite | M08 |
| Streak diário (a cada 7d) | +50 | semanal | M08 |
| Subir de divisão na Liga | +100 | por divisão | M08 |

**Confrarias & Eventos**
| Ação | Pts | Cap | Ref |
|---|---|---|---|
| Participar de evento (check-in) | +30 | 1/evento | M12 |
| Avaliar evento depois | +20 | 1/evento | M12 |
| Organizar evento | +50 | 1/evento | M12 |
| Criar confraria | +100 | 1x na vida | M11 |

**Comunidade & Social**
| Ação | Pts | Cap | Ref |
|---|---|---|---|
| Post no feed | +5 | 3/dia | M13 |
| Receber 10 curtidas num post | +10 | 1/post | M13 |
| Comentário relevante (com curtidas) | +3 | 5/dia | M13 |
| Seguir alguém | +2 | 10/semana | M14 |

**Aprenda & Q&A**
| Ação | Pts | Cap | Ref |
|---|---|---|---|
| Artigo lido até o fim | +5 | 3/dia | M09 |
| Pergunta no Q&A | +3 | 5/semana | M15 |
| Resposta de expert (com curtidas) | +10 | 1/resposta | M15 |

**Marcos e Indicação**
| Ação | Pts | Cap | Ref |
|---|---|---|---|
| Marco: criou conta | +50 | 1x | M19 |
| Marco: primeiro vinho registrado | +25 | 1x | M19 |
| Amigo aceitou seu convite | +100 | teto 25 (§ 16.0.2) | M16 |
| Desafio da semana cumprido | +50 | semanal | M19 |

#### Onde os Pontos aparecem na UI
1. **Toast** após cada ação pontuada ("+10 pontos! Vinho salvo no seu diário").
2. **Jornada** (`/jornada`) — marcos de progresso.
3. **Carteira `/pontos`** com 4 abas: Resgatar · Ganhar · Extrato · Como funcionam 🆕.
4. **Onboarding `welcome-final`** — 1 menção sutil (pílula clicável "Você ganha pontos por usar o app · entenda").
5. **Perfil-eu** — chip de saldo no identity card.

### O que o protótipo já entrega

| Item | Onde |
|---|---|
| Carteira `/pontos` com saldo + 4 abas | M19 § 19.4 |
| **4ª aba "Como funcionam"** com tabela mestra de 24 linhas em 6 grupos | M19 § 19.0.1 (`shots/pontos-como-funcionam.png`) |
| Onboarding sutil em `welcome-final` ("Você ganha pontos por usar o app · entenda") | M19 § 19.0.2 |
| Tabela canônica de pontos por ação (`PONTOS_TABELA`) | M19 § 19.0 + tabela acima |
| Anti-fraude documentado (cap 3/dia, dedup, expiração 12m) | M19 § 19.0.3 |
| 3 categorias de resgate (crédito · vinho grátis · experiência) | M19 § 19.4 |

### Decisão necessária

**Gabriel + produto:** reativar o épico de pontos? Sem ele:
- Toda a mecânica de retenção (jornada, desafios, marcos, celebrações) fica cosmética.
- Marketplace de Experiência (F5) perde uma das moedas (resgate via pontos).
- Badges (F3) ficam vazios — sem trigger.

Se sim, a **UX já está pronta** no protótipo. Resta plugar:
- Cada ação do app dispara o ganho (lista acima de 24 linhas).
- Validação anti-farming (caps + dedup).
- 3 categorias de resgate.

### Mapeamento — onde cada ação pontuada já existe no app

| Grupo | Ação | US relacionada (no app hoje) | Trigger |
|---|---|---|---|
| Registro de vinho | Registrar nome | US-060 Salvar na Adega ✅ | já existe — só falta pontuação |
| Registro de vinho | + nota + foto + harmonização | US-062 nota ✅ · foto via scanner US-031 ⚠️ | já existe — só falta pontuação |
| Treine | Lição concluída | M08 — fora do escopo dessas USs | dependência M08 |
| Confrarias | Participar de evento | US-167 RSVP ✅ + US-169 check-in ⚠️ | já existe — só falta pontuação |
| Comunidade | Post no feed | US-011 ✅ | já existe — só falta pontuação |
| Comunidade | Comentário relevante | US-013 ⚠️ Parcial | já existe — só falta pontuação |
| Marcos | Criou conta | US-001 ✅ + US-002 SSO ✅ | trigger imediato |
| Indicação | Amigo aceitou | US-191 Link de convite ⚠️ Parcial | depende de tracking que está parcial |

---

## F5 — Marketplace de Experiência (M04/M11)

### Situação

Conceito **novo do Gabriel jun/2026**. Não existe no app real ainda como sub-feature unificada.

### Regras de negócio canônicas (Gabriel jun/2026)

#### Princípio
Facilitador pro **dono de confraria** montar a experiência completa do grupo (locais, vinícolas, fornecedores, conteúdo). Nasce de uma dor real: admin gasta tempo procurando onde fazer evento, qual vinícola visitar, que kit comprar.

#### Onde aparece
- **`confraria-detalhe` ganha 5ª aba "Experiência"** (junto de Eventos · Publicações · Membros · Adega).
- **`home/Descobrir`** ganha um **sub-hub "Experiências"** (entre Recomendações e Marketplace).

#### 6 categorias (pago e gratuito)

| Categoria | Exemplos pagos | Exemplos gratuitos |
|---|---|---|
| **Vinícolas & enoturismo** | Visitas guiadas, degustações, hospedagem | Lista/mapa de vinícolas próximas, contato |
| **Locais pra encontro** | Aluguel de wine bar, espaços parceiros | Bares públicos, restaurantes com taxa de rolha |
| **Kits & curadoria** | Kits curados (3, 6, 12 vinhos), assinatura | Lista "10 vinhos pra começar" |
| **Conteúdo & templates** | Mentoria com sommelier, agenciamento de evento | Templates de evento, post-templates, playlists |
| **Equipamentos** | Taças, decanters, acessórios parceiros | Tutoriais de armazenamento, guia de taças |
| **Serviços** | Sommelier presencial, fotografia do evento | Calculadora de quantidade por pessoa |

#### Lógica de aplicabilidade
- **Pago** → comprado via marketplace normal (carrinho do M05, taxa do M12, comissão da Tchin).
- **Gratuito** → liberado pra qualquer membro de confraria; alguns liberados também por **Pontos Tchin** (cross M19) ou por **Cristais do Treino** (cross M08).
- **Cristais ↔ Pontos** — Cristais do Treino podem virar benefícios na Experiência (ex.: desconto em kit, voucher de visita). Taxa de conversão default: **1 cristal = 5 pts** (calibrar).
- **Admin de confraria** ganha dashboard simplificado: "Pra próximo evento, sugiro estas 3 vinícolas perto + este kit + este local" → CTA **"Montar kit pro próximo evento"**.

#### Modelo de receita
- **Comissão padrão**: ~15% sobre produtos pagos (configurável por parceiro).
- **"Selo Tchin Verificado"** pago pra parceiros — vinícolas/locais ganham destaque visual + sobe na ordenação. Taxa mensal pelo selo.
- **Tchin Picks** (curadoria editorial pela Tchin) — comissão maior (~25%) em troca de destaque na home.
- **Cross com US-117** ("Parceiro Verificado" do comerciante já existe ✅) — pode evoluir pra Selo Tchin Verificado.

#### Voucher e resgate
- Cada compra gera um **voucher único** (código `TCHIN-XXX-1234`).
- Parceiro escaneia QR ou recebe código pra confirmar uso.
- Voucher tem **validade** (depende da oferta — ex.: visita à vinícola = 90 dias).
- **Inventário**: oferta pode ter limite (ex.: "5 vagas por dia") ou ilimitado.

#### Pré-cadastro (lançamento)
Antes de soltar pra base de usuários, **curadoria humana inicial**:
- Pré-cadastrar **20 parceiros iniciais** (foco DF e SP):
  - ~10 vinícolas brasileiras (Serra Gaúcha, Vale dos Vinhedos)
  - ~5 wine bars / restaurantes parceiros
  - ~5 fornecedores de kit (importadoras, lojas especializadas)
- Sem curadoria, a aba vai aparecer vazia e queimar o conceito.

### O que existe parcialmente que serve de base

| US | Descrição | Status | Como conecta com F5 |
|---|---|---|---|
| US-117 | Badge "Parceiro Verificado" do comerciante | ✅ | Vira "Selo Tchin Verificado" |
| US-120 | Comerciante cria post de produto | ✅ | Vira "oferta" da categoria Equipamentos/Kits |
| US-121 | Carrossel de até 5 fotos por produto | ✅ | Reaproveita layout |
| US-122 | Tags do produto (uva, região, tipo, faixa de preço) | ✅ | Vira metadados da oferta |
| US-128 | Comerciante cria confraria própria | ✅ | Vira parceiro do tipo "Comerciante" |
| US-155 | Catálogo (vitrine de até 20 produtos fixos) | ✅ | Vira página do parceiro |
| US-156 | Clicar em produto → detalhes + botão compra | ✅ | Fluxo de compra reaproveitável |
| US-152 | Botão CTA customizável ("Comprar", "Saiba Mais", "Peça Agora") | ✅ | Adicionar variantes de CTA Experiência |

### O que o protótipo já entrega

- **5ª aba "Experiência"** em `confraria-detalhe` (`ExperienciaTab`) com 6 categorias (Vinícolas / Locais / Kits / Conteúdo / Equipamentos / Serviços), destaques pagos+grátis, CTA admin "Montar kit pro próximo evento" — `shots/confraria-detalhe-experiencia.png`.
- **Card destacado** "Marketplace de Experiência" no DescobrirHome (gradiente âmbar→burgundy + badge NOVO) — `shots/descobrir-com-experiencia.png`.

### Gaps pra virar feature real

| Gap | Decisão Gabriel | O que o time precisa fazer |
|---|---|---|
| Sub-hub em `/descobrir` | M04 § 4.0.3 | Decidir: rota dedicada vs aba. UX a desenhar. |
| Cadastro de parceiros | M04 § 4.0.3 | Curadoria manual primeiros 20 (vinícolas DF/SP + 5 fornecedores de kit). |
| Diferenciação ofertas pagas vs grátis | M04 § 4.0.3 | Badge GRÁTIS já no protótipo, plugar lógica de gating. |
| Pagamento de oferta | Cross M05 (carrinho) + M12 (taxa) | Reusar checkout que já existe (US-156). |
| Resgate via pontos / cristais | Cross M08 (cristais) + M19 (pontos) | Depende de F4 estar de pé. Definir taxa de conversão 1 cristal = N pts. |
| Voucher com QR | — | Gerar código único + tela "Mostre ao parceiro" + escaneamento pelo parceiro. |
| Validade do voucher | — | Cada oferta define (visita = 90 dias, kit = sem validade). |
| Inventário | — | Oferta pode ter limite ("5 vagas/dia") ou ilimitado. |
| "Selo Tchin Verificado" pra parceiros | M04 § 4.0.3 | Cross com US-117 ("Parceiro Verificado" do comerciante ✅). |
| "Montar kit pro próximo evento" pro admin | M11 ExperienciaTab + M12 § 12.0.x | UX a desenhar na próxima sessão — combinar local + kit + serviços num pacote. |
| Tchin Picks (curadoria editorial) | M04 § 4.0.3 | Definir editorial (mensal? semanal?) + UI de destaque na home. |
| Página do parceiro | — | Layout: capa + descrição + ofertas + selo + avaliações dos membros. |

### USs vizinhas pendentes que vão se cruzar
- US-184 Catálogo de Parceiros por Tier 🚫 (adiado) — provavelmente reativar como parte de F5.
- US-185 Eventos Patrocinados 🚫 (adiado) — sub-feature de F5.
- US-138 Impulsionar post ❌ — modelo de receita análogo (boost).
- US-142 Boosts avulsos (R$ 50) ❌ — modelo de receita análogo.

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
