// Render check for the "Treine seu Paladar" screens (initial render, jsdom).
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost/' });
const setG = (n, v) => { try { Object.defineProperty(globalThis, n, { value: v, writable: true, configurable: true }); } catch {} };
setG('window', dom.window);
setG('document', dom.window.document);
setG('localStorage', dom.window.localStorage);

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let code = 0;
try {
  const mod = await server.ssrLoadModule('/src/legacy/screens-treino-paladar.jsx');
  const go = () => {};
  const home = renderToStaticMarkup(React.createElement(mod.TreinoPaladarHome, { go }));
  const licao = renderToStaticMarkup(React.createElement(mod.TreinoLicaoScreen, { go, params: { lessonId: 'licao-01-tanino' } }));
  console.log('Home HTML length :', home.length);
  console.log('Licao HTML length:', licao.length);
  if (home.length > 500 && licao.length > 500) console.log('TREINO RENDER OK ✓');
  else { console.log('Output too small'); code = 1; }
} catch (e) {
  console.log('TREINO RENDER FAILED:\n' + (e?.stack || e));
  code = 1;
} finally {
  await server.close();
}
process.exit(code);
