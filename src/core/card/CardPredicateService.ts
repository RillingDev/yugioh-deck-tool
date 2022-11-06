import type { Card } from "./Card";

export type CardPredicate = (card: Card) => boolean;

export type CardCountFunction = (card: Card) => number;

export class CardPredicateService {
	/**
	 * Creates a predicate based on a CardCountFunction. If at least one exists, predicate is true.
	 *
	 * @return a predicate based on the CardCountFunction.
	 */
	createAtLeastOneAvailablePredicate(
		cardCodeFunction: CardCountFunction
	): CardPredicate {
		return (card) => cardCodeFunction(card) > 0;
	}

	/**
	 * Creates a predicate only allowing cards which can be added to at least one deck part.
	 * Useful to exclude e.g. tokens.
	 *
	 * @return a predicate only allowing cards which can be added to at least one deck part.
	 */
	createAddableInAtLeastOneDeckPartCardPredicate(): CardPredicate {
		return (card) => card.type.deckParts.size > 0;
	}

	/**
	 * Creates a predicate only allowing the first of each name.
	 * Useful to avoid e.g. alternate artworks.
	 *
	 * @return a predicate only allowing the first of each name.
	 */
	createUniqueByNameCardPredicate(): CardPredicate {
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
