const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;
const DeckParts = {
    MAIN: {
        id: "main",
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60,
        allowsCard: (card) => !DECKPARTS_REGEX_EXTRA.test(card.type)
    },
    EXTRA: {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15,
        allowsCard: (card) => DECKPARTS_REGEX_EXTRA.test(card.type)
    },
    SIDE: {
        id: "side",
        name: "Side",
        indicator: "!side",
        min: 0,
        max: 15,
        allowsCard: () => true
    }
};
export { DeckParts };
