import { CardSet } from "../core/model/CardSet";
import { CardDataLoaderService, UnlinkedCard } from "../core/business/CardDataLoaderService";
import { CardValues } from "../core/model/CardValues";
declare class YgoprodeckApiService implements CardDataLoaderService {
    private static readonly CARD_INFO_CHUNK_SIZE;
    private readonly httpClient;
    constructor();
    getCardInfo(): Promise<UnlinkedCard[]>;
    getCardSets(): Promise<CardSet[]>;
    getCardValues(): Promise<CardValues>;
    private loadPaginated;
}
export { YgoprodeckApiService };
