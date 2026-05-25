// Captura ESTADOS internos (carrosséis, abas, passos) que o capture-shots.mjs
// não pega (ele só captura o estado inicial de cada rota).
// Cada sequência: abre uma URL e vai clicando, screenshotando cada estado.
//   node scripts/capture-states.mjs
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const SEQ = [
  { url: `${BASE}/?screen=onboarding`, steps: [
    { name: 'onboarding-1' },
    { click: 'Avançar', name: 'onboarding-2' },
    { click: 'Avançar', name: 'onboarding-3' },
  ]},
  { url: `${BASE}/?screen=home&tab=adega`, steps: [
    { name: 'home-adega-estante' },
    { click: 'Diário', name: 'home-adega-diario' },
    { click: 'Indicadores', name: 'home-adega-indicadores' },
    { click: 'Paladar', name: 'home-adega-paladar' },
  ]},
  { url: `${BASE}/?screen=home&tab=confrarias`, steps: [
    { name: 'home-confrarias-confrarias' },
    { click: 'Eventos', name: 'home-confrarias-eventos' },
  ]},
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
for (const s of SEQ) {
  await page.goto(s.url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(900);
  for (const st of s.steps) {
    if (st.click) {
      let clicked = false;
      try { await page.locator(`button:has-text("${st.click}")`).first().click({ timeout: 4000 }); clicked = true; }
      catch (e) { try { await page.getByText(st.click, { exact: false }).first().click({ timeout: 4000 }); clicked = true; } catch (e2) {} }
      if (!clicked) console.log('  (clique não encontrado: ' + st.click + ')');
      await page.waitForTimeout(750);
    }
    await page.screenshot({ path: `${OUT}/${st.name}.png` });
    console.log('ok   ' + st.name);
  }
}
await browser.close();
console.log('done');
