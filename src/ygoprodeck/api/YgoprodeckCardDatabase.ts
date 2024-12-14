import type { Card, CardDatabase, CardSet, CardType } from "@/core/lib";
import { CardTypeCategory, FindCardBy, getLogger } from "@/core/lib";
import type { YgoprodeckApiService } from "@/ygoprodeck/api/YgoprodeckApiService";
import type { RawCard } from "@/ygoprodeck/api/mapping/mapCard";
import { mapCard } from "@/ygoprodeck/api/mapping/mapCard";
import { mapArchetype } from "@/ygoprodeck/api/mapping/mapArchetype";
import { mapCardSet } from "@/ygoprodeck/api/mapping/mapCardSet";
import { mapCardValues } from "@/ygoprodeck/api/mapping/mapCardValues";

export class YgoprodeckCardDatabase implements CardDatabase {
	static readonly #logger = getLogger(YgoprodeckCardDatabase);

	readonly #ygoprodeckApiService: YgoprodeckApiService;

	// Fetching

	#loadingSets: Promise<void> | null;
	#loadingArchetypes: Promise<void> | null;
	#loadingCardValues: Promise<void> | null;
	#loadingAllCards: Promise<void> | null;

	// Data

	readonly #cardsByPasscode: Map<string, Card>;
	readonly #cardsByName: Map<string, Card>;

	readonly #setsByName: Map<string, CardSet>;

	readonly #typesByName: Map<string, CardType>;

	readonly #types: Map<CardTypeCategory, CardType[]>;
	readonly #subTypes: Map<CardTypeCategory, string[]>;

	readonly #attributes: string[];
	readonly #linkMarkers: string[];
	readonly #levels: number[];

	readonly #archetypes: string[];

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
		this.#archetypes = [];
		this.#types = new Map(
			Object.values(CardTypeCategory).map((typeCategory) => [
				typeCategory,
				[],
			]),
		);
		this.#subTypes = new Map(
			Object.values(CardTypeCategory).map((typeCategory) => [
				typeCategory,
				[],
			]),
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
		findCardBy: FindCardBy,
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
		return Array.from(this.#setsByName.values());
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
		findCardBy: FindCardBy,
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
				this.#registerCard(loadedCard);
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
				.then((cards) => {
					cards.forEach((card) => this.#registerCard(card));
				});
		}
		return this.#loadingAllCards;
	}

	async #loadArchetypes(): Promise<void> {
		if (this.#loadingArchetypes == null) {
			this.#loadingArchetypes = this.#ygoprodeckApiService
				.getArchetypes()
				.then((rawArchetypes) => {
					const archetypes = rawArchetypes.map(mapArchetype);
					this.#archetypes.push(...archetypes);
					YgoprodeckCardDatabase.#logger.debug(
						"Registered archetypes.",
						this.#archetypes,
					);
				});
		}
		return this.#loadingArchetypes;
	}

	async #loadSets(): Promise<void> {
		if (this.#loadingSets == null) {
			this.#loadingSets = this.#ygoprodeckApiService
				.getCardSets()
				.then((rawSets) => {
					for (const rawSet of rawSets) {
						const set = mapCardSet(rawSet);
						this.#setsByName.set(set.name, set);
					}

					YgoprodeckCardDatabase.#logger.debug(
						"Registered sets.",
						this.#setsByName,
					);
				});
		}
		return this.#loadingSets;
	}

	async #loadCardValues(): Promise<void> {
		if (this.#loadingCardValues == null) {
			this.#loadingCardValues = this.#ygoprodeckApiService
				.getCardValues()
				.then(mapCardValues)
				.then((cardValues) => {
					for (const typeCategory of Object.values(
						CardTypeCategory,
					)) {
						const cardTypes = this.#types.get(typeCategory)!;
						cardTypes.push(...cardValues[typeCategory].types);

						const cardSubTypes = this.#subTypes.get(typeCategory)!;
						cardSubTypes.push(...cardValues[typeCategory].subTypes);
					}

					Array.from(this.#types.values())
						.flat()
						.forEach((type) =>
							this.#typesByName.set(type.name, type),
						);

					YgoprodeckCardDatabase.#logger.debug(
						"Registered types and sub-types.",
						this.#types,
						this.#subTypes,
					);

					this.#attributes.push(
						...cardValues[CardTypeCategory.MONSTER].attributes,
					);
					this.#levels.push(
						...cardValues[CardTypeCategory.MONSTER].levels,
					);
					this.#linkMarkers.push(
						...cardValues[CardTypeCategory.MONSTER].linkMarkers,
					);
					YgoprodeckCardDatabase.#logger.debug(
						"Registered monster values.",
						this.#attributes,
						this.#levels,
						this.#linkMarkers,
					);
				});
		}
		return this.#loadingCardValues;
	}

	#registerCard(rawCard: RawCard): void {
		const card = mapCard(rawCard, this.#setsByName, this.#typesByName);

		if (
			this.#cardsByPasscode.has(card.passcode) ||
			(card.betaPasscode != null &&
				this.#cardsByPasscode.has(card.betaPasscode))
		) {
			YgoprodeckCardDatabase.#logger.warn(
				`Refusing to add already registered card passcode.`,
				card,
			);
			return;
		}

		this.#cardsByPasscode.set(card.passcode, card);
		if (card.betaPasscode != null) {
			this.#cardsByPasscode.set(card.betaPasscode, card);
		}

		// Note that the last card of a given name is kept, if any others were set before.
		this.#cardsByName.set(card.name, card);
		if (card.betaName != null) {
			this.#cardsByName.set(card.betaName, card);
		}
	}

	#getCardMap(findCardBy: FindCardBy): Map<string, Card> {
		return findCardBy == FindCardBy.PASSCODE
			? this.#cardsByPasscode
			: this.#cardsByName;
	}
}
