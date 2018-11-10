import deepFreeze from "../deepFreeze";

const FORMATS = [
    {
        name: "Advanced",
        check: () => true
    },
    {
        name: "GOAT",
        check: card => card.format.includes("GOAT")
    },
    {
        name: "Speed Duel",
        check: card => card.format.includes("Speed Duel")
    }
];

deepFreeze(FORMATS);

export { FORMATS };
