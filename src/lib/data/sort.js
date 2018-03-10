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

Object.freeze(SORTERS);

export { SORTERS };
