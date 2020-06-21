import { Container } from "inversify";
import { TYPES } from "./types";
import { CardDataLoaderService } from "./core/card/CardDataLoaderService";
import { YgoprodeckCardDataLoaderService } from "./api/ygoprodeck/YgoprodeckCardDataLoaderService";
import { CardDatabase } from "./core/card/CardDatabase";
import { MemoryCardDatabase } from "./core/card/MemoryCardDatabase";
import { CardService } from "./core/card/CardService";
import { PriceService } from "./core/price/PriceService";
import { DeckExportService } from "./core/deck/DeckExportService";
import { DeckService } from "./core/deck/DeckService";
import { SortingService } from "./core/card/SortingService";
import { FilterService } from "./core/card/FilterService";
import { AxiosHttpService } from "./core/http/AxiosHttpService";
import { HttpService } from "./core/http/HttpService";
import { DeckRandomizationService } from "./core/deck/DeckRandomizationService";
import { DeckUriEncodingService } from "./core/deck/DeckUriEncodingService";
import { DeckFileService } from "./core/deck/DeckFileService";
import { UrlService } from "./core/http/UrlService";
import { CardLinkingService } from "./core/card/CardLinkingService";
import { BanlistService } from "./core/card/banlist/BanlistService";

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
    .bind<CardLinkingService>(TYPES.CardLinkingService)
    .to(CardLinkingService);

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

container.bind<BanlistService>(TYPES.BanlistService).to(BanlistService);
container.bind<PriceService>(TYPES.PriceService).to(PriceService);
container.bind<SortingService>(TYPES.SortingService).to(SortingService);
container.bind<FilterService>(TYPES.FilterService).to(FilterService);

container.bind<HttpService>(TYPES.HttpService).to(AxiosHttpService);
container.bind<UrlService>(TYPES.UrlService).to(UrlService);

export { container };
