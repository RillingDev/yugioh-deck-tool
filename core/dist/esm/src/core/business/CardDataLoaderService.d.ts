import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardValues } from "../model/types/CardValues";
interface CardDataLoaderService {
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
    getCardValues(): Promise<CardValues>;
}
export { CardDataLoaderService };
