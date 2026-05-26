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
