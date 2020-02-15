import { randShuffle } from "lightdash";

const simulateStartingHand = (cardListMain, cardsToDraw) =>
  randShuffle(cardListMain).slice(0, cardsToDraw);

export default simulateStartingHand;
