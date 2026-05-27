// Captura ESTADOS internos (carrosséis, abas, passos de wizard) que o
// capture-shots.mjs não pega (ele só captura o estado inicial de cada rota).
// Cada sequência abre uma URL e executa "ops" em ordem:
//   {shot:'nome'}                -> screenshot docs/spec/shots/nome.png
//   {click:'Texto do botão'}     -> clica botão por texto (has-text)
//   {clickAll:['t1','t2',...]}   -> clica múltiplos botões por texto (em ordem)
//   {fill:['placeholder','valor']} -> preenche input por placeholder
//   {fillType:['date','1990-01-01']} -> preenche input por type
//   {wait: ms}
//   node scripts/capture-states.mjs
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const SEQ = [
  // ── Módulo 01 — Auth & Acesso ───────────────────────────
  { url: '?screen=onboarding', ops: [
    { shot: 'onboarding-1' },
    { click: 'Avançar' }, { shot: 'onboarding-2' },
    { click: 'Avançar' }, { shot: 'onboarding-3' },
  ]},
  { url: '?screen=cadastro', ops: [
    { shot: 'cadastro-1' },
    { fill: ['Digite seu e-mail', 'maria@email.com'] },
    { fill: ['Crie uma senha', 'Teste@123'] },
    { click: 'Continuar' }, { shot: 'cadastro-2' },
    { fill: ['Como gostaria de ser chamada(o)', 'Maria Silva'] },
    { fillType: ['date', '1990-01-01'] },
    { click: 'Continuar' }, { shot: 'cadastro-3' },
  ]},

  // ── Módulo 02 — Onboarding educacional & Roteamento ─────
  // 03.01 — Quiz de Nível (1 de 3) — apenas estado inicial
  { url: '?screen=quiz-nivel', ops: [
    { shot: 'nivel-default' },
  ]},

  // 03.02 — Interesses (2 de 3) — default / 3 selecionados / 8 selecionados
  { url: '?screen=quiz-interesses', ops: [
    { shot: 'interesses-default' },
    // Selecionar 3 (mínimo) — Cabernet Sauvignon, Malbec, Mendoza
    { click: 'Cabernet Sauvignon' },
    { click: 'Malbec' },
    { click: 'Mendoza' },
    { shot: 'interesses-min' },
    // Adicionar mais 5 (chegar a 8 — máximo) — Merlot, Pinot Noir, Syrah, Tannat, Bordeaux
    { click: 'Merlot' },
    { click: 'Pinot Noir' },
    { click: 'Syrah' },
    { click: 'Tannat' },
    { click: 'Bordeaux' },
    { shot: 'interesses-max' },
    // Tentar selecionar 9º — deve disparar shake + toast
    { click: 'Chardonnay' },
    { wait: 150 },
    { shot: 'interesses-overflow' },
  ]},

  // 05.01 — Tela de Intenção (3 de 3) — default + skip modal
  { url: '?screen=tela-intencao', ops: [
    { shot: 'intencao-default' },
    { click: 'Ainda não sei, me leva pro app' },
    { wait: 250 },
    { shot: 'intencao-skip-modal' },
  ]},

  // 06.01 — GPS Primer — default + dialog "Permitir" aberto (rota D: confrarias)
  { url: '?screen=gps-primer', ops: [
    { shot: 'gps-primer-default' },
    { click: 'Ativar localização' },
    { wait: 500 },
    { shot: 'gps-primer-dialog' },
  ]},

  // 06.01.E — GPS Primer (rota E: criar confraria) — copy variante
  { url: '?screen=gps-primer&intent=gps_primer_then_wizard', ops: [
    { shot: 'gps-primer-wizard-variant' },
  ]},

  // 06.03 — GPS Negado (estado único, já temos em gps-negado.png, refazendo p/ nome consistente)
  { url: '?screen=gps-negado', ops: [
    { shot: 'gps-negado-default' },
  ]},

  // 07.01 — Welcome Final (intent skip por default — sem __tcLastIntent setado)
  { url: '?screen=welcome-final', ops: [
    { shot: 'welcome-final-default' },
  ]},

  // 35.x — Tutoriais hub
  { url: '?screen=tutoriais', ops: [
    { shot: 'tutoriais-hub' },
  ]},

  // ── Módulo 06 — Scanner & Aprenda Bebendo ───────────────
  // Scanner v1 (legacy): viewfinder default
  { url: '?screen=scanner', ops: [
    { wait: 1100 },  // espera tooltip "Como funciona" aparecer
    { shot: 'scanner-v1-tooltip' },
    { click: 'Entendi' },
    { wait: 400 },
    { shot: 'scanner-v1-default' },
  ]},

  // Scanner v2 (canonico): viewfinder com guia maior
  { url: '?screen=scanner-v2', ops: [
    { wait: 600 },
    { shot: 'scanner-v2-default' },
  ]},

  // Scanner-result-v2 (ResultadoScan completo com radar + match + acoes)
  { url: '?screen=scanner-result-v2', ops: [
    { wait: 700 },
    { shot: 'scanner-result-v2-default' },
  ]},

  // Fallback (nao identificou)
  { url: '?screen=scanner-fallback', ops: [
    { shot: 'scanner-fallback-default' },
  ]},

  // Modo restaurante (captura de carta — ate 3 paginas)
  { url: '?screen=modo-restaurante', ops: [
    { shot: 'modo-restaurante-default' },
  ]},

  // Carta-matches (lista de matches identificados na carta)
  { url: '?screen=carta-matches', ops: [
    { shot: 'carta-matches-default' },
  ]},

  // Por que combina (explicacao com radar sobreposto)
  { url: '?screen=porque-combina', ops: [
    { wait: 500 },
    { shot: 'porque-combina-default' },
  ]},

  // ── Módulo 05 — Carrinho & Checkout ─────────────────────
  // Carrinho: default (2 items + cupom area) · cupom BRINDE10 aplicado
  { url: '?screen=carrinho', ops: [
    { shot: 'carrinho-default' },
    { fill: ['Ex.: BRINDE10', 'BRINDE10'] },
    { click: 'Aplicar' },
    { wait: 400 },
    { shot: 'carrinho-cupom-ok' },
  ]},

  // Endereco: default (lista) · modal "novo endereco" aberto
  { url: '?screen=endereco', ops: [
    { shot: 'endereco-default' },
    { click: 'Adicionar novo endereço' },
    { wait: 350 },
    { shot: 'endereco-novo' },
  ]},

  // Pagamento: cartao (default) · pix (QR) · boleto (form)
  { url: '?screen=pagamento', ops: [
    { shot: 'pagamento-cartao' },
    { click: 'Pix' },
    { wait: 350 },
    { shot: 'pagamento-pix' },
    { click: 'Boleto bancário' },
    { wait: 350 },
    { shot: 'pagamento-boleto' },
  ]},

  // Pedido confirmado
  { url: '?screen=pedido-confirmado', ops: [
    { wait: 500 },
    { shot: 'pedido-confirmado-default' },
  ]},

  // ── Módulo 04 — Descobrir & Marketplace ─────────────────
  // Marketplace: default · sheet de filtros · modal multi-select · search ativa
  // (dispensa o tutorial "Vamos começar" antes de seguir)
  { url: '?screen=marketplace', ops: [
    { wait: 800 },
    { click: 'Vamos começar' },
    { wait: 400 },
    { shot: 'marketplace-default' },
    { click: 'Filtrar' },
    { wait: 350 },
    { shot: 'marketplace-filtersheet' },
  ]},
  { url: '?screen=marketplace', ops: [
    { wait: 800 },
    { click: 'Vamos começar' },
    { wait: 400 },
    { fill: ['Digite o nome do vinho', 'Malbec'] },
    { wait: 800 },
    { shot: 'marketplace-search' },
  ]},
  { url: '?screen=marketplace', ops: [
    { wait: 800 },
    { click: 'Vamos começar' },
    { wait: 400 },
    { click: 'Adicionar vários' },
    { wait: 450 },
    { shot: 'marketplace-multi' },
  ]},

  // Wine detail — default (com paladar overlay)
  { url: '?screen=wine', ops: [
    { shot: 'wine-default' },
  ]},

  // Busca — empty (sugestões) · com query
  { url: '?screen=busca', ops: [
    { shot: 'busca-empty' },
    { fill: ['Buscar pessoas, vinhos, confrarias…', 'Malbec'] },
    { wait: 600 },
    { shot: 'busca-results' },
  ]},

  // Filtros avançados — default · com filtros aplicados
  { url: '?screen=filtros-avancados', ops: [
    { shot: 'filtros-default' },
    { click: 'Tinto' },
    { click: 'Argentina' },
    { click: 'Malbec' },
    { wait: 200 },
    { shot: 'filtros-applied' },
  ]},

  // Lista de desejos — default · modo Comparar (selecionando)
  { url: '?screen=lista-desejos', ops: [
    { shot: 'desejos-default' },
    { click: 'Comparar' },
    { wait: 250 },
    { shot: 'desejos-selecting' },
  ]},

  // Comparar vinhos
  { url: '?screen=comparar-vinhos', ops: [
    { shot: 'comparar-default' },
  ]},

  // ── Módulo 03 — Meu Paladar (Quiz 5 perguntas + Radar 5D) ──
  { url: '?screen=quiz', ops: [
    { shot: 'paladar-q1' },
    { click: 'Amargo, sem açúcar' },
    { shot: 'paladar-q1-selected' },
    { click: 'Continuar' },
    { shot: 'paladar-q2' },
    { click: 'Apimentado, sabor marcado' },
    { click: 'Continuar' },
    { shot: 'paladar-q3' },
    { click: 'Morango maduro' },
    { click: 'Continuar' },
    { shot: 'paladar-q4' },
    { click: 'Meio amargo' },
    { click: 'Continuar' },
    { shot: 'paladar-q5' },
    { click: 'Mais encorpada, intensa' },
    { click: 'Ver meu paladar' },
    { wait: 600 },
    { shot: 'paladar-result' },
  ]},

  // ── Módulo 03+ — Home sub-tabs ─────────────────────────
  { url: '?screen=home&tab=adega', ops: [
    { shot: 'home-adega-estante' },
    { click: 'Diário' }, { shot: 'home-adega-diario' },
    { click: 'Indicadores' }, { shot: 'home-adega-indicadores' },
    { click: 'Paladar' }, { shot: 'home-adega-paladar' },
  ]},
  { url: '?screen=home&tab=confrarias', ops: [
    { shot: 'home-confrarias-confrarias' },
    { click: 'Eventos' }, { shot: 'home-confrarias-eventos' },
  ]},
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
// Marca todos os tutoriais conhecidos como concluídos antes de cada navegação,
// pra capturas não serem encobertas pelos overlays de "primeira visita".
await ctx.addInitScript(() => {
  try {
    const known = ['marketplace','wine_detail','adega','diario','confraria','wizard_confraria','event_wizard','scanner','scanner_v2','carta_matches','harmoniza','radar_paladar','feed','comunidade','registro_consumo','ata_evento','treino_paladar','jornada'];
    const done = Object.fromEntries(known.map(id => [id, true]));
    window.localStorage.setItem('tc.tutor.done', JSON.stringify(done));
  } catch (e) {}
});
const page = await ctx.newPage();
for (const s of SEQ) {
  await page.goto(BASE + '/' + s.url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(900);
  for (const op of s.ops) {
    try {
      if (op.fill) { await page.getByPlaceholder(op.fill[0]).first().fill(op.fill[1]); await page.waitForTimeout(200); }
      else if (op.fillType) { await page.locator(`input[type=${op.fillType[0]}]`).first().fill(op.fillType[1]); await page.waitForTimeout(200); }
      else if (op.click) { await page.locator(`button:has-text("${op.click}")`).first().click({ timeout: 5000 }); await page.waitForTimeout(750); }
      else if (op.wait) { await page.waitForTimeout(op.wait); }
      else if (op.shot) { await page.screenshot({ path: `${OUT}/${op.shot}.png` }); console.log('ok   ' + op.shot); }
    } catch (e) { console.log('FALHA op ' + JSON.stringify(op) + ' :: ' + String(e.message).split('\n')[0]); }
  }
}
await browser.close();
console.log('done');
