import { deepFreeze } from "lightdash";

export enum DeckPart {
    MAIN = "main",
    EXTRA = "extra",
    SIDE = "side",
}

const DECK_PART_ARR = Object.values(DeckPart);
deepFreeze(DECK_PART_ARR);
export { DECK_PART_ARR };
