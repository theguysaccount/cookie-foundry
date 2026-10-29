import { create } from 'zustand';

import type { GameState } from './engine.ts';
import {
  buyBuilding,
  buyUpgrade,
  claimGolden,
  clickCookie,
  newGame,
  offline,
  parseSave,
  prestige,
  serialize,
  tick,
} from './engine.ts';

export const SAVE_KEY = 'arcade.cookie-foundry.v1';

const RECOVERY_STATUS = 'Original save needs recovery';
const STORAGE_STATUS = 'Storage unavailable · export a backup';

// A clock correction must not leave the bakery waiting for a future timestamp.
function adjustClock(game: GameState, now: number): GameState {
  if (game.lastTick <= now) return game;
  return {
    ...game,
    lastTick: now,
    createdAt: Math.min(game.createdAt, now),
    frenzyUntil: 0,
  };
}

function resumeGame(game: GameState, now: number) {
  return offline(adjustClock(game, now), now);
}

function welcomeMessage(earned: number): string {
  return `Welcome back! Your bakery made ${Math.floor(earned).toLocaleString()} cookies while you were away.`;
}

type BakeryStore = {
  game: GameState;
  notice: string;
  saveStatus: string;
  recoverySave: string | null;
  advance: () => void;
  bake: () => void;
  buy: (index: number, quantity: number) => void;
  upgrade: (id: string) => void;
  rebirth: () => void;
  golden: (mode: 'frenzy' | 'lucky') => void;
  save: () => void;
  resume: () => void;
  restore: (text: string) => void;
  reset: () => void;
  notify: (message: string) => void;
};

export function createBakeryStore() {
  const now = Date.now();
  let initial = newGame(now);
  let welcome = '';
  let saveStatus = 'Saved on this device';
  let saved: string | null = null;
  let recoverySave: string | null = null;
  try {
    saved = localStorage.getItem(SAVE_KEY);
  } catch {
    saveStatus = STORAGE_STATUS;
    welcome =
      'Device storage is unavailable. Export a backup in Settings to keep your bakery.';
  }
  if (saved !== null) {
    try {
      const resumed = resumeGame(parseSave(saved), now);
      initial = resumed.state;
      if (resumed.earned >= 1) welcome = welcomeMessage(resumed.earned);
    } catch {
      recoverySave = saved;
      saveStatus = RECOVERY_STATUS;
      welcome =
        'Your previous save could not be read. Its original data is preserved. Export the original save or import a backup in Settings.';
    }
  }

  return create<BakeryStore>((set, get) => {
    const update = (fn: (state: GameState) => GameState) =>
      set(({ game }) => {
        const current = Date.now();
        return { game: fn(tick(adjustClock(game, current), current)) };
      });
    return {
      game: initial,
      notice: welcome,
      saveStatus,
      recoverySave,
      advance: () => update((state) => state),
      bake: () => update(clickCookie),
      buy: (index, quantity) => {
        update((state) => buyBuilding(state, index, quantity));
        get().save();
      },
      upgrade: (id) => {
        update((state) => buyUpgrade(state, id));
        get().save();
      },
      rebirth: () => {
        update((state) => prestige(state, Date.now()));
        get().save();
      },
      golden: (mode) => {
        update((state) => claimGolden(state, Date.now(), mode));
        get().save();
      },
      save: () => {
        if (get().recoverySave !== null) {
          set({ saveStatus: RECOVERY_STATUS });
          return;
        }
        try {
          localStorage.setItem(SAVE_KEY, serialize(get().game));
          set({ saveStatus: 'Saved on this device' });
        } catch {
          set({ saveStatus: STORAGE_STATUS });
        }
      },
      resume: () => {
        const result = resumeGame(get().game, Date.now());
        set({
          game: result.state,
          ...(result.earned >= 1
            ? {
                notice: welcomeMessage(result.earned),
              }
            : {}),
        });
      },
      restore: (text) => {
        const result = resumeGame(parseSave(text), Date.now());
        set({
          game: result.state,
          notice: 'Bakery restored from your backup.',
          recoverySave: null,
        });
        get().save();
      },
      reset: () => {
        set({
          game: newGame(),
          notice: 'A fresh batch. Your new bakery is ready.',
          recoverySave: null,
        });
        get().save();
      },
      notify: (notice) => set({ notice }),
    };
  });
}

export const useBakery = createBakeryStore();
