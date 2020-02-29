import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService } from "./CardDataLoaderService";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardDatabase } from "./CardDatabase";

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly dataLoaderClient: CardDataLoaderService;
    private readonly ready: boolean;
    private readonly cards: Map<string, Card>;
    private readonly races: Set<string>;
    private readonly attributes: Set<string>;
    private readonly types: Set<string>;
    private readonly sets: CardSet[];

    constructor(
        @inject(TYPES.CardDataLoaderService)
        dataLoaderClient: CardDataLoaderService
    ) {
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map<string, Card>();
        this.races = new Set<string>();
        this.attributes = new Set<string>();
        this.types = new Set<string>();
        this.sets = [];
        this.ready = false;
    }

    public async init(): Promise<void> {
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
            if (
                card.attribute != null &&
                !this.attributes.has(card.attribute)
            ) {
                this.attributes.add(card.attribute);
            }
        }
        this.sets.push(...cardSets);
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

    public getTypes(): string[] {
        return Array.from(this.types.values());
    }

    public getRaces(): string[] {
        return Array.from(this.races.values());
    }

    public getAttributes(): string[] {
        return Array.from(this.attributes.values());
    }

    public getSets(): CardSet[] {
        return Array.from(this.sets);
    }
}

export { MemoryCardDatabase };
