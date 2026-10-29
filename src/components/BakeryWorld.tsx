import type { CSSProperties } from 'react';
import type { GameState } from '../game/engine';
import { visualRows } from '../game/visuals';
import '../bakery-world.css';

const UNIT_ART = `${import.meta.env.BASE_URL}art/bakery-units.webp`;
const BACKDROP_ART = `${import.meta.env.BASE_URL}art/bakery-backdrop.webp`;
const integer = new Intl.NumberFormat('en-US');
const FLOOR_NOTES = [
  'A little whisk. A lot of hustle.',
  'Made with love. And extra butter.',
  'The warmest corner of the bakery.',
  'Sunshine in. Fresh butter out.',
  'Roll. Fold. Repeat. Delicious.',
  'Another batch, down the line.',
  'A very delicious experiment.',
  'Delivering happiness above the clouds.',
  'Small steps. Giant batches.',
  'The pantry goes on forever.',
  'Baked at the heart of a star.',
  'Tomorrow’s batch is ready early.',
  'Sweet dreams come freshly baked.',
  'Grinding stardust into sprinkles.',
  'Every possible flavor, at once.',
  'The last batch is only the beginning.',
];

type WorldStyle = CSSProperties & Record<`--${string}`, string | number>;

export function BakeryWorld({ game }: { game: GameState }) {
  const rows = visualRows(game.buildings);
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return (
    <section
      id="living-bakery"
      className="bakery-world"
      aria-label="Your living bakery"
      data-testid="bakery-world"
    >
      <header className="world-heading">
        <div>
          <span className="world-kicker">FROM DOUGH TO A DREAM</span>
          <h2>
            Your bakery, alive<span aria-hidden="true">.</span>
          </h2>
        </div>
        <span className={`world-status ${total ? 'is-working' : ''}`}>
          <i aria-hidden="true" />
          {total ? 'BAKING AWAY' : 'LIGHTS ON'}
        </span>
      </header>
      <div
        className="world-window"
        style={{ backgroundImage: `url("${BACKDROP_ART}")` }}
        aria-hidden="true"
      >
        <div className="world-window-shade" />
        <div className="world-hanging-sign">
          <span>COOKIE FOUNDRY</span>
          <strong>freshly baked dreams</strong>
        </div>
        <span className="world-dust world-dust-one" />
        <span className="world-dust world-dust-two" />
        <span className="world-dust world-dust-three" />
      </div>
      <div className="world-ledger">
        <span>
          <i aria-hidden="true" />
          {total
            ? `${integer.format(total)} ${total === 1 ? 'workstation' : 'workstations'} at work`
            : 'Your first chapter starts here'}
        </span>
        <strong>
          {rows.length ? `${rows.length} / 16 floors` : 'EST. TODAY'}
        </strong>
      </div>
      {rows.length ? (
        <ul
          className="world-floors"
          aria-label="Owned bakery production floors"
        >
          {rows.map((row) => (
            <li
              className={`world-floor world-floor--${row.theme}`}
              key={row.id}
              id={`bakery-floor-${row.id}`}
              data-building-id={row.id}
              data-testid={`bakery-row-${row.id}`}
              data-count={row.count}
              data-owned-count={row.count}
              style={{ '--visible-units': row.visibleUnits } as WorldStyle}
            >
              <div className="world-floor-heading">
                <div>
                  <span className="world-floor-number">
                    {String(row.index + 1).padStart(2, '0')}
                  </span>
                  <h3>{row.name}</h3>
                </div>
                <span
                  className="world-owned"
                  aria-label={`${integer.format(row.count)} ${row.name} owned`}
                >
                  ×{integer.format(row.count)}
                </span>
              </div>
              <div className="world-floor-scene" aria-hidden="true">
                <div className="world-floor-light" />
                <div className="world-rail" />
                <div className="world-units">
                  {Array.from({ length: row.visibleUnits }, (_, unit) => (
                    <span
                      className="world-unit"
                      data-unit-id={`${row.id}-${unit}`}
                      key={`${row.id}-${unit}`}
                      style={
                        {
                          '--unit': unit,
                          '--phase': `${unit * -0.63}s`,
                        } as WorldStyle
                      }
                    >
                      <span
                        className="world-sprite"
                        style={{
                          backgroundImage: `url("${UNIT_ART}")`,
                          backgroundPosition: `${row.spriteX}% ${row.spriteY}%`,
                        }}
                      />
                      <span className="world-unit-shadow" />
                    </span>
                  ))}
                </div>
                <div className="world-effects">
                  <i />
                  <i />
                  <i />
                </div>
                {row.overflow > 0 ? (
                  <span className="world-more">
                    +{integer.format(row.overflow)} more at work
                  </span>
                ) : null}
              </div>
              <p className="world-floor-note">
                {FLOOR_NOTES[row.index]}
                <span aria-hidden="true">✦</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="world-empty">
          <div className="world-empty-illustration" aria-hidden="true">
            <span
              className="world-empty-sprite"
              style={{ backgroundImage: `url(${UNIT_ART})` }}
            />
          </div>
          <span className="world-kicker">ROOM FOR SOMETHING WONDERFUL</span>
          <h3>
            A little kitchen.
            <br />
            An endless possibility.
          </h3>
          <p>
            Buy your first Busy whisk to bring this bakery to life. Every new
            helper will appear right here.
          </p>
          <span className="world-empty-arrow" aria-hidden="true">
            THE FIRST BATCH AWAITS <span>↗</span>
          </span>
        </div>
      )}
      <footer className="world-footer">
        <span aria-hidden="true">✦</span> Every purchase adds a little more
        life.
      </footer>
    </section>
  );
}

export default BakeryWorld;
