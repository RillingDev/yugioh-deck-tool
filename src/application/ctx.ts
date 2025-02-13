import { HostEnvironmentConfig } from "@/browser-common/lib";
import {
	BanlistService,
	CardPredicateService,
	CardService,
	DeckExportService,
	DeckFileService,
	DeckRandomizationService,
	DeckService,
	DeckUriEncodingService,
	FilterService,
	PriceService,
	SortingService,
} from "@/core/lib";
import { TooltipController } from "@/tooltip/controller/TooltipController";
import { createYgoprodeckModule } from "@/ygoprodeck/lib";
import { DeckController } from "./controller/DeckController";
import { DeckUrlController } from "./controller/DeckUrlController";
import { YgoprodeckController } from "./controller/YgoprodeckController";

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
	banlistService,
);
const deckExportService = new DeckExportService(
	deckService,
	cardService,
	filterService,
);
const deckUriEncodingService = new DeckUriEncodingService(
	cardDatabase,
	deckService,
);
const deckFileService = new DeckFileService(cardDatabase, deckService);
const deckRandomizationService = new DeckRandomizationService(
	cardDatabase,
	deckService,
	filterService,
	sortingService,
	cardService,
);

const deckController = new DeckController(cardDatabase, cardService);
const deckUrlController = new DeckUrlController(
	deckService,
	deckUriEncodingService,
	deckFileService,
);
const ygoprodeckController = new YgoprodeckController(ygoprodeckService);

const tooltipController = new TooltipController(cardDatabase);

export {
	banlistService,
	cardDatabase,
	cardPredicateService,
	cardService,
	deckController,
	deckExportService,
	deckFileService,
	deckRandomizationService,
	deckService,
	deckUriEncodingService,
	deckUrlController,
	filterService,
	priceService,
	resourceService,
	sortingService,
	tooltipController,
	ygoprodeckController,
	ygoprodeckService,
};
