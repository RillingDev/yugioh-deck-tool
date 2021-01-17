import { TYPES } from "../../core/src/main";

const APPLICATION_TYPES = Object.assign(
    {
        DeckController: Symbol.for("DeckController"),
        DeckUrlController: Symbol.for("DeckUrlController"),
        FilterController: Symbol.for("FilterController"),
    },
    TYPES
);

export { APPLICATION_TYPES };
