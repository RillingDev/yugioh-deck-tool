import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService } from "./CardDataLoaderService";
import { Card } from "./Card";
import { CardSet } from "./set/CardSet";
import { CardDatabase, FindCardBy } from "./CardDatabase";
import { CardType } from "./type/CardType";
import { CardTypeGroup } from "./type/CardTypeGroup";
import { UnlinkedCard } from "./UnlinkedCard";
import { deepFreeze } from "lightdash";
import { CardLinkingService } from "./CardLinkingService";
import { flatten } from "lodash";
import { getLogger } from "../../logger";

/**
 * @private
 */
@injectable()
class MemoryCardDatabase implements CardDatabase {
    private static readonly logger = getLogger(MemoryCardDatabase);

    private readonly cardDataLoaderService: CardDataLoaderService;
    private readonly cardLinkingService: CardLinkingService;

    private loadingSets: Promise<void> | null;
    private loadingArchetypes: Promise<void> | null;
    private loadingCardValues: Promise<void> | null;
    private loadingAllCards: Promise<void> | null;

    private readonly cardsByPasscode: Map<string, Card>;
    private readonly cardsByName: Map<string, Card>;
    private readonly sets: CardSet[];
    private readonly archetypes: string[];
    private readonly types: Map<CardTypeGroup, CardType[]>;
    private readonly subTypes: Map<CardTypeGroup, string[]>;
    private readonly attributes: string[];
    private readonly linkMarkers: string[];
    private readonly levels: number[];

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

        this.cardsByPasscode = new Map<string, Card>();
        this.cardsByName = new Map<string, Card>();
        this.sets = [];
        this.archetypes = [];
        this.types = new Map<CardTypeGroup, CardType[]>(
            Object.values(CardTypeGroup).map((cardTypeGroup) => [
                cardTypeGroup,
                [],
            ])
        );
        this.subTypes = new Map<CardTypeGroup, string[]>(
            Object.values(CardTypeGroup).map((cardTypeGroup) => [
                cardTypeGroup,
                [],
            ])
        );
        this.attributes = [];
        this.linkMarkers = [];
        this.levels = [];
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
    ): Promise<string | null> {
        await Promise.all([this.loadSets(), this.loadCardValues()]);
        return await this.loadCard(cardKey, findCardBy);
    }

    public hasCard(cardKey: string, findCardBy: FindCardBy): boolean {
        return this.getCardMap(findCardBy).has(cardKey);
    }

    public getCard(cardKey: string, findCardBy: FindCardBy): Card | null {
        return this.getCardMap(findCardBy).get(cardKey) ?? null;
    }

    public getCards(): Card[] {
        return Array.from(this.cardsByPasscode.values());
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

    public getSubTypes(cardTypeGroup: CardTypeGroup): string[] {
        return this.subTypes.get(cardTypeGroup)!;
    }

    public getAttributes(): string[] {
        return this.attributes;
    }

    public getLevels(): number[] {
        return this.levels;
    }

    public getLinkMarkers(): string[] {
        return this.linkMarkers;
    }

    /**
     * Loads a single card.
     *
     * @return The resolved version of the card key to be used for further lookups.
     */
    private async loadCard(
        cardKey: string,
        findCardBy: FindCardBy
    ): Promise<string | null> {
        let card: UnlinkedCard | Card | null;
        if (this.hasCard(cardKey, findCardBy)) {
            card = this.getCard(cardKey, findCardBy)!;
        } else {
            card = await this.cardDataLoaderService.getCard(
                cardKey,
                findCardBy
            );
            if (card != null) {
                this.registerCards([card]);
            }
        }
        if (card == null) {
            return null;
        }
        return findCardBy == FindCardBy.NAME ? card.name : card.passcode;
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
                    MemoryCardDatabase.logger.debug(
                        "Registered archetypes.",
                        this.archetypes
                    );
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
                    MemoryCardDatabase.logger.debug(
                        "Registered sets.",
                        this.sets
                    );
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

                        const cardSubTypes = this.subTypes.get(cardTypeGroup)!;
                        cardSubTypes.push(
                            ...cardValues[cardTypeGroup].subTypes
                        );
                        deepFreeze(cardSubTypes);
                    }
                    MemoryCardDatabase.logger.debug(
                        "Registered types and sub-types.",
                        this.types,
                        this.subTypes
                    );

                    this.attributes.push(
                        ...cardValues[CardTypeGroup.MONSTER].attributes
                    );
                    deepFreeze(this.attributes);

                    this.levels.push(
                        ...cardValues[CardTypeGroup.MONSTER].levels
                    );
                    deepFreeze(this.levels);

                    this.linkMarkers.push(
                        ...cardValues[CardTypeGroup.MONSTER].linkMarkers
                    );
                    deepFreeze(this.linkMarkers);
                    MemoryCardDatabase.logger.debug(
                        "Registered monster values.",
                        this.attributes,
                        this.levels,
                        this.linkMarkers
                    );
                });
        }
        return this.loadingCardValues;
    }

    private registerCards(unlinkedCards: UnlinkedCard[]): void {
        const setMap = new Map<string, CardSet>(
            this.sets.map((set) => [set.name, set])
        );
        const types = flatten(Array.from(this.types.values()));
        const typeMap = new Map<string, CardType>(
            types.map((type) => [type.name, type])
        );

        for (const unlinkedCard of unlinkedCards) {
            if (this.cardsByPasscode.has(unlinkedCard.passcode)) {
                continue;
            }
            const card = this.cardLinkingService.linkCard(
                unlinkedCard,
                setMap,
                typeMap
            );

            deepFreeze(card);
            this.cardsByPasscode.set(card.passcode, card);
            this.cardsByName.set(card.name, card);
            MemoryCardDatabase.logger.trace(
                `Registered card '${card.passcode}'.`
            );
        }
    }

    private getCardMap(findCardBy: FindCardBy): Map<string, Card> {
        return findCardBy == FindCardBy.PASSCODE
            ? this.cardsByPasscode
            : this.cardsByName;
    }
}

export { MemoryCardDatabase };
