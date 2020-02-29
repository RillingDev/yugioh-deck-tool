import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
export interface CardDatabase {
    init(): Promise<void>;
    isReady(): boolean;
    hasCard(cardId: string): boolean;
    getCard(cardId: string): Card | null;
    getCards(): Card[];
    getSets(): CardSet[];
}
//# sourceMappingURL=CardDatabase.d.ts.map