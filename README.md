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
2. Execute `npm i` inside the cloned directory to install dependencies.
3. Execute `npm run dev` inside the cloned directory to start the development server.

If you are ready to deploy the application, build it by executing `npm run build`.

#### Build Output

-   `tooltip.js` and `tooltip.css` contain code for the tooltips.
-   `app.js` and `app.css` contain code for the actual deck-tool.
-   `index.html` contains a basic setup loading the these files and starts the deck-tool with tooltips.

The `.map` files are optional and only used for debugging.

### Architecture

See [Architecture.md](./ARCHITECTURE.md).

## API

### JavaScript

The tooltip and the application instances expose an API that can be interacted with via JavaScript.
See `./src/tooltip/api.ts` and `./src/application/api.ts` for their documentation.

### URL Parameters

When the application starts, it checks for the existence of the `y` URL query parameter. If it is present, it will be parsed as the data portion of a [YDKE](https://github.com/edo9300/edopro/issues/171) URI with an optional deck name at the end of it. The parsed data will then be loaded as the active deck.

## YGOPRODeck Exclusive Features

The following features are only available when the tool is running on <https://ygoprodeck.com/>.

-   Showing only cards in your collection

## Credits

-   Thanks to Alan from <https://ygoprodeck.com/> for providing the API for all card data, as well as supporting the development.
-   Thanks to the awesome people at <https://github.com/edo9300/edopro> for the great duel simulator that this application is inspired by.

## License

Please check the `LICENSE` file for details.

Yu-Gi-Oh! is a trademark of Shueisha and Konami. This project is not affiliated with or endorsed by Shueisha or Konami.
