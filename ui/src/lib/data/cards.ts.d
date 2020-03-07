import deepFreeze from "../deepFreeze";

const CARD_TYPE = [
    "Any",
    "Normal Monster",
    "Normal Tuner Monster",
    "Effect Monster",
    "Tuner Monster",
    "Flip Effect Monster",
    "Flip Tuner Effect Monster",
    "Union Effect Monster",
    "Union Tuner Effect Monster",
    "Gemini Monster",
    "Spirit Monster",
    "Toon Monster",
    "Pendulum Normal Monster",
    "Pendulum Effect Monster",
    "Pendulum Flip Effect Monster",
    "Pendulum Tuner Effect Monster",
    "Pendulum Effect Fusion Monster",
    "Ritual Monster",
    "Ritual Effect Monster",
    "Fusion Monster",
    "Synchro Monster",
    "Synchro Tuner Monster",
    "Synchro Pendulum Effect Monster",
    "XYZ Monster",
    "XYZ Pendulum Effect Monster",
    "Link Monster",
    "Spell Card",
    "Trap Card",
    "Skill Card"
];

const CARD_TYPE_SORTED = [
    ["Skill Card"],
    ["Normal Monster", "Normal Tuner Monster", "Pendulum Normal Monster"],
    [
        "Effect Monster",
        "Tuner Monster",
        "Flip Effect Monster",
        "Flip Tuner Effect Monster",
        "Union Effect Monster",
        "Union Tuner Effect Monster",
        "Gemini Monster",
        "Spirit Monster",
        "Toon Monster",
        "Pendulum Normal Monster",
        "Pendulum Effect Monster",
        "Pendulum Flip Effect Monster",
        "Pendulum Tuner Effect Monster"
    ],
    ["Ritual Monster", "Ritual Effect Monster"],
    ["Fusion Monster", "Pendulum Effect Fusion Monster"],
    [
        "Synchro Monster",
        "Synchro Tuner Monster",
        "Synchro Pendulum Effect Monster"
    ],
    ["XYZ Monster", "XYZ Pendulum Effect Monster"],
    ["Link Monster"],
    ["Spell Card"],
    ["Trap Card"]
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

deepFreeze(CARD_TYPE);
deepFreeze(CARD_TYPE_SORTED);
deepFreeze(CARD_RACE);
deepFreeze(CARD_ATTRIBUTE);
deepFreeze(CARD_LEVEL);
deepFreeze(CARD_LINKARROWS);
deepFreeze(CARD_SPELL_TYPE);
deepFreeze(CARD_TRAP_TYPE);

export {
    CARD_TYPE,
    CARD_TYPE_SORTED,
    CARD_RACE,
    CARD_ATTRIBUTE,
    CARD_LEVEL,
    CARD_LINKARROWS,
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE
};
