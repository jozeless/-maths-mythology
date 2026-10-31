import './style.css';
import { assets } from './data.js';
import { readHero, saveHero, resolveRoute } from './state.js';
import { heroes } from './data.js';
import { createRouter } from './router.js';
import { createMusic } from './audio.js';
import { cover, heroSelection, map, regionView } from './views.js';
let storage;
try { storage = window.localStorage; } catch { storage = null; }
let hero = readHero(storage);
document.querySelector('#app').innerHTML = '<header class="topbar"><a class="brand" href="#/" aria-label="Maths Mythology, portada"><span>✦</span> MM</a><span class="topbar-caption">APRENDE · EXPLORA · IMAGINA</span><button id="sound" class="sound" aria-pressed="false"></button></header><main id="screen" tabindex="-1"></main><footer class="site-footer">UNA AVENTURA ENTRE NÚMEROS Y LEYENDAS <span>✦</span></footer>';
const screen = document.querySelector('#screen');
const router = createRouter(hash => {
  const route = resolveRoute(hash, hero);
  screen.innerHTML = route.screen === 'heroes' ? heroSelection(hero) : route.screen === 'map' ? map(hero) : route.screen === 'region' ? regionView(route.region) : cover();
  screen.querySelectorAll('img').forEach(img => {
    const hide = () => img.remove();
    const sizeMap = () => { if (img.closest('.map-art') && img.naturalWidth) img.closest('.map-frame').style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`; };
    img.addEventListener('load', sizeMap, { once: true });
    if (img.complete) sizeMap();
    img.addEventListener('error', hide, { once: true });
    if (img.complete && !img.naturalWidth) hide();
  });
  document.title = `${route.screen === 'region' ? route.region.name : 'Maths Mythology'} · Una aventura entre números`;
  screen.focus({ preventScroll: true });
});
screen.addEventListener('click', event => {
  const heroButton = event.target.closest('[data-hero]');
  if (heroButton) {
    const id = heroButton.dataset.hero;
    if (saveHero(storage, id)) { hero = heroes.find(item => item.id === id); router.go('mapa'); }
    return;
  }
  const target = event.target.closest('[data-route]');
  if (target) router.go(target.dataset.route);
});
createMusic(assets.music, document.querySelector('#sound'));
router.start();
