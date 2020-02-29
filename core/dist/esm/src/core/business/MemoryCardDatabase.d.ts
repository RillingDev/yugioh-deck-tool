import { CardDataLoaderService } from "./CardDataLoaderService";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardDatabase } from "./CardDatabase";
declare class MemoryCardDatabase implements CardDatabase {
    private readonly dataLoaderClient;
    private readonly ready;
    private readonly cards;
    private readonly races;
    private readonly attributes;
    private readonly types;
    private readonly sets;
    constructor(dataLoaderClient: CardDataLoaderService);
    init(): Promise<void>;
    isReady(): boolean;
    hasCard(cardId: string): boolean;
    getCard(cardId: string): Card | null;
    getCards(): Card[];
    getTypes(): string[];
    getRaces(): string[];
    getAttributes(): string[];
    getSets(): CardSet[];
}
export { MemoryCardDatabase };
