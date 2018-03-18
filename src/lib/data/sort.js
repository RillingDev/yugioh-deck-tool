const SORTERS = [
    {
        name: "A-Z",
        fn: (a, b) => a[0].localeCompare(b[0])
    },
    {
        name: "Z-A",
        fn: (a, b) => b[0].localeCompare(a[0])
    },
    {
        name: "ATK",
        fn: (a, b) => b[2] - a[2]
    },
    {
        name: "DEF",
        fn: (a, b) => b[3] - a[3]
    },
    {
        name: "Level",
        fn: (a, b) => b[4] - a[4]
    },
    {
        name: "Upvotes",
        fn: (a, b) => b[9] - a[9]
    },
    {
        name: "Downvotes",
        fn: (a, b) => b[10] - a[10]
    },
    {
        name: "Views",
        fn: (a, b) => b[8] - a[8]
    }
];

Object.freeze(SORTERS);

export { SORTERS };
