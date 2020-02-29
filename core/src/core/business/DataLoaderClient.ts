import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";

interface DataLoaderClient {
    getCardInfo(): Promise<Card[]>;

    getCardSets(): Promise<CardSet[]>;
}

export { DataLoaderClient };
