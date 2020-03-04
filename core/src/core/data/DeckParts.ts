import { DeckPart } from "../model/DeckPart";
import { Card } from "../model/Card";

const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;

type DeckPartEnum = { [key: string]: DeckPart };

const DeckParts: DeckPartEnum = {
    MAIN: {
        id: "main",
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60,
        allowsCard: (card: Card): boolean =>
            !DECKPARTS_REGEX_EXTRA.test(card.type)
    },
    EXTRA: {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15,
        allowsCard: (card: Card): boolean =>
            DECKPARTS_REGEX_EXTRA.test(card.type)
    },
    SIDE: {
        id: "side",
        name: "Side",
        indicator: "!side",
        min: 0,
        max: 15,
        allowsCard: (): boolean => true
    }
};

const DeckPartsArray = [DeckParts.MAIN, DeckParts.EXTRA, DeckParts.SIDE];

export { DeckParts, DeckPartsArray };
