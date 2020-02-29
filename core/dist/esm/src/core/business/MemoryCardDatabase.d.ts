import { CardDataLoaderService } from "./CardDataLoaderService";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardDatabase } from "./CardDatabase";
declare class MemoryCardDatabase implements CardDatabase {
    private readonly cards;
    private readonly cardSets;
    private readonly dataLoaderClient;
    private readonly ready;
    constructor(dataLoaderClient: CardDataLoaderService);
    init(): Promise<void>;
    isReady(): boolean;
    hasCard(cardId: string): boolean;
    getCard(cardId: string): Card | null;
    getCards(): Card[];
    getSets(): CardSet[];
}
export default MemoryCardDatabase;
//# sourceMappingURL=MemoryCardDatabase.d.ts.map