// Tchin Tchin — legacy prototype → ESM converter
//
// The Claude Design prototype is a set of .jsx files loaded as classic scripts
// that share one global lexical scope and register exports onto `window`. This
// script turns each file into a real ES module:
//   1. copies + sanitizes filenames (dotted/number-leading names break imports)
//   2. parses each file, records its top-level bindings (what it PROVIDES)
//   3. builds a global symbol -> module map
//   4. for each file, uses Babel scope analysis to find free variables (what it
//      NEEDS) and emits `import { ... } from './provider.jsx'`
//   5. appends `export { ... }` for the file's top-level bindings
//   6. leaves the original `Object.assign(window, {...})` calls intact as a
//      runtime safety net for any `window.X` access.
//
// Run: npm run convert

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = 'C:\\Users\\camargo\\tchin-work\\tchin-tchin-complete\\project';
const ENTRY_HTML = path.join(SRC_DIR, 'Tchin Tchin Refator.html');
const OUT_DIR = path.join(__dirname, '..', 'src', 'legacy');

// Canvas/design-tool files — not part of the product app. Excluded even though
// the entry HTML references them.
const EXCLUDE = new Set([
  'design-system.jsx',
  'design-canvas.jsx',
  'tweaks-panel.jsx',
  'canvas-app.jsx',
  'android-frame.jsx',
]);

// Real globals / browser/JS builtins that should never be imported.
const BUILTINS = new Set([
  'window', 'document', 'console', 'Math', 'JSON', 'Object', 'Array', 'String',
  'Number', 'Boolean', 'Date', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet',
  'Symbol', 'RegExp', 'Error', 'TypeError', 'RangeError', 'parseInt',
  'parseFloat', 'isNaN', 'isFinite', 'setTimeout', 'clearTimeout',
  'setInterval', 'clearInterval', 'requestAnimationFrame',
  'cancelAnimationFrame', 'requestIdleCallback', 'localStorage',
  'sessionStorage', 'navigator', 'location', 'history', 'screen', 'alert',
  'confirm', 'prompt', 'fetch', 'URL', 'URLSearchParams', 'encodeURIComponent',
  'decodeURIComponent', 'encodeURI', 'decodeURI', 'Intl', 'structuredClone',
  'crypto', 'btoa', 'atob', 'FileReader', 'Blob', 'File', 'FormData',
  'performance', 'getComputedStyle', 'matchMedia', 'undefined', 'NaN',
  'Infinity', 'globalThis', 'Reflect', 'Proxy', 'Function', 'queueMicrotask',
  'IntersectionObserver', 'ResizeObserver', 'MutationObserver',
  'AbortController', 'TextEncoder', 'TextDecoder', 'Image', 'Audio',
  'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent', 'HTMLElement', 'Node',
  'SVGElement', 'Promise', 'Array', 'parseFloat', 'isFinite', 'WeakRef',
  'BigInt', 'Uint8Array', 'ArrayBuffer', 'DataView', 'Element', 'window',
]);

// Hand fixes for pre-existing prototype bugs, applied to converted output so
// the pipeline stays reproducible. Keyed by original filename.
const PATCHES = {
  // Duplicate object key (identical value) — drop the redundant entry.
  'cards.jsx': [
    [
      "Portugal: '🇵🇹', Itália: '🇮🇹', Itália: '🇮🇹', França:",
      "Portugal: '🇵🇹', Itália: '🇮🇹', França:",
    ],
  ],
  // Duplicate `paddingTop` key (4 then 14); keep the intended 14.
  'screens-app.jsx': [
    [
      "display: 'flex', gap: 8, paddingTop: 4, borderTop:",
      "display: 'flex', gap: 8, borderTop:",
    ],
  ],
  // EventosTab used `go(...)` but never received it as a prop -> ReferenceError
  // when an event card in the "eventos" tab is clicked. Thread `go` through.
  'screens-confraria.jsx': [
    [
      'function EventosTab({ confraria, joined, isAdmin, onJoin, onCreateEvent }) {',
      'function EventosTab({ confraria, joined, isAdmin, onJoin, onCreateEvent, go }) {',
    ],
    [
      "{tab === 'eventos'     && <EventosTab confraria={confraria} joined={joined} isAdmin={isAdmin} onJoin={handleJoinToggle} onCreateEvent={",
      "{tab === 'eventos'     && <EventosTab confraria={confraria} joined={joined} isAdmin={isAdmin} onJoin={handleJoinToggle} go={go} onCreateEvent={",
    ],
  ],
};

function sanitizeName(file) {
  // Keep the .jsx extension; make the base a safe module id.
  const base = file.replace(/\.jsx$/i, '');
  let safe = base.replace(/[^A-Za-z0-9_-]/g, '_'); // dots, spaces -> _
  if (/^[0-9]/.test(safe)) safe = 'f' + safe; // can't start with a digit comfortably
  return safe + '.jsx';
}

function parseFile(code) {
  return parse(code, {
    sourceType: 'script',
    plugins: ['jsx'],
    errorRecovery: true,
  });
}

// --- 1. gather files in the entry HTML's exact script order ---
// Load order is authoritative: when two files define the same top-level name,
// the one loaded LAST wins at runtime (it redeclares the shared-scope binding).
const html = fs.readFileSync(ENTRY_HTML, 'utf8');
const scriptRe = /<script[^>]*\bsrc="([^"]+\.jsx)"[^>]*>/gi;
const ordered = [];
let m;
while ((m = scriptRe.exec(html)) !== null) {
  const f = m[1];
  if (!EXCLUDE.has(f)) ordered.push(f);
}
const files = ordered.filter((f) => fs.existsSync(path.join(SRC_DIR, f)));

const nameMap = new Map(); // original file -> safe file
for (const f of files) nameMap.set(f, sanitizeName(f));

// --- 2. parse + collect top-level bindings (provides) ---
const fileInfo = new Map(); // original file -> { ast, code, provides:Set }
const provideMap = new Map(); // symbol -> safe module file (last definition wins)
const collisions = [];

const isWindowAssign = (node) =>
  node.type === 'ExpressionStatement' &&
  node.expression.type === 'CallExpression' &&
  node.expression.callee.type === 'MemberExpression' &&
  node.expression.callee.object.type === 'Identifier' &&
  node.expression.callee.object.name === 'Object' &&
  node.expression.callee.property.type === 'Identifier' &&
  node.expression.callee.property.name === 'assign' &&
  node.expression.arguments[0] &&
  node.expression.arguments[0].type === 'Identifier' &&
  node.expression.arguments[0].name === 'window';

for (const f of files) {
  const code = fs.readFileSync(path.join(SRC_DIR, f), 'utf8');
  const ast = parseFile(code);
  const provides = new Set();
  const winAssigns = []; // program-level Object.assign(window, ...) ranges
  for (const node of ast.program.body) {
    if (node.type === 'FunctionDeclaration' && node.id) provides.add(node.id.name);
    else if (node.type === 'ClassDeclaration' && node.id) provides.add(node.id.name);
    else if (node.type === 'VariableDeclaration') {
      for (const d of node.declarations) {
        if (d.id.type === 'Identifier') provides.add(d.id.name);
      }
    } else if (isWindowAssign(node)) {
      winAssigns.push({ start: node.start, end: node.end });
    }
  }
  fileInfo.set(f, { ast, code, provides, winAssigns });
}

// Build the global map in HTML/load order is not required; last wins is fine
// because top-level const collisions can't exist in the original (shared scope).
for (const f of files) {
  const { provides } = fileInfo.get(f);
  for (const name of provides) {
    if (provideMap.has(name) && provideMap.get(name) !== nameMap.get(f)) {
      collisions.push(`${name}: ${provideMap.get(name)} <- ${nameMap.get(f)}`);
    }
    provideMap.set(name, nameMap.get(f));
  }
}

// --- 3. per-file: find free vars (needs), emit imports + exports ---
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const unresolvedAll = new Map(); // symbol -> Set(safe files needing it)

for (const f of files) {
  const { ast, code, provides, winAssigns } = fileInfo.get(f);
  const safe = nameMap.get(f);

  // Relocate any program-level `Object.assign(window, {...})` to the end of the
  // module. The prototype ran under Babel-standalone (const -> var, hoisted), so
  // a registration could legally precede the `const`s it references. In real
  // ESM that is a temporal-dead-zone error, so we move registrations to the end.
  let relocatedCode = code;
  if (winAssigns.length) {
    const texts = winAssigns.map((r) => code.slice(r.start, r.end));
    // Remove from last to first so earlier offsets stay valid.
    const sorted = [...winAssigns].sort((a, b) => b.start - a.start);
    for (const r of sorted) {
      relocatedCode = relocatedCode.slice(0, r.start) + relocatedCode.slice(r.end);
    }
    relocatedCode = relocatedCode.replace(/\s+$/, '') + '\n\n' + texts.join('\n') + '\n';
  }

  // Free variables via scope analysis.
  let globals = {};
  traverse(ast, {
    Program(p) {
      globals = p.scope.globals; // name -> node
    },
  });

  let needReact = false;
  const importsByModule = new Map(); // safeModule -> Set(symbols)
  for (const name of Object.keys(globals)) {
    if (name === 'React') { needReact = true; continue; }
    if (name === 'ReactDOM') continue; // not used by product code
    if (BUILTINS.has(name)) continue;
    if (provides.has(name)) continue; // defined locally
    const mod = provideMap.get(name);
    if (mod && mod !== safe) {
      if (!importsByModule.has(mod)) importsByModule.set(mod, new Set());
      importsByModule.get(mod).add(name);
    } else if (!mod) {
      if (!unresolvedAll.has(name)) unresolvedAll.set(name, new Set());
      unresolvedAll.get(name).add(safe);
    }
  }

  // Build header.
  const header = [];
  header.push('/* eslint-disable */');
  header.push('// @ts-nocheck');
  header.push('// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs');
  if (needReact) header.push("import React from 'react';");
  for (const mod of [...importsByModule.keys()].sort()) {
    const syms = [...importsByModule.get(mod)].sort();
    header.push(`import { ${syms.join(', ')} } from './${mod}';`);
  }

  // Footer: export every top-level binding.
  const exportNames = [...provides].sort();
  const footer = exportNames.length
    ? `\nexport { ${exportNames.join(', ')} };\n`
    : '';

  let body = relocatedCode;
  for (const [from, to] of PATCHES[f] || []) {
    if (!body.includes(from)) {
      console.warn(`  ! patch target not found in ${f}: ${from.slice(0, 60)}...`);
    }
    body = body.replace(from, to);
  }

  const out = header.join('\n') + '\n\n' + body + '\n' + footer;
  fs.writeFileSync(path.join(OUT_DIR, safe), out, 'utf8');
}

// --- 4. report ---
console.log(`Converted ${files.length} files into ${OUT_DIR}`);
console.log(`Provided symbols: ${provideMap.size}`);
if (collisions.length) {
  console.log(`\nName collisions (last def wins):`);
  for (const c of collisions) console.log('  ' + c);
}
if (unresolvedAll.size) {
  console.log(`\nUnresolved free identifiers (left as-is — verify they are real globals or unused):`);
  for (const [name, set] of [...unresolvedAll.entries()].sort((a, b) => b[1].size - a[1].size)) {
    console.log(`  ${name}  <- ${[...set].join(', ')}`);
  }
}

// Emit the symbol->module map for the entry to import TchinApp etc.
const mapObj = {};
for (const [k, v] of provideMap) mapObj[k] = v;
fs.writeFileSync(
  path.join(OUT_DIR, '_symbol-map.json'),
  JSON.stringify(mapObj, null, 2),
  'utf8'
);
console.log(`\nWrote _symbol-map.json`);
