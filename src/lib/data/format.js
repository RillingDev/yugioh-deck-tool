const FORMATS = [
    { name: "None", check: () => true },
    { name: "GOAT", check: card => card[11] === "GOAT" }
];

Object.freeze(FORMATS);

export { FORMATS };
