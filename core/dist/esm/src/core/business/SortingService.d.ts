import { Card } from "../model/Card";
import { CardDatabase } from "./CardDatabase";
declare class SortingService {
    private readonly cardDatabase;
    constructor(cardDatabase: CardDatabase);
    shuffle(cards: Card[]): Card[];
    sort(cards: Card[]): Card[];
}
export { SortingService };
