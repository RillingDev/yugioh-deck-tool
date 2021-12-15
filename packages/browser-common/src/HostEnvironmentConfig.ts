import { injectable } from "inversify";
import type { EnvironmentConfig } from "@yugioh-deck-tool/core";
import { Environment } from "@yugioh-deck-tool/core";

/**
 * EnvironmentConfig using the current browser location host.
 */
@injectable()
export class HostEnvironmentConfig implements EnvironmentConfig {
	#isYgoprodeck: boolean | null = null;

	getEnvironment(): Environment {
		if (this.#isYgoprodeck == null) {
			this.#isYgoprodeck = location.host.endsWith("ygoprodeck.com");
		}

		return this.#isYgoprodeck
			? Environment.YGOPRODECK
			: Environment.DEFAULT;
	}
}
