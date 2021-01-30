import { inject, injectable } from "inversify";
import { TYPES, YGOPRODECK_INTERNAL_TYPES } from "../../types";
import type { Credentials } from "./YgoprodeckApiService";
import { YgoprodeckApiService } from "./YgoprodeckApiService";
import type { Card } from "../../core/card/Card";
import { Environment, EnvironmentConfig } from "../../EnvironmentConfig";

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

    public async getCardCollectionPasscodes(
        credentials: Credentials
    ): Promise<Set<string>> {
        this.validateEnv();
        const unlinkedCards = await this.ygoprodeckApiService.getCards({
            format: null,
            includeAliased: true,
            auth: credentials,
        });
        return new Set(
            unlinkedCards.map((unlinkedCard) => unlinkedCard.passcode)
        );
    }

    private validateEnv(): void {
        if (this.environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error("Only available in YGOPRODECK environment.");
        }
    }
}
