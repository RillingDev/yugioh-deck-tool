import { Card } from "../core/model/Card";
import { CardSet } from "../core/model/CardSet";
import { CardDataLoaderService } from "../core/business/CardDataLoaderService";
declare class YgoprodeckApiService implements CardDataLoaderService {
    private readonly httpClient;
    private static readonly CARD_INFO_CHUNK_SIZE;
    constructor();
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
    private loadPaginated;
}
export { YgoprodeckApiService };
//# sourceMappingURL=YgoprodeckApiService.d.ts.map