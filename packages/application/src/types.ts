import { TYPES } from "../../core/src/main";

const APPLICATION_TYPES = Object.assign(
    {
        DeckController: Symbol.for("DeckController"),
        DeckUrlController: Symbol.for("DeckUrlController"),
    },
    TYPES
);

export { APPLICATION_TYPES };
