# Módulo 12 — Eventos

> O **momento** da confraria: encontro pra abrir garrafas juntos. Criar (wizard 5 passos) → divulgar → RSVP → gerenciar presença + **pagamentos/rachão (LACI)** → pós-evento (avaliar vinhos + ata). É o que transforma grupo em comunidade ativa.
> **Fonte de verdade:** `screens-event-wizard-p1…p5.jsx` (wizard), `screens-event-detalhe.jsx` (`EventDetalheScreen`), `screens-organizador.jsx` (`EventoEditarScreen` + `EventoPresencaScreen` + `EventoPosAvaliarScreen` + `EventoPosAtaScreen`), `screens-resumo-pos-evento.jsx` (card de resumo). Doc funcional: **MVP2 Épico 2** + **MVP2 Épico 3 (Financeiro/Rachão)** + **Sprint 11-13 Épico T5**.
> **Épicos/US:** US-EV-01 (criar — wizard), US-EV-02 (detalhe + RSVP), US-EV-03 (editar), US-EV-04 (presença/check-in), US-EV-05 (pagamentos/rachão — LACI/Celcoin), US-EV-06 (pós: avaliar vinhos), US-EV-07 (pós: ata), US-EV-08 (resumo pós-evento no feed).

**Regra de negócio canônica:** evento é criado por admin da confraria (wizard 5 passos). Pode ser **gratuito** ou **valor fixo por pessoa** (sem split dinâmico no MVP). RSVP: Vou / Talvez / Não vou (em pago só Vou/Não vou — sem Talvez). Privacidade **herdada da confraria** (não há flag por evento). Pagamento via **LACI** (reconhecimento automático) ou **fora do LACI** (PIX externo / dinheiro no local, admin confirma). Endereço sempre liberado **24h antes** (regra fixa, não-configurável). Pós-evento: avaliar vinhos + publicar ata. Pontos só pra quem fez **check-in real**.

---

## 🆕 § 12.A Decisões fechadas restantes (Gabriel, junho/2026)

### 12.A.1 Modelo de receita — repasse de taxa, sem comissão Tchin no MVP
> **Princípio:** manter a base do app sustentável (BaaS) **sem cobrar a confraria/admin**. A taxa cobre custo bancário + uma pequena margem.

| Método | Taxa cobrada do pagador | Como aparece na UI |
|---|---|---|
| **PIX (LACI)** | + **R$ 1,20 fixo** sobre o valor do evento | "R$ 80,00 · taxa R$ 1,20 = total R$ 81,20" |
| **Cartão** | + **4%** sobre o valor do evento | "R$ 80,00 · taxa 4% (R$ 3,20) = total R$ 83,20" |

**Como funciona:**
- Custo PIX real ≈ R$ 1,00 → margem Tchin ≈ R$ 0,20 por transação.
- Custo cartão real ≈ 3,5% → margem Tchin ≈ 0,5% por transação.
- Taxa sempre **visível e separada** no checkout do RSVP (transparência).
- Quando o admin define o valor do evento, vê o **breakdown**: "Cada participante paga R$ X + taxa (PIX) ou + taxa (cartão)".

### 12.A.2 Split dinâmico — backlog
**Só valor fixo por pessoa no MVP.** Split dinâmico ("gastei R$400 + R$100, divide entre 6") fica em **backlog EV-SPLIT-DYNAMIC** (M12 § 12.4 já marcado).

### 12.A.3 Endereço — sempre 24h antes, fixo
**Regra fixa, não-configurável pelo organizador.** Quem confirmou + pagou vê o endereço 24h antes do evento. Quem não confirmou vê só UF+Cidade. Sem opções de "X dias antes" — uniformidade total da regra (mais simples de comunicar e auditar).

---

## 12.0 🆕 Modelo canônico — Aba Eventos, RSVP, Pagamento, Cancelamento (✅ Gabriel definiu)

### 12.0.1 Dois locais de listagem de eventos
| Local | Conteúdo | Tem segmented Meus/Descobrir? |
|---|---|---|
| **A.** `home/confrarias › aba Eventos` *(global)* | Eventos de todas as confrarias | **SIM** — Meus / Descobrir |
| **B.** `confraria-detalhe › aba Eventos` *(local)* | Só eventos daquela confraria | **NÃO** — só chips Próximos / Passados |

### 12.0.2 Eixos de filtro na aba Eventos global (A)
**Eixo de escopo** (segmented no topo): **Meus eventos** | **Descobrir eventos**
**Eixo de status** (chips abaixo): **Próximos** | **Andamento** | **Finalizados** *(em "Descobrir", "Finalizados" some)*

**Default ao abrir:** Meus eventos → Próximos.

**"Meus eventos" =** união de:
- Eventos das confrarias que sou **membro** (qualquer status: próximos, andamento, finalizados — histórico vale).
- Eventos onde dei **RSVP "Vou"** (mesmo se entrei na confraria só por causa do evento).

**"Descobrir eventos" =** evento aparece se TODAS forem verdadeiras:
- `data_inicio ≥ agora` (futuro) OU está em janela de andamento.
- **Eu NÃO sou membro** da confraria (evita duplicar com Meus).
- Confraria pode ser Pública ou Privada (ambas entram).
- "Perto de mim" é **opt-in** (filtro que aparece como dropdown — não é ordenação por distância nem mostra km).

### 12.0.3 Ordenação
**Sempre cronológica** (mais cedo primeiro). Vale com ou sem localização. **Não existe "mais perto"** em lugar nenhum da UI.
- Desempate de mesma data/hora: ordem de criação (mais antigo primeiro).
- Evento "Em andamento" **sobe pro topo de Próximos** enquanto durar a janela (apenas em "Meus") — não troca de chip, só destaque visual com badge "Acontecendo agora". Visão dedicada do andamento fica no chip "Andamento".

### 12.0.4 Card e detalhe do evento
**Card** (em qualquer listagem): capa, título, data/hora, local. Em "Descobrir" mostra **`Origem · {Confraria}`**. **Não mostra:** distância em km, "Quem vai", selo de RSVP.
**Detalhe (`event-detalhe`):** descrição, **Adega do evento** (vinhos), organizador, local, vagas, lista de confirmados, botão Participar.

**Privada · não-membro:** endereço aparece como **UF + Cidade**; lista nominal de confirmados **oculta**; só número total agregado. Tudo libera após aprovação.

### 12.0.5 Ação Participar (o portão)
| Confraria | Ao tocar "Participar" |
|---|---|
| **Pública** | Abre modal "Participar do evento" com consentimento explícito: *"Ao confirmar, você participa de {evento} e entra na confraria {nome}"*. RSVP entra na hora. |
| **Privada** | Abre modal "Solicitar para participar" → envia solicitação ao admin. Admin aprova evento + entrada de uma vez. Reusa fluxo `join_request` existente. **Pagamento (se houver) só rola após aprovação** — nunca cobramos antes. |

### 12.0.6 RSVP (Vou / Talvez / Não vou)
| Tipo de evento | Quem pode ver | Vou | Talvez | Não vou |
|---|---|---|---|---|
| Gratuito · Pública | Qualquer usuário | ✅ | ✅ | ✅ |
| Gratuito · Privada (membro) | Membro | ✅ | ✅ | ✅ |
| Gratuito · Privada (não-membro) | Não-membro | passa por "Solicitar" | ❌ | ❌ |
| **Pago · Pública** | Qualquer usuário | ✅ (+ pagar) | **❌ não existe** | ✅ |
| **Pago · Privada (membro)** | Membro | ✅ (+ pagar) | **❌** | ✅ |
| Pago · Privada (não-membro) | Não-membro | "Solicitar" | ❌ | ❌ |

**Regras:**
- Inscrição = "Vou" automaticamente. "Talvez" e "Não vou" **não ocupam vaga**.
- "Talvez" só existe em evento gratuito (gera ambiguidade em pago).
- Membro pode mudar a resposta **até 2h antes** (depois disso vai pra fluxo de cancelamento — § 12.0.10).

### 12.0.7 Estados do RSVP × Pagamento (em evento pago)
| Estado | Quando | Vaga |
|---|---|---|
| **Vou — vaga provisória** | Confirmou, ainda não escolheu método ou desistiu do PIX | Reservada por **2h** |
| **Vou — Aguardando PIX (LACI)** | Gerou QR LACI, aguardando webhook | Reservada (timer 30min) |
| **Vou — Aguardando admin** | Escolheu "Pagar fora" (PIX externo / dinheiro no local) | Reservada até **24h antes** do evento |
| **Vou — ✓ Pago** | Webhook LACI OK ou admin marcou | Consolidada — endereço + lista liberados |
| **Vou — Pagamento expirado** | PIX expirou ou prazo manual venceu | Liberada pra lista de espera |
| Talvez / Não vou | RSVP sem pagar | — |

### 12.0.8 Fluxo de pagamento (3 sheets + 4 estados no event-detalhe)
**Sheets (em sequência):**
1. **Modal Participar** → "+ R$ X" no botão. RSVP "Vou" leva pra step 2.
2. **Sheet Escolher método** → LACI (recomendado, instantâneo) **ou** Pagar fora (PIX externo / dinheiro no local; "no local" só pra modalidade presencial/híbrida).
3. **Sheet do método escolhido:**
   - **PIX LACI** → QR + copia/cola + timer (30min). Webhook confirma automático. Banner "Pode fechar — a gente avisa".
   - **Pagar fora** → instruções do admin (chave PIX dele / no local) + nota "Sua vaga é provisória até o admin marcar".

**3 caminhos paralelos pra fechar o loop quando o user não está mais na tela:**
1. **Push** (M18 catalog): `payment_confirmed_laci`, `payment_confirmed_manual`, `payment_expired`, `payment_pending_reminder` (D-3 + 6h antes).
2. **Banner ao reabrir o app** se houver confirmação desde a última visita.
3. **Estado no event-detalhe** sempre reflete a verdade (Aguardando PIX / Aguardando admin / Pago / Expirado).

### 12.0.9 Lista de espera
- Evento lotado → botão muda pra **"Entrar na lista de espera"**.
- Quando alguém cancela: **1º da fila é promovido** pra "Aguardando pagamento" + push "🎉 Vaga liberou — confirma em 6h".
- **Prazo do promovido: 6h** pra escolher método e iniciar pagamento. Se não, volta pro fim da fila e próximo é chamado.
- Lista de espera fecha **2h antes do evento** (sem tempo útil pra promover).
- Cancelar da própria lista de espera: livre, sem fricção.

### 12.0.10 Cancelamento depois de pago — 3 janelas
| Janela | Pode mudar pra "Não vou"? | R$ | Vaga |
|---|---|---|---|
| **> 24h antes** | ✅ Livre | **Reembolso integral** mesmo método (LACI estorna; pago fora → admin estorna) | Libera pra lista de espera |
| **24h–2h antes** | ⚠️ Com fricção | **Sem dinheiro de volta — vira crédito em Pontos Tchin** (R$80 = 800 pts, taxa M19) | Libera se houver tempo |
| **< 2h antes ou em andamento** | ❌ Não dá | Sem reembolso, sem crédito | Vaga reservada · **registra como falta** |

**Exceções (override do prazo):**
- Evento cancelado pelo admin → **reembolso integral em dinheiro sempre**, qualquer janela.
- Caso humano → admin pode aprovar reembolso manual em `evento-presenca › Pagamentos`.

### 12.0.11 Confirmação, lembretes e cancelamento do evento
**Após RSVP "Vou" confirmado:**
- Modal de sucesso + **iCal** (add ao calendário) + e-mail de confirmação.

**Lembretes (push — respeitam quiet hours 22h–8h, exceto o de 2h):**
- **D-7** → confirmados.
- **D-3** → só "Talvez" / sem resposta.
- **D-1** → confirmados + Talvez.
- **2h antes** → só confirmados (única notif que fura quiet hours).
- Quem marcou "Não vou" não recebe nada.

**Evento cancelado pelo admin:**
- Cancela lembretes pendentes.
- Push de cancelamento na hora pros confirmados.
- Reembolso integral automático (todos os métodos).

### 12.0.12 Andamento e check-in
Na janela do evento, estado vira **"Acontecendo agora"** e libera check-in. **3 métodos:**
- **Manual** (admin marca cada nome em `evento-presenca`). **MVP1**.
- **QR code** — admin gera QR estável durante a janela; participante escaneia com o app. **MVP1.5**.
- **Geolocalização** — botão "Cheguei" + verificação no raio de 80m. **v2** (precisão indoor é instável; valida-se depois).

### 12.0.13 Pós-evento
- Vai pro histórico em "Meus eventos → Finalizados".
- Libera:
  - **Avaliar vinhos** → diário (M07) + média da confraria.
  - **Ata** (foto do grupo + destaques + próximo passo) → post no mural.
  - **Fotos do evento** 🆕 (entidade `EventPhoto`): só quem fez **check-in** pode publicar. Layout = grade no event-detalhe + opção "compartilhar no mural" vira post regular.
  - **Pontos por participação** (M19) — só com check-in real.
  - **Ranking de participação** 🆕 (interno da confraria) — ordenado por nº de check-ins reais nos últimos 12 meses. Aparece em `confraria-detalhe › aba Membros` (card "Top 3").

### 12.0.14 Saída da confraria e cancelar RSVP (ações separadas)
- **Cancelar RSVP** ≠ **Sair da confraria** — duas ações distintas.
- Quem entrou via evento sai da confraria normalmente em `confraria-detalhe › menu ⋯ › Sair`.
- Cancelar presença em um evento não tira o usuário da confraria.

### 12.0.15 Estados vazios (cold start)
- **Descobrir vazio** → empty state honesto: *"Ainda não tem evento perto de você. Crie uma confraria e seja o primeiro."* + CTA "Criar uma confraria". Nunca deixar tela só vazia.
- Não promover "Descobrir eventos" em campanha enquanto não houver evento real pra descobrir.

### 12.0.16 Regras de borda
- **Cancelar RSVP:** permitido até **24h antes** (depois entra no fluxo das 3 janelas).
- **Só admin/co-admin cria evento.**
- Evento só com **no mínimo 24h de antecedência** (exceção: hoje, se faltam mais de 4h).
- Membro com notificações desativadas no app não recebe lembrete (3 níveis: master switch · canal `eventos` · silenciar evento específico).

### 12.0.17 Analytics (North Star = eventos completados/mês)
Eventos a disparar:
`descobrir_evento_visto`, `evento_detalhe_aberto`, `rsvp_confirmado { origem: minha_confraria | descobrir }`,
`entrou_confraria_via_evento_publica`, `solicitacao_participacao_privada { status: enviada|aprovada|rejeitada }`,
`pagamento_metodo_escolhido { metodo }`, `pagamento_confirmado_laci`, `pagamento_confirmado_manual`,
`pagamento_expirado`, `lista_espera_entrou`, `lista_espera_promovido`,
`checkin_realizado { metodo: manual|qr|geo }`, `evento_completado`,
`rsvp_cancelado { janela: A|B|C, retorno: dinheiro|pontos|nada }`.
**Medir especialmente:** quem entrou via evento e voltou (membro ativo vs número inflado).

---



## Mapa do fluxo
```
[confraria P6 / aba Eventos / "Criar evento"] → event-wizard 1→2→3→4→5 → confraria-detalhe (justCreated)
   1 nome+tipo+capa · 2 data/hora/local · 3 vinhos (auto por paladar/manual/scanner) · 4 capacidade+pagamento+RSVP+lembretes · 5 revisar+publicar

event-detalhe ─┬─ RSVP (Confirmar/Talvez/Não vou)
               ├─ menu organizador: editar · gerenciar (presença/pagamentos) · ata · convidar · cancelar
               ├─ menu membro: chat · calendário · direções · compartilhar · silenciar · denunciar
               └─ [pós-evento] "Avaliar vinhos" → evento-pos-avaliar → evento-pos-ata

evento-presenca (admin): aba Presença (check-in) | aba Pagamentos (LACI/conta/manual, arrecadado/meta, cobrar, exportar CSV)
```

---

## 12.1 Wizard de criar evento (5 passos) ✅

_P1 nome/tipo · P2 quando/onde · P3 vinhos · P4 capacidade/pagamento · P5 revisar:_

<img src="shots/event-wizard-1.png" width="150"/> <img src="shots/event-wizard-2.png" width="150"/> <img src="shots/event-wizard-3.png" width="150"/> <img src="shots/event-wizard-4.png" width="150"/> <img src="shots/event-wizard-5.png" width="150"/>

**Propósito:** criar evento em 5 passos guiados. **US-EV-01.**
**Entradas:** confraria P6 ("Criar primeiro evento"); aba Eventos; detalhe → "Agendar próximo". **Saídas:** P5 publica → `confraria-detalhe { justCreated }`.

| Passo | Coleta | Destaques |
|---|---|---|
| **P1** | Nome (3-80) + tipo (degustação/jantar/festa/visita/outro) + capa | sugestões de nome; rascunho `tc.wizard.event.draft` |
| **P2** | Data + hora + modo (Presencial/Online) + endereço/link | default próximo sábado 19h; nota de privacidade do endereço |
| **P3** | Vinhos (manual / **sugestão auto por paladar** / scanner) | faixas de preço (budget/mid/premium); toggle "membros podem sugerir"; quiz inline se sem paladar |
| **P4** | Capacidade (2-50) + **pagamento (grátis / valor fixo por pessoa)** + RSVP (livre/aprovação) + lembretes (push 3d/1d/dia + email .ics) | CurrencyInput se pago |
| **P5** | Revisar + **Publicar** (async) | resumo completo; loading + erro |

**Persistência:** rascunho por passo em `tc.wizard.event.draft`.
**Analytics:** `publish_event_attempt`, `publish_event_success`, `brotherhood_event_p{n}`.

> **⚠️ DIVERGÊNCIA — vinhos não conectados ao custo.** P3 (vinhos) e P4 (pagamento) são independentes — o valor por pessoa é manual, não calculado a partir dos vinhos escolhidos. **Recomendação:** sugerir valor com base no custo dos vinhos ÷ capacidade. Backlog **EV-COST-FROM-WINES**.
> **⛔ FALTA NO APP (épico pede):** **upload de capa real** (placeholder gradiente). Backlog **EV-COVER-UPLOAD**.

**Status:** ✅

### 12.1.1 🆕 Templates de evento — capa, regras e local/horário (✅ definido)
Cada **tipo de evento** (P1) tem uma **capa padrão** (gradiente da marca — `EVENT_COVERS`/`COVER_BY_TYPE` em `event-covers.jsx`; o organizador pode trocar entre 6: Clássico/Tinto/Dourado/Jantar/Vinícola/Noturno) + **regras sugeridas** + **defaults de local/horário** que pré-preenchem o P2:

| Tipo | Capa padrão | Local sugerido | Horário default | Regras sugeridas (P2/P4) |
|---|---|---|---|---|
| **Degustação** | Clássico 🍷 | casa de um membro ou wine bar | sábado **19h** · ~2h | "Cada um traz 1 garrafa do tema (às cegas, no saco de papel)"; 1 taça/pessoa; água + pão |
| **Jantar** | Jantar 🍽️ | casa/restaurante | sex ou sáb **20h** · ~3h | harmonização por prato; cada um traz um vinho do tema; rateio do jantar |
| **Festa** | Dourado 🎉 | salão/casa | sex ou sáb **21h** · ~4h | espumante de boas-vindas; playlist colaborativa; dress code opcional |
| **Visita a vinícola** | Vinícola 🌿 | endereço da vinícola | domingo **10h** · dia | transporte combinado (caronas); levar meio de pagamento p/ compras; sem dirigir após degustar |
| **Outro** | Clássico | livre | sábado **19h** | livre (organizador define) |

- **Online** (modalidade) → sem endereço; campo vira **link** (Meet/Zoom) + "tragam a própria garrafa".
- **Privacidade do endereço:** endereço completo só liberado **24h antes** pra quem confirmou (ver 12.2).

### 12.1.2 🆕 Correlação confraria → template de evento (✅ definido)
Ao criar o 1º evento (vindo do P6 da confraria), o sistema **pré-seleciona** tipo + capa + nome a partir do **template da confraria** (P2). Em código: `eventPrefillFromTemplate(templateId)` + `suggestEventNames(type, tags)`.

| Template da confraria (P2) | → Tipo de evento | Capa | Nome sugerido (exemplo) |
|---|---|---|---|
| **Iniciantes bem-vindos** | Degustação | Clássico | "Primeira degustação dos {confraria}" |
| **Tintos do Mundo** | Degustação | Tinto | "Tintos do Mundo — rodada 1" |
| **Churrasco & Vinho** | Jantar | Jantar | "Churrasco harmonizado" |
| **Wine & Netflix** | Jantar (casual) | Noturno | "Wine & Netflix night" |
| **Girls Wine Night** | Festa | Dourado | "Girls Wine Night" |
| **Do zero** (sem template) | Degustação *(default)* | Clássico | sugerido pelas **tags** da confraria |

**Ordem de decisão:** (1) template da confraria → mapa acima; (2) se "Do zero", usa **tags** (ex.: tag "Espumantes" → festa/Dourado; "Portugal" → degustação/Tinto); (3) **modalidade** Online força link em vez de endereço. Tudo editável pelo organizador.

---

## 12.2 `event-detalhe` — Detalhe + RSVP ✅

<img src="shots/event-detalhe.png" width="240"/>

**Propósito:** página do evento — info + RSVP + quem vai + vinhos + organizador + ações. **US-EV-02.**
**Entradas:** card de evento (confraria/home); pós-criação. **Saídas:** RSVP; menu → editar/presença/ata/chat; "Avaliar vinhos" (pós) → `evento-pos-avaliar`.

**Layout (`EventDetalheScreen`):**
- Hero (gradiente por tipo) + pills: data ("SEGUNDA, 18 MAI") · modalidade ("Presencial").
- Título ("Degustação às cegas — Malbecs") + confraria.
- **"VOCÊ VAI?"** — RSVP: **Confirmar** / Talvez / Não vou.
- **Detalhes**: Quando · Onde ("Endereço completo será enviado 24h antes." se não-confirmado) · Anfitrião.
- **Quem vai (N)** — stack de avatares + "Ver todos".
- Vinhos sugeridos + descrição + lembretes.
- CTA "Avaliar vinhos do evento" (pós-evento).

**Estados:** antes vs depois (isPast); organizador vs membro (menus diferentes); gratuito vs pago.
**Menu organizador:** Editar · Ver RSVPs/pagamentos · Convidar · Chat · Cancelar (pré); Avaliar · Publicar ata · Lista final · Agendar próximo (pós).
**Menu membro:** Chat · Calendário · Direções · Compartilhar · Silenciar · Denunciar.
**Analytics:** `event_detail_view { id, isPast, isOrganizer }`, `event_rsvp { status }`, `event_menu_action { action }`.

> **⚠️ DIVERGÊNCIA — regra "endereço 24h antes"** é copy, não enforced (mock mostra endereço). Backend precisa gate real.
> **⛔ FALTA NO APP (épico pede):** **adicionar ao calendário (.ics)** real + **direções** (deep link mapas). Hoje placeholders.

**Status:** ✅

---

## 12.3 `evento-editar` — Editar evento ✅

<img src="shots/evento-editar.png" width="240"/>

**Propósito:** organizador edita dados do evento criado. **US-EV-03.**
**Entradas:** menu do detalhe → "Editar". **Saídas:** salvar → back.
**Layout (`EventoEditarScreen`):** form com os campos do wizard (nome/data/local/capacidade/pagamento) editáveis + salvar.

> **⚠️ DIVERGÊNCIA — editar não notifica participantes.** Mudar data/local de evento com gente confirmada deveria disparar push. Backlog **EV-EDIT-NOTIFY**.

**Status:** ✅

---

## 12.4 `evento-presenca` — Presença + Pagamentos/Rachão (LACI) ✅

_Aba Presença (check-in) · aba Pagamentos (LACI/conta/manual):_

<img src="shots/evento-presenca-presenca.png" width="200"/> <img src="shots/evento-presenca-pagamentos.png" width="200"/>

**Propósito:** painel do organizador pra gerenciar quem vem e quem pagou. **É aqui que vive o financeiro/rachão.** **US-EV-04/05.**
**Entradas:** menu do detalhe → "Gerenciar evento" / "Ver RSVPs/pagamentos". **Saídas:** back.

**Layout (`EventoPresencaScreen`)** — 2 abas:
- **Presença**: hero com "{checados}/{confirmados} presentes" + grid de stats (Confirmados/Talvez/Não vão/Sem resp.) + filtros + lista com check-in manual.
- **Pagamentos** (se evento pago): hero com **"R$ {arrecadado} de R$ {meta}"** + "{X} de {Y} pagaram · R$ {valor} por pessoa" + barra de progresso. Lista de confirmados com status de pagamento:
  - **LACI** (badge verde "LACI" — reconhecido automático).
  - **Pago** (badge "Pago" — pela conta).
  - **Pendente** → botões "Marcar pago" / "Cobrar".
  - Banner: "Pagamentos pelo **LACI** são reconhecidos automaticamente. Quem paga pela própria conta você confirma manualmente."
  - CTAs: **"Cobrar todos os pendentes"** + **"Exportar pagamentos (CSV)"**.

**Helpers:** `eventFixedAmount(ev)`, `fmtBRL()`. `payMethod`: 'laci' | 'conta' | null.
**Analytics:** `event_checkin { name }`, `event_payment_mark { name }`, `event_payment_charge_all`, `event_payment_export_csv`.

> **✅ NOTA — financeiro mais maduro que o esperado:** ao contrário do que parecia, o rachão **existe** com LACI (reconhecimento automático de pagamento), cobrança de pendentes e exportação CSV. É **valor fixo por pessoa** (não split dinâmico de despesas variáveis).
> **⚠️ DIVERGÊNCIA — LACI é mock.** Integração real (LACI/Celcoin) pendente: webhook de confirmação de Pix → marca pago automático. Backlog **EV-LACI-REAL** (bloqueador GA do financeiro).
> **⛔ FALTA NO APP (épico pede):** **split dinâmico** (rateio de despesas reais lançadas pós-evento: "gastei R$ 400 em vinho + R$ 100 em queijo, divide entre os 6 presentes"). Hoje só valor fixo pré-definido. Backlog **EV-SPLIT-DYNAMIC**.
> **⛔ FALTA NO APP (épico pede):** **check-in via QR code** (o épico menciona QR; hoje é check-in manual por lista). Backlog **EV-QR-CHECKIN**.
> **⛔ FALTA NO APP (épico pede):** **reembolso/cancelamento** (quem pagou e o evento cancela). Backlog **EV-REFUND**.

**Status:** ⚠️ (UI completa incl. financeiro; LACI real + split dinâmico + QR pendentes)

---

## 12.5 Pós-evento: `evento-pos-avaliar` + `evento-pos-ata` ✅

_Avaliar vinhos · Ata do encontro:_

<img src="shots/evento-pos-avaliar.png" width="200"/> <img src="shots/evento-pos-ata.png" width="200"/>

**Propósito:** fechar o ciclo do evento — registrar os vinhos provados + publicar memória/ata no mural. **US-EV-06/07.**

**`evento-pos-avaliar` (`EventoPosAvaliarScreen`):**
- Hero com progresso "{done}/{total} avaliados" + copy "Suas notas vão pro seu diário e contribuem pra média da confraria."
- Card por vinho: bottle + nome + país/região + **5 estrelas** + textarea ("Anota uma palavra ou frase").
- CTA "Salvar N e continuar" / "Continuar pra ata" → `evento-pos-ata { ratings, notes }`.

**`evento-pos-ata` (`EventoPosAtaScreen`):**
- **Foto do grupo** (collage placeholder + Editar/remover).
- Campos: destaque do encontro + próximo passo.
- Publica ata no mural da confraria.

**Card de resumo pós-evento** (`screens-resumo-pos-evento.jsx`, gerado 24h depois, publicado no feed):
- Variante **enxuta** (<3 registros): empático ("Quem foi já sente saudade 🍷").
- Variante **rich** (≥3): grid de stats (check-ins/vinhos/fotos) + vinho top + grid de fotos. Compartilhável nos Stories.

**Analytics:** `event_rate_wine { wineId, rating }`, `event_rate_complete { count }`, `event_ata_publish`, `post_event_summary_show { variant }`, `post_event_summary_share`.

> **⚠️ DIVERGÊNCIA — avaliação dos vinhos → diário** deveria criar registros reais no Módulo 07. Hoje mock. Backlog **EV-RATE-TO-DIARY**.
> **⛔ FALTA NO APP (épico pede):** **fotos reais** (upload) na ata + no resumo. Placeholders hoje.
> **⛔ FALTA NO APP (épico pede):** **consenso da confraria** (média das notas de todos os membros pra cada vinho do evento). Copy menciona ("você vê o consenso depois") mas não há tela. Backlog **EV-CONSENSUS**.

**Status:** ✅

---

## Edge cases & navegação reversa
- **Refresh no wizard** → rascunho em `tc.wizard.event.draft` (recupera). 
- **RSVP "Confirmar"** deveria liberar endereço — hoje sempre visível (gate não-enforced).
- **Evento pago + cancelamento** → sem fluxo de reembolso.
- **Editar evento confirmado** → sem notificação aos participantes.
- **Tutorial `evento-usar`** (TchinTutor) existe (3 steps: RSVP / quem vai / chat) e dispara no detalhe — documentado no Módulo 11/06 (sistema de tutoriais).

## Pendências de backend / decisões do Gabriel
### Críticas (bloqueadores GA)
- **CRUD real de evento** + RSVP + capacidade + lista de presença.
- **LACI/Celcoin real** (webhook Pix → pagamento automático) — bloqueador do financeiro.
- **Gate de endereço 24h** (enforced server-side).
- **Avaliação → diário** real (Módulo 07).
### Importantes
- Split dinâmico de despesas (rachão real além do valor fixo).
- QR code de check-in.
- Reembolso/cancelamento.
- Upload de capa + fotos da ata.
- Notificar participantes em edição.
- Consenso da confraria (média das notas).
### Decisões do Gabriel
- Rachão: valor fixo (atual) é suficiente no MVP, ou precisa split dinâmico já?
- Taxa da plataforma sobre pagamentos? (modelo de receita)
- Endereço sempre 24h antes, ou configurável pelo organizador?

## Conexões com outros módulos
- **Módulo 11 (Confrarias)** — evento nasce da confraria (wizard P6); aba Eventos do detalhe.
- **Módulo 03/07 (Paladar/Diário)** — P3 sugere vinhos por paladar; avaliação → diário.
- **Módulo 13 (Comunidade)** — ata + resumo publicados no mural.
- **Módulo 17 (Chat)** — chat do evento.
- **Módulo 18 (Notificações)** — lembretes (3d/1d/dia), cobrança de pagamento.
- **Financeiro (transversal, LACI/Celcoin)** — vive aqui (aba Pagamentos).
