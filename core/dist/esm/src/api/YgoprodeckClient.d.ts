import { Card } from "../core/model/Card";
import { CardSet } from "../core/model/CardSet";
import { ApiClient } from "../core/business/ApiClient";
declare class YgoprodeckClient implements ApiClient {
    private readonly httpClient;
    constructor();
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
}
export { YgoprodeckClient };
//# sourceMappingURL=YgoprodeckClient.d.ts.map