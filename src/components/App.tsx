import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  BUILDINGS,
  UPGRADES,
  production,
  clickPower,
  buildingCost,
  canBuyUpgrade,
  prestigeGain,
  achievements,
  serialize,
} from '../game/engine';
import { useBakery } from '../game/store';
import Icon from './Icon';

const number = (value: number, decimals = 0) =>
  value < 1e6
    ? value.toLocaleString('en-US', { maximumFractionDigits: decimals })
    : new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(value);
const NEWS = [
  'Local bakery opens. The neighborhood smells incredible.',
  'Scientists confirm: happiness is a warm cookie.',
  'Our quality control team would like another sample.',
  'The dough must go on. Fresh batches around the clock.',
  'Breaking: cookie economy continues to crumble upward.',
];
const ART = `${import.meta.env.BASE_URL}cookie.png`;
type Panel = 'achievements' | 'settings' | 'prestige' | 'stats' | null;

export default function App() {
  const {
    game,
    notice,
    saveStatus,
    recoverySave,
    advance,
    bake,
    buy,
    upgrade,
    rebirth,
    golden,
    save,
    resume,
    restore,
    reset,
    notify,
  } = useBakery();
  const [tab, setTab] = useState<'buildings' | 'recipes'>('buildings');
  const [quantity, setQuantity] = useState(1);
  const [panel, setPanel] = useState<Panel>(null);
  const [goldenUntil, setGoldenUntil] = useState(0);
  const [clickEffect, setClickEffect] = useState({
    key: 0,
    x: 50,
    y: 35,
    value: 1,
  });
  const [confirmReset, setConfirmReset] = useState(false);
  const [fileError, setFileError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const nextGolden = useRef(Date.now() + 45000);
  const rate = production(game),
    power = clickPower(game),
    badges = achievements(game);
  const totalBuildings = game.buildings.reduce((a, b) => a + b, 0),
    gain = prestigeGain(game);
  const isFrenzy = game.frenzyUntil > game.lastTick;
  const milestone =
    [100, 1000, 10000, 100000, 1e6, 1e7, 1e8, 1e9, 1e12, 1e15, 1e18, 1e21].find(
      (n) => n > game.runEarned,
    ) ?? game.runEarned * 2;

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      advance();
      const now = Date.now();
      if (now >= nextGolden.current) {
        setGoldenUntil(now + 12000);
        nextGolden.current = now + 90000 + Math.random() * 60000;
      }
      setGoldenUntil((previous) => (previous && previous < now ? 0 : previous));
    }, 250);
    const auto = window.setInterval(save, 5000);
    const visibility = () => {
      if (document.hidden) save();
      else resume();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', save);
    return () => {
      clearInterval(timer);
      clearInterval(auto);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', save);
    };
  }, [advance, save, resume]);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => notify(''), 6500);
    return () => clearTimeout(id);
  }, [notice, notify]);
  useEffect(() => {
    if (panel && !dialog.current?.open) dialog.current?.showModal();
    else if (!panel) dialog.current?.close();
  }, [panel]);
  useEffect(() => {
    document.title = `${number(Math.floor(game.cookies))} cookies · Cookie Foundry`;
  }, [Math.floor(game.cookies)]);

  const handleBake = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setClickEffect({
      key: clickEffect.key + 1,
      x: event.detail ? ((event.clientX - rect.left) / rect.width) * 100 : 50,
      y: event.detail ? ((event.clientY - rect.top) / rect.height) * 100 : 35,
      value: power,
    });
    bake();
  };
  const claim = () => {
    const mode = Math.random() < 0.5 ? 'frenzy' : 'lucky';
    golden(mode);
    setGoldenUntil(0);
    notify(
      mode === 'frenzy'
        ? 'Fresh from the oven! 7× production for 30 seconds.'
        : 'Lucky batch! A surprise cookie windfall has arrived.',
    );
  };
  const exportSave = () => {
    save();
    const url = URL.createObjectURL(
      new Blob([serialize(useBakery.getState().game)], {
        type: 'application/json',
      }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cookie-foundry-save.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Bakery backup exported. Keep it somewhere safe.');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="arcade-logo"
          href="https://arcade.fun"
          target="_blank"
          rel="noreferrer"
          aria-label="arcade.fun home"
        >
          <span className="arcade-mark">a</span>arcade<span>.fun</span>
        </a>
        <span className="header-divider" />
        <span className="game-wordmark">
          Cookie Foundry<span className="edition">THE BAKERY IS OPEN</span>
        </span>
        <div className="header-actions">
          <span className="save-state">
            <i />
            {saveStatus}
          </span>
          <button
            className="icon-button"
            onClick={() => setPanel('settings')}
            aria-label="Settings and save backups"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
      <main className="game-layout">
        <section
          className={`bakery-stage ${isFrenzy ? 'frenzy' : ''}`}
          aria-label="Your bakery"
        >
          <div className="stage-text">
            <div className="eyebrow">
              <span>✦</span> SMALL BATCH. BIG DREAMS.
            </div>
            <h1>
              A little cookie.
              <br />
              An endless empire.
            </h1>
            <p>Every great bakery starts with one good batch.</p>
          </div>
          <div className="cookie-bank">
            <span className="bank-number" data-testid="cookie-count">
              {number(Math.floor(game.cookies))}
            </span>
            <span className="bank-label">cookies in the jar</span>
            <div className="production">
              <i />
              <strong data-testid="production">{number(rate, 1)}</strong>{' '}
              cookies / second
            </div>
          </div>
          <div className="cookie-area">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="stage-spark spark-one">✧</span>
            <span className="stage-spark spark-two">✦</span>
            <span className="stage-spark spark-three">✧</span>
            <button
              className="big-cookie"
              onClick={handleBake}
              aria-label={`Bake cookies, ${number(power, 1)} per click`}
            >
              <img
                src={ART}
                alt="Golden chocolate chunk cookie"
                width="1254"
                height="1254"
                draggable="false"
              />
              {clickEffect.key > 0 ? (
                <span
                  key={clickEffect.key}
                  className="click-pop"
                  style={{
                    left: `${clickEffect.x}%`,
                    top: `${clickEffect.y}%`,
                  }}
                >
                  +{number(clickEffect.value, 1)}
                </span>
              ) : null}
            </button>
            {goldenUntil > 0 ? (
              <button
                className="golden-cookie"
                onClick={claim}
                aria-label="Catch the golden cookie bonus"
              >
                <Icon name="sparkle" size={28} />
                <span>Lucky batch!</span>
              </button>
            ) : null}
          </div>
          <div className="click-hint">
            <span className="keycap">
              <Icon name="cursor" size={14} />
            </span>
            click or tap to bake
            <span className="hint-value">+{number(power, 1)} / click</span>
          </div>
          {isFrenzy ? (
            <div className="frenzy-banner">
              <Icon name="bolt" size={16} />
              OVEN FRENZY
              <strong>
                7× production ·{' '}
                {Math.ceil((game.frenzyUntil - game.lastTick) / 1000)}s
              </strong>
            </div>
          ) : null}
          <div className="stage-bottom">
            <div className="milestone-label">
              <span>THE NEXT FRESH MILESTONE</span>
              <strong>{number(milestone)} cookies</strong>
            </div>
            <div className="progress-track">
              <i
                style={{
                  width: `${Math.min(100, (game.runEarned / milestone) * 100)}%`,
                }}
              />
            </div>
            <div className="stage-footnote">
              <Icon name="clock" size={13} />
              Your bakery works while you're away.
            </div>
          </div>
        </section>
        <section className="management" aria-label="Manage your bakery">
          <div className="management-top">
            <div>
              <div className="eyebrow cocoa">
                FROM YOUR FIRST BATCH TO THE STARS
              </div>
              <h2>Build something sweet.</h2>
            </div>
            <button
              className="text-button stats-button"
              onClick={() => setPanel('stats')}
            >
              Bakery stats
              <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="summary-row">
            <div>
              <Icon name="oven" />
              <p>
                <strong>{number(totalBuildings)}</strong>
                <span>busy bakers & buildings</span>
              </p>
            </div>
            <div>
              <Icon name="cookie" />
              <p>
                <strong>{number(game.totalEarned)}</strong>
                <span>cookies baked, ever</span>
              </p>
            </div>
            <button onClick={() => setPanel('achievements')}>
              <Icon name="trophy" />
              <p>
                <strong>
                  {badges.filter((b) => b.earned).length}
                  <small> / {badges.length}</small>
                </strong>
                <span>achievements</span>
              </p>
              <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="shop-controls">
            <div className="shop-tabs" role="group" aria-label="Bakery shop">
              <button
                aria-pressed={tab === 'buildings'}
                className={tab === 'buildings' ? 'active' : ''}
                onClick={() => setTab('buildings')}
              >
                Production line<span>{totalBuildings}</span>
              </button>
              <button
                aria-pressed={tab === 'recipes'}
                className={tab === 'recipes' ? 'active' : ''}
                onClick={() => setTab('recipes')}
              >
                Recipes<span>{game.upgrades.length}</span>
              </button>
            </div>
            {tab === 'buildings' ? (
              <div className="quantity" role="group" aria-label="Buy quantity">
                {[1, 10, 100].map((n) => (
                  <button
                    key={n}
                    aria-pressed={quantity === n}
                    className={quantity === n ? 'selected' : ''}
                    onClick={() => setQuantity(n)}
                  >
                    ×{n}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="shop-list">
            {tab === 'buildings'
              ? BUILDINGS.map((building, index) => {
                  if (!(
                    index < 4 ||
                    game.buildings[index] > 0 ||
                    game.totalEarned >= building.baseCost * 0.2 ||
                    game.buildings[index - 1] > 0
                  ))
                    return null;
                  const unitRate = production({
                    ...game,
                    buildings: BUILDINGS.map((_, i) => (i === index ? 1 : 0)),
                  });
                  const cost = buildingCost(game, index, quantity),
                    affordable = game.cookies >= cost;
                  return (
                    <button
                      key={building.id}
                      className={`building-row ${affordable ? 'affordable' : ''}`}
                      onClick={() => buy(index, quantity)}
                      disabled={!affordable}
                      aria-label={`Buy ${quantity} ${building.name} for ${number(cost)} cookies`}
                    >
                      <span className={`building-icon tier-${index % 5}`}>
                        <Icon name={building.icon} size={26} />
                      </span>
                      <span className="building-detail">
                        <span className="building-name">
                          {building.name}
                          <span className="owned-count">
                            {game.buildings[index]}
                          </span>
                        </span>
                        <span className="building-description">
                          {building.description}
                        </span>
                        <span className="building-output">
                          +{number(unitRate, unitRate < 1 ? 3 : 1)} cookies /
                          sec each
                        </span>
                      </span>
                      <span className="building-buy">
                        <span className="price">
                          <Icon name="cookie" size={14} />
                          {number(cost)}
                        </span>
                        <span className="buy-label">
                          {affordable ? `Buy ${quantity}` : 'Keep baking'}
                          <Icon
                            name={affordable ? 'arrow' : 'lock'}
                            size={12}
                          />
                        </span>
                      </span>
                    </button>
                  );
                })
              : UPGRADES.map((recipe) => {
                  const owned = game.upgrades.includes(recipe.id),
                    available = canBuyUpgrade(game, recipe.id);
                  return (
                    <button
                      className={`recipe-row ${owned ? 'recipe-owned' : ''}`}
                      key={recipe.id}
                      onClick={() => upgrade(recipe.id)}
                      disabled={owned || !available}
                      aria-label={`${recipe.name}, ${owned ? 'owned' : number(recipe.cost) + ' cookies'}`}
                    >
                      <span className="recipe-icon">
                        <Icon name={owned ? 'check' : recipe.icon} size={24} />
                      </span>
                      <span className="recipe-copy">
                        <strong>{recipe.name}</strong>
                        <span>{recipe.description}</span>
                        <small>
                          {owned ? 'In your recipe book' : recipe.requirement}
                        </small>
                      </span>
                      <span className="recipe-price">
                        {owned ? 'Learned' : number(recipe.cost)}
                        {!owned ? <small>cookies</small> : null}
                      </span>
                    </button>
                  );
                })}
            {tab === 'buildings' &&
            BUILDINGS.some(
              (b, i) =>
                i >= 4 &&
                game.totalEarned < b.baseCost * 0.2 &&
                !game.buildings[i] &&
                !game.buildings[i - 1],
            ) ? (
              <div className="future-note">
                <Icon name="sparkle" size={16} />
                <p>
                  A bigger world is waiting.
                  <span>Keep baking to discover new ways to make cookies.</span>
                </p>
              </div>
            ) : null}
          </div>
          <div className="recipe-teaser">
            <span className="recipe-teaser-icon">
              <Icon name="whisk" size={27} />
            </span>
            <div>
              <h3>A secret ingredient changes everything.</h3>
              <p>Learn recipes to make every click and every baker count.</p>
            </div>
            <button
              onClick={() =>
                setTab(tab === 'recipes' ? 'buildings' : 'recipes')
              }
              aria-label={
                tab === 'recipes' ? 'View production line' : 'Explore recipes'
              }
            >
              <Icon name="arrow" />
            </button>
          </div>
          <button
            className="prestige-card"
            onClick={() => setPanel('prestige')}
          >
            <span className="sugar-icon">
              <Icon name="star" size={21} />
            </span>
            <span>
              <strong>The sweetest fresh start</strong>
              <small>
                {gain > 0
                  ? `Reopen your bakery for +${number(gain)} sugar crystals`
                  : `Bake ${number(Math.max(0, 1e6 - game.runEarned))} more to unlock sugar crystals`}
              </small>
            </span>
            <span className="sugar-count">
              {number(game.sugar)}
              <Icon name="arrow" size={16} />
            </span>
          </button>
        </section>
      </main>
      <footer className="footer">
        <span className="news-label">THE COOKIE CHRONICLE</span>
        <span className="news-copy">
          {
            NEWS[
              Math.max(
                0,
                Math.min(
                  NEWS.length - 1,
                  Math.floor(Math.log10(Math.max(1, game.runEarned))) - 1,
                ),
              )
            ]
          }
        </span>
        <button onClick={() => setPanel('settings')}>
          Made for arcade.fun
          <Icon name="cookie" size={14} />
        </button>
      </footer>
      {notice ? (
        <div className="toast" role="status">
          <Icon name="check" size={18} />
          <span>{notice}</span>
          <button onClick={() => notify('')} aria-label="Dismiss notification">
            <Icon name="close" size={16} />
          </button>
        </div>
      ) : null}
      <dialog
        ref={dialog}
        className="modal"
        onClose={() => {
          setPanel(null);
          setConfirmReset(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPanel(null);
        }}
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close icon-button"
          onClick={() => {
            setPanel(null);
            setConfirmReset(false);
          }}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
        <div className="eyebrow cocoa">COOKIE FOUNDRY</div>
        <h2 id="modal-title">
          {panel === 'achievements'
            ? 'A batch of proud moments.'
            : panel === 'prestige'
              ? 'Begin again. Bake bigger.'
              : panel === 'stats'
                ? 'Your bakery, by the numbers.'
                : 'A little housekeeping.'}
        </h2>
        {panel === 'achievements' ? (
          <div className="achievements">
            {badges.map((b) => (
              <div
                key={b.id}
                className={b.earned ? 'achievement earned' : 'achievement'}
              >
                <Icon name={b.earned ? 'trophy' : 'lock'} size={22} />
                <span>
                  <strong>{b.name}</strong>
                  <small>{b.description}</small>
                </span>
                {b.earned ? <Icon name="check" size={16} /> : null}
              </div>
            ))}
          </div>
        ) : null}
        {panel === 'stats' ? (
          <>
            <div className="stats-grid">
              {[
                ['Cookies in the jar', number(game.cookies)],
                ['Cookies baked, ever', number(game.totalEarned)],
                ['Baked this run', number(game.runEarned)],
                ['Cookies per second', number(rate, 1)],
                ['Cookies per click', number(power, 1)],
                ['Hand-baked clicks', number(game.clicks)],
                ['Golden batches caught', number(game.goldenClicks)],
                ['Sugar crystals', number(game.sugar)],
                ['Fresh starts', number(game.rebirths)],
                ['Permanent bonus', `${number(game.sugar * 5)}%`],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <p className="fine-print">
              Started {new Date(game.createdAt).toLocaleDateString()}. Export a
              backup before switching devices.
            </p>
          </>
        ) : null}
        {panel === 'prestige' ? (
          <div className="prestige-dialog">
            <span className="large-star">
              <Icon name="star" size={48} />
            </span>
            <p>
              Trade this bakery for sugar crystals. Each crystal gives{' '}
              <strong>+5% permanent production and click power</strong> for all
              future bakeries.
            </p>
            <div className="prestige-reward">
              <span>YOUR NEXT FRESH START</span>
              <strong>+{number(gain)} sugar crystals</strong>
              <small>
                {gain > 0
                  ? `${number((game.sugar + gain) * 5)}% total permanent bonus after reopening`
                  : 'Unlock your first crystal at 1 million cookies baked this run'}
              </small>
            </div>
            <p className="fine-print">
              Reopening resets cookies, buildings, recipes and run earnings.
              Your crystals, lifetime totals and lifetime achievements stay with
              you.
            </p>
            <button
              className="primary-button"
              disabled={gain < 1}
              onClick={() => {
                rebirth();
                setPanel(null);
                notify(
                  'A sweet fresh start. Your sugar crystals are boosting your new bakery.',
                );
              }}
            >
              Reopen the bakery
              <Icon name="arrow" size={18} />
            </button>
          </div>
        ) : null}
        {panel === 'settings' ? (
          <>
            <p className="modal-intro">
              Autosaved every 5 seconds on this device. Your bakers earn 50% of
              normal production while you're away, for up to 8 hours.
            </p>
            <p className="fine-print">
              Import replaces this bakery. Export a backup first.
            </p>
            {recoverySave !== null ? (
              <div className="recovery-note">
                <p>
                  Your original save could not be read. It is preserved until
                  you import a working backup or reset this bakery.
                </p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    const url = URL.createObjectURL(
                      new Blob([recoverySave], { type: 'application/json' }),
                    );
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'cookie-foundry-original-save.json';
                    link.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }}
                >
                  Export original save
                </button>
              </div>
            ) : null}
            <div className="save-tools">
              <button className="primary-button" onClick={exportSave}>
                <Icon name="download" size={18} />
                Export backup
              </button>
              <button
                className="secondary-button"
                onClick={() => file.current?.click()}
              >
                <Icon name="upload" size={18} />
                Import backup
              </button>
            </div>
            <input
              ref={file}
              type="file"
              accept=".json,application/json"
              className="visually-hidden"
              aria-label="Import bakery save file"
              onChange={async (e) => {
                const selected = e.target.files?.[0];
                if (!selected) return;
                const input = e.currentTarget;
                try {
                  if (selected.size > 100000)
                    throw new Error('Backup is too large.');
                  restore(await selected.text());
                  setFileError('');
                } catch (error) {
                  setFileError(
                    error instanceof Error
                      ? error.message
                      : 'That backup could not be read.',
                  );
                }
                input.value = '';
              }}
            />
            {fileError ? (
              <p role="alert" className="error-message">
                {fileError}
              </p>
            ) : null}
            <div className="how-to">
              <h3>A recipe for success</h3>
              <p>
                Tap the cookie. Buy production. Learn recipes. Catch the golden
                batch when it appears. At one million cookies baked in a run,
                reopen with sugar crystals for a permanent boost.
              </p>
              <p>
                Use ×10 or ×100 to buy several buildings at once. Keyboard
                players can focus the cookie and press Space or Enter.
              </p>
            </div>
            <div className="credits">
              <h3>Made with a little open-source magic.</h3>
              <p>
                Cookie Foundry is an original bakery adaptation of{' '}
                <a
                  href="https://github.com/remarkablegames/button-clicker"
                  target="_blank"
                  rel="noreferrer"
                >
                  Button Clicker by Mark Xu
                </a>
                , under the MIT license. Original cookie artwork generated for
                this game.
              </p>
              <a
                href="https://github.com/theguysaccount/cookie-foundry"
                target="_blank"
                rel="noreferrer"
              >
                View source & credits ↗
              </a>
            </div>
            <div className="danger-zone">
              {confirmReset ? (
                <>
                  <p>
                    This permanently erases this browser's bakery, including
                    sugar crystals. Export a backup first.
                  </p>
                  <button
                    className="danger-button"
                    onClick={() => {
                      reset();
                      setPanel(null);
                      setConfirmReset(false);
                    }}
                  >
                    Erase bakery and start over
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setConfirmReset(false)}
                  >
                    Keep my bakery
                  </button>
                </>
              ) : (
                <button
                  className="text-button"
                  onClick={() => setConfirmReset(true)}
                >
                  Reset bakery progress…
                </button>
              )}
            </div>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
