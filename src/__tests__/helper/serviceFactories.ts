import { FilterService } from "@/core/card/FilterService";
import { SortingService } from "@/core/card/SortingService";
import { PriceService } from "@/core/price/PriceService";
import { BanlistService } from "@/core/card/format/BanlistService";
import { CardPredicateService } from "@/core/card/CardPredicateService";
import { CardService } from "@/core/card/CardService";
import type { CardDatabase } from "@/core/card/CardDatabase";
import { DeckService } from "@/core/deck/DeckService";

export const createServices = (
	cardDatabase: CardDatabase
): {
	cardService: CardService;
	priceService: PriceService;
	banlistService: BanlistService;
	cardPredicateService: CardPredicateService;
	filterService: FilterService;
	sortingService: SortingService;
	deckService: DeckService;
} => {
	const cardService = new CardService();
	const cardPredicateService = new CardPredicateService();
	const banlistService = new BanlistService();
	const priceService = new PriceService();
	const sortingService = new SortingService(cardDatabase);
	const filterService = new FilterService(cardService, banlistService);
	const deckService = new DeckService(
		cardService,
		sortingService,
		banlistService
	);

	return {
		cardService,
		cardPredicateService,
		banlistService,
		priceService,
		filterService,
		sortingService,
		deckService,
	};
};
