import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
interface CardDataLoaderService {
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
}
export { CardDataLoaderService };
