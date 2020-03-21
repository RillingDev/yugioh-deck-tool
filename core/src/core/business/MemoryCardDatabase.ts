import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService } from "./service/CardDataLoaderService";
import { Card } from "../model/ygo/Card";
import { CardSet } from "../model/ygo/CardSet";
import { CardDatabase } from "./CardDatabase";
import { CardType } from "../model/ygo/CardType";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";
import { CardValues } from "../model/ygo/CardValues";
import { CardSetAppearance } from "../model/ygo/intermediate/CardSetAppearance";
import * as logger from "loglevel";
import { UnlinkedCard } from "../model/ygo/intermediate/UnlinkedCard";

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
            Object.values(CardTypeGroup).map(cardTypeGroup => [
                cardTypeGroup,
                []
            ])
        );
        this.races = new Map<CardTypeGroup, string[]>(
            Object.values(CardTypeGroup).map(cardTypeGroup => [
                cardTypeGroup,
                []
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
            this.dataLoaderClient.getArchetypes()
        ]);
        logger.info("Loaded data from API.");

        this.sets.push(...cardSets);
        logger.debug("Registered sets.", this.sets);

        this.archetypes.push(...archetypes);
        logger.debug("Registered archetypes.", this.archetypes);

        for (const cardTypeGroup of Object.values(CardTypeGroup)) {
            this.types
                .get(cardTypeGroup)!
                .push(...cardValues[cardTypeGroup].types);
            this.races
                .get(cardTypeGroup)!
                .push(...cardValues[cardTypeGroup].races);
        }
        logger.debug("Registered types and races.", this.types, this.races);

        this.monsterAttributes.push(
            ...cardValues[CardTypeGroup.MONSTER].attributes
        );
        this.monsterLevels.push(...cardValues[CardTypeGroup.MONSTER].levels);
        this.monsterLinkMarkers.push(
            ...cardValues[CardTypeGroup.MONSTER].linkMarkers
        );
        logger.debug(
            "Registered monster values.",
            this.monsterAttributes,
            this.monsterLevels,
            this.monsterLinkMarkers
        );

        for (const unlinkedCard of cardInfo) {
            const linkedCard = this.createLinkedCard(
                unlinkedCard,
                cardSets,
                cardValues
            );
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
        cardSets: CardSet[],
        cardValues: CardValues
    ): Card {
        return {
            id: unlinkedCard.id,
            name: unlinkedCard.name,
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

    private linkSets(
        setAppearances: CardSetAppearance[],
        cardSets: CardSet[]
    ): CardSet[] {
        return <CardSet[]>setAppearances
            .map(setAppearance => {
                const matchingSet = cardSets.find(
                    set => set.name === setAppearance.name
                );
                if (matchingSet == null) {
                    logger.warn(`Could not find set '${setAppearance.name}'.`);
                    return null;
                }
                logger.trace(
                    `Matched set ${setAppearance.name} to ${matchingSet.name}.`
                );
                return matchingSet;
            })
            .filter(set => set != null);
    }

    private linkType(typeName: string, types: CardType[]): CardType {
        const matchingType = types.find(type => type.name === typeName);
        if (matchingType == null) {
            throw new TypeError(`Could not find type '${typeName}'.`);
        }
        logger.trace(`Matched type ${typeName} to ${matchingType.name}.`);
        return matchingType;
    }
}

export { MemoryCardDatabase };
