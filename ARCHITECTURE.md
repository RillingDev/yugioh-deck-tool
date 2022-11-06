# Architecture

### Packages

-   `core`: Shared business logic.
-   `ygoprodeck`: The API access to the [YGOProDeck API](https://db.ygoprodeck.com/api-guide/).
-   `browser-common`: Shared UI logic/styling requiring a browser.
-   `tooltip`: Card tooltip. Entry point.
-   `application`: Vue app. Entry point.

#### Dependency Tree

![Dependency Tree!](./architecture.svg)
