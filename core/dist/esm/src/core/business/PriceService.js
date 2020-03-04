var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "inversify";
let PriceService = class PriceService {
    hasPrice(card) {
        return card.prices != null;
    }
    getPrice(...cards) {
        const missing = cards.filter(card => !this.hasPrice(card));
        const prices = cards
            .filter(card => this.hasPrice(card))
            .map(card => card.prices)
            .reduce((previousValue, currentValue) => {
            return this.createPrices(previousValue.cardmarket + currentValue.cardmarket, previousValue.tcgplayer + currentValue.tcgplayer, previousValue.ebay + currentValue.ebay, previousValue.amazon + currentValue.amazon);
        }, this.createPrices(0, 0, 0, 0));
        return { prices, missing };
    }
    createPrices(cardmarket, tcgplayer, ebay, amazon) {
        return {
            cardmarket: cardmarket,
            tcgplayer: tcgplayer,
            ebay: ebay,
            amazon: amazon
        };
    }
};
PriceService = __decorate([
    injectable()
], PriceService);
export { PriceService };