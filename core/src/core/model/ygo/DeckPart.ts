interface DeckPart {
    readonly id: string;
    readonly name: string;
    readonly indicator: string;
    readonly min: number;
    readonly max: number;
    readonly recommended: number;
}

// Pseudo-enum of deck parts
const DefaultDeckPart: {
    readonly MAIN: DeckPart;
    readonly EXTRA: DeckPart;
    readonly SIDE: DeckPart;
} = {
    MAIN: {
        id: "main",
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60,
        recommended: 40,
    },
    EXTRA: {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15,
        recommended: 15,
    },
    SIDE: {
        id: "side",
        name: "Side",
        indicator: "!side",
        min: 0,
        max: 15,
        recommended: 15,
    },
};

const DEFAULT_DECK_PART_ARR: DeckPart[] = [
    DefaultDeckPart.MAIN,
    DefaultDeckPart.EXTRA,
    DefaultDeckPart.SIDE,
];

export { DeckPart, DEFAULT_DECK_PART_ARR, DefaultDeckPart };
