import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:5173/?screen=sprint14-hub', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
await page.locator('button:has-text("Refator v2 (22)")').first().click({ force: true });
await page.waitForTimeout(400);
await page.screenshot({ path: 'docs/spec/shots/sprint14-hub-refator.png' });
console.log('ok sprint14-hub-refator');

// Scroll até o R22
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(300);
await page.locator('button').filter({ hasText: 'R22' }).first().click({ force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: 'docs/spec/shots/sprint14-item-r22.png' });
console.log('ok sprint14-item-r22');
await browser.close();
