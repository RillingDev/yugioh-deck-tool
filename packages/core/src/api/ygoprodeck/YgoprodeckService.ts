import { inject, injectable } from "inversify";
import { TYPES, YGOPRODECK_INTERNAL_TYPES } from "../../types";
import { YgoprodeckApiService } from "./YgoprodeckApiService";
import type { Card } from "../../core/card/Card";
import { Environment, EnvironmentConfig } from "../../EnvironmentConfig";

import type { UnlinkedCard } from "../../core/card/UnlinkedCard";

@injectable()
export class YgoprodeckService {
    private readonly ygoprodeckApiService: YgoprodeckApiService;
    private readonly environmentConfig: EnvironmentConfig;

    constructor(
        @inject(YGOPRODECK_INTERNAL_TYPES.YgoprodeckApiService)
        ygoprodeckApiService: YgoprodeckApiService,
        @inject(TYPES.EnvironmentConfig)
        environmentConfig: EnvironmentConfig
    ) {
        this.ygoprodeckApiService = ygoprodeckApiService;
        this.environmentConfig = environmentConfig;
    }

    public async increaseCardViewCount(card: Card): Promise<void> {
        this.validateEnv();
        return this.ygoprodeckApiService.updateViews(card);
    }

    public async getCardCollection(
        username: string,
        token: string
    ): Promise<UnlinkedCard[]> {
        this.validateEnv();
        return this.ygoprodeckApiService.getCards({
            format: null,
            includeAliased: true,
            auth: { username, token },
        });
    }

    private validateEnv(): void {
        if (this.environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error("Only available in YGOPRODECK environment.");
        }
    }
}
