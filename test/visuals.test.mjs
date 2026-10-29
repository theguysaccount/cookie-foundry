import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BUILDINGS,
  buyBuilding,
  newGame,
  prestige,
} from '../src/game/engine.ts';
import {
  ATLAS_COLUMNS,
  ATLAS_ROWS,
  MAX_VISIBLE_UNITS,
  visualRows,
} from '../src/game/visuals.ts';

test('a fresh bakery has no invented production floors or sprites', () => {
  assert.deepEqual(visualRows(newGame(1000).buildings), []);
});

test('every building maps to its original name and unique row-major atlas cell', () => {
  const rows = visualRows(Array(16).fill(1));
  assert.equal(rows.length, BUILDINGS.length);
  assert.equal(ATLAS_COLUMNS * ATLAS_ROWS, BUILDINGS.length);
  assert.equal(
    new Set(rows.map(({ spriteX, spriteY }) => `${spriteX}:${spriteY}`)).size,
    16,
  );
  rows.forEach((row, index) => {
    assert.equal(row.id, BUILDINGS[index].id);
    assert.equal(row.theme, BUILDINGS[index].id);
    assert.equal(row.name, BUILDINGS[index].name);
    assert.equal(row.index, index);
    assert.equal(row.spriteX, ((index % 4) / 3) * 100);
    assert.equal(row.spriteY, (Math.floor(index / 4) / 3) * 100);
    assert.equal(row.count, 1);
    assert.equal(row.visibleUnits, 1);
    assert.equal(row.overflow, 0);
  });
});

test('the first purchase adds exactly its floor and subsequent purchases add visible units', () => {
  const game = { ...newGame(1000), cookies: 1e8 };
  const first = buyBuilding(game, 0);
  assert.deepEqual(
    visualRows(first.buildings).map(({ id, count, visibleUnits }) => ({
      id,
      count,
      visibleUnits,
    })),
    [{ id: 'whisk', count: 1, visibleUnits: 1 }],
  );
  const second = buyBuilding(first, 0);
  assert.equal(visualRows(second.buildings)[0].visibleUnits, 2);
  const oven = buyBuilding(second, 2);
  assert.deepEqual(
    visualRows(oven.buildings).map(({ id, count }) => ({ id, count })),
    [
      { id: 'whisk', count: 2 },
      { id: 'oven', count: 1 },
    ],
  );
  assert.deepEqual(visualRows(game.buildings), []);
});

test('density is exact up to the visual budget, then reports every extra owned unit', () => {
  for (const count of [
    1,
    2,
    MAX_VISIBLE_UNITS - 1,
    MAX_VISIBLE_UNITS,
    MAX_VISIBLE_UNITS + 1,
    10000,
  ]) {
    const [row] = visualRows([count]);
    assert.equal(row.visibleUnits, Math.min(count, MAX_VISIBLE_UNITS));
    assert.equal(row.visibleUnits + row.overflow, count);
  }
});

test('maximum inventory stays at 16 floors and 128 visible production sprites', () => {
  const rows = visualRows(Array(16).fill(10000));
  assert.equal(rows.length, 16);
  assert.equal(
    rows.reduce((sum, row) => sum + row.visibleUnits, 0),
    128,
  );
  assert.equal(
    rows.reduce((sum, row) => sum + row.count, 0),
    160000,
  );
  assert.ok(rows.every(({ overflow }) => overflow === 9992));
});

test('presentation never mutates or shares inventory and drops reset floors immediately', () => {
  const inventory = Object.freeze([2, 0, 1, ...Array(13).fill(0)]);
  const before = [...inventory];
  const rows = visualRows(inventory);
  rows[0].count = 500;
  assert.deepEqual(inventory, before);
  assert.equal(visualRows(inventory)[0].count, 2);
  const game = { ...newGame(1000), buildings: [...inventory], runEarned: 1e15 };
  assert.ok(visualRows(game.buildings).length > 0);
  assert.deepEqual(visualRows(prestige(game, 2000).buildings), []);
});

test('missing and malformed counts cannot create non-finite scenes', () => {
  assert.deepEqual(visualRows([0, -1, NaN, Infinity, undefined]), []);
  const rows = visualRows([2.9]);
  assert.equal(rows[0].count, 2);
  assert.equal(rows[0].visibleUnits, 2);
});
