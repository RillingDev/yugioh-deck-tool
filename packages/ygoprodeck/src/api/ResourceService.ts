import { inject, injectable } from "inversify";
import { Environment, EnvironmentConfig, TYPES } from "@yugioh-deck-tool/core";

@injectable()
export class ResourceService {
	readonly #environmentConfig: EnvironmentConfig;

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
			return initialCardImageUrl;
		}
		return initialCardImageUrl.replace(
			"https://storage.googleapis.com/ygoprodeck.com/",
			"https://ygoprodeck.com/"
		);
	}
}
