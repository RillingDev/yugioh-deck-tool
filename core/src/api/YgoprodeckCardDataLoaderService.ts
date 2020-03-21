import { mapCardInfo, RawCard } from "./mapping/mapCardInfo";
import { mapCardSets, RawCardSet } from "./mapping/mapCardSets";
import { CardSet } from "../core/model/ygo/CardSet";
import { CardDataLoaderService } from "../core/business/service/CardDataLoaderService";
import { PaginatedResponse } from "./PaginatedResponse";
import { inject, injectable } from "inversify";
import { mapCardValues, RawCardValues } from "./mapping/mapCardValues";
import { CardValues } from "../core/model/ygo/CardValues";
import { UnlinkedCard } from "../core/model/ygo/intermediate/UnlinkedCard";
import { TYPES } from "../types";
import { HttpService } from "../core/business/service/HttpService";
import { mapArchetypes, RawArchetype } from "./mapping/mapArchetypes";

@injectable()
class YgoprodeckCardDataLoaderService implements CardDataLoaderService {
    private static readonly CARD_INFO_CHUNK_SIZE = 2500;
    private static readonly DEFAULT_TIMEOUT = 10000;

    private static readonly API_BASE_URL = "https://db.ygoprodeck.com/api/v7/";

    private readonly httpService: HttpService;

    constructor(
        @inject(TYPES.HttpService)
        httpService: HttpService
    ) {
        this.httpService = httpService;
    }

    public async getCardInfo(): Promise<UnlinkedCard[]> {
        const responseData = await this.loadPaginated<RawCard>(
            YgoprodeckCardDataLoaderService.CARD_INFO_CHUNK_SIZE,
            async offset => {
                const response = await this.httpService.get<
                    PaginatedResponse<RawCard[]>
                >("cardinfo.php", {
                    baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                    timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                    responseType: "json",
                    params: {
                        misc: "yes",
                        includeAliased: "yes",
                        num:
                            YgoprodeckCardDataLoaderService.CARD_INFO_CHUNK_SIZE,
                        offset
                    }
                });
                return response.data;
            }
        );
        return mapCardInfo(responseData);
    }

    public async getCardSets(): Promise<CardSet[]> {
        const response = await this.httpService.get<RawCardSet[]>(
            "cardsets.php",
            {
                baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                responseType: "json"
            }
        );
        return mapCardSets(response.data);
    }

    public async getCardValues(): Promise<CardValues> {
        const response = await this.httpService.get<RawCardValues>(
            "cardvalues.php",
            {
                baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                responseType: "json"
            }
        );
        return mapCardValues(response.data);
    }

    public async getArchetypes(): Promise<string[]> {
        const response = await this.httpService.get<RawArchetype[]>(
            "archetypes.php",
            {
                baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                responseType: "json"
            }
        );
        return mapArchetypes(response.data);
    }

    private async loadPaginated<T>(
        pageSize: number,
        fetcher: (offset: number) => Promise<PaginatedResponse<T[]>>
    ): Promise<T[]> {
        const result: T[] = [];
        let offset = 0;
        let total: number | null = null;

        while (total == null || result.length < total) {
            const response = await fetcher(offset);
            result.push(...response.data);
            if (total == null) {
                total = response.meta.total_rows;
            }
            offset += pageSize;
        }

        return result;
    }
}

export { YgoprodeckCardDataLoaderService };
