import type { Card, CardPredicate } from "../../../core/src/main";
import { injectable } from "inversify";

@injectable()
export class FilterController {
    /**
     * Creates a predicate only allowing cards exist in the provided list.
     *
     * @return a predicate only allowing cards exist in the provided list.
     */
    public createIncludedInListCardPredicate(
        cards: ReadonlyArray<Card>
    ): CardPredicate {
        return this.createPassCodePredicate(
            new Set<string>(cards.map((card) => card.passcode))
        );
    }

    private createPassCodePredicate(passcodes: Set<string>): CardPredicate {
        return (card: Card) => passcodes.has(card.passcode);
    }

    /**
     * Creates a predicate only allowing cards which can be added to at least one deck part.
     * Useful to exclude e.g. tokens.
     *
     * @return a predicate only allowing cards which can be added to at least one deck part.
     */
    public createAddableInAtLeastOneDeckPartCardPredicate(): CardPredicate {
        return (card) => card.type.deckParts.size > 0;
    }

    /**
     * Creates a predicate only allowing the first of each name.
     * Useful to avoid e.g. alternate artworks.
     *
     * @return a predicate only allowing the first of each name.
     */
    public createUniqueByNameCardPredicate(): CardPredicate {
        const seenNames = new Set<string>();
        return (card) => {
            if (seenNames.has(card.name)) {
                return false;
            }
            seenNames.add(card.name);
            return true;
        };
    }
}
