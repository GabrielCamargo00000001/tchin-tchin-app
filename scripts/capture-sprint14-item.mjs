import { chromium } from 'playwright';
import fs from 'fs';
const BASE = 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto(`${BASE}/?screen=sprint14-hub`, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  try { window.localStorage.setItem('tc.adega.tax.dismissed', '1'); } catch(e){}
});
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
// Click no primeiro card (B1)
const firstCard = page.locator('button').filter({ hasText: 'B1' }).first();
await firstCard.click({ force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/sprint14-item-b1.png` });
console.log('ok sprint14-item-b1');

// Voltar e clicar em A1 (Tela Descobri)
await page.goto(`${BASE}/?screen=sprint14-hub`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
await page.locator('button').filter({ hasText: 'A1' }).first().click({ force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/sprint14-item-a1.png` });
console.log('ok sprint14-item-a1');

// F5 (templates)
await page.goto(`${BASE}/?screen=sprint14-hub`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
await page.locator('button').filter({ hasText: 'F5' }).first().click({ force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/sprint14-item-f5.png` });
console.log('ok sprint14-item-f5');

await browser.close();
console.log('Done');
