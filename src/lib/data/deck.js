const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;

const DECKPARTS = [
    {
        id: "main",
        name: "Main",
        indicator: "#main",
        limit: 60,
        check: card => !DECKPARTS_REGEX_EXTRA.test(card[1])
    },
    {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        limit: 15,
        check: card => DECKPARTS_REGEX_EXTRA.test(card[1])
    },
    {
        id: "side",
        name: "Side",
        indicator: "!side",
        limit: 15,
        check: () => true
    }
];

export { DECKPARTS };
