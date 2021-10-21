import type { RawCard } from "./mapping/mapCard";
import { mapCard } from "./mapping/mapCard";
import type { RawCardSet } from "./mapping/mapCardSet";
import { mapCardSet } from "./mapping/mapCardSet";
import type { PaginatedResponse } from "./PaginatedResponse";
import { createEmptyPaginatedResponse } from "./PaginatedResponse";
import { inject, injectable } from "inversify";
import type { RawCardValues } from "./mapping/mapCardValues";
import { mapCardValues } from "./mapping/mapCardValues";
import type { RawArchetype } from "./mapping/mapArchetype";
import { mapArchetype } from "./mapping/mapArchetype";
import type {
	Card,
	CardSet,
	CardValues,
	Format,
	UnlinkedCard,
} from "@yugioh-deck-tool/core";
import {
	EncodingService,
	Environment,
	EnvironmentConfig,
	HttpService,
	TYPES,
} from "@yugioh-deck-tool/core";

interface CardInfoOptions {
	readonly includeAliased: boolean; // If all versions of cards with the same name should be shown (alternate artworks)

	readonly format?: Format | null;
	readonly passcode?: string | null;
	readonly fuzzyName?: string | null;

	readonly sorting?: "relevance" | null;

	// Optional Ygoprodeck credentials. When provided, only cards in this user's collection are returned.
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

	// Is returned if no matching cards or an empty list should be returned.
	// While not technically an error, the API treats it as such.
	private static readonly HTTP_STATUS_NO_MATCHES = 400;

	readonly #environmentConfig: EnvironmentConfig;
	readonly #httpService: HttpService;
	readonly #encodingService: EncodingService;

	constructor(
		@inject(TYPES.HttpService)
		httpService: HttpService,
		@inject(TYPES.EnvironmentConfig)
		environmentConfig: EnvironmentConfig,
		@inject(TYPES.EncodingService)
		encodingService: EncodingService
	) {
		this.#environmentConfig = environmentConfig;
		this.#httpService = httpService;
		this.#encodingService = encodingService;
	}

	async getSingleCard(
		options: CardInfoOptions
	): Promise<UnlinkedCard | null> {
		const response = await this.#httpService.get<{ data: RawCard[] }>(
			"cardinfo.php",
			{
				baseUrl: this.#getBaseUrl(),
				params: this.#createCardInfoParams(options),
				headers: this.#createAuthHeaders(options),
				timeout: 5000,
				responseType: "json",
				validateStatus: this.#createCardInfoStatusValidator(),
			}
		);
		if (response.status === YgoprodeckApiService.HTTP_STATUS_NO_MATCHES) {
			return null;
		}
		const responseData = response.data;
		// If a match is found, we take the very first item (best match).
		return mapCard(responseData.data[0]);
	}

	async getCards(options: CardInfoOptions): Promise<UnlinkedCard[]> {
		const params = this.#createCardInfoParams(options);
		const authHeaders = this.#createAuthHeaders(options);

		const responseData = await this.#loadPaginated<RawCard>(
			async (offset) => {
				const response = await this.#httpService.get<
					PaginatedResponse<RawCard[]>
				>("cardinfo.php", {
					baseUrl: this.#getBaseUrl(),
					params: {
						...params,
						num: YgoprodeckApiService.CHUNK_SIZE,
						offset,
					},
					headers: authHeaders,
					timeout: 10000,
					responseType: "json",
					validateStatus: this.#createCardInfoStatusValidator(),
				});
				if (
					response.status ===
					YgoprodeckApiService.HTTP_STATUS_NO_MATCHES
				) {
					return createEmptyPaginatedResponse([]);
				}
				return response.data;
			}
		);

		return responseData.map(mapCard);
	}

	#createCardInfoParams(options: CardInfoOptions): Record<string, string> {
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
			// If authorization is used, a somewhat unique value is required to ensure no caching is done server-side
			params.cachebust = String(Date.now());
		}
		return params;
	}

	async getCardSets(): Promise<CardSet[]> {
		const response = await this.#httpService.get<RawCardSet[]>(
			"cardsets.php",

			{
				baseUrl: this.#getBaseUrl(),
				timeout: 10000,
				responseType: "json",
			}
		);
		return response.data.map(mapCardSet);
	}

	async getCardValues(): Promise<CardValues> {
		const response = await this.#httpService.get<RawCardValues>(
			"cardvalues.php",
			{
				baseUrl: this.#getBaseUrl(),
				timeout: 10000,
				responseType: "json",
			}
		);
		return mapCardValues(response.data);
	}

	async getArchetypes(): Promise<string[]> {
		const response = await this.#httpService.get<RawArchetype[]>(
			"archetypes.php",
			{
				baseUrl: this.#getBaseUrl(),
				timeout: 10000,
				responseType: "json",
			}
		);
		return response.data.map(mapArchetype);
	}

	async updateViews(card: Card): Promise<void> {
		await this.#httpService.get<void>("updateViews.php", {
			baseUrl: this.#getBaseUrl(),
			timeout: 3000,
			responseType: "text",
			params: {
				name: card.name,
			},
		});
	}

	#getBaseUrl(): string {
		if (
			this.#environmentConfig.getEnvironment() == Environment.YGOPRODECK
		) {
			return "https://db.ygoprodeck.com/api_internal/v7/";
		}
		return "https://db.ygoprodeck.com/api/v7/";
	}

	async #loadPaginated<T>(
		fetcher: (offset: number) => Promise<PaginatedResponse<T[]>>
	): Promise<T[]> {
		const result: T[] = [];
		let offset = 0;
		let pagesRemaining: number | null = null;

		while (pagesRemaining == null || pagesRemaining > 0) {
			const response = await fetcher(offset);
			result.push(...response.data);

			pagesRemaining = response.meta.pages_remaining;
			if (response.meta.next_page_offset != null) {
				offset = response.meta.next_page_offset;
			}
		}

		return result;
	}

	#createAuthHeaders(options: CardInfoOptions): Record<string, string> {
		if (options.auth == null) {
			return {};
		}
		// See https://tools.ietf.org/html/rfc7617 and https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme
		const encodedCredentials = this.#encodingService.encodeBase64String(
			this.#encodingService.encodeText(
				`${options.auth.username}:${options.auth.token}`
			),
			false
		);
		return {
			"X-Authorization": `Basic ${encodedCredentials}`,
		};
	}

	#createCardInfoStatusValidator(): (status: number) => boolean {
		return (status) =>
			(status >= 200 && status <= 299) ||
			status === YgoprodeckApiService.HTTP_STATUS_NO_MATCHES;
	}
}
