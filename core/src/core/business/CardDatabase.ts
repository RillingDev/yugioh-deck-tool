import { Card } from "../model/ygo/Card";
import { CardSet } from "../model/ygo/CardSet";
import { CardType } from "../model/ygo/CardType";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";

/**
 * @public
 */
export interface CardDatabase {
    /**
     * Fully fills the database.
     */
    prepareAll(): Promise<void>;

    /**
     * Partially fills the database, loading a single card and direct dependencies.
     */
    prepareCardByName(cardName: string): Promise<void>;

    hasCardByName(cardName: string): boolean;

    getCardByName(cardName: string): Card | null;

    hasCardById(cardId: string): boolean;

    getCardById(cardId: string): Card | null;

    getCards(): Card[];

    getSets(): CardSet[];

    getArchetypes(): string[];

    getTypes(cardTypeGroup: CardTypeGroup): CardType[];

    getRaces(cardTypeGroup: CardTypeGroup): string[];

    getMonsterAttributes(): string[];

    getMonsterLevels(): number[];

    getMonsterLinkMarkers(): string[];
}
