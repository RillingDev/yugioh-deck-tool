import { Container } from "inversify";
import { TYPES } from "./types";
import { CardDataLoaderService } from "./core/business/CardDataLoaderService";
import { YgoprodeckApiService } from "./api/YgoprodeckApiService";
import { CompressionService } from "./core/business/CompressionService";
import { CardDatabase } from "./core/business/CardDatabase";
import { MemoryCardDatabase } from "./core/business/MemoryCardDatabase";
import { CardService } from "./core/business/CardService";
import { PriceService } from "./core/business/PriceService";

const container = new Container();
container
    .bind<CardDataLoaderService>(TYPES.CardDataLoaderService)
    .to(YgoprodeckApiService);
container.bind<CardService>(TYPES.CardService).to(CardService);
container.bind<PriceService>(TYPES.PriceService).to(PriceService);
container
    .bind<CompressionService>(TYPES.CompressionService)
    .to(CompressionService);

container
    .bind<CardDatabase>(TYPES.CardDatabase)
    .to(MemoryCardDatabase)
    .inSingletonScope();

export { container };
