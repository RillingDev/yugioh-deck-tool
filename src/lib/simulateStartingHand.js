import {
    arrClone
} from "lightdash";

const simulateStartingHand = (cardListMain, cardsToDraw) => arrClone(cardListMain)
    .sort(() => Math.random() < 0.5)
    .slice(0, cardsToDraw);

export default simulateStartingHand;
