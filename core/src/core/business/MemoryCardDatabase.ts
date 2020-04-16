import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService } from "./service/CardDataLoaderService";
import { Card } from "../model/ygo/Card";
import { CardSet } from "../model/ygo/CardSet";
import { CardDatabase } from "./CardDatabase";
import { CardType } from "../model/ygo/CardType";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";
import { CardSetAppearance } from "../model/ygo/intermediate/CardSetAppearance";
import * as logger from "loglevel";
import { UnlinkedCard } from "../model/ygo/intermediate/UnlinkedCard";
import { flatten } from "lodash";
import { deepFreeze } from "lightdash";

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly cardDataLoaderService: CardDataLoaderService;

    private loadingSets: Promise<void> | null;
    private loadingArchetypes: Promise<void> | null;
    private loadingCardValues: Promise<void> | null;
    private loadingAllCards: Promise<void> | null;

    private readonly cardsById: Map<string, Card>;
    private readonly cardsByName: Map<string, Card>;
    private readonly sets: CardSet[];
    private readonly archetypes: string[];
    private readonly types: Map<CardTypeGroup, CardType[]>;
    private readonly races: Map<CardTypeGroup, string[]>;
    private readonly monsterAttributes: string[];
    private readonly monsterLinkMarkers: string[];
    private readonly monsterLevels: number[];

    constructor(
        @inject(TYPES.CardDataLoaderService)
        dataLoaderClient: CardDataLoaderService
    ) {
        this.cardDataLoaderService = dataLoaderClient;
        this.loadingSets = null;
        this.loadingArchetypes = null;
        this.loadingCardValues = null;
        this.loadingAllCards = null;

        this.cardsById = new Map<string, Card>();
        this.cardsByName = new Map<string, Card>();
        this.sets = [];
        this.archetypes = [];
        this.types = new Map<CardTypeGroup, CardType[]>(
            Object.values(CardTypeGroup).map((cardTypeGroup) => [
                cardTypeGroup,
                [],
            ])
        );
        this.races = new Map<CardTypeGroup, string[]>(
            Object.values(CardTypeGroup).map((cardTypeGroup) => [
                cardTypeGroup,
                [],
            ])
        );
        this.monsterAttributes = [];
        this.monsterLinkMarkers = [];
        this.monsterLevels = [];
    }

    public async prepareAll(): Promise<void> {
        await Promise.all([
            this.loadSets(),
            this.loadCardValues(),
            this.loadArchetypes(),
        ]);
        await this.loadAllCards();
    }

    public async prepareCardByName(cardName: string): Promise<void> {
        await Promise.all([this.loadSets(), this.loadCardValues()]);
        await this.loadCardByName(cardName);
    }

    public hasCardByName(cardName: string): boolean {
        return this.cardsByName.has(cardName);
    }

    public getCardByName(cardName: string): Card | null {
        return this.cardsByName.get(cardName) ?? null;
    }

    public hasCardById(cardId: string): boolean {
        return this.cardsById.has(cardId);
    }

    public getCardById(cardId: string): Card | null {
        return this.cardsById.get(cardId) ?? null;
    }

    public getCards(): Card[] {
        return Array.from(this.cardsById.values());
    }

    public getSets(): CardSet[] {
        return this.sets;
    }

    public getArchetypes(): string[] {
        return this.archetypes;
    }

    public getTypes(cardTypeGroup: CardTypeGroup): CardType[] {
        return this.types.get(cardTypeGroup)!;
    }

    public getRaces(cardTypeGroup: CardTypeGroup): string[] {
        return this.races.get(cardTypeGroup)!;
    }

    public getMonsterAttributes(): string[] {
        return this.monsterAttributes;
    }

    public getMonsterLevels(): number[] {
        return this.monsterLevels;
    }

    public getMonsterLinkMarkers(): string[] {
        return this.monsterLinkMarkers;
    }

    private async loadCardByName(cardName: string): Promise<void> {
        if (this.cardsByName.has(cardName)) {
            return;
        }
        const card = await this.cardDataLoaderService.getCardByName(cardName);
        if (card != null) {
            this.registerCards([card]);
        }
    }

    private async loadAllCards(): Promise<void> {
        if (this.loadingAllCards == null) {
            this.loadingAllCards = this.cardDataLoaderService
                .getAllCards()
                .then((cards) => {
                    this.registerCards(cards);
                    logger.debug(
                        `Registered ${this.cardsById.size} card(s).`,
                        this.cardsById,
                        this.cardsByName
                    );
                });
        }
        return this.loadingAllCards;
    }

    private loadArchetypes(): Promise<void> {
        if (this.loadingArchetypes == null) {
            this.loadingArchetypes = this.cardDataLoaderService
                .getArchetypes()
                .then((archetypes) => {
                    this.archetypes.push(...archetypes);
                    deepFreeze(this.archetypes);
                    logger.debug("Registered archetypes.", this.archetypes);
                });
        }
        return this.loadingArchetypes;
    }

    private loadSets(): Promise<void> {
        if (this.loadingSets == null) {
            this.loadingSets = this.cardDataLoaderService
                .getAllCardSets()
                .then((cardSets) => {
                    this.sets.push(...cardSets);
                    deepFreeze(this.sets);
                    logger.debug("Registered sets.", this.sets);
                });
        }
        return this.loadingSets;
    }

    private async loadCardValues(): Promise<void> {
        if (this.loadingCardValues == null) {
            this.loadingCardValues = this.cardDataLoaderService
                .getCardValues()
                .then((cardValues) => {
                    for (const cardTypeGroup of Object.values(CardTypeGroup)) {
                        const cardTypes = this.types.get(cardTypeGroup)!;
                        cardTypes.push(...cardValues[cardTypeGroup].types);
                        deepFreeze(cardTypes);

                        const cardRaces = this.races.get(cardTypeGroup)!;
                        cardRaces.push(...cardValues[cardTypeGroup].races);
                        deepFreeze(cardRaces);
                    }
                    logger.debug(
                        "Registered types and races.",
                        this.types,
                        this.races
                    );

                    this.monsterAttributes.push(
                        ...cardValues[CardTypeGroup.MONSTER].attributes
                    );
                    deepFreeze(this.monsterAttributes);

                    this.monsterLevels.push(
                        ...cardValues[CardTypeGroup.MONSTER].levels
                    );
                    deepFreeze(this.monsterLevels);

                    this.monsterLinkMarkers.push(
                        ...cardValues[CardTypeGroup.MONSTER].linkMarkers
                    );
                    deepFreeze(this.monsterLinkMarkers);
                    logger.debug(
                        "Registered monster values.",
                        this.monsterAttributes,
                        this.monsterLevels,
                        this.monsterLinkMarkers
                    );
                });
        }
        return this.loadingCardValues;
    }

    private registerCards(unlinkedCards: UnlinkedCard[]): void {
        const setCache = new Map<string, CardSet>(
            this.sets.map((set) => [set.name, set])
        );
        const allTypes = flatten(Array.from(this.types.values()));
        const typeCache = new Map<string, CardType>(
            allTypes.map((type) => [type.name, type])
        );
        for (const unlinkedCard of unlinkedCards) {
            if (!this.cardsById.has(unlinkedCard.id)) {
                const linkedCard = this.createLinkedCard(
                    unlinkedCard,
                    setCache,
                    typeCache
                );
                deepFreeze(linkedCard);
                this.cardsById.set(unlinkedCard.id, linkedCard);
                this.cardsByName.set(unlinkedCard.name, linkedCard);
                logger.trace(
                    `Registered card '${unlinkedCard.id}'.`,
                    linkedCard
                );
            }
        }
    }

    private createLinkedCard(
        unlinkedCard: UnlinkedCard,
        setCache: Map<string, CardSet>,
        typeCache: Map<string, CardType>
    ): Card {
        return {
            id: unlinkedCard.id,
            name: unlinkedCard.name,
            desc: unlinkedCard.desc,

            type: this.linkType(unlinkedCard.type, typeCache),
            race: unlinkedCard.race,
            attribute: unlinkedCard.attribute,
            atk: unlinkedCard.atk,
            def: unlinkedCard.def,
            level: unlinkedCard.level,
            scale: unlinkedCard.scale,
            linkVal: unlinkedCard.linkVal,
            linkMarkers: unlinkedCard.linkMarkers,

            sets: this.linkSets(unlinkedCard.sets, setCache),
            image: unlinkedCard.image,
            prices: unlinkedCard.prices,
            betaName: unlinkedCard.betaName,
            treatedAs: unlinkedCard.treatedAs,
            archetype: unlinkedCard.archetype,

            formats: unlinkedCard.formats,
            release: unlinkedCard.release,
            banlist: unlinkedCard.banlist,

            views: unlinkedCard.views,
            votes: unlinkedCard.votes,
        };
    }

    private linkSets(
        setAppearances: CardSetAppearance[],
        setCache: Map<string, CardSet>
    ): CardSet[] {
        return setAppearances
            .map((setAppearance) => {
                if (!setCache.has(setAppearance.name)) {
                    logger.warn(`Could not find set '${setAppearance.name}'.`);
                    return null;
                }
                const matchingSet = setCache.get(setAppearance.name)!;
                logger.trace(
                    `Matched set ${setAppearance.name} to ${matchingSet.name}.`
                );
                return matchingSet;
            })
            .filter((set) => set != null) as CardSet[];
    }

    private linkType(
        typeName: string,
        typeCache: Map<string, CardType>
    ): CardType {
        if (!typeCache.has(typeName)) {
            throw new TypeError(`Could not find type '${typeName}'.`);
        }
        const matchingType = typeCache.get(typeName)!;
        logger.trace(`Matched type ${typeName} to ${matchingType.name}.`);
        return matchingType;
    }
}

export { MemoryCardDatabase };
