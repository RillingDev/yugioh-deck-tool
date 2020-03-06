import { Card } from "../model/Card";
import { Deck } from "../model/Deck";
declare class DeckService {
    getAllCards(deck: Deck): Card[];
    createEmptyDeck(): Deck;
}
export { DeckService };
