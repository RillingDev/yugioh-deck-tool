import type { CardDataLoaderService } from "../../src/core/card/CardDataLoaderService";
import type { CardSet } from "../../src/core/card/set/CardSet";
import type { UnlinkedCard } from "../../src/core/card/UnlinkedCard";
import type { CardValues } from "../../src/core/card/type/CardValues";
import { injectable } from "inversify";
import { CardTypeCategory } from "../../src/core/card/type/CardTypeCategory";

@injectable()
export class MockDataLoaderService implements CardDataLoaderService {
    public getAllCardSets(): Promise<CardSet[]> {
        return Promise.resolve([]);
    }

    public getAllCards(): Promise<UnlinkedCard[]> {
        return Promise.resolve([]);
    }

    public getArchetypes(): Promise<string[]> {
        return Promise.resolve([]);
    }

    public getCard(): Promise<UnlinkedCard | null> {
        return Promise.resolve(null);
    }

    public getCardValues(): Promise<CardValues> {
        return Promise.resolve({
            [CardTypeCategory.MONSTER]: {
                subTypes: [],
                types: [],
                attributes: [],
                levels: [],
                linkMarkers: [],
            },
            [CardTypeCategory.SPELL]: {
                subTypes: [],
                types: [],
            },
            [CardTypeCategory.TRAP]: {
                subTypes: [],
                types: [],
            },
            [CardTypeCategory.SKILL]: {
                subTypes: [],
                types: [],
            },
        });
    }
}
