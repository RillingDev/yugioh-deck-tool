var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
import { DECKPARTS } from "../data/DeckParts";
import { TYPES } from "../../types";
import { CardService } from "./CardService";
let DeckService = class DeckService {
    constructor(cardService) {
        this.cardService = cardService;
    }
    canAdd(deck, deckPart, format, card) {
        if (!card.type.deckPart.has(deckPart)) {
            return false;
        }
        const deckPartSize = deck.parts.get(deckPart).length;
        if (deckPartSize + 1 > deckPart.max) {
            return false;
        }
        const count = this.getAllCards(deck).filter(existingCard => this.cardService.isTreatedAsSame(existingCard, card)).length;
        return count < card.banlist[format];
    }
    getAllCards(deck) {
        const result = [];
        for (const deckPart of DECKPARTS) {
            result.push(...deck.parts.get(deckPart));
        }
        return result;
    }
    createEmptyDeck() {
        const parts = new Map();
        for (const deckPart of DECKPARTS) {
            parts.set(deckPart, []);
        }
        return { name: null, parts };
    }
};
DeckService = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardService)),
    __metadata("design:paramtypes", [CardService])
], DeckService);
export { DeckService };
