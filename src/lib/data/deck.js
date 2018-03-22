const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;

const DECKPARTS = [
    {
        id: "main",
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60,
        check: card => !DECKPARTS_REGEX_EXTRA.test(card.type)
    },
    {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15,
        check: card => DECKPARTS_REGEX_EXTRA.test(card.type)
    },
    {
        id: "side",
        name: "Side",
        indicator: "!side",
        min: 0,
        max: 15,
        check: () => true
    }
];

Object.freeze(DECKPARTS);

export { DECKPARTS };
