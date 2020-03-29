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
import { flatten, forEach, isObject } from "lodash";

const deepFreeze = (target: any): void => {
    if (isObject(target)) {
        Object.freeze(target);
        forEach(target, deepFreeze);
    }
};

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly dataLoaderClient: CardDataLoaderService;
    private ready: boolean;
    private readonly cards: Map<string, Card>;
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
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map<string, Card>();
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
        this.ready = false;
    }

    public async init(): Promise<void> {
        logger.info("Loading data from API...");
        const [cardInfo, cardSets, cardValues, archetypes] = await Promise.all([
            this.dataLoaderClient.getCardInfo(),
            this.dataLoaderClient.getCardSets(),
            this.dataLoaderClient.getCardValues(),
            this.dataLoaderClient.getArchetypes(),
        ]);
        logger.info("Loaded data from API.");

        this.sets.push(...cardSets);
        deepFreeze(this.sets);
        logger.debug("Registered sets.", this.sets);

        this.archetypes.push(...archetypes);
        deepFreeze(this.archetypes);
        logger.debug("Registered archetypes.", this.archetypes);

        for (const cardTypeGroup of Object.values(CardTypeGroup)) {
            const cardTypes = this.types.get(cardTypeGroup)!;
            cardTypes.push(...cardValues[cardTypeGroup].types);
            deepFreeze(cardTypes);

            const cardRaces = this.races.get(cardTypeGroup)!;
            cardRaces.push(...cardValues[cardTypeGroup].races);
            deepFreeze(cardRaces);
        }
        logger.debug("Registered types and races.", this.types, this.races);

        this.monsterAttributes.push(
            ...cardValues[CardTypeGroup.MONSTER].attributes
        );
        deepFreeze(this.monsterAttributes);

        this.monsterLevels.push(...cardValues[CardTypeGroup.MONSTER].levels);
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

        const setCache = new Map<string, CardSet>(
            cardSets.map((set) => [set.name, set])
        );
        const allTypes = flatten(Array.from(this.types.values()));
        const typeCache = new Map<string, CardType>(
            allTypes.map((type) => [type.name, type])
        );
        for (const unlinkedCard of cardInfo) {
            const linkedCard = this.createLinkedCard(
                unlinkedCard,
                setCache,
                typeCache
            );
            deepFreeze(linkedCard);
            this.cards.set(unlinkedCard.id, linkedCard);
            logger.trace(`Registered card '${unlinkedCard.id}'.`, linkedCard);
        }
        logger.debug(`Registered ${this.cards.size} cards`, this.cards);

        this.ready = true;
        logger.info("Initialized database.");
    }

    public isReady(): boolean {
        return this.ready;
    }

    public hasCard(cardId: string): boolean {
        return this.cards.has(cardId);
    }

    public getCard(cardId: string): Card | null {
        return this.cards.get(cardId) ?? null;
    }

    public getCards(): Card[] {
        return Array.from(this.cards.values());
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

    private createLinkedCard(
        unlinkedCard: UnlinkedCard,
        setCache: Map<string, CardSet>,
        typeCache: Map<string, CardType>
    ): Card {
        return {
            id: unlinkedCard.id,
            name: unlinkedCard.name,
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
        };
    }

    private linkSets(
        setAppearances: CardSetAppearance[],
        setCache: Map<string, CardSet>
    ): CardSet[] {
        return <CardSet[]>setAppearances
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
            .filter((set) => set != null);
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
