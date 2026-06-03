// Captura do hub da Sprint 14 e exemplos de detalhe.
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const KNOWN_TUTORS = [
  'marketplace','wine_detail','adega','diario',
  'confraria','confraria-usar','confraria-criar','wizard_confraria',
  'event_wizard','evento-usar','evento-criar',
  'scanner','scanner_v2','carta_matches','harmoniza','radar_paladar',
  'feed','comunidade','registro_consumo','ata_evento',
  'treino_paladar','jornada','indicacao','badges',
];

async function preFlags(page) {
  await page.evaluate(({ tutors }) => {
    try {
      const done = Object.fromEntries(tutors.map(id => [id, Date.now()]));
      window.localStorage.setItem('tc.tutor.done', JSON.stringify(done));
      window.localStorage.setItem('tc.adega.tax.dismissed', '1');
    } catch (e) {}
  }, { tutors: KNOWN_TUTORS });
}

const SEQ = [
  // Hub geral
  { url: '?screen=sprint14-hub', ops: [
    { wait: 600 }, { shot: 'sprint14-hub' },
  ]},
  // Filtro Urgentes
  { url: '?screen=sprint14-hub', ops: [
    { wait: 600 },
    { click: 'Urgentes' }, { wait: 300 }, { shot: 'sprint14-hub-urgentes' },
  ]},
  // Filtro Bugs
  { url: '?screen=sprint14-hub', ops: [
    { wait: 600 },
    { click: 'Bugs' }, { wait: 300 }, { shot: 'sprint14-hub-bugs' },
  ]},
  // Filtro Features
  { url: '?screen=sprint14-hub', ops: [
    { wait: 600 },
    { click: 'Features' }, { wait: 300 }, { shot: 'sprint14-hub-features' },
  ]},
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

let ok = 0, fail = 0;
for (const seq of SEQ) {
  try {
    await page.goto(`${BASE}/${seq.url}`, { waitUntil: 'domcontentloaded' });
    await preFlags(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    for (const op of seq.ops) {
      if (op.wait) await page.waitForTimeout(op.wait);
      if (op.click) {
        let loc = page.locator(`button:has-text("${op.click}")`).first();
        try { await loc.click({ timeout: 3000, force: true }); }
        catch (e) { console.warn(`  warn click ${op.click}: ${e.message.split('\n')[0]}`); }
      }
      if (op.shot) {
        const p = `${OUT}/${op.shot}.png`;
        await page.screenshot({ path: p, omitBackground: false });
        console.log(`  ok ${op.shot}`);
        ok++;
      }
    }
  } catch (e) {
    fail++;
    console.error(`  fail ${seq.url}: ${e.message}`);
  }
}

await browser.close();
console.log(`\nDone: ${ok} shots, ${fail} falhas.`);
