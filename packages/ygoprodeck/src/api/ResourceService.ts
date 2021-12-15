import { inject, injectable } from "inversify";
import type { Card, CardType } from "@yugioh-deck-tool/core";
import {
	CardTypeCategory,
	Environment,
	EnvironmentConfig,
	TYPES,
} from "@yugioh-deck-tool/core";

@injectable()
export class ResourceService {
	readonly #environmentConfig: EnvironmentConfig;

	private static readonly YGOPRODECK_ASSET_BASE_URL =
		"https://ygoprodeck.com/pics/icons";
	private static readonly CDN_ASSET_BASE_URL =
		"https://storage.googleapis.com/ygoprodeck.com/assets";

	constructor(
		@inject(TYPES.EnvironmentConfig)
		environmentConfig: EnvironmentConfig
	) {
		this.#environmentConfig = environmentConfig;
	}

	/**
	 * Gets the version of the card image URL that should be used.
	 * This may include additional CDN data.
	 *
	 * @param initialCardImageUrl Card image URL returned from the ygoprodeck API.
	 * @return The URL that should be used.
	 */
	getEffectiveCardImageUrl(initialCardImageUrl: string): string {
		if (
			this.#environmentConfig.getEnvironment() == Environment.YGOPRODECK
		) {
			return initialCardImageUrl.replace(
				"https://storage.googleapis.com/ygoprodeck.com/",
				"https://ygoprodeck.com/"
			);
		}
		return initialCardImageUrl;
	}

	getTypeImageUrl(card: Card): string {
		const fileName = `${encodeURIComponent(card.type.name)}.jpg`;
		return `${this.#getAssetBaseUrl()}/${fileName}`;
	}

	#getAssetBaseUrl(): string {
		return this.#environmentConfig.getEnvironment() ==
			Environment.YGOPRODECK
			? ResourceService.YGOPRODECK_ASSET_BASE_URL
			: ResourceService.CDN_ASSET_BASE_URL;
	}
}
