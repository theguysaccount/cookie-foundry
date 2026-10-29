import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BUILDINGS, UPGRADES, achievements, buildingCost, buyBuilding, buyUpgrade,
  canBuyUpgrade, claimGolden, clickCookie, clickPower, newGame, offline,
  parseSave, prestige, prestigeGain, production, serialize, tick,
} from '../src/game/engine.ts';

const START = 1_000_000;

function funded(cookies, changes = {}) {
  return { ...newGame(START), cookies, totalEarned: cookies, runEarned: cookies, ...changes };
}

function frozen(state) {
  Object.freeze(state.buildings);
  Object.freeze(state.upgrades);
  return Object.freeze(state);
}

function near(actual, expected) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1e-9, Math.abs(expected) * 1e-12), `${actual} should be approximately ${expected}`);
}

test('new games have independent state and reject invalid dates', () => {
  const a = newGame(START);
  const b = newGame(START);
  assert.equal(a.cookies, 0);
  assert.equal(a.buildings.length, 16);
  assert.equal(a.lastTick, START);
  assert.notEqual(a.buildings, b.buildings);
  assert.notEqual(a.upgrades, b.upgrades);
  assert.throws(() => newGame(NaN));
  assert.throws(() => newGame(-1));
  assert.throws(() => newGame(Infinity));
});

test('all 16 original generator starting prices and output survive the bakery reskin', () => {
  assert.deepEqual(BUILDINGS.map(({ baseCost }) => baseCost), [15, 100, 1_100, 12_000, 130_000, 1_400_000, 20_000_000, 330_000_000, 5_100_000_000, 75_000_000_000, 1e12, 14e12, 170e12, 2_100e12, 26_000e12, 310_000e12]);
  assert.deepEqual(BUILDINGS.map(({ cps }) => cps), [0.1, 1, 8, 47, 260, 1_400, 7_800, 44_000, 260_000, 1_600_000, 1e7, 65e6, 430e6, 2.9e9, 21e9, 150e9]);
  assert.equal(new Set(BUILDINGS.map(({ id }) => id)).size, 16);
  assert.equal(new Set(UPGRADES.map(({ id }) => id)).size, UPGRADES.length);
  for (const [index, building] of BUILDINGS.entries()) {
    assert.equal(buildingCost(newGame(START), index), building.baseCost);
  }
});

test('bulk building prices sum individually floored 1.15 growth prices', () => {
  const state = funded(1_000_000);
  const expected = Array.from({ length: 10 }, (_, i) => Math.floor(15 * 1.15 ** i)).reduce((a, b) => a + b);
  assert.equal(buildingCost(state, 0, 10), expected);
  const bought = buyBuilding(state, 0, 10);
  assert.equal(bought.buildings[0], 10);
  assert.equal(bought.cookies, state.cookies - expected);
  assert.equal(buildingCost(bought, 0), Math.floor(15 * 1.15 ** 10));
  assert.equal(production(bought), 1);
});

test('purchases are atomic, immutable, and guarded at affordability boundaries', () => {
  const poor = frozen(funded(14));
  assert.equal(buyBuilding(poor, 0), poor);
  const exact = frozen(funded(15));
  const bought = buyBuilding(exact, 0);
  assert.equal(bought.cookies, 0);
  assert.equal(bought.buildings[0], 1);
  assert.equal(exact.buildings[0], 0);
  assert.equal(exact.cookies, 15);
  assert.notEqual(exact.buildings, bought.buildings);
  const bulkPoor = funded(buildingCost(exact, 0, 10) - 1);
  assert.equal(buyBuilding(bulkPoor, 0, 10), bulkPoor);
  for (const [index, quantity] of [[-1, 1], [16, 1], [0.5, 1], [0, 0], [0, -1], [0, 1.5], [0, Infinity], [0, NaN], [0, 10001]]) {
    assert.equal(buyBuilding(exact, index, quantity), exact);
    assert.ok(Number.isFinite(buildingCost(exact, index, quantity)));
  }
});

test('upgrade unlocks and one-time ownership are enforced independently of money', () => {
  const locked = frozen(funded(1e9));
  assert.equal(canBuyUpgrade(locked, 'crisp-edges'), false);
  assert.equal(buyUpgrade(locked, 'crisp-edges'), locked);
  assert.equal(canBuyUpgrade(locked, 'unknown'), false);
  const ready = frozen(funded(100, { clicks: 25 }));
  assert.equal(canBuyUpgrade(ready, 'crisp-edges'), true);
  const upgraded = buyUpgrade(ready, 'crisp-edges');
  assert.equal(upgraded.cookies, 0);
  assert.equal(clickPower(upgraded), 2);
  assert.deepEqual(ready.upgrades, []);
  assert.equal(buyUpgrade(funded(99, { clicks: 25 }), 'crisp-edges').cookies, 99);
  const alreadyOwned = { ...upgraded, cookies: 1e9 };
  assert.equal(buyUpgrade(alreadyOwned, 'crisp-edges'), alreadyOwned);
});

test('production upgrades stack with building groups and permanent sugar', () => {
  const state = newGame(START);
  state.buildings[0] = 10;
  state.buildings[1] = 10;
  state.buildings[2] = 10;
  state.buildings[6] = 2;
  state.upgrades = ['better-tools', 'family-recipe', 'dough-science', 'cosmic-glaze', 'warm-ovens', 'assembly-line'];
  state.sugar = 4;
  near(production(frozen(state)), (1 * 2 + 10 * 2 + 80 * 2 + 15_600 * 2) * 1.5 * 2 * 1.2);
  assert.equal(canBuyUpgrade(funded(1e9, { buildings: Array(16).fill(0) }), 'better-tools'), false);
});

test('clicks apply bonuses and credit all earnings counters without mutation', () => {
  const state = frozen(funded(50, { clicks: 10, sugar: 2, upgrades: ['crisp-edges', 'double-dough', 'sugar-rush', 'golden-touch'] }));
  near(clickPower(state), 26.4);
  const clicked = clickCookie(state);
  near(clicked.cookies, 76.4);
  near(clicked.runEarned, 76.4);
  near(clicked.totalEarned, 76.4);
  assert.equal(clicked.clicks, 11);
  assert.equal(state.cookies, 50);
});

test('foreground accrual uses real elapsed time and has no offline cap', () => {
  const state = newGame(START);
  state.buildings[1] = 1;
  const next = tick(frozen(state), START + 24 * 60 * 60 * 1000);
  assert.equal(next.cookies, 86_400);
  assert.equal(next.lastTick, START + 86_400_000);
  assert.equal(tick(next, next.lastTick), next);
  assert.equal(tick(next, START), next);
  assert.equal(tick(next, NaN), next);
  assert.equal(tick(next, Infinity), next);
  assert.equal(state.cookies, 0);
});

test('frenzy accrual splits exactly at expiration and is invariant to tick frequency', () => {
  const initial = newGame(START);
  initial.buildings[1] = 2;
  const active = claimGolden(frozen(initial), START, 'frenzy');
  assert.equal(production(active), 14);
  assert.equal(clickPower(active), 7);
  assert.equal(active.goldenClicks, 1);
  const oneTick = tick(active, START + 40_000);
  assert.equal(oneTick.cookies, 2 * 7 * 30 + 2 * 10);
  assert.equal(oneTick.frenzyUntil, 0);
  assert.equal(production(oneTick), 2);
  const manyTicks = tick(tick(tick(active, START + 10_000), START + 30_000), START + 40_000);
  near(manyTicks.cookies, oneTick.cookies);
  assert.equal(initial.goldenClicks, 0);
});

test('offline progress is half normal production, limited to eight hours, with no frenzy', () => {
  const state = newGame(START);
  state.buildings[1] = 2;
  state.sugar = 4;
  const active = claimGolden(state, START, 'frenzy');
  const result = offline(frozen(active), START + 100 * 60 * 60 * 1000);
  assert.equal(result.seconds, 28_800);
  near(result.earned, 2 * 1.2 * 28_800 * 0.5);
  near(result.state.cookies, result.earned);
  assert.equal(result.state.lastTick, START + 360_000_000);
  assert.equal(result.state.frenzyUntil, 0);
  assert.equal(offline(result.state, result.state.lastTick).earned, 0);
  const short = offline(state, START + 1_500);
  near(short.earned, 2 * 1.2 * 1.5 * 0.5);
  assert.deepEqual(offline(state, START - 1), { state, earned: 0, seconds: 0 });
  assert.deepEqual(offline(state, Infinity), { state, earned: 0, seconds: 0 });
});

test('prestige thresholds use cookies earned this run, with square-root rewards', () => {
  assert.equal(prestigeGain(funded(999_999)), 0);
  assert.equal(prestigeGain(funded(1_000_000)), 1);
  assert.equal(prestigeGain(funded(3_999_999)), 1);
  assert.equal(prestigeGain(funded(4_000_000)), 2);
  assert.equal(prestigeGain(funded(9_000_000)), 3);
  assert.equal(prestigeGain(funded(0, { totalEarned: 1e12 })), 0);
  const low = funded(500_000);
  assert.equal(prestige(low, START), low);
});

test('prestige resets the bakery while preserving sugar and lifetime milestones', () => {
  const state = funded(2_000_000, {
    runEarned: 4_000_000, totalEarned: 8_000_000, sugar: 3, rebirths: 2,
    clicks: 1_000, goldenClicks: 6, upgrades: ['crisp-edges'],
    buildings: [1, ...Array(15).fill(0)], frenzyUntil: START + 20_000,
  });
  const reborn = prestige(frozen(state), START);
  assert.equal(reborn.sugar, 5);
  assert.equal(reborn.rebirths, 3);
  assert.equal(reborn.cookies, 0);
  assert.equal(reborn.runEarned, 0);
  assert.equal(reborn.totalEarned, 8_000_000);
  assert.equal(reborn.clicks, 1_000);
  assert.equal(reborn.goldenClicks, 6);
  assert.equal(reborn.createdAt, START);
  assert.equal(reborn.frenzyUntil, 0);
  assert.deepEqual(reborn.upgrades, []);
  assert.deepEqual(reborn.buildings, Array(16).fill(0));
  assert.equal(clickPower(reborn), 1.25);
  assert.equal(prestige(state, START - 1), state);
});

test('golden lucky rewards credit lifetime and run totals with a useful minimum', () => {
  const empty = newGame(START);
  const minimum = claimGolden(frozen(empty), START, 'lucky');
  assert.equal(minimum.cookies, 13);
  assert.equal(minimum.totalEarned, 13);
  assert.equal(minimum.runEarned, 13);
  const state = funded(1_000, { buildings: [0, 2, ...Array(14).fill(0)] });
  const rewarded = claimGolden(frozen(state), START, 'lucky');
  assert.equal(rewarded.cookies, 1_000 + 100 + 120);
  assert.equal(rewarded.goldenClicks, 1);
  assert.equal(claimGolden(state, NaN, 'lucky'), state);
  assert.equal(claimGolden(state, START - 1, 'lucky'), state);
  assert.equal(claimGolden(state, START, 'invalid'), state);
});

test('achievement conditions depend on player progress and survive prestige where lifetime-based', () => {
  const initial = newGame(START);
  assert.equal(achievements(initial).filter(({ earned }) => earned).length, 0);
  const state = funded(1_000_000, { clicks: 100, goldenClicks: 1 });
  const earned = new Set(achievements(state).filter(({ earned }) => earned).map(({ id }) => id));
  assert.ok(earned.has('first-batch'));
  assert.ok(earned.has('hands-on'));
  assert.ok(earned.has('millionaire'));
  assert.ok(earned.has('lucky-break'));
  assert.ok(!earned.has('help-wanted'));
  const reborn = prestige(state, START);
  const after = new Set(achievements(reborn).filter(({ earned }) => earned).map(({ id }) => id));
  assert.ok(after.has('millionaire'));
  assert.ok(after.has('fresh-start'));
});

test('valid saves round-trip state with no shared array references', () => {
  let state = funded(1e6, { clicks: 50 });
  state = buyUpgrade(state, 'crisp-edges');
  state = buyBuilding(state, 1, 3);
  state = claimGolden(state, START + 1_000, 'frenzy');
  const parsed = parseSave(serialize(frozen(state)));
  assert.deepEqual(parsed, state);
  assert.notEqual(parsed.buildings, state.buildings);
  assert.notEqual(parsed.upgrades, state.upgrades);
  const withUnknownKeys = JSON.parse(serialize(state));
  withUnknownKeys.state.untrusted = 'not retained';
  assert.ok(!('untrusted' in parseSave(JSON.stringify(withUnknownKeys))));
});

test('save import rejects bad versions, malformed dates, impossible totals, and unsafe numeric values', () => {
  const valid = funded(1_000);
  const envelope = (state) => JSON.stringify({ version: 1, state });
  const mutations = [
    { cookies: -1 }, { cookies: '100' }, { cookies: 1e101 },
    { totalEarned: 999 }, { runEarned: 999 }, { clicks: 1.5 },
    { goldenClicks: Number.MAX_SAFE_INTEGER + 1 }, { sugar: -1 }, { sugar: 1.5 },
    { sugar: 1_000_000_001 }, { rebirths: 1_000_001 },
    { createdAt: -1 }, { createdAt: START + 1 }, { lastTick: 1.25 },
    { lastTick: 'yesterday' }, { lastTick: 8_640_000_000_000_001 },
    { frenzyUntil: -1 }, { frenzyUntil: START - 1 },
    { buildings: [] }, { buildings: Array(16).fill(-1) },
    { buildings: Array(16).fill(0.5) }, { buildings: Array(16).fill(10_001) },
    { upgrades: ['unknown'] }, { upgrades: ['crisp-edges', 'crisp-edges'] },
  ];
  for (const mutation of mutations) assert.throws(() => parseSave(envelope({ ...valid, ...mutation })), JSON.stringify(mutation));
  for (const source of ['garbage', 'null', '[]', '{}', '{"version":2,"state":{}}', '{"version":"1","state":{}}', envelope(null), 'x'.repeat(100_001)]) assert.throws(() => parseSave(source));
  const raw = envelope(valid).replace('"cookies":1000', '"cookies":1e309');
  assert.throws(() => parseSave(raw));
  assert.throws(() => serialize({ ...valid, cookies: NaN }));
  assert.throws(() => serialize({ ...valid, lastTick: Infinity }));
});

test('large valid saves cannot create nonfinite currency or unbounded purchases', () => {
  const state = funded(1e100, {
    buildings: Array(16).fill(10_000),
    sugar: 1_000_000_000,
    clicks: Number.MAX_SAFE_INTEGER,
    goldenClicks: Number.MAX_SAFE_INTEGER,
  });
  const valid = parseSave(serialize(state));
  for (const result of [clickCookie(valid), tick(valid, 8_640_000_000_000_000), claimGolden(valid, START, 'lucky'), offline(valid, START + 1e12).state]) {
    for (const key of ['cookies', 'totalEarned', 'runEarned']) {
      assert.ok(Number.isFinite(result[key]));
      assert.ok(result[key] >= 0 && result[key] <= 1e100);
    }
    assert.ok(Number.isSafeInteger(result.clicks));
    assert.ok(Number.isSafeInteger(result.goldenClicks));
  }
  assert.equal(buyBuilding(valid, 0), valid);
  assert.equal(prestigeGain(valid), 0);
});
