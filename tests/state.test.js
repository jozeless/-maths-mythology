import test from 'node:test';
import assert from 'node:assert/strict';
import { readHero, saveHero, resolveRoute, storageKey } from '../src/state.js';
import { heroes, regions } from '../src/data.js';
test('all heroes persist and restore; invalid selections are rejected', () => {
  const values = new Map(); const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  for (const hero of heroes) { assert.equal(saveHero(storage, hero.id), true); assert.deepEqual(readHero(storage), hero); }
  assert.equal(saveHero(storage, 'unknown'), false);
  values.set(storageKey, 'unknown'); assert.equal(readHero(storage), null);
});
test('blocked storage never prevents play', () => {
  const storage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(readHero(storage), null); assert.equal(saveHero(storage, 'castor'), true);
});
test('routes protect map and regions and resolve all configured regions', () => {
  assert.equal(resolveRoute('#/mapa', null).screen, 'heroes');
  for (const region of regions) {
    assert.equal(resolveRoute(`#/region/${region.id}`, null).screen, 'heroes');
    assert.equal(resolveRoute(`#/region/${region.id}`, heroes[0]).region, region);
    assert.ok(region.position.x > 0 && region.position.x < 100);
    assert.ok(region.position.y > 0 && region.position.y < 100);
  }
  assert.equal(resolveRoute('#/unknown', heroes[0]).screen, 'cover');
});
