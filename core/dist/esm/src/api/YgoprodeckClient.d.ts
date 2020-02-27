import { Card } from "../core/model/Card";
import { CardSet } from "../core/model/CardSet";
import { ApiClient } from "../core/business/ApiClient";
declare class YgoprodeckClient implements ApiClient {
    private readonly httpClient;
    private static readonly CARD_INFO_CHUNK_SIZE;
    constructor();
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
    private loadPaginated;
}
export { YgoprodeckClient };
//# sourceMappingURL=YgoprodeckClient.d.ts.map