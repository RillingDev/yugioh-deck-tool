const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;
const DECKPART_MAIN = {
    id: "main",
    name: "Main",
    indicator: "#main",
    min: 40,
    max: 60,
    allowsCard: (card) => !DECKPARTS_REGEX_EXTRA.test(card.type)
};
const DECKPART_EXTRA = {
    id: "extra",
    name: "Extra",
    indicator: "#extra",
    min: 0,
    max: 15,
    allowsCard: (card) => DECKPARTS_REGEX_EXTRA.test(card.type)
};
const DECKPART_SIDE = {
    id: "side",
    name: "Side",
    indicator: "!side",
    min: 0,
    max: 15,
    allowsCard: () => true
};
const DECKPARTS = [DECKPART_MAIN, DECKPART_EXTRA, DECKPART_SIDE];
export { DECKPARTS, DECKPART_EXTRA, DECKPART_SIDE, DECKPART_MAIN };
