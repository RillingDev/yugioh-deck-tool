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
import { CardTypeGroup } from "../model/CardTypeGroup";
import * as logger from "loglevel";
let MemoryCardDatabase = class MemoryCardDatabase {
    constructor(dataLoaderClient) {
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map();
        this.sets = [];
        this.types = [];
        this.races = new Map();
        this.monsterAttributes = [];
        this.monsterLinkMarkers = [];
        this.monsterLevels = [];
        this.ready = false;
    }
    async init() {
        logger.info("Loading data from API...");
        const [cardInfo, cardSets, cardValues] = await Promise.all([
            this.dataLoaderClient.getCardInfo(),
            this.dataLoaderClient.getCardSets(),
            this.dataLoaderClient.getCardValues()
        ]);
        logger.info("Loaded data from API.", cardSets, cardInfo, cardValues);
        this.sets.push(...cardSets);
        logger.debug("Registered sets.", this.sets);
        this.types.push(...cardValues.types);
        logger.debug("Registered types.", this.types);
        this.races.set(CardTypeGroup.MONSTER, cardValues.values[CardTypeGroup.MONSTER].races);
        this.races.set(CardTypeGroup.SPELL, cardValues.values[CardTypeGroup.SPELL].races);
        this.races.set(CardTypeGroup.TRAP, cardValues.values[CardTypeGroup.TRAP].races);
        this.races.set(CardTypeGroup.SKILL, cardValues.values[CardTypeGroup.SKILL].races);
        this.monsterAttributes.push(...cardValues.values[CardTypeGroup.MONSTER].attributes);
        this.monsterLevels.push(...cardValues.values[CardTypeGroup.MONSTER].levels);
        this.monsterLinkMarkers.push(...cardValues.values[CardTypeGroup.MONSTER].linkMarkers);
        logger.debug("Registered static values.", this.races, this.monsterAttributes, this.monsterLevels, this.monsterLinkMarkers);
        for (const unlinkedCard of cardInfo) {
            this.cards.set(unlinkedCard.id, this.createLinkedCard(unlinkedCard, cardSets, cardValues));
            logger.debug(`Registered card ${unlinkedCard.id}.`, this.cards.get(unlinkedCard.id));
        }
        this.ready = true;
        logger.info("Initialized database.");
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
        return this.sets;
    }
    getTypes() {
        return this.types;
    }
    getRaces(cardTypeGroup) {
        return this.races.get(cardTypeGroup);
    }
    getMonsterAttributes() {
        return this.monsterAttributes;
    }
    getMonsterLevels() {
        return this.monsterLevels;
    }
    getMonsterLinkMarkers() {
        return this.monsterLinkMarkers;
    }
    createLinkedCard(unlinkedCard, cardSets, cardValues) {
        return {
            id: unlinkedCard.id,
            name: unlinkedCard.name,
            desc: unlinkedCard.desc,
            type: this.linkType(unlinkedCard.type, cardValues.types),
            race: unlinkedCard.race,
            attribute: unlinkedCard.attribute,
            atk: unlinkedCard.atk,
            def: unlinkedCard.def,
            level: unlinkedCard.level,
            scale: unlinkedCard.scale,
            linkVal: unlinkedCard.linkVal,
            linkMarkers: unlinkedCard.linkMarkers,
            sets: this.linkSets(unlinkedCard.sets, cardSets),
            image: unlinkedCard.image,
            prices: unlinkedCard.prices,
            betaName: unlinkedCard.betaName,
            treatedAs: unlinkedCard.treatedAs,
            archetype: unlinkedCard.archetype,
            formats: unlinkedCard.formats,
            release: unlinkedCard.release,
            banlist: unlinkedCard.banlist,
            views: unlinkedCard.views
        };
    }
    linkSets(setAppearances, cardSets) {
        return setAppearances
            .map(setAppearance => {
            const matchingSet = cardSets.find(set => set.name === setAppearance.name);
            if (matchingSet == null) {
                logger.warn(`Could not find set '${setAppearance.name}'.`);
                return null;
            }
            logger.debug(`Matched set ${setAppearance.name} to ${matchingSet}.`);
            return matchingSet;
        })
            .filter(set => set != null);
    }
    linkType(typeName, types) {
        const matchingType = types.find(type => type.name === typeName);
        if (matchingType == null) {
            throw new TypeError(`Could not find type '${typeName}'.`);
        }
        logger.debug(`Matched type ${typeName} to ${matchingType}.`);
        return matchingType;
    }
};
MemoryCardDatabase = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardDataLoaderService)),
    __metadata("design:paramtypes", [Object])
], MemoryCardDatabase);
export { MemoryCardDatabase };
