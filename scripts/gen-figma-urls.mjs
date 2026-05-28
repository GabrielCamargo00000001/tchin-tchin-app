// Gera docs/spec/figma-urls.txt com TODAS as URLs do app prontas pra colar
// no plugin html.to.design (modo batch).
//
// USO:
//   1) Sobe o localtunnel (npx localtunnel --port 5173) e abre a URL no
//      navegador uma vez pra clicar "Continue" (anti-abuse do localtunnel).
//   2) node scripts/gen-figma-urls.mjs https://SEU-TUNEL.loca.lt
//      (ou exporta BASE=https://... antes de rodar; default = localhost:5173)
//   3) Cola o conteúdo de docs/spec/figma-urls.txt no plugin (Batch mode).
import fs from 'fs';
import path from 'path';

const BASE = process.argv[2] || process.env.BASE || 'http://localhost:5173';

const homeTabs = ['descobrir', 'adega', 'comunidade', 'confrarias'];
const modules = [
  { num: '01', name: 'Auth & Acesso', routes: ['onboarding','welcome','login','cadastro','login-social','recuperar','recuperar-email','recuperar-enviado','recuperar-otp','recuperar-redefinir','recuperar-sucesso','termos','politica-privacidade'] },
  { num: '02', name: 'Onboarding educacional & Roteamento', routes: ['quiz-nivel','quiz-interesses','tela-intencao','gps-primer','gps-negado','welcome-final','tutoriais'] },
  { num: '03', name: 'Meu Paladar', routes: ['quiz','quiz-result'] },
  { num: '04', name: 'Descobrir & Marketplace', routes: ['marketplace','wine','busca','filtros-avancados','lista-desejos','comparar-vinhos'] },
  { num: '05', name: 'Carrinho & Checkout', routes: ['carrinho','endereco','pagamento','pedido-confirmado'] },
  { num: '06', name: 'Scanner & Aprenda Bebendo', routes: ['scanner','scanner-result','scanner-v2','scanner-result-v2','scanner-fallback','modo-restaurante','carta-matches','porque-combina'] },
  { num: '07', name: 'Adega, Diario & Estante', routes: ['register-consumo','registro-rapido','registro-completo','registro-confirmacao','relatorio-mensal','favoritos'] },
  { num: '08', name: 'Treine seu Paladar', routes: ['treino-paladar','treino-licao','treino-liga','treino-aprender'] },
  { num: '09', name: 'Aprenda', routes: ['aprender','aprenda','aprenda-detalhe'] },
  { num: '10', name: 'Harmoniza', routes: ['harmoniza','harmoniza-resultados'] },
  { num: '11', name: 'Confrarias', routes: ['confraria-detalhe','wizard-confraria-1','wizard-confraria-2','wizard-confraria-3','wizard-confraria-4','wizard-confraria-5','wizard-confraria-6','confraria-config','confraria-convidar','confraria-sair','confraria-transferir','confraria-regras','confraria-welcome','confraria-apresentar','confraria-tour-rapido'] },
  { num: '12', name: 'Eventos', routes: ['event-wizard-1','event-wizard-2','event-wizard-3','event-wizard-4','event-wizard-5','event-detalhe','evento-editar','evento-presenca','evento-pos-avaliar','evento-pos-ata'] },
  { num: '13', name: 'Comunidade & Feed', routes: ['criar-post','criar-momento','post-detail','comentarios'] },
  { num: '14', name: 'Perfil & Social', routes: ['perfil-outro','editar-perfil','editar-perfil-foto','editar-perfil-paladar','editar-perfil-privacidade','perfil-seguidores','perfil-seguindo','perfil-atividade-publica','perfil-vinhos-provados','perfil-sugestoes','perfil-comparar-paladar','badges-galeria'] },
  { num: '15', name: 'Expert', routes: ['expert-virar','expert-aplicar','expert-pendente','expert-q-a','expert-responder','perguntar-expert'] },
  { num: '16', name: 'Indicacao & Convites', routes: ['indicacao-landing','indicacao-compartilhar','indicacao-meus-convites','indicacao-recompensas','convite-recebido'] },
  { num: '17', name: 'Chat / DMs', routes: ['chat-lista','chat-conversa'] },
  { num: '18', name: 'Notificacoes & Engajamento', routes: ['notificacoes','push-primer','push-negado','push-canais','push-preview','nudge-d1','nudge-d3','nudge-d7','nudge-d14','plus-one'] },
  { num: '19', name: 'Jornada & Desafios', routes: ['jornada','pontos','jornada-celebrar','desafio-detalhe','badges'] },
  { num: '20', name: 'Config & Suporte', routes: ['config-notif','config-privacidade','config-conta','config-bloqueados','conta-desativada','conta-excluida','suporte-faq','suporte-contato'] },
  { num: '21', name: 'Estados de sistema', routes: ['erro-404','erro-permissao','erro-sessao','erro-servidor','vinho-indisponivel'] },
];

const lines = [];
lines.push('# Tchin Tchin — URLs prontas para o plugin html.to.design (Figma)');
lines.push('# Base: ' + BASE);
lines.push('# Viewport recomendado no plugin: 412 x 892 (mobile)');
lines.push('# ---------------------------------------------------------------');
lines.push('');

// Home com cada aba
lines.push('## Home (4 abas principais)');
for (const t of homeTabs) lines.push(`${BASE}/?screen=home&tab=${t}`);
lines.push('');

for (const m of modules) {
  lines.push(`## Modulo ${m.num} — ${m.name}`);
  for (const r of m.routes) lines.push(`${BASE}/?screen=${encodeURIComponent(r)}`);
  lines.push('');
}

// Lista CRUA (so URLs, sem comentarios) — pra colar direto no plugin batch
const onlyUrls = lines.filter(l => l.startsWith(BASE)).join('\n');

fs.mkdirSync('docs/spec', { recursive: true });
fs.writeFileSync('docs/spec/figma-urls.txt', lines.join('\n'), 'utf8');
fs.writeFileSync('docs/spec/figma-urls-only.txt', onlyUrls, 'utf8');

console.log(`OK — escrito:`);
console.log(`  docs/spec/figma-urls.txt          (com cabecalhos por modulo)`);
console.log(`  docs/spec/figma-urls-only.txt     (so URLs — cola no plugin)`);
console.log(`Total de URLs: ${onlyUrls.split('\n').length}`);
