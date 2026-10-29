# Cookie Foundry generated artwork

Generated on 2026-10-28 using the built-in image_gen tool. No fallback CLI or API mode was used. These images are original graphics created for Cookie Foundry.

## Assets

- Original `art-source/bakery-units.png`: 1254 × 1254 RGBA PNG. Transparent 4 × 4 sprite atlas. Read columns and rows left to right, top to bottom. Tiles use equal quarters of the complete canvas, with CSS percentage positioning. Runtime copy: `public/art/bakery-units.webp`.
- Original `art-source/bakery-backdrop.png`: 1536 × 1024 RGB PNG. Opaque warm bakery interior. Runtime copy: `public/art/bakery-backdrop.webp`.

The optimized WebP runtime copies preserve the source pixel dimensions, and the atlas retains alpha transparency. Original PNGs remain in `art-source/` for future art work. The exact prompts below are retained without rewriting.

Visually inspected both assets at full canvas scale. Atlas contains all sixteen requested subjects in the correct order, with consistent art treatment and transparency. A spacing refinement separated the silhouettes further. Backdrop has clear dark middle-left space and a broad counter along the bottom.

The game displays atlas sprites in the shop and in production floors derived from actual owned inventory. Each of the 16 building types can show up to 8 floor units, and up to 12 owned Busy whisk helpers orbit the cookie. Extra inventory uses count labels. Animation can be disabled with the separate `arcade.cookie-foundry.motion` preference and also respects the operating system's reduced-motion preference. This presentation does not change the engine, store or version 1 save format.

## Atlas tile order

1. Magical whisk
2. Home baker
3. Brick oven
4. Butter farm
5. Dough workshop
6. Cookie factory
7. Flavor lab
8. Bakery airship
9. Moon bakery
10. Pantry portal
11. Starlight oven
12. Time kneader
13. Dream kitchen
14. Galaxy flour mill
15. Quantum bakery
16. Infinity foundry

## Initial atlas prompt

Use case: stylized-concept
Asset type: production sprite atlas for an original premium cozy casual cookie incremental game.
Primary request: Create one square PNG canvas containing exactly sixteen separate game object illustrations, arranged in a perfectly even 4 by 4 atlas grid. The entire canvas is divided into sixteen equal square tiles, no gutters, no borders, no grid lines. Each object is centered in its own tile, fully visible, within the central 80 percent of its tile, all tiles the same size. No object crosses into another tile.
Tile subjects, in strict row-major order left to right, top to bottom:
Row 1: 1 magical whisk mixing cookie dough in a bowl; 2 friendly home baker in orange apron and chef hat holding a cookie tray; 3 warm glowing brick oven; 4 butter farm tiny barn with a cow.
Row 2: 5 dough workshop with rolling pin and dough counter; 6 whimsical cookie factory with chimneys; 7 flavor laboratory with violet glass flasks; 8 bakery airship carrying cookie cargo.
Row 3: 9 moon bakery in glass dome on lunar rock; 10 pantry portal, glowing teal ring with cookies; 11 starlight oven containing a star; 12 time kneader, a brass clockwork dough mixer.
Row 4: 13 dream kitchen floating on a cloud; 14 galaxy flour mill with spiral stars; 15 quantum bakery with atom rings; 16 infinity foundry with a golden infinity loop.
Style/medium: Consistent premium hand-painted casual game illustrations with warm caramel outlines, slightly isometric three-quarter front view, charming toy-like forms, illustrated details but bold silhouettes readable when each icon is rendered at 64 pixels. Cohesive warm honey, butter gold, copper and cocoa palette with small teal and violet magical accents.
Lighting/mood: Warm inviting golden light, gentle magical highlights.
Background: Actual transparent alpha background, transparent in every tile, no floor, no backdrop.
Constraints: Exactly 4 rows and 4 columns and exactly 16 individual objects. No text, no letters, no labels, no logos, no watermarks. No external drop shadows. Keep every full object inside its tile. All sixteen subjects equally prominent, not a sheet with tiny varying cells.

## Atlas spacing refinement prompt

The initial atlas was used as the local image edit target. The final asset is the result of this refinement:

Use case: precise-object-edit
Asset type: production transparent 4 by 4 game sprite atlas.
Edit target: the attached atlas. Keep the same sixteen beautifully painted cookie bakery illustrations, same style, subjects, color palette, and row-major order unchanged. Fix only atlas spacing and containment: make a perfectly square canvas divided into exactly 4 equal columns by 4 equal rows, and reduce every entire illustration uniformly to fit inside the central 72 percent of its own equal square cell. Each entire icon must be centered on its cell and fully visible with at least 14 percent transparent padding on all four sides. Transparent padding is essential for CSS sprites, including around all magic glow, smoke, stars, and clouds. Keep all pixels of each object and its effects inside its cell. No gridlines, no labels, no text, no border. Background must be actual transparent alpha. Do not crop the output to the objects; preserve a full square canvas with transparent perimeter padding.

## Backdrop prompt

Use case: stylized-concept
Asset type: panoramic background environment illustration for original premium cozy cookie incremental game, landscape 3:2 or 16:9 composition.
Primary request: A cozy magical cookie bakery interior, beautifully hand-painted casual game world with chunky walnut ceiling beams, glowing copper and brick ovens along the back and right walls, flour sacks, hanging copper pans, soft amber windows, deep cocoa shadows and warm golden shafts of light. The lower half is a clear broad wooden counter or floor with gentle warm texture, and center-left is darker uncluttered negative space where the game will overlay a giant cookie. Do not draw a giant cookie. Decorate top and sides tastefully while maintaining a large quiet central area. No characters.
Style/medium: Rich premium illustrated fantasy bakery game environment, warm caramel outlines, charming toy-like three-quarter front view forms, slightly painterly natural texture, coherent honey, butter gold, copper and cocoa palette with restrained teal magical highlights. Detailed and inviting, polished game concept art.
Lighting/mood: Deep warm brown ambient shadows, ovens glow amber orange, soft amber windows, subtle magical motes.
Constraints: Wide landscape canvas, opaque full background, no UI, no text, no letters, no logos, no watermark, no border, no characters, no giant cookie. Usable as a game scene behind overlays; keep middle-left dark and lower half broadly clear.

