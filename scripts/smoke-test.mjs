// Headless smoke test: mount <TchinApp/> in a jsdom DOM via Vite's SSR loader
// and assert it renders without throwing. Not a screenshot — just proof the
// wired-up module graph actually executes and produces DOM.
// Run: node scripts/smoke-test.mjs

import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
const { window } = dom;

// Expose the DOM as globals the app/React expect. Some globals (navigator) are
// read-only getters in Node 22, so define them defensively.
const g = globalThis;
const setG = (name, value) => {
  try {
    Object.defineProperty(g, name, { value, writable: true, configurable: true });
  } catch {
    /* leave Node's built-in */
  }
};

window.matchMedia = window.matchMedia || ((q) => ({
  matches: false, media: q, onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  dispatchEvent() { return false; },
}));
class Stub { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }

setG('window', window);
setG('document', window.document);
setG('localStorage', window.localStorage);
setG('sessionStorage', window.sessionStorage);
setG('HTMLElement', window.HTMLElement);
setG('Element', window.Element);
setG('Node', window.Node);
setG('CSS', window.CSS);
setG('getComputedStyle', window.getComputedStyle.bind(window));
setG('requestAnimationFrame', (cb) => setTimeout(() => cb(Date.now()), 16));
setG('cancelAnimationFrame', (id) => clearTimeout(id));
setG('matchMedia', window.matchMedia);
setG('IntersectionObserver', window.IntersectionObserver || Stub);
setG('ResizeObserver', window.ResizeObserver || Stub);
setG('MutationObserver', window.MutationObserver || Stub);

const errors = [];
window.addEventListener('error', (e) => errors.push(e.error?.stack || e.message));
const origErr = console.error;
console.error = (...a) => {
  const msg = a.map((x) => (x && x.stack) || String(x)).join(' ');
  // Ignore React's act() / dev warnings that aren't failures.
  if (!/Warning:|act\(/.test(msg)) errors.push(msg);
  origErr(...a);
};

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

let exitCode = 0;
try {
  await server.ssrLoadModule('/src/main.tsx');
  // Let effects + initial timers flush.
  await new Promise((r) => setTimeout(r, 1200));
  const root = window.document.getElementById('root');
  const html = root ? root.innerHTML : '';
  console.log(`Rendered HTML length: ${html.length}`);
  console.log(`Snippet: ${html.replace(/\s+/g, ' ').slice(0, 240)}`);
  const ok = html.length > 200 && !errors.length;
  if (!ok) {
    exitCode = 1;
    if (errors.length) {
      console.log(`\n${errors.length} runtime error(s):`);
      for (const e of errors.slice(0, 10)) console.log('---\n' + e);
    } else {
      console.log('\nRendered output too small — app may not have mounted.');
    }
  } else {
    console.log('\nSMOKE TEST PASSED ✓  TchinApp mounted and rendered.');
  }
} catch (e) {
  exitCode = 1;
  console.log('SMOKE TEST FAILED while loading module:\n' + (e?.stack || e));
} finally {
  await server.close();
}
process.exit(exitCode);
