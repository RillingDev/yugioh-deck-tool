import deepFreeze from "../deepFreeze";

const SORTERS = [
    {
        name: "A-Z",
        fn: (a, b) => a.name.localeCompare(b.name)
    },
    {
        name: "Z-A",
        fn: (a, b) => b.name.localeCompare(a.name)
    },
    {
        name: "ATK",
        fn: (a, b) => b.atk - a.atk
    },
    {
        name: "DEF",
        fn: (a, b) => b.def - a.def
    },
    {
        name: "Level",
        fn: (a, b) => b.level - a.level
    },
    {
        name: "Views",
        fn: (a, b) => b.views - a.views
    }
];

deepFreeze(SORTERS);

export { SORTERS };
