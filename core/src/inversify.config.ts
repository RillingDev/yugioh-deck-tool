import { Container } from "inversify";
import { TYPES } from "./types";
import { CardDataLoaderService } from "./core/business/service/CardDataLoaderService";
import { YgoprodeckCardDataLoaderService } from "./api/YgoprodeckCardDataLoaderService";
import { CompressionService } from "./core/business/service/CompressionService";
import { CardDatabase } from "./core/business/CardDatabase";
import { MemoryCardDatabase } from "./core/business/MemoryCardDatabase";
import { CardService } from "./core/business/service/CardService";
import { PriceService } from "./core/business/service/PriceService";
import { DeckImportExportService } from "./core/business/service/DeckImportExportService";
import { DeckService } from "./core/business/service/DeckService";
import { EncodingService } from "./core/business/service/EncodingService";
import { SortingService } from "./core/business/service/SortingService";
import { FilterService } from "./core/business/service/FilterService";
import { AxiosHttpService } from "./core/business/service/AxiosHttpService";
import { HttpService } from "./core/business/service/HttpService";

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
    .bind<DeckImportExportService>(TYPES.DeckImportExportService)
    .to(DeckImportExportService);
container.bind<DeckService>(TYPES.DeckService).to(DeckService);
container.bind<PriceService>(TYPES.PriceService).to(PriceService);
container.bind<SortingService>(TYPES.SortingService).to(SortingService);
container.bind<FilterService>(TYPES.FilterService).to(FilterService);
container
    .bind<CompressionService>(TYPES.CompressionService)
    .to(CompressionService);
container.bind<EncodingService>(TYPES.EncodingService).to(EncodingService);
container.bind<HttpService>(TYPES.HttpService).to(AxiosHttpService);

export { container };
