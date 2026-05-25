/* eslint-disable */
// @ts-nocheck
// ════════════════════════════════════════════════════════════════════════
// "Treine seu Paladar" — o Duolingo do vinho.
// Reconstruído com referência direta a 43 telas do Duolingo + pesquisa Firecrawl
// (Octalysis, loss aversion, sunk cost, variable reward) + estudo de mercado
// (decisão de compra = dor #1; anti-elitismo da marca).
//
// IMPORTANTE: o onboarding aqui é da FEATURE (mascote Tchin), NÃO o onboarding
// do app inteiro. Tudo contido neste arquivo. Persistência em localStorage.
//
// Conteúdo:
//  • Onboarding conversacional (mascote + 1 pergunta por tela + afirmações).
//  • Trilha (path) com unidades, nós circulares 3D por tipo e baús de bônus.
//  • HUD: streak 🔥 · vidas ❤️ · cristais 💎 · meta diária (anel).
//  • Lição com 6 tipos de exercício (múltipla escolha, V/F, associar,
//    completar-frase, banco de palavras, digitar) + feedback instantâneo.
//  • Conclusão (XP/precisão/tempo + baú variável + cristais + badges).
//  • Cristais (moeda) + meta de ofensiva (commitment) + comprar congelamento.
//  • Liga semanal (leaderboard com promoção/rebaixamento).
// ════════════════════════════════════════════════════════════════════════
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_USER } from './data.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// ─── Store ─────────────────────────────────────────────────
const TREINO_KEY = 'tc.treino.v3';
const MAX_HEARTS = 5;
const HEART_REGEN_MS = 20 * 60 * 1000;
const FREEZE_COST = 200;
const GOALS = { leve: 20, regular: 40, serio: 60, intenso: 100 };

function defaultTreino() {
  return {
    xp: 0, streak: 0, bestStreak: 0, lastDone: null, done: [], badges: [],
    freezes: 1, hearts: MAX_HEARTS, heartsTs: Date.now(),
    goal: 'regular', dailyXp: 0, dailyDate: null,
    weekXp: 0, weekKey: null, perfectCount: 0,
    onboarded: false, gems: 0, level: null, objetivo: null,
    streakGoal: null, chests: [],
  };
}
function readTreino() {
  let s;
  try { s = Object.assign(defaultTreino(), JSON.parse(window.localStorage.getItem(TREINO_KEY) || 'null')); }
  catch (e) { s = defaultTreino(); }
  if (s.hearts < MAX_HEARTS) {
    const regen = Math.floor((Date.now() - (s.heartsTs || Date.now())) / HEART_REGEN_MS);
    if (regen > 0) { s.hearts = Math.min(MAX_HEARTS, s.hearts + regen); s.heartsTs = s.hearts >= MAX_HEARTS ? Date.now() : (s.heartsTs + regen * HEART_REGEN_MS); }
  }
  if (s.dailyDate !== todayStr()) { s.dailyDate = todayStr(); s.dailyXp = 0; }
  const wk = weekKey();
  if (s.weekKey !== wk) { s.weekKey = wk; s.weekXp = 0; }
  return s;
}
function writeTreino(s) { try { window.localStorage.setItem(TREINO_KEY, JSON.stringify(s)); } catch (e) {} }
function resetTreino() { try { window.localStorage.removeItem(TREINO_KEY); } catch (e) {} }

function dayStr(d) { return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function todayStr() { return dayStr(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }
function weekKey() { const d = new Date(); const j = new Date(d.getFullYear(), 0, 1); const wk = Math.ceil(((d - j) / 86400000 + j.getDay() + 1) / 7); return `${d.getFullYear()}-W${wk}`; }
function heartsEtaMin(s) { if (s.hearts >= MAX_HEARTS) return 0; const left = HEART_REGEN_MS - ((Date.now() - (s.heartsTs || Date.now())) % HEART_REGEN_MS); return Math.max(1, Math.ceil(left / 60000)); }
function norm(str) { return (str || '').toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

// ─── Níveis ────────────────────────────────────────────────
const LEVELS = [
  { lvl: 1, title: 'Curioso',           xp: 0 },
  { lvl: 2, title: 'Apreciador',        xp: 200 },
  { lvl: 3, title: 'Conhecedor',        xp: 600 },
  { lvl: 4, title: 'Sommelier de Mesa', xp: 1500 },
  { lvl: 5, title: 'Mestre do Paladar', xp: 3000 },
];
function levelFor(xp) { let cur = LEVELS[0]; for (const l of LEVELS) if (xp >= l.xp) cur = l; return cur; }
function nextLevelFor(xp) { return LEVELS.find(l => l.xp > xp) || null; }

// ─── Badges ────────────────────────────────────────────────
const TREINO_BADGES = [
  { id: 'primeira-gota',      name: 'Primeira gota',      icon: 'water_drop',            cond: 'Sua 1ª lição' },
  { id: 'pegando-o-ritmo',    name: 'Pegando o ritmo',    icon: 'trending_up',           cond: '5 lições concluídas' },
  { id: 'semana-cheia',       name: 'Semana cheia',       icon: 'local_fire_department', cond: 'Streak de 7 dias' },
  { id: 'explorador-de-uvas', name: 'Explorador de uvas', icon: 'travel_explore',        cond: '3 uvas aprendidas' },
  { id: 'licao-perfeita',     name: 'Sem erro',           icon: 'workspace_premium',     cond: 'Uma lição 100% certa' },
  { id: 'sem-medo-de-errar',  name: 'Sem medo de errar',  icon: 'sentiment_satisfied',   cond: 'Concluiu mesmo errando' },
];

// ─── Conteúdo: lições com exercícios variados ──────────────
// tipos: mc (múltipla escolha), tf (V/F), match (associar),
//        fill (completar frase com chips), bank (montar frase), type (digitar)
const LESSONS = [
  // Unidade 1 — Fundamentos
  {
    id: 'licao-01-tanino', unit: 'u1', grape: null, nodeIcon: 'water_drop', title: "Por que o vinho 'seca' a boca?",
    hook: "Já sentiu a boca 'amarrar' depois de um gole? Tem nome — e tem motivo.",
    concept: "Isso é o tanino: vem da casca e da semente da uva. Dá aquela sensação de 'secar' a boca, parecida com chá preto forte.",
    exercises: [
      { type: 'mc', q: "O que causa a sensação de 'secar' a boca?", options: ['O álcool', 'O tanino', 'O açúcar'], correct: 1, ok: "Isso! Tanino é o que 'amarra' a boca.", wrong: "Quase! É o tanino — vem da casca e da semente." },
      { type: 'fill', before: 'Quanto mais tanino, mais o vinho', after: 'a boca.', options: ['amarra', 'adoça', 'gela'], correct: 0, ok: "Exato — mais tanino, mais 'amarra'.", wrong: "É 'amarra' — mais tanino, mais seca a boca." },
    ],
    application: "No seu {perfil}, se quiser tintos mais macios procure Merlot ou Pinot Noir. Se curte estrutura, Cabernet é seu amigo.",
    recap: "Tanino = sensação de amarrar. Quanto mais, mais 'seco' parece.",
    curiosity: "Vinhos com muito tanino costumam melhorar com os anos — o tanino 'suaviza' com o tempo.",
    teaser: "A seguir: o que faz um vinho ter 'corpo'.",
  },
  {
    id: 'licao-02-corpo', unit: 'u1', grape: null, nodeIcon: 'fitness_center', title: "O que é 'corpo' no vinho?",
    hook: "Dizem que um vinho é 'leve' ou 'encorpado'. Mas o que isso quer dizer?",
    concept: "Corpo é o 'peso' do vinho na boca — pense em água (leve), leite (médio) e creme (encorpado).",
    exercises: [
      { type: 'mc', q: "Um vinho 'encorpado' lembra a textura de…", options: ['Água', 'Creme de leite', 'Chá gelado'], correct: 1, ok: "Isso! Encorpado = mais 'denso'.", wrong: "É o creme — encorpado é mais 'denso' na boca." },
      { type: 'match', instruction: "Associe o peso à textura:", pairs: [{ a: 'Leve', b: 'Água' }, { a: 'Médio', b: 'Leite' }, { a: 'Encorpado', b: 'Creme' }], ok: "Boa! Peso é densidade na boca." },
    ],
    application: "Pra {perfil}: comida pesada (carne, queijos) pede vinho encorpado. Happy hour leve? Um tinto leve ou branco cai melhor.",
    recap: "Corpo = peso na boca. Leve, médio ou encorpado.",
    curiosity: "Vinhos de climas quentes costumam ser mais encorpados.",
    teaser: "A seguir: seco x suave, sem mito.",
  },
  {
    id: 'licao-03-docura', unit: 'u1', grape: null, nodeIcon: 'icecream', title: "Seco ou suave: qual é o seu?",
    hook: "Tem gente que torce o nariz pra 'vinho suave'. A real? É só uma questão de gosto.",
    concept: "Seco = pouco ou nenhum açúcar. Suave = mais açúcar, mais doce. Nenhum é 'melhor'.",
    exercises: [
      { type: 'fill', before: 'Vinho', after: 'tem pouco açúcar.', options: ['seco', 'suave', 'doce'], correct: 0, ok: "Isso! Seco = pouco açúcar.", wrong: "É 'seco' — pouco açúcar." },
      { type: 'tf', statement: "Gostar de vinho suave é coisa de iniciante 'que não entende'.", answer: false, ok: "Exato — gosto é gosto. Suave é tão válido quanto seco.", wrong: "Aqui a gente discorda: gosto é gosto, suave é válido." },
    ],
    application: "Se você ({perfil}) curte café com leite e chocolate ao leite, provavelmente vai gostar de vinhos mais suaves ou frutados.",
    recap: "Seco = pouco açúcar. Suave = mais doce. Gosto é gosto.",
    curiosity: "Espumante 'brut' é bem seco; o 'demi-sec' é levemente doce.",
    teaser: "A seguir: por que vinho 'dá água na boca'.",
  },
  {
    id: 'licao-04-acidez', unit: 'u1', grape: null, nodeIcon: 'water_drop', title: "Por que vinho 'dá água na boca'?",
    hook: "Aquele friozinho que faz salivar… é a acidez trabalhando.",
    concept: "Acidez deixa o vinho 'vivo' e refrescante — como morder um limão faz salivar. É ela que casa o vinho com comida.",
    exercises: [
      { type: 'mc', q: "A acidez serve principalmente pra…", options: ['Deixar mais doce', 'Refrescar e harmonizar', 'Aumentar o álcool'], correct: 1, ok: "Isso! Acidez refresca e casa com comida.", wrong: "A acidez refresca e ajuda a harmonizar." },
      { type: 'tf', statement: "Brancos costumam ter mais acidez que tintos.", answer: true, ok: "Verdade — por isso refrescam tanto no calor.", wrong: "É verdade: brancos costumam ser mais ácidos." },
    ],
    application: "Pra {perfil}: vai comer algo gorduroso (pizza, fritura)? Um vinho com boa acidez 'limpa' a boca entre as garfadas.",
    recap: "Acidez = frescor + parceira da comida.",
    curiosity: "É a acidez que faz o espumante ser tão refrescante.",
    teaser: "Unidade fechada! Bora pras uvas.",
  },
  // Unidade 2 — Uvas
  {
    id: 'licao-05-cabernet', unit: 'u2', grape: 'Cabernet Sauvignon', nodeIcon: 'eco', title: "Cabernet Sauvignon: a porta de entrada",
    hook: "É a uva tinta mais famosa do mundo — e provavelmente a primeira que você vai amar.",
    concept: "Cabernet Sauvignon faz tintos encorpados, com bom tanino e sabor de frutas escuras (cassis, ameixa).",
    exercises: [
      { type: 'mc', q: "Cabernet Sauvignon costuma ser um tinto…", options: ['Leve e doce', 'Encorpado e estruturado', 'Sem tanino'], correct: 1, ok: "Isso! Encorpado e estruturado.", wrong: "Cabernet costuma ser encorpado e estruturado." },
      { type: 'bank', instruction: "Monte a dica:", words: ['Cabernet', 'combina', 'com', 'carne'], bank: ['gelo', 'sobremesa'], ok: "Boa! Cabernet + carne é aposta segura." },
      { type: 'type', prompt: "O nome completo é 'Cabernet ___'. Escreva a palavra que falta:", answer: 'Sauvignon', ok: "Isso! Cabernet Sauvignon.", wrong: "É 'Sauvignon' — Cabernet Sauvignon." },
    ],
    application: "Pra {perfil}: um Cabernet chileno ou brasileiro custo-benefício é aposta segura pra carne na brasa.",
    recap: "Cabernet = encorpado, tânico, frutas escuras.",
    curiosity: "Cabernet cresce bem em quase todo país produtor de vinho.",
    teaser: "A seguir: a queridinha argentina.",
  },
  {
    id: 'licao-06-malbec', unit: 'u2', grape: 'Malbec', nodeIcon: 'eco', title: "Malbec: a queridinha argentina",
    hook: "Se Cabernet é o clássico, Malbec é o abraço macio.",
    concept: "Malbec faz tintos frutados e macios, com taninos mais suaves. Ótimo com churrasco. Mendoza é a casa dela.",
    exercises: [
      { type: 'mc', q: "Comparado ao Cabernet, o Malbec costuma ser…", options: ['Mais macio e frutado', 'Mais ácido e leve', 'Mais amargo'], correct: 0, ok: "Isso! Malbec é mais macio.", wrong: "O Malbec costuma ser mais macio e frutado." },
      { type: 'match', instruction: "Associe a uva ao apelido:", pairs: [{ a: 'Cabernet', b: 'O clássico' }, { a: 'Malbec', b: 'O abraço macio' }], ok: "Boa! Já dá pra escolher por estilo." },
    ],
    application: "Pra {perfil}: quer agradar geral num churrasco? Um Malbec argentino de Mendoza raramente decepciona.",
    recap: "Malbec = macio, frutado, parceiro do churrasco.",
    curiosity: "A Argentina transformou o Malbec no seu maior símbolo.",
    teaser: "A seguir: o branco mais popular.",
  },
  {
    id: 'licao-07-chardonnay', unit: 'u2', grape: 'Chardonnay', nodeIcon: 'eco', title: "Chardonnay: o branco camaleão",
    hook: "Um branco que pode ser leve e cítrico — ou cremoso e amanteigado. Como assim?",
    concept: "Chardonnay muda conforme é feito: sem madeira fica fresco e cítrico; com madeira (carvalho) fica cremoso, com baunilha.",
    exercises: [
      { type: 'fill', before: 'O que deixa um Chardonnay cremoso é a passagem por', after: '.', options: ['madeira', 'gelo', 'açúcar'], correct: 0, ok: "Isso! A madeira dá cremosidade.", wrong: "É a madeira (carvalho) que dá a cremosidade." },
      { type: 'tf', statement: "Todo Chardonnay tem o mesmo sabor.", answer: false, ok: "Exato — é um camaleão.", wrong: "Não: o Chardonnay muda muito conforme é feito." },
    ],
    application: "Pra {perfil}: peixe e frango pedem um Chardonnay sem madeira (fresco). Risoto cremoso? Um com madeira combina lindamente.",
    recap: "Chardonnay = camaleão. Fresco sem madeira, cremoso com madeira.",
    curiosity: "Champagne de verdade leva Chardonnay na receita.",
    teaser: "Unidade fechada! Agora: comprar sem errar.",
  },
  // Unidade 3 — Comprar
  {
    id: 'licao-08-rotulo', unit: 'u3', grape: null, nodeIcon: 'sell', title: "Decifrando o rótulo em 10 segundos",
    hook: "Tanta informação na garrafa… mas só 3 coisas importam na hora de escolher.",
    concept: "Olhe: (1) a uva ou o tipo, (2) o país/região e (3) a safra (ano). Com isso você já sabe o estilo antes de abrir.",
    exercises: [
      { type: 'mc', q: "Qual destes NÃO ajuda a prever o estilo?", options: ['A uva', 'A safra', 'O desenho do rótulo'], correct: 2, ok: "Isso! O desenho é só marketing.", wrong: "O desenho é marketing — o que conta é uva, região e safra." },
      { type: 'bank', instruction: "Monte o que importa no rótulo:", words: ['uva', 'região', 'safra'], bank: ['desenho', 'preço'], ok: "Exato — uva, região e safra." },
    ],
    application: "Pra {perfil}: na próxima compra leia uva + país e use o Scanner do Tchin pra ver o match antes de pagar.",
    recap: "Rótulo = uva + região + safra. O resto é embalagem.",
    curiosity: "'Reserva' não tem regra única no mundo — às vezes é guarda, às vezes só marketing.",
    teaser: "A seguir: o preço é justo?",
  },
  {
    id: 'licao-09-preco', unit: 'u3', grape: null, nodeIcon: 'payments', title: "O preço é justo?",
    hook: "Vinho caro é sempre melhor? E o de R$ 30 do mercado, presta?",
    concept: "Preço ≠ qualidade direta. Acima de ~R$ 40 a curva 'achata': dobrar o preço quase nunca dobra o prazer.",
    exercises: [
      { type: 'mc', q: "Sobre preço e qualidade:", options: ['Mais caro é sempre melhor', 'Passado um ponto, preço não garante mais prazer', 'Barato é sempre ruim'], correct: 1, ok: "Isso! O ponto certo é o seu gosto.", wrong: "A real: passado um ponto, preço não garante mais prazer." },
      { type: 'tf', statement: "Existe vinho bom e honesto entre R$ 30 e 50.", answer: true, ok: "Com certeza — e o Tchin te ajuda a achar.", wrong: "Existe sim! Tem muita joia nessa faixa." },
    ],
    application: "Pra {perfil}: defina sua faixa (ex.: até R$ 60) e filtre por ela. Gastar bem é achar o match certo dentro do limite.",
    recap: "Preço não é qualidade. Ache o match certo pro seu gosto e bolso.",
    curiosity: "Em testes às cegas, até experts erram a faixa de preço.",
    teaser: "Você fechou a trilha dos Fundamentos! Novos módulos em breve.",
  },
];

const UNITS = [
  { id: 'u1', n: 'UNIDADE 1', title: 'Fundamentos do Paladar', subtitle: 'Tanino, corpo, doçura e acidez', color: T.c.p700, icon: 'science' },
  { id: 'u2', n: 'UNIDADE 2', title: 'Uvas que você vai amar', subtitle: 'As uvas que abrem 70% das cartas', color: '#8A4A2A', icon: 'eco' },
  { id: 'u3', n: 'UNIDADE 3', title: 'Comprar sem errar', subtitle: 'Rótulo e preço com confiança', color: '#2E5734', icon: 'shopping_basket' },
];
function lessonsOfUnit(uid) { return LESSONS.filter(l => l.unit === uid); }

function perfilLabel() {
  const p = (typeof window !== 'undefined' && window.__tcUserPaladar) || (typeof MOCK_USER !== 'undefined' && MOCK_USER.paladar);
  if (!p) return 'seu paladar';
  if (p.docura != null && p.docura <= 35) return 'paladar mais seco';
  if (p.docura != null && p.docura >= 60) return 'paladar mais suave';
  return 'seu paladar';
}
function computeStreakOnFinish(st) { return st.lastDone === todayStr() ? st.streak : (st.lastDone === yesterdayStr() ? st.streak + 1 : 1); }
function computeEarnedBadges(after, perfect, anyWrong) {
  const grapes = LESSONS.filter(l => l.grape && after.done.includes(l.id)).length;
  const e = [];
  if (after.done.length >= 1) e.push('primeira-gota');
  if (after.done.length >= 5) e.push('pegando-o-ritmo');
  if (after.streak >= 7) e.push('semana-cheia');
  if (grapes >= 3) e.push('explorador-de-uvas');
  if (perfect) e.push('licao-perfeita');
  if (anyWrong) e.push('sem-medo-de-errar');
  return e;
}

// ════════════════════════════════════════════════════════════
//  Mascote "Tchin" (taças que brindam)
// ════════════════════════════════════════════════════════════
function TchinDuo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ display: 'block' }}>
      <g transform="rotate(-12 22 34)">
        <path d="M14 16 L30 16 Q29 30 22 34 L22 46 L16 46 L16 48 L28 48 L28 46 L22 46" fill="none" stroke={T.c.p900} strokeWidth="2.4" strokeLinejoin="round"/>
        <path d="M16 18 L28 18 Q27 27 22 29 Q17 27 16 22 Z" fill={T.c.p700}/>
      </g>
      <g transform="rotate(12 42 34)">
        <path d="M34 16 L50 16 Q49 30 42 34 L42 46 L36 46 L36 48 L48 48 L48 46 L42 46" fill="none" stroke={T.c.p900} strokeWidth="2.4" strokeLinejoin="round"/>
        <path d="M36 18 L48 18 Q47 27 42 29 Q37 27 36 22 Z" fill={T.c.p700}/>
      </g>
      <circle cx="27" cy="22" r="1.5" fill="#fff"/>
      <circle cx="37" cy="22" r="1.5" fill="#fff"/>
      <g fill={T.c.a500}><path d="M31 8 L33 12 L37 14 L33 16 L31 20 L29 16 L25 14 L29 12 Z"/></g>
    </svg>
  );
}

// ─── HUD ───────────────────────────────────────────────────
function HudStat({ icon, color, value, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 6px', borderRadius: T.r.full, background: 'transparent', border: 'none', cursor: onClick ? 'pointer' : 'default', fontFamily: T.font }}>
      <Icon name={icon} size={20} color={color} fill={1}/>
      <span style={{ fontSize: 15, fontWeight: 800, color: T.c.n950 }}>{value}</span>
    </button>
  );
}
function GoalRing({ pct, size = 40 }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Meta ${pct}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.c.n200} strokeWidth="5"/>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.c.s700} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, pct / 100))} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 500ms' }}/>
      <g transform={`translate(${size / 2 - 7}, ${size / 2 - 7})`}><Icon name={pct >= 100 ? 'check' : 'local_bar'} size={14} color={pct >= 100 ? T.c.s700 : T.c.n600} fill={1}/></g>
    </svg>
  );
}
function Gem({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M6 3 H18 L22 9 L12 22 L2 9 Z" fill="#2FB8E6"/>
      <path d="M6 3 L9 9 H2 Z" fill="#5AD0F5"/>
      <path d="M18 3 L15 9 H22 Z" fill="#1E9BC9"/>
      <path d="M9 9 H15 L12 22 Z" fill="#1E9BC9"/>
      <path d="M9 9 L12 22 L2 9 Z" fill="#33BEEA"/>
    </svg>
  );
}

// ════════════════════════════════════════════════════════════
//  HOME — a TRILHA
// ════════════════════════════════════════════════════════════
function TreinoPaladarHome({ go }) {
  const [s, setS] = React.useState(readTreino);
  const [sheet, setSheet] = React.useState(null);
  const [showIntro, setShowIntro] = React.useState(() => !s.onboarded);
  React.useEffect(() => { fbEvent('treino_home_viewed', { streak: s.streak, xp: s.xp }); }, []); // eslint-disable-line

  const reload = () => setS(readTreino());
  const lvl = levelFor(s.xp);
  const goalXp = GOALS[s.goal] || 40;
  const goalPct = Math.min(100, Math.round((s.dailyXp / goalXp) * 100));
  const doneToday = s.lastDone === todayStr();
  const nextIdx = LESSONS.findIndex(l => !s.done.includes(l.id));
  const currentId = nextIdx >= 0 ? LESSONS[nextIdx].id : null;
  const allDone = nextIdx < 0;
  const social = 8000 + (new Date().getDate() * 137) % 900;

  const finishIntro = (answers) => {
    const st = readTreino();
    st.onboarded = true;
    if (answers) {
      // nível vem do onboarding do app (não repetimos a pergunta aqui)
      st.level = (typeof window !== 'undefined' && window.__tcUserLevel) || st.level || null;
      if (answers.objetivo) st.objetivo = answers.objetivo;
      if (answers.goal) st.goal = answers.goal;
      if (answers.streakGoal) st.streakGoal = answers.streakGoal;
      st.gems = (st.gems || 0) + 20; // cristais de boas-vindas
    }
    writeTreino(st); reload(); setShowIntro(false);
    if (answers && answers.start && currentId) { fbEvent('treino_intro_start', { lesson_id: currentId }); go('treino-licao', { lessonId: currentId }); }
  };

  const claimChest = (uid) => {
    const st = readTreino();
    if ((st.chests || []).includes(uid)) return;
    st.chests = [...(st.chests || []), uid]; st.gems = (st.gems || 0) + 30;
    writeTreino(st); reload();
    go('toast', { kind: 'success', message: '+30 cristais! Baú aberto 🎁' });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      {/* Top bar + HUD */}
      <div style={{ flexShrink: 0, background: T.c.n0, borderBottom: `1px solid ${T.c.n100}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '6px 6px' }}>
          <button onClick={() => go('back')} aria-label="Voltar" style={btnRound}><Icon name="arrow_back" size={22} color={T.c.n950}/></button>
          <button onClick={() => setShowIntro(true)} aria-label="Como funciona" style={btnRound}><Icon name="help" size={22} color={T.c.n500}/></button>
          <div style={{ flex: 1 }}/>
          <HudStat icon="local_fire_department" color={s.streak > 0 ? '#E8772E' : T.c.n400} value={s.streak} onClick={() => setSheet('streak')} label="Sequência"/>
          <HudStat icon="favorite" color={T.c.e700 || '#C0392B'} value={s.hearts} onClick={() => setSheet('hearts')} label="Vidas"/>
          <button onClick={() => setSheet('gems')} aria-label="Cristais" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: T.font }}>
            <Gem size={18}/><span style={{ fontSize: 15, fontWeight: 800, color: T.c.n950 }}>{s.gems}</span>
          </button>
          <button onClick={() => setSheet('goal')} aria-label="Meta diária" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 4px 0 2px' }}><GoalRing pct={goalPct}/></button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 36px', minHeight: 0 }}>
        {/* Banner nível */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, padding: 14, marginBottom: 8 }}>
          <TchinDuo size={48}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.overline, color: T.c.a700 }}>NÍVEL {lvl.lvl} · {lvl.title} · {s.xp} XP</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.c.n700 }}>
              {goalPct >= 100 ? 'Meta de hoje batida! 🎉' : doneToday ? `Faltam ${Math.max(0, goalXp - s.dailyXp)} XP pra meta.` : 'Bora treinar 2 minutinhos hoje?'}
            </div>
          </div>
        </div>

        {/* Liga */}
        <button onClick={() => go('treino-liga')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 18, background: 'linear-gradient(135deg, #4A1F24, #722F37)', border: 'none', borderRadius: T.r.lg, cursor: 'pointer', textAlign: 'left' }}>
          <Icon name="emoji_events" size={26} color={T.c.a500} fill={1}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 800, color: '#fff' }}>Liga Tinto</div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{s.weekXp} XP esta semana · veja o ranking</div>
          </div>
          <Icon name="chevron_right" size={20} color="rgba(255,255,255,0.8)"/>
        </button>

        {/* TRILHA */}
        {UNITS.map((u) => {
          const ls = lessonsOfUnit(u.id);
          const unitDone = ls.every(l => s.done.includes(l.id));
          const chestClaimed = (s.chests || []).includes(u.id);
          return (
            <div key={u.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: u.color, borderRadius: T.r.lg, padding: '14px 16px', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', color: 'rgba(255,255,255,0.75)' }}>{u.n}</div>
                  <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>{u.title}</div>
                  <div style={{ fontFamily: T.font, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{u.subtitle}</div>
                </div>
                <Icon name={u.icon} size={30} color="rgba(255,255,255,0.9)" fill={1}/>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '6px 0' }}>
                {ls.map((l) => {
                  const idxAll = LESSONS.indexOf(l);
                  const completed = s.done.includes(l.id);
                  const isCurrent = l.id === currentId;
                  const offset = [0, 56, 80, 56, 0, -56, -80, -56][idxAll % 8];
                  return (
                    <div key={l.id} style={{ transform: `translateX(${offset}px)`, transition: 'transform 200ms' }}>
                      <div style={{ animation: 'tcStaggerIn 420ms ease-out both', animationDelay: `${idxAll * 45}ms` }}>
                        <PathNode lesson={l} state={completed ? 'done' : isCurrent ? 'current' : 'locked'}
                          onStart={() => { fbEvent('treino_lesson_cta', { lesson_id: l.id }); go('treino-licao', { lessonId: l.id }); }}
                          onLockedTap={() => go('toast', { kind: 'info', message: 'Conclua a lição anterior pra liberar esta.' })}
                          doneToday={completed && doneToday}/>
                      </div>
                    </div>
                  );
                })}
                {/* Baú de bônus ao fim da unidade */}
                <ChestNode unlocked={unitDone} claimed={chestClaimed} onClaim={() => claimChest(u.id)} onLocked={() => go('toast', { kind: 'info', message: 'Conclua a unidade pra abrir o baú.' })}/>
              </div>
            </div>
          );
        })}

        {allDone && (
          <div style={{ textAlign: 'center', background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, padding: 20, margin: '8px 0 18px' }}>
            <Icon name="emoji_events" size={40} color={T.c.a700} fill={1}/>
            <div style={{ ...T.t.h3, color: T.c.n950, marginTop: 8 }}>Você fechou a trilha! 🎉</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginTop: 4 }}>Novos módulos em breve. Volte pra manter a sequência!</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...T.t.caption, color: T.c.n600, margin: '4px 0 18px' }}>
          <Icon name="group" size={16} color={T.c.n600}/>{social.toLocaleString('pt-BR')} pessoas treinaram o paladar hoje
        </div>

        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>SUAS CONQUISTAS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {TREINO_BADGES.map(b => {
            const earned = s.badges.includes(b.id);
            return (
              <div key={b.id} title={b.cond} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 10, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, opacity: earned ? 1 : 0.5 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: earned ? T.c.a100 : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={earned ? b.icon : 'lock'} size={22} color={earned ? T.c.a700 : T.c.n400} fill={earned ? 1 : 0}/>
                </div>
                <div style={{ fontFamily: T.font, fontSize: 10, fontWeight: 700, color: T.c.n800, textAlign: 'center', lineHeight: 1.15 }}>{b.name}</div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => { resetTreino(); reload(); setShowIntro(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.c.n400, fontFamily: T.font, fontSize: 11, textDecoration: 'underline' }}>Reiniciar progresso (demo)</button>
        </div>
      </div>

      {sheet && <TreinoSheet kind={sheet} s={s} onClose={() => setSheet(null)} onChange={reload} go={go}/>}
      {showIntro && <TreinoOnboarding hasCurrent={!!currentId} onFinish={finishIntro}/>}
    </div>
  );
}
const btnRound = { width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

// ─── Nó da trilha (circular 3D, ícone por tipo) ────────────
function PathNode({ lesson, state, onStart, onLockedTap, doneToday }) {
  const isCurrent = state === 'current', isDone = state === 'done';
  const bg = isDone ? T.c.a500 : isCurrent ? T.c.p700 : T.c.n200;
  const ring = isDone ? T.c.a700 : isCurrent ? T.c.p900 : T.c.n300;
  const icon = isDone ? 'check' : isCurrent ? (lesson.nodeIcon || 'play_arrow') : 'lock';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {isCurrent && <div style={{ background: T.c.p700, color: '#fff', fontFamily: T.font, fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: T.r.full, animation: 'tcBreath 2s ease-in-out infinite' }}>{doneToday ? 'DE NOVO' : 'COMEÇAR'}</div>}
      <button onClick={state === 'locked' ? onLockedTap : onStart} aria-label={lesson.title} style={{ width: 66, height: 66, borderRadius: '50%', border: 'none', cursor: 'pointer', background: bg, boxShadow: `0 6px 0 ${ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 120ms', transform: isCurrent ? 'scale(1.05)' : 'scale(1)' }}>
        <Icon name={icon} size={30} color={state === 'locked' ? T.c.n500 : '#fff'} fill={1} weight={700}/>
      </button>
      {isDone && <Icon name="star" size={14} color={T.c.a700} fill={1}/>}
      <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: state === 'locked' ? T.c.n400 : T.c.n800, textAlign: 'center', maxWidth: 120, lineHeight: 1.15 }}>{lesson.title}</div>
    </div>
  );
}
function ChestNode({ unlocked, claimed, onClaim, onLocked }) {
  return (
    <button onClick={unlocked && !claimed ? onClaim : onLocked} aria-label="Baú de bônus" disabled={claimed} style={{ width: 70, height: 64, borderRadius: 14, border: 'none', cursor: claimed ? 'default' : 'pointer', background: claimed ? T.c.n200 : unlocked ? T.c.a100 : T.c.n100, boxShadow: claimed ? 'none' : `0 5px 0 ${unlocked ? T.c.a500 : T.c.n300}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, opacity: claimed ? 0.6 : 1 }}>
      <Icon name={claimed ? 'check' : 'redeem'} size={28} color={claimed ? T.c.n500 : unlocked ? T.c.a700 : T.c.n400} fill={1}/>
    </button>
  );
}

// ─── Bottom sheets (streak / vidas / cristais / meta) ──────
function TreinoSheet({ kind, s, onClose, onChange, go }) {
  const buyFreeze = () => {
    const st = readTreino();
    if (st.gems < FREEZE_COST) { go('toast', { kind: 'warning', message: `Faltam cristais (precisa de ${FREEZE_COST}).` }); return; }
    st.gems -= FREEZE_COST; st.freezes = (st.freezes || 0) + 1; writeTreino(st); onChange();
    go('toast', { kind: 'success', message: 'Congelamento comprado! 🧊' });
  };
  const setGoal = (g) => { const st = readTreino(); st.goal = g; writeTreino(st); onChange(); };
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(15,15,15,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', animation: 'tcFadeIn 200ms ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '20px 20px 28px', animation: 'tcSlideUp 280ms cubic-bezier(0.2,0.8,0.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: T.c.n300, margin: '0 auto 16px' }}/>
        {kind === 'streak' && (
          <div style={{ textAlign: 'center' }}>
            <Icon name="local_fire_department" size={48} color={s.streak > 0 ? '#E8772E' : T.c.n400} fill={1}/>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 28, fontWeight: 700, color: T.c.n950, marginTop: 4 }}>{s.streak} {s.streak === 1 ? 'dia' : 'dias'}</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 12 }}>de ofensiva{s.bestStreak > s.streak ? ` · recorde: ${s.bestStreak}` : ''}{s.streakGoal ? ` · meta: ${s.streakGoal} dias` : ''}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
                const active = i < (s.streak % 7 || (s.streak > 0 ? 7 : 0));
                return (
                  <div key={i} style={{ width: 30, textAlign: 'center' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: active ? 'rgba(232,119,46,0.18)' : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2px' }}><Icon name="local_fire_department" size={16} color={active ? '#E8772E' : T.c.n300} fill={1}/></div>
                    <span style={{ fontSize: 10, color: T.c.n500 }}>{d}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ background: T.c.p50, borderRadius: T.r.md, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Icon name="ac_unit" size={22} color={T.c.p700} fill={1}/>
              <div style={{ flex: 1, textAlign: 'left', ...T.t.caption, color: T.c.n800 }}>Você tem <strong>{s.freezes}</strong> congelamento{s.freezes === 1 ? '' : 's'} — se faltar um dia, a gente segura.</div>
            </div>
            <Button variant="secondary" size="md" fullWidth onClick={buyFreeze} leading={<Gem size={16}/>}>Comprar congelamento · {FREEZE_COST}</Button>
          </div>
        )}
        {kind === 'hearts' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>{Array.from({ length: MAX_HEARTS }).map((_, i) => <Icon key={i} name="favorite" size={28} color={i < s.hearts ? (T.c.e700 || '#C0392B') : T.c.n200} fill={1}/>)}</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, fontWeight: 700, color: T.c.n950 }}>{s.hearts} de {MAX_HEARTS} vidas</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginTop: 4, marginBottom: 8 }}>{s.hearts >= MAX_HEARTS ? 'Vidas cheias! Bora treinar.' : `Mais 1 vida em ~${heartsEtaMin(s)} min.`}</div>
            <div style={{ ...T.t.caption, color: T.c.n500, fontStyle: 'italic' }}>Aqui ninguém trava por errar — vidas são só um empurrãozinho pra ir com calma.</div>
          </div>
        )}
        {kind === 'gems' && (
          <div style={{ textAlign: 'center' }}>
            <Gem size={48}/>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 26, fontWeight: 700, color: T.c.n950, marginTop: 4 }}>{s.gems} cristais</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginTop: 4, marginBottom: 14 }}>Ganhe cristais concluindo lições, abrindo baús e mantendo a ofensiva.</div>
            <Button variant="secondary" size="md" fullWidth disabled={s.gems < FREEZE_COST} onClick={buyFreeze} leading={<Icon name="ac_unit" size={18}/>}>Congelar ofensiva · {FREEZE_COST} cristais</Button>
          </div>
        )}
        {kind === 'goal' && (
          <div>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Sua meta diária</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 14 }}>Quanto você quer treinar por dia?</div>
            {[['leve', 'Leve', '1 lição · ~2 min'], ['regular', 'Regular', '2 lições · ~4 min'], ['serio', 'Sério', '3 lições · ~6 min'], ['intenso', 'Intenso', '5 lições · ~10 min']].map(([id, t, sub]) => (
              <button key={id} onClick={() => setGoal(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8, textAlign: 'left', background: s.goal === id ? T.c.p50 : T.c.n0, border: `1.5px solid ${s.goal === id ? T.c.p700 : T.c.n200}`, borderRadius: T.r.md, cursor: 'pointer', fontFamily: T.font }}>
                <Icon name="local_bar" size={22} color={s.goal === id ? T.c.p700 : T.c.n500} fill={1}/>
                <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>{t} · {GOALS[id]} XP</div><div style={{ ...T.t.caption, color: T.c.n600 }}>{sub}</div></div>
                {s.goal === id && <Icon name="check_circle" size={20} color={T.c.p700} fill={1}/>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  ONBOARDING conversacional (DA FEATURE — mascote Tchin)
// ════════════════════════════════════════════════════════════
const ONB = [
  { kind: 'intro', title: 'Oi! Eu sou o Tchin 🍷', body: 'Vou te ensinar a entender vinho em 2 minutinhos por dia — sem decoreba e sem frescura.' },
  { kind: 'say', body: 'Só duas perguntinhas rápidas e a gente já começa a sua primeira lição!' },
  { kind: 'choose', key: 'objetivo', q: 'Por que você quer treinar o paladar?', opts: [
    { id: 'comprar', icon: 'shopping_basket', label: 'Escolher sem errar na loja', sub: '' },
    { id: 'vergonha', icon: 'sentiment_satisfied', label: 'Não passar vergonha', sub: 'Entender o que falam' },
    { id: 'harmonizar', icon: 'restaurant', label: 'Harmonizar melhor', sub: 'Vinho + comida' },
    { id: 'curtir', icon: 'celebration', label: 'Curtir mais, por hobby', sub: '' },
  ] },
  { kind: 'goal', q: 'Qual vai ser a sua meta diária?' },
  { kind: 'say', body: 'Boa escolha! No seu ritmo, em 1 semana você já escolhe vinho com mais confiança.' },
  { kind: 'streakGoal', q: 'Escolha uma meta de ofensiva e se comprometa!' },
  { kind: 'gems', body: 'Vou te dar 20 cristais pra começar bem! 💎' },
  { kind: 'final', title: 'Tudo pronto!', body: 'É só tocar na resposta certa em cada card. Bora pra sua primeira lição?' },
];
function TreinoOnboarding({ hasCurrent, onFinish }) {
  const [step, setStep] = React.useState(0);
  const [ans, setAns] = React.useState({ goal: 'regular' });
  const cur = ONB[step];
  const pct = ((step + 1) / ONB.length) * 100;
  const next = () => { if (step < ONB.length - 1) setStep(step + 1); };
  const choose = (key, id) => { setAns(a => ({ ...a, [key]: id })); window.setTimeout(next, 220); };
  const canContinue = cur.kind !== 'choose' && cur.kind !== 'goal' && cur.kind !== 'streakGoal';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, background: T.c.n0, display: 'flex', flexDirection: 'column', animation: 'tcFadeIn 200ms ease' }}>
      {/* topo: pular + progresso */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px 8px', flexShrink: 0 }}>
        <button onClick={() => onFinish(null)} aria-label="Pular" style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={22} color={T.c.n600}/></button>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: T.c.n200, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${T.c.a500}, ${T.c.a700})`, borderRadius: 6, transition: 'width 300ms' }}/></div>
      </div>

      {/* mascote + balão */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 20px 4px', flexShrink: 0 }}>
        <div style={{ flexShrink: 0 }}><TchinDuo size={56}/></div>
        <div key={'bubble' + step} style={{ flex: 1, position: 'relative', background: T.c.n50, border: `1px solid ${T.c.n200}`, borderRadius: 16, padding: '12px 14px', animation: 'tcPopIn 320ms cubic-bezier(0.2,0.8,0.2,1)' }}>
          <div style={{ fontFamily: T.font, fontSize: 15, color: T.c.n950, lineHeight: 1.4 }}>{cur.q || cur.body || cur.title}</div>
        </div>
      </div>

      {/* corpo */}
      <div key={step} style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '14px 20px 8px', display: 'flex', flexDirection: 'column', animation: 'tcPushIn 320ms ease-out' }}>
        {(cur.kind === 'intro' || cur.kind === 'say' || cur.kind === 'final') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
            <div style={{ animation: 'tcPopIn 360ms cubic-bezier(0.2,0.8,0.2,1)' }}><TchinDuo size={120}/></div>
            {cur.title && <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 24, fontWeight: 700, color: T.c.n950, textWrap: 'balance' }}>{cur.title}</div>}
          </div>
        )}
        {cur.kind === 'gems' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ animation: 'tcPopIn 420ms cubic-bezier(0.2,0.8,0.2,1)' }}><Gem size={96}/></div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 28, fontWeight: 700, color: '#2FB8E6' }}>+20 cristais</div>
          </div>
        )}
        {cur.kind === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cur.opts.map((o, oi) => {
              const sel = ans[cur.key] === o.id;
              return (
                <button key={o.id} onClick={() => choose(cur.key, o.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, textAlign: 'left', background: sel ? T.c.p50 : T.c.n0, border: `2px solid ${sel ? T.c.p700 : T.c.n200}`, borderRadius: T.r.lg, cursor: 'pointer', fontFamily: T.font, animation: 'tcStaggerIn 320ms ease-out both', animationDelay: `${oi * 60}ms` }}>
                  <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: T.r.md, background: T.c.p50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={o.icon} size={24} color={T.c.p700} fill={1}/></div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>{o.label}</div>{o.sub && <div style={{ ...T.t.caption, color: T.c.n600 }}>{o.sub}</div>}</div>
                  {sel && <Icon name="check_circle" size={22} color={T.c.p700} fill={1}/>}
                </button>
              );
            })}
          </div>
        )}
        {cur.kind === 'goal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['leve', 'Leve', '~2 min'], ['regular', 'Regular', '~4 min'], ['serio', 'Sério', '~6 min'], ['intenso', 'Intenso', '~10 min']].map(([id, t, sub]) => {
              const sel = ans.goal === id;
              return (
                <button key={id} onClick={() => { setAns(a => ({ ...a, goal: id })); window.setTimeout(next, 220); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, textAlign: 'left', background: sel ? T.c.p50 : T.c.n0, border: `1.5px solid ${sel ? T.c.p700 : T.c.n200}`, borderRadius: T.r.md, cursor: 'pointer', fontFamily: T.font }}>
                  <div style={{ flex: 1 }}><span style={{ fontSize: 16, fontWeight: 800, color: T.c.n950 }}>{GOALS[id]} XP/dia</span></div>
                  <span style={{ ...T.t.caption, color: T.c.n600 }}>{t} · {sub}</span>
                </button>
              );
            })}
          </div>
        )}
        {cur.kind === 'streakGoal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[[7, 35], [14, 140], [30, 210], [50, 350]].map(([d, g]) => {
              const sel = ans.streakGoal === d;
              return (
                <button key={d} onClick={() => { setAns(a => ({ ...a, streakGoal: d })); window.setTimeout(next, 220); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, textAlign: 'left', background: sel ? T.c.p50 : T.c.n0, border: `1.5px solid ${sel ? T.c.p700 : T.c.n200}`, borderRadius: T.r.md, cursor: 'pointer', fontFamily: T.font }}>
                  <Icon name="local_fire_department" size={22} color="#E8772E" fill={1}/>
                  <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: T.c.n950 }}>{d} dias</div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...T.t.caption, color: T.c.n600 }}><Gem size={14}/> {g}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: '12px 20px 24px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))', borderTop: `1px solid ${T.c.n100}` }}>
        {cur.kind === 'final' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => onFinish({ ...ans, start: true })}>{hasCurrent ? 'Começar minha 1ª lição' : 'Explorar a trilha'}</Button>
            {hasCurrent && <Button variant="ghost" size="md" fullWidth onClick={() => onFinish({ ...ans, start: false })}>Só explorar por enquanto</Button>}
          </div>
        ) : canContinue ? (
          <Button variant="primary" size="lg" fullWidth onClick={next} trailing={<Icon name="arrow_forward" size={18}/>}>{cur.kind === 'gems' ? 'Quero!' : 'Continuar'}</Button>
        ) : (
          <div style={{ textAlign: 'center', ...T.t.caption, color: T.c.n500 }}>Toque numa opção pra continuar</div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LIÇÃO — player
// ════════════════════════════════════════════════════════════
function TreinoLicaoScreen({ go, params }) {
  const lesson = React.useMemo(() => { const id = params && params.lessonId; return LESSONS.find(l => l.id === id) || LESSONS[0]; }, [params]);
  const steps = React.useMemo(() => {
    const arr = [{ type: 'concept' }];
    lesson.exercises.forEach((ex, i) => arr.push({ type: 'exercise', ex, exIdx: i }));
    arr.push({ type: 'application' });
    return arr;
  }, [lesson]);
  const prevState = React.useMemo(() => readTreino(), []);
  const [idx, setIdx] = React.useState(0);
  const [hearts, setHearts] = React.useState(prevState.hearts);
  const [mistakes, setMistakes] = React.useState(0);
  const [answered, setAnswered] = React.useState({});
  const [done, setDone] = React.useState(false);
  const startRef = React.useRef(Date.now());
  React.useEffect(() => { fbEvent('treino_lesson_started', { lesson_id: lesson.id }); }, []); // eslint-disable-line

  const step = steps[idx];
  const onAnswer = (correct, choice) => {
    setAnswered(a => ({ ...a, [step.exIdx]: { correct, choice } }));
    if (!correct) { setMistakes(m => m + 1); setHearts(h => Math.max(0, h - 1)); }
    fbEvent('treino_quiz_answered', { lesson_id: lesson.id, correct });
  };
  const canAdvance = step.type !== 'exercise' || answered[step.exIdx] != null;
  const advance = () => { if (idx < steps.length - 1) setIdx(i => i + 1); else setDone(true); };

  if (done) return <TreinoCompleta lesson={lesson} prevState={prevState} mistakes={mistakes} elapsedMs={Date.now() - startRef.current} go={go}/>;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 8px', flexShrink: 0 }}>
        <button onClick={() => go('back')} aria-label="Fechar" style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={22} color={T.c.n800}/></button>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: T.c.n200, overflow: 'hidden' }}><div style={{ height: '100%', width: `${((idx + 1) / steps.length) * 100}%`, background: `linear-gradient(90deg, ${T.c.a500}, ${T.c.a700})`, borderRadius: 6, transition: 'width 300ms' }}/></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="favorite" size={20} color={T.c.e700 || '#C0392B'} fill={1}/><span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.c.n950 }}>{hearts}</span></div>
      </div>

      <div key={idx} style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '8px 24px 16px', display: 'flex', flexDirection: 'column', animation: 'tcPushIn 260ms ease-out' }}>
        {step.type === 'concept' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><TchinDuo size={72}/></div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 24, fontWeight: 600, color: T.c.n950, lineHeight: 1.2, marginBottom: 12, textWrap: 'balance' }}>{lesson.title}</div>
            <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.55, marginBottom: 14 }}>{lesson.hook}</div>
            <div style={{ background: T.c.a100, borderRadius: T.r.md, padding: 14, display: 'flex', gap: 10 }}><Icon name="lightbulb" size={22} color={T.c.a700} fill={1}/><div style={{ ...T.t.body, color: T.c.n900, lineHeight: 1.5 }}>{lesson.concept}</div></div>
          </div>
        )}
        {step.type === 'exercise' && <ExerciseView ex={step.ex} result={answered[step.exIdx]} onAnswer={onAnswer}/>}
        {step.type === 'application' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${T.c.p700}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icon name="shopping_basket" size={44} color={T.c.p700} fill={1}/></div>
            <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 8 }}>NA SUA PRÓXIMA COMPRA</div>
            <div style={{ ...T.t.bodyLg, color: T.c.n950, lineHeight: 1.55 }}>{lesson.application.replace('{perfil}', perfilLabel())}</div>
          </div>
        )}
      </div>

      <FeedbackCta step={step} answered={answered} canAdvance={canAdvance} isLast={idx === steps.length - 1} advance={advance}/>
    </div>
  );
}

// ─── Exercícios ────────────────────────────────────────────
function ExerciseView({ ex, result, onAnswer }) {
  if (ex.type === 'mc') return <ExMC ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'tf') return <ExTF ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'match') return <ExMatch ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'fill') return <ExFill ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'bank') return <ExBank ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'type') return <ExType ex={ex} result={result} onAnswer={onAnswer}/>;
  return null;
}
function exLabel(s) { return <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 10 }}>{s}</div>; }
function exQ(s) { return <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: T.c.n950, lineHeight: 1.25, marginBottom: 18 }}>{s}</div>; }

function ExMC({ ex, result, onAnswer }) {
  const choice = result ? result.choice : null;
  return (
    <div style={{ paddingTop: 6 }}>{exLabel('ESCOLHA A CERTA')}{exQ(ex.q)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ex.options.map((opt, i) => {
          let bg = T.c.n0, border = T.c.n300, color = T.c.n950, icon = null;
          if (result != null) { if (i === ex.correct) { bg = T.c.s100; border = T.c.s700; color = T.c.s700; icon = 'check_circle'; } else if (i === choice) { bg = '#F7EBE3'; border = '#A0522D'; color = '#A0522D'; icon = 'cancel'; } else color = T.c.n400; }
          const anim = result == null ? 'tcStaggerIn 300ms ease-out both' : i === ex.correct ? 'tcLikePop 500ms ease' : i === choice ? 'tcShake 400ms ease' : 'none';
          return (
            <button key={i} disabled={result != null} onClick={() => { if (result == null) onAnswer(i === ex.correct, i); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 15, textAlign: 'left', background: bg, border: `1.5px solid ${border}`, borderRadius: T.r.md, cursor: result != null ? 'default' : 'pointer', fontFamily: T.font, fontSize: 15, fontWeight: 600, color, animation: anim, animationDelay: result == null ? `${i * 55}ms` : '0ms' }}>
              <span style={{ flex: 1 }}>{opt}</span>{icon && <Icon name={icon} size={20} color={color} fill={1}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function ExTF({ ex, result, onAnswer }) {
  const choice = result ? result.choice : null;
  const opt = (val, label, icon) => {
    let bg = T.c.n0, border = T.c.n300, color = T.c.n950;
    if (result != null) { if (val === ex.answer) { bg = T.c.s100; border = T.c.s700; color = T.c.s700; } else if (val === choice) { bg = '#F7EBE3'; border = '#A0522D'; color = '#A0522D'; } else color = T.c.n400; }
    return <button disabled={result != null} onClick={() => { if (result == null) onAnswer(val === ex.answer, val); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 12px', background: bg, border: `1.5px solid ${border}`, borderRadius: T.r.lg, cursor: result != null ? 'default' : 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 15, color }}><Icon name={icon} size={30} color={color} fill={1}/>{label}</button>;
  };
  return <div style={{ paddingTop: 6 }}>{exLabel('VERDADEIRO OU FALSO?')}{exQ(ex.statement)}<div style={{ display: 'flex', gap: 12 }}>{opt(true, 'Verdadeiro', 'thumb_up')}{opt(false, 'Falso', 'thumb_down')}</div></div>;
}
function ExMatch({ ex, result, onAnswer }) {
  const [left, setLeft] = React.useState(null);
  const [paired, setPaired] = React.useState({});
  const rights = React.useMemo(() => ex.pairs.map((p, i) => i).sort(() => Math.random() - 0.5), [ex]);
  const allDone = Object.keys(paired).length === ex.pairs.length;
  React.useEffect(() => { if (allDone && result == null) onAnswer(true); }, [allDone]); // eslint-disable-line
  const tapRight = (bi) => { if (left == null || result != null) return; if (bi === left) { setPaired(p => ({ ...p, [left]: bi })); setLeft(null); } else setLeft(null); };
  return (
    <div style={{ paddingTop: 6 }}>{exLabel('ASSOCIE OS PARES')}{exQ(ex.instruction)}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ex.pairs.map((p, ai) => { const isP = paired[ai] != null, isS = left === ai; return <button key={ai} disabled={isP} onClick={() => !isP && setLeft(ai)} style={{ padding: 14, borderRadius: T.r.md, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: isP ? 'default' : 'pointer', background: isP ? T.c.s100 : isS ? T.c.p50 : T.c.n0, color: isP ? T.c.s700 : T.c.n950, border: `1.5px solid ${isP ? T.c.s700 : isS ? T.c.p700 : T.c.n300}` }}>{p.a}</button>; })}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rights.map(bi => { const isP = Object.values(paired).includes(bi); return <button key={bi} disabled={isP} onClick={() => tapRight(bi)} style={{ padding: 14, borderRadius: T.r.md, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: isP ? 'default' : 'pointer', background: isP ? T.c.s100 : T.c.n0, color: isP ? T.c.s700 : T.c.n950, border: `1.5px solid ${isP ? T.c.s700 : T.c.n300}` }}>{ex.pairs[bi].b}</button>; })}
        </div>
      </div>
    </div>
  );
}
function ExFill({ ex, result, onAnswer }) {
  const choice = result ? result.choice : null;
  return (
    <div style={{ paddingTop: 6 }}>{exLabel('COMPLETE A FRASE')}
      <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 21, fontWeight: 600, color: T.c.n950, lineHeight: 1.4, marginBottom: 22 }}>
        {ex.before}{' '}
        <span style={{ display: 'inline-block', minWidth: 80, borderBottom: `2px solid ${result != null ? (result.correct ? T.c.s700 : '#A0522D') : T.c.p700}`, color: choice != null ? (result.correct ? T.c.s700 : '#A0522D') : 'transparent', textAlign: 'center', padding: '0 6px' }}>{choice != null ? ex.options[choice] : '____'}</span>{' '}{ex.after}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {ex.options.map((opt, i) => {
          let bg = T.c.n0, border = T.c.n300, color = T.c.n950;
          if (result != null) { if (i === ex.correct) { bg = T.c.s100; border = T.c.s700; color = T.c.s700; } else if (i === choice) { bg = '#F7EBE3'; border = '#A0522D'; color = '#A0522D'; } else color = T.c.n400; }
          const anim = result == null ? 'tcStaggerIn 300ms ease-out both' : i === choice && i !== ex.correct ? 'tcShake 400ms ease' : 'none';
          return <button key={i} disabled={result != null} onClick={() => { if (result == null) onAnswer(i === ex.correct, i); }} style={{ padding: '12px 18px', borderRadius: T.r.full, background: bg, border: `1.5px solid ${border}`, cursor: result != null ? 'default' : 'pointer', fontFamily: T.font, fontSize: 15, fontWeight: 700, color, animation: anim, animationDelay: result == null ? `${i * 55}ms` : '0ms' }}>{opt}</button>;
        })}
      </div>
    </div>
  );
}
function ExBank({ ex, result, onAnswer }) {
  const all = React.useMemo(() => [...ex.words, ...(ex.bank || [])].map((w, i) => ({ w, i })).sort(() => Math.random() - 0.5), [ex]);
  const [picked, setPicked] = React.useState([]); // indices into `all`
  const used = new Set(picked);
  const full = picked.length === ex.words.length;
  React.useEffect(() => { if (full && result == null) { const assembled = picked.map(i => all[i].w); const ok = assembled.length === ex.words.length && assembled.every((w, k) => w === ex.words[k]); onAnswer(ok, assembled.join(' ')); } }, [full]); // eslint-disable-line
  return (
    <div style={{ paddingTop: 6 }}>{exLabel('MONTE A RESPOSTA')}{exQ(ex.instruction)}
      <div style={{ minHeight: 56, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, borderRadius: T.r.md, border: `1.5px dashed ${result != null ? (result.correct ? T.c.s700 : '#A0522D') : T.c.n300}`, marginBottom: 18, alignContent: 'flex-start' }}>
        {picked.map((i, k) => <button key={k} disabled={result != null} onClick={() => result == null && setPicked(p => p.filter((_, j) => j !== k))} style={{ padding: '8px 14px', borderRadius: T.r.full, background: T.c.p50, border: `1px solid ${T.c.p300}`, fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.c.p700, cursor: result != null ? 'default' : 'pointer' }}>{all[i].w}</button>)}
        {picked.length === 0 && <span style={{ ...T.t.caption, color: T.c.n400, alignSelf: 'center' }}>toque nas palavras abaixo…</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {all.map((item, i) => <button key={i} disabled={used.has(i) || result != null} onClick={() => !used.has(i) && result == null && setPicked(p => [...p, i])} style={{ padding: '10px 16px', borderRadius: T.r.full, background: used.has(i) ? T.c.n100 : T.c.n0, border: `1.5px solid ${T.c.n300}`, fontFamily: T.font, fontSize: 15, fontWeight: 700, color: used.has(i) ? T.c.n300 : T.c.n950, cursor: used.has(i) || result != null ? 'default' : 'pointer' }}>{item.w}</button>)}
      </div>
    </div>
  );
}
function ExType({ ex, result, onAnswer }) {
  const [val, setVal] = React.useState('');
  return (
    <div style={{ paddingTop: 6 }}>{exLabel('DIGITE A RESPOSTA')}{exQ(ex.prompt)}
      <input value={result != null ? (result.choice || val) : val} disabled={result != null} onChange={e => setVal(e.target.value)} placeholder="Escreva aqui…" style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: T.r.md, border: `1.5px solid ${result != null ? (result.correct ? T.c.s700 : '#A0522D') : T.c.n300}`, fontFamily: T.font, fontSize: 16, color: T.c.n950, background: T.c.n0, outline: 'none' }}/>
      {result == null && <Button variant="secondary" size="md" fullWidth onClick={() => onAnswer(norm(val) === norm(ex.answer), val)} style={{ marginTop: 12 }} disabled={!val.trim()}>Verificar</Button>}
      {result != null && !result.correct && <div style={{ marginTop: 12, ...T.t.body, color: '#A0522D' }}>Resposta certa: <strong>{ex.answer}</strong></div>}
    </div>
  );
}

// ─── Feedback + CTA ────────────────────────────────────────
function FeedbackCta({ step, answered, canAdvance, isLast, advance }) {
  const isEx = step.type === 'exercise';
  const res = isEx ? answered[step.exIdx] : null;
  const correct = res ? res.correct : null;
  const ex = isEx ? step.ex : null;
  const showFb = res != null;
  const bg = showFb ? (correct ? T.c.s100 : '#F7EBE3') : T.c.n0;
  const fg = correct ? T.c.s700 : '#A0522D';
  // Para 'type', o botão de verificar está dentro do exercício; aqui só "Continuar".
  const waitingType = isEx && ex && ex.type === 'type' && res == null;
  return (
    <div style={{ flexShrink: 0, background: bg, borderTop: `1px solid ${showFb ? 'transparent' : T.c.n100}`, transition: 'background 200ms' }}>
      {showFb && (
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0', animation: 'tcSlideUp 220ms ease-out' }}>
          <Icon name={correct ? 'celebration' : 'volunteer_activism'} size={24} color={fg} fill={1}/>
          <div style={{ ...T.t.body, color: fg, fontWeight: 600, lineHeight: 1.45 }}>{correct ? (ex.ok || 'Mandou bem!') : (ex.wrong || 'Quase! Olha de novo.')}</div>
        </div>
      )}
      <div style={{ padding: '12px 20px 24px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        {waitingType ? (
          <div style={{ textAlign: 'center', ...T.t.caption, color: T.c.n500 }}>Digite e toque em Verificar</div>
        ) : (
          <Button variant="primary" size="lg" fullWidth disabled={!canAdvance} onClick={advance} trailing={!isLast ? <Icon name="arrow_forward" size={18}/> : null}>
            {!canAdvance ? (ex && (ex.type === 'match' ? 'Associe todos os pares' : ex.type === 'bank' ? 'Monte a resposta' : 'Responda pra continuar')) : isLast ? 'Concluir lição' : 'Continuar'}
          </Button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  CONCLUSÃO
// ════════════════════════════════════════════════════════════
function TreinoCompleta({ lesson, prevState, mistakes, elapsedMs, go }) {
  const result = React.useMemo(() => {
    const st = readTreino();
    const firstTime = !st.done.includes(lesson.id);
    if (firstTime) st.done = [...st.done, lesson.id];
    const exCount = lesson.exercises.length;
    const correct = Math.max(0, exCount - mistakes);
    const perfect = mistakes === 0;
    const bonus = Math.random() < 0.18 ? (Math.random() < 0.5 ? 15 : 25) : 0;
    const xpGain = (firstTime ? 20 : 8) + correct * 5 + (perfect ? 10 : 0) + bonus;
    const gemsGain = (firstTime ? 5 : 1) + (perfect ? 5 : 0);
    const today = todayStr();
    if (st.lastDone !== today) { st.streak = computeStreakOnFinish(st); st.lastDone = today; }
    st.bestStreak = Math.max(st.bestStreak || 0, st.streak);
    st.xp += xpGain; st.dailyXp = (st.dailyXp || 0) + xpGain; st.weekXp = (st.weekXp || 0) + xpGain;
    st.gems = (st.gems || 0) + gemsGain;
    if (mistakes > 0) { st.hearts = Math.max(0, st.hearts - mistakes); st.heartsTs = st.heartsTs || Date.now(); }
    if (perfect) st.perfectCount = (st.perfectCount || 0) + 1;
    const newBadges = computeEarnedBadges(st, perfect, mistakes > 0).filter(id => !st.badges.includes(id));
    st.badges = [...st.badges, ...newBadges];
    writeTreino(st);
    fbEvent('treino_lesson_completed', { lesson_id: lesson.id, xp: xpGain, streak: st.streak, perfect });
    return { xpGain, gemsGain, perfect, correct, exCount, bonus, streak: st.streak, newBadges, goalPct: Math.min(100, Math.round((st.dailyXp / (GOALS[st.goal] || 40)) * 100)) };
  }, []); // eslint-disable-line
  const accuracy = result.exCount > 0 ? Math.round((result.correct / result.exCount) * 100) : 100;
  const secs = Math.max(1, Math.round(elapsedMs / 1000));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'auto', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 24px 8px', position: 'relative' }}>
        <Confetti/>
        <div style={{ width: 104, height: 104, borderRadius: '50%', background: result.perfect ? `linear-gradient(135deg, ${T.c.a500}, ${T.c.a700})` : `linear-gradient(135deg, ${T.c.s100}, #2E7D32)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 16px 40px rgba(216,165,32,0.35)', animation: 'tcPopIn 460ms cubic-bezier(0.2,0.8,0.2,1)' }}><Icon name={result.perfect ? 'workspace_premium' : 'celebration'} size={52} color="#fff" fill={1}/></div>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 26, fontWeight: 700, color: T.c.n950, marginBottom: 6 }}>{result.perfect ? 'Lição perfeita! 🍷' : 'Mandou bem!'}</div>
        <div style={{ ...T.t.body, color: T.c.n700, marginBottom: 18 }}>{lesson.recap}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, width: '100%', marginBottom: 16 }}>
          <StatCard icon="bolt" tone={T.c.a700} label="XP ganho" value={<CountUp to={result.xpGain} prefix="+"/>}/>
          <StatCard icon="target" tone={T.c.s700} label="Acerto" value={`${accuracy}%`}/>
          <StatCard icon="schedule" tone={T.c.p700} label="Tempo" value={`${secs}s`}/>
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#E8F7FC', borderRadius: T.r.md, marginBottom: 12 }}>
          <Gem size={24}/><div style={{ textAlign: 'left', flex: 1 }}><div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 800, color: T.c.n950 }}><CountUp to={result.gemsGain} prefix="+"/> cristais</div></div>
        </div>
        {result.bonus > 0 && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: T.c.a100, borderRadius: T.r.md, marginBottom: 12, animation: 'tcPopIn 500ms 200ms both' }}>
            <Icon name="redeem" size={26} color={T.c.a700} fill={1}/><div style={{ textAlign: 'left', flex: 1 }}><div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 800, color: T.c.n950 }}>Baú surpresa! +{result.bonus} XP</div><div style={{ ...T.t.caption, color: T.c.n600 }}>Você teve sorte hoje 🎁</div></div>
          </div>
        )}
        {result.newBadges.map(id => { const b = TREINO_BADGES.find(x => x.id === id); return <div key={id} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: T.c.a100, borderRadius: T.r.md, marginBottom: 8 }}><Icon name={b.icon} size={22} color={T.c.a700} fill={1}/><div style={{ textAlign: 'left' }}><div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 800, color: T.c.n950 }}>Nova conquista: {b.name}</div><div style={{ ...T.t.caption, color: T.c.n600 }}>{b.cond}</div></div></div>; })}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}><Pill icon="local_fire_department" tone="#E8772E">{result.streak} {result.streak === 1 ? 'dia' : 'dias'}</Pill><Pill icon="local_bar" tone={T.c.s700}>{result.goalPct}% da meta</Pill></div>
        <div style={{ background: T.c.p50, borderRadius: T.r.md, padding: 14, width: '100%', textAlign: 'left', marginBottom: 8 }}><div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 4 }}>VOCÊ SABIA?</div><div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.45 }}>{lesson.curiosity}</div></div>
        <div style={{ ...T.t.caption, color: T.c.n600, fontStyle: 'italic', marginBottom: 8 }}>{lesson.teaser}</div>
      </div>
      <div style={{ flexShrink: 0, padding: '12px 24px 24px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))', borderTop: `1px solid ${T.c.n100}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('treino-paladar')}>Continuar na trilha</Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('treino-liga')}>Ver minha liga</Button>
      </div>
    </div>
  );
}
function StatCard({ icon, tone, label, value }) {
  return <div style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}><Icon name={icon} size={20} color={tone} fill={1}/><div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 18, fontWeight: 700, color: T.c.n950 }}>{value}</div><div style={{ ...T.t.caption, color: T.c.n600, fontSize: 10 }}>{label}</div></div>;
}

// ════════════════════════════════════════════════════════════
//  LIGA
// ════════════════════════════════════════════════════════════
const LIGA_BOTS = ['Marina', 'Rafael', 'Bia', 'Téo', 'Carla', 'João', 'Duda', 'Léo', 'Nina', 'Gus', 'Sofia', 'Pedro', 'Lara'];
function TreinoLigaScreen({ go }) {
  const s = readTreino();
  const seed = (s.weekKey || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rows = React.useMemo(() => {
    const bots = LIGA_BOTS.map((name, i) => ({ name, xp: ((seed * (i + 3)) % 420) + 30 + i * 11, me: false }));
    const list = [...bots, { name: 'Você', xp: s.weekXp, me: true }];
    list.sort((a, b) => b.xp - a.xp);
    return list;
  }, [seed, s.weekXp]);
  const myRank = rows.findIndex(r => r.me) + 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n100}`, flexShrink: 0 }}>
        <button onClick={() => go('back')} aria-label="Voltar" style={btnRound}><Icon name="arrow_back" size={22} color={T.c.n950}/></button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Liga Tinto</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '16px 16px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>{['#7C5635', '#9E9E9E', '#E2B86B'].map((c, i) => <div key={i} style={{ width: i === 2 ? 40 : 32, height: i === 2 ? 40 : 32, borderRadius: '50%', background: i === 2 ? `${T.c.a500}33` : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 2 ? 1 : 0.5 }}><Icon name="emoji_events" size={i === 2 ? 24 : 18} color={c} fill={1}/></div>)}</div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 700, color: T.c.n950 }}>Liga Tinto</div>
          <div style={{ ...T.t.body, color: T.c.n600 }}>Top 7 sobem pra Liga Reserva · termina domingo</div>
        </div>
        <div style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, overflow: 'hidden' }}>
          {rows.map((r, i) => { const rank = i + 1, promo = rank <= 7, demo = rank >= rows.length - 3; return (
            <div key={r.name + i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: r.me ? T.c.p50 : 'transparent', borderBottom: i < rows.length - 1 ? `1px solid ${T.c.n100}` : 'none', borderLeft: promo ? `3px solid ${T.c.s700}` : demo ? `3px solid ${T.c.e700 || '#C0392B'}` : '3px solid transparent' }}>
              <div style={{ width: 22, textAlign: 'center', fontFamily: '"Fraunces", Georgia, serif', fontSize: 16, fontWeight: 700, color: rank <= 3 ? T.c.a700 : T.c.n500 }}>{rank}</div>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: r.me ? T.c.p700 : T.c.n200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={r.me ? 'person' : 'sentiment_satisfied'} size={18} color={r.me ? '#fff' : T.c.n600} fill={1}/></div>
              <div style={{ flex: 1, fontFamily: T.font, fontSize: 14, fontWeight: r.me ? 800 : 600, color: T.c.n950 }}>{r.name}</div>
              <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n700 }}>{r.xp} XP</div>
            </div>
          ); })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 14, ...T.t.body, color: T.c.n700 }}>Você está em <strong style={{ color: T.c.p700 }}>{myRank}º</strong>. {myRank <= 7 ? 'Tá na zona de promoção! 🔼' : 'Faça mais 1 lição pra subir.'}</div>
        <div style={{ marginTop: 16 }}><Button variant="primary" size="lg" fullWidth onClick={() => go('treino-paladar')}>Treinar pra subir</Button></div>
      </div>
    </div>
  );
}

// ─── helpers visuais ───────────────────────────────────────
function CountUp({ to, prefix = '' }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    let raf, start; const dur = 700;
    const tick = (t) => { if (!start) start = t; const p = Math.min(1, (t - start) / dur); setN(Math.round(p * to)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <React.Fragment>{prefix}{n}</React.Fragment>;
}
function Pill({ icon, tone, children }) { return <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: T.r.full, background: `${tone}1A`, color: tone, fontFamily: T.font, fontSize: 14, fontWeight: 800 }}><Icon name={icon} size={18} color={tone} fill={1}/>{children}</div>; }
function Confetti() {
  const bits = Array.from({ length: 14 });
  const colors = [T.c.a500, T.c.p700, T.c.s700, '#E8772E', T.c.a700];
  return <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 0, pointerEvents: 'none' }}>{bits.map((_, i) => <div key={i} style={{ position: 'absolute', left: `${(i * 7 + 5) % 100}%`, top: 40, width: 8, height: 8, borderRadius: i % 2 ? '50%' : 2, background: colors[i % colors.length], animation: `tcConfetti${i % 2} ${1200 + (i % 5) * 160}ms ${i * 40}ms ease-in forwards` }}/>)}</div>;
}

const TREINO_NUDGES = [
  "Tá fugindo de mim? 👀 Sua sequência de {streak} dias tá esperando.",
  "Oi, é o Tchin. 2 minutinhos hoje e o paladar agradece. 🍷",
  "Sua sequência de {streak} dias some à meia-noite. Bora salvar?",
  "Lembra do tanino? Vamos garantir que sim. Lição rápida te espera.",
  "Hoje tem vinho da semana novo na trilha. Dá uma espiada? 😏",
];

if (typeof window !== 'undefined') {
  Object.assign(window, { TreinoPaladarHome, TreinoLicaoScreen, TreinoLigaScreen, TREINO_LESSONS: LESSONS, TREINO_UNITS: UNITS, TREINO_BADGES, TREINO_NUDGES });
}

export { TreinoPaladarHome, TreinoLicaoScreen, TreinoLigaScreen, TREINO_BADGES, TREINO_NUDGES, LESSONS, UNITS, readTreino };
