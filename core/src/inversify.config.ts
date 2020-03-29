import { Container } from "inversify";
import { TYPES } from "./types";
import { CardDataLoaderService } from "./core/business/service/CardDataLoaderService";
import { YgoprodeckCardDataLoaderService } from "./api/YgoprodeckCardDataLoaderService";
import { CardDatabase } from "./core/business/CardDatabase";
import { MemoryCardDatabase } from "./core/business/MemoryCardDatabase";
import { CardService } from "./core/business/service/CardService";
import { PriceService } from "./core/business/service/PriceService";
import { DeckExportService } from "./core/business/service/DeckExportService";
import { DeckService } from "./core/business/service/DeckService";
import { SortingService } from "./core/business/service/SortingService";
import { FilterService } from "./core/business/service/FilterService";
import { AxiosHttpService } from "./core/business/service/AxiosHttpService";
import { HttpService } from "./core/business/service/HttpService";
import { DeckRandomizationService } from "./core/business/service/DeckRandomizationService";
import { DeckUriEncodingService } from "./core/business/service/DeckUriEncodingService";
import { DeckFileService } from "./core/business/service/DeckFileService";

const container = new Container();

container
    .bind<CardDatabase>(TYPES.CardDatabase)
    .to(MemoryCardDatabase)
    .inSingletonScope();

container
    .bind<CardDataLoaderService>(TYPES.CardDataLoaderService)
    .to(YgoprodeckCardDataLoaderService);
container.bind<CardService>(TYPES.CardService).to(CardService);

container
    .bind<DeckExportService>(TYPES.DeckExportService)
    .to(DeckExportService);
container
    .bind<DeckUriEncodingService>(TYPES.DeckUriEncodingService)
    .to(DeckUriEncodingService);
container.bind<DeckFileService>(TYPES.DeckFileService).to(DeckFileService);
container
    .bind<DeckRandomizationService>(TYPES.DeckRandomizationService)
    .to(DeckRandomizationService);
container.bind<DeckService>(TYPES.DeckService).to(DeckService);

container.bind<PriceService>(TYPES.PriceService).to(PriceService);
container.bind<SortingService>(TYPES.SortingService).to(SortingService);
container.bind<FilterService>(TYPES.FilterService).to(FilterService);

container.bind<HttpService>(TYPES.HttpService).to(AxiosHttpService);

export { container };
