import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardType } from "../model/CardType";
import { CardTypeGroup } from "../model/CardTypeGroup";

export interface CardDatabase {
    /**
     * Initializes the database.
     * Consumer has to ensure this is only called once.
     */
    init(): Promise<void>;

    isReady(): boolean;

    hasCard(cardId: string): boolean;

    getCard(cardId: string): Card | null;

    getCards(): Card[];

    getSets(): CardSet[];

    getTypes(): CardType[];

    getRaces(cardTypeGroup: CardTypeGroup): string[];

    getMonsterAttributes(): string[];

    getMonsterLevels(): number[];

    getMonsterLinkMarkers(): string[];
}
