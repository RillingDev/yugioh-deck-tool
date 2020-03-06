// Pseudo-enum of deck parts
const DefaultDeckPart = {
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
const DEFAULT_DECKPART_ARR = [
    DefaultDeckPart.MAIN,
    DefaultDeckPart.EXTRA,
    DefaultDeckPart.SIDE
];
export { DEFAULT_DECKPART_ARR, DefaultDeckPart };
