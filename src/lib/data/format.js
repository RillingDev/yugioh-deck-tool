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
    name: "OCG GOAT",
    check: card => card.format.includes("OCG GOAT")
  },
  {
    name: "Speed Duel",
    check: card => card.format.includes("Speed Duel")
  },
  {
    name: "Duel Links",
    check: card => card.format.includes("Duel Links")
  }
];

deepFreeze(FORMATS);

export { FORMATS };
