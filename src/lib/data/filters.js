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

const CARD_SORTERS = [
    {
        name: "Alphabetical (A-Z)",
        fn: (a, b) => a[0].localeCompare(b[0])
    },
    {
        name: "Alphabetical (Z-A)",
        fn: (a, b) => b[0].localeCompare(a[0])
    },
    {
        name: "ATK",
        fn: (a, b) => Number(b[2]) - Number(a[2])
    },
    {
        name: "DEF",
        fn: (a, b) => Number(b[3]) - Number(a[3])
    },
    {
        name: "Level",
        fn: (a, b) => Number(b[4]) - Number(a[4])
    },
    {
        name: "Upvotes",
        fn: (a, b) => Number(b[9]) - Number(a[9])
    },
    {
        name: "Downvotes",
        fn: (a, b) => Number(b[10]) - Number(a[10])
    },
    {
        name: "Views",
        fn: (a, b) => Number(b[8]) - Number(a[8])
    },
    {
        name: "Latest",
        fn: (a, b) => Number(b[11]) - Number(a[11])
    }
];

export {
    CARD_TYPE,
    CARD_RACE,
    CARD_ATTRIBUTE,
    CARD_LEVEL,
    CARD_LINKARROWS,
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE,
    CARD_SORTERS
};
