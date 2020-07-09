# YuGiOh Deck-Tool

> A tool to view deck prices, share and edit decks, create random decks and much more

## Introduction

A tool to view deck prices, share and edit decks, create random decks and much more.

Live version: <https://ygoprodeck.com/card-database/deck-prices/>.

## Development

### Setup

Prerequisites:

-   Git
-   Node.js & npm

Then perform the following steps:

1. Clone the repository.
2. Execute `npm run setup` inside the cloned directory.
3. Execute `serve` in `./packages/application`.

### NPM Scripts

-   `serve` in _application_ to develop.
-   `test` to compile and run tests.
-   `build` to build production files.

#### Build output.

-   `common.js` contains code required for both the tooltip and the deck-tool to work, **and has to be loaded before these**.
-   `app.js` and `app.css` contain code for the actual deck-tool.
-   `tooltip.js` and `tooltip.css` contain code for the tooltips.
-   `index.html` contains a basic setup loading the aforementioned files and starts the deck-tool with tooltips.

The `.map` files are optional and only used for debugging.

### Modules

-   `core` Shared business logic and communication with the [YGOProDeck API](https://db.ygoprodeck.com/api-guide/).
-   `ui` Shared UI logic/styling requiring a browser.
-   `application` Vue app source code.
-   `tooltip` Card tooltip.

#### Dependency Tree

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

## Credits

-   Thanks to Alan from <https://ygoprodeck.com/> for providing the API for all card data, as well as supporting the development.
-   Thanks to the awesome people at <https://github.com/edo9300/edopro> for the great duel simulator that this application is inspired by.

## License

Please check the `LICENSE` file for details.

Yu-Gi-Oh! is a trademark of Shueisha and Konami. This project is not affiliated with or endorsed by Shueisha or Konami.
