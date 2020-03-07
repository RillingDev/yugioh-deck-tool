import { Container } from "inversify";
import { TYPES } from "./types";
import { YgoprodeckApiService } from "./api/YgoprodeckApiService";
import { CompressionService } from "./core/business/CompressionService";
import { MemoryCardDatabase } from "./core/business/MemoryCardDatabase";
import { CardService } from "./core/business/CardService";
import { PriceService } from "./core/business/PriceService";
import { DeckImportExportService } from "./core/business/DeckImportExportService";
import { DeckService } from "./core/business/DeckService";
import { EncodingService } from "./core/business/EncodingService";
import { SortingService } from "./core/business/SortingService";
const container = new Container();
container
    .bind(TYPES.CardDataLoaderService)
    .to(YgoprodeckApiService);
container.bind(TYPES.CardService).to(CardService);
container
    .bind(TYPES.DeckImportExportService)
    .to(DeckImportExportService);
container.bind(TYPES.DeckService).to(DeckService);
container.bind(TYPES.PriceService).to(PriceService);
container.bind(TYPES.SortingService).to(SortingService);
container
    .bind(TYPES.CompressionService)
    .to(CompressionService);
container.bind(TYPES.EncodingService).to(EncodingService);
container
    .bind(TYPES.CardDatabase)
    .to(MemoryCardDatabase)
    .inSingletonScope();
export { container };
