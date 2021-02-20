import { inject, injectable } from "inversify";
import { INTERNAL_TYPES, TYPES } from "../types";
import { CardDataLoaderService } from "./CardDataLoaderService";
import type { Card } from "./Card";
import type { CardSet } from "./set/CardSet";
import type { CardDatabase } from "./CardDatabase";
import { FindCardBy } from "./CardDatabase";
import type { CardType } from "./type/CardType";
import { CardTypeCategory } from "./type/CardTypeCategory";
import type { UnlinkedCard } from "./UnlinkedCard";
import { deepFreeze } from "lightdash";
import { CardLinkingService } from "./CardLinkingService";
import { getLogger } from "../logger";

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private static readonly logger = getLogger(MemoryCardDatabase);

    readonly #cardDataLoaderService: CardDataLoaderService;
    readonly #cardLinkingService: CardLinkingService;

    #loadingSets: Promise<void> | null;
    #loadingArchetypes: Promise<void> | null;
    #loadingCardValues: Promise<void> | null;
    #loadingAllCards: Promise<void> | null;

    readonly #cardsByPasscode: Map<string, Card>;
    readonly #cardsByName: Map<string, Card>;
    readonly #sets: CardSet[];
    readonly #archetypes: string[];
    readonly #types: Map<CardTypeCategory, CardType[]>;
    readonly #subTypes: Map<CardTypeCategory, string[]>;
    readonly #attributes: string[];
    readonly #linkMarkers: string[];
    readonly #levels: number[];

    constructor(
        @inject(TYPES.CardDataLoaderService)
        cardDataLoaderService: CardDataLoaderService,
        @inject(INTERNAL_TYPES.CardLinkingService)
        cardLinkingService: CardLinkingService
    ) {
        this.#cardDataLoaderService = cardDataLoaderService;
        this.#cardLinkingService = cardLinkingService;

        this.#loadingSets = null;
        this.#loadingArchetypes = null;
        this.#loadingCardValues = null;
        this.#loadingAllCards = null;

        this.#cardsByPasscode = new Map<string, Card>();
        this.#cardsByName = new Map<string, Card>();
        this.#sets = [];
        this.#archetypes = [];
        this.#types = new Map<CardTypeCategory, CardType[]>(
            Object.values(CardTypeCategory).map((typeCategory) => [
                typeCategory,
                [],
            ])
        );
        this.#subTypes = new Map<CardTypeCategory, string[]>(
            Object.values(CardTypeCategory).map((typeCategory) => [
                typeCategory,
                [],
            ])
        );
        this.#attributes = [];
        this.#linkMarkers = [];
        this.#levels = [];
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
        return Array.from(this.#cardsByPasscode.values());
    }

    public getSets(): CardSet[] {
        return this.#sets;
    }

    public getArchetypes(): string[] {
        return this.#archetypes;
    }

    public getTypes(typeCategory: CardTypeCategory): CardType[] {
        return this.#types.get(typeCategory)!;
    }

    public getSubTypes(typeCategory: CardTypeCategory): string[] {
        return this.#subTypes.get(typeCategory)!;
    }

    public getAttributes(): string[] {
        return this.#attributes;
    }

    public getLevels(): number[] {
        return this.#levels;
    }

    public getLinkMarkers(): string[] {
        return this.#linkMarkers;
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
            card = await this.#cardDataLoaderService.getCard(
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
        if (this.#loadingAllCards == null) {
            this.#loadingAllCards = this.#cardDataLoaderService
                .getAllCards()
                .then((cards) => this.registerCards(cards));
        }
        return this.#loadingAllCards;
    }

    private loadArchetypes(): Promise<void> {
        if (this.#loadingArchetypes == null) {
            this.#loadingArchetypes = this.#cardDataLoaderService
                .getArchetypes()
                .then((archetypes) => {
                    this.#archetypes.push(...archetypes);
                    deepFreeze(this.#archetypes);
                    MemoryCardDatabase.logger.debug(
                        "Registered archetypes.",
                        this.#archetypes
                    );
                });
        }
        return this.#loadingArchetypes;
    }

    private loadSets(): Promise<void> {
        if (this.#loadingSets == null) {
            this.#loadingSets = this.#cardDataLoaderService
                .getAllCardSets()
                .then((cardSets) => {
                    this.#sets.push(...cardSets);
                    deepFreeze(this.#sets);
                    MemoryCardDatabase.logger.debug(
                        "Registered sets.",
                        this.#sets
                    );
                });
        }
        return this.#loadingSets;
    }

    private async loadCardValues(): Promise<void> {
        if (this.#loadingCardValues == null) {
            this.#loadingCardValues = this.#cardDataLoaderService
                .getCardValues()
                .then((cardValues) => {
                    for (const typeCategory of Object.values(
                        CardTypeCategory
                    )) {
                        const cardTypes = this.#types.get(typeCategory)!;
                        cardTypes.push(...cardValues[typeCategory].types);
                        deepFreeze(cardTypes);

                        const cardSubTypes = this.#subTypes.get(typeCategory)!;
                        cardSubTypes.push(...cardValues[typeCategory].subTypes);
                        deepFreeze(cardSubTypes);
                    }
                    MemoryCardDatabase.logger.debug(
                        "Registered types and sub-types.",
                        this.#types,
                        this.#subTypes
                    );

                    this.#attributes.push(
                        ...cardValues[CardTypeCategory.MONSTER].attributes
                    );
                    deepFreeze(this.#attributes);

                    this.#levels.push(
                        ...cardValues[CardTypeCategory.MONSTER].levels
                    );
                    deepFreeze(this.#levels);

                    this.#linkMarkers.push(
                        ...cardValues[CardTypeCategory.MONSTER].linkMarkers
                    );
                    deepFreeze(this.#linkMarkers);
                    MemoryCardDatabase.logger.debug(
                        "Registered monster values.",
                        this.#attributes,
                        this.#levels,
                        this.#linkMarkers
                    );
                });
        }
        return this.#loadingCardValues;
    }

    private registerCards(unlinkedCards: UnlinkedCard[]): void {
        const setMap = new Map<string, CardSet>(
            this.#sets.map((set) => [set.name, set])
        );
        const types = Array.from(this.#types.values()).flat();
        const typeMap = new Map<string, CardType>(
            types.map((type) => [type.name, type])
        );

        for (const unlinkedCard of unlinkedCards) {
            if (this.#cardsByPasscode.has(unlinkedCard.passcode)) {
                continue;
            }
            const card = this.#cardLinkingService.linkCard(
                unlinkedCard,
                setMap,
                typeMap
            );

            deepFreeze(card);
            this.#cardsByPasscode.set(card.passcode, card);
            this.#cardsByName.set(card.name, card);
            MemoryCardDatabase.logger.trace(
                `Registered card '${card.passcode}'.`
            );
        }
    }

    private getCardMap(findCardBy: FindCardBy): Map<string, Card> {
        return findCardBy == FindCardBy.PASSCODE
            ? this.#cardsByPasscode
            : this.#cardsByName;
    }
}

export { MemoryCardDatabase };
