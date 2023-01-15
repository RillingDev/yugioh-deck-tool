import { CardService } from "./card/CardService";
import { PriceService } from "./price/PriceService";
import { FilterService } from "./card/FilterService";
import { BanlistService } from "./card/format/BanlistService";
import { CardPredicateService } from "./card/CardPredicateService";
import { SortingService } from "./card/SortingService";
import type { CardDatabase } from "./card/CardDatabase";

interface BaseModule {
	cardService: CardService;
	priceService: PriceService;
	banlistService: BanlistService;
	cardPredicateService: CardPredicateService;
	filterService: FilterService;
	sortingService: SortingService;
}

/**
 * Module containing card database access and basic domain services.
 */
export const createBaseModule = (cardDatabase: CardDatabase): BaseModule => {
	const cardService = new CardService();
	const cardPredicateService = new CardPredicateService();
	const banlistService = new BanlistService();
	const priceService = new PriceService();
	const sortingService = new SortingService(cardDatabase);
	const filterService = new FilterService(cardService, banlistService);

	return {
		cardService,
		cardPredicateService,
		banlistService,
		priceService,
		filterService,
		sortingService,
	};
};
