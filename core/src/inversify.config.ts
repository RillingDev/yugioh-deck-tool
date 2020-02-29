import { Container } from "inversify";
import { TYPES } from "./types";
import { CardDataLoaderService } from "./core/business/CardDataLoaderService";
import { YgoprodeckApiService } from "./api/YgoprodeckApiService";
import { CompressionService } from "./core/business/CompressionService";
import { CardDatabase } from "./core/business/CardDatabase";
import MemoryCardDatabase from "./core/business/MemoryCardDatabase";
import { CardService } from "./core/business/CardService";

const container = new Container();
container
    .bind<CardDataLoaderService>(TYPES.CardDataLoaderService)
    .to(YgoprodeckApiService);
container.bind<CardDatabase>(TYPES.CardDatabase).to(MemoryCardDatabase);
container.bind<CardService>(TYPES.CardService).to(CardService);
container
    .bind<CompressionService>(TYPES.CompressionService)
    .to(CompressionService);

export { container };