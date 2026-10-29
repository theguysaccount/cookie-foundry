# Cookie Foundry modifications

Upstream: https://github.com/remarkablegames/button-clicker
Pinned upstream revision: 83155b439e64c6b9ebea32fb40f8cbac9557e59d
Fork: https://github.com/theguysaccount/cookie-foundry
License: MIT; upstream copyright retained verbatim in LICENSE.

Retained the original 16-generator cost/output progression, exponential price curve and calculateNextCost helper. Replaced the generic table interface with a responsive original bakery game. Replaced per-generator persisted timers and mutable split stores with an immutable tested economy and one clock, with throttled versioned persistence. Added recipes, guarded bulk transactions, golden events, achievements, sugar-crystal prestige, offline production and backup tools. Removed upstream Google Analytics integration and GitHub-corner CDN script; all runtime resources are local. Replaced generic artwork/branding with Cookie Foundry artwork and copy. MIT attribution is visible in the in-game settings.
