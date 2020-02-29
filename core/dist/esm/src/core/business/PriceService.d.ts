import { Card, CardPrices } from "../../main";
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
