import axios, { AxiosInstance } from "axios";
import { mapCardInfo, RawCard } from "./mapping/mapCardInfo";
import { Card } from "../core/model/Card";
import { mapCardSets, RawCardSet } from "./mapping/mapCardSets";
import { CardSet } from "../core/model/CardSet";
import { CardDataLoaderService } from "../core/business/CardDataLoaderService";
import { PaginatedResponse } from "./PaginatedResponse";
import { injectable } from "inversify";

@injectable()
class YgoprodeckApiService implements CardDataLoaderService {
    private readonly httpClient: AxiosInstance;
    private static readonly CARD_INFO_CHUNK_SIZE = 2500;

    constructor() {
        this.httpClient = axios.create({
            baseURL: "https://ygoprodeck.com/api/v6/",
            timeout: 3000,
            responseType: "json",
            validateStatus: status => status === 200
        });
    }

    public async getCardInfo(): Promise<Card[]> {
        const responseData = await this.loadPaginated<RawCard>(
            YgoprodeckApiService.CARD_INFO_CHUNK_SIZE,
            async offset => {
                const response = await this.httpClient.get<
                    PaginatedResponse<RawCard[]>
                >("cardinfo.php", {
                    params: {
                        misc: "yes",
                        includeAliased: "yes",
                        num: YgoprodeckApiService.CARD_INFO_CHUNK_SIZE,
                        offset
                    }
                });
                return response.data;
            }
        );
        return mapCardInfo(responseData);
    }

    public async getCardSets(): Promise<CardSet[]> {
        const response = await this.httpClient.get<RawCardSet[]>(
            "cardsets.php"
        );
        return mapCardSets(response.data);
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

export { YgoprodeckApiService };
