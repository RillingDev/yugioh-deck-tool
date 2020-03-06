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
import { CardTypeGroup } from "../model/types/CardTypeGroup";
let MemoryCardDatabase = class MemoryCardDatabase {
    constructor(dataLoaderClient) {
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map();
        this.sets = [];
        this.types = [];
        this.spellValues = {
            races: []
        };
        this.trapValues = {
            races: []
        };
        this.skillValues = {
            races: []
        };
        this.monsterValues = {
            races: [],
            attributes: [],
            linkmarkers: [],
            levels: []
        };
        this.ready = false;
    }
    async init() {
        const [cardInfo, cardSets, cardValues] = await Promise.all([
            this.dataLoaderClient.getCardInfo(),
            this.dataLoaderClient.getCardSets(),
            this.dataLoaderClient.getCardValues()
        ]);
        for (const card of cardInfo) {
            this.cards.set(card.id, card);
        }
        this.sets.push(...cardSets);
        this.types.push(...cardValues.types);
        const monsterGroupValues = cardValues.values[CardTypeGroup.MONSTER];
        this.monsterValues.races = monsterGroupValues.races;
        this.monsterValues.attributes = monsterGroupValues.attributes;
        this.monsterValues.levels = monsterGroupValues.levels;
        this.monsterValues.linkmarkers = monsterGroupValues.linkmarkers;
        const spellGroupValues = cardValues.values[CardTypeGroup.SPELL];
        this.spellValues.races = spellGroupValues.races;
        const trapGroupValues = cardValues.values[CardTypeGroup.TRAP];
        this.trapValues.races = trapGroupValues.races;
        const skillGroupValues = cardValues.values[CardTypeGroup.SKILL];
        this.skillValues.races = skillGroupValues.races;
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
    getSets() {
        return Array.from(this.sets);
    }
    getTypes() {
        return Array.from(this.types.values());
    }
    getSkillRaces() {
        return Array.from(this.skillValues.races);
    }
    getSpellRaces() {
        return Array.from(this.spellValues.races);
    }
    getTrapRaces() {
        return Array.from(this.trapValues.races);
    }
    getMonsterRaces() {
        return Array.from(this.monsterValues.races);
    }
    getMonsterAttributes() {
        return Array.from(this.monsterValues.attributes);
    }
    getMonsterLevels() {
        return Array.from(this.monsterValues.levels);
    }
    getMonsterLinkMarkers() {
        return Array.from(this.monsterValues.linkmarkers);
    }
};
MemoryCardDatabase = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardDataLoaderService)),
    __metadata("design:paramtypes", [Object])
], MemoryCardDatabase);
export { MemoryCardDatabase };
