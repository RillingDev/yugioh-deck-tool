import { injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { Vendor } from "../../model/price/Vendor";
import { Currency } from "../../model/price/Currency";

interface PriceLookupResult {
    price: number;
    missing: Card[];
}

@injectable()
class PriceService {
    public getPrice(
        cards: Card[],
        vendor: Vendor,
        currency: Currency
    ): PriceLookupResult {
        const missing: Card[] = cards.filter(
            (card) => !this.hasPrice(card, vendor)
        );
        const prices = cards
            .filter((card) => this.hasPrice(card, vendor))
            .map((card) => this.getCardPrice(card, vendor, currency));
        const price = prices.reduce((a, b) => a + b, 0);
        return { price, missing };
    }

    private hasPrice(card: Card, vendor: Vendor): boolean {
        return card.prices.has(vendor);
    }

    private getCardPrice(
        card: Card,
        vendor: Vendor,
        currency: Currency
    ): number {
        if (!this.hasPrice(card, vendor)) {
            throw new TypeError(`No price exists for this vendor: ${vendor}`);
        }
        return card.prices.get(vendor)! * currency.val;
    }
}

export { PriceService };
