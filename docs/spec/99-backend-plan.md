# Backend Plan — 5 Features prontas no protótipo

> **Contexto:** o protótipo já tem 5 features rodando como **front-only** (commit `f0837ca` em junho/2026). Este doc é o **blueprint do backend** pra cada uma — schema, endpoints, eventos, validações e integrações. O time de dev backend usa daqui em diante.
>
> **Última atualização:** 2026-06-03 · **Status:** versão 1 — proposta técnica + estimativas iniciais. Aguarda revisão do Gabriel pra virar baseline.

## Sumário
1. [Resumo executivo](#1-resumo-executivo) — escopo, dependências, prazo, custo
2. [F1 — Estante / Diário / Favoritos / Wishlist (M07)](#f1--estante--diário--favoritos--wishlist-m07)
3. [F2 — Pagamento de evento + taxa (M12)](#f2--pagamento-de-evento--taxa-m12)
4. [F3 — Perfil próprio + grafo social (M14)](#f3--perfil-próprio--grafo-social-m14)
5. [F4 — Pontos Tchin (carteira + ganho + resgate) (M19)](#f4--pontos-tchin-m19)
6. [F5 — Marketplace de Experiência (M04/M11)](#f5--marketplace-de-experiência-m04m11)
7. [Stack — escolhas abertas](#7-stack--escolhas-abertas)

---

## 1. Resumo executivo

### Escopo (5 features, ordem de prioridade)

| # | Feature | Doc | Por que crítico | Custo backend (estimado) | Prazo |
|---|---|---|---|---|---|
| **F2** | Pagamento de evento + taxa | M12 | **Modelo de receita.** Sem isso, não tem receita. Bloqueia GA. | 4–6 semanas (1 dev sr + integração LACI) | T+6 sem |
| **F4** | Pontos Tchin (carteira) | M19 | Motor de retenção. Cada feature do app pontua — sem isso, é cosmético. | 3–5 semanas (1 dev pleno) | T+5 sem |
| **F1** | Estante / Diário | M07 | Memória do usuário — dor #3 do relatório. Sem persistência, app não retém. | 2–3 semanas (1 dev pleno) | T+3 sem |
| **F3** | Perfil + grafo social | M14 | Comunidade depende. Sem grafo, "feed social" não existe. | 3–4 semanas (1 dev pleno + 1 dev jr ML pra sugestões) | T+5 sem |
| **F5** | Marketplace de Experiência | M04/M11 | Diferenciação competitiva, mas pode esperar 1ª onda. | 6–8 semanas (1 dev sr + curadoria) | T+10 sem |

**Total:** ~6 semanas pra MVP de F1+F2+F4 (paralelos com 2 devs) · F3 e F5 entram em wave 2.

### Dependências críticas (resolver ANTES de codar)

1. **Gateway de pagamento** — decidir LACI vs Celcoin vs Pagar.me (ver § 7). F2 trava sem isso.
2. **Stack de backend** — Firebase vs Supabase vs Node+Postgres custom (ver § 7). Decide hoje, evita rewrite.
3. **Auth provider** — confirma que será Firebase Auth (atual SSO Apple+Google) ou trocar. F3 depende.
4. **CDN + storage de imagens** — fotos de rótulo (M07), fotos de evento (M12), foto de perfil (M14). S3? Cloudinary? Firebase Storage?
5. **Push notifications** — FCM (Firebase Cloud Messaging) é o padrão Android+iOS. Confirma.

### Custo de infra estimado (mês, MVP com 10k MAU)

| Item | Custo/mês (R$) |
|---|---|
| Supabase Pro ou Firebase Blaze (~10k MAU) | R$ 250 – 600 |
| Storage de imagens (10k usuários × 5 MB média) | R$ 60 – 120 |
| FCM (push) | R$ 0 (free tier) |
| Gateway de pagamento (LACI/Celcoin) | tarifa por transação (R$1 PIX / 3,5% cartão) — já repassada |
| Vercel (front, atual) | R$ 0 (free tier) ou R$ 100 Pro |
| **Total infra** | **R$ 310 – 820/mês** + tarifa de transação |

**Margem da taxa Tchin Tchin** (Gabriel jun/2026): R$ 0,20 por PIX + 0,5% por cartão → break-even em ~3k transações/mês.

### Riscos

- **Anti-fraude pontos** (F4) — sem validação server-side robusta, usuário "fareja" pontos. Mitigação: cap diário + dedup + rate-limit + revisão manual de outliers.
- **PIX webhook** (F2) — webhook do LACI pode atrasar/falhar. Mitigação: polling fallback a cada 30s + reconciliação noturna.
- **Privacidade enforced** (F3) — privacidade granular precisa virar **policy server-side**, não filtro client. Mitigação: middleware de autorização por endpoint.
- **Marketplace de Experiência** (F5) — depende de curadoria humana pra primeiros parceiros. Sem curadoria, fica vazio. Mitigação: pré-cadastrar 20 parceiros iniciais (vinícolas DF/SP).

---

## F1 — Estante / Diário / Favoritos / Wishlist (M07)

### Estado atual no protótipo
- 4 conceitos canônicos (§ 7.0.1) com banner + pílula explicando.
- Slot multi-garrafa (`{ wine, quantity, addedAt }`), badge ×N, botões +/− — em `window.__tcCellar` (memória).
- Diário em `ctx.diary` (mock).
- Favoritos em `ctx.favorites` (mock).
- Wishlist = rota separada `lista-desejos` (M04).

### O que precisa virar real

#### Schema de dados (Postgres / Supabase)

```sql
-- 1. Estante (slot físico)
CREATE TABLE cellar_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  wine_id         UUID NOT NULL REFERENCES wines(id),
  quantity        INT  NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes           TEXT,
  shelf           TEXT,           -- "Prateleira 1", "Cave 12°C" (§ 7.0.3)
  added_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cellar_user ON cellar_slots(user_id);
CREATE UNIQUE INDEX uniq_cellar_user_wine ON cellar_slots(user_id, wine_id);

-- 2. Diário (registro de consumo)
CREATE TABLE diary_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  wine_id         UUID NOT NULL REFERENCES wines(id),
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  note_text       TEXT,
  photo_url       TEXT,
  occasion        TEXT,           -- 'casa' | 'restaurante' | 'confraria' | 'bar' | 'outro'
  harmonization   TEXT,
  consumed_at     DATE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_status     TEXT NOT NULL DEFAULT 'synced'  -- 'pending' | 'synced'
);
CREATE INDEX idx_diary_user_date ON diary_entries(user_id, consumed_at DESC);

-- 3. Favoritos (gosto/referência)
CREATE TABLE favorites (
  user_id         UUID NOT NULL REFERENCES users(id),
  wine_id         UUID NOT NULL REFERENCES wines(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, wine_id)
);

-- 4. Wishlist (intent de compra)
CREATE TABLE wishlist (
  user_id         UUID NOT NULL REFERENCES users(id),
  wine_id         UUID NOT NULL REFERENCES wines(id),
  price_alert_brl NUMERIC(8, 2),   -- avisar quando < X
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, wine_id)
);
```

#### Endpoints REST

```
GET    /api/v1/cellar                 → CellarSlot[] (do user)
POST   /api/v1/cellar                 → CellarSlot   { wineId, quantity, notes, shelf }
PATCH  /api/v1/cellar/:id             → CellarSlot   { quantity, notes, shelf }
DELETE /api/v1/cellar/:id             → 204

GET    /api/v1/diary?from=&to=&q=     → { items: DiaryEntry[], stats: {total, avgRating, topCountry} }
POST   /api/v1/diary                  → DiaryEntry   { wineId, rating, noteText, photoUrl, occasion, ... }
PATCH  /api/v1/diary/:id              → DiaryEntry
DELETE /api/v1/diary/:id              → 204

GET    /api/v1/favorites              → Wine[]
PUT    /api/v1/favorites/:wineId      → 200/201 (idempotente)
DELETE /api/v1/favorites/:wineId      → 204

GET    /api/v1/wishlist               → WishlistEntry[]
PUT    /api/v1/wishlist/:wineId       → { priceAlertBrl }
DELETE /api/v1/wishlist/:wineId       → 204

GET    /api/v1/reports/monthly?month= → { stats, highlights[], topUva, topCountry, totalSpent }
GET    /api/v1/reports/yearly?year=   → "Seu YYYY no vinho" (Wrapped)
```

#### Eventos pubsub (alimentam M19 — Pontos)

```
diary.entry.created           → +pts conforme tabela mestra (cap 3/dia)
diary.entry.deleted           → reverte pts se < 24h
cellar.slot.added             → sem pts (não é ação pontuada)
favorites.added               → sem pts
wishlist.added                → sem pts
```

#### Anti-fraude / regras
- Cap **3 registros pontuados/dia** (§ 7.0.5) — server-side. 4º registro entra sem pontuação.
- Dedup por `(user_id, wine_id, consumed_at::date)` — não pontua o mesmo vinho 2x no mesmo dia.
- Foto upload: validar EXIF + tamanho ≤ 5MB + thumbnail server-gen.

#### Migração do mock
- Front continua lendo de `window.__tcCellar` enquanto backend não está pronto.
- Quando ligar: sync inicial de `__tcCellar` → POST batch `/api/v1/cellar/migrate`.

#### Estimativa
- **2-3 semanas** (1 dev pleno backend) + 1 sprint de front pra plugar.

---

## F2 — Pagamento de evento + taxa (M12)

### Estado atual no protótipo
- Helper `calcTaxa(price, method)` com `TAXAS = { pix: R$1,20, cartao: 4%, fora: R$0 }`.
- `PriceBreakdownLines` mostra base + taxa + total em 4 pontos da UI.
- `ParticiparSheet` → `EscolherMetodoSheet` → `PixLaciSheet` (mock confirmado).

### O que precisa virar real

#### Schema

```sql
CREATE TABLE events (
  id            UUID PRIMARY KEY,
  confraria_id  UUID NOT NULL,
  organizer_id  UUID NOT NULL,
  title         TEXT NOT NULL,
  paid          BOOLEAN NOT NULL DEFAULT FALSE,
  price_brl     NUMERIC(8, 2) CHECK (price_brl >= 0),
  capacity      INT,
  start_at      TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open'  -- 'open' | 'closed' | 'cancelled' | 'finished'
);

CREATE TABLE event_rsvps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(id),
  user_id       UUID NOT NULL,
  status        TEXT NOT NULL,           -- 'going' | 'maybe' | 'no' | 'pending_approval'
  payment_method TEXT,                   -- 'laci' | 'fora'
  payment_status TEXT NOT NULL DEFAULT 'none',  -- 'none' | 'awaiting' | 'paid' | 'expired' | 'refunded'
  base_brl       NUMERIC(8, 2),
  fee_brl        NUMERIC(8, 2),
  total_brl      NUMERIC(8, 2),
  reserved_until TIMESTAMPTZ,            -- "vaga reservada por 2h"
  paid_at        TIMESTAMPTZ,
  UNIQUE (event_id, user_id)
);

CREATE TABLE payment_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rsvp_id         UUID NOT NULL REFERENCES event_rsvps(id),
  gateway         TEXT NOT NULL,         -- 'laci' | 'celcoin' | 'manual'
  gateway_tx_id   TEXT,                  -- id no provedor
  method          TEXT NOT NULL,         -- 'pix' | 'cartao'
  amount_brl      NUMERIC(8, 2) NOT NULL,
  fee_brl         NUMERIC(8, 2) NOT NULL,
  status          TEXT NOT NULL,         -- 'pending' | 'confirmed' | 'failed' | 'refunded'
  webhook_payload JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at    TIMESTAMPTZ
);
CREATE INDEX idx_paytx_rsvp ON payment_transactions(rsvp_id);
```

#### Endpoints

```
GET  /api/v1/events/:id                  → Event + rsvpCount + (se logado) myRsvp
POST /api/v1/events/:id/rsvp             → { status } | { status, paymentMethod }
                                            ⤷ se pago + público: cria RSVP awaiting + retorna paymentIntent
                                            ⤷ se pago + privada: cria solicitação (NÃO cobra)
GET  /api/v1/events/:id/rsvp/me          → RSVP atual (poll de status pós-pix)
POST /api/v1/payments/:rsvpId/confirm    → consumer side: "já paguei" (poll backup)

POST /api/v1/webhooks/laci               → webhook de PIX confirmado (assinatura HMAC)
POST /api/v1/webhooks/laci/refund        → webhook de reembolso

POST /api/v1/events/:id/rsvp/cancel      → cancelar (regra 3 janelas: >24h reembolso / 24-2h crédito / <2h falta)
```

#### Fluxo PIX completo

```
1. user → POST /rsvp (paymentMethod=laci)
2. backend → cria event_rsvp(payment_status='awaiting', reserved_until=now+2h)
3. backend → POST LACI /pix/qrcode { amount=total_brl, ref=rsvp_id }
4. LACI → retorna { qrcode, copia_e_cola, expires_in=10min }
5. backend → grava payment_transactions(status='pending', gateway_tx_id)
6. backend → retorna ao front { qrcode, copia_e_cola, totalBrl, feeBrl }
7. user → paga PIX externo
8. LACI → POST /api/v1/webhooks/laci { tx_id, status='paid' }
9. backend → valida HMAC + atualiza payment_transactions(status='confirmed')
10. backend → atualiza event_rsvps(payment_status='paid', paid_at=now)
11. backend → publica evento payment.confirmed → push + email + +30 pts
12. front polling → vê payment_status='paid' → mostra sheet de sucesso
```

#### Webhooks — segurança
- Verificar assinatura HMAC (header `X-LACI-Signature` = HMAC-SHA256(payload, secret)).
- Idempotência: armazenar `webhook_event_id` único — recebimento duplicado não dispara 2x.
- Timeout: se webhook não chega em 10min, polling do front consulta `/rsvp/me` → backend consulta LACI direto.
- Fallback: reconciliação noturna (cron) compara `payment_transactions(status='pending', created_at<24h)` com LACI.

#### 3 janelas de cancelamento (§ 12.0.x)
- `> 24h antes`: reembolso integral via LACI (ou crédito em pontos se reembolso falhar).
- `24h–2h antes`: crédito em Pontos (valor base × 1.0, sem taxa).
- `< 2h antes`: sem reembolso, registra `event_attendance(status='no_show')`.

#### Taxa visível e separada (Gabriel jun/2026)
- **NUNCA** cobrar base+fee como um valor só. Sempre quebrar na resposta da API e na UI.
- Quando admin define `price_brl`, backend já calcula preview de breakdown pro front mostrar.

#### Estimativa
- **4-6 semanas** (1 dev sr + integração LACI). Bloqueador GA.

---

## F3 — Perfil próprio + grafo social (M14)

### Estado atual no protótipo
- `perfil-eu` é rota cheia. Mock de `ctx.user`.
- Privacidade granular existe na UI mas não enforced.
- Seguir é toggle local (sem grafo real).

### O que precisa virar real

#### Schema

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle        TEXT UNIQUE NOT NULL,    -- @gabriel
  handle_changed_at TIMESTAMPTZ,         -- cooldown 30d (Gabriel § 14.2)
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  bio           TEXT,
  city          TEXT,
  level         TEXT,                    -- 'iniciante' | 'intermediario' | 'enofilo' | 'expert'
  photo_url     TEXT,
  privacy       TEXT NOT NULL DEFAULT 'public',  -- 'public' | 'private'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_privacy (              -- granular por seção
  user_id        UUID PRIMARY KEY REFERENCES users(id),
  diary_visible_to    TEXT NOT NULL DEFAULT 'public',  -- 'public' | 'followers' | 'private'
  confrarias_visible_to TEXT NOT NULL DEFAULT 'public',
  paladar_visible_to    TEXT NOT NULL DEFAULT 'public',
  dm_from               TEXT NOT NULL DEFAULT 'anyone'  -- 'anyone' | 'following' | 'mutual' | 'none' (M17 § 17.0.1)
);

CREATE TABLE follows (
  follower_id   UUID NOT NULL REFERENCES users(id),
  followee_id   UUID NOT NULL REFERENCES users(id),
  status        TEXT NOT NULL DEFAULT 'accepted',  -- 'accepted' | 'pending' (perfil privado)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id)
);
CREATE INDEX idx_follows_followee ON follows(followee_id);

CREATE TABLE blocks (
  blocker_id    UUID NOT NULL REFERENCES users(id),
  blocked_id    UUID NOT NULL REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);
```

#### Endpoints

```
GET    /api/v1/users/me                  → User + privacy + counts
PATCH  /api/v1/users/me                  → { name, bio, city, photoUrl, level } — sem handle aqui
POST   /api/v1/users/me/handle           → { handle } — valida cooldown 30d + reserved list
PATCH  /api/v1/users/me/privacy          → atualiza UserPrivacy

GET    /api/v1/users/:handle             → User pública (aplica privacy filter no backend)
POST   /api/v1/users/:id/follow          → 200/201 (status=accepted ou pending conforme privacy)
DELETE /api/v1/users/:id/follow          → 204
POST   /api/v1/users/:id/block           → 201
DELETE /api/v1/users/:id/block           → 204

GET    /api/v1/users/me/followers        → User[]
GET    /api/v1/users/me/following        → User[]
GET    /api/v1/users/:id/followers       → User[] (gated por privacy)
GET    /api/v1/users/:id/sugestoes       → User[] (algoritmo: comum confraria + paladar similar)

GET    /api/v1/paladar/compare?with=:id  → { matchPercent, perDimension[] }
```

#### Privacidade enforced — middleware
Toda rota que retorna dados de outro user passa por:
```js
async function applyPrivacyFilter(viewerId, targetUserId, section) {
  if (viewerId === targetUserId) return 'allow';
  const privacy = await getUserPrivacy(targetUserId);
  const setting = privacy[`${section}_visible_to`];
  if (setting === 'public') return 'allow';
  if (setting === 'private') return 'deny';
  if (setting === 'followers') {
    const isFollower = await isFollowing(viewerId, targetUserId);
    return isFollower ? 'allow' : 'deny';
  }
}
```

#### Handle — cooldown 30 dias (§ 14.2)
```js
async function changeHandle(userId, newHandle) {
  if (RESERVED_HANDLES.has(newHandle)) throw new Error('handle reservado');
  const user = await getUser(userId);
  const last = user.handle_changed_at;
  if (last && daysSince(last) < 30) {
    throw new Error(`espera ${30 - daysSince(last)} dias`);
  }
  await db.update(users).set({ handle: newHandle, handle_changed_at: now() }).where({ id: userId });
}
```

#### Estimativa
- **3-4 semanas** (1 dev pleno + 1 dev jr ML pra "Sugestões de quem seguir").

---

## F4 — Pontos Tchin (M19)

### Estado atual no protótipo
- 4ª aba "Como funcionam" com tabela mestra (24 linhas).
- `POINTS_ECONOMY` no front (taxa 10pts=R$1, caps, expirações).
- Saldo + extrato mockado.
- Onboarding sutil em welcome-final.

### O que precisa virar real

#### Schema

```sql
CREATE TABLE points_ledger (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  delta         INT NOT NULL,            -- positivo (ganho) ou negativo (resgate/expiração)
  reason_code   TEXT NOT NULL,           -- ver enum abaixo
  reason_label  TEXT NOT NULL,           -- "Registrou Catena Malbec"
  entity_type   TEXT,                    -- 'diary_entry' | 'event_rsvp' | 'challenge' | etc.
  entity_id     UUID,
  expires_at    TIMESTAMPTZ,             -- 12 meses do created_at, ou null se imediato
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ledger_user_created ON points_ledger(user_id, created_at DESC);
CREATE INDEX idx_ledger_user_active ON points_ledger(user_id) WHERE expires_at > now() OR expires_at IS NULL;

-- Materialized view de saldo (refresh por trigger ou cron)
CREATE MATERIALIZED VIEW user_points_balance AS
SELECT user_id, SUM(delta) AS balance
FROM points_ledger
WHERE expires_at > now() OR expires_at IS NULL
GROUP BY user_id;

-- Tabela mestra de regras (espelha PONTOS_TABELA do front)
CREATE TABLE points_rules (
  reason_code   TEXT PRIMARY KEY,
  label         TEXT NOT NULL,           -- "+ nota (1-5 estrelas)"
  module_ref    TEXT,                    -- 'M07' | 'M08' | ...
  points        INT NOT NULL,
  cap_per_day   INT,                     -- null = sem cap diário
  cap_per_entity INT,                    -- null = sem cap por entidade (ex.: por evento)
  cap_total     INT,                     -- null = sem cap global
  expires_after_days INT DEFAULT 365,    -- 12 meses padrão
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE points_caps_state (
  user_id       UUID NOT NULL,
  reason_code   TEXT NOT NULL,
  period        DATE NOT NULL,           -- dia/semana/mês conforme regra
  count         INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, reason_code, period)
);
```

#### Endpoints

```
GET  /api/v1/points/balance       → { balance, expiringIn30d, nextExpiration }
GET  /api/v1/points/extrato?from=&to= → PointsLedger[]
GET  /api/v1/points/rules         → PointsRule[] (front renderiza tabela mestra)

POST /api/v1/points/redeem        → { rewardType, amount } — debita do ledger
                                     rewardType: 'marketplace_credit' | 'free_wine' | 'experience'

POST /api/v1/points/award         → INTERNAL ONLY — chamada por outros serviços
                                     { userId, reasonCode, entityType, entityId, idempotencyKey }
```

#### Função de award (anti-fraude)

```js
async function awardPoints({ userId, reasonCode, entityType, entityId, idempotencyKey }) {
  // 1. Dedup por idempotencyKey
  if (await ledgerHas(idempotencyKey)) return { skipped: 'duplicate' };

  // 2. Buscar regra
  const rule = await getRule(reasonCode);
  if (!rule || !rule.active) throw new Error('rule unknown');

  // 3. Checar cap diário
  const today = new Date().toISOString().slice(0, 10);
  const state = await db.select().from(points_caps_state)
    .where({ user_id: userId, reason_code: reasonCode, period: today });
  if (rule.cap_per_day && state[0]?.count >= rule.cap_per_day) {
    return { skipped: 'cap_exceeded' };
  }

  // 4. Checar cap por entidade (ex.: 1 vez por evento)
  if (rule.cap_per_entity && entityId) {
    const already = await db.count(points_ledger).where({
      user_id: userId, reason_code: reasonCode, entity_id: entityId
    });
    if (already >= rule.cap_per_entity) return { skipped: 'entity_capped' };
  }

  // 5. Inserir ledger + atualizar cap state numa transação
  await db.transaction(async (tx) => {
    await tx.insert(points_ledger).values({
      user_id: userId, delta: rule.points,
      reason_code: reasonCode, reason_label: rule.label,
      entity_type: entityType, entity_id: entityId,
      expires_at: rule.expires_after_days
        ? new Date(Date.now() + rule.expires_after_days * 864e5)
        : null,
    });
    await tx.insert(points_caps_state).values({
      user_id: userId, reason_code: reasonCode, period: today, count: 1
    }).onConflict(['user_id', 'reason_code', 'period']).merge({ count: state[0]?.count + 1 });
  });

  // 6. Refresh balance view (assíncrono ok)
  refreshBalanceView(userId);

  return { awarded: rule.points };
}
```

#### Integração com outras features

| Feature | Trigger | Reason code | Pts | Cap |
|---|---|---|---|---|
| F1 (diary) | `diary.entry.created` | `diary.register.complete` | varia 5-20 | 3/dia |
| F2 (event) | `event.rsvp.paid` + `event.checkin` | `event.attend` | 30 | 1/evento |
| F2 (event) | `event.post.review` | `event.review` | 20 | 1/evento |
| F1 (scanner) | `scanner.wine.contributed` | `scanner.contribute` | 15 | 5/dia |
| M08 | `training.lesson.completed` | `training.lesson` | 15 | sem cap |
| M16 | `referral.accepted` | `referral.success` | 100 | 25 total |

#### Resgates
- **Marketplace credit**: cria voucher de R$ X na carteira do user (consumido no checkout do M05).
- **Free wine**: gera order pré-paga pela Tchin (vinhos ≤ R$ 80 — `freeWineMaxPriceBRL`).
- **Experience**: gera voucher pra Marketplace de Experiência (F5).

#### Expiração
- Cron diário: rows com `expires_at < now()` viram `INSERT delta=-amount, reason_code='expiration'`.
- Email D-30, D-7, D-1 de aviso.

#### Estimativa
- **3-5 semanas** (1 dev pleno).

---

## F5 — Marketplace de Experiência (M04/M11)

### Estado atual no protótipo
- 5ª aba "Experiência" em confraria-detalhe com `ExperienciaTab`.
- 6 categorias mock + 4 destaques mock.
- Card de entrada no Descobrir.

### O que precisa virar real

#### Schema

```sql
CREATE TABLE experience_partners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,           -- 'vinicola' | 'local' | 'kit' | 'conteudo' | 'equipamento' | 'servico'
  city          TEXT,
  state         TEXT,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,  -- "selo Tchin Verificado"
  description   TEXT,
  cover_url     TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'  -- 'pending' | 'active' | 'suspended'
);

CREATE TABLE experience_offers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES experience_partners(id),
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL,
  price_brl       NUMERIC(10, 2),       -- null = grátis
  price_crystals  INT,                  -- Cristais do Treino (M08), null se só R$
  is_free         BOOLEAN GENERATED ALWAYS AS (price_brl IS NULL OR price_brl = 0) STORED,
  inventory       INT,                  -- null = ilimitado
  available_from  DATE,
  available_until DATE,
  city_filter     TEXT[],               -- ["Brasília", "DF"]
  status          TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE experience_purchases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  offer_id      UUID NOT NULL REFERENCES experience_offers(id),
  partner_id    UUID NOT NULL REFERENCES experience_partners(id),
  paid_with     TEXT NOT NULL,          -- 'brl' | 'crystals' | 'points'
  amount_brl    NUMERIC(10, 2),
  amount_crystals INT,
  amount_points INT,
  voucher_code  TEXT UNIQUE,            -- "TCHIN-VIN-A8F2"
  redeemed_at   TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'active'  -- 'active' | 'redeemed' | 'expired' | 'refunded'
);

CREATE TABLE event_kit_bundles (         -- "Monte kit pro próximo evento" (admin CTA)
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(id),
  offer_ids     UUID[] NOT NULL,
  total_brl     NUMERIC(10, 2)
);
```

#### Endpoints

```
GET  /api/v1/experience/categories        → { id, label, count }[]
GET  /api/v1/experience/offers?cat=&city= → ExperienceOffer[] (filtros + paginação)
GET  /api/v1/experience/offers/:id        → OfferDetail (+ partner info)
GET  /api/v1/experience/highlights        → 4-6 destaques curados (editorial)

POST /api/v1/experience/purchase          → { offerId, paidWith }
                                             ⤷ se 'brl': cria payment_intent (reusa F2)
                                             ⤷ se 'crystals': debita M08
                                             ⤷ se 'points': debita F4
POST /api/v1/experience/purchase/:id/redeem → marca como usado (parceiro escaneia QR)

-- Admin parceiros
POST /api/v1/admin/experience/partners    → cria parceiro (curadoria)
POST /api/v1/admin/experience/offers      → cria oferta
```

#### Comissão (modelo de receita)
- Tchin retém **% padrão** sobre ofertas pagas (configurável por parceiro — default 15%).
- Parceiro recebe pagamento líquido D+14.
- "Selo verificado" = upgrade pago do parceiro (taxa mensal R$ X, sobe na ordenação).
- "Tchin Picks" (curadoria editorial) tem margem maior — comissão 25%.

#### Conversão Cristais ↔ Pontos (cross M08)
- Cristais do Treino (M08) podem ser usados aqui: `1 cristal = 5 pts` (exemplo).
- Validação: M08 expõe `POST /api/v1/training/crystals/spend { amount, reason }`.

#### Estimativa
- **6-8 semanas** (1 dev sr + curadoria humana pra primeiros parceiros).
- Pré-cadastrar 20 parceiros antes do lançamento (vinícolas DF/SP + 5 fornecedores de kit).

---

## 7. Stack — escolhas abertas

### 7.1 Backend framework (decisão Gabriel)

| Opção | Prós | Contras | Custo/mês (10k MAU) |
|---|---|---|---|
| **Supabase** (Postgres + Auth + Storage + Realtime + Edge Functions) | Tudo num pacote, escala bem, schema SQL controlado, RLS nativo. Time conhece Postgres. | Edge functions Deno (menos maduro que Node). Realtime tem limite no plano Pro. | R$ 250 |
| **Firebase** (Firestore + Auth + Storage + Cloud Functions + FCM) | Auth Apple/Google plug-and-play, FCM grátis, escala automática. | NoSQL custoso pra queries complexas (extrato de pontos, filtros marketplace). Lock-in Google. | R$ 400-600 |
| **Node+Postgres+Redis (self-hosted)** | Controle total. Sem lock-in. Custo previsível. | Time precisa gerenciar infra. Sem SSO/storage out-of-the-box. Mais devops. | R$ 600+ (servidor + storage) |

> **Recomendação:** **Supabase**. Postgres puro pra queries de F1/F4 (extratos, agregações), Auth pronto, Realtime pra chat (M17), Edge Functions pra webhooks. Lock-in baixo (é Postgres — dá pra exportar).

### 7.2 Gateway de pagamento

| Opção | Taxa real | Tempo de webhook | Tempo de antecipação | API |
|---|---|---|---|---|
| **LACI** | R$ 1 PIX / 3,5% cartão | <30s | D+0 | REST + webhook |
| **Celcoin** | R$ 0,80 PIX / 3,2% cartão | <30s | D+30 (free) ou D+0 (pago) | REST + webhook |
| **Pagar.me** | R$ 0,80 PIX / 3,9% cartão | <30s | D+30 | REST + webhook |
| **Mercado Pago** | R$ 0,99 PIX / 4,99% cartão | <60s | D+14 | REST + webhook |

> **Recomendação:** **LACI** (já no doc M12 § 12.A.1). Tarifa boa + repasse D+0 + API estável. Backup: **Celcoin** se LACI tiver indisponibilidade prolongada.

### 7.3 Storage de imagens

| Opção | Custo | CDN incluso | Transformação on-the-fly |
|---|---|---|---|
| **Supabase Storage** (se ficar com Supabase) | Já incluso | sim | básico |
| **Cloudinary** | R$ 0 (free 25GB) → R$ 250+ | sim | excelente (thumbs, crops, formato) |
| **AWS S3 + CloudFront** | R$ 80-150 | sim | precisa Lambda |

> **Recomendação:** **Supabase Storage** + transformação básica no upload (thumbs 200/400/800px). Se precisar de mais sofisticação, migrar pra Cloudinary depois.

### 7.4 Push notifications

> **Decisão padrão:** **FCM** (Firebase Cloud Messaging). Grátis, suporta Android+iOS. Funciona mesmo com backend Supabase (FCM é só API).

### 7.5 Observabilidade

| Necessário | Sugestão |
|---|---|
| Logs estruturados | **Axiom** (free 500GB/mês) ou **Datadog** (caro mas completo) |
| APM / traces | **Sentry** (R$ 100/mês plano team) |
| Métricas custom | **Grafana Cloud free** |
| Uptime monitoring | **UptimeRobot** (free) |

---

## 8. Próximos passos (ação imediata)

1. **Gabriel decidir:** Supabase vs Firebase (§ 7.1), LACI confirmado (§ 7.2).
2. **Setup inicial** (1 sprint, 1 dev sr):
   - Provisionar Supabase project + repo backend separado.
   - Migrações iniciais (schemas F1+F4 — features menos arriscadas).
   - CI/CD (Vercel ou Railway).
3. **Wave 1** (6 semanas, 2 devs paralelos):
   - Dev sr: F2 (pagamento + taxa).
   - Dev pleno: F1 (estante/diário) + F4 (pontos).
4. **Wave 2** (4 semanas, 2 devs):
   - F3 (perfil + grafo).
   - F5 (Marketplace de Experiência — protótipo de 20 ofertas).
5. **Lançar GA** após F1+F2+F4 prontos. F3 e F5 podem ser features pós-GA.

---

## Conexões com a super-doc

- **M07** § 7.0 → este doc F1
- **M12** § 12.A → este doc F2
- **M14** § 14.0 → este doc F3
- **M19** § 19.0 → este doc F4
- **M04** § 4.0.3 + **M11** § 11.5 → este doc F5
- **M17** § 17.0 (DM) → schema `user_privacy.dm_from` em F3
- **M18** (notificações) → eventos pubsub disparam push via FCM
