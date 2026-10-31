// Paths are relative to public/. Null keeps the illustrated placeholder visible.
export const assets = {
  cover: 'assets/images/portada-MM-0003-sirenas-clasicas-animada-1600x900.webp',
  map: null,
  music: null,
};
export const heroes = [
  { id: 'castor', name: 'Cástor', image: null, color: '#e9b85d', symbol: '♊' },
  { id: 'odiseo', name: 'Odiseo', image: null, color: '#79bac7', symbol: '⚓' },
  { id: 'belerofonte', name: 'Belerofonte', image: null, color: '#b7a1d8', symbol: '✦' },
];
export const regions = [
  { id: 'ciclope', name: 'Cueva del Cíclope', skill: 'Contar y reconocer números', symbol: '◉', color: '#dfb376', position: { x: 25, y: 26 } },
  { id: 'medusa', name: 'Templo de Medusa', skill: 'Mayor, menor e igual', symbol: 'Ω', color: '#aac79a', position: { x: 75, y: 26 } },
  { id: 'minotauro', name: 'Laberinto del Minotauro', skill: 'Restar', symbol: '⊞', color: '#d79677', position: { x: 25, y: 74 } },
  { id: 'sirenas', name: 'Isla de las Sirenas', skill: 'Sumar', symbol: '♫', color: '#88c3d3', position: { x: 75, y: 74 } },
].map(region => ({ ...region, image: null, animation: null, music: null, narration: null, story: null, challenges: [], reward: null, progress: null }));
