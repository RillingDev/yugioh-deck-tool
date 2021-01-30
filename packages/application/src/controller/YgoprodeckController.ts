import type { Credentials } from "../../../core/src/main";
import { Environment, EnvironmentConfig, TYPES } from "../../../core/src/main";
import { inject, injectable } from "inversify";

@injectable()
export class YgoprodeckController {
    private readonly environmentConfig: EnvironmentConfig;

    constructor(
        @inject(TYPES.EnvironmentConfig)
        environmentConfig: EnvironmentConfig
    ) {
        this.environmentConfig = environmentConfig;
    }

    public getCredentials(): Credentials {
        if (this.environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error("Only available in YGOPRODECK environment.");
        }
        return {
            username: "foo",
            token: "bar",
        };
    }
}
