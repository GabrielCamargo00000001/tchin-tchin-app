# Módulo 02 — Onboarding educacional & Roteamento

> Fluxo educacional pós-cadastro: descobrir **quem é o usuário** (nível, interesses, intenção) e **levá-lo direto** para o melhor primeiro uso. Gate de personalização do feed nos primeiros 14 dias.
> **Fonte de verdade:** telas em `src/legacy/screens-quiz-nivel.jsx` (Nível + Interesses) e `src/legacy/screens-quiz.jsx` (Intenção, GPS, GPS negado), `src/legacy/screens-onboarding-final.jsx` (Welcome final + Tour) e `src/legacy/screens-tutor.jsx` (Tutoriais hub) — UI/UX. Doc funcional vem de **MVP2 Épico Onboarding** e do **Relatório de Persona/HP3**.
> **Épicos/US:** US-006 (Quiz de Nível), US-007 (Interesses — uvas/estilos/regiões), US-008 (Tutorial/Tour), US-009 (Personalização do feed), US-010 (Intenção/Roteamento), US-011 (GPS contextual).

> **Regra de negócio canônica (alinhada ao relatório HP3 e ao protótipo):**
> 1. Quiz de **Paladar** (5 perguntas, sensorial) **não** está no onboarding — é contextual, oferecido pelo Descobrir quando o usuário pede recomendação (vira Módulo 03). Isso reduz drop pós-cadastro.
> 2. O onboarding educacional tem **3 passos curtos** (Nível → Interesses → Intenção) + **6.x GPS** (apenas para confraria) + **7.01 Welcome Final** + tour opcional.
> 3. **Nenhum tour bloqueia o app**: todos os passos têm "pular" não-destrutivo.

---

## Mapa do fluxo (estado do protótipo, com decisões do PO sinalizadas)

```
[cadastro concluído] ─→ quiz-nivel  ─→ quiz-interesses  ─→ tela-intencao  ─┐
                          (1 de 3)       (2 de 3)            (3 de 3)       │
                                                                            │
        ┌─ discover_home ──────────────────────────────────────────────┐    │
        │   → welcome-final → tour? → home/descobrir (FirstTime)       │    │
        │                                                              │    │
        ├─ diary_empty ────────────────────────────────────────────────┤    │
        │   → welcome-final → tour? → home/adega (FirstTime/Estante)   │    │
        │                                                              │    │
        ├─ learn ──────────────────────────────────────────────────────┤    │
        │   → aprender (direto, sem tour)                              ├────┤
        │                                                              │    │
        ├─ treino_paladar ─────────────────────────────────────────────┤    │
        │   → treino-paladar (Módulo 08, direto, sem tour)             │    │
        │                                                              │    │
        ├─ gps_primer_then_confrarias ─────────────────────────────────┤    │
        │   → gps-primer (rota D)                                      │    │
        │       ├─ permitir   → welcome-final → tour? → confrarias     │    │
        │       ├─ negar sys  → gps-negado → manual → welcome-final…   │    │
        │       └─ agora não  → welcome-final → tour? → confrarias     │    │
        │                                                              │    │
        ├─ gps_primer_then_wizard ─────────────────────────────────────┤    │
        │   → gps-primer (rota E)                                      │    │
        │       ├─ permitir   → wizard-confraria-1 (Módulo 11)         │    │
        │       ├─ negar sys  → gps-negado → manual → wizard-confraria │    │
        │       └─ agora não  → wizard-confraria-1                     │    │
        │                                                              │    │
        └─ skip_to_feed (link rodapé + modal de confirmação) ──────────┘    │
              → welcome-final → tour? → home/comunidade  ←─────────────────┘

[hub manual de tutoriais, acessível pelo perfil/config] → tutoriais
```

---

## 02.1 `quiz-nivel` — Quiz de Nível (gate 1 de 3) ✅

<img src="shots/nivel-default.png" width="240"/>

**Propósito (US-006):** descobrir como o usuário se enxerga no mundo do vinho. **Alimenta:**
1. Personalização do feed (% de conteúdo iniciante vs avançado).
2. Tom da microcopy ("iniciante" vs "sommelier").
3. Sort default no Descobrir (populares vs raros/premiados).

**Entradas:** `cadastro` (passo 3 concluído) → `quiz-nivel`. *(Login de conta existente **não** passa por aqui — vai direto a `home`.)*
**Saídas:** card tocado → `quiz-interesses { level }`. **Sem botão Voltar** (primeira tela do onboarding — back arrow renderizado mas `disabled`, cor `n300`, `aria-disabled=true`).
**Layout & componentes (`QuizNivelScreen`):**
- Top bar: back **disabled** + chip "1 de 3" (mono, n100 bg).
- H1 Fraunces 32 — **"Como você se descreve no mundo do vinho?"**
- Body Geist 16 — **"Sem julgamento — é só pra gente saber por onde começar com você."**
- 3 `NivelCard` (vertical stack, gap 12, min-height 84dp):
  1. **`iniciante`** · icon `school` · "Tô começando agora" · "Bebo vinho de vez em quando, mas não sei muito. Quero aprender sem complicar."
  2. **`intermediario`** · icon `auto_stories` · "Curto vinho e quero saber mais" · "Já tenho meus favoritos, leio sobre vinho às vezes, gosto de descobrir novidades."
  3. **`avancado`** · icon `workspace_premium` · "Sou entusiasta ou expert" · "Conheço regiões, uvas, harmonização. Vinho é parte da minha rotina ou profissão."

**Interação:** tap único; 200ms de feedback de pressed (scale 0.98 + bg p50 + border p300) antes da navegação; `routing` lock impede double-tap (cards não-pressionados ficam com opacity 0.55).
**Estado/persistência:** o nível é stashado em `window.__tcUserLevel` (lido depois pelo `aprender`, pelo Descobrir e por features personalizáveis).
**Analytics (não-negociáveis):** `level_selected { level: iniciante|intermediario|avancado }` no tap.
**Acessibilidade:** botões com `aria-label` = título; `data-level` = id para automação.
**Critérios de aceite:**
- ✅ 3 cards exibidos, 84dp touch target, voltar desabilitado.
- ✅ Tap dispara analytics + persiste nível + navega para `quiz-interesses`.
- ✅ Sem double-tap (lock 200ms).
- ⚠️ Reset/refazer: hoje só refazendo o onboarding inteiro (limpando localStorage). **Backlog:** botão "Refazer onboarding" em `config-conta`.

> **⚠️ DIVERGÊNCIA / DECISÃO** — O doc antigo previa um quiz unificado (nível + paladar 5 perguntas). A tela **separa**: aqui só nível; paladar virou contextual. **Recomendação:** manter como está (alinha com HP3 — menor fricção). Atualizar o doc.
> **⚠️ DIVERGÊNCIA** — Doc antigo previa **5 níveis** (iniciante/curioso/entusiasta/avançado/expert). A tela usa **3**. **Recomendação:** manter 3 (cognitivamente mais simples; mais fácil de mapear em copy). Decisão do PO.

**Status:** ✅

---

## 02.2 `quiz-interesses` — Interesses (gate 2 de 3) ✅

_Default · 3 selecionados (mínimo) · 8 selecionados (máximo) · tentativa de 9º (rejeitado com shake)_:

<img src="shots/interesses-default.png" width="200"/> <img src="shots/interesses-min.png" width="200"/> <img src="shots/interesses-max.png" width="200"/> <img src="shots/interesses-overflow.png" width="200"/>

**Propósito (US-007):** descobrir o que o usuário **já gosta ou quer explorar** (uvas, estilos, regiões). **Alimenta** o early-feed personalization: nos primeiros 14 dias, 30% do conteúdo é taggeado com os interesses + 70% é geral (anti-eco-câmara).

**Entradas:** `quiz-nivel` → `quiz-interesses { level }`. **Saídas:** `tela-intencao { level, interests }` (com mínimo 3 selecionados); back → `quiz-nivel`.

**Layout & componentes (`InteressesScreen`):**
- Top bar: back + chip "2 de 3".
- H2 Fraunces 28 — **"Escolha seus interesses"**
- Body Geist 16 — **"Selecione entre 3 e 8. Você pode mudar depois."**
- 3 seções (label `SectionLabel` Geist 11 uppercase tracked):
  - **UVAS** (8 opções, grid 3 colunas, `GrapeArt` SVG):
    Cabernet Sauvignon · Merlot · Malbec · Pinot Noir · Syrah · Tannat · Chardonnay · Sauvignon Blanc.
  - **ESTILOS** (2 opções, grid 3 colunas, `StyleArt` SVG):
    Rosé · Espumante *(sparkle: bolhinhas no espumante)*.
  - **REGIÕES** (8 opções, grid 3 colunas, `RegionArt` com bandeira no canto):
    Vale dos Vinhedos 🇧🇷 · Serra Gaúcha 🇧🇷 · Vale do São Francisco 🇧🇷 · Mendoza 🇦🇷 · Douro 🇵🇹 · Bordeaux 🇫🇷 · Toscana 🇮🇹 · Rioja 🇪🇸 *(Brasil-first, alinha com tese da marca).*
- **Bottom bar (sticky):** `aria-live` "X de 18 selecionados" (com aviso "faltam Y" em w700 quando <3); CTA primário burgundy.

**Estados do CTA:**
- `count = 0` → disabled, label "Selecione 3".
- `count < 3` → disabled, label "Selecione 3" + helper "faltam Y".
- `count ∈ [3, 8]` → habilitado, label "Continuar" + arrow forward.
- `count = 8` (limite) → habilitado; tentativa de 9º interação dispara **shake 380ms** no card tocado + toast warning "Máximo 8 interesses". Card **não** é selecionado.

**Interação por card (`InteresseCard`):** toggle (multi-select); estado selecionado = border p700 2px + scale 0.97 + badge check no topo direito (18×18 p700 + check branco).
**Estado/persistência:** `selected[]` em state local; ao continuar, stash em `window.__tcUserInterests` + payload `interests_completed { count, interests }`.
**Analytics:** `interests_completed { count, interests: [ids] }` (tap "Continuar").
**Acessibilidade:** `aria-pressed`, `aria-label` = label, `data-id` = id. `aria-live=polite` na contagem.

> **⚠️ DIVERGÊNCIA — comportamento de scroll observado nos shots:** ao tocar um item fora do viewport (ex.: Mendoza, na seção Regiões), o foco rola para a posição do clique e os cards selecionados acima (Cabernet, Malbec) **somem do viewport**. Não é um bug — é a contagem persistente ("3 de 18"). **Recomendação:** adicionar um **mini-resumo sticky** no topo do CTA bar listando os selecionados (chips com X) para feedback constante. **Backlog.**

> **⚠️ DIVERGÊNCIA** — A grade tem **3 colunas em todas as faixas** mesmo com só 2 estilos (sobra coluna vazia no Espumante/Rosé). **Recomendação:** manter (consistência visual de grid). Decisão do PO se quiser uniformizar.

> **⚠️ DIVERGÊNCIA** — Doc antigo pedia ≥5 interesses; tela usa **≥3**. **Recomendação:** manter 3 (HP3 = menor barreira). Decisão do PO.

**Critérios de aceite:**
- ✅ Multi-select min 3, max 8.
- ✅ Shake + toast no 9º.
- ✅ Contagem `aria-live`.
- ✅ Analytics + persistência.
- ⚠️ Editar depois: hoje só refazendo. **Backlog:** "Meus interesses" em `editar-perfil-paladar`.

**Status:** ✅

---

## 02.3 `tela-intencao` — Tela de Intenção (gate 3 de 3) ✅

_Default · Modal de confirmação de skip_:

<img src="shots/intencao-default.png" width="200"/> <img src="shots/intencao-skip-modal.png" width="200"/>

**Propósito (US-010 — a tela mais importante deste módulo):** descobrir **por onde o usuário quer começar** e roteá-lo direto. Reduz drop pós-onboarding ao eliminar o "agora o que eu faço?".

**Entradas:** `quiz-interesses` → `tela-intencao { level, interests }`. **Saídas (single-tap commit, ver mapa):**
- `discover_home` → `welcome-final { intent }` → home/descobrir FirstTime.
- `diary_empty` → `welcome-final { intent }` → home/adega FirstTime (Estante vazia).
- `learn` → `aprender { intent, level }` *(direto, sem `welcome-final`)*.
- `treino_paladar` → `treino-paladar { intent }` *(direto, sem tour)*.
- `gps_primer_then_confrarias` → `gps-primer { next: 'confrarias' }`.
- `gps_primer_then_wizard` → `gps-primer { next: 'wizard-confraria' }`.
- `skip_to_feed` (link "Ainda não sei…") → **modal de confirmação** → confirma → `welcome-final { intent: 'skip_to_feed' }` → home/comunidade.

**Layout & componentes (`TelaIntencaoScreen`):**
- Top bar: back + chip "Etapa 3 de 3".
- H1 Fraunces 32 — **"Por onde você quer começar?"**
- Body Geist 16 — **"A gente te leva direto. Você pode explorar tudo depois."**
- 6 `IntentCard` (vertical, gap 12, min-height 72dp):

| id | Ícone | Título | Sub |
|---|---|---|---|
| `discover_home` | `local_bar` | "Descobrir vinhos pro meu paladar" | "Veja recomendações com base no seu DNA" |
| `diary_empty` | `menu_book` | "Registrar um vinho que provei" | "Comece sua adega pessoal com 1 registro de 15 segundos" |
| `learn` | `school` | "Aprender sobre vinho" | "Conteúdo curado pra começar do começo, no seu nível" |
| `treino_paladar` | `fitness_center` | "Treinar meu paladar todo dia" | "Lições de 90 segundos, estilo joguinho — com streak e conquistas" |
| `gps_primer_then_confrarias` | `groups` | "Participar de uma confraria" | "Encontre grupos perto de você que se reúnem para degustar" |
| `gps_primer_then_wizard` | `construction` | "Criar minha própria confraria" | "Trazer meu grupo pro app" |

- Link `Button variant="ghost"` centralizado — **"Ainda não sei, me leva pro app"** → abre `SkipConfirmModal`.

**Interação:**
- Single-tap commit: card pressionado (scale 0.98, bg p50) por 200ms → `commit(id)` → navega.
- `routing` lock impede double-tap; outros cards ficam opacity 0.55.
- Stash `window.__tcLastIntent = intent` (lido depois pelo `welcome-final` para escolher a tab de destino) e, no caso de skip, `window.__tcSkipTimestamp = Date.now()`.

**SkipConfirmModal (Nielsen #5 — prevenção de erro):** bottom sheet
- H3 Fraunces 20 — **"Tem certeza que quer pular?"**
- Body Geist 14 — **"Sem isso a gente vai te mostrar conteúdo geral. Você pode preencher depois no seu perfil."**
- CTA **primária** (burgundy) — **"Voltar e escolher"** *(hierarquia invertida proposital: o caminho seguro é destacado)*.
- CTA **ghost** — **"Pular mesmo assim"**.
- Dismiss: tap fora (overlay), Esc, drag handle visível (cosmético).

**Acessibilidade:** `role="dialog"`, `aria-modal`, `aria-labelledby` / `aria-describedby` ligados; foco entra no modal ao abrir.
**Analytics (recomendado):** `intent_selected { intent }`; para skip: `intent_skip_shown` (abriu modal), `intent_skip_confirmed`, `intent_skip_canceled`.

> **⚠️ DIVERGÊNCIA / DECISÃO — chip diz "Etapa 3 de 3" e nas anteriores só "1 de 3" / "2 de 3"**. **Recomendação:** padronizar para "3 de 3" (concisão consistente). Cosmético — baixo impacto.

> **⚠️ DIVERGÊNCIA** — A intenção `treino_paladar` é a única que **não passa por `welcome-final`** (vai direto pra feature do Módulo 08). Idem `learn`. **Justificativa:** essas features têm onboarding próprio (mascote/trilha) — empilhar tour seria redundante. ✅ Manter como está.

**Critérios de aceite:**
- ✅ 6 cards exibidos, single-tap commit com 200ms feedback.
- ✅ Lock contra double-tap.
- ✅ Skip via modal (não direto).
- ✅ Stash em `__tcLastIntent` para `welcome-final` resolver destino.
- ⚠️ Telemetria `intent_selected` precisa ser ligada no build real.

**Status:** ✅

---

## 02.4 `gps-primer` — Permission Primer (06.01, rotas D e E) ✅

_Default (rota D: descobrir confrarias) · Diálogo nativo simulado · Variante rota E (criar confraria)_:

<img src="shots/gps-primer-default.png" width="200"/> <img src="shots/gps-primer-dialog.png" width="200"/> <img src="shots/gps-primer-wizard-variant.png" width="200"/>

**Propósito (US-011):** explicar **por que** o GPS é necessário **antes** de disparar o prompt nativo do SO. Best practice Material 3 / HIG: nunca chamar o prompt frio.

**Entradas (do onboarding):** `tela-intencao` → intent `gps_primer_then_confrarias` (rota D) ou `gps_primer_then_wizard` (rota E). *Reusável fora do onboarding sempre que o app precisar de localização.*
**Saídas:**
- "Ativar localização" → diálogo simulado → "Durante o uso" / "Somente desta vez" = granted → rota D: `welcome-final { intent, location_status: 'granted' }`; rota E: `wizard-confraria-1 { location_status: 'granted', intent }`.
- "Não permitir" no diálogo → `gps-negado` (hard deny).
- "Agora não" (soft deny) → mesmo destino que granted, com `location_status: 'denied_soft'`.

**Layout & componentes (`GpsPrimerScreen`):**
- Top bar: back + chip "Etapa 7 de 7" *(legado da numeração antiga — ver divergência)*.
- Ilustração: círculo 160×160 burgundy/50 + ícone `location_on` 80 burgundy/700 (filled).
- H2 Fraunces 24 (centralizado, máx 2 linhas) + body Geist 14 (máx 280dp).
- **Copy variante por rota:**

| Rota | H2 | Body |
|---|---|---|
| **D — descobrir** (default) | "Pra encontrar confrarias perto de você" | "Usamos sua localização só pra mostrar confrarias e eventos da sua região. Você pode desativar a qualquer momento nas Configurações." |
| **E — criar** | "Pra cadastrar onde sua confraria se encontra" | "Você pode escolher cidade e UF manualmente também — mas usar GPS é mais rápido. Desativável depois." |

- Bottom CTAs:
  - **Primária**: "Ativar localização" + ícone `my_location` + estado loading 350ms ("Ativando…") antes de abrir o diálogo.
  - **Ghost**: "Agora não" (soft deny — nunca em vermelho/destrutivo).

**Diálogo nativo simulado** (cobre tela com 45% de overlay, card branco arredondado 28dp, estilo Android):
- Título: **"Permitir que Tchin Tchin acesse a localização deste dispositivo?"**
- 3 botões em coluna: **"Durante o uso do app"** · **"Somente desta vez"** · **"Não permitir"** (todos em p700 sobre branco — espelha o sistema do Android).
- Granted (1 ou 2): toast success "Tudo certo! Mostrando confrarias da sua região." + 220ms delay + navega.
- Deny (3): navega para `gps-negado`.

**Analytics:** `gps_primer_shown { rota: D|E }` no mount; `gps_primer_response { rota, response: 'granted'|'denied'|'soft' }`.
**Acessibilidade:** loading no botão; foco volta para a CTA primária após fechar o diálogo.

> **⚠️ DIVERGÊNCIA** — Chip "Etapa 7 de 7" é legado de uma numeração antiga do onboarding (que tinha mais passos). Pode confundir o usuário. **Recomendação:** mudar para **"Quase lá"** (ou esconder o chip quando a tela é alcançada **fora** do onboarding, ex.: confraria depois). Decisão do PO.

> **⚠️ DIVERGÊNCIA** — Em produção, o `dialog` será o **prompt nativo real** do SO (não o simulado). O simulado existe pra protótipo entregar a sensação completa. **Implementação real:** chamar `Geolocation.getCurrentPosition` (ou equivalente nativo) **só depois** do tap da CTA primária; mapear `PERMISSION_DENIED` → `gps-negado`, `granted` → continuar.

**Status:** ✅ (UI/UX completos; integração com SO pendente no build real)

---

## 02.5 `gps-negado` — Hard deny / soft fallback (06.03) ✅

<img src="shots/gps-negado-default.png" width="240"/>

**Propósito:** o usuário **negou** no prompt do SO. Oferece caminho alternativo (escolher cidade/UF manualmente) e instrução para reativar via Configurações.

**Entradas:** `gps-primer` → diálogo → "Não permitir". **Saídas:**
- **"Escolher cidade manualmente"** → segue o `intent` original (rota D: `welcome-final { intent, location_status: 'denied' }`; rota E: `wizard-confraria-1 { location_status: 'denied', intent }`). *No protótipo o filtro manual de cidade aparece já dentro da listagem de confrarias / wizard.*
- **"Tentar de novo"** → volta para `gps-primer { next, intent }` (reabre o primer; usuário pode tentar permitir de novo).
- Back → `tela-intencao` (via `BACK_SKIP` global, evita loop pelo primer).

**Layout (`GpsNegadoScreen`):**
- Ilustração: círculo 160×160 n100 + ícone `location_off` 72 n600.
- H2 Fraunces 24 — **"Sem problema, dá pra continuar"**.
- Body Geist 14 — **"Você pode escolher cidade e UF manualmente. Pra liberar GPS depois, é só ir em Configurações do app no celular."**
- CTAs:
  - **Primária**: "Escolher cidade manualmente".
  - **Ghost**: "Tentar de novo".

**Comportamento "Tentar de novo":** apenas re-renderiza `gps-primer` (estado limpo); **não força** prompt nativo de novo (em produção, alguns SOs não reabrem após "Não permitir" — caberá ao app instruir o usuário a ir em Configurações; já é o que a copy diz).

> **⚠️ DIVERGÊNCIA** — Hoje o "manual" só leva pra próxima tela contando com o filtro de cidade lá dentro. **Recomendação:** o doc previa um picker explícito de UF→Cidade. **Backlog:** implementar `picker-cidade-uf` como Bottom Sheet, reutilizável (config, perfil, wizard de confraria).

**Status:** ✅

---

## 02.6 `welcome-final` — Congrats + tour entry (07.01) ✅

<img src="shots/welcome-final-default.png" width="240"/>

**Propósito:** parabenizar (reforço positivo, sunk-cost) e oferecer **tour opcional de 4 passos** que mostra as 4 abas principais antes do app começar.

**Entradas:** qualquer intent que **passe por aqui** (`discover_home`, `diary_empty`, `gps_primer_then_confrarias`, `skip_to_feed`, **não** `learn` e **não** `treino_paladar`). Lê `window.__tcLastIntent` pra decidir o **destino final**:

| Intent | Destino (tab) |
|---|---|
| `discover_home` | `descobrir` |
| `diary_empty` | `adega` |
| `gps_primer_then_confrarias` | `confrarias` |
| `gps_primer_then_wizard` | `confrarias` *(mas é roteado direto em `gps-primer` para `wizard-confraria-1`; o welcome-final é fallback)* |
| `skip_to_feed` *(default)* | `comunidade` |

**Side-effect importante (`useEffect`):**
- Se `intent === 'discover_home'` **e** `ctx.user.paladar` existe → **zera** `ctx.user.paladar`. Por quê? O usuário optou por descobrir **sem** ter feito o quiz de paladar → o Descobrir deve renderizar a variação `FirstTime` (sem 5D radar).
- Se `intent === 'diary_empty'` **e** `ctx.diary.length > 0` → zera o `ctx.diary` (semeado pelos mocks) para a Adega abrir vazia/Estante FirstTime.

**Layout:**
- Background: gradiente vertical n50 → p50 8% (sutil "wash" burgundy).
- Centro:
  - `TchinLogo` 64 burgundy/700.
  - H1 Fraunces 32 — **"Bem-vindo, {primeiroNome}!"** com primeiro nome em p700.
  - Body Geist 14 — **"Antes de te liberar, te mostro como o app funciona em 30 segundos."**
  - 4 dots de preview (todos n300 — não é progresso ainda; só sinal de "tem 4 passos").
- Bottom:
  - **CTA primária**: "Começar tour" + arrow → escreve `tc.tour = { destination, step: 0 }` no localStorage, chama `startTour({destination, step:0})`, navega para a tab destino com `firstTime: true, fromTour: true`.
  - **CTA ghost**: "Pular tour, ir direto" → limpa `tc.tour`, navega para a tab destino com `firstTime: true, fromTour: false`.

**Persistência do tour:** `tc.tour` no localStorage → se o usuário fechar/refresh no meio, retoma de onde parou. Limpo ao chegar no último passo ("Começar a usar") ou ao tocar "Pular tour" em qualquer momento.

**Tour overlay (07.02–05) — `TutorialTooltip`**, renderizado por `TchinApp` por cima da home:
- 4 passos, na ordem fixa: **Comunidade → Confrarias → Descobrir → Adega**.
- Cada passo:
  - Overlay escuro (60%) cobrindo a tela inteira **exceto** a bottom nav (fica iluminada por contraste).
  - Card branco 312dp ancorado **acima** da bottom nav, com triângulo apontando para a tab daquele passo.
  - Title (Geist 16 bold n950) + Body (Geist 14 n800) — copy:
    | Step | Tab | Title | Body |
    |---|---|---|---|
    | 0 | comunidade | "Comunidade" | "Seu feed de descobertas, dúvidas e conversas sobre vinho. Onde você acompanha as pessoas que segue e os experts." |
    | 1 | confrarias | "Confrarias" | "Grupos locais que se encontram pra degustar e aprender juntos. Crie a sua ou entre numa que já existe." |
    | 2 | descobrir | "Descobrir" | "Vinhos selecionados pro seu paladar, scanner de rótulos e harmonização com comida." |
    | 3 | adega | "Adega" | "Sua coleção pessoal. Wishlist, vinhos já provados, estatísticas e diário de degustação." |
  - Footer: dots (passo atual em p500) + botões (steps 0–2: "Pular tour" ghost + "Próximo" primary; step 3: "Voltar" ghost + "Começar a usar" primary).
- **Cores e tipografia:** todas tokenizadas em `T` (T.c.p500/p700, T.c.n0/n300, T.r.lg, T.el[4]).
- **A11y:** `role="dialog"`, `aria-modal`, `aria-labelledby` por passo. Click fora **não** fecha (precisa interagir com botões).

**07.06 — CelebrationToast** (`CelebrationToast`): toast top-anchored burgundy, 3s auto-dismiss, copy **"Você está pronto! 🍷 Bem-vindo ao Tchin Tchin."** Pode ser disparado ao "Começar a usar" (decisão do PO se exibir sempre ou só na conclusão do tour).

> **⚠️ DIVERGÊNCIA** — Hoje o `welcome-final` **não é exibido** para `learn` e `treino_paladar` (vão direto). **Recomendação:** manter como está; consistência com a tese de "menos fricção" para features que já têm onboarding próprio.

> **⚠️ DIVERGÊNCIA** — A copy do welcome é fixa ("em 30 segundos"). **Recomendação:** parametrizar por intent (ex.: "te mostro a parte que importa pra você"). **Backlog cosmético.**

> **⚠️ DIVERGÊNCIA** — Doc antigo previa **modo "skip-tour" pulando completamente** o tour de 4 passos. Tela já implementa isso ("Pular tour, ir direto"). Atualizar o doc para refletir.

> **⚠️ DIVERGÊNCIA — captura sem nome**: no shot, o título aparece "Bem-vindo, você!" porque `ctx.user.name` está vazio no dev-mode (`?screen=welcome-final` não passa pelo cadastro). Em produção, virá com o primeiro nome. ✅ Esperado.

**Status:** ✅ (UI completa; analytics do tour pendentes — `tour_started`, `tour_step { i }`, `tour_skipped { atStep }`, `tour_completed`).

---

## 02.7 `tutoriais` — Hub manual de tutoriais (35.x) ✅

<img src="shots/tutoriais-hub.png" width="240"/>

**Propósito:** ponto **único** para o usuário (re)assistir a qualquer tutorial de feature do app **sob demanda**. Não é parte do fluxo automático de onboarding — é uma rede de segurança / referência.

**Entradas:** `editar-perfil` ou `config-conta` → "Tutoriais"; também acessível direto via deep link. **Saídas:** card tocado → `onLaunch(t.id)` → o `TchinApp` retira `tutoriais` da pilha e seta o tutorial ativo, que vira coachmark/mascote sobre a feature correspondente. Back → tela anterior.

**Layout (`TutoriaisHubScreen`):**
- Header (n0 bg + border n200): back + título "Tutoriais do Tchin" + botão **"Resetar"** (p700 text — chama `resetAllTutorials()` + toast success "Tutoriais resetados.").
- Hero burgundy (gradiente p700→p900 + textura de listras): `TchinMascot` 56px com `tcMascotBob` animation + "SEU SOMMELIER DIGITAL" overline + H2 "Oi! Sou o Tchin" + body "Te mostro como cada feature funciona."
- Lista de tutoriais (`TUTORIAL_REGISTRY`): cada card mostra:
  - Ícone 44×44 (filled `check_circle` em s700+s100 se já concluído; outline `auto_awesome` em p700+p50 se pendente).
  - Nome do tutorial (`bodyB`).
  - Subtítulo: **"X passos · Y min"** (Y = ceil(steps/2)).
  - Chevron à direita.

**Estado/persistência:** `tc.tutor.done` (mapa `{ [tutorialId]: boolean }`) em localStorage. Reset zera tudo. Marcar como done acontece no fim de cada tutorial.

**Tutoriais registrados (atual `TUTORIAL_REGISTRY`):** *(detalhar por feature nos respectivos módulos)* — wizard de confraria, scanner v2, carta-matches, harmoniza, paladar/radar, ata pós-evento etc.

**Analytics:** `tutorial_launched { id }`, `tutorial_completed { id }`, `tutorials_reset_all`.

> **⚠️ DIVERGÊNCIA — descoberta:** o hub depende de o usuário **achar o link** em config/perfil. **Recomendação:** adicionar entry point no FAB do `?` da home (ou no header de cada feature complexa) — **Backlog: ENT-TUTOR-01**.

**Status:** ✅

---

## 02.8 Destinos first-time (variações de `home/*` e `aprender`) ✅

O onboarding **não termina** em `welcome-final`. Cada destino tem uma **variação "FirstTime"** ativada por `firstTime: true` (param) ou pela ausência de dados (paladar/diary/etc).

| Destino | Componente / variação | Trigger |
|---|---|---|
| home/descobrir | `DescobrirHomeFirstTime` (`?screen=home&tab=descobrir`) | `firstTime: true` **e/ou** `!user.paladar` (semeado pelo `welcome-final` para `discover_home`). Mostra cartão de "Faça o quiz de paladar pra recomendações precisas" (link contextual ao `quiz`) + lista geral. |
| home/adega | `AdegaScreen` com aba **Estante** (vazia) — Módulo 07 | `firstTime: true` **e/ou** `diary === []`. Estante vazia mostra **rack de madeira interativo** com tiles vazios + CTA "Registrar primeiro vinho" e "Wishlist". *(Antes existia `AdegaVazia`; aposentada.)* |
| home/confrarias | `home/confrarias` com `firstTime: true` | Mostra confrarias próximas (rota D) ou wizard-confraria-1 (rota E). |
| home/comunidade | `home/comunidade` com `firstTime: true` | Feed geral, com nudge sutil "Complete seus interesses pra ver mais conteúdo que você curte" (link de volta a `quiz-interesses` ou `editar-perfil-paladar`). |
| aprender (`/aprender`) | `AprenderScreen` com `level: __tcUserLevel` | Acessado direto do intent `learn`. Conteúdo curado por nível (iniciante = "Tour básico do vinho", avançado = "Aprofundamento por região"). |
| treino-paladar | `TreinoPaladarScreen` com onboarding **da feature** (não do app) | Acessado direto do intent `treino_paladar`. **Onboarding conversacional do mascote TchinDuo** (já documentado em Módulo 08). |

> **⚠️ DIVERGÊNCIA — discoverability cruzada:** quem entra via `learn` ou `treino_paladar` **não vê o tour de 4 abas**. **Recomendação:** ao primeiro retorno à home (qualquer aba), exibir um nudge sutil "Quer ver as outras features? Tour rápido →" — **Backlog: NUDGE-TOUR-01**.

> **⚠️ DIVERGÊNCIA — Comunidade FirstTime:** atualmente não há um estado vazio dedicado em `comunidade`. O usuário que vier via `skip_to_feed` cai no feed normal sem feedback de "por que estou aqui". **Recomendação:** adicionar variante `home/comunidade?firstTime=true` com card educativo "Você pulou os interesses — toque aqui pra personalizar agora". **Backlog: HOME-COM-FT-01**.

**Status:** ✅ (variações primárias) / ⚠️ (Comunidade FirstTime + nudge cruzado pendentes)

---

## Edge cases & navegação reversa

### BACK_SKIP — não voltar para o onboarding
Implementado em `prototype.jsx` com o set `BACK_SKIP` que inclui:
```
welcome, onboarding, quiz, quiz-nivel, quiz-interesses, tela-intencao,
gps-primer, gps-negado, welcome-final, nudge-d1, nudge-d3, nudge-d7, nudge-d14,
confraria-welcome, confraria-apresentar, confraria-tour-rapido
```
Significado: ao tocar "Voltar" **vindo de uma tela do app**, a navegação **pula** essas telas transientes. Evita: (a) cair de volta na tela de Intenção depois que o usuário já está no app; (b) cair no tour da Confraria de novo após sair de um grupo; (c) cair em nudges depois de dispensá-los.

### Refresh no meio do onboarding
- **`tc.tour`** persiste o passo do tour de boas-vindas. Refresh retoma.
- **`window.__tcUserLevel/Interests/LastIntent`** são in-memory only — refresh perde. **Backlog:** persistir essas três flags em localStorage (`tc.onboard.v1 = { level, interests, lastIntent }`) **antes** do GA pra evitar onboarding-em-loop.

### Login subsequente
- Conta existente que faz login **não** passa pelo onboarding educacional (vai direto a `home`). Premissa: o backend marca `onboarding_complete: true` ao fim do passo 3 (tela-intencao) → no login real, esse flag controla o redirect.

### Deep link entrando direto numa tela do onboarding
- Em dev (`?screen=`) qualquer tela renderiza sem estado anterior; em produção, deep link para `quiz-nivel` exige sessão autenticada e onboarding incompleto — senão redireciona a `home`. **Backlog:** middleware no router.

---

## Pendências de produto/backend deste módulo

- **Analytics:** ligar `level_selected`, `interests_completed`, `intent_selected`, `intent_skip_*`, `gps_primer_*`, `tour_*` na infra real.
- **Persistência:** mover `__tcUserLevel/Interests/LastIntent` de `window.*` para localStorage + backend (perfil do usuário).
- **GPS:** integrar API nativa real (Geolocation) substituindo o diálogo simulado.
- **First-time:** completar Comunidade FirstTime + nudge cruzado para quem entrou via `learn`/`treino_paladar`.
- **Reset:** botão "Refazer onboarding" em `config-conta` (limpa flags + redireciona).
- **Decisões do PO:**
  - Regra mínima de interesses (3 vs 5)?
  - Chip "Etapa 7 de 7" do GPS — mudar para "Quase lá"?
  - Texto adaptado por intent em `welcome-final`?
  - Mostrar `CelebrationToast` sempre ao concluir o tour?
