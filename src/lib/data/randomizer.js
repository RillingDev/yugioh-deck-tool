const RANDOMIZER_MODES = [
    { name: "Fully Random", filter: () => true },
    /*{ name: "Single Attribute", filter: card => card },
    { name: "Single Race", filter: card => card }*/
    { name: "One Archetype", filter: card => card },
    { name: "Two Archetypes", filter: card => card },
    { name: "Three Archetypes", filter: card => card }
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
