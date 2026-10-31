export function createMusic(path, button) {
  let enabled = false;
  const audio = path ? new Audio(`${import.meta.env.BASE_URL}${path}`) : null;
  if (audio) { audio.loop = true; audio.volume = 0.35; }
  const update = () => {
    button.textContent = enabled ? '♫ Sonido activado' : '♪ Sonido apagado';
    button.setAttribute('aria-pressed', String(enabled));
    button.title = path ? 'Activar o silenciar música' : 'Música disponible próximamente';
  };
  if (audio) audio.addEventListener('error', () => { enabled = false; update(); });
  button.addEventListener('click', async () => {
    if (!audio) { button.title = 'Todavía no hay música disponible'; return; }
    if (enabled) { audio.pause(); enabled = false; }
    else { try { await audio.play(); enabled = true; } catch { enabled = false; } }
    update();
  });
  update();
}
