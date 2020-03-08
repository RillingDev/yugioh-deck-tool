import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService, UnlinkedCard } from "./CardDataLoaderService";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardDatabase } from "./CardDatabase";
import { CardType } from "../model/CardType";
import { CardTypeGroup } from "../model/CardTypeGroup";
import { CardValues } from "../model/CardValues";
import { CardSetAppearance } from "../model/CardSetAppearance";
import * as logger from "loglevel";

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly dataLoaderClient: CardDataLoaderService;
    private ready: boolean;
    private readonly cards: Map<string, Card>;
    private readonly sets: CardSet[];
    private readonly types: CardType[];
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
        this.types = [];
        this.races = new Map<CardTypeGroup, string[]>();
        this.monsterAttributes = [];
        this.monsterLinkMarkers = [];
        this.monsterLevels = [];
        this.ready = false;
    }

    public async init(): Promise<void> {
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

        this.races.set(
            CardTypeGroup.MONSTER,
            cardValues.values[CardTypeGroup.MONSTER].races
        );
        this.races.set(
            CardTypeGroup.SPELL,
            cardValues.values[CardTypeGroup.SPELL].races
        );
        this.races.set(
            CardTypeGroup.TRAP,
            cardValues.values[CardTypeGroup.TRAP].races
        );
        this.races.set(
            CardTypeGroup.SKILL,
            cardValues.values[CardTypeGroup.SKILL].races
        );

        this.monsterAttributes.push(
            ...cardValues.values[CardTypeGroup.MONSTER].attributes
        );
        this.monsterLevels.push(
            ...cardValues.values[CardTypeGroup.MONSTER].levels
        );
        this.monsterLinkMarkers.push(
            ...cardValues.values[CardTypeGroup.MONSTER].linkMarkers
        );
        logger.debug(
            "Registered static values.",
            this.races,
            this.monsterAttributes,
            this.monsterLevels,
            this.monsterLinkMarkers
        );

        for (const unlinkedCard of cardInfo) {
            this.cards.set(
                unlinkedCard.id,
                this.createLinkedCard(unlinkedCard, cardSets, cardValues)
            );
            logger.debug(
                `Registered card ${unlinkedCard.id}.`,
                this.cards.get(unlinkedCard.id)
            );
        }
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

    public getTypes(): CardType[] {
        return this.types;
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
                logger.debug(
                    `Matched set ${setAppearance.name} to ${matchingSet}.`
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
        logger.debug(`Matched type ${typeName} to ${matchingType}.`);
        return matchingType;
    }
}

export { MemoryCardDatabase };
