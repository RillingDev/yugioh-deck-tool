import { DeckPart } from "./DeckPart";
interface DefaultDeckParts {
    MAIN: DeckPart;
    EXTRA: DeckPart;
    SIDE: DeckPart;
}
declare const DefaultDeckPart: DefaultDeckParts;
declare const DEFAULT_DECKPART_ARR: DeckPart[];
export { DEFAULT_DECKPART_ARR, DefaultDeckPart };
