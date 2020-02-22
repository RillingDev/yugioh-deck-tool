import { Card } from "./model/Card";
import { CardSet } from "./model/CardSet";
declare class YgoprodeckClient {
    private readonly httpClient;
    constructor();
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
}
export { YgoprodeckClient };
//# sourceMappingURL=YgoprodeckClient.d.ts.map