import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { CardPrices } from "../../model/ygo/CardPrices";
import { DefaultVendor } from "../../model/price/Vendor";

interface PriceLookupResult {
    prices: CardPrices;
    missing: Card[];
}

@injectable()
class PriceService {
    public hasPrice(card: Card): boolean {
        return card.prices != null;
    }

    public getPrice(...cards: Card[]): PriceLookupResult {
        const missing: Card[] = cards.filter(card => !this.hasPrice(card));
        const cardsWithPrice = cards.filter(card => this.hasPrice(card));
        const prices = this.createPrices(0, 0, 0, 0, 0);
        for (const card of cardsWithPrice) {
            for (const vendor of prices.keys()) {
                prices.set(
                    vendor,
                    prices.get(vendor)! + card.prices!.get(vendor)!
                );
            }
        }
        return { prices, missing };
    }

    public createPrices(
        cardMarket: number,
        tcgPlayer: number,
        coolStuffInc: number,
        ebay: number,
        amazon: number
    ): CardPrices {
        return new Map([
            [DefaultVendor.CARDMARKET, cardMarket],
            [DefaultVendor.TCGPLAYER, tcgPlayer],
            [DefaultVendor.COOL_STUFF_INC, coolStuffInc],
            [DefaultVendor.EBAY, ebay],
            [DefaultVendor.AMAZON, amazon]
        ]);
    }
}

export { PriceService };
