import { DeckPart } from "../model/DeckPart";
declare type DeckPartEnum = {
    [key: string]: DeckPart;
};
declare const DeckParts: DeckPartEnum;
declare const DeckPartsArray: DeckPart[];
export { DeckParts, DeckPartsArray };
