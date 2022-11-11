import { createBaseModule, createDeckModule } from "@/core/lib";
import { DeckController } from "./controller/DeckController";
import { DeckUrlController } from "./controller/DeckUrlController";
import { HostEnvironmentConfig } from "@/browser-common/lib";
import { YgoprodeckController } from "./controller/YgoprodeckController";
import { createYgoprodeckModule } from "@/ygoprodeck/lib";

export const environmentConfig = new HostEnvironmentConfig();

const { cardDatabase, ygoprodeckService, resourceService } =
	createYgoprodeckModule(environmentConfig);

const {
	cardService,
	sortingService,
	banlistService,
	filterService,
	cardPredicateService,
	priceService,
} = createBaseModule(cardDatabase);

const {
	deckService,
	deckUriEncodingService,
	deckFileService,
	deckExportService,
	deckRandomizationService,
} = createDeckModule(
	cardService,
	sortingService,
	banlistService,
	filterService,
	cardDatabase
);

const deckController = new DeckController(cardDatabase, cardService);
const deckUrlController = new DeckUrlController(
	deckService,
	deckUriEncodingService,
	deckFileService
);
const ygoprodeckController = new YgoprodeckController(ygoprodeckService);

export const container = {
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
