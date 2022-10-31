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
import type { Card, CardSet, CardValues, Format } from "@/core/lib";
import {
	EncodingService,
	Environment,
	EnvironmentConfig,
	TYPES,
} from "@/core/lib";
import { ResourceService } from "./ResourceService";
import { YGOPRODECK_TYPES } from "../types";
import type { UnlinkedCard } from "@/ygoprodeck/api/UnlinkedCard";

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

type StatusValidator = (status: number) => boolean;

const okStatusValidator: StatusValidator = (status) =>
	status >= 200 && status <= 299;

const cardInfoStatusValidator: StatusValidator = (status) =>
	okStatusValidator(status) ||
	status === YgoprodeckApiService.HTTP_STATUS_NO_MATCHES;

/**
 * See YGOPRODECK API (https://db.ygoprodeck.com/api-guide/).
 */
@injectable()
export class YgoprodeckApiService {
	private static readonly CHUNK_SIZE = 2000;

	// Is returned if no matching cards or an empty list should be returned.
	// While not technically an error, the API treats it as such.
	static readonly HTTP_STATUS_NO_MATCHES = 400;

	readonly #environmentConfig: EnvironmentConfig;
	readonly #encodingService: EncodingService;
	readonly #resourceService: ResourceService;

	constructor(
		@inject(TYPES.EnvironmentConfig)
		environmentConfig: EnvironmentConfig,
		@inject(TYPES.EncodingService)
		encodingService: EncodingService,
		@inject(YGOPRODECK_TYPES.ResourceService)
		resourceService: ResourceService
	) {
		this.#environmentConfig = environmentConfig;
		this.#encodingService = encodingService;
		this.#resourceService = resourceService;
	}

	async getSingleCard(
		options: CardInfoOptions
	): Promise<UnlinkedCard | null> {
		const url = new URL("cardinfo.php", this.#getBaseUrl());
		this.#putCardInfoParams(url.searchParams, options);

		const response = await this.#get<{ data: RawCard[] }>(url, {
			headers: this.#createAuthHeaders(options),
			validateStatus: cardInfoStatusValidator,
		});
		if (response.status === YgoprodeckApiService.HTTP_STATUS_NO_MATCHES) {
			return null;
		}
		const responseData = response.data;
		// If a match is found, we take the very first item (best match).
		return mapCard(responseData.data[0], this.#resourceService);
	}

	async getCards(options: CardInfoOptions): Promise<UnlinkedCard[]> {
		const urlBase = new URL("cardinfo.php", this.#getBaseUrl());
		this.#putCardInfoParams(urlBase.searchParams, options);
		urlBase.searchParams.set(
			"num",
			YgoprodeckApiService.CHUNK_SIZE.toString()
		);

		const authHeaders = this.#createAuthHeaders(options);

		const responseData = await this.#loadPaginated<RawCard>(
			async (offset) => {
				const url = new URL(urlBase);
				url.searchParams.set("offset", offset.toString());

				const response = await this.#get<PaginatedResponse<RawCard[]>>(
					url,
					{
						headers: authHeaders,
						validateStatus: cardInfoStatusValidator,
					}
				);
				if (
					response.status ===
					YgoprodeckApiService.HTTP_STATUS_NO_MATCHES
				) {
					return createEmptyPaginatedResponse([]);
				}
				return response.data;
			}
		);

		return responseData.map((rawCard) =>
			mapCard(rawCard, this.#resourceService)
		);
	}

	#putCardInfoParams(
		params: URLSearchParams,
		options: CardInfoOptions
	): void {
		params.set("misc", "yes"); // Always needed
		if (options.includeAliased) {
			params.set("includeAliased", "yes");
		}
		const format =
			options.format != null
				? String(options.format).toLowerCase()
				: "all";
		params.set("format", format);
		if (options.passcode != null) {
			params.set("id", options.passcode);
		}
		if (options.fuzzyName != null) {
			params.set("fname", options.fuzzyName);
		}
		if (options.sorting != null) {
			params.set("sort", options.sorting);
		}
		if (options.auth != null) {
			// If authorization is used, a somewhat unique value is required to ensure no caching is done server-side
			params.set("cachebust", String(Date.now()));
		}
	}

	async getCardSets(): Promise<CardSet[]> {
		const response = await this.#get<RawCardSet[]>(
			new URL("cardsets.php", this.#getBaseUrl()),
			{
				headers: {},
				validateStatus: okStatusValidator,
			}
		);
		return response.data.map(mapCardSet);
	}

	async getCardValues(): Promise<CardValues> {
		const response = await this.#get<RawCardValues>(
			new URL("cardvalues.php", this.#getBaseUrl()),
			{
				headers: {},
				validateStatus: okStatusValidator,
			}
		);
		return mapCardValues(response.data);
	}

	async getArchetypes(): Promise<string[]> {
		const response = await this.#get<RawArchetype[]>(
			new URL("archetypes.php", this.#getBaseUrl()),
			{
				headers: {},
				validateStatus: okStatusValidator,
			}
		);
		return response.data.map(mapArchetype);
	}

	async updateViews(card: Card): Promise<void> {
		// Special internal endpoint
		const url = new URL(
			"card/updateViews.php",
			"https://ygoprodeck.com/api/"
		);
		url.searchParams.set("card", card.passcode);

		await this.#get<void>(url, {
			headers: {},
			validateStatus: okStatusValidator,
		});
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
			// eslint-disable-next-line @typescript-eslint/naming-convention
			"X-Authorization": `Basic ${encodedCredentials}`,
		};
	}

	#getBaseUrl(): string {
		if (
			this.#environmentConfig.getEnvironment() == Environment.YGOPRODECK
		) {
			return "https://db.ygoprodeck.com/api_internal/v7/";
		}
		return "https://db.ygoprodeck.com/api/v7/";
	}

	async #get<T>(
		url: URL,
		config: {
			headers: Record<string, string>;
			validateStatus: (status: number) => boolean;
		}
	): Promise<{
		data: T;
		status: number;
	}> {
		const res = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				...config.headers,
			},
		});
		if (!config.validateStatus(res.status)) {
			throw new Error(`Unexpected status code: ${res.status}`);
		}
		return { data: await res.json(), status: res.status };
	}
}
