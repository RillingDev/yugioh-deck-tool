import type { BanlistInfo, Card, EnvironmentConfig } from "@/core/lib";
import { Environment } from "@/core/lib";

export class ResourceService {
	readonly #environmentConfig: EnvironmentConfig;

	private static readonly YGOPRODECK_IMAGE_BASE_URL =
		"https://images.ygoprodeck.com/images";
	private static readonly CDN_BASE_URL =
		"https://storage.googleapis.com/ygoprodeck.com";

	constructor(environmentConfig: EnvironmentConfig) {
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
				ResourceService.CDN_BASE_URL + "/pics_small",
				ResourceService.YGOPRODECK_IMAGE_BASE_URL + "/cards_small"
			);
		}
		return initialCardImageUrl;
	}

	getPlaceholderCardImageUrl(): string {
		return this.getEffectiveCardImageUrl(
			`${ResourceService.CDN_BASE_URL}/pics_small/4035199.jpg`
		);
	}

	getTypeImageUrl(card: Card): string {
		return `${this.#getAssetBaseUrl()}/${encodeURIComponent(
			card.type.name
		)}.jpg`;
	}

	getSubTypeImageUrl(card: Card): string {
		return `${this.#getAssetBaseUrl()}/race/${encodeURIComponent(
			card.subType
		)}.png`;
	}

	getAttributeImageUrl(card: Card): string {
		return `${this.#getAssetBaseUrl()}/attributes/${encodeURIComponent(
			card.attribute!
		)}.jpg`;
	}

	getAtkImageUrl(): string {
		return `${this.#getAssetBaseUrl()}/misc/atk.png`;
	}

	getLevelImageUrl(): string {
		return `${this.#getAssetBaseUrl()}/misc/level.png`;
	}

	getLinkMarkerImageUrl(): string {
		return `${this.#getAssetBaseUrl()}/linkarrows/Right.png`;
	}

	getBanStateImageUrl(card: Card, format: keyof BanlistInfo): string {
		return `${this.#getAssetBaseUrl()}/${encodeURIComponent(
			card.banlist[format].name
		)}.png`;
	}

	#getAssetBaseUrl(): string {
		return this.#environmentConfig.getEnvironment() ==
			Environment.YGOPRODECK
			? `${ResourceService.YGOPRODECK_IMAGE_BASE_URL}/cards/icons`
			: `${ResourceService.CDN_BASE_URL}/assets`;
	}
}
