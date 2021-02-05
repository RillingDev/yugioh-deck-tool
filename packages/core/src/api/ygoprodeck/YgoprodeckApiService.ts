import type { RawCard } from "./mapping/mapCard";
import { mapCard } from "./mapping/mapCard";
import type { RawCardSet } from "./mapping/mapCardSet";
import { mapCardSet } from "./mapping/mapCardSet";
import type { CardSet } from "../../core/card/set/CardSet";
import type { PaginatedResponse } from "./PaginatedResponse";
import { inject, injectable } from "inversify";
import type { RawCardValues } from "./mapping/mapCardValues";
import { mapCardValues } from "./mapping/mapCardValues";
import type { CardValues } from "../../core/card/type/CardValues";
import type { UnlinkedCard } from "../../core/card/UnlinkedCard";
import { TYPES } from "../../types";
import { HttpService } from "../../core/http/HttpService";
import type { RawArchetype } from "./mapping/mapArchetype";
import { mapArchetype } from "./mapping/mapArchetype";
import type { Card } from "../../core/card/Card";
import { Environment, EnvironmentConfig } from "../../EnvironmentConfig";

import type { Format } from "../../core/card/format/Format";
import { fromByteArray } from "base64-js";

interface CardInfoOptions {
    readonly includeAliased: boolean; // If all versions of cards with the same name should be shown (alternate artworks)

    readonly format?: Format | null;
    readonly passcode?: string | null;
    readonly fuzzyName?: string | null;

    readonly sorting?: "relevance" | null;

    // Optional Ygoprodeck credentials. When provided, only cards in this users collection are returned.
    readonly auth?: Credentials;
}

export interface Credentials {
    readonly username: string;
    readonly token: string;
}

/**
 * See YGOPRODECK API (https://db.ygoprodeck.com/api-guide/).
 */
@injectable()
export class YgoprodeckApiService {
    private static readonly CHUNK_SIZE = 2000;

    private readonly environmentConfig: EnvironmentConfig;
    private readonly httpService: HttpService;
    private readonly textEncoder: TextEncoder;

    constructor(
        @inject(TYPES.HttpService)
        httpService: HttpService,
        @inject(TYPES.EnvironmentConfig)
        environmentConfig: EnvironmentConfig
    ) {
        this.environmentConfig = environmentConfig;
        this.httpService = httpService;
        this.textEncoder = new TextEncoder();
    }

    public async getSingleCard(
        options: CardInfoOptions
    ): Promise<UnlinkedCard | null> {
        const response = await this.httpService.get<{ data: RawCard[] }>(
            "cardinfo.php",
            {
                baseUrl: this.getBaseUrl(),
                params: this.createCardInfoParams(options),
                headers: this.createAuthHeaders(options),
                timeout: 5000,
                responseType: "json",
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

    public async getCards(options: CardInfoOptions): Promise<UnlinkedCard[]> {
        const params = this.createCardInfoParams(options);
        const authHeaders = this.createAuthHeaders(options);

        const responseData = await this.loadPaginated<RawCard>(
            YgoprodeckApiService.CHUNK_SIZE,
            async (offset) => {
                const response = await this.httpService.get<
                    PaginatedResponse<RawCard[]>
                >("cardinfo.php", {
                    baseUrl: this.getBaseUrl(),
                    params: {
                        ...params,
                        num: YgoprodeckApiService.CHUNK_SIZE,
                        offset,
                    },
                    headers: authHeaders,
                    timeout: 10000,
                    responseType: "json",
                });
                return response.data;
            }
        );

        return responseData.map(mapCard);
    }

    private createCardInfoParams(
        options: CardInfoOptions
    ): Record<string, string> {
        const params: Record<string, string> = {};
        params.misc = "yes"; // Always needed
        if (options.includeAliased) {
            params.includeAliased = "yes";
        }
        if (options.format != null) {
            params.format = String(options.format).toLowerCase();
        } else {
            params.format = "all";
        }
        if (options.passcode != null) {
            params.id = options.passcode;
        }
        if (options.fuzzyName != null) {
            params.fname = options.fuzzyName;
        }
        if (options.sorting != null) {
            params.sort = options.sorting;
        }
        if (options.auth != null) {
            // If authorization is used, somewhat unique value is required to ensure no caching is done server-side
            params.cachebust = String(Date.now());
        }
        return params;
    }

    public async getCardSets(): Promise<CardSet[]> {
        const response = await this.httpService.get<RawCardSet[]>(
            "cardsets.php",

            {
                baseUrl: this.getBaseUrl(),
                timeout: 10000,
                responseType: "json",
            }
        );
        return response.data.map(mapCardSet);
    }

    public async getCardValues(): Promise<CardValues> {
        const response = await this.httpService.get<RawCardValues>(
            "cardvalues.php",
            {
                baseUrl: this.getBaseUrl(),
                timeout: 10000,
                responseType: "json",
            }
        );
        return mapCardValues(response.data);
    }

    public async getArchetypes(): Promise<string[]> {
        const response = await this.httpService.get<RawArchetype[]>(
            "archetypes.php",
            {
                baseUrl: this.getBaseUrl(),
                timeout: 10000,
                responseType: "json",
            }
        );
        return response.data.map(mapArchetype);
    }

    public async updateViews(card: Card): Promise<void> {
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

    private createAuthHeaders(
        options: CardInfoOptions
    ): Record<string, string> {
        if (options.auth == null) {
            return {};
        }
        // See https://tools.ietf.org/html/rfc7617 and https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme
        const encodedCredentials = fromByteArray(
            this.textEncoder.encode(
                `${options.auth.username}:${options.auth.token}`
            )
        );
        return {
            "X-Authorization": `Basic ${encodedCredentials}`,
        };
    }
}
