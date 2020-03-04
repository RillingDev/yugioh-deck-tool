import { DeckPart } from "../model/DeckPart";
import { Card } from "../model/Card";

const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;

const DECKPART_MAIN: DeckPart = {
    id: "main",
    name: "Main",
    indicator: "#main",
    min: 40,
    max: 60,
    allowsCard: (card: Card): boolean => !DECKPARTS_REGEX_EXTRA.test(card.type)
};
const DECKPART_EXTRA: DeckPart = {
    id: "extra",
    name: "Extra",
    indicator: "#extra",
    min: 0,
    max: 15,
    allowsCard: (card: Card): boolean => DECKPARTS_REGEX_EXTRA.test(card.type)
};
const DECKPART_SIDE: DeckPart = {
    id: "side",
    name: "Side",
    indicator: "!side",
    min: 0,
    max: 15,
    allowsCard: (): boolean => true
};

const DECKPARTS: DeckPart[] = [DECKPART_MAIN, DECKPART_EXTRA, DECKPART_SIDE];

export { DECKPARTS, DECKPART_EXTRA, DECKPART_SIDE, DECKPART_MAIN };
