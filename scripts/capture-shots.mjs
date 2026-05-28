// Captura screenshots de todas as telas do app (modo ?screen=) para a spec.
// Requer o dev server rodando (localhost:5173) e playwright + chromium instalados.
//   node scripts/capture-shots.mjs
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'docs/spec/shots';
fs.mkdirSync(OUT, { recursive: true });

const homeTabs = ['descobrir', 'adega', 'comunidade', 'confrarias'];
const routes = [
  'onboarding','welcome','login','cadastro','login-social','recuperar','recuperar-email','recuperar-enviado','recuperar-otp','recuperar-redefinir','recuperar-sucesso','termos','politica-privacidade',
  'quiz-nivel','quiz-interesses','tela-intencao','gps-primer','gps-negado','welcome-final','tutoriais',
  'quiz','quiz-result',
  'marketplace','wine','busca','filtros-avancados','lista-desejos','comparar-vinhos',
  'carrinho','endereco','pagamento','pedido-confirmado',
  'scanner','scanner-result','scanner-v2','scanner-result-v2','scanner-fallback','modo-restaurante','carta-matches','porque-combina',
  'register-consumo','registro-rapido','registro-completo','registro-confirmacao','relatorio-mensal','favoritos',
  'treino-paladar','treino-licao','treino-liga','treino-aprender',
  'aprender','aprenda','aprenda-detalhe',
  'harmoniza','harmoniza-resultados',
  'confraria-detalhe','wizard-confraria-1','wizard-confraria-2','wizard-confraria-3','wizard-confraria-4','wizard-confraria-5','wizard-confraria-6','confraria-config','confraria-convidar','confraria-sair','confraria-transferir','confraria-regras','confraria-welcome','confraria-apresentar','confraria-tour-rapido',
  'event-wizard-1','event-wizard-2','event-wizard-3','event-wizard-4','event-wizard-5','event-detalhe','evento-editar','evento-presenca','evento-pos-avaliar','evento-pos-ata',
  'criar-post','criar-momento','post-detail','comentarios',
  'perfil-outro','editar-perfil','editar-perfil-foto','editar-perfil-paladar','editar-perfil-privacidade','perfil-seguidores','perfil-seguindo','perfil-atividade-publica','perfil-vinhos-provados','perfil-sugestoes','perfil-comparar-paladar','badges-galeria',
  'expert-virar','expert-aplicar','expert-pendente','expert-q-a','expert-responder','perguntar-expert',
  'indicacao-landing','indicacao-compartilhar','indicacao-meus-convites','indicacao-recompensas','convite-recebido',
  'chat-lista','chat-conversa',
  'notificacoes','push-primer','push-negado','push-canais','push-preview','nudge-d1','nudge-d3','nudge-d7','nudge-d14','plus-one',
  'jornada','pontos','badges',
  'config-notif','config-privacidade','config-conta','config-bloqueados','conta-desativada','conta-excluida','suporte-faq','suporte-contato',
  'erro-404','erro-permissao','erro-sessao','erro-servidor','vinho-indisponivel',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 924 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
let ok = 0, fail = 0;
async function shot(name, url) {
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(950);
    await page.screenshot({ path: `${OUT}/${name}.png` });
    ok++; console.log('ok   ' + name);
  } catch (e) { fail++; console.log('FAIL ' + name + ' :: ' + String(e.message).split('\n')[0]); }
}
// Filtro opcional: SHOT_ONLY="config-conta,login-social" captura só rotas
// cujo nome contenha algum termo (acelera re-capturas pontuais).
const ONLY = process.env.SHOT_ONLY ? process.env.SHOT_ONLY.split(',').map(s => s.trim()).filter(Boolean) : null;
const want = (name) => !ONLY || ONLY.some(t => name.includes(t));
for (const t of homeTabs) if (want('home-' + t)) await shot('home-' + t, `${BASE}/?screen=home&tab=${t}`);
for (const r of routes) if (want(r)) await shot(r, `${BASE}/?screen=${encodeURIComponent(r)}`);
await browser.close();
console.log(`\nTOTAL: ${ok} ok, ${fail} fail (${OUT})`);
