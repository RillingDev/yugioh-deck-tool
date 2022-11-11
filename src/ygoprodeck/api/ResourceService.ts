import type { BanlistInfo, Card, EnvironmentConfig } from "@/core/lib";

export class ResourceService {
	static readonly #YGOPRODECK_ICON_BASE_URL =
		"https://images.ygoprodeck.com/images/cards/icons";

	readonly #environmentConfig: EnvironmentConfig;

	constructor(environmentConfig: EnvironmentConfig) {
		this.#environmentConfig = environmentConfig;
	}

	getPlaceholderCardImageUrl(): string {
		return "https://images.ygoprodeck.com/images/cards/4035199.jpg";
	}

	getTypeImageUrl(card: Card): string {
		return `${
			ResourceService.#YGOPRODECK_ICON_BASE_URL
		}/${encodeURIComponent(card.type.name)}.jpg`;
	}

	getSubTypeImageUrl(card: Card): string {
		return `${
			ResourceService.#YGOPRODECK_ICON_BASE_URL
		}/race/${encodeURIComponent(card.subType)}.png`;
	}

	getAttributeImageUrl(card: Card): string {
		return `${
			ResourceService.#YGOPRODECK_ICON_BASE_URL
		}/attributes/${encodeURIComponent(card.attribute!)}.jpg`;
	}

	getAtkImageUrl(): string {
		return `${ResourceService.#YGOPRODECK_ICON_BASE_URL}/misc/atk.png`;
	}

	getLevelImageUrl(): string {
		return `${ResourceService.#YGOPRODECK_ICON_BASE_URL}/misc/level.png`;
	}

	getLinkMarkerImageUrl(): string {
		return `${
			ResourceService.#YGOPRODECK_ICON_BASE_URL
		}/linkarrows/Right.png`;
	}

	getBanStateImageUrl(card: Card, format: keyof BanlistInfo): string {
		return `${
			ResourceService.#YGOPRODECK_ICON_BASE_URL
		}/${encodeURIComponent(card.banlist[format].name)}.png`;
	}
}
