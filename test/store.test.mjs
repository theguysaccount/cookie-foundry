import assert from 'node:assert/strict';
import test from 'node:test';

import { newGame, parseSave, serialize } from '../src/game/engine.ts';
import { createBakeryStore, SAVE_KEY } from '../src/game/store.ts';

const NOW = 1_000_000;

function environment(t, saved = null, options = {}) {
  const descriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    'localStorage',
  );
  const entries = new Map(saved === null ? [] : [[SAVE_KEY, saved]]);
  const writes = [];
  let now = NOW;
  const storage = {
    getItem(key) {
      if (options.readError) throw new Error('Storage denied');
      return entries.get(key) ?? null;
    },
    setItem(key, value) {
      if (options.writeError) throw new Error('Quota exceeded');
      entries.set(key, value);
      writes.push({ key, value });
    },
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
  t.mock.method(Date, 'now', () => now);
  t.after(() => {
    if (descriptor)
      Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  });
  return {
    entries,
    writes,
    setTime: (value) => {
      now = value;
    },
  };
}

function savedGame(changes = {}, createdAt = NOW) {
  return serialize({ ...newGame(createdAt), ...changes });
}

for (const [name, raw] of [
  ['corrupt', '{this is not valid JSON'],
  ['future-version', JSON.stringify({ version: 99, state: newGame(NOW) })],
  ['empty unreadable', ''],
]) {
  test(`${name} persisted data remains available and cannot be replaced by autosave`, (t) => {
    const env = environment(t, raw);
    const store = createBakeryStore();
    assert.equal(store.getState().recoverySave, raw);
    assert.equal(store.getState().saveStatus, 'Original save needs recovery');
    assert.match(store.getState().notice, /original data is preserved/i);
    store.getState().bake();
    env.setTime(NOW + 5_000);
    store.getState().advance();
    store.getState().save();
    // Purchases also request a save; they must honor the same recovery guard.
    store.getState().buy(0, 1);
    assert.equal(store.getState().game.cookies, 1);
    assert.equal(env.entries.get(SAVE_KEY), raw);
    assert.deepEqual(env.writes, []);
    assert.equal(store.getState().recoverySave, raw);
    assert.equal(store.getState().saveStatus, 'Original save needs recovery');
  });
}

test('a valid restore clears recovery protection and permits the restored game to save', (t) => {
  const env = environment(t, 'unreadable original');
  const store = createBakeryStore();
  const backup = savedGame({
    cookies: 42,
    totalEarned: 42,
    runEarned: 42,
    clicks: 42,
  });
  store.getState().restore(backup);
  assert.equal(store.getState().recoverySave, null);
  assert.equal(store.getState().game.cookies, 42);
  assert.equal(store.getState().saveStatus, 'Saved on this device');
  assert.equal(env.writes.length, 1);
  assert.deepEqual(parseSave(env.entries.get(SAVE_KEY)), store.getState().game);
  store.getState().bake();
  store.getState().save();
  assert.equal(parseSave(env.entries.get(SAVE_KEY)).cookies, 43);
  assert.equal(env.writes.length, 2);
});

test('failed restore is atomic and preserves both the active game and original raw data', (t) => {
  const original = 'damaged original save';
  const env = environment(t, original);
  const store = createBakeryStore();
  store.getState().bake();
  const before = store.getState();
  for (const invalid of [
    '{invalid}',
    JSON.stringify({ version: 9, state: newGame(NOW) }),
    savedGame().replace('"cookies":0', '"cookies":-1'),
  ]) {
    assert.throws(() => store.getState().restore(invalid));
    assert.equal(store.getState(), before);
    assert.equal(env.entries.get(SAVE_KEY), original);
    assert.deepEqual(env.writes, []);
  }
});

test('an explicit reset clears recovery protection and saves a fresh bakery', (t) => {
  const env = environment(t, 'damaged save');
  const store = createBakeryStore();
  store.getState().bake();
  env.setTime(NOW + 2_000);
  store.getState().reset();
  assert.equal(store.getState().recoverySave, null);
  assert.equal(store.getState().game.cookies, 0);
  assert.equal(store.getState().game.createdAt, NOW + 2_000);
  assert.equal(env.writes.length, 1);
  assert.deepEqual(parseSave(env.entries.get(SAVE_KEY)), newGame(NOW + 2_000));
});

test('storage read failure with no raw save reports unavailable storage precisely', (t) => {
  const env = environment(t, null, { readError: true, writeError: true });
  const store = createBakeryStore();
  assert.equal(store.getState().recoverySave, null);
  assert.equal(
    store.getState().saveStatus,
    'Storage unavailable · export a backup',
  );
  assert.match(store.getState().notice, /storage is unavailable/i);
  store.getState().bake();
  store.getState().save();
  assert.equal(store.getState().game.cookies, 1);
  assert.equal(
    store.getState().saveStatus,
    'Storage unavailable · export a backup',
  );
  assert.deepEqual(env.writes, []);
});

test('quota failure preserves the existing persisted save and keeps the active game exportable', (t) => {
  const original = savedGame({ cookies: 12, runEarned: 12, totalEarned: 12 });
  const env = environment(t, original, { writeError: true });
  const store = createBakeryStore();
  store.getState().bake();
  store.getState().save();
  assert.equal(
    store.getState().saveStatus,
    'Storage unavailable · export a backup',
  );
  assert.equal(store.getState().recoverySave, null);
  assert.equal(env.entries.get(SAVE_KEY), original);
  assert.equal(parseSave(serialize(store.getState().game)).cookies, 13);
  assert.deepEqual(env.writes, []);
});

test('future clock timestamps normalize on load and the bakery earns immediately after reload', (t) => {
  const future = NOW + 60_000;
  const backup = savedGame(
    {
      cookies: 100,
      totalEarned: 100,
      runEarned: 100,
      buildings: [0, 1, ...Array(14).fill(0)],
      lastTick: future,
      frenzyUntil: future + 30_000,
    },
    future,
  );
  const env = environment(t, backup);
  const store = createBakeryStore();
  assert.equal(store.getState().game.lastTick, NOW);
  assert.equal(store.getState().game.createdAt, NOW);
  assert.equal(store.getState().game.frenzyUntil, 0);
  assert.equal(store.getState().game.cookies, 100);
  env.setTime(NOW + 1_000);
  store.getState().advance();
  assert.equal(store.getState().game.cookies, 101);
  store.getState().save();
  const reload = createBakeryStore();
  assert.equal(reload.getState().game.lastTick, NOW + 1_000);
  env.setTime(NOW + 2_000);
  reload.getState().advance();
  assert.equal(reload.getState().game.cookies, 102);
});

test('future dated imported backups normalize without granting fictional offline income', (t) => {
  const env = environment(t);
  const store = createBakeryStore();
  const originalCreatedAt = NOW - 10_000;
  const backup = savedGame(
    {
      cookies: 100,
      totalEarned: 100,
      runEarned: 100,
      buildings: [0, 2, ...Array(14).fill(0)],
      lastTick: NOW + 86_400_000,
      frenzyUntil: NOW + 86_430_000,
    },
    originalCreatedAt,
  );
  store.getState().restore(backup);
  assert.equal(store.getState().game.createdAt, originalCreatedAt);
  assert.equal(store.getState().game.lastTick, NOW);
  assert.equal(store.getState().game.frenzyUntil, 0);
  assert.equal(store.getState().game.cookies, 100);
  env.setTime(NOW + 1_000);
  store.getState().advance();
  assert.equal(store.getState().game.cookies, 102);
});

test('clock rollback during a live session or resume does not freeze production', (t) => {
  const env = environment(
    t,
    savedGame({ buildings: [0, 1, ...Array(14).fill(0)] }),
  );
  const store = createBakeryStore();
  env.setTime(NOW - 10_000);
  store.getState().resume();
  assert.equal(store.getState().game.lastTick, NOW - 10_000);
  assert.equal(store.getState().game.createdAt, NOW - 10_000);
  env.setTime(NOW - 9_000);
  store.getState().advance();
  assert.equal(store.getState().game.cookies, 1);
  env.setTime(NOW - 20_000);
  store.getState().advance();
  assert.equal(store.getState().game.lastTick, NOW - 20_000);
  env.setTime(NOW - 19_000);
  store.getState().advance();
  assert.equal(store.getState().game.cookies, 2);
});
