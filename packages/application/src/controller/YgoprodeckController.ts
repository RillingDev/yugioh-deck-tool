import type { Credentials } from "../../../core/src/main";
import { Environment, EnvironmentConfig, TYPES } from "../../../core/src/main";
import { inject, injectable } from "inversify";

declare global {
    interface Window {
        ygoprodeckUsername?: string;
        ygoprodeckToken?: string;
    }
}

@injectable()
export class YgoprodeckController {
    private readonly environmentConfig: EnvironmentConfig;

    constructor(
        @inject(TYPES.EnvironmentConfig)
        environmentConfig: EnvironmentConfig
    ) {
        this.environmentConfig = environmentConfig;
    }

    public hasCredentials(): boolean {
        this.validateEnv();
        return (
            window.ygoprodeckUsername != null && window.ygoprodeckToken != null
        );
    }

    public getCredentials(): Credentials {
        this.validateEnv();
        if (!this.hasCredentials()) {
            throw new TypeError("Insufficient credentials available.");
        }
        return {
            username: window.ygoprodeckUsername!,
            token: window.ygoprodeckToken!,
        };
    }

    private validateEnv(): void {
        if (this.environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error("Only available in YGOPRODECK environment.");
        }
    }
}
