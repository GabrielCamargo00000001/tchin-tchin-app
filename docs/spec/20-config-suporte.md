# Módulo 20 — Config & Suporte

> Configurações da conta (notificações, privacidade, dados da conta, bloqueados) + suporte (FAQ + contato). Inclui zona de perigo (desativar/excluir conta com fluxo de 2 passos).
> **Fonte de verdade:** `screens-config-detalhe.jsx` (`ConfigNotifScreen`, `ConfigPrivacidadeScreen`, `ConfigContaScreen`, `BloqueadosScreen`), `screens-suporte.jsx` (`SuporteFaqScreen`, `SuporteContatoScreen`). Doc funcional: **MVP1**.
> **Épicos/US:** US-CFG-01 (config notificações), US-CFG-02 (privacidade), US-CFG-03 (conta + zona de perigo), US-CFG-04 (bloqueados), US-SUP-01 (FAQ), US-SUP-02 (contato).

**Regra de negócio canônica:** excluir conta tem **fluxo de 2 passos** + janela de 30 dias pra reverter; oferece desativação temporária como alternativa (preserva dados). Privacidade granular (diário/confrarias/paladar). 2FA exibido como ativo.

## Mapa do fluxo
```
[perfil/editar → "Configurações"] → config (hub) ─┬─ config-notif (canais push/email)
                                                   ├─ config-privacidade (quem vê o quê)
                                                   ├─ config-conta (email/senha/2FA/assinatura/zona de perigo)
                                                   │     └─ excluir → modal 2 passos → welcome (30d pra reverter)
                                                   ├─ config-bloqueados (lista de bloqueados)
                                                   └─ suporte → suporte-faq | suporte-contato
```

---

## 20.1 `config-notif` — Notificações (`ConfigNotifScreen`) ✅

<img src="shots/config-notif.png" width="240"/>

**Propósito:** controlar canais e tipos de notificação (push/email). **US-CFG-01.**
**Layout:** grupos de toggles por categoria (eventos, confrarias, curtidas/comentários, nudges, marketing) × canal (push / email). *(Complementa o `push-canais` do Módulo 18.)*

> **⚠️ DIVERGÊNCIA — toggles mock.** Backend: persistir preferências + respeitar no envio.

**Status:** ✅

---

## 20.2 `config-privacidade` — Privacidade (`ConfigPrivacidadeScreen`) ✅

<img src="shots/config-privacidade.png" width="240"/>

**Propósito:** quem vê seu diário / confrarias / paladar / atividade. **US-CFG-02.**
**Layout:** opções por item (Só você / Amigos / Confrarias / Todo mundo). *(Mesma base de `editar-perfil-privacidade`, Módulo 14.)*

> **⚠️ DIVERGÊNCIA — privacidade não-enforced** (ver Módulo 14). Backend precisa aplicar os gates.

**Status:** ✅

---

## 20.3 `config-conta` — Conta + Zona de perigo (`ConfigContaScreen`) ✅

<img src="shots/config-conta.png" width="240"/>

**Propósito:** dados da conta + assinatura + desativar/excluir. **US-CFG-03.**
**Entradas:** editar-perfil → "Configurações de conta". **Saídas:** trocar email/telefone/senha; excluir → modal → `welcome`.
**Layout (`ConfigContaScreen`):**
- **Informações da conta:** E-mail · Telefone (mascarado) · Senha ("trocada há 12 dias") · **2FA** ("Ativa").
- **Assinatura:** Tchin Tchin Plus ("Plano gratuito · sem assinatura ativa").
- **Zona de perigo:** Desativar temporariamente (preserva dados) · **Excluir permanentemente** (danger) → `ConfirmDeleteModal` (2 passos: aviso + confirmação digitada) → `welcome` + "30 dias pra reverter".

**Analytics:** `account_view`, `account_change_email/phone/password`, `account_deactivate`, `account_delete_confirm`.

> **⚠️ DIVERGÊNCIA — ações mock** (desativar/excluir são toast/nav). Backend: fluxo real + soft-delete 30 dias + 2FA real.
> **⛔ FALTA NO APP (épico pede):** **exportar meus dados** (LGPD — direito de portabilidade). Backlog **CFG-DATA-EXPORT**.

**Status:** ✅

---

## 20.4 `config-bloqueados` — Bloqueados (`BloqueadosScreen`) ✅

<img src="shots/config-bloqueados.png" width="240"/>

**Propósito:** lista de usuários bloqueados + desbloquear. **US-CFG-04.**
**Layout:** lista (avatar + nome + "Desbloquear") ou empty state.

> **⚠️ DIVERGÊNCIA — lista mock + bloqueio não-enforced** (ver Módulo 14). Backend: bloqueio real corta interações.

**Status:** ✅

---

## 20.5 `suporte-faq` + `suporte-contato` ✅

_FAQ · Contato:_

<img src="shots/suporte-faq.png" width="200"/> <img src="shots/suporte-contato.png" width="200"/>

**Propósito:** autoatendimento (FAQ) + canal de contato. **US-SUP-01/02.**
- **`suporte-faq`** — perguntas frequentes agrupadas por tema (conta, compras, confrarias, paladar…), accordion expansível + busca.
- **`suporte-contato`** — formulário de contato (assunto + mensagem) ou canais (e-mail/WhatsApp/chat).

> **⚠️ DIVERGÊNCIA — FAQ/contato mock.** Backend: CMS de FAQ + ticket real (Zendesk/Intercom).
> **⛔ FALTA NO APP (épico pede):** **chat de suporte ao vivo** + status do ticket. Backlog **SUP-LIVECHAT**.

**Status:** ✅

---

## Edge cases & navegação reversa
- **Excluir conta** → modal 2 passos + 30 dias pra reverter (bom — anti-arrependimento).
- **Privacidade/bloqueio** não-enforced no protótipo.
- **Trocar email/telefone/senha** → telas separadas (`config-trocar-*`, `recuperar-redefinir`).

## Pendências de backend / decisões do PO
### Críticas (bloqueadores GA)
- **Persistência de preferências** (notif/privacidade) + enforcement.
- **Conta real** (trocar email/telefone/senha, 2FA, soft-delete 30 dias).
- **Bloqueio enforced** (corta interações).
### Importantes
- Exportar dados (LGPD).
- FAQ via CMS + tickets de suporte reais.
- Chat de suporte ao vivo.
### Decisões do PO
- Tchin Tchin Plus (assinatura): escopo/preço?
- Desativar vs excluir: comunicar diferença com clareza (feito na UI).

## Conexões com outros módulos
- **Módulo 01 (Auth)** — trocar senha → `recuperar-redefinir`; excluir → `welcome`.
- **Módulo 14 (Perfil)** — privacidade/bloqueio compartilham base.
- **Módulo 18 (Notificações)** — config-notif complementa push-canais.
