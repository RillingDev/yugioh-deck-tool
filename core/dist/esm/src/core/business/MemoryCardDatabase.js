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
import { TYPES } from "../../types";
let MemoryCardDatabase = class MemoryCardDatabase {
    constructor(dataLoaderClient) {
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map();
        this.races = new Set();
        this.attributes = new Set();
        this.types = new Set();
        this.sets = [];
        this.ready = false;
    }
    async init() {
        const [cardInfo, cardSets] = await Promise.all([
            this.dataLoaderClient.getCardInfo(),
            this.dataLoaderClient.getCardSets()
        ]);
        for (const card of cardInfo) {
            this.cards.set(card.id, card);
            if (!this.types.has(card.type)) {
                this.types.add(card.type);
            }
            if (!this.races.has(card.race)) {
                this.races.add(card.race);
            }
            if (card.attribute != null &&
                !this.attributes.has(card.attribute)) {
                this.attributes.add(card.attribute);
            }
        }
        this.sets.push(...cardSets);
    }
    isReady() {
        return this.ready;
    }
    hasCard(cardId) {
        return this.cards.has(cardId);
    }
    getCard(cardId) {
        return this.cards.get(cardId) ?? null;
    }
    getCards() {
        return Array.from(this.cards.values());
    }
    getTypes() {
        return Array.from(this.types.values());
    }
    getRaces() {
        return Array.from(this.races.values());
    }
    getAttributes() {
        return Array.from(this.attributes.values());
    }
    getSets() {
        return Array.from(this.sets);
    }
};
MemoryCardDatabase = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardDataLoaderService)),
    __metadata("design:paramtypes", [Object])
], MemoryCardDatabase);
export { MemoryCardDatabase };
