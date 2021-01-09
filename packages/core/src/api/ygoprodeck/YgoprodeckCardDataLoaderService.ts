import type { RawCard } from "./mapping/mapCard";
import { mapCard } from "./mapping/mapCard";
import type { RawCardSet } from "./mapping/mapCardSet";
import { mapCardSet } from "./mapping/mapCardSet";
import type { CardSet } from "../../core/card/set/CardSet";
import type { CardDataLoaderService } from "../../core/card/CardDataLoaderService";
import type { PaginatedResponse } from "./PaginatedResponse";
import { inject, injectable } from "inversify";
import type { RawCardValues } from "./mapping/mapCardValues";
import { mapCardValues } from "./mapping/mapCardValues";
import type { CardValues } from "../../core/card/type/CardValues";
import type { UnlinkedCard } from "../../core/card/UnlinkedCard";
import { TYPES } from "../../types";
import type {
    HttpRequestConfig,
    HttpService,
} from "../../core/http/HttpService";
import type { RawArchetype } from "./mapping/mapArchetype";
import { mapArchetype } from "./mapping/mapArchetype";
import { FindCardBy } from "../../core/card/CardDatabase";
import type { Card } from "../../core/card/Card";
import type { EnvironmentConfig } from "../../EnvironmentConfig";
import { Environment } from "../../EnvironmentConfig";

/**
 * {@link CardDataLoaderService} implementation using the YGOPRODECK API (https://db.ygoprodeck.com/api-guide/).
 */
@injectable()
class YgoprodeckCardDataLoaderService implements CardDataLoaderService {
    private static readonly CARD_INFO_CHUNK_SIZE = 2000;

    private readonly environmentConfig: EnvironmentConfig;
    private readonly httpService: HttpService;

    constructor(
        @inject(TYPES.HttpService)
        httpService: HttpService,
        @inject(TYPES.EnvironmentConfig)
        environmentConfig: EnvironmentConfig
    ) {
        this.environmentConfig = environmentConfig;
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
                    status === 200 || status === 400, // Special 400 handling, we expect this if a card is not found.
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
        if (this.environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error("Only available in YGOPRODECK environment.");
        }
        await this.httpService.get<void>("updateViews.php", {
            baseUrl: this.getBaseUrl(),
            timeout: 3000,
            responseType: "text",
            params: {
                name: card.name,
            },
        });
    }

    private getBaseUrl(): string {
        if (this.environmentConfig.getEnvironment() == Environment.YGOPRODECK) {
            return "https://db.ygoprodeck.com/api_internal/v7/";
        }
        return "https://db.ygoprodeck.com/api/v7/";
    }

    private createBaseRequestConfig(): HttpRequestConfig {
        return {
            baseUrl: this.getBaseUrl(),
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
