/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs

// Tchin Tchin — Mock data for the prototype

const MOCK_USER = {
  name: 'Ana Beatriz',
  initials: 'AB',
  level: 'intermediario',
  city: 'Brasília, DF',
  joined: 'Mar 2026',
  bio: 'Sommelier amadora · organizo confrarias pequenas',
  paladar: { docura: 25, acidez: 70, tanino: 65, corpo: 75, alcool: 60 },
};

const MOCK_WINES = [
  { id: 1, name: 'Catena Malbec 2021', producer: 'Bodega Catena Zapata', country: 'Argentina', region: 'Mendoza', type: 'Tinto', price: 189.90, match: 92, perfil: { docura: 20, acidez: 65, tanino: 70, corpo: 80, alcool: 70 } },
  { id: 2, name: 'Quinta do Crasto Reserva 2020', producer: 'Quinta do Crasto', country: 'Portugal', region: 'Douro', type: 'Tinto', price: 245.00, match: 87, perfil: { docura: 15, acidez: 70, tanino: 75, corpo: 80, alcool: 70 } },
  { id: 3, name: 'Cloudy Bay Sauvignon Blanc', producer: 'Cloudy Bay', country: 'Nova Zelândia', region: 'Marlborough', type: 'Branco', price: 312.00, match: 64, perfil: { docura: 30, acidez: 85, tanino: 5, corpo: 35, alcool: 55 } },
  { id: 4, name: 'Casillero del Diablo Cabernet', producer: 'Concha y Toro', country: 'Chile', region: 'Maipo', type: 'Tinto', price: 64.90, match: 71, perfil: { docura: 25, acidez: 60, tanino: 65, corpo: 70, alcool: 65 } },
  { id: 5, name: 'Veuve Clicquot Brut', producer: 'Veuve Clicquot', country: 'França', region: 'Champagne', type: 'Espumante', price: 489.00, match: 55, perfil: { docura: 30, acidez: 75, tanino: 0, corpo: 45, alcool: 60 } },
  { id: 6, name: 'Salentein Reserve Malbec', producer: 'Bodegas Salentein', country: 'Argentina', region: 'Uco Valley', type: 'Tinto', price: 156.00, match: 89, perfil: { docura: 22, acidez: 68, tanino: 72, corpo: 78, alcool: 68 } },
  { id: 7, name: 'Miolo Reserva Merlot 2022', producer: 'Miolo', country: 'Brasil', region: 'Vale dos Vinhedos', type: 'Tinto', price: 72.50, match: 78, perfil: { docura: 28, acidez: 60, tanino: 55, corpo: 70, alcool: 65 } },
  { id: 8, name: 'Casa de Vila Verde Vinho Verde', producer: 'Casa de Vila Verde', country: 'Portugal', region: 'Minho', type: 'Branco', price: 58.00, match: 48, perfil: { docura: 35, acidez: 80, tanino: 0, corpo: 30, alcool: 45 } },
];

const MOCK_POSTS = [
  {
    id: 1, author: 'Carla Mendes', level: 'expert', time: '2h',
    content: 'Acabei de abrir um Crasto Reserva 2020 que trouxe do Douro. Tanino sedoso, final muito longo. #portugal #reserva Confraria do Sul, dia 18 ainda tem vaga.',
    wineRef: { name: 'Quinta do Crasto Reserva 2020', producer: 'Quinta do Crasto', match: 87 },
    likes: 24, comments: 6, liked: false,
  },
  {
    id: 2, author: 'Bruno Tavares', level: 'iniciante', time: '5h',
    content: 'Pergunta de iniciante: comprei um malbec de R$ 80 e achei muito tânico. Isso significa que ele precisa abrir mais tempo, ou que esse tipo de vinho não é pra mim? #dúvida #iniciante',
    likes: 18, comments: 14, liked: true,
  },
  {
    id: 3, author: 'Diego Reis', level: 'intermediario', time: '1d',
    content: 'Degustação às cegas no fim de semana. 6 brancos, 4 tintos, conclusão: o meu paladar é mais previsível do que eu queria admitir. Sempre escolho os tânicos. #cega #aprendendo',
    image: true,
    likes: 41, comments: 9, liked: false,
  },
  {
    id: 4, author: 'Fernando Medrado', level: 'intermediario', time: '5d',
    withUser: 'João Bernardes',
    content: 'Qual a uva da semana? Vinhocompartilhado é vinho que cabe mais 1 taça. #dúvida',
    image: true,
    likes: 6, comments: 0, liked: false,
  },
  {
    id: 5, author: 'Ana Souza', level: 'expert', time: '1sem',
    content: 'Visitei a Salton na semana passada — colheita rolando, vinícolas lotadas. Recomendo MUITO ir na época de vindima. #vinicola #serragaucha',
    likes: 67, comments: 22, liked: false,
  },
];

// activity tiers: 'muito-ativa' (≥4/30d) · 'ativa' (1-3/30d) · 'pouco-ativa' (0/30d) · 'inativa' (0/60d+)
const MOCK_CONFRARIAS = [
  { id: 1, name: 'Brindar em Brasília', description: 'Encontros mensais no Lago Sul. Foco em tintos sul-americanos e harmonização com cozinha brasileira.', members: 84, activity: 'muito-ativa', visibility: 'publica', modality: 'presencial', location: 'Brasília, DF', tags: ['Degustação Técnica', 'Vinhos da Região'] },
  { id: 2, name: 'Vinhos de Garagem', description: 'Confraria virtual para pequenos produtores e descobertas fora do óbvio.', members: 312, activity: 'muito-ativa', visibility: 'publica', modality: 'online', tags: ['Pequenos Produtores', 'Iniciantes Welcome'] },
  { id: 3, name: 'Douro & Cia', description: 'Aficionados por vinhos portugueses. Encontros trimestrais com degustação às cegas.', members: 47, activity: 'pouco-ativa', visibility: 'publica', modality: 'hibrida', tags: ['Portugal', 'Avançado'] },
  { id: 4, name: 'Tinto na Mesa', description: 'Vinho e gastronomia. Cada encontro tem um tema regional.', members: 126, activity: 'ativa', visibility: 'publica', modality: 'presencial', location: 'Brasília, DF', tags: ['Harmonização', 'Mensal'] },
  { id: 5, name: 'Winetasting Países', description: 'Aprender sobre 7 vinhos de 7 países diferentes em cada encontro.', members: 11, activity: 'muito-ativa', visibility: 'publica', modality: 'presencial', location: 'Brasília, DF', tags: ['Degustação Técnica', 'Vinhos da Região'] },
  { id: 6, name: 'Espumantes & Cia', description: 'Confraria dedicada a champagnes, cavas e espumantes brasileiros.', members: 64, activity: 'inativa', visibility: 'publica', modality: 'hibrida', tags: ['Espumantes', 'Bolha'] },
];

const MOCK_EVENTS = [
  { id: 1, title: 'Degustação às cegas — Malbecs', date: '2026-05-18', time: '19h30', location: 'Casa da Carla · Lago Sul', participants: 12, modality: 'presencial', joined: true },
  { id: 2, title: 'Workshop: Como ler um rótulo', date: '2026-05-25', time: '20h00', location: 'Zoom', participants: 47, modality: 'online', joined: false },
  { id: 3, title: 'Confraria do Mês — Tintos do Douro', date: '2026-06-04', time: '19h00', location: 'Restaurante Olivae · Asa Sul', participants: 18, modality: 'presencial', joined: false },
];

const QUIZ_QUESTIONS = [
  {
    id: 'docura', axis: 'Doçura',
    question: 'Café: amargo ou suave?',
    hint: 'Pense no seu cafezinho do dia a dia.',
    options: [
      { emoji: '☕', label: 'Amargo, sem açúcar', value: 15 },
      { emoji: '🥛', label: 'Suave, com leite ou açúcar', value: 75 },
    ],
  },
  {
    id: 'acidez', axis: 'Acidez',
    question: 'Tempero: apimentado ou suave?',
    hint: 'Sua relação com sabores intensos.',
    options: [
      { emoji: '🌶️', label: 'Apimentado, sabor marcado', value: 80 },
      { emoji: '🥗', label: 'Suave, sem ardência', value: 25 },
    ],
  },
  {
    id: 'tanino', axis: 'Tanino',
    question: 'Fruta: laranja ou morango maduro?',
    hint: 'Pense no sabor que mais te atrai.',
    options: [
      { emoji: '🍊', label: 'Laranja', value: 70 },
      { emoji: '🍓', label: 'Morango maduro', value: 30 },
    ],
  },
  {
    id: 'corpo', axis: 'Corpo',
    question: 'Chocolate: meio amargo ou ao leite?',
    hint: 'Aquele que você comeria sem pensar.',
    options: [
      { emoji: '🍫', label: 'Meio amargo', value: 75 },
      { emoji: '🥛', label: 'Ao leite', value: 35 },
    ],
  },
  {
    id: 'alcool', axis: 'Álcool',
    question: 'Bebida: prefere mais leve ou encorpada?',
    hint: 'Pense no peso da bebida na boca.',
    options: [
      { emoji: '💧', label: 'Mais leve, refrescante', value: 30 },
      { emoji: '🥃', label: 'Mais encorpada, intensa', value: 80 },
    ],
  },
];

const ONBOARDING_SLIDES = [
  { icon: 'wine_bar',     title: 'Vinho é melhor compartilhado.',         subtitle: 'A gente acredita que toda garrafa merece uma boa companhia.' },
  { icon: 'explore',      title: 'Descubra, registre, conecte.',         subtitle: 'Encontre confrarias, registre seus vinhos e troque com quem entende.' },
  { icon: 'celebration',  title: 'Comece em 1 minuto.',                  subtitle: 'Crie sua conta e descubra o que o vinho pode fazer pelas suas conexões.' },
];

const DENUNCIA_TAXONOMIA = [
  { id: 'odio',     label: 'Conteúdo ofensivo ou de ódio' },
  { id: 'spam',     label: 'Spam ou propaganda' },
  { id: 'falso',    label: 'Informação enganosa sobre vinho' },
  { id: 'menor',    label: 'Conteúdo de menor de idade' },
  { id: 'sexual',   label: 'Conteúdo sexual inadequado' },
  { id: 'assedio',  label: 'Assédio ou bullying' },
  { id: 'outro',    label: 'Outro motivo' },
];

Object.assign(window, {
  MOCK_USER, MOCK_WINES, MOCK_POSTS, MOCK_CONFRARIAS, MOCK_EVENTS,
  QUIZ_QUESTIONS, ONBOARDING_SLIDES, DENUNCIA_TAXONOMIA,
});


export { DENUNCIA_TAXONOMIA, MOCK_CONFRARIAS, MOCK_EVENTS, MOCK_POSTS, MOCK_USER, MOCK_WINES, ONBOARDING_SLIDES, QUIZ_QUESTIONS };
