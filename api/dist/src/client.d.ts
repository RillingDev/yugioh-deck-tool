import { Card } from "./model/Card";
import { CardSet } from "./model/CardSet";
declare class Client {
    private readonly httpClient;
    constructor();
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
}
export { Client };
