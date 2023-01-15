import {
	BanlistService,
	CardPredicateService,
	CardService,
	DeckExportService,
	DeckFileService,
	DeckRandomizationService,
	DeckService,
	DeckUriEncodingService,
	EncodingService,
	FilterService,
	PriceService,
	SortingService,
} from "@/core/lib";
import { DeckController } from "./controller/DeckController";
import { DeckUrlController } from "./controller/DeckUrlController";
import { HostEnvironmentConfig } from "@/browser-common/lib";
import { YgoprodeckController } from "./controller/YgoprodeckController";
import { createYgoprodeckModule } from "@/ygoprodeck/lib";

export const environmentConfig = new HostEnvironmentConfig();

const { cardDatabase, ygoprodeckService, resourceService } =
	createYgoprodeckModule(environmentConfig);

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
const deckExportService = new DeckExportService(
	deckService,
	cardService,
	filterService
);
const deckUriEncodingService = new DeckUriEncodingService(
	cardDatabase,
	deckService,
	new EncodingService()
);
const deckFileService = new DeckFileService(cardDatabase, deckService);
const deckRandomizationService = new DeckRandomizationService(
	cardDatabase,
	deckService,
	filterService,
	sortingService,
	cardService
);

const deckController = new DeckController(cardDatabase, cardService);
const deckUrlController = new DeckUrlController(
	deckService,
	deckUriEncodingService,
	deckFileService
);
const ygoprodeckController = new YgoprodeckController(ygoprodeckService);

export {
	// Base
	cardService,
	priceService,
	banlistService,
	filterService,
	sortingService,
	cardPredicateService,
	cardDatabase,
	// Deck
	deckRandomizationService,
	deckService,
	deckUriEncodingService,
	deckFileService,
	deckExportService,
	// Ygoprodeck
	resourceService,
	ygoprodeckService,
	// Application
	deckController,
	deckUrlController,
	ygoprodeckController,
};
