import { injectable } from "inversify";
import type { Card } from "./Card";

export type CardPredicate = (card: Card) => boolean;

@injectable()
export class CardPredicateService {
    /**
     * Creates a predicate only allowing card passcodes provided.
     *
     * @return a predicate only allowing card passcodes provided.
     */
    public createPassCodePredicate(passcodes: Set<string>): CardPredicate {
        return (card) => passcodes.has(card.passcode);
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
