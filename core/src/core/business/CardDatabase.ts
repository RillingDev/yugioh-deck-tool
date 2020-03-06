import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardType } from "../model/types/CardType";

export interface CardDatabase {
    init(): Promise<void>;

    isReady(): boolean;

    hasCard(cardId: string): boolean;

    getCard(cardId: string): Card | null;

    getCards(): Card[];

    getSets(): CardSet[];

    getTypes(): CardType[];

    getSkillRaces(): string[];

    getSpellRaces(): string[];

    getTrapRaces(): string[];

    getMonsterRaces(): string[];

    getMonsterAttributes(): string[];

    getMonsterLevels(): number[];

    getMonsterLinkMarkers(): string[];
}
