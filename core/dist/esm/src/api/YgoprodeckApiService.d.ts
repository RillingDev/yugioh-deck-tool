import { Card } from "../core/model/Card";
import { CardSet } from "../core/model/CardSet";
import { CardDataLoaderService } from "../core/business/CardDataLoaderService";
import { CardValues } from "../core/model/types/CardValues";
declare class YgoprodeckApiService implements CardDataLoaderService {
    private static readonly CARD_INFO_CHUNK_SIZE;
    private readonly httpClient;
    constructor();
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
    getCardValues(): Promise<CardValues>;
    private loadPaginated;
}
export { YgoprodeckApiService };
