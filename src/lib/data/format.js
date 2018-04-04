const FORMATS = [
    { name: "None", check: () => true },
    { name: "GOAT", check: card => card.format === "GOAT" }
];

Object.freeze(FORMATS);

export { FORMATS };
