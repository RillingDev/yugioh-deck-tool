# YuGiOh Deck Tool

> A tool to view deck prices, share and edit decks, create random decks and much more

## Introduction

A tool to view deck prices, share and edit decks, create random decks and much more.

Live version: <https://ygoprodeck.com/card-database/deck-prices/>.

## Development

### Modules

-   `core` Shared business logic and communication with the [YGOProDeck API](https://db.ygoprodeck.com/api-guide/).
-   `ui` Shared UI logic/styling requiring a browser.
-   `application` Vue app source code.
-   `tooltip` Card tooltip.

### Dependency Tree

```text
        core                // Shared code independent of platform.
         ^
         |
         |
         ui                 // Shared code requiring Browser/DOM.
        ^  ^
       /    \
      /      \
     /        \
application  tooltip        // Browser entry points.
```

### Scripts

-   `serve` in _application_ to develop.
-   `build` in _application_ to build. Output from application/dist contains all required files.
-   `test` in _non-application modules_ to compile and run tests.

#### Build output.

-   `common.js` contains code required for both the tooltip and the deck-tool to work, **and has to be loaded before these**.
-   `app.js` and `app.css` contain code for the actual deck-tool.
-   `tooltip.js` and `tooltip.css` contain code for the tooltips.
-   `index.html` contains a basic setup loading the aforementioned files and starts the deck-tool with tooltips.

The `.map` files are optional and only used for debugging.
