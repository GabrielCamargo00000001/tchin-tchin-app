# Tchin Tchin — Especificação Funcional & de Telas (Super-Doc)

> **Documento único, ultra-detalhado, para o time de Dev.** Reúne **todos os fluxos e telas** do app com suas histórias de usuário, regras de negócio, estados e comportamentos.
> Gerado a partir de: (a) **as telas implementadas** no protótipo `tchin-tchin-app` e (b) os **11 documentos de épicos/MVPs/specs** em `…/duolingo do vinho/epicos`.
>
> **Última atualização:** 2026-05-25 · **Status:** em construção (módulo a módulo).

---

## 0. Como ler este documento

### 0.1 Fonte da verdade (regra de ouro)
- **As TELAS do protótipo são a verdade de UI/UX** — layout, navegação, componentes, copy e estados refletem a versão **mais atual** do produto.
- **Os DOCUMENTOS são a verdade de funcionalidade/requisito** — user stories, critérios de aceite, regras, analytics, dados a armazenar.
- Quando os dois **divergem** (o doc pede algo que a tela não faz, faz diferente, ou que por produto/usabilidade deveríamos remover), há um **callout `⚠️ DIVERGÊNCIA / DECISÃO`** com a situação e a **recomendação** — a decisão final é do PO.

### 0.2 Legenda de status (por tela/feature)
| Selo | Significado |
|---|---|
| ✅ | **Construída** — existe no protótipo e bate com o doc |
| ⚠️ | **Construída com divergência** — existe, mas difere do doc (ver callout) |
| 🆕 | **Nova** — existe no protótipo, **além/depois** dos docs (a tela é a referência) |
| 🟡 | **Parcial** — começada, incompleta |
| ⛔ | **Só especificada** — está no doc, **sem tela** (ver Apêndice A — Backlog) |

### 0.4 Screenshots (telas reais)
Cada módulo embute o **print real** de cada tela, em `docs/spec/shots/<rota>.png` (141 telas capturadas). As imagens são geradas automaticamente por **`scripts/capture-shots.mjs`** (Playwright + um modo de captura no app: `?screen=<rota>&tab=<aba>`). **Para regenerar** após mudanças de UI: subir o dev server e rodar `node scripts/capture-shots.mjs` (precisa de `npx playwright install chromium` uma vez).

### 0.3 Template de cada tela (no módulo)
Cada tela é documentada com: **Rota/ID · Propósito · US relacionadas · Entradas (de onde se chega) · Saídas (para onde vai) · Layout & componentes · Estados (default/vazio/loading/erro/variantes) · Interações & micro-comportamentos · Copy-chave · Dados (entrada/saída, mock×real) · Regras & critérios de aceite · Analytics · Sad paths/edge cases · ⚠️ Divergências · Status**.

---

## 1. Visão geral do produto

**Tchin Tchin** — app social de vinho (pt-BR, foco Brasília/DF, expansão BR). Estratégia **"come for the tool, stay for the network"**: ferramentas individuais (descobrir/registrar/aprender) puxam o uso; confrarias/eventos/feed retêm.

**6 dores validadas (Sprint 11-13):** (1) incerteza de compra · (2) gap educacional · (3) memória fragmentada do que provou · (4) desconfiança em recomendações · (5) harmonização inacessível · (6) rótulos difíceis.

**Persona dominante (relatório de mercado):** **HP3 — Iniciante Estratégica** (~40% do sinal): quer decidir a compra com segurança e aprender **sem se sentir ignorante**. Secundária: **HP4 — Sommelier de Fim de Semana**. Personas dos épicos: **Guilherme** (entusiasta estudioso) e **Marcelo** (entusiasta social).

**Abas principais (bottom nav):** Descobrir · Adega · Comunidade · Confrarias.

---

## 2. Mapa de módulos

| # | Módulo | Telas | Doc principal |
|---|---|---|---|
| 01 | **Auth & Acesso** | welcome, onboarding slides, login, cadastro, social/magic/verif, recuperar senha, termos | MVP1 Épico 1, SPEC Onboarding slides |
| 02 | **Onboarding educacional & Roteamento** | quiz-nível, interesses, tela-intenção, GPS primer, welcome-final, tutoriais, destinos first-time | Revisão UI/UX v2.1, MVP1 Épico 1 |
| 03 | **Meu Paladar (quiz)** | quiz, quiz-result | Sprint 11-13 Épico T1 |
| 04 | **Descobrir & Marketplace** | home/descobrir, marketplace, wine, busca, filtros, lista-desejos, comparar | MVP1 Épico 5/6, Sprint 11-13 |
| 05 | **Carrinho & Checkout** | carrinho, endereço, pagamento, pedido-confirmado | MVP1 |
| 06 | **Scanner & Aprenda Bebendo (contextual)** | scanner(+v2/result/fallback), modo-restaurante, carta-matches, porque-combina | MVP1 Épico 4, Sprint 11-13 Épico T3 |
| 07 | **Adega, Diário & Estante** | home/adega (Estante/Diário/Indicadores/Paladar), register-consumo, registro rápido/completo/confirmação, relatório mensal, favoritos | MVP1 Épico 7, Sprint 11-13 Épico T2 |
| 08 | **Treine seu Paladar (Duolingo do vinho)** 🆕 | treino-paladar, treino-licao, treino-liga, treino-aprender | Sprint 11-13 Épico T3, MVP2 Épico 8/9/10 |
| 09 | **Aprenda (hub educacional)** | aprender, aprenda, aprenda-detalhe | MVP2 Épico 10 |
| 10 | **Harmoniza** | harmoniza, harmoniza-resultados (+ reversa) | Sprint 11-13 Épico T4 |
| 11 | **Confrarias** | home/confrarias, detalhe (4 abas), wizard 1-6, config/convidar/sair/transferir/regras, welcome/apresentar/tour | MVP2 Épicos 1-7, Filtros das Confrarias |
| 12 | **Eventos** | wizard 1-5, detalhe, editar, presença/RSVP/QR, pós-evento (avaliar/ata) | MVP2 Épico 2 |
| 13 | **Comunidade & Feed** | home/comunidade, criar-post, criar-momento, post-detail, comentários | MVP1 Épico 2, MVP2 Épico 15 |
| 14 | **Perfil & Social** | perfil-outro, editar-perfil (+foto/paladar/privacidade), seguidores/seguindo/atividade/vinhos/sugestões/comparar, badges-galeria | MVP1, MVP2 |
| 15 | **Expert** | virar/aplicar/pendente, Q&A, responder, perguntar | MVP1 Épico 2 (badge expert) |
| 16 | **Indicação & Convites** | indicação (landing/compartilhar/meus-convites/recompensas), convite-recebido | Filtros das Confrarias (Convites US-C) |
| 17 | **Chat / DMs** | chat-lista, chat-conversa | MVP2 Épico 13 |
| 18 | **Notificações & Engajamento** | notificações, push (primer/negado/canais/preview), nudges D1/D3/D7/D14, plus-one | MVP1, Sprint 11-13 |
| 19 | **Jornada & Desafios** | jornada, jornada-celebrar, desafio-detalhe, badges | MVP2 Épico 7/9 |
| 20 | **Config & Suporte** | config (notif/privacidade/conta/bloqueados), suporte (FAQ/contato) | MVP1 |
| 21 | **Estados de sistema** | erro-404/permissão/sessão/servidor, vinho-indisponível, toast | transversal |

> **Financeiro / Rachão (LACI/Celcoin)** é transversal — documentado dentro de **Eventos** (12) e referenciado em **Confrarias** (11). Specs: MVP2 Épico 3, Sprint 11-13 Épico T5.

---

## 3. Inventário completo de telas (rotas)

> Status preliminar; cada módulo confirma e detalha. `home` renderiza 4 variações por aba + estados first-time.

### Módulo 01 — Auth & Acesso
`welcome` ✅ · `onboarding` (slides pré-auth) ⚠️ · `login` ✅ · `cadastro` ⚠️ · `login-social` ✅ · `magic-link-enviado` ✅ · `verif-telefone-otp` ✅ · `verif-concluida` ✅ · `recuperar` ✅ · `recuperar-email` ✅ · `recuperar-enviado` ✅ · `recuperar-otp` ✅ · `recuperar-redefinir` ✅ · `recuperar-sucesso` ✅ · `termos` ✅ · `politica-privacidade` ✅

### Módulo 02 — Onboarding educacional & Roteamento
`quiz-nivel` ✅ · `quiz-interesses` ✅ · `tela-intencao` ✅ · `gps-primer` ✅ · `gps-negado` ✅ · `welcome-final` ✅ · `tutoriais` ✅ · (destinos first-time = variações de `home`) ✅

### Módulo 03 — Meu Paladar
`quiz` ✅ · `quiz-result` ✅

### Módulo 04 — Descobrir & Marketplace
`home/descobrir` ✅ · `marketplace` ✅ · `wine` ✅ · `busca` ✅ · `filtros-avancados` ✅ · `lista-desejos` ✅ · `comparar-vinhos` ✅

### Módulo 05 — Carrinho & Checkout
`carrinho` ✅ · `endereco` ✅ · `pagamento` ✅ · `pedido-confirmado` ✅

### Módulo 06 — Scanner & Aprenda Bebendo
`scanner` ✅ · `scanner-result` ✅ · `scanner-v2` ✅ · `scanner-result-v2` ✅ · `scanner-fallback` ✅ · `modo-restaurante` ✅ · `carta-matches` ✅ · `porque-combina` ✅

### Módulo 07 — Adega, Diário & Estante
`home/adega` (Estante 🆕 / Diário / Indicadores / Paladar) ✅ · `register-consumo` ✅ · `registro-rapido` ✅ · `registro-completo` ✅ · `registro-confirmacao` ✅ · `relatorio-mensal` ✅ · `favoritos` ✅

### Módulo 08 — Treine seu Paladar (Duolingo do vinho) 🆕
`treino-paladar` 🆕 · `treino-licao` 🆕 · `treino-liga` 🆕 · `treino-aprender` 🆕

### Módulo 09 — Aprenda
`aprender` ✅ · `aprenda` ✅ · `aprenda-detalhe` ✅

### Módulo 10 — Harmoniza
`harmoniza` ✅ · `harmoniza-resultados` ✅ · (reversa/calibração nos componentes f23_*) ✅

### Módulo 11 — Confrarias
`home/confrarias` (abas Confrarias|Eventos) ✅ · `confraria-detalhe` ✅ · `wizard-confraria-1…6` ✅ · `confraria-config` ✅ · `confraria-convidar` ✅ · `confraria-sair` ✅ · `confraria-transferir` ✅ · `confraria-regras` ✅ · `confraria-welcome` ✅ · `confraria-apresentar` ✅ · `confraria-tour-rapido` ✅

### Módulo 12 — Eventos
`event-wizard-1…5` ✅ · `event-detalhe` ✅ · `evento-editar` ✅ · `evento-presenca` ✅ · `evento-pos-avaliar` ✅ · `evento-pos-ata` ✅

### Módulo 13 — Comunidade & Feed
`home/comunidade` ✅ · `criar-post` ✅ · `criar-momento` ✅ · `post-detail` ✅ · `comentarios` ✅

### Módulo 14 — Perfil & Social
`perfil-outro` ✅ · `editar-perfil` ✅ · `editar-perfil-foto` ✅ · `editar-perfil-paladar` ✅ · `editar-perfil-privacidade` ✅ · `perfil-seguidores` ✅ · `perfil-seguindo` ✅ · `perfil-atividade-publica` ✅ · `perfil-vinhos-provados` ✅ · `perfil-sugestoes` ✅ · `perfil-comparar-paladar` ✅ · `badges-galeria` ✅

### Módulo 15 — Expert
`expert-virar` ✅ · `expert-aplicar` ✅ · `expert-pendente` ✅ · `expert-q-a` ✅ · `expert-responder` ✅ · `perguntar-expert` ✅

### Módulo 16 — Indicação & Convites
`indicacao-landing` ✅ · `indicacao-compartilhar` ✅ · `indicacao-meus-convites` ✅ · `indicacao-recompensas` ✅ · `convite-recebido` ✅

### Módulo 17 — Chat / DMs
`chat-lista` ✅ · `chat-conversa` ✅ *(UI pronta; DM completo é MVP2 Épico 13)*

### Módulo 18 — Notificações & Engajamento
`notificacoes` ✅ · `push-primer` ✅ · `push-negado` ✅ · `push-canais` ✅ · `push-preview` ✅ · `nudge-d1/d3/d7/d14` ✅ · `plus-one` ✅

### Módulo 19 — Jornada & Desafios
`jornada` ✅ · `jornada-celebrar` ✅ · `desafio-detalhe` ✅ · `badges` ✅

### Módulo 20 — Config & Suporte
`config-notif` ✅ · `config-privacidade` ✅ · `config-conta` ✅ · `config-bloqueados` ✅ · `suporte-faq` ✅ · `suporte-contato` ✅

### Módulo 21 — Estados de sistema
`erro-404` ✅ · `erro-permissao` ✅ · `erro-sessao` ✅ · `erro-servidor` ✅ · `vinho-indisponivel` ✅ · `toast` (overlay) ✅

---

## 4. Apêndice A — Backlog especificado (sem tela)

Features que estão **só nos documentos** (sem implementação no protótipo). Detalhamento no doc `99-backlog.md`.

- **DMs completas** (além do chat UI) — MVP2 Épico 13
- **Personalização por Machine Learning** — MVP2 Épico 14
- **Posts patrocinados & Sistema de leilão/anúncios** — MVP2 Épico 12 + doc "Sistema de leilão"
- **Parcerias B2B / Semi-marketplace** — MVP2 Épico 11, MVP3 Épico 18-19
- **Expansão para outras bebidas (multi-bebida)** — Sprint 11-13 Épico T6
- **Feed social de vídeos + Programa de Criadores** — Sprint 11-13 Épico T7
- **Carrossel de fotos / vídeos longos** — MVP2 Épico 15
- **Analytics avançado no portal admin** — MVP2 Épico 16
- **Expansão geográfica** — MVP2 Épico 17

---

## 5. Fontes

Documentos (`…/duolingo do vinho/epicos`): MVP Tchin Tchin (mestre), Construção 2.0, MVP 2, MVP 3, Sprint 11-13, Revisão UI/UX, UI/UX Novas telas, Plano de Testes (Sprints 9-12), SPEC Onboarding slides, Sistema de leilão, Épico Filtros das Confrarias.
Código/telas: `tchin-tchin-app/src/legacy/*` (rotas em `prototype.jsx`); contexto em `docs/HANDOFF.md`.

---

## 6. Módulos (arquivos)
- `01-auth-acesso.md` — ✅ pronto (padrão de qualidade)
- `02`…`21` — em produção
- `99-backlog.md` — Apêndice A detalhado
