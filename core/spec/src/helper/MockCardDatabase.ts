import { CardDatabase } from "../../../src/core/business/CardDatabase";
import { Card } from "../../../src/core/model/ygo/Card";
import { CardSet } from "../../../src/core/model/ygo/CardSet";
import { injectable } from "inversify";
import { CardType } from "../../../src/core/model/ygo/CardType";
import { CardTypeGroup } from "../../../src/core/model/ygo/CardTypeGroup";

@injectable()
class MockCardDatabase implements CardDatabase {
    private readonly cards: Map<string, Card>;

    constructor() {
        this.cards = new Map<string, Card>();
    }

    public registerCard(cardId: string, card: Card): void {
        this.cards.set(cardId, card);
    }

    public reset(): void {
        this.cards.clear();
    }

    public getCard(cardId: string): Card | null {
        return this.cards.get(cardId) ?? null;
    }

    public hasCard(cardId: string): boolean {
        return this.cards.has(cardId);
    }

    getCards(): Card[] {
        return [];
    }

    getSets(): CardSet[] {
        return [];
    }

    init(): Promise<void> {
        return Promise.resolve();
    }

    isReady(): boolean {
        return false;
    }

    getMonsterAttributes(): string[] {
        return [];
    }

    getMonsterLevels(): number[] {
        return [];
    }

    getMonsterLinkMarkers(): string[] {
        return [];
    }

    getRaces(): string[] {
        return [];
    }

    getTypes(): CardType[] {
        return [];
    }
}

export { MockCardDatabase };
