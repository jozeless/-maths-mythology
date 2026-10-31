import { heroes, regions } from './data.js';
export const storageKey = 'maths-mythology.hero';
export function readHero(storage) {
  try { const id = storage.getItem(storageKey); return heroes.find(hero => hero.id === id) ?? null; }
  catch { return null; }
}
export function saveHero(storage, id) {
  if (!heroes.some(hero => hero.id === id)) return false;
  try { storage.setItem(storageKey, id); } catch { /* Play remains available when storage is blocked. */ }
  return true;
}
export function resolveRoute(hash, hero) {
  const route = hash.replace(/^#\/?/, '');
  if (route === 'heroes') return { screen: 'heroes' };
  if (route === 'mapa') return { screen: hero ? 'map' : 'heroes' };
  const region = regions.find(item => route === `region/${item.id}`);
  if (region) return hero ? { screen: 'region', region } : { screen: 'heroes' };
  return { screen: 'cover' };
}
