import { assets, heroes, regions } from './data.js';
const button = (label, route, className = '') => `<button class="button ${className}" data-route="${route}">${label}</button>`;
export function artwork(path, fallback, className = '', label = '') {
  return `<div class="artwork ${className}">${fallback}${path ? `<img src="${import.meta.env.BASE_URL}${path}" alt="${label}">` : ''}</div>`;
}
function landscape() {
  return '<div class="landscape" aria-hidden="true"><span class="moon"></span><span class="mountain distant"></span><span class="mountain near"></span><span class="temple">▥</span><span class="shore"></span><span class="spark s1">✦</span><span class="spark s2">✧</span><span class="spark s3">✦</span></div>';
}
export function cover() {
  return `<section class="cover screen"><div class="eyebrow">UNA GRAN AVENTURA TE ESPERA</div><h1>MATHS<br><span>MYTHOLOGY</span></h1><p class="subtitle">Pequeños héroes. Grandes aventuras.</p>${artwork(assets.cover, landscape(), 'cover-art', 'Mundo de Maths Mythology')}<div class="cover-action">${button('EMPEZAR ▶', 'heroes')}<span class="hint">Tu aventura comienza aquí</span></div><span class="edition">EL MUNDO DE LOS MITOS · 01</span></section>`;
}
export function heroSelection(selected) {
  return `<section class="screen hero-screen"><div class="eyebrow">EL COMIENZO DE TU VIAJE</div><h1>Elige a tu héroe</h1><p class="subtitle">¿Quién vivirá esta aventura contigo?</p><div class="hero-grid">${heroes.map((hero, i) => `<button class="hero-card ${selected?.id === hero.id ? 'selected' : ''}" data-hero="${hero.id}" style="--hero-color:${hero.color}" aria-label="Elegir a ${hero.name}">${artwork(hero.image, `<div class="hero-portrait portrait-${i}" aria-hidden="true"><span class="hero-halo">${hero.symbol}</span><span class="pixel-hero"><i class="helmet"></i><i class="face"></i><i class="body"></i><i class="legs"></i><i class="spear"></i></span><span class="pedestal"></span></div>`, '', hero.name)}<span class="hero-name">${hero.name}</span><span class="card-hint">${selected?.id === hero.id ? 'TU HÉROE' : 'ELEGIR →'}</span></button>`).join('')}</div>${button('← PORTADA', '', 'quiet')}</section>`;
}
export function map(hero) {
  return `<section class="screen map-screen"><div class="screen-heading"><div><div class="eyebrow">CUATRO LUGARES POR DESCUBRIR</div><h1>El mundo de los mitos</h1></div><div class="hero-badge"><span>${hero.symbol} ${hero.name}</span>${button('Cambiar héroe', 'heroes', 'quiet')}</div></div><p class="subtitle">Elige un lugar y comienza a explorar.</p><div class="map-frame">${artwork(assets.map, '<div class="map-land" aria-hidden="true"><span class="island island-one"></span><span class="island island-two"></span><span class="map-path"></span><span class="sea-label">MAR EGEO</span><span class="compass">✥<small>N</small></span></div>', 'map-art', 'Mapa del mundo mitológico')}${regions.map(region => `<button class="map-region" style="left:${region.position.x}%;top:${region.position.y}%;--region-color:${region.color}" data-route="region/${region.id}"><span class="region-icon" aria-hidden="true">${region.symbol}</span><span class="region-label">${region.name}</span></button>`).join('')}</div><div class="map-footer"><span>✦ Todos los caminos están abiertos</span>${button('← PORTADA', '', 'quiet')}</div></section>`;
}
export function regionView(region) {
  return `<section class="screen region-screen"><div class="eyebrow">EL MUNDO DE LOS MITOS</div><h1>${region.name}</h1><p class="subtitle">${region.skill}</p>${artwork(region.animation || region.image, `<div class="region-placeholder" style="--region-color:${region.color}"><span aria-hidden="true">${region.symbol}</span><p>Una nueva aventura llegará aquí</p></div>`, 'intro-art', region.name)}${button('← VOLVER AL MAPA', 'mapa')}</section>`;
}
