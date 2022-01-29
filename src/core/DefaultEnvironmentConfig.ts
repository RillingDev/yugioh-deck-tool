import { injectable } from "inversify";
import type { EnvironmentConfig } from "./EnvironmentConfig";
import { Environment } from "./EnvironmentConfig";

/**
 * Standalone EnvironmentConfig.
 * In a browser context, HostEnvironmentConfig should be used instead.
 */
@injectable()
export class DefaultEnvironmentConfig implements EnvironmentConfig {
	getEnvironment(): Environment {
		return Environment.DEFAULT;
	}
}
