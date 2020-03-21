import { Card } from "../model/ygo/Card";
import { CardSet } from "../model/ygo/CardSet";
import { CardType } from "../model/ygo/CardType";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";

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

    getArchetypes(): string[];

    getTypes(cardTypeGroup: CardTypeGroup): CardType[];

    getRaces(cardTypeGroup: CardTypeGroup): string[];

    getMonsterAttributes(): string[];

    getMonsterLevels(): number[];

    getMonsterLinkMarkers(): string[];
}
