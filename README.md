# Yu-Gi-Oh! Deck-Tool

> A tool to share and edit decks, view deck prices, and much more.

## Introduction

The live version can be found on [YGOPRODeck](https://ygoprodeck.com/card-database/deck-prices/).

## Development

### Setup

Prerequisites:

-   Git
-   Node.js
-   NPM

Then perform the following steps:

1. Clone the repository.
2. Execute `npm ci` inside the cloned directory.
3. Execute `npm run serve` inside the cloned directory.

#### Build Output

-   `common.js` contains code required for both the tooltip and the deck-tool to work, **and has to be loaded before these**.
-   `tooltip.js` and `tooltip.css` contain code for the tooltips.
-   `app.js` and `app.css` contain code for the actual deck-tool.
-   `index.html` contains a basic setup loading the aforementioned files and starts the deck-tool with tooltips.

The `.map` files are optional and only used for debugging.

### Architecture

See [Architecture.md](./ARCHITECTURE.md).

## JS API

Both tooltip and application instances expose an API that can be interacted with via JavaScript. See `./src/tooltip/api.ts` and `./src/application/api.ts` for their documentation.

## Credits

-   Thanks to Alan from <https://ygoprodeck.com/> for providing the API for all card data, as well as supporting the development.
-   Thanks to the awesome people at <https://github.com/edo9300/edopro> for the great duel simulator that this application is inspired by.

## License

Please check the `LICENSE` file for details.

Yu-Gi-Oh! is a trademark of Shueisha and Konami. This project is not affiliated with or endorsed by Shueisha or Konami.
