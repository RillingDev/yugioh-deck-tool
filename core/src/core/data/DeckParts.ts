import { DeckPart } from "../model/DeckPart";

const DECKPART_MAIN: DeckPart = {
    id: "main",
    name: "Main",
    indicator: "#main",
    min: 40,
    max: 60
};
const DECKPART_EXTRA: DeckPart = {
    id: "extra",
    name: "Extra",
    indicator: "#extra",
    min: 0,
    max: 15
};
const DECKPART_SIDE: DeckPart = {
    id: "side",
    name: "Side",
    indicator: "!side",
    min: 0,
    max: 15
};

const DECKPARTS: DeckPart[] = [DECKPART_MAIN, DECKPART_EXTRA, DECKPART_SIDE];

export { DECKPARTS, DECKPART_EXTRA, DECKPART_SIDE, DECKPART_MAIN };
