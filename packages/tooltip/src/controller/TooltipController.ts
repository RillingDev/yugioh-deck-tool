import { inject, injectable } from "inversify";
import type { Card, CardDatabase } from "../../../core/src/main";
import { FindCardBy } from "../../../core/src/main";
import { TOOLTIP_TYPES } from "../types";

@injectable()
export class TooltipController {
    private readonly cardDatabase: CardDatabase;

    constructor(
        @inject(TOOLTIP_TYPES.CardDatabase)
        cardDatabase: CardDatabase
    ) {
        this.cardDatabase = cardDatabase;
    }

    /**
     * Loads a card based on its key.
     *
     * @param cardKey Key to load by (either name or ID).
     * @return Card.
     */
    public async loadCard(cardKey: string): Promise<Card> {
        let resolvedCardKey = await this.cardDatabase.prepareCard(
            cardKey,
            FindCardBy.NAME
        );
        if (
            resolvedCardKey != null &&
            this.cardDatabase.hasCard(resolvedCardKey, FindCardBy.NAME)
        ) {
            return this.cardDatabase.getCard(resolvedCardKey, FindCardBy.NAME)!;
        }
        resolvedCardKey = await this.cardDatabase.prepareCard(
            cardKey,
            FindCardBy.PASSCODE
        );
        if (
            resolvedCardKey != null &&
            this.cardDatabase.hasCard(resolvedCardKey, FindCardBy.PASSCODE)
        ) {
            return this.cardDatabase.getCard(
                resolvedCardKey,
                FindCardBy.PASSCODE
            )!;
        }
        throw new Error(`Could not find card '${cardKey}'.`);
    }
}
