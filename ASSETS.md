# Original artwork

All generated artwork was created for Cookie Foundry with the built-in image_gen tool. No Cookie Clicker artwork was supplied or copied. Runtime assets are local; no external image service is needed to play.

## Central cookie

`public/cookie.png` is original artwork generated for Cookie Foundry with the built-in image_gen tool, transparent-background mode. No reference image or Cookie Clicker artwork was supplied. Dimensions: 1254 × 1254, PNG with alpha.

Final generation prompt:

> Use case: stylized-concept. Asset type: original central clickable game asset for Cookie Foundry on arcade.fun. Primary request: One delicious round chocolate chip cookie, isolated on a genuinely transparent background, created as an original game asset. Subject: A single thick golden-brown baked cookie with appetizing hand-shaped ridges and craggy surface, dark chocolate chunks distributed naturally, and a slightly irregular round silhouette. Style/medium: Premium stylized 3D clay/product illustration, playful polished casual-game rendering with rich tactile detail, soft rounded forms. Composition/framing: Square canvas, cookie perfectly centered, face fully visible straight-on from above, enough clear margin to show the entire cookie. The cookie fills about 84 percent of the canvas width. No other objects. Lighting/mood: Warm soft studio light from upper-left, cozy bakery mood, gentle form shading within the cookie. Materials/textures: Golden baked edges, buttery biscuit texture, large dark chocolate chunks with subtle sheen. Constraints: Actual transparent alpha background, full cookie fully visible, no plate, no hands, no table, no floor, no text, no logo, no watermark, no floating crumbs, no cast shadow beyond the cookie silhouette. Designed to look beautiful over a dark cocoa and cream bakery interface.

## Living bakery artwork

The bakery atlas and backdrop were generated on 2026-10-28. The atlas spacing was refined using its own initial generated image as the edit target. No third-party reference image was used. Exact initial, refinement and backdrop prompts are preserved in [public/art/PROMPTS.md](public/art/PROMPTS.md).

| Original source | Runtime asset | Dimensions and content |
| --- | --- | --- |
| `art-source/bakery-units.png` | `public/art/bakery-units.webp` | 1254 × 1254, alpha transparency; 16 building illustrations in a 4 × 4 row-major atlas |
| `art-source/bakery-backdrop.png` | `public/art/bakery-backdrop.webp` | 1536 × 1024, opaque illustrated bakery interior |

WebP copies are optimized format conversions at the original pixel dimensions. The original PNGs are retained for further art work. The atlas provides a distinct sprite for every building, from the magical whisk to the infinity foundry, and supplies both the shop icons and production-floor units. The backdrop supplies the warm timber-and-copper bakery setting.

Animated floors appear only for owned building types and show up to 8 units per type, with the remaining count displayed separately. Up to 12 owned Busy whisk helpers orbit the central cookie. CSS animates the original sprites and scene effects; the motion toggle and operating system reduced-motion preference disable animation. These assets and effects do not alter the economy or version 1 save format.

## Other interface resources

Utility interface icons are original simple code-native line drawings. Fonts are the device's system fonts and Georgia. No third-party font or sound assets are shipped.
