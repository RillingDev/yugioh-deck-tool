import { CardSet } from "../../model/ygo/CardSet";
import { CardValues } from "../../model/ygo/CardValues";
import { UnlinkedCard } from "../../model/ygo/intermediate/UnlinkedCard";

interface CardDataLoaderService {
    getCardInfo(): Promise<UnlinkedCard[]>;

    getCardSets(): Promise<CardSet[]>;

    getCardValues(): Promise<CardValues>;

    getArchetypes(): Promise<string[]>;
}

export { CardDataLoaderService };
