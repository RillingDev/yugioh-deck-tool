import { shuffle } from "lodash";

const simulateStartingHand = (cardListMain, cardsToDraw) =>
    shuffle(cardListMain).slice(0, cardsToDraw);

export default simulateStartingHand;
