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
| 01 | **[Auth & Acesso](01-auth-acesso.md)** ✅ | welcome, onboarding slides, login, cadastro, social/magic/verif, recuperar senha, termos | MVP1 Épico 1, SPEC Onboarding slides |
| 02 | **[Onboarding educacional & Roteamento](02-onboarding-roteamento.md)** ✅ | quiz-nível, interesses, tela-intenção, GPS primer, welcome-final, tutoriais, destinos first-time | Revisão UI/UX v2.1, MVP1 Épico 1 |
| 03 | **[Meu Paladar (quiz)](03-meu-paladar.md)** ✅ | quiz, quiz-result | Sprint 11-13 Épico T1 |
| 04 | **[Descobrir & Marketplace](04-descobrir-marketplace.md)** ✅ | home/descobrir, marketplace, wine, busca, filtros, lista-desejos, comparar | MVP1 Épico 5/6, Sprint 11-13 |
| 05 | **[Carrinho & Checkout](05-carrinho-checkout.md)** ⚠️ | carrinho, endereço, pagamento, pedido-confirmado | MVP1 Épico 6 + Sprint 11-13 |
| 06 | **[Scanner & Aprenda Bebendo](06-scanner-aprenda-bebendo.md)** ✅ | scanner(+v2/result/fallback), modo-restaurante, carta-matches, porque-combina | MVP1 Épico 4, Sprint 11-13 Épico T3 |
| 07 | **[Adega, Diário & Estante](07-adega-diario-estante.md)** ✅ 🆕 | home/adega (Estante/Diário/Indicadores/Paladar), register-consumo, registro rápido/completo/confirmação, relatório mensal, favoritos | MVP1 Épico 7, Sprint 11-13 Épico T2 |
| 08 | **[Treine seu Paladar (Duolingo do vinho)](08-treine-seu-paladar.md)** ✅ 🆕 | treino-paladar, treino-licao, treino-liga, treino-aprender | Sprint 11-13 Épico T3, MVP2 Épico 8/9/10 |
| 09 | **[Aprenda (hub educacional)](09-aprenda.md)** ✅ | aprender, aprenda, aprenda-detalhe | MVP2 Épico 10 |
| 10 | **[Harmoniza](10-harmoniza.md)** ✅ | harmoniza, harmoniza-resultados (+ reversa) | Sprint 11-13 Épico T4 |
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

### Módulo 02 — Onboarding educacional & Roteamento [📄 doc completo](02-onboarding-roteamento.md)
`quiz-nivel` ✅ · `quiz-interesses` ✅ · `tela-intencao` ✅ · `gps-primer` ✅ · `gps-negado` ✅ · `welcome-final` ✅ · `tutoriais` ✅ · (destinos first-time = variações de `home`) ✅
**Estados extra capturados:** `nivel-default`, `interesses-default|min|max|overflow`, `intencao-default|skip-modal`, `gps-primer-default|dialog|wizard-variant`, `gps-negado-default`, `welcome-final-default`, `tutoriais-hub`.

### Módulo 03 — Meu Paladar [📄 doc completo](03-meu-paladar.md)
`quiz` ✅ · `quiz-result` ✅
**Estados extra capturados:** `paladar-q1|q1-selected|q2|q3|q4|q5`, `paladar-result`.

### Módulo 04 — Descobrir & Marketplace [📄 doc completo](04-descobrir-marketplace.md)
`home/descobrir` ✅ · `marketplace` ⚠️ · `wine` ⚠️ · `busca` ✅ · `filtros-avancados` ⚠️ · `lista-desejos` ⚠️ · `comparar-vinhos` ⚠️
**Estados extra capturados:** `marketplace-default|filtersheet|search|multi`, `wine-default`, `busca-empty|results`, `filtros-default|applied`, `desejos-default|selecting`, `comparar-default`.

### Módulo 05 — Carrinho & Checkout [📄 doc completo](05-carrinho-checkout.md)
`carrinho` ⚠️ · `endereco` ⚠️ · `pagamento` ⚠️ · `pedido-confirmado` ⚠️
**Estados extra capturados:** `carrinho-default|cupom-ok`, `endereco-default|novo`, `pagamento-cartao|pix|boleto`, `pedido-confirmado-default`.
**⛔ Faltam no app (vêm dos épicos):** gateway real (Celcoin/Pagar.me), frete real (Correios), NFe, tracking real, histórico de pedidos, recompra rápida, Apple/Google Pay, cartão salvo, PIX por chave, ViaCEP, múltiplas transportadoras, verificação de idade no recebimento.

### Módulo 06 — Scanner & Aprenda Bebendo [📄 doc completo](06-scanner-aprenda-bebendo.md)
`scanner` ⚠️ (legado v1) · `scanner-result` ⚠️ (legado v1) · `scanner-v2` ✅ · `scanner-result-v2` ✅ · `scanner-fallback` ✅ · `modo-restaurante` ✅ · `carta-matches` ✅ · `porque-combina` ✅
**Estados extra capturados:** `scanner-v1-tooltip|default|help`, `scanner-result-v1-fail`, `scanner-v2-default`, `scanner-result-v2-default`, `scanner-fallback-default`, `modo-restaurante-default`, `carta-matches-default|por-preco|por-tipo`, `porque-combina-default`.
**Tutoriais conversacionais capturados:** `tutor-scanner-{intro,step-1,step-2,step-3}` (3 steps), `tutor-restaurante-{intro,step-1,step-2,step-3,step-4}` (4 steps).
**⛔ Faltam no app (vêm dos épicos):** OCR real (rótulo + carta), NLG real do "Por que combina", base de vinhos populada, calibração de câmera, histórico de scans, histórico de cartas com lookup por restaurante (GPS), modo "lista digitada", fuzzy match "Você quis dizer X?", integração com Treino seu Paladar.

### Módulo 07 — Adega, Diário & Estante [📄 doc completo](07-adega-diario-estante.md)
`home/adega` (Estante 🆕 / Diário / Indicadores / Paladar) ✅ · `register-consumo` ✅ · `registro-rapido` ✅ · `registro-completo` ✅ · `registro-confirmacao` ✅ · `relatorio-mensal` ✅ · `favoritos` ✅
**Estados extra capturados:** `home-adega-{estante,diario,indicadores,paladar}`, `register-consumo-step1|step1-busca`, `registro-rapido-default`, `registro-completo-default`, `registro-confirmacao-default`, `relatorio-mensal-default`, `favoritos-default`.
**⚠️ Divergências-chave:** persistência da Estante só na sessão (window.__tcCellar); 4 conceitos de "guardar" sobrepostos (Estante/Diário/Favoritos/Wishlist); dimensões do paladar desalinhadas (Aromas vs Frutado); 2 fluxos de registro coexistem.
**⛔ Faltam no app (épicos):** persistência real, sync offline, editar/excluir registro, filtros do diário, export, geração de imagem do Wrapped, insights NLG, quantidade por slot na estante.

### Módulo 08 — Treine seu Paladar (Duolingo do vinho) 🆕 [📄 doc completo](08-treine-seu-paladar.md)
`treino-paladar` 🆕 · `treino-licao` 🆕 · `treino-liga` 🆕 · `treino-aprender` 🆕
**Estados extra capturados:** `treino-onb-{intro,say1,objetivo,goal,say2,streakgoal,gems,final}` (8 passos do onboarding do mascote), `treino-home`, `treino-licao-{conceito,exercicio,feedback,completa}`, `treino-liga-default`, `treino-aprender-default`.
**⛔ Faltam no app (épicos):** sync server-side (anti-fraude), CMS de lições (hoje hard-coded), matchmaking real de ligas, conteúdo de micro-vídeos, notificação de streak em risco, fim de vidas real, loja de cristais, expansão >3 unidades, busca livre no Aprender, link scanner→lição.

### Módulo 09 — Aprenda [📄 doc completo](09-aprenda.md)
`aprender` ✅ · `aprenda` ✅ · `aprenda-detalhe` ✅
**Estados extra capturados:** `aprender-default`, `aprenda-default`, `aprenda-detalhe-default`.
**⚠️ Sobreposição com Módulo 08** ("Aprenda" editorial vs "Aprenda bebendo" gamificado) — decisão PO.
**⛔ Faltam no app (épicos):** CMS de artigos, progresso de leitura real, favoritar artigo, marcar como lido, link Aprenda↔Treino.

### Módulo 10 — Harmoniza [📄 doc completo](10-harmoniza.md)
`harmoniza` ✅ · `harmoniza-resultados` ✅ · (reversa/calibração nos componentes f23_*, sem rota dedicada) ⛔
**Estados extra capturados:** `harmoniza-default`, `harmoniza-autocomplete`, `harmoniza-resultados-default`.
**🐛 Bug corrigido:** `shotParams` passava `prato` como objeto (quebrava a tela em capture-mode) → corrigido p/ string.
**⛔ Faltam no app (épicos):** motor de matching real (prato→perfil→ranking), base de pratos, NLG da razão, harmonização reversa (vinho→pratos), foto do prato, ranking ciente do paladar.

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
