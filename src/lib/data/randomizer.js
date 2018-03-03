const RANDOMIZER_MODES = [
    { name: "Fully Random", filter: () => true }
    /*{ name: "Single Attribute", filter: card => card },
    { name: "Single Race", filter: card => card }
         { name: "Single Archetype", filter: card => card },
    { name: "Dual Archetypes", filter: card => card },
    { name: "Triple Archetypes", filter: card => card } */
];

Object.freeze(RANDOMIZER_MODES);

export { RANDOMIZER_MODES };
