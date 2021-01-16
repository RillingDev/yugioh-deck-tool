import type { interfaces } from "inversify";
import { ContainerModule } from "inversify";
import {
    INTERNAL_TYPES,
    TYPES,
    YGOPRODECK_INTERNAL_TYPES,
    YGOPRODECK_TYPES,
} from "./types";
import type { CardDataLoaderService } from "./core/card/CardDataLoaderService";
import { YgoprodeckCardDataLoaderService } from "./api/ygoprodeck/YgoprodeckCardDataLoaderService";
import type { CardDatabase } from "./core/card/CardDatabase";
import { MemoryCardDatabase } from "./core/card/MemoryCardDatabase";
import { CardService } from "./core/card/CardService";
import { PriceService } from "./core/price/PriceService";
import { DeckExportService } from "./core/deck/DeckExportService";
import { DeckService } from "./core/deck/DeckService";
import { SortingService } from "./core/card/SortingService";
import { FilterService } from "./core/card/FilterService";
import { AxiosHttpService } from "./core/http/AxiosHttpService";
import type { HttpService } from "./core/http/HttpService";
import { DeckRandomizationService } from "./core/deck/DeckRandomizationService";
import { DeckUriEncodingService } from "./core/deck/DeckUriEncodingService";
import { DeckFileService } from "./core/deck/DeckFileService";
import { UrlService } from "./core/http/UrlService";
import { CardLinkingService } from "./core/card/CardLinkingService";
import { BanlistService } from "./core/card/banlist/BanlistService";
import type { EnvironmentConfig } from "./EnvironmentConfig";
import { DefaultEnvironmentConfig } from "./DefaultEnvironmentConfig";
import { YgoprodeckApiService } from "./api/ygoprodeck/YgoprodeckApiService";
import { YgoprodeckService } from "./api/ygoprodeck/YgoprodeckService";

/**
 * Module containing card database access and basic domain services.
 */
export const baseModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<EnvironmentConfig>(TYPES.EnvironmentConfig).to(
        DefaultEnvironmentConfig
    );

    bind<HttpService>(TYPES.HttpService).to(AxiosHttpService);
    bind<UrlService>(TYPES.UrlService).to(UrlService);

    bind<CardLinkingService>(INTERNAL_TYPES.CardLinkingService).to(
        CardLinkingService
    );
    bind<CardDatabase>(TYPES.CardDatabase)
        .to(MemoryCardDatabase)
        .inSingletonScope();

    bind<CardService>(TYPES.CardService).to(CardService);
    bind<BanlistService>(TYPES.BanlistService).to(BanlistService);
    bind<PriceService>(TYPES.PriceService).to(PriceService);
    bind<SortingService>(TYPES.SortingService).to(SortingService);
    bind<FilterService>(TYPES.FilterService).to(FilterService);

    // Ygoprodeck.com providers.
    bind<YgoprodeckApiService>(
        YGOPRODECK_INTERNAL_TYPES.YgoprodeckApiService
    ).to(YgoprodeckApiService);
    bind<YgoprodeckService>(YGOPRODECK_TYPES.YgoprodeckService).to(
        YgoprodeckService
    );
    bind<CardDataLoaderService>(TYPES.CardDataLoaderService).to(
        YgoprodeckCardDataLoaderService
    );
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
