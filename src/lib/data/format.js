import deepFreeze from "../deepFreeze";

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

deepFreeze(FORMATS);

export { FORMATS };
