import { Card } from "../model/Card";
import { CardPrices } from "../model/CardPrices";
interface PriceLookupResult {
    prices: CardPrices;
    missing: Card[];
}
declare class PriceService {
    hasPrice(card: Card): boolean;
    getPrice(...cards: Card[]): PriceLookupResult;
    private createPrices;
}
export { PriceService };
