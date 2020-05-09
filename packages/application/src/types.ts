import { TYPES } from "yugioh-deck-tool-core/src/main";

const APPLICATION_TYPES = Object.assign(
    { PriceController: Symbol.for("PriceController") },
    TYPES
);

export { APPLICATION_TYPES };
