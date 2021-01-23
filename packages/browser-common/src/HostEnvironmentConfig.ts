import { injectable } from "inversify";
import type { EnvironmentConfig } from "../../core/src/main";
import { Environment } from "../../core/src/main";

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
