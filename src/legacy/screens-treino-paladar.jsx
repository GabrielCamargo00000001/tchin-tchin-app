/* eslint-disable */
// @ts-nocheck
// ════════════════════════════════════════════════════════════════════════
// "Treine seu Paladar" — o Duolingo do vinho (de verdade).
//
// Padrões do Duolingo aplicados (pesquisa Firecrawl + Octalysis):
//  • Trilha visual (path) com unidades e nós — assinatura do Duolingo.
//  • Loop diário: lição de ~2min com EXERCÍCIOS variados (múltipla escolha,
//    verdadeiro/falso, associar) + feedback instantâneo (barra inferior).
//  • Vidas (loss aversion / escassez) — mas SEM travar o aprendizado
//    (anti-elitismo da marca: aqui ninguém trava por errar).
//  • Streak (loss aversion + sunk cost) + streak freeze + meta diária (anel).
//  • XP, níveis, badges (development/accomplishment), combo "lição perfeita".
//  • Baú de recompensa variável (unpredictability — reforço de Skinner).
//  • Liga semanal / leaderboard (social influence + zona de rebaixamento).
//  • Mascote "Tchin" (relatedness) + animações de recompensa (functional delight).
//  • Cada lição fecha com APLICAÇÃO DE COMPRA real ancorada no paladar
//    (o diferencial do estudo de mercado: dor #1 é decisão de compra).
//
// Convenções do projeto (tokens T, estilos inline, go()). Persistência em
// localStorage (sem backend).
// ════════════════════════════════════════════════════════════════════════
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_USER } from './data.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// ─── Store (localStorage) ──────────────────────────────────
const TREINO_KEY = 'tc.treino.v2';
const MAX_HEARTS = 5;
const HEART_REGEN_MS = 20 * 60 * 1000; // 1 vida a cada 20 min (demo)
const GOALS = { leve: 20, regular: 40, serio: 60, intenso: 100 };

function defaultTreino() {
  return {
    xp: 0, streak: 0, bestStreak: 0, lastDone: null, done: [], badges: [],
    freezes: 1, hearts: MAX_HEARTS, heartsTs: Date.now(),
    goal: 'regular', dailyXp: 0, dailyDate: null,
    weekXp: 0, weekKey: null, perfectCount: 0, onboarded: false,
  };
}
function readTreino() {
  let s;
  try { s = Object.assign(defaultTreino(), JSON.parse(window.localStorage.getItem(TREINO_KEY) || 'null')); }
  catch (e) { s = defaultTreino(); }
  // Regeneração de vidas
  if (s.hearts < MAX_HEARTS) {
    const elapsed = Date.now() - (s.heartsTs || Date.now());
    const regen = Math.floor(elapsed / HEART_REGEN_MS);
    if (regen > 0) {
      s.hearts = Math.min(MAX_HEARTS, s.hearts + regen);
      s.heartsTs = s.hearts >= MAX_HEARTS ? Date.now() : (s.heartsTs + regen * HEART_REGEN_MS);
    }
  }
  // Reset de meta diária
  if (s.dailyDate !== todayStr()) { s.dailyDate = todayStr(); s.dailyXp = 0; }
  // Reset semanal da liga
  const wk = weekKey();
  if (s.weekKey !== wk) { s.weekKey = wk; s.weekXp = 0; }
  return s;
}
function writeTreino(s) { try { window.localStorage.setItem(TREINO_KEY, JSON.stringify(s)); } catch (e) {} }
function resetTreino() { try { window.localStorage.removeItem(TREINO_KEY); } catch (e) {} }

function dayStr(d) { return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function todayStr() { return dayStr(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }
function weekKey() { const d = new Date(); const oneJan = new Date(d.getFullYear(), 0, 1); const wk = Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7); return `${d.getFullYear()}-W${wk}`; }
function heartsEtaMin(s) { if (s.hearts >= MAX_HEARTS) return 0; const left = HEART_REGEN_MS - ((Date.now() - (s.heartsTs || Date.now())) % HEART_REGEN_MS); return Math.max(1, Math.ceil(left / 60000)); }

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

// ─── Conteúdo — unidades + lições com exercícios variados ──
const LESSONS = [
  // ───── Unidade 1: Fundamentos do Paladar ─────
  {
    id: 'licao-01-tanino', unit: 'u1', grape: null, title: "Por que o vinho 'seca' a boca?",
    hook: "Já sentiu a boca 'amarrar' depois de um gole? Tem nome — e tem motivo.",
    concept: "Isso é o tanino: vem da casca e da semente da uva. Dá aquela sensação de 'secar' a boca, parecida com chá preto forte ou caqui verde.",
    exercises: [
      { type: 'mc', q: "O que causa a sensação de 'secar' a boca?", options: ['O álcool', 'O tanino', 'O açúcar'], correct: 1, ok: "Isso! Tanino é o que 'amarra' a boca.", wrong: "Quase! É o tanino — vem da casca e da semente." },
      { type: 'tf', statement: "Quanto mais tanino, mais o vinho 'amarra' a boca.", answer: true, ok: "Exato. Mais tanino = mais aquela sensação de secar.", wrong: "Na real é verdade: mais tanino = mais 'amarra'." },
    ],
    application: "No seu {perfil}, se quiser tintos mais macios procure Merlot ou Pinot Noir. Se curte estrutura, Cabernet Sauvignon é seu amigo.",
    recap: "Tanino = sensação de amarrar. Quanto mais, mais 'seco' parece.",
    curiosity: "Vinhos com muito tanino costumam melhorar com os anos — o tanino 'suaviza' com o tempo.",
    teaser: "A seguir: o que faz um vinho ter 'corpo'.",
  },
  {
    id: 'licao-02-corpo', unit: 'u1', grape: null, title: "O que é 'corpo' no vinho?",
    hook: "Dizem que um vinho é 'leve' ou 'encorpado'. Mas o que isso quer dizer?",
    concept: "Corpo é o 'peso' do vinho na boca — pense em água (leve), leite (médio) e creme (encorpado). Álcool e tanino dão essa sensação.",
    exercises: [
      { type: 'mc', q: "Um vinho 'encorpado' lembra a textura de…", options: ['Água', 'Creme de leite', 'Chá gelado'], correct: 1, ok: "Isso! Encorpado = mais 'denso' na boca.", wrong: "É o creme — encorpado é mais 'denso' na boca." },
      { type: 'match', instruction: "Associe o peso à textura:", pairs: [{ a: 'Leve', b: 'Água' }, { a: 'Médio', b: 'Leite' }, { a: 'Encorpado', b: 'Creme' }], ok: "Boa! Peso é tudo questão de densidade na boca." },
    ],
    application: "Pra {perfil}: comida pesada (carne, queijos) pede vinho encorpado. Num happy hour leve, um tinto leve ou branco cai melhor.",
    recap: "Corpo = peso na boca. Leve, médio ou encorpado.",
    curiosity: "Vinhos de climas quentes costumam ser mais encorpados (mais açúcar na uva vira mais álcool).",
    teaser: "A seguir: seco x suave, sem mito.",
  },
  {
    id: 'licao-03-docura', unit: 'u1', grape: null, title: "Seco ou suave: qual é o seu?",
    hook: "Tem gente que torce o nariz pra 'vinho suave'. A real? É só uma questão de gosto.",
    concept: "Seco = pouco ou nenhum açúcar. Suave = mais açúcar, mais doce. Nenhum é 'melhor' — suave costuma ser uma ótima porta de entrada.",
    exercises: [
      { type: 'mc', q: "Vinho 'seco' quer dizer que ele…", options: ['Tem pouco açúcar', 'Seca a garganta', 'É sem álcool'], correct: 0, ok: "Isso! Seco = pouco açúcar.", wrong: "Quase! Seco = pouco açúcar (nada a ver com secar a garganta)." },
      { type: 'tf', statement: "Gostar de vinho suave é 'errado' ou coisa de iniciante.", answer: false, ok: "Exato — gosto é gosto. Suave é tão válido quanto seco.", wrong: "Aqui a gente discorda: gosto é gosto, suave é válido sim." },
    ],
    application: "Se você ({perfil}) curte café com leite e chocolate ao leite, provavelmente vai gostar de vinhos mais suaves ou frutados — e tá tudo certo nisso.",
    recap: "Seco = pouco açúcar. Suave = mais doce. Gosto é gosto.",
    curiosity: "Espumante 'brut' é bem seco; já o 'demi-sec' é levemente doce.",
    teaser: "A seguir: por que vinho 'dá água na boca'.",
  },
  {
    id: 'licao-04-acidez', unit: 'u1', grape: null, title: "Por que vinho 'dá água na boca'?",
    hook: "Aquele friozinho que faz salivar… é a acidez trabalhando.",
    concept: "Acidez é o que deixa o vinho 'vivo' e refrescante — como morder um limão faz salivar. É ela que faz o vinho combinar tão bem com comida.",
    exercises: [
      { type: 'mc', q: "A acidez no vinho serve principalmente pra…", options: ['Deixar mais doce', 'Refrescar e harmonizar', 'Aumentar o álcool'], correct: 1, ok: "Isso! Acidez refresca e casa com comida.", wrong: "Na real, a acidez refresca e ajuda a harmonizar." },
      { type: 'tf', statement: "Brancos costumam ter mais acidez que tintos.", answer: true, ok: "Verdade — por isso refrescam tanto no calor.", wrong: "É verdade sim: brancos costumam ser mais ácidos." },
    ],
    application: "Pra {perfil}: vai comer algo gorduroso (pizza, fritura)? Um vinho com boa acidez 'limpa' a boca entre as garfadas.",
    recap: "Acidez = frescor + parceira da comida.",
    curiosity: "É a acidez que faz o espumante ser tão refrescante — junto com as bolhas.",
    teaser: "Unidade fechada! Bora pras uvas.",
  },
  // ───── Unidade 2: Uvas que você vai amar ─────
  {
    id: 'licao-05-cabernet', unit: 'u2', grape: 'Cabernet Sauvignon', title: "Cabernet Sauvignon: a porta de entrada",
    hook: "É a uva tinta mais famosa do mundo — e provavelmente a primeira que você vai amar.",
    concept: "Cabernet Sauvignon faz tintos encorpados, com bom tanino e sabor de frutas escuras (cassis, ameixa). Estrutura sem complicar.",
    exercises: [
      { type: 'mc', q: "Cabernet Sauvignon costuma ser um tinto…", options: ['Leve e doce', 'Encorpado e estruturado', 'Sem tanino'], correct: 1, ok: "Isso! Encorpado e com boa estrutura.", wrong: "Quase! Cabernet costuma ser encorpado e estruturado." },
      { type: 'tf', statement: "Cabernet combina bem com carne na brasa.", answer: true, ok: "Demais — estrutura do vinho aguenta a carne.", wrong: "Combina sim: a estrutura do Cabernet aguenta a carne." },
    ],
    application: "Pra {perfil}: um Cabernet chileno ou brasileiro custo-benefício é aposta segura pra carne na brasa. Procure 'Cabernet Sauvignon' no rótulo.",
    recap: "Cabernet = encorpado, tânico, frutas escuras. Aposta segura.",
    curiosity: "Cabernet é tão adaptável que cresce bem em quase todo país produtor de vinho.",
    teaser: "A seguir: a queridinha argentina.",
  },
  {
    id: 'licao-06-malbec', unit: 'u2', grape: 'Malbec', title: "Malbec: a queridinha argentina",
    hook: "Se Cabernet é o clássico, Malbec é o abraço macio.",
    concept: "Malbec faz tintos frutados e macios, com taninos mais suaves. Fácil de gostar, ótimo com churrasco. Mendoza (Argentina) é a casa dela.",
    exercises: [
      { type: 'mc', q: "Comparado ao Cabernet, o Malbec costuma ser…", options: ['Mais macio e frutado', 'Mais ácido e leve', 'Mais amargo'], correct: 0, ok: "Isso! Malbec é mais macio e frutado.", wrong: "Na real, o Malbec costuma ser mais macio e frutado." },
      { type: 'match', instruction: "Associe a uva ao apelido:", pairs: [{ a: 'Cabernet', b: 'O clássico' }, { a: 'Malbec', b: 'O abraço macio' }], ok: "Boa! Já dá pra escolher por estilo." },
    ],
    application: "Pra {perfil}: quer agradar geral num churrasco? Um Malbec argentino de Mendoza raramente decepciona.",
    recap: "Malbec = macio, frutado, parceiro do churrasco.",
    curiosity: "A Argentina transformou o Malbec (uva de origem francesa) no seu maior símbolo.",
    teaser: "A seguir: o branco mais popular.",
  },
  {
    id: 'licao-07-chardonnay', unit: 'u2', grape: 'Chardonnay', title: "Chardonnay: o branco camaleão",
    hook: "Um branco que pode ser leve e cítrico — ou cremoso e amanteigado. Como assim?",
    concept: "Chardonnay muda de cara conforme é feito: sem madeira fica fresco e cítrico; com madeira (carvalho) fica cremoso, com notas de baunilha e manteiga.",
    exercises: [
      { type: 'mc', q: "O que deixa um Chardonnay mais cremoso e amanteigado?", options: ['Mais açúcar', 'Passagem por madeira (carvalho)', 'Mais gelo'], correct: 1, ok: "Isso! A madeira dá cremosidade e baunilha.", wrong: "É a madeira (carvalho) que dá essa cremosidade." },
      { type: 'tf', statement: "Todo Chardonnay tem o mesmo sabor.", answer: false, ok: "Exato — é um camaleão, depende de como é feito.", wrong: "Na verdade não: o Chardonnay muda muito conforme é feito." },
    ],
    application: "Pra {perfil}: peixe e frango pedem um Chardonnay sem madeira (fresco). Risoto ou massa cremosa? Um com madeira combina lindamente.",
    recap: "Chardonnay = camaleão. Fresco sem madeira, cremoso com madeira.",
    curiosity: "Champagne de verdade leva Chardonnay na receita — sim, o mesmo da uva.",
    teaser: "Unidade fechada! Agora: comprar sem errar.",
  },
  // ───── Unidade 3: Comprar sem errar ─────
  {
    id: 'licao-08-rotulo', unit: 'u3', grape: null, title: "Decifrando o rótulo em 10 segundos",
    hook: "Tanta informação na garrafa… mas só 3 coisas importam de verdade na hora de escolher.",
    concept: "Olhe: (1) a uva ou o tipo (Cabernet, Malbec…), (2) o país/região e (3) a safra (ano). Com isso você já sabe o estilo antes de abrir.",
    exercises: [
      { type: 'mc', q: "Qual destes NÃO é essencial pra prever o estilo do vinho?", options: ['A uva', 'A safra (ano)', 'O desenho do rótulo'], correct: 2, ok: "Isso! O desenho é marketing — uva, região e safra é que contam.", wrong: "O desenho é só marketing — o que conta é uva, região e safra." },
      { type: 'tf', statement: "Saber a uva já te dá uma boa pista do estilo.", answer: true, ok: "Verdade — uva é o atalho nº1 pra prever o gosto.", wrong: "É verdade: a uva é o melhor atalho pra prever o estilo." },
    ],
    application: "Pra {perfil}: na próxima compra, leia uva + país no rótulo e use o Scanner do Tchin pra ver o match com o seu paladar antes de pagar.",
    recap: "Rótulo = uva + região + safra. O resto é embalagem.",
    curiosity: "'Reserva' não tem regra única no mundo todo — em alguns países significa mais tempo de guarda, em outros é só marketing.",
    teaser: "A seguir: o preço é justo?",
  },
  {
    id: 'licao-09-preco', unit: 'u3', grape: null, title: "O preço é justo?",
    hook: "Vinho caro é sempre melhor? E o de R$ 30 do mercado, presta?",
    concept: "Preço ≠ qualidade direta. Acima de ~R$ 40 a curva 'achata': dobrar o preço quase nunca dobra o prazer. O segredo é achar o vinho certo pro SEU gosto, não o mais caro.",
    exercises: [
      { type: 'mc', q: "Sobre preço e qualidade, o mais verdadeiro é:", options: ['Mais caro é sempre melhor', 'Acima de certo ponto, preço não garante mais prazer', 'Barato é sempre ruim'], correct: 1, ok: "Isso! O ponto certo é o seu gosto, não o preço.", wrong: "A real: passado um ponto, preço não garante mais prazer." },
      { type: 'tf', statement: "Existe vinho bom e honesto na faixa de R$ 30–50.", answer: true, ok: "Com certeza — e o Tchin te ajuda a achar.", wrong: "Existe sim! Tem muita joia entre R$ 30 e 50." },
    ],
    application: "Pra {perfil}: defina sua faixa (ex.: até R$ 60) e filtre por ela no Tchin. Gastar bem é achar o match certo dentro do seu limite.",
    recap: "Preço não é qualidade. Ache o match certo pro seu gosto e bolso.",
    curiosity: "Em testes às cegas, até experts erram a faixa de preço — prova de que rótulo e valor mexem com a cabeça.",
    teaser: "Você fechou a trilha dos Fundamentos! Novos módulos chegam em breve.",
  },
];

const UNITS = [
  { id: 'u1', n: 'UNIDADE 1', title: 'Fundamentos do Paladar', subtitle: 'Tanino, corpo, doçura e acidez sem mistério', color: T.c.p700, icon: 'science' },
  { id: 'u2', n: 'UNIDADE 2', title: 'Uvas que você vai amar', subtitle: 'As uvas que abrem 70% das cartas', color: '#8A4A2A', icon: 'eco' },
  { id: 'u3', n: 'UNIDADE 3', title: 'Comprar sem errar', subtitle: 'Rótulo e preço: decida com confiança', color: '#2E5734', icon: 'shopping_basket' },
];
function lessonsOfUnit(uid) { return LESSONS.filter(l => l.unit === uid); }

function perfilLabel() {
  const p = (typeof window !== 'undefined' && window.__tcUserPaladar) || (typeof MOCK_USER !== 'undefined' && MOCK_USER.paladar);
  if (!p) return 'seu paladar';
  if (p.docura != null && p.docura <= 35) return 'paladar mais seco';
  if (p.docura != null && p.docura >= 60) return 'paladar mais suave';
  return 'seu paladar';
}

function computeStreakOnFinish(st) {
  return st.lastDone === todayStr() ? st.streak : (st.lastDone === yesterdayStr() ? st.streak + 1 : 1);
}
function computeEarnedBadges(after, perfect, anyWrong) {
  const grapes = LESSONS.filter(l => l.grape && after.done.includes(l.id)).length;
  const earned = [];
  if (after.done.length >= 1) earned.push('primeira-gota');
  if (after.done.length >= 5) earned.push('pegando-o-ritmo');
  if (after.streak >= 7) earned.push('semana-cheia');
  if (grapes >= 3) earned.push('explorador-de-uvas');
  if (perfect) earned.push('licao-perfeita');
  if (anyWrong) earned.push('sem-medo-de-errar');
  return earned;
}

// ════════════════════════════════════════════════════════════
//  MASCOTE — "Tchin", duas taças que brindam (relatedness)
// ════════════════════════════════════════════════════════════
function TchinDuo({ size = 56, mood = 'happy' }) {
  const eye = mood === 'sad' ? 6 : 5;
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
      {/* rostinho */}
      <circle cx="27" cy="22" r="1.5" fill="#fff"/>
      <circle cx="37" cy="22" r="1.5" fill="#fff"/>
      {/* brilho/brinde */}
      <g fill={T.c.a500}>
        <path d="M31 8 L33 12 L37 14 L33 16 L31 20 L29 16 L25 14 L29 12 Z"/>
      </g>
    </svg>
  );
}

// ─── HUD (streak · vidas · XP · meta) ──────────────────────
function HudStat({ icon, color, value, onClick, ariaLabel }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{
      display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: T.r.full,
      background: 'transparent', border: 'none', cursor: onClick ? 'pointer' : 'default', fontFamily: T.font,
    }}>
      <Icon name={icon} size={20} color={color} fill={1}/>
      <span style={{ fontSize: 15, fontWeight: 800, color: T.c.n950 }}>{value}</span>
    </button>
  );
}
function GoalRing({ pct, size = 40 }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Meta diária ${pct}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.c.n200} strokeWidth="5"/>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.c.s700} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, pct / 100))} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 500ms' }}/>
      <g transform={`translate(${size / 2 - 7}, ${size / 2 - 7})`}>
        <Icon name={pct >= 100 ? 'check' : 'local_bar'} size={14} color={pct >= 100 ? T.c.s700 : T.c.n600} fill={1}/>
      </g>
    </svg>
  );
}

// ════════════════════════════════════════════════════════════
//  HOME — a TRILHA (path)
// ════════════════════════════════════════════════════════════
function TreinoPaladarHome({ go }) {
  const [s, setS] = React.useState(readTreino);
  const [sheet, setSheet] = React.useState(null); // 'streak' | 'hearts' | 'goal' | null
  const [showIntro, setShowIntro] = React.useState(() => !s.onboarded);
  React.useEffect(() => { fbEvent('treino_home_viewed', { streak: s.streak, xp: s.xp }); }, []); // eslint-disable-line

  const lvl = levelFor(s.xp);
  const next = nextLevelFor(s.xp);
  const goalXp = GOALS[s.goal] || 40;
  const goalPct = Math.min(100, Math.round((s.dailyXp / goalXp) * 100));
  const doneToday = s.lastDone === todayStr();
  const nextIdx = LESSONS.findIndex(l => !s.done.includes(l.id));
  const currentId = nextIdx >= 0 ? LESSONS[nextIdx].id : null;
  const allDone = nextIdx < 0;
  const social = 8000 + (new Date().getDate() * 137) % 900;
  const finishIntro = (startLesson) => {
    const st = readTreino(); st.onboarded = true; writeTreino(st);
    setShowIntro(false);
    if (startLesson && currentId) { fbEvent('treino_intro_start', { lesson_id: currentId }); go('treino-licao', { lessonId: currentId }); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      {/* Top bar + HUD */}
      <div style={{ flexShrink: 0, background: T.c.n0, borderBottom: `1px solid ${T.c.n100}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 6px' }}>
          <button onClick={() => go('back')} aria-label="Voltar" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="arrow_back" size={22} color={T.c.n950}/>
          </button>
          <button onClick={() => setShowIntro(true)} aria-label="Como funciona" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="help" size={22} color={T.c.n500}/>
          </button>
          <div style={{ flex: 1 }}/>
          <HudStat icon="local_fire_department" color={s.streak > 0 ? '#E8772E' : T.c.n400} value={s.streak} onClick={() => setSheet('streak')} ariaLabel="Sequência"/>
          <HudStat icon="favorite" color={T.c.e700 || '#C0392B'} value={s.hearts} onClick={() => setSheet('hearts')} ariaLabel="Vidas"/>
          <HudStat icon="bolt" color={T.c.a700} value={s.xp} ariaLabel="XP total"/>
          <button onClick={() => setSheet('goal')} aria-label="Meta diária" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 6px 0 2px' }}>
            <GoalRing pct={goalPct}/>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 36px', minHeight: 0 }}>
        {/* Banner do nível + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, padding: 14, marginBottom: 8 }}>
          <TchinDuo size={48}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.overline, color: T.c.a700 }}>NÍVEL {lvl.lvl} · {lvl.title}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.c.n700 }}>
              {goalPct >= 100 ? 'Meta de hoje batida! 🎉' : doneToday ? `Faltam ${Math.max(0, goalXp - s.dailyXp)} XP pra meta de hoje.` : 'Bora treinar 2 minutinhos hoje?'}
            </div>
          </div>
        </div>

        {/* Liga (atalho) */}
        <button onClick={() => go('treino-liga')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 18,
          background: 'linear-gradient(135deg, #4A1F24, #722F37)', border: 'none', borderRadius: T.r.lg, cursor: 'pointer', textAlign: 'left',
        }}>
          <Icon name="emoji_events" size={26} color={T.c.a500} fill={1}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 800, color: '#fff' }}>Liga Tinto</div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Você tem {s.weekXp} XP esta semana · veja o ranking</div>
          </div>
          <Icon name="chevron_right" size={20} color="rgba(255,255,255,0.8)"/>
        </button>

        {/* ── A TRILHA ── */}
        {UNITS.map((u) => {
          const ls = lessonsOfUnit(u.id);
          return (
            <div key={u.id} style={{ marginBottom: 12 }}>
              {/* Cabeçalho da unidade */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: u.color, borderRadius: T.r.lg, padding: '14px 16px', marginBottom: 8, boxShadow: T.el ? T.el[2] : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', color: 'rgba(255,255,255,0.75)' }}>{u.n}</div>
                  <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>{u.title}</div>
                  <div style={{ fontFamily: T.font, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{u.subtitle}</div>
                </div>
                <Icon name={u.icon} size={30} color="rgba(255,255,255,0.9)" fill={1}/>
              </div>

              {/* Nós da unidade (caminho serpenteado) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 0' }}>
                {ls.map((l) => {
                  const idxAll = LESSONS.indexOf(l);
                  const completed = s.done.includes(l.id);
                  const isCurrent = l.id === currentId;
                  const locked = !completed && !isCurrent;
                  const offset = [0, 56, 80, 56, 0, -56, -80, -56][idxAll % 8]; // serpenteia
                  return (
                    <div key={l.id} style={{ transform: `translateX(${offset}px)`, transition: 'transform 200ms', position: 'relative' }}>
                      <PathNode lesson={l} state={completed ? 'done' : isCurrent ? 'current' : 'locked'}
                        onStart={() => { fbEvent('treino_lesson_cta', { lesson_id: l.id }); go('treino-licao', { lessonId: l.id }); }}
                        onLockedTap={() => go('toast', { kind: 'info', message: completed ? '' : 'Conclua a lição anterior pra liberar esta.' })}
                        doneToday={completed && doneToday}/>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {allDone && (
          <div style={{ textAlign: 'center', background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, padding: 20, margin: '8px 0 18px' }}>
            <Icon name="emoji_events" size={40} color={T.c.a700} fill={1}/>
            <div style={{ ...T.t.h3, color: T.c.n950, marginTop: 8 }}>Você fechou a trilha! 🎉</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginTop: 4 }}>Novos módulos chegam em breve. Volte pra manter a sequência!</div>
          </div>
        )}

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...T.t.caption, color: T.c.n600, margin: '4px 0 18px' }}>
          <Icon name="group" size={16} color={T.c.n600}/>
          {social.toLocaleString('pt-BR')} pessoas treinaram o paladar hoje
        </div>

        {/* Badges */}
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
          <button onClick={() => { resetTreino(); setS(readTreino()); go('toast', { kind: 'info', message: 'Progresso de treino reiniciado (demo).' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.c.n400, fontFamily: T.font, fontSize: 11, textDecoration: 'underline' }}>
            Reiniciar progresso (demo)
          </button>
        </div>
      </div>

      {sheet && <TreinoSheet kind={sheet} s={s} onClose={() => setSheet(null)} onGoal={(g) => { const st = readTreino(); st.goal = g; writeTreino(st); setS(readTreino()); }} go={go}/>}
      {showIntro && <TreinoOnboarding onClose={() => finishIntro(false)} onStart={() => finishIntro(true)} hasCurrent={!!currentId}/>}
    </div>
  );
}

// ─── Nó da trilha ──────────────────────────────────────────
function PathNode({ lesson, state, onStart, onLockedTap, doneToday }) {
  const isCurrent = state === 'current';
  const isDone = state === 'done';
  const bg = isDone ? T.c.a500 : isCurrent ? T.c.p700 : T.c.n200;
  const ring = isDone ? T.c.a700 : isCurrent ? T.c.p900 : T.c.n300;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {isCurrent && (
        <div style={{ background: T.c.p700, color: '#fff', fontFamily: T.font, fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: T.r.full, animation: 'tcBreath 2s ease-in-out infinite' }}>
          {doneToday ? 'DE NOVO' : 'COMEÇAR'}
        </div>
      )}
      <button
        onClick={state === 'locked' ? onLockedTap : onStart}
        aria-label={lesson.title}
        style={{
          width: 64, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: bg, boxShadow: `0 6px 0 ${ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 120ms', transform: isCurrent ? 'scale(1.04)' : 'scale(1)',
        }}>
        <Icon name={isDone ? 'check' : isCurrent ? (lesson.grape ? 'eco' : 'play_arrow') : 'lock'} size={28} color={state === 'locked' ? T.c.n500 : '#fff'} fill={1} weight={700}/>
      </button>
      <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: state === 'locked' ? T.c.n400 : T.c.n800, textAlign: 'center', maxWidth: 110, lineHeight: 1.15 }}>
        {lesson.title}
      </div>
    </div>
  );
}

// ─── Bottom sheet (streak / vidas / meta) ──────────────────
function TreinoSheet({ kind, s, onClose, onGoal, go }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(15,15,15,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', animation: 'tcFadeIn 200ms ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '20px 20px 28px', animation: 'tcSlideUp 280ms cubic-bezier(0.2,0.8,0.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: T.c.n300, margin: '0 auto 16px' }}/>
        {kind === 'streak' && (
          <div style={{ textAlign: 'center' }}>
            <Icon name="local_fire_department" size={48} color={s.streak > 0 ? '#E8772E' : T.c.n400} fill={1}/>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 28, fontWeight: 700, color: T.c.n950, marginTop: 4 }}>{s.streak} {s.streak === 1 ? 'dia' : 'dias'}</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>de sequência{s.bestStreak > s.streak ? ` · recorde: ${s.bestStreak}` : ''}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
                const active = i < (s.streak % 7 || (s.streak > 0 ? 7 : 0));
                return (
                  <div key={i} style={{ width: 30, textAlign: 'center' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: active ? 'rgba(232,119,46,0.18)' : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2px' }}>
                      <Icon name="local_fire_department" size={16} color={active ? '#E8772E' : T.c.n300} fill={1}/>
                    </div>
                    <span style={{ fontSize: 10, color: T.c.n500 }}>{d}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ background: T.c.p50, borderRadius: T.r.md, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="ac_unit" size={22} color={T.c.p700} fill={1}/>
              <div style={{ flex: 1, textAlign: 'left', ...T.t.caption, color: T.c.n800 }}>
                Você tem <strong>{s.freezes}</strong> congelamento{s.freezes === 1 ? '' : 's'} de sequência — se faltar um dia, a gente segura pra você.
              </div>
            </div>
          </div>
        )}
        {kind === 'hearts' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <Icon key={i} name="favorite" size={28} color={i < s.hearts ? (T.c.e700 || '#C0392B') : T.c.n200} fill={1}/>
              ))}
            </div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, fontWeight: 700, color: T.c.n950 }}>{s.hearts} de {MAX_HEARTS} vidas</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginTop: 4, marginBottom: 8 }}>
              {s.hearts >= MAX_HEARTS ? 'Vidas cheias! Bora treinar.' : `Mais 1 vida em ~${heartsEtaMin(s)} min.`}
            </div>
            <div style={{ ...T.t.caption, color: T.c.n500, fontStyle: 'italic' }}>Aqui ninguém trava por errar — vidas são só um empurrãozinho pra ir com calma.</div>
          </div>
        )}
        {kind === 'goal' && (
          <div>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Sua meta diária</div>
            <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 14 }}>Quanto você quer treinar por dia? Pode mudar quando quiser.</div>
            {[['leve', 'Leve', '1 lição · ~2 min'], ['regular', 'Regular', '2 lições · ~4 min'], ['serio', 'Sério', '3 lições · ~6 min'], ['intenso', 'Intenso', '5 lições · ~10 min']].map(([id, t, sub]) => (
              <button key={id} onClick={() => { onGoal(id); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8, textAlign: 'left',
                background: s.goal === id ? T.c.p50 : T.c.n0, border: `1.5px solid ${s.goal === id ? T.c.p700 : T.c.n200}`, borderRadius: T.r.md, cursor: 'pointer', fontFamily: T.font,
              }}>
                <Icon name="local_bar" size={22} color={s.goal === id ? T.c.p700 : T.c.n500} fill={1}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950 }}>{t} · {GOALS[id]} XP</div>
                  <div style={{ ...T.t.caption, color: T.c.n600 }}>{sub}</div>
                </div>
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
//  LIÇÃO — player com exercícios variados
// ════════════════════════════════════════════════════════════
function TreinoLicaoScreen({ go, params }) {
  const lesson = React.useMemo(() => {
    const id = params && params.lessonId;
    return LESSONS.find(l => l.id === id) || LESSONS[0];
  }, [params]);

  // Sequência de passos: conceito → exercícios → aplicação
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
  const [answered, setAnswered] = React.useState({}); // exIdx -> { correct }
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

  if (done) {
    return <TreinoCompleta lesson={lesson} prevState={prevState} mistakes={mistakes} elapsedMs={Date.now() - startRef.current} go={go}/>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden', minHeight: 0 }}>
      {/* Topo: fechar + progresso + vidas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 8px', flexShrink: 0 }}>
        <button onClick={() => go('back')} aria-label="Fechar" style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={22} color={T.c.n800}/>
        </button>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: T.c.n200, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((idx + 1) / steps.length) * 100}%`, background: `linear-gradient(90deg, ${T.c.a500}, ${T.c.a700})`, borderRadius: 6, transition: 'width 300ms' }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Icon name="favorite" size={20} color={T.c.e700 || '#C0392B'} fill={1}/>
          <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.c.n950 }}>{hearts}</span>
        </div>
      </div>

      {/* Corpo do passo */}
      <div key={idx} style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '8px 24px 16px', display: 'flex', flexDirection: 'column', animation: 'tcPushIn 260ms ease-out' }}>
        {step.type === 'concept' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><TchinDuo size={72}/></div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 24, fontWeight: 600, color: T.c.n950, lineHeight: 1.2, marginBottom: 12, textWrap: 'balance' }}>{lesson.title}</div>
            <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.55, marginBottom: 14 }}>{lesson.hook}</div>
            <div style={{ background: T.c.a100, borderRadius: T.r.md, padding: 14, display: 'flex', gap: 10 }}>
              <Icon name="lightbulb" size={22} color={T.c.a700} fill={1}/>
              <div style={{ ...T.t.body, color: T.c.n900, lineHeight: 1.5 }}>{lesson.concept}</div>
            </div>
          </div>
        )}
        {step.type === 'exercise' && (
          <ExerciseView ex={step.ex} result={answered[step.exIdx]} onAnswer={onAnswer}/>
        )}
        {step.type === 'application' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${T.c.p700}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Icon name="shopping_basket" size={44} color={T.c.p700} fill={1}/>
            </div>
            <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 8 }}>NA SUA PRÓXIMA COMPRA</div>
            <div style={{ ...T.t.bodyLg, color: T.c.n950, lineHeight: 1.55 }}>{lesson.application.replace('{perfil}', perfilLabel())}</div>
          </div>
        )}
      </div>

      {/* Feedback + CTA */}
      <FeedbackCta step={step} answered={answered} canAdvance={canAdvance} isLast={idx === steps.length - 1} advance={advance}/>
    </div>
  );
}

// ─── Render de exercício por tipo ──────────────────────────
function ExerciseView({ ex, result, onAnswer }) {
  if (ex.type === 'mc') return <ExerciseMC ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'tf') return <ExerciseTF ex={ex} result={result} onAnswer={onAnswer}/>;
  if (ex.type === 'match') return <ExerciseMatch ex={ex} result={result} onAnswer={onAnswer}/>;
  return null;
}

function ExerciseMC({ ex, result, onAnswer }) {
  const choice = result ? result.choice : null;
  return (
    <div style={{ paddingTop: 6 }}>
      <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 10 }}>ESCOLHA A CERTA</div>
      <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: T.c.n950, lineHeight: 1.25, marginBottom: 18 }}>{ex.q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ex.options.map((opt, i) => {
          let bg = T.c.n0, border = T.c.n300, color = T.c.n950, icon = null;
          if (result != null) {
            if (i === ex.correct) { bg = T.c.s100; border = T.c.s700; color = T.c.s700; icon = 'check_circle'; }
            else if (i === choice) { bg = '#F7EBE3'; border = '#A0522D'; color = '#A0522D'; icon = 'cancel'; }
            else { color = T.c.n400; }
          }
          return (
            <button key={i} disabled={result != null} onClick={() => { if (result == null) onAnswer(i === ex.correct, i); }} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 15, textAlign: 'left',
              background: bg, border: `1.5px solid ${border}`, borderRadius: T.r.md,
              cursor: result != null ? 'default' : 'pointer', fontFamily: T.font, fontSize: 15, fontWeight: 600, color,
            }}>
              <span style={{ flex: 1 }}>{opt}</span>
              {icon && <Icon name={icon} size={20} color={color} fill={1}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseTF({ ex, result, onAnswer }) {
  const choice = result ? result.choice : null;
  const opt = (val, label, icon) => {
    let bg = T.c.n0, border = T.c.n300, color = T.c.n950;
    if (result != null) {
      if (val === ex.answer) { bg = T.c.s100; border = T.c.s700; color = T.c.s700; }
      else if (val === choice) { bg = '#F7EBE3'; border = '#A0522D'; color = '#A0522D'; }
      else { color = T.c.n400; }
    }
    return (
      <button disabled={result != null} onClick={() => { if (result == null) onAnswer(val === ex.answer, val); }} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 12px',
        background: bg, border: `1.5px solid ${border}`, borderRadius: T.r.lg, cursor: result != null ? 'default' : 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 15, color,
      }}>
        <Icon name={icon} size={30} color={color} fill={1}/>{label}
      </button>
    );
  };
  return (
    <div style={{ paddingTop: 6 }}>
      <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 10 }}>VERDADEIRO OU FALSO?</div>
      <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: T.c.n950, lineHeight: 1.3, marginBottom: 22 }}>{ex.statement}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {opt(true, 'Verdadeiro', 'thumb_up')}
        {opt(false, 'Falso', 'thumb_down')}
      </div>
    </div>
  );
}

function ExerciseMatch({ ex, result, onAnswer }) {
  const [left, setLeft] = React.useState(null);
  const [paired, setPaired] = React.useState({}); // aIndex -> bIndex
  const rights = React.useMemo(() => ex.pairs.map((p, i) => i).sort(() => Math.random() - 0.5), [ex]);
  const allDone = Object.keys(paired).length === ex.pairs.length;
  React.useEffect(() => { if (allDone && result == null) onAnswer(true); }, [allDone]); // eslint-disable-line
  const tapRight = (bi) => {
    if (left == null || result != null) return;
    if (bi === left) { // par correto (mesmo índice)
      setPaired(p => ({ ...p, [left]: bi })); setLeft(null);
    } else { setLeft(null); } // erro silencioso: só não pareia
  };
  return (
    <div style={{ paddingTop: 6 }}>
      <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 10 }}>ASSOCIE OS PARES</div>
      <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 19, fontWeight: 600, color: T.c.n950, lineHeight: 1.25, marginBottom: 18 }}>{ex.instruction}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ex.pairs.map((p, ai) => {
            const isPaired = paired[ai] != null;
            const isSel = left === ai;
            return (
              <button key={ai} disabled={isPaired} onClick={() => !isPaired && setLeft(ai)} style={{
                padding: 14, borderRadius: T.r.md, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: isPaired ? 'default' : 'pointer',
                background: isPaired ? T.c.s100 : isSel ? T.c.p50 : T.c.n0, color: isPaired ? T.c.s700 : T.c.n950,
                border: `1.5px solid ${isPaired ? T.c.s700 : isSel ? T.c.p700 : T.c.n300}`,
              }}>{p.a}</button>
            );
          })}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rights.map(bi => {
            const isPaired = Object.values(paired).includes(bi);
            return (
              <button key={bi} disabled={isPaired} onClick={() => tapRight(bi)} style={{
                padding: 14, borderRadius: T.r.md, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: isPaired ? 'default' : 'pointer',
                background: isPaired ? T.c.s100 : T.c.n0, color: isPaired ? T.c.s700 : T.c.n950,
                border: `1.5px solid ${isPaired ? T.c.s700 : T.c.n300}`,
              }}>{ex.pairs[bi].b}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Barra de feedback + CTA (estilo Duolingo) ─────────────
function FeedbackCta({ step, answered, canAdvance, isLast, advance }) {
  const isExercise = step.type === 'exercise';
  const res = isExercise ? answered[step.exIdx] : null;
  const correct = res ? res.correct : null;
  const ex = isExercise ? step.ex : null;
  const showFb = res != null;
  const bg = showFb ? (correct ? T.c.s100 : '#F7EBE3') : T.c.n0;
  const fg = correct ? T.c.s700 : '#A0522D';
  return (
    <div style={{ flexShrink: 0, background: bg, borderTop: `1px solid ${showFb ? 'transparent' : T.c.n100}`, transition: 'background 200ms' }}>
      {showFb && (
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0', animation: 'tcSlideUp 220ms ease-out' }}>
          <Icon name={correct ? 'celebration' : 'volunteer_activism'} size={24} color={fg} fill={1}/>
          <div style={{ ...T.t.body, color: fg, fontWeight: 600, lineHeight: 1.45 }}>
            {correct ? (ex.ok || 'Mandou bem!') : (ex.wrong || 'Quase! Olha de novo.')}
          </div>
        </div>
      )}
      <div style={{ padding: '12px 20px 24px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        <Button variant="primary" size="lg" fullWidth disabled={!canAdvance} onClick={advance}
          trailing={!isLast ? <Icon name="arrow_forward" size={18}/> : null}>
          {!canAdvance ? (step.ex && step.ex.type === 'match' ? 'Associe todos os pares' : 'Responda pra continuar') : isLast ? 'Concluir lição' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  TELA DE CONCLUSÃO — stats + recompensa variável + badges
// ════════════════════════════════════════════════════════════
function TreinoCompleta({ lesson, prevState, mistakes, elapsedMs, go }) {
  // Computa estado novo e persiste 1x
  const result = React.useMemo(() => {
    const st = readTreino();
    const firstTime = !st.done.includes(lesson.id);
    if (firstTime) st.done = [...st.done, lesson.id];
    const exCount = lesson.exercises.length;
    const correct = Math.max(0, exCount - mistakes);
    const perfect = mistakes === 0;
    const bonus = Math.random() < 0.18 ? (Math.random() < 0.5 ? 15 : 25) : 0; // baú variável
    const xpGain = (firstTime ? 20 : 8) + correct * 5 + (perfect ? 10 : 0) + bonus;

    const today = todayStr();
    if (st.lastDone !== today) { st.streak = computeStreakOnFinish(st); st.lastDone = today; }
    st.bestStreak = Math.max(st.bestStreak || 0, st.streak);
    st.xp += xpGain; st.dailyXp = (st.dailyXp || 0) + xpGain; st.weekXp = (st.weekXp || 0) + xpGain;
    // vidas: desconta erros (piso 0, regenera depois)
    if (mistakes > 0) { st.hearts = Math.max(0, st.hearts - mistakes); st.heartsTs = st.heartsTs || Date.now(); }
    if (perfect) st.perfectCount = (st.perfectCount || 0) + 1;
    const newBadges = computeEarnedBadges(st, perfect, mistakes > 0).filter(id => !st.badges.includes(id));
    st.badges = [...st.badges, ...newBadges];
    writeTreino(st);
    fbEvent('treino_lesson_completed', { lesson_id: lesson.id, xp: xpGain, streak: st.streak, perfect });
    return { xpGain, perfect, correct, exCount, bonus, streak: st.streak, newBadges, goalPct: Math.min(100, Math.round((st.dailyXp / (GOALS[st.goal] || 40)) * 100)) };
  }, []); // eslint-disable-line

  const accuracy = result.exCount > 0 ? Math.round((result.correct / result.exCount) * 100) : 100;
  const secs = Math.max(1, Math.round(elapsedMs / 1000));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'auto', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 24px 8px', position: 'relative' }}>
        <Confetti/>
        <div style={{ width: 104, height: 104, borderRadius: '50%', background: result.perfect ? `linear-gradient(135deg, ${T.c.a500}, ${T.c.a700})` : `linear-gradient(135deg, ${T.c.s100}, #2E7D32)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 16px 40px rgba(216,165,32,0.35)', animation: 'tcPopIn 460ms cubic-bezier(0.2,0.8,0.2,1)' }}>
          <Icon name={result.perfect ? 'workspace_premium' : 'celebration'} size={52} color="#fff" fill={1}/>
        </div>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 26, fontWeight: 700, color: T.c.n950, marginBottom: 6 }}>
          {result.perfect ? 'Lição perfeita! 🍷' : 'Mandou bem!'}
        </div>
        <div style={{ ...T.t.body, color: T.c.n700, marginBottom: 18 }}>{lesson.recap}</div>

        {/* Stats em cartões */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, width: '100%', marginBottom: 16 }}>
          <StatCard icon="bolt" tone={T.c.a700} label="XP ganho" value={`+${result.xpGain}`}/>
          <StatCard icon="target" tone={T.c.s700} label="Acerto" value={`${accuracy}%`}/>
          <StatCard icon="schedule" tone={T.c.p700} label="Tempo" value={`${secs}s`}/>
        </div>

        {/* Baú de recompensa variável */}
        {result.bonus > 0 && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: T.c.a100, borderRadius: T.r.md, marginBottom: 12, animation: 'tcPopIn 500ms 200ms both' }}>
            <Icon name="redeem" size={26} color={T.c.a700} fill={1}/>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 800, color: T.c.n950 }}>Baú surpresa! +{result.bonus} XP</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>Você teve sorte hoje 🎁</div>
            </div>
          </div>
        )}

        {/* Badges novos */}
        {result.newBadges.length > 0 && result.newBadges.map(id => {
          const b = TREINO_BADGES.find(x => x.id === id);
          return (
            <div key={id} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: T.c.a100, borderRadius: T.r.md, marginBottom: 8 }}>
              <Icon name={b.icon} size={22} color={T.c.a700} fill={1}/>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 800, color: T.c.n950 }}>Nova conquista: {b.name}</div>
                <div style={{ ...T.t.caption, color: T.c.n600 }}>{b.cond}</div>
              </div>
            </div>
          );
        })}

        {/* Streak + meta */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <Pill icon="local_fire_department" tone="#E8772E">{result.streak} {result.streak === 1 ? 'dia' : 'dias'}</Pill>
          <Pill icon="local_bar" tone={T.c.s700}>{result.goalPct}% da meta</Pill>
        </div>

        {/* Curiosidade + teaser */}
        <div style={{ background: T.c.p50, borderRadius: T.r.md, padding: 14, width: '100%', textAlign: 'left', marginBottom: 8 }}>
          <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 4 }}>VOCÊ SABIA?</div>
          <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.45 }}>{lesson.curiosity}</div>
        </div>
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
  return (
    <div style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Icon name={icon} size={20} color={tone} fill={1}/>
      <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 18, fontWeight: 700, color: T.c.n950 }}>{value}</div>
      <div style={{ ...T.t.caption, color: T.c.n600, fontSize: 10 }}>{label}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LIGA — leaderboard semanal (social + loss aversion)
// ════════════════════════════════════════════════════════════
const LIGA_BOTS = [
  'Marina', 'Rafael', 'Bia', 'Téo', 'Carla', 'João', 'Duda', 'Léo', 'Nina', 'Gus', 'Sofia', 'Pedro', 'Lara',
];
function TreinoLigaScreen({ go }) {
  const s = readTreino();
  // Cohort estável por semana (seed simples)
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
        <button onClick={() => go('back')} aria-label="Voltar" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={22} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Liga Tinto</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '16px 16px 32px' }}>
        {/* Header da liga */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            {['#7C5635', '#9E9E9E', '#E2B86B'].map((c, i) => (
              <div key={i} style={{ width: i === 2 ? 40 : 32, height: i === 2 ? 40 : 32, borderRadius: '50%', background: i === 2 ? `${T.c.a500}33` : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 2 ? 1 : 0.5 }}>
                <Icon name="emoji_events" size={i === 2 ? 24 : 18} color={c} fill={1}/>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 700, color: T.c.n950 }}>Liga Tinto</div>
          <div style={{ ...T.t.body, color: T.c.n600 }}>Top 7 sobem pra Liga Reserva · termina domingo</div>
        </div>

        {/* Ranking */}
        <div style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, overflow: 'hidden' }}>
          {rows.map((r, i) => {
            const rank = i + 1;
            const promo = rank <= 7, demo = rank >= rows.length - 3;
            return (
              <div key={r.name + i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                background: r.me ? T.c.p50 : 'transparent', borderBottom: i < rows.length - 1 ? `1px solid ${T.c.n100}` : 'none',
                borderLeft: promo ? `3px solid ${T.c.s700}` : demo ? `3px solid ${T.c.e700 || '#C0392B'}` : '3px solid transparent',
              }}>
                <div style={{ width: 22, textAlign: 'center', fontFamily: '"Fraunces", Georgia, serif', fontSize: 16, fontWeight: 700, color: rank <= 3 ? T.c.a700 : T.c.n500 }}>{rank}</div>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: r.me ? T.c.p700 : T.c.n200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={r.me ? 'person' : 'sentiment_satisfied'} size={18} color={r.me ? '#fff' : T.c.n600} fill={1}/>
                </div>
                <div style={{ flex: 1, fontFamily: T.font, fontSize: 14, fontWeight: r.me ? 800 : 600, color: T.c.n950 }}>{r.name}</div>
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n700 }}>{r.xp} XP</div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 14, ...T.t.body, color: T.c.n700 }}>
          Você está em <strong style={{ color: T.c.p700 }}>{myRank}º</strong>. {myRank <= 7 ? 'Tá na zona de promoção! 🔼' : 'Faça mais 1 lição pra subir.'}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => go('treino-paladar')}>Treinar pra subir</Button>
        </div>
      </div>
    </div>
  );
}

// ─── helpers visuais ───────────────────────────────────────
function Pill({ icon, tone, children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: T.r.full, background: `${tone}1A`, color: tone, fontFamily: T.font, fontSize: 14, fontWeight: 800 }}>
      <Icon name={icon} size={18} color={tone} fill={1}/>{children}
    </div>
  );
}
function Confetti() {
  const bits = Array.from({ length: 14 });
  const colors = [T.c.a500, T.c.p700, T.c.s700, '#E8772E', T.c.a700];
  return (
    <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 0, pointerEvents: 'none' }}>
      {bits.map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${(i * 7 + 5) % 100}%`, top: 40,
          width: 8, height: 8, borderRadius: i % 2 ? '50%' : 2, background: colors[i % colors.length],
          animation: `tcConfetti${i % 2} ${1200 + (i % 5) * 160}ms ${i * 40}ms ease-in forwards`,
        }}/>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  ONBOARDING guiado (1ª vez) — o mascote Tchin ensina a usar
// ════════════════════════════════════════════════════════════
function OnbHud() {
  const item = (icon, color, label, ring) => (
    <div style={{ textAlign: 'center' }}>
      {ring ? <GoalRing pct={60} size={42}/> : <Icon name={icon} size={36} color={color} fill={1}/>}
      <div style={{ color: '#fff', fontFamily: T.font, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '18px 22px', borderRadius: T.r.lg }}>
      {item('local_fire_department', '#E8772E', 'sequência')}
      {item('favorite', '#E74C3C', 'vidas')}
      {item(null, null, 'meta', true)}
    </div>
  );
}

function TreinoOnboarding({ onClose, onStart, hasCurrent }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    { render: <TchinDuo size={104}/>, title: 'Oi! Eu sou o Tchin 🍷', body: 'Em 2 minutinhos por dia eu te ensino a entender vinho — sem decoreba e sem frescura. Bora?' },
    { icon: 'route', title: 'Esta é a sua trilha', body: 'Você avança uma lição de cada vez. Toque no botão roxo "COMEÇAR" (ele fica pulando) pra iniciar a lição de hoje.' },
    { hud: true, title: 'O placar lá em cima', body: '🔥 é a sua sequência — volte todo dia pra não perder. ❤️ são vidas: errou, perde uma… mas relaxa, aqui ninguém trava. O aro verde é a sua meta do dia.' },
    { icon: 'auto_stories', title: 'Como é uma lição', body: 'Rapidinha: uma ideia simples, umas perguntas pra fixar e — o melhor — uma dica de qual vinho comprar de verdade, pro seu gosto.' },
    { icon: 'emoji_events', title: 'Ganhe XP e suba de nível', body: 'Cada lição dá XP. Você sobe de nível, ganha conquistas e ainda disputa a Liga com outras pessoas. Vamos pra sua primeira lição?' },
  ];
  const cur = steps[step];
  const isLast = step === steps.length - 1;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, background: 'rgba(20,8,10,0.80)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', animation: 'tcFadeIn 200ms ease' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontFamily: T.font, fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: T.r.full, cursor: 'pointer' }}>Pular</button>

      <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ animation: 'tcPopIn 380ms cubic-bezier(0.2,0.8,0.2,1)' }}>
          {cur.render ? cur.render : cur.hud ? <OnbHud/> : (
            <div style={{ width: 124, height: 124, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={cur.icon} size={62} color={T.c.a500} fill={1}/>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '22px 22px 24px', paddingBottom: 'max(22px, env(safe-area-inset-bottom))', animation: 'tcSlideUp 320ms cubic-bezier(0.2,0.8,0.2,1)' }}>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, fontWeight: 700, color: T.c.n950, marginBottom: 8, textWrap: 'balance' }}>{cur.title}</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n700, lineHeight: 1.5, marginBottom: 18 }}>{cur.body}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 4, background: i === step ? T.c.p700 : T.c.n300, transition: 'all 240ms' }}/>
          ))}
        </div>
        {isLast ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button variant="primary" size="lg" fullWidth onClick={onStart}>{hasCurrent ? 'Começar minha 1ª lição' : 'Explorar a trilha'}</Button>
            {hasCurrent && <Button variant="ghost" size="md" fullWidth onClick={onClose}>Só explorar por enquanto</Button>}
          </div>
        ) : (
          <Button variant="primary" size="lg" fullWidth onClick={() => setStep(s => s + 1)} trailing={<Icon name="arrow_forward" size={18}/>}>Avançar</Button>
        )}
      </div>
    </div>
  );
}

// ─── Notificações no estilo Duo (copy — usado por push/lembrete) ──
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
