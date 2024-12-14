import type { RawCard } from "./mapping/mapCard";
import type { RawCardSet } from "./mapping/mapCardSet";
import type { PaginatedResponse } from "./PaginatedResponse";
import { createEmptyPaginatedResponse } from "./PaginatedResponse";
import type { RawCardValues } from "./mapping/mapCardValues";
import type { RawArchetype } from "./mapping/mapArchetype";
import type { Card, EnvironmentConfig } from "@/core/lib";
import { Environment } from "@/core/lib";

interface CardInfoOptions {
	readonly includeAliased: boolean; // If all versions of cards with the same name should be shown (alternate artworks)

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

const assertStatusOk = (res: Response): Response => {
	if (res.status >= 200 && res.status <= 299) {
		return res;
	}
	throw new Error(
		`Unexpected status code: ${res.status} - ${res.statusText}.`,
	);
};

/**
 * See YGOPRODECK API (https://db.ygoprodeck.com/api-guide/).
 */
export class YgoprodeckApiService {
	static readonly #CHUNK_SIZE = 2000;

	// Is returned if no matching cards or an empty list should be returned.
	// While not technically an error, the API treats it as such.
	static readonly #HTTP_STATUS_NO_MATCHES = 400;

	readonly #environmentConfig: EnvironmentConfig;

	constructor(environmentConfig: EnvironmentConfig) {
		this.#environmentConfig = environmentConfig;
	}

	async getSingleCard(options: CardInfoOptions): Promise<RawCard | null> {
		const url = new URL("cardinfo.php", this.#getBaseUrl());
		this.#putCardInfoParams(url.searchParams, options);

		const data = await this.#getJsonResponse(
			url,
			this.#createAuthHeaders(options),
		).then((res) => {
			if (res.status === YgoprodeckApiService.#HTTP_STATUS_NO_MATCHES) {
				return null;
			}
			assertStatusOk(res);
			return res.json() as Promise<{ data: RawCard[] }>;
		});

		if (data == null) {
			return null;
		}
		// If a match is found, we take the first item (best match).
		return data.data[0];
	}

	async getCards(options: CardInfoOptions): Promise<RawCard[]> {
		const urlBase = new URL("cardinfo.php", this.#getBaseUrl());
		this.#putCardInfoParams(urlBase.searchParams, options);
		urlBase.searchParams.set(
			"num",
			YgoprodeckApiService.#CHUNK_SIZE.toString(),
		);

		const authHeaders = this.#createAuthHeaders(options);

		return this.#loadPaginated<RawCard>(async (offset) => {
			const url = new URL(urlBase);
			url.searchParams.set("offset", offset.toString());

			return this.#getJsonResponse(url, authHeaders).then((res) => {
				if (
					res.status === YgoprodeckApiService.#HTTP_STATUS_NO_MATCHES
				) {
					return createEmptyPaginatedResponse([]);
				}
				assertStatusOk(res);
				return res.json() as Promise<PaginatedResponse<RawCard[]>>;
			});
		});
	}

	#putCardInfoParams(
		params: URLSearchParams,
		options: CardInfoOptions,
	): void {
		params.set("misc", "yes"); // Always needed
		if (options.includeAliased) {
			params.set("includeAliased", "yes");
		}
		params.set("format", "all");
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

	async getCardSets(): Promise<RawCardSet[]> {
		return this.#getJsonResponse(
			new URL("cardsets.php", this.#getBaseUrl()),
		)
			.then(assertStatusOk)
			.then((res) => res.json() as Promise<RawCardSet[]>);
	}

	getCardValues(): Promise<RawCardValues> {
		return this.#getJsonResponse(
			new URL("cardvalues.php", this.#getBaseUrl()),
		)
			.then(assertStatusOk)
			.then((res) => res.json() as Promise<RawCardValues>);
	}

	async getArchetypes(): Promise<RawArchetype[]> {
		return this.#getJsonResponse(
			new URL("archetypes.php", this.#getBaseUrl()),
		)
			.then(assertStatusOk)
			.then((res) => res.json() as Promise<RawArchetype[]>);
	}

	async updateViews(card: Card): Promise<void> {
		// Special internal endpoint
		const url = new URL("https://ygoprodeck.com/api/card/updateViews.php");
		url.searchParams.set("card", card.passcode);

		return fetch(url, {
			method: "GET",
		}).then((res) => {
			assertStatusOk(res);
		});
	}

	async #loadPaginated<T>(
		fetcher: (offset: number) => Promise<PaginatedResponse<T[]>>,
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
		const encodedCredentials = btoa(
			`${options.auth.username}:${options.auth.token}`,
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

	async #getJsonResponse(
		url: URL,
		headers: Record<string, string> = {},
	): Promise<Response> {
		return fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				...headers,
			},
		});
	}
}
