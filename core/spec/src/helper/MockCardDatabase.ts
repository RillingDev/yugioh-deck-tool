import { CardDatabase } from "../../../src/core/business/CardDatabase";
import { Card } from "../../../src/core/model/Card";
import { CardSet } from "../../../src/core/model/CardSet";
import { injectable } from "inversify";

@injectable()
class MockCardDatabase implements CardDatabase {
    private readonly cards: Map<string, Card>;

    constructor() {
        this.cards = new Map<string, Card>();
    }

    public registerCard(cardId: string, card: Card): void {
        this.cards.set(cardId, card);
    }

    public reset():void{
        this.cards.clear();
    }

    public getCard(cardId: string): Card | null {
        return this.cards.get(cardId) ?? null;
    }

    public hasCard(cardId: string): boolean {
        return this.cards.has(cardId);
    }

    getAttributes(): string[] {
        return [];
    }

    getCards(): Card[] {
        return [];
    }

    getRaces(): string[] {
        return [];
    }

    getSets(): CardSet[] {
        return [];
    }

    getTypes(): string[] {
        return [];
    }

    init(): Promise<void> {
        return Promise.resolve();
    }

    isReady(): boolean {
        return false;
    }
}

export { MockCardDatabase };
