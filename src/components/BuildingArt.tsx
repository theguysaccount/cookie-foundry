import { memo } from 'react';
import type { CSSProperties } from 'react';

const atlas = `${import.meta.env.BASE_URL}art/bakery-units.webp`;

const BuildingArt = memo(function BuildingArt({
  index,
  className = '',
}: {
  index: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`unit-art ${className}`}
      style={{
        backgroundImage: `url(${atlas})`,
        backgroundPosition: `${((index % 4) / 3) * 100}% ${(Math.floor(index / 4) / 3) * 100}%`,
      }}
    />
  );
});
export default BuildingArt;

export function CookieHelpers({ count }: { count: number }) {
  const visible = Math.min(12, Math.max(0, Math.floor(count)));
  return (
    <div
      className="cookie-helpers"
      aria-hidden="true"
      data-testid="cookie-helpers"
      data-owned-count={count}
    >
      {Array.from({ length: visible }, (_, i) => (
        <span
          key={i}
          className="orbiting-helper"
          style={
            { '--helper-angle': `${(360 / visible) * i}deg` } as CSSProperties
          }
        >
          <span className="helper-upright">
            <BuildingArt index={0} />
          </span>
        </span>
      ))}
    </div>
  );
}

export function CookieCrumbs({ serial }: { serial: number }) {
  if (!serial) return null;
  return (
    <span key={serial} className="crumb-burst" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <i
          key={i}
          style={
            {
              '--crumb-angle': `${i * 51.4}deg`,
              '--crumb-distance': `${62 + (i % 3) * 19}px`,
              '--crumb-delay': `${i * 0.012}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
