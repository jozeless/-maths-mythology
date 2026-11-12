// Paths are relative to public/. Null keeps the illustrated placeholder visible.
export const assets = {
  cover: 'assets/images/portada-MM-0003-sirenas-clasicas-animada-1600x900.webp',
  map: 'assets/images/Mythic Isles_ A Hero’s Journey.png',
  music: null,
};
export const heroes = [
  { id: 'heracles', name: 'Heracles', image: 'assets/images/Heracles’ Clifftop Vigil Animation.gif', color: '#e9b85d', symbol: '◆' },
  { id: 'odiseo', name: 'Odiseo', image: 'assets/images/odiseogitf.gif', color: '#79bac7', symbol: '⚓' },
  { id: 'belerofonte', name: 'Belerofonte', image: 'assets/images/belerofontegift.gif', color: '#b7a1d8', symbol: '✦' },
];
export const regions = [
  { id: 'ciclope', icon: 'assets/images/ChatGPT Image Nov 12, 2026, 12_02_01 PM-1.png', name: 'Cueva del Cíclope', skill: 'Contar y reconocer números', symbol: '◉', color: '#dfb376', position: { x: 26, y: 27 } },
  { id: 'medusa', icon: 'assets/images/ChatGPT Image Nov 12, 2026, 12_13_01 PM.png', name: 'Templo de Medusa', skill: 'Mayor, menor e igual', symbol: 'Ω', color: '#aac79a', position: { x: 78, y: 27 } },
  { id: 'minotauro', icon: 'assets/images/ChatGPT Image Nov 12, 2026, 12_13_23 PM.png', name: 'Laberinto del Minotauro', skill: 'Restar', symbol: '⊞', color: '#d79677', position: { x: 25, y: 72 } },
  { id: 'sirenas', icon: 'assets/images/ChatGPT Image Nov 12, 2026, 12_13_37 PM.png', name: 'Isla de las Sirenas', skill: 'Sumar', symbol: '♫', color: '#88c3d3', position: { x: 77, y: 73 } },
].map(region => ({ ...region, image: null, animation: null, music: null, narration: null, story: null, challenges: [], reward: null, progress: null }));

// Reserved resources remain in public/assets/images/cyclops for later phases.
const cyclopsPath = name => `assets/images/cyclops/${name}.png`;
export const cyclopsAssets = {
  background: cyclopsPath('cueva-fondo'),
  awake: cyclopsPath('polifemo-despierto'),
  dialogue: cyclopsPath('dialogo-principal'),
  nameplate: cyclopsPath('dialogo-nombre'),
  seated: Object.fromEntries(heroes.map(hero => [hero.id, cyclopsPath(`${hero.id}-sentado`)])),
};
