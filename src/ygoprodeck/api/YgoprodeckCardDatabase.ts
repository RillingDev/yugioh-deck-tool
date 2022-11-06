import type { Card, CardDatabase, CardSet, CardType } from "@/core/lib";
import { CardTypeCategory, FindCardBy, getLogger } from "@/core/lib";
import type { CardSetAppearance, UnlinkedCard } from "./UnlinkedCard";
import type { YgoprodeckApiService } from "@/ygoprodeck/api/YgoprodeckApiService";

export class YgoprodeckCardDatabase implements CardDatabase {
	private static readonly logger = getLogger(YgoprodeckCardDatabase);

	readonly #ygoprodeckApiService: YgoprodeckApiService;

	// Fetching

	#loadingSets: Promise<void> | null;
	#loadingArchetypes: Promise<void> | null;
	#loadingCardValues: Promise<void> | null;
	#loadingAllCards: Promise<void> | null;

	// Indexes for mapping

	/**
	 * Sets by name
	 */
	readonly #setsByName: Map<string, CardSet>;
	/**
	 * Card types by name
	 */
	readonly #typesByName: Map<string, CardType>;

	// Data

	readonly #cardsByPasscode: Map<string, Card>;
	readonly #cardsByName: Map<string, Card>;
	readonly #sets: CardSet[];
	readonly #archetypes: string[];
	readonly #types: Map<CardTypeCategory, CardType[]>;
	readonly #subTypes: Map<CardTypeCategory, string[]>;
	readonly #attributes: string[];
	readonly #linkMarkers: string[];
	readonly #levels: number[];

	constructor(ygoprodeckApiService: YgoprodeckApiService) {
		this.#ygoprodeckApiService = ygoprodeckApiService;

		this.#loadingSets = null;
		this.#loadingArchetypes = null;
		this.#loadingCardValues = null;
		this.#loadingAllCards = null;

		this.#setsByName = new Map();
		this.#typesByName = new Map();

		this.#cardsByPasscode = new Map();
		this.#cardsByName = new Map();
		this.#sets = [];
		this.#archetypes = [];
		this.#types = new Map(
			Object.values(CardTypeCategory).map((typeCategory) => [
				typeCategory,
				[],
			])
		);
		this.#subTypes = new Map(
			Object.values(CardTypeCategory).map((typeCategory) => [
				typeCategory,
				[],
			])
		);
		this.#attributes = [];
		this.#linkMarkers = [];
		this.#levels = [];
	}

	async prepareAll(): Promise<void> {
		await Promise.all([
			this.#loadSets(),
			this.#loadCardValues(),
			this.#loadArchetypes(),
		]);

		await this.#loadAllCards();
	}

	async prepareCard(
		cardKey: string,
		findCardBy: FindCardBy
	): Promise<string | null> {
		await Promise.all([this.#loadSets(), this.#loadCardValues()]);

		const card = await this.#loadCard(cardKey, findCardBy);
		if (card == null) {
			return null;
		}
		return findCardBy == FindCardBy.NAME ? card.name : card.passcode;
	}

	hasCard(cardKey: string, findCardBy: FindCardBy): boolean {
		return this.#getCardMap(findCardBy).has(cardKey);
	}

	getCard(cardKey: string, findCardBy: FindCardBy): Card | null {
		return this.#getCardMap(findCardBy).get(cardKey) ?? null;
	}

	getCards(): Card[] {
		return Array.from(this.#cardsByPasscode.values());
	}

	getSets(): CardSet[] {
		return this.#sets;
	}

	getArchetypes(): string[] {
		return this.#archetypes;
	}

	getTypes(typeCategory: CardTypeCategory): CardType[] {
		return this.#types.get(typeCategory)!;
	}

	getSubTypes(typeCategory: CardTypeCategory): string[] {
		return this.#subTypes.get(typeCategory)!;
	}

	getAttributes(): string[] {
		return this.#attributes;
	}

	getLevels(): number[] {
		return this.#levels;
	}

	getLinkMarkers(): string[] {
		return this.#linkMarkers;
	}

	async #loadCard(
		cardKey: string,
		findCardBy: FindCardBy
	): Promise<Card | null> {
		if (!this.hasCard(cardKey, findCardBy)) {
			let loadedCard;
			if (findCardBy == FindCardBy.PASSCODE) {
				loadedCard = await this.#ygoprodeckApiService.getSingleCard({
					passcode: cardKey,
					includeAliased: true, // Include alternate artworks IDs as well.
				});
			} else {
				loadedCard = await this.#ygoprodeckApiService.getSingleCard({
					fuzzyName: cardKey, // fuzzy name matching, so we get the most similar match instead of an exact match.
					sorting: "relevance",
					includeAliased: false,
				});
			}

			if (loadedCard != null) {
				this.#registerCards([loadedCard]);
			}
		}
		return this.getCard(cardKey, findCardBy)!;
	}

	async #loadAllCards(): Promise<void> {
		if (this.#loadingAllCards == null) {
			this.#loadingAllCards = this.#ygoprodeckApiService
				.getCards({
					includeAliased: true,
				})
				.then((cards) => this.#registerCards(cards));
		}
		return this.#loadingAllCards;
	}

	async #loadArchetypes(): Promise<void> {
		if (this.#loadingArchetypes == null) {
			this.#loadingArchetypes = this.#ygoprodeckApiService
				.getArchetypes()
				.then((archetypes) => {
					this.#archetypes.push(...archetypes);
					YgoprodeckCardDatabase.logger.debug(
						"Registered archetypes.",
						this.#archetypes
					);
				});
		}
		return this.#loadingArchetypes;
	}

	async #loadSets(): Promise<void> {
		if (this.#loadingSets == null) {
			this.#loadingSets = this.#ygoprodeckApiService
				.getCardSets()
				.then((cardSets) => {
					this.#sets.push(...cardSets);

					cardSets.forEach((set) =>
						this.#setsByName.set(set.name, set)
					);

					YgoprodeckCardDatabase.logger.debug(
						"Registered sets.",
						this.#sets
					);
				});
		}
		return this.#loadingSets;
	}

	async #loadCardValues(): Promise<void> {
		if (this.#loadingCardValues == null) {
			this.#loadingCardValues = this.#ygoprodeckApiService
				.getCardValues()
				.then((cardValues) => {
					for (const typeCategory of Object.values(
						CardTypeCategory
					)) {
						const cardTypes = this.#types.get(typeCategory)!;
						cardTypes.push(...cardValues[typeCategory].types);

						const cardSubTypes = this.#subTypes.get(typeCategory)!;
						cardSubTypes.push(...cardValues[typeCategory].subTypes);
					}

					Array.from(this.#types.values())
						.flat()
						.forEach((type) =>
							this.#typesByName.set(type.name, type)
						);

					YgoprodeckCardDatabase.logger.debug(
						"Registered types and sub-types.",
						this.#types,
						this.#subTypes
					);

					this.#attributes.push(
						...cardValues[CardTypeCategory.MONSTER].attributes
					);
					this.#levels.push(
						...cardValues[CardTypeCategory.MONSTER].levels
					);
					this.#linkMarkers.push(
						...cardValues[CardTypeCategory.MONSTER].linkMarkers
					);
					YgoprodeckCardDatabase.logger.debug(
						"Registered monster values.",
						this.#attributes,
						this.#levels,
						this.#linkMarkers
					);
				});
		}
		return this.#loadingCardValues;
	}

	#registerCards(unlinkedCards: UnlinkedCard[]): void {
		for (const unlinkedCard of unlinkedCards) {
			if (this.#cardsByPasscode.has(unlinkedCard.passcode)) {
				continue;
			}
			const card = this.#linkCard(unlinkedCard);

			this.#cardsByPasscode.set(card.passcode, card);
			this.#cardsByName.set(card.name, card);
			YgoprodeckCardDatabase.logger.trace(
				`Registered card '${card.passcode}'.`
			);
		}
	}

	#getCardMap(findCardBy: FindCardBy): Map<string, Card> {
		return findCardBy == FindCardBy.PASSCODE
			? this.#cardsByPasscode
			: this.#cardsByName;
	}

	/**
	 * Links an unlinked card.
	 *
	 * @param unlinkedCard Unlinked card.
	 * @return linked card.
	 */
	#linkCard(unlinkedCard: UnlinkedCard): Card {
		return {
			...unlinkedCard,
			type: this.#linkType(unlinkedCard.type),
			sets: this.#linkSets(unlinkedCard.sets),
		};
	}

	#linkSets(setAppearances: CardSetAppearance[]): CardSet[] {
		return setAppearances
			.map((setAppearance) => {
				if (!this.#setsByName.has(setAppearance.name)) {
					YgoprodeckCardDatabase.logger.warn(
						`Could not find set '${setAppearance.name}'.`
					);
					return null;
				}
				return this.#setsByName.get(setAppearance.name)!;
			})
			.filter((set) => set != null) as CardSet[];
	}

	#linkType(typeName: string): CardType {
		if (!this.#typesByName.has(typeName)) {
			throw new TypeError(`Could not find type '${typeName}'.`);
		}
		return this.#typesByName.get(typeName)!;
	}
}
