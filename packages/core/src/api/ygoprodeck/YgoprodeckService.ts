import { inject, injectable } from "inversify";
import { YGOPRODECK_INTERNAL_TYPES } from "../../types";
import type { YgoprodeckApiService } from "./YgoprodeckApiService";
import type { Card } from "../../core/card/Card";

@injectable()
export class YgoprodeckService {
    private readonly ygoprodeckApiService: YgoprodeckApiService;

    constructor(
        @inject(YGOPRODECK_INTERNAL_TYPES.YgoprodeckApiService)
        ygoprodeckApiService: YgoprodeckApiService
    ) {
        this.ygoprodeckApiService = ygoprodeckApiService;
    }

    public async increaseCardViewCount(card: Card): Promise<void> {
        return this.ygoprodeckApiService.updateViews(card);
    }
}
