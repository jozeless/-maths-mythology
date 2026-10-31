export function createRouter(render) {
  const update = () => render(window.location.hash);
  window.addEventListener('hashchange', update);
  return { start: update, go(path) { const next = `#/${path}`; if (window.location.hash === next) update(); else window.location.hash = next; } };
}
