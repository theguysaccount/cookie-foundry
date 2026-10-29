const paths: Record<string, string> = {
  cookie:
    'M21 11.4A9 9 0 1 1 12.6 3a4 4 0 0 0 5 5 4 4 0 0 0 3.4 3.4M8 9h.01M7 14h.01M12 16h.01M14 11h.01',
  cursor: 'm5 3 14 9-7 1-3 7-4-17Zm7 10 4 7',
  oven: 'M4 4h16v17H4zM4 9h16M8 13h8v5H8zM8 6h.01M12 6h.01M16 6h.01',
  whisk: 'm14 10 6-7M8 20c-7-4-3-11 3-9 6 2 5 9-3 9Zm0 0 3-9M8 20l6-6',
  leaf: 'M20 3C9 2 2 7 5 15c8 5 15-1 15-12ZM4 21l11-12',
  farm: 'm3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7M9 7h6',
  factory: 'M3 21V9l6 4V9l6 4V3h5v18H3ZM7 17h1m4 0h1m4 0h1',
  truck:
    'M3 5h11v13H3zM14 10h4l3 4v4h-7M8 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  rocket:
    'M14 4c3-2 6-1 6-1s1 3-1 6l-8 8-5-5 8-8ZM6 12H3l3-6h6m-1 11v4l6-4v-6M4 17l-1 4 4-1M15 8h.01',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  sparkle: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  check: 'm5 12 4 4L19 6',
  settings:
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3Z',
  trophy:
    'M8 3h8v9a4 4 0 0 1-8 0V3ZM8 5H3v3a5 5 0 0 0 5 5m8-8h5v3a5 5 0 0 1-5 5m-4 3v5m-4 0h8',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  bolt: 'm14 2-10 12h7l-1 8L20 10h-7l1-8Z',
  globe:
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
  lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4m-4 5v2',
  close: 'm6 6 12 12M6 18 18 6',
  download: 'M12 3v12m-4-4 4 4 4-4M4 15v6h16v-6',
  upload: 'M12 15V3m-4 4 4-4 4 4M4 15v6h16v-6',
};
const aliases: Record<string, string> = {
  '🥄': 'whisk',
  '👩‍🍳': 'cookie',
  '🔥': 'oven',
  '🌾': 'farm',
  '🛠️': 'whisk',
  '🏭': 'factory',
  '🧪': 'sparkle',
  '🎈': 'truck',
  '🌙': 'globe',
  '🌀': 'globe',
  '⭐': 'star',
  '⏳': 'clock',
  '☁️': 'sparkle',
  '🌌': 'rocket',
  '⚛️': 'globe',
  '♾️': 'globe',
  '✨': 'sparkle',
  '🥣': 'whisk',
  '⚡': 'bolt',
  '🧤': 'cursor',
  '🌡️': 'oven',
  '⚙️': 'factory',
  '🌃': 'star',
  '🏆': 'trophy',
  '📖': 'cookie',
  '🔬': 'sparkle',
  '🌠': 'star',
};
export default function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[aliases[name] ?? name] ?? paths.sparkle} />
    </svg>
  );
}
