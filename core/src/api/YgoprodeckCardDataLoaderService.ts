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
import { Format } from "../core/model/ygo/Format";

/**
 * {@link CardDataLoaderService} implementation using the YGOPRODECK API (https://db.ygoprodeck.com/api-guide/).
 */
@injectable()
class YgoprodeckCardDataLoaderService implements CardDataLoaderService {
    private static readonly CARD_INFO_CHUNK_SIZE = 2000;
    private static readonly DEFAULT_TIMEOUT = 10000;

    private static readonly API_BASE_URL = "https://db.ygoprodeck.com/api/v7/";
    private static readonly ENDPOINT_CARD_INFO = "cardinfo.php";
    private static readonly ENDPOINT_CARD_SETS = "cardsets.php";
    private static readonly ENDPOINT_CARD_VALUES = "cardvalues.php";

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
            async (offset) => {
                const response = await this.httpService.get<
                    PaginatedResponse<RawCard[]>
                >(YgoprodeckCardDataLoaderService.ENDPOINT_CARD_INFO, {
                    baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                    timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                    responseType: "json",
                    params: {
                        misc: "yes",
                        includeAliased: "yes",
                        num:
                            YgoprodeckCardDataLoaderService.CARD_INFO_CHUNK_SIZE,
                        offset,
                    },
                });
                return response.data;
            }
        );
        // Rush Duel is excluded by default, load it separately.
        const secondaryResponse = await this.httpService.get<
            PaginatedResponse<RawCard[]>
        >(YgoprodeckCardDataLoaderService.ENDPOINT_CARD_INFO, {
            baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
            timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
            responseType: "json",
            params: {
                misc: "yes",
                includeAliased: "yes",
                format: Format.RUSH_DUEL,
            },
        });
        responseData.push(...secondaryResponse.data.data);

        return mapCardInfo(responseData);
    }

    public async getCardSets(): Promise<CardSet[]> {
        const response = await this.httpService.get<RawCardSet[]>(
            YgoprodeckCardDataLoaderService.ENDPOINT_CARD_SETS,
            {
                baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                responseType: "json",
            }
        );
        return mapCardSets(response.data);
    }

    public async getCardValues(): Promise<CardValues> {
        const response = await this.httpService.get<RawCardValues>(
            YgoprodeckCardDataLoaderService.ENDPOINT_CARD_VALUES,
            {
                baseURL: YgoprodeckCardDataLoaderService.API_BASE_URL,
                timeout: YgoprodeckCardDataLoaderService.DEFAULT_TIMEOUT,
                responseType: "json",
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
                responseType: "json",
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
