# Tchin Tchin — Handoff & Contexto do Projeto

> Documento de continuidade. Se você é um novo dev (ou uma nova sessão de IA),
> **leia isto primeiro**. Resume o que o app é, como foi construído, decisões
> tomadas, o que já foi feito e o que falta.
>
> Última atualização: 2026-05-25.

---

## 1. O que é

**Tchin Tchin** — app social de vinho (pt-BR, foco Brasília/DF). O usuário descobre
seu paladar, entra em **confrarias** (clubes de vinho), participa de **eventos**
(degustações, jantares), registra vinhos na **adega**, troca na **comunidade** e
compra no **marketplace**. Mobile-first; renderizado num frame de celular 412×892.

Origem: bundle de **handoff do Claude Design** (`Tchin Tchin Refator.html`, ~100
telas) que rodava via Babel no navegador, com todos os componentes em escopo
global compartilhado e registrados em `window`. Este projeto é o **port** disso
para um app real **Vite + React + TypeScript**.

---

## 2. Onde está / como rodar

- **Pasta:** `C:\Users\camargo\tchin-tchin-app`
- **GitHub (privado):** https://github.com/GabrielCamargo00000001/tchin-tchin-app
- **Identidade git (local do repo):** Gabriel Camargo `<gabrielpcamargo78@gmail.com>`

```bash
npm install
npm run dev      # http://localhost:5173 (abre sozinho)
npm run build    # build de produção em dist/
node scripts/smoke-test.mjs   # teste de fumaça headless (jsdom)
```

> **Ao testar no navegador:** dê **Ctrl+Shift+R** (hard refresh) — o HMR às vezes
> serve versão antiga em cache.

---

## 3. Arquitetura

### 3.1 Visão geral
- **`index.html`** — fontes (Inter, Fraunces, JetBrains Mono, Material Symbols) +
  CSS global (keyframes, reset). O `#root` ocupa a viewport e **não rola**; só o
  conteúdo dentro do frame do celular rola.
- **`src/main.tsx`** — entry; renderiza `<TchinApp/>`.
- **`src/legacy/`** — as ~100 telas/componentes portados (este é o **código-fonte
  de verdade** hoje).
- **`scripts/convert-legacy.mjs`** — o conversor que gerou `src/legacy/` a partir
  do bundle (ver 3.3). **NÃO rode de novo** — sobrescreve as edições manuais.
- **`scripts/smoke-test.mjs`** — monta o app em jsdom e confirma que renderiza.

### 3.2 Arquivos-chave em `src/legacy/`
- **`tokens.jsx`** — design system: paleta (`T.c.*`), tipografia (`T.t.*`),
  espaçamento, raios, sombras; helpers `Icon`, `TchinLogo`, `BottlePlaceholder`,
  skeletons.
- **`components.jsx`**, **`cards.jsx`** — UI compartilhada (Button, Avatar,
  BottomNav, AppHeader, FAB, WineCard, **ConfrariaCard** com badges, EventCard…).
- **`data.jsx`** — dados mock (`MOCK_USER`, `MOCK_WINES`, `MOCK_CONFRARIAS`,
  `MOCK_EVENTS`, `QUIZ_QUESTIONS`…). Registrados em `window` também.
- **`prototype.jsx`** — **`TchinApp`**: frame do celular + roteador em pilha
  (`go(screen, params)`) + ~100 rotas no `switch`. Coração do app.
- **`onboarding-manager.js`** — coordenador central de onboarding (1 overlay por
  vez; ver 3.4).
- **`event-covers.jsx`** — capas de evento (#6): presets, `getEventCover`,
  `CoverPicker`, `suggestEventNames`.
- **`screens-treino-paladar.jsx`** — feature **"Treine seu Paladar"** (Duolingo
  do vinho): store em localStorage (`tc.treino.v1`), 7 lições seed, Home/Hub
  (streak, XP, níveis, badges), Lição de 5 cards (hook→conceito→quiz failure-safe
  →aplicação→recap). Rotas `treino-paladar` e `treino-licao`. Entradas: drawer do
  perfil + tela de intenção. Usa `fbEvent` (stub) — **sem** PostHog/push reais (o
  doc original pedia uma stack PWA separada; aqui foi adaptado às convenções do
  projeto).
- **`screens-*.jsx`** e numerados (`13.01_Avatar.jsx` → `f13_01_Avatar.jsx` etc.)
  — telas individuais.
- Telas do **canvas do Claude Design** (`canvas-app`, `design-canvas`,
  `design-system`, `tweaks-panel`, `android-frame`) foram **excluídas** — são o
  editor, não o produto.

### 3.3 Como o port funciona (o conversor)
O bundle original compartilhava um único escopo global e fazia
`Object.assign(window, {...})` no fim de cada arquivo. O `convert-legacy.mjs`:
1. lê a ordem dos `<script>` do `Tchin Tchin Refator.html` (a **ordem de carga é
   autoritativa**: em colisão de nome, vence o último carregado);
2. acha, por análise de AST (Babel), o que cada arquivo **fornece** (bindings de
   topo) e o que **precisa** (variáveis livres) → gera `import`/`export`;
3. **move os `Object.assign(window, …)` pro fim** de cada módulo (no original,
   rodava com `const`→`var` hoisted; em ESM real isso dava erro de TDZ);
4. mantém os `Object.assign(window, …)` (parte do código lê `window.MOCK_USER`,
   `window.ACTIVITY_META`, flags `window.__tc*` etc.).

Há um bloco `PATCHES` no conversor com correções dos bugs de migração (ex.: `go`
faltando em `EventosTab`, chaves duplicadas). **Daqui pra frente, edite
`src/legacy/` direto** — o conversor já cumpriu o papel.

### 3.4 Gerente de onboarding (`onboarding-manager.js`)
O app tem várias camadas de onboarding (slides, tour com tooltips, `TchinTutor`
que dispara por tela, telas "primeira vez", boas-vindas de confraria, tutorial
pós-criação, nudges). O coordenador garante **1 overlay por vez** com prioridade
`post-criacao > confraria-welcome > tour > tutor`. Cada overlay faz `claim()`/
`release()`; um de prioridade menor não abre enquanto há um maior ativo
(`isBlocked`). Vive em `window.TchinOnboarding`.

### 3.5 Verificação
- `npm run build` deve passar limpo (~110 módulos).
- `node scripts/smoke-test.mjs` deve dizer `SMOKE TEST PASSED`. Ele usa o
  `ssrLoadModule` do Vite, então **inicializa todos os módulos** — pega erros de
  import/carga em qualquer tela.

---

## 4. Marca (fonte de verdade pra voz/UI)
Doc: "Construção de Marca Global — Tchin Tchin" (Jan/2026).
- **Tagline:** "Tchin. Onde vinho vira experiência." · **Mantra:** "Para cada
  vinho, uma boa experiência."
- **Arquétipos:** O Mago (70%, transformação) + O Sábio (30%, conhecimento).
  Personalidade: "o amigo que sabe muito de vinho mas nunca te faz sentir
  ignorante". **Evitar** o arquétipo Governante (elitista/intimidador).
- **Tom:** acolhedor, curioso, celebratório, acessível.
- **Vocabulário — usar:** confraria, membro, experimentar, descobrir,
  compartilhar, degustação. **Evitar:** usuário, consumidor, premium, expert (como
  rótulo), comprar, "para verdadeiros conhecedores", "última chance".
- **Paleta — DECISÃO:** manter a do **protótipo** (`tokens.jsx`: vinho `#722F37`/
  `#4A1F24`, dourado `#D4A574`, fundo `#FAFAF8`, serifada **Fraunces**). O manual
  diverge (vinho `#6B1F3D`, Playfair), mas serve só de referência pra voz — **não
  trocar a paleta**.

---

## 5. Decisões importantes
- **Paleta:** protótipo (ver acima).
- **Pagamento de evento:** **gratuito OU valor fixo por pessoa** (o admin
  escolhe). **Sem rachão/rateio.** Pagamentos via **LACI** (fintech própria) são
  reconhecidos automaticamente; pagamento por conta própria o admin confirma.
- **Onboarding:** manter todas as camadas, só impedir sobreposição (gerente
  central).
- **Tutorial pós-criação de confraria:** virou **modal central** (carrossel), não
  mais spotlight com máscara SVG (o spotlight quebrava porque as âncoras ficam em
  abas diferentes → tela preta travada). Pendente decisão do usuário: manter modal
  (A) ou refazer um spotlight que funcione (B).

---

## 6. O que já foi feito (por fase / commit)

| Commit | Conteúdo |
|---|---|
| `376a5ad` | Port inicial (Vite+React+TS, ~100 telas via conversor) |
| `9ec8bee` | **Fase 0** — gerente de onboarding (sem sobreposição) + atalho "Adicionar" vinho no topo da Adega (e remove FAB duplicado) |
| `f2e8a92` | **Fase 2 (1)** — evento: #6 capa selecionável + nome por IA; #7/#9 modal de adicionar vinhos (busca + filtro de preço + scanner + multi-seleção); #8 "Eu escolho vs Tchin sugere"; pagamento sem rachão |
| `cbad4ee` | **Fase 2 (2)** — #10 resumo recolhível de vinhos na confirmação; #A visão admin do evento (abas Presença/Pagamentos, status pago/pendente, LACI, arrecadado, check-in) |
| `7aaa004` | Correções: 1ª tentativa do tutorial pós-criação; capa pra cima; "Eu escolho" começa vazio; remove Plus One; microcopy RSVP/push; campo de Regras (#3) |
| `5e5f453` | Tutorial pós-criação vira **modal central** (fim da tela preta); banner usa o evento criado; "Começar do zero" 1º; tipo de evento "Outro" |
| `2bf5621` | **Fase 1** — #2 sugestão de nomes de confraria (cidade + repertório, "gerar outras"); #4 badges nos cards (Verificada/Evento esta semana/Em alta/Nova/Perto de você/Iniciantes); #11 abas Confrarias\|Eventos + busca (só confrarias) + Eventos (Das minhas/Inscritos). #5 templates já completos |
| `63f6f8c` | UX: **scroll dentro do frame** (página não rola mais); "Pular" funcional na apresentação; confraria abre em **Eventos**; descrição só no topo; respiro no banner |
| `335b1af` | Remove **aba Sobre** (regras ficam nos 3 pontos; checklist do admin foi pro topo de Eventos); remove passo "Desafios semanais" do tour rápido |
| `6d8641d` | **docs/HANDOFF.md** (este documento) |
| _(em seguida)_ | UX: scroll dentro do frame, "Pular" na apresentação, confraria abre em Eventos, abas reordenadas |
| _(em seguida)_ | **Feature "Treine seu Paladar"** (`screens-treino-paladar.jsx`) + entradas no drawer e na tela de intenção |
| _(Fase 3)_ | **#13** tela de interesses: 8 uvas (+ Syrah, Tannat), estilos Rosé/Espumante, regiões Brasil-first (Serra Gaúcha, Vale do São Francisco, Rioja) + lookup do feed sincronizado · **#12** copy de login/cadastro no tom da marca |

### Mapa dos pedidos do cliente (numeração interna)
- #1 Adega: surfaçar tela de adicionar vinho ✅
- #2 Sugestão de nomes de confraria ✅
- #3 Regras na criação de confraria ✅
- #4 Badges nos cards de confraria ✅
- #5 Templates de confraria (capa/desc/tags) ✅ (já existiam)
- #6 Template de evento (nome IA + capa) ✅
- #7 Adicionar vinhos ao evento: filtro de preço + busca + scanner ✅
- #8 "Escolher vs Tchin sugere" (auto → Meu Paladar → sugestão na faixa) ✅
- #9 Seleção múltipla de vinhos ✅ (evento; adega/mkt = follow-up)
- #10 Distribuição de muitos vinhos na confirmação ✅
- #11 Confrarias: buscar + abas Confrarias\|Eventos ✅
- #12 Texto de login/cadastro pela marca ✅ **(Fase 3)**
- #13 Opções da tela de interesses ✅ **(Fase 3)**
- #A Visão admin do evento (inscritos/pagamento) ✅

---

## 7. O que falta / follow-ups
- ~~**Fase 3 (copy):** #12 login/cadastro + #13 uvas/regiões~~ ✅ **concluído em 2026-05-25.**
  Uvas: Cabernet, Merlot, Malbec, Pinot Noir, Syrah, Tannat, Chardonnay, Sauvignon
  Blanc + estilos Rosé/Espumante; regiões Brasil-first: Vale dos Vinhedos, Serra
  Gaúcha, Vale do São Francisco, Mendoza, Douro, Bordeaux, Toscana, Rioja.
- **#9** multi-seleção também na **adega** e no **marketplace** (só evento feito).
- **#8** round-trip do quiz de volta pro wizard (hoje o caminho auto manda pro
  Meu Paladar mas não retorna sozinho ao wizard).
- **Tutorial pós-criação:** decidir A (modal) vs B (spotlight funcional).
- **Bundle:** ~1,2 MB num chunk só — considerar code-splitting por rota.
- **Tipagem:** `src/legacy` é JS (`allowJs`, `@ts-nocheck`); telas não tipadas.
  Tipar incrementalmente é o próximo passo de qualidade.

---

## 8. Convenções e armadilhas
- **Edite `src/legacy/` direto.** Não rode o conversor (sobrescreve).
- **Padrão dos arquivos legacy:** cada um importa o que usa, exporta o que provê,
  e ainda faz `Object.assign(window, {...})` no fim (rede de segurança). Usa a
  **API clássica do React** (`React.useState` etc.) — por isso cada arquivo tem
  `import React from 'react'`.
- **Avisos `LF will be replaced by CRLF`** no git: inofensivos (Windows).
- **Commits:** mensagens em pt-BR; rodapé `Co-Authored-By: Claude Opus 4.7 (1M
  context) <noreply@anthropic.com>`. No PowerShell, evite here-string com aspas
  duplas no assunto (quebra o parser) — use vários `-m '...'` com aspas simples.
- **Push:** só quando o usuário pede. Fluxo: `git push origin main` (Git
  Credential Manager abre o navegador no 1º login).
- **Dev server:** roda em background; recarrega no save (lembre do Ctrl+Shift+R).
- **Não renderize/print no navegador** pra entender o design — leia o código (era
  a orientação do handoff original).

---

## 9. Navegação do app (resumo do roteador)
`TchinApp` (em `prototype.jsx`) mantém uma pilha de telas e um `go(screen,
params)`. Telas com "chrome" (bottom nav) vs `hideChrome` estão listadas lá.
Abas principais: **descobrir / adega / comunidade / confrarias**. Fluxos grandes:
onboarding → quiz de paladar → home; criar confraria (wizard 1–6) →
detalhe; criar evento (wizard 1–5) → detalhe/gerenciar; scanner; harmonização;
marketplace/checkout; perfil; configurações.
