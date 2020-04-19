import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService } from "./service/CardDataLoaderService";
import { Card } from "../model/ygo/Card";
import { CardSet } from "../model/ygo/CardSet";
import { CardDatabase, FindCardBy } from "./CardDatabase";
import { CardType } from "../model/ygo/CardType";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";
import * as logger from "loglevel";
import { UnlinkedCard } from "../model/ygo/intermediate/UnlinkedCard";
import { deepFreeze } from "lightdash";
import { CardLinkingService } from "./service/CardLinkingService";
import { flatten } from "lodash";

/**
 * @private
 */
@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly cardDataLoaderService: CardDataLoaderService;
    private readonly cardLinkingService: CardLinkingService;

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
        cardDataLoaderService: CardDataLoaderService,
        @inject(TYPES.CardLinkingService)
        cardLinkingService: CardLinkingService
    ) {
        this.cardDataLoaderService = cardDataLoaderService;
        this.cardLinkingService = cardLinkingService;

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

    public async prepareCard(
        cardKey: string,
        findCardBy: FindCardBy
    ): Promise<void> {
        await Promise.all([this.loadSets(), this.loadCardValues()]);
        await this.loadCard(cardKey, findCardBy);
    }

    public hasCard(cardKey: string, findCardBy: FindCardBy): boolean {
        return this.getCardMap(findCardBy).has(cardKey);
    }

    public getCard(cardKey: string, findCardBy: FindCardBy): Card | null {
        return this.getCardMap(findCardBy).get(cardKey) ?? null;
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

    private async loadCard(
        cardKey: string,
        findCardBy: FindCardBy
    ): Promise<void> {
        if (this.getCardMap(findCardBy).has(cardKey)) {
            return;
        }
        const card = await this.cardDataLoaderService.getCard(
            cardKey,
            findCardBy
        );
        if (card != null) {
            this.registerCards([card]);
        }
    }

    private async loadAllCards(): Promise<void> {
        if (this.loadingAllCards == null) {
            this.loadingAllCards = this.cardDataLoaderService
                .getAllCards()
                .then((cards) => this.registerCards(cards));
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
        const types = flatten(Array.from(this.types.values()));
        const linkedCards = this.cardLinkingService.linkCards(
            Array.from(this.sets),
            types,
            unlinkedCards.filter(
                (unlinkedCard) => !this.cardsById.has(unlinkedCard.id)
            )
        );
        for (const card of linkedCards) {
            deepFreeze(card);
            this.cardsById.set(card.id, card);
            this.cardsByName.set(card.name, card);
            logger.trace(`Registered card '${card.id}'.`);
        }
        logger.debug(
            `Registered ${linkedCards.length} card(s).`,
            this.cardsById,
            this.cardsByName
        );
    }

    private getCardMap(findCardBy: FindCardBy): Map<string, Card> {
        return findCardBy == FindCardBy.ID ? this.cardsById : this.cardsByName;
    }
}

export { MemoryCardDatabase };
