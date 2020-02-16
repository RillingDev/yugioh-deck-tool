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
        fn: (a, b) => b.stats[0] - a.stats[0]
    },
    {
        name: "DEF",
        fn: (a, b) => b.stats[1] - a.stats[1]
    },
    {
        name: "Level",
        fn: (a, b) => b.stats[2] - a.stats[2]
    },
    {
        name: "Upvotes",
        fn: (a, b) => b.rating[0] - a.rating[0]
    },
    {
        name: "Downvotes",
        fn: (a, b) => b.rating[1] - a.rating[1]
    },
    {
        name: "Views",
        fn: (a, b) => b.times - a.times
    }
];

deepFreeze(SORTERS);

export { SORTERS };
