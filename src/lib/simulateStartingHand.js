import {
    arrClone
} from "lightdash";

// For some reason this is a very weird random in chrome
const sortShuffle = () => Math.random() < 0.5;

const simulateStartingHand = (cardListMain, cardsToDraw) => arrClone(cardListMain)
    .sort(sortShuffle)
    .slice(0, cardsToDraw);

export default simulateStartingHand;
