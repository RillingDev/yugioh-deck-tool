import { DeckPart } from "./DeckPart";

interface DefaultDeckParts {
    MAIN: DeckPart;
    EXTRA: DeckPart;
    SIDE: DeckPart;
}

// Pseudo-enum of deck parts
const DefaultDeckPart: DefaultDeckParts = {
    MAIN: {
        id: "main",
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60
    },
    EXTRA: {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15
    },
    SIDE: {
        id: "side",
        name: "Side",
        indicator: "!side",
        min: 0,
        max: 15
    }
};

const DEFAULT_DECKPART_ARR: DeckPart[] = [
    DefaultDeckPart.MAIN,
    DefaultDeckPart.EXTRA,
    DefaultDeckPart.SIDE
];

export { DEFAULT_DECKPART_ARR, DefaultDeckPart };
