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
        fn: (a, b) => Number(b[4]) - Number(a[4])
    },
    {
        name: "DEF",
        fn: (a, b) => Number(b[5]) - Number(a[5])
    },
    {
        name: "Level",
        fn: (a, b) => Number(b[6]) - Number(a[6])
    },
    {
        name: "Upvotes",
        fn: (a, b) => Number(b[10]) - Number(a[10])
    },
    {
        name: "Downvotes",
        fn: (a, b) => Number(b[11]) - Number(a[11])
    },
    {
        name: "Views",
        fn: (a, b) => Number(b[9]) - Number(a[9])
    },
    {
        name: "Latest",
        fn: (a, b) => Number(b[12]) - Number(a[12])
    }
];

Object.freeze(CARD_TYPE);
Object.freeze(CARD_RACE);
Object.freeze(CARD_ATTRIBUTE);
Object.freeze(CARD_LEVEL);
Object.freeze(CARD_SORTERS);

export { CARD_TYPE, CARD_RACE, CARD_ATTRIBUTE, CARD_LEVEL, CARD_SORTERS };
