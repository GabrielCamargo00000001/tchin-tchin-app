/* eslint-disable */
// @ts-nocheck
// Feature: "Treine seu Paladar" — microlições diárias gamificadas (estilo
// Duolingo) dentro do Tchin Tchin. Loop: 1 lição de ~90s (5 cards) → XP →
// streak → nível → badges. Toda lição fecha com aplicação de compra real,
// ancorada no paladar. Persistência em localStorage (sem backend).
//
// Implementada nas convenções do projeto (tokens T, estilos inline, go()),
// NÃO na stack PWA separada do doc de produto. Entradas: drawer do perfil +
// tela de intenção (board guiado).
import React from 'react';
import { Button } from './components.jsx';
import { MOCK_USER } from './data.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// ─── Store (localStorage) ──────────────────────────────────
const TREINO_KEY = 'tc.treino.v1';
function defaultTreino() {
  return { xp: 0, streak: 0, lastDone: null, done: [], badges: [], freezes: 1 };
}
function readTreino() {
  try { return Object.assign(defaultTreino(), JSON.parse(window.localStorage.getItem(TREINO_KEY) || 'null')); }
  catch (e) { return defaultTreino(); }
}
function writeTreino(s) {
  try { window.localStorage.setItem(TREINO_KEY, JSON.stringify(s)); } catch (e) {}
}
function resetTreino() { try { window.localStorage.removeItem(TREINO_KEY); } catch (e) {} }

function dayStr(d) { return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function todayStr() { return dayStr(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }

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
  { id: 'primeira-gota',      name: 'Primeira gota',      icon: 'water_drop',         cond: 'Sua 1ª lição' },
  { id: 'pegando-o-ritmo',    name: 'Pegando o ritmo',    icon: 'trending_up',        cond: '5 lições' },
  { id: 'semana-cheia',       name: 'Semana cheia',       icon: 'local_fire_department', cond: 'Streak de 7 dias' },
  { id: 'explorador-de-uvas', name: 'Explorador de uvas', icon: 'travel_explore',     cond: '5 uvas aprendidas' },
  { id: 'sem-medo-de-errar',  name: 'Sem medo de errar',  icon: 'sentiment_satisfied', cond: 'Concluiu mesmo errando' },
];

// ─── Conteúdo seed — Fundamentos do Paladar (7 lições) ─────
const LESSONS = [
  {
    id: 'licao-01-tanino', day: 1, grape: null, title: "Por que alguns vinhos 'secam' a boca?",
    hook: "Já sentiu a boca 'secar' depois de um gole? Tem nome — e tem motivo.",
    concept: "Isso é o tanino: vem da casca e da semente da uva. Dá aquela sensação de 'amarrar' a boca, parecida com chá preto forte ou caqui verde.",
    quiz: { question: "O que causa a sensação de 'secar' a boca no vinho?", options: ['O álcool', 'O tanino', 'O açúcar'], correct: 1, ok: "Isso! Tanino é o que 'amarra' a boca.", wrong: "Quase! É o tanino — vem da casca e da semente da uva." },
    application: "No seu perfil ({perfil}), se quiser tintos mais macios e menos 'secos', procure Merlot ou Pinot Noir. Se curte mais estrutura, Cabernet Sauvignon é seu amigo.",
    recap: "Tanino = sensação de amarrar. Quanto mais, mais 'seco' parece.",
    curiosity: "Vinhos com muito tanino costumam melhorar com os anos — o tanino 'suaviza' com o tempo.",
    teaser: "Amanhã: o que faz um vinho ter 'corpo'?",
  },
  {
    id: 'licao-02-corpo', day: 2, grape: null, title: "O que é 'corpo' no vinho?",
    hook: "Dizem que um vinho é 'leve' ou 'encorpado'. Mas o que isso quer dizer?",
    concept: "Corpo é o 'peso' do vinho na boca — pense em água (leve), leite (médio) e creme (encorpado). Álcool e tanino contribuem pra essa sensação.",
    quiz: { question: "Um vinho 'encorpado' lembra a textura de…", options: ['Água', 'Creme de leite', 'Chá gelado'], correct: 1, ok: "Isso! Encorpado = mais 'denso' na boca.", wrong: "Na real é o creme — encorpado é mais 'denso' na boca." },
    application: "Pra {perfil}: encontros com comida pesada (carne, queijos) pedem vinho encorpado. Pra um happy hour leve, um tinto leve ou branco cai melhor.",
    recap: "Corpo = peso na boca. Leve, médio ou encorpado.",
    curiosity: "Vinhos de climas mais quentes costumam ser mais encorpados (mais açúcar na uva vira mais álcool).",
    teaser: "Amanhã: seco x suave, sem mito.",
  },
  {
    id: 'licao-03-docura', day: 3, grape: null, title: "Seco ou suave: qual é o seu?",
    hook: "Tem gente que torce o nariz pra 'vinho suave'. A real? É só uma questão de gosto.",
    concept: "Seco = pouco ou nenhum açúcar. Suave = mais açúcar, mais doce. Nenhum é 'melhor' — são experiências diferentes. Suave costuma ser ótima porta de entrada.",
    quiz: { question: "Vinho 'seco' quer dizer que ele…", options: ['Tem pouco açúcar', 'Seca a garganta', 'É sem álcool'], correct: 0, ok: "Isso! Seco = pouco açúcar.", wrong: "Quase! Seco = pouco açúcar (nada a ver com secar a garganta)." },
    application: "Se você ({perfil}) curte café com leite e chocolate ao leite, provavelmente vai gostar de vinhos mais suaves ou frutados — e tá tudo certo nisso.",
    recap: "Seco = pouco açúcar. Suave = mais doce. Gosto é gosto.",
    curiosity: "Muitos espumantes 'brut' são bem secos; já o 'demi-sec' é levemente doce.",
    teaser: "Amanhã: por que vinho 'dá água na boca'?",
  },
  {
    id: 'licao-04-acidez', day: 4, grape: null, title: "Por que vinho 'dá água na boca'?",
    hook: "Aquele friozinho que faz salivar… é a acidez trabalhando.",
    concept: "Acidez é o que deixa o vinho 'vivo' e refrescante — como morder um limão faz salivar. É ela que faz o vinho combinar tão bem com comida.",
    quiz: { question: "A acidez no vinho serve principalmente pra…", options: ['Deixar mais doce', 'Refrescar e harmonizar com comida', 'Aumentar o álcool'], correct: 1, ok: "Isso! Acidez refresca e casa com comida.", wrong: "Na real, a acidez refresca e ajuda a harmonizar com comida." },
    application: "Pra {perfil}: vai comer algo gorduroso (pizza, fritura)? Um vinho com boa acidez 'limpa' a boca entre as garfadas.",
    recap: "Acidez = frescor + parceira da comida.",
    curiosity: "Brancos costumam ter mais acidez que tintos — por isso refrescam tanto no calor.",
    teaser: "Amanhã: a uva mais querida do brasileiro.",
  },
  {
    id: 'licao-05-cabernet', day: 5, grape: 'Cabernet Sauvignon', title: "Cabernet Sauvignon: a porta de entrada",
    hook: "É a uva tinta mais famosa do mundo — e provavelmente a primeira que você vai amar.",
    concept: "Cabernet Sauvignon faz tintos encorpados, com bom tanino e sabor de frutas escuras (cassis, ameixa). Estrutura sem complicar.",
    quiz: { question: "Cabernet Sauvignon costuma ser um tinto…", options: ['Leve e doce', 'Encorpado e estruturado', 'Sem tanino'], correct: 1, ok: "Isso! Encorpado e com boa estrutura.", wrong: "Quase! Cabernet costuma ser encorpado e estruturado." },
    application: "Pra {perfil}: um Cabernet chileno ou brasileiro custa-benefício é uma aposta segura pra carne na brasa. Procure por 'Cabernet Sauvignon' no rótulo.",
    recap: "Cabernet = encorpado, tânico, frutas escuras. Aposta segura.",
    curiosity: "Cabernet é tão adaptável que cresce bem em quase todo país produtor de vinho.",
    teaser: "Amanhã: a queridinha argentina.",
  },
  {
    id: 'licao-06-malbec', day: 6, grape: 'Malbec', title: "Malbec: a queridinha argentina",
    hook: "Se Cabernet é o clássico, Malbec é o abraço macio.",
    concept: "Malbec faz tintos frutados e macios, com taninos mais suaves. Fácil de gostar, ótimo com churrasco. Mendoza (Argentina) é a casa dela.",
    quiz: { question: "Comparado ao Cabernet, o Malbec costuma ser…", options: ['Mais macio e frutado', 'Mais ácido e leve', 'Mais amargo'], correct: 0, ok: "Isso! Malbec é mais macio e frutado.", wrong: "Na real, o Malbec costuma ser mais macio e frutado." },
    application: "Pra {perfil}: quer agradar geral num churrasco? Um Malbec argentino de Mendoza raramente decepciona.",
    recap: "Malbec = macio, frutado, parceiro do churrasco.",
    curiosity: "A Argentina transformou o Malbec (uva de origem francesa) no seu maior símbolo.",
    teaser: "Amanhã: a regra de ouro da harmonização.",
  },
  {
    id: 'licao-07-harmonizacao', day: 7, grape: null, title: "Harmonização: a regra simples",
    hook: "Esquece tabela complicada. Tem uma regra que resolve 80% dos casos.",
    concept: "Peso com peso: prato leve pede vinho leve; prato pesado pede vinho encorpado. Salada com branco leve; costela com tinto encorpado.",
    quiz: { question: "A regra simples de harmonização é…", options: ['Sempre tinto com carne', 'Peso com peso', 'O mais caro combina com tudo'], correct: 1, ok: "Isso! Peso com peso resolve a maioria.", wrong: "A regra que resolve a maioria é: peso com peso." },
    application: "Pra {perfil}: olhe o prato da próxima refeição e escolha um vinho de 'peso' parecido. Simples assim — e quase sempre funciona.",
    recap: "Peso com peso. Leve com leve, encorpado com encorpado.",
    curiosity: "Quando na dúvida, espumante combina com quase tudo — da pizza ao sushi.",
    teaser: "Você fechou os Fundamentos! Em breve, novos módulos.",
  },
];

function perfilLabel() {
  const p = (typeof window !== 'undefined' && window.__tcUserPaladar) || (typeof MOCK_USER !== 'undefined' && MOCK_USER.paladar);
  if (!p) return 'seu paladar';
  if (p.docura != null && p.docura <= 35) return 'paladar mais seco';
  if (p.docura != null && p.docura >= 60) return 'paladar mais suave';
  return 'seu paladar';
}

// Calcula badges que o usuário teria após concluir uma lição.
function computeEarnedBadges(prevState, lesson, quizWrong) {
  const done = prevState.done.includes(lesson.id) ? prevState.done : [...prevState.done, lesson.id];
  const streak = prevState.lastDone === todayStr() ? prevState.streak : (prevState.lastDone === yesterdayStr() ? prevState.streak + 1 : 1);
  const grapes = LESSONS.filter(l => l.grape && done.includes(l.id)).length;
  const earned = [];
  if (done.length >= 1) earned.push('primeira-gota');
  if (done.length >= 5) earned.push('pegando-o-ritmo');
  if (streak >= 7) earned.push('semana-cheia');
  if (grapes >= 5) earned.push('explorador-de-uvas');
  if (quizWrong) earned.push('sem-medo-de-errar');
  return earned.filter(id => !prevState.badges.includes(id));
}

// ─── StreakFlame ───────────────────────────────────────────
function StreakFlame({ days, size = 56 }) {
  const hot = Math.min(1, days / 14);
  const color = days <= 0 ? T.c.n400 : `hsl(${28 - hot * 18}, 90%, ${56 - hot * 8}%)`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: days > 0 ? 'rgba(216,165,32,0.14)' : T.c.n100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: days > 0 ? 'tcBreath 2.4s ease-in-out infinite' : 'none',
      }}>
        <Icon name="local_fire_department" size={size * 0.55} color={color} fill={1}/>
      </div>
      <div>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 26, fontWeight: 700, color: T.c.n950, lineHeight: 1 }}>{days}</div>
        <div style={{ ...T.t.caption, color: T.c.n600 }}>{days === 1 ? 'dia de sequência' : 'dias de sequência'}</div>
      </div>
    </div>
  );
}

// ─── Home / Hub ────────────────────────────────────────────
function TreinoPaladarHome({ go }) {
  const [s, setS] = React.useState(readTreino);
  React.useEffect(() => { fbEvent('treino_home_viewed', { streak: s.streak, xp: s.xp }); }, []); // eslint-disable-line

  const lvl = levelFor(s.xp);
  const next = nextLevelFor(s.xp);
  const xpInto = s.xp - lvl.xp;
  const xpSpan = next ? next.xp - lvl.xp : 1;
  const pct = next ? Math.min(100, Math.round((xpInto / xpSpan) * 100)) : 100;

  const doneCount = s.done.length;
  const allDone = doneCount >= LESSONS.length;
  const lesson = allDone ? null : LESSONS[doneCount];
  const doneToday = s.lastDone === todayStr();
  const social = 8000 + (new Date().getDate() * 137) % 900; // número agregado "fake"

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n100}`, flexShrink: 0 }}>
        <button onClick={() => go('back')} aria-label="Voltar" style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="arrow_back" size={22} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Treine seu Paladar</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 32px' }}>
        {/* Streak + nível */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <StreakFlame days={s.streak}/>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...T.t.overline, color: T.c.a700 }}>NÍVEL {lvl.lvl}</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 16, fontWeight: 600, color: T.c.n950 }}>{lvl.title}</div>
          </div>
        </div>

        {/* Barra de XP */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ ...T.t.caption, color: T.c.n600 }}>{s.xp} XP</span>
            <span style={{ ...T.t.caption, color: T.c.n600 }}>{next ? `${next.xp} XP → ${next.title}` : 'nível máximo'}</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: T.c.n200, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${T.c.a500}, ${T.c.a700})`, transition: 'width 400ms' }}/>
          </div>
        </div>

        {/* Card lição do dia */}
        <div style={{ background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, padding: 18, boxShadow: T.el[2], marginBottom: 18 }}>
          {allDone ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <Icon name="emoji_events" size={40} color={T.c.a700} fill={1}/>
              <div style={{ ...T.t.h3, color: T.c.n950, marginTop: 8 }}>Você fechou os Fundamentos! 🎉</div>
              <div style={{ ...T.t.body, color: T.c.n600, marginTop: 4 }}>Novos módulos chegam em breve.</div>
            </div>
          ) : (
            <>
              <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 6 }}>{doneToday ? 'VOCÊ JÁ TREINOU HOJE 🎉' : 'LIÇÃO DE HOJE'}</div>
              <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: T.c.n950, lineHeight: 1.2, marginBottom: 6 }}>{lesson.title}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...T.t.caption, color: T.c.n600, marginBottom: 14 }}>
                <Icon name="schedule" size={14} color={T.c.n600}/> 90 segundos · 5 cards
              </div>
              <Button variant="primary" size="lg" fullWidth onClick={() => { fbEvent('treino_lesson_cta', { lesson_id: lesson.id }); go('treino-licao', { lessonId: lesson.id }); }}>
                {doneToday ? 'Treinar de novo (bônus)' : 'Começar lição'}
              </Button>
              {s.streak > 0 && !doneToday && (
                <div style={{ ...T.t.caption, color: T.c.a700, textAlign: 'center', marginTop: 10, fontWeight: 600 }}>
                  Sua sequência de {s.streak} {s.streak === 1 ? 'dia' : 'dias'} está te esperando.
                </div>
              )}
            </>
          )}
        </div>

        {/* Social proof leve */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...T.t.caption, color: T.c.n600, marginBottom: 18 }}>
          <Icon name="group" size={16} color={T.c.n600}/>
          {social.toLocaleString('pt-BR')} pessoas treinaram o paladar hoje
        </div>

        {/* Badges */}
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>SUAS CONQUISTAS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {TREINO_BADGES.map(b => {
            const earned = s.badges.includes(b.id);
            return (
              <div key={b.id} title={b.cond} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: earned ? 1 : 0.4 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: earned ? T.c.a100 : T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={earned ? b.icon : 'lock'} size={24} color={earned ? T.c.a700 : T.c.n400} fill={earned ? 1 : 0}/>
                </div>
                <div style={{ fontFamily: T.font, fontSize: 9, fontWeight: 600, color: T.c.n700 || T.c.n800, textAlign: 'center', lineHeight: 1.1 }}>{b.name}</div>
              </div>
            );
          })}
        </div>

        {/* Reset demo */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => { resetTreino(); setS(readTreino()); go('toast', { kind: 'info', message: 'Progresso de treino reiniciado (demo).' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.c.n400, fontFamily: T.font, fontSize: 11, textDecoration: 'underline' }}>
            Reiniciar progresso (demo)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lição diária (5 cards) ────────────────────────────────
function TreinoLicaoScreen({ go, params }) {
  const lesson = React.useMemo(() => {
    const id = params && params.lessonId;
    return LESSONS.find(l => l.id === id) || LESSONS[0];
  }, [params]);

  const [idx, setIdx] = React.useState(0);
  const [choice, setChoice] = React.useState(null); // índice escolhido no quiz
  const [bonus] = React.useState(() => (Math.random() < 0.1 ? 25 : 0)); // recompensa variável
  const prevState = React.useMemo(() => readTreino(), []);

  React.useEffect(() => { fbEvent('treino_lesson_started', { lesson_id: lesson.id }); }, []); // eslint-disable-line

  const quizCorrect = choice != null && choice === lesson.quiz.correct;
  const quizWrong = choice != null && choice !== lesson.quiz.correct;
  const xpGain = 50 + (quizCorrect ? 10 : 0) + bonus;
  const earnedNow = React.useMemo(() => computeEarnedBadges(prevState, lesson, quizWrong), [prevState, lesson, quizWrong]);

  const next = () => setIdx(i => Math.min(4, i + 1));

  const finish = () => {
    const st = readTreino();
    if (!st.done.includes(lesson.id)) st.done = [...st.done, lesson.id];
    st.xp += xpGain;
    const today = todayStr();
    if (st.lastDone !== today) {
      st.streak = (st.lastDone === yesterdayStr()) ? st.streak + 1 : 1;
      st.lastDone = today;
    }
    for (const id of computeEarnedBadges({ ...st, done: prevState.done, badges: prevState.badges, streak: prevState.streak, lastDone: prevState.lastDone }, lesson, quizWrong)) {
      if (!st.badges.includes(id)) st.badges.push(id);
    }
    writeTreino(st);
    fbEvent('treino_lesson_completed', { lesson_id: lesson.id, xp: xpGain, streak: st.streak });
    go('treino-paladar');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden' }}>
      {/* Top: progresso 5 segmentos + fechar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 8px', flexShrink: 0 }}>
        <button onClick={() => go('back')} aria-label="Fechar" style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={22} color={T.c.n800}/>
        </button>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= idx ? T.c.p700 : T.c.n200, transition: 'background 240ms' }}/>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 16px', display: 'flex', flexDirection: 'column' }} key={idx}>
        {idx === 0 && (
          <CardWrap animation="tcFadeIn">
            <Glyph name="quiz" tone={T.c.p700}/>
            <H2>{lesson.title}</H2>
            <Lead>{lesson.hook}</Lead>
          </CardWrap>
        )}
        {idx === 1 && (
          <CardWrap animation="tcPushIn">
            <Glyph name="lightbulb" tone={T.c.a700}/>
            <Lead style={{ fontSize: 18, color: T.c.n950 }}>{lesson.concept}</Lead>
          </CardWrap>
        )}
        {idx === 2 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
            <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 10 }}>RESPONDA</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: T.c.n950, lineHeight: 1.25, marginBottom: 18 }}>{lesson.quiz.question}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lesson.quiz.options.map((opt, i) => {
                const isChoice = choice === i;
                const isCorrect = i === lesson.quiz.correct;
                let bg = T.c.n0, border = T.c.n300, color = T.c.n950, icon = null;
                if (choice != null) {
                  if (isCorrect) { bg = T.c.s100; border = T.c.s700; color = T.c.s700; icon = 'check_circle'; }
                  else if (isChoice) { bg = '#F3E7E0'; border = T.c.e700 || '#A0522D'; color = '#A0522D'; icon = 'info'; }
                  else { color = T.c.n400; }
                }
                return (
                  <button key={i} disabled={choice != null} onClick={() => { setChoice(i); fbEvent('treino_quiz_answered', { lesson_id: lesson.id, correct: i === lesson.quiz.correct }); }} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 14, textAlign: 'left',
                    background: bg, border: `1.5px solid ${border}`, borderRadius: T.r.md,
                    cursor: choice != null ? 'default' : 'pointer', fontFamily: T.font, fontSize: 15, fontWeight: 600, color,
                  }}>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {icon && <Icon name={icon} size={20} color={color} fill={1}/>}
                  </button>
                );
              })}
            </div>
            {choice != null && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: T.r.md, background: quizCorrect ? T.c.s100 : '#F7EFEA', display: 'flex', gap: 10 }}>
                <Icon name={quizCorrect ? 'celebration' : 'volunteer_activism'} size={20} color={quizCorrect ? T.c.s700 : '#A0522D'} fill={1}/>
                <div style={{ ...T.t.body, color: quizCorrect ? T.c.s700 : '#A0522D', lineHeight: 1.45 }}>
                  {quizCorrect ? lesson.quiz.ok : lesson.quiz.wrong}
                </div>
              </div>
            )}
          </div>
        )}
        {idx === 3 && (
          <CardWrap animation="tcPushIn">
            <Glyph name="shopping_basket" tone={T.c.p700}/>
            <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 8 }}>NA SUA PRÓXIMA COMPRA</div>
            <Lead style={{ fontSize: 18, color: T.c.n950 }}>{lesson.application.replace('{perfil}', perfilLabel())}</Lead>
          </CardWrap>
        )}
        {idx === 4 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: `linear-gradient(135deg, ${T.c.a500}, ${T.c.a700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 16px 40px rgba(216,165,32,0.4)', animation: 'tcPopIn 420ms cubic-bezier(0.2,0.8,0.2,1)' }}>
              <Icon name="celebration" size={48} color="#fff" fill={1}/>
            </div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 24, fontWeight: 700, color: T.c.n950, marginBottom: 8 }}>Mandou bem!</div>
            <div style={{ ...T.t.body, color: T.c.n700 || T.c.n800, marginBottom: 16 }}>{lesson.recap}</div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              <Pill icon="bolt" tone={T.c.a700}>+{xpGain} XP{bonus ? ' (bônus!)' : ''}</Pill>
              <Pill icon="local_fire_department" tone="#E8772E">{prevState.lastDone === todayStr() ? prevState.streak : (prevState.lastDone === yesterdayStr() ? prevState.streak + 1 : 1)} dias</Pill>
            </div>

            {earnedNow.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, width: '100%' }}>
                {earnedNow.map(id => {
                  const b = TREINO_BADGES.find(x => x.id === id);
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: T.c.a100, borderRadius: T.r.md }}>
                      <Icon name={b.icon} size={22} color={T.c.a700} fill={1}/>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950 }}>Badge: {b.name}</div>
                        <div style={{ ...T.t.caption, color: T.c.n600 }}>{b.cond}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ background: T.c.p50, borderRadius: T.r.md, padding: 14, marginBottom: 8, width: '100%' }}>
              <div style={{ ...T.t.overline, color: T.c.p700, marginBottom: 4 }}>VOCÊ SABIA?</div>
              <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.45 }}>{lesson.curiosity}</div>
            </div>
            <div style={{ ...T.t.caption, color: T.c.n600, fontStyle: 'italic', marginBottom: 8 }}>{lesson.teaser}</div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 24px 24px', borderTop: `1px solid ${T.c.n100}`, flexShrink: 0 }}>
        {idx < 4 ? (
          <Button variant="primary" size="lg" fullWidth disabled={idx === 2 && choice == null} onClick={next} trailing={<Icon name="arrow_forward" size={18}/>}>
            {idx === 2 && choice == null ? 'Escolha uma opção' : 'Continuar'}
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth onClick={finish}>Concluir</Button>
        )}
      </div>
    </div>
  );
}

// ─── Pequenos helpers visuais ──────────────────────────────
function CardWrap({ children, animation }) {
  return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: `${animation} 280ms ease-out` }}>{children}</div>;
}
function Glyph({ name, tone }) {
  return (
    <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${tone}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
      <Icon name={name} size={44} color={tone} fill={1}/>
    </div>
  );
}
function H2({ children }) {
  return <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 24, fontWeight: 600, color: T.c.n950, lineHeight: 1.2, marginBottom: 12, textWrap: 'balance' }}>{children}</div>;
}
function Lead({ children, style }) {
  return <div style={{ ...T.t.bodyLg, color: T.c.n700 || T.c.n800, lineHeight: 1.55, ...style }}>{children}</div>;
}
function Pill({ icon, tone, children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: T.r.full, background: `${tone}1A`, color: tone, fontFamily: T.font, fontSize: 14, fontWeight: 700 }}>
      <Icon name={icon} size={18} color={tone} fill={1}/>{children}
    </div>
  );
}

if (typeof window !== 'undefined') {
  Object.assign(window, { TreinoPaladarHome, TreinoLicaoScreen, TREINO_LESSONS: LESSONS, TREINO_BADGES });
}

export { TreinoPaladarHome, TreinoLicaoScreen, TREINO_BADGES, LESSONS, readTreino };
