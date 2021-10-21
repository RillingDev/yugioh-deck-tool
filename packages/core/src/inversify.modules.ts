import type { interfaces } from "inversify";
import { ContainerModule } from "inversify";
import { INTERNAL_TYPES, TYPES } from "./types";
import type { CardDatabase } from "./card/CardDatabase";
import { MemoryCardDatabase } from "./card/MemoryCardDatabase";
import { CardService } from "./card/CardService";
import { PriceService } from "./price/PriceService";
import { DeckExportService } from "./deck/DeckExportService";
import { DeckService } from "./deck/DeckService";
import { SortingService } from "./card/SortingService";
import { FilterService } from "./card/FilterService";
import { AxiosHttpService } from "./http/AxiosHttpService";
import type { HttpService } from "./http/HttpService";
import { DeckRandomizationService } from "./deck/DeckRandomizationService";
import { DeckUriEncodingService } from "./deck/DeckUriEncodingService";
import { DeckFileService } from "./deck/DeckFileService";
import { UrlService } from "./http/UrlService";
import { CardLinkingService } from "./card/CardLinkingService";
import { BanlistService } from "./card/banlist/BanlistService";
import type { EnvironmentConfig } from "./EnvironmentConfig";
import { DefaultEnvironmentConfig } from "./DefaultEnvironmentConfig";
import { CardPredicateService } from "./card/CardPredicateService";
import { EncodingService } from "./util/EncodingService";

/**
 * Module containing card database access and basic domain services.
 */
export const baseModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<EnvironmentConfig>(TYPES.EnvironmentConfig).to(
		DefaultEnvironmentConfig
	);

	bind<EncodingService>(TYPES.EncodingService).to(EncodingService);
	bind<HttpService>(TYPES.HttpService).to(AxiosHttpService);
	bind<UrlService>(TYPES.UrlService).to(UrlService);

	bind<CardLinkingService>(INTERNAL_TYPES.CardLinkingService).to(
		CardLinkingService
	);
	bind<CardDatabase>(TYPES.CardDatabase)
		.to(MemoryCardDatabase)
		.inSingletonScope();

	bind<CardService>(TYPES.CardService).to(CardService);
	bind<CardPredicateService>(TYPES.CardPredicateService).to(
		CardPredicateService
	);
	bind<BanlistService>(TYPES.BanlistService).to(BanlistService);
	bind<PriceService>(TYPES.PriceService).to(PriceService);
	bind<SortingService>(TYPES.SortingService).to(SortingService);
	bind<FilterService>(TYPES.FilterService).to(FilterService);
});

/**
 * Module containing deck import/export/modification functionality. Requires {@link baseModule}.
 */
export const deckModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<DeckExportService>(TYPES.DeckExportService).to(DeckExportService);
	bind<DeckUriEncodingService>(TYPES.DeckUriEncodingService).to(
		DeckUriEncodingService
	);
	bind<DeckFileService>(TYPES.DeckFileService).to(DeckFileService);
	bind<DeckRandomizationService>(TYPES.DeckRandomizationService).to(
		DeckRandomizationService
	);
	bind<DeckService>(TYPES.DeckService).to(DeckService);
});
