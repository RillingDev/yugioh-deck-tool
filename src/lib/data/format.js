const FORMATS = [
    {
        name: "Advanced",
        check: () => true
    },
    {
        name: "GOAT",
        check: card => card.format === "GOAT"
    }
];

Object.freeze(FORMATS);

export { FORMATS };
