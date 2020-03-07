import { DeckPart } from "../model/DeckPart";
import { Card } from "../model/Card";
import { Deck } from "../model/Deck";
import { CardService } from "./CardService";
import { Format } from "../model/Format";
declare class DeckService {
    private readonly cardService;
    constructor(cardService: CardService);
    canAdd(deck: Deck, deckPart: DeckPart, format: Format.TCG | Format.OCG | Format.GOAT, card: Card): boolean;
    addCard(deck: Deck, deckPart: DeckPart, card: Card): void;
    removeCard(deck: Deck, deckPart: DeckPart, card: Card): void;
    getAllCards(deck: Deck): Card[];
    createEmptyDeck(): Deck;
}
export { DeckService };
