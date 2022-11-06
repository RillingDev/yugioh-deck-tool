import { CardService } from "./card/CardService";
import { PriceService } from "./price/PriceService";
import { DeckExportService } from "./deck/DeckExportService";
import { DeckService } from "./deck/DeckService";
import { FilterService } from "./card/FilterService";
import { DeckRandomizationService } from "./deck/DeckRandomizationService";
import { DeckUriEncodingService } from "./deck/DeckUriEncodingService";
import { DeckFileService } from "./deck/DeckFileService";
import { BanlistService } from "./card/banlist/BanlistService";
import { CardPredicateService } from "./card/CardPredicateService";
import { EncodingService } from "./util/EncodingService";
import { SortingService } from "@/core/card/SortingService";
import type { CardDatabase } from "@/core/card/CardDatabase";

interface BaseModule {
	encodingService: EncodingService;
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
	const encodingService = new EncodingService();
	const cardService = new CardService();
	const cardPredicateService = new CardPredicateService();
	const banlistService = new BanlistService();
	const priceService = new PriceService();
	const sortingService = new SortingService(cardDatabase);
	const filterService = new FilterService(cardService, banlistService);

	return {
		encodingService,
		cardService,
		cardPredicateService,
		banlistService,
		priceService,
		filterService,
		sortingService,
	};
};

interface DeckModule {
	deckExportService: DeckExportService;
	deckFileService: DeckFileService;
	deckService: DeckService;
	deckRandomizationService: DeckRandomizationService;
	deckUriEncodingService: DeckUriEncodingService;
}

/**
 * Module containing deck import/export/modification functionality.
 */
export const createDeckModule = (
	cardService: CardService,
	sortingService: SortingService,
	banlistService: BanlistService,
	filterService: FilterService,
	encodingService: EncodingService,
	cardDatabase: CardDatabase
): DeckModule => {
	const deckService = new DeckService(
		cardService,
		sortingService,
		banlistService
	);
	const deckExportService = new DeckExportService(
		deckService,
		cardService,
		filterService
	);
	const deckUriEncodingService = new DeckUriEncodingService(
		cardDatabase,
		deckService,
		encodingService
	);
	const deckFileService = new DeckFileService(cardDatabase, deckService);
	const deckRandomizationService = new DeckRandomizationService(
		cardDatabase,
		deckService,
		filterService,
		sortingService,
		cardService
	);

	return {
		deckService,
		deckExportService,
		deckUriEncodingService,
		deckFileService,
		deckRandomizationService,
	};
};
