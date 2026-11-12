import { test, expect } from '@playwright/test';
const names = ['Heracles', 'Odiseo', 'Belerofonte'];
const regions = [ ['Cueva del Cíclope', 'Contar y reconocer números'], ['Templo de Medusa', 'Mayor, menor e igual'], ['Laberinto del Minotauro', 'Restar'], ['Isla de las Sirenas', 'Sumar'] ];
test('cover, all heroes, every region, persistence and responsive map', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /MATHS/ })).toBeVisible();
  await page.getByRole('button', { name: /EMPEZAR/ }).click();
  await page.getByRole('button', { name: 'Sonido apagado' }).click();
  await expect(page.getByRole('button', { name: 'Sonido apagado' })).toHaveAttribute('aria-pressed', 'false');
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
  await expect(page.locator('.hero-card img')).toHaveCount(3);
  expect(errors).toEqual([]);
});
test('keyboard navigation and unavailable storage', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Blocked'); } }); });
  await page.goto('/#/mapa');
  await expect(page.getByRole('heading', { name: 'Elige a tu héroe' })).toBeVisible();
  const heracles = page.getByRole('button', { name: 'Elegir a Heracles', exact: true });
  await heracles.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'El mundo de los mitos' })).toBeVisible();
});

test('animated cover is complete, responsive and accessible', async ({ page }) => {
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
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
      return { ratio: rect.width / rect.height, fit: getComputedStyle(img).objectFit, titleWidth: title.width, bottom: rect.bottom, top: rect.top, buttonBottom: button.bottom, buttonTop: button.top, buttonCenter: button.x + button.width / 2, scroll: document.documentElement.scrollWidth, viewport: innerWidth };
    });
    expect(geometry.ratio).toBeCloseTo(16 / 9, 2);
    expect(geometry.fit).toBe('contain');
    expect(geometry.titleWidth).toBe(1);
    expect(geometry.buttonTop).toBeGreaterThan(geometry.top);
    expect(geometry.buttonBottom).toBeLessThan(geometry.bottom);
    expect(geometry.buttonCenter).toBeCloseTo(viewport.width / 2, 0);
    await expect(page.locator('.topbar')).toBeHidden();
    await expect(page.locator('.site-footer')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(viewport.height);
    expect(geometry.scroll).toBe(geometry.viewport);
    await page.getByRole('button', { name: /EMPEZAR/ }).click();
    await expect(page.getByRole('heading', { name: 'Elige a tu héroe' })).toBeVisible();
    await expect(page.locator('.topbar')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
    await page.getByRole('button', { name: /PORTADA/ }).click();
    await expect(page.locator('.topbar')).toBeHidden();
    await expect(page.getByRole('button', { name: /EMPEZAR/ })).toBeVisible();
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

test('original hero cards load completely at desktop, tablet and mobile sizes', async ({ page }) => {
  for (const viewport of [{width:1920,height:1080},{width:1280,height:720},{width:768,height:1024},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    await page.goto('/#/heroes');
    const cards = page.locator('.hero-card');
    await expect(cards).toHaveCount(3);
    for (const name of names) {
      const card = page.getByRole('button', { name: `Elegir a ${name}`, exact:true });
      const image = card.locator('img');
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate(img => img.naturalWidth)).toBe(358);
      await expect(image).toHaveCSS('object-fit','contain');
      await expect(image).toHaveCSS('image-rendering','pixelated');
      await expect(card.locator('.hero-name')).toBeHidden();
      await expect(card.locator('.hero-portrait')).toBeHidden();
      const box = await card.locator('.artwork').boundingBox();
      expect(box.width/box.height).toBeCloseTo(3/4,2);
    }
    if (viewport.width >= 768) {
      const boxes = await cards.evaluateAll(items=>items.map(item=>item.getBoundingClientRect().top));
      expect(new Set(boxes).size).toBe(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(viewport.width);
  }
});

test('hero fallback remains selectable when original images fail', async ({ page }) => {
  await page.route('**/*.gif', route=>route.abort());
  await page.goto('/#/heroes');
  for (const name of names) {
    const card=page.getByRole('button',{name:`Elegir a ${name}`,exact:true});
    await expect(card.locator('img')).toHaveCount(0);
    await expect(card.locator('.hero-name')).toBeVisible();
    await expect(card.locator('.hero-portrait')).toBeVisible();
    await card.click();
    await expect(page.locator('.hero-badge')).toContainText(name);
    await page.getByRole('button',{name:'Cambiar héroe'}).click();
  }
});

test('definitive map and medallions align at every viewport and support keyboard', async ({ page }) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('/#/heroes');await page.getByRole('button',{name:'Elegir a Heracles',exact:true}).click();
 for(const viewport of [{width:1920,height:1080},{width:1280,height:720},{width:768,height:1024},{width:390,height:844}]) {
  await page.setViewportSize(viewport);
  await expect(page.locator('.map-art>img')).toHaveJSProperty('naturalWidth',1672);
  const frame=await page.locator('.map-frame').boundingBox();expect(frame.width/frame.height).toBeCloseTo(16/9,1);
  const boxes=[];
  for(const [name] of regions) {
   const button=page.getByRole('button',{name,exact:true});
   await expect(button.locator('img')).toHaveJSProperty('naturalWidth',1254);
   const box=await button.boundingBox();boxes.push(box);expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
   expect(box.x).toBeGreaterThanOrEqual(frame.x);expect(box.x+box.width).toBeLessThanOrEqual(frame.x+frame.width);
   expect(box.y).toBeGreaterThanOrEqual(frame.y);expect(box.y+box.height).toBeLessThanOrEqual(frame.y+frame.height);
   await button.focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
   await page.getByRole('button',{name:/VOLVER AL MAPA/}).click();
  }
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
   const a=boxes[i],b=boxes[j];expect(a.x+a.width<=b.x || b.x+b.width<=a.x || a.y+a.height<=b.y || b.y+b.height<=a.y).toBeTruthy();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(viewport.width);
 }
 expect(errors).toEqual([]);
});

test('cyclops introduction and scene preserve each selected hero', async ({ page }) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('/');await page.getByRole('button',{name:'EMPEZAR',exact:true}).click();
 for(const name of names){
  await page.getByRole('button',{name:`Elegir a ${name}`,exact:true}).click();
  await page.getByRole('button',{name:'Cueva del Cíclope',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Cueva del Cíclope'})).toBeVisible();
  await page.getByRole('button',{name:'ENTRAR EN LA CUEVA',exact:true}).click();
  for(const viewport of [{width:1280,height:720},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await expect(page.getByRole('heading',{name:'Cueva de Polifemo'})).toBeVisible();
   await expect(page.getByText('¡Tengo sed! ¡Tráeme unas copas de vino!',{exact:true})).toBeVisible();
   await expect(page.getByText('POLIFEMO',{exact:true})).toBeVisible();
   const hero=page.getByRole('img',{name:`${name} sentado en una roca`});
   await expect(hero).toHaveJSProperty('naturalWidth',600);
   await expect(page.locator('.cyclops-character')).toHaveJSProperty('naturalWidth',900);
   const stage=await page.locator('.cyclops-stage').boundingBox();expect(stage.width/stage.height).toBeCloseTo(16/9,2);
   for(const selector of ['.cyclops-character','.cyclops-hero']){
    const box=await page.locator(selector).boundingBox();expect(box.x).toBeGreaterThanOrEqual(stage.x);expect(box.x+box.width).toBeLessThanOrEqual(stage.x+stage.width);expect(box.y).toBeGreaterThanOrEqual(stage.y);expect(box.y+box.height).toBeLessThanOrEqual(stage.y+stage.height);
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(viewport.width);
  }
  await page.reload();await expect(page.getByRole('img',{name:`${name} sentado en una roca`})).toBeVisible();
  await page.getByRole('button',{name:/VOLVER AL MAPA/}).click();await expect(page.locator('.hero-badge')).toContainText(name);
  await page.getByRole('button',{name:'Cambiar héroe'}).click();
 }
 expect(errors).toEqual([]);
});
