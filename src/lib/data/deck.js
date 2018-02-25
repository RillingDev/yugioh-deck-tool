const DECKPARTS_REGEX_EXTRA = /Fusion|Synchro|XYZ|Link/;

const DECKPARTS = [
    {
        id: "main",
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60,
        check: card => !DECKPARTS_REGEX_EXTRA.test(card[1])
    },
    {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15,
        check: card => DECKPARTS_REGEX_EXTRA.test(card[1])
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

const CARD_TYPE = [
    "Any",
    "Normal Monster",
    "Effect Monster",
    "Toon Monster",
    "Fusion Monster",
    "Ritual Monster",
    "Ritual Effect Monster",
    "Synchro Monster",
    "Synchro Tuner Monster",
    "Synchro Pendulum Effect Monster",
    "XYZ Monster",
    "XYZ Pendulum Effect Monster",
    "Pendulum Normal Monster",
    "Pendulum Effect Monster",
    "Pendulum Tuner Effect Monster",
    "Pendulum Effect Fusion Monster",
    "Link Monster",
    "Spell Card",
    "Trap Card"
];

const CARD_RACE = [
    "Any",
    "Aqua",
    "Beast",
    "Beast-Warrior",
    "Creator-God",
    "Cyberse",
    "Dinosaur",
    "Divine-Beast",
    "Dragon",
    "Fairy",
    "Fiend",
    "Fish",
    "Insect",
    "Machine",
    "Plant",
    "Psychic",
    "Pyro",
    "Reptile",
    "Rock",
    "Sea Serpent",
    "Spellcaster",
    "Thunder",
    "Warrior",
    "Winged Beast",
    "Wyrm",
    "Zombie"
];

const CARD_ATTRIBUTE = [
    "Any",
    "DARK",
    "EARTH",
    "FIRE",
    "LIGHT",
    "WATER",
    "WIND",
    "DIVINE"
];

const CARD_LEVEL = [
    "Any",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
];

const CARD_LINKARROWS = [
    "Any",
    "Top",
    "Bottom",
    "Left",
    "Right",
    "Top-Left",
    "Top-Right",
    "Bottom-Left",
    "Bottom-Right"
];

const CARD_SPELL_TYPE = [
    "Any",
    "Normal",
    "Field",
    "Equip",
    "Continuous",
    "Quick-Play",
    "Ritual"
];

const CARD_TRAP_TYPE = ["Any", "Normal", "Continuous", "Counter"];

Object.freeze(DECKPARTS);
Object.freeze(CARD_TYPE);
Object.freeze(CARD_RACE);
Object.freeze(CARD_ATTRIBUTE);
Object.freeze(CARD_LEVEL);
Object.freeze(CARD_LINKARROWS);
Object.freeze(CARD_SPELL_TYPE);
Object.freeze(CARD_TRAP_TYPE);

export {
    DECKPARTS,
    CARD_TYPE,
    CARD_RACE,
    CARD_ATTRIBUTE,
    CARD_LEVEL,
    CARD_LINKARROWS,
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE
};
