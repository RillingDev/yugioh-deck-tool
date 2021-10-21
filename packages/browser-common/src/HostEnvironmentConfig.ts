import { injectable } from "inversify";
import type { EnvironmentConfig } from "@yugioh-deck-tool/core";
import { Environment } from "@yugioh-deck-tool/core";

/**
 * EnvironmentConfig using the current browser location host.
 */
@injectable()
export class HostEnvironmentConfig implements EnvironmentConfig {
	getEnvironment(): Environment {
		return location.host.endsWith("ygoprodeck.com")
			? Environment.YGOPRODECK
			: Environment.DEFAULT;
	}
}
