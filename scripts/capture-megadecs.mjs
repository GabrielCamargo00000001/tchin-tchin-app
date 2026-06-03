// Captura apenas as telas afetadas pela sessão mega-decisões (Gabriel jun/2026).
// Roda DEPOIS do dev server estar de pé em :5173.
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

// Lista completa de tutores conhecidos (espelha capture-states.mjs)
const KNOWN_TUTORS = [
  'marketplace','wine_detail','adega','diario',
  'confraria','confraria-usar','confraria-criar','wizard_confraria',
  'event_wizard','evento-usar','evento-criar',
  'scanner','scanner_v2','carta_matches','harmoniza','radar_paladar',
  'feed','comunidade','registro_consumo','ata_evento',
  'treino_paladar','jornada','indicacao','badges',
];

// flags do app que escondem banners/tours de "primeira visita"
async function preFlags(page) {
  await page.evaluate(({ tutors }) => {
    try {
      // Chave correta: 'tc.tutor.done' com JSON {<id>: <timestamp>}
      const done = Object.fromEntries(tutors.map(id => [id, Date.now()]));
      window.localStorage.setItem('tc.tutor.done', JSON.stringify(done));
      // dispensa banner taxonomia M07 (Gabriel jun/2026)
      window.localStorage.setItem('tc.adega.tax.dismissed', '1');
      window.__tcAdegaTaxonomiaDismissed = true;
    } catch (e) {}
  }, { tutors: KNOWN_TUTORS });
}

const SEQ = [
  // M07 — Adega taxonomia (com banner E sem banner)
  // 1) primeira-visita: banner Onde fica o quê visível (já gerado antes)
  // 2) recorrente: banner dispensado, apenas chips + pílula inline
  { url: '?screen=home&tab=adega', noPreFlags: true, ops: [
    { wait: 600 }, { shot: 'home-adega-estante' },
    { click: 'Diário' }, { wait: 400 }, { shot: 'home-adega-diario' },
  ]},
  { url: '?screen=home&tab=adega', ops: [
    { wait: 600 }, { shot: 'home-adega-estante-limpa' },
    { click: 'Diário' }, { wait: 400 }, { shot: 'home-adega-diario-limpa' },
  ]},

  // M12 — event-detalhe SEM tutorial overlay (limpo)
  { url: '?screen=event-detalhe', ops: [
    { wait: 600 }, { shot: 'event-detalhe' },
  ]},
  // M12 — escolher método com breakdown completo
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

let ok = 0, fail = 0;
for (const seq of SEQ) {
  try {
    await page.goto(`${BASE}/${seq.url}`, { waitUntil: 'domcontentloaded' });
    if (!seq.noPreFlags) {
      await preFlags(page);
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    for (const op of seq.ops) {
      if (op.wait) await page.waitForTimeout(op.wait);
      if (op.click) {
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
