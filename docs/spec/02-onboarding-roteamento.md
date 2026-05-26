# Módulo 02 — Onboarding educacional & Roteamento

> Fluxo educacional pós-cadastro: descobrir **quem é o usuário** (nível, interesses, intenção) e **levá-lo direto** para o melhor primeiro uso. Gate de personalização do feed nos primeiros 14 dias.
> **Fonte de verdade:** telas em `src/legacy/screens-quiz-nivel.jsx` (Nível + Interesses), `src/legacy/screens-quiz.jsx` (Intenção, GPS), `src/legacy/screens-onboarding-final.jsx` (Welcome final + Tour) e `src/legacy/screens-tutor.jsx` (Tutoriais hub) — UI/UX. Doc funcional: MVP2 Épico Onboarding + Relatório HP3.
> **Épicos/US:** US-006 (Nível), US-007 (Interesses), US-008 (Tutorial/Tour), US-009 (Personalização do feed), US-010 (Intenção/Roteamento), US-011 (GPS contextual).

**Regra de negócio canônica:** o **Quiz de Paladar** (5 perguntas sensoriais) **não** está no onboarding — vira contextual no Descobrir (Módulo 03). O onboarding educacional tem **3 passos curtos** (Nível → Interesses → Intenção), com **GPS** opcional só para confraria, **Welcome Final** + tour opcional de 4 abas. Nenhum tour bloqueia — todos têm "pular".

## Mapa do fluxo
```
[cadastro ok] → quiz-nivel → quiz-interesses → tela-intencao ─┬─ discover_home / diary_empty / skip → welcome-final → tour? → home/<tab>
                                                              ├─ learn                                → aprender (direto, sem tour)
                                                              ├─ treino_paladar                       → treino-paladar (Módulo 08, sem tour)
                                                              └─ gps_primer_then_(confrarias|wizard)  → gps-primer ─┬─ granted/soft → welcome-final ou wizard
                                                                                                                    └─ deny → gps-negado → manual
```

---

## 02.1 `quiz-nivel` — Quiz de Nível (1 de 3) ✅

<img src="shots/nivel-default.png" width="240"/>

**Propósito:** descobrir como o usuário se vê no mundo do vinho. Alimenta personalização do feed (% iniciante vs avançado), tom da microcopy ("iniciante" vs "sommelier") e sort default do Descobrir (populares vs raros). **US-006.**
**Entradas:** `cadastro` (passo 3 ok) → `quiz-nivel`. Login de conta existente **não** passa por aqui. **Saídas:** card tocado → `quiz-interesses { level }`.
**Layout (`QuizNivelScreen`):** top bar com back **desabilitado** (`aria-disabled`, cor n300 — primeira tela do onboarding) + chip "1 de 3"; H1 Fraunces 32 **"Como você se descreve no mundo do vinho?"**; sub Geist 16 **"Sem julgamento — é só pra gente saber por onde começar com você."**; 3 `NivelCard` (min-height 84dp, gap 12):
- **`iniciante`** · `school` · "Tô começando agora" · "Bebo vinho de vez em quando, mas não sei muito. Quero aprender sem complicar."
- **`intermediario`** · `auto_stories` · "Curto vinho e quero saber mais" · "Já tenho meus favoritos, leio sobre vinho às vezes, gosto de descobrir novidades."
- **`avancado`** · `workspace_premium` · "Sou entusiasta ou expert" · "Conheço regiões, uvas, harmonização. Vinho é parte da minha rotina ou profissão."

**Interação:** tap único; feedback `pressed` 200ms (scale 0.98 + bg p50) antes da navegação; `routing` lock impede double-tap (outros cards opacity 0.55).
**Estado/persistência:** stash em `window.__tcUserLevel` (lido depois por Aprender, Descobrir, Treino).
**Analytics (não-negociável):** `level_selected { level }`.
> **⚠️ DIVERGÊNCIA / DECISÃO** — Doc antigo previa quiz unificado (nível + paladar 5 perguntas) e **5 níveis**. Tela separa em Nível (aqui) + Paladar (contextual), com **3 níveis**. **Recomendação:** manter como está (alinha com HP3, menor fricção); atualizar o doc. PO decide.
**Backlog:** botão "Refazer onboarding" em `config-conta`.
**Status:** ✅

---

## 02.2 `quiz-interesses` — Interesses (2 de 3) ✅

_Default · 3 selecionados (mínimo) · 8 (máximo) · tentativa de 9º (shake + toast):_

<img src="shots/interesses-default.png" width="200"/> <img src="shots/interesses-min.png" width="200"/> <img src="shots/interesses-max.png" width="200"/> <img src="shots/interesses-overflow.png" width="200"/>

**Propósito:** descobrir o que o usuário já gosta ou quer explorar. Alimenta o early-feed: nos primeiros 14 dias, **30%** do conteúdo é taggeado com os interesses + **70%** geral (anti-eco-câmara). **US-007 / US-009.**
**Entradas:** `quiz-nivel` → `quiz-interesses { level }`. **Saídas:** `tela-intencao { level, interests }` (mínimo 3); back → `quiz-nivel`.
**Layout (`InteressesScreen`):** top bar back + chip "2 de 3"; H2 Fraunces 28 **"Escolha seus interesses"**; sub Geist 16 **"Selecione entre 3 e 8. Você pode mudar depois."**. Três seções em grid 3-colunas:
- **UVAS (8):** Cabernet Sauvignon · Merlot · Malbec · Pinot Noir · Syrah · Tannat · Chardonnay · Sauvignon Blanc *(`GrapeArt` SVG)*.
- **ESTILOS (2):** Rosé · Espumante *(`StyleArt` SVG — espumante tem bolhinhas)*.
- **REGIÕES (8, Brasil-first):** Vale dos Vinhedos 🇧🇷 · Serra Gaúcha 🇧🇷 · Vale do São Francisco 🇧🇷 · Mendoza 🇦🇷 · Douro 🇵🇹 · Bordeaux 🇫🇷 · Toscana 🇮🇹 · Rioja 🇪🇸.

Bottom bar **sticky**: contagem `aria-live` "X de 18 selecionados" (com "faltam Y" em w700 quando <3) + CTA primário burgundy.
**Estados do CTA:** `count<3` desabilitado, label "Selecione 3"; `count∈[3,8]` habilitado, label "Continuar"; `count=8` o 9º interagido dispara **shake 380ms** + toast warning **"Máximo 8 interesses"** (não seleciona).
**Estado selecionado:** border p700 2px + scale 0.97 + badge check 18×18 p700 no canto superior direito.
**Estado/persistência:** `window.__tcUserInterests` + payload `interests_completed { count, interests }`.
**Analytics:** `interests_completed { count, interests:[ids] }` no tap "Continuar".
> **⚠️ DIVERGÊNCIA — scroll:** ao tocar um item fora do viewport (ex.: Mendoza nas Regiões), os cards selecionados acima saem da tela. Não é bug — a contagem persiste. **Recomendação:** **mini-resumo sticky** com chips (X) acima da CTA. Backlog.
> **⚠️ DIVERGÊNCIA — mínimo:** doc antigo pedia ≥5; tela usa **≥3** (HP3, menor barreira). **Recomendação:** manter 3. PO decide.
**Backlog:** "Meus interesses" editável em `editar-perfil-paladar`.
**Status:** ✅

---

## 02.3 `tela-intencao` — Tela de Intenção (3 de 3) ✅

_Default · modal de confirmação de skip:_

<img src="shots/intencao-default.png" width="200"/> <img src="shots/intencao-skip-modal.png" width="200"/>

**Propósito:** a tela mais importante deste módulo — descobrir **por onde o usuário quer começar** e roteá-lo direto. Reduz drop pós-onboarding ao eliminar o "e agora, o que faço?". **US-010.**
**Entradas:** `quiz-interesses` → `tela-intencao { level, interests }`. **Saídas (single-tap commit):**
- **`discover_home`** → `welcome-final` → home/descobrir FirstTime (zera paladar do ctx para forçar variação).
- **`diary_empty`** → `welcome-final` → home/adega FirstTime/Estante (zera diary do ctx).
- **`learn`** → `aprender { intent, level }` *(direto, sem `welcome-final`)*.
- **`treino_paladar`** → `treino-paladar` *(direto, sem tour — feature tem onboarding próprio)*.
- **`gps_primer_then_confrarias`** → `gps-primer { next: 'confrarias' }`.
- **`gps_primer_then_wizard`** → `gps-primer { next: 'wizard-confraria' }`.
- **`skip_to_feed`** (link "Ainda não sei…") → abre `SkipConfirmModal` → confirma → `welcome-final` → home/comunidade.

**Layout (`TelaIntencaoScreen`):** top bar back + chip "Etapa 3 de 3"; H1 Fraunces 32 **"Por onde você quer começar?"**; sub Geist 16 **"A gente te leva direto. Você pode explorar tudo depois."**. 6 `IntentCard` (vertical, gap 12, min-height 72dp):
- **`discover_home`** (`local_bar`) — "Descobrir vinhos pro meu paladar · Veja recomendações com base no seu DNA".
- **`diary_empty`** (`menu_book`) — "Registrar um vinho que provei · Comece sua adega pessoal com 1 registro de 15 segundos".
- **`learn`** (`school`) — "Aprender sobre vinho · Conteúdo curado pra começar do começo, no seu nível".
- **`treino_paladar`** (`fitness_center`) — "Treinar meu paladar todo dia · Lições de 90 segundos, estilo joguinho — com streak e conquistas".
- **`gps_primer_then_confrarias`** (`groups`) — "Participar de uma confraria · Encontre grupos perto de você que se reúnem para degustar".
- **`gps_primer_then_wizard`** (`construction`) — "Criar minha própria confraria · Trazer meu grupo pro app".

Abaixo, link ghost centralizado **"Ainda não sei, me leva pro app"** → abre `SkipConfirmModal`.
**Interação:** single-tap commit (200ms pressed feedback) + lock contra double-tap; stash `window.__tcLastIntent` (lido depois pelo `welcome-final`).
**SkipConfirmModal** (bottom sheet, Nielsen #5 — prevenção de erro): drag handle + H3 Fraunces 20 **"Tem certeza que quer pular?"** + body Geist 14 **"Sem isso a gente vai te mostrar conteúdo geral. Você pode preencher depois no seu perfil."** + CTA **primária** burgundy **"Voltar e escolher"** (hierarquia invertida — caminho seguro destacado) + ghost **"Pular mesmo assim"**. Dismiss: tap fora, Esc, drag handle. `role="dialog"` + `aria-modal`.
**Analytics (recomendado):** `intent_selected { intent }`; skip: `intent_skip_shown` / `intent_skip_confirmed` / `intent_skip_canceled`.
> **⚠️ DIVERGÊNCIA — chip "Etapa 3 de 3":** as anteriores dizem só "1 de 3" / "2 de 3". **Recomendação:** padronizar para "3 de 3". Cosmético.
> **⚠️ DIVERGÊNCIA — `learn` e `treino_paladar` pulam o `welcome-final`** (vão direto): essas features têm onboarding próprio (mascote/trilha) — empilhar tour seria redundante. ✅ Manter.
**Status:** ✅

---

## 02.4 `gps-primer` — Permission Primer (06.01, rotas D e E) ✅

_Default (rota D, descobrir confrarias) · diálogo nativo simulado · variante rota E (criar confraria):_

<img src="shots/gps-primer-default.png" width="200"/> <img src="shots/gps-primer-dialog.png" width="200"/> <img src="shots/gps-primer-wizard-variant.png" width="200"/>

**Propósito:** explicar **por que** o GPS é necessário **antes** de disparar o prompt do SO (Material 3 / HIG — nunca chamar o prompt frio). **US-011.**
**Entradas:** `tela-intencao` com intent `gps_primer_then_confrarias` (D) ou `gps_primer_then_wizard` (E). Reusável fora do onboarding sempre que precisar de localização. **Saídas:**
- **Ativar localização** → diálogo simulado → "Durante o uso"/"Somente desta vez" = granted → rota D: `welcome-final { intent, location_status: 'granted' }`; rota E: `wizard-confraria-1`.
- **Não permitir** no diálogo → `gps-negado` (hard deny).
- **Agora não** (soft deny) → mesmo destino que granted, com `location_status: 'denied_soft'`.

**Layout (`GpsPrimerScreen`):** top bar back + chip "Etapa 7 de 7" *(legado — ver divergência)*; ilustração círculo 160×160 burgundy/50 + ícone `location_on` 80 p700; H2 Fraunces 24 + body Geist 14 centralizados. **Copy varia por rota:**
- **Rota D (descobrir):** "Pra encontrar confrarias perto de você" + "Usamos sua localização só pra mostrar confrarias e eventos da sua região. Você pode desativar a qualquer momento nas Configurações."
- **Rota E (criar):** "Pra cadastrar onde sua confraria se encontra" + "Você pode escolher cidade e UF manualmente também — mas usar GPS é mais rápido. Desativável depois."

CTAs: **primária** "Ativar localização" + ícone `my_location` com loading 350ms ("Ativando…") antes de abrir o diálogo; **ghost** "Agora não" (nunca em vermelho/destrutivo).
**Diálogo nativo simulado** (overlay 45% + card branco 28dp, estilo Android): título **"Permitir que Tchin Tchin acesse a localização deste dispositivo?"** + 3 botões em coluna (todos p700 sobre branco) — **"Durante o uso do app"** · **"Somente desta vez"** · **"Não permitir"**. Granted: toast success "Tudo certo! Mostrando confrarias da sua região." + 220ms delay + navega. Deny: `gps-negado`.
**Analytics:** `gps_primer_shown { rota: D|E }` no mount; `gps_primer_response { rota, response: 'granted'|'denied'|'soft' }`.
> **⚠️ DIVERGÊNCIA — chip "Etapa 7 de 7":** legado da numeração antiga (com mais passos). Confunde quando a tela é usada **fora** do onboarding. **Recomendação:** trocar por "Quase lá" ou esconder fora do onboarding. PO decide.
> **⚠️ DIVERGÊNCIA — diálogo:** em produção é o prompt **real** do SO (não o simulado). Implementação real: `Geolocation.getCurrentPosition` **só depois** do tap da CTA; mapear `PERMISSION_DENIED` → `gps-negado`.
**Status:** ✅ (UI/UX completos; integração com SO pendente no build real)

---

## 02.5 `gps-negado` — Hard deny / fallback (06.03) ✅

<img src="shots/gps-negado-default.png" width="240"/>

**Propósito:** o usuário **negou** no prompt do SO. Oferece caminho alternativo (escolher cidade/UF manualmente) + instrução para reativar via Configurações.
**Entradas:** `gps-primer` → diálogo → "Não permitir". **Saídas:** "Escolher cidade manualmente" → segue intent original (D: `welcome-final { location_status: 'denied' }`; E: `wizard-confraria-1`); "Tentar de novo" → `gps-primer { next, intent }`; back → `tela-intencao` (via `BACK_SKIP`, evita loop).
**Layout (`GpsNegadoScreen`):** ilustração círculo 160×160 n100 + ícone `location_off` 72 n600; H2 Fraunces 24 **"Sem problema, dá pra continuar"**; body Geist 14 **"Você pode escolher cidade e UF manualmente. Pra liberar GPS depois, é só ir em Configurações do app no celular."**. CTAs: primária "Escolher cidade manualmente"; ghost "Tentar de novo".
> **⚠️ DIVERGÊNCIA — picker de cidade:** doc previa picker explícito UF→Cidade; tela hoje leva pra próxima rota contando com filtro lá dentro. **Recomendação:** implementar `picker-cidade-uf` como Bottom Sheet reutilizável (config, perfil, wizard). Backlog.
**Status:** ✅

---

## 02.6 `welcome-final` — Congrats + tour entry (07.01) ✅

<img src="shots/welcome-final-default.png" width="240"/>

**Propósito:** parabenizar (reforço positivo, sunk-cost) e oferecer **tour opcional de 4 passos** que mostra as 4 abas principais antes do app começar. **US-008.**
**Entradas:** qualquer intent que passa por aqui (`discover_home`, `diary_empty`, `gps_primer_then_confrarias`, `skip_to_feed`; **não** `learn` nem `treino_paladar`). Lê `window.__tcLastIntent` para escolher a **tab destino**: `discover_home`→descobrir · `diary_empty`→adega · `gps_primer_then_confrarias`→confrarias · `skip_to_feed`→comunidade (default).
**Side-effects (`useEffect`):** se `intent === 'discover_home'` e o ctx tem paladar, **zera** o paladar (Descobrir renderiza `FirstTime` sem 5D radar); se `intent === 'diary_empty'` e ctx tem diary semeada, zera o diary (Adega abre Estante FirstTime vazia).
**Layout (`WelcomeFinalScreen`):** background gradiente vertical n50→p50 8% (wash burgundy sutil); centro: `TchinLogo` 64 p700 + H1 Fraunces 32 **"Bem-vindo, {primeiroNome}!"** (nome em p700) + body Geist 14 **"Antes de te liberar, te mostro como o app funciona em 30 segundos."** + 4 dots de preview (todos n300 — não é progresso, só sinal de "tem 4 passos"). Bottom: CTA primária **"Começar tour"** (escreve `tc.tour = { destination, step: 0 }` em localStorage + nav `firstTime: true, fromTour: true`) e ghost **"Pular tour, ir direto"** (limpa `tc.tour` + nav `fromTour: false`).
**Persistência do tour:** `tc.tour` no localStorage — refresh no meio retoma de onde parou. Limpo ao chegar no último passo ("Começar a usar") ou ao tocar "Pular".

**Tour overlay (07.02–05) — `TutorialTooltip`** renderizado por `TchinApp` por cima da home: 4 passos fixos **Comunidade → Confrarias → Descobrir → Adega**. Cada passo: overlay 60% cobrindo a tela **exceto** a bottom nav (iluminada por contraste); card branco 312dp acima da nav, triângulo apontando para a tab; title + body curtos + footer com dots (passo atual em p500) + botões (steps 0–2: "Pular tour" ghost + "Próximo" primary; step 3: "Voltar" ghost + "Começar a usar" primary). `role="dialog"` + `aria-modal`; clique fora **não** fecha.
**Copy do tour:**
- **Comunidade** — "Seu feed de descobertas, dúvidas e conversas sobre vinho. Onde você acompanha as pessoas que segue e os experts."
- **Confrarias** — "Grupos locais que se encontram pra degustar e aprender juntos. Crie a sua ou entre numa que já existe."
- **Descobrir** — "Vinhos selecionados pro seu paladar, scanner de rótulos e harmonização com comida."
- **Adega** — "Sua coleção pessoal. Wishlist, vinhos já provados, estatísticas e diário de degustação."

**07.06 CelebrationToast** — toast top burgundy, 3s auto-dismiss, copy **"Você está pronto! 🍷 Bem-vindo ao Tchin Tchin."** Disparado ao "Começar a usar".
**Analytics (recomendado):** `tour_started`, `tour_step { i }`, `tour_skipped { atStep }`, `tour_completed`.
> **⚠️ DIVERGÊNCIA — copy fixa:** hoje a copy é única ("em 30 segundos"). **Recomendação:** parametrizar por intent (ex.: "te mostro a parte que importa pra você"). Backlog cosmético.
> **⚠️ DIVERGÊNCIA — captura sem nome:** no shot, aparece "Bem-vindo, você!" porque `ctx.user.name` está vazio em dev-mode. Em produção virá com o primeiro nome. ✅ esperado.
**Status:** ✅ (UI completa; analytics do tour pendentes)

---

## 02.7 `tutoriais` — Hub manual de tutoriais (35.x) ✅

<img src="shots/tutoriais-hub.png" width="240"/>

**Propósito:** ponto **único** para o usuário (re)assistir a qualquer tutorial de feature **sob demanda**. Não é parte do fluxo automático — é rede de segurança / referência.
**Entradas:** `editar-perfil` ou `config-conta` → "Tutoriais"; também deep link direto. **Saídas:** card tocado → `onLaunch(t.id)` (TchinApp retira `tutoriais` da pilha e seta o tutorial ativo, que vira coachmark sobre a feature); back → tela anterior.
**Layout (`TutoriaisHubScreen`):** header back + título "Tutoriais do Tchin" + botão **"Resetar"** (p700 text — `resetAllTutorials()` + toast success "Tutoriais resetados."); hero burgundy (gradiente p700→p900 + textura de listras) com `TchinMascot` 56 com `tcMascotBob` + overline "SEU SOMMELIER DIGITAL" + H2 "Oi! Sou o Tchin" + body "Te mostro como cada feature funciona."; lista de tutoriais (`TUTORIAL_REGISTRY`) — cada card: ícone 44×44 (filled `check_circle` s700+s100 se done; outline `auto_awesome` p700+p50 se pendente) + nome + subtítulo **"X passos · Y min"** (Y = ceil(steps/2)) + chevron.
**Estado/persistência:** `tc.tutor.done` (mapa `{ [id]: boolean }`) em localStorage; reset zera tudo. Tutorials registrados são detalhados nos módulos das suas features (wizard de confraria, scanner v2, carta-matches, harmoniza, radar, ata pós-evento etc.).
**Analytics:** `tutorial_launched { id }`, `tutorial_completed { id }`, `tutorials_reset_all`.
> **⚠️ DIVERGÊNCIA — descoberta:** o hub depende do usuário **achar o link** em config/perfil. **Recomendação:** adicionar entry point no botão "?" do header das features complexas. Backlog: **ENT-TUTOR-01**.
**Status:** ✅

---

## 02.8 Destinos first-time (variações de `home/*` e `aprender`) ✅

O onboarding **não termina** em `welcome-final`. Cada destino tem uma variação **FirstTime** ativada por `firstTime: true` (param) ou pela ausência de dados.
- **`home/descobrir`** → `DescobrirHomeFirstTime` quando `firstTime: true` e/ou `!user.paladar` (semeado pelo `welcome-final` para `discover_home`). Mostra card "Faça o quiz de paladar pra recomendações precisas" + lista geral.
- **`home/adega`** → `AdegaScreen` na aba **Estante** vazia quando `firstTime: true` e/ou `diary === []`. Rack de madeira interativo com tiles vazios + CTAs "Registrar primeiro vinho" e "Wishlist". *(Antes existia `AdegaVazia`; aposentada.)*
- **`home/confrarias`** → `firstTime: true` mostra confrarias próximas (D) ou abre `wizard-confraria-1` (E).
- **`home/comunidade`** → `firstTime: true` cai no feed geral *(sem variação dedicada hoje — ver divergência)*.
- **`aprender`** → renderizado direto do intent `learn` com `level: __tcUserLevel`. Conteúdo curado por nível (iniciante = "Tour básico do vinho", avançado = "Aprofundamento por região").
- **`treino-paladar`** → renderizado direto do intent `treino_paladar`. **Onboarding conversacional do mascote TchinDuo** (Módulo 08) — feature tem o próprio onboarding.

> **⚠️ DIVERGÊNCIA — discoverability cruzada:** quem entra via `learn` ou `treino_paladar` **não vê o tour de 4 abas**. **Recomendação:** no primeiro retorno à home, exibir nudge sutil "Quer ver as outras features? Tour rápido →". Backlog: **NUDGE-TOUR-01**.
> **⚠️ DIVERGÊNCIA — Comunidade FirstTime:** hoje não há estado vazio dedicado. Quem vem via `skip_to_feed` cai no feed normal sem feedback de "por que estou aqui". **Recomendação:** variante com card educativo "Você pulou os interesses — toque aqui pra personalizar agora". Backlog: **HOME-COM-FT-01**.
**Status:** ✅ (variações primárias) / ⚠️ (Comunidade FirstTime + nudge cruzado pendentes)

---

## Edge cases & navegação reversa
- **`BACK_SKIP`** (em `prototype.jsx`) inclui: `welcome, onboarding, quiz, quiz-nivel, quiz-interesses, tela-intencao, gps-primer, gps-negado, welcome-final, nudge-d1/d3/d7/d14, confraria-welcome/apresentar/tour-rapido`. Significa: ao tocar "Voltar" **vindo de uma tela do app**, a navegação **pula** essas telas transientes — evita cair de volta na Intenção depois que já está no app, ou no tour da confraria de novo após sair de um grupo.
- **Refresh no meio:** `tc.tour` persiste o passo do tour. Já `__tcUserLevel/Interests/LastIntent` são in-memory only → refresh perde. **Backlog:** persistir essas três em `tc.onboard.v1 = { level, interests, lastIntent }` antes do GA.
- **Login subsequente:** conta existente **não** passa pelo onboarding educacional (vai direto a `home`). Premissa: backend marca `onboarding_complete: true` ao fim da Intenção.
- **Deep link** entrando direto numa tela do onboarding: em dev (`?screen=`) qualquer rota renderiza sem estado anterior; em produção, deep link para `quiz-nivel` exige sessão autenticada **e** onboarding incompleto — senão redireciona a `home`. **Backlog:** middleware no router.

## Pendências de backend / decisões do PO
- **Analytics:** ligar `level_selected`, `interests_completed`, `intent_selected`, `intent_skip_*`, `gps_primer_*`, `tour_*` na infra real.
- **Persistência:** mover `__tcUserLevel/Interests/LastIntent` de `window.*` para localStorage + backend (perfil).
- **GPS:** integrar API nativa (Geolocation) substituindo o diálogo simulado.
- **First-time:** completar Comunidade FirstTime + nudge cruzado para `learn`/`treino_paladar`.
- **Reset:** botão "Refazer onboarding" em `config-conta`.
- **PO decide:** mínimo de interesses (3 vs 5), chip "Etapa 7 de 7" no GPS, copy adaptada por intent no `welcome-final`, `CelebrationToast` sempre no fim do tour.
