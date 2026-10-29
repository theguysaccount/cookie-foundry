# Cookie Foundry modifications

Upstream: https://github.com/remarkablegames/button-clicker
Pinned upstream revision: 83155b439e64c6b9ebea32fb40f8cbac9557e59d
Fork: https://github.com/theguysaccount/cookie-foundry
License: MIT; upstream copyright retained verbatim in LICENSE.

Retained the original 16-generator cost/output progression, exponential price curve and calculateNextCost helper. Replaced the generic table interface with a responsive original bakery game. Replaced per-generator persisted timers and mutable split stores with an immutable tested economy and one clock, with throttled versioned persistence. Added recipes, guarded bulk transactions, golden events, achievements, sugar-crystal prestige, offline production and backup tools. Removed upstream Google Analytics integration and GitHub-corner CDN script; all runtime resources are local. Replaced generic artwork/branding with Cookie Foundry artwork and copy. MIT attribution is visible in the in-game settings.

The living bakery visual upgrade adds an original illustrated backdrop, a 16-building sprite atlas, responsive bakery floors, construction feedback, click crumbs and orbiting Busy whisk helpers. Each floor is derived from actual owned inventory and grows as units are purchased. Rendering is capped at 8 units per building type (128 floor units total) and 12 orbiting helpers; extra owned units are represented by counts. An animation toggle persists separately under `arcade.cookie-foundry.motion`, and the interface respects the operating system's reduced-motion preference.

This visual upgrade does not change the engine, store, prices, production, game save key (`arcade.cookie-foundry.v1`) or version 1 save/backup schema. Generated original PNGs are preserved in `art-source/`; same-dimension optimized WebP copies are used at runtime. Asset provenance and exact generation/refinement prompts are recorded in ASSETS.md and public/art/PROMPTS.md.
