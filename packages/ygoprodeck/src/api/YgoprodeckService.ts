import { inject, injectable } from "inversify";
import { YGOPRODECK_INTERNAL_TYPES } from "../types";
import type { Credentials } from "./YgoprodeckApiService";
import { YgoprodeckApiService } from "./YgoprodeckApiService";
import type { Card } from "../../../core/src/main";
import { Environment, EnvironmentConfig, TYPES } from "../../../core/src/main";

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

    /**
     * Sends an event that a card has been viewed.
     *
     * @param card Card that was viewed.
     */
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

    public validateEnv(): void {
        if (this.environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error("Only available in YGOPRODECK environment.");
        }
    }
}
