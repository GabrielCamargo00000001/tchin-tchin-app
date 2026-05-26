// Captura ESTADOS internos (carrosséis, abas, passos de wizard) que o
// capture-shots.mjs não pega (ele só captura o estado inicial de cada rota).
// Cada sequência abre uma URL e executa "ops" em ordem:
//   {shot:'nome'}                -> screenshot docs/spec/shots/nome.png
//   {click:'Texto do botão'}     -> clica botão por texto
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
