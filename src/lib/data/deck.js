const DECKPARTS_EXTRA_CARDTYPES = ["Fusion", "Synchro", "XYZ", "Link"];

const DECKPARTS = [
    {
        id: "main",
        name: "Main",
        indicator: "#main",
        limit: 60,
        check: card => !DECKPARTS_EXTRA_CARDTYPES.includes(card[1])
    },
    {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        limit: 15,
        check: card => DECKPARTS_EXTRA_CARDTYPES.includes(card[1])
    },
    {
        id: "side",
        name: "Side",
        indicator: "!side",
        limit: 15,
        check: () => true
    }
];

export { DECKPARTS, DECKPARTS_EXTRA_CARDTYPES };
