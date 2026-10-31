import { test, expect } from '@playwright/test';
const names = ['Cástor', 'Odiseo', 'Belerofonte'];
const regions = [ ['Cueva del Cíclope', 'Contar y reconocer números'], ['Templo de Medusa', 'Mayor, menor e igual'], ['Laberinto del Minotauro', 'Restar'], ['Isla de las Sirenas', 'Sumar'] ];
test('cover, all heroes, every region, persistence and responsive map', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /MATHS/ })).toBeVisible();
  await page.getByRole('button', { name: 'Sonido apagado' }).click();
  await expect(page.getByRole('button', { name: 'Sonido apagado' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: /EMPEZAR/ }).click();
  for (const name of names) await expect(page.getByRole('button', { name: `Elegir a ${name}`, exact: true })).toBeVisible();
  for (const name of names) {
    await page.getByRole('button', { name: `Elegir a ${name}`, exact: true }).click();
    await expect(page.getByRole('heading', { name: 'El mundo de los mitos' })).toBeVisible();
    await page.reload();
    await expect(page.locator('.hero-badge')).toContainText(name);
    for (const viewport of [{width:1280,height:720}, {width:768,height:1024}, {width:390,height:844}]) {
      await page.setViewportSize(viewport);
      for (const [region, skill] of regions) {
        await page.getByRole('button', { name: region, exact: true }).click();
        await expect(page.getByRole('heading', { name: region })).toBeVisible();
        await expect(page.getByText(skill, { exact: true })).toBeVisible();
        await page.getByRole('button', { name: /VOLVER AL MAPA/ }).click();
      }
      await expect(page.locator('body')).toHaveJSProperty('scrollWidth', viewport.width);
    }
    await page.getByRole('button', { name: 'Cambiar héroe' }).click();
  }
  await expect(page.locator('img')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('keyboard navigation and unavailable storage', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Blocked'); } }); });
  await page.goto('/#/mapa');
  await expect(page.getByRole('heading', { name: 'Elige a tu héroe' })).toBeVisible();
  const castor = page.getByRole('button', { name: 'Elegir a Cástor', exact: true });
  await castor.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'El mundo de los mitos' })).toBeVisible();
});

test('animated cover is complete, responsive and accessible', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const image = page.locator('.cover-art img');
    await expect(page.locator('.cover')).toHaveClass(/cover-loaded/);
    await expect(image).toHaveJSProperty('naturalWidth', 1600);
    await expect(image).toHaveJSProperty('naturalHeight', 900);
    await expect(page.locator('.cover h1')).toHaveAccessibleName('MATHS MYTHOLOGY');
    await expect(page.locator('.cover .landscape')).toBeHidden();
    const geometry = await image.evaluate(img => {
      const rect = img.getBoundingClientRect();
      const title = document.querySelector('.cover h1').getBoundingClientRect();
      const button = document.querySelector('.cover-action button').getBoundingClientRect();
      return { ratio: rect.width / rect.height, fit: getComputedStyle(img).objectFit, titleWidth: title.width, bottom: rect.bottom, buttonTop: button.top, scroll: document.documentElement.scrollWidth, viewport: innerWidth };
    });
    expect(geometry.ratio).toBeCloseTo(16 / 9, 2);
    expect(geometry.fit).toBe('contain');
    expect(geometry.titleWidth).toBe(1);
    expect(geometry.buttonTop).toBeGreaterThan(geometry.bottom);
    expect(geometry.scroll).toBe(geometry.viewport);
    await page.getByRole('button', { name: /EMPEZAR/ }).click();
    await expect(page.getByRole('heading', { name: 'Elige a tu héroe' })).toBeVisible();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.cover')).toHaveClass(/cover-loaded/);
  await expect(page.locator('.cover .spark').first()).toHaveCSS('animation-name', 'none');
});

test('cover keeps its fallback if the configured image is unavailable', async ({ page }) => {
  await page.route('**/portada-MM-0003-sirenas-clasicas-animada-1600x900.webp', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.cover-art img')).toHaveCount(0);
  await expect(page.locator('.cover')).not.toHaveClass(/cover-loaded/);
  await expect(page.locator('.cover .landscape')).toBeVisible();
  await page.getByRole('button', { name: /EMPEZAR/ }).click();
  await expect(page.getByRole('heading', { name: 'Elige a tu héroe' })).toBeVisible();
});
