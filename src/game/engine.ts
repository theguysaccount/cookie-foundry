import { calculateNextCost } from '../utils/helpers.ts';

export interface Building {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  cps: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  requirement: string;
}

export interface GameState {
  cookies: number;
  totalEarned: number;
  runEarned: number;
  clicks: number;
  buildings: number[];
  upgrades: string[];
  sugar: number;
  rebirths: number;
  createdAt: number;
  lastTick: number;
  frenzyUntil: number;
  goldenClicks: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

// The original Button Clicker generator economy, with a new bakery theme.
export const BUILDINGS: Building[] = [
  {
    id: 'whisk',
    name: 'Busy whisk',
    description: 'A little help with every batch.',
    icon: '🥄',
    baseCost: 15,
    cps: 0.1,
  },
  {
    id: 'baker',
    name: 'Home baker',
    description: 'A neighbor with a very good recipe.',
    icon: '👩‍🍳',
    baseCost: 100,
    cps: 1,
  },
  {
    id: 'oven',
    name: 'Brick oven',
    description: 'Warm bricks. Perfectly crisp edges.',
    icon: '🔥',
    baseCost: 1_100,
    cps: 8,
  },
  {
    id: 'farm',
    name: 'Butter farm',
    description: 'Fresh ingredients, delivered by the bucket.',
    icon: '🌾',
    baseCost: 12_000,
    cps: 47,
  },
  {
    id: 'workshop',
    name: 'Dough workshop',
    description: 'Rolling pins become a production line.',
    icon: '🛠️',
    baseCost: 130_000,
    cps: 260,
  },
  {
    id: 'factory',
    name: 'Cookie factory',
    description: 'The whole neighborhood smells wonderful.',
    icon: '🏭',
    baseCost: 1_400_000,
    cps: 1_400,
  },
  {
    id: 'lab',
    name: 'Flavor lab',
    description: 'Researching delicious new possibilities.',
    icon: '🧪',
    baseCost: 20_000_000,
    cps: 7_800,
  },
  {
    id: 'airship',
    name: 'Bakery airship',
    description: 'Fresh cookies above the clouds.',
    icon: '🎈',
    baseCost: 330_000_000,
    cps: 44_000,
  },
  {
    id: 'moon',
    name: 'Moon bakery',
    description: 'Low gravity makes the fluffiest dough.',
    icon: '🌙',
    baseCost: 5_100_000_000,
    cps: 260_000,
  },
  {
    id: 'portal',
    name: 'Pantry portal',
    description: 'There is always more flour on the other side.',
    icon: '🌀',
    baseCost: 75_000_000_000,
    cps: 1_600_000,
  },
  {
    id: 'star',
    name: 'Starlight oven',
    description: 'A tiny star, set to golden brown.',
    icon: '⭐',
    baseCost: 1_000_000_000_000,
    cps: 10_000_000,
  },
  {
    id: 'time',
    name: 'Time kneader',
    description: 'Tomorrow’s cookies, fresh today.',
    icon: '⏳',
    baseCost: 14_000_000_000_000,
    cps: 65_000_000,
  },
  {
    id: 'dream',
    name: 'Dream kitchen',
    description: 'Every delicious dream comes out of the oven.',
    icon: '☁️',
    baseCost: 170_000_000_000_000,
    cps: 430_000_000,
  },
  {
    id: 'galaxy',
    name: 'Galaxy mill',
    description: 'Turning whole constellations into sprinkles.',
    icon: '🌌',
    baseCost: 2_100_000_000_000_000,
    cps: 2_900_000_000,
  },
  {
    id: 'quantum',
    name: 'Quantum bakery',
    description: 'Every possible cookie, all at once.',
    icon: '⚛️',
    baseCost: 26_000_000_000_000_000,
    cps: 21_000_000_000,
  },
  {
    id: 'infinity',
    name: 'Infinity foundry',
    description: 'The last batch is only the beginning.',
    icon: '♾️',
    baseCost: 310_000_000_000_000_000,
    cps: 150_000_000_000,
  },
];

export const UPGRADES: Upgrade[] = [
  {
    id: 'crisp-edges',
    name: 'Crisp edges',
    description: 'Every click bakes twice as many cookies.',
    icon: '✨',
    cost: 100,
    requirement: 'Click the cookie 25 times',
  },
  {
    id: 'double-dough',
    name: 'Double dough',
    description: 'Double your click power again.',
    icon: '🥣',
    cost: 1_000,
    requirement: 'Click the cookie 100 times',
  },
  {
    id: 'sugar-rush',
    name: 'Sugar rush',
    description: 'Triple your click power.',
    icon: '⚡',
    cost: 10_000,
    requirement: 'Click the cookie 500 times',
  },
  {
    id: 'golden-touch',
    name: 'Golden touch',
    description: 'Double your click power once more.',
    icon: '🧤',
    cost: 1_000_000,
    requirement: 'Click the cookie 2,500 times',
  },
  {
    id: 'warm-ovens',
    name: 'Warm ovens',
    description: 'All buildings produce 50% more cookies.',
    icon: '🌡️',
    cost: 5_000,
    requirement: 'Own 50 buildings',
  },
  {
    id: 'assembly-line',
    name: 'Assembly line',
    description: 'Double production from every building.',
    icon: '⚙️',
    cost: 100_000,
    requirement: 'Own 100 buildings',
  },
  {
    id: 'night-shift',
    name: 'Night shift',
    description: 'Double all building production again.',
    icon: '🌃',
    cost: 10_000_000,
    requirement: 'Bake 10 million cookies this run',
  },
  {
    id: 'master-bakers',
    name: 'Master bakers',
    description: 'Triple all building production.',
    icon: '🏆',
    cost: 1_000_000_000,
    requirement: 'Bake 1 billion cookies this run',
  },
  {
    id: 'better-tools',
    name: 'Better tools',
    description: 'Busy whisks produce twice as much.',
    icon: '🥄',
    cost: 500,
    requirement: 'Own 10 busy whisks',
  },
  {
    id: 'family-recipe',
    name: 'Family recipe',
    description: 'Home bakers produce twice as much.',
    icon: '📖',
    cost: 5_000,
    requirement: 'Own 10 home bakers',
  },
  {
    id: 'dough-science',
    name: 'Dough science',
    description: 'Brick ovens through cookie factories produce twice as much.',
    icon: '🔬',
    cost: 50_000,
    requirement: 'Own 10 brick ovens',
  },
  {
    id: 'cosmic-glaze',
    name: 'Cosmic glaze',
    description: 'Flavor labs and all later buildings produce twice as much.',
    icon: '🌠',
    cost: 5_000_000_000,
    requirement: 'Own 250 buildings',
  },
];

const SAVE_VERSION = 1;
const NUMBER_CAP = 1e100;
const MAX_DATE = 8_640_000_000_000_000;
const MAX_BUILDINGS = 10_000;
const MAX_SUGAR = 1_000_000_000;
const MAX_REBIRTHS = 1_000_000;
const OFFLINE_SECONDS = 8 * 60 * 60;
const FRENZY_DURATION = 30_000;
const FRENZY_MULTIPLIER = 7;
const knownUpgradeIds = new Set(UPGRADES.map(({ id }) => id));

function cap(value: number): number {
  return Math.min(NUMBER_CAP, Math.max(0, value));
}

function validDate(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_DATE
  );
}

function owned(state: GameState): number {
  return state.buildings.reduce((sum, count) => sum + count, 0);
}

function has(state: GameState, id: string): boolean {
  return state.upgrades.includes(id);
}

function unlocked(state: GameState, id: string): boolean {
  switch (id) {
    case 'crisp-edges':
      return state.clicks >= 25;
    case 'double-dough':
      return state.clicks >= 100;
    case 'sugar-rush':
      return state.clicks >= 500;
    case 'golden-touch':
      return state.clicks >= 2_500;
    case 'warm-ovens':
      return owned(state) >= 50;
    case 'assembly-line':
      return owned(state) >= 100;
    case 'night-shift':
      return state.runEarned >= 10_000_000;
    case 'master-bakers':
      return state.runEarned >= 1_000_000_000;
    case 'better-tools':
      return state.buildings[0] >= 10;
    case 'family-recipe':
      return state.buildings[1] >= 10;
    case 'dough-science':
      return state.buildings[2] >= 10;
    case 'cosmic-glaze':
      return owned(state) >= 250;
    default:
      return false;
  }
}

function permanentMultiplier(state: GameState): number {
  return 1 + state.sugar * 0.05;
}

function normalProduction(state: GameState): number {
  let result = state.buildings.reduce((sum, count, index) => {
    let multiplier = 1;
    if (index === 0 && has(state, 'better-tools')) multiplier *= 2;
    if (index === 1 && has(state, 'family-recipe')) multiplier *= 2;
    if (index >= 2 && index <= 5 && has(state, 'dough-science'))
      multiplier *= 2;
    if (index >= 6 && has(state, 'cosmic-glaze')) multiplier *= 2;
    return sum + count * BUILDINGS[index].cps * multiplier;
  }, 0);
  if (has(state, 'warm-ovens')) result *= 1.5;
  if (has(state, 'assembly-line')) result *= 2;
  if (has(state, 'night-shift')) result *= 2;
  if (has(state, 'master-bakers')) result *= 3;
  return cap(result * permanentMultiplier(state));
}

function addCookies(state: GameState, amount: number): GameState {
  const earned = cap(amount);
  if (earned === 0) return state;
  return {
    ...state,
    cookies: cap(state.cookies + earned),
    totalEarned: cap(state.totalEarned + earned),
    runEarned: cap(state.runEarned + earned),
  };
}

export function newGame(now = Date.now()): GameState {
  if (!validDate(now)) throw new RangeError('Invalid game date.');
  return {
    cookies: 0,
    totalEarned: 0,
    runEarned: 0,
    clicks: 0,
    buildings: BUILDINGS.map(() => 0),
    upgrades: [],
    sugar: 0,
    rebirths: 0,
    createdAt: now,
    lastTick: now,
    frenzyUntil: 0,
    goldenClicks: 0,
  };
}

export function production(state: GameState): number {
  return cap(
    normalProduction(state) *
      (state.frenzyUntil > state.lastTick ? FRENZY_MULTIPLIER : 1),
  );
}

export function clickPower(state: GameState): number {
  let multiplier = 1;
  if (has(state, 'crisp-edges')) multiplier *= 2;
  if (has(state, 'double-dough')) multiplier *= 2;
  if (has(state, 'sugar-rush')) multiplier *= 3;
  if (has(state, 'golden-touch')) multiplier *= 2;
  return cap(
    multiplier *
      permanentMultiplier(state) *
      (state.frenzyUntil > state.lastTick ? FRENZY_MULTIPLIER : 1),
  );
}

export function buildingCost(
  state: GameState,
  index: number,
  quantity = 1,
): number {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= BUILDINGS.length ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_BUILDINGS ||
    state.buildings[index] + quantity > MAX_BUILDINGS
  )
    return NUMBER_CAP;
  let total = 0;
  for (let i = 0; i < quantity; i += 1) {
    const cost = calculateNextCost(
      BUILDINGS[index].baseCost,
      1.15,
      state.buildings[index] + i,
    );
    if (!Number.isFinite(cost) || total + cost >= NUMBER_CAP) return NUMBER_CAP;
    total += cost;
  }
  return total;
}

export function buyBuilding(
  state: GameState,
  index: number,
  quantity = 1,
): GameState {
  const cost = buildingCost(state, index, quantity);
  if (cost >= NUMBER_CAP || cost > state.cookies) return state;
  const buildings = [...state.buildings];
  buildings[index] += quantity;
  return { ...state, cookies: Math.max(0, state.cookies - cost), buildings };
}

export function canBuyUpgrade(state: GameState, id: string): boolean {
  const upgrade = UPGRADES.find((item) => item.id === id);
  return Boolean(
    upgrade &&
    !has(state, id) &&
    unlocked(state, id) &&
    state.cookies >= upgrade.cost,
  );
}

export function buyUpgrade(state: GameState, id: string): GameState {
  if (!canBuyUpgrade(state, id)) return state;
  const upgrade = UPGRADES.find((item) => item.id === id)!;
  return {
    ...state,
    cookies: Math.max(0, state.cookies - upgrade.cost),
    upgrades: [...state.upgrades, id],
  };
}

export function clickCookie(state: GameState): GameState {
  return {
    ...addCookies(state, clickPower(state)),
    clicks: Math.min(Number.MAX_SAFE_INTEGER, state.clicks + 1),
  };
}

export function tick(state: GameState, now: number): GameState {
  if (!validDate(now) || now <= state.lastTick) return state;
  const seconds = (now - state.lastTick) / 1_000;
  const frenzySeconds =
    Math.max(0, Math.min(now, state.frenzyUntil) - state.lastTick) / 1_000;
  const earned = cap(
    normalProduction(state) *
      (seconds + frenzySeconds * (FRENZY_MULTIPLIER - 1)),
  );
  return {
    ...addCookies(state, earned),
    lastTick: now,
    frenzyUntil: state.frenzyUntil > now ? state.frenzyUntil : 0,
  };
}

export function offline(
  state: GameState,
  now: number,
): { state: GameState; earned: number; seconds: number } {
  if (!validDate(now) || now <= state.lastTick)
    return { state, earned: 0, seconds: 0 };
  const seconds = Math.min(OFFLINE_SECONDS, (now - state.lastTick) / 1_000);
  const earned = cap(normalProduction(state) * seconds * 0.5);
  return {
    state: { ...addCookies(state, earned), lastTick: now, frenzyUntil: 0 },
    earned,
    seconds,
  };
}

export function prestigeGain(state: GameState): number {
  if (
    state.runEarned < 1_000_000 ||
    state.sugar >= MAX_SUGAR ||
    state.rebirths >= MAX_REBIRTHS
  )
    return 0;
  return Math.min(
    MAX_SUGAR - state.sugar,
    Math.floor(Math.sqrt(state.runEarned / 1_000_000)),
  );
}

export function prestige(state: GameState, now: number): GameState {
  if (!validDate(now) || now < state.lastTick) return state;
  const current = tick(state, now);
  const gain = prestigeGain(current);
  if (!gain) return state;
  return {
    ...newGame(now),
    totalEarned: current.totalEarned,
    clicks: current.clicks,
    sugar: current.sugar + gain,
    rebirths: current.rebirths + 1,
    createdAt: current.createdAt,
    goldenClicks: current.goldenClicks,
  };
}

export function claimGolden(
  state: GameState,
  now: number,
  mode: 'frenzy' | 'lucky',
): GameState {
  if (
    !validDate(now) ||
    now < state.lastTick ||
    (mode !== 'frenzy' && mode !== 'lucky')
  )
    return state;
  const current = tick(state, now);
  const goldenClicks = Math.min(
    Number.MAX_SAFE_INTEGER,
    current.goldenClicks + 1,
  );
  if (mode === 'frenzy')
    return {
      ...current,
      goldenClicks,
      frenzyUntil: Math.min(
        MAX_DATE,
        Math.max(now, current.frenzyUntil) + FRENZY_DURATION,
      ),
    };
  const reward = Math.max(
    13,
    current.cookies * 0.1 + normalProduction(current) * 60,
  );
  return { ...addCookies(current, reward), goldenClicks };
}

export function achievements(state: GameState): Achievement[] {
  const count = owned(state);
  return [
    {
      id: 'first-batch',
      name: 'First batch',
      description: 'Click your first cookie.',
      earned: state.clicks >= 1,
    },
    {
      id: 'hands-on',
      name: 'Hands on',
      description: 'Click the cookie 100 times.',
      earned: state.clicks >= 100,
    },
    {
      id: 'cookie-fingers',
      name: 'Cookie fingers',
      description: 'Click the cookie 1,000 times.',
      earned: state.clicks >= 1_000,
    },
    {
      id: 'help-wanted',
      name: 'Help wanted',
      description: 'Buy your first building.',
      earned: count >= 1,
    },
    {
      id: 'small-business',
      name: 'Small business',
      description: 'Own 10 buildings at once.',
      earned: count >= 10,
    },
    {
      id: 'bakery-empire',
      name: 'Bakery empire',
      description: 'Own 100 buildings at once.',
      earned: count >= 100,
    },
    {
      id: 'full-menu',
      name: 'Full menu',
      description: 'Own at least one of every building.',
      earned: state.buildings.every((value) => value > 0),
    },
    {
      id: 'millionaire',
      name: 'Cookie millionaire',
      description: 'Bake 1 million cookies in total.',
      earned: state.totalEarned >= 1_000_000,
    },
    {
      id: 'billionaire',
      name: 'Billionaire baker',
      description: 'Bake 1 billion cookies in total.',
      earned: state.totalEarned >= 1_000_000_000,
    },
    {
      id: 'lucky-break',
      name: 'Lucky break',
      description: 'Catch a golden cookie.',
      earned: state.goldenClicks >= 1,
    },
    {
      id: 'gold-rush',
      name: 'Gold rush',
      description: 'Catch 25 golden cookies.',
      earned: state.goldenClicks >= 25,
    },
    {
      id: 'fresh-start',
      name: 'Fresh start',
      description: 'Start a new bakery with a sugar bonus.',
      earned: state.rebirths >= 1,
    },
  ];
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function bounded(
  value: unknown,
  limit = NUMBER_CAP,
  integer = false,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= limit &&
    (!integer || Number.isSafeInteger(value))
  );
}

function validateState(value: unknown): GameState {
  if (!record(value)) throw new Error('Save does not contain a game.');
  for (const key of ['cookies', 'totalEarned', 'runEarned']) {
    if (!bounded(value[key])) throw new Error(`Invalid saved ${key}.`);
  }
  for (const key of ['clicks', 'goldenClicks']) {
    if (!bounded(value[key], Number.MAX_SAFE_INTEGER, true))
      throw new Error(`Invalid saved ${key}.`);
  }
  if (
    !bounded(value.sugar, MAX_SUGAR, true) ||
    !bounded(value.rebirths, MAX_REBIRTHS, true)
  )
    throw new Error('Invalid saved sugar or rebirths.');
  if (
    !validDate(value.createdAt) ||
    !validDate(value.lastTick) ||
    !validDate(value.frenzyUntil) ||
    value.lastTick < value.createdAt ||
    (value.frenzyUntil !== 0 && value.frenzyUntil < value.createdAt)
  )
    throw new Error('Invalid saved dates.');
  if (
    !Array.isArray(value.buildings) ||
    value.buildings.length !== BUILDINGS.length ||
    !value.buildings.every((count) => bounded(count, MAX_BUILDINGS, true))
  )
    throw new Error('Invalid saved buildings.');
  if (
    !Array.isArray(value.upgrades) ||
    value.upgrades.length > UPGRADES.length ||
    !value.upgrades.every(
      (id) => typeof id === 'string' && knownUpgradeIds.has(id),
    ) ||
    new Set(value.upgrades).size !== value.upgrades.length
  )
    throw new Error('Invalid saved upgrades.');
  const cookies = value.cookies as number;
  const runEarned = value.runEarned as number;
  const totalEarned = value.totalEarned as number;
  if (cookies > runEarned || runEarned > totalEarned)
    throw new Error('Saved cookie totals are inconsistent.');
  return {
    cookies,
    totalEarned,
    runEarned,
    clicks: value.clicks as number,
    buildings: [...value.buildings],
    upgrades: [...value.upgrades],
    sugar: value.sugar,
    rebirths: value.rebirths,
    createdAt: value.createdAt,
    lastTick: value.lastTick,
    frenzyUntil: value.frenzyUntil,
    goldenClicks: value.goldenClicks as number,
  };
}

export function serialize(state: GameState): string {
  return JSON.stringify({ version: SAVE_VERSION, state: validateState(state) });
}

export function parseSave(source: string): GameState {
  if (typeof source !== 'string' || source.length > 100_000)
    throw new Error('Invalid save size.');
  const data: unknown = JSON.parse(source);
  if (!record(data) || data.version !== SAVE_VERSION)
    throw new Error('Unsupported save version.');
  return validateState(data.state);
}
