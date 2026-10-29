import { BUILDINGS } from './engine.ts';

/** A small, fixed scene budget: huge inventories never create huge DOM trees. */
export const MAX_VISIBLE_UNITS = 8;
export const ATLAS_COLUMNS = 4;
export const ATLAS_ROWS = 4;

export interface VisualRow {
  id: string;
  index: number;
  name: string;
  count: number;
  visibleUnits: number;
  overflow: number;
  theme: string;
  spriteX: number;
  spriteY: number;
}

/** Pure presentation only. Inventory, prices, output and saves are untouched. */
export function visualRows(inventory: readonly number[]): VisualRow[] {
  return BUILDINGS.flatMap((building, index) => {
    const value = inventory[index];
    if (!Number.isFinite(value) || value < 1) return [];
    const count = Math.floor(value);
    const visibleUnits = Math.min(MAX_VISIBLE_UNITS, count);
    return [
      {
        id: building.id,
        index,
        name: building.name,
        count,
        visibleUnits,
        overflow: count - visibleUnits,
        theme: building.id,
        spriteX: ((index % ATLAS_COLUMNS) / (ATLAS_COLUMNS - 1)) * 100,
        spriteY: (Math.floor(index / ATLAS_COLUMNS) / (ATLAS_ROWS - 1)) * 100,
      },
    ];
  });
}
