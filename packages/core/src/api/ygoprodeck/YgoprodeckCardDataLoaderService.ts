import { mapCard, RawCard } from "./mapping/mapCard";
import { mapCardSet, RawCardSet } from "./mapping/mapCardSet";
import { CardSet } from "../../core/card/set/CardSet";
import { CardDataLoaderService } from "../../core/card/CardDataLoaderService";
import { PaginatedResponse } from "./PaginatedResponse";
import { inject, injectable } from "inversify";
import { mapCardValues, RawCardValues } from "./mapping/mapCardValues";
import { CardValues } from "../../core/card/type/CardValues";
import { UnlinkedCard } from "../../core/card/UnlinkedCard";
import { TYPES } from "../../types";
import { HttpRequestConfig, HttpService } from "../../core/http/HttpService";
import { mapArchetype, RawArchetype } from "./mapping/mapArchetype";
import {
    DEVELOPMENT_MODE,
    FORCE_YGOPRODECK_INTERNAL_ENDPOINTS_USAGE,
} from "../../mode";
import { FindCardBy } from "../../core/card/CardDatabase";
import { Card } from "../../core/card/Card";

/**
 * {@link CardDataLoaderService} implementation using the YGOPRODECK API (https://db.ygoprodeck.com/api-guide/).
 */
@injectable()
class YgoprodeckCardDataLoaderService implements CardDataLoaderService {
    private static readonly CARD_INFO_CHUNK_SIZE = 2000;
    private static readonly USE_INTERNAL_ENDPOINTS =
        FORCE_YGOPRODECK_INTERNAL_ENDPOINTS_USAGE || !DEVELOPMENT_MODE;
    private static readonly API_BASE_URL = YgoprodeckCardDataLoaderService.USE_INTERNAL_ENDPOINTS
        ? "https://db.ygoprodeck.com/api_internal/v7/"
        : "https://db.ygoprodeck.com/api/v7/";

    private readonly httpService: HttpService;

    constructor(
        @inject(TYPES.HttpService)
        httpService: HttpService
    ) {
        this.httpService = httpService;
    }

    public async getCard(
        cardKey: string,
        findCardBy: FindCardBy
    ): Promise<UnlinkedCard | null> {
        const params: { [key: string]: string } = {
            misc: "yes",
            format: "all",
        };
        if (findCardBy == FindCardBy.PASSCODE) {
            params.id = cardKey;
            // Include alternate artworks IDs as well.
            params.includeAliased = "yes";
        } else {
            // "fname" uses fuzzy name matching so we get the most similar match instead of an exact match.
            params.fname = cardKey;
            params.sort = "relevance";
        }

        const response = await this.httpService.get<{ data: RawCard[] }>(
            "cardinfo.php",
            {
                ...this.createBaseRequestConfig(),
                params,
                validateStatus: (status: number) =>
                    status === 200 || status === 400, // Special 400 handling, we expect this if a card is not found })
            }
        );
        if (response.status === 400) {
            return null;
        }
        const responseData = response.data;
        // If a match is found, we take the very first item (best match).
        return mapCard(responseData.data[0]);
    }

    public async getAllCards(): Promise<UnlinkedCard[]> {
        const responseData = await this.loadPaginated<RawCard>(
            YgoprodeckCardDataLoaderService.CARD_INFO_CHUNK_SIZE,
            async (offset) => {
                const response = await this.httpService.get<
                    PaginatedResponse<RawCard[]>
                >("cardinfo.php", {
                    ...this.createBaseRequestConfig(),
                    params: {
                        misc: "yes",
                        format: "all",
                        includeAliased: "yes",
                        num:
                            YgoprodeckCardDataLoaderService.CARD_INFO_CHUNK_SIZE,
                        offset,
                    },
                });
                return response.data;
            }
        );

        return responseData.map(mapCard);
    }

    public async getAllCardSets(): Promise<CardSet[]> {
        const response = await this.httpService.get<RawCardSet[]>(
            "cardsets.php",

            this.createBaseRequestConfig()
        );
        return response.data.map(mapCardSet);
    }

    public async getCardValues(): Promise<CardValues> {
        const response = await this.httpService.get<RawCardValues>(
            "cardvalues.php",
            this.createBaseRequestConfig()
        );
        return mapCardValues(response.data);
    }

    public async getArchetypes(): Promise<string[]> {
        const response = await this.httpService.get<RawArchetype[]>(
            "archetypes.php",
            this.createBaseRequestConfig()
        );
        return response.data.map(mapArchetype);
    }

    public async updateViews(card: Card): Promise<void> {
        if (!YgoprodeckCardDataLoaderService.USE_INTERNAL_ENDPOINTS) {
            return;
        }
        await this.httpService.get<void>("updateViews.php", {
            baseUrl: YgoprodeckCardDataLoaderService.API_BASE_URL,
            timeout: 3000,
            responseType: "text",
            params: {
                name: card.name,
            },
        });
    }

    private createBaseRequestConfig(): HttpRequestConfig {
        return {
            baseUrl: YgoprodeckCardDataLoaderService.API_BASE_URL,
            timeout: 10000,
            responseType: "json",
        };
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
