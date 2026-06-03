import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto('http://localhost:5173/?screen=sprint14-hub', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
await page.locator('button:has-text("Refator v2 (21)")').first().click({ force: true });
await page.waitForTimeout(400);
await page.screenshot({ path: 'docs/spec/shots/sprint14-hub-refator.png' });
console.log('ok sprint14-hub-refator');

// Click R11 (refator confrarias) pra ver lista de telas
await page.locator('button').filter({ hasText: 'R11' }).first().click({ force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: 'docs/spec/shots/sprint14-item-r11.png' });
console.log('ok sprint14-item-r11');

await browser.close();
