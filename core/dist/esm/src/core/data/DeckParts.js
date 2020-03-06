const DECKPART_MAIN = {
    id: "main",
    name: "Main",
    indicator: "#main",
    min: 40,
    max: 60
};
const DECKPART_EXTRA = {
    id: "extra",
    name: "Extra",
    indicator: "#extra",
    min: 0,
    max: 15
};
const DECKPART_SIDE = {
    id: "side",
    name: "Side",
    indicator: "!side",
    min: 0,
    max: 15
};
const DECKPARTS = [DECKPART_MAIN, DECKPART_EXTRA, DECKPART_SIDE];
export { DECKPARTS, DECKPART_EXTRA, DECKPART_SIDE, DECKPART_MAIN };
