# YuGiOh Deck-Tool

> A tool to view deck prices, share and edit decks, create random decks and much more

## Introduction

A tool to view deck prices, share and edit decks, create random decks and much more.

Live version: <https://ygoprodeck.com/card-database/deck-prices/>.

## Development

### Setup

Prerequisites:

- Git
- Node.js
- yarn

Then perform the following steps:

1. Clone the repository.
2. Execute `npm run setup` inside the cloned directory.
3. Execute `serve` in `./packages/application`.

#### NPM Scripts

- `serve` in _application_ to develop.
- `test` to compile and run tests.
- `build` to build production files.

#### Build Output

- `common.js` contains code required for both the tooltip and the deck-tool to work, **and has to be
  loaded before these**.
- `app.js` and `app.css` contain code for the actual deck-tool.
- `tooltip.js` and `tooltip.css` contain code for the tooltips.
- `index.html` contains a basic setup loading the aforementioned files and starts the deck-tool with
  tooltips.

The `.map` files are optional and only used for debugging.

### Notes

Even though every package has its own tsconfig, those are only used when running TypeScript for that
specific package (e.g. when running tests). When using the `build` script, only the `application`
tsconfig is used, even when resolving TypeScript code from other packages.

### Architecture

See [Architecture.md](./ARCHITECTURE.md).

## JS API

Both tooltip and application instances expose an API that can be interacted with via JavaScript.
See `./packages/tooltip/src/api.ts` and `./packages/application/src/api.ts` for their documentation.

## Credits

- Thanks to Alan from <https://ygoprodeck.com/> for providing the API for all card data, as well as
  supporting the development.
- Thanks to the awesome people at <https://github.com/edo9300/edopro> for the great duel simulator
  that this application is inspired by.

## License

Please check the `LICENSE` file for details.

Yu-Gi-Oh! is a trademark of Shueisha and Konami. This project is not affiliated with or endorsed by
Shueisha or Konami.
