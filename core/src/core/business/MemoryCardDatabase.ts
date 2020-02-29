import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService } from "./CardDataLoaderService";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardDatabase } from "./CardDatabase";

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly cards: Map<string, Card>;
    private readonly cardSets: CardSet[];
    private readonly dataLoaderClient: CardDataLoaderService;
    private readonly ready: boolean;

    constructor(
        @inject(TYPES.CardDataLoaderService) dataLoaderClient: CardDataLoaderService
    ) {
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map<string, Card>();
        this.cardSets = [];
        this.ready = false;
    }

    public async init(): Promise<void> {
        const [cardInfo, cardSets] = await Promise.all([
            this.dataLoaderClient.getCardInfo(),
            this.dataLoaderClient.getCardSets()
        ]);

        for (const card of cardInfo) {
            this.cards.set(card.id, card);
        }
        this.cardSets.push(...cardSets);
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
        return Array.from(this.cardSets);
    }
}

export default MemoryCardDatabase;
