# Architecture

### Packages

- `core`: Shared business logic.
- `ygoprodeck`: The API access to the [YGOProDeck API](https://db.ygoprodeck.com/api-guide/).
- `application`: Vue app. Entry point.

### IoC

Inversion of control is done using constructor dependency injection.
The assembly and resolution of dependencies is done in the `ctx.ts` files of the entry point packages.
