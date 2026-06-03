// Captura apenas as telas afetadas pela sessão mega-decisões (Gabriel jun/2026).
// Roda DEPOIS do dev server estar de pé em :5173.
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const SEQ = [
  // M07 — Adega taxonomia (banner + chips + multi-garrafa)
  { url: '?screen=home&tab=adega', ops: [
    { wait: 600 }, { shot: 'home-adega-estante' },
    { click: 'Diário' }, { wait: 400 }, { shot: 'home-adega-diario' },
  ]},
  // M12 — event-detalhe com taxa visível
  { url: '?screen=event-detalhe', ops: [
    { wait: 700 }, { shot: 'event-detalhe' },
  ]},
  // M12 — escolher método com breakdown
  { url: '?screen=event-detalhe&paymentState=esc-metodo&sheet=metodo&paid=true', ops: [
    { wait: 700 }, { shot: 'event-sheet-metodo' },
  ]},
  // M14 — perfil-eu (rota dedicada)
  { url: '?screen=perfil-eu', ops: [
    { wait: 500 }, { shot: 'perfil-eu' },
  ]},
  // M19 — pontos aba 'como funcionam'
  { url: '?screen=pontos', ops: [
    { wait: 500 },
    { click: 'Como funcionam' }, { wait: 400 }, { shot: 'pontos-como-funcionam' },
  ]},
  // M04 — descobrir com card Marketplace de Experiência
  { url: '?screen=descobrir', ops: [
    { wait: 700 }, { shot: 'descobrir-com-experiencia' },
  ]},
  // M11 — confraria-detalhe aba Experiência
  { url: '?screen=confraria-detalhe', ops: [
    { wait: 500 },
    { click: 'Experiência' }, { wait: 400 }, { shot: 'confraria-detalhe-experiencia' },
  ]},
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

const KNOWN_TUTORS = ['marketplace','wine_detail','adega','diario','confraria','confraria-usar','evento-usar','scanner','scanner_v2','feed','treino_paladar','jornada'];
async function dismissAllTutors() {
  await page.evaluate((tutors) => {
    try { tutors.forEach(t => localStorage.setItem(`tc.tutor.${t}.done`, '1')); } catch (e) {}
  }, KNOWN_TUTORS);
}

let ok = 0, fail = 0;
for (const seq of SEQ) {
  try {
    await page.goto(`${BASE}/${seq.url}`, { waitUntil: 'domcontentloaded' });
    await dismissAllTutors();
    await page.reload({ waitUntil: 'domcontentloaded' });
    for (const op of seq.ops) {
      if (op.wait) await page.waitForTimeout(op.wait);
      if (op.click) {
        // Dispensar qualquer overlay de tutorial antes do click
        try {
          await page.evaluate(() => {
            document.querySelectorAll('[data-tutor-skip], [aria-label="Pular tour"], [aria-label="Fechar"]').forEach(b => b.click());
          });
        } catch {}
        let loc = page.locator(`button:text-is("${op.click}")`).first();
        let count = await loc.count();
        if (count === 0) {
          loc = page.locator(`button:has-text("${op.click}"), [role="button"]:has-text("${op.click}")`).first();
        }
        try {
          await loc.click({ timeout: 3000, force: true });
        } catch (e) {
          console.warn(`  ⚠ click "${op.click}" falhou em ${seq.url}: ${e.message.split('\n')[0]}`);
        }
      }
      if (op.shot) {
        const p = `${OUT}/${op.shot}.png`;
        await page.screenshot({ path: p, omitBackground: false });
        console.log(`  ✓ ${op.shot}`);
        ok++;
      }
    }
  } catch (e) {
    fail++;
    console.error(`  ✗ ${seq.url}: ${e.message}`);
  }
}

await browser.close();
console.log(`\nDone — ${ok} shots, ${fail} falhas.`);
